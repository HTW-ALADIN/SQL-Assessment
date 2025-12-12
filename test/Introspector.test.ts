import { describe, expect, it } from "vitest";
import { Introspector } from "@/db_introspection/Introspector";

describe("Introspect the Database", () => {
	it("should return information about tables, foreign- and primary-keys", async () => {
		const introspector = new Introspector();

		const dbMetadata = await introspector.introspectDB();

		expect(dbMetadata).toHaveLength(5);
	});
});
