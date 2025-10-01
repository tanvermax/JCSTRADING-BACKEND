import { Router } from "express";
import { Role } from "../user/user.interface";
import { cheakAuth } from "../../middleware/cheakAuth";
// import { agentController } from "./agent.controller";
// import { transactionController } from "../transaction/transaction.controller";




const router = Router();


router.post("/addmoney", cheakAuth(Role.AGENT), 
// agentController.addmoney
);
router.get('/history',cheakAuth(Role.AGENT),
//   transactionController.getHistory
);


export const AgentRouter = router;