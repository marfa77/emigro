import { createServerClient } from "@/lib/supabase/server";
import { corridorSlugToSegment, programPath } from "@/lib/corridor/paths";
import { evaluateCorridorPrograms } from "@/lib/engine/evaluate-corridor-programs";
import { describeHousehold, parseHousehold, type HouseholdSummary } from "@/lib/engine/household";
import type { OutcomeCode } from "@/lib/engine/evaluator";
import { expandHubFacts } from "@/lib/wizard/expand-facts";

export type GlobalEvalResult = {
  programId: string;
  programSlug: string;
  programTitleRu: string;
  programType: string;
  corridorId: string;
  corridorSlug: string;
  countryRu: string;
  countrySegment: string;
  programPath: string;
  outcome: OutcomeCode;
  score: number;
  reasons: string[];
};

export type GlobalEvalPayload = {
  results: GlobalEvalResult[];
  pick: GlobalEvalResult | null;
  byCountry: Array<{
    countryRu: string;
    countrySegment: string;
    corridorSlug: string;
    landingPath: string;
    matches: GlobalEvalResult[];
  }>;
  household?: HouseholdSummary;
};

export async function runGlobalEvaluation(
  sessionId: string,
  answers: Record<string, unknown>
): Promise<GlobalEvalPayload> {
  const supabase = createServerClient();
  const facts = expandHubFacts(answers);

  const { data: corridors } = await supabase
    .from("emigro_corridors")
    .select("id, slug, title_ru, url_segment, publish_status")
    .eq("is_published", true)
    .eq("publish_status", "active");

  const { data: topics } = await supabase
    .from("emigro_news_topics")
    .select("corridor_slug, country_ru, url_segment")
    .eq("status", "active");

  const topicByCorridor = new Map(
    (topics ?? []).map((t) => [t.corridor_slug, { countryRu: t.country_ru, segment: t.url_segment }])
  );

  const allResults: GlobalEvalResult[] = [];

  for (const corridor of corridors ?? []) {
    const evals = await evaluateCorridorPrograms(corridor.id, facts);
    const programIds = evals.map((e) => e.programId);
    const { data: programRows } = programIds.length
      ? await supabase
          .from("emigro_programs")
          .select("id, slug, title_ru, program_type")
          .in("id", programIds)
      : { data: [] };

    const programMap = new Map((programRows ?? []).map((p) => [p.id, p]));
    const meta = topicByCorridor.get(corridor.slug);
    const segment = corridor.url_segment || meta?.segment || corridorSlugToSegment(corridor.slug) || "";

    for (const row of evals) {
      const program = programMap.get(row.programId);
      if (!program) continue;
      allResults.push({
        ...row,
        programTitleRu: program.title_ru,
        programType: program.program_type,
        corridorId: corridor.id,
        corridorSlug: corridor.slug,
        countryRu: meta?.countryRu ?? corridor.title_ru,
        countrySegment: segment,
        programPath: segment ? `/ru/${segment}/programs/${program.slug}` : programPath(corridor.slug, program.slug),
      });
    }
  }

  allResults.sort((a, b) => b.score - a.score);

  const matches = allResults.filter((r) => r.outcome !== "unlikely");
  const pick = pickRecommendation(matches, String(answers.relocation_goal ?? ""), facts);

  const byCountryMap = new Map<string, GlobalEvalResult[]>();
  for (const row of matches) {
    const key = row.corridorSlug;
    if (!byCountryMap.has(key)) byCountryMap.set(key, []);
    byCountryMap.get(key)!.push(row);
  }

  const byCountry = Array.from(byCountryMap.entries()).map(([corridorSlug, rows]) => {
    const first = rows[0];
    return {
      countryRu: first.countryRu,
      countrySegment: first.countrySegment,
      corridorSlug,
      landingPath: first.countrySegment ? `/ru/${first.countrySegment}` : "/ru",
      matches: rows.sort((a: GlobalEvalResult, b: GlobalEvalResult) => b.score - a.score),
    };
  });

  byCountry.sort((a, b) => {
    const aBest = a.matches[0]?.score ?? 0;
    const bBest = b.matches[0]?.score ?? 0;
    return bBest - aBest;
  });

  const household = describeHousehold(parseHousehold(facts));

  await supabase
    .from("emigro_hub_wizard_sessions")
    .update({
      answers: facts,
      passport_iso2: String(facts.passport_iso2 ?? ""),
      results: { results: allResults, pick, byCountry, household },
      completed_at: new Date().toISOString(),
    })
    .eq("id", sessionId);

  return { results: allResults, pick, byCountry, household };
}

const INVESTOR_PROGRAM_SLUGS = new Set([
  "portugal-golden-visa",
  "spain-residence-by-investment",
  "italy-investor-visa",
]);

function pickRecommendation(
  matches: GlobalEvalResult[],
  goal: string,
  facts: Record<string, unknown>
): GlobalEvalResult | null {
  if (matches.length === 0) return null;

  const likely = matches.filter((m) => m.outcome === "likely_eligible");
  const pool = likely.length > 0 ? likely : matches.filter((m) => m.outcome === "needs_review");
  if (pool.length === 0) return null;

  const laborTypes = new Set(["LABOR"]);
  const capitalTypes = new Set(["CAPITAL"]);
  const invest = Number(facts.willing_to_invest_eur ?? 0);

  const scored = pool.map((m) => {
    let bonus = 0;
    if (goal === "fast" && laborTypes.has(m.programType)) bonus += 0.05;
    if (goal === "citizenship" && m.countrySegment === "portugal") bonus += 0.03;
    if (goal === "residency" && capitalTypes.has(m.programType) && invest >= 250_000) bonus += 0.02;
    if (invest >= 250_000 && INVESTOR_PROGRAM_SLUGS.has(m.programSlug)) bonus += 0.08;
    return { m, total: m.score + bonus };
  });

  scored.sort((a, b) => b.total - a.total);
  return scored[0].m;
}
