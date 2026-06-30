import { normalizeFacts } from "@/lib/engine/evaluator";
import { mergeHouseholdFacts } from "@/lib/engine/household";

/** Destination ISO2 → per-corridor family reunification fact key in JSON Logic rules. */
export const FAMILY_FACT_BY_DESTINATION: Record<string, string> = {
  PT: "has_family_in_pt",
  ES: "has_family_in_es",
  FR: "has_family_in_fr",
  IT: "has_family_in_it",
  DE: "has_family_in_de",
  NL: "has_family_in_nl",
  SE: "has_family_in_se",
  PL: "has_family_in_pl",
  CZ: "has_family_in_cz",
  AT: "has_family_in_at",
};

const ALL_FAMILY_KEYS = Object.values(FAMILY_FACT_BY_DESTINATION);

/** Expand hub wizard answers into facts understood by all corridor eligibility rules. */
export function expandHubFacts(answers: Record<string, unknown>): Record<string, unknown> {
  const facts = normalizeFacts(mergeHouseholdFacts(answers));

  const raw = answers.family_countries;
  const selected = new Set<string>();
  if (Array.isArray(raw)) {
    for (const v of raw) selected.add(String(v));
  } else if (typeof raw === "string" && raw.trim()) {
    for (const v of raw.split(",")) selected.add(v.trim());
  }

  const hasFamilyCountriesAnswer =
    (Array.isArray(raw) && raw.length > 0) ||
    (typeof raw === "string" && raw.trim().length > 0);

  if (hasFamilyCountriesAnswer) {
    for (const [iso, key] of Object.entries(FAMILY_FACT_BY_DESTINATION)) {
      facts[key] = selected.has(iso) ? "yes" : "no";
    }
  }

  for (const key of ALL_FAMILY_KEYS) {
    if (facts[key] === undefined) facts[key] = "no";
  }

  if (!facts.remote_income && facts.has_job_offer === "yes") {
    facts.remote_income = "no";
  }

  if (facts.wants_study_route === undefined) {
    facts.wants_study_route = "no";
  }

  return facts;
}
