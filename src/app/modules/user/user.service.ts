import httpStatus from 'http-status-codes';
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs"
import AppError from '../../errorHelper/AppError';
import { Wallet } from '../waller/wallet.model';
import mongoose from 'mongoose';
// import { Transaction } from '../transaction/transaction.model';

const createUser = async (payload: Partial<IUser>) => {

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { email, password, ...rest } = payload;


        const hashpassword = await bcryptjs.hash(password as string, 10)
        const isUserExit = await User.findOne({ email });

        if (isUserExit) {
            throw new AppError(httpStatus.BAD_REQUEST, "User alredy exit in")
        }


        const authprovider: IAuthProvider = { provider: "creadentials", providerId: email as string }
        const user = await User.create([
            {

                email,
                password: hashpassword,
                auth: [authprovider],
                ...rest,
            }
        ], { session })
        // console.log(user)
        const ownerInfo = {
            _id: user[0]._id,
            name: user[0].name,
            email: user[0].email,
            role: user[0].role
        };
        await Wallet.create([
            {
                owner: ownerInfo,
                balance: 50
            }
        ], { session })
        await session.commitTransaction();
        session.endSession();

        return user[0];


    } catch (error) {
        console.log(error)
    }
}



export const userService = {
    createUser
}