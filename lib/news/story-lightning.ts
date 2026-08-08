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

/** Stored in telegram_html when story was evaluated and is not for the channel. */
export const LIGHTNING_SKIP_MARK = "__skip_lightning__";

export function isLightningImmigrationText(text: string): boolean {
  const t = text.toLowerCase();
  if (LIGHTNING_REJECT.some((h) => t.includes(h))) return false;
  return LIGHTNING_IMMIGRATION_HINTS.some((h) => t.includes(h));
}

export type LightningLlmVerdict = {
  publish: boolean;
  confidence: number;
  reason: string;
};

const LLM_MIN_CONFIDENCE = 0.75;

/**
 * Second gate (Gemini Flash): actionable immigration news for RU relocators only.
 * Fail-closed on API/parse errors — better miss a post than spam the channel.
 */
export async function scoreLightningWithLlm(params: {
  countryRu: string;
  title: string;
  excerpt: string;
  originalTitle?: string;
  paragraphs?: string[];
}): Promise<LightningLlmVerdict> {
  const { geminiFastJson } = await import("@/lib/news/gemini");

  const system = `You are the final moderator for Emigro Telegram channel @Emigro_news («молния»).
Audience: Russian-speaking relocators (RU/BY/UA/KZ) planning visas / residence / citizenship in Europe.

APPROVE only if the item is PRACTICAL immigration news:
- visa / residence permit / work permit / Blue Card / citizenship / naturalization rules
- quotas, fees, processing times, agency procedure changes (AIMA, IND, UDI, BAMF, prefecture…)
- enforcement that clearly changes relocator options (illegal stay crackdown with new rules)

REJECT:
- party politics / election interviews without a concrete rule change for applicants
- crime, drugs, sport, celebs, weather, cyber, transport fluff
- housing/rent/tax alone (without visa/residency angle)
- vague opinion, culture, tourism, jobs-market fluff without permit/visa link
- anything not useful for someone choosing or holding a relocation route

Be strict. When unsure → publish=false.
Reply with JSON only matching the schema (no prose, no markdown).`;

  const user = `Decide publish true/false for this story.\n${JSON.stringify({
    country: params.countryRu,
    title: params.title,
    excerpt: params.excerpt,
    original_title: params.originalTitle ?? "",
    body_preview: (params.paragraphs ?? []).slice(0, 2).join("\n").slice(0, 800),
  })}`;

  const schema = {
    type: "OBJECT",
    properties: {
      publish: { type: "BOOLEAN" },
      confidence: { type: "NUMBER" },
      reason: { type: "STRING" },
    },
    required: ["publish", "confidence", "reason"],
  };

  try {
    // Flash 2.5 uses thinking tokens — keep headroom so JSON is not truncated.
    const result = await geminiFastJson<LightningLlmVerdict>(system, user, schema, 2048);
    const confidence = Number(result.confidence);
    const conf = Number.isFinite(confidence) ? Math.max(0, Math.min(1, confidence)) : 0;
    const publish = Boolean(result.publish) && conf >= LLM_MIN_CONFIDENCE;
    return {
      publish,
      confidence: conf,
      reason: String(result.reason || "").slice(0, 200) || (publish ? "ok" : "rejected"),
    };
  } catch (e) {
    return {
      publish: false,
      confidence: 0,
      reason: `llm-error:${e instanceof Error ? e.message : String(e)}`.slice(0, 200),
    };
  }
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
