import mongoose, { model, Schema } from "mongoose"
import { ITransaction, TransactionStatus, TransactionType } from "./transaction.interface"
import crypto from 'crypto';

const transactionSchema = new Schema<ITransaction>({


    type: {
        type: String,
        enum: Object.values(TransactionType),
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    amount: { type: Number, required: true },
    fee: {
        type: Number,
        required: false,
    },
    commision: { type: Number,default:0 },

     commissionAgent: { // The agent who earned the commission
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false, // Not all transactions will have an agent
    },
    status: {
        type: String,
        enum: Object.values(TransactionStatus),
        default: TransactionStatus.PENDING,
        require: true
    },
    tansactionId: {
        type: String,
        required: true,
        unique: true,
        default: () => crypto.randomUUID()
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },

}, {
    timestamps: true,
})

export const Transaction = model<ITransaction>("Transaction", transactionSchema)