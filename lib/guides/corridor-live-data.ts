import { getProgramsBySlugs } from "@/lib/corridor/queries";
import { getAllNewsTopics } from "@/lib/news/topics";
import type { NewsTopicConfig } from "@/lib/news/topics";
import type { GuidePassportIso2 } from "@/lib/guides/guide-display";
import { orderedGuideCorridorSlugs, passportColumnLabel } from "@/lib/guides/guide-display";
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
  passportStatus: string | null;
  lastVerified: string | null;
};

export type GuideCorridorLiveMeta = {
  countryNameRu: string;
  wizardHref: string;
};

export type GuideLiveCorridorBlock = {
  meta: GuideCorridorLiveMeta;
  programs: GuideLiveProgramRow[];
};

export type GuideLiveDataPayload = {
  blocks: GuideLiveCorridorBlock[];
  passportLabel: string;
};

function mapProgram(
  program: ProgramDetail,
  landingPath: string,
  passportIso2: GuidePassportIso2,
): GuideLiveProgramRow {
  const income = program.requirements.find((r) => /доход|средств|income|salary|зарплат/i.test(r.label_ru));
  const passportRow = program.passportEligibility.find((p) => p.passport_iso2 === passportIso2);
  const lastVerified = program.sources
    .map((s) => s.last_verified)
    .filter(Boolean)
    .sort()
    .at(-1);

  return {
    title: program.title_ru,
    href: `${landingPath}/programs/${program.slug}`,
    incomeThreshold: income?.value_text ?? income?.label_ru ?? null,
    passportStatus: passportRow ? PASSPORT_STATUS_RU[passportRow.status] ?? passportRow.status : null,
    lastVerified: lastVerified ?? null,
  };
}

function buildTopicByCorridorMap(topics: NewsTopicConfig[]): Map<string, NewsTopicConfig> {
  return new Map(
    topics
      .filter((topic): topic is NewsTopicConfig & { corridorSlug: string } => Boolean(topic.corridorSlug))
      .map((topic) => [topic.corridorSlug, topic]),
  );
}

/** Live program thresholds from corridor DB — for pillar guides with corridor_slugs. */
export async function loadGuideCorridorLivePrograms(
  corridorSlug: string,
  passportIso2: GuidePassportIso2 = "RU",
): Promise<{ programs: GuideLiveProgramRow[]; meta: GuideCorridorLiveMeta | null }> {
  const payload = await loadGuideLiveDataForGuide([corridorSlug], undefined, passportIso2);
  const block = payload.blocks.find((item) => item.meta.countryNameRu) ?? payload.blocks[0];
  return {
    programs: block?.programs ?? [],
    meta: block?.meta ?? null,
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

/** Load live blocks for all matching corridors (multi-country guides get one table per country). */
export async function loadGuideLiveDataForGuide(
  corridorSlugs?: string[],
  topicKeys?: string[],
  passportIso2: GuidePassportIso2 = "RU",
): Promise<GuideLiveDataPayload> {
  const ordered = orderedGuideCorridorSlugs(corridorSlugs, topicKeys);
  if (ordered.length === 0) {
    return {
      blocks: [],
      passportLabel: passportColumnLabel(passportIso2),
    };
  }

  const programSlugs = ordered.flatMap((slug) => CORRIDOR_PROGRAM_SLUGS[slug] ?? []);
  const [topics, programsBySlug] = await Promise.all([getAllNewsTopics(), getProgramsBySlugs(programSlugs)]);
  const topicByCorridor = buildTopicByCorridorMap(topics);

  const blocks: GuideLiveCorridorBlock[] = [];
  for (const slug of ordered) {
    const slugs = CORRIDOR_PROGRAM_SLUGS[slug];
    const topic = topicByCorridor.get(slug);
    if (!slugs?.length || !topic?.sitePaths?.landing || !topic.sitePaths.wizard) continue;

    const programs = slugs
      .map((programSlug) => programsBySlug.get(programSlug))
      .filter((program): program is ProgramDetail => Boolean(program))
      .map((program) => mapProgram(program, topic.sitePaths!.landing, passportIso2));

    if (programs.length === 0) continue;

    blocks.push({
      meta: {
        countryNameRu: topic.countryRu,
        wizardHref: topic.sitePaths.wizard,
      },
      programs,
    });
  }

  return {
    blocks,
    passportLabel: passportColumnLabel(passportIso2),
  };
}
