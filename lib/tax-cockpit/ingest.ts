import { canonicalIso2 } from "./packs";
import type { PresenceInterval } from "./types";

export type ManualParseResult = {
  legs: PresenceInterval[];
  errors: string[];
};

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Lowercase keys → ISO2 (canonical pack id). Longest keys matched first at line start. */
const COUNTRY_NAME_TO_ISO2: Record<string, string> = {
  "объединенные арабские эмираты": "AE",
  "united arab emirates": "AE",
  "arab emirates": "AE",
  "великобритания": "GB",
  "great britain": "GB",
  "united kingdom": "GB",
  "португалия": "PT",
  portugal: "PT",
  "испания": "ES",
  spain: "ES",
  "италия": "IT",
  italy: "IT",
  "франция": "FR",
  france: "FR",
  "германия": "DE",
  germany: "DE",
  "америка": "US",
  "сша": "US",
  usa: "US",
  "оаэ": "AE",
  "эмираты": "AE",
  uae: "AE",
  "англия": "GB",
  england: "GB",
};

const COUNTRY_NAME_KEYS = Object.keys(COUNTRY_NAME_TO_ISO2).sort(
  (a, b) => b.length - a.length
);

function parseIsoCalendarDate(iso: string): boolean {
  if (!ISO_DATE_RE.test(iso)) return false;
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return (
    dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d
  );
}

function ruDateToIso(raw: string): string | null {
  const m = raw.trim().match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (!m) return null;
  const day = Number(m[1]);
  const month = Number(m[2]);
  const year = Number(m[3]);
  const iso = `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return parseIsoCalendarDate(iso) ? iso : null;
}

function resolveCountryToken(token: string): string | null {
  const trimmed = token.trim();
  if (!trimmed) return null;
  const fromCode = canonicalIso2(trimmed);
  if (fromCode) return fromCode;
  const lower = trimmed.toLowerCase();
  return COUNTRY_NAME_TO_ISO2[lower] ?? null;
}

function resolveCountryPrefix(line: string): { iso2: string; rest: string } | null {
  const isoLead = line.match(/^([A-Za-z]{2})\s+(.+)$/);
  if (isoLead) {
    const iso = resolveCountryToken(isoLead[1]);
    if (iso) return { iso2: iso, rest: isoLead[2].trim() };
  }

  const lowerLine = line.toLowerCase();
  for (const key of COUNTRY_NAME_KEYS) {
    if (lowerLine.startsWith(key)) {
      const after = line.slice(key.length).trim();
      if (after.length > 0) {
        return { iso2: COUNTRY_NAME_TO_ISO2[key], rest: after };
      }
    }
  }
  return null;
}

function parseDateRange(rest: string): { start: string; end: string } | null {
  const isoPair = rest.match(/^(\d{4}-\d{2}-\d{2})\s*(?:\.\.|–|—|-|to)\s*(\d{4}-\d{2}-\d{2})$/i);
  if (isoPair) {
    const start = isoPair[1];
    const end = isoPair[2];
    if (parseIsoCalendarDate(start) && parseIsoCalendarDate(end)) {
      return { start, end };
    }
    return null;
  }

  const ruPair = rest.match(/^(\d{1,2}\.\d{1,2}\.\d{4})\s*[-–—]\s*(\d{1,2}\.\d{1,2}\.\d{4})$/);
  if (ruPair) {
    const start = ruDateToIso(ruPair[1]);
    const end = ruDateToIso(ruPair[2]);
    if (start && end) return { start, end };
  }

  return null;
}

function parseLine(line: string, lineNo: number): { leg?: PresenceInterval; error?: string } {
  const trimmed = line.trim();
  if (!trimmed) return {};

  const country = resolveCountryPrefix(trimmed);
  if (!country) {
    return { error: `Строка ${lineNo}: не распознана страна — «${trimmed}»` };
  }

  const range = parseDateRange(country.rest);
  if (!range) {
    return {
      error: `Строка ${lineNo}: не распознан диапазон дат — «${country.rest}»`,
    };
  }

  if (range.end < range.start) {
    return {
      error: `Строка ${lineNo}: дата выезда раньше заезда (${range.start}..${range.end})`,
    };
  }

  return {
    leg: {
      countryIso2: country.iso2,
      startDate: range.start,
      endDate: range.end,
      source: "manual",
    },
  };
}

/**
 * Parse manual presence lines. One trip per non-empty line; never invent legs.
 */
export function parseManualPresenceText(
  text: string,
  _defaultYear?: number
): ManualParseResult {
  const legs: PresenceInterval[] = [];
  const errors: string[] = [];
  const lines = text.split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const { leg, error } = parseLine(lines[i], i + 1);
    if (error) errors.push(error);
    if (leg) legs.push(leg);
  }

  return { legs, errors };
}
