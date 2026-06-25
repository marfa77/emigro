import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json();
  const answers = (body.answers ?? {}) as Record<string, unknown>;

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
