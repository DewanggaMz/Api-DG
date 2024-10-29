import { NextFunction, Request, Response } from "express"
import { ResponseError } from "../error/response-error"
import { prismaClient } from "../application/database"
import jwt from "jsonwebtoken"
import { Validation } from "../validation/validation"
import { UserValidation } from "../validation/user.validation"

export const crfsTokenMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const UserRequest = Validation.validate(UserValidation.LOGIN, req.body)
		const token = UserRequest.token
		if (!token) {
			throw new ResponseError(401, "Unauthorized")
		}

		const csrfToken = await prismaClient.csrfToken.findUnique({
			where: {
				token: token,
			},
		})
		if (!csrfToken) {
			throw new ResponseError(401, "Unauthorized")
		}
		if (csrfToken.expiresIn < new Date()) {
			await prismaClient.csrfToken.delete({
				where: {
					token: token,
				},
			})
			throw new ResponseError(401, "Unauthorized")
		}

		await prismaClient.csrfToken.delete({
			where: {
				token: token,
			},
		})

		next()
	} catch (error) {
		next(error)
	}
}
