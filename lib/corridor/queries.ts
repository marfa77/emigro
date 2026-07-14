import { unstable_cache } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";
import { CACHE_REVALIDATE, CACHE_TAGS } from "@/lib/cache/tags";
import type { Corridor, ProgramDetail, WizardDefinition } from "@/lib/types";

export const CORRIDOR_SLUG = "ru-speaking-to-portugal";

export type Locale = "ru" | "en";

type CorridorSummary = {
  id: string;
  slug: string;
  title_ru: string;
};

export function pickLocale<T extends Record<string, string>>(
  locale: Locale,
  en: string,
  ru: string
): string {
  return locale === "ru" ? ru : en;
}

async function fetchCorridorBySlugUncached(slug: string): Promise<Corridor | null> {
  const supabase = createServerClient();
  const { data: corridor, error } = await supabase
    .from("emigro_corridors")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error || !corridor) return null;

  const [
    { data: passports },
    { data: destinations },
    { data: corridorPrograms },
    { data: digest },
  ] = await Promise.all([
    supabase.from("emigro_corridor_passports").select("*").eq("corridor_id", corridor.id),
    supabase.from("emigro_corridor_destinations").select("*").eq("corridor_id", corridor.id),
    supabase
      .from("emigro_corridor_programs")
      .select("sort_order, is_featured, program_id")
      .eq("corridor_id", corridor.id)
      .order("sort_order"),
    supabase
      .from("emigro_corridor_digest_items")
      .select("*")
      .eq("corridor_id", corridor.id)
      .eq("is_published", true)
      .order("sort_order"),
  ]);

  const programIds = (corridorPrograms ?? []).map((r) => r.program_id);
  const { data: programRows } = programIds.length
    ? await supabase.from("emigro_programs").select("*").in("id", programIds).eq("is_active", true)
    : { data: [] };

  const programMap = new Map((programRows ?? []).map((p) => [p.id, p]));

  return {
    id: corridor.id,
    slug: corridor.slug,
    title_ru: corridor.title_ru,
    audience_description_ru: corridor.audience_description_ru,
    passports: passports ?? [],
    programs: (corridorPrograms ?? [])
      .map((row) => {
        const p = programMap.get(row.program_id);
        if (!p) return null;
        return {
          id: p.id,
          slug: p.slug,
          program_type: p.program_type,
          title_ru: p.title_ru,
          summary_ru: p.summary_ru,
          sort_order: row.sort_order,
          is_featured: row.is_featured,
        };
      })
      .filter((p): p is NonNullable<typeof p> => p !== null),
    digest: digest ?? [],
  };
}

export async function getCorridorBySlug(slug: string): Promise<Corridor | null> {
  return unstable_cache(
    () => fetchCorridorBySlugUncached(slug),
    ["corridor-by-slug", slug],
    { revalidate: CACHE_REVALIDATE.corridors, tags: [CACHE_TAGS.corridors, `corridor-${slug}`] },
  )();
}

async function fetchPublishedCorridorSummaryUncached(slug: string): Promise<CorridorSummary | null> {
  const supabase = createServerClient();
  const { data: corridor, error } = await supabase
    .from("emigro_corridors")
    .select("id, slug, title_ru")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error || !corridor) return null;
  return corridor;
}

export async function getPublishedCorridorSummaryBySlug(slug: string): Promise<CorridorSummary | null> {
  return unstable_cache(
    () => fetchPublishedCorridorSummaryUncached(slug),
    ["corridor-summary", slug],
    { revalidate: CACHE_REVALIDATE.corridors, tags: [CACHE_TAGS.corridors, `corridor-${slug}`] },
  )();
}

function emptyProgramDetail(
  program: Omit<ProgramDetail, "version" | "requirements" | "costs" | "timeline" | "sources" | "passportEligibility">,
): ProgramDetail {
  return {
    ...program,
    version: null,
    requirements: [],
    costs: [],
    timeline: [],
    sources: [],
    passportEligibility: [],
  };
}

async function hydratePrograms(
  programs: Array<Omit<ProgramDetail, "version" | "requirements" | "costs" | "timeline" | "sources" | "passportEligibility">>,
): Promise<Record<string, ProgramDetail>> {
  if (programs.length === 0) return {};

  const supabase = createServerClient();
  const programIds = programs.map((program) => program.id);
  const { data: allVersions } = await supabase
    .from("emigro_program_versions")
    .select("*")
    .in("program_id", programIds)
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  const versionByProgramId = new Map<string, NonNullable<typeof allVersions>[number]>();
  for (const version of allVersions ?? []) {
    if (!versionByProgramId.has(version.program_id)) {
      versionByProgramId.set(version.program_id, version);
    }
  }

  const versionIds = Array.from(versionByProgramId.values()).map((version) => version.id);
  const grouped = {
    requirements: new Map<string, ProgramDetail["requirements"]>(),
    costs: new Map<string, ProgramDetail["costs"]>(),
    timeline: new Map<string, ProgramDetail["timeline"]>(),
    sources: new Map<string, ProgramDetail["sources"]>(),
    passportEligibility: new Map<string, ProgramDetail["passportEligibility"]>(),
  };

  if (versionIds.length > 0) {
    const [
      { data: requirements },
      { data: costs },
      { data: timeline },
      { data: sources },
      { data: passportEligibility },
    ] = await Promise.all([
      supabase
        .from("emigro_program_requirements")
        .select("*")
        .in("program_version_id", versionIds)
        .order("sort_order"),
      supabase
        .from("emigro_program_costs")
        .select("*")
        .in("program_version_id", versionIds)
        .order("sort_order"),
      supabase
        .from("emigro_program_timeline_steps")
        .select("*")
        .in("program_version_id", versionIds)
        .order("sort_order"),
      supabase.from("emigro_program_sources").select("*").in("program_version_id", versionIds),
      supabase.from("emigro_passport_eligibility").select("*").in("program_version_id", versionIds),
    ]);

    for (const row of requirements ?? []) {
      const bucket = grouped.requirements.get(row.program_version_id) ?? [];
      bucket.push(row);
      grouped.requirements.set(row.program_version_id, bucket);
    }
    for (const row of costs ?? []) {
      const bucket = grouped.costs.get(row.program_version_id) ?? [];
      bucket.push(row);
      grouped.costs.set(row.program_version_id, bucket);
    }
    for (const row of timeline ?? []) {
      const bucket = grouped.timeline.get(row.program_version_id) ?? [];
      bucket.push(row);
      grouped.timeline.set(row.program_version_id, bucket);
    }
    for (const row of sources ?? []) {
      const bucket = grouped.sources.get(row.program_version_id) ?? [];
      bucket.push(row);
      grouped.sources.set(row.program_version_id, bucket);
    }
    for (const row of passportEligibility ?? []) {
      const bucket = grouped.passportEligibility.get(row.program_version_id) ?? [];
      bucket.push(row);
      grouped.passportEligibility.set(row.program_version_id, bucket);
    }
  }

  return Object.fromEntries(
    programs.map((program) => {
      const version = versionByProgramId.get(program.id) ?? null;
      if (!version) {
        return [program.slug, emptyProgramDetail(program)];
      }
      return [
        program.slug,
        {
          ...program,
          version,
          requirements: grouped.requirements.get(version.id) ?? [],
          costs: grouped.costs.get(version.id) ?? [],
          timeline: grouped.timeline.get(version.id) ?? [],
          sources: grouped.sources.get(version.id) ?? [],
          passportEligibility: grouped.passportEligibility.get(version.id) ?? [],
        },
      ];
    }),
  );
}

async function fetchProgramsBySlugsUncached(slugs: string[]): Promise<Record<string, ProgramDetail>> {
  const uniqueSlugs = Array.from(new Set(slugs.filter(Boolean))).sort();
  if (uniqueSlugs.length === 0) return {};

  const supabase = createServerClient();
  const { data: programs } = await supabase
    .from("emigro_programs")
    .select("*")
    .in("slug", uniqueSlugs)
    .eq("is_active", true);

  return hydratePrograms(programs ?? []);
}

export async function getProgramsBySlugs(slugs: string[]): Promise<Map<string, ProgramDetail>> {
  const uniqueSlugs = Array.from(new Set(slugs.filter(Boolean))).sort();
  if (uniqueSlugs.length === 0) return new Map();

  const record = await unstable_cache(
    () => fetchProgramsBySlugsUncached(uniqueSlugs),
    ["programs-by-slugs", ...uniqueSlugs],
    { revalidate: CACHE_REVALIDATE.programs, tags: [CACHE_TAGS.programs] },
  )();

  return new Map(Object.entries(record));
}

export async function getProgramBySlug(slug: string): Promise<ProgramDetail | null> {
  const programs = await getProgramsBySlugs([slug]);
  return programs.get(slug) ?? null;
}

async function fetchWizardForCorridorUncached(corridorId: string): Promise<WizardDefinition | null> {
  const supabase = createServerClient();
  const { data: wizard } = await supabase
    .from("emigro_wizard_definitions")
    .select("*")
    .eq("corridor_id", corridorId)
    .single();

  if (!wizard) return null;

  const { data: modules } = await supabase
    .from("emigro_wizard_modules")
    .select("*")
    .eq("wizard_id", wizard.id)
    .order("sort_order");

  const moduleIds = (modules ?? []).map((m) => m.id);
  const { data: questions } = await supabase
    .from("emigro_wizard_questions")
    .select("*")
    .in("module_id", moduleIds)
    .order("sort_order");

  return {
    ...wizard,
    modules: (modules ?? []).map((mod) => ({
      ...mod,
      questions: (questions ?? []).filter((q) => q.module_id === mod.id),
    })),
  };
}

export async function getWizardForCorridor(corridorId: string): Promise<WizardDefinition | null> {
  return unstable_cache(
    () => fetchWizardForCorridorUncached(corridorId),
    ["wizard-for-corridor", corridorId],
    { revalidate: CACHE_REVALIDATE.corridors, tags: [CACHE_TAGS.wizards, CACHE_TAGS.corridors] },
  )();
}
