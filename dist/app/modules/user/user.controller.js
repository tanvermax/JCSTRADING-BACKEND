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
exports.userController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_service_1 = require("./user.service");
const catchAsync_1 = require("../../utils/catchAsync");
const sendresponse_1 = require("../../utils/sendresponse");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.userService.createUser(req.body);
    console.log(user);
    (0, sendresponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        message: "User created successfully",
        success: true,
        data: user,
    });
}));
const getMe = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const result = yield user_service_1.userService.getMe(decodedToken.userId);
    // res.status(httpStatus.OK).json({
    //     success: true,
    //     message: "All Users Retrieved Successfully",
    //     data: users
    // })
    (0, sendresponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Your profile Retrieved Successfully",
        data: result.data
    });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const addmoney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         // const { amount } = req.body;
//         const { amount, agent } = req.body;
//         // const data = req.body;
//         // console.log("data for reciver", data)
//         if (!req.user) {
//             throw new AppError(httpStatus.BAD_REQUEST, "user is not auhtenticated");
//         }
//         const userId = req.user.userId;
//         // console.log("req.user in add money",agent,userId ,amount)
//         if (!amount || amount <= 0) {
//             throw new AppError(httpStatus.BAD_REQUEST, "Invalid amount")
//             // return res.status(400).json({ message: 'Invalid amount' });
//         }
//         const updatedWallet = await addMoneyToWallet(agent, userId, amount);
//         // console.log("updatedWallet", updatedWallet)
//         sendResponse(res, {
//             statusCode: httpStatus.CREATED,
//             message: "Money added request given successfully",
//             success: true,
//             data: updatedWallet,
//         })
//     } catch (error) {
//         // eslint-disable-next-line no-console
//         console.log(error)
//     }
// })
// const sendmoney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const { amount, reciverId } = req.body;
//     const userId = req.user?.userId;
//     if (!userId) {
//         return sendResponse(res, {
//             statusCode: httpStatus.BAD_REQUEST,
//             message: "User is not authenticated",
//             success: false,
//             data: null,
//         });
//     }
//     const isUservalid = await Wallet.findOne({ owner: userId });
//     const isRecivervalid = await Wallet.findOne({ owner: reciverId });
//     if (!isUservalid || !isRecivervalid) {
//         return sendResponse(res, {
//             statusCode: httpStatus.BAD_REQUEST,
//             message: "Sender or receiver not found",
//             success: false,
//             data: null,
//         });
//     }
//     if (isUservalid.status === WalletStatus.BLOCKED || isRecivervalid.status === WalletStatus.BLOCKED) {
//         return sendResponse(res, {
//             statusCode: httpStatus.BAD_REQUEST,
//             message: "User account is blocked",
//             success: false,
//             data: null,
//         });
//     }
//     if (!amount || amount <= 0) {
//         return sendResponse(res, {
//             statusCode: httpStatus.BAD_REQUEST,
//             message: "Invalid amount",
//             success: false,
//             data: null,
//         });
//     }
//     const Isreciverisagent = await User.findOne({ _id: reciverId });
//     if (!Isreciverisagent) {
//         return sendResponse(res, {
//             statusCode: httpStatus.BAD_REQUEST,
//             message: "Receiver user does not exist",
//             success: false,
//             data: null,
//         });
//     }
//     if (Isreciverisagent.role === "AGENT") {
//         return sendResponse(res, {
//             statusCode: httpStatus.FORBIDDEN,
//             message: "You cannot send money to an agent",
//             success: false,
//             data: null,
//         });
//     }
//     const updatedWallet = await sendMoney(reciverId, userId, amount);
//     sendResponse(res, {
//         statusCode: httpStatus.CREATED,
//         message: "Money transfer successful",
//         success: true,
//         data: updatedWallet,
//     });
// });
// const userwithdrawmoney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const { agent, amount } = req.body;
//     const userId = req.user?.userId;
//     if (!userId) {
//         throw new AppError(httpStatus.BAD_REQUEST, "User is not authenticated");
//     }
//     if (!amount || amount <= 0) {
//         throw new AppError(httpStatus.BAD_REQUEST, "Invalid amount");
//     }
//     // 1. Validate the user's wallet status
//     const userWallet = await Wallet.findOne({ owner: userId });
//     if (!userWallet) {
//         throw new AppError(httpStatus.NOT_FOUND, "User wallet not found");
//     }
//     if (userWallet.status === WalletStatus.BLOCKED) {
//         throw new AppError(httpStatus.BAD_REQUEST, "User account is blocked. Cannot withdraw money.");
//     }
//     // 2. Validate the agent's wallet status
//     const agentWallet = await Wallet.findOne({ owner: agent });
//     if (!agentWallet) {
//         throw new AppError(httpStatus.NOT_FOUND, "Agent wallet not found");
//     }
//     if (agentWallet.status === WalletStatus.SUSPEND) {
//         throw new AppError(httpStatus.BAD_REQUEST, "Agent account is SUSPEND. Cannot process withdrawal.");
//     }
//     const updatedWallet = await withdrawfromWallet(agent, userId, amount);
//     sendResponse(res, {
//         statusCode: httpStatus.CREATED,
//         message: "Withdrawal request submitted successfully",
//         success: true,
//         data: updatedWallet,
//     });
// });
exports.userController = {
    createUser, getMe,
    // addmoney, userwithdrawmoney, sendmoney
    // getallhistory
};
