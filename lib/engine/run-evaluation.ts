import { createServerClient } from "@/lib/supabase/server";
import { mergeHouseholdFacts } from "@/lib/engine/household";
import {
  evaluateProgram,
  normalizeFacts,
  type EvaluationResult,
} from "@/lib/engine/evaluator";
import { evaluateCorridorPrograms } from "@/lib/engine/evaluate-corridor-programs";

export async function runEvaluation(
  sessionId: string,
  corridorId: string,
  answers: Record<string, unknown>
): Promise<EvaluationResult[]> {
  const supabase = createServerClient();
  const facts = normalizeFacts(mergeHouseholdFacts(answers));

  const results = await evaluateCorridorPrograms(corridorId, facts, {
    sessionId,
    persist: true,
  });

  await supabase
    .from("emigro_wizard_sessions")
    .update({
      answers: facts,
      passport_iso2: String(facts.passport_iso2 ?? ""),
      completed_at: new Date().toISOString(),
    })
    .eq("id", sessionId);

  return results;
}

export { evaluateProgram, normalizeFacts, type EvaluationResult };
