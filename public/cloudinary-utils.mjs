// cloudinary-utils.js
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cloudinary from "cloudinary";

// Load .env variables
dotenv.config();

// Setup __dirname for ESM
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

// Cloudinary configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinaryFolder = process.env.CLOUDINARY_FOLDER || "malena-site";
export const localFolder = path.join(__dirname, "images");

// Logger helper
export const log = (...args) => {
  const timestamp = new Date().toISOString().replace("T", " ").split(".")[0];
  console.log(`[${timestamp}]`, ...args);
};

export { cloudinary };


export function getCloudPath(relPath) {
  return path.posix
    .join(cloudinaryFolder, relPath)
    .replace(/&/g, "and").replace(/\\/g, "/");
}