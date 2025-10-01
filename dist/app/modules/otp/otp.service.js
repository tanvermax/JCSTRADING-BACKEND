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
exports.OTPService = void 0;
const redis_config_1 = require("../../config/redis.config");
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const sendEmail_1 = require("../../utils/sendEmail");
const user_model_1 = require("../user/user.model");
const crypto_1 = __importDefault(require("crypto"));
const OTP_EXPIRATIO = 2 * 60;
const genarateOtp = (length = 6) => {
    // const otp = crypto.randomInt(10**(length-1),10**length).toString();
    const otp = crypto_1.default.randomInt(10 ** (length - 1), 10 ** length).toString();
    return otp;
};
const sendOTP = (email, name) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.default(404, "User not found");
    }
    if (user.isVerified) {
        throw new AppError_1.default(401, "You are already verified");
    }
    const otp = genarateOtp();
    const redisKey = `otp:${email}`;
    yield redis_config_1.redisclient.set(redisKey, otp, {
        expiration: {
            type: "EX",
            value: OTP_EXPIRATIO
        }
    });
    yield (0, sendEmail_1.sendEmail)({
        to: email,
        subject: "Your OTP Code",
        templateName: "otp",
        templateData: {
            name: name,
            otp: otp
        }
    });
});
const verifyOTP = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    if (!email) {
        throw new AppError_1.default(400, "Email is required");
    }
    if (!otp) {
        throw new AppError_1.default(400, "OTP is required");
    }
    // const user = await User.findOne({ email, isVerified: false })
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.default(404, "User not found");
    }
    if (user.isVerified) {
        throw new AppError_1.default(401, "You are already verified");
    }
    console.log(email);
    const redisKey = `otp:${email}`;
    const savedOtp = yield redis_config_1.redisclient.get(redisKey);
    console.log("OTP", savedOtp);
    if (!savedOtp || savedOtp !== otp) {
        throw new AppError_1.default(401, "Invalid OTP or dont match");
    }
    yield Promise.all([
        user_model_1.User.updateOne({ email }, { isVerified: true }, { runValidators: true }),
        redis_config_1.redisclient.del([redisKey])
    ]);
});
exports.OTPService = {
    sendOTP, verifyOTP
};
