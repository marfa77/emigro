/**
 * Index channel history into community_signals + refresh license guide.
 *
 *   npm run portugal:index-license-history
 *
 * Expects parser/out/signals-history.json (from VPS: main.py --since-days 400 --json-out)
 * and parser/out/license-raw-scan.json (raw keyword scan).
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { DRIVING_LICENSE_EXCHANGE_GUIDE } from "@/lib/community-notes/guides/driving-license-exchange";
import { validateNoteDraft } from "@/lib/community-notes/editorial-quality";
import { refreshDailySpotlight } from "@/lib/community-notes/daily-spotlight";
import { ingestCommunitySignals } from "@/lib/community-notes/queries";
import { createServerClient } from "@/lib/supabase/server";
import { syncParserStateFromSupabase } from "@/lib/community-notes/sync-parser-state";
import type { CommunitySignalIngest, ContentKind } from "@/lib/community-notes/types";

const ROOT = resolve(process.cwd());
const HISTORY_JSON = resolve(ROOT, "parser/out/signals-history.json");
const RAW_JSON = resolve(ROOT, "parser/out/license-raw-scan.json");

const EXCHANGE_RE =
  /troca|обмен|замен|конверт|imt\b|minha carta|autentic|certificado de autentic|certidão de autentic|carta de condu|водител.*удостоверен|удостоверен.*водител|иностранн.*прав|прав.*португ|перевод.*прав|поменять права|сменить права|atestado m|медком|медосмотр.*прав/i;

const NOISE_RE =
  /гражданств|школ|экзамен на a2|ciple|парковк|фаркоп|cybercab|проститут|барахолк|инструктор по вожден/i;

function loadJson<T>(path: string): T | null {
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf-8")) as T;
}

function rawToIngest(row: {
  channel: string;
  id: number;
  date: string;
  text: string;
}): CommunitySignalIngest {
  const text = row.text.trim();
  const contentKind: ContentKind = /\?/.test(text) ? "qa" : text.length > 400 ? "guide" : "tip";
  return {
    message_id: row.id,
    channel_username: row.channel.replace(/^@/, ""),
    post_url: `https://telegram.me/${row.channel.replace(/^@/, "")}/${row.id}`,
    text,
    topic_hints: ["auto"],
    content_kind: contentKind,
    hashtags: ["auto", "imt", "portugal", contentKind],
    city: row.channel === "por_tugal" || row.channel === "autolife_pt" ? "portugal" : "lisbon",
    country_key: "portugal",
    posted_at: row.date.replace("+00:00", "Z"),
  };
}

async function publishGuide() {
  const guide = DRIVING_LICENSE_EXCHANGE_GUIDE;
  const errors = validateNoteDraft({
    content_kind: guide.content_kind,
    seo_title: guide.seo_title,
    seo_description: guide.seo_description,
    quick_answer: guide.quick_answer,
    body_sections: guide.body_sections,
    body_paragraphs: guide.body_paragraphs,
    faq: guide.faq,
    key_takeaways: guide.key_takeaways,
  });
  if (errors.length > 0) throw new Error(`Quality gate: ${errors.join("; ")}`);

  const supabase = createServerClient();
  const now = new Date().toISOString();
  const { data: existing } = await supabase
    .from("community_notes")
    .select("id, published_at")
    .eq("slug", guide.slug)
    .maybeSingle();

  const row = {
    ...guide,
    country_key: "portugal",
    city: "lisbon",
    status: "published" as const,
    published_at: existing?.published_at ?? now,
    updated_at: now,
  };

  if (existing) {
    await supabase.from("community_notes").update(row).eq("id", existing.id);
    console.log(`[guide] updated ${guide.slug}`);
  } else {
    await supabase.from("community_notes").insert(row);
    console.log(`[guide] created ${guide.slug}`);
  }
}

async function main() {
  const history = loadJson<{ signals?: CommunitySignalIngest[] }>(HISTORY_JSON);
  const raw = loadJson<Array<{ channel: string; id: number; date: string; text: string }>>(RAW_JSON);

  const merged = new Map<string, CommunitySignalIngest>();

  for (const s of history?.signals ?? []) {
    const key = `${s.channel_username}:${s.message_id}`;
    merged.set(key, s);
  }

  let rawAdded = 0;
  for (const row of raw ?? []) {
    if (!EXCHANGE_RE.test(row.text)) continue;
    if (NOISE_RE.test(row.text) && !/imt|troca|обмен|замен|autentic|carta de condu/i.test(row.text)) continue;
    const key = `${row.channel}:${row.id}`;
    if (!merged.has(key)) {
      merged.set(key, rawToIngest(row));
      rawAdded += 1;
    }
  }

  const batch = Array.from(merged.values());
  console.log(`[index] history=${history?.signals?.length ?? 0} raw_exchange_added=${rawAdded} total=${batch.length}`);

  if (batch.length > 0) {
    const ing = await ingestCommunitySignals(batch);
    console.log("[ingest]", ing);
  }

  await syncParserStateFromSupabase();
  await publishGuide();
  const spotlight = await refreshDailySpotlight("portugal");
  console.log("[spotlight]", spotlight?.note_slug);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
