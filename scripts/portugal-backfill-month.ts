/**
 * Month backfill: parse @chatlisboa + @por_tugal for last 30 days → Supabase signals.
 *
 * Usage:
 *   npm run portugal:backfill-month
 *   npm run portugal:backfill-month -- --max-notes=5
 *   npm run portugal:backfill-month -- --days=14 --dry-run
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });
dotenv.config({ path: resolve(process.cwd(), ".env") });

import { publishDraftsFromNewSignals } from "@/lib/community-notes/publish-drafts";
import { syncParserStateFromSupabase } from "@/lib/community-notes/sync-parser-state";
import { ingestCommunitySignals } from "@/lib/community-notes/queries";
import { publishPortugalSeedNotes } from "@/lib/community-notes/publish-seed";
import type { CommunitySignalIngest } from "@/lib/community-notes/types";

const ROOT = resolve(process.cwd());
const SIGNALS_JSON = resolve(ROOT, "parser/out/signals-month.json");

const daysArg = process.argv.find((a) => a.startsWith("--days="));
const days = daysArg ? parseInt(daysArg.split("=")[1] ?? "30", 10) : 30;
const dryRun = process.argv.includes("--dry-run");
const skipDrafts = process.argv.includes("--skip-drafts");
const maxNotesArg = process.argv.find((a) => a.startsWith("--max-notes="));
const maxNotes = maxNotesArg ? parseInt(maxNotesArg.split("=")[1] ?? "5", 10) : 5;

function runParserSinceDays(sinceDays: number): CommunitySignalIngest[] {
  const py = resolve(ROOT, "parser/main.py");
  const venvPython = resolve("/Users/pavelveselov/Projects/barakhlo/parser/.venv/bin/python");
  const python = existsSync(venvPython) ? venvPython : "python3";
  const args = ["--since-days", String(sinceDays), "--json-out", SIGNALS_JSON];
  if (dryRun) args.push("--dry-run");

  const result = spawnSync(python, [py, ...args], {
    cwd: resolve(ROOT, "parser"),
    encoding: "utf-8",
    timeout: 300_000,
  });

  if (result.status !== 0) {
    console.error(result.stderr || result.stdout);
    throw new Error("Parser failed");
  }
  console.log(result.stdout);

  if (!existsSync(SIGNALS_JSON)) {
    throw new Error(`No signals file: ${SIGNALS_JSON}`);
  }
  const parsed = JSON.parse(readFileSync(SIGNALS_JSON, "utf-8")) as { signals?: CommunitySignalIngest[] };
  return parsed.signals ?? [];
}

async function publishDrafts(max: number) {
  const result = await publishDraftsFromNewSignals(max);
  console.log("[draft]", result);
}

async function main() {
  console.log(`[backfill-month] since_days=${days} dry_run=${dryRun}`);
  await publishPortugalSeedNotes();

  const signals = runParserSinceDays(days);
  console.log(`[parser] fetched ${signals.length} signals (${days}d window)`);

  if (dryRun) {
    console.log("[dry-run] skip ingest and drafts");
    return;
  }

  if (signals.length > 0) {
    const ing = await ingestCommunitySignals(signals);
    console.log("[ingest]", ing);
  }

  if (!skipDrafts) {
    await publishDrafts(maxNotes);
  }

  console.log("[done] month backfill");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
