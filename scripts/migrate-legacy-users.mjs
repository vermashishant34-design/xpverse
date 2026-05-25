/**
 * One-time migration: copy legacy `username` into `email` when missing.
 * Run: node scripts/migrate-legacy-users.mjs
 * Requires MONGODB_URI in .env (load with dotenv manually or export env).
 */
import mongoose from "mongoose";
import { readFileSync } from "fs";

function loadEnv() {
  try {
    const raw = readFileSync(".env", "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^MONGODB_URI=(.+)$/);
      if (m) process.env.MONGODB_URI = m[1].trim();
    }
  } catch {
    /* ignore */
  }
}

loadEnv();

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Set MONGODB_URI in .env or environment");
  process.exit(1);
}

await mongoose.connect(uri);
const db = mongoose.connection.db;
const users = db.collection("users");

const cursor = users.find({ username: { $exists: true }, $or: [{ email: { $exists: false } }, { email: null }, { email: "" }] });
let updated = 0;

for await (const doc of cursor) {
  const username = String(doc.username || "").trim().toLowerCase();
  if (!username) continue;

  const email = username.includes("@") ? username : `${username}@migrated.local`;
  await users.updateOne({ _id: doc._id }, { $set: { email, displayName: doc.displayName || username.split("@")[0] } });
  console.log(`Migrated ${doc._id}: username "${doc.username}" -> email "${email}"`);
  updated++;
}

console.log(`Done. Updated ${updated} document(s).`);
await mongoose.disconnect();
