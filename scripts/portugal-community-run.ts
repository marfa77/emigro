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

import { clusterSignals, draftNoteFromCluster } from "@/lib/community-notes/draft-from-signals";
import { ingestCommunitySignals } from "@/lib/community-notes/queries";
import { publishPortugalSeedNotes } from "@/lib/community-notes/publish-seed";
import type { CommunitySignalIngest } from "@/lib/community-notes/types";
import { createServerClient } from "@/lib/supabase/server";

const ROOT = resolve(process.cwd());
const SIGNALS_JSON = resolve(ROOT, "parser/out/signals-latest.json");
const skipParser = process.argv.includes("--skip-parser");
const seedOnly = process.argv.includes("--seed-only");
const maxNotesArg = process.argv.find((a) => a.startsWith("--max-notes="));
const maxNotes = maxNotesArg ? parseInt(maxNotesArg.split("=")[1] ?? "3", 10) : 3;

function runParser(): CommunitySignalIngest[] {
  const py = resolve(ROOT, "parser/main.py");
  const venvPython = resolve("/Users/pavelveselov/Projects/barakhlo/parser/.venv/bin/python");
  const python = existsSync(venvPython) ? venvPython : "python3";

  const result = spawnSync(
    python,
    [py, "--once", "--json-out", SIGNALS_JSON, "--bootstrap"],
    { cwd: resolve(ROOT, "parser"), encoding: "utf-8", timeout: 120_000 }
  );

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

async function loadNewSignals(): Promise<CommunitySignalIngest[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("community_signals")
    .select("*")
    .eq("status", "new")
    .eq("country_key", "portugal")
    .order("posted_at", { ascending: false })
    .limit(120);

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    message_id: Number(row.message_id),
    channel_username: String(row.channel_username),
    channel_title: row.channel_title ? String(row.channel_title) : undefined,
    post_url: row.post_url ? String(row.post_url) : undefined,
    text: String(row.text),
    topic_hints: (row.topic_hints as string[]) ?? [],
    content_kind: (row.content_kind as CommunitySignalIngest["content_kind"]) ?? "tip",
    hashtags: (row.hashtags as string[]) ?? [],
    city: String(row.city),
    country_key: String(row.country_key),
    posted_at: String(row.posted_at),
  }));
}

async function publishDrafts(max: number) {
  const signals = await loadNewSignals();
  if (signals.length === 0) {
    console.log("[draft] no new signals — skip Gemini");
    return;
  }

  const clusters = clusterSignals(signals).filter((c) => c.topic !== "general" || c.signals.length >= 5).slice(0, max);
  const supabase = createServerClient();

  for (const cluster of clusters) {
    console.log(`[draft] topic=${cluster.topic} signals=${cluster.signals.length}`);
    const draft = await draftNoteFromCluster(cluster);

    const { data: existing } = await supabase
      .from("community_notes")
      .select("id")
      .eq("slug", draft.slug)
      .maybeSingle();

    if (existing) {
      console.log(`[draft] slug exists, skip: ${draft.slug}`);
      continue;
    }

    const now = new Date().toISOString();
    const { error: insertError } = await supabase.from("community_notes").insert({
      ...draft,
      country_key: "portugal",
      city: cluster.signals[0]?.city ?? "lisbon",
      status: "published",
      published_at: now,
      updated_at: now,
    });

    if (insertError) {
      console.error(`[draft] insert failed: ${insertError.message}`);
      continue;
    }

    const ids = cluster.signals.map((s) => s.message_id);
    await supabase
      .from("community_signals")
      .update({ status: "reviewed", updated_at: now })
      .eq("country_key", "portugal")
      .in("message_id", ids);

    console.log(`[published] /notes/${draft.slug}`);
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
  console.log("[done] portugal community pipeline");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
