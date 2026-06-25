import { NextResponse } from "next/server";
import { trackServerEvent } from "@/lib/analytics/server";
import { getCorridorBySlug, getWizardForCorridor } from "@/lib/corridor/queries";
import { createServerClient } from "@/lib/supabase/server";
import { runEvaluation } from "@/lib/engine/run-evaluation";
import { notifyWizardCompleted, buildWizardContext } from "@/lib/wizard/notify-owner";

export async function POST(
  request: Request,
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

  const wizard = await getWizardForCorridor(corridor.id);

  await trackServerEvent("wizard_completed", {
    corridor_slug: params.slug,
    wizard_mode: "corridor",
    session_id: session.id,
    programs_evaluated: String(results.length),
    top_outcome: results[0]?.outcome ?? "none",
  });

  void notifyWizardCompleted({
    mode: "corridor",
    sessionId: session.id,
    corridorSlug: params.slug,
    corridorTitleRu: corridor.title_ru,
    answers: session.answers as Record<string, unknown>,
    modules: wizard?.modules,
    corridorResults: results.slice(0, 5).map((r) => ({
      slug: r.programSlug,
      outcome: r.outcome,
    })),
    ctx: buildWizardContext(request, { corridor_slug: params.slug }),
  });

  return NextResponse.json({ session_id: session.id, results });
}
