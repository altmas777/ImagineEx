import { v2 as cloudinary } from 'cloudinary';
import fs from "node:fs"
import dotenv from "dotenv";
dotenv.config();


// Configuration
cloudinary.config({
    cloud_name: 'dtnpvm70m',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});




const uploadToCloudinary = async (filePath) => {
    // Upload an image
    const uploadResult = await cloudinary.uploader
        .upload(
            filePath, {
            resource_type: "auto"
        }
        )
        .catch((error) => {
            console.log(error);
            // If failes remove file from our server
            fs.unlinkSync(filePath)
        });
    return uploadResult
}

export const deleteFromCloudinary = async (imageUrl) => {
    try {
        if (!imageUrl) return;
        // extract public id from URL (e.g. .../upload/v1234/folder/public_id.png -> public_id)
        const parts = imageUrl.split('/');
        const filename = parts[parts.length - 1];
        const publicId = filename.split('.')[0];
        
        await cloudinary.uploader.destroy(publicId);
    } catch (err) {
        console.error("Cloudinary delete error:", err);
    }
}

export default uploadToCloudinary