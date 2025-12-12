import { Client, ClientConfig } from "pg";
import config from "@/config/config";
import { logger, LogLevels } from "./logger";

export const createClient = (
	options: ClientConfig = {
		host: config.postgresHost,
		port: config.postgresPort,
		user: config.postgresUser,
		password: config.postgresPassword,
		database: config.postgresDb,
	}
) => {
	try {
		const client = new Client(options);
		return client;
	} catch (error) {
		logger.log(LogLevels.error, error);
	}
};

const client = createClient();

export { client };
