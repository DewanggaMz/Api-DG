"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const public_api_1 = require("../routers/public-api");
const error_middleware_1 = require("../middleware/error.middleware");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.set("trust proxy", true);
exports.app.use(express_1.default.json());
exports.app.use((0, cors_1.default)());
exports.app.use(public_api_1.publicRouter);
exports.app.use(error_middleware_1.errorMiddleware);
exports.app.listen(4000, () => console.log("Server running on port 3000"));
