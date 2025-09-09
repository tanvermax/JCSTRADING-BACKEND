/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from 'http-status-codes';
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendresponse";
import AppError from "../../errorHelper/AppError";
import { addMoneyToWallet, sendMoney, withdrawfromWallet } from "../waller/wallet.service";
import { User } from "./user.model";
import { Wallet } from "../waller/wallet.model";
import { WalletStatus } from "../waller/wallet.interface";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await userService.createUser(req.body);
    // console.log(user)
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
    const { amount, reciverId } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
        return sendResponse(res, {
            statusCode: httpStatus.BAD_REQUEST,
            message: "User is not authenticated",
            success: false,
            data: null,
        });
    }

    const isUservalid = await Wallet.findOne({ owner: userId });
    const isRecivervalid = await Wallet.findOne({ owner: reciverId });

    if (!isUservalid || !isRecivervalid) {
        return sendResponse(res, {
            statusCode: httpStatus.BAD_REQUEST,
            message: "Sender or receiver not found",
            success: false,
            data: null,
        });
    }

    if (isUservalid.status === WalletStatus.BLOCKED || isRecivervalid.status === WalletStatus.BLOCKED) {
        return sendResponse(res, {
            statusCode: httpStatus.BAD_REQUEST,
            message: "User account is blocked",
            success: false,
            data: null,
        });
    }

    if (!amount || amount <= 0) {
        return sendResponse(res, {
            statusCode: httpStatus.BAD_REQUEST,
            message: "Invalid amount",
            success: false,
            data: null,
        });
    }

    const Isreciverisagent = await User.findOne({ _id: reciverId });

    if (!Isreciverisagent) {
        return sendResponse(res, {
            statusCode: httpStatus.BAD_REQUEST,
            message: "Receiver user does not exist",
            success: false,
            data: null,
        });
    }

    if (Isreciverisagent.role === "AGENT") {
        return sendResponse(res, {
            statusCode: httpStatus.FORBIDDEN,
            message: "You cannot send money to an agent",
            success: false,
            data: null,
        });
    }

    const updatedWallet = await sendMoney(reciverId, userId, amount);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: "Money transfer successful",
        success: true,
        data: updatedWallet,
    });
});


const userwithdrawmoney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { agent, amount } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is not authenticated");
    }

    if (!amount || amount <= 0) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid amount");
    }

    // 1. Validate the user's wallet status
    const userWallet = await Wallet.findOne({ owner: userId });
    if (!userWallet) {
        throw new AppError(httpStatus.NOT_FOUND, "User wallet not found");
    }
    if (userWallet.status === WalletStatus.BLOCKED) {
        throw new AppError(httpStatus.BAD_REQUEST, "User account is blocked. Cannot withdraw money.");
    }

    // 2. Validate the agent's wallet status
    const agentWallet = await Wallet.findOne({ owner: agent });
    if (!agentWallet) {
        throw new AppError(httpStatus.NOT_FOUND, "Agent wallet not found");
    }
    if (agentWallet.status === WalletStatus.BLOCKED) {
        throw new AppError(httpStatus.BAD_REQUEST, "Agent account is blocked. Cannot process withdrawal.");
    }

    const updatedWallet = await withdrawfromWallet(agent, userId, amount);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: "Withdrawal request submitted successfully",
        success: true,
        data: updatedWallet,
    });
});

export const userController = {
    createUser, addmoney, userwithdrawmoney, sendmoney
    // getallhistory
}


