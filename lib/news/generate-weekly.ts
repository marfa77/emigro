import { createClient } from "@supabase/supabase-js";
import {
  buildNewsDigestSlug,
  getActiveNewsTopics,
  getNewsTopicOrThrow,
} from "@/lib/news/topics";
import {
  SCHEMA_COMPRESS,
  SCHEMA_SELECTION,
  SCHEMA_SITE_DIGEST_RU,
  SCHEMA_TELEGRAM_HTML,
  geminiFastJson,
  geminiProJson,
} from "@/lib/news/gemini";
import { MIN_SELECTED_FLOOR, SELECTED_COUNT, TELEGRAM_DIGEST_MAX_CHARS } from "@/lib/news/editorial";
import {
  buildCompressPrompt,
  buildSelectionPrompts,
  buildSiteDigestPrompts,
  buildTelegramPrompts,
} from "@/lib/news/prompts";
import { validateSiteDigestQuality, validateTelegramDigestQuality, validateThreadsQuality } from "@/lib/news/quality";
import { enrichStoryLinks, filterResolvableStories, googleNewsLinkRatio } from "@/lib/news/article-resolve";
import { isLowTrustSource } from "@/lib/news/scoring";
import { collectNewsItems, isCriticalItem, type RawNewsItem } from "@/lib/news/rss";
import {
  addArticleLinkToDigest,
  buildDeterministicDigestFallback,
  digestHtmlFormatViolation,
  enforceSinglePostLimit,
  ensureTelegramHtmlBlockSpacing,
  sanitizeTelegramHtml,
  stripLeadingWeekBannerLine,
  weekHeaderLine,
  type SelectedStory,
} from "@/lib/news/telegram-html";
import { buildThreadsThreadFromDigestHtml, buildThreadsFromSiteDigest } from "@/lib/news/threads";
import { pingSearchEnginesSitemap } from "@/lib/corridor/paths";
import { trackServerEvent } from "@/lib/analytics/server";
import { publishNewsDigestToChannel, newsTelegramChannelUrl } from "@/lib/telegram";
import { newsArticleUrl, publicSiteUrl } from "@/lib/site-url";
import type { NewsTopicConfig } from "@/lib/news/topics";

export type WeeklyNewsResult =
  | { outcome: "skipped"; topic: string; reason: string }
  | { outcome: "published"; topic: string; slug: string; articleUrl: string };

type SiteDigestRu = {
  title: string;
  excerpt: string;
  seo_title: string;
  seo_description: string;
  key_takeaways: string[];
  content_blocks: Array<{
    heading: string;
    paragraphs: string[];
    bullets?: string[];
    source_name?: string;
    source_url?: string;
    story_title?: string;
  }>;
  tags: string[];
};

function toYmd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function getWeekWindow(): { weekFrom: Date; weekTo: Date; weekEnd: Date } {
  const weekTo = new Date();
  weekTo.setUTCHours(0, 0, 0, 0);
  const weekFrom = new Date(weekTo);
  weekFrom.setUTCDate(weekFrom.getUTCDate() - 7);
  const weekEnd = new Date(weekTo);
  weekEnd.setUTCDate(weekEnd.getUTCDate() - 1);
  return { weekFrom, weekTo, weekEnd };
}

async function selectStories(candidates: RawNewsItem[], topic: NewsTopicConfig): Promise<SelectedStory[]> {
  const { system, user, pool } = buildSelectionPrompts(topic, candidates);
  const picked = await geminiFastJson<{ selected: Array<{ candidate_idx: number; title: string; why: string }> }>(
    system,
    user,
    SCHEMA_SELECTION
  );

  let selected: SelectedStory[] = picked.selected
    .map((s) => {
      const item = pool[s.candidate_idx];
      if (!item) return null;
      return {
        title: item.title,
        link: item.link,
        source: item.source,
        why: s.why || "",
        snippet: item.snippet,
      };
    })
    .filter((x): x is SelectedStory => Boolean(x))
    .slice(0, SELECTED_COUNT);

  const criticalInPool = pool.filter(isCriticalItem);
  if (criticalInPool.length > 0 && !selected.some((s) => isCriticalItem(s))) {
    const critical = criticalInPool[0];
    selected = [
      {
        title: critical.title,
        link: critical.link,
        source: critical.source,
        why: "Критический риск: потенциальное изменение сроков гражданства/натурализации.",
        snippet: critical.snippet,
      },
      ...selected,
    ].slice(0, SELECTED_COUNT);
    console.warn(`[news:${topic.key}] enforced critical-risk item into selection`);
  }

  return selected;
}

async function generateSiteDigestRu(
  topic: NewsTopicConfig,
  selected: RawNewsItem[],
  weekStart: string,
  weekEnd: string,
  sourceLinks: Array<{ title: string; url: string }>
): Promise<SiteDigestRu> {
  const { system, user } = buildSiteDigestPrompts(topic, selected, weekStart, weekEnd);
  let digest = await geminiProJson<SiteDigestRu>(system, user, SCHEMA_SITE_DIGEST_RU);

  for (let attempt = 0; attempt < 3; attempt++) {
    const errors = validateSiteDigestQuality({
      topic: topic.key,
      weekEnd,
      digest,
      selectedCount: selected.length,
      sourceLinks,
    });
    if (errors.length === 0) return digest;
    console.warn(`[news:${topic.key}] site QA attempt ${attempt + 1}:`, errors.join("; "));
    digest = await geminiProJson<SiteDigestRu>(
      `${system}\n\nИсправь ошибки:\n${errors.join("\n")}`,
      user,
      SCHEMA_SITE_DIGEST_RU
    );
  }

  const finalErrors = validateSiteDigestQuality({
    topic: topic.key,
    weekEnd,
    digest,
    selectedCount: selected.length,
    sourceLinks,
  });
  if (finalErrors.length > 0) {
    throw new Error(`Site digest failed QA: ${finalErrors.join("; ")}`);
  }
  return digest;
}

async function compressDigest(html: string, topic: NewsTopicConfig): Promise<string> {
  const { system, user } = buildCompressPrompt(html, topic);
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await geminiFastJson<{ digest_html: string }>(system, user, SCHEMA_COMPRESS, 8192);
      const out = sanitizeTelegramHtml(res.digest_html || "");
      if (out && out.length <= TELEGRAM_DIGEST_MAX_CHARS) return out;
    } catch (err) {
      console.warn(
        `[news:${topic.key}] compress attempt ${attempt + 1} failed:`,
        err instanceof Error ? err.message : err
      );
    }
  }
  console.warn(`[news:${topic.key}] compress fallback — hard clamp`);
  return enforceSinglePostLimit(html);
}

async function generateTelegramHtml(
  topic: NewsTopicConfig,
  selected: SelectedStory[],
  weekFrom: Date,
  weekEnd: Date,
  articleUrl: string,
  sourceLinks: Array<{ title: string; url: string }>
): Promise<string> {
  const { system, user } = buildTelegramPrompts(topic, selected, weekFrom, weekEnd, articleUrl);
  const headerLine = weekHeaderLine(topic.flag, weekFrom, weekEnd);

  let res = await geminiProJson<{ digest_html: string }>(system, user, SCHEMA_TELEGRAM_HTML, 12288);

  for (let formatRetries = 1; formatRetries >= 0; formatRetries--) {
    for (let factualRetries = 1; factualRetries >= 0; factualRetries--) {
      let body = sanitizeTelegramHtml(res.digest_html || "");
      body = ensureTelegramHtmlBlockSpacing(body);
      body = stripLeadingWeekBannerLine(body);
      let html = `${headerLine}\n\n${body.trim()}`;
      html = addArticleLinkToDigest(html, articleUrl);

      const factualErrors = validateTelegramDigestQuality({
        topic: topic.key,
        weekEnd,
        digestHtml: html,
        sourceLinks,
      });
      if (factualErrors.length > 0 && factualRetries > 0) {
        console.warn(`[news:${topic.key}] telegram factual QA:`, factualErrors.join("; "));
        res = await geminiProJson<{ digest_html: string }>(
          `${system}\n\nИсправь:\n${factualErrors.join("\n")}`,
          user,
          SCHEMA_TELEGRAM_HTML
        );
        continue;
      }

      const viol = digestHtmlFormatViolation(html, selected);
      if (!viol) {
        if (html.length > 3900) html = await compressDigest(html, topic);
        return enforceSinglePostLimit(html);
      }

      if (formatRetries > 0) {
        console.warn(`[news:${topic.key}] format QA: ${viol} — retry`);
        res = await geminiProJson<{ digest_html: string }>(
          system,
          `${user}\n\nИсправь проблему: ${viol}. Перепиши digest_html целиком.`,
          SCHEMA_TELEGRAM_HTML
        );
        break;
      }

      html = buildDeterministicDigestFallback(headerLine, selected, topic.countryRu);
      html = addArticleLinkToDigest(html, articleUrl);
      return enforceSinglePostLimit(html);
    }
  }

  return enforceSinglePostLimit(
    buildDeterministicDigestFallback(headerLine, selected, topic.countryRu)
  );
}

export async function runWeeklyNewsForTopic(
  topicKey: string,
  options?: { dryRun?: boolean; skipTelegram?: boolean; force?: boolean }
): Promise<WeeklyNewsResult> {
  const topic = await getNewsTopicOrThrow(topicKey);
  const dryRun = options?.dryRun ?? false;
  const { weekFrom, weekTo, weekEnd } = getWeekWindow();
  const weekStartYmd = toYmd(weekFrom);
  const weekEndYmd = toYmd(weekEnd);
  const slug = buildNewsDigestSlug(topic.key, weekEndYmd);
  const siteArticleUrl = newsArticleUrl(slug);
  const channelUrl = newsTelegramChannelUrl();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!supabaseUrl || !serviceKey) throw new Error("Supabase env missing");

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: existing } = await supabase.from("emigro_news_digests").select("id").eq("slug", slug).maybeSingle();
  if (existing && !options?.force) {
    return { outcome: "skipped", topic: topic.key, reason: `digest already exists: ${slug}` };
  }

  const candidates = await collectNewsItems(topic, weekFrom, weekTo);
  if (candidates.length < MIN_SELECTED_FLOOR) {
    return { outcome: "skipped", topic: topic.key, reason: `too few news items: ${candidates.length}` };
  }

  const preResolved = await enrichStoryLinks(candidates.slice(0, 35));
  const resolvablePool = filterResolvableStories(preResolved).filter(
    (s) => !isLowTrustSource(s.resolved_link)
  );
  if (resolvablePool.length < MIN_SELECTED_FLOOR) {
    return {
      outcome: "skipped",
      topic: topic.key,
      reason: `too few resolvable publisher URLs: ${resolvablePool.length}/${preResolved.length}`,
    };
  }

  const selected = await selectStories(
    resolvablePool.map((s) => ({
      title: s.title,
      link: s.resolved_link,
      source: s.resolved_source,
      pubDate: weekEnd.toISOString(),
      snippet: s.snippet,
      score: 0,
    })),
    topic
  );
  if (selected.length < MIN_SELECTED_FLOOR) {
    return { outcome: "skipped", topic: topic.key, reason: "selection returned too few stories" };
  }

  const enriched = await enrichStoryLinks(selected);
  const resolvedSelected = filterResolvableStories(enriched);
  if (resolvedSelected.length < MIN_SELECTED_FLOOR) {
    return {
      outcome: "skipped",
      topic: topic.key,
      reason: `selected stories lack direct publisher URLs (${resolvedSelected.length})`,
    };
  }

  const sourceLinks = resolvedSelected.map((s) => ({ title: s.resolved_source, url: s.resolved_link }));
  if (googleNewsLinkRatio(sourceLinks) > 0) {
    return { outcome: "skipped", topic: topic.key, reason: "source links still contain Google News URLs" };
  }

  const selectedStories: SelectedStory[] = resolvedSelected.map((s) => ({
    title: s.title,
    link: s.resolved_link,
    source: s.resolved_source,
    why: s.why,
    snippet: s.snippet,
  }));

  const selectedRaw: RawNewsItem[] = resolvedSelected.map((s) => ({
    title: s.title,
    link: s.resolved_link,
    source: s.resolved_source,
    pubDate: weekEnd.toISOString(),
    snippet: s.snippet,
    score: 0,
  }));

  const [siteDigest, telegramHtml] = await Promise.all([
    generateSiteDigestRu(topic, selectedRaw, weekStartYmd, weekEndYmd, sourceLinks),
    generateTelegramHtml(topic, selectedStories, weekFrom, weekEnd, siteArticleUrl, sourceLinks),
  ]);

  let finalThreadsText = buildThreadsFromSiteDigest({
    topic,
    weekFrom,
    weekEnd,
    channelUrl,
    siteArticleUrl,
    title: siteDigest.title,
    excerpt: siteDigest.excerpt,
    keyTakeaways: siteDigest.key_takeaways,
    contentBlocks: siteDigest.content_blocks,
    sourceLinks,
  });

  let threadsErrors = validateThreadsQuality({ threadsText: finalThreadsText, topic: topic.key });
  if (threadsErrors.length > 0) {
    console.warn(`[news:${topic.key}] threads QA (site-based):`, threadsErrors.join("; "));
    finalThreadsText = buildThreadsThreadFromDigestHtml({
      topic,
      digestHtml: telegramHtml,
      weekFrom,
      weekEnd,
      channelUrl,
      siteArticleUrl,
      sourceLinks,
      fallbackTakeaways: siteDigest.key_takeaways,
      fallbackExcerpt: siteDigest.excerpt,
    });
    threadsErrors = validateThreadsQuality({ threadsText: finalThreadsText, topic: topic.key });
  }

  if (threadsErrors.length > 0) {
    throw new Error(`Threads digest failed QA: ${threadsErrors.join("; ")}`);
  }

  const payload = {
    slug,
    corridor_slug: topic.corridorSlug,
    topic_key: topic.key,
    country: topic.countryRu,
    locale: "ru",
    title: siteDigest.title,
    excerpt: siteDigest.excerpt,
    seo_title: siteDigest.seo_title,
    seo_description: siteDigest.seo_description,
    content_blocks: siteDigest.content_blocks,
    key_takeaways: siteDigest.key_takeaways,
    tags: Array.from(new Set([...siteDigest.tags, ...topic.seoTags])).slice(0, 12),
    source_links: sourceLinks,
    telegram_html: telegramHtml,
    threads_text: finalThreadsText,
    week_start: weekStartYmd,
    week_end: weekEndYmd,
    published_at: new Date().toISOString(),
    status: "published",
    updated_at: new Date().toISOString(),
  };

  if (dryRun) {
    console.log(JSON.stringify({ topic: topic.key, slug, title: payload.title, telegramLen: telegramHtml.length }, null, 2));
    return { outcome: "skipped", topic: topic.key, reason: "dry-run (not saved)" };
  }

  const { error } = await supabase.from("emigro_news_digests").upsert(payload, { onConflict: "slug" });
  if (error) throw new Error(error.message);

  if (!options?.skipTelegram) {
    try {
      await publishNewsDigestToChannel(finalThreadsText, {
        flag: topic.flag,
        countryRu: topic.countryRu,
      });
    } catch (e) {
      console.warn(`[telegram:${topic.key}] channel failed:`, e instanceof Error ? e.message : e);
    }
  }

  await trackServerEvent(
    "cron_weekly_news",
    { topic: topic.key, slug, outcome: "published", source: "generate-weekly" },
    "cron"
  );
  void pingSearchEnginesSitemap(`${publicSiteUrl()}/sitemap.xml`, [siteArticleUrl]);

  return { outcome: "published", topic: topic.key, slug, articleUrl: siteArticleUrl };
}

export async function runWeeklyNewsForAllTopics(options?: {
  dryRun?: boolean;
  skipTelegram?: boolean;
  force?: boolean;
  topicKeys?: string[];
}): Promise<WeeklyNewsResult[]> {
  const keys = options?.topicKeys ?? (await getActiveNewsTopics()).map((t) => t.key);
  const results: WeeklyNewsResult[] = [];
  for (const key of keys) {
    try {
      results.push(await runWeeklyNewsForTopic(key, options));
    } catch (e) {
      results.push({
        outcome: "skipped",
        topic: key,
        reason: e instanceof Error ? e.message : String(e),
      });
    }
  }
  return results;
}

export const runPortugalWeeklyNews = (options?: { dryRun?: boolean; skipTelegram?: boolean }) =>
  runWeeklyNewsForTopic("portugal", options);
