import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelper/AppError";
import { verifyToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
// import { Role } from "../modules/user/user.interface";
import { envVarse } from "../config/env";



declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            user?: any;
        }
    }
}

export const cheakAuth = (...authRoles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accestoken = req.headers.authorization

            if (!accestoken) {
                throw new AppError(403, "no Token found")
            }

            const decodedToken = verifyToken(accestoken, envVarse.JWT_ACCES_SECRET) as JwtPayload;
            // const IsUserExit = await User.findOne({ email: decodedToken.email });

            // This is the correct way to handle role-based authorization.
            // It checks if any roles were passed to the middleware and if the user's role is included.
            if (authRoles.length > 0 && !authRoles.includes(decodedToken.role)) {
                throw new AppError(403, "You are not authorized to perform this action.");
            }
            // console.log("Role",Role)
            // console.log("decodedToken",decodedToken)
            // if ((decodedToken as JwtPayload).role !== Role.ADMIN && (decodedToken as JwtPayload).role !== Role.AGENT) {
            //     throw new AppError(403, "you are not permited to see all user")
            // }
            // console.log(" in user route", decodedToken)

            req.user = decodedToken;
            next();
        } catch (error) {
            console.log(error)
            next(error);
        }
    }
}

// export const cheakAuthuser = (...authRoles: string[]) => {
//     return async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             const accestoken = req.headers.authorization

//             if (!accestoken) {
//                 throw new AppError(403, "no Token found")
//             }

//             const decodedToken = verifyToken(accestoken, envVarse.JWT_ACCES_SECRET) as JwtPayload;
//             // const IsUserExit = await User.findOne({ email: decodedToken.email });

//             // This is the correct way to handle role-based authorization.
//             // It checks if any roles were passed to the middleware and if the user's role is included.
//             if (authRoles.length > 0 && !authRoles.includes(decodedToken.role)) {
//                 throw new AppError(403, "You are not authorized to perform this action.");
//             }
//             // console.log("Role",Role)
//             console.log("decodedToken",decodedToken)
//             if ((decodedToken as JwtPayload).role !== Role.USER ) {
//                 throw new AppError(403, "you are not permited to see all user")
//             }
//             // console.log(" in user route", decodedToken)

//             req.user = decodedToken;
//             next();
//         } catch (error) {
//             console.log(error)
//             next(error);
//         }
//     }
// }