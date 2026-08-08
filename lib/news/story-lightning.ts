/**
 * «Молния» — strict immigration-only gate for @Emigro_news story posts.
 * Site tiles can be broader (housing/tax); Telegram lightning must be 142% visa/ВНЖ.
 */

/** Hard immigration / citizenship / permits — not housing, not general tax. */
export const LIGHTNING_IMMIGRATION_HINTS = [
  "immigra",
  "visa",
  "visto",
  "residenc",
  "residence permit",
  "work permit",
  "nationalit",
  "naturaliz",
  "cidadania",
  "nacionalidade",
  "aima",
  "sef",
  "nie",
  "extranjer",
  "ausländer",
  "auslaender",
  "blue card",
  "eu blue",
  "golden visa",
  "startup visa",
  "digital nomad",
  "nomad visa",
  "highly skilled",
  "kennismigrant",
  "d7",
  "d8",
  "ind ",
  "bamf",
  "asylum",
  "refugee",
  "reagrup",
  "family reunif",
  "udi",
  "udi.no",
  "d-number",
  "rwr",
  "red-white-red",
  "niederlass",
  "ma35",
  "karta pobytu",
  "zezwolen",
  "cizineck",
  "white card",
  "boraviš",
  "boravis",
  "e-residenc",
  "eresidency",
  "politsei",
  "migration department",
  "внж",
  "гражданств",
  "иммиграц",
  "виз",
  "натурализ",
  "пмж",
  "вид на житель",
];

/** Soft / life topics — OK on site tiles, NOT enough alone for #молния. */
const LIGHTNING_REJECT = [
  "cocaine",
  "cocaína",
  "cocaina",
  "heroina",
  "heroína",
  "trafficking",
  "tráfico de droga",
  "trafico de droga",
  "apreendid",
  "seizure of",
  "football",
  "soccer",
  "eclipse",
  "wildfire",
  "data breach",
  "ransomware",
  "tiktok",
  "instagram",
  "snapchat",
  "social media",
];

/** Same floor as site story tiles; lightning quality comes from keyword gate, not a higher score. */
export const LIGHTNING_MIN_STORY_SCORE = 14;

/** Channel-wide daily cap for lightning posts (all corridors). */
export const LIGHTNING_MAX_PER_DAY = 5;

export function isLightningImmigrationText(text: string): boolean {
  const t = text.toLowerCase();
  if (LIGHTNING_REJECT.some((h) => t.includes(h))) return false;
  return LIGHTNING_IMMIGRATION_HINTS.some((h) => t.includes(h));
}

export function escapeTelegramHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Short channel post: ⚡ #молния + country + title + excerpt + Emigro link. */
export function buildLightningTelegramHtml(params: {
  flag: string;
  countryRu: string;
  title: string;
  excerpt: string;
  articleUrl: string;
  sourceLabel?: string;
}): string {
  const title = escapeTelegramHtml(params.title.trim().slice(0, 120));
  const excerpt = escapeTelegramHtml(params.excerpt.trim().slice(0, 400));
  const country = escapeTelegramHtml(params.countryRu);
  const href = params.articleUrl.replace(/"/g, "&quot;");
  const source = params.sourceLabel
    ? `\n<i>${escapeTelegramHtml(params.sourceLabel)}</i>`
    : "";

  return [
    `⚡ <b>#молния</b> · ${params.flag} ${country}`,
    "",
    `<b>${title}</b>`,
    "",
    excerpt,
    source,
    "",
    `<a href="${href}">Читать на Emigro</a>`,
  ]
    .filter((line, i, arr) => !(line === "" && arr[i - 1] === ""))
    .join("\n")
    .trim();
}
