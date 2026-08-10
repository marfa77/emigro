const PASSPORT_ISO2 = new Set(["RU", "BY", "UA", "KZ", "UY", "EC", "PE", "PY", "CO", "CL"]);

const YES_NO = new Set(["yes", "no"]);

const NUMBER_KEYS = new Set([
  "monthly_income_eur",
  "annual_salary_eur",
  "passive_income_eur",
  "savings_eur",
  "willing_to_invest_eur",
  "study_budget_eur",
  "relocating_children_count",
  "relocating_parents_count",
]);

const YES_NO_KEYS = new Set([
  "remote_income",
  "has_job_offer",
  "has_university_degree",
  "wants_study_route",
  "has_university_admission",
  "can_show_study_funds",
  "relocating_with_spouse",
]);

const MAX_KEYS = 80;
const MAX_STRING_LEN = 500;

export type ValidateAnswersResult =
  | { ok: true; answers: Record<string, unknown> }
  | { ok: false; error: string };

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSafeKey(key: string): boolean {
  return /^[a-z][a-z0-9_]{0,63}$/.test(key);
}

function parseNumber(value: unknown): number | null {
  if (value === "" || value === null || value === undefined) return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() === "") return null;
  const n = typeof value === "string" ? Number(value.replace(",", ".")) : Number(value);
  if (!Number.isFinite(n) || n < 0 || n > 1_000_000_000) return null;
  return n;
}

/**
 * Sanitize wizard answer payloads before session insert / evaluate.
 * Keeps corridor-specific keys; coerces numbers; rejects malformed passport / junk.
 */
export function validateWizardAnswers(raw: unknown): ValidateAnswersResult {
  if (!isPlainObject(raw)) {
    return { ok: false, error: "answers must be an object" };
  }

  const entries = Object.entries(raw);
  if (entries.length > MAX_KEYS) {
    return { ok: false, error: "too many answer keys" };
  }

  const answers: Record<string, unknown> = {};

  for (const [key, value] of entries) {
    if (!isSafeKey(key)) continue;

    if (NUMBER_KEYS.has(key)) {
      const n = parseNumber(value);
      if (n === null) continue;
      answers[key] = n;
      continue;
    }

    if (key === "passport_iso2") {
      const code = String(value ?? "").toUpperCase();
      if (!PASSPORT_ISO2.has(code)) {
        return { ok: false, error: "passport_iso2 must be RU, BY, UA, KZ, UY, EC, PE, PY, CO, or CL" };
      }
      answers[key] = code;
      continue;
    }

    if (YES_NO_KEYS.has(key) || /^has_family_in_[a-z]{2}$/.test(key)) {
      if (typeof value === "string" && YES_NO.has(value)) {
        answers[key] = value;
      }
      continue;
    }

    if (key === "family_countries" || key === "interest_countries" || key === "interest_segments") {
      if (Array.isArray(value)) {
        answers[key] = value.map(String).filter(Boolean).join(",");
      } else if (typeof value === "string") {
        answers[key] = value
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean)
          .join(",");
      }
      continue;
    }

    // Corridor / future questions: strings only (form always sends strings).
    if (typeof value === "string") {
      if (value.length > MAX_STRING_LEN) {
        return { ok: false, error: `answer too long: ${key}` };
      }
      answers[key] = value;
    }
  }

  return { ok: true, answers };
}
