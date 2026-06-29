import type { NewsTopicConfig } from "@/lib/news/topics";
import { CHANNEL_STYLE_BANNED_RU } from "@/lib/news/editorial";
import { domainFromLink, isLowTrustSource } from "@/lib/news/scoring";

export type ThreadsFactBlock = {
  fact: string;
  meaning: string;
};

function stripTelegramHtmlToText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(?:b|i|a)>/gi, "")
    .replace(/<a\s+[^>]*>/gi, "")
    .replace(/<(?:b|i)\b[^>]*>/gi, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function compactPlainText(text: string): string {
  return stripTelegramHtmlToText(text)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[ \t]+/g, " ")
    .trim();
}

const THREADS_WATER_RU =
  /(?:продолжает курс на привлечение|призваны сделать страну более привлекательн|эти изменения призваны|оста[её]тся одним из ключевых маршрутов|подч[её]ркива(?:ет|ют) важность точного соблюдения|требует тщательного планирования|ключевым компонентом интеграции|в рамках общей европейской политики|эти изменения влияют на мобильность путешественников)/i;

const THREADS_WEAK_SOURCE_DOMAINS = new Set([
  "mshale.com",
  "travelandtourworld.com",
  "m.economictimes.com",
  "economictimes.com",
]);

function stripThreadsWater(text: string): string {
  let s = compactPlainText(text);
  s = s.replace(new RegExp(CHANNEL_STYLE_BANNED_RU, "gi"), "");
  if (THREADS_WATER_RU.test(s)) {
    s = s
      .split(/(?<=[.!?])\s+/)
      .filter((sentence) => !THREADS_WATER_RU.test(sentence))
      .join(" ");
  }
  return compactPlainText(s);
}

function truncateAtSentence(text: string, max: number): string {
  const s = compactPlainText(text);
  if (s.length <= max) return s;
  const cut = s.slice(0, Math.max(1, max - 1)).trimEnd();
  const sentenceEnd = Math.max(cut.lastIndexOf("."), cut.lastIndexOf("!"), cut.lastIndexOf("?"));
  if (sentenceEnd >= Math.floor(max * 0.55)) return cut.slice(0, sentenceEnd + 1);
  return `${cut.replace(/[,\s;:]+$/g, "")}…`;
}

function extractTelegramSection(html: string, heading: string): string {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`<b>\\s*${escaped}\\s*<\\/b>\\s*([\\s\\S]*?)(?=\\n\\s*<b>|$)`, "i");
  return re.exec(html)?.[1]?.trim() ?? "";
}

function extractTelegramFirstSection(html: string, headings: string[]): string {
  for (const heading of headings) {
    const value = extractTelegramSection(html, heading);
    if (value) return value;
  }
  return "";
}

export function extractFactBlocks(html: string): ThreadsFactBlock[] {
  const blocks: ThreadsFactBlock[] = [];
  const re =
    /<b>\s*Факт:\s*<\/b>\s*([\s\S]*?)\n\s*<i>\s*(?:Что это значит|Мы):\s*<\/i>\s*([\s\S]*?)(?=\n\s*•?\s*<b>\s*Факт:\s*<\/b>|\n\s*<b>|$)/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) !== null) {
    const fact = compactPlainText(match[1] ?? "");
    const meaning = compactPlainText(match[2] ?? "");
    if (fact) blocks.push({ fact, meaning });
  }
  return blocks;
}

function formatThreadsWeekRange(weekFrom: Date, weekEnd: Date): string {
  const fmt = (d: Date) =>
    d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", timeZone: "UTC" });
  return `${fmt(weekFrom)} — ${fmt(weekEnd)}`;
}

function buildThreadsPost(parts: string[], max = 500): string {
  const joined = parts.map(stripThreadsWater).filter(Boolean).join("\n\n");
  return truncateAtSentence(joined, max);
}

function readableSourceName(source?: string): string {
  const clean = compactPlainText(source ?? "");
  if (!clean) return "";
  if (/^(com|www|unknown|google news)$/i.test(clean)) return "";
  return clean;
}

function buildDigestHeader(topic: NewsTopicConfig, weekFrom: Date, weekEnd: Date, excerpt: string, title: string): string {
  return [
    `${topic.flag} ${topic.countryRu}: ${compactPlainText(title) || "новость Prep2Go"}`,
    formatThreadsWeekRange(weekFrom, weekEnd),
    "",
    stripThreadsWater(excerpt || title),
  ]
    .filter((part, idx) => idx === 2 || Boolean(part))
    .join("\n");
}

type SiteContentBlock = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  source_name?: string;
  source_url?: string;
};

function isNewsSourceUrl(url: string): boolean {
  const domain = domainFromLink(url).toLowerCase();
  if (!domain || domain.includes("lemonsqueezy") || domain.includes("emigro.online")) return false;
  return !isThreadsWeakSource(url);
}

function isThreadsWeakSource(url?: string): boolean {
  if (!url) return false;
  if (isLowTrustSource(url)) return true;
  const domain = domainFromLink(url).toLowerCase();
  return THREADS_WEAK_SOURCE_DOMAINS.has(domain);
}

function blockScore(block: SiteContentBlock): number {
  let score = compactPlainText(block.paragraphs.join(" ")).length;
  if (block.bullets?.length) score += 40;
  if (block.source_url && isThreadsWeakSource(block.source_url)) score -= 120;
  if (/консульств|виз[аы]\s+d|шенген|паспорт|гражданств|супруг/i.test(`${block.heading} ${block.paragraphs.join(" ")}`)) {
    score += 30;
  }
  if (THREADS_WATER_RU.test(block.paragraphs.join(" "))) score -= 40;
  return score;
}

function buildStoryPost(block: SiteContentBlock): string {
  const factParts = block.paragraphs.map(stripThreadsWater).filter(Boolean);
  const bulletLines = (block.bullets ?? []).map((b) => `• ${stripThreadsWater(b)}`).filter((b) => b.length > 3);
  const sourceName = readableSourceName(block.source_name);
  const showSource = block.source_url && !isThreadsWeakSource(block.source_url) && sourceName;
  const source = showSource ? `\nИсточник: ${sourceName}` : "";
  return buildThreadsPost([block.heading, ...factParts, bulletLines.join("\n"), source]);
}

function buildSourcesFinalPost(params: {
  channelUrl: string;
  siteArticleUrl: string;
  sourceLinks?: Array<{ title: string; url: string }>;
}): string {
  const externalSources = (params.sourceLinks ?? [])
    .filter((s) => s.url && isNewsSourceUrl(s.url))
    .slice(0, 4)
    .map((s) => {
      const sourceName = readableSourceName(s.title) || domainFromLink(s.url);
      return `${sourceName}: ${s.url}`;
    });

  const sources = [`Emigro: ${params.siteArticleUrl}`];
  for (const source of externalSources) {
    const next = [...sources, source];
    const candidate = [`Полная версия: ${params.siteArticleUrl}`, `Канал: ${params.channelUrl}`, `Источники:\n${next.join("\n")}`].join(
      "\n"
    );
    if (candidate.length > 500) break;
    sources.push(source);
  }

  return [`Полная версия: ${params.siteArticleUrl}`, `Канал: ${params.channelUrl}`, `Источники:\n${sources.join("\n")}`].join("\n");
}

export function buildThreadsFromSiteDigest(params: {
  topic: NewsTopicConfig;
  weekFrom: Date;
  weekEnd: Date;
  channelUrl: string;
  siteArticleUrl: string;
  title: string;
  excerpt: string;
  keyTakeaways: string[];
  contentBlocks: SiteContentBlock[];
  sourceLinks: Array<{ title: string; url: string }>;
}): string {
  const { topic, weekFrom, weekEnd, channelUrl, siteArticleUrl, title, excerpt, contentBlocks } = params;

  const rankedBlocks = [...contentBlocks]
    .filter((b) => !b.source_url || !isLowTrustSource(b.source_url))
    .filter((b) => stripThreadsWater(b.paragraphs.join(" ") || b.heading).length > 40)
    .sort((a, b) => blockScore(b) - blockScore(a))
    .slice(0, 3);

  const storyPosts = rankedBlocks.map(buildStoryPost).filter(Boolean);

  const posts = [
    buildThreadsPost([buildDigestHeader(topic, weekFrom, weekEnd, excerpt, title)]),
    ...storyPosts,
    buildSourcesFinalPost({ channelUrl, siteArticleUrl, sourceLinks: params.sourceLinks }),
  ].filter((post) => post.length > 0);

  const numbered = posts.map((post, idx, arr) => `${idx + 1}/${arr.length}\n${post}`);
  return numbered.join("\n\n");
}

export function buildThreadsThreadFromDigestHtml(params: {
  topic: NewsTopicConfig;
  digestHtml: string;
  weekFrom: Date;
  weekEnd: Date;
  channelUrl: string;
  siteArticleUrl: string;
  sourceLinks?: Array<{ title: string; url: string }>;
  fallbackTakeaways?: string[];
  fallbackExcerpt?: string;
}): string {
  const { topic, digestHtml, weekFrom, weekEnd, channelUrl, siteArticleUrl, fallbackExcerpt } = params;

  const hook = compactPlainText(extractTelegramFirstSection(digestHtml, ["Главное", "Hook"])) || fallbackExcerpt || "";
  const factBlocks = extractFactBlocks(digestHtml);

  const storyPosts = factBlocks.slice(0, 3).map((block) =>
    buildThreadsPost(
      [block.fact, block.meaning ? `Что это значит: ${block.meaning}` : ""].filter(Boolean)
    )
  );

  const posts = [
    buildThreadsPost([buildDigestHeader(topic, weekFrom, weekEnd, hook || fallbackExcerpt || "", "")]),
    ...storyPosts,
    buildSourcesFinalPost({ channelUrl, siteArticleUrl, sourceLinks: params.sourceLinks }),
  ].filter((post) => post.length > 0);

  const numbered = posts.map((post, idx, arr) => `${idx + 1}/${arr.length}\n${post}`);
  return numbered.join("\n\n");
}
