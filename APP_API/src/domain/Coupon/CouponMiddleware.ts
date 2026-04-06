import { z } from "zod";



export const createSchema = z.object({
  coupon_title: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Coupon code is required"), // Required and cannot be empty
  discount_type: z.enum(["PERCENTAGE", "FLAT"], { required_error: "Discount type is required" }), // Must be either PERCENTAGE or FLAT
  discount_value: z
    .number()
    .positive("Discount value must be greater than zero") // Must be a positive number
    .refine((val) => val > 0, { message: "Discount value is required" }),
  usage_limit: z.number().optional(), // Optional numeric field
  user_limit: z.number().optional(), // Optional numeric field
  expiration_date: z
    .date()
    .or(z.string().refine((date) => !isNaN(Date.parse(date)), "Invalid date format"))
    .optional(), // Optional date, can be passed as a Date object or valid ISO string
  status: z
    .string()
    .min(1, "Status is required")
    .refine((val) => ["ACTIVE", "INACTIVE", "EXPIRED"].includes(val), {
      message: "Status must be ACTIVE, INACTIVE, or EXPIRED",
    }),
});

export const updateSchema = z.object({
  title: z.string().min(1, "Name is required"),
  // email: z.string().email("Invalid email address"),
  // phone_number: z.string().min(10, "Phone number must be at least 10 characters"),
  // country_code: z.string().min(1, "Country code is required"),
  // password: z.string().min(8, "Password must be at least 8 characters"),
});