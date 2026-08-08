/**
 * Portugal single-story tiles from Observador RSS (v1 — one source).
 * Cheap path: RSS → score → lead fetch → one Flash batch → emigro_news_digests(format=story).
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createHash } from "crypto";
import { fetchArticleLead } from "@/lib/news/fetch-lead";
import { geminiFastJson } from "@/lib/news/gemini";
import { revalidateNewsPages } from "@/lib/news/revalidate-cache";
import { computeNewsScore, normalizeLink } from "@/lib/news/scoring";
import { mapNewsTopicRow, type NewsTopicRow } from "@/lib/news/topics/queries";
import { buildNewsStorySlug } from "@/lib/news/topics/paths";
import type { NewsTopicConfig } from "@/lib/news/topics/types";

const OBSERVADOR_FEED = "https://observador.pt/feed/";
const SOURCE_LABEL = "Observador";
const LOOKBACK_DAYS = 3;
const MAX_PER_DAY = 3;
const MAX_PER_WEEK = 15;
const MIN_SCORE = 8;
const MAX_CANDIDATES_FOR_LEAD = 8;
const MAX_BATCH = 3;

const RELEVANCE_HINTS = [
  "immigra",
  "visto",
  "visa",
  "resid",
  "cidadania",
  "nacionalidade",
  "naturaliz",
  "aima",
  "sef",
  "nif",
  "habitação",
  "habitacao",
  "arrend",
  "renda",
  "imposto",
  "irs",
  "irc",
  "ifi",
  "nhr",
  "trabalho",
  "emprego",
  "salário",
  "salario",
  "escola",
  "banco",
  "finanças",
  "financas",
  "segurança social",
  "seguranca social",
  "decreto",
  "lei ",
  "parlamento",
  "governo",
  "estrangeiro",
  "imigrante",
  "reagrupamento",
  "golden visa",
  "nomad",
  "внж",
  "гражданств",
  "иммиграц",
  "виз",
];

type RawCandidate = {
  title: string;
  link: string;
  pubDate: string;
  snippet: string;
  score: number;
};

type LeadCandidate = RawCandidate & { lead: string };

type StoryDraft = {
  source_url: string;
  title: string;
  excerpt: string;
  seo_title: string;
  seo_description: string;
  paragraphs: string[];
  key_takeaways: string[];
  tags: string[];
};

export type PortugalStoriesResult = {
  scanned: number;
  candidates: number;
  published: string[];
  skipped: string[];
  dryRun: boolean;
};

function createSupabaseAdmin(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!supabaseUrl || !serviceKey) {
    throw new Error("Supabase env missing (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)");
  }
  if (!process.env.GOOGLE_API_KEY?.trim()) {
    throw new Error("GOOGLE_API_KEY required for story summaries");
  }
  return createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function loadPortugalTopic(supabase: SupabaseClient): Promise<NewsTopicConfig> {
  const { data, error } = await supabase
    .from("emigro_news_topics")
    .select("*")
    .eq("key", "portugal")
    .maybeSingle();
  if (error) throw new Error(`portugal topic load failed: ${error.message}`);
  if (!data) throw new Error("portugal topic missing in emigro_news_topics");
  return mapNewsTopicRow(data as NewsTopicRow);
}

function ymdUtc(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

function daysAgoUtc(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

function looksRelevant(text: string): boolean {
  const t = text.toLowerCase();
  return RELEVANCE_HINTS.some((h) => t.includes(h));
}

async function fetchObservadorItems(topic: NewsTopicConfig): Promise<RawCandidate[]> {
  const Parser = (await import("rss-parser")).default;
  const parser = new Parser({ timeout: 20_000 });
  const since = daysAgoUtc(LOOKBACK_DAYS).getTime();
  const items: RawCandidate[] = [];

  const response = await fetch(OBSERVADOR_FEED, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; EmigroNewsBot/1.0; +https://www.emigro.online)",
      Accept: "application/rss+xml, application/xml, text/xml, */*",
    },
  });
  if (!response.ok) throw new Error(`Observador feed HTTP ${response.status}`);
  const parsed = await parser.parseString(await response.text());

  for (const item of parsed.items ?? []) {
    const link = normalizeLink(item.link?.trim() || item.guid?.trim() || "");
    const title = item.title?.trim() || "";
    if (!link || !title) continue;
    if (!link.includes("observador.pt")) continue;

    const pub = item.pubDate ? new Date(item.pubDate) : new Date();
    if (!Number.isFinite(pub.getTime()) || pub.getTime() < since) continue;

    const snippet = String(item.contentSnippet || item.content || title)
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 500);

    if (!looksRelevant(`${title} ${snippet}`)) continue;

    const score = computeNewsScore(title, snippet, link, pub.toISOString(), topic) + 8;
    if (score < MIN_SCORE) continue;

    items.push({ title, link, pubDate: pub.toISOString(), snippet, score });
  }

  items.sort((a, b) => b.score - a.score || b.pubDate.localeCompare(a.pubDate));
  return items;
}

async function alreadyPublishedUrls(supabase: SupabaseClient, _urls: string[]): Promise<Set<string>> {
  // Prefer format=story; fall back to slug prefix if migration not applied yet.
  let data: { source_links?: unknown; slug?: string }[] | null = null;
  const withFormat = await supabase
    .from("emigro_news_digests")
    .select("source_links, slug")
    .eq("topic_key", "portugal")
    .eq("format", "story")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(80);

  if (withFormat.error && /format/i.test(withFormat.error.message)) {
    const bySlug = await supabase
      .from("emigro_news_digests")
      .select("source_links, slug")
      .eq("topic_key", "portugal")
      .like("slug", "portugal-story-%")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(80);
    if (bySlug.error) {
      console.warn("[portugal-stories] dedupe query failed:", bySlug.error.message);
      return new Set();
    }
    data = bySlug.data;
  } else if (withFormat.error) {
    console.warn("[portugal-stories] dedupe query failed:", withFormat.error.message);
    return new Set();
  } else {
    data = withFormat.data;
  }

  const published = new Set<string>();
  for (const row of data ?? []) {
    const links = (row.source_links ?? []) as { url?: string }[];
    for (const l of links) {
      if (l.url) published.add(normalizeLink(l.url));
    }
  }
  return published;
}

async function countRecentStories(supabase: SupabaseClient, sinceIso: string): Promise<number> {
  const withFormat = await supabase
    .from("emigro_news_digests")
    .select("*", { count: "exact", head: true })
    .eq("topic_key", "portugal")
    .eq("format", "story")
    .eq("status", "published")
    .gte("published_at", sinceIso);

  if (withFormat.error && /format/i.test(withFormat.error.message)) {
    const bySlug = await supabase
      .from("emigro_news_digests")
      .select("*", { count: "exact", head: true })
      .eq("topic_key", "portugal")
      .like("slug", "portugal-story-%")
      .eq("status", "published")
      .gte("published_at", sinceIso);
    if (bySlug.error) {
      console.warn("[portugal-stories] count failed:", bySlug.error.message);
      return 0;
    }
    return bySlug.count ?? 0;
  }

  if (withFormat.error) {
    console.warn("[portugal-stories] count failed:", withFormat.error.message);
    return 0;
  }
  return withFormat.count ?? 0;
}

async function summarizeBatch(candidates: LeadCandidate[]): Promise<StoryDraft[]> {
  const payload = candidates.map((c, i) => ({
    idx: i,
    source_url: c.link,
    source_title: c.title,
    published_at: c.pubDate,
    rss_snippet: c.snippet,
    lead: c.lead,
  }));

  const system = `You write short RU news summaries for Emigro (relocation portal for Russian speakers moving to Portugal).
Rules:
- Russian language only.
- Facts only from the provided title/snippet/lead. Do not invent numbers, dates, or legal thresholds.
- Calm tone. Not a how-to guide or checklist.
- title: ≤80 chars, specific.
- excerpt: 1–2 sentences for the card.
- paragraphs: 2–4 short paragraphs, total ~800–1200 characters.
- key_takeaways: 2–3 bullets "для кого важно" for relocators (visas, housing, taxes, work) only if grounded in the source.
- tags: 2–5 short RU tags.
- seo_title ≤70 chars; seo_description ≤155 chars.
- Keep source_url EXACTLY identical to the input source_url string (copy-paste, do not rewrite).
- Also set candidate_idx to the input idx number.
- Skip inventing "official" claims. If unclear, stay vague.`;

  const user = `Summarize these Observador items for Emigro Portugal news tiles. Return one story per useful item.\n\n${JSON.stringify(payload)}`;

  const schema = {
    type: "OBJECT",
    properties: {
      stories: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            candidate_idx: { type: "NUMBER" },
            source_url: { type: "STRING" },
            title: { type: "STRING" },
            excerpt: { type: "STRING" },
            seo_title: { type: "STRING" },
            seo_description: { type: "STRING" },
            paragraphs: { type: "ARRAY", items: { type: "STRING" } },
            key_takeaways: { type: "ARRAY", items: { type: "STRING" } },
            tags: { type: "ARRAY", items: { type: "STRING" } },
          },
          required: [
            "candidate_idx",
            "source_url",
            "title",
            "excerpt",
            "seo_title",
            "seo_description",
            "paragraphs",
            "key_takeaways",
            "tags",
          ],
        },
      },
    },
    required: ["stories"],
  };

  type RawStory = StoryDraft & { candidate_idx?: number };
  const result = await geminiFastJson<{ stories: RawStory[] }>(system, user, schema, 4096);
  console.log(`[portugal-stories] gemini returned ${(result.stories ?? []).length} stories`);

  const out: StoryDraft[] = [];
  for (const s of result.stories ?? []) {
    const byIdx =
      typeof s.candidate_idx === "number" && s.candidate_idx >= 0 && s.candidate_idx < candidates.length
        ? candidates[s.candidate_idx]
        : undefined;
    const byUrl = candidates.find((c) => normalizeLink(c.link) === normalizeLink(s.source_url || ""));
    const matched = byIdx ?? byUrl;
    if (!matched) {
      console.warn(`[portugal-stories] unmatched story url=${s.source_url} idx=${s.candidate_idx}`);
      continue;
    }
    if (!s.title?.trim() || !s.excerpt?.trim() || !Array.isArray(s.paragraphs) || s.paragraphs.length === 0) {
      console.warn(`[portugal-stories] incomplete story for ${matched.link}`);
      continue;
    }
    out.push({
      source_url: matched.link,
      title: s.title.trim().slice(0, 120),
      excerpt: s.excerpt.trim().slice(0, 320),
      seo_title: (s.seo_title || s.title).trim().slice(0, 70),
      seo_description: (s.seo_description || s.excerpt).trim().slice(0, 155),
      paragraphs: s.paragraphs.map((p) => p.trim()).filter(Boolean).slice(0, 4),
      key_takeaways: (s.key_takeaways ?? []).map((t) => t.trim()).filter(Boolean).slice(0, 3),
      tags: (s.tags ?? []).map((t) => t.trim()).filter(Boolean).slice(0, 5),
    });
  }
  return out;
}

function storyDateYmd(pubDate: string): string {
  const d = new Date(pubDate);
  return Number.isFinite(d.getTime()) ? d.toISOString().slice(0, 10) : ymdUtc();
}

export async function generatePortugalStories(options?: {
  dryRun?: boolean;
  maxPublish?: number;
}): Promise<PortugalStoriesResult> {
  const dryRun = Boolean(options?.dryRun);
  const maxPublish = Math.max(1, Math.min(MAX_PER_DAY, options?.maxPublish ?? MAX_PER_DAY));
  const supabase = createSupabaseAdmin();
  const topic = await loadPortugalTopic(supabase);

  const todayCount = await countRecentStories(supabase, `${ymdUtc()}T00:00:00.000Z`);
  const weekCount = await countRecentStories(
    supabase,
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  );
  const dayBudget = Math.max(0, MAX_PER_DAY - todayCount);
  const weekBudget = Math.max(0, MAX_PER_WEEK - weekCount);
  const budget = Math.min(maxPublish, dayBudget, weekBudget);

  if (budget <= 0) {
    console.log(
      `[portugal-stories] budget exhausted (today=${todayCount}/${MAX_PER_DAY}, week=${weekCount}/${MAX_PER_WEEK})`
    );
    return { scanned: 0, candidates: 0, published: [], skipped: ["budget"], dryRun };
  }

  const raw = await fetchObservadorItems(topic);
  console.log(`[portugal-stories] scanned feed candidates=${raw.length}`);

  const publishedUrls = await alreadyPublishedUrls(
    supabase,
    raw.map((r) => r.link)
  );
  const fresh = raw.filter((r) => !publishedUrls.has(normalizeLink(r.link))).slice(0, MAX_CANDIDATES_FOR_LEAD);

  const withLead: LeadCandidate[] = [];
  for (const item of fresh) {
    if (withLead.length >= budget) break;
    const lead = (await fetchArticleLead(item.link)) || item.snippet;
    if (!lead || lead.length < 40) {
      console.log(`[portugal-stories] skip (no lead): ${item.link}`);
      continue;
    }
    withLead.push({ ...item, lead });
  }

  if (withLead.length === 0) {
    return { scanned: raw.length, candidates: 0, published: [], skipped: ["no-lead"], dryRun };
  }

  const drafts = dryRun
    ? withLead.slice(0, budget).map((c) => ({
        source_url: c.link,
        title: `[dry-run] ${c.title}`.slice(0, 120),
        excerpt: c.snippet.slice(0, 280),
        seo_title: c.title.slice(0, 70),
        seo_description: c.snippet.slice(0, 155),
        paragraphs: [c.lead.slice(0, 600)],
        key_takeaways: ["Проверьте актуальность на сайте источника."],
        tags: ["Португалия", "Observador"],
      }))
    : await summarizeBatch(withLead.slice(0, budget));

  if (drafts.length === 0) {
    console.log("[portugal-stories] no usable drafts after Gemini");
    return { scanned: raw.length, candidates: withLead.length, published: [], skipped: ["no-drafts"], dryRun };
  }

  const published: string[] = [];
  const skipped: string[] = [];

  for (const draft of drafts.slice(0, budget)) {
    const source = withLead.find((c) => normalizeLink(c.link) === normalizeLink(draft.source_url));
    if (!source) {
      skipped.push(draft.source_url);
      continue;
    }
    const day = storyDateYmd(source.pubDate);
    const slug = buildNewsStorySlug("portugal", day, draft.source_url);
    const bodyText = draft.paragraphs.join("\n\n");
    if (!dryRun && bodyText.length < 200) {
      skipped.push(`${slug}:too-short`);
      continue;
    }

    const payload = {
      slug,
      corridor_slug: topic.corridorSlug || "ru-speaking-to-portugal",
      topic_key: "portugal",
      country: topic.countryRu || "Португалия",
      locale: "ru",
      title: draft.title,
      excerpt: draft.excerpt,
      seo_title: draft.seo_title,
      seo_description: draft.seo_description,
      content_blocks: [
        {
          heading: draft.title,
          paragraphs: draft.paragraphs,
          bullets: draft.key_takeaways,
          source_name: SOURCE_LABEL,
          source_url: draft.source_url,
          story_title: source.title,
        },
      ],
      key_takeaways: draft.key_takeaways,
      tags: draft.tags.length ? draft.tags : ["Португалия"],
      source_links: [{ title: SOURCE_LABEL, url: draft.source_url }],
      telegram_html: null,
      threads_text: null,
      week_start: day,
      week_end: day,
      published_at: new Date().toISOString(),
      status: "published" as const,
      format: "story" as const,
      updated_at: new Date().toISOString(),
    };

    if (dryRun) {
      console.log(`[portugal-stories] dry-run would publish ${slug}`);
      published.push(slug);
      continue;
    }

    const { error } = await supabase.from("emigro_news_digests").upsert(payload, { onConflict: "slug" });
    if (error) {
      console.warn(`[portugal-stories] upsert failed ${slug}:`, error.message);
      skipped.push(`${slug}:${error.message}`);
      continue;
    }
    published.push(slug);
    console.log(`[portugal-stories] published ${slug}`);
  }

  if (!dryRun && published.length > 0) {
    await revalidateNewsPages(published);
  }

  return {
    scanned: raw.length,
    candidates: withLead.length,
    published,
    skipped,
    dryRun,
  };
}

/** Stable id helper (unused externally; kept for tests). */
export function storyContentHash(url: string, title: string): string {
  return createHash("sha1").update(`${url}|${title}`).digest("hex").slice(0, 8);
}
