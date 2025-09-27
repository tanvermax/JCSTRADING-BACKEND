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
exports.productService = void 0;
// src/types/product.ts
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const product_model_1 = require("./product.model");
const createProduct = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const ISProductExit = yield product_model_1.Product.findOne({ name: payload.title });
    if (ISProductExit) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Product alredy exit in");
    }
    const baseSlug = payload.title.toLocaleLowerCase().split(" ").join("-");
    let counter = 0;
    let slug = `${baseSlug}-product`;
    while (yield product_model_1.Product.exists({ slug })) {
        slug = `${slug}-${counter++}`;
    }
    payload.slug = slug;
    console.log(payload);
    const product = product_model_1.Product.create(payload);
    return product;
});
exports.productService = {
    createProduct
};
