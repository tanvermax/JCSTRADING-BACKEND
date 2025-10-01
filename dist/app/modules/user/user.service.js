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
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = payload, rest = __rest(payload, ["email", "password"]);
        console.log("USER :", payload);
        const isUserExit = yield user_model_1.User.findOne({ email });
        if (isUserExit) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User alredy exit in");
        }
        const hashpassword = yield bcryptjs_1.default.hash(password, 10);
        const authprovider = { provider: "creadentials", providerId: email };
        const user = yield user_model_1.User.create([
            Object.assign({ email, password: hashpassword, auths: [authprovider] }, rest)
        ]);
        return user;
    }
    catch (error) {
        console.log(error);
    }
});
const getMe = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId).select("-password");
    return {
        data: user
    };
});
exports.userService = {
    createUser, getMe
};
