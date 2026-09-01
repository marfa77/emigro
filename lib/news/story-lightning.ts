/**
 * «Молния» — relocator-relevant gate for @Emigro_news story posts.
 * Site tiles stay broad. Channel DMs only for RU/BY/UA/KZ living abroad or planning a move —
 * not British/US/AU expat explainers, evergreen primers, or housing/lifestyle copy without a
 * new operational fact (fee, date in force, quota, court holding, agency procedure).
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

/** Same floor as site story tiles; lightning quality is the strength gate, not a higher score. */
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
/** Threads already live via owner ✅ — Sunday cron must not repost. Not an owner-await mark. */
export const LIGHTNING_THREADS_PUBLISHED_MARK = "__lightning_threads_published__";

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

/** Owner already published this story to @emigro2eu (lg:th ✅) or Threads is live while TG waits. */
export function isLightningThreadsAlreadyPosted(raw: string | null | undefined): boolean {
  const t = (raw ?? "").trim();
  if (t.startsWith(LIGHTNING_THREADS_PUBLISHED_MARK)) return true;
  return lightningOwnerMarkOf(t) === LIGHTNING_TG_PENDING_MARK;
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

/** Party talk / leak without a voted rule or date in force. */
const POLITICAL_TALK_RE =
  /предлага|предложил|хотят вернуть|выступил против|идея[ —–-]|случайно (?:слил|рассказ)|обнародовал[аи]? внутренн|черновик с двумя|не исключают поддержки|сигнал ясен|готовы к .{0,40}гражданств/i;

const ENACTED_RULE_RE =
  /вступает в силу|вступают в силу|enter(?:s)? into force|принят[оа]? (?:закон|поправк)|голосован|постановлен\w* суд|верховн\w+ суд|supreme court|decreto-lei|royal decree|boe[ -]|уже в силе/i;

const EVERGREEN_PRIMER_RE: RegExp[] = [
  /не одно и то же/i,
  /чем отличает(?:ся|ся)/i,
  /путаниц[аеу].{0,40}шенген/i,
  /шенген.{0,80}(?:не (?:внж|одно|вид на житель)|свободн\w+ передвижен|туризм до 90)/i,
  /schengen.{0,80}(?:not (?:residence|the same)|freedom of movement|90 days)/i,
  /словарь для|ключев\w+ термин/i,
  /что нужно знать на месте/i,
  /сколько денег нужно.{0,40}переезд/i,
  /зависит от города, работы и типа внж/i,
  /разбирает.{0,50}(?:чем отлича|путаниц|термин|первоначальн\w+ расход|что это значит)/i,
  /the local (?:разбирает|опросил|спрашивает)/i,
];

const HOUSING_MARKET_RE =
  /цен\w* на жиль|рост.{0,24}жиль|housing price|rental market|rent cap|студенческ\w*.{0,12}жил|общежит|student housing|аренд\w+ кризис|дефицит жилья|квартир\w* дорож|мировой рекорд.{0,24}жиль|восьми лет строительства|не найти комнату/i;

const VISA_HOUSING_EXCEPTION_RE =
  /подтверждени\w* (?:доход|средств)|minimum income|proof of (?:funds|accommodation)|для (?:визы|внж)|d7\b|nhr\b|достаточн\w+ средств/i;

const LIFESTYLE_NOT_STATUS_RE =
  /зарплат|покупательн\w+ способност|расизм|здравоохранен|очереди к врачам|частн\w+ медицин|грант.{0,24}на уход|care grant|data-специалист|удаленка для европейских|инфлюенс|influencer|инвестиции .{0,20}упали|налогов\w+ проверили инфлюенс/i;

const INDIVIDUAL_ANECDOTE_RE =
  /\d+-летн\w+ .{0,40}депортир|татуир|шпион|сотрудничество с .{0,20}разведк|\bгру\b|за ночь задержали|арестованы шесть|купил дом .{0,40}грозят снести/i;

const CONCRETE_DETAIL_RE: RegExp[] = [
  /€\s?\d|£\s?\d|\$\s?\d|\d[\d\s.]{0,8}\s*(?:евро|gbp|eur)\b/i,
  /\d{1,2}[./]\d{1,2}[./]\d{2,4}/,
  /\d{1,2}\s+(?:январ|феврал|март|апрел|ма[йя]|июн|июл|август|сентябр|октябр|ноябр|декабр)\w*/i,
  /(?:from|с)\s+\d{1,2}\s+\w+\s+\d{4}/i,
  /вступает в силу|вступают в силу|enter(?:s)? into force/i,
  /\d+\s*[→\-–]\s*\d+\s*(?:лет|year|anos)/i,
  /(?:пошлин|квот[аыеу]|срок.{0,12}(?:лет|месяц|дн)|deadline|\bfee[s]?\b).{0,24}\d|\d.{0,24}(?:пошлин|квот|евро|лет законного)/i,
  /верховн\w+ суд|supreme court|decreto-lei|lei da nacionalidade|boe-a-|royal decree/i,
  /\b(?:aima|ukvi|ind\b|udi|bamf|irn|extranjer|migrationsverket|home office|ma35)\b.{0,80}(?:\d+|срок|очеред|квот|пошлин|запис|backlog|fee|deadline|правил)/i,
];

export function hasLightningConcreteDetail(text: string): boolean {
  return CONCRETE_DETAIL_RE.some((re) => re.test(text));
}

/**
 * Weak / already-known copy must not reach owner DM.
 * Site tiles can stay broad. Channel only wants a new operational fact.
 */
export function lightningStrengthSkipReason(
  text: string,
  options?: { allowSoftConcrete?: boolean }
): string | null {
  const t = text;
  if (EVERGREEN_PRIMER_RE.some((re) => re.test(t))) return "evergreen-primer";
  if (HOUSING_MARKET_RE.test(t) && !VISA_HOUSING_EXCEPTION_RE.test(t)) return "housing-market";
  if (LIFESTYLE_NOT_STATUS_RE.test(t)) return "lifestyle-not-status";
  if (INDIVIDUAL_ANECDOTE_RE.test(t)) return "individual-anecdote";
  if (POLITICAL_TALK_RE.test(t) && !ENACTED_RULE_RE.test(t)) return "political-talk";
  if (!options?.allowSoftConcrete && !hasLightningConcreteDetail(t)) return "no-concrete-detail";
  return null;
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

/** Owner still approves in DM — keyword gates already ran; this is the last quality cut. */
const LLM_MIN_CONFIDENCE = 0.8;

/**
 * Second gate (Gemini Flash): new operational fact for RU relocators, not a primer.
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

  const system = `You are a strict pre-filter for Emigro Telegram @Emigro_news («молния»).
Audience: Russian-speaking people (passports RU/BY/UA/KZ) who already live in Europe/hubs OR are planning a move.
You are NOT the final publisher (owner approves in DM). Default is publish=false. Almost every item should be rejected.

HIGHEST PRIORITY — publish=true (confidence ≥0.85) only when the story is about:
- Portugal Golden Visa / ARI / vistos gold investors in the «grey zone» (zona cinzenta): invested ~2021–2022 expecting ~5 years to passport, now stuck after Lei da Nacionalidade (5→10), clock from residence card, AIMA backlog, Provedoria, transitional regime, lawsuits vs Estado
- A concrete update on that cohort (IRN, cartão, nationality application cutoff)

APPROVE (publish=true) only if ALL are true:
1) A RU/BY/UA/KZ third-country national would change a visa/ВНЖ/citizenship/border/tax-residency decision THIS WEEK.
2) The story has a NEW operational fact with a number, date in force, fee, quota, court holding, or named agency procedure — not a recap of rules everyone already knows.
3) The affected people are not Brits/US/AU/CA expats and not intra-EU movers.

Examples that PASS: UKVI Skilled Worker fee table with £ and a date; EES/TIE deadline in days that just changed; court ruling that reopens citizenship files; law 5→10 years that entered into force; AIMA/IND/BAMF new quota or appointment rule with a figure.

REJECT (publish=false) — owner already rejects these:
- Evergreen primers: «Шенген ≠ ВНЖ», Schengen vs EU freedom of movement, «что это значит», glossaries, «словарь для permesso», cost-of-moving explainers
- Housing/rent/student rooms/price indexes, unless the number is a visa income or proof-of-funds threshold
- Salary stats, healthcare queues, racism surveys, influencer tax raids, job-hub thinkpieces
- One person's deportation, tattoos, spy trial, house demolition
- Party wishes, leaked drafts, «готовы поддержать» without a voted law + date in force
- British/US/AU/CA expat framing; intra-EU free movement; Working Holiday for Spaniards/Portuguese to Australia
- Crime/drugs/sport/celebs/weather/tourism fluff

When unsure, or the fact is already common knowledge without a new date/fee/quota → publish=false.
Reply with JSON only matching the schema (no prose, no markdown).`;

  const user = `Decide publish true/false. Reject primers and market/lifestyle copy.\n${JSON.stringify({
    country: params.countryRu,
    title: params.title,
    excerpt: params.excerpt,
    original_title: params.originalTitle ?? "",
    body_preview: (params.paragraphs ?? []).slice(0, 3).join("\n").slice(0, 1200),
    channel_priority_hint: params.preferPublish
      ? "This item is pre-tagged as grey-zone / critical investor citizenship risk — prefer publish=true unless pure noise."
      : "No grey-zone tag. Demand a new concrete operational fact.",
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
