#!/usr/bin/env npx tsx
/**
 * Northern Italy outdoor experiences (Guiddy, Trekking Lecco, Lanzo,
 * OssolaTrek, Piccole Dolomiti) → @emigro_Italy.
 *
 *   npm run italy:outdoor -- --list
 *   npm run italy:outdoor -- --dry-run
 *   npm run italy:outdoor
 *   npm run italy:outdoor -- --sources=guiddy,lecco
 */
import { config } from "dotenv";
import { resolve } from "path";
import { collectItalyOutdoorEvents, runItalyOutdoorChannel } from "../lib/news/italy-outdoor/run";

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
  const sourcesRaw = argValue("--sources");
  const sources = sourcesRaw
    ? sourcesRaw.split(",").map((s) => s.trim()).filter(Boolean)
    : undefined;
  if (process.argv.includes("--list")) {
    const events = await collectItalyOutdoorEvents({ sources });
    console.log(`[italy-outdoor] total ${events.length}`);
    for (const ev of events.slice(0, 12)) {
      console.log(`- ${ev.startIso.slice(0, 16)} ${ev.sourceId} ${ev.priceLabel || "?"} ${ev.title} @ ${ev.location}`);
    }
    return;
  }
  const dryRun = process.argv.includes("--dry-run");
  const forceUrl = argValue("--url");
  const result = await runItalyOutdoorChannel({ dryRun, forceUrl, sources });
  console.log(JSON.stringify(result));
  if (!result.published && result.reason !== "dry-run" && result.reason !== "no-fresh-event") {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
