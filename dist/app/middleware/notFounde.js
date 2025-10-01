"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../errorHelper/AppError"));
const notFounde = (req, res, next) => {
    //     res.status(httpStatus.NOT_FOUND).json({
    //     success:false,
    //     message:"ROutte Not founde"
    // })
    next(new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'ROutte Not founde'));
};
exports.default = notFounde;
