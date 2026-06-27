import fs from "fs";
import path from "path";

const PUBLIC_DIR = path.join(process.cwd(), "public");

const CORRIDOR_COVER_IMAGES: Record<string, string> = {
  "ru-speaking-to-portugal": "/images/corridor-portugal.webp",
  "ru-speaking-to-spain": "/images/corridor-spain.webp",
  "ru-speaking-to-germany": "/images/corridor-germany.webp",
  "ru-speaking-to-italy": "/images/corridor-italy.webp",
  "ru-speaking-to-france": "/images/corridor-france.webp",
  "ru-speaking-to-netherlands": "/images/corridor-netherlands.webp",
  "ru-speaking-to-scandinavia": "/images/corridor-scandinavia.webp",
  "ru-speaking-to-poland": "/images/corridor-poland.webp",
  "ru-speaking-to-czechia": "/images/corridor-czechia.webp",
  "ru-speaking-to-austria": "/images/corridor-austria.webp",
};

/** Per-guide cover when no frontmatter override; reuses corridor photos from public/images/. */
export const GUIDE_COVER_BY_SLUG: Record<string, string> = {
  "vnj-portugaliya-d8-d7-grazhdanstvo-2026": "/images/corridor-portugal.webp",
  "digital-nomad-portugaliya-ispaniya-italiya-2026": "/images/corridor-portugal.webp",
  "germaniya-blue-card-chancenkarte-2026-sng": "/images/corridor-germany.webp",
  "vnj-bez-raboty-passivnyy-dohod-sberezheniya-2026": "/images/corridor-portugal.webp",
  "kuda-pereehat-iz-rossii-2026-evropa-vnj": "/images/emigro-main-hero.webp",
  "byudzhet-relokatsii-evropa-2026-po-stranam": "/images/emigro-main-hero.webp",
  "relokatsiya-s-detmi-evropa-shkoly-vnj-2026": "/images/corridor-portugal.webp",
  "vossoedinenie-semi-evropa-2026": "/images/corridor-germany.webp",
  "ukraintsy-belorusy-vremennaya-zashchita-vs-vnj-2026": "/images/corridor-germany.webp",
  "otkaz-v-natsionalnoy-vize-konsulstvo-2026": "/images/corridor-spain.webp",
  "kuda-uehat-iz-rossii-srochno-2026-evropa-bezviz-haby": "/images/emigro-main-hero.webp",
  "legalizatsiya-v-evrope-posle-vyezda-iz-rossii-2026": "/images/corridor-portugal.webp",
  "uchebnaya-viza-v-evropu-2026-student-visa": "/images/corridor-germany.webp",
  "podtverdit-dohod-dengi-dlya-vnj-esli-dohod-iz-rossii-2026": "/images/corridor-spain.webp",
  "konsulskaya-podacha-rf-by-kz-2026-yurisdiktsiya": "/images/corridor-france.webp",
  "dokumenty-dlya-pereezda-iz-rossii-2026-apostil-nesudimost": "/images/corridor-italy.webp",
  "kazahstantsy-v-evropu-vnj-2026": "/images/corridor-germany.webp",
  "pervye-30-dnej-v-portugalii-2026": "/images/corridor-portugal.webp",
  "pervye-30-dnej-v-germanii-2026": "/images/corridor-germany.webp",
  "pervye-30-dnej-v-ispanii-2026": "/images/corridor-spain.webp",
  "pervye-30-dnej-v-niderlandah-2026": "/images/corridor-netherlands.webp",
  "pervye-30-dnej-v-frantsii-2026": "/images/corridor-france.webp",
  "belorusy-v-evropu-vnj-2026": "/images/corridor-poland.webp",
};

export const DEFAULT_GUIDE_COVER = "/images/emigro-main-hero.webp";

export function getGuideOgImagePath(slug: string): string {
  return `/images/og/guide-${slug}.jpg`;
}

/** Prefer dedicated 1200×630 OG JPG; fall back to cover webp when raster OG is missing. */
export function resolveGuideOgImagePath(slug: string, coverPath: string): string {
  const jpgPath = getGuideOgImagePath(slug);
  const onDisk = path.join(PUBLIC_DIR, jpgPath.replace(/^\//, ""));
  if (fs.existsSync(onDisk)) return jpgPath;
  return coverPath;
}

export function getGuideCoverPath(
  slug: string,
  options?: { coverImage?: string; corridorSlugs?: string[] }
): string {
  if (options?.coverImage) return options.coverImage;
  if (GUIDE_COVER_BY_SLUG[slug]) return GUIDE_COVER_BY_SLUG[slug];
  for (const corridor of options?.corridorSlugs ?? []) {
    const cover = CORRIDOR_COVER_IMAGES[corridor];
    if (cover) return cover;
  }
  return DEFAULT_GUIDE_COVER;
}
