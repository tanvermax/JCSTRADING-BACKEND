/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendresponse";
import { adminService } from './admin.service';
import { User } from '../user/user.model';
import AppError from '../../errorHelper/AppError';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // console.log("alluser from controller")

    const alluser = await adminService.getalluser();
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: "All User data recived successfully",
        success: true,
        data: alluser,
    })
})

const getWallets = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // console.log("alluser from controller")

    const alluser = await adminService.allwallets();
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: "All wallets data recived successfully",
        success: true,
        data: alluser,
    })
})
const getTransactions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // console.log("alluser from controller")
   const query = req.query;

    // const seach = req.query
    console.log(query)
    const alluser = await adminService.allTansactions(query as Record<string,string> || undefined);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: "All Transactions data recived successfully",
        success: true,
        data: alluser,
    })
})
const updateWalletStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // console.log("alluser from controller")
    const { userId } = req.params;
    const { status } = req.body;

    const alluser = await adminService.updateWallet(userId, status);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: `Wallet for user ${userId} has been ${status.toLowerCase()}.`,
        success: true,
        data: alluser,
    })
})

const updateagentWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // console.log("alluser from controller")
    const { agentId } = req.params;
    const { status } = req.body;
    console.log("userId", agentId)


    const IsAgentUser = await User.findOne({ _id: agentId });

    // console.log("IsAgentUser",IsAgentUser.role)
    // console.log("status",status)
    if (!IsAgentUser) {
        throw new AppError(httpStatus.BAD_REQUEST, "agent does not exit")

    }
    if (IsAgentUser.role === "USER") {
        throw new AppError(httpStatus.BAD_GATEWAY, "this agent is user, it cant be suspened")
    }

    const alluser = await adminService.updateWallet(agentId, status);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: `Wallet for agent ${IsAgentUser.name} has been ${status.toLowerCase()}.`,
        success: true,
        data: alluser,
    })
})



export const adminController = {
    getAllUser, getWallets, getTransactions, updateWalletStatus, updateagentWallet
}
