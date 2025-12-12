import winston from "winston";
import config from "@/config/config";
import path from "node:path";

const __dirname = import.meta.dirname;

const { combine, timestamp, json } = winston.format;

export const logger = winston.createLogger({
	level: config.logLevel,
	format: combine(timestamp(), json()),
	transports: [
		new winston.transports.Console({
			// Log to console
			format: winston.format.combine(winston.format.colorize({ all: true }), winston.format.simple()),
		}),
		new winston.transports.File({
			filename: path.join(__dirname, "./log/api.log"),
			// level: "error", // Write only errors to the file (optional)
		}),
	],
});
export enum LogLevels {
	error = "error",
	warn = "warn",
	info = "info",
	http = "http",
	verbose = "verbose",
	debug = "debug",
	silly = "silly",
}
