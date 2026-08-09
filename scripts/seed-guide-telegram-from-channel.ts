#!/usr/bin/env npx tsx
/**
 * Mark SEO guides already linked from public @Emigro_news as published
 * so news:guide-promo never re-queues them.
 *
 *   npx tsx scripts/seed-guide-telegram-from-channel.ts
 */
import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";
import { listGuides } from "../lib/guides/load";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

const CHANNEL_PREVIEW = "https://t.me/s/Emigro_news";

async function fetchChannelGuideSlugs(): Promise<string[]> {
  const res = await fetch(CHANNEL_PREVIEW, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; EmigroBot/1.0)" },
  });
  if (!res.ok) throw new Error(`channel preview HTTP ${res.status}`);
  const html = await res.text();
  const slugs = new Set<string>();
  const re = /(?:https:\/\/www\.emigro\.online)?\/ru\/guides\/([a-z0-9\-]+)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const slug = m[1].split("?")[0].replace(/\/$/, "");
    if (slug && !slug.startsWith("_")) slugs.add(slug);
  }
  return [...slugs].sort();
}

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(/\/$/, ""),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
  const titles = new Map(listGuides().map((g) => [g.slug, g.title]));
  const slugs = await fetchChannelGuideSlugs();
  console.log(`Found ${slugs.length} guide links on ${CHANNEL_PREVIEW}`);

  const now = new Date().toISOString();
  let inserted = 0;
  let updated = 0;

  for (const slug of slugs) {
    const { data: existing } = await supabase
      .from("guide_telegram_drafts")
      .select("id, status")
      .eq("slug", slug)
      .maybeSingle();

    if (existing?.status === "published") continue;

    if (existing) {
      const { error } = await supabase
        .from("guide_telegram_drafts")
        .update({
          status: "published",
          factcheck_notes: "seeded from @Emigro_news — no repeat promo",
          resolved_at: now,
          updated_at: now,
        })
        .eq("id", existing.id);
      if (error) throw error;
      updated += 1;
      console.log("→ published", slug);
      continue;
    }

    const { error } = await supabase.from("guide_telegram_drafts").insert({
      slug,
      title: titles.get(slug) || slug,
      html: "(seeded: already in @Emigro_news)",
      status: "published",
      factcheck_notes: "seeded from @Emigro_news — no repeat promo",
      resolved_at: now,
    });
    if (error) throw error;
    inserted += 1;
    console.log("+ published", slug);
  }

  console.log(JSON.stringify({ inserted, updated, scanned: slugs.length }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
