import { describe, expect, it } from "vitest";
import { Executor } from "@/sql_executor/Executor";

describe("Run test query", () => {
	it("should return 5 rows", async () => {
		const executor = new Executor();

		const res = await executor.executeQuery("SELECT * FROM ang_pro LIMIT 5;");

		expect(res).toHaveLength(5);
	});

	// it("should return null for intelligible syntax", async () => {
	// 	const executor = new Executor();

	// 	const res = await executor.executeQuery("SELECT FooBar * FROM x");

	// 	expect(res).toBe(null);
	// });
});
