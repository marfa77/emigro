import type { NewsTopicConfig } from "@/lib/news/topics";
import { computeNewsScore, normalizeLink } from "./scoring";
import type { RawNewsItem } from "./rss";
import { parseGoogleNewsTitle, publisherFromDomain } from "./article-resolve";

type DirectFeed = {
  url: string;
  label: string;
};

/** Publisher RSS feeds — higher trust than Google News search alone. */
const TOPIC_DIRECT_FEEDS: Record<string, DirectFeed[]> = {
  portugal: [
    { url: "https://www.publico.pt/rss", label: "Público" },
    { url: "https://www.theportugalnews.com/rss.xml", label: "The Portugal News" },
    { url: "https://www.thelocal.pt/feeds/rss.php", label: "The Local Portugal" },
  ],
  spain: [
    { url: "https://www.thelocal.es/feeds/rss.php", label: "The Local Spain" },
    { url: "https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/internacional/portada", label: "El País" },
  ],
  france: [
    { url: "https://www.thelocal.fr/feeds/rss.php", label: "The Local France" },
  ],
  italy: [
    { url: "https://www.thelocal.it/feeds/rss.php", label: "The Local Italy" },
  ],
  germany: [
    { url: "https://www.thelocal.de/feeds/rss.php", label: "The Local Germany" },
  ],
  netherlands: [
    { url: "https://www.thelocal.nl/feeds/rss.php", label: "The Local Netherlands" },
  ],
  scandinavia: [
    { url: "https://www.thelocal.se/feeds/rss.php", label: "The Local Sweden" },
    { url: "https://www.thelocal.dk/feeds/rss.php", label: "The Local Denmark" },
  ],
};

const IMMIGRATION_HINTS = [
  "immigra",
  "visa",
  "residen",
  "citizenship",
  "nationality",
  "naturalization",
  "aima",
  "consulate",
  "golden visa",
  "digital nomad",
  "blue card",
  "внж",
  "гражданств",
  "иммиграц",
];

function matchesImmigrationTopic(text: string, topic: NewsTopicConfig): boolean {
  const t = text.toLowerCase();
  const countryTokens = [topic.countryEn, topic.countryRu, topic.key].map((s) => s.toLowerCase());
  const hasCountry = countryTokens.some((token) => token && t.includes(token));
  const hasImmigration = IMMIGRATION_HINTS.some((h) => t.includes(h));
  return hasCountry && hasImmigration;
}

export async function collectDirectFeedItems(
  topic: NewsTopicConfig,
  weekFrom: Date,
  weekToExclusive: Date
): Promise<RawNewsItem[]> {
  const feeds = TOPIC_DIRECT_FEEDS[topic.key] ?? [];
  if (feeds.length === 0) return [];

  const Parser = (await import("rss-parser")).default;
  const parser = new Parser({ timeout: 20_000 });
  const referenceMs = weekToExclusive.getTime() - 1;
  const items: RawNewsItem[] = [];

  for (const feed of feeds) {
    try {
      const response = await fetch(feed.url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; EmigroNewsBot/1.0; +https://www.emigro.online)",
          Accept: "application/rss+xml, application/xml, text/xml, */*",
        },
      });
      if (!response.ok) throw new Error(`Status code ${response.status}`);
      const parsed = await parser.parseString(await response.text());
      for (const item of parsed.items ?? []) {
        const pub = item.pubDate ? new Date(item.pubDate) : new Date();
        if (pub.getTime() < weekFrom.getTime() || pub.getTime() >= weekToExclusive.getTime()) continue;

        const link = normalizeLink(item.link?.trim() || item.guid?.trim() || "");
        const rawTitle = item.title?.trim() || "";
        if (!link || !rawTitle) continue;

        const snippet = (item.contentSnippet || item.content || rawTitle).slice(0, 500);
        if (!matchesImmigrationTopic(`${rawTitle} ${snippet}`, topic)) continue;

        const { headline } = parseGoogleNewsTitle(rawTitle);
        const title = headline || rawTitle;
        const source = feed.label || publisherFromDomain(link);
        const score = computeNewsScore(title, snippet, link, pub.toISOString(), topic, referenceMs) + 10;

        items.push({ title, link, source, pubDate: pub.toISOString(), snippet, score });
      }
    } catch (e) {
      console.warn(`[direct-feed:${topic.key}] ${feed.url}:`, e instanceof Error ? e.message : e);
    }
  }

  return items;
}
