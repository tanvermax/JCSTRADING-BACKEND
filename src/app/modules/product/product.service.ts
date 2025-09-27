// src/types/product.ts
import httpStatus from 'http-status-codes';

import AppError from "../../errorHelper/AppError";
import { IProduct } from "./product.interface";
import { Product } from "./product.model";


const createProduct = async (payload: IProduct) => {
    const ISProductExit = await Product.findOne({ name: payload.title });

    if (ISProductExit) {
        throw new AppError(httpStatus.BAD_REQUEST, "Product alredy exit in")
    }

   
    const baseSlug = payload.title.toLocaleLowerCase().split(" ").join("-");
    let counter = 0;
    let slug = `${baseSlug}-product`;
    while (await Product.exists({ slug })) {
        slug = `${slug}-${counter++}`
    }
    payload.slug = slug
    console.log(payload)
    const product = Product.create(payload)
    return product
}



export const productService = {
    createProduct
}