import z from "zod";

export const createUserZodSchema = z.object({
    name: z.string({error:"name should be string"})
    .min(2,{error:"minimum 2 charecter"}).max(30,{error:"max 30 charecter"}),
   email: z
        .string({ error: "Email is required" })
        .email({ message: "Invalid email format" }),
       password: z
        .string({ error: "Password is required" })
        .min(8)
        .regex(
            /^(?=(?:.*[^A-Za-z0-9]){2,})(?=.*[A-Z])(?=.*\d).{8,}$/,
            {
                message:
                    "Password must be at least 8 characters long, contain 1 uppercase letter, 1 digit, and 2 special characters",
            }
        ).optional(),
    phone: z
        .string({ error: "Phone number must be string" })
        .min(11, { message: "Minimum 11 characters" })
        .regex(/^(?:\+880|880|0)(1[3-9])[0-9]{8}$/, {
            message:
                "Invalid Bangladeshi phone number format. Format: +880xxxxxxxxxx or 01xxxxxxxxx",
        })
        .optional(),


    address: z
        .string({ error: "Address must be string" })
        .optional(),

})