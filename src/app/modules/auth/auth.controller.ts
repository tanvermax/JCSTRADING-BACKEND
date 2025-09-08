import httpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendresponse"
import { AuthService } from './auth.service';
import { User } from '../user/user.model';




// eslint-disable-next-line @typescript-eslint/no-unused-vars
const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const loginInfo = await AuthService.credentialsLogin(req.body);
    const { email } = req.body;


    const user = await User.find({ email })
    if (!user) {
        // Handle case where user is not found, although AuthService should likely handle this.
        return sendResponse(res, {
            success: false,
            statusCode: httpStatus.NOT_FOUND,
            message: "User not found.",
            data:null
        });
    }


   const role = user[0].role
    const message = `${role} Log in Successfully`;

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message,
        data: loginInfo
    });

});


export const AuthController = {
    credentialsLogin
}