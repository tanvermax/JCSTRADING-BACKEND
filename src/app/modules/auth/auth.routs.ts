import { NextFunction, Request, Response, Router } from "express";
import { AuthController } from "./auth.controller";
import passport from "passport";
import { envVarse } from "../../config/env";


const router = Router();


router.post("/login",AuthController.credentialsLogin)
router.post("/logout", AuthController.logout)
router.post("/refresh-token", AuthController.getNewAccessToken)




router.get("/googl",async(req: Request, res: Response, next: NextFunction)=>{
    const rediret = req.query.redirect || "/"
    passport.authenticate("google",{scope:["profile","email"],state:rediret as string})(req, res, next)
})

router.get("/google/callback", passport.authenticate("google",
     { failureRedirect: `${envVarse.FRONT_END_URL}/login?error=There is some
     issues with your account. Please contact with out support team!` }), AuthController.googlCallbackConmtroll)

export const AuthRoute = router;