import fs from "fs";
import path from "path";
import { statSync } from "fs";
import sharp from "sharp"; // Add this dependency for local resizing if needed
import { cloudinary, cloudinaryFolder, localFolder, log } from "./cloudinary-utils.mjs";
import { getCloudPath } from "./cloudinary-utils.mjs";



function getAllImageFiles(dir, prefix = "") {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const relPath = path.join(prefix, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllImageFiles(path.join(dir, entry.name), relPath));
    } else if (/\.(jpg|jpeg|png|gif|webp)$/i.test(entry.name)) {
      files.push(relPath);
    }
  }

  return files;
}

async function imageExistsOnCloudinary(public_id) {
  try {
    await cloudinary.v2.api.resource(public_id);
    return true;
  } catch (err) {
    if (err.error.http_code === 404) return false;
    throw err;
  }
}

async function uploadImage(relPath) {
  const fullPath = path.join(localFolder, relPath);
  const cloudPath = getCloudPath(relPath);

  const stats = statSync(fullPath);
  const fileSizeInMB = stats.size / (1024 * 1024);

  try {
    const exists = await imageExistsOnCloudinary(cloudPath);
    if (exists) {
      log(`⚠️ Skipped (already exists): ${relPath}`);
      return;
    }

    let uploadOptions = {
      public_id: cloudPath,
      overwrite: true,
      resource_type: "image",
    };

    if (fileSizeInMB > 10) {
      log(`🔧 Resizing large image: ${relPath} (${fileSizeInMB.toFixed(2)} MB)`);
      const buffer = await sharp(fullPath)
        .resize({ width: 2000 }) // Resize conservatively (tweak if needed)
        .jpeg({ quality: 80 })
        .toBuffer();

      const uploadStream = await cloudinary.v2.uploader.upload_stream(uploadOptions, (error, result) => {
        if (error) throw error;
        log(`✅ Resized and uploaded: ${relPath}`);
      }).end(buffer);

    } else {
      log(`Uploading: ${relPath}`);
      const uploadResult = await cloudinary.v2.uploader.upload(fullPath, uploadOptions);
      log(`✅ Uploaded: ${relPath}`);
      log(`→ Uploaded as public_id: ${cloudPath}`);
    }

  } catch (error) {
    log(`❌ Failed to upload: ${cloudPath}` , error);
  }
}

async function uploadAllImages() {
  log("🔍 Scanning for all image files...");
  const allImages = getAllImageFiles(localFolder);
  log(`Found ${allImages.length} images.`);

  for (const relPath of allImages) {
    await uploadImage(relPath);
  }

  log("✅ All images uploaded.");
}

await uploadAllImages();
generateIndexFiles();

