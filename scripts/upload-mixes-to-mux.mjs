#!/usr/bin/env node
/**
 * One-time batch uploader: pushes all 19 mastered SiriusXM mixes to Mux,
 * then writes the resulting playback IDs back to the Supabase mixes table.
 *
 * Idempotent — skips any mix that already has a mux_playback_id, so safe
 * to re-run if it gets interrupted.
 *
 * Usage:
 *   cd ~/Documents/Claude/Projects/djdannywest
 *   node /Users/dannywest/Documents/Claude/Projects/dj\ danny\ west\ page/upload-mixes-to-mux.mjs
 *
 * Reads from .env.local in cwd:
 *   MUX_TOKEN_ID, MUX_TOKEN_SECRET
 *   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *
 * What it does, per file (chronological order = Vol 01..19):
 *   1. Look up the matching mixes row by slug (siriusxm-globalization-vol-NN)
 *   2. If row already has mux_playback_id → skip
 *   3. Create a Mux direct-upload URL
 *   4. PUT the file bytes to that URL
 *   5. Poll Mux until the asset is "ready"
 *   6. UPDATE mixes set mux_asset_id, mux_playback_id, duration_seconds
 *
 * Total runtime expected: ~10–25 minutes for 19 files depending on upload speed.
 * Each file is 50–80 MB on average.
 */

import Mux from "@mux/mux-node";
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";

// Load .env.local from cwd
const envFile = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) {
      let v = m[2].trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      if (!process.env[m[1]]) process.env[m[1]] = v;
    }
  }
}

const AUDIO_DIR = "/Users/dannywest/djdannywest/brand-assets/audio/Past SiriusXm Mixes";

const required = [
  "MUX_TOKEN_ID",
  "MUX_TOKEN_SECRET",
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
];
for (const k of required) {
  if (!process.env[k]) {
    console.error(`Missing env var: ${k}`);
    console.error(`Expected to find it in: ${envFile}`);
    process.exit(1);
  }
}

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

// Mirrors the catalog script logic — date in MMDDYYYY, malformed entries sort last
function parseDate(name) {
  const m = name.match(/(\d{8})/);
  if (!m) return "9999-99-99";
  const s = m[1];
  return `${s.slice(4, 8)}-${s.slice(0, 2)}-${s.slice(2, 4)}`;
}

if (!fs.existsSync(AUDIO_DIR)) {
  console.error(`Audio directory not found: ${AUDIO_DIR}`);
  process.exit(1);
}

const files = fs
  .readdirSync(AUDIO_DIR)
  .filter((f) => /\.(mp3|wav|aif|aiff|m4a|flac)$/i.test(f))
  .sort((a, b) => {
    const da = parseDate(a);
    const db = parseDate(b);
    if (da !== db) return da.localeCompare(db);
    return a.localeCompare(b);
  });

console.log(`Found ${files.length} audio file(s) to consider.\n`);

let uploaded = 0;
let skipped = 0;
let failed = 0;

for (let i = 0; i < files.length; i++) {
  const vol = i + 1;
  const file = files[i];
  const slug = `siriusxm-globalization-vol-${String(vol).padStart(2, "0")}`;
  const filePath = path.join(AUDIO_DIR, file);
  const stats = fs.statSync(filePath);
  const sizeMB = (stats.size / 1024 / 1024).toFixed(1);

  console.log(`[Vol ${String(vol).padStart(2, "0")}] ${file}  (${sizeMB} MB)`);

  const { data: row, error: lookupErr } = await supabase
    .from("mixes")
    .select("id, slug, mux_playback_id, mux_asset_id")
    .eq("slug", slug)
    .maybeSingle();

  if (lookupErr) {
    console.log(`  ✗ DB lookup failed: ${lookupErr.message}`);
    failed++;
    continue;
  }
  if (!row) {
    console.log(`  ⚠️  No mixes row with slug "${slug}" — skipping.`);
    skipped++;
    continue;
  }
  if (row.mux_playback_id) {
    console.log(`  ✓ Already uploaded (playback: ${row.mux_playback_id}). Skipping.`);
    skipped++;
    continue;
  }

  try {
    console.log(`  Creating Mux direct-upload URL…`);
    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        playback_policy: ["signed"],
        encoding_tier: "smart",
        mp4_support: "none",
      },
      cors_origin: "*",
    });

    console.log(`  Uploading file bytes to Mux…`);
    const fileBuffer = fs.readFileSync(filePath);
    const res = await fetch(upload.url, {
      method: "PUT",
      body: fileBuffer,
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`PUT ${res.status} ${txt.slice(0, 200)}`);
    }

    console.log(`  Upload complete. Polling Mux for asset…`);
    let asset = null;
    for (let attempt = 0; attempt < 90; attempt++) {
      await new Promise((r) => setTimeout(r, 5000));
      const uploadStatus = await mux.video.uploads.retrieve(upload.id);
      if (uploadStatus.asset_id) {
        asset = await mux.video.assets.retrieve(uploadStatus.asset_id);
        process.stdout.write(`    asset status: ${asset.status}\r`);
        if (asset.status === "ready" || asset.status === "errored") break;
      } else {
        process.stdout.write(`    upload status: ${uploadStatus.status}\r`);
      }
    }
    console.log("");

    if (!asset || asset.status !== "ready") {
      console.log(`  ⚠️  Asset not ready after polling (last status: ${asset?.status}).`);
      if (asset) {
        await supabase
          .from("mixes")
          .update({ mux_asset_id: asset.id })
          .eq("id", row.id);
        console.log(`     Saved mux_asset_id for later. Re-run to finish.`);
      }
      failed++;
      continue;
    }

    const playbackId = asset.playback_ids?.[0]?.id;
    const duration = Math.round(asset.duration ?? 0);
    console.log(`  ✓ Asset ready.  playback_id=${playbackId}  duration=${duration}s`);

    const { error: updErr } = await supabase
      .from("mixes")
      .update({
        mux_asset_id: asset.id,
        mux_playback_id: playbackId,
        duration_seconds: duration,
        status: "published",
      })
      .eq("id", row.id);
    if (updErr) {
      console.log(`  ⚠️  DB update failed: ${updErr.message}`);
      failed++;
    } else {
      console.log(`  ✓ DB updated.`);
      uploaded++;
    }
  } catch (err) {
    console.log(`  ✗ Error: ${err.message ?? err}`);
    failed++;
  }
  console.log("");
}

console.log("─────────────────────");
console.log(`Uploaded: ${uploaded}`);
console.log(`Skipped:  ${skipped}`);
console.log(`Failed:   ${failed}`);
console.log("Done.");
