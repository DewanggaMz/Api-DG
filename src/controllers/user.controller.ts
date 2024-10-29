import { NextFunction, Request, Response } from "express"
import { CreateUserRequest, LoginUserRequest } from "../model/user.model"
import { UserService, UserAdminService } from "../services/user.service"
import { ResponseError } from "../error/response-error"
import { prismaClient } from "../application/database"
import { RequestIdToken } from "../types"

export class UserController {
	static async register(req: Request, res: Response, next: NextFunction) {
		try {
			const request: CreateUserRequest = req.body as CreateUserRequest
			const response = await UserService.register(request)
			res.status(201).json({
				data: response,
			})
		} catch (err) {
			next(err)
		}
	}

	static async login(req: any, res: Response, next: NextFunction) {
		try {
			const response = await UserService.login(req)

			if (response.refreshToken && response.accessToken) {
				res.cookie("refreshToken", response.refreshToken, {
					httpOnly: true,
					sameSite: "lax",
					secure: false,
					priority: "high",
					maxAge: 1000 * 60 * 60 * 24 * 7,
				})
			}

			res.status(200).json({
				data: {
					id: response?.id,
					accessToken: response?.accessToken,
					token: response?.token,
				},
			})
		} catch (err) {
			next(err)
		}
	}

	static async logout(req: Request, res: Response, next: NextFunction) {
		try {
			const response = await UserService.logout(req)
			res.clearCookie("refreshToken")
			const refreshToken = req.cookies.refreshToken

			if (!refreshToken) {
				console.log("null")
			}

			res.status(200).json({
				data: response,
			})
		} catch (err: any) {
			// if (err.code === "P2002") {
			// 	// throw new Error("User ID sudah memiliki refresh token yang aktif.")
			// 	console.log("User ID sudah memiliki refresh token yang aktif.")
			// }
			console.log(err)

			next(err)
		}
	}

	static async getUser(req: RequestIdToken, res: Response, next: NextFunction) {
		try {
			const response = await UserService.getUser(req)
			res.status(200).json({
				data: response,
			})
		} catch (err) {
			next(err)
		}
	}
}

export class UserAdminController {
	static async getAllUsers(
		req: RequestIdToken,
		res: Response,
		next: NextFunction
	) {
		try {
			const response = await UserAdminService.getAllUsers(req)
			res.status(200).json({
				data: response,
			})
		} catch (err) {
			next(err)
		}
	}
}
