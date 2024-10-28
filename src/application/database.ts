import { PrismaClient } from "@prisma/client"
import { logger } from "./logger"

export const prismaClient = new PrismaClient({
	log: [
		{
			emit: "event",
			level: "query",
		},
		{
			emit: "event",
			level: "info",
		},
		{
			emit: "event",
			level: "error",
		},
		{
			emit: "event",
			level: "warn",
		},
	],
})

prismaClient.$on("query", (e) => {
	logger.info(`Query: ${e}`)
})

prismaClient.$on("info", (e) => {
	logger.info(`Info: ${e.message}`)
})

prismaClient.$on("error", (e) => {
	logger.error(`Error: ${e.message}`)
})

prismaClient.$on("warn", (e) => {
	logger.warn(`Warn: ${e.message}`)
})
