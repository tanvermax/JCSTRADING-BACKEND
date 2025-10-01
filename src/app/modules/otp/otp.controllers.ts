import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendresponse";
import { OTPService } from "./otp.service";
import AppError from "../../errorHelper/AppError";


const sendOTP = catchAsync(async (req: Request, res: Response) => {
    const { email, name } = req.body;
    await OTPService.sendOTP(email, name);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "OTP sent successfully",
        data: null
    })
})

const verifyOTP = catchAsync(async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        throw new AppError(400, "Email and OTP are required");
    }
    console.log(email, otp)
    
    await OTPService.verifyOTP(email, otp)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "OTP verified successfully",
        data: null,
    });
})

export const OTPController = {
    sendOTP, verifyOTP
}