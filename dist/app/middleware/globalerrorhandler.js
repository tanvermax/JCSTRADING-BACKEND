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
const http_status_codes_1 = __importDefault(require("http-status-codes"));
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
const globalErrorHandler = (err, req, res, next) => {
    var _a, _b, _c, _d;
    let statusCode = http_status_codes_1.default.INTERNAL_SERVER_ERROR;
    let message = err.message || "Something went wrong!!";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let errorSources = [];
    // eslint-disable-next-line prefer-const
    let stack = env_1.envVarse.NODE_ENV === "devolopment" ? err.stack : null;
    if (err.code === 11000) {
        const simplifiedError = (0, handleDuplicateError_1.handleDuplicateError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = (_a = simplifiedError.errorSources) !== null && _a !== void 0 ? _a : [];
    }
    else if (err.name === "CastError") {
        const simplifiedError = (0, handleCastError_1.handleCastError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = (_b = simplifiedError.errorSources) !== null && _b !== void 0 ? _b : [];
    }
    else if (err.name === "ValidationError") {
        const simplifiedError = (0, handleValidationError_1.handleValidationerror)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = (_c = simplifiedError.errorSources) !== null && _c !== void 0 ? _c : [];
    }
    else if (err.name === "ZodError") {
        const simplifiedError = (0, zodValidation_1.Zodvalidation)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = (_d = simplifiedError.errorSources) !== null && _d !== void 0 ? _d : [];
    }
    else if (err instanceof AppError_1.default) {
        statusCode = err.statusCode;
        message = err.message;
        errorSources = [{ path: "", message: err.message }];
    }
    else if (err instanceof Error) {
        statusCode = http_status_codes_1.default.INTERNAL_SERVER_ERROR;
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
exports.globalErrorHandler = globalErrorHandler;
