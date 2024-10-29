import express from "express"
import { UserController } from "../controllers/user.controller"
import { limitter } from "../middleware/limitter.middleware"
import { accessMiddleware } from "../middleware/acess.middleware"
import { AuthController } from "../controllers/auth.controller"
import { Utils } from "../utils/utils"
import { authMiddleware } from "../middleware/auth.middleware"
import { crfsTokenMiddleware } from "../middleware/csrf.middleware"
export const publicRouter = express.Router()

publicRouter.post(
	"/api/user/register",
	crfsTokenMiddleware,
	UserController.register
)
publicRouter.post("/api/user/login", crfsTokenMiddleware, UserController.login)
publicRouter.get("/api/csrf", AuthController.csrfToken)

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
