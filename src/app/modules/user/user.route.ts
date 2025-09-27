/* eslint-disable @typescript-eslint/no-unused-expressions */
import {Router } from "express";
import { userController } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middleware/validationRequest";
import { cheakAuth} from "../../middleware/cheakAuth";
import { Role } from "./user.interface";
import { transactionController } from "../transaction/transaction.controller";

const router = Router();





router.post("/register", validateRequest(createUserZodSchema), userController.createUser)
router.post("/sendmoney",cheakAuth(Role.USER),userController.sendmoney);
router.post("/withdraw",cheakAuth(Role.USER),userController.userwithdrawmoney);
router.get('/history',cheakAuth(Role.USER),  transactionController.getHistory);

export const UserRoutes = router;
