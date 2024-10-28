import { NextFunction, Request, Response } from "express"
import { ResponseError } from "../error/response-error"
import { prismaClient } from "../application/database"
import jwt from "jsonwebtoken"

export const crfsTokenMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const requestCSRFToken = req.get("x-token")
		if (!requestCSRFToken) {
			throw new ResponseError(401, "Unauthorized")
		}

		const token = jwt.verify(
			requestCSRFToken,
			process.env.JWT_SECRET_KEY as string
		)

		console.log(token)

		// const { count } = await prismaClient.csrfToken.deleteMany({
		// 	where: {
		// 		token: requestCSRFToken,
		// 	},
		// })

		// if (!(count > 0)) {
		// 	throw new ResponseError(401, "Unauthorized")
		// }

		next()
	} catch (error) {
		next(error)
	}
}
