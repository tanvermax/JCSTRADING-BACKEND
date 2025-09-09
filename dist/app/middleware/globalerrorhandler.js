"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const handleDuplicateError_1 = require("../helper/handleDuplicateError");
const handleCastError_1 = require("../helper/handleCastError");
const handleValidationError_1 = require("../helper/handleValidationError");
const zodValidation_1 = require("../helper/zodValidation");
const AppError_1 = __importDefault(require("../errorHelper/AppError"));
const env_1 = require("../config/env");
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = "something went wrong!!";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let errorSource = [];
    if (err.code === 11000) {
        const simplefieldError = (0, handleDuplicateError_1.handleDuplicateError)(err);
        statusCode: simplefieldError.statusCode;
        message: simplefieldError.message;
    }
    else if (err.home === "CastEroor") {
        const simplifiedError = (0, handleCastError_1.handleCastError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    else if (err.name === "ValidationError") {
        const simplifiedError = (0, handleValidationError_1.handleValidationerror)(err);
        statusCode = simplifiedError.statusCode;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        errorSource = simplifiedError.errorSources;
        message = simplifiedError.message;
    }
    else if (err.name === "ZodError") {
        const simplifiedError = (0, zodValidation_1.Zodvalidation)(err);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        errorSource = simplifiedError.errorSources;
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    else if (err instanceof AppError_1.default) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (err instanceof Error) {
        statusCode = 500;
        message = err.message;
    }
    res.status(statusCode).json({
        success: false,
        message,
        err: env_1.envVarse.NODE_ENV === "devolopment" ? err.stack : undefined,
        stack: env_1.envVarse.NODE_ENV === "devolopment" ? err.stack : null
    });
};
exports.globalErrorHandler = globalErrorHandler;
