"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
/* eslint-disable @typescript-eslint/no-unused-expressions */
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const validationRequest_1 = require("../../middleware/validationRequest");
const cheakAuth_1 = require("../../middleware/cheakAuth");
const user_interface_1 = require("./user.interface");
const transaction_controller_1 = require("../transaction/transaction.controller");
const router = (0, express_1.Router)();
router.post("/register", (0, validationRequest_1.validateRequest)(user_validation_1.createUserZodSchema), user_controller_1.userController.createUser);
router.post("/sendmoney", (0, cheakAuth_1.cheakAuth)(user_interface_1.Role.USER), user_controller_1.userController.sendmoney);
router.post("/withdraw", (0, cheakAuth_1.cheakAuth)(), user_controller_1.userController.userwithdrawmoney);
router.get('/history', (0, cheakAuth_1.cheakAuth)(user_interface_1.Role.USER), transaction_controller_1.transactionController.getHistory);
exports.UserRoutes = router;
