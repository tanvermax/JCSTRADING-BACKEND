import { Router } from "express";
import { transactionController } from "./transaction.controller";
import { cheakAuth } from "../../middleware/cheakAuth";
import { Role } from "../user/user.interface";



const router = Router();

router.get('/history',cheakAuth(Role.ADMIN),  transactionController.getHistory);


export const TransactionRoute = router;
