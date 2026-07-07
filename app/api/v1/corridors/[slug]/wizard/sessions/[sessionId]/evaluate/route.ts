import { NextResponse } from "next/server";
import { trackServerEvent } from "@/lib/analytics/server";
import { getPublishedCorridorSummaryBySlug } from "@/lib/corridor/queries";
import { createServerClient } from "@/lib/supabase/server";
import { runEvaluation } from "@/lib/engine/run-evaluation";

export async function POST(
  request: Request,
  { params }: { params: { slug: string; sessionId: string } }
) {
  const supabase = createServerClient();
  const [corridor, { data: session, error }] = await Promise.all([
    getPublishedCorridorSummaryBySlug(params.slug),
    supabase
      .from("emigro_wizard_sessions")
      .select("id, answers")
      .eq("id", params.sessionId)
      .single(),
  ]);

  if (!corridor) {
    return NextResponse.json({ error: "Corridor not found" }, { status: 404 });
  }

  if (error || !session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const results = await runEvaluation(
    session.id,
    corridor.id,
    session.answers as Record<string, unknown>
  );

  void trackServerEvent("wizard_completed", {
    corridor_slug: params.slug,
    wizard_mode: "corridor",
    session_id: session.id,
    programs_evaluated: String(results.length),
    top_outcome: results[0]?.outcome ?? "none",
  });

  return NextResponse.json({ session_id: session.id, results });
}
