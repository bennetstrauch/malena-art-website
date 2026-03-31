/**
 * Translates changed/new keys from en.json into de.json using the Claude API.
 *
 * Usage:  npm run translate
 *
 * Behavior:
 * - Compares en.json against en_snapshot.json (state at last translation).
 * - Keys whose English value changed → re-translated (overwrites German).
 * - Keys missing from de.json → translated (new keys).
 * - Everything else → left untouched (manual German edits are preserved).
 * - After translation, en_snapshot.json is updated to match en.json.
 *
 * Requires ANTHROPIC_API_KEY in .env
 */

import "dotenv/config";
import { readFile, writeFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import Anthropic from "@anthropic-ai/sdk";

const __dirname = dirname(fileURLToPath(import.meta.url));
const i18nDir = join(__dirname, "../src/i18n");

// --- Flatten/unflatten helpers ---

function flatten(obj, prefix = "") {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object" && value !== null) {
      Object.assign(result, flatten(value, fullKey));
    } else {
      result[fullKey] = value;
    }
  }
  return result;
}

function unflatten(flat) {
  const result = {};
  for (const [key, value] of Object.entries(flat)) {
    const parts = key.split(".");
    let cur = result;
    for (let i = 0; i < parts.length - 1; i++) {
      cur[parts[i]] ??= {};
      cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = value;
  }
  return result;
}

// --- Main ---

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("Error: ANTHROPIC_API_KEY not set in .env");
    process.exit(1);
  }

  const en = JSON.parse(await readFile(join(i18nDir, "en.json"), "utf-8"));

  let de = {};
  try {
    de = JSON.parse(await readFile(join(i18nDir, "de.json"), "utf-8"));
  } catch {
    console.log("de.json not found, starting fresh.");
  }

  let snapshot = {};
  try {
    snapshot = JSON.parse(await readFile(join(i18nDir, "en_snapshot.json"), "utf-8"));
  } catch {
    console.log("en_snapshot.json not found, treating all keys as new.");
  }

  const enFlat = flatten(en);
  const deFlat = flatten(de);
  const snapFlat = flatten(snapshot);

  // Keys to (re-)translate:
  // 1. Changed: exists in snapshot but English value is different now
  // 2. New: not in snapshot (and therefore not in de.json either)
  const toTranslate = Object.fromEntries(
    Object.entries(enFlat).filter(([key, value]) => {
      const changedInEnglish = key in snapFlat && snapFlat[key] !== value;
      const missingInGerman = !(key in deFlat);
      return changedInEnglish || missingInGerman;
    })
  );

  if (Object.keys(toTranslate).length === 0) {
    console.log("de.json is already up to date. Nothing to translate.");
    await writeFile(
      join(i18nDir, "en_snapshot.json"),
      JSON.stringify(en, null, 2) + "\n",
      "utf-8"
    );
    return;
  }

  // Log what's happening
  for (const [key, value] of Object.entries(toTranslate)) {
    if (!(key in deFlat)) {
      console.log(`  [new]     ${key}`);
    } else {
      console.log(`  [changed] ${key}`);
      console.log(`            EN was: "${snapFlat[key]}"`);
      console.log(`            EN now: "${value}"`);
    }
  }
  console.log(`\nTranslating ${Object.keys(toTranslate).length} key(s)...`);

  const client = new Anthropic({ apiKey });

  const prompt = `You are translating UI strings for a German visual artist's portfolio website (malenastrauch.com). The artist's name is Malena Strauch and she is based in Munich.

Translate the following JSON from English to German. Return ONLY valid JSON with no additional text, code fences, or explanation. Preserve all interpolation placeholders like {{title}}, {{price}}, {{message}} exactly as-is. Keep proper nouns (names, institutions, painting titles) unchanged. Use natural, fluent German appropriate for an art portfolio.

${JSON.stringify(toTranslate, null, 2)}`;

  const response = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = response.content[0].text.trim();

  let translated;
  try {
    translated = JSON.parse(raw);
  } catch {
    console.error("Claude returned invalid JSON. Raw response:");
    console.error(raw);
    process.exit(1);
  }

  // Merge: existing German + newly translated (translated wins for changed keys)
  const mergedFlat = { ...deFlat, ...translated };
  const merged = unflatten(mergedFlat);

  await writeFile(
    join(i18nDir, "de.json"),
    JSON.stringify(merged, null, 2) + "\n",
    "utf-8"
  );

  // Update snapshot to current English state
  await writeFile(
    join(i18nDir, "en_snapshot.json"),
    JSON.stringify(en, null, 2) + "\n",
    "utf-8"
  );

  console.log("de.json and en_snapshot.json updated successfully.");
}

main();
