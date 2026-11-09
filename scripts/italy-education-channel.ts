#!/usr/bin/env npx tsx
/**
 * One parent-education post to @emigro_Italy.
 *   npm run italy:education -- --dry-run
 *   npm run italy:education
 */
import { config } from "dotenv";
import { resolve } from "path";
import { runItalyEducationChannel } from "../lib/news/italy-education";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const result = await runItalyEducationChannel({ dryRun });
  console.log(JSON.stringify(result));
  if (!result.published && result.reason !== "dry-run" && result.reason !== "no-fresh-story") {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
