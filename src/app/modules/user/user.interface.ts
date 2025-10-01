import { Types } from "mongoose";


export enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    USER = "USER",
    AGENT = "AGENT",
}


export interface IAuthProvider {
    provider: "google" | "creadentials",
    providerId: string;

}

export enum IsActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}


export interface IUser {
    _id?: Types.ObjectId,
    name: string;

    email: string;
    password?: string;
    phone?: number;
    picture?: string;
    address?: string;
    isDeleted?: string;
    isActive?: IsActive;
    isVerified?: boolean;
    role: Role;
    auths: IAuthProvider[];
    tansection?: Types.ObjectId[];
    guid?: Types.ObjectId[];
}