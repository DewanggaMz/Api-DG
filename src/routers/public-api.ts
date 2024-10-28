import express from "express"
import { UserController } from "../controllers/user.controller"
import { limitter } from "../middleware/limitter.middleware"
import { accessMiddleware } from "../middleware/acess.middleware"
import { AuthController } from "../controllers/auth.controller"
import { Utils } from "../utils/utils"
import { authMiddleware } from "../middleware/auth.middleware"
export const publicRouter = express.Router()

publicRouter.post("/api/user/register", UserController.register)
publicRouter.post("/api/user/login", UserController.login)
publicRouter.get("/api/user", accessMiddleware, UserController.getUser)
publicRouter.post("/api/user/logout", accessMiddleware, UserController.logout)

publicRouter.get("/api/refresh", AuthController.refreshAccessToken) //butuh access midleware terlebih dahulu
publicRouter.post("/api/otp", authMiddleware, AuthController.sendOTP)

publicRouter.get("/test", (req: any, res) => {
	// console.log(Utils.generateCSRFToken())
	console.log(Utils.generateOTP())

	res.status(200).json({
		data: {
			message: "Welcome to our API Test",
		},
	})
})

publicRouter.get("/", limitter, (req, res) => {
	const ip = req.ip
	res.status(200).json({
		data: {
			ip,
			message: "Welcome to our API",
		},
	})
})
