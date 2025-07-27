// cloudinary-utils.js
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cloudinary from "cloudinary";
import fs from "fs";
import { globSync } from "glob";

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





export function generateIndexFiles() {
  const basePath = path.join(__dirname, "..", "public", "images", "gallery");
  const outputPath = path.join(__dirname, "..", "src", "data");

  const allFiles = globSync("**/*.{jpg,jpeg,png}", { cwd: basePath, nodir: true });

  const grouped = {};

  for (const file of allFiles) {
    const [year, ...rest] = file.split("/");
    if (!grouped[year]) grouped[year] = [];
    grouped[year].push(rest.join("/"));
  }

  for (const year in grouped) {
    const data = grouped[year];
    const targetPath = path.join(outputPath, `image-filenames-${year}.ts`);
    const content = `export default ${JSON.stringify(data, null, 2)};`;
    ensureDirExists(targetPath);
    fs.writeFileSync(targetPath, content);
    log(`📝 Wrote ${data.length} entries to image-filenames-${year}.ts`);
  }
}


/**
 * Ensures a directory exists (recursively creates it if needed)
 */
function ensureDirExists(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}