#!/usr/bin/env npx tsx
/**
 * One Geo2Go outdoor event → @emigro_portugal.
 *
 *   npm run portugal:geo2go -- --dry-run
 *   npm run portugal:geo2go
 */
import { config } from "dotenv";
import { resolve } from "path";
import { runGeo2goEventsChannel } from "../lib/news/geo2go-events";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const result = await runGeo2goEventsChannel({ dryRun });
  console.log(JSON.stringify(result));
  if (!result.published && result.reason !== "dry-run" && result.reason !== "no-fresh-event") {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
