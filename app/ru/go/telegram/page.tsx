import type { Metadata } from "next";
import { TelegramGoRedirect } from "./TelegramGoRedirect";
import { publicSiteUrl } from "@/lib/site-url";

const TITLE = "Emigro в Telegram — @Emigro_news";
const DESCRIPTION =
  "Новости релокации и виз для русскоязычных: ВНЖ, гражданство, практика. Подпишитесь на @Emigro_news.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${publicSiteUrl()}/ru/go/telegram`,
    siteName: "Emigro",
    locale: "ru_RU",
    type: "website",
    images: [{ url: `${publicSiteUrl()}/ru/go/telegram/opengraph-image`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: false, follow: true },
};

/** Soft bridge: Emigro OG for crawlers / Threads preview → Telegram in the browser. */
export default function TelegramGoPage() {
  return <TelegramGoRedirect />;
}
