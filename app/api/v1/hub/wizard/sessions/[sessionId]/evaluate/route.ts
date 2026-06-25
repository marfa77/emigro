import { NextResponse } from "next/server";
import { trackServerEvent } from "@/lib/analytics/server";
import { runGlobalEvaluation } from "@/lib/engine/run-global-evaluation";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(
  _request: Request,
  { params }: { params: { sessionId: string } }
) {
  const supabase = createServerClient();
  const { data: session, error } = await supabase
    .from("emigro_hub_wizard_sessions")
    .select("*")
    .eq("id", params.sessionId)
    .single();

  if (error || !session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const payload = await runGlobalEvaluation(
    session.id,
    session.answers as Record<string, unknown>
  );

  await trackServerEvent(
    "hub_wizard_completed",
    {
      session_id: session.id,
      programs_evaluated: String(payload.results.length),
      matches: String(payload.results.filter((r) => r.outcome !== "unlikely").length),
      pick_country: payload.pick?.countrySegment ?? "none",
    },
    "web"
  );

  return NextResponse.json({ session_id: session.id, ...payload });
}
