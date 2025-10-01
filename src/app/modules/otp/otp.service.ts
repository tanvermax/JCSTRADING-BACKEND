
import { redisclient } from "../../config/redis.config";
import AppError from "../../errorHelper/AppError";
import { sendEmail } from "../../utils/sendEmail";
import { User } from "../user/user.model";
import crypto from "crypto";

const OTP_EXPIRATIO = 2 * 60
const genarateOtp = (length = 6) => {
    // const otp = crypto.randomInt(10**(length-1),10**length).toString();
    const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString()
    return otp;
}
const sendOTP = async (email: string, name: string) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new AppError(404, "User not found")
    }
    if (user.isVerified) {
        throw new AppError(401, "You are already verified")
    }

    const otp = genarateOtp();
    const redisKey = `otp:${email}`;
    await redisclient.set(redisKey, otp, {
        expiration: {
            type: "EX",
            value: OTP_EXPIRATIO
        }
    })
    await sendEmail({
        to: email,
        subject: "Your OTP Code",
        templateName: "otp",
        templateData: {
            name: name,
            otp: otp
        }
    })
}

const verifyOTP = async (email: string, otp: string) => {
    if (!email) {
        throw new AppError(400, "Email is required");
    }
    if (!otp) {
        throw new AppError(400, "OTP is required");
    }
    // const user = await User.findOne({ email, isVerified: false })
    const user = await User.findOne({ email })

    if (!user) {
        throw new AppError(404, "User not found")
    }

    if (user.isVerified) {
        throw new AppError(401, "You are already verified")
    }
    console.log(email)

    const redisKey = `otp:${email}`

    const savedOtp = await redisclient.get(redisKey)

    console.log("OTP",savedOtp)
    if (!savedOtp || savedOtp !== otp) {
        throw new AppError(401, "Invalid OTP or dont match");
    }



    await Promise.all([
        User.updateOne({ email },
            { isVerified: true },
            { runValidators: true }),
        redisclient.del([redisKey])
    ])

};


export const OTPService = {
    sendOTP, verifyOTP
}
