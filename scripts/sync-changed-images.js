import { execSync } from "child_process";
import path from "path";
import { cloudinary, cloudinaryFolder, localFolder, log, __dirname, getCloudPath, generateIndexFiles } from "./cloudinary-utils.mjs";





async function uploadImage(relPath) {
  const fullPath = path.join(localFolder, relPath);
  const cloudPath = getCloudPath(relPath);
  try {
    log(`Uploading: ${relPath}`);
    await cloudinary.v2.uploader.upload(fullPath, {
      public_id: cloudPath,
      overwrite: true,
      resource_type: "image",
    });
    log(`✅ Uploaded: ${relPath}`);
    return true; // Indicate success
  } catch (error) {
    log(`❌ Upload failed for ${relPath}:`, error.message);
    return false; // Indicate failure
  }
}


async function deleteImage(relPath) {
  const cloudPath = getCloudPath(relPath);
  try {
    log(`Deleting from Cloudinary: ${relPath}`);
    const result = await cloudinary.v2.uploader.destroy(cloudPath);
    if (result.result === "ok") {
      log(`✅ Deleted: ${relPath}`);
    } else {
      log(`⚠️ Could not delete (maybe not found): ${relPath}`);
    }
  } catch (err) {
    log(`❌ Delete failed: ${relPath}`, err.message);
  }
}

/**
 * Stages and commits changes to the local git repository.
 */
function commitChanges() {
  try {
    log("📝 Staging and committing changes to git...");
    // Stage all changes within the public/images directory
    execSync(`git add "${localFolder}"`);

    // Create a commit
    const commitMessage = `chore: Sync images with Cloudinary at ${new Date().toISOString()}`;
    execSync(`git commit -m "${commitMessage}"`);
    log("✅ Git commit successful.");
  } catch (error) {
    log("⚠️ Git commit failed. You may need to commit the changes manually. Error Message: ", error.message);
  }
}

async function runSync() {
  log("🔍 Checking for local changes...");
  const { added, deleted, renamed } = getChangedFiles();

  log(`📸 Images to upload/modify: ${added.length}`);
  log(`🔄 Images to rename: ${renamed.length}`);
  log(`🗑️ Images to delete: ${deleted.length}`);

  // 1. Handle renamed files first (upload new, then delete old)
  for (const item of renamed) {
    const uploadSuccess = await uploadImage(item.newPath);
    if (uploadSuccess) {
      await deleteImage(item.oldPath);
    } else {
      log(`⚠️ Skipping deletion of ${item.oldPath} because upload of ${item.newPath} failed.`);
    }
  }

  // 2. Upload new and modified files
  for (const file of added) {
    await uploadImage(file);
  }

  // 3. Delete removed files
  for (const file of deleted) {
    await deleteImage(file);
  }

   // 4. Commit the changes to git so they don't show up next time
  commitChanges();

  log("✅ Sync complete.");
}

await runSync();

generateIndexFiles();
