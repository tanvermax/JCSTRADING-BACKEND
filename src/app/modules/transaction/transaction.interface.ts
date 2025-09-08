import { Date, Types } from "mongoose";


export enum TransactionType{
    ADD_MONEY="add_money",
    WITHDRAW="withdraw",
    SEND_MONEY= "send_money",
    CASH_IN="cash_in",
    CASH_OUT='cash_out',
}
export enum TransactionStatus{
    PENDING='pending',
    COMPLETED='completed',
    REVERSED='reversed'
}
export interface ITransaction{
    _id:Types.ObjectId,
    type:TransactionType;
    sender:Types.ObjectId;
    receiver:Types.ObjectId;
    amount:number;
    fee?:number;
    commision?:number;
    commissionAgent?:Types.ObjectId;
    status:TransactionStatus;
    tansactionId:string,
    timestamp:Date
}