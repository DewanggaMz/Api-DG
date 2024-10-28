"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const zod_1 = require("zod");
const response_error_1 = require("../error/response-error");
const errorMiddleware = (err, req, res, next) => {
    if (err instanceof zod_1.ZodError) {
        res.status(400).json({
            errors: `Validation Error : ${JSON.stringify(err)}`,
        });
    }
    else if (err instanceof response_error_1.ResponseError) {
        res.status(err.status).json({
            errors: err.message,
        });
    }
    else {
        res.status(500).json({
            errors: err.message,
        });
    }
};
exports.errorMiddleware = errorMiddleware;
