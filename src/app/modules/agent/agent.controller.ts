import  httpStatus  from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import AppError from '../../errorHelper/AppError';
import { sendResponse } from '../../utils/sendresponse';
import { addMoneyToWallet } from '../waller/wallet.service';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const addmoney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // const { amount } = req.body;
        const {amount,userId} = req.body;
        // const data = req.body;

        // console.log("data for reciver", data)

        if (!req.user) { 
        // eslint-disable-next-line no-console
            console.log("req.user", req.user)
            
            throw new AppError(httpStatus.BAD_REQUEST, "Agent is not auhtenticated");
        }

        const agentId = req.user.userId;
        // console.log("req.user in add money",agent,userId ,amount)

        if (!amount || amount <= 0) {
            throw new AppError(httpStatus.BAD_REQUEST, "Invalid amount")
            // return res.status(400).json({ message: 'Invalid amount' });
        }
        const updatedWallet = await addMoneyToWallet(userId,agentId ,amount);

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


export const agentController = {
    addmoney
}
