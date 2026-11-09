#!/usr/bin/env npx tsx
/**
 * One Lepta-style post to @emigro_Italy.
 *
 *   npm run italy:lepta -- --dry-run
 *   npm run italy:lepta
 */
import { config } from "dotenv";
import { resolve } from "path";
import { runItalyLeptaChannel } from "../lib/news/italy-lepta";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const result = await runItalyLeptaChannel({ dryRun });
  console.log(JSON.stringify(result));
  if (!result.published && result.reason !== "dry-run" && result.reason !== "no-fresh-story") {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
