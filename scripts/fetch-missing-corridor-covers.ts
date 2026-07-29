/**
 * Fetch missing country cover WebPs + OG JPGs from Pexels.
 *   npx tsx scripts/fetch-missing-corridor-covers.ts
 *   npx tsx scripts/fetch-missing-corridor-covers.ts --force
 */
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { resolve } from "node:path";
import sharp from "sharp";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const PEXELS_API = "https://api.pexels.com/v1/search";
const MIN_BYTES = 12_000;

const COVERS: Array<{ slug: string; queries: string[] }> = [
  {
    slug: "georgia",
    queries: [
      "Tbilisi old town Narikala",
      "Tbilisi Georgia cityscape",
      "Georgia Caucasus mountains Tbilisi",
    ],
  },
  {
    slug: "montenegro",
    queries: [
      "Kotor bay Montenegro",
      "Budva Montenegro old town",
      "Montenegro Adriatic coast",
    ],
  },
  {
    slug: "switzerland",
    queries: [
      "Swiss Alps mountain lake",
      "Zurich Switzerland city",
      "Lucerne Switzerland lake",
    ],
  },
  {
    slug: "uk",
    queries: [
      "London Tower Bridge skyline",
      "London United Kingdom cityscape",
      "Big Ben London Thames",
    ],
  },
  {
    slug: "armenia",
    queries: [
      "Yerevan Armenia Cascade",
      "Yerevan Armenia cityscape",
      "Armenia monastery mountains",
    ],
  },
  {
    slug: "turkey",
    queries: [
      "Istanbul Turkey Bosphorus",
      "Istanbul Turkey skyline mosque",
      "Antalya Turkey coast",
    ],
  },
  {
    slug: "serbia",
    queries: [
      "Belgrade Serbia Kalemegdan fortress",
      "Belgrade Serbia cityscape Sava river",
      "Novi Sad Serbia Petrovaradin",
    ],
  },
  {
    slug: "kazakhstan",
    queries: [
      "Almaty Kazakhstan city mountains",
      "Astana Kazakhstan Bayterek tower",
      "Almaty Kazakhstan skyline",
    ],
  },
  {
    slug: "uae",
    queries: [
      "Dubai Marina skyline evening lights",
      "Burj Khalifa Dubai downtown night",
      "Palm Jumeirah Dubai aerial sunset",
      "Abu Dhabi UAE Sheikh Zayed Mosque",
    ],
  },
  {
    slug: "thailand",
    queries: [
      "Bangkok Thailand Wat Arun temple",
      "Bangkok Thailand skyline Chao Phraya",
      "Thailand temple golden sunset",
    ],
  },
  {
    slug: "indonesia",
    queries: [
      "Bali Indonesia rice terraces Tegallalang",
      "Bali Indonesia temple Uluwatu",
      "Bali Indonesia beach cliff sunset",
    ],
  },
];

type PexelsSearchResponse = {
  photos?: Array<{ src?: { landscape?: string; large?: string; original?: string } }>;
};

async function searchPexels(query: string): Promise<string | null> {
  const apiKey = process.env.PEXELS_API_KEY?.trim();
  if (!apiKey) throw new Error("PEXELS_API_KEY missing in .env.local");

  const params = new URLSearchParams({
    query,
    orientation: "landscape",
    per_page: "10",
  });
  const res = await fetch(`${PEXELS_API}?${params}`, {
    headers: { Authorization: apiKey },
  });
  if (!res.ok) {
    console.warn(`Pexels ${res.status} for "${query}"`);
    return null;
  }
  const json = (await res.json()) as PexelsSearchResponse;
  for (const photo of json.photos ?? []) {
    const url = photo.src?.original || photo.src?.landscape || photo.src?.large;
    if (url) return url;
  }
  return null;
}

async function download(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function saveCover(slug: string, queries: string[], force: boolean): Promise<void> {
  const webpPath = path.join(process.cwd(), "public/images", `corridor-${slug}.webp`);
  const jpgPath = path.join(process.cwd(), "public/images/og", `corridor-${slug}.jpg`);

  if (!force && fs.existsSync(webpPath) && fs.statSync(webpPath).size >= MIN_BYTES) {
    console.log(`${slug}: exists`);
    return;
  }

  for (const query of queries) {
    const url = await searchPexels(query);
    if (!url) continue;
    try {
      const input = await download(url);
      const webp = await sharp(input)
        .resize(1200, 800, { fit: "cover", position: "center" })
        .webp({ quality: 82 })
        .toBuffer();
      const jpg = await sharp(input)
        .resize(1200, 630, { fit: "cover", position: "center" })
        .jpeg({ quality: 84, mozjpeg: true })
        .toBuffer();
      if (webp.length < MIN_BYTES || jpg.length < MIN_BYTES) continue;

      fs.mkdirSync(path.dirname(jpgPath), { recursive: true });
      fs.writeFileSync(webpPath, webp);
      fs.writeFileSync(jpgPath, jpg);
      console.log(`${slug}: saved from "${query}"`);
      await new Promise((r) => setTimeout(r, 400));
      return;
    } catch (err) {
      console.warn(`${slug}: fail "${query}":`, err instanceof Error ? err.message : err);
    }
  }
  console.warn(`${slug}: no photo found`);
}

async function ensurePassiveIncomeOg(): Promise<void> {
  const src = path.join(process.cwd(), "public/images/emigro-guide-passive-income.webp");
  const dest = path.join(process.cwd(), "public/images/og/guide-passive-income.jpg");
  if (!fs.existsSync(src)) return;
  if (fs.existsSync(dest) && fs.statSync(dest).size >= MIN_BYTES) {
    console.log("passive-income OG: exists");
    return;
  }
  const jpg = await sharp(src)
    .resize(1200, 630, { fit: "cover", position: "center" })
    .jpeg({ quality: 84, mozjpeg: true })
    .toBuffer();
  fs.writeFileSync(dest, jpg);
  console.log("passive-income OG: wrote guide-passive-income.jpg");
}

async function main() {
  const force = process.argv.includes("--force");
  for (const cover of COVERS) {
    await saveCover(cover.slug, cover.queries, force);
  }
  await ensurePassiveIncomeOg();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
