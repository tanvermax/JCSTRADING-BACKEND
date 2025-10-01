import httpStatus from 'http-status-codes';
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs"
import AppError from '../../errorHelper/AppError';

const createUser = async (payload: Partial<IUser>) => {



    try {
        const { email, password, ...rest } = payload;

        console.log("USER :", payload)




        const isUserExit = await User.findOne({ email });

        if (isUserExit) {
            throw new AppError(httpStatus.BAD_REQUEST, "User alredy exit in")
        }

        const hashpassword = await bcryptjs.hash(password as string, 10);

        const authprovider: IAuthProvider = { provider: "creadentials", providerId: email as string };


        const user = await User.create([
            {
                email,
                password: hashpassword,
                auths: [authprovider],
                ...rest,
            }
        ])

        return user;


    } catch (error) {
        console.log(error)
    }
}

const getMe = async (userId: string) => {
    const user = await User.findById(userId).select("-password");
    return {
        data: user
    }
};

export const userService = {
    createUser, getMe
}