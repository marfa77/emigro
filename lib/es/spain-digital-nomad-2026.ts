/**
 * Spain international teletrabajo (digital nomad) income thresholds — 2026.
 * Ley 14/2013 art. 74 bis — marco del visado teletrabajo; el piso 200% SMI mensual lo fijan
 * requisitos UGE / consulados (SMI: RD 126/2026, BOE-A-2026-3815 — €1.221/mes).
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

/** Attribution: legal frame vs economic requirement. */
export const SPAIN_DN_LEGAL_FRAME_ES =
  "Ley 14/2013 art. 74 bis (régimen teletrabajo internacional)";
export const SPAIN_DN_INCOME_RULE_ES =
  "criterio oficial UGE/consulados: 200% SMI mensual";
export const SPAIN_DN_INCOME_RULE_RU =
  "критерий UGE/консульств: 200% SMI mensual";

export const SPAIN_DN_INCOME_REQUIREMENT_RU =
  "≈ €2.442/мес (200% SMI mensual; SMI RD 126/2026; требования UGE/консульств)";

export const SPAIN_DN_FAMILY_ADDON_RU =
  "+€916/мес. за первого иждивенца, +€305/мес. за каждого следующего (75%/25% SMI mensual 2026, RD 126/2026)";