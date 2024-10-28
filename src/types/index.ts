import { Request } from "express"

export interface RequestIdToken extends Request {
	id?: number
}
