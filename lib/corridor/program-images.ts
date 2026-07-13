import fs from "fs";
import path from "path";

/** Landscape card heroes for corridor program tiles (1200×630 WebP). */
export const PROGRAM_IMAGES_DIR = "public/images/programs";

/** Canonical visa-route image types — one hero per type across all corridors. */
export type ProgramCardImageType =
  | "digital-nomad"
  | "passive-income"
  | "family-reunification"
  | "golden-visa"
  | "student"
  | "work-permit"
  | "freelancer"
  | "startup";

export type ProgramCardImageConfig = {
  /** Pexels search queries — curated, non-cheesy, type-appropriate. */
  queries: string[];
};

/** All canonical image types (generation + validation). */
export const PROGRAM_CARD_IMAGE_TYPES: ProgramCardImageType[] = [
  "digital-nomad",
  "passive-income",
  "family-reunification",
  "golden-visa",
  "student",
  "work-permit",
  "freelancer",
  "startup",
];

/**
 * Pexels queries keyed by canonical type (not country slug).
 * Winners picked from PT/ES variants — see commit message for rationale.
 */
export const PROGRAM_CARD_IMAGE_CONFIG: Record<ProgramCardImageType, ProgramCardImageConfig> = {
  "digital-nomad": {
    queries: [
      "laptop coworking lisbon cafe",
      "remote work portugal cafe window",
      "digital nomad laptop terrace",
    ],
  },
  "passive-income": {
    queries: [
      "portugal terrace relaxed lifestyle",
      "europe balcony sunset cozy",
      "apartment terrace morning peaceful",
    ],
  },
  "family-reunification": {
    queries: [
      "family reunion airport warm embrace",
      "family home warm light",
      "parents children europe home",
    ],
  },
  "golden-visa": {
    queries: [
      "investment portfolio financial planning",
      "financial planning europe capital",
      "portfolio calculator documents",
    ],
  },
  student: {
    queries: [
      "university campus students walking",
      "student books library campus europe",
      "college campus architecture students",
    ],
  },
  "work-permit": {
    queries: [
      "modern office professional work",
      "european workplace coworking",
      "business district office professional",
    ],
  },
  freelancer: {
    queries: [
      "freelancer laptop cafe europe",
      "IT contractor coworking laptop",
      "self employed cafe laptop work",
    ],
  },
  startup: {
    queries: [
      "startup office team laptop",
      "tech startup innovation office",
      "startup coworking young founders",
    ],
  },
};

/**
 * Maps every program slug → canonical image type.
 * Same type always resolves to the same `/images/programs/{type}.webp`.
 */
export const PROGRAM_SLUG_TO_IMAGE_TYPE: Record<string, ProgramCardImageType> = {
  // Portugal
  "portugal-d8-digital-nomad": "digital-nomad",
  "portugal-d7-passive-income": "passive-income",
  "portugal-family-reunification": "family-reunification",
  "portugal-golden-visa": "golden-visa",
  "portugal-student-visa-d4": "student",

  // Spain
  "spain-digital-nomad": "digital-nomad",
  "spain-non-lucrative": "passive-income",
  "spain-family-reunification": "family-reunification",
  "spain-residence-by-investment": "golden-visa",
  "spain-student-visa": "student",

  // France
  "france-talent-salarie": "work-permit",
  "france-vls-ts-visiteur": "passive-income",
  "france-family-reunification": "family-reunification",
  "france-student-visa": "student",

  // Italy
  "italy-digital-nomad": "digital-nomad",
  "italy-elective-residence": "passive-income",
  "italy-family-reunification": "family-reunification",
  "italy-investor-visa": "golden-visa",
  "italy-student-visa": "student",

  // Germany
  "germany-eu-blue-card": "work-permit",
  "germany-chancenkarte": "work-permit",
  "germany-family-reunification": "family-reunification",
  "germany-student-visa": "student",

  // Netherlands
  "netherlands-hsm": "work-permit",
  "netherlands-startup-facilitator": "startup",
  "netherlands-family-reunification": "family-reunification",

  // Scandinavia
  "sweden-work-permit": "work-permit",
  "denmark-work-permit": "work-permit",
  "nordic-family-reunification": "family-reunification",

  // Poland
  "poland-work-permit": "work-permit",
  "poland-eu-blue-card": "work-permit",
  "poland-b2b-contract": "freelancer",
  "poland-family-reunification": "family-reunification",
  "poland-student-visa": "student",

  // Czechia
  "czechia-employee-card": "work-permit",
  "czechia-eu-blue-card": "work-permit",
  "czechia-zivnost-freelancer": "freelancer",
  "czechia-family-reunification": "family-reunification",
  "czechia-student-visa": "student",

  // Austria
  "austria-rwr-card": "work-permit",
  "austria-eu-blue-card": "work-permit",
  "austria-freelancer-self-employed": "freelancer",
  "austria-family-reunification": "family-reunification",
  "austria-student-visa": "student",
};

/** @deprecated Use PROGRAM_SLUG_TO_IMAGE_TYPE — kept for scripts that list slugs. */
export const PROGRAM_CARD_IMAGE_SLUGS = Object.keys(PROGRAM_SLUG_TO_IMAGE_TYPE);

/** @deprecated Use PROGRAM_CARD_IMAGE_CONFIG[type].queries */
export const PROGRAM_CARD_IMAGES: Record<string, ProgramCardImageConfig> = Object.fromEntries(
  Object.entries(PROGRAM_SLUG_TO_IMAGE_TYPE).map(([slug, type]) => [slug, PROGRAM_CARD_IMAGE_CONFIG[type]])
);

/** @deprecated Use PROGRAM_CARD_IMAGE_CONFIG[type].queries */
export const PROGRAM_PHOTO_QUERIES: Record<string, string[]> = Object.fromEntries(
  Object.entries(PROGRAM_SLUG_TO_IMAGE_TYPE).map(([slug, type]) => [slug, PROGRAM_CARD_IMAGE_CONFIG[type].queries])
);

export function getProgramCardImageType(slug: string): ProgramCardImageType | null {
  return PROGRAM_SLUG_TO_IMAGE_TYPE[slug] ?? null;
}

export function programCardImagePublicPath(type: ProgramCardImageType): string {
  return `/images/programs/${type}.webp`;
}

export function programCardImageFilePath(type: ProgramCardImageType): string {
  return path.join(process.cwd(), PROGRAM_IMAGES_DIR, `${type}.webp`);
}

export function hasProgramCardImage(type: ProgramCardImageType): boolean {
  try {
    const file = programCardImageFilePath(type);
    return fs.existsSync(file) && fs.statSync(file).size >= 15_000;
  } catch {
    return false;
  }
}

/** Resolved hero for a program card — canonical type WebP or country corridor fallback. */
export function getProgramCardImage(slug: string, countrySegment?: string): string {
  const type = getProgramCardImageType(slug);
  if (type && hasProgramCardImage(type)) {
    return programCardImagePublicPath(type);
  }
  if (countrySegment) {
    const corridor = `/images/corridor-${countrySegment}.webp`;
    const file = path.join(process.cwd(), "public", corridor);
    if (fs.existsSync(file)) return corridor;
  }
  return "/images/emigro-main-hero.webp";
}
