#!/usr/bin/env npx tsx
/**
 * One life-news post to @emigro_portugal (Porto format ≠ Lépta).
 *
 *   npm run portugal:porto -- --dry-run
 *   npm run portugal:porto
 */
import { config } from "dotenv";
import { resolve } from "path";
import { runPortugalPortoChannel } from "../lib/news/portugal-porto-channel";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const result = await runPortugalPortoChannel({ dryRun });
  console.log(JSON.stringify(result));
  if (!result.published && result.reason !== "dry-run" && result.reason !== "no-fresh-story") {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
