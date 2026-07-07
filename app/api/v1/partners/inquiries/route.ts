import { NextResponse } from "next/server";
import { trackServerEvent } from "@/lib/analytics/server";
import { createServerClient } from "@/lib/supabase/server";
import { sendOwnerTelegramDm } from "@/lib/telegram";

type PartnerInquiryBody = {
  company_name?: string;
  contact_name?: string;
  email?: string;
  telegram?: string;
  website?: string;
  countries?: string;
  services?: string;
  message?: string;
  corridor_slug?: string;
  topic_key?: string;
  placement?: string;
};

function clip(value: string | undefined, max: number): string | null {
  const clean = value?.trim();
  return clean ? clean.slice(0, max) : null;
}

export async function POST(request: Request) {
  let body: PartnerInquiryBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const companyName = body.company_name?.trim();
  const contactName = body.contact_name?.trim();
  const email = body.email?.trim();
  const services = body.services?.trim();
  const countries = body.countries?.trim();

  if (!companyName || !contactName || !email || !services || !countries) {
    return NextResponse.json(
      { error: "company_name, contact_name, email, countries, services required" },
      { status: 400 }
    );
  }

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("emigro_partner_inquiries")
    .insert({
      company_name: companyName.slice(0, 200),
      contact_name: contactName.slice(0, 120),
      email: email.slice(0, 200),
      telegram: clip(body.telegram, 120),
      website: clip(body.website, 300),
      countries: countries.slice(0, 300),
      services: services.slice(0, 300),
      message: clip(body.message, 2000),
      corridor_slug: clip(body.corridor_slug, 120),
      topic_key: clip(body.topic_key, 64),
      placement: clip(body.placement, 64),
    })
    .select("id")
    .single();

  if (error) {
    await trackServerEvent("lead_error", { message: error.message, source: "partner_inquiry" });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await trackServerEvent("partner_inquiry_submitted", {
    inquiry_id: data.id,
    placement: body.placement ?? "",
    corridor_slug: body.corridor_slug ?? "",
    topic_key: body.topic_key ?? "",
    company_name: companyName,
  });

  const lines = [
    "🤝 Emigro — заявка на партнёрство",
    "",
    `Компания: ${companyName}`,
    `Контакт: ${contactName}`,
    `Email: ${email}`,
    body.telegram ? `Telegram: ${body.telegram}` : null,
    body.website ? `Сайт: ${body.website}` : null,
    `Страны: ${countries}`,
    `Услуги: ${services}`,
    body.message ? `Комментарий: ${body.message}` : null,
    body.corridor_slug || body.topic_key
      ? `Контекст: ${[body.topic_key, body.corridor_slug, body.placement].filter(Boolean).join(" · ")}`
      : null,
    "",
    `ID: ${data.id}`,
  ].filter(Boolean);

  const tg = await sendOwnerTelegramDm(lines.join("\n"));
  if (!tg.success) {
    console.warn("[partner-inquiry] Telegram DM failed:", tg.error);
  }

  return NextResponse.json({ id: data.id, ok: true });
}
