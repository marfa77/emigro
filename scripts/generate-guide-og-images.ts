/**
 * Generates 1200×630 OG hero JPGs for guide pages (same layout as existing pillar guides).
 * Run: npm run guides:og-images
 * Optional: npm run guides:og-images -- vnj-polsha-2026 another-slug
 * ES locale: npm run guides:og-images -- --locale=es
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
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
  "prodlenie-vnzh-portugaliya-aima-2026",
  "vnj-polsha-2026",
  "vnj-chehiya-2026",
  "grazhdanstvo-portugaliya-ispaniya-2026",
  "pervye-30-dnej-v-polsche-2026",
  "pervye-30-dnej-v-chehii-2026",
  "pervye-30-dnej-v-avstrii-2026",
  "ukraina-evropa-vnj-marshruty-2026",
];

const ES_PILLAR_OG_SLUGS = [
  "residencia-espana-desde-uruguay-2026",
  "residencia-espana-desde-ecuador-2026",
  "residencia-espana-desde-peru-2026",
  "residencia-espana-desde-paraguay-2026",
  "visa-nomada-digital-espana-latam-2026",
  "primeros-30-dias-en-espana-2026",
];

type GuideMeta = {
  title: string;
  seo_title?: string;
  excerpt?: string;
  seo_description?: string;
  cover_image?: string;
  corridor_slugs?: string[];
};

function parseGuideMeta(slug: string, locale: "ru" | "es"): GuideMeta {
  const filePath = path.join(process.cwd(), "content/guides", locale, `${slug}.md`);
  if (!existsSync(filePath)) {
    throw new Error(`Guide not found: ${filePath}`);
  }
  const raw = readFileSync(filePath, "utf8");
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
    } else if (
      key === "title" ||
      key === "seo_title" ||
      key === "excerpt" ||
      key === "seo_description" ||
      key === "cover_image"
    ) {
      (meta as Record<string, string | string[]>)[key] = value;
    }
  }
  return meta;
}

async function renderGuideOg(slug: string, locale: "ru" | "es"): Promise<void> {
  const meta = parseGuideMeta(slug, locale);
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
    { width: 1200, height: 630 },
  );

  const outDir = path.join(process.cwd(), "public/images/og");
  mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `guide-${slug}.jpg`);
  writeFileSync(outPath, Buffer.from(await res.arrayBuffer()));
  console.log(`Wrote public/images/og/guide-${slug}.jpg`);
}

async function main() {
  const args = process.argv.slice(2);
  const localeArg = args.find((a) => a.startsWith("--locale="));
  const locale = (localeArg?.split("=")[1] === "es" ? "es" : "ru") as "ru" | "es";
  const slugs = args.filter((a) => !a.startsWith("--"));
  const targets =
    slugs.length > 0 ? slugs : locale === "es" ? ES_PILLAR_OG_SLUGS : NEW_GUIDE_SLUGS;
  for (const slug of targets) {
    await renderGuideOg(slug, locale);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
