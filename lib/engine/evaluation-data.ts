import { createServerClient } from "@/lib/supabase/server";

const CACHE_TTL_MS = 5 * 60 * 1000;

type Cached<T> = {
  expiresAt: number;
  value: Promise<T>;
};

const cache = new Map<string, Cached<unknown>>();

export type EvaluationProgramData = {
  programId: string;
  programSlug: string;
  programTitleRu: string;
  programType: string;
  eligibilityRule: Record<string, unknown>;
  passportStatus?: string;
  requirements: EvaluationRequirementData[];
  sourceUrl?: string | null;
  sourceLabelRu?: string | null;
};

export type EvaluationRequirementData = {
  requirementType: string;
  labelRu: string;
  valueText?: string | null;
  sortOrder: number;
};

export type GlobalCorridorEvaluationData = {
  corridorId: string;
  corridorSlug: string;
  corridorTitleRu: string;
  countryRu: string;
  countrySegment: string;
  programs: EvaluationProgramData[];
};

async function cached<T>(key: string, loader: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const hit = cache.get(key) as Cached<T> | undefined;
  if (hit && hit.expiresAt > now) return hit.value;

  const value = loader().catch((error) => {
    cache.delete(key);
    throw error;
  });
  cache.set(key, { expiresAt: now + CACHE_TTL_MS, value });
  return value;
}

function latestVersionsByProgram(
  versions: Array<{
    id: string;
    program_id: string;
    eligibility_rule: unknown;
  }>
) {
  const byProgram = new Map<string, { id: string; eligibility_rule: Record<string, unknown> }>();
  for (const version of versions) {
    if (byProgram.has(version.program_id)) continue;
    byProgram.set(version.program_id, {
      id: version.id,
      eligibility_rule: (version.eligibility_rule ?? {}) as Record<string, unknown>,
    });
  }
  return byProgram;
}

function passportStatusByVersion(rows: Array<{ program_version_id: string; status: string }>) {
  return new Map(rows.map((row) => [row.program_version_id, row.status]));
}

function requirementsByVersion(
  rows: Array<{
    program_version_id: string;
    requirement_type: string;
    label_ru: string;
    value_text: string | null;
    sort_order: number;
  }>
) {
  const byVersion = new Map<string, EvaluationRequirementData[]>();
  for (const row of rows) {
    const list = byVersion.get(row.program_version_id) ?? [];
    list.push({
      requirementType: row.requirement_type,
      labelRu: row.label_ru,
      valueText: row.value_text,
      sortOrder: row.sort_order,
    });
    byVersion.set(row.program_version_id, list);
  }
  Array.from(byVersion.values()).forEach((list) => {
    list.sort((a, b) => a.sortOrder - b.sortOrder);
  });
  return byVersion;
}

function sourceByVersion(
  rows: Array<{
    program_version_id: string;
    source_url: string | null;
    label_ru: string | null;
    last_verified: string | null;
  }>
) {
  const byVersion = new Map<string, { sourceUrl: string | null; sourceLabelRu: string | null }>();
  for (const row of rows) {
    if (byVersion.has(row.program_version_id)) continue;
    byVersion.set(row.program_version_id, {
      sourceUrl: row.source_url,
      sourceLabelRu: row.label_ru,
    });
  }
  return byVersion;
}

export async function getCorridorEvaluationProgramData(
  corridorId: string,
  passportIso2: string
): Promise<EvaluationProgramData[]> {
  return cached<EvaluationProgramData[]>(`corridor-evaluation:${corridorId}:${passportIso2}`, async () => {
    const supabase = createServerClient();
    const { data: corridorPrograms } = await supabase
      .from("emigro_corridor_programs")
      .select("program_id, sort_order")
      .eq("corridor_id", corridorId)
      .order("sort_order");

    const programIds = (corridorPrograms ?? []).map((row) => row.program_id);
    if (!programIds.length) return [];

    const { data: programs } = await supabase
      .from("emigro_programs")
      .select("id, slug, title_ru, program_type")
      .in("id", programIds)
      .eq("is_active", true);

    const activeProgramIds = (programs ?? []).map((program) => program.id);
    if (!activeProgramIds.length) return [];

    const { data: versions } = await supabase
      .from("emigro_program_versions")
      .select("id, program_id, eligibility_rule")
      .in("program_id", activeProgramIds)
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    const latestByProgram = latestVersionsByProgram(versions ?? []);
    const versionIds = Array.from(latestByProgram.values()).map((version) => version.id);

    const [{ data: passportRows }, { data: requirementRows }, { data: sourceRows }] = versionIds.length
      ? await Promise.all([
          supabase
            .from("emigro_passport_eligibility")
            .select("program_version_id, status")
            .in("program_version_id", versionIds)
            .eq("passport_iso2", passportIso2),
          supabase
            .from("emigro_program_requirements")
            .select("program_version_id, requirement_type, label_ru, value_text, sort_order")
            .in("program_version_id", versionIds)
            .order("sort_order"),
          supabase
            .from("emigro_program_sources")
            .select("program_version_id, source_url, label_ru, last_verified")
            .in("program_version_id", versionIds)
            .order("last_verified", { ascending: false }),
        ])
      : [{ data: [] }, { data: [] }, { data: [] }];

    const statusByVersion = passportStatusByVersion(passportRows ?? []);
    const requirementsByVersionId = requirementsByVersion(requirementRows ?? []);
    const sourceByVersionId = sourceByVersion(sourceRows ?? []);
    const programById = new Map((programs ?? []).map((program) => [program.id, program]));

    return programIds.flatMap((programId) => {
        const program = programById.get(programId);
        const version = latestByProgram.get(programId);
        if (!program || !version) return [];
        const source = sourceByVersionId.get(version.id);
        return [{
          programId: program.id,
          programSlug: program.slug,
          programTitleRu: program.title_ru,
          programType: program.program_type,
          eligibilityRule: version.eligibility_rule,
          passportStatus: statusByVersion.get(version.id),
          requirements: requirementsByVersionId.get(version.id) ?? [],
          sourceUrl: source?.sourceUrl ?? null,
          sourceLabelRu: source?.sourceLabelRu ?? null,
        }];
      });
  });
}

export async function getGlobalEvaluationData(
  passportIso2: string
): Promise<GlobalCorridorEvaluationData[]> {
  return cached<GlobalCorridorEvaluationData[]>(`global-evaluation:${passportIso2}`, async () => {
    const supabase = createServerClient();
    const [{ data: corridors }, { data: topics }] = await Promise.all([
      supabase
        .from("emigro_corridors")
        .select("id, slug, title_ru, url_segment")
        .eq("is_published", true)
        .eq("publish_status", "active"),
      supabase
        .from("emigro_news_topics")
        .select("corridor_slug, country_ru, url_segment")
        .eq("status", "active"),
    ]);

    const corridorIds = (corridors ?? []).map((corridor) => corridor.id);
    if (!corridorIds.length) return [];

    const { data: corridorPrograms } = await supabase
      .from("emigro_corridor_programs")
      .select("corridor_id, program_id, sort_order")
      .in("corridor_id", corridorIds)
      .order("sort_order");

    const programIds = Array.from(new Set((corridorPrograms ?? []).map((row) => row.program_id)));
    if (!programIds.length) return [];

    const { data: programs } = await supabase
      .from("emigro_programs")
      .select("id, slug, title_ru, program_type")
      .in("id", programIds)
      .eq("is_active", true);

    const activeProgramIds = (programs ?? []).map((program) => program.id);
    if (!activeProgramIds.length) return [];

    const { data: versions } = await supabase
      .from("emigro_program_versions")
      .select("id, program_id, eligibility_rule")
      .in("program_id", activeProgramIds)
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    const latestByProgram = latestVersionsByProgram(versions ?? []);
    const versionIds = Array.from(latestByProgram.values()).map((version) => version.id);
    const [{ data: passportRows }, { data: requirementRows }, { data: sourceRows }] = versionIds.length
      ? await Promise.all([
          supabase
            .from("emigro_passport_eligibility")
            .select("program_version_id, status")
            .in("program_version_id", versionIds)
            .eq("passport_iso2", passportIso2),
          supabase
            .from("emigro_program_requirements")
            .select("program_version_id, requirement_type, label_ru, value_text, sort_order")
            .in("program_version_id", versionIds)
            .order("sort_order"),
          supabase
            .from("emigro_program_sources")
            .select("program_version_id, source_url, label_ru, last_verified")
            .in("program_version_id", versionIds)
            .order("last_verified", { ascending: false }),
        ])
      : [{ data: [] }, { data: [] }, { data: [] }];

    const topicByCorridor = new Map(
      (topics ?? []).map((topic) => [
        topic.corridor_slug,
        { countryRu: topic.country_ru, segment: topic.url_segment },
      ])
    );
    const programById = new Map((programs ?? []).map((program) => [program.id, program]));
    const statusByVersion = passportStatusByVersion(passportRows ?? []);
    const requirementsByVersionId = requirementsByVersion(requirementRows ?? []);
    const sourceByVersionId = sourceByVersion(sourceRows ?? []);
    const linksByCorridor = new Map<string, typeof corridorPrograms>();

    for (const link of corridorPrograms ?? []) {
      const links = linksByCorridor.get(link.corridor_id) ?? [];
      links.push(link);
      linksByCorridor.set(link.corridor_id, links);
    }

    return (corridors ?? []).map((corridor) => {
      const topic = topicByCorridor.get(corridor.slug);
      return {
        corridorId: corridor.id,
        corridorSlug: corridor.slug,
        corridorTitleRu: corridor.title_ru,
        countryRu: topic?.countryRu ?? corridor.title_ru,
        countrySegment: corridor.url_segment || topic?.segment || "",
        programs: (linksByCorridor.get(corridor.id) ?? [])
          .flatMap((link) => {
            const program = programById.get(link.program_id);
            const version = latestByProgram.get(link.program_id);
            if (!program || !version) return [];
            const source = sourceByVersionId.get(version.id);
            return [{
              programId: program.id,
              programSlug: program.slug,
              programTitleRu: program.title_ru,
              programType: program.program_type,
              eligibilityRule: version.eligibility_rule,
              passportStatus: statusByVersion.get(version.id),
              requirements: requirementsByVersionId.get(version.id) ?? [],
              sourceUrl: source?.sourceUrl ?? null,
              sourceLabelRu: source?.sourceLabelRu ?? null,
            }];
          }),
      };
    });
  });
}
