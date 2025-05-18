import cloudinary from "../utils/cloudinary";
import fs from "fs";

export const uploadToCloudinary = async (filePath: string, folder: string) => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
  });
  fs.unlinkSync(filePath); // Clean up local file after upload
  return result;
};
