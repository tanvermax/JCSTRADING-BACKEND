/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from 'http-status-codes';
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendresponse";
import AppError from "../../errorHelper/AppError";
import { addMoneyToWallet, sendMoney, withdrawfromWallet } from "../waller/wallet.service";
import { User } from "./user.model";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await userService.createUser(req.body);

    sendResponse(res, {

        statusCode: httpStatus.CREATED,
        message: "User created successfully",
        success: true,
        data: user,
    })
})



// eslint-disable-next-line @typescript-eslint/no-unused-vars


const addmoney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // const { amount } = req.body;
        const { amount, agent } = req.body;
        // const data = req.body;

        // console.log("data for reciver", data)

        if (!req.user) {
            // eslint-disable-next-line no-console
            console.log("req.user", req.user)
            throw new AppError(httpStatus.BAD_REQUEST, "user is not auhtenticated");
        }

        const userId = req.user.userId;
        // console.log("req.user in add money",agent,userId ,amount)

        if (!amount || amount <= 0) {
            throw new AppError(httpStatus.BAD_REQUEST, "Invalid amount")
            // return res.status(400).json({ message: 'Invalid amount' });
        }
        const updatedWallet = await addMoneyToWallet(agent, userId, amount);

        // console.log("updatedWallet", updatedWallet)
        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            message: "Money added request given successfully",
            success: true,
            data: updatedWallet,
        })
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error)
    }
})


const sendmoney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // const { amount } = req.body;
        const { amount, reciverId } = req.body;

        if (!req.user) {
            // eslint-disable-next-line no-console
            console.log("req.user", req.user)
            throw new AppError(httpStatus.BAD_REQUEST, "user is not auhtenticated");
        }

        const userId = req.user.userId;
        // console.log("req.user in add money",agent,userId ,amount)

        if (!amount || amount <= 0) {
            throw new AppError(httpStatus.BAD_REQUEST, "Invalid amount")
            // return res.status(400).json({ message: 'Invalid amount' });
        }
        const Isreciverisagent = await User.findOne({ _id: reciverId })
        if (!Isreciverisagent) {
            throw new AppError(httpStatus.BAD_REQUEST, "user is not axit");
        }
        if (Isreciverisagent.role === "AGENT") {
            sendResponse(res, {
                statusCode: httpStatus.FORBIDDEN,
                message: "please provide user id , you can not send money to a agent",
                success: true,
                data: null
            })
            throw new AppError(httpStatus.BAD_REQUEST, "please provide user id , you can not send money to a agent");
        }
        const updatedWallet = await sendMoney(reciverId, userId, amount);

        // console.log("updatedWallet", updatedWallet)
        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            message: "Money added request given successfully",
            success: true,
            data: updatedWallet,
        })
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error)
    }
})


const userwithdrawmoney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { agent, amount } = req.body



        if (!req.user) {
            // eslint-disable-next-line no-console
            console.log("req.user", req.user)
            throw new AppError(httpStatus.BAD_REQUEST, "user is not auhtenticated");
        }

        const userId = req.user.userId;
        if (!amount || amount <= 0) {
            throw new AppError(httpStatus.BAD_REQUEST, "Invalid amount")
            // return res.status(400).json({ message: 'Invalid amount' });
        }

        const updatedWallet = await withdrawfromWallet(agent, userId, amount)


        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            message: "Money added request given successfully",
            success: true,
            data: updatedWallet
        })
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
    }
})


export const userController = {
    createUser, addmoney, userwithdrawmoney, sendmoney
    // getallhistory
}


