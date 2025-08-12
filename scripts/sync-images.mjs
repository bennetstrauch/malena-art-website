#!/usr/bin/env node
// scripts/sync-images.mjs
import path from "path";
import fs from "fs";
import crypto from "crypto";
import fetch from "node-fetch";
import {
  cloudinary,
  cloudinaryFolder,
  localFolder,
  log,
  getCloudPath,
  generateIndexFiles,
} from "./cloudinary-utils.mjs";

// Constants
const CACHE_FILE = path.join(process.cwd(), ".sync-cache.json");
const IMAGE_EXT_RE = /\.(jpe?g|png|webp|gif|avif)$/i;

function fileHash(filePath) {
  const buf = fs.readFileSync(filePath);
  return crypto.createHash("sha1").update(buf).digest("hex");
}

function loadCache() {
  if (!fs.existsSync(CACHE_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"));
  } catch (e) {
    return {};
  }
}

function saveCache(cache) {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

/**
 * Walks the localFolder and returns map relPath -> { hash, mtimeMs }
 */
function buildLocalFileMap() {
  const base = localFolder;
  const map = {};
  if (!fs.existsSync(base)) return map;

  const walk = (dir) => {
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        walk(full);
      } else if (IMAGE_EXT_RE.test(name)) {
        const rel = path.relative(base, full).replace(/\\/g, "/");
        map[rel] = { hash: fileHash(full), mtimeMs: stat.mtimeMs };
      }
    }
  };
  walk(base);
  return map;
}

function computeDeltas(localMap, cacheMap) {
  const added = [];
  const modified = [];
  const deleted = [];

  for (const rel of Object.keys(localMap)) {
    if (!cacheMap[rel]) added.push(rel);
    else if (cacheMap[rel].hash !== localMap[rel].hash) modified.push(rel);
  }

  for (const rel of Object.keys(cacheMap)) {
    if (!localMap[rel]) deleted.push(rel);
  }

  return { added, modified, deleted };
}

/* Cloudinary helpers */
async function uploadImage(relPath) {
  const fullPath = path.join(localFolder, relPath);
  const cloudPath = getCloudPath(relPath);
  try {
    log(`Uploading: ${relPath} -> ${cloudPath}`);
    await cloudinary.v2.uploader.upload(fullPath, {
      public_id: cloudPath,
      overwrite: true,
      resource_type: "image",
      context: `title=${path.parse(relPath).name}`,
      // optionally eager generate thumbnails:
      // eager: [{ width: 800, height: 600, crop: "fill" }],
    });
    log(`✅ Uploaded: ${relPath}`);
    return true;
  } catch (err) {
    log(`❌ Upload failed for ${relPath}:`, err.message || err.toString());
    return false;
  }
}

async function deleteImage(relPath) {
  const cloudPath = getCloudPath(relPath);
  try {
    log(`Deleting: ${relPath} -> ${cloudPath}`);
    const result = await cloudinary.v2.uploader.destroy(cloudPath);
    log(`✅ Delete result for ${relPath}:`, result.result || JSON.stringify(result));
  } catch (err) {
    log(`❌ Delete failed for ${relPath}:`, err.message || err.toString());
  }
}

async function triggerVercelDeploy() {
  const hook = process.env.VERCEL_DEPLOY_HOOK;
  if (!hook) {
    log("No VERCEL_DEPLOY_HOOK set — skipping deploy trigger.");
    return;
  }
  try {
    log("Triggering Vercel deploy hook...");
    const res = await fetch(hook, { method: "POST" });
    log("Vercel hook responded:", res.status);
  } catch (err) {
    log("Failed to trigger Vercel deploy hook:", err.message || err.toString());
  }
}

async function run() {
  log("🔍 Building local file map...");
  const cache = loadCache(); // { rel: {hash, mtimeMs} }
  const local = buildLocalFileMap();

  const { added, modified, deleted } = computeDeltas(local, cache);
  const toUpload = [...added, ...modified];

  log(`📸 to upload/modify: ${toUpload.length} (added ${added.length}, modified ${modified.length})`);
  log(`🗑️ to delete: ${deleted.length}`);

  // Uploads
  for (const rel of toUpload) {
    const ok = await uploadImage(rel);
    if (!ok) log(`⚠️ Upload failed for ${rel} — it will remain unsynced in cache.`);
  }

  // Deletes
  for (const rel of deleted) {
    await deleteImage(rel);
  }

  // Update cache: set to current local map after successful operations
  // (we do best-effort update: mark those we uploaded/deleted)
  const newCache = { ...(cache || {}) };

  // Update entries for uploaded/modified
  for (const rel of toUpload) {
    if (local[rel]) newCache[rel] = { hash: local[rel].hash, mtimeMs: local[rel].mtimeMs };
  }
  // Remove deleted
  for (const rel of deleted) {
    delete newCache[rel];
  }

  saveCache(newCache);
  log("💾 Cache updated:", CACHE_FILE);

  // Trigger site redeploy (so build-time manifest / static site regenerates)
  await triggerVercelDeploy();

  // Regenerate local index files (optional)
  try {
    generateIndexFiles();
  } catch (e) {
    log("generateIndexFiles() failed:", e.message || e.toString());
  }

  log("✅ Sync finished.");
}

await run();
