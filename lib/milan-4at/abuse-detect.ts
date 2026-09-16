/**
 * High-confidence detector for veiled prostitution / drug ads in relocant chats.
 * Used to DM Pavel a report signal — not for auto-bans or public replies.
 *
 * Design: normalize obfuscation → multi-signal score → only alert at high confidence.
 * Mid-band optional LLM confirm (must agree + high) before alert.
 */
import { openrouterJson } from "@/lib/llm/openrouter";

export type AbuseCategory = "prostitution" | "drugs" | "both";

export type AbuseHit = {
  category: AbuseCategory;
  confidence: "high" | "mid";
  score: number;
  reasons: string[];
  /** Normalized snippet for logs (truncated). */
  normalizedPreview: string;
};

/** Latin ↔ Cyrillic lookalikes used to bypass filters. */
const HOMOGLYPHS: Record<string, string> = {
  a: "а",
  e: "е",
  o: "о",
  p: "р",
  c: "с",
  y: "у",
  x: "х",
  k: "к",
  m: "м",
  t: "т",
  h: "н",
  b: "в",
  A: "а",
  E: "е",
  O: "о",
  P: "р",
  C: "с",
  Y: "у",
  X: "х",
  K: "к",
  M: "м",
  T: "т",
  H: "н",
  B: "в",
};

/** Word-ish boundary that works for Cyrillic (JS \\b does not). */
const WB = "(?<![а-яa-z0-9])";
const WE = "(?![а-яa-z0-9])";

/** Explicit / hard-to-miss terms (after normalize). */
const DRUG_EXPLICIT = new RegExp(
  `${WB}(?:меф(?:едрон)?|мефск|амф(?:етамин)?|кокаин|кокс|гаш(?:иш)?|гашик|mdma|мдма|lsd|лсд|экстази|экстаз|спайс|спайсы|героин|марихуан\\w*|ганджуб\\w*|шишк[аиу]|weed|cannabis|тетрагидроканнабинол|thc)${WE}`,
  "i"
);

const ESCORT_EXPLICIT = new RegExp(
  `${WB}(?:проститут\\w*|шлюх\\w*|путана\\w*|эскортниц\\w*|интим\\s*услуг\\w*|секс\\s*услуг\\w*|работа(?:ю|ет)?\\s*(?:индивидуалк\\w*|эскорт)|индивидуалк[аи]\\w*|call\\s*girl|escort\\s*girl)${WE}`,
  "i"
);

/** Soft drug lexicon — needs commercial context. */
const DRUG_SOFT = new RegExp(
  `${WB}(?:клад(?:ка|мен|ер)?|закладк[аиуе]|скорость|спид|speed|соль(?:\\s*для\\s*ванн)?|крист(?:алл)?|микс|ск\\s*микс|сккр|на\\s*пробу|кладмен|дроп(?:ер)?|наркот\\w*|наркотик\\w*|наркоторг\\w*|нарколавк\\w*)${WE}`,
  "i"
);

/** Soft escort lexicon — needs commercial / meet context. */
const ESCORT_SOFT = new RegExp(
  `${WB}(?:эскорт|escort|интим|массаж\\s*(?:с\\s*)?(?:окончани\\w*|релакс)|релакс\\s*массаж|gfe|допы?|апарт(?:ы|аменты)?|выезд\\s*(?:к\\s*вам|24)|принимаю\\s*(?:у\\s*себя|гостей)|час\\s*\\d+|на\\s*час|только\\s*предоплат\\w*|проверк[аи]\\s*платежеспособ\\w*|видео\\s*отзыв\\w*|агентств[оа]\\s*(?:эскорт|девуш\\w*))${WE}`,
  "i"
);

const COMMERCIAL = new RegExp(
  `${WB}(?:\\d+\\s*(?:€|eur|евро|₽|руб|btc|usdt|crypto)|цена|прайс|прайс[- ]?лист|заказ|купить|прода[мю]|доставк\\w*|в\\s*лс|в\\s*личк\\w*|пиши(?:те)?\\s*в\\s*лс|тг\\s*бот|telegram\\s*bot|@\\w{4,}bot)${WE}`,
  "i"
);

const MEET_SEX = new RegExp(
  `${WB}(?:на\\s*час|на\\s*ночь|на\\s*встречу|выезд|апарты|апартаменты|отель|гостиниц\\w*|индивидуально|без\\s*посредник\\w*|vip\\s*девуш\\w*|девушк[аи]\\s*(?:на\\s*)?час)${WE}`,
  "i"
);

const OBFUSCATION =
  /(?:[а-яa-z]\s+){4,}[а-яa-z]|[а-яa-z](?:[.*_·•\-–—]){1,}[а-яa-z]|[мm]\s*[еe]\s*[фf]|[эe]\s*[сc]\s*[кk]\s*[оo]\s*[рp]\s*[тt]/i;

const BENIGN = new RegExp(
  `${WB}(?:полин?ия|штраф|закон|статья\\s*ук|новост\\w*|расследован\\w*|как\\s*отказаться|зависимост\\w*|реабилитац\\w*|нарколог\\w*|алкогол\\w*|пиво|вино|соль\\s*(?:поварен\\w*|морск\\w*|для\\s*суп\\w*)|скорость\\s*(?:интернет\\w*|на\\s*трасс\\w*|авто|лимит)|массаж\\s*(?:спортив\\w*|медицин\\w*|детск\\w*|спин[ыи]|шеи)|педиатр\\w*|физиотерап\\w*|эскорт\\s*(?:машин\\w*|авто|сопровождени\\w*\\s*груза)|страхован\\w*)${WE}`,
  "i"
);

const HIGH_SCORE = 12;
const MID_SCORE = 7;

export function normalizeAbuseText(raw: string): string {
  let t = raw.toLowerCase().normalize("NFKC");
  t = t.replace(/[ё]/g, "е");
  // map latin lookalikes → cyrillic for RU slang matching
  t = t.replace(/[a-zA-Z]/g, (ch) => HOMOGLYPHS[ch] ?? ch);
  // strip zero-width; only un-obfuscate "м е ф" / "м.е.ф" style (single letters), not normal words
  t = t.replace(/[\u200b\u200c\u200d\ufeff]/g, "");
  t = t.replace(
    /(?:^|[^а-яa-z0-9])([а-яa-z](?:[.*_·•\-–—\s]{1,2}[а-яa-z]){2,})(?=$|[^а-яa-z0-9])/gi,
    (full, chunk: string) => {
      const prefix = full.slice(0, full.length - chunk.length);
      return prefix + chunk.replace(/[.*_·•\-–—\s]+/g, "");
    }
  );
  t = t.replace(/\s+/g, " ").trim();
  return t;
}

function pushReason(reasons: string[], reason: string) {
  if (!reasons.includes(reason)) reasons.push(reason);
}

/**
 * Heuristic score. Returns null if below mid threshold or benign-locked.
 */
export function scoreAbuseMessage(text: string): AbuseHit | null {
  const normalized = normalizeAbuseText(text);
  if (normalized.length < 12) return null;
  if (BENIGN.test(normalized) && !DRUG_EXPLICIT.test(normalized) && !ESCORT_EXPLICIT.test(normalized)) {
    return null;
  }

  let drug = 0;
  let escort = 0;
  const reasons: string[] = [];

  if (DRUG_EXPLICIT.test(normalized)) {
    drug += 10;
    pushReason(reasons, "explicit_drug_term");
  }
  if (ESCORT_EXPLICIT.test(normalized)) {
    escort += 10;
    pushReason(reasons, "explicit_escort_term");
  }
  if (DRUG_SOFT.test(normalized)) {
    drug += 4;
    pushReason(reasons, "soft_drug_slang");
  }
  if (ESCORT_SOFT.test(normalized)) {
    escort += 4;
    pushReason(reasons, "soft_escort_slang");
  }
  if (COMMERCIAL.test(normalized)) {
    if (drug > 0) drug += 3;
    if (escort > 0) escort += 3;
    if (drug > 0 || escort > 0) pushReason(reasons, "commercial_bid");
  }
  if (MEET_SEX.test(normalized) && escort > 0) {
    escort += 3;
    pushReason(reasons, "meet_outcall_context");
  }
  // emoji stacks common in escort spam
  if (/[🍑👄🍒🍓💎👑].*[🚗🏠]|[🚗🏠].*[🍑👄🍒🍓]/.test(text)) {
    escort += 5;
    pushReason(reasons, "escort_emoji_stack");
  }
  if (OBFUSCATION.test(text) && (drug > 0 || escort > 0)) {
    drug += drug > 0 ? 2 : 0;
    escort += escort > 0 ? 2 : 0;
    pushReason(reasons, "obfuscation");
  }
  // price + grams / dose pattern for drugs
  if (/\b\d+[.,]?\d*\s*(?:г|гр|грамм|g)\b/i.test(normalized) && drug > 0) {
    drug += 4;
    pushReason(reasons, "grams_price_pattern");
  }

  const score = Math.max(drug, escort);
  if (score < MID_SCORE) return null;

  let category: AbuseCategory;
  if (drug >= MID_SCORE && escort >= MID_SCORE) category = "both";
  else if (drug >= escort) category = "drugs";
  else category = "prostitution";

  const confidence: "high" | "mid" = score >= HIGH_SCORE ? "high" : "mid";

  return {
    category,
    confidence,
    score,
    reasons,
    normalizedPreview: normalized.slice(0, 160),
  };
}

type LlmConfirm = {
  illegal_ad: boolean;
  category: AbuseCategory | "none";
  confidence: "high" | "mid" | "low";
  reason: string;
};

/**
 * Second pass for mid-score hits only. Alert only if model says illegal_ad + high.
 */
export async function confirmAbuseWithLlm(text: string, heuristic: AbuseHit): Promise<AbuseHit | null> {
  if (heuristic.confidence === "high") return heuristic;

  const model = (process.env.MILAN4AT_ABUSE_MODEL || "google/gemini-2.5-flash").trim();
  const system = `Ты модератор русскоязычных Telegram-чатов релокантов (Милан/Комо).
Задача: отличить РЕКЛАМУ проституции/эскорта или продажу наркотиков (в т.ч. завуалированную) от обычного быта.
false positive недопустимы: соль для еды, скорость интернета, спортивный массаж, новости/жалобы на полицию — это НЕ ads.
Верни JSON: {"illegal_ad":bool,"category":"prostitution"|"drugs"|"both"|"none","confidence":"high"|"mid"|"low","reason":"кратко"}.
illegal_ad=true только при высокой уверенности, что это коммерческое предложение / набор клиента / продажа ПАВ.`;
  const user = `Heuristic: ${heuristic.category} score=${heuristic.score} [${heuristic.reasons.join(", ")}]\n\nТекст:\n${text.slice(0, 900)}`;

  try {
    const { data } = await openrouterJson<LlmConfirm>(model, system, user, 200, { temperature: 0 });

    if (!data.illegal_ad || data.confidence !== "high" || data.category === "none") {
      return null;
    }
    return {
      category: data.category,
      confidence: "high",
      score: heuristic.score + 5,
      reasons: [...heuristic.reasons, `llm:${(data.reason || "").slice(0, 80)}`],
      normalizedPreview: heuristic.normalizedPreview,
    };
  } catch {
    // Fail closed on mid: no alert without confirm
    return null;
  }
}

export async function detectAbuseHighConfidence(text: string): Promise<AbuseHit | null> {
  const scored = scoreAbuseMessage(text);
  if (!scored) return null;
  if (scored.confidence === "high") return scored;
  return confirmAbuseWithLlm(text, scored);
}

export function formatAbuseAlert(params: {
  url: string;
  channel: string;
  from?: string | null;
  hit: AbuseHit;
  text: string;
}): string {
  const who = params.from ? `from: ${params.from}` : "from: (unknown)";
  const preview = params.text.replace(/\s+/g, " ").trim().slice(0, 220);
  return [
    `⚠️ ABUSE ${params.hit.category.toUpperCase()} · ${params.hit.confidence} · score ${params.hit.score}`,
    params.url,
    who,
    `signals: ${params.hit.reasons.join(", ")}`,
    `preview: ${preview}`,
    "→ пожалуйся на акк/сообщение в Telegram",
  ].join("\n");
}
