import express from "express"
import { accessMiddleware } from "../middleware/acess.middleware"
import { AuthController } from "../controllers/auth.controller"
import { authMiddleware } from "../middleware/auth.middleware"
import {
	UserAdminController,
	UserController,
} from "../controllers/user.controller"

export const authRouter = express.Router()

authRouter.get("/api/user", accessMiddleware, UserController.getUser)
authRouter.post("/api/user/logout", accessMiddleware, UserController.logout)
authRouter.get("/api/refresh", AuthController.refreshAccessToken) //butuh access midleware terlebih dahulu

authRouter.post("/api/otp", authMiddleware, AuthController.sendOTP)

authRouter.get("/api/users", UserAdminController.getAllUsers)
