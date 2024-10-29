import { PrismaClient } from "@prisma/client"
import { faker } from "@faker-js/faker"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

async function main() {
	const userCount = 100 // Jumlah user yang ingin dibuat

	const password = await bcrypt.hash(faker.internet.password().slice(0, 15), 10)

	const userData = Array.from({ length: userCount }).map(() => ({
		username: faker.internet.username().slice(0, 50),
		fullname: faker.person.fullName().slice(0, 50),
		email: faker.internet.email().slice(0, 50),
		phone: faker.phone.number().slice(0, 15),
		isActive: faker.datatype.boolean(),
		balance: Number(faker.commerce.price({ min: 0, max: 10000000 })),
		verified: true,
		password: password,
	}))

	// Batch insert ke database
	await prisma.user.createMany({
		data: userData,
		skipDuplicates: true, // Lewati jika ada duplikat
	})

	console.log(`${userCount} users created successfully!`)
}

main()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
