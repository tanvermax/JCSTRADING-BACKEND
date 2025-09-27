/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { productService } from "./product.service";
import { sendResponse } from "../../utils/sendresponse";
import { IProduct } from "./product.interface";



const creatProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // console.log("req.body in controller:", {
    //     file: req.file,
    //     body: req.body.data
    // });

    const payload: IProduct = {
        ...req.body,
        images: req.file?.path
    }

    const product = await productService.createProduct(payload);

    sendResponse(res, {

        statusCode: 201,
        message: "product created successfully",
        success: true,
        data: product,
    })
})

export const ProductController = {
    creatProduct
}