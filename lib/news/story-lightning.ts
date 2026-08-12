/**
 * «Молния» — relocator-relevant gate for @Emigro_news story posts.
 * Site tiles stay broad; Telegram still filters noise, but owner DM is the final call
 * (no auto-publish), so keyword + LLM gates are intentionally permissive.
 */

/** Immigration / status / borders / foreigner-life that relocators act on. */
export const LIGHTNING_IMMIGRATION_HINTS = [
  "immigra",
  "migrant",
  "migration",
  "foreigner",
  "foreign worker",
  "expat",
  "visa",
  "visto",
  "residenc",
  "residence permit",
  "work permit",
  "nationalit",
  "naturaliz",
  "cidadania",
  "nacionalidade",
  "citizenship",
  "passport",
  "aima",
  "sef",
  "nie",
  "tie ",
  "extranjer",
  "extranjero",
  "estrangeiro",
  "ausländer",
  "auslaender",
  "blue card",
  "eu blue",
  "golden visa",
  "vistos gold",
  "visto gold",
  "investidor",
  "investidores",
  "ari ",
  "provedor",
  "provedoria",
  "lei da nacionalidade",
  "nationality law",
  "zona cinzent",
  "grey zone",
  "gray zone",
  "regime transit",
  "startup visa",
  "digital nomad",
  "nomad visa",
  "teletrabajo",
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
  "deport",
  "expuls",
  "illegal stay",
  "overstay",
  "permit to stay",
  "temporary protection",
  "внж",
  "гражданств",
  "иммиграц",
  "мигрант",
  "иностранц",
  "виз",
  "натурализ",
  "пмж",
  "вид на житель",
  "паспорт",
  "депортац",
  "высылк",
  "золотая виза",
  "золотой виз",
  "обманут",
  "инвестор",
  "серая зон",
  "переходн",
  // Schengen / borders
  "шенген",
  "schengen",
  "пограничн",
  "border control",
  "border check",
  "contrôles aux frontières",
  "controles en frontera",
  "controles fronter",
  "reintroduc",
  "temporary controls",
  // Tax / banking that relocators hit with status (LLM still filters fluff)
  "non-dom",
  "nhr ",
  "beckham",
  "tax resident",
  "налогов",
  "iban",
  "банк для",
  "открыть счёт",
  "abrir cuenta",
  "nif ",
  "nss ",
];

/** Hard noise — never #молния even if a keyword overlaps. */
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
  "eurovision",
  "formula 1",
  "f1 ",
  "nba ",
  "premier league",
];

/** Same floor as site story tiles; lightning quality comes from keyword gate, not a higher score. */
export const LIGHTNING_MIN_STORY_SCORE = 14;

/** Channel-wide daily cap for lightning posts (all corridors). */
export const LIGHTNING_MAX_PER_DAY = 5;

/** Stored in telegram_html when story was evaluated and is not for the channel. */
export const LIGHTNING_SKIP_MARK = "__skip_lightning__";

/** Stored in threads_text while awaiting owner DM approval (telegram_html = draft). */
export const LIGHTNING_PENDING_MARK = "__lightning_pending__";

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

/** Owner still approves in DM — lower bar so useful borderline items reach the queue. */
const LLM_MIN_CONFIDENCE = 0.55;

/**
 * Second gate (Gemini Flash): relocator-useful news for RU audience.
 * Channel publish still requires owner DM approve — prefer sending borderline items.
 * Fail-closed only on API/parse errors.
 */
export async function scoreLightningWithLlm(params: {
  countryRu: string;
  title: string;
  excerpt: string;
  originalTitle?: string;
  paragraphs?: string[];
}): Promise<LightningLlmVerdict> {
  const { geminiFastJson } = await import("@/lib/news/gemini");

  const system = `You are a pre-filter for Emigro Telegram @Emigro_news («молния»).
Audience: Russian-speaking relocators (RU/BY/UA/KZ) in / toward Europe.
The owner will approve or reject in DM — you are NOT the final publisher. Prefer publish=true when useful.

APPROVE (publish=true) when the item helps a relocator with:
- visa / residence / work permit / Blue Card / citizenship / naturalization / asylum / borders / Schengen controls
- agency procedure, fees, quotas, timelines (AIMA, IND, UDI, BAMF, prefecture, extranjería…)
- tax/banking/NIF/IBAN/registration that clearly affects people with or seeking residence status
- housing/jobs ONLY if tied to residence status, foreigner rules, or permit eligibility
- enforcement that changes options (deportation rules, illegal stay crackdowns)

REJECT (publish=false) only for clear noise:
- crime/drugs/sport/celebs/weather/cyber/tourism fluff with no relocator angle
- pure party politics or elections without a concrete rule/procedure change
- generic lifestyle with zero status/visa/tax-for-residents hook

When unsure but there is any relocator angle → publish=true with confidence 0.55–0.7.
Reply with JSON only matching the schema (no prose, no markdown).`;

  const user = `Decide publish true/false for this story.\n${JSON.stringify({
    country: params.countryRu,
    title: params.title,
    excerpt: params.excerpt,
    original_title: params.originalTitle ?? "",
    body_preview: (params.paragraphs ?? []).slice(0, 3).join("\n").slice(0, 1200),
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

/** Short channel post: ⚡ #молния + country name in header + title + excerpt + Emigro link. */
export function buildLightningTelegramHtml(params: {
  flag: string;
  countryRu: string;
  title: string;
  excerpt: string;
  articleUrl: string;
  sourceLabel?: string;
}): string {
  const countryName = params.countryRu.trim();
  if (!countryName) {
    throw new Error("lightning post requires country name in header");
  }

  const title = escapeTelegramHtml(params.title.trim().slice(0, 120));
  const excerpt = escapeTelegramHtml(params.excerpt.trim().slice(0, 400));
  const country = escapeTelegramHtml(countryName);
  const flag = (params.flag || "").trim();
  const href = params.articleUrl.replace(/"/g, "&quot;");
  const source = params.sourceLabel
    ? `\n<i>${escapeTelegramHtml(params.sourceLabel)}</i>`
    : "";

  // Header always includes the country name (not flag-only).
  const header = flag
    ? `⚡ <b>#молния</b> · ${flag} <b>${country}</b>`
    : `⚡ <b>#молния</b> · <b>${country}</b>`;

  return [header, "", `<b>${title}</b>`, "", excerpt, source, "", `<a href="${href}">Читать на Emigro</a>`]
    .filter((line, i, arr) => !(line === "" && arr[i - 1] === ""))
    .join("\n")
    .trim();
}
