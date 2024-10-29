import { NextFunction, Response } from "express"
import { ResponseError } from "../error/response-error"
import jwt from "jsonwebtoken"
import { RequestIdToken } from "../types"

export const accessMiddleware = async (
	req: RequestIdToken,
	res: Response,
	next: NextFunction
) => {
	try {
		const authToken = req.headers.authorization
		if (!authToken) {
			return next(new ResponseError(401, "Unauthorized"))
		}

		const token = authToken.split(" ")[1]
		jwt.verify(
			token,
			process.env.ACCESS_SECRET_KEY as string,
			(err, decoded: any) => {
				if (err || typeof decoded !== "object" || !("id" in decoded)) {
					return next(new ResponseError(403, "Forbidden"))
				}

				req.id = decoded.id
				next()
			}
		)
	} catch (error) {
		next(error)
	}
}
