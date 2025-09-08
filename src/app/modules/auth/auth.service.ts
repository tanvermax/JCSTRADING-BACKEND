/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from 'http-status-codes';
import AppError from "../../errorHelper/AppError";
import { IUser } from "../user/user.interface"
import { User } from "../user/user.model"
import bcryptjs from "bcryptjs"
import Jwt from 'jsonwebtoken';
import { generateTOken } from '../../utils/jwt';
import { envVarse } from '../../config/env';

const credentialsLogin = async (payoad: Partial<IUser>) => {


    const { email, password } = payoad;
    const IsUserExit = await User.findOne({ email })

    if (!IsUserExit) {
        throw new AppError(httpStatus.BAD_REQUEST, "user des not exit")
    }

    if (!IsUserExit.password) {
        throw new AppError(httpStatus.BAD_REQUEST, "User password not found");
    }

    const isPasswordMatch = await bcryptjs.compare(password as string, IsUserExit.password);


    if (!isPasswordMatch) {
        throw new AppError(httpStatus.BAD_REQUEST, "user password does not macth")
    }

    const jwtPayload = {
        email: IsUserExit.email,
        role: IsUserExit.role,
        userId: IsUserExit._id
    }


    const accesToken = generateTOken(jwtPayload,
        envVarse.JWT_ACCES_SECRET, envVarse.JWT_ACCES_EXPIRE
    )

    const { password: pass, ...rest } = IsUserExit;

    return {
        accesToken
    }
}



export const AuthService = {
    credentialsLogin
}