import { model, Schema } from "mongoose";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";



const authproviderschema = new Schema<IAuthProvider>({
    provider: { type: String, required: true },
    providerId: { type: String, required: true }
}, {
    versionKey: false,
    _id: false
})


const useSchema = new Schema<IUser>({

    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    // wallet: { type: Number },
    role: {
        type: String,
        enum: Object.values(Role),
        default: Role.USER
    },
    phone: { type: Number },
    picture: { type: String },
    address: { type: String },
    isDeleted: { type: Boolean, default: false },
    isActive: {
        type: String,
        enum: Object.values(IsActive),
        default: IsActive.ACTIVE,
    },
    isVerified: { type: Boolean, default: false },
    auths: [authproviderschema],

}, {
  timestamps: true,
})

export const User = model<IUser>("User", useSchema)