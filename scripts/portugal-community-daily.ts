/**
 * Daily incremental ingest: sync cursor → Telethon → Supabase → up to 2 Gemini drafts.
 *
 * Usage:
 *   npm run portugal:daily
 *   npm run portugal:daily -- --max-notes=1 --skip-drafts
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });
dotenv.config({ path: resolve(process.cwd(), "parser/.env") });
dotenv.config({ path: resolve(process.cwd(), ".env") });

import { publishDraftsFromNewSignals } from "@/lib/community-notes/publish-drafts";
import { refreshDailySpotlight } from "@/lib/community-notes/daily-spotlight";
import { syncParserStateFromSupabase } from "@/lib/community-notes/sync-parser-state";
import { ingestCommunitySignals } from "@/lib/community-notes/queries";
import type { CommunitySignalIngest } from "@/lib/community-notes/types";

const ROOT = resolve(process.cwd());
const SIGNALS_JSON = resolve(ROOT, "parser/out/signals-daily.json");
const skipDrafts = process.argv.includes("--skip-drafts");
const maxNotesArg = process.argv.find((a) => a.startsWith("--max-notes="));
const maxNotes = maxNotesArg ? parseInt(maxNotesArg.split("=")[1] ?? "1", 10) : 1;

function runIncrementalParser(): CommunitySignalIngest[] {
  const py = resolve(ROOT, "parser/main.py");
  const venvPython = resolve("/Users/pavelveselov/Projects/barakhlo/parser/.venv/bin/python");
  const python = existsSync(venvPython) ? venvPython : "python3";

  const result = spawnSync(python, [py, "--json-out", SIGNALS_JSON], {
    cwd: resolve(ROOT, "parser"),
    encoding: "utf-8",
    timeout: 180_000,
    env: {
      ...process.env,
      PARSER_MAX_AGE_HOURS: process.env.PARSER_MAX_AGE_HOURS ?? "36",
      PARSER_INCREMENTAL_LIMIT: process.env.PARSER_INCREMENTAL_LIMIT ?? "60",
    },
  });

  if (result.status !== 0) {
    console.error(result.stderr || result.stdout);
    throw new Error("Parser failed");
  }
  console.log(result.stdout);

  if (!existsSync(SIGNALS_JSON)) {
    return [];
  }
  const parsed = JSON.parse(readFileSync(SIGNALS_JSON, "utf-8")) as { signals?: CommunitySignalIngest[] };
  return parsed.signals ?? [];
}

async function main() {
  const state = await syncParserStateFromSupabase();
  console.log("[cursor]", state);

  const signals = runIncrementalParser();
  console.log(`[parser] fetched ${signals.length} new signals`);

  let ingest = { received: 0, inserted: 0, skipped: 0 };
  if (signals.length > 0) {
    ingest = await ingestCommunitySignals(signals);
    console.log("[ingest]", ingest);
    await syncParserStateFromSupabase();
  }

  if (skipDrafts) {
    const spotlight = await refreshDailySpotlight("portugal");
    console.log("[spotlight]", spotlight?.note_slug);
    console.log("[draft] skipped");
    return;
  }

  const drafts = await publishDraftsFromNewSignals(maxNotes);
  console.log("[draft]", drafts);

  const spotlight = await refreshDailySpotlight("portugal");
  console.log("[spotlight]", spotlight?.note_slug, spotlight?.threads_text?.slice(0, 80));
  console.log("[done] portugal daily");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
