import { NextFunction, Request, Response } from "express"
import { ZodError } from "zod"
import { ResponseError } from "../error/response-error"

export const errorMiddleware = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (err instanceof ZodError) {
		res.status(400).json({
			errors: err.issues,
		})
	} else if (err instanceof ResponseError) {
		res.status(err.status).json({
			errors: err.message,
		})
	} else {
		res.status(500).json({
			errors: err.message,
		})
	}
}
