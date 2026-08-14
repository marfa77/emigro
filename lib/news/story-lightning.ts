/**
 * «Молния» — relocator-relevant gate for @Emigro_news story posts.
 * Site tiles stay broad; Telegram still filters noise, but owner DM is the final call
 * (no auto-publish), so keyword + LLM gates are intentionally permissive.
 */

import {
  isCriticalInvestorRiskText,
  isPortugalGoldenVisaInvestorDisputeText,
} from "@/lib/news/scoring";

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

/** Payload for Threads reply-chain, stored after the pending mark as JSON. */
export type LightningThreadsPayload = {
  v: 1;
  headline: string;
  slides: string[];
  countryRu: string;
  flag?: string;
  pageUrl?: string;
};

export function isLightningPendingThreadsText(raw: string | null | undefined): boolean {
  return (raw ?? "").trim().startsWith(LIGHTNING_PENDING_MARK);
}

export function encodeLightningPendingThreadsText(
  payload?: LightningThreadsPayload | null
): string {
  if (!payload?.headline?.trim() || !(payload.slides?.length > 0)) {
    return LIGHTNING_PENDING_MARK;
  }
  return `${LIGHTNING_PENDING_MARK}\n${JSON.stringify({
    v: 1 as const,
    headline: payload.headline.trim(),
    slides: payload.slides.map((s) => s.trim()).filter(Boolean).slice(0, 5),
    countryRu: payload.countryRu.trim(),
    ...(payload.flag?.trim() ? { flag: payload.flag.trim() } : {}),
    ...(payload.pageUrl?.trim() ? { pageUrl: payload.pageUrl.trim() } : {}),
  } satisfies LightningThreadsPayload)}`;
}

export function parseLightningPendingThreadsText(
  raw: string | null | undefined
): LightningThreadsPayload | null {
  const t = (raw ?? "").trim();
  if (!t.startsWith(LIGHTNING_PENDING_MARK)) return null;
  const rest = t.slice(LIGHTNING_PENDING_MARK.length).trim();
  if (!rest) return null;
  try {
    const j = JSON.parse(rest) as Partial<LightningThreadsPayload>;
    const headline = String(j.headline || "").trim();
    const slides = (j.slides ?? []).map((s) => String(s || "").trim()).filter(Boolean);
    const countryRu = String(j.countryRu || "").trim();
    if (!headline || slides.length < 1 || !countryRu) return null;
    return {
      v: 1,
      headline,
      slides: slides.slice(0, 5),
      countryRu,
      ...(j.flag ? { flag: String(j.flag).trim() } : {}),
      ...(j.pageUrl ? { pageUrl: String(j.pageUrl).trim() } : {}),
    };
  } catch {
    return null;
  }
}

export function isLightningImmigrationText(text: string): boolean {
  const t = text.toLowerCase();
  if (LIGHTNING_REJECT.some((h) => t.includes(h))) return false;
  return LIGHTNING_IMMIGRATION_HINTS.some((h) => t.includes(h));
}

/**
 * Higher = earlier in @Emigro_news queue.
 * 100 — Portugal ARI/GV «серая зона» (invested for 5y passport, now stuck).
 * 80  — critical investor citizenship risk (5→10 etc.) any corridor.
 * 0   — normal relocator news.
 */
export function lightningChannelPriority(text: string, topicKey?: string): number {
  const t = text.toLowerCase();
  if (
    (topicKey === "portugal" || /portugal|португал/.test(t)) &&
    isPortugalGoldenVisaInvestorDisputeText(t)
  ) {
    return 100;
  }
  if (
    /golden visa|vistos?\s*gold|золотая виза|золотой виз/.test(t) &&
    /nacionalidade|nationality|citizenship|гражданств|aima|provedor|серая зон|grey zone|zona cinzent|10\s*anos|10 лет/.test(t)
  ) {
    return 90;
  }
  if (isCriticalInvestorRiskText(t)) return 80;
  return 0;
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
  /** Grey-zone / critical investor: prefer approve even at lower confidence. */
  preferPublish?: boolean;
}): Promise<LightningLlmVerdict> {
  const { geminiFastJson } = await import("@/lib/news/gemini");

  const system = `You are a pre-filter for Emigro Telegram @Emigro_news («молния»).
Audience: Russian-speaking relocators (RU/BY/UA/KZ) in / toward Europe.
The owner will approve or reject in DM — you are NOT the final publisher. Prefer publish=true when useful.

HIGHEST PRIORITY — almost always publish=true (confidence ≥0.85) when the story is about:
- Portugal Golden Visa / ARI / vistos gold investors in the «grey zone» (zona cinzenta): invested ~2021–2022 expecting ~5 years to passport, now stuck after Lei da Nacionalidade (5→10), clock from residence card, AIMA backlog, Provedoria, transitional regime, lawsuits vs Estado
- Any concrete update on that cohort (IRN, cartão, nationality application cutoff)

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
    channel_priority_hint: params.preferPublish
      ? "This item is pre-tagged as grey-zone / critical investor citizenship risk — prefer publish=true unless pure noise."
      : undefined,
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

  const minConf = params.preferPublish ? 0.4 : LLM_MIN_CONFIDENCE;

  try {
    // Flash 2.5 uses thinking tokens — keep headroom so JSON is not truncated.
    const result = await geminiFastJson<LightningLlmVerdict>(system, user, schema, 2048);
    const confidence = Number(result.confidence);
    const conf = Number.isFinite(confidence) ? Math.max(0, Math.min(1, confidence)) : 0;
    const publish = Boolean(result.publish) && conf >= minConf;
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

/** Short channel post: Threads-ready hook + slides (owner pastes into Threads later). */
export function buildLightningTelegramHtml(params: {
  flag: string;
  countryRu: string;
  title: string;
  excerpt: string;
  articleUrl: string;
  sourceLabel?: string;
  /** Optional Threads-repost slides (already rewritten). */
  slides?: string[];
}): string {
  const countryName = params.countryRu.trim();
  if (!countryName) {
    throw new Error("lightning post requires country name in header");
  }

  const title = escapeTelegramHtml(params.title.trim().slice(0, 160));
  const country = escapeTelegramHtml(countryName);
  const flag = (params.flag || "").trim();
  const href = params.articleUrl.replace(/"/g, "&quot;");
  const source = params.sourceLabel
    ? `\n<i>${escapeTelegramHtml(params.sourceLabel)}</i>`
    : "";

  const header = flag
    ? `⚡ <b>#молния</b> · ${flag} <b>${country}</b>`
    : `⚡ <b>#молния</b> · <b>${country}</b>`;

  const slides = (params.slides ?? [])
    .map((s) => escapeTelegramHtml(s.trim().slice(0, 320)))
    .filter(Boolean);

  const body =
    slides.length >= 2
      ? slides.join("\n\n")
      : escapeTelegramHtml(params.excerpt.trim().slice(0, 500));

  return [header, "", `<b>${title}</b>`, "", body, source, "", `<a href="${href}">Читать на Emigro</a>`]
    .filter((line, i, arr) => !(line === "" && arr[i - 1] === ""))
    .join("\n")
    .trim();
}
