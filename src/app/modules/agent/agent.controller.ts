import  httpStatus  from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import AppError from '../../errorHelper/AppError';
import { sendResponse } from '../../utils/sendresponse';
import { addMoneyToWallet } from '../waller/wallet.service';
import { Wallet } from '../waller/wallet.model';
import { WalletStatus } from '../waller/wallet.interface';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const addmoney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { amount, userId } = req.body;
    const agentId = req.user?.userId;

    // 1. Validate Agent Authentication
    if (!agentId) {
        throw new AppError(httpStatus.BAD_REQUEST, "Agent is not authenticated");
    }

    // 2. Validate Amount
    if (!amount || amount <= 0) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid amount");
    }

    // 3. Validate Wallet Statuses
    const agentWallet = await Wallet.findOne({ owner: agentId });
    if (!agentWallet) {
        throw new AppError(httpStatus.NOT_FOUND, "Agent wallet not found");
    }
    if (agentWallet.status === WalletStatus.SUSPEND) {
        throw new AppError(httpStatus.BAD_REQUEST, "Agent's account is SUSPEND. Cannot add money.");
    }

    const userWallet = await Wallet.findOne({ owner: userId });
    if (!userWallet) {
        throw new AppError(httpStatus.NOT_FOUND, "User wallet not found");
    }
    if (userWallet.status === WalletStatus.BLOCKED) {
        throw new AppError(httpStatus.BAD_REQUEST, "User's account is blocked. Cannot add money.");
    }

    // 4. Perform the Transaction
    const updatedWallet = await addMoneyToWallet(userId, agentId, amount);

    // 5. Send Success Response
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: "Money added request given successfully",
        success: true,
        data: updatedWallet,
    });
});

export const agentController = {
    addmoney
}
