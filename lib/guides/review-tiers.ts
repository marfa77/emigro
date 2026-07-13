import type { GuideFrontmatter } from "@/lib/guides/load";

/**
 * Guide review tiers — how often editorial must re-verify facts.
 *
 * **volatile** — thresholds, rates, deadlines, sanctions, EES dates, salaries, fees, citizenship rules.
 * Review: quarterly + Telegram community_signals where configured.
 *
 * **evergreen** — process/checklist content without hard numbers that drift monthly.
 * Review: annual or on user report.
 */
export type GuideReviewTier = "volatile" | "evergreen";

export type FactcheckCadence = "quarterly" | "annual" | "evergreen";

/**
 * Explicit slug → tier map for every guide in `content/guides/ru/`.
 * New guides MUST be added here before publish (enforced in validate-site-consistency).
 */
export const GUIDE_REVIEW_TIER_BY_SLUG: Record<string, GuideReviewTier> = {
  // --- Volatile: visa thresholds, program fees, tax rates, sanctions-sensitive rules ---
  "armeniya-dlya-rossiyan-2026": "volatile",
  "bali-indoneziya-dlya-rossiyan-2026": "volatile",
  "bank-i-iban-dlya-rossiyan-v-evrope-2026": "volatile",
  "belorusy-v-evropu-vnj-2026": "volatile",
  "byudzhet-relokatsii-evropa-2026-po-stranam": "volatile",
  "chernogoriya-vnj-dlya-rossiyan-2026": "volatile",
  "d7-vs-digital-nomad-visa-sravnenie": "volatile",
  "digital-nomad-portugaliya-ispaniya-italiya-2026": "volatile",
  "digital-nomad-vizy-evropy-sravnenie-2026": "volatile",
  "ees-shengenskaya-sistema-2026": "volatile",
  "germaniya-blue-card-chancenkarte-2026-sng": "volatile",
  "germaniya-vs-niderlandy-blue-card": "volatile",
  "grazhdanstvo-germaniya-polsha-2026": "volatile",
  "grazhdanstvo-portugaliya-ispaniya-2026": "volatile",
  "gruziya-dlya-rossiyan-2026": "volatile",
  "investitsionnyy-vnj-evropa-golden-visa-2026": "volatile",
  "kak-otkryt-ip-za-rubezhom-rossiyane-2026": "volatile",
  "kazahstan-dlya-rossiyan-2026": "volatile",
  "kazahstantsy-v-evropu-vnj-2026": "volatile",
  "kuda-pereehat-iz-rossii-2026-evropa-vnj": "volatile",
  "kuda-uehat-iz-rossii-srochno-2026-evropa-bezviz-haby": "volatile",
  "nalogi-pri-pereezde-v-evropu-2026": "volatile",
  "oae-dlya-rossiyan-2026": "volatile",
  "podtverdit-dohod-dengi-dlya-vnj-esli-dohod-iz-rossii-2026": "volatile",
  "portugaliya-vs-ispaniya-vnj-2026": "volatile",
  "rabota-v-evrope-dlya-rossiyan-2026": "volatile",
  "relokatsiya-s-detmi-evropa-shkoly-vnj-2026": "volatile",
  "shengen-turist-vs-vnzh-2026": "volatile",
  "tailand-dlya-rossiyan-2026": "volatile",
  "turciya-dlya-rossiyan-2026": "volatile",
  "uchebnaya-viza-v-evropu-2026-student-visa": "volatile",
  "ukraina-evropa-vnj-marshruty-2026": "volatile",
  "ukraintsy-belorusy-vremennaya-zashchita-vs-vnj-2026": "volatile",
  "vnj-austria-2026": "volatile",
  "vnj-bez-raboty-passivnyy-dohod-sberezheniya-2026": "volatile",
  "vnj-chehiya-2026": "volatile",
  "vnj-frantsiya-2026-passeport-talent": "volatile",
  "vnj-germaniya-2026": "volatile",
  "vnj-ispaniya-2026": "volatile",
  "vnj-italiya-2026-elective-residency": "volatile",
  "vnj-niderlandy-2026-highly-skilled": "volatile",
  "vnj-polsha-2026": "volatile",
  "vnj-portugaliya-d8-d7-grazhdanstvo-2026": "volatile",
  "prodlenie-vnzh-portugaliya-aima-2026": "volatile",
  "vnj-serbiya-dlya-rossiyan-2026": "volatile",
  "vnj-skandinaviya-2026": "volatile",
  "vossoedinenie-semi-evropa-2026": "volatile",

  // --- Evergreen: process/checklist, slow-changing mechanics, comparison methodology ---
  "dokumenty-dlya-pereezda-iz-rossii-2026-apostil-nesudimost": "evergreen",
  "konsulskaya-podacha-rf-by-kz-2026-yurisdiktsiya": "evergreen",
  "legalizatsiya-v-evrope-posle-vyezda-iz-rossii-2026": "evergreen",
  "otkaz-v-natsionalnoy-vize-konsulstvo-2026": "evergreen",
  "pervye-30-dnej-v-avstrii-2026": "evergreen",
  "pervye-30-dnej-v-chehii-2026": "evergreen",
  "pervye-30-dnej-v-frantsii-2026": "evergreen",
  "pervye-30-dnej-v-germanii-2026": "evergreen",
  "pervye-30-dnej-v-ispanii-2026": "evergreen",
  "pervye-30-dnej-v-niderlandah-2026": "evergreen",
  "pervye-30-dnej-v-polsche-2026": "evergreen",
  "pervye-30-dnej-v-portugalii-2026": "evergreen",
  "pervye-30-dnej-v-skandinavii-2026": "evergreen",
};

/** Slugs with the slowest cadence — update only on user report or major process change. */
const EVERGREEN_CADENCE_SLUGS = new Set<string>([
  "dokumenty-dlya-pereezda-iz-rossii-2026-apostil-nesudimost",
  "konsulskaya-podacha-rf-by-kz-2026-yurisdiktsiya",
  "otkaz-v-natsionalnoy-vize-konsulstvo-2026",
]);

export function isGuideReviewTier(value: string): value is GuideReviewTier {
  return value === "volatile" || value === "evergreen";
}

export function getGuideReviewTier(slug: string, frontmatterTier?: string): GuideReviewTier {
  if (frontmatterTier && isGuideReviewTier(frontmatterTier)) {
    return frontmatterTier;
  }
  return GUIDE_REVIEW_TIER_BY_SLUG[slug] ?? "volatile";
}

export function getFactcheckCadence(slug: string, tier?: GuideReviewTier): FactcheckCadence {
  const resolvedTier = tier ?? getGuideReviewTier(slug);
  if (resolvedTier === "volatile") return "quarterly";
  if (EVERGREEN_CADENCE_SLUGS.has(slug)) return "evergreen";
  return "annual";
}

export function isVolatileGuide(slug: string): boolean {
  return getGuideReviewTier(slug) === "volatile";
}

export function listVolatileGuides(guides: GuideFrontmatter[]): GuideFrontmatter[] {
  return guides.filter((guide) => isVolatileGuide(guide.slug));
}

export function listEvergreenGuides(guides: GuideFrontmatter[]): GuideFrontmatter[] {
  return guides.filter((guide) => !isVolatileGuide(guide.slug));
}

/** Slugs wired into PT/ES Telegram fact-check — volatile subset for priority review. */
export function listVolatileFactcheckGuideSlugs(): string[] {
  return Object.entries(GUIDE_REVIEW_TIER_BY_SLUG)
    .filter(([, tier]) => tier === "volatile")
    .map(([slug]) => slug)
    .sort();
}

export function validateGuideReviewTiers(publishedSlugs: string[]): string[] {
  const errors: string[] = [];
  const registrySlugs = new Set(Object.keys(GUIDE_REVIEW_TIER_BY_SLUG));

  for (const slug of publishedSlugs) {
    if (!registrySlugs.has(slug)) {
      errors.push(`Missing review tier for published guide: ${slug}`);
    }
  }

  for (const slug of Array.from(registrySlugs)) {
    if (!publishedSlugs.includes(slug)) {
      errors.push(`Stale review tier entry (no markdown file): ${slug}`);
    }
  }

  return errors;
}
