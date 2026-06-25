import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-url";

export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.svg`;
export const SITE_NAME = "Emigro";
const TITLE_SUFFIX = ` | ${SITE_NAME}`;
/** Visible title budget before Next.js appends ` | Emigro`. */
export const MAX_TITLE_PART = 52;
export const MAX_TITLE_ABSOLUTE = 60;

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

function withSocialImages(metadata: Metadata, ogImage = DEFAULT_OG_IMAGE): Metadata {
  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      images: [{ url: ogImage, width: 1200, height: 630, alt: SITE_NAME }],
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
    ogImage
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
