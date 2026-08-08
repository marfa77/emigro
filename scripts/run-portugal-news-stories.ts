#!/usr/bin/env npx tsx
/**
 * Portugal single-story tiles from Observador (cheap daily pipeline).
 *
 *   npm run news:portugal-stories -- --dry-run
 *   npm run news:portugal-stories
 *   npm run news:portugal-stories -- --max=2
 */
import { config } from "dotenv";
import { resolve } from "path";
import { generatePortugalStories } from "../lib/news/generate-portugal-stories";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

function parseArgs() {
  const dryRun = process.argv.includes("--dry-run");
  const maxArg = process.argv.find((a) => a.startsWith("--max="))?.split("=")[1];
  const maxPublish = maxArg ? Math.max(1, Number(maxArg)) : undefined;
  return { dryRun, maxPublish };
}

async function main() {
  const { dryRun, maxPublish } = parseArgs();
  console.log(`🇵🇹 Portugal stories (Observador)${dryRun ? " [dry-run]" : ""}`);
  const result = await generatePortugalStories({ dryRun, maxPublish });
  console.log("\n=== Result ===");
  console.log(JSON.stringify(result, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
