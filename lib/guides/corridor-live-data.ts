import { getProgramBySlug } from "@/lib/corridor/queries";
import { getNewsTopicByCorridorSlug } from "@/lib/news/topics";
import type { ProgramDetail } from "@/lib/types";

const CORRIDOR_PROGRAM_SLUGS: Record<string, readonly string[]> = {
  "ru-speaking-to-portugal": ["portugal-d8-digital-nomad", "portugal-d7-passive-income"],
  "ru-speaking-to-spain": ["spain-digital-nomad", "spain-non-lucrative"],
  "ru-speaking-to-france": ["france-talent-salarie", "france-vls-ts-visiteur"],
  "ru-speaking-to-italy": ["italy-digital-nomad", "italy-elective-residence"],
  "ru-speaking-to-germany": ["germany-eu-blue-card", "germany-chancenkarte"],
  "ru-speaking-to-netherlands": ["netherlands-hsm", "netherlands-startup-facilitator"],
  "ru-speaking-to-scandinavia": ["sweden-work-permit", "denmark-work-permit"],
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

export function corridorSlugToTopicKey(corridorSlug: string): string {
  return corridorSlug.replace(/^ru-speaking-to-/, "");
}

/** Only corridors whose destination matches guide topic_keys (e.g. serbia guide ≠ portugal data). */
export function filterCorridorSlugsForGuideTopics(
  corridorSlugs: string[] | undefined,
  topicKeys: string[] | undefined,
): string[] {
  const slugs = corridorSlugs ?? [];
  if (!topicKeys?.length) return slugs;

  const topics = new Set(topicKeys);
  const matched = slugs.filter((slug) => topics.has(corridorSlugToTopicKey(slug)));
  return matched.length > 0 ? matched : [];
}

function orderCorridorsByTopicKeys(corridorSlugs: string[], topicKeys: string[]): string[] {
  return [...corridorSlugs].sort((a, b) => {
    const ai = topicKeys.indexOf(corridorSlugToTopicKey(a));
    const bi = topicKeys.indexOf(corridorSlugToTopicKey(b));
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });
}

/** Pick first matching corridor slug on the guide that has live program data. */
export async function loadGuideLiveDataForGuide(
  corridorSlugs?: string[],
  topicKeys?: string[],
) {
  const filtered = filterCorridorSlugsForGuideTopics(corridorSlugs, topicKeys);
  const ordered =
    topicKeys?.length && filtered.length > 1
      ? orderCorridorsByTopicKeys(filtered, topicKeys)
      : filtered;

  for (const slug of ordered) {
    const data = await loadGuideCorridorLivePrograms(slug);
    if (data.programs.length > 0) return data;
  }
  return { programs: [], meta: null };
}
