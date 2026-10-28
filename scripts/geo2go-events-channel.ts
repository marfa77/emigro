#!/usr/bin/env npx tsx
/**
 * One Geo2Go outdoor event → @emigro_portugal.
 *
 *   npm run portugal:geo2go -- --dry-run
 *   npm run portugal:geo2go
 *   npm run portugal:geo2go -- --url=https://www.geo2go.pt/event-details/...
 */
import { config } from "dotenv";
import { resolve } from "path";
import { runGeo2goEventsChannel } from "../lib/news/geo2go-events";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

function argValue(flag: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`${flag}=`));
  if (hit) return hit.slice(flag.length + 1);
  const i = process.argv.indexOf(flag);
  if (i >= 0 && process.argv[i + 1]) return process.argv[i + 1];
  return undefined;
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const forceUrl = argValue("--url");
  const result = await runGeo2goEventsChannel({ dryRun, forceUrl });
  console.log(JSON.stringify(result));
  if (
    !result.published &&
    result.reason !== "dry-run" &&
    result.reason !== "no-fresh-event"
  ) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
