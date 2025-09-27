import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateRequest = (ZodSchema: ZodObject<any>) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body= JSON.parse(req.body.data) || req.body
            req.body = await ZodSchema.parseAsync(req.body);

            next();
        } catch (error) {
            next(error)
        }
    }
