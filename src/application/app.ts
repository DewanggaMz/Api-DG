import express from "express"
import cors from "cors"
import helmet from "helmet"
import cookieParser from "cookie-parser"
import { publicRouter } from "../routers/public-api"
import { errorMiddleware } from "../middleware/error.middleware"
import { prismaClient } from "./database"

export const app = express()
app.use(cookieParser())
app.use(helmet())
app.use(express.urlencoded({ extended: true }))
// const corsOptionsDelegate = (req : any, callback : any) => {
// 	let corsOptions

// 	// Periksa origin dan atur allowed methods berdasarkan origin
// 	if (req.header("Origin") === "http://localhost:3000") {
// 		corsOptions = {
// 			origin: true, // Izinkan origin ini
// 			credentials: true,
// 			allowedHeaders: [
// 				"Origin",
// 				"X-Requested-With",
// 				"Content-Type",
// 				"Authorization",
// 			],
// 			// Izinkan metode tertentu untuk origin ini
// 			methods: ["GET", "POST"],
// 			optionsSuccessStatus: 200,
// 			preflightContinue: false,
// 		}
// 	} else if (req.header("Origin") === "http://example.com") {
// 		corsOptions = {
// 			origin: true, // Izinkan origin ini
// 			credentials: true,
// 			allowedHeaders: [
// 				"Origin",
// 				"X-Requested-With",
// 				"Content-Type",
// 				"Authorization",
// 			],
// 			// Izinkan metode yang berbeda untuk origin ini
// 			methods: ["PUT", "DELETE"],
// 			optionsSuccessStatus: 200,
// 			preflightContinue: false,
// 		}
// 	} else {
// 		corsOptions = { origin: false } // Tolak semua origin lainnya
// 	}

// 	callback(null, corsOptions) // callback dengan konfigurasi CORS yang sesuai
// }

// // Gunakan middleware CORS dengan opsi dinamis
// app.use(cors(corsOptionsDelegate))

app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
		allowedHeaders: [
			"Origin",
			"X-Requested-With",
			"Content-Type",
			"Authorization",
		],

		methods: ["GET", "POST", "PUT", "DELETE"],
		optionsSuccessStatus: 200,
		preflightContinue: false, // allow options request method
		// options: (req, res) => {
	})
)
app.use(express.json())

app.use(publicRouter)
app.use(errorMiddleware)

app.listen(4000, () => console.log("Server running on port 3000"))
