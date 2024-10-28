// import supertest from "supertest"
// import { app } from "../src/application/app"
// import { describe, it, expect, afterEach } from "@jest/globals"
// import { logger } from "../src/application/logger"
// import { UserTest } from "./test-util"

// describe("POST /api/users", () => {
// 	afterEach(async () => {
// 		await UserTest.delete()
// 	})

// 	it("should reject register new user if request is invalid", async () => {
// 		const response = await supertest(app).post("/api/users").send({
// 			username: "bshjkghsjkb",
// 			email: "dewangga.com",
// 			password: "16161616",
// 			confirmPassword: "16161616",
// 		})

// 		logger.debug(response.body)
// 		expect(response.status).toBe(400)
// 		expect(response.body.errors).toBeDefined()
// 	})

// 	it("should register new user", async () => {
// 		const response = await supertest(app).post("/api/users").send({
// 			username: "test",
// 			email: "test@gmail.com",
// 			password: "Testtest566",
// 			confirmPassword: "Testtest566",
// 		})

// 		logger.debug(response.body)
// 		expect(response.status).toBe(201)
// 		expect(response.body.data.id).toBeDefined()
// 		expect(response.body.data.authToken).toBeDefined()
// 	})

// 	it("should reject register new user if passwords don't match", async () => {
// 		const response = await supertest(app).post("/api/users").send({
// 			username: "test",
// 			email: "test@gmail.com",
// 			password: "testtest566",
// 			confirmPassword: "testtest5665",
// 		})

// 		logger.debug(response.body)
// 		expect(response.status).toBe(400)
// 		expect(response.body.errors).toBeDefined()
// 	})
// })
