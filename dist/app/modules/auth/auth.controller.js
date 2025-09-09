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
exports.AuthController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendresponse_1 = require("../../utils/sendresponse");
const auth_service_1 = require("./auth.service");
const user_model_1 = require("../user/user.model");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const credentialsLogin = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const loginInfo = yield auth_service_1.AuthService.credentialsLogin(req.body);
    const { email } = req.body;
    const user = yield user_model_1.User.find({ email });
    if (!user) {
        // Handle case where user is not found, although AuthService should likely handle this.
        return (0, sendresponse_1.sendResponse)(res, {
            success: false,
            statusCode: http_status_codes_1.default.NOT_FOUND,
            message: "User not found.",
            data: null
        });
    }
    const role = user[0].role;
    const message = `${role} Log in Successfully`;
    (0, sendresponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message,
        data: loginInfo
    });
}));
exports.AuthController = {
    credentialsLogin
};
