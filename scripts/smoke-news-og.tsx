/**
 * Smoke: render story OG for SE / PT / DE — different accents + corridor backgrounds.
 *   npx tsx scripts/smoke-news-og.tsx
 */
import React from "react";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import {
  loadNewsOgBackground,
  newsOgAccent,
  NewsOgTemplate,
} from "../lib/brand/news-og-template";

const samples = [
  {
    segment: "sweden",
    flag: "🇸🇪",
    title: "Швеция ужесточает правила для ВНЖ по работе — что меняется для релокантов",
  },
  {
    segment: "portugal",
    flag: "🇵🇹",
    title: "Португалия: новые сроки D7 и что проверить до подачи документов",
  },
  {
    segment: "germany",
    flag: "🇩🇪",
    title: "Германия: Chancenkarte и очередь в консульствах — короткий разбор",
  },
] as const;

async function main() {
  const outDir = path.join(process.cwd(), "tmp", "news-og-smoke");
  mkdirSync(outDir, { recursive: true });
  const seen = new Set<string>();

  for (const sample of samples) {
    const accent = newsOgAccent(sample.segment);
    const backgroundDataUrl = loadNewsOgBackground(sample.segment);
    const bgKey = backgroundDataUrl.slice(0, 80);
    const accentKey = `${accent.from}|${accent.to}|${accent.glow}`;
    console.log(
      [
        sample.segment,
        `from=${accent.from}`,
        `to=${accent.to}`,
        `glow=${accent.glow}`,
        `label=${accent.label}`,
        `bg=${bgKey}…`,
      ].join(" | ")
    );
    if (seen.has(accentKey)) {
      throw new Error(`Duplicate accent for ${sample.segment}: ${accentKey}`);
    }
    seen.add(accentKey);

    const res = new ImageResponse(
      (
        <NewsOgTemplate
          title={sample.title}
          countryLabel={accent.label}
          flag={sample.flag}
          dateLabel="9 авг. 2026 г."
          segment={sample.segment}
          backgroundDataUrl={backgroundDataUrl}
          accentFrom={accent.from}
          accentTo={accent.to}
          accentGlow={accent.glow}
        />
      ),
      { width: 1200, height: 630 }
    );
    const buf = Buffer.from(await res.arrayBuffer());
    const out = path.join(outDir, `${sample.segment}.png`);
    writeFileSync(out, buf);
    console.log(`  wrote ${out} (${buf.length} bytes)`);
  }

  console.log("OK: SE/PT/DE OG cards differ by accent and rendered as PNG");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
