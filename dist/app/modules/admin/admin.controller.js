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
exports.adminController = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendresponse_1 = require("../../utils/sendresponse");
const admin_service_1 = require("./admin.service");
const user_model_1 = require("../user/user.model");
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("alluser from controller")
    const alluser = yield admin_service_1.adminService.getalluser();
    (0, sendresponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        message: "All User data recived successfully",
        success: true,
        data: alluser,
    });
}));
const getWallets = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("alluser from controller")
    const alluser = yield admin_service_1.adminService.allwallets();
    (0, sendresponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        message: "All wallets data recived successfully",
        success: true,
        data: alluser,
    });
}));
const getTransactions = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("alluser from controller")
    const query = req.query;
    // const seach = req.query
    console.log(query);
    const alluser = yield admin_service_1.adminService.allTansactions(query || undefined);
    (0, sendresponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        message: "All Transactions data recived successfully",
        success: true,
        data: alluser,
    });
}));
const updateWalletStatus = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("alluser from controller")
    const { userId } = req.params;
    const { status } = req.body;
    const alluser = yield admin_service_1.adminService.updateWallet(userId, status);
    (0, sendresponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        message: `Wallet for user ${userId} has been ${status.toLowerCase()}.`,
        success: true,
        data: alluser,
    });
}));
const updateagentWallet = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("alluser from controller")
    const { agentId } = req.params;
    const { status } = req.body;
    console.log("userId", agentId);
    const IsAgentUser = yield user_model_1.User.findOne({ _id: agentId });
    // console.log("IsAgentUser",IsAgentUser.role)
    // console.log("status",status)
    if (!IsAgentUser) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "agent does not exit");
    }
    if (IsAgentUser.role === "USER") {
        throw new AppError_1.default(http_status_codes_1.default.BAD_GATEWAY, "this agent is user, it cant be suspened");
    }
    const alluser = yield admin_service_1.adminService.updateWallet(agentId, status);
    (0, sendresponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        message: `Wallet for agent ${IsAgentUser.name} has been ${status.toLowerCase()}.`,
        success: true,
        data: alluser,
    });
}));
exports.adminController = {
    getAllUser, getWallets, getTransactions, updateWalletStatus, updateagentWallet
    // getallhistory
};
// Convert query to Record<string, string>
// const stringQuery: Record<string, string> = {};
// Object.keys(query).forEach(key => {
//     const value = query[key];
//     if (typeof value === 'string') {
//         stringQuery[key] = value;
//     } else if (Array.isArray(value)) {
//         stringQuery[key] = value.join(',');
//     } else if (typeof value === 'object' && value !== null) {
//         stringQuery[key] = JSON.stringify(value);
//     } else if (value !== undefined) {
//         stringQuery[key] = String(value);
//     }
// });
// console.log("uiserid", stringQuery);
