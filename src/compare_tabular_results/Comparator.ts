import { Instruction, TableFormat } from "@/SharedTypes";
import { logger, LogLevels } from "@/Util/logger";
import { DistanceMetric, levenshtein } from "@/Util/stringDistanceMetrics";

export const ComparisonStrategies = {
	levenshtein: levenshtein,
} as const;

export type ComparisonStrategyType = keyof typeof ComparisonStrategies;

export interface ComparisonOptions {
	excludeColumnNames: boolean;
	threshold: number;
	comparisonStrategy: ComparisonStrategyType;
}

export interface ComparisonInstruction extends Instruction {
	args: {
		referenceResult: TableFormat;
		studentResult: TableFormat;
	};
	options?: ComparisonOptions;
}

export type ComparisonResult = boolean;

export type Tuple<A, B = A> = [A, B];

export type TableTuple = Tuple<TableFormat>;

export class Comparator {
	constructor(private distanceMetric: DistanceMetric) {}

	private removeColumnNamesInTable(t: TableFormat) {
		return t.map((r) => Object.values(r));
	}

	private removeColumnNamesInTables(a: TableFormat, b: TableFormat): Tuple<object> {
		return [this.removeColumnNamesInTable(a), this.removeColumnNamesInTable(b)];
	}

	private stringifyTables(a: object, b: object): [string, string] {
		return [JSON.stringify(a), JSON.stringify(b)];
	}

	public areResultSetsEquivalent(
		a: TableFormat,
		b: TableFormat,
		comparisonOptions: ComparisonOptions = {
			excludeColumnNames: true,
			threshold: 0,
			comparisonStrategy: "levenshtein",
		}
	): ComparisonResult {
		const { excludeColumnNames, threshold } = comparisonOptions;
		let tables: Tuple<object> = [a, b];

		if (excludeColumnNames) {
			tables = this.removeColumnNamesInTables(...(tables as TableTuple));
		}

		const distance = this.distanceMetric(...this.stringifyTables(...tables));

		return distance <= threshold;
	}
}

/* v8 ignore next -- @preserve */
if (process.argv[1] === import.meta.filename) {
	const instruction = process.argv[2];
	if (instruction) {
		let result = null;

		try {
			const { args, options } = JSON.parse(instruction) as ComparisonInstruction;
			const { referenceResult, studentResult } = args;
			const comparisonStrategyType = (options?.comparisonStrategy as ComparisonStrategyType) ?? "levenshtein";
			const comparisonStrategy = ComparisonStrategies[comparisonStrategyType];
			const comparator = new Comparator(comparisonStrategy);
			if (options) {
				result = comparator.areResultSetsEquivalent(referenceResult, studentResult, options);
			} else {
				result = comparator.areResultSetsEquivalent(referenceResult, studentResult);
			}
		} catch (error) {
			logger.log(LogLevels.error, error);
			process.exit(0);
		}
		process.stdout.write(JSON.stringify(result));
		process.exit(1);
	}
}
