import dotenv from "dotenv";
import cloudinary from "cloudinary";

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const folder = "malena-site"; // Your root Cloudinary folder

async function deleteAllImagesInFolder(folderPath) {
  try {
    console.log(`📁 Fetching resources in: ${folderPath}`);

    // Paginate if many images
    let nextCursor = null;
    do {
      const result = await cloudinary.v2.api.resources({
        type: "upload",
        prefix: folderPath,
        max_results: 500,
        next_cursor: nextCursor || undefined,
      });

      const publicIds = result.resources.map((r) => r.public_id);
      if (publicIds.length > 0) {
        console.log(`🗑️ Deleting ${publicIds.length} resources...`);
        await cloudinary.v2.api.delete_resources(publicIds);
      }

      nextCursor = result.next_cursor;
    } while (nextCursor);

    console.log("✅ All images in folder deleted.");
  } catch (err) {
    console.error("❌ Error deleting images:", err.message);
  }
}

await deleteAllImagesInFolder(folder);
