"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoute = void 0;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const multer_config_1 = require("./../../config/multer.config");
const express_1 = require("express");
const product_controller_1 = require("./product.controller");
const validationRequest_1 = require("../../middleware/validationRequest");
const product_validation_1 = require("./product.validation");
const router = (0, express_1.Router)();
router.post("/create-product", multer_config_1.multerUpload.single("file"), (0, validationRequest_1.validateRequest)(product_validation_1.CreateProductZodSchema), product_controller_1.ProductController.creatProduct);
exports.ProductRoute = router;
