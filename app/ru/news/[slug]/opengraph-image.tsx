import { ImageResponse } from "next/og";
import { loadOgBackgroundDataUrl } from "@/lib/brand/guide-og-template";
import {
  loadNewsOgBackground,
  newsOgAccent,
  NewsOgTemplate,
} from "@/lib/brand/news-og-template";
import { countryOgImage } from "@/lib/brand/country-accents";
import {
  getNewsDisplayTitle,
  getPublishedNewsDigestBySlug,
  isNewsStory,
} from "@/lib/news/digests";
import { getNewsTopic } from "@/lib/news/topics";

export const runtime = "nodejs";
export const revalidate = 3600;
export const alt = "Emigro news";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: { slug: string } };

function formatDateRu(iso: string): string {
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) return "";
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" });
}

export default async function NewsOpengraphImage({ params }: Props) {
  const digest = await getPublishedNewsDigestBySlug(params.slug);

  if (!digest || !isNewsStory(digest)) {
    const topic = digest ? await getNewsTopic(digest.topic_key) : null;
    const ogPath = topic?.urlSegment ? countryOgImage(topic.urlSegment) : "/images/og/og-default.jpg";
    const relative = ogPath.replace(/^\/images\/og\//, "");
    const backgroundDataUrl = loadOgBackgroundDataUrl(relative);
    return new ImageResponse(
      (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={backgroundDataUrl}
          alt=""
          width={1200}
          height={630}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ),
      { ...size }
    );
  }

  const topic = await getNewsTopic(digest.topic_key);
  const segment = topic?.urlSegment;
  const accent = newsOgAccent(segment);
  const backgroundDataUrl = loadNewsOgBackground(segment);
  const title = getNewsDisplayTitle(digest);
  const countryLabel = topic?.countryRu || accent.label;
  const flag = topic?.flag || "🌍";
  const dateLabel = formatDateRu(digest.published_at);

  return new ImageResponse(
    (
      <NewsOgTemplate
        title={title}
        countryLabel={countryLabel}
        flag={flag}
        dateLabel={dateLabel}
        segment={segment}
        backgroundDataUrl={backgroundDataUrl}
        accentFrom={accent.from}
        accentTo={accent.to}
        accentGlow={accent.glow}
      />
    ),
    { ...size }
  );
}
