import { prismaClient } from "../application/database"
import { ResponseError } from "../error/response-error"
import jwt from "jsonwebtoken"
import { Utils } from "../utils/utils"

export class AuthService {
	static async refreshToken(req: any) {
		const refreshToken = req.cookies.refreshToken
		console.log(refreshToken)
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

				return decoded.token
			}
		)

		const userRefreshToken = await prismaClient.refreshToken.findUnique({
			where: {
				token: String(RequestRefreshToken),
			},
		})

		const tokenrefresh = Utils.generateToken(40)
		const start = Utils.generateToken(2)
		const end = Utils.generateToken(1)

		const combine = `${start}${tokenrefresh}${end}`

		console.log(tokenrefresh)
		console.log("-----------------------------")
		console.log(combine)
		console.log("-----------------------------")
		console.log(combine.substring(4, combine.length - 2))

		// console.log(userRefreshToken)

		if (!userRefreshToken || !userRefreshToken.isActive) {
			throw new ResponseError(401, "Unauthorized")
		}

		// const acessToken = jwt.sign(
		// 	{
		// 		id: "sss",
		// 	},
		// 	process.env.ACCESS_SECRET_KEY as string,
		// 	{
		// 		expiresIn: "2m",
		// 		issuer: "dewangga.com",
		// 		audience: "angga.com",
		// 		jwtid: "angga",
		// 	}
		// )

		// const acessToken = Utils.generateJWT(
		// 	{
		// 		id: "sss",
		// 	},
		// 	" yetyt",
		// 	{
		// 		expiresIn: "2m",
		// 	}
		// )

		// const verif = Utils.verifyToken(
		// 	acessToken,
		// 	process.env.ACCESS_SECRET_KEY as string
		// )

		return {
			accessToken: "skjskj",
			// verif: verif,
		}

		// return {"hjshjh"}
	}

	static async csrfToken(req: any) {
		const csrfToken = Utils.generateToken()

		return {
			csrfToken: csrfToken,
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
