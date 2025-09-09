"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// eslint-disable-next-line no-undef
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const notFounde = (req, res) => {
    res.status(http_status_codes_1.default.NOT_FOUND).json({
        success: false,
        message: "ROute Not founde"
    });
};
// eslint-disable-next-line no-undef
exports.default = notFounde;
