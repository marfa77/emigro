import { adjustEvaluationForHousehold } from "@/lib/engine/household";
import { evaluateProgram, type EvaluationResult } from "@/lib/engine/evaluator";
import { getCorridorEvaluationProgramData } from "@/lib/engine/evaluation-data";
import { createServerClient } from "@/lib/supabase/server";

export async function evaluateCorridorPrograms(
  corridorId: string,
  facts: Record<string, unknown>,
  options?: { sessionId?: string; persist?: boolean }
): Promise<EvaluationResult[]> {
  const passportIso2 = String(facts.passport_iso2 ?? "RU");
  const programs = await getCorridorEvaluationProgramData(corridorId, passportIso2);
  const results: EvaluationResult[] = [];

  for (const program of programs) {
    const base = evaluateProgram(
      program.programId,
      program.programSlug,
      program.eligibilityRule,
      facts,
      program.passportStatus,
      program.requirements
    );
    const evaluation = adjustEvaluationForHousehold(program.programSlug, facts, base);

    results.push(evaluation);
  }

  if (options?.persist && options.sessionId && results.length) {
    const supabase = createServerClient();
    await supabase.from("emigro_eligibility_results").upsert(
      results.map((evaluation) => ({
        session_id: options.sessionId,
        program_id: evaluation.programId,
        outcome: evaluation.outcome,
        score: evaluation.score,
        reasons: evaluation.reasons,
      })),
      { onConflict: "session_id,program_id" }
    );
  }

  return results.sort((a, b) => b.score - a.score);
}
