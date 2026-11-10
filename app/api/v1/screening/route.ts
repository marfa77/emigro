import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/admin/supabase";
import { trackServerEvent } from "@/lib/analytics/server";
import { publicSiteUrl } from "@/lib/site-url";
import { sendOwnerTelegramDm } from "@/lib/telegram";
import { looksLikeTelegramPublicContact } from "@/lib/telegram/public-url";
import {
  SCREENING_FIELDS,
  SCREENING_SCHEMA_VERSION,
  cleanScreeningAnswers,
} from "@/lib/screening/questions";

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
  const consentAt = new Date().toISOString();
  const contact = answers.contact;

  let leadId: string | null = null;
  let storageError = "";
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("emigro_manual_leads")
      .insert({
        lead_type: "screening",
        source: ref ? `screening:${ref}` : "screening",
        status: "new",
        name: answers.name,
        email: contact,
        telegram: looksLikeTelegramPublicContact(contact) ? contact : null,
        preferred_language: "ru",
        notes: answers.main_question,
        lead_packet: { schema_version: SCREENING_SCHEMA_VERSION, ref: ref || null, answers },
        consent_at: consentAt,
        consent_version: SCREENING_CONSENT_VERSION,
      })
      .select("id")
      .single();
    if (error) storageError = error.message;
    else leadId = data.id as string;
  } catch (err) {
    storageError = err instanceof Error ? err.message : "storage failed";
  }

  await trackServerEvent("screening_submitted", {
    lead_id: leadId ?? "",
    stored: Boolean(leadId),
    ref,
    consultation: answers.consultation ?? "",
  });

  const lines = [
    "📋 Анкета для скрининга",
    `${answers.name} · ${contact}${answers.phone ? ` · ${answers.phone}` : ""}`,
    `Гражданство: ${answers.citizenship} · живёт: ${answers.residence_country} (${answers.residence_status})`,
    `Куда: ${answers.destination} · цель: ${answers.goal} · срок: ${answers.timeline}`,
    `Семья: ${answers.household}${answers.children ? ` · дети: ${answers.children}` : ""}`,
    `Доход: ${answers.income_monthly} (${answers.income_source}) · сбережения: ${answers.savings} · документы: ${answers.income_proof}`,
    `Отказы: ${answers.refusals} · судимость: ${answers.criminal_record}`,
    `Помощь: ${answers.consultation}${answers.budget ? ` · бюджет: ${answers.budget}` : ""}`,
    `Вопрос: ${answers.main_question}`,
    ref ? `Метка ссылки: ${ref}` : "",
    leadId ? `${publicSiteUrl()}/admin/screening#${leadId}` : `⚠ Не сохранилось в базе: ${storageError}`,
  ].filter(Boolean);
  await sendOwnerTelegramDm(lines.join("\n"));

  if (!leadId) {
    // The owner still got the full answers in Telegram; tell the person it went through.
    return NextResponse.json({ ok: true, stored: false });
  }
  return NextResponse.json({ ok: true, stored: true, id: leadId });
}
