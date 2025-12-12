import { spawn } from "node:child_process";
import { join } from "node:path";
import { build, context } from "esbuild";
import { esbuildVersion } from "vitest/node";

const buildOptions = {
	entryPoints: ["./src/sql_executor/Executor.ts", "./src/compare_tabular_results/Comparator.ts"],
	bundle: true,
	outdir: "dist",
	format: "esm",
	platform: "node",
	target: "node22",
	sourcemap: true,
	plugins: [],
};

await build(buildOptions);