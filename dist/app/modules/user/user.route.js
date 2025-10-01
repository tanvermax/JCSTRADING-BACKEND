"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
/* eslint-disable @typescript-eslint/no-unused-expressions */
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const cheakAuth_1 = require("../../middleware/cheakAuth");
const user_interface_1 = require("./user.interface");
// import { createUserZodSchema } from "./user.validation";
// import { validateRequest } from "../../middleware/validationRequest";
// import { cheakAuth} from "../../middleware/cheakAuth";
// import { Role } from "./user.interface";
// import { transactionController } from "../transaction/transaction.controller";
const router = (0, express_1.Router)();
router.post("/register", 
//  validateRequest(createUserZodSchema)
user_controller_1.userController.createUser);
router.get("/me", (0, cheakAuth_1.cheakAuth)(...Object.values(user_interface_1.Role)), user_controller_1.userController.getMe);
// router.post("/sendmoney",cheakAuth(Role.USER),userController.sendmoney);
// router.post("/withdraw",cheakAuth(Role.USER),userController.userwithdrawmoney);
// router.get('/history',cheakAuth(Role.USER),  transactionController.getHistory);
exports.UserRoutes = router;
