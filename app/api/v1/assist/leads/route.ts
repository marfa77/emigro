import { NextResponse } from "next/server";
import { isValidWizardSessionId } from "@/lib/assist/session-id";
import { getProviderById } from "@/lib/providers/registry";
import { submitAssistLead } from "@/lib/leads/submit-assist";

type AssistLeadBody = {
  country?: string;
  country_label?: string;
  corridor_slug?: string;
  destination_iso2?: string;
  program_route?: string;
  selected_provider_ids?: unknown;
  plan_tier?: string;
  payment_method?: string;
  name?: string;
  contact?: string;
  message?: string;
  consent?: boolean;
  preferred_language?: string;
  audience?: string;
  session_id?: string;
  source?: string;
};

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function selectedProviderNames(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((id) => getProviderById(clean(id)))
    .filter((provider): provider is NonNullable<ReturnType<typeof getProviderById>> => Boolean(provider))
    .map((provider) => provider.name);
}

export async function POST(request: Request) {
  let body: AssistLeadBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const country = clean(body.country_label) || clean(body.country);
  const corridorSlug = clean(body.corridor_slug);
  const destinationIso2 = clean(body.destination_iso2).toUpperCase();
  const programRoute = clean(body.program_route);
  const planTier = clean(body.plan_tier);
  const paymentMethod = clean(body.payment_method);
  const name = clean(body.name);
  const contact = clean(body.contact);
  const message = clean(body.message);
  const providers = selectedProviderNames(body.selected_provider_ids);
  const rawSessionId = clean(body.session_id);
  const sessionId = isValidWizardSessionId(rawSessionId) ? rawSessionId : null;
  const preferredRaw = clean(body.preferred_language);
  const preferredLanguage =
    preferredRaw === "es" ? "es" : preferredRaw === "fr" ? "fr" : "ru";
  const audienceRaw = clean(body.audience);
  const audience =
    audienceRaw === "latam" ? "latam" : audienceRaw === "fr_africa" ? "fr_africa" : "ru";
  const sourceRaw = clean(body.source);
  const assistSource =
    sourceRaw ||
    (audience === "latam"
      ? "emigro_assist_es"
      : audience === "fr_africa"
        ? "emigro_assist_fr"
        : "emigro_assist");

  if (!country || !programRoute || !name || !contact || !message) {
    return NextResponse.json(
      { error: "country, program_route, name, contact, message required" },
      { status: 400 }
    );
  }
  if (!body.consent) {
    return NextResponse.json({ error: "consent required" }, { status: 400 });
  }

  const result = await submitAssistLead({
    country,
    corridorSlug: corridorSlug || undefined,
    destinationIso2: destinationIso2 || undefined,
    programRoute,
    planTier: planTier || undefined,
    paymentMethod: paymentMethod || undefined,
    selectedProviders: providers,
    name,
    contact,
    message,
    source: assistSource,
    sessionId,
    preferredLanguage,
  });

  return NextResponse.json({ id: result.leadId, status: "new", stored: result.stored });
}
