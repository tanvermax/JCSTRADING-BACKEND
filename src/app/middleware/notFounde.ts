 import { Request, Response } from "express"
import httpStatus from "http-status-codes"
 
 
 const notFounde = (req:Request, res:Response)=>{
    res.status(httpStatus.NOT_FOUND).json({
    success:false,
    message:"ROutte Not founde"
})
}
export default notFounde;