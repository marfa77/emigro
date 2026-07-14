import type { Metadata } from "next";
import { withAiMetadata } from "@/lib/seo/llm-meta";
import { hreflangAlternates } from "@/lib/seo/hreflang";
import { publicSiteUrl } from "@/lib/site-url";

export { hreflangAlternates, corridorHreflangTag, paginationRobots } from "@/lib/seo/hreflang";

/** 1200×630 JPG — supported by Twitter/X, Threads, Facebook (not SVG). */
export const DEFAULT_OG_IMAGE = "/images/og/og-default.jpg";
export const SITE_NAME = "Emigro";
const TITLE_SUFFIX = ` | ${SITE_NAME}`;
/** Visible title budget before Next.js appends ` | Emigro`. 51 + 9 (" | Emigro") = 60 chars total. */
export const MAX_TITLE_PART = 51;
export const MAX_TITLE_ABSOLUTE = 60;

type SocialImageSize = { width: number; height: number };

const SOCIAL_IMAGE_SIZES: Record<string, SocialImageSize> = {
  "/images/og/og-default.jpg": { width: 1200, height: 630 },
  "/images/og/news-digest.jpg": { width: 1200, height: 630 },
  "/images/og/guides-index.jpg": { width: 1200, height: 630 },
  "/images/og/guide-byudzhet-relokatsii-evropa-2026-po-stranam.jpg": { width: 1200, height: 630 },
  "/images/og/guide-digital-nomad-portugaliya-ispaniya-italiya-2026.jpg": { width: 1200, height: 630 },
  "/images/og/guide-germaniya-blue-card-chancenkarte-2026-sng.jpg": { width: 1200, height: 630 },
  "/images/og/guide-kuda-pereehat-iz-rossii-2026-evropa-vnj.jpg": { width: 1200, height: 630 },
  "/images/og/guide-otkaz-v-natsionalnoy-vize-konsulstvo-2026.jpg": { width: 1200, height: 630 },
  "/images/og/guide-relokatsiya-s-detmi-evropa-shkoly-vnj-2026.jpg": { width: 1200, height: 630 },
  "/images/og/guide-ukraintsy-belorusy-vremennaya-zashchita-vs-vnj-2026.jpg": { width: 1200, height: 630 },
  "/images/og/guide-vnj-bez-raboty-passivnyy-dohod-sberezheniya-2026.jpg": { width: 1200, height: 630 },
  "/images/og/guide-vnj-portugaliya-d8-d7-grazhdanstvo-2026.jpg": { width: 1200, height: 630 },
  "/images/og/guide-vossoedinenie-semi-evropa-2026.jpg": { width: 1200, height: 630 },
  "/images/emigro-main-hero.webp": { width: 1200, height: 800 },
  "/images/emigro-news-digest-portugal.webp": { width: 1200, height: 800 },
};

function socialImageSize(path: string): SocialImageSize {
  const known = SOCIAL_IMAGE_SIZES[path];
  if (known) return known;
  if (path.startsWith("/images/og/corridor-") && path.endsWith(".jpg")) return { width: 1200, height: 630 };
  if (path.startsWith("/images/og/guide-") && path.endsWith(".jpg")) return { width: 1200, height: 630 };
  if (path.startsWith("/images/community-notes/") && path.endsWith(".webp")) return { width: 1200, height: 630 };
  if (path.startsWith("/api/community-notes/hero/")) return { width: 1200, height: 630 };
  return { width: 1200, height: 630 };
}

const SEO_DESC_SUFFIX =
  " Emigro: wizard подбора маршрута, справочники коридоров и еженедельные новости для русскоязычных релокантов.";

function truncateAtWord(text: string, max: number, suffix = "…"): string {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  const slice = trimmed.slice(0, max - suffix.length);
  const lastSpace = slice.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? slice.slice(0, lastSpace) : slice).trimEnd()}${suffix}`;
}

/** Meta description: min ~120 for crawlers, target ≤160. */
export function fitMetaDescription(text: string, min = 120, max = 160): string {
  let base = text.replace(/\s+/g, " ").trim();
  if (base.length < min) {
    base = `${base}${SEO_DESC_SUFFIX}`.replace(/\s+/g, " ").trim();
  }
  if (base.length < min) {
    base = `${base} Проверьте маршрут ВНЖ через hub wizard.`;
  }
  if (base.length <= max) return base;
  return truncateAtWord(base, max);
}

export function fitSeoTitlePart(text: string, max = MAX_TITLE_PART): string {
  const cleaned = text.replace(/\s*\|\s*Emigro\s*$/i, "").trim();
  return truncateAtWord(cleaned, max, "");
}

export function fitSeoTitleAbsolute(text: string, max = MAX_TITLE_ABSOLUTE): string {
  return truncateAtWord(text.trim(), max);
}

export function pageUrl(path: string): string {
  const origin = publicSiteUrl();
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}

function socialImagePath(ogImage: string): string {
  if (!ogImage.startsWith("http")) return ogImage.startsWith("/") ? ogImage : `/${ogImage}`;
  try {
    return new URL(ogImage).pathname;
  } catch {
    return ogImage;
  }
}

function socialImageType(ogImage: string): string | undefined {
  const path = socialImagePath(ogImage).toLowerCase();
  if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
  if (path.endsWith(".png")) return "image/png";
  if (path.endsWith(".webp")) return "image/webp";
  if (path.startsWith("/api/community-notes/hero/")) return "image/webp";
  if (path.endsWith(".svg")) return "image/svg+xml";
  return undefined;
}

export function socialImageMetadata(ogImage = DEFAULT_OG_IMAGE, alt = SITE_NAME) {
  const path = socialImagePath(ogImage);
  const size = socialImageSize(path);
  const type = socialImageType(ogImage);
  const origin = publicSiteUrl();
  const absUrl = ogImage.startsWith("http") ? ogImage : `${origin}${path.startsWith("/") ? path : `/${path}`}`;
  return { url: absUrl, secureUrl: absUrl, ...size, ...(type ? { type } : {}), alt };
}

function twitterSiteMetadata(): Pick<NonNullable<Metadata["twitter"]>, "site" | "creator"> {
  const site = process.env.NEXT_PUBLIC_TWITTER_SITE?.trim();
  const creator = process.env.NEXT_PUBLIC_TWITTER_CREATOR?.trim();
  return {
    ...(site ? { site } : {}),
    ...(creator ? { creator } : {}),
  };
}

function withSocialImages(metadata: Metadata, ogImage = DEFAULT_OG_IMAGE, alt = SITE_NAME): Metadata {
  const image = socialImageMetadata(ogImage, alt);
  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      images: [image],
    },
    twitter: {
      ...metadata.twitter,
      ...twitterSiteMetadata(),
      card: "summary_large_image",
      images: [image],
    },
  };
}

/** News article metadata with explicit canonical, og:url, and index robots. */
export function buildNewsArticleMetadata(input: {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  ogImageAlt?: string;
  keywords?: string[];
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
}): Metadata {
  const canonicalUrl = pageUrl(input.path);
  const base = pageMetadata({
    title: input.title,
    description: input.description,
    path: input.path,
    ogImage: input.ogImage,
    ogImageAlt: input.ogImageAlt,
    titleAbsolute: true,
  });

  return {
    ...base,
    ...(input.keywords?.length ? { keywords: input.keywords } : {}),
    alternates: hreflangAlternates(input.path),
    openGraph: {
      ...base.openGraph,
      url: canonicalUrl,
      type: "article",
      ...(input.publishedTime ? { publishedTime: input.publishedTime } : {}),
      ...(input.modifiedTime ? { modifiedTime: input.modifiedTime } : {}),
      ...(input.tags?.length ? { tags: input.tags } : {}),
    },
  };
}

/** Article metadata with explicit absolute canonical + og:url (guides, long-form). */
export function buildGuideArticleMetadata(input: {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  ogImageAlt?: string;
  keywords?: string[];
  publishedTime?: string;
  modifiedTime?: string;
  aiDescription?: string;
  aiCategory?: string;
}): Metadata {
  const canonicalUrl = pageUrl(input.path);
  const base = pageMetadata({
    title: input.title,
    description: input.description,
    path: input.path,
    ogImage: input.ogImage,
    ogImageAlt: input.ogImageAlt,
  });

  const metadata: Metadata = {
    ...base,
    ...(input.keywords?.length ? { keywords: input.keywords } : {}),
    alternates: hreflangAlternates(input.path),
    openGraph: {
      ...base.openGraph,
      url: canonicalUrl,
      type: "article",
      ...(input.publishedTime ? { publishedTime: input.publishedTime } : {}),
      ...(input.modifiedTime ? { modifiedTime: input.modifiedTime } : {}),
    },
  };

  if (input.aiDescription) {
    return withAiMetadata(metadata, {
      aiDescription: input.aiDescription,
      aiCategory: input.aiCategory ?? "relocation-guide",
      path: input.path,
    });
  }

  return metadata;
}

export function pageMetadata(input: {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
  ogImage?: string;
  ogImageAlt?: string;
  /** Use when title already includes branding or must not get ` | Emigro`. */
  titleAbsolute?: boolean;
  aiDescription?: string;
  aiCategory?: string;
  /** Corridor / transit urlSegment for ru-{country} hreflang. */
  countrySegment?: string;
}): Metadata {
  const url = pageUrl(input.path);
  const description = fitMetaDescription(input.description);
  const titleValue = input.titleAbsolute
    ? fitSeoTitleAbsolute(input.title)
    : fitSeoTitlePart(input.title);
  const title = input.titleAbsolute ? { absolute: titleValue } : titleValue;
  const ogImage = input.ogImage ?? DEFAULT_OG_IMAGE;

  const metadata = withSocialImages(
    {
      title,
      description,
      alternates: hreflangAlternates(input.path, input.countrySegment),
      robots: input.noIndex ? { index: false, follow: false } : { index: true, follow: true },
      openGraph: {
        title: typeof titleValue === "string" ? titleValue : input.title,
        description,
        url,
        siteName: SITE_NAME,
        locale: "ru_RU",
        type: "website",
      },
      twitter: {
        title: typeof titleValue === "string" ? titleValue : input.title,
        description,
      },
    },
    ogImage,
    input.ogImageAlt
  );

  if (input.aiDescription) {
    return withAiMetadata(metadata, {
      aiDescription: input.aiDescription,
      aiCategory: input.aiCategory ?? "relocation-corridor",
      path: input.path,
    });
  }

  return metadata;
}

export function rootMetadata(): Metadata {
  const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
  const yandexVerification = process.env.NEXT_PUBLIC_YANDEX_VERIFICATION?.trim();
  const verification: Metadata["verification"] = {};
  if (yandexVerification) verification.yandex = yandexVerification;
  if (googleVerification) verification.google = googleVerification;

  return withSocialImages({
    metadataBase: new URL(publicSiteUrl()),
    title: {
      default: "Emigro — навигатор релокации в Европу",
      template: `%s${TITLE_SUFFIX}`,
    },
    description: fitMetaDescription(
      "Коридорный навигатор для русскоязычных: маршруты ВНЖ, wizard подбора, справочник и еженедельные новости по Европе."
    ),
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/icon-120.png", sizes: "120x120", type: "image/png" },
        { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
      shortcut: [{ url: "/favicon.ico" }],
    },
    ...(Object.keys(verification).length ? { verification } : {}),
  });
}
