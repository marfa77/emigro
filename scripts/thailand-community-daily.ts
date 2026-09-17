/**
 * Daily Thailand ingest: parser → Supabase signals → draft → spotlight → Phuket discussion.
 *
 *   npm run thailand:daily
 *   npm run thailand:daily -- --max-notes=1 --skip-drafts
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });
dotenv.config({ path: resolve(process.cwd(), "parser/.env") });
dotenv.config({ path: resolve(process.cwd(), ".env") });

import { ensureThailandCronEnv } from "@/lib/community-notes/cron-env";
import { publishDraftsFromNewSignals } from "@/lib/community-notes/publish-drafts";
import { publishThailandSeedNotes } from "@/lib/community-notes/publish-seed";
import { refreshDailySpotlight } from "@/lib/community-notes/daily-spotlight";
import { syncParserStateFromSupabase } from "@/lib/community-notes/sync-parser-state";
import { ingestCommunitySignals } from "@/lib/community-notes/queries";
import type { CommunitySignalIngest } from "@/lib/community-notes/types";

const ROOT = resolve(process.cwd());
const SIGNALS_JSON = resolve(ROOT, "parser/out/signals-daily.json");
const skipDrafts = process.argv.includes("--skip-drafts");
const maxNotesArg = process.argv.find((arg) => arg.startsWith("--max-notes="));
const maxNotes = maxNotesArg ? parseInt(maxNotesArg.split("=")[1] ?? "1", 10) : 1;

function parserPython(): string {
  const localVenv = resolve(ROOT, "parser/.venv/bin/python");
  return existsSync(localVenv) ? localVenv : "python3";
}

function runIncrementalParser(): CommunitySignalIngest[] {
  const result = spawnSync(parserPython(), [resolve(ROOT, "parser/main.py"), "--json-out", SIGNALS_JSON, "--country", "thailand"], {
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
    throw new Error("Thailand parser failed");
  }
  console.log(result.stdout);
  if (!existsSync(SIGNALS_JSON)) return [];
  const parsed = JSON.parse(readFileSync(SIGNALS_JSON, "utf-8")) as { signals?: CommunitySignalIngest[] };
  return (parsed.signals ?? []).filter((signal) => signal.country_key === "thailand");
}

async function postGroupDiscussion(): Promise<void> {
  try {
    const { postNextPhuketGroupNote } = await import("@/lib/community-notes/phuket-group-publish");
    const post = await postNextPhuketGroupNote();
    if (post.skipped) console.log("[phuket-group]", post.skipped);
    else console.log("[phuket-group]", post.slug, post.messageId);
  } catch (error) {
    console.warn("[phuket-group] failed:", error instanceof Error ? error.message : error);
  }
}

async function main() {
  ensureThailandCronEnv();
  const seeded = await publishThailandSeedNotes();
  console.log(`[seed] thailand editorial baseline: ${seeded} new notes`);
  console.log("[cursor]", await syncParserStateFromSupabase());

  const signals = runIncrementalParser();
  console.log(`[parser] fetched ${signals.length} new signals`);
  if (signals.length > 0) {
    console.log("[ingest]", await ingestCommunitySignals(signals));
    await syncParserStateFromSupabase();
  }

  if (skipDrafts) {
    const spotlight = await refreshDailySpotlight("thailand");
    console.log("[spotlight]", spotlight?.note_slug);
    await postGroupDiscussion();
    console.log("[draft] skipped");
    return;
  }

  console.log("[draft]", await publishDraftsFromNewSignals(maxNotes, "thailand"));
  const spotlight = await refreshDailySpotlight("thailand");
  console.log("[spotlight]", spotlight?.note_slug, spotlight?.threads_text?.slice(0, 80));
  await postGroupDiscussion();
  console.log("[done] thailand daily");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
