import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [
		tsconfigPaths({
			projects: ["./tsconfig.test.json"],
		}),
	],
	test: {
		globals: true,
		include: ["test/**/*.test.ts"],
		setupFiles: ["./test/setupTestDB.ts"],
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			thresholds: {
				lines: 90,
				functions: 90,
				branches: 90,
				statements: 90,
			},
		},
		typecheck: {
			tsconfig: "./tsconfig.test.json",
		},
	},
});
