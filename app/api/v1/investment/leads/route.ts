import { NextResponse } from "next/server";
import {
  INVESTMENT_ROUTES,
  normalizeInvestmentPassport,
  qualifyInvestmentRoutes,
  type InvestmentAsset,
  type InvestmentOutcome,
} from "@/lib/investment/registry";
import { createAdminClient } from "@/lib/admin/supabase";
import { sendOwnerTelegramDm } from "@/lib/telegram";
import { signInvestmentResultToken } from "@/lib/investment/result-token";
import { trackServerEvent } from "@/lib/analytics/server";

export const runtime = "nodejs";

type QualifierAsset = InvestmentAsset | "any";
type QualifierOutcome = InvestmentOutcome | "any";

const ASSETS = new Set<QualifierAsset>([
  "any",
  "property",
  "fund",
  "business",
  "bonds",
  "donation",
  "membership",
]);
const OUTCOMES = new Set<QualifierOutcome>([
  "any",
  "residence",
  "permanent_residence",
  "citizenship_path",
]);
const ALLOWED_FIELDS = new Set([
  "name",
  "contact",
  "budget_eur",
  "passport_citizenship",
  "asset",
  "outcome",
  "preferred_country",
  "timeline",
  "family_size",
  "funding_readiness",
  "property_stage",
  "source_of_funds",
  "session_id",
  "referrer",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "consent",
]);
const recent = new Map<string, number>();
const THROTTLE_MS = 120_000;
const CONSENT_VERSION = "investment-v2";
const PROPERTY_STAGES = new Set(["researching", "selected", "reserved", "owned"]);
const FUND_SOURCES = new Set(["salary", "business", "asset_sale", "savings", "other"]);

type InvestmentLeadBody = {
  name?: unknown;
  contact?: unknown;
  budget_eur?: unknown;
  passport_citizenship?: unknown;
  asset?: unknown;
  outcome?: unknown;
  preferred_country?: unknown;
  timeline?: unknown;
  family_size?: unknown;
  funding_readiness?: unknown;
  property_stage?: unknown;
  source_of_funds?: unknown;
  session_id?: unknown;
  referrer?: unknown;
  utm_source?: unknown;
  utm_medium?: unknown;
  utm_campaign?: unknown;
  utm_content?: unknown;
  consent?: unknown;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function strictString(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value.trim();
  if (!cleaned || cleaned.length > max) return null;
  return cleaned;
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function isValidContact(contact: string): boolean {
  return (
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) ||
    /^https:\/\/t\.me\/[A-Za-z0-9_]{5,32}\/?$/.test(contact) ||
    /^@[A-Za-z0-9_]{5,32}$/.test(contact) ||
    /^\+?[0-9][0-9 ()-]{6,24}$/.test(contact)
  );
}

function safeMatch(route: ReturnType<typeof qualifyInvestmentRoutes>[number]) {
  return {
    destination: route.country,
    destination_iso2: route.destinationIso2,
    title: route.title,
    program_slug: route.programSlug ?? null,
    match: route.match,
    reason: route.reason,
  };
}

function formatOwnerMessage(input: {
  leadId: string;
  name: string;
  contact: string;
  budgetEur: number;
  asset: QualifierAsset;
  outcome: QualifierOutcome;
  destination: string;
  selectedProgram: string | null;
  providerId: string | null;
  message: string | null;
}) {
  return [
    "💼 Emigro — инвестиционная заявка",
    "",
    `ID: ${input.leadId}`,
    `Направление: ${input.destination}`,
    `Бюджет: €${input.budgetEur.toLocaleString("en-US")}`,
    `Актив: ${input.asset}`,
    `Цель: ${input.outcome}`,
    input.selectedProgram ? `Программа: ${input.selectedProgram}` : null,
    input.providerId ? `Партнёр: ${input.providerId} (атрибуция 90 дней)` : null,
    "",
    `Имя: ${input.name}`,
    `Контакт: ${input.contact}`,
    input.message ? `Комментарий:\n${input.message}` : null,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
}

export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isPlainObject(raw)) {
    return NextResponse.json({ error: "Payload must be an object" }, { status: 400 });
  }
  const unknownFields = Object.keys(raw).filter((key) => !ALLOWED_FIELDS.has(key));
  if (unknownFields.length) {
    return NextResponse.json(
      { error: "Unknown fields", fields: unknownFields.sort() },
      { status: 400 }
    );
  }

  const body = raw as InvestmentLeadBody;
  const name = strictString(body.name, 120);
  const contact = strictString(body.contact, 200);
  const passportCitizenship = strictString(body.passport_citizenship, 100);
  const timeline = strictString(body.timeline, 32);
  const fundingReadiness = strictString(body.funding_readiness, 32);
  const budgetEur = body.budget_eur;
  const familySize = body.family_size;
  const asset = body.asset;
  const outcome = body.outcome;
  const preferredCountry = strictString(body.preferred_country, 32);

  if (
    !name ||
    !contact ||
    !passportCitizenship ||
    !timeline ||
    !fundingReadiness ||
    typeof budgetEur !== "number" ||
    !Number.isSafeInteger(budgetEur) ||
    budgetEur < 10_000 ||
    budgetEur > 1_000_000_000 ||
    typeof familySize !== "number" ||
    !Number.isSafeInteger(familySize) ||
    familySize < 1 ||
    familySize > 20 ||
    typeof asset !== "string" ||
    !ASSETS.has(asset as QualifierAsset) ||
    typeof outcome !== "string" ||
    !OUTCOMES.has(outcome as QualifierOutcome) ||
    !preferredCountry ||
    (preferredCountry !== "any" &&
      !INVESTMENT_ROUTES.some((route) => route.country === preferredCountry)) ||
    body.consent !== true ||
    !["0_3_months", "3_6_months", "6_12_months", "12_plus_months", "researching"].includes(
      timeline
    ) ||
    !["ready", "partial", "planning"].includes(fundingReadiness) ||
    (asset === "property" &&
      (typeof body.property_stage !== "string" || !PROPERTY_STAGES.has(body.property_stage))) ||
    (typeof body.source_of_funds === "string" && !FUND_SOURCES.has(body.source_of_funds))
  ) {
    return NextResponse.json({ error: "Invalid investment lead payload" }, { status: 400 });
  }
  if (!isValidContact(contact)) {
    return NextResponse.json({ error: "Invalid contact" }, { status: 400 });
  }

  const evaluatedRoutes = qualifyInvestmentRoutes({
    budgetEur,
    asset: asset as QualifierAsset,
    outcome: outcome as QualifierOutcome,
    passportIso2: normalizeInvestmentPassport(passportCitizenship),
  });
  const matches =
    preferredCountry === "any"
      ? evaluatedRoutes
      : [...evaluatedRoutes].sort((a, b) =>
          a.country === preferredCountry ? -1 : b.country === preferredCountry ? 1 : 0
        );
  const selectedRoute =
    matches.find((route) => route.match === "likely" || route.match === "review") ?? matches[0];
  if (!selectedRoute) {
    return NextResponse.json({ error: "No investment routes available" }, { status: 500 });
  }

  const ip = clientIp(request);
  const throttleKey = `${ip}:${contact.toLowerCase()}`;
  const nowMs = Date.now();
  const last = recent.get(throttleKey) ?? 0;
  if (nowMs - last < THROTTLE_MS) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(Math.ceil((THROTTLE_MS - (nowMs - last)) / 1000)) } }
    );
  }
  recent.set(throttleKey, nowMs);
  if (recent.size > 5000) {
    for (const [key, timestamp] of Array.from(recent.entries())) {
      if (nowMs - timestamp > THROTTLE_MS * 5) recent.delete(key);
    }
  }

  const consentAt = new Date().toISOString();
  const selectedProgram = selectedRoute.programSlug ?? null;
  const sessionId = strictString(body.session_id, 128);
  const safeMatches = matches.map(safeMatch);
  const leadPacket = {
    schema_version: 2,
    budget_eur: budgetEur,
    passport_citizenship: passportCitizenship,
    passport_iso2: normalizeInvestmentPassport(passportCitizenship),
    asset,
    outcome,
    timeline,
    family_size: familySize,
    funding_readiness: fundingReadiness,
    property_stage: typeof body.property_stage === "string" ? body.property_stage : null,
    source_of_funds: typeof body.source_of_funds === "string" ? body.source_of_funds : null,
    preferred_country: preferredCountry,
    selected_match: safeMatch(selectedRoute),
    route_matches: safeMatches,
    attribution: {
      referrer: strictString(body.referrer, 512),
      utm_source: strictString(body.utm_source, 128),
      utm_medium: strictString(body.utm_medium, 128),
      utm_campaign: strictString(body.utm_campaign, 128),
      utm_content: strictString(body.utm_content, 128),
    },
    partner_policy: "unassigned_until_manual_contact_share",
  };

  const supabase = createAdminClient();
  const { data: corridor } = selectedRoute.corridorSlug
    ? await supabase
        .from("emigro_corridors")
        .select("id")
        .eq("slug", selectedRoute.corridorSlug)
        .maybeSingle()
    : { data: null };
  const { data: lead, error: leadError } = await supabase
    .from("emigro_manual_leads")
    .insert({
      corridor_id: corridor?.id ?? null,
      session_id: sessionId,
      name,
      email: contact,
      telegram: contact.startsWith("@") || contact.startsWith("https://t.me/") ? contact : null,
      passport_iso2: normalizeInvestmentPassport(passportCitizenship),
      preferred_language: "ru",
      selected_program_slugs: selectedProgram ? [selectedProgram] : [],
      notes: null,
      status: "new",
      lead_type: "investment",
      source: "investment_pipeline",
      destination_iso2: selectedRoute.destinationIso2,
      selected_provider_ids: [],
      lead_packet: leadPacket,
      consent_at: consentAt,
      consent_version: CONSENT_VERSION,
      attribution_expires_at: null,
    })
    .select("id")
    .single();

  if (leadError || !lead) {
    console.error("[investment-leads] lead insert failed:", leadError?.message);
    return NextResponse.json({ error: "Lead storage failed" }, { status: 500 });
  }

  const { error: baseEventError } = await supabase.from("emigro_lead_handoff_events").insert([
    {
      lead_id: lead.id,
      assignment_id: null,
      event_type: "lead_created",
      actor_type: "system",
      payload: { source: "investment_pipeline", destination_iso2: selectedRoute.destinationIso2 },
    },
    {
      lead_id: lead.id,
      assignment_id: null,
      event_type: "consent_confirmed",
      actor_type: "applicant",
      payload: { consent_version: CONSENT_VERSION, consent_at: consentAt },
    },
  ]);
  if (baseEventError) {
    await supabase.from("emigro_manual_leads").delete().eq("id", lead.id);
    console.error("[investment-leads] base audit insert failed:", baseEventError.message);
    return NextResponse.json({ error: "Lead audit failed" }, { status: 500 });
  }

  const telegramText = formatOwnerMessage({
    leadId: lead.id,
    name,
    contact,
    budgetEur,
    asset: asset as QualifierAsset,
    outcome: outcome as QualifierOutcome,
    destination: selectedRoute.countryRu,
    selectedProgram,
    providerId: null,
    message: null,
  });
  const telegram = await sendOwnerTelegramDm(telegramText);
  if (!telegram.success) {
    console.warn("[investment-leads] Telegram DM failed:", telegram.error);
  }

  await trackServerEvent("investment_lead_submitted", {
    lead_id: lead.id,
    destination: selectedRoute.country,
    match: selectedRoute.match,
  });

  return NextResponse.json(
    {
      id: lead.id,
      token: signInvestmentResultToken(lead.id),
      status: "new",
      selected_match: safeMatch(selectedRoute),
      matches: safeMatches,
    },
    { status: 201 }
  );
}
