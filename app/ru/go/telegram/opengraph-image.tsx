import { ImageResponse } from "next/og";
import { loadNewsOgBackground, NewsOgTemplate } from "@/lib/brand/news-og-template";

export const runtime = "nodejs";
export const revalidate = 86400;
export const alt = "Emigro Telegram";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function TelegramGoOpengraphImage() {
  const backgroundDataUrl = loadNewsOgBackground();
  return new ImageResponse(
    (
      <NewsOgTemplate
        title="Новости релокации и виз — @Emigro_news"
        countryLabel="Telegram"
        flag="✈️"
        dateLabel="Emigro"
        backgroundDataUrl={backgroundDataUrl}
        accentFrom="#0ea5e9"
        accentTo="#0f766e"
        accentGlow="#7dd3fc"
      />
    ),
    { ...size }
  );
}
