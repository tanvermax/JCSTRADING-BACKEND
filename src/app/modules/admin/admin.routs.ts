import { Router } from "express";
import { cheakAuth } from "../../middleware/cheakAuth";
import { Role } from "../user/user.interface";
import { adminController } from "./admin.controller";





const router = Router();


router.get("/alluser", cheakAuth(Role.ADMIN), adminController.getAllUser);
router.get("/wallets", cheakAuth(Role.ADMIN), adminController.getWallets);
router.get("/transactions", cheakAuth(Role.ADMIN), adminController.getTransactions);
router.patch("/wallet/user/:userId",cheakAuth(Role.ADMIN),adminController.updateWalletStatus)
router.patch("/wallet/agent/:agentId",cheakAuth(Role.ADMIN),adminController.updateagentWallet)
export const AdminRouter = router;