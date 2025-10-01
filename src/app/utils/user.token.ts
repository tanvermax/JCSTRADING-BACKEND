import httpStatus from 'http-status-codes';
import { JwtPayload } from "jsonwebtoken"
import { IsActive, IUser } from "../modules/user/user.interface"
import { User } from '../modules/user/user.model';
import { generateToken, verifyToken } from './jwt';
import { envVarse } from '../config/env';
import AppError from '../errorHelper/AppError';

export const createUserToken = (user: Partial<IUser>) => {

    const JwtPayload = {
        role: user.role,
        userId: user._id,
        email: user.email,
    }

    const accessToken = generateToken(JwtPayload,
        envVarse.JWT_ACCES_SECRET,
        envVarse.JWT_ACCES_EXPIRE)


    const refreshToken = generateToken(JwtPayload,
        envVarse.JWT_ACCES_SECRET,
        envVarse.JWT_ACCES_EXPIRE)


    return {

        accessToken,
         refreshToken,
    }

}



export const createNewAccessTokenWithrefreshtoken = async (refreshToken: string) => {

    const verifiedRefresfToken = verifyToken(refreshToken, envVarse.JWT_ACCES_SECRET) as JwtPayload;


    const IsUserExit = await User.findOne({ email: verifiedRefresfToken.email });



    if (!IsUserExit) {
        throw new AppError(httpStatus.BAD_REQUEST, "User not found")
    }

    if (IsUserExit.isActive === IsActive.BLOCKED || IsUserExit.isActive === IsActive.INACTIVE) {
        throw new AppError(httpStatus.BAD_REQUEST, `User not found ${IsActive}`)
    }

    if (IsUserExit.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, `User not found ${IsUserExit}`)
    }



    const JwtPayload = {
        role: IsUserExit.role,
        email: IsUserExit.email,
        userId: IsUserExit._id
    }
    const accesstoken = generateToken(
        JwtPayload,
        envVarse.JWT_ACCES_SECRET,
        envVarse.JWT_ACCES_EXPIRE)

    return accesstoken;
}