// import  httpStatus  from 'http-status-codes';
// import { NextFunction, Request, Response } from "express";
// import { catchAsync } from "../../utils/catchAsync";
// import { sendResponse } from "../../utils/sendresponse";
// import { transactionService } from './transaction.service';



// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// const getHistory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

//     try {

//         const userId = req.user.userId;

//         const allhistroy = await transactionService.getallhistory(userId);

//         sendResponse(res, {
//             statusCode: httpStatus.CREATED,
//             message: "All tansactrion data recived successfully",
//             success: true,
//             data: allhistroy,
//         })

//     } catch (error) {
//         console.log(error)
//     }
// })

// export const transactionController = {
//     getHistory
// }