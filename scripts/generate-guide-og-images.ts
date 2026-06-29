/**
 * Generates 1200×630 OG hero JPGs for guide pages (same layout as existing pillar guides).
 * Run: npm run guides:og-images
 * Optional: npm run guides:og-images -- vnj-polsha-2026 another-slug
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import React from "react";
import { ImageResponse } from "next/og";
import { getGuideCoverPath } from "../lib/guides/covers";
import {
  corridorWebpToOgJpg,
  GuideOgTemplate,
  loadOgBackgroundDataUrl,
} from "../lib/brand/guide-og-template";

const NEW_GUIDE_SLUGS = [
  "vnj-polsha-2026",
  "vnj-chehiya-2026",
  "grazhdanstvo-portugaliya-ispaniya-2026",
  "pervye-30-dnej-v-polsche-2026",
  "pervye-30-dnej-v-chehii-2026",
  "pervye-30-dnej-v-avstrii-2026",
  "ukraina-evropa-vnj-marshruty-2026",
];

type GuideMeta = {
  title: string;
  seo_title?: string;
  excerpt?: string;
  seo_description?: string;
  cover_image?: string;
  corridor_slugs?: string[];
};

function parseGuideMeta(slug: string): GuideMeta {
  const raw = readFileSync(path.join(process.cwd(), "content/guides/ru", `${slug}.md`), "utf8");
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const meta: GuideMeta = { title: slug };
  if (!match) return meta;

  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (key === "corridor_slugs") {
      meta.corridor_slugs = value
        .replace(/^\[/, "")
        .replace(/\]$/, "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    } else if (key === "title" || key === "seo_title" || key === "excerpt" || key === "seo_description" || key === "cover_image") {
      (meta as Record<string, string | string[]>)[key] = value;
    }
  }
  return meta;
}

async function renderGuideOg(slug: string): Promise<void> {
  const meta = parseGuideMeta(slug);
  const coverWebp = getGuideCoverPath(slug, {
    coverImage: meta.cover_image,
    corridorSlugs: meta.corridor_slugs,
  });
  const bgFile = corridorWebpToOgJpg(coverWebp);
  const backgroundDataUrl = loadOgBackgroundDataUrl(bgFile);
  const title = meta.seo_title ?? meta.title;
  const subtitle = meta.excerpt ?? meta.seo_description ?? meta.title;

  const res = new ImageResponse(
    React.createElement(GuideOgTemplate, { title, subtitle, backgroundDataUrl }),
    { width: 1200, height: 630 }
  );

  const outDir = path.join(process.cwd(), "public/images/og");
  mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `guide-${slug}.jpg`);
  writeFileSync(outPath, Buffer.from(await res.arrayBuffer()));
  console.log(`Wrote public/images/og/guide-${slug}.jpg`);
}

async function main() {
  const slugs = process.argv.slice(2).length > 0 ? process.argv.slice(2) : NEW_GUIDE_SLUGS;
  for (const slug of slugs) {
    await renderGuideOg(slug);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
