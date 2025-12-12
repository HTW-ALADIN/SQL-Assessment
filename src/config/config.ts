import dotenv from "dotenv";

dotenv.config();

interface Config {
	postgresHost: string;
	postgresPort: number;
	postgresUser: string;
	postgresPassword: string;
	postgresDb: string;
	postgresSchema: string;
	logLevel: string;
}

function getRequiredEnv(key: string): string {
	const v = process.env[key];
	if (!v) {
		throw new Error(`Environment variable ${key} is required`);
	}
	return v;
}

const config: Config = {
	postgresHost: getRequiredEnv("POSTGRES_HOST"),
	postgresPort: parseInt(getRequiredEnv("POSTGRES_PORT"), 10),
	postgresUser: getRequiredEnv("POSTGRES_USER"),
	postgresPassword: getRequiredEnv("POSTGRES_PASSWORD"),
	postgresDb: getRequiredEnv("POSTGRES_DB"),
	postgresSchema: process.env.POSTGRES_SCHEMA || "public",
	logLevel: process.env.LOGLEVEL ?? "info",
};

export default config;
