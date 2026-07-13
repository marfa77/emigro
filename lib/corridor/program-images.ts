import fs from "fs";
import path from "path";

/** Landscape card heroes for corridor program tiles (1200×630 WebP). */
export const PROGRAM_IMAGES_DIR = "public/images/programs";

/** Pexels search queries per program slug — curated, non-cheesy, Portugal-biased where relevant. */
export const PROGRAM_PHOTO_QUERIES: Record<string, string[]> = {
  "portugal-d8-digital-nomad": [
    "laptop coworking lisbon cafe",
    "remote work portugal cafe window",
    "digital nomad laptop terrace portugal",
  ],
  "portugal-d7-passive-income": [
    "portugal terrace relaxed lifestyle",
    "portugal balcony sunset cozy",
    "lisbon apartment terrace morning",
  ],
  "portugal-family-reunification": [
    "family reunion airport warm embrace",
    "family home portugal living room",
    "parents children home warm light",
  ],
  "portugal-golden-visa": [
    "investment portfolio financial planning",
    "lisbon business district modern",
    "portugal culture museum architecture",
  ],
  "portugal-student-visa-d4": [
    "university campus portugal students",
    "student books library campus europe",
    "college campus portugal architecture",
  ],
  "spain-digital-nomad": [
    "digital nomad laptop valencia cafe",
    "remote work spain coworking",
    "laptop beach terrace spain",
  ],
  "spain-non-lucrative": [
    "spain terrace relaxed retirement",
    "valencia balcony peaceful lifestyle",
    "spain apartment sunny terrace",
  ],
  "spain-family-reunification": [
    "family reunion airport spain",
    "family home spain warm",
    "parents children europe home",
  ],
};

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
