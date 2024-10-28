import { ZodType } from "zod"
import parsePhoneNumberFromString from "libphonenumber-js"
import { ResponseError } from "../error/response-error"

export class Validation {
	static validate<T>(schema: ZodType, data: T): T {
		return schema.parse(data)
	}

	static validatePhoneNumber(phoneNumber: string, countyCode: string) {
		const fullPhoneNumber = `${countyCode}${phoneNumber}`
		const parsedPhoneNumber = parsePhoneNumberFromString(fullPhoneNumber)

		if (!parsedPhoneNumber?.isValid()) {
			throw new ResponseError(400, "Invalid phone number")
		}

		return `${parsedPhoneNumber.countryCallingCode}${parsedPhoneNumber.nationalNumber}`
	}
}
