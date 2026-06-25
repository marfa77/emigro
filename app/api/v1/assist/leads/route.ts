import { NextResponse } from "next/server";
import { trackServerEvent } from "@/lib/analytics/server";
import { getCorridorBySlug } from "@/lib/corridor/queries";
import { formatAssistLeadTelegramMessage } from "@/lib/leads/format-telegram";
import { getProviderById } from "@/lib/providers/registry";
import { createServerClient } from "@/lib/supabase/server";
import { sendOwnerTelegramDm } from "@/lib/telegram";

type AssistLeadBody = {
  country?: string;
  country_label?: string;
  corridor_slug?: string;
  program_route?: string;
  selected_provider_ids?: unknown;
  plan_tier?: string;
  payment_method?: string;
  name?: string;
  contact?: string;
  message?: string;
  consent?: boolean;
};

const PLAN_TIER_LABELS: Record<string, string> = {
  "route-check": "Route Check (€129)",
  "full-assist": "Full Assist (от €990)",
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  stripe: "Stripe (EUR)",
  wise: "Wise",
  telegram_stars: "Telegram Stars",
  crypto: "Crypto (USDT/USDC)",
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

function contactLooksTelegram(contact: string): boolean {
  return contact.startsWith("@") || contact.includes("t.me/");
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
  const programRoute = clean(body.program_route);
  const planTier = clean(body.plan_tier);
  const paymentMethod = clean(body.payment_method);
  const name = clean(body.name);
  const contact = clean(body.contact);
  const message = clean(body.message);
  const providers = selectedProviderNames(body.selected_provider_ids);

  if (!country || !programRoute || !name || !contact || !message) {
    return NextResponse.json(
      { error: "country, program_route, name, contact, message required" },
      { status: 400 }
    );
  }
  if (!body.consent) {
    return NextResponse.json({ error: "consent required" }, { status: 400 });
  }

  let leadId: string | null = null;
  let stored = false;
  let storageError: string | null = null;
  const notes = [
    "Source: emigro_assist",
    `Plan: ${PLAN_TIER_LABELS[planTier] ?? (planTier || "Route Check (€129)")}`,
    `Payment: ${PAYMENT_METHOD_LABELS[paymentMethod] ?? (paymentMethod || "—")}`,
    `Country: ${country}`,
    `Program/route: ${programRoute}`,
    providers.length ? `Selected providers: ${providers.join(", ")}` : "Selected providers: —",
    "",
    message,
  ].join("\n");

  if (corridorSlug) {
    try {
      const corridor = await getCorridorBySlug(corridorSlug);
      if (corridor) {
        const supabase = createServerClient();
        const { data, error } = await supabase
          .from("emigro_manual_leads")
          .insert({
            corridor_id: corridor.id,
            session_id: null,
            name,
            email: contact,
            telegram: contactLooksTelegram(contact) ? contact : null,
            notes,
            passport_iso2: "RU",
            selected_program_slugs: [programRoute],
            preferred_language: "ru",
            status: "new",
          })
          .select("id")
          .single();

        if (error) {
          storageError = error.message;
        } else {
          leadId = data.id;
          stored = true;
        }
      } else {
        storageError = `Corridor not found: ${corridorSlug}`;
      }
    } catch (err) {
      storageError = err instanceof Error ? err.message : "Lead storage failed";
    }
  } else {
    storageError = "Missing corridor_slug";
  }

  await trackServerEvent("assist_lead_submitted", {
    source: "emigro_assist",
    lead_id: leadId ?? "",
    stored,
    country,
    corridor_slug: corridorSlug,
    provider_count: providers.length,
    plan_tier: planTier,
    payment_method: paymentMethod,
  });

  if (storageError) {
    await trackServerEvent("lead_error", {
      source: "emigro_assist",
      country,
      corridor_slug: corridorSlug,
      message: storageError,
    });
  }

  const telegramText = formatAssistLeadTelegramMessage({
    leadId,
    stored,
    country,
    corridorSlug,
    programRoute,
    planTier: PLAN_TIER_LABELS[planTier] ?? planTier,
    paymentMethod: PAYMENT_METHOD_LABELS[paymentMethod] ?? paymentMethod,
    selectedProviders: providers,
    name,
    contact,
    message,
  });

  const tg = await sendOwnerTelegramDm(telegramText);
  if (!tg.success) {
    console.warn("[assist-leads] Telegram DM failed:", tg.error);
    if (!stored) {
      return NextResponse.json({ error: "Lead notification failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ id: leadId, status: "new", stored });
}
