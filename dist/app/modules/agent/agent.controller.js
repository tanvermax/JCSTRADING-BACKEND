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
const wallet_model_1 = require("../waller/wallet.model");
const wallet_interface_1 = require("../waller/wallet.interface");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const addmoney = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { amount, userId } = req.body;
    const agentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    // 1. Validate Agent Authentication
    if (!agentId) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Agent is not authenticated");
    }
    // 2. Validate Amount
    if (!amount || amount <= 0) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid amount");
    }
    // 3. Validate Wallet Statuses
    const agentWallet = yield wallet_model_1.Wallet.findOne({ owner: agentId });
    if (!agentWallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Agent wallet not found");
    }
    if (agentWallet.status === wallet_interface_1.WalletStatus.SUSPEND) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Agent's account is SUSPEND. Cannot add money.");
    }
    const userWallet = yield wallet_model_1.Wallet.findOne({ owner: userId });
    if (!userWallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User wallet not found");
    }
    if (userWallet.status === wallet_interface_1.WalletStatus.BLOCKED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User's account is blocked. Cannot add money.");
    }
    // 4. Perform the Transaction
    const updatedWallet = yield (0, wallet_service_1.addMoneyToWallet)(userId, agentId, amount);
    // 5. Send Success Response
    (0, sendresponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        message: "Money added request given successfully",
        success: true,
        data: updatedWallet,
    });
}));
exports.agentController = {
    addmoney
};
