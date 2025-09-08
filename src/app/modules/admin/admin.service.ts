import httpStatus from 'http-status-codes';
import AppError from "../../errorHelper/AppError";
import { Transaction } from "../transaction/transaction.model";
import { User } from "../user/user.model";
import { WalletStatus } from "../waller/wallet.interface";
import { Wallet } from "../waller/wallet.model";
import mongoose from 'mongoose';




const getalluser = async () => {
    const users = await User.find({});
    const totalUser = await User.countDocuments();
    return {
        data: users,
        meta: {
            totaluser: totalUser
        }
    }

}


const allwallets = async () => {
    const wallets = await Wallet.find({});
    const totwallets = await Wallet.countDocuments();
    return {
        data: wallets,
        meta: {
            totaluser: totwallets
        }
    }

}

const allTansactions = async ( query:Record<string,string>) => {

    console.log("userId", query);
   
    const tansactions = await Transaction.find(query);
    const totaltansactions = await Transaction.countDocuments(query);
    return {
     
        meta: {
            totaltansactions: totaltansactions
        },
           tansactions: tansactions,
    };

}



const updateWallet = async (userId: string, status: WalletStatus) => {

    if (!Object.values(WalletStatus).includes(status)) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid wallet status provided.");
    }
    const updatedWallet = await Wallet.findOneAndUpdate(
        { owner: new mongoose.Types.ObjectId(userId) },
        { status: status },
        { new: true, runValidators: true } // Return the updated document and run schema validators
    );

    return {
        data: updatedWallet
    }

}


export const adminService = {
    getalluser, allwallets, allTansactions, updateWallet
}