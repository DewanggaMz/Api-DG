"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const database_1 = require("../application/database");
const response_error_1 = require("../error/response-error");
const user_model_1 = require("../model/user.model");
const user_validation_1 = require("../validation/user.validation");
const validation_1 = require("../validation/validation");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UserService {
    static register(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const registerRequest = validation_1.Validation.validate(user_validation_1.UserValidation.REGISTER, request);
            const totalUserWithSameEmail = yield database_1.prismaClient.user.count({
                where: {
                    email: registerRequest.email,
                },
            });
            if (totalUserWithSameEmail != 0) {
                throw new response_error_1.ResponseError(400, "Email already in use");
            }
            // if (registerRequest.password != registerRequest.confirmPassword) {
            // 	throw new ResponseError(400, "Password does not match")
            // }
            registerRequest.password = yield bcrypt_1.default.hash(registerRequest.password, 10);
            const user = yield database_1.prismaClient.user.create({
                data: {
                    username: registerRequest.username,
                    email: registerRequest.email,
                    password: registerRequest.password,
                },
            });
            return (0, user_model_1.toUserResponse)(user);
        });
    }
    static login(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const loginRequest = validation_1.Validation.validate(user_validation_1.UserValidation.LOGIN, request);
            const user = yield database_1.prismaClient.user.findUnique({
                where: {
                    email: loginRequest.email,
                },
            });
            if (!user) {
                throw new response_error_1.ResponseError(400, "email or password wrong");
            }
            const isPasswordMatch = yield bcrypt_1.default.compare(loginRequest.password, user.password);
            if (!isPasswordMatch) {
                throw new response_error_1.ResponseError(400, "email or password wrong");
            }
            const acessToken = jsonwebtoken_1.default.sign({
                userId: user.id,
                username: user.username,
            }, process.env.ACESS_SECRET_KEY, {
                expiresIn: "1h",
            });
            const refreshToken = jsonwebtoken_1.default.sign({
                userId: user.id,
            }, process.env.REFRESH_SECRET_KEY, {
                expiresIn: "7d",
            });
            return {
                id: user.id,
                accessToken: acessToken,
                refreshToken: refreshToken,
            };
        });
    }
}
exports.UserService = UserService;
