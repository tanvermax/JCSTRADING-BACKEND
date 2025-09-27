import { model, Schema } from "mongoose";
import { IProduct } from "./product.interface";

const ProductSchema = new Schema<IProduct>(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        stock: { type: Number, required: true, min: 0 },
        category: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        newproduct: { type: Boolean, default: true },
        images: [{ type: String, required: true }],
        brand: { type: String },
        sku: { type: String, unique: true, sparse: true },
        tags: [{ type: String }],
        isActive: { type: Boolean, default: true },
    },
    {
        timestamps: true, // adds createdAt & updatedAt automatically
    }
);



export const Product = model<IProduct>("Product", ProductSchema)
