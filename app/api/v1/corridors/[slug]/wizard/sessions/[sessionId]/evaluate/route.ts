import { NextResponse } from "next/server";
import { trackServerEvent } from "@/lib/analytics/server";
import { getCorridorBySlug } from "@/lib/corridor/queries";
import { createServerClient } from "@/lib/supabase/server";
import { runEvaluation } from "@/lib/engine/run-evaluation";

export async function POST(
  _request: Request,
  { params }: { params: { slug: string; sessionId: string } }
) {
  const corridor = await getCorridorBySlug(params.slug);
  if (!corridor) {
    return NextResponse.json({ error: "Corridor not found" }, { status: 404 });
  }

  const supabase = createServerClient();
  const { data: session, error } = await supabase
    .from("emigro_wizard_sessions")
    .select("*")
    .eq("id", params.sessionId)
    .single();

  if (error || !session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const results = await runEvaluation(
    session.id,
    corridor.id,
    session.answers as Record<string, unknown>
  );

  await trackServerEvent("wizard_completed", {
    corridor_slug: params.slug,
    session_id: session.id,
    programs_evaluated: results.length,
    top_outcome: results[0]?.outcome ?? "none",
  });

  return NextResponse.json({ session_id: session.id, results });
}
