import fs from "fs";
import path from "path";

const PUBLIC_DIR = path.join(process.cwd(), "public");

const CORRIDOR_COVER_IMAGES: Record<string, string> = {
  "ru-speaking-to-portugal": "/images/corridor-portugal.webp",
  "ru-speaking-to-spain": "/images/corridor-spain.webp",
  "es-speaking-uruguay-to-spain": "/images/corridor-spain.webp",
  "es-speaking-ecuador-to-spain": "/images/corridor-spain.webp",
  "es-speaking-latam-to-europe": "/images/corridor-spain.webp",
  "ru-speaking-to-germany": "/images/corridor-germany.webp",
  "ru-speaking-to-italy": "/images/corridor-italy.webp",
  "ru-speaking-to-france": "/images/corridor-france.webp",
  "ru-speaking-to-netherlands": "/images/corridor-netherlands.webp",
  "ru-speaking-to-sweden": "/images/corridor-scandinavia.webp",
  "ru-speaking-to-norway": "/images/corridor-scandinavia.webp",
  "ru-speaking-to-finland": "/images/corridor-scandinavia.webp",
  "ru-speaking-to-denmark": "/images/corridor-scandinavia.webp",
  "ru-speaking-to-poland": "/images/corridor-poland.webp",
  "ru-speaking-to-czechia": "/images/corridor-czechia.webp",
  "ru-speaking-to-austria": "/images/corridor-austria.webp",
  "ru-speaking-to-greece": "/images/corridor-greece.webp",
  "ru-speaking-to-cyprus": "/images/corridor-cyprus.webp",
  "ru-speaking-to-hungary": "/images/corridor-hungary.webp",
  "ru-speaking-to-malta": "/images/corridor-malta.webp",
  "ru-speaking-to-bulgaria": "/images/corridor-bulgaria.webp",
  "ru-speaking-to-croatia": "/images/corridor-croatia.webp",
  "ru-speaking-to-slovenia": "/images/corridor-slovenia.webp",
  "ru-speaking-to-estonia": "/images/corridor-estonia.webp",
};

/** topic_keys country → cover photo (for guides without corridor_slugs). */
const TOPIC_COVER_IMAGES: Record<string, string> = {
  portugal: "/images/corridor-portugal.webp",
  spain: "/images/corridor-spain.webp",
  france: "/images/corridor-france.webp",
  italy: "/images/corridor-italy.webp",
  germany: "/images/corridor-germany.webp",
  netherlands: "/images/corridor-netherlands.webp",
  scandinavia: "/images/corridor-scandinavia.webp",
  sweden: "/images/corridor-scandinavia.webp",
  norway: "/images/corridor-scandinavia.webp",
  finland: "/images/corridor-scandinavia.webp",
  denmark: "/images/corridor-scandinavia.webp",
  poland: "/images/corridor-poland.webp",
  czechia: "/images/corridor-czechia.webp",
  austria: "/images/corridor-austria.webp",
  greece: "/images/corridor-greece.webp",
  cyprus: "/images/corridor-cyprus.webp",
  hungary: "/images/corridor-hungary.webp",
  malta: "/images/corridor-malta.webp",
  bulgaria: "/images/corridor-bulgaria.webp",
  croatia: "/images/corridor-croatia.webp",
  slovenia: "/images/corridor-slovenia.webp",
  estonia: "/images/corridor-estonia.webp",
  georgia: "/images/corridor-georgia.webp",
  montenegro: "/images/corridor-montenegro.webp",
  switzerland: "/images/corridor-switzerland.webp",
  uk: "/images/corridor-uk.webp",
  armenia: "/images/corridor-armenia.webp",
  turkey: "/images/corridor-turkey.webp",
  serbia: "/images/corridor-serbia.webp",
  kazakhstan: "/images/corridor-kazakhstan.webp",
  uae: "/images/corridor-uae.webp",
  thailand: "/images/corridor-thailand.webp",
  indonesia: "/images/corridor-indonesia.webp",
  "south-africa": "/images/corridor-south-africa.webp",
};

const COUNTRY_TOPIC_KEYS = new Set(Object.keys(TOPIC_COVER_IMAGES));

/** Per-guide cover when no frontmatter override; reuses corridor photos from public/images/. */
export const GUIDE_COVER_BY_SLUG: Record<string, string> = {
  "vnj-portugaliya-d8-d7-grazhdanstvo-2026": "/images/corridor-portugal.webp",
  "digital-nomad-vizy-evropy-sravnenie-2026": "/images/corridor-portugal.webp",
  "vnj-germaniya-2026": "/images/corridor-germany.webp",
  "vnj-bez-raboty-passivnyy-dohod-sberezheniya-2026": "/images/emigro-guide-passive-income.webp",
  "kuda-pereehat-iz-rossii-2026-evropa-vnj": "/images/corridor-germany.webp",
  "byudzhet-relokatsii-evropa-2026-po-stranam": "/images/emigro-guide-passive-income.webp",
  "relokatsiya-s-detmi-evropa-shkoly-vnj-2026": "/images/corridor-portugal.webp",
  "vossoedinenie-semi-evropa-2026": "/images/corridor-germany.webp",
  "ukraintsy-belorusy-vremennaya-zashchita-vs-vnj-2026": "/images/corridor-germany.webp",
  "otkaz-v-natsionalnoy-vize-konsulstvo-2026": "/images/corridor-spain.webp",
  "kuda-uehat-iz-rossii-srochno-2026-evropa-bezviz-haby": "/images/corridor-georgia.webp",
  "legalizatsiya-v-evrope-posle-vyezda-iz-rossii-2026": "/images/corridor-portugal.webp",
  "uchebnaya-viza-v-evropu-2026-student-visa": "/images/corridor-germany.webp",
  "podtverdit-dohod-dengi-dlya-vnj-esli-dohod-iz-rossii-2026": "/images/emigro-guide-passive-income.webp",
  "konsulskaya-podacha-rf-by-kz-2026-yurisdiktsiya": "/images/corridor-france.webp",
  "dokumenty-dlya-pereezda-iz-rossii-2026-apostil-nesudimost": "/images/corridor-italy.webp",
  "kazahstantsy-v-evropu-vnj-2026": "/images/corridor-kazakhstan.webp",
  "pervye-30-dnej-v-portugalii-2026": "/images/corridor-portugal.webp",
  "prodlenie-vnzh-portugaliya-aima-2026": "/images/corridor-portugal.webp",
  "pervye-30-dnej-v-germanii-2026": "/images/corridor-germany.webp",
  "pervye-30-dnej-v-ispanii-2026": "/images/corridor-spain.webp",
  "pervye-30-dnej-v-italii-2026": "/images/corridor-italy.webp",
  "pervye-30-dnej-v-bolgarii-2026": "/images/corridor-bulgaria.webp",
  "pervye-30-dnej-na-kipre-2026": "/images/corridor-cyprus.webp",
  "pervye-30-dnej-v-gretsii-2026": "/images/corridor-greece.webp",
  "vnj-ispaniya-2026": "/images/corridor-spain.webp",
  "portugaliya-vs-ispaniya-vnj-2026": "/images/corridor-spain.webp",
  "pervye-30-dnej-v-niderlandah-2026": "/images/corridor-netherlands.webp",
  "pervye-30-dnej-v-frantsii-2026": "/images/corridor-france.webp",
  "belorusy-v-evropu-vnj-2026": "/images/corridor-poland.webp",
  "vnj-polsha-2026": "/images/corridor-poland.webp",
  "vnj-chehiya-2026": "/images/corridor-czechia.webp",
  "grazhdanstvo-portugaliya-ispaniya-2026": "/images/corridor-portugal.webp",
  "grazhdanstvo-portugalii-golden-visa-ari-2021-2022-2026": "/images/corridor-portugal.webp",
  "investitsionnyy-vnj-evropa-golden-visa-2026": "/images/corridor-portugal.webp",
  "ukraina-evropa-vnj-marshruty-2026": "/images/corridor-germany.webp",
  "pervye-30-dnej-v-polsche-2026": "/images/corridor-poland.webp",
  "pervye-30-dnej-v-chehii-2026": "/images/corridor-czechia.webp",
  "pervye-30-dnej-v-avstrii-2026": "/images/corridor-austria.webp",
  "vnj-austria-2026": "/images/corridor-austria.webp",
  "vnj-gretsiya-2026-digital-nomad-fip-golden-visa": "/images/corridor-greece.webp",
  "vnj-kipr-2026-digital-nomad-fip-non-dom": "/images/corridor-cyprus.webp",
  "vnj-vengriya-2026-white-card-guest-investor": "/images/corridor-hungary.webp",
  "vnj-malta-2026-nomad-mprp-non-dom": "/images/corridor-malta.webp",
  "vnj-bolgariya-2026-type-d-digital-nomad-eood": "/images/corridor-bulgaria.webp",
  "vnj-horvatiya-2026-digital-nomad": "/images/corridor-croatia.webp",
  "vnj-sloveniya-2026-digital-nomad-sp": "/images/corridor-slovenia.webp",
  "vnj-estoniya-2026-digital-nomad-e-residency": "/images/corridor-estonia.webp",
  "nalogovye-spetsrezhimy-es-2026": "/images/emigro-guide-passive-income.webp",
  "nalogi-pri-pereezde-v-evropu-2026": "/images/emigro-guide-passive-income.webp",
  "vnj-shveytsariya-2026-b-permit-lump-sum-taxation": "/images/corridor-switzerland.webp",
  "velikobritaniya-2026-skilled-worker-global-talent-ilr": "/images/corridor-uk.webp",
  "vnj-italiya-2026-elective-residency": "/images/corridor-italy.webp",
  "vnj-italiya-2026-digital-nomad": "/images/corridor-italy.webp",
  "vnj-skandinaviya-2026": "/images/corridor-scandinavia.webp",
  "vnj-shvetsiya-2026-work-permit-grazhdanstvo": "/images/corridor-scandinavia.webp",
  "vnj-norvegiya-2026": "/images/corridor-scandinavia.webp",
  "pervye-30-dnej-v-skandinavii-2026": "/images/corridor-scandinavia.webp",
  "grazhdanstvo-germaniya-polsha-2026": "/images/corridor-germany.webp",
  "shengen-turist-vs-vnzh-2026": "/images/corridor-france.webp",
  "ees-shengenskaya-sistema-2026": "/images/corridor-france.webp",
  "gruziya-dlya-rossiyan-2026": "/images/corridor-georgia.webp",
  "chernogoriya-vnj-dlya-rossiyan-2026": "/images/corridor-montenegro.webp",
  "armeniya-dlya-rossiyan-2026": "/images/corridor-armenia.webp",
  "turciya-dlya-rossiyan-2026": "/images/corridor-turkey.webp",
  "vnj-serbiya-dlya-rossiyan-2026": "/images/corridor-serbia.webp",
  "kazahstan-dlya-rossiyan-2026": "/images/corridor-kazakhstan.webp",
  "oae-dlya-rossiyan-2026": "/images/corridor-uae.webp",
  "tailand-dlya-rossiyan-2026": "/images/corridor-thailand.webp",
  "bali-indoneziya-dlya-rossiyan-2026": "/images/corridor-indonesia.webp",
  "yuar-dlya-rossiyan-ukraintsev-belorusov-kazahstantsev-2026": "/images/corridor-south-africa.webp",
  "kak-otkryt-ip-za-rubezhom-rossiyane-2026": "/images/corridor-serbia.webp",
  // ES pillars (LATAM → España)
  "residencia-espana-desde-uruguay-2026": "/images/corridor-spain.webp",
  "residencia-espana-desde-ecuador-2026": "/images/corridor-spain.webp",
  "visa-nomada-digital-espana-latam-2026": "/images/emigro-guide-passive-income.webp",
  "primeros-30-dias-en-espana-2026": "/images/corridor-spain.webp",
};

export const DEFAULT_GUIDE_COVER = "/images/emigro-main-hero.webp";

export function getGuideOgImagePath(slug: string): string {
  return `/images/og/guide-${slug}.jpg`;
}

/** Prefer dedicated 1200×630 OG JPG for hero + social when raster exists. */
export function resolveGuideCoverPath(slug: string, fallbackCover: string): string {
  const jpgPath = getGuideOgImagePath(slug);
  const onDisk = path.join(PUBLIC_DIR, jpgPath.replace(/^\//, ""));
  if (fs.existsSync(onDisk)) return jpgPath;
  return fallbackCover;
}

/** Prefer dedicated 1200×630 OG JPG; fall back to cover webp when raster OG is missing. */
export function resolveGuideOgImagePath(slug: string, coverPath: string): string {
  return resolveGuideCoverPath(slug, coverPath);
}

export function getGuideCoverPath(
  slug: string,
  options?: {
    coverImage?: string;
    corridorSlugs?: string[];
    topicKeys?: string[];
    primaryIntent?: string;
  },
): string {
  if (options?.coverImage) return options.coverImage;

  // Explicit slug map wins over multi-country / comparison defaults.
  if (GUIDE_COVER_BY_SLUG[slug]) return GUIDE_COVER_BY_SLUG[slug];

  const countryKeys = (options?.topicKeys ?? []).filter((key) => COUNTRY_TOPIC_KEYS.has(key));
  if (countryKeys.length === 1) {
    const cover = TOPIC_COVER_IMAGES[countryKeys[0]];
    if (cover) return cover;
  }

  if (options?.primaryIntent === "comparison" || countryKeys.length > 1) {
    return DEFAULT_GUIDE_COVER;
  }

  for (const corridor of options?.corridorSlugs ?? []) {
    const cover = CORRIDOR_COVER_IMAGES[corridor];
    if (cover) return cover;
  }
  return DEFAULT_GUIDE_COVER;
}
