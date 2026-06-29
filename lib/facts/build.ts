import { getCorridorEntry, CORRIDOR_REGISTRY } from "@/lib/corridor/registry";
import { getCorridorBySlug, getProgramBySlug } from "@/lib/corridor/queries";
import type { Corridor, DigestItem, ProgramDetail, ProgramSource } from "@/lib/types";

const FACTS_DISCLAIMER =
  "Informational facts only — not legal advice. Verify with official sources before acting.";

function maxDate(dates: (string | null | undefined)[]): string | null {
  const valid = dates.filter((d): d is string => Boolean(d));
  if (!valid.length) return null;
  return valid.sort().at(-1) ?? null;
}

function digestLastVerified(items: DigestItem[]): string | null {
  return maxDate(items.map((d) => d.last_verified));
}

function sourcesLastVerified(sources: ProgramSource[]): string | null {
  return maxDate(sources.map((s) => s.last_verified));
}

export type CorridorFactsSummary = {
  slug: string;
  segment: string;
  title_en: string;
  title_ru: string;
  destination_iso2: string[];
  active: boolean;
  wizard_enabled: boolean;
  program_count: number;
  last_verified: string | null;
};

export function listActiveCorridorFacts(): CorridorFactsSummary[] {
  return CORRIDOR_REGISTRY.filter((c) => c.active).map((c) => ({
    slug: c.slug,
    segment: c.segment,
    title_en: c.titleEn,
    title_ru: c.titleRu,
    destination_iso2: [...c.destinationIso2],
    active: c.active,
    wizard_enabled: c.wizardEnabled,
    program_count: 0,
    last_verified: null,
  }));
}

export async function enrichCorridorFactsList(): Promise<{
  corridors: CorridorFactsSummary[];
  generated_at: string;
  disclaimer: string;
}> {
  const base = listActiveCorridorFacts();
  const enriched = await Promise.all(
    base.map(async (row) => {
      const corridor = await getCorridorBySlug(row.slug);
      if (!corridor) return row;
      return {
        ...row,
        program_count: corridor.programs.length,
        last_verified: digestLastVerified(corridor.digest),
      };
    })
  );
  return {
    corridors: enriched,
    generated_at: new Date().toISOString(),
    disclaimer: FACTS_DISCLAIMER,
  };
}

function mapCorridorFacts(corridor: Corridor, entry: NonNullable<ReturnType<typeof getCorridorEntry>>) {
  return {
    slug: corridor.slug,
    segment: entry.segment,
    title_ru: corridor.title_ru,
    title_en: entry.titleEn,
    audience_description_ru: corridor.audience_description_ru,
    destination_iso2: [...entry.destinationIso2],
    passports: corridor.passports.map((p) => ({
      iso2: p.passport_iso2,
      support_level: p.support_level,
    })),
    programs: corridor.programs.map((p) => ({
      slug: p.slug,
      program_type: p.program_type,
      title_ru: p.title_ru,
      summary_ru: p.summary_ru,
      is_featured: p.is_featured ?? false,
    })),
    digest: corridor.digest.map((d) => ({
      category: d.category,
      title_ru: d.title_ru,
      body_ru: d.body_ru,
      source_url: d.source_url,
      last_verified: d.last_verified,
      review_status: d.review_status ?? null,
    })),
    last_verified: digestLastVerified(corridor.digest),
    disclaimer: FACTS_DISCLAIMER,
    generated_at: new Date().toISOString(),
  };
}

export async function buildCorridorFacts(slug: string) {
  const entry = getCorridorEntry(slug);
  if (!entry?.active) return null;
  const corridor = await getCorridorBySlug(slug);
  if (!corridor) return null;
  return mapCorridorFacts(corridor, entry);
}

export function mapProgramFacts(program: ProgramDetail) {
  const lastVerified = sourcesLastVerified(program.sources);
  return {
    slug: program.slug,
    destination_iso2: program.destination_iso2,
    program_type: program.program_type,
    title_ru: program.title_ru,
    summary_ru: program.summary_ru,
    requirements: program.requirements.map((r) => ({
      label_ru: r.label_ru,
      value_text: r.value_text,
    })),
    costs: program.costs.map((c) => ({
      label_ru: c.label_ru,
      amount_text: c.amount_text,
      amount_eur: c.amount_eur,
    })),
    timeline: program.timeline.map((t) => ({
      title_ru: t.title_ru,
      duration_text: t.duration_text,
    })),
    sources: program.sources.map((s) => ({
      source_url: s.source_url,
      raw_excerpt: s.raw_excerpt,
      last_verified: s.last_verified,
      label_ru: s.label_ru,
      review_status: s.review_status ?? null,
    })),
    passport_eligibility: program.passportEligibility.map((p) => ({
      passport_iso2: p.passport_iso2,
      status: p.status,
      notes_ru: p.notes_ru,
    })),
    last_verified: lastVerified,
    disclaimer: FACTS_DISCLAIMER,
    generated_at: new Date().toISOString(),
  };
}

export async function buildProgramFacts(slug: string) {
  const program = await getProgramBySlug(slug);
  if (!program) return null;
  return mapProgramFacts(program);
}
