import type { GlobalEvalPayload } from "@/lib/engine/run-global-evaluation";
import { createServerClient } from "@/lib/supabase/server";

export async function getHubWizardSession(sessionId: string): Promise<{
  id: string;
  passport_iso2: string | null;
  payload: GlobalEvalPayload | null;
} | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("emigro_hub_wizard_sessions")
    .select("id, passport_iso2, results")
    .eq("id", sessionId)
    .maybeSingle();

  if (error || !data) return null;

  const raw = data.results as GlobalEvalPayload | null;
  return {
    id: data.id,
    passport_iso2: data.passport_iso2,
    payload: raw,
  };
}
