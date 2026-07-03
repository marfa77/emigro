/**
 * Portugal satellite pipeline:
 *   1) Telethon parser → JSON
 *   2) community_signals in Supabase
 *   3) Gemini editorial drafts → community_notes (published)
 *
 * Usage:
 *   npx tsx scripts/portugal-community-run.ts
 *   npx tsx scripts/portugal-community-run.ts --skip-parser --max-notes 2
 */
import { spawnSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });
dotenv.config({ path: resolve(process.cwd(), ".env") });

import { publishDraftsFromNewSignals } from "@/lib/community-notes/publish-drafts";
import { refreshDailySpotlight } from "@/lib/community-notes/daily-spotlight";
import { ingestCommunitySignals } from "@/lib/community-notes/queries";
import { publishPortugalSeedNotes } from "@/lib/community-notes/publish-seed";
import type { CommunitySignalIngest } from "@/lib/community-notes/types";

const ROOT = resolve(process.cwd());
const SIGNALS_JSON = resolve(ROOT, "parser/out/signals-latest.json");
const skipParser = process.argv.includes("--skip-parser");
const seedOnly = process.argv.includes("--seed-only");
const sinceDaysArg = process.argv.find((a) => a.startsWith("--since-days="));
const sinceDays = sinceDaysArg ? parseInt(sinceDaysArg.split("=")[1] ?? "0", 10) : 0;
const maxNotesArg = process.argv.find((a) => a.startsWith("--max-notes="));
const maxNotes = maxNotesArg ? parseInt(maxNotesArg.split("=")[1] ?? "3", 10) : 3;

function runParser(): CommunitySignalIngest[] {
  const py = resolve(ROOT, "parser/main.py");
  const venvPython = resolve("/Users/pavelveselov/Projects/barakhlo/parser/.venv/bin/python");
  const python = existsSync(venvPython) ? venvPython : "python3";

  const parserArgs = ["--once", "--json-out", SIGNALS_JSON];
  if (sinceDays > 0) {
    parserArgs.length = 0;
    parserArgs.push("--since-days", String(sinceDays), "--json-out", SIGNALS_JSON);
  } else {
    parserArgs.push("--bootstrap");
  }

  const result = spawnSync(python, [py, ...parserArgs], {
    cwd: resolve(ROOT, "parser"),
    encoding: "utf-8",
    timeout: sinceDays > 0 ? 300_000 : 120_000,
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
  for (const slug of result.published) {
    console.log(`[published] /notes/${slug}`);
  }
  for (const slug of result.skipped) {
    console.log(`[draft] slug exists, skip: ${slug}`);
  }
  for (const err of result.errors) {
    console.error(`[draft] ${err}`);
  }
  if (result.clusters === 0 && result.published.length === 0) {
    console.log("[draft] no new signals — skip Gemini");
  }
}

async function main() {
  if (seedOnly) {
    await publishPortugalSeedNotes();
    console.log("[seed] published editorial baseline notes");
    return;
  }

  await publishPortugalSeedNotes();

  if (!skipParser) {
    const signals = runParser();
    console.log(`[parser] fetched ${signals.length} signals`);
    if (signals.length > 0) {
      const ing = await ingestCommunitySignals(signals);
      console.log("[ingest]", ing);
    }
  }

  await publishDrafts(maxNotes);
  const spotlight = await refreshDailySpotlight("portugal");
  console.log("[spotlight]", spotlight?.note_slug);
  console.log("[done] portugal community pipeline");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
