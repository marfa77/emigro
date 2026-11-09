#!/usr/bin/env npx tsx
/**
 * Friday morning: short weekend list with links to event cards already in the feed.
 *
 *   npm run outdoor:digest -- --dry-run
 */
import { config } from "dotenv";
import { resolve } from "path";
import { ITALY_OUTDOOR_CHANNEL } from "../lib/news/italy-outdoor/publish";
import { sendWeekendDigest } from "../lib/news/outdoor/digest";
import { OUTDOOR_CHANNEL } from "../lib/news/outdoor/publish";
import { VALENCIA_OUTDOOR_CHAT } from "../lib/news/valencia-outdoor/publish";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

const QUIET = new Set(["not-friday", "already", "no-weekend", "dry-run"]);

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const targets = [
    {
      label: "portugal",
      storePath: resolve(process.cwd(), "deploy/portugal-outdoor/state/seen.json"),
      timeZone: "Europe/Lisbon",
      username: "emigro_portugal",
      chatId: OUTDOOR_CHANNEL(),
    },
    {
      label: "italy",
      storePath: resolve(process.cwd(), "deploy/italy-outdoor/state/seen.json"),
      timeZone: "Europe/Rome",
      username: "milan_echat",
      chatId: ITALY_OUTDOOR_CHANNEL(),
    },
    {
      label: "valencia",
      storePath: resolve(process.cwd(), "deploy/valencia-outdoor/state/seen.json"),
      timeZone: "Europe/Madrid",
      username: "valencia_echat",
      chatId: VALENCIA_OUTDOOR_CHAT(),
    },
  ];
  let failed = false;
  for (const target of targets) {
    try {
      const result = await sendWeekendDigest({ ...target, dryRun });
      console.log(JSON.stringify({ label: target.label, ...result }));
      if (!result.published && result.reason && !QUIET.has(result.reason)) failed = true;
    } catch (err) {
      failed = true;
      console.error(`[digest] ${target.label}`, err instanceof Error ? err.message : err);
    }
  }
  if (failed) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
