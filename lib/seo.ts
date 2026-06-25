import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-url";

export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.svg`;
export const SITE_NAME = "Emigro";
const TITLE_SUFFIX = ` | ${SITE_NAME}`;
/** Visible title budget before Next.js appends ` | Emigro`. */
export const MAX_TITLE_PART = 52;
export const MAX_TITLE_ABSOLUTE = 60;

type SocialImageSize = { width: number; height: number };

const SOCIAL_IMAGE_SIZES: Record<string, SocialImageSize> = {
  "/og-default.svg": { width: 1200, height: 630 },
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
  "/images/corridor-france.webp": { width: 900, height: 600 },
  "/images/corridor-germany.webp": { width: 900, height: 600 },
  "/images/corridor-italy.webp": { width: 900, height: 600 },
  "/images/corridor-netherlands.webp": { width: 900, height: 600 },
  "/images/corridor-portugal.webp": { width: 900, height: 600 },
  "/images/corridor-scandinavia.webp": { width: 900, height: 600 },
  "/images/corridor-spain.webp": { width: 900, height: 600 },
  "/images/emigro-guide-passive-income.webp": { width: 1536, height: 1024 },
  "/images/emigro-main-hero.webp": { width: 1200, height: 800 },
  "/images/emigro-news-digest-portugal.webp": { width: 1200, height: 800 },
};

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
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** ru-RU + x-default (RU-first site). */
export function hreflangAlternates(path: string): Metadata["alternates"] {
  const url = pageUrl(path);
  return {
    canonical: url,
    languages: {
      "ru-RU": url,
      "x-default": url,
    },
  };
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
  if (path.endsWith(".svg")) return "image/svg+xml";
  return undefined;
}

export function socialImageMetadata(ogImage = DEFAULT_OG_IMAGE, alt = SITE_NAME) {
  const size = SOCIAL_IMAGE_SIZES[socialImagePath(ogImage)] ?? { width: 1200, height: 630 };
  const type = socialImageType(ogImage);
  return { url: ogImage, secureUrl: ogImage, ...size, ...(type ? { type } : {}), alt };
}

function withSocialImages(metadata: Metadata, ogImage = DEFAULT_OG_IMAGE, alt = SITE_NAME): Metadata {
  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      images: [socialImageMetadata(ogImage, alt)],
    },
    twitter: {
      ...metadata.twitter,
      card: "summary_large_image",
      images: [ogImage],
    },
  };
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
}): Metadata {
  const url = pageUrl(input.path);
  const description = fitMetaDescription(input.description);
  const titleValue = input.titleAbsolute
    ? fitSeoTitleAbsolute(input.title)
    : fitSeoTitlePart(input.title);
  const title = input.titleAbsolute ? { absolute: titleValue } : titleValue;
  const ogImage = input.ogImage ?? DEFAULT_OG_IMAGE;

  return withSocialImages(
    {
      title,
      description,
      alternates: hreflangAlternates(input.path),
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
}

export function rootMetadata(): Metadata {
  const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
  const yandexVerification = process.env.NEXT_PUBLIC_YANDEX_VERIFICATION?.trim();
  const verification: Metadata["verification"] = {};
  if (yandexVerification) verification.yandex = yandexVerification;
  if (googleVerification) verification.google = googleVerification;

  return withSocialImages({
    metadataBase: new URL(SITE_URL),
    title: {
      default: "Emigro — навигатор релокации в Европу",
      template: `%s${TITLE_SUFFIX}`,
    },
    description: fitMetaDescription(
      "Коридорный навигатор для русскоязычных: маршруты ВНЖ, wizard подбора, справочник и еженедельные новости по Европе."
    ),
    alternates: hreflangAlternates("/ru"),
    robots: { index: true, follow: true },
    icons: {
      icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
      apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
    },
    ...(Object.keys(verification).length ? { verification } : {}),
    openGraph: {
      title: "Emigro — навигатор релокации в Европу",
      description: fitMetaDescription(
        "Коридорный навигатор для русскоязычных: маршруты ВНЖ, wizard подбора, справочник и еженедельные новости."
      ),
      url: pageUrl("/ru"),
      siteName: SITE_NAME,
      locale: "ru_RU",
      type: "website",
    },
  });
}
