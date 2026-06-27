import { getNewsDisplayTitle, getPublishedNewsDigests } from "@/lib/news/digests";
import { resolveNewsTopicFromParam } from "@/lib/news/topics";
import { newsArticleUrl, newsFeedUrl, newsHubUrl } from "@/lib/site-url";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export const revalidate = 60;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topic = await resolveNewsTopicFromParam(searchParams.get("country") ?? undefined);
  const digests = await getPublishedNewsDigests({ topicKey: topic?.key, limit: 60 });

  const hubUrl = newsHubUrl(topic?.urlSegment);
  const selfUrl = newsFeedUrl(topic?.urlSegment);
  const channelTitle = topic
    ? `Emigro — новости ${topic.countryRu} для русскоязычных`
    : "Emigro — новости релокации в Европу";
  const channelDescription = topic
    ? `Еженедельные обзоры по релокации в ${topic.countryRu} для ${topic.audienceRu}.`
    : "Еженедельные обзоры по ВНЖ и гражданству в европейских направлениях Emigro.";

  const items = digests
    .map((d) => {
      const link = newsArticleUrl(d.slug);
      return `    <item>
      <title>${escapeXml(getNewsDisplayTitle(d))}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${new Date(d.published_at).toUTCString()}</pubDate>
      <description>${escapeXml(d.excerpt)}</description>
      <category>${escapeXml(d.country)}</category>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(channelTitle)}</title>
    <link>${hubUrl}</link>
    <description>${escapeXml(channelDescription)}</description>
    <language>ru</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${selfUrl}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
