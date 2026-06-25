import type { NewsTopicConfig } from "@/lib/news/topics";
import { computeNewsScore, isCriticalInvestorRiskText, normalizeLink } from "./scoring";
import { collectDirectFeedItems } from "./direct-feeds";
import { parseGoogleNewsTitle } from "./article-resolve";

export type RawNewsItem = {
  title: string;
  link: string;
  source: string;
  pubDate: string;
  snippet: string;
  score: number;
};

function toYmdUtc(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function googleNewsDateClause(weekFrom: Date, weekToExclusive: Date): string {
  return `after:${toYmdUtc(weekFrom)} before:${toYmdUtc(weekToExclusive)}`;
}

async function fetchQuery(
  query: string,
  weekFrom: Date,
  weekToExclusive: Date,
  topic: NewsTopicConfig
): Promise<RawNewsItem[]> {
  const q = `${query} ${googleNewsDateClause(weekFrom, weekToExclusive)}`;
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en`;

  const Parser = (await import("rss-parser")).default;
  const parser = new Parser({ timeout: 20_000 });

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/rss+xml, application/xml;q=0.9, text/xml;q=0.8",
        "User-Agent": "EmigroNewsBot/1.0 (+https://www.emigro.online)",
      },
    });
    if (!response.ok) throw new Error(`Status code ${response.status}`);
    const feed = await parser.parseString(await response.text());
    const referenceMs = weekToExclusive.getTime() - 1;
    return (feed.items ?? [])
      .map((item) => {
        const pub = item.pubDate ? new Date(item.pubDate) : new Date();
        const link = normalizeLink(item.link?.trim() || "");
        const rawTitle = item.title?.trim() || "";
        if (!link || !rawTitle) return null;
        const { headline, publisher: titlePublisher } = parseGoogleNewsTitle(rawTitle);
        const title = headline || rawTitle;
        const snippet = (item.contentSnippet || item.content || title).slice(0, 400);
        const rawSource = (item.creator || item.source || titlePublisher || "").toString().trim();
        const source = rawSource && rawSource !== "Google News" ? rawSource : titlePublisher || "Google News";
        const score = computeNewsScore(title, snippet, link, pub.toISOString(), topic, referenceMs);
        return { title, link, source, pubDate: pub.toISOString(), snippet, score };
      })
      .filter((x): x is RawNewsItem => x !== null);
  } catch (e) {
    console.warn(`[rss:${topic.key}] query failed: ${query}`, e instanceof Error ? e.message : e);
    return [];
  }
}

export async function collectNewsItems(
  topic: NewsTopicConfig,
  weekFrom: Date,
  weekTo: Date
): Promise<RawNewsItem[]> {
  const weekToExclusive = new Date(weekTo);
  weekToExclusive.setUTCDate(weekToExclusive.getUTCDate() + 1);

  const batches = await Promise.all(
    topic.rssQueries.map((q) => fetchQuery(q, weekFrom, weekToExclusive, topic))
  );
  const directItems = await collectDirectFeedItems(topic, weekFrom, weekToExclusive);

  const seen = new Set<string>();
  const merged: RawNewsItem[] = [];

  for (const item of directItems) {
    const key = item.link.split("?")[0];
    if (seen.has(key)) continue;
    seen.add(key);
    merged.unshift(item);
  }

  for (const batch of batches) {
    for (const item of batch) {
      const key = item.link.split("?")[0];
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(item);
    }
  }

  const inWindow = merged.filter((item) => {
    const t = new Date(item.pubDate).getTime();
    return t >= weekFrom.getTime() && t < weekToExclusive.getTime();
  });

  let pool = inWindow.sort((a, b) => b.score - a.score);

  if (pool.length < 8) {
    const wideFrom = new Date(weekTo);
    wideFrom.setUTCDate(wideFrom.getUTCDate() - 14);
    const wideBatches = await Promise.all(
      topic.rssQueries.map((q) => fetchQuery(q, wideFrom, weekToExclusive, topic))
    );
    for (const batch of wideBatches) {
      for (const item of batch) {
        const key = item.link.split("?")[0];
        if (seen.has(key)) continue;
        seen.add(key);
        pool.push(item);
      }
    }
    const wideDirect = await collectDirectFeedItems(topic, wideFrom, weekToExclusive);
    for (const item of wideDirect) {
      const key = item.link.split("?")[0];
      if (seen.has(key)) continue;
      seen.add(key);
      pool.push(item);
    }
    pool = pool.sort((a, b) => b.score - a.score);
  }

  return pool.slice(0, 120);
}

export function isCriticalItem(item: Pick<RawNewsItem, "title" | "snippet">): boolean {
  return isCriticalInvestorRiskText(`${item.title} ${item.snippet}`);
}
