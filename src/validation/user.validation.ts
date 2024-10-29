import { z, ZodType } from "zod"
import { Validation } from "./validation"

export class UserValidation {
	static readonly REGISTER: ZodType = z
		.object({
			username: z
				.string({
					required_error: "Username is required",
					message: "Username is string",
				})
				.min(3, { message: "Username must be at least 3 characters long" })
				.max(50, { message: "Username must be at most 50 characters long" })
				.regex(/^[a-zA-Z0-9]+$/, {
					message: "Username can only contain letters and numbers",
				}),
			fullName: z
				.string({
					required_error: "Username is required",
					message: "Username is string",
				})
				.min(3, { message: "Username must be at least 3 characters long" })
				.max(50, { message: "Username must be at most 50 characters long" })
				.regex(/^[a-zA-Z0-9]+$/, {
					message: "Username can only contain letters and numbers",
				}),
			phoneNumber: z
				.string()
				.max(20, { message: "Invalid phone number" })
				.regex(/^[0-9]+$/, {
					message: "Invalid phone number",
				})
				.optional(),
			countryCode: z
				.string()
				.max(5, { message: "Invalid phone number" })
				.regex(/^\+\d{1,3}$/, {
					message: "Invalid phone number",
				})
				.optional(),
			email: z
				.string({
					required_error: "Email is required",
					message: "Email is string",
				})
				.email({
					message: "Invalid email",
				})
				.max(50, { message: "Email must be at most 50 characters long" }),
			password: z
				.string()
				.min(8)
				.max(100)
				.regex(/(?=.*[a-z])/, {
					message: "Password must contain at least one lowercase letter",
				})
				.regex(/(?=.*[A-Z])/, {
					message: "Password must contain at least one uppercase letter",
				})
				.regex(/^[^<>"'\/]*$/, {
					message: "Password must not contain special characters",
				}),
			confirmPassword: z
				.string()
				.min(8)
				.max(100)
				.regex(/(?=.*[a-z])/, {
					message: "Password must contain at least one lowercase letter",
				})
				.regex(/(?=.*[A-Z])/, {
					message: "Password must contain at least one uppercase letter",
				})
				.regex(/^[^<>"'\/]*$/, {
					message: "Password must not contain special characters",
				}),
			isAdmin: z.boolean().optional(),
			token: z
				.string()
				.min(5)
				.max(150)
				.regex(/^[\w\.-]+$/, {
					message: "Invalid token",
				}),
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: "Passwords don't match",
			path: ["confirmPassword"],
		})

	static readonly LOGIN: ZodType = z.object({
		email: z.string().email({
			message: "Invalid email",
		}),
		password: z
			.string()
			.min(8)
			.max(100)
			.regex(/(?=.*[a-z])/, {
				message: "Password must contain at least one lowercase letter",
			})
			.regex(/(?=.*[A-Z])/, {
				message: "Password must contain at least one uppercase letter",
			})
			.regex(/^[^<>"'\/]*$/, {
				message: "Password must not contain special characters",
			}),
		remember: z.boolean().default(false),
		token: z
			.string()
			.min(5)
			.max(150)
			.regex(/^[\w\.-]+$/, {
				message: "Invalid token",
			}),
	})
}

export class UserAdminValidation {
	static readonly USERSQUERY: ZodType = z.object({
		page: z
			.string()
			.regex(/^[0-9]+$/, {
				message: "Page must be a number",
			})
			.default("1")
			.transform((v) =>
				Number(v) >= 10 ? 10 : Number(v) <= 0 ? 1 : Number(v)
			),
		limit: z
			.string()
			.regex(/^[0-9]+$/, {
				message: "Limit must be a number",
			})
			.default("15")
			.transform((v) =>
				Number(v) >= 100 ? 100 : Number(v) <= 0 ? 1 : Number(v)
			),
		search: z.string().optional(),
		sort_by: z
			.string()
			.regex(/^[^<>"'\/]*$/, {
				message: "Sort must not contain special characters",
			})
			.optional(),
		is_active: z.enum(["true", "false"]).optional(),
		verified: z.enum(["true", "false"]).optional(),
		start_id: z
			.string()
			.regex(/^[0-9]+$/, {
				message: "Page must be a number",
			})
			.default("1")
			.transform((v) => (Number(v) <= 0 ? 1 : Number(v))),
	})
}
