import rateLimit from "express-rate-limit"

export const limitter = rateLimit({
	windowMs: 2 * 60 * 1000,
	max: 5,
	handler: (req, res) => {
		res.status(429).json({ message: "Too Many Requests" })
	},
})
