import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status-codes"
import AppError from "../errorHelper/AppError";


const notFounde = (req: Request, res: Response, next: NextFunction) => {
    //     res.status(httpStatus.NOT_FOUND).json({
    //     success:false,
    //     message:"ROutte Not founde"
    // })
    next(new AppError(httpStatus.NOT_FOUND, 'ROutte Not founde'));
}
export default notFounde;