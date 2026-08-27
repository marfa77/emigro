/**
 * One SEO guide → one @Emigro_news post. Never re-queue a slug already
 * in guide_telegram_drafts or already linked from the public channel.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import { listGuides } from "@/lib/guides/load";

export const CHANNEL_PREVIEW_URL = "https://t.me/s/Emigro_news";
export const GUIDE_TELEGRAM_ARCHIVE_AT = "2026-01-01T00:00:00.000Z";

const HANDLED_STATUSES = ["pending", "published", "skipped", "skipped_critical"] as const;

function normalizeGuideSlug(raw: string): string | null {
  const slug = raw.split("?")[0].replace(/\/$/, "").toLowerCase();
  if (!slug || slug.startsWith("_")) return null;
  return slug;
}

/** Guide slugs linked from t.me/s HTML or any Telegram post body. */
export function extractGuideSlugsFromChannelHtml(html: string): string[] {
  const slugs = new Set<string>();
  const re = /(?:https:\/\/(?:www\.)?emigro\.online)?\/ru\/guides\/([a-z0-9-]+)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const slug = normalizeGuideSlug(m[1]);
    if (slug) slugs.add(slug);
  }
  return [...slugs].sort();
}

function extractChannelMessageIds(html: string): number[] {
  return [...html.matchAll(/t\.me\/Emigro_news\/(\d+)/gi)]
    .map((m) => Number(m[1]))
    .filter((n) => Number.isFinite(n) && n > 0);
}

async function fetchChannelPreviewPage(before?: number): Promise<string> {
  const url = before ? `${CHANNEL_PREVIEW_URL}?before=${before}` : CHANNEL_PREVIEW_URL;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; EmigroBot/1.0)" },
  });
  if (!res.ok) throw new Error(`channel preview HTTP ${res.status}`);
  return res.text();
}

/**
 * Walk t.me/s/Emigro_news pages (`?before=`). Public preview is ~20 posts/page;
 * a single fetch misses older guide links and the queue re-posts them.
 */
export async function fetchChannelPostedGuideSlugs(options?: {
  maxPages?: number;
}): Promise<string[]> {
  const maxPages = options?.maxPages ?? 40;
  const all = new Set<string>();
  let before: number | undefined;
  const seenPages = new Set<string>();

  for (let i = 0; i < maxPages; i++) {
    const html = await fetchChannelPreviewPage(before);
    const ids = extractChannelMessageIds(html);
    const pageKey = ids.length ? `${Math.min(...ids)}-${Math.max(...ids)}` : "empty";
    if (seenPages.has(pageKey)) break;
    seenPages.add(pageKey);
    for (const slug of extractGuideSlugsFromChannelHtml(html)) all.add(slug);
    if (!ids.length) break;
    const oldest = Math.min(...ids);
    if (oldest <= 1) break;
    before = oldest;
  }

  return [...all].sort();
}

export async function listHandledGuideSlugs(supabase: SupabaseClient): Promise<Set<string>> {
  const slugs = new Set<string>();
  const pageSize = 1000;
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from("guide_telegram_drafts")
      .select("slug")
      .in("status", [...HANDLED_STATUSES])
      .range(from, from + pageSize - 1);
    if (error) throw new Error(`guide_telegram_drafts: ${error.message}`);
    const rows = data ?? [];
    for (const row of rows) {
      const slug = String(row.slug || "").trim();
      if (slug) slugs.add(slug);
    }
    if (rows.length < pageSize) break;
    from += pageSize;
  }

  return slugs;
}

/** Insert archive rows for channel slugs missing from the table — no new channel post. */
export async function rememberChannelGuideSlugs(
  supabase: SupabaseClient,
  slugs: string[]
): Promise<number> {
  const titles = new Map(listGuides().map((g) => [g.slug, g.title]));
  let inserted = 0;

  for (const slug of slugs) {
    const { data: existing, error: lookupError } = await supabase
      .from("guide_telegram_drafts")
      .select("id")
      .eq("slug", slug)
      .limit(1);
    if (lookupError) {
      console.warn(`[guide-tg] archive lookup ${slug}:`, lookupError.message);
      continue;
    }
    if ((existing ?? []).length > 0) continue;

    const { error } = await supabase.from("guide_telegram_drafts").insert({
      slug,
      title: titles.get(slug) || slug,
      html: "(seeded: already in @Emigro_news)",
      status: "published",
      factcheck_notes: "seeded from @Emigro_news — no repeat promo",
      resolved_at: GUIDE_TELEGRAM_ARCHIVE_AT,
    });
    if (error) {
      console.warn(`[guide-tg] archive insert ${slug}:`, error.message);
      continue;
    }
    inserted += 1;
  }

  return inserted;
}
