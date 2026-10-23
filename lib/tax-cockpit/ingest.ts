import { canonicalIso2 } from "./packs";
import type { PresenceInterval } from "./types";

export type ManualParseResult = {
  legs: PresenceInterval[];
  errors: string[];
};

export type TicketMediaParseResult = ManualParseResult & {
  rawNotes?: string;
};

export type TicketExtractLeg = {
  countryIso2: string;
  startDate: string;
  endDate: string;
  confidence: number;
};

export const TICKET_CONFIDENCE_MIN = 0.6;

const TICKET_EXTRACT_MODEL = "gemini-2.5-flash";

const TICKET_EXTRACT_SCHEMA = {
  type: "OBJECT",
  properties: {
    legs: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          countryIso2: { type: "STRING" },
          startDate: { type: "STRING" },
          endDate: { type: "STRING" },
          confidence: { type: "NUMBER" },
        },
        required: ["countryIso2", "startDate", "endDate", "confidence"],
      },
    },
    rawNotes: { type: "STRING" },
  },
  required: ["legs", "rawNotes"],
} as const;

type GeminiTicketPayload = {
  legs: TicketExtractLeg[];
  rawNotes: string;
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

function geminiApiKey(): string {
  const key = process.env.GEMINI_API_KEY?.trim() || process.env.GOOGLE_API_KEY?.trim();
  if (!key) throw new Error("GEMINI_API_KEY or GOOGLE_API_KEY is required for ticket ingest");
  return key;
}

function stripMarkdownJsonFences(text: string): string {
  let t = text.trim();
  if (t.startsWith("```")) {
    t = t.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();
  }
  return t;
}

function parseGeminiJson<T>(text: string): T {
  const trimmed = stripMarkdownJsonFences(text);
  try {
    return JSON.parse(trimmed) as T;
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(trimmed.slice(start, end + 1)) as T;
    }
    throw new Error("Gemini returned invalid JSON for ticket extract");
  }
}

function normalizeMimeForGemini(mime: string): string | null {
  const m = mime.trim().toLowerCase();
  if (m.startsWith("image/")) return m;
  if (m === "application/pdf") return m;
  return null;
}

async function callGeminiTicketExtract(
  buffer: Buffer,
  mime: string,
  caption: string
): Promise<GeminiTicketPayload> {
  const normalizedMime = normalizeMimeForGemini(mime);
  if (!normalizedMime) {
    throw new Error(`unsupported ticket mime: ${mime}`);
  }

  const key = geminiApiKey();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${TICKET_EXTRACT_MODEL}:generateContent?key=${key}`;

  const system = [
    "You extract travel presence intervals from boarding passes, e-tickets, and itinerary PDFs/images.",
    "Return JSON only. Never invent countries or dates not visible on the document.",
    "countryIso2 must be ISO 3166-1 alpha-2 (UK → GB). Dates YYYY-MM-DD.",
    "confidence 0..1: how sure you are this leg is correct from the document.",
    "One leg = continuous stay in one country (arrival to departure). Multi-segment trips → multiple legs.",
    "If unreadable, return empty legs array and explain in rawNotes.",
  ].join(" ");

  const userText = [
    caption.trim() ? `User caption: ${caption.trim()}` : "No caption.",
    "Extract all presence legs you can read from this ticket or boarding pass.",
  ].join("\n");

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [
        {
          role: "user",
          parts: [
            { inline_data: { mime_type: normalizedMime, data: buffer.toString("base64") } },
            { text: userText },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 4096,
        responseMimeType: "application/json",
        responseSchema: TICKET_EXTRACT_SCHEMA,
        thinkingConfig: { thinkingBudget: 0 },
      },
    }),
    signal: AbortSignal.timeout(90_000),
  });

  const json = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    error?: { message?: string };
  };

  if (!res.ok) {
    throw new Error(json.error?.message || `Gemini HTTP ${res.status}`);
  }

  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned empty ticket extract");
  return parseGeminiJson<GeminiTicketPayload>(text);
}

/** Drop model legs below confidence threshold (default 0.6). */
export function filterLegsByConfidence(
  legs: TicketExtractLeg[],
  minConfidence = TICKET_CONFIDENCE_MIN
): TicketExtractLeg[] {
  return legs.filter((leg) => typeof leg.confidence === "number" && leg.confidence >= minConfidence);
}

/** Convert filtered model legs to presence intervals; does not call Gemini. */
export function presenceLegsFromTicketExtract(
  filtered: TicketExtractLeg[],
  rawNotes?: string
): TicketMediaParseResult {
  const legs: PresenceInterval[] = [];
  const errors: string[] = [];

  for (let i = 0; i < filtered.length; i++) {
    const row = filtered[i];
    const iso = resolveCountryToken(row.countryIso2);
    if (!iso) {
      errors.push(`Сегмент ${i + 1}: неизвестная страна «${row.countryIso2}»`);
      continue;
    }
    if (!parseIsoCalendarDate(row.startDate) || !parseIsoCalendarDate(row.endDate)) {
      errors.push(`Сегмент ${i + 1}: неверный формат дат`);
      continue;
    }
    if (row.endDate < row.startDate) {
      errors.push(`Сегмент ${i + 1}: выезд раньше заезда`);
      continue;
    }
    legs.push({
      countryIso2: iso,
      startDate: row.startDate,
      endDate: row.endDate,
      source: "ticket",
      note: rawNotes?.trim() ? rawNotes.trim().slice(0, 500) : null,
    });
  }

  return { legs, errors, rawNotes };
}

const MANUAL_TICKET_FALLBACK =
  "Не удалось уверенно прочитать билет. Введите даты вручную через «Ввести даты».";

const LOW_CONFIDENCE_FALLBACK =
  "Даты на билете распознаны с низкой уверенностью (< 60%). Введите вручную.";

/**
 * OCR / vision extract from ticket photo or PDF. Never writes ledger — confirm step only.
 */
export async function extractLegsFromTicketMedia(
  buffer: Buffer,
  mime: string,
  caption: string
): Promise<TicketMediaParseResult> {
  let parsed: GeminiTicketPayload;
  try {
    parsed = await callGeminiTicketExtract(buffer, mime, caption);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      legs: [],
      errors: [`${MANUAL_TICKET_FALLBACK} (${msg})`],
    };
  }

  const rawLegs = Array.isArray(parsed.legs) ? parsed.legs : [];
  const filtered = filterLegsByConfidence(rawLegs);

  if (filtered.length === 0) {
    return {
      legs: [],
      errors: [rawLegs.length > 0 ? LOW_CONFIDENCE_FALLBACK : MANUAL_TICKET_FALLBACK],
      rawNotes: parsed.rawNotes,
    };
  }

  const result = presenceLegsFromTicketExtract(filtered, parsed.rawNotes);
  if (result.legs.length === 0) {
    return {
      legs: [],
      errors: result.errors.length ? result.errors : [MANUAL_TICKET_FALLBACK],
      rawNotes: parsed.rawNotes,
    };
  }
  return result;
}
