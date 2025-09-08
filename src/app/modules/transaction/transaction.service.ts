import  httpStatus  from 'http-status-codes';
import AppError from "../../errorHelper/AppError";
import { Transaction } from "./transaction.model";



const getallhistory = async (userId: string) => {

    // const {userId} = req.body.id
    // console.log("userId getallhistory", userId)

    const history = await Transaction.find({
        $or: [
            { sender: userId },
            { receiver: userId }
        ]
    }).sort({ createdAt: -1 });

    if (!history) {
        throw new AppError(httpStatus.BAD_REQUEST, "No transactions found.")
    }

    const totalHistory = await Transaction.countDocuments({
        $or: [
            { sender: userId },
            { receiver: userId }
        ]
    });
    return {
        data: history,
        meta: {
            totalHistory: totalHistory
        }
    }
}

export const transactionService = {
    getallhistory
}