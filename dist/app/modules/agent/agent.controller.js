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
exports.agentController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const sendresponse_1 = require("../../utils/sendresponse");
const wallet_service_1 = require("../waller/wallet.service");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const addmoney = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const { amount } = req.body;
        const { amount, userId } = req.body;
        // const data = req.body;
        // console.log("data for reciver", data)
        if (!req.user) {
            // eslint-disable-next-line no-console
            console.log("req.user", req.user);
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Agent is not auhtenticated");
        }
        const agentId = req.user.userId;
        // console.log("req.user in add money",agent,userId ,amount)
        if (!amount || amount <= 0) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid amount");
            // return res.status(400).json({ message: 'Invalid amount' });
        }
        const updatedWallet = yield (0, wallet_service_1.addMoneyToWallet)(userId, agentId, amount);
        // console.log("updatedWallet", updatedWallet)
        (0, sendresponse_1.sendResponse)(res, {
            statusCode: http_status_codes_1.default.CREATED,
            message: "Money added request given successfully",
            success: true,
            data: updatedWallet,
        });
    }
    catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
    }
}));
exports.agentController = {
    addmoney
};
