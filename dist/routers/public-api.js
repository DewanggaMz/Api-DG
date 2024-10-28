"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicRouter = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
exports.publicRouter = express_1.default.Router();
exports.publicRouter.post("/api/users", user_controller_1.UserController.register);
exports.publicRouter.get("/", (req, res) => {
    var _a;
    // Mendapatkan IP address dengan fallback yang lebih aman
    const ip = req.headers["x-forwarded-for"] || ((_a = req.socket) === null || _a === void 0 ? void 0 : _a.remoteAddress);
    res.send(`IP Address Anda: ${ip}`);
});
