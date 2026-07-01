#!/usr/bin/env npx tsx
/**
 * Thin wrapper — prefer the main script:
 *   npx tsx scripts/import-prep2go-news.ts --url=https://www.prep2go.study/news/... [--force] [--dry-run] [--skip-telegram]
 */
import { config } from "dotenv";
import { resolve } from "path";
import { importPrep2GoFromUrl } from "../lib/news/import-prep2go";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

const urlArg =
  process.argv.find((a) => a.startsWith("--url="))?.substring("--url=".length).trim() ??
  process.argv.find((a) => a.startsWith("http"));
const force = process.argv.includes("--force");
const dryRun = process.argv.includes("--dry-run");
const skipTelegram = process.argv.includes("--skip-telegram");

async function main() {
  if (!urlArg) {
    throw new Error("Provide --url=https://www.prep2go.study/news/... or a Prep2Go article URL");
  }

  console.log(`Importing: ${urlArg}\n`);
  const summary = await importPrep2GoFromUrl(urlArg, { dryRun, force, skipTelegram });
  console.log("\n=== Result ===");
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
