import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validateSchema = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next(); // If validation passes, proceed to the next middleware/controller
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: error.errors, // Zod provides detailed error messages
      });
    }
  };
};
