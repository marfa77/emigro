import { getProgramBySlug } from "@/lib/corridor/queries";
import { getNewsTopicByCorridorSlug } from "@/lib/news/topics";
import type { ProgramDetail } from "@/lib/types";

const CORRIDOR_PROGRAM_SLUGS: Record<string, readonly string[]> = {
  "ru-speaking-to-portugal": ["portugal-d8-digital-nomad", "portugal-d7-passive-income"],
  "ru-speaking-to-poland": ["poland-eu-blue-card", "poland-work-permit"],
  "ru-speaking-to-czechia": ["czechia-eu-blue-card", "czechia-employee-card"],
  "ru-speaking-to-austria": ["austria-eu-blue-card", "austria-rwr-card"],
};

const PASSPORT_STATUS_RU: Record<string, string> = {
  eligible: "подача доступна",
  partial: "зависит от консульства",
  ineligible: "недоступен",
};

export type GuideLiveProgramRow = {
  title: string;
  href: string;
  incomeThreshold: string | null;
  passportRu: string | null;
  lastVerified: string | null;
};

export type GuideCorridorLiveMeta = {
  countryNameRu: string;
  wizardHref: string;
};

function mapProgram(program: ProgramDetail, landingPath: string): GuideLiveProgramRow {
  const income = program.requirements.find((r) => /доход|средств|income|salary|зарплат/i.test(r.label_ru));
  const ruPassport = program.passportEligibility.find((p) => p.passport_iso2 === "RU");
  const lastVerified = program.sources
    .map((s) => s.last_verified)
    .filter(Boolean)
    .sort()
    .at(-1);

  return {
    title: program.title_ru,
    href: `${landingPath}/programs/${program.slug}`,
    incomeThreshold: income?.value_text ?? income?.label_ru ?? null,
    passportRu: ruPassport ? PASSPORT_STATUS_RU[ruPassport.status] ?? ruPassport.status : null,
    lastVerified: lastVerified ?? null,
  };
}

/** Live program thresholds from corridor DB — for pillar guides with corridor_slugs. */
export async function loadGuideCorridorLivePrograms(
  corridorSlug: string,
): Promise<{ programs: GuideLiveProgramRow[]; meta: GuideCorridorLiveMeta | null }> {
  const slugs = CORRIDOR_PROGRAM_SLUGS[corridorSlug];
  if (!slugs?.length) return { programs: [], meta: null };

  const topic = await getNewsTopicByCorridorSlug(corridorSlug);
  if (!topic?.sitePaths?.landing || !topic.sitePaths.wizard) return { programs: [], meta: null };

  const programs = await Promise.all(slugs.map((slug) => getProgramBySlug(slug)));
  return {
    programs: programs
      .filter((p): p is ProgramDetail => Boolean(p))
      .map((program) => mapProgram(program, topic.sitePaths!.landing)),
    meta: {
      countryNameRu: topic.countryRu,
      wizardHref: topic.sitePaths.wizard,
    },
  };
}

/** Pick first corridor slug on the guide that has live program data. */
export async function loadGuideLiveDataForGuide(corridorSlugs?: string[]) {
  for (const slug of corridorSlugs ?? []) {
    const data = await loadGuideCorridorLivePrograms(slug);
    if (data.programs.length > 0) return data;
  }
  return { programs: [], meta: null };
}
