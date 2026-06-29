import {
  EVALUATION_OUTCOMES_FALLBACK,
  PROGRAM_TYPES_FALLBACK,
  REQUIREMENT_TYPES_FALLBACK,
  STEP_TYPES_FALLBACK,
  type MetaCodeRow,
} from "@/lib/api/meta-catalog";
import { CORRIDOR_REGISTRY } from "@/lib/corridor/registry";
import { createServerClient } from "@/lib/supabase/server";

type DbCodeRow = { code: string; label_en: string; label_ru: string };

async function loadCodeTable(
  table: string,
  fallback: MetaCodeRow[]
): Promise<MetaCodeRow[]> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase.from(table).select("code, label_en, label_ru").order("code");
    if (error || !data?.length) return fallback;
    return data as DbCodeRow[];
  } catch {
    return fallback;
  }
}

export async function getRequirementTypes(): Promise<MetaCodeRow[]> {
  return loadCodeTable("emigro_requirement_types", REQUIREMENT_TYPES_FALLBACK);
}

export async function getProgramTypes(): Promise<MetaCodeRow[]> {
  return loadCodeTable("emigro_program_types", PROGRAM_TYPES_FALLBACK);
}

export async function getStepTypes(): Promise<MetaCodeRow[]> {
  return loadCodeTable("emigro_step_types", STEP_TYPES_FALLBACK);
}

export async function getEvaluationOutcomes(): Promise<MetaCodeRow[]> {
  return loadCodeTable("emigro_outcomes", EVALUATION_OUTCOMES_FALLBACK);
}

export async function getCountries(): Promise<
  { iso2: string; name_en: string; name_ru: string }[]
> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("emigro_countries")
      .select("iso2, name_en, name_ru")
      .order("iso2");
    if (error || !data?.length) return buildCountriesFromRegistry();
    return data;
  } catch {
    return buildCountriesFromRegistry();
  }
}

function buildCountriesFromRegistry() {
  const seen = new Map<string, { iso2: string; name_en: string; name_ru: string }>();
  for (const c of CORRIDOR_REGISTRY) {
    for (const iso2 of c.destinationIso2) {
      if (seen.has(iso2)) continue;
      const nameRu = c.titleRu.replace(/^Русскоязычные → /, "");
      seen.set(iso2, { iso2, name_en: c.titleEn.replace(/^Russian-speaking → /, ""), name_ru: nameRu });
    }
  }
  return Array.from(seen.values()).sort((a, b) => a.iso2.localeCompare(b.iso2));
}

export function getCorridorMetaSchema() {
  return {
    corridors: CORRIDOR_REGISTRY.map((c) => ({
      slug: c.slug,
      segment: c.segment,
      destination_iso2: [...c.destinationIso2],
      title_en: c.titleEn,
      title_ru: c.titleRu,
      active: c.active,
      wizard_enabled: c.wizardEnabled,
      assist_eligible: c.assistEligible,
    })),
    slug_pattern: "ru-speaking-to-{segment}",
    url_pattern: "/ru/{segment}",
  };
}
