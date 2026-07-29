/**
 * Evergreen copy guards — satellite notes must not depend on “yesterday / today”
 * relative to publish time. Prefer calendar dates or stable “с июля 2026”.
 *
 * Note: takeaway prefix «Сегодня: …» means “do now” CTA — that is allowed.
 */

const ACTION_PREFIX_RE = /^(Официально|На практике|Расхождение|В чате|Сегодня):\s*/i;

/** Relative-to-now time that goes stale within days (after stripping CTA prefixes). */
export const EPHEMERAL_RELATIVE_TIME_RE =
  /со?\s+вчерашнего\s+дня|с\s+сегодняшнего\s+дня|(?:^|[\s(«"“])вчера(?:[\s,.;:!?]|$)|(?:^|[\s(«"“])завтра(?:[\s,.;:!?]|$)|на\s+этой\s+неделе|на\s+прошлой\s+неделе|на\s+днях|только\s+что|только\s+вчера/i;

function bodyWithoutActionPrefix(text: string): string {
  return text.replace(ACTION_PREFIX_RE, "").replace(/\u200b/g, "").trim();
}

export function hasEphemeralRelativeTime(text: string): boolean {
  return EPHEMERAL_RELATIVE_TIME_RE.test(bodyWithoutActionPrefix(text));
}

/** Drop or rewrite raw channel lead-ins that paste the headline + «вчера». */
export function scrubEphemeralRelativeTime(text: string): string {
  const prefix = text.match(ACTION_PREFIX_RE)?.[0] ?? "";
  let out = bodyWithoutActionPrefix(text)
    .replace(/со?\s+вчерашнего\s+дня/gi, "с момента запуска программы")
    .replace(/с\s+сегодняшнего\s+дня/gi, "с момента запуска программы")
    .replace(/(?:^|[\s(«"“])вчера(?=[\s,.;:!?|]|$)/gi, (m) => m.replace(/вчера/i, "недавно"))
    .replace(/(?:^|[\s(«"“])завтра(?=[\s,.;:!?|]|$)/gi, (m) => m.replace(/завтра/i, "в ближайшие дни"))
    .replace(/на\s+прошлой\s+неделе/gi, "недавно")
    .replace(/на\s+днях/gi, "недавно")
    .replace(/только\s+что/gi, "недавно")
    .replace(/\s{2,}/g, " ")
    .trim();

  return `${prefix}${out}`.trim();
}

export function filterEphemeralLines(lines: string[]): string[] {
  return lines
    .map((line) => scrubEphemeralRelativeTime(line))
    .filter((line) => line.length > 24 && !hasEphemeralRelativeTime(line));
}

export function ephemeralRelativeTimeErrors(texts: string[]): string[] {
  const hits = texts.filter((t) => hasEphemeralRelativeTime(t));
  if (hits.length === 0) return [];
  return [
    `ephemeral relative time (вчера/завтра/со вчерашнего дня) — evergreen only; got: «${hits[0].slice(0, 80)}…»`,
  ];
}
