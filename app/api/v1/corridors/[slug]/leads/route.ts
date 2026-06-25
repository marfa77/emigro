import { NextResponse } from "next/server";
import { trackServerEvent } from "@/lib/analytics/server";
import { getCorridorBySlug } from "@/lib/corridor/queries";
import { formatLeadTelegramMessage } from "@/lib/leads/format-telegram";
import { createServerClient } from "@/lib/supabase/server";
import { sendOwnerTelegramDm } from "@/lib/telegram";

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const corridor = await getCorridorBySlug(params.slug);
  if (!corridor) {
    return NextResponse.json({ error: "Corridor not found" }, { status: 404 });
  }

  const body = await request.json();
  const { name, email, telegram, notes, passport_iso2, selected_program_slugs, session_id } = body;

  if (!name || !email || !passport_iso2) {
    return NextResponse.json({ error: "name, email, passport_iso2 required" }, { status: 400 });
  }

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("emigro_manual_leads")
    .insert({
      corridor_id: corridor.id,
      session_id: session_id ?? null,
      name,
      email,
      telegram: telegram ?? null,
      notes: notes ?? null,
      passport_iso2,
      selected_program_slugs: selected_program_slugs ?? [],
      preferred_language: "ru",
      status: "new",
    })
    .select("id")
    .single();

  if (error) {
    await trackServerEvent("lead_error", { corridor_slug: params.slug, message: error.message });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await trackServerEvent("lead_submitted", {
    corridor_slug: params.slug,
    lead_id: data.id,
    session_id: session_id ?? "",
  });

  const telegramText = formatLeadTelegramMessage({
    leadId: data.id,
    corridorTitle: corridor.title_ru,
    corridorSlug: params.slug,
    name,
    email,
    telegram: telegram ?? null,
    notes: notes ?? null,
    passportIso2: passport_iso2,
    programSlugs: selected_program_slugs ?? [],
    sessionId: session_id ?? null,
  });

  const tg = await sendOwnerTelegramDm(telegramText);
  if (!tg.success) {
    console.warn("[leads] Telegram DM failed:", tg.error);
  }

  return NextResponse.json({ id: data.id, status: "new" });
}
