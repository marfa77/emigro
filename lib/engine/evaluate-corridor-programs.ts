import { createServerClient } from "@/lib/supabase/server";
import { adjustEvaluationForHousehold } from "@/lib/engine/household";
import { evaluateProgram, type EvaluationResult } from "@/lib/engine/evaluator";

export async function evaluateCorridorPrograms(
  corridorId: string,
  facts: Record<string, unknown>,
  options?: { sessionId?: string; persist?: boolean }
): Promise<EvaluationResult[]> {
  const supabase = createServerClient();

  const { data: corridorPrograms } = await supabase
    .from("emigro_corridor_programs")
    .select("program_id")
    .eq("corridor_id", corridorId);

  const programIds = (corridorPrograms ?? []).map((r) => r.program_id);
  const { data: programs } = programIds.length
    ? await supabase.from("emigro_programs").select("id, slug").in("id", programIds).eq("is_active", true)
    : { data: [] };

  const results: EvaluationResult[] = [];
  const passportIso2 = String(facts.passport_iso2 ?? "RU");

  for (const program of programs ?? []) {
    const { data: versions } = await supabase
      .from("emigro_program_versions")
      .select("id, eligibility_rule")
      .eq("program_id", program.id)
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(1);

    const version = versions?.[0];

    if (!version) continue;

    const { data: passportRow } = await supabase
      .from("emigro_passport_eligibility")
      .select("status")
      .eq("program_version_id", version.id)
      .eq("passport_iso2", passportIso2)
      .maybeSingle();

    const base = evaluateProgram(
      program.id,
      program.slug,
      version.eligibility_rule as Record<string, unknown>,
      facts,
      passportRow?.status
    );
    const evaluation = adjustEvaluationForHousehold(program.slug, facts, base);

    results.push(evaluation);

    if (options?.persist && options.sessionId) {
      await supabase.from("emigro_eligibility_results").upsert(
        {
          session_id: options.sessionId,
          program_id: program.id,
          outcome: evaluation.outcome,
          score: evaluation.score,
          reasons: evaluation.reasons,
        },
        { onConflict: "session_id,program_id" }
      );
    }
  }

  return results.sort((a, b) => b.score - a.score);
}
