"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMoney = exports.withdrawfromWallet = exports.addMoneyToWallet = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const mongoose_1 = __importDefault(require("mongoose"));
const wallet_model_1 = require("./wallet.model");
const transaction_model_1 = require("../transaction/transaction.model");
const transaction_interface_1 = require("../transaction/transaction.interface");
const user_model_1 = require("../user/user.model");
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const wallet_interface_1 = require("./wallet.interface");
const COMMISSION_RATE = 0.015;
const SENDMONEY_FEE = 5;
// ?cashin
const addMoneyToWallet = (agentId, userId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const senderWallet = yield wallet_model_1.Wallet.findOne({ owner: userId }).session(session);
        if (!senderWallet) {
            throw new Error(' senderWallet not found.');
        }
        if (senderWallet.status === wallet_interface_1.WalletStatus.BLOCKED) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "This wallet is blocked and cannot perform transactions.");
        }
        // console.log("req.user in addMoneyToWallet",agentId,userId ,amount)
        // Find and update the agent's wallet to subtract the amount
        const agentWallet = yield wallet_model_1.Wallet.findOne({ 'owner': new mongoose_1.default.Types.ObjectId(agentId) }).session(session);
        if (!agentWallet) {
            throw new Error('Agent wallet not found.');
        }
        if (agentWallet.balance < amount) {
            throw new Error('Agent account does not have enough money.');
        }
        const agentUser = yield user_model_1.User.findById(agentId);
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
        yield agentWallet.save({ session });
        // Find and update the user's wallet to add the amount
        const userWallet = yield wallet_model_1.Wallet.findOne({ 'owner': new mongoose_1.default.Types.ObjectId(userId) }).session(session);
        if (!userWallet) {
            throw new Error('User wallet not found.');
        }
        if (userWallet.owner.equals(agentWallet.owner)) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "An agent cannot add money to their own wallet.");
        }
        // Add the amount to the user's balance
        userWallet.balance -= amountToTransfer;
        yield userWallet.save({ session });
        console.log("req.user in addMoneyToWallet", commission, amountToTransfer, amount);
        // Create the transaction record
        const transaction = new transaction_model_1.Transaction({
            sender: agentWallet.owner._id, // The agent is the sender
            receiver: new mongoose_1.default.Types.ObjectId(userId), // The user is the receiver
            amount: amount,
            type: transaction_interface_1.TransactionType.ADD_MONEY,
            status: transaction_interface_1.TransactionStatus.COMPLETED,
            commision: commission,
            transactionId: new mongoose_1.default.Types.ObjectId(),
            timestamp: new Date(),
            commissionAgent: agentId,
        });
        yield transaction.save({ session });
        // Commit the transaction
        yield session.commitTransaction();
        session.endSession();
        return userWallet;
    }
    catch (error) {
        // Abort the transaction in case of any error
        yield session.abortTransaction();
        session.endSession();
        console.error(error);
        throw error; // Re-throw the error to be handled by the calling function
    }
});
exports.addMoneyToWallet = addMoneyToWallet;
const withdrawfromWallet = (agentId, userId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Find the user's wallet
        // The user initiates the withdrawal, so we check their wallet first
        const userWallet = yield wallet_model_1.Wallet.findOne({ 'owner': new mongoose_1.default.Types.ObjectId(userId) }).session(session);
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
        const agentWallet = yield wallet_model_1.Wallet.findOne({ 'owner': new mongoose_1.default.Types.ObjectId(agentId) }).session(session);
        if (!agentWallet) {
            throw new Error('Agent wallet not found.');
        }
        const agentUser = yield user_model_1.User.findById(agentId);
        if (!agentUser || agentUser.role !== 'AGENT') {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Invalid agent.');
        }
        // Debit the full amount (including commission) from the user's wallet
        userWallet.balance -= totalWithdrawalAmount;
        yield userWallet.save({ session });
        // Credit the amount (without commission) to the agent's wallet
        agentWallet.balance += amount;
        yield agentWallet.save({ session });
        console.log("req.user in withdrawfromWallet hi", commission, totalWithdrawalAmount, amount);
        // Create the transaction record
        const transaction = new transaction_model_1.Transaction({
            sender: userWallet.owner._id, // The user is the sender
            receiver: agentWallet.owner._id, // The agent is the receiver
            amount: amount,
            type: transaction_interface_1.TransactionType.WITHDRAW,
            status: transaction_interface_1.TransactionStatus.COMPLETED,
            commision: commission, // Store the commission amount
            commissionAgent: agentId, // Link the agent who earned the commission
        });
        yield transaction.save({ session });
        // Commit the transaction
        yield session.commitTransaction();
        session.endSession();
        return userWallet;
    }
    catch (error) {
        // Abort the transaction in case of any error
        yield session.abortTransaction();
        session.endSession();
        console.error(error);
        throw error; // Re-throw the error to be handled by the calling function
    }
});
exports.withdrawfromWallet = withdrawfromWallet;
const sendMoney = (receiverId, userId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Find the sender's wallet first
        // console.log(" string,",receiverId, userId, amount)
        const senderWallet = yield wallet_model_1.Wallet.findOne({ 'owner': new mongoose_1.default.Types.ObjectId(userId) }).session(session);
        // console.log(" string,", senderWallet)
        if (!senderWallet) {
            throw new Error('Sender wallet not found.');
        }
        // Find the receiver's wallet
        const receiverWallet = yield wallet_model_1.Wallet.findOne({ 'owner': new mongoose_1.default.Types.ObjectId(receiverId) }).session(session);
        if (!receiverWallet) {
            throw new Error('Receiver wallet not found.');
        }
        console.log("userId", userId);
        console.log("receiverId", receiverId);
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
        yield senderWallet.save({ session });
        // Step 2: Credit the receiver's wallet
        receiverWallet.balance += amount; // Receiver gets the original amount
        yield receiverWallet.save({ session });
        // Create the transaction record
        const transaction = new transaction_model_1.Transaction({
            sender: senderWallet.owner._id,
            receiver: receiverWallet.owner._id,
            amount: amount,
            fee: SENDMONEY_FEE, // Store the fee
            type: transaction_interface_1.TransactionType.CASH_OUT,
            status: transaction_interface_1.TransactionStatus.COMPLETED,
        });
        yield transaction.save({ session });
        // Commit the transaction
        yield session.commitTransaction();
        session.endSession();
        return senderWallet;
    }
    catch (error) {
        // Abort the transaction if any step fails
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.sendMoney = sendMoney;
