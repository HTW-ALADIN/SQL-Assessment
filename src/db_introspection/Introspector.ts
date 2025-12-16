import config from "@/config/config";
import { TableFormat } from "@/SharedTypes";
import { logger, LogLevels } from "@/Util/logger";
import { resolveTemplateString } from "@/Util/naiveStringTemplates";
import { client } from "@/Util/pg_client";
import { Client } from "pg";

export interface IntrospectionQueries {
	tables: string;
	foreignKeys: string;
	primaryKeys: string;
}

export type IntrospectionResult = {
	tables: TableFormat;
	foreignKeys: TableFormat;
	primaryKeys: TableFormat;
};

export class Introspector {
	private pgIntrospectionQueries: IntrospectionQueries = {
		tables: `SELECT columns.table_name,
                    columns.column_name,
                    columns.data_type
            FROM information_schema.columns
            WHERE table_name in 
                    (SELECT tables.table_name
                    FROM information_schema.tables
                    WHERE tables.table_schema = '\${schema}' 
                        AND tables.table_name != 'schema_version' 
                        AND tables.table_type = 'BASE TABLE');`,
		foreignKeys: `SELECT m.relname AS source_table,
                        (SELECT a.attname FROM pg_attribute a 
                            WHERE a.attrelid = m.oid
                                AND a.attnum = o.conkey[1] 
                                AND a.attisdropped = false) 
                            AS source_column,
                        f.relname AS target_table,
                        (SELECT a.attname 
                            FROM pg_attribute a 
                            WHERE a.attrelid = f.oid 
                                AND a.attnum = o.confkey[1] 
                                AND a.attisdropped = false) 
                            AS target_column
                FROM pg_constraint o 
                    LEFT JOIN pg_class f ON f.oid = o.confrelid 
                    LEFT JOIN pg_class m ON m.oid = o.conrelid
                WHERE o.contype = 'f' 
                    AND o.conrelid IN (SELECT oid FROM pg_class c WHERE c.relkind = 'r')
                    AND o.connamespace::regnamespace::text = '\${schema}';`,
		primaryKeys: `SELECT kcu.table_schema,
                        kcu.table_name,
                        tco.constraint_name,
                        kcu.ordinal_position as position,
                        kcu.column_name as key_column
                  FROM information_schema.table_constraints tco
                  JOIN information_schema.key_column_usage kcu 
                        ON kcu.constraint_name = tco.constraint_name
                        AND kcu.constraint_schema = tco.constraint_schema
                        AND kcu.constraint_name = tco.constraint_name
                  WHERE tco.constraint_type = 'PRIMARY KEY'
                        AND kcu.table_schema = '\${schema}'
                  ORDER BY kcu.table_schema, kcu.table_name, position;`,
	};

	private client: Client;
	constructor() {
		this.client = client as Client;
		this.prepareIntrospectionQueries();
	}

	private prepareIntrospectionQueries() {
		const schema = config.postgresSchema;
		this.pgIntrospectionQueries = Object.entries(this.pgIntrospectionQueries).reduce(
			(substitutedQueries, [key, query]) => {
				substitutedQueries[key as keyof IntrospectionQueries] = resolveTemplateString(query as string, { schema });
				return substitutedQueries;
			},
			{} as IntrospectionQueries
		);
	}

	public async introspectDB() {
		try {
			return {
				tables: await this.client.query(this.pgIntrospectionQueries.tables),
				foreignKeys: await this.client.query(this.pgIntrospectionQueries.foreignKeys),
				primaryKeys: await this.client.query(this.pgIntrospectionQueries.primaryKeys),
			};
		} catch (error) {
			if (error instanceof Error) {
				process.stdout.write(error.message);
			}
			logger.log(LogLevels.error, error);
		}
	}
}

/* v8 ignore next -- @preserve */
if (process.argv[1] === import.meta.filename) {
	(async () => {
		let result = null;
		try {
			const introspector = new Introspector();
			result = await introspector.introspectDB();
		} catch (error) {
			logger.log(LogLevels.error, error);
			process.exit(0);
		}
		process.stdout.write(JSON.stringify(result));
		process.exit(1);
	})();
}
