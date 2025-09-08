import httpStatus from 'http-status-codes';
import mongoose from "mongoose";
import { Wallet } from "./wallet.model";
import { Transaction } from "../transaction/transaction.model";
import { TransactionStatus, TransactionType } from "../transaction/transaction.interface";
import { User } from "../user/user.model";
import AppError from "../../errorHelper/AppError";
import { WalletStatus } from './wallet.interface';


const COMMISSION_RATE = 0.015;
const SENDMONEY_FEE = 5;


// ?cashin
export const addMoneyToWallet = async (agentId: string, userId: string, amount: number) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const senderWallet = await Wallet.findOne({ owner: userId }).session(session);
        if (!senderWallet) {
            throw new Error(' senderWallet not found.');

        }
        if (senderWallet.status === WalletStatus.BLOCKED) {
            throw new AppError(httpStatus.FORBIDDEN, "This wallet is blocked and cannot perform transactions.");
        }
        // console.log("req.user in addMoneyToWallet",agentId,userId ,amount)

        // Find and update the agent's wallet to subtract the amount
        const agentWallet = await Wallet.findOne({ 'owner': new mongoose.Types.ObjectId(agentId) }).session(session);

        if (!agentWallet) {
            throw new Error('Agent wallet not found.');
        }
        if (agentWallet.balance < amount) {
            throw new Error('Agent account does not have enough money.');
        }


        const agentUser = await User.findById(agentId);

        if (!agentUser) {
            throw new Error('there is no such agent.');
        }
        if (agentUser.role !== 'USER') {
            throw new Error('User is not an agent and cannot perform this action.');
        }

        const commission = amount * COMMISSION_RATE;
        const amountToTransfer = amount - commission;



        // Subtract the amount from the agent's balance
        agentWallet.balance += amountToTransfer;

        await agentWallet.save({ session });


        // Find and update the user's wallet to add the amount
        const userWallet = await Wallet.findOne({ 'owner': new mongoose.Types.ObjectId(userId) }).session(session);

        if (!userWallet) {
            throw new Error('User wallet not found.');
        }

        if (userWallet.owner.equals(agentWallet.owner)) {
            throw new AppError(httpStatus.BAD_REQUEST, "An agent cannot add money to their own wallet.");
        }

        // Add the amount to the user's balance
        userWallet.balance -= amountToTransfer;
        await userWallet.save({ session });

        console.log("req.user in addMoneyToWallet", commission, amountToTransfer, amount)

        // Create the transaction record
        const transaction = new Transaction({
            sender: agentWallet.owner._id, // The agent is the sender
            receiver: new mongoose.Types.ObjectId(userId), // The user is the receiver
            amount: amount,
            type: TransactionType.ADD_MONEY,
            status: TransactionStatus.COMPLETED,
            commision: commission,
            transactionId: new mongoose.Types.ObjectId(),
            timestamp: new Date(),
            commissionAgent: agentId,
        });
        await transaction.save({ session });

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        return userWallet;
    } catch (error) {
        // Abort the transaction in case of any error
        await session.abortTransaction();
        session.endSession();
        console.error(error);
        throw error; // Re-throw the error to be handled by the calling function
    }
};


export const withdrawfromWallet = async (agentId: string, userId: string, amount: number) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Find the user's wallet
        // The user initiates the withdrawal, so we check their wallet first
        const userWallet = await Wallet.findOne({ 'owner': new mongoose.Types.ObjectId(userId) }).session(session);

        if (!userWallet) {
            throw new Error('User wallet not found.');
        }

        // Calculate the commission
        const commission = amount * COMMISSION_RATE;
        const totalWithdrawalAmount = amount + commission; // User pays the fee on top of the amount

        // Check if user has enough balance for the withdrawal plus commission
        if (userWallet.balance < totalWithdrawalAmount) {
            throw new Error('User account does not have enough money for this withdrawal.');
        }

        // Find the agent's wallet
        const agentWallet = await Wallet.findOne({ 'owner': new mongoose.Types.ObjectId(agentId) }).session(session);

        if (!agentWallet) {
            throw new Error('Agent wallet not found.');
        }

        const agentUser = await User.findById(agentId);
        if (!agentUser || agentUser.role !== 'AGENT') {
            throw new AppError(httpStatus.BAD_REQUEST,'Invalid agent.');
        }

        // Debit the full amount (including commission) from the user's wallet
        userWallet.balance -= totalWithdrawalAmount;
        await userWallet.save({ session });

        // Credit the amount (without commission) to the agent's wallet
        agentWallet.balance += amount;
        await agentWallet.save({ session });

        console.log("req.user in withdrawfromWallet hi", commission, totalWithdrawalAmount, amount)

        // Create the transaction record
        const transaction = new Transaction({
            sender: userWallet.owner._id, // The user is the sender
            receiver: agentWallet.owner._id, // The agent is the receiver
            amount: amount,
            type: TransactionType.WITHDRAW,
            status: TransactionStatus.COMPLETED,
            commision: commission, // Store the commission amount
            commissionAgent: agentId, // Link the agent who earned the commission
        });
        await transaction.save({ session });

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        return userWallet;

    } catch (error) {
        // Abort the transaction in case of any error
        await session.abortTransaction();
        session.endSession();
        console.error(error);
        throw error; // Re-throw the error to be handled by the calling function
    }
};


export const sendMoney = async (receiverId: string, userId: string, amount: number) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Find the sender's wallet first
        // console.log(" string,",receiverId, userId, amount)
        const senderWallet = await Wallet.findOne({ 'owner': new mongoose.Types.ObjectId(userId) }).session(session);
        // console.log(" string,", senderWallet)

        if (!senderWallet) {
            throw new Error('Sender wallet not found.');
        }

        // Find the receiver's wallet
        const receiverWallet = await Wallet.findOne({ 'owner': new mongoose.Types.ObjectId(receiverId) }).session(session);
        if (!receiverWallet) {
            throw new Error('Receiver wallet not found.');
        }

        console.log("userId",userId)
        console.log("receiverId",receiverId);


        // Ensure sender and receiver are not the same person
        if (userId === receiverId) {
            throw new Error('Cannot send money to yourself.');
        }

        // Calculate the total amount to debit (amount + fee)
        const totalDebitAmount = amount + SENDMONEY_FEE;

        // CRITICAL VALIDATION: Check if the sender has enough balance
        if (senderWallet.balance < totalDebitAmount) {
            throw new Error('Insufficient balance to send money.');
        }

        // Step 1: Debit the sender's wallet first
        senderWallet.balance -= totalDebitAmount;
        await senderWallet.save({ session });

        // Step 2: Credit the receiver's wallet
        receiverWallet.balance += amount; // Receiver gets the original amount
        await receiverWallet.save({ session });

        // Create the transaction record
        const transaction = new Transaction({
            sender: senderWallet.owner._id,
            receiver: receiverWallet.owner._id,
            amount: amount,
            fee: SENDMONEY_FEE, // Store the fee
            type: TransactionType.CASH_OUT,
            status: TransactionStatus.COMPLETED,
        });
        await transaction.save({ session });

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        return senderWallet;

    } catch (error) {
        // Abort the transaction if any step fails
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
}