import { NextResponse } from "next/server";
import { trackServerEvent } from "@/lib/analytics/server";
import { runGlobalEvaluation } from "@/lib/engine/run-global-evaluation";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  const supabase = createServerClient();
  const { data: session, error } = await supabase
    .from("emigro_hub_wizard_sessions")
    .select("id, answers")
    .eq("id", params.sessionId)
    .single();

  if (error || !session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const payload = await runGlobalEvaluation(
    session.id,
    session.answers as Record<string, unknown>
  );

  void trackServerEvent(
    "wizard_completed",
    {
      session_id: session.id,
      corridor_slug: "hub",
      wizard_mode: "hub",
      programs_evaluated: String(payload.results.length),
      matches: String(payload.results.filter((r) => r.outcome !== "unlikely").length),
      pick_country: payload.pick?.countrySegment ?? "none",
      pick_program: payload.pick?.programTitleRu ?? "none",
    },
    "web"
  );

  return NextResponse.json({ session_id: session.id, ...payload });
}
