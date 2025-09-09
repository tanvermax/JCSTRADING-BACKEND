"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cheakAuth = void 0;
const AppError_1 = __importDefault(require("../errorHelper/AppError"));
const jwt_1 = require("../utils/jwt");
// import { Role } from "../modules/user/user.interface";
const env_1 = require("../config/env");
const cheakAuth = (...authRoles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const accestoken = req.headers.authorization;
            if (!accestoken) {
                throw new AppError_1.default(403, "no Token found");
            }
            const decodedToken = (0, jwt_1.verifyToken)(accestoken, env_1.envVarse.JWT_ACCES_SECRET);
            // const IsUserExit = await User.findOne({ email: decodedToken.email });
            // This is the correct way to handle role-based authorization.
            // It checks if any roles were passed to the middleware and if the user's role is included.
            if (authRoles.length > 0 && !authRoles.includes(decodedToken.role)) {
                throw new AppError_1.default(403, "You are not authorized to perform this action.");
            }
            // console.log("Role",Role)
            // console.log("decodedToken",decodedToken)
            // if ((decodedToken as JwtPayload).role !== Role.ADMIN && (decodedToken as JwtPayload).role !== Role.AGENT) {
            //     throw new AppError(403, "you are not permited to see all user")
            // }
            // console.log(" in user route", decodedToken)
            req.user = decodedToken;
            next();
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    });
};
exports.cheakAuth = cheakAuth;
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
