import { v2 as cloudinary } from "cloudinary";
import { envVarse } from "./env";
import AppError from "../errorHelper/AppError";


    cloudinary.config({
        cloud_name: envVarse.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
        api_key: envVarse.CLOUDINARY.CLOUDINARY_API_KEY,
        api_secret: envVarse.CLOUDINARY.CLOUDINARY_API_SECRET
    })
    export const deleteImageForCloudinary = async (url:string)=>{

       try {
         const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;
        const match= url.match(regex);

        if (match && match[1]) {
            const public_id = match[1];
            await cloudinary.uploader.destroy(public_id)
            console.log(`File ${public_id} is deleted from cloudinary`)
            
        }
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
       } catch (error:any) {
        throw new AppError(401,"cloudinary image details failed",error.message)
       }
    }

export const cloudinaryUpload = cloudinary