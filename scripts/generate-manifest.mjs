// scripts/generate-manifest.mjs
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function fetchAll(prefix) {
  let resources = [];
  let next_cursor;
  do {
    const opts = { type: "upload", prefix, max_results: 500 };
    if (next_cursor) opts.next_cursor = next_cursor;
    const r = await cloudinary.api.resources(opts);
    resources = resources.concat(r.resources || []);
    next_cursor = r.next_cursor;
  } while (next_cursor);
  return resources;
}

(async () => {
  try {
    const prefix = process.env.CLOUDINARY_FOLDER ? `${process.env.CLOUDINARY_FOLDER}/gallery/` : "malena-site/gallery/";
    const all = await fetchAll(prefix);
    const mapped = all.map(r => ({
      public_id: r.public_id,
      filename: r.public_id.split("/").pop(),
      url: r.secure_url,
      width: r.width,
      height: r.height,
      context: r.context && r.context.custom ? r.context.custom : {},
      created_at: r.created_at,
    }));

    const outDir = path.join(process.cwd(), "public");
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, "gallery-manifest.json"), JSON.stringify(mapped, null, 2));
    console.log("Wrote public/gallery-manifest.json, items:", mapped.length);
  } catch (err) {
    console.error("generate-manifest error", err);
    process.exit(1);
  }
})();
