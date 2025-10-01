"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTPController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendresponse_1 = require("../../utils/sendresponse");
const otp_service_1 = require("./otp.service");
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const sendOTP = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name } = req.body;
    yield otp_service_1.OTPService.sendOTP(email, name);
    (0, sendresponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "OTP sent successfully",
        data: null
    });
}));
const verifyOTP = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    if (!email || !otp) {
        throw new AppError_1.default(400, "Email and OTP are required");
    }
    console.log(email, otp);
    yield otp_service_1.OTPService.verifyOTP(email, otp);
    (0, sendresponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "OTP verified successfully",
        data: null,
    });
}));
exports.OTPController = {
    sendOTP, verifyOTP
};
