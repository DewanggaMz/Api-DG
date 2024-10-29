import { prismaClient } from "../application/database"
import { ResponseError } from "../error/response-error"
import jwt from "jsonwebtoken"
import { Utils } from "../utils/utils"

export class AuthService {
	static async refreshToken(req: any) {
		const refreshToken = req.cookies.refreshToken
		// console.log(refreshToken)
		if (!refreshToken) {
			throw new ResponseError(401, "Unauthorized")
		}

		const RequestRefreshToken = jwt.verify(
			refreshToken,
			process.env.REFRESH_SECRET_KEY as string,
			(err: any, decoded: any) => {
				if (err) {
					throw new ResponseError(401, "Unauthorized")
				}
				return Utils.normalizeToken(decoded.token)
			}
		)

		const userRefreshToken = await prismaClient.refreshToken.findUnique({
			where: {
				token: String(RequestRefreshToken),
			},
		})

		if (!userRefreshToken || !userRefreshToken.isActive) {
			throw new ResponseError(401, "Unauthorized")
		}

		const accessToken = Utils.generateAccessToken(
			{
				id: userRefreshToken.userId,
			},
			"1h"
		)

		return {
			accessToken: accessToken,
		}
	}

	static async csrfToken(req: any) {
		const csrfToken = Utils.generateToken()

		await prismaClient.csrfToken.create({
			data: {
				token: csrfToken,
				expiresIn: new Date(Date.now() + 60 * 1000),
			},
		})

		return {
			CToken: csrfToken,
		}
	}

	static async sendOTP(req: any) {
		const userRequestId = req.id

		const otp = Utils.generateOTP()

		await prismaClient.otp.create({
			data: {
				userId: userRequestId,
				otp: otp,
				expiresIn: new Date(Date.now() + 60 * 1000),
			},
		})

		return { message: "success" }
	}

	static async verifyOtp(req: any) {}
}
