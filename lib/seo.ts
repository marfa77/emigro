import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-url";

export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.svg`;

function withSocialImages(metadata: Metadata): Metadata {
  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: "Emigro" }],
    },
    twitter: {
      ...metadata.twitter,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export function pageMetadata(input: {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${SITE_URL}${input.path.startsWith("/") ? input.path : `/${input.path}`}`;
  return withSocialImages({
    title: input.title,
    description: input.description,
    alternates: { canonical: url },
    robots: input.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName: "Emigro",
      locale: "ru_RU",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
    },
  });
}

export function rootMetadata(): Metadata {
  const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
  return withSocialImages({
    metadataBase: new URL(SITE_URL),
    title: {
      default: "Emigro — навигатор релокации в Европу",
      template: "%s | Emigro",
    },
    description:
      "Коридорный навигатор для русскоязычных: маршруты ВНЖ, wizard подбора, справочник и еженедельные новости.",
    robots: { index: true, follow: true },
    icons: {
      icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
      apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
    },
    ...(googleVerification ? { verification: { google: googleVerification } } : {}),
    openGraph: {
      siteName: "Emigro",
      locale: "ru_RU",
      type: "website",
    },
  });
}
