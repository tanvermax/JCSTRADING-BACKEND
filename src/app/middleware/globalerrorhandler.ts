import { NextFunction, Request, Response } from "express";
import { handleDuplicateError } from "../helper/handleDuplicateError";
import { handleCastError } from "../helper/handleCastError";
import { handleValidationerror } from "../helper/handleValidationError";
import { Zodvalidation } from "../helper/zodValidation";
import AppError from "../errorHelper/AppError";
import { envVarse } from "../config/env";
import httpStatus from 'http-status-codes';

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    let message = err.message || "Something went wrong!!";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let errorSources: any[] = [];
    // eslint-disable-next-line prefer-const
    let stack = envVarse.NODE_ENV === "devolopment" ? err.stack : null;

    if (err.code === 11000) {
        const simplifiedError = handleDuplicateError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources ?? [];
    } else if (err.name === "CastError") {
        const simplifiedError = handleCastError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources ?? [];
    } else if (err.name === "ValidationError") {
        const simplifiedError = handleValidationerror(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources ?? [];
    } else if (err.name === "ZodError") {
        const simplifiedError = Zodvalidation(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources?? [];
    } else if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        errorSources = [{ path: "", message: err.message }];
    } else if (err instanceof Error) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = err.message;
        errorSources = [{ path: "", message: err.message }];
    }
    
    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        stack
    });
};