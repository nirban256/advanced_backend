import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload image to cloudinary
const uploadCloudinary = async (filePath) => {
    try {
        // check if filePath exists
        if (!filePath) return null;

        // uplod using cloudinary
        const response = await cloudinary.uploader.upload(filePath, { resource_type: "auto" });

        fs.unlinkSync(filePath); // delete file from server using fs module after successful upload to cloudinary.
        return response;
    } catch (error) {
        fs.unlinkSync(filePath); // delete file from server using fs module because the upload operation got failed.
        return null;
    }
}

export { uploadCloudinary };