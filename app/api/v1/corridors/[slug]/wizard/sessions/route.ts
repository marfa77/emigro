import { NextResponse } from "next/server";
import { getPublishedCorridorSummaryBySlug } from "@/lib/corridor/queries";
import { createServerClient } from "@/lib/supabase/server";
import { validateWizardAnswers } from "@/lib/wizard/validate-answers";

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const corridor = await getPublishedCorridorSummaryBySlug(params.slug);
  if (!corridor) {
    return NextResponse.json({ error: "Corridor not found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const wizardId =
    typeof body === "object" && body !== null && "wizard_id" in body
      ? String((body as { wizard_id?: unknown }).wizard_id ?? "")
      : "";
  if (!wizardId) {
    return NextResponse.json({ error: "wizard_id required" }, { status: 400 });
  }

  const rawAnswers =
    typeof body === "object" && body !== null && "answers" in body
      ? (body as { answers?: unknown }).answers
      : {};
  const validated = validateWizardAnswers(rawAnswers ?? {});
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }
  const answers = validated.answers;

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("emigro_wizard_sessions")
    .insert({
      corridor_id: corridor.id,
      wizard_id: wizardId,
      answers,
      passport_iso2: String(answers.passport_iso2 ?? ""),
      locale: "ru",
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}
