// scripts/cloudinary-utils.mjs
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cloudinary from "cloudinary";
import fs from "fs";
import { globSync } from "glob";

dotenv.config();

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

// Cloudinary configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinaryFolder = process.env.CLOUDINARY_FOLDER || "malena-site";

// POINT TO YOUR REPO'S public/images FOLDER
export const localFolder = path.join(process.cwd(), "public", "images");

export const log = (...args) => {
  const timestamp = new Date().toISOString().replace("T", " ").split(".")[0];
  console.log(`[${timestamp}]`, ...args);
};

export { cloudinary };

export function getCloudPath(relPath) {
  // ensure forward-slashes for Cloudinary public_id
  return path.posix.join(cloudinaryFolder, relPath).replace(/&/g, "and").replace(/\\/g, "/");
}

export function generateIndexFiles() {
  // your existing generator - writes TS files from local public/images/gallery/*
  const basePath = path.join(process.cwd(), "public", "images", "gallery");
  const outputPath = path.join(process.cwd(), "src", "data");

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

function ensureDirExists(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}
