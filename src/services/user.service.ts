import { prismaClient } from "../application/database"
import { ResponseError } from "../error/response-error"
import {
	CreateUserRequest,
	LoginUserRequest,
	toUserResponse,
	UserResponse,
} from "../model/user.model"
import { RequestIdToken } from "../types"
import { Utils } from "../utils/utils"
import { UserValidation } from "../validation/user.validation"
import { Validation } from "../validation/validation"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import parser from "ua-parser-js"

export class UserService {
	static async register(request: CreateUserRequest): Promise<UserResponse> {
		const registerRequest = Validation.validate(
			UserValidation.REGISTER,
			request
		)

		if (registerRequest.phoneNumber && registerRequest.countryCode) {
			const phoneNumber = Validation.validatePhoneNumber(
				registerRequest.phoneNumber,
				registerRequest.countryCode
			)
			registerRequest.phoneNumber = phoneNumber
		}

		const totalUserWithSameEmail = await prismaClient.user.count({
			where: {
				email: registerRequest.email,
			},
		})

		if (totalUserWithSameEmail != 0) {
			throw new ResponseError(400, "Email already in use")
		}

		registerRequest.password = await bcrypt.hash(registerRequest.password, 10)

		const user = await prismaClient.user.create({
			data: {
				username: registerRequest.username,
				fullname: registerRequest.fullName,
				phone: registerRequest.phoneNumber,
				email: registerRequest.email,
				password: registerRequest.password,
			},
			select: {
				id: true,
			},
		})

		const authorizationToken = Utils.generateAuthorizationToken(
			{
				id: user.id,
				type: "auth",
			},
			"2m"
		)

		return toUserResponse({ id: user.id, token: authorizationToken })
	}

	static async login(request: LoginUserRequest): Promise<UserResponse> {
		const loginRequest = Validation.validate(UserValidation.LOGIN, request.body)

		const user = await prismaClient.user.findUnique({
			where: {
				email: loginRequest.email,
			},
		})

		if (!user) {
			throw new ResponseError(400, "email or password wrong")
		}

		const isPasswordMatch = await bcrypt.compare(
			loginRequest.password,
			user.password
		)

		if (!isPasswordMatch) {
			throw new ResponseError(400, "email or password wrong")
		}

		if (!user.verified) {
			const authorizationToken = Utils.generateAuthorizationToken(
				{
					id: user.id,
					type: "auth",
				},
				"2m"
			)

			return { token: authorizationToken }
		}

		const acessToken = Utils.generateAccessToken({ id: user.id }, "2m")
		const expiresIn = loginRequest.remember ? 30 : 7
		const token = Utils.generateToken()
		const refreshToken = Utils.generateRefreshToken(
			{ token: token },
			`${expiresIn}d`
		)

		const userAgent = Utils.userAgent(request)
		console.log(userAgent)
		await prismaClient.refreshToken.create({
			data: {
				userId: user.id,
				token: token,
				userAgent: userAgent,
				expiresIn: new Date(Date.now() + 1000 * 60 * 60 * 24 * expiresIn),
				isActive: true,
			},
		})

		return {
			id: user.id,
			accessToken: acessToken,
			refreshToken: refreshToken,
		}
	}

	static async logout(req: any) {
		const refreshToken = req.cookies.refreshToken
		await prismaClient.refreshToken.deleteMany({
			where: {
				token: refreshToken,
			},
		})

		return {
			id: req.id,
			message: "Logout successfully",
		}
	}

	static async getUser(req: RequestIdToken) {
		return await prismaClient.user.findUnique({
			where: {
				id: req.id,
			},
			select: {
				id: true,
				username: true,
				fullname: true,
				phone: true,
				email: true,
				isActive: true,
				balance: true,
				createdAt: true,
			},
		})
	}
}
