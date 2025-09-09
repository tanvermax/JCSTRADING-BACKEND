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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_model_1 = require("./user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const wallet_model_1 = require("../waller/wallet.model");
const mongoose_1 = __importDefault(require("mongoose"));
// import { Transaction } from '../transaction/transaction.model';
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { email, password } = payload, rest = __rest(payload, ["email", "password"]);
        const hashpassword = yield bcryptjs_1.default.hash(password, 10);
        const isUserExit = yield user_model_1.User.findOne({ email });
        if (isUserExit) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User alredy exit in");
        }
        const authprovider = { provider: "creadentials", providerId: email };
        const user = yield user_model_1.User.create([
            Object.assign({ email, password: hashpassword, auth: [authprovider] }, rest)
        ], { session });
        // console.log(user)
        const ownerInfo = {
            _id: user[0]._id,
            name: user[0].name,
            email: user[0].email,
            role: user[0].role
        };
        yield wallet_model_1.Wallet.create([
            {
                owner: ownerInfo,
                balance: 50
            }
        ], { session });
        yield session.commitTransaction();
        session.endSession();
        return user[0];
    }
    catch (error) {
        console.log(error);
    }
});
exports.userService = {
    createUser
};
