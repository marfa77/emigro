const CORRIDOR_COVER_IMAGES: Record<string, string> = {
  "ru-speaking-to-portugal": "/images/corridor-portugal.webp",
  "ru-speaking-to-spain": "/images/corridor-spain.webp",
  "ru-speaking-to-germany": "/images/corridor-germany.webp",
  "ru-speaking-to-italy": "/images/corridor-italy.webp",
  "ru-speaking-to-france": "/images/corridor-france.webp",
  "ru-speaking-to-netherlands": "/images/corridor-netherlands.webp",
  "ru-speaking-to-scandinavia": "/images/corridor-scandinavia.webp",
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
};

export const DEFAULT_GUIDE_COVER = "/images/emigro-main-hero.webp";

export function getGuideOgImagePath(slug: string): string {
  return `/images/og/guide-${slug}.jpg`;
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
