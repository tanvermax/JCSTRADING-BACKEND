import { v2 as cloudinary } from "cloudinary";
import { envVarse } from "./env";


    cloudinary.config({
        cloud_name: envVarse.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
        api_key: envVarse.CLOUDINARY.CLOUDINARY_API_KEY,
        api_secret: envVarse.CLOUDINARY.CLOUDINARY_API_SECRET
    })

export const cloudinaryUpload = cloudinary