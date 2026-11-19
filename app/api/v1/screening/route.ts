import { NextResponse } from "next/server";
import { SCREENING_FIELDS, cleanScreeningAnswers } from "@/lib/screening/questions";
import { saveScreeningLead } from "@/lib/screening/save";

const SCREENING_CONSENT_VERSION = "screening-2026-11-10";

function clean(value: unknown, max = 120): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/** Primary screening questionnaire → emigro_manual_leads (lead_type "screening") + owner DM. */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  // Honeypot: real people never see this field.
  if (clean(body.website)) return NextResponse.json({ ok: true });

  if (body.consent !== true) {
    return NextResponse.json({ error: "Нужно согласие на обработку данных" }, { status: 400 });
  }

  const { answers, missing } = cleanScreeningAnswers(body.answers);
  if (missing.length > 0) {
    const labels = missing
      .map((id) => SCREENING_FIELDS.find((field) => field.id === id)?.label ?? id)
      .join(", ");
    return NextResponse.json({ error: `Заполните поля: ${labels}`, missing }, { status: 400 });
  }

  const ref = clean(body.ref, 80);
  const saved = await saveScreeningLead({
    answers,
    channel: "web",
    ref,
    consentVersion: SCREENING_CONSENT_VERSION,
  });
  // The owner still gets the full answers in Telegram when storage fails; tell the person it went through.
  return NextResponse.json(saved.id ? { ok: true, stored: true, id: saved.id } : { ok: true, stored: false });
}
