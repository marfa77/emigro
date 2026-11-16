/**
 * Spain international teletrabajo (digital nomad) income thresholds — 2026.
 * Ley 14/2013 art. 74 bis: 200% of monthly SMI (titular); 75% / 25% monthly SMI (dependants).
 * SMI: Real Decreto 126/2026, BOE-A-2026-3815 — €1.221/month.
 */

export const SPAIN_SMI_MONTHLY_EUR_2026 = 1221;
export const SPAIN_DN_TITULAR_MONTHLY_EUR_2026 = 2442;
export const SPAIN_DN_FAMILY_FIRST_MONTHLY_EUR_2026 = 916;
export const SPAIN_DN_FAMILY_NEXT_MONTHLY_EUR_2026 = 305;

/** Wizard / JSON Logic floor (integer euros). */
export const SPAIN_DN_WIZARD_INCOME_FLOOR_EUR = SPAIN_DN_TITULAR_MONTHLY_EUR_2026;

/** ES LATAM meta/snippets — prefer rule wording over a lone euro figure. */
export const SPAIN_DN_META_ES = "200% SMI";
export const SPAIN_DN_META_ES_MENSUAL = "200% SMI mensual";

/** Body copy with BOE-backed euro hint (dot thousands in ES register). */
export const SPAIN_DN_BODY_EUROS_ES = "≈ €2.442/mes";

export const SPAIN_DN_INCOME_REQUIREMENT_RU =
  "€2.442 (200% SMI mensual 2026, RD 126/2026 / Ley 14/2013 art. 74 bis)";

export const SPAIN_DN_FAMILY_ADDON_RU =
  "+€916/мес. за первого иждивенца, +€305/мес. за каждого следующего (75%/25% SMI mensual 2026, RD 126/2026)";