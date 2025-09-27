"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = require("./app/routes");
const globalerrorhandler_1 = require("./app/middleware/globalerrorhandler");
const notFounde_1 = __importDefault(require("./app/middleware/notFounde"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api/v1", routes_1.router);
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to JCS Trading Database backend system"
    });
});
app.use(globalerrorhandler_1.globalErrorHandler);
app.use(notFounde_1.default);
exports.default = app;
