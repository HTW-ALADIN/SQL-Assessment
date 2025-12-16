import { client } from "@/Util/pg_client";
import { Client } from "pg";
import { logger, LogLevels } from "@/Util/logger";
import { TableFormat } from "@/SharedTypes";

export type SQLExecutionResult = TableFormat | string | null;

export class Executor {
	private client: Client;
	constructor() {
		this.client = client as Client;
	}

	public async executeQuery(query: string): Promise<SQLExecutionResult> {
		try {
			await this.client.connect();

			const res = (await this.client.query(query)) ?? null;
			if (res) return res.rows;

			return res;
		} catch (error) {
			if (error instanceof Error) {
				logger.log(LogLevels.error, error);
				return error.message;
			}
			return error as string;
		}
	}
}

/* v8 ignore next -- @preserve */
if (process.argv[1] === import.meta.filename) {
	(async () => {
		const query = process.argv[2];
		if (query) {
			let result = null;
			try {
				const executor = new Executor();
				result = await executor.executeQuery(query);
			} catch (error) {
				logger.log(LogLevels.error, error);
				process.exit(0);
			}
			process.stdout.write(JSON.stringify(result));
			process.exit(1);
		}
	})();
}
