import { Router } from "express"
import { AuthRoute } from "../modules/auth/auth.routs";
import { UserRoutes } from "../modules/user/user.route";
import { TransactionRoute } from "../modules/transaction/transaction.route";
import { AgentRouter } from "../modules/agent/agent.route";
import { AdminRouter } from "../modules/admin/admin.routs";
import { ProductRoute } from "../modules/product/product.route";
import { OtpRouter } from "../modules/otp/otp.routs";

export const router = Router();

const moduleRoutes = [
    {
        path: "/user",
        route: UserRoutes
    },
    {
        path: "/agent",
        route: AgentRouter
    },
    {
        path: "/auth",
        route: AuthRoute
    },
    {
        path: "/transaction",
        route: TransactionRoute
    },
    {
        path: "/admin",
        route: AdminRouter
    },
    {
        path: "/product",
        route: ProductRoute
    },
    {
        path:"/otp",
        route:OtpRouter
    }
]



moduleRoutes.forEach((route) => {
    {
        router.use(route.path, route.route)

    }
});