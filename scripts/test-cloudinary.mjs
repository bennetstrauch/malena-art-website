import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function run() {
  try {
    console.log(
      "Testing api.resources with prefix:",
      "malena-site/gallery/2025/"
    );

    const result = await cloudinary.api.resources({
      type: "upload", // make sure it matches the upload type you used
      prefix: "malena-site/gallery/2025/",
      max_results: 10,
    });

    console.log("Cloudinary search result:", JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("Error fetching from Cloudinary:", err);
  }
}

run();
