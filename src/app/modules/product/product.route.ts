// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { multerUpload } from './../../config/multer.config';
import { Router } from "express";
import { ProductController } from "./product.controller";
import { validateRequest } from '../../middleware/validationRequest';
import { CreateProductZodSchema } from './product.validation';


const router = Router();


router.post("/create-product",multerUpload.single("file"),validateRequest(CreateProductZodSchema),ProductController.creatProduct);



export const ProductRoute = router