import { prismaClient } from "../src/application/database"

export class UserTest {
	static async delete() {
		await prismaClient.user.deleteMany({
			where: {
				email: "test@gmail.com",
			},
		})
	}
}
