"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createUserZodSchema = zod_1.default.object({
    name: zod_1.default.string({ error: "name should be string" })
        .min(2, { error: "minimum 2 charecter" }).max(30, { error: "max 30 charecter" }),
    email: zod_1.default
        .string({ error: "Email is required" })
        .email({ message: "Invalid email format" }),
    password: zod_1.default
        .string({ error: "Password is required" })
        .min(8)
        .regex(/^(?=(?:.*[^A-Za-z0-9]){2,})(?=.*[A-Z])(?=.*\d).{8,}$/, {
        message: "Password must be at least 8 characters long, contain 1 uppercase letter, 1 digit, and 2 special characters",
    }).optional(),
    role: zod_1.default.string({ error: "role should be here" })
        .optional(),
    phone: zod_1.default
        .string({ error: "Phone number must be string" })
        .min(11, { message: "Minimum 11 characters" })
        .regex(/^(?:\+880|880|0)(1[3-9])[0-9]{8}$/, {
        message: "Invalid Bangladeshi phone number format. Format: +880xxxxxxxxxx or 01xxxxxxxxx",
    })
        .optional(),
    address: zod_1.default
        .string({ error: "Address must be string" })
        .optional(),
});
