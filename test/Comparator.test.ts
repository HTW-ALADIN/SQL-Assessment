import { Comparator } from "@/compare_tabular_results/Comparator";
import { levenshtein } from "@/Util/stringDistanceMetrics";
import { describe, expect, it } from "vitest";

describe("Comparator", () => {
	it("should handle empty input tables", () => {
		const comparator = new Comparator(levenshtein);
		const table: unknown[] = [];

		const isWithinThreshold = comparator.areResultSetsEquivalent(table, table, {
			threshold: 0,
			comparisonStrategy: "levenshtein",
			excludeColumnNames: false,
		});

		expect(isWithinThreshold).toBe(true);
	});

	it("should find distance of 0 between the same table", () => {
		const comparator = new Comparator(levenshtein);

		const table = [
			{ PROZ_ARB: 50, PNR: 7, ANGNR: 336 },
			{ PROZ_ARB: 2, PNR: 50, ANGNR: 27 },
			{ PROZ_ARB: 100, PNR: 21, ANGNR: 397 },
			{ PROZ_ARB: 3, PNR: 43, ANGNR: 341 },
			{ PROZ_ARB: 5, PNR: 22, ANGNR: 170 },
		];

		const isWithinThreshold = comparator.areResultSetsEquivalent(table, table, {
			threshold: 0,
			comparisonStrategy: "levenshtein",
			excludeColumnNames: false,
		});

		expect(isWithinThreshold).toBe(true);
	});

	it("should find distance of 0 between same table with different keys", () => {
		const comparator = new Comparator(levenshtein);

		const table = [
			{ PROZ_ARB: 50, PNR: 7, ANGNR: 336 },
			{ PROZ_ARB: 2, PNR: 50, ANGNR: 27 },
			{ PROZ_ARB: 100, PNR: 21, ANGNR: 397 },
			{ PROZ_ARB: 3, PNR: 43, ANGNR: 341 },
			{ PROZ_ARB: 5, PNR: 22, ANGNR: 170 },
		];

		const tableWithDifferentKeys = [
			{ FOO: 50, BAR: 7, BAZ: 336 },
			{ FOO: 2, BAR: 50, BAZ: 27 },
			{ FOO: 100, BAR: 21, BAZ: 397 },
			{ FOO: 3, BAR: 43, BAZ: 341 },
			{ FOO: 5, BAR: 22, BAZ: 170 },
		];

		const isWithinThreshold = comparator.areResultSetsEquivalent(table, tableWithDifferentKeys, {
			threshold: 0,
			comparisonStrategy: "levenshtein",
			excludeColumnNames: true,
		});

		expect(isWithinThreshold).toBe(true);
	});

	it("should return false if distance threshold is overstepped", () => {
		const comparator = new Comparator(levenshtein);

		const table = [
			{ PROZ_ARB: 50, PNR: 7, ANGNR: 336 },
			{ PROZ_ARB: 2, PNR: 50, ANGNR: 27 },
			{ PROZ_ARB: 100, PNR: 21, ANGNR: 397 },
			{ PROZ_ARB: 3, PNR: 43, ANGNR: 341 },
			{ PROZ_ARB: 5, PNR: 22, ANGNR: 170 },
		];

		const tableWithDifferentKeys = [
			{ FOO: 50, BAR: 7, BAZ: 336 },
			{ FOO: 2, BAR: 50, BAZ: 27 },
			{ FOO: 100, BAR: 21, BAZ: 397 },
			{ FOO: 3, BAR: 43, BAZ: 341 },
			{ FOO: 5, BAR: 22, BAZ: 170 },
		];

		const isWithinThreshold = comparator.areResultSetsEquivalent(table, tableWithDifferentKeys, {
			threshold: 4,
			comparisonStrategy: "levenshtein",
			excludeColumnNames: false,
		});

		expect(isWithinThreshold).toBe(false);
	});
});
