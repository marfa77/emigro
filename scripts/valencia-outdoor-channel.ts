#!/usr/bin/env npx tsx
/**
 * Day events around Valencia → @valencia_echat.
 *
 *   npm run valencia:outdoor -- --list
 *   npm run valencia:outdoor -- --dry-run
 *   npm run valencia:outdoor
 */
import { config } from "dotenv";
import { resolve } from "path";
import { collectValenciaOutdoorEvents, runValenciaOutdoorChannel } from "../lib/news/valencia-outdoor/run";

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
  const sources = sourcesRaw ? sourcesRaw.split(",").map((s) => s.trim()).filter(Boolean) : undefined;
  if (process.argv.includes("--list")) {
    const events = await collectValenciaOutdoorEvents({ sources });
    console.log(`[valencia-outdoor] total ${events.length}`);
    for (const ev of events.slice(0, 15)) {
      console.log(`- ${ev.startIso.slice(0, 16)} ${ev.sourceId} ${ev.priceLabel || "?"} ${ev.title} @ ${ev.location}`);
    }
    return;
  }
  const result = await runValenciaOutdoorChannel({
    dryRun: process.argv.includes("--dry-run"),
    forceUrl: argValue("--url"),
    sources,
  });
  console.log(JSON.stringify(result));
  if (!result.published && result.reason !== "dry-run" && result.reason !== "no-fresh-event") process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
