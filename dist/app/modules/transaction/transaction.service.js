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
exports.transactionService = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const transaction_model_1 = require("./transaction.model");
const getallhistory = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // const {userId} = req.body.id
    // console.log("userId getallhistory", userId)
    const history = yield transaction_model_1.Transaction.find({
        $or: [
            { sender: userId },
            { receiver: userId }
        ]
    }).sort({ createdAt: -1 });
    if (!history) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "No transactions found.");
    }
    const totalHistory = yield transaction_model_1.Transaction.countDocuments({
        $or: [
            { sender: userId },
            { receiver: userId }
        ]
    });
    return {
        data: history,
        meta: {
            totalHistory: totalHistory
        }
    };
});
exports.transactionService = {
    getallhistory
};
