import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { validateWizardAnswers } from "@/lib/wizard/validate-answers";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
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
    .from("emigro_hub_wizard_sessions")
    .insert({
      answers,
      passport_iso2: String(answers.passport_iso2 ?? ""),
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}
