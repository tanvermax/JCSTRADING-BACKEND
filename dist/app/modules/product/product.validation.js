"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProductZodSchema = void 0;
const zod_1 = require("zod");
exports.CreateProductZodSchema = zod_1.z.object({
    _id: zod_1.z.string().optional(), // ObjectId or UUID
    title: zod_1.z.string().min(3, "Title must be at least 3 characters long"),
    description: zod_1.z.string().min(10, "Description must be at least 10 characters long"),
    price: zod_1.z.number().positive("Price must be greater than 0"),
    stock: zod_1.z.number().int().nonnegative("Stock cannot be negative"),
    category: zod_1.z.string().min(2, "Category is required"),
    slug: zod_1.z.string().regex(/^[a-z0-9-]+$/, "Slug must be URL-friendly (lowercase, no spaces)").optional(),
    newproduct: zod_1.z.boolean(),
    images: zod_1.z.array(zod_1.z.string().url("Must be a valid URL")).min(1, "At least one image is required").optional(),
    brand: zod_1.z.string().optional(),
    sku: zod_1.z.string().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    createdAt: zod_1.z.date().default(() => new Date()),
    updatedAt: zod_1.z.date().default(() => new Date()),
    isActive: zod_1.z.boolean().default(true),
});
// ✅ Inferred Type
