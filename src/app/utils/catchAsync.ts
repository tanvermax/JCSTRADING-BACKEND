import { NextFunction, Request, Response } from "express";

 type AsynHandler = (req: Request, res: Response, next: NextFunction)=> Promise<void>


 export const catchAsync= (fn:AsynHandler)=>(req: Request, res: Response, next: NextFunction)=>{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Promise.resolve(fn(req,res,next)).catch((err:any)=>{
        console.log(err)
        next()
    })
 }