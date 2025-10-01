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
exports.AuthService = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const user_model_1 = require("../user/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../../utils/jwt");
const env_1 = require("../../config/env");
const user_token_1 = require("../../utils/user.token");
const credentialsLogin = (payoad) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payoad;
    const IsUserExit = yield user_model_1.User.findOne({ email });
    if (!IsUserExit) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "user des not exit");
    }
    if (!IsUserExit.password) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User password not found");
    }
    const isPasswordMatch = yield bcryptjs_1.default.compare(password, IsUserExit.password);
    if (!isPasswordMatch) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "user password does not macth");
    }
    const jwtPayload = {
        email: IsUserExit.email,
        role: IsUserExit.role,
        userId: IsUserExit._id
    };
    const accesToken = (0, jwt_1.generateToken)(jwtPayload, env_1.envVarse.JWT_ACCES_SECRET, env_1.envVarse.JWT_ACCES_EXPIRE);
    const { password: pass } = IsUserExit, rest = __rest(IsUserExit, ["password"]);
    return {
        accesToken
    };
});
const getNewAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const newAccessToken = yield (0, user_token_1.createNewAccessTokenWithrefreshtoken)(refreshToken);
    return {
        accessToken: newAccessToken
    };
});
exports.AuthService = {
    credentialsLogin, getNewAccessToken
};
