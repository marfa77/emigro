import Parser from "rss-parser";
import { isPublishableSourceUrl } from "@/lib/news/article-resolve";

const RSS_URL = "https://www.prep2go.study/news/feed.xml";
const USER_AGENT = "EmigroNewsImport/1.0 (+https://www.emigro.online)";

export type Prep2GoRssItem = {
  title: string;
  link: string;
  pubDate: string;
  excerpt: string;
  topicKey: string;
  weekEnd: string;
  prep2goSlug: string;
};

export type Prep2GoSection = {
  heading: string;
  paragraphs: string[];
  bullets: string[];
};

export type Prep2GoArticle = Prep2GoRssItem & {
  keyTakeaways: string[];
  sections: Prep2GoSection[];
  sources: Array<{ title: string; url: string }>;
};

export const PREP2GO_TOPIC_KEYS = [
  "portugal",
  "spain",
  "france",
  "italy",
  "germany",
  "netherlands",
  "scandinavia",
  "poland",
  "czechia",
  "austria",
] as const;

const VALID_TOPICS = new Set<string>(PREP2GO_TOPIC_KEYS);

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

export function topicKeyFromPrep2GoSlug(slug: string): string | null {
  const match = slug.match(/^([a-z]+)-citizenship-residency-news-/);
  const key = match?.[1];
  return key && VALID_TOPICS.has(key) ? key : null;
}

export function weekEndFromPrep2GoSlug(slug: string): string | null {
  const match = slug.match(/(\d{4}-\d{2}-\d{2})$/);
  return match?.[1] ?? null;
}

export function buildPrep2GoNewsLink(topicKey: string, weekEnd: string): string {
  return `https://www.prep2go.study/news/${topicKey}-citizenship-residency-news-${weekEnd}`;
}

export function buildPrep2GoNewsSlug(topicKey: string, weekEnd: string): string {
  return `${topicKey}-citizenship-residency-news-${weekEnd}`;
}

export async function fetchPrep2GoArticleTitle(link: string): Promise<string> {
  const res = await fetch(link, {
    headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  const og = html.match(/property="og:title"\s+content="([^"]+)"/i)?.[1];
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1];
  return (og ?? title ?? "Prep2Go weekly news").replace(/\s*\|\s*Prep2go\.study\s*$/i, "").trim();
}

export async function prep2GoRssItemFromUrl(url: string): Promise<Prep2GoRssItem> {
  const link = url.replace(/\/$/, "");
  const prep2goSlug = link.split("/news/").pop()?.replace(/\/$/, "") ?? "";
  const topicKey = topicKeyFromPrep2GoSlug(prep2goSlug);
  const weekEnd = weekEndFromPrep2GoSlug(prep2goSlug);
  if (!topicKey || !weekEnd) throw new Error(`Cannot parse Prep2Go URL: ${url}`);

  const title = await fetchPrep2GoArticleTitle(link);
  return {
    title,
    link,
    pubDate: new Date().toISOString(),
    excerpt: "",
    topicKey,
    weekEnd,
    prep2goSlug,
  };
}

export async function prep2GoArticleExists(link: string): Promise<boolean> {
  const res = await fetch(link, {
    method: "HEAD",
    headers: { "User-Agent": USER_AGENT },
    signal: AbortSignal.timeout(10_000),
  });
  return res.ok;
}

/** When RSS lags, probe Prep2Go for an article published on a given week_end date. */
export async function probePrep2GoArticleForWeekEnd(weekEnd: string): Promise<Prep2GoRssItem | null> {
  for (const topicKey of PREP2GO_TOPIC_KEYS) {
    const prep2goSlug = buildPrep2GoNewsSlug(topicKey, weekEnd);
    const link = buildPrep2GoNewsLink(topicKey, weekEnd);
    if (!(await prep2GoArticleExists(link))) continue;

    return {
      title: "",
      link,
      pubDate: new Date().toISOString(),
      excerpt: "",
      topicKey,
      weekEnd,
      prep2goSlug,
    };
  }
  return null;
}

export async function fetchPrep2GoRssItems(): Promise<Prep2GoRssItem[]> {
  const parser = new Parser({
    headers: { "User-Agent": USER_AGENT },
    customFields: { item: [["category", "categories", { keepArray: true }]] },
  });
  const feed = await parser.parseURL(RSS_URL);
  const items: Prep2GoRssItem[] = [];

  for (const item of feed.items ?? []) {
    const link = item.link?.trim();
    if (!link) continue;
    const prep2goSlug = link.split("/news/").pop()?.replace(/\/$/, "") ?? "";
    const topicKey = topicKeyFromPrep2GoSlug(prep2goSlug);
    const weekEnd = weekEndFromPrep2GoSlug(prep2goSlug);
    if (!topicKey || !weekEnd) continue;

    items.push({
      title: stripHtml(item.title ?? ""),
      link,
      pubDate: item.pubDate ?? item.isoDate ?? weekEnd,
      excerpt: stripHtml(item.contentSnippet ?? item.content ?? ""),
      topicKey,
      weekEnd,
      prep2goSlug,
    });
  }

  return items.sort((a, b) => b.weekEnd.localeCompare(a.weekEnd));
}

function parseArticleHtml(html: string): Pick<Prep2GoArticle, "keyTakeaways" | "sections" | "sources"> {
  const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  const article = articleMatch?.[1] ?? html;

  const sections: Prep2GoSection[] = [];
  let keyTakeaways: string[] = [];
  const sources: Array<{ title: string; url: string }> = [];

  const h2Parts = article.split(/<h2[^>]*>/i).slice(1);
  for (const part of h2Parts) {
    const headingMatch = part.match(/^([\s\S]*?)<\/h2>/i);
    if (!headingMatch) continue;
    const heading = stripHtml(headingMatch[1]);
    const body = part.slice(headingMatch[0].length);

    const paragraphs = Array.from(body.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi))
      .map((m) => stripHtml(m[1]))
      .filter(Boolean);
    const bullets = Array.from(body.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi))
      .map((m) => stripHtml(m[1]))
      .filter(Boolean);

    if (/^key takeaways$/i.test(heading)) {
      keyTakeaways = bullets.length > 0 ? bullets : paragraphs;
      continue;
    }

    if (/^sources$/i.test(heading)) {
      for (const m of Array.from(body.matchAll(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi))) {
        const url = m[1].trim();
        const title = stripHtml(m[2]);
        if (url.startsWith("http") && title && isPublishableSourceUrl(url)) sources.push({ title, url });
      }
      continue;
    }

    if (heading) {
      sections.push({ heading, paragraphs, bullets });
    }
  }

  return { keyTakeaways, sections, sources };
}

export async function fetchPrep2GoArticle(item: Prep2GoRssItem): Promise<Prep2GoArticle> {
  const res = await fetch(item.link, {
    headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${item.link}`);
  const html = await res.text();
  const parsed = parseArticleHtml(html);
  return { ...item, ...parsed };
}

export function weekStartFromWeekEnd(weekEnd: string): string {
  const [y, m, d] = weekEnd.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() - 7);
  return date.toISOString().slice(0, 10);
}
