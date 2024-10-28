import crypto from "crypto"
import jwt from "jsonwebtoken"
import parser from "ua-parser-js"

export class Utils {
	static generateToken(length: number = 30): string {
		return crypto.randomBytes(length).toString("hex")
	}

	static generateOTP() {
		return Math.floor(100000 + Math.random() * 900000).toString()
	}

	static generateAccessToken(payload: object, time: string) {
		return jwt.sign(payload, process.env.ACCESS_SECRET_KEY as string, {
			expiresIn: time,
		})
	}

	static generateRefreshToken(payload: object, time: string) {
		return jwt.sign(payload, process.env.REFRESH_SECRET_KEY as string, {
			expiresIn: time,
		})
	}

	static generateAuthorizationToken(payload: object, time: string) {
		return jwt.sign(payload, process.env.AUTH_SECRET_KEY as string, {
			expiresIn: time,
		})
	}

	static verifyAccessToken(token: string) {
		return jwt.verify(token, process.env.ACCESS_SECRET_KEY as string)
	}

	static userAgent(req: any) {
		const ua = parser(req.headers["user-agent"])
		console.log(ua)
		if (ua.os.name && ua.os.version && !ua.device.model) {
			return `${ua.os.name} ${ua.os.version} : ${ua.browser.name} ${ua.browser.version}`
		}
		if (ua.device.model) {
			return `${ua.os.name} ${ua.os.version} : ${ua.device.model}, ${ua.browser.name} ${ua.browser.version}`
		} else {
			return `${ua.ua}`
		}
	}

	static generateSignature(data: string, secret: string): string {
		return crypto.createHmac("sha512", secret).update(data).digest("hex")
	}

	static generateJWT(
		payload: object,
		secret: string,
		options?: object
	): string {
		const header = JSON.stringify({ alg: "HS256", typ: "JWT" })
		const base64Header = Buffer.from(header).toString("base64")
		const base64Payload = Buffer.from(JSON.stringify(payload)).toString(
			"base64"
		)

		const unsignedToken = `${base64Header}.${base64Payload}`
		const signature = this.generateSignature(
			unsignedToken,
			process.env.ACCESS_SECRET_KEY as string
		)

		return `${unsignedToken}.${signature}`
	}

	static verify(token: string, secretKey: string) {
		const parts = token.split(".")
		if (parts.length !== 3) {
			return false
		}

		const unsignedToken = `${parts[0]}.${parts[1]}`
		const signature = parts[2]
		const expectedSignature = this.generateSignature(unsignedToken, secretKey)
		return expectedSignature === signature
	}
}
