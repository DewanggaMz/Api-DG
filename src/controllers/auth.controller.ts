import { NextFunction } from "express"
import { AuthService } from "../services/auth.service"

export class AuthController {
	static async refreshAccessToken(req: any, res: any, next: NextFunction) {
		try {
			const response = await AuthService.refreshToken(req)
			res.status(200).json({
				data: response,
			})
		} catch (err) {
			next(err)
		}
	}

	static async csrfToken(req: any, res: any, next: NextFunction) {
		try {
			const response = await AuthService.csrfToken(req)
			res.status(200).json({
				data: response,
			})
		} catch (err) {
			next(err)
		}
	}

	static async sendOTP(req: any, res: any, next: NextFunction) {
		try {
			const response = await AuthService.sendOTP(req)
			res.status(200).json({
				data: response,
			})
		} catch (err) {
			next(err)
		}
	}
}
