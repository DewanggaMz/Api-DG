import { User } from "@prisma/client"
import { Request } from "express"

export type UserResponse = {
	id?: number
	accessToken?: string
	refreshToken?: string
	token?: string
}

export type CreateUserRequest = {
	username: string
	fullName: string
	email: string
	phoneNumber?: string
	countryCode?: string
	password: string
	confirmPassword: string
	isAdmin?: boolean
	token: string
}

export interface LoginUserRequest extends Request {
	email: string
	password: string
	remember: boolean
	token: string
}

export function toUserResponse(user: {
	id?: number
	token?: string
	refreshToken?: string
	accessToken?: string
}): UserResponse {
	return {
		id: user.id,
		token: user.token,
	}
}
