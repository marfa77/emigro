/**
 * «Молния» — relocator-relevant gate for @Emigro_news story posts.
 * Site tiles stay broad. Channel DMs only for RU/BY/UA/KZ living abroad or planning a move —
 * not British/US/AU expat explainers, even if they mention a visa.
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
/** TG already published; Threads still awaiting owner. */
export const LIGHTNING_THREADS_PENDING_MARK = "__lightning_threads_pending__";
/** Threads already published; Telegram still awaiting owner. */
export const LIGHTNING_TG_PENDING_MARK = "__lightning_tg_pending__";

export const LIGHTNING_OWNER_MARKS = [
  LIGHTNING_PENDING_MARK,
  LIGHTNING_THREADS_PENDING_MARK,
  LIGHTNING_TG_PENDING_MARK,
] as const;

export type LightningOwnerMark = (typeof LIGHTNING_OWNER_MARKS)[number];

/** Payload for Threads reply-chain, stored after the pending mark as JSON. */
export type LightningThreadsPayload = {
  v: 1;
  headline: string;
  slides: string[];
  countryRu: string;
  flag?: string;
  pageUrl?: string;
  /** @deprecated unused — root posts are text-only. */
  imageUrl?: string;
};

export function lightningOwnerMarkOf(raw: string | null | undefined): LightningOwnerMark | null {
  const t = (raw ?? "").trim();
  for (const mark of LIGHTNING_OWNER_MARKS) {
    if (t.startsWith(mark)) return mark;
  }
  return null;
}

/** True while owner still owes a TG and/or Threads decision. */
export function isLightningAwaitingOwner(raw: string | null | undefined): boolean {
  return lightningOwnerMarkOf(raw) != null;
}

/**
 * Used only for optional stale re-ping (resendStaleLightningOwnerDm).
 * Pending молнии do not block new approval DMs for other stories.
 */
export function blocksNewLightningApprovalDm(raw: string | null | undefined): boolean {
  const mark = lightningOwnerMarkOf(raw);
  if (!mark) return false;
  if (mark === LIGHTNING_THREADS_PENDING_MARK) return false;
  return true;
}

/** @deprecated use isLightningAwaitingOwner */
export function isLightningPendingThreadsText(raw: string | null | undefined): boolean {
  return isLightningAwaitingOwner(raw);
}

export function encodeLightningPendingThreadsText(
  payload?: LightningThreadsPayload | null,
  mark: LightningOwnerMark = LIGHTNING_PENDING_MARK
): string {
  if (!payload?.headline?.trim() || !(payload.slides?.length > 0)) {
    return mark;
  }
  return `${mark}\n${JSON.stringify({
    v: 1 as const,
    headline: payload.headline.trim(),
    slides: payload.slides.map((s) => s.trim()).filter(Boolean).slice(0, 5),
    countryRu: payload.countryRu.trim(),
    ...(payload.flag?.trim() ? { flag: payload.flag.trim() } : {}),
    ...(payload.pageUrl?.trim() ? { pageUrl: payload.pageUrl.trim() } : {}),
    ...(payload.imageUrl?.trim() ? { imageUrl: payload.imageUrl.trim() } : {}),
  } satisfies LightningThreadsPayload)}`;
}

export function parseLightningPendingThreadsText(
  raw: string | null | undefined
): LightningThreadsPayload | null {
  const mark = lightningOwnerMarkOf(raw);
  if (!mark) return null;
  const t = (raw ?? "").trim();
  const rest = t.slice(mark.length).trim();
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
      ...(j.imageUrl ? { imageUrl: String(j.imageUrl).trim() } : {}),
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
 * Channel audience is Russian-speaking (RU/BY/UA/KZ) already abroad or planning a move.
 * The Local often frames EU rules as «for Brits» — those must not reach owner DM.
 * UK as a *destination* (Skilled Worker, ILR, UKVI fees) still passes.
 */
const WRONG_COHORT_RE: RegExp[] = [
  /\bbrits?\b/i,
  /british expats?/i,
  /british nationals?/i,
  /british pensioners?/i,
  /uk (?:citizens?|nationals?|expats?|pensioners?)/i,
  /британц/i,
  /бритов/i,
  /британск(?:их|ие|ого|им) (?:экспат|пенсионер|граждан|поддан)/i,
  /англичан/i,
  /подданн\w+ великобритан/i,
  /brexit brit/i,
  /after brexit.{0,60}(?:spain|portugal|france|italy|germany|eu\b)/i,
  /americans? in (?:spain|portugal|france|germany|italy)/i,
  /american expats?/i,
  /australian expats?/i,
  /canadian expats?/i,
  /америк(?:анц|анск\w* экспат)/i,
  /гражданам? (?:великобритании|сша|канады|австралии)/i,
  /для британц/i,
  /what brits (?:need|should|must)/i,
];

const UK_AS_DESTINATION_RE =
  /skilled worker|global talent|indefinite leave|\bilr\b|ukvi\b|home office (?:visa|fee)|виза в великобритан|внж великобритан|graduate visa|innovator founder|scale-up visa/i;

export function lightningAudienceSkipReason(text: string): string | null {
  const t = text.toLowerCase();
  const wrongCohort = WRONG_COHORT_RE.some((re) => re.test(t));
  if (!wrongCohort) return null;
  if (UK_AS_DESTINATION_RE.test(t) && !/\bbrits?\b|british expats?|британц|англичан/i.test(t)) {
    return null;
  }
  return "not-ru-audience";
}

export function isLightningRuAudienceText(text: string): boolean {
  return lightningAudienceSkipReason(text) == null;
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

/** Owner still approves in DM — but only after RU-audience + immigration gates. */
const LLM_MIN_CONFIDENCE = 0.6;

/**
 * Second gate (Gemini Flash): useful for Russian-speaking relocators, not generic expats.
 * Fail-closed on API/parse errors.
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
Audience: Russian-speaking people (passports RU/BY/UA/KZ) who already live in Europe/hubs OR are planning a move.
You are NOT the final publisher (owner approves in DM), but you MUST NOT send irrelevant items.

HIGHEST PRIORITY — almost always publish=true (confidence ≥0.85) when the story is about:
- Portugal Golden Visa / ARI / vistos gold investors in the «grey zone» (zona cinzenta): invested ~2021–2022 expecting ~5 years to passport, now stuck after Lei da Nacionalidade (5→10), clock from residence card, AIMA backlog, Provedoria, transitional regime, lawsuits vs Estado
- Any concrete update on that cohort (IRN, cartão, nationality application cutoff)

APPROVE (publish=true) only if a RU/BY/UA/KZ reader would change a decision (visa, ВНЖ, citizenship, borders, tax/bank tied to status):
- visa / residence / work permit / Blue Card / citizenship / naturalization / asylum / Schengen / EES
- agency procedure, fees, quotas, timelines (AIMA, IND, UDI, BAMF, prefecture, extranjería…)
- tax/banking/NIF/IBAN that affects people with or seeking residence
- UK as a *destination* (Skilled Worker, ILR, UKVI fees) for applicants from CIS

REJECT (publish=false) — including when the article is “about immigration” but the affected people are the wrong cohort:
- British/UK expats, Brits in Spain/Portugal/France, Brexit Brits, British pensioners abroad
- Americans / Australians / Canadians as the protagonists
- Intra-EU citizens using freedom of movement
- “What Brits need to know about …” even if the underlying Spanish/Portuguese rule is real
- crime/drugs/sport/celebs/weather/cyber/tourism fluff
- pure party politics without a concrete rule change for third-country nationals

When the story is written for The Local’s British readers and you cannot restate it as a rule for third-country nationals from RU/BY/UA/KZ → publish=false.
When unsure whether our audience is affected → publish=false (do not dump it on the owner).
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
