import { z } from "zod";

export const CreateProductZodSchema = z.object({
  _id: z.string().optional(), // ObjectId or UUID
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  price: z.number().positive("Price must be greater than 0"),
  stock: z.number().int().nonnegative("Stock cannot be negative"),
  category: z.string().min(2, "Category is required"),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Slug must be URL-friendly (lowercase, no spaces)").optional(),
  newproduct: z.boolean(),
  images: z.array(z.string().url("Must be a valid URL")).min(1, "At least one image is required").optional(),
  brand: z.string().optional(),
  sku: z.string().optional(),
  tags: z.array(z.string()).optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  isActive: z.boolean().default(true),
});

// ✅ Inferred Type
