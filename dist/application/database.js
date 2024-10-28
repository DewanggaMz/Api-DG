"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaClient = void 0;
const client_1 = require("@prisma/client");
const logger_1 = require("./logger");
exports.prismaClient = new client_1.PrismaClient({
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
});
exports.prismaClient.$on("query", (e) => {
    logger_1.logger.info(`Query: ${e}`);
});
exports.prismaClient.$on("info", (e) => {
    logger_1.logger.info(`Info: ${e.message}`);
});
exports.prismaClient.$on("error", (e) => {
    logger_1.logger.error(`Error: ${e.message}`);
});
exports.prismaClient.$on("warn", (e) => {
    logger_1.logger.warn(`Warn: ${e.message}`);
});
