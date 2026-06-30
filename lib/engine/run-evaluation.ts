import { createServerClient } from "@/lib/supabase/server";
import {
  evaluateProgram,
  normalizeFacts,
  type EvaluationResult,
} from "@/lib/engine/evaluator";
import {
  evaluateCorridorPrograms,
  persistEvaluationResults,
} from "@/lib/engine/evaluate-corridor-programs";
import { expandHubFacts } from "@/lib/wizard/expand-facts";

export async function runEvaluation(
  sessionId: string,
  corridorId: string,
  answers: Record<string, unknown>
): Promise<EvaluationResult[]> {
  const supabase = createServerClient();
  const facts = expandHubFacts(answers);

  const results = await evaluateCorridorPrograms(corridorId, facts);

  await Promise.all([
    persistEvaluationResults(sessionId, results),
    supabase
      .from("emigro_wizard_sessions")
      .update({
        answers: facts,
        passport_iso2: String(facts.passport_iso2 ?? ""),
        completed_at: new Date().toISOString(),
      })
      .eq("id", sessionId),
  ]);

  return results;
}

export { evaluateProgram, normalizeFacts, type EvaluationResult };
