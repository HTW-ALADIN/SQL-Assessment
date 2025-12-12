import { vi } from "vitest";
import { createTestDb } from "./test_utils/pg-mem";

const testDb = createTestDb();

// Mock your app's actual db module *globally*
vi.mock("../src/Util/pg_client", () => {
	const client = testDb.createClient();
	return {
		client, // if your code imports `client`
		// createClient: () => client, // if your app calls a function
	};
});

export function getDb() {
	return testDb;
}
