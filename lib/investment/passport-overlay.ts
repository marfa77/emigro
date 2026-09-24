import type { ProgramPassportEligibility } from "@/lib/types";
import { INVESTMENT_ROUTES } from "@/lib/investment/registry";

const RESTRICTION_NOTES: Record<
  string,
  Partial<Record<string, { notes_en: string; notes_ru: string }>>
> = {
  "greece-golden-visa": {
    RU: {
      notes_en:
        "Ministry of Migration: suspension of new Golden Visa / investor residence applications for Russian nationals remains in force (renewals are a separate track).",
      notes_ru:
        "Минмиграции GR: приостановка новых заявок Golden Visa / investor residence для граждан РФ сохраняется (продления — отдельный трек).",
    },
    BY: {
      notes_en:
        "Ministry of Migration: suspension of new Golden Visa / investor residence applications for Belarusian nationals remains in force (renewals are a separate track).",
      notes_ru:
        "Минмиграции GR: приостановка новых заявок Golden Visa / investor residence для граждан BY сохраняется (продления — отдельный трек).",
    },
  },
  "malta-mprp": {
    RU: {
      notes_en:
        "Residency Malta MPRP FAQ: applications from the Russian Federation are currently not eligible.",
      notes_ru: "Residency Malta FAQ (MPRP): заявки от граждан РФ сейчас не принимают.",
    },
    BY: {
      notes_en:
        "Residency Malta MPRP FAQ: applications from the Republic of Belarus are currently not eligible.",
      notes_ru: "Residency Malta FAQ (MPRP): заявки от граждан BY сейчас не принимают.",
    },
  },
  "italy-investor-visa": {
    RU: {
      notes_en:
        "Investor Visa Italy: programme suspended for Russian nationals (including dual nationality where one passport is RU).",
      notes_ru:
        "Italy Investor Visa: программа приостановлена для граждан РФ (включая двойное гражданство с паспортом РФ).",
    },
    BY: {
      notes_en:
        "Investor Visa Italy: programme suspended for Belarusian nationals (including dual nationality where one passport is BY).",
      notes_ru:
        "Italy Investor Visa: программа приостановлена для граждан BY (включая двойное гражданство с паспортом BY).",
    },
  },
};

/**
 * Single source of truth for investment-route passport blocks:
 * lib/investment/registry.ts → overlays corridor program pages / Facts API
 * even if a DB seed is stale. DB migration keeps wizard evaluator in sync.
 */
export function overlayInvestmentPassportEligibility(
  programSlug: string,
  entries: ProgramPassportEligibility[]
): ProgramPassportEligibility[] {
  const route = INVESTMENT_ROUTES.find((item) => item.programSlug === programSlug);
  const restricted = route?.restrictedPassports ?? [];
  if (restricted.length === 0) return entries;

  const notesByPassport = RESTRICTION_NOTES[programSlug] ?? {};
  const byIso = new Map(entries.map((entry) => [entry.passport_iso2, entry]));

  for (const iso of restricted) {
    const notes = notesByPassport[iso];
    const existing = byIso.get(iso);
    if (existing) {
      byIso.set(iso, {
        ...existing,
        status: "ineligible",
        notes_en: notes?.notes_en ?? existing.notes_en,
        notes_ru: notes?.notes_ru ?? existing.notes_ru,
      });
    } else {
      byIso.set(iso, {
        id: `overlay-${programSlug}-${iso}`,
        passport_iso2: iso,
        status: "ineligible",
        notes_en: notes?.notes_en ?? "New applications restricted for this passport.",
        notes_ru: notes?.notes_ru ?? "Новые заявки для этого паспорта ограничены.",
      });
    }
  }

  return Array.from(byIso.values());
}
