import { z } from "zod";



export const createSchema = z.object({
  country: z.string().min(1, "Country is required"),
  province: z.string().min(1, "Country is required"),
  tax_rate: z.number().min(1, "Country is required"),
  // email: z.string().email("Invalid email address"),
  // phone_number: z.string().min(10, "Phone number must be at least 10 characters"),
  // country_code: z.string().min(1, "Country code is required"),
  // password: z.string().min(8, "Password must be at least 8 characters"),
});

export const checkTax = z.object({
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  // email: z.string().email("Invalid email address"),
  // phone_number: z.string().min(10, "Phone number must be at least 10 characters"),
  // country_code: z.string().min(1, "Country code is required"),
  // password: z.string().min(8, "Password must be at least 8 characters"),
});

export const updateSchema = z.object({
  title: z.string().min(1, "Name is required"),
  // email: z.string().email("Invalid email address"),
  // phone_number: z.string().min(10, "Phone number must be at least 10 characters"),
  // country_code: z.string().min(1, "Country code is required"),
  // password: z.string().min(8, "Password must be at least 8 characters"),
});