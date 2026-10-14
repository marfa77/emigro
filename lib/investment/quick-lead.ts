import {
  INVEST_COUNTRY_SLUGS,
  type InvestLocale,
  type InvestPageKey,
} from "@/lib/investment/golden-visa-2026";
import type { InvestmentOutcome } from "@/lib/investment/registry";

/** Short above-the-fold investment form (spec 2026-10-14). Shared by client and API. */

export const INVEST_QUICK_ANCHOR = "invest-quick";
export const INVEST_PREFILL_EVENT = "emigro:invest-prefill";
export const INVEST_PREFILL_KEY = "emigro-invest-prefill:v1";

/** Short-form answers handed to the step-2 profiler (same lead_id). */
export type InvestPrefill = {
  leadId: string;
  token: string | null;
  budgetEur: number | null;
  passport: string;
  outcome: InvestmentOutcome;
  contact: string;
  preferredCountry: string;
};

export const QUICK_LEAD_SOURCES = ["invest_quick", "invest_compare"] as const;
export type QuickLeadSource = (typeof QUICK_LEAD_SOURCES)[number];

export const QUICK_BUDGET_BANDS = ["lt250", "250_500", "500_1000", "1000_2000", "gt2000", "unsure"] as const;
export type QuickBudgetBand = (typeof QUICK_BUDGET_BANDS)[number];

export const QUICK_PASSPORTS = ["RU", "BY", "UA", "KZ", "Other"] as const;
export type QuickPassport = (typeof QUICK_PASSPORTS)[number];

export const QUICK_OUTCOMES = ["residence", "citizenship", "tax", "business"] as const;
export type QuickOutcome = (typeof QUICK_OUTCOMES)[number];

export const QUICK_PAGE_KEYS: readonly InvestPageKey[] = [...INVEST_COUNTRY_SLUGS, "hub", "compare"];

const TELEGRAM_RE = /^@?[A-Za-z0-9_]{5,32}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function quickContactType(contact: string): "telegram" | "email" | null {
  const value = contact.trim();
  if (EMAIL_RE.test(value)) return "email";
  if (TELEGRAM_RE.test(value)) return "telegram";
  return null;
}

/** Telegram handles are stored with a leading @ so they match the full profiler. */
export function normalizeQuickContact(contact: string): string {
  const value = contact.trim();
  if (quickContactType(value) === "telegram" && !value.startsWith("@")) return `@${value}`;
  return value;
}

export function quickPassportGroup(passport: string): "ru_by" | "other" {
  return passport === "RU" || passport === "BY" ? "ru_by" : "other";
}

/** Lower bound of the band, for the step-2 profiler prefill. */
export function quickBudgetFloorEur(band: QuickBudgetBand): number | null {
  return {
    lt250: null,
    "250_500": 250_000,
    "500_1000": 500_000,
    "1000_2000": 1_000_000,
    gt2000: 2_000_000,
    unsure: null,
  }[band];
}

export function quickOutcomeToProfiler(outcome: QuickOutcome): InvestmentOutcome {
  return outcome === "citizenship" ? "citizenship_path" : "residence";
}

export function quickPassportLabel(passport: QuickPassport, other: string, locale: InvestLocale): string {
  if (passport === "Other") return other.trim();
  const labels: Record<Exclude<QuickPassport, "Other">, { ru: string; en: string }> = {
    RU: { ru: "Россия", en: "Russia" },
    BY: { ru: "Беларусь", en: "Belarus" },
    UA: { ru: "Украина", en: "Ukraine" },
    KZ: { ru: "Казахстан", en: "Kazakhstan" },
  };
  return labels[passport][locale];
}

export function isQuickLeadSource(value: unknown): value is QuickLeadSource {
  return typeof value === "string" && (QUICK_LEAD_SOURCES as readonly string[]).includes(value);
}

export type QuickLeadValidation =
  | {
      ok: true;
      value: {
        source: QuickLeadSource;
        country: InvestPageKey;
        locale: InvestLocale;
        budgetBand: QuickBudgetBand;
        passport: QuickPassport;
        passportOther: string | null;
        outcome: QuickOutcome;
        contact: string;
        contactType: "telegram" | "email";
      };
    }
  | { ok: false; error: string };

export function validateQuickLead(body: Record<string, unknown>): QuickLeadValidation {
  const str = (key: string, max: number) => {
    const value = body[key];
    if (typeof value !== "string") return null;
    const trimmed = value.trim();
    return trimmed && trimmed.length <= max ? trimmed : null;
  };
  const source = body.source;
  if (!isQuickLeadSource(source)) return { ok: false, error: "Invalid source" };
  const country = str("country", 16);
  if (!country || !QUICK_PAGE_KEYS.includes(country as InvestPageKey)) return { ok: false, error: "Invalid country" };
  const locale = str("locale", 2);
  if (locale !== "ru" && locale !== "en") return { ok: false, error: "Invalid locale" };
  const budgetBand = str("budget_eur", 16);
  if (!budgetBand || !(QUICK_BUDGET_BANDS as readonly string[]).includes(budgetBand)) {
    return { ok: false, error: "Invalid budget" };
  }
  const passport = str("passport_citizenship", 8);
  if (!passport || !(QUICK_PASSPORTS as readonly string[]).includes(passport)) {
    return { ok: false, error: "Invalid passport" };
  }
  const passportOther = passport === "Other" ? str("passport_other", 80) : null;
  if (passport === "Other" && !passportOther) return { ok: false, error: "Invalid passport" };
  const outcome = str("outcome", 16);
  if (!outcome || !(QUICK_OUTCOMES as readonly string[]).includes(outcome)) {
    return { ok: false, error: "Invalid outcome" };
  }
  const rawContact = str("contact", 200);
  const contactType = rawContact ? quickContactType(rawContact) : null;
  if (!rawContact || !contactType) return { ok: false, error: "Invalid contact" };
  if (body.consent !== true) return { ok: false, error: "Consent required" };

  return {
    ok: true,
    value: {
      source,
      country: country as InvestPageKey,
      locale,
      budgetBand: budgetBand as QuickBudgetBand,
      passport: passport as QuickPassport,
      passportOther,
      outcome: outcome as QuickOutcome,
      contact: normalizeQuickContact(rawContact),
      contactType,
    },
  };
}

/** `invest_<slug>_<locale>` — ≤64 chars, [A-Za-z0-9_-]. */
export function investBotStartPayload(key: InvestPageKey, locale: InvestLocale): string {
  return `invest_${key}_${locale}`;
}

export function parseInvestBotStartPayload(
  payload: string
): { key: InvestPageKey; locale: InvestLocale } | null {
  const match = payload.trim().toLowerCase().match(/^invest_([a-z]+)_(ru|en)$/);
  if (!match) return null;
  const key = match[1] as InvestPageKey;
  if (!QUICK_PAGE_KEYS.includes(key)) return null;
  return { key, locale: match[2] as InvestLocale };
}
