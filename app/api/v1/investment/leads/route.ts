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
import { signInvestmentResultToken, verifyInvestmentResultToken } from "@/lib/investment/result-token";
import { trackServerEvent } from "@/lib/analytics/server";
import { goldenVisaRow } from "@/lib/investment/golden-visa-2026";
import { signInvestPdfUrl } from "@/lib/investment/pdf-link";
import {
  isQuickLeadSource,
  quickBudgetFloorEur,
  quickPassportGroup,
  validateQuickLead,
} from "@/lib/investment/quick-lead";

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
  "capital_goal",
  "lockup_tolerance",
  "donation_tolerance",
  "sof_complexity",
  "tax_residence",
  "uae_property_type",
  "uae_goal",
  "uae_budget_band",
  "uae_financing",
  "uae_offer_received",
  "session_id",
  "referrer",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "consent",
  "source",
  "country",
  "locale",
  "page_url",
  "passport_other",
  "website",
  "lead_id",
  "lead_token",
]);
const recent = new Map<string, number>();
const THROTTLE_MS = 120_000;
const CONSENT_VERSION = "investment-v3";
const PROPERTY_STAGES = new Set(["researching", "selected", "reserved", "owned"]);
const FUND_SOURCES = new Set([
  "salary",
  "business",
  "asset_sale",
  "savings",
  "investments",
  "inheritance",
  "mixed",
  "other",
]);
const CAPITAL_GOALS = new Set(["preserve", "income", "status", "mix"]);
const LOCKUP = new Set(["0_1y", "1_3y", "3_5y", "5_plus", "none"]);
const DONATION = new Set(["yes", "no", "unsure"]);
const SOF_COMPLEXITY = new Set(["simple", "standard", "complex"]);
const TAX_RESIDENCE = new Set(["RU", "UAE", "EU", "other", "unsure"]);
const UAE_PROPERTY_TYPES = new Set(["ready", "off_plan", "unsure"]);
const UAE_GOALS = new Set(["golden", "property_2y", "invest_only", "living", "mix"]);
const UAE_BUDGET = new Set(["under_1m", "1_2m", "2m_plus", "5m_plus"]);
const UAE_FINANCING = new Set(["cash", "mortgage", "mixed", "unsure"]);
const UAE_OFFER = new Set(["yes", "no"]);

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
  capital_goal?: unknown;
  lockup_tolerance?: unknown;
  donation_tolerance?: unknown;
  sof_complexity?: unknown;
  tax_residence?: unknown;
  uae_property_type?: unknown;
  uae_goal?: unknown;
  uae_budget_band?: unknown;
  uae_financing?: unknown;
  uae_offer_received?: unknown;
  session_id?: unknown;
  referrer?: unknown;
  utm_source?: unknown;
  utm_medium?: unknown;
  utm_campaign?: unknown;
  utm_content?: unknown;
  consent?: unknown;
  locale?: unknown;
};

function throttle(request: Request, contactKey: string): NextResponse | null {
  const throttleKey = `${clientIp(request)}:${contactKey.toLowerCase()}`;
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
  return null;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function strictString(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value.trim();
  if (!cleaned || cleaned.length > max) return null;
  return cleaned;
}

function uuidOrNull(value: unknown): string | null {
  const cleaned = strictString(value, 36);
  return cleaned && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleaned) ? cleaned : null;
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
  match: string;
  preferredCountry: string;
  selectedProgram: string | null;
  providerId: string | null;
  message: string | null;
  taxResidence?: string | null;
  capitalGoal?: string | null;
  sofComplexity?: string | null;
  uaeOffer?: string | null;
}) {
  return [
    "💼 Emigro — инвестиционная заявка",
    "",
    `ID: ${input.leadId}`,
    `Направление: ${input.destination}`,
    `Match: ${input.match}`,
    input.preferredCountry !== "any" && input.preferredCountry !== input.destination
      ? `Preferred country: ${input.preferredCountry}`
      : input.preferredCountry !== "any"
        ? `Preferred: ${input.preferredCountry}`
        : "Preferred: any",
    `Бюджет: €${input.budgetEur.toLocaleString("en-US")}`,
    `Актив: ${input.asset}`,
    `Цель статуса: ${input.outcome}`,
    input.capitalGoal ? `Цель капитала: ${input.capitalGoal}` : null,
    input.taxResidence ? `Tax residence: ${input.taxResidence}` : null,
    input.sofComplexity ? `SoF complexity: ${input.sofComplexity}` : null,
    input.uaeOffer ? `UAE offer received: ${input.uaeOffer}` : null,
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

  if (typeof raw.website === "string" && raw.website.trim()) {
    return NextResponse.json({ id: null, status: "new" }, { status: 201 });
  }
  if (raw.source !== undefined) {
    if (!isQuickLeadSource(raw.source)) {
      return NextResponse.json({ error: "Invalid source" }, { status: 400 });
    }
    return handleQuickLead(request, raw);
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

  const capitalGoal = strictString(body.capital_goal, 32);
  const lockupTolerance = strictString(body.lockup_tolerance, 32);
  const donationTolerance = strictString(body.donation_tolerance, 32);
  const sofComplexity = strictString(body.sof_complexity, 32);
  const taxResidence = strictString(body.tax_residence, 32);
  const isUaePreferred = preferredCountry === "uae";
  const uaePropertyType = isUaePreferred ? strictString(body.uae_property_type, 32) : null;
  const uaeGoal = isUaePreferred ? strictString(body.uae_goal, 32) : null;
  const uaeBudgetBand = isUaePreferred ? strictString(body.uae_budget_band, 32) : null;
  const uaeFinancing = isUaePreferred ? strictString(body.uae_financing, 32) : null;
  const uaeOfferReceived = isUaePreferred ? strictString(body.uae_offer_received, 8) : null;

  if (
    !name ||
    !contact ||
    !passportCitizenship ||
    !timeline ||
    !fundingReadiness ||
    !capitalGoal ||
    !lockupTolerance ||
    !donationTolerance ||
    !sofComplexity ||
    !taxResidence ||
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
    !CAPITAL_GOALS.has(capitalGoal) ||
    !LOCKUP.has(lockupTolerance) ||
    !DONATION.has(donationTolerance) ||
    !SOF_COMPLEXITY.has(sofComplexity) ||
    !TAX_RESIDENCE.has(taxResidence) ||
    (asset === "property" &&
      (typeof body.property_stage !== "string" || !PROPERTY_STAGES.has(body.property_stage))) ||
    typeof body.source_of_funds !== "string" ||
    !FUND_SOURCES.has(body.source_of_funds) ||
    (isUaePreferred &&
      (!uaePropertyType ||
        !UAE_PROPERTY_TYPES.has(uaePropertyType) ||
        !uaeGoal ||
        !UAE_GOALS.has(uaeGoal) ||
        !uaeBudgetBand ||
        !UAE_BUDGET.has(uaeBudgetBand) ||
        !uaeFinancing ||
        !UAE_FINANCING.has(uaeFinancing) ||
        !uaeOfferReceived ||
        !UAE_OFFER.has(uaeOfferReceived)))
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
  // Keep the applicant's preferred country even when blocked/closed/budget_gap.
  // Never silently reassign Spain/Greece interest to Thailand or another market.
  const preferredRoute =
    preferredCountry === "any"
      ? undefined
      : matches.find((route) => route.country === preferredCountry);
  const selectedRoute =
    preferredRoute ??
    matches.find((route) => route.match === "likely" || route.match === "review") ??
    matches[0];
  if (!selectedRoute) {
    return NextResponse.json({ error: "No investment routes available" }, { status: 500 });
  }

  const step2LeadId =
    typeof raw.lead_id === "string" && typeof raw.lead_token === "string"
      ? verifyInvestmentResultToken(raw.lead_token) === raw.lead_id
        ? raw.lead_id
        : null
      : null;
  if ((raw.lead_id !== undefined || raw.lead_token !== undefined) && !step2LeadId) {
    return NextResponse.json({ error: "Invalid lead token" }, { status: 400 });
  }

  const throttled = throttle(request, step2LeadId ? `step2:${step2LeadId}` : contact);
  if (throttled) return throttled;

  const consentAt = new Date().toISOString();
  const selectedProgram = selectedRoute.programSlug ?? null;
  const sessionId = strictString(body.session_id, 128);
  const safeMatches = matches.map(safeMatch);
  const leadPacket = {
    schema_version: 3,
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
    capital_goal: capitalGoal,
    lockup_tolerance: lockupTolerance,
    donation_tolerance: donationTolerance,
    sof_complexity: sofComplexity,
    tax_residence: taxResidence,
    uae:
      isUaePreferred
        ? {
            property_type: uaePropertyType,
            goal: uaeGoal,
            budget_band: uaeBudgetBand,
            financing: uaeFinancing,
            offer_received: uaeOfferReceived,
          }
        : null,
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
  const leadColumns = {
    corridor_id: corridor?.id ?? null,
    session_id: sessionId,
    name,
    email: contact,
    telegram: contact.startsWith("@") || contact.startsWith("https://t.me/") ? contact : null,
    passport_iso2: normalizeInvestmentPassport(passportCitizenship),
    preferred_language: body.locale === "en" ? "en" : "ru",
    selected_program_slugs: selectedProgram ? [selectedProgram] : [],
    notes: null,
    lead_type: "investment",
    destination_iso2: selectedRoute.destinationIso2,
    selected_provider_ids: [],
    consent_at: consentAt,
    consent_version: CONSENT_VERSION,
    attribution_expires_at: null,
  };

  if (step2LeadId) {
    const { data: existing } = await supabase
      .from("emigro_manual_leads")
      .select("id, lead_packet, source")
      .eq("id", step2LeadId)
      .maybeSingle();
    if (!existing) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }
    const quickPacket = (existing.lead_packet ?? {}) as Record<string, unknown>;
    const { error: updateError } = await supabase
      .from("emigro_manual_leads")
      .update({
        ...leadColumns,
        lead_packet: { ...leadPacket, quick: quickPacket.quick ?? quickPacket, step2_at: consentAt },
        updated_at: consentAt,
      })
      .eq("id", step2LeadId);
    if (updateError) {
      console.error("[investment-leads] step-2 update failed:", updateError.message);
      return NextResponse.json({ error: "Lead storage failed" }, { status: 500 });
    }
    const step2Telegram = await sendOwnerTelegramDm(
      [
        `🧩 Шаг 2 — полный профиль к заявке ${step2LeadId} (${existing.source ?? "invest_quick"})`,
        "",
        formatOwnerMessage({
          leadId: step2LeadId,
          name,
          contact,
          budgetEur,
          asset: asset as QualifierAsset,
          outcome: outcome as QualifierOutcome,
          destination: selectedRoute.countryRu,
          match: selectedRoute.match,
          preferredCountry,
          selectedProgram,
          providerId: null,
          message: null,
          taxResidence,
          capitalGoal,
          sofComplexity,
          uaeOffer: uaeOfferReceived,
        }),
      ].join("\n")
    );
    if (!step2Telegram.success) console.warn("[investment-leads] step-2 DM failed:", step2Telegram.error);
    await trackServerEvent("investment_lead_submitted", {
      lead_id: step2LeadId,
      destination: selectedRoute.country,
      match: selectedRoute.match,
      step: 2,
    });
    return NextResponse.json(
      {
        id: step2LeadId,
        token: signInvestmentResultToken(step2LeadId),
        status: "new",
        selected_match: safeMatch(selectedRoute),
        matches: safeMatches,
      },
      { status: 200 }
    );
  }

  const { data: lead, error: leadError } = await supabase
    .from("emigro_manual_leads")
    .insert({
      ...leadColumns,
      status: "new",
      source: "investment_pipeline",
      lead_packet: leadPacket,
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
    match: selectedRoute.match,
    preferredCountry,
    selectedProgram,
    providerId: null,
    message: null,
    taxResidence,
    capitalGoal,
    sofComplexity,
    uaeOffer: uaeOfferReceived,
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

async function handleQuickLead(request: Request, raw: Record<string, unknown>) {
  const parsed = validateQuickLead(raw);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  const lead = parsed.value;
  const throttled = throttle(request, lead.contact);
  if (throttled) return throttled;

  const consentAt = new Date().toISOString();
  const row = lead.country === "hub" || lead.country === "compare" ? undefined : goldenVisaRow(lead.country);
  const passportLabel = lead.passport === "Other" ? lead.passportOther ?? "" : lead.passport;
  const passportIso2 = lead.passport === "Other" ? normalizeInvestmentPassport(lead.passportOther) : lead.passport;
  const pageUrl = strictString(raw.page_url, 512);
  const attribution = {
    referrer: strictString(raw.referrer, 512),
    utm_source: strictString(raw.utm_source, 128),
    utm_medium: strictString(raw.utm_medium, 128),
    utm_campaign: strictString(raw.utm_campaign, 128),
    utm_content: strictString(raw.utm_content, 128),
  };
  const quickPacket = {
    schema_version: "quick-1",
    source: lead.source,
    country: lead.country,
    locale: lead.locale,
    budget_band: lead.budgetBand,
    budget_floor_eur: quickBudgetFloorEur(lead.budgetBand),
    passport_citizenship: passportLabel,
    passport_group: quickPassportGroup(lead.passport),
    outcome_goal: lead.outcome,
    contact_type: lead.contactType,
    page_url: pageUrl,
    attribution,
  };

  const supabase = createAdminClient();
  const { data: inserted, error } = await supabase
    .from("emigro_manual_leads")
    .insert({
      corridor_id: null,
      session_id: uuidOrNull(raw.session_id),
      name: "—",
      email: lead.contact,
      telegram: lead.contactType === "telegram" ? lead.contact : null,
      passport_iso2: passportIso2 ?? null,
      preferred_language: lead.locale,
      selected_program_slugs: [],
      notes: null,
      status: "new",
      lead_type: "investment",
      source: lead.source,
      destination_iso2: row?.iso2 ?? null,
      selected_provider_ids: [],
      lead_packet: { quick: quickPacket, preferred_country: row?.slug ?? "any" },
      consent_at: consentAt,
      consent_version: "investment-quick-v1",
      attribution_expires_at: null,
    })
    .select("id")
    .single();

  if (error || !inserted) {
    console.error("[investment-leads] quick insert failed:", error?.message);
    return NextResponse.json({ error: "Lead storage failed" }, { status: 500 });
  }

  const { error: eventError } = await supabase.from("emigro_lead_handoff_events").insert([
    {
      lead_id: inserted.id,
      assignment_id: null,
      event_type: "lead_created",
      actor_type: "system",
      payload: { source: lead.source, country: lead.country, locale: lead.locale },
    },
    {
      lead_id: inserted.id,
      assignment_id: null,
      event_type: "consent_confirmed",
      actor_type: "applicant",
      payload: { consent_version: "investment-quick-v1", consent_at: consentAt },
    },
  ]);
  if (eventError) {
    await supabase.from("emigro_manual_leads").delete().eq("id", inserted.id);
    console.error("[investment-leads] quick audit insert failed:", eventError.message);
    return NextResponse.json({ error: "Lead audit failed" }, { status: 500 });
  }

  const pdfUrl = signInvestPdfUrl(lead.locale);
  // The owner forwards the PDF by hand, so their copy outlives the visitor's 24 h link.
  const ownerPdfUrl = signInvestPdfUrl(lead.locale, 7 * 24 * 60 * 60 * 1000);
  const utm = [attribution.utm_source, attribution.utm_medium, attribution.utm_campaign, attribution.utm_content]
    .filter(Boolean)
    .join(" / ");
  const ownerText = [
    lead.source === "invest_compare"
      ? "📄 Emigro — запрос PDF-сравнения Golden Visa"
      : "⚡ Emigro — быстрая инвест-заявка",
    "",
    `ID: ${inserted.id}`,
    `source=${lead.source} · country=${lead.country} · locale=${lead.locale}`,
    `Бюджет: ${lead.budgetBand}`,
    `Паспорт: ${passportLabel} (${quickPassportGroup(lead.passport)})`,
    `Цель: ${lead.outcome}`,
    `Контакт: ${lead.contact} (${lead.contactType})`,
    utm ? `UTM: ${utm}` : null,
    pageUrl ? `Страница: ${pageUrl}` : null,
    lead.source === "invest_compare" && lead.contactType === "email"
      ? `Отправьте PDF на e-mail вручную (ссылка на 7 дней): ${ownerPdfUrl ?? "секрет подписи не настроен"}`
      : null,
    "",
    "Обещали подбор в течение 1 рабочего дня.",
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
  const telegram = await sendOwnerTelegramDm(ownerText);
  if (!telegram.success) console.warn("[investment-leads] quick DM failed:", telegram.error);

  await trackServerEvent("investment_lead_submitted", {
    lead_id: inserted.id,
    source: lead.source,
    country: lead.country,
    locale: lead.locale,
  });

  return NextResponse.json(
    { id: inserted.id, token: signInvestmentResultToken(inserted.id), status: "new", pdf_url: pdfUrl },
    { status: 201 }
  );
}
