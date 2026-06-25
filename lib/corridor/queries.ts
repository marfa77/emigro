import { createServerClient } from "@/lib/supabase/server";
import type { Corridor, ProgramDetail, WizardDefinition } from "@/lib/types";

export const CORRIDOR_SLUG = "ru-speaking-to-portugal";

export type Locale = "ru" | "en";

export function pickLocale<T extends Record<string, string>>(
  locale: Locale,
  en: string,
  ru: string
): string {
  return locale === "ru" ? ru : en;
}

export async function getCorridorBySlug(slug: string): Promise<Corridor | null> {
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
    ? await supabase.from("emigro_programs").select("*").in("id", programIds)
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

export async function getProgramBySlug(slug: string): Promise<ProgramDetail | null> {
  const supabase = createServerClient();
  const { data: program } = await supabase
    .from("emigro_programs")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!program) return null;

  const { data: version } = await supabase
    .from("emigro_program_versions")
    .select("*")
    .eq("program_id", program.id)
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!version) {
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
      .eq("program_version_id", version.id)
      .order("sort_order"),
    supabase
      .from("emigro_program_costs")
      .select("*")
      .eq("program_version_id", version.id)
      .order("sort_order"),
    supabase
      .from("emigro_program_timeline_steps")
      .select("*")
      .eq("program_version_id", version.id)
      .order("sort_order"),
    supabase.from("emigro_program_sources").select("*").eq("program_version_id", version.id),
    supabase
      .from("emigro_passport_eligibility")
      .select("*")
      .eq("program_version_id", version.id),
  ]);

  return {
    ...program,
    version,
    requirements: requirements ?? [],
    costs: costs ?? [],
    timeline: timeline ?? [],
    sources: sources ?? [],
    passportEligibility: passportEligibility ?? [],
  };
}

export async function getWizardForCorridor(corridorId: string): Promise<WizardDefinition | null> {
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
