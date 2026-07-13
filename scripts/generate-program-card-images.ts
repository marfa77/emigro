/**
 * Generates 1200×630 WebP heroes for corridor program cards (Pexels Photos API).
 *
 *   npm run programs:card-images
 *   npm run programs:card-images -- portugal-d8-digital-nomad
 *   npm run programs:card-images -- --force
 */
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { resolve } from "node:path";
import sharp from "sharp";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import {
  PROGRAM_IMAGES_DIR,
  PROGRAM_PHOTO_QUERIES,
  programCardImageFilePath,
  programCardImagePublicPath,
} from "@/lib/corridor/program-images";

const PEXELS_API = "https://api.pexels.com/v1/search";
const MIN_WEBP_BYTES = 15_000;

const DEFAULT_SLUGS = [
  "portugal-d8-digital-nomad",
  "portugal-d7-passive-income",
  "portugal-family-reunification",
  "portugal-golden-visa",
  "portugal-student-visa-d4",
  "spain-digital-nomad",
  "spain-non-lucrative",
  "spain-family-reunification",
];

type PexelsSearchResponse = {
  photos?: Array<{ src?: { landscape?: string; large?: string } }>;
};

async function searchPexelsPhoto(query: string): Promise<string | null> {
  const apiKey = process.env.PEXELS_API_KEY?.trim();
  if (!apiKey) return null;

  const params = new URLSearchParams({
    query,
    orientation: "landscape",
    per_page: "8",
  });

  const res = await fetch(`${PEXELS_API}?${params}`, {
    headers: { Authorization: apiKey },
  });

  if (!res.ok) {
    console.warn(`[program-card] Pexels search failed (${res.status}) for "${query}"`);
    return null;
  }

  const json = (await res.json()) as PexelsSearchResponse;
  for (const photo of json.photos ?? []) {
    const url = photo.src?.landscape || photo.src?.large;
    if (url) return url;
  }
  return null;
}

async function photoUrlToWebpBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Photo download failed (${res.status}): ${url}`);
  const input = Buffer.from(await res.arrayBuffer());
  return sharp(input).resize(1200, 630, { fit: "cover", position: "center" }).webp({ quality: 82 }).toBuffer();
}

async function ensureProgramCardImage(slug: string, force = false): Promise<boolean> {
  const dest = programCardImageFilePath(slug);
  if (!force && fs.existsSync(dest) && fs.statSync(dest).size >= MIN_WEBP_BYTES) {
    console.log(`[program-card] ${slug}: exists`);
    return false;
  }

  const queries = PROGRAM_PHOTO_QUERIES[slug];
  if (!queries?.length) {
    console.warn(`[program-card] ${slug}: no queries defined`);
    return false;
  }

  for (const query of queries) {
    const url = await searchPexelsPhoto(query);
    if (!url) continue;
    try {
      const webp = await photoUrlToWebpBuffer(url);
      if (webp.length < MIN_WEBP_BYTES) continue;
      fs.mkdirSync(path.join(process.cwd(), PROGRAM_IMAGES_DIR), { recursive: true });
      fs.writeFileSync(dest, webp);
      console.log(`[program-card] ${slug}: saved from "${query}" → ${programCardImagePublicPath(slug)}`);
      await new Promise((r) => setTimeout(r, 350));
      return true;
    } catch (error) {
      console.warn(`[program-card] ${slug}: error for "${query}":`, error instanceof Error ? error.message : error);
    }
  }

  console.warn(`[program-card] ${slug}: no photo found`);
  return false;
}

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const slugs = args.filter((a) => !a.startsWith("--"));
  const targets = slugs.length > 0 ? slugs : DEFAULT_SLUGS;

  if (!process.env.PEXELS_API_KEY?.trim()) {
    console.error("[program-card] PEXELS_API_KEY missing in .env.local");
    process.exit(1);
  }

  let generated = 0;
  for (const slug of targets) {
    if (await ensureProgramCardImage(slug, force)) generated++;
  }

  console.log(`[program-card] done — ${generated}/${targets.length} generated`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
