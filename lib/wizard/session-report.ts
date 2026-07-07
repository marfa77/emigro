import { getWizardForCorridor } from "@/lib/corridor/queries";
import type { GlobalEvalPayload } from "@/lib/engine/run-global-evaluation";
import { createServerClient } from "@/lib/supabase/server";
import type { WizardModule } from "@/lib/types";
import type { WizardTelegramMode } from "@/lib/telegram/deep-link";

export type LoadedWizardSessionReport = {
  mode: WizardTelegramMode;
  sessionId: string;
  corridorSlug?: string;
  corridorTitleRu?: string;
  answers: Record<string, unknown>;
  payload?: GlobalEvalPayload;
  modules?: WizardModule[];
  corridorResults?: Array<{ slug: string; outcome: string; title?: string }>;
};

export async function loadWizardSessionReport(sessionId: string): Promise<LoadedWizardSessionReport | null> {
  const supabase = createServerClient();

  const { data: hubSession } = await supabase
    .from("emigro_hub_wizard_sessions")
    .select("id, answers, results")
    .eq("id", sessionId)
    .maybeSingle();

  if (hubSession?.results) {
    return {
      mode: "hub",
      sessionId: hubSession.id,
      answers: (hubSession.answers ?? {}) as Record<string, unknown>,
      payload: hubSession.results as GlobalEvalPayload,
    };
  }

  const { data: corridorSession } = await supabase
    .from("emigro_wizard_sessions")
    .select("id, answers, corridor_id, emigro_corridors(slug, title_ru)")
    .eq("id", sessionId)
    .maybeSingle();

  if (!corridorSession) return null;

  const corridorRaw = corridorSession.emigro_corridors;
  const corridor = (Array.isArray(corridorRaw) ? corridorRaw[0] : corridorRaw) as
    | { slug: string; title_ru: string }
    | null
    | undefined;
  if (!corridor) return null;

  const { data: results } = await supabase
    .from("emigro_eligibility_results")
    .select("outcome, score, emigro_programs(slug, title_ru)")
    .eq("session_id", sessionId)
    .order("score", { ascending: false })
    .limit(5);

  const wizard = await getWizardForCorridor(corridorSession.corridor_id);

  return {
    mode: "corridor",
    sessionId: corridorSession.id,
    corridorSlug: corridor.slug,
    corridorTitleRu: corridor.title_ru,
    answers: (corridorSession.answers ?? {}) as Record<string, unknown>,
    modules: wizard?.modules,
    corridorResults: (results ?? []).map((row) => {
      const programRaw = row.emigro_programs;
      const program = (Array.isArray(programRaw) ? programRaw[0] : programRaw) as
        | { slug: string; title_ru: string }
        | null
        | undefined;
      return {
        slug: program?.slug ?? "unknown",
        outcome: row.outcome,
        title: program?.title_ru,
      };
    }),
  };
}
