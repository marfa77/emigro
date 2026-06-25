import { NextResponse } from "next/server";
import { getCorridorBySlug } from "@/lib/corridor/queries";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const corridor = await getCorridorBySlug(params.slug);
  if (!corridor) {
    return NextResponse.json({ error: "Corridor not found" }, { status: 404 });
  }

  const body = await request.json();
  const wizardId = body.wizard_id as string;
  const answers = (body.answers ?? {}) as Record<string, unknown>;

  if (!wizardId) {
    return NextResponse.json({ error: "wizard_id required" }, { status: 400 });
  }

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
