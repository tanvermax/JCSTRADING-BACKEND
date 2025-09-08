/* eslint-disable no-unused-labels */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { NextFunction, Request, Response } from "express";
import { handleDuplicateError } from "../helper/handleDuplicateError";
import { handleCastError } from "../helper/handleCastError";
import { handleValidationerror } from "../helper/handleValidationError";
import { Zodvalidation } from "../helper/zodValidation";
import AppError from "../errorHelper/AppError";
import { envVarse } from "../config/env";

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export const globalErrorHandler = (err:any, req:Request, res:Response,next:NextFunction)=>{


    let statusCode = 500;
    let message="something went wrong!!";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let errorSource: any=[];


    if (err.code===11000) {
        const simplefieldError = handleDuplicateError(err);
        statusCode:simplefieldError.statusCode;
        message:simplefieldError.message
    }
     else if (err.home === "CastEroor") {
        const simplifiedError = handleCastError(err);
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
    }
     else if (err.name === "ValidationError") {

        const simplifiedError = handleValidationerror(err);

        statusCode = simplifiedError.statusCode;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        errorSource = simplifiedError.errorSources;
        message = simplifiedError.message


    }
    else if (err.name === "ZodError") {
        const simplifiedError = Zodvalidation(err)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        errorSource = simplifiedError.errorSources
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
    }
     else if (err instanceof AppError) {
        statusCode = err.statusCode
        message = err.message
    } else if (err instanceof Error) {
        statusCode = 500;
        message = err.message
    }
    res.status(statusCode).json({
        success: false,
        message,
        err: envVarse.NODE_ENV === "devolopment" ? err.stack : undefined,
        stack: envVarse.NODE_ENV === "devolopment" ? err.stack : null

    })
}