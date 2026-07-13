import fs from "fs";
import path from "path";

/** Landscape card heroes for corridor program tiles (1200×630 WebP). */
export const PROGRAM_IMAGES_DIR = "public/images/programs";

export type ProgramCardImageConfig = {
  /** Pexels search queries — curated, non-cheesy, country-biased where relevant. */
  queries: string[];
};

/**
 * Single registry of program card heroes keyed by program slug.
 * Used by ProgramRouteCard, image generation, and corridor hubs (all corridors).
 */
export const PROGRAM_CARD_IMAGES: Record<string, ProgramCardImageConfig> = {
  // Portugal
  "portugal-d8-digital-nomad": {
    queries: [
      "laptop coworking lisbon cafe",
      "remote work portugal cafe window",
      "digital nomad laptop terrace portugal",
    ],
  },
  "portugal-d7-passive-income": {
    queries: [
      "portugal terrace relaxed lifestyle",
      "portugal balcony sunset cozy",
      "lisbon apartment terrace morning",
    ],
  },
  "portugal-family-reunification": {
    queries: [
      "family reunion airport warm embrace",
      "family home portugal living room",
      "parents children home warm light",
    ],
  },
  "portugal-golden-visa": {
    queries: [
      "investment portfolio financial planning",
      "lisbon business district modern",
      "portugal culture museum architecture",
    ],
  },
  "portugal-student-visa-d4": {
    queries: [
      "university campus portugal students",
      "student books library campus europe",
      "college campus portugal architecture",
    ],
  },

  // Spain
  "spain-digital-nomad": {
    queries: [
      "digital nomad laptop valencia cafe",
      "remote work spain coworking",
      "laptop beach terrace spain",
    ],
  },
  "spain-non-lucrative": {
    queries: [
      "spain terrace relaxed retirement",
      "valencia balcony peaceful lifestyle",
      "spain apartment sunny terrace",
    ],
  },
  "spain-family-reunification": {
    queries: [
      "family reunion airport spain",
      "family home spain warm",
      "parents children europe home",
    ],
  },
  "spain-residence-by-investment": {
    queries: [
      "investment portfolio financial spain",
      "madrid business district modern",
      "financial planning europe capital",
    ],
  },
  "spain-student-visa": {
    queries: [
      "university campus spain students",
      "student library madrid campus",
      "college architecture barcelona students",
    ],
  },

  // France
  "france-talent-salarie": {
    queries: [
      "paris office professional work",
      "french business district modern",
      "professional workplace paris canal",
    ],
  },
  "france-vls-ts-visiteur": {
    queries: [
      "paris terrace relaxed lifestyle",
      "provence village peaceful lifestyle",
      "french apartment balcony morning",
    ],
  },
  "france-family-reunification": {
    queries: [
      "family reunion airport france",
      "family home paris warm light",
      "parents children europe home",
    ],
  },
  "france-student-visa": {
    queries: [
      "sorbonne university paris students",
      "french university campus library",
      "student campus france architecture",
    ],
  },

  // Italy
  "italy-digital-nomad": {
    queries: [
      "remote work milan cafe laptop",
      "digital nomad rome coworking",
      "laptop terrace italy cafe",
    ],
  },
  "italy-elective-residence": {
    queries: [
      "italy terrace retirement lifestyle",
      "tuscan villa peaceful balcony",
      "italian apartment sunny terrace",
    ],
  },
  "italy-family-reunification": {
    queries: [
      "family reunion italy warm",
      "italian family dinner home",
      "parents children europe home",
    ],
  },
  "italy-investor-visa": {
    queries: [
      "investment portfolio milan finance",
      "italian startup innovation office",
      "milan business district modern",
    ],
  },
  "italy-student-visa": {
    queries: [
      "university rome campus students",
      "italian university architecture",
      "student library campus italy",
    ],
  },

  // Germany
  "germany-eu-blue-card": {
    queries: [
      "berlin office professional work",
      "german workplace modern office",
      "frankfurt business district",
    ],
  },
  "germany-chancenkarte": {
    queries: [
      "berlin young professional career",
      "job search germany professional",
      "berlin coworking opportunity",
    ],
  },
  "germany-family-reunification": {
    queries: [
      "family reunion germany airport",
      "family home berlin warm",
      "parents children europe home",
    ],
  },
  "germany-student-visa": {
    queries: [
      "university munich campus students",
      "german university library students",
      "student campus germany architecture",
    ],
  },

  // Netherlands
  "netherlands-hsm": {
    queries: [
      "amsterdam office canal professional",
      "dutch workplace modern office",
      "rotterdam business professional work",
    ],
  },
  "netherlands-startup-facilitator": {
    queries: [
      "amsterdam startup office team",
      "tech startup netherlands innovation",
      "startup coworking amsterdam",
    ],
  },
  "netherlands-family-reunification": {
    queries: [
      "family reunion netherlands warm",
      "family home amsterdam cozy",
      "parents children europe home",
    ],
  },

  // Scandinavia
  "sweden-work-permit": {
    queries: [
      "stockholm office modern professional",
      "swedish workplace business district",
      "stockholm canal office work",
    ],
  },
  "denmark-work-permit": {
    queries: [
      "copenhagen office professional work",
      "danish workplace modern office",
      "copenhagen canal business district",
    ],
  },
  "nordic-family-reunification": {
    queries: [
      "scandinavian family home warm",
      "family reunion nordic airport",
      "parents children scandinavia home",
    ],
  },

  // Poland
  "poland-work-permit": {
    queries: [
      "warsaw office professional work",
      "polish workplace modern office",
      "krakow business office professional",
    ],
  },
  "poland-eu-blue-card": {
    queries: [
      "warsaw tech office professional",
      "polish modern workplace IT",
      "wroclaw office business district",
    ],
  },
  "poland-b2b-contract": {
    queries: [
      "freelancer laptop warsaw cafe",
      "IT contractor poland coworking",
      "remote work poland cafe laptop",
    ],
  },
  "poland-family-reunification": {
    queries: [
      "family reunion poland warm",
      "family home warsaw cozy",
      "parents children europe home",
    ],
  },
  "poland-student-visa": {
    queries: [
      "university warsaw campus students",
      "polish university library students",
      "student campus krakow architecture",
    ],
  },

  // Czechia
  "czechia-employee-card": {
    queries: [
      "prague office professional work",
      "czech workplace modern office",
      "prague business district professional",
    ],
  },
  "czechia-eu-blue-card": {
    queries: [
      "prague tech office professional",
      "brno modern workplace office",
      "czech business district IT work",
    ],
  },
  "czechia-zivnost-freelancer": {
    queries: [
      "freelancer laptop prague cafe",
      "IT freelancer prague coworking",
      "remote work prague cafe laptop",
    ],
  },
  "czechia-family-reunification": {
    queries: [
      "family reunion prague warm",
      "family home czech cozy",
      "parents children europe home",
    ],
  },
  "czechia-student-visa": {
    queries: [
      "charles university prague students",
      "czech university campus library",
      "student campus prague architecture",
    ],
  },

  // Austria
  "austria-rwr-card": {
    queries: [
      "vienna office professional work",
      "austrian workplace modern office",
      "vienna business district professional",
    ],
  },
  "austria-eu-blue-card": {
    queries: [
      "vienna tech office professional",
      "graz modern workplace office",
      "austrian qualified work office",
    ],
  },
  "austria-freelancer-self-employed": {
    queries: [
      "freelancer laptop vienna cafe",
      "self employed vienna coworking",
      "creative freelancer vienna workspace",
    ],
  },
  "austria-family-reunification": {
    queries: [
      "family reunion vienna warm",
      "family home austria cozy",
      "parents children europe home",
    ],
  },
  "austria-student-visa": {
    queries: [
      "university vienna campus students",
      "austrian university architecture",
      "student library vienna campus",
    ],
  },
};

/** All program slugs with configured card images (generation + validation). */
export const PROGRAM_CARD_IMAGE_SLUGS = Object.keys(PROGRAM_CARD_IMAGES);

/** @deprecated Use PROGRAM_CARD_IMAGES[slug].queries — kept for generate script compatibility. */
export const PROGRAM_PHOTO_QUERIES: Record<string, string[]> = Object.fromEntries(
  Object.entries(PROGRAM_CARD_IMAGES).map(([slug, cfg]) => [slug, cfg.queries])
);

export function programCardImagePublicPath(slug: string): string {
  return `/images/programs/${slug}.webp`;
}

export function programCardImageFilePath(slug: string): string {
  return path.join(process.cwd(), PROGRAM_IMAGES_DIR, `${slug}.webp`);
}

export function hasProgramCardImage(slug: string): boolean {
  try {
    const file = programCardImageFilePath(slug);
    return fs.existsSync(file) && fs.statSync(file).size >= 15_000;
  } catch {
    return false;
  }
}

/** Resolved hero for a program card — committed WebP or country corridor fallback. */
export function getProgramCardImage(slug: string, countrySegment?: string): string {
  if (hasProgramCardImage(slug)) {
    return programCardImagePublicPath(slug);
  }
  if (countrySegment) {
    const corridor = `/images/corridor-${countrySegment}.webp`;
    const file = path.join(process.cwd(), "public", corridor);
    if (fs.existsSync(file)) return corridor;
  }
  return "/images/emigro-main-hero.webp";
}
