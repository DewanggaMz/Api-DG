import { NextFunction, Request, Response } from "express"
import { ResponseError } from "../error/response-error"
import jwt from "jsonwebtoken"

interface RequestType extends Request {
	id?: number
}

export const authMiddleware = async (
	req: any,
	res: Response,
	next: NextFunction
) => {
	try {
		const authToken = req.headers.authorization
		if (!authToken) {
			throw new ResponseError(401, "Unauthorized")
		}
		const token = authToken.split(" ")[1]
		jwt.verify(
			token,
			process.env.AUTH_SECRET_KEY as string,
			(err: any, decoded: any) => {
				if (err) {
					throw new ResponseError(403, "Forbidden")
				}

				// console.log(decoded)
				if (typeof decoded === "object" && decoded.type === "auth") {
					req.id = decoded.id
				} else {
					throw new ResponseError(403, "Forbidden")
				}
				next()
			}
		)
	} catch (error) {
		next(error)
	}
}
