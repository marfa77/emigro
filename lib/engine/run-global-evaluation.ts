import { createServerClient } from "@/lib/supabase/server";
import { corridorSlugToSegment, programPath } from "@/lib/corridor/paths";
import { getGlobalEvaluationData } from "@/lib/engine/evaluation-data";
import { adjustEvaluationForHousehold } from "@/lib/engine/household";
import { describeHousehold, parseHousehold, type HouseholdSummary } from "@/lib/engine/household";
import { evaluateProgram } from "@/lib/engine/evaluator";
import type { OutcomeCode } from "@/lib/engine/evaluator";
import { expandHubFacts } from "@/lib/wizard/expand-facts";
import { INVESTOR_PROGRAM_SLUGS } from "@/lib/engine/constants";

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
  sourceUrl?: string | null;
  sourceLabelRu?: string | null;
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
  hasRemoteIncome?: boolean;
};

export async function runGlobalEvaluation(
  sessionId: string,
  answers: Record<string, unknown>
): Promise<GlobalEvalPayload> {
  const supabase = createServerClient();
  const facts = expandHubFacts(answers);
  const passportIso2 = String(facts.passport_iso2 ?? "RU");
  const corridors = await getGlobalEvaluationData(passportIso2);

  const allResults: GlobalEvalResult[] = [];

  for (const corridor of corridors) {
    const segment =
      corridor.countrySegment || corridorSlugToSegment(corridor.corridorSlug) || "";

    for (const program of corridor.programs) {
      const base = evaluateProgram(
        program.programId,
        program.programSlug,
        program.eligibilityRule,
        facts,
        program.passportStatus,
        program.requirements
      );
      const row = adjustEvaluationForHousehold(program.programSlug, facts, base);
      allResults.push({
        ...row,
        programTitleRu: program.programTitleRu,
        programType: program.programType,
        corridorId: corridor.corridorId,
        corridorSlug: corridor.corridorSlug,
        countryRu: corridor.countryRu,
        countrySegment: segment,
        programPath: segment
          ? `/ru/${segment}/programs/${program.programSlug}`
          : programPath(corridor.corridorSlug, program.programSlug),
        sourceUrl: program.sourceUrl ?? null,
        sourceLabelRu: program.sourceLabelRu ?? null,
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
  const hasRemoteIncome = facts.remote_income === "yes";

  await supabase
    .from("emigro_hub_wizard_sessions")
    .update({
      answers: facts,
      passport_iso2: String(facts.passport_iso2 ?? ""),
      results: { results: allResults, pick, byCountry, household, hasRemoteIncome },
      completed_at: new Date().toISOString(),
    })
    .eq("id", sessionId);

  return { results: allResults, pick, byCountry, household, hasRemoteIncome };
}

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
  const studyTypes = new Set(["STUDY"]);
  const invest = Number(facts.willing_to_invest_eur ?? 0);
  const wantsStudy = facts.wants_study_route === "yes";

  const scored = pool.map((m) => {
    let bonus = 0;
    if (goal === "fast" && laborTypes.has(m.programType)) bonus += 0.05;
    if (goal === "citizenship" && m.countrySegment === "portugal") bonus += 0.03;
    if (goal === "residency" && capitalTypes.has(m.programType) && invest >= 250_000) bonus += 0.02;
    if ((goal === "study" || wantsStudy) && studyTypes.has(m.programType)) bonus += 0.08;
    if (invest >= 250_000 && INVESTOR_PROGRAM_SLUGS.has(m.programSlug)) bonus += 0.08;
    return { m, total: m.score + bonus };
  });

  scored.sort((a, b) => b.total - a.total);
  return scored[0].m;
}
