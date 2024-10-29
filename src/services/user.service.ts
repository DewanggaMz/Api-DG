import { prismaClient } from "../application/database"
import { ResponseError } from "../error/response-error"
import {
	CreateUserRequest,
	LoginUserRequest,
	toUserResponse,
	UserAdminQuery,
	UserResponse,
} from "../model/user.model"
import { RequestIdToken } from "../types"
import { Utils } from "../utils/utils"
import {
	UserValidation,
	UserAdminValidation,
} from "../validation/user.validation"
import { Validation } from "../validation/validation"
import bcrypt from "bcrypt"

export class UserService {
	static async register(request: CreateUserRequest): Promise<UserResponse> {
		const registerRequest = Validation.validate(
			UserValidation.REGISTER,
			request
		)

		if (registerRequest.phoneNumber) {
			registerRequest.phoneNumber = Validation.validatePhoneNumber(
				registerRequest.phoneNumber
			)
		}

		const isEmailTaken = await prismaClient.user.count({
			where: { email: registerRequest.email },
		})

		if (isEmailTaken) {
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
			select: { id: true },
		})

		const authorizationToken = Utils.generateAuthorizationToken(
			{ id: user.id, type: "auth" },
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

		const expiresIn = loginRequest.remember ? 30 : 7
		const { token, tokenPrefix } = Utils.generateTokenWithPrefix(40)
		const userAgent = Utils.userAgent(request)

		const acessToken = Utils.generateAccessToken({ id: user.id }, "2m")

		const refreshToken = Utils.generateRefreshToken(
			{ token: tokenPrefix },
			`${expiresIn}d`
		)

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

export class UserAdminService {
	static async getAllUsers(req: any) {
		const userRequest = Validation.validate(
			UserAdminValidation.USERSQUERY,
			req.query
		)
		console.log(req.query)
		console.log(userRequest)
		const searchQuery: any = {}
		if (userRequest.start_id) {
			searchQuery.id = { gte: userRequest.start_id }
		}

		if (userRequest.is_active !== undefined) {
			searchQuery.isActive = userRequest.is_active === "true" ? true : false
		}

		if (userRequest.search) {
			const searchValue = userRequest.search
			searchQuery.OR = [
				{ phone: { contains: searchValue, mode: "insensitive" } },
				{ email: { contains: searchValue, mode: "insensitive" } },
				{ username: { contains: searchValue, mode: "insensitive" } },
				{ fullname: { contains: searchValue, mode: "insensitive" } },
			]
		}

		const orderBy: any[] = []
		if (userRequest.sort_by) {
			const sortFields = userRequest.sort_by.split(",")
			sortFields.forEach((field: string) => {
				const [key, order] = field.split(":")
				orderBy.push({ [key]: order || "asc" })
			})
		}

		console.log(orderBy)

		const users = await prismaClient.user.findMany({
			where: searchQuery,
			skip: userRequest.page * userRequest.limit - userRequest.limit,
			take: userRequest.limit,
			orderBy: orderBy,
			select: {
				id: true,
				username: true,
				fullname: true,
				phone: true,
				email: true,
				isActive: true,
				verified: true,
				balance: true,
				createdAt: true,
			},
		})
		return users
	}
}
