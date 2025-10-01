"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (Payload, secret, expiresIn) => {
    const token = jsonwebtoken_1.default.sign(Payload, secret, {
        expiresIn
    });
    return token;
};
exports.generateToken = generateToken;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const verifyToken = (token, secret) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const verifiedtoken = jsonwebtoken_1.default.verify(token, secret);
    return verifiedtoken;
};
exports.verifyToken = verifyToken;
