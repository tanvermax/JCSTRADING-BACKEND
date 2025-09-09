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
exports.userController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_service_1 = require("./user.service");
const catchAsync_1 = require("../../utils/catchAsync");
const sendresponse_1 = require("../../utils/sendresponse");
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const wallet_service_1 = require("../waller/wallet.service");
const user_model_1 = require("./user.model");
const wallet_model_1 = require("../waller/wallet.model");
const wallet_interface_1 = require("../waller/wallet.interface");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.userService.createUser(req.body);
    // console.log(user)
    (0, sendresponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        message: "User created successfully",
        success: true,
        data: user,
    });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const addmoney = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const { amount } = req.body;
        const { amount, agent } = req.body;
        // const data = req.body;
        // console.log("data for reciver", data)
        if (!req.user) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "user is not auhtenticated");
        }
        const userId = req.user.userId;
        // console.log("req.user in add money",agent,userId ,amount)
        if (!amount || amount <= 0) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid amount");
            // return res.status(400).json({ message: 'Invalid amount' });
        }
        const updatedWallet = yield (0, wallet_service_1.addMoneyToWallet)(agent, userId, amount);
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
const sendmoney = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { amount, reciverId } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        return (0, sendresponse_1.sendResponse)(res, {
            statusCode: http_status_codes_1.default.BAD_REQUEST,
            message: "User is not authenticated",
            success: false,
            data: null,
        });
    }
    const isUservalid = yield wallet_model_1.Wallet.findOne({ owner: userId });
    const isRecivervalid = yield wallet_model_1.Wallet.findOne({ owner: reciverId });
    if (!isUservalid || !isRecivervalid) {
        return (0, sendresponse_1.sendResponse)(res, {
            statusCode: http_status_codes_1.default.BAD_REQUEST,
            message: "Sender or receiver not found",
            success: false,
            data: null,
        });
    }
    if (isUservalid.status === wallet_interface_1.WalletStatus.BLOCKED || isRecivervalid.status === wallet_interface_1.WalletStatus.BLOCKED) {
        return (0, sendresponse_1.sendResponse)(res, {
            statusCode: http_status_codes_1.default.BAD_REQUEST,
            message: "User account is blocked",
            success: false,
            data: null,
        });
    }
    if (!amount || amount <= 0) {
        return (0, sendresponse_1.sendResponse)(res, {
            statusCode: http_status_codes_1.default.BAD_REQUEST,
            message: "Invalid amount",
            success: false,
            data: null,
        });
    }
    const Isreciverisagent = yield user_model_1.User.findOne({ _id: reciverId });
    if (!Isreciverisagent) {
        return (0, sendresponse_1.sendResponse)(res, {
            statusCode: http_status_codes_1.default.BAD_REQUEST,
            message: "Receiver user does not exist",
            success: false,
            data: null,
        });
    }
    if (Isreciverisagent.role === "AGENT") {
        return (0, sendresponse_1.sendResponse)(res, {
            statusCode: http_status_codes_1.default.FORBIDDEN,
            message: "You cannot send money to an agent",
            success: false,
            data: null,
        });
    }
    const updatedWallet = yield (0, wallet_service_1.sendMoney)(reciverId, userId, amount);
    (0, sendresponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        message: "Money transfer successful",
        success: true,
        data: updatedWallet,
    });
}));
const userwithdrawmoney = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { agent, amount } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is not authenticated");
    }
    if (!amount || amount <= 0) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid amount");
    }
    // 1. Validate the user's wallet status
    const userWallet = yield wallet_model_1.Wallet.findOne({ owner: userId });
    if (!userWallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User wallet not found");
    }
    if (userWallet.status === wallet_interface_1.WalletStatus.BLOCKED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User account is blocked. Cannot withdraw money.");
    }
    // 2. Validate the agent's wallet status
    const agentWallet = yield wallet_model_1.Wallet.findOne({ owner: agent });
    if (!agentWallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Agent wallet not found");
    }
    if (agentWallet.status === wallet_interface_1.WalletStatus.SUSPEND) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Agent account is SUSPEND. Cannot process withdrawal.");
    }
    const updatedWallet = yield (0, wallet_service_1.withdrawfromWallet)(agent, userId, amount);
    (0, sendresponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        message: "Withdrawal request submitted successfully",
        success: true,
        data: updatedWallet,
    });
}));
exports.userController = {
    createUser, addmoney, userwithdrawmoney, sendmoney
    // getallhistory
};
