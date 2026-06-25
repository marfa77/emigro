import type { NewsTopicConfig } from "@/lib/news/topics";

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
  return stripTelegramHtmlToText(text).replace(/[ \t]+/g, " ").trim();
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
  const joined = parts.map(compactPlainText).filter(Boolean).join("\n\n");
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
    `${topic.flag} ${topic.countryRu}: главное за неделю`,
    formatThreadsWeekRange(weekFrom, weekEnd),
    "",
    compactPlainText(excerpt || title),
  ]
    .filter((part, idx) => idx === 2 || Boolean(part))
    .join("\n");
}

export function buildThreadsFromSiteDigest(params: {
  topic: NewsTopicConfig;
  weekFrom: Date;
  weekEnd: Date;
  articleUrl: string;
  title: string;
  excerpt: string;
  keyTakeaways: string[];
  contentBlocks: Array<{
    heading: string;
    paragraphs: string[];
    source_name?: string;
    source_url?: string;
  }>;
  sourceLinks: Array<{ title: string; url: string }>;
}): string {
  const { topic, weekFrom, weekEnd, articleUrl, title, excerpt, keyTakeaways, contentBlocks } = params;

  const storyPosts = contentBlocks.slice(0, 4).map((block) => {
    const fact = compactPlainText(block.paragraphs.join(" ") || block.heading);
    const sourceName = readableSourceName(block.source_name);
    const source = sourceName ? `\nИсточник: ${sourceName}` : "";
    return buildThreadsPost([block.heading, fact, source]);
  });

  const actions = keyTakeaways.slice(0, 3).map((t) => `• ${compactPlainText(t)}`).join("\n");

  const posts = [
    buildThreadsPost([buildDigestHeader(topic, weekFrom, weekEnd, excerpt, title)]),
    ...storyPosts.filter(Boolean),
    buildThreadsPost([actions || "Проверьте документы и сроки по своему маршруту ВНЖ."]),
  ].filter((post) => post.length > 0);

  const sourcesLine = params.sourceLinks
    .slice(0, 4)
    .map((s) => {
      const sourceName = readableSourceName(s.title) || "Источник";
      return `${sourceName}: ${s.url}`;
    })
    .join("\n");

  const finalPost = [
    `Полная версия: ${articleUrl}`,
    sourcesLine ? `Источники:\n${sourcesLine}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const numbered = [...posts, finalPost].map((post, idx, arr) => `${idx + 1}/${arr.length}\n${post}`);
  return numbered.join("\n\n");
}

export function buildThreadsThreadFromDigestHtml(params: {
  topic: NewsTopicConfig;
  digestHtml: string;
  weekFrom: Date;
  weekEnd: Date;
  articleUrl: string;
  fallbackTakeaways?: string[];
  fallbackExcerpt?: string;
}): string {
  const { topic, digestHtml, weekFrom, weekEnd, articleUrl, fallbackTakeaways, fallbackExcerpt } = params;

  const hook = compactPlainText(extractTelegramFirstSection(digestHtml, ["Главное", "Hook"])) || fallbackExcerpt || "";
  const factBlocks = extractFactBlocks(digestHtml);
  const actions = compactPlainText(
    extractTelegramFirstSection(digestHtml, [
      "Что проверить сейчас",
      "Что сделать сейчас",
      "Критические риски инвестора",
      "Фокус по стране",
    ])
  ) || (fallbackTakeaways?.length ? fallbackTakeaways.map((t) => `• ${t}`).join("\n") : "");

  const firstFact = factBlocks[0]
    ? `${factBlocks[0].fact}${factBlocks[0].meaning ? ` ${factBlocks[0].meaning}` : ""}`
    : "";

  const middleFacts = factBlocks.slice(1, 5).map((block) =>
    [block.fact, block.meaning ? `Что это значит: ${block.meaning}` : ""].filter(Boolean).join("\n")
  );

  const posts = [
    buildThreadsPost([
      buildDigestHeader(topic, weekFrom, weekEnd, hook || fallbackExcerpt || "", ""),
      firstFact,
    ]),
    buildThreadsPost(middleFacts.slice(0, 2)),
    buildThreadsPost(middleFacts.slice(2, 4)),
    buildThreadsPost([actions]),
  ].filter((post) => post.length > 0);

  const channel = (process.env.EMIGRO_NEWS_TELEGRAM_CHANNEL || "@Emigro_news").trim();
  const finalPost = [
    `Полная версия: ${articleUrl}`,
    `Канал: https://t.me/${channel.replace(/^@/, "")}`,
  ].join("\n");

  const numbered = [...posts, finalPost].map((post, idx, arr) => `${idx + 1}/${arr.length}\n${post}`);
  return numbered.join("\n\n");
}
