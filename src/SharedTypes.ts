import { QueryResult } from "pg";

export interface Instruction {
	args: Record<string, unknown>;
}

export type TableFormat = QueryResult["rows"];
