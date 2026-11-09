/**
 * Audience interest gate for Telegram city channels.
 * Runs before draft/publish: dull or off-audience stories never go live.
 */
import { geminiFastJson } from "@/lib/news/gemini";

export type ChannelAudience = "italy" | "portugal_norte";

export type AudienceGateInput = {
  channel: ChannelAudience;
  title: string;
  snippet?: string;
  /** Optional article excerpt (first ~1200 chars). */
  body?: string;
};

export type AudienceGateResult = {
  pass: boolean;
  score: number;
  reason: string;
};

const AUDIENCE: Record<
  ChannelAudience,
  { label: string; wants: string; rejects: string; minScore: number }
> = {
  italy: {
    label: "русскоязычные эмигранты и релоканты в Италии (уже живут или переезжают)",
    wants:
      "ПРИОРИТЕТ: новости полезные эмигранту — permesso/questura, codice fiscale, налоги/бонусы, жильё/аренда, работа, детсад/школа/универ, медицина (ospedale, ASL, ticket, assicurazione, vaccinazioni, screening), аэропорты/рейсы, дороги/ZTL, счета, цены. Культура и городские события — ок, если есть место/дата/куда сходить. Практический совет желателен, но не обязателен для прохода",
    rejects:
      "общие рассуждения «ни о чём», геополитика, уличная суета и чёрная хроника, сухой спорт (счёт/таблица), партийный шум, пустые пресс-релизы, зарубежные рынки без Италии",
    minScore: 6,
  },
  portugal_norte: {
    label: "русскоязычные эмигранты и релоканты в Порту / Norte (уже живут или переезжают)",
    wants:
      "ПРИОРИТЕТ: новости полезные эмигранту на севере — AIMA/visto/NIF, IRS/налоги, аренда/жильё/недвижимость (особенно новостройки, empreendimentos, preços, crédito à habitação), работа, детсад/школа/универ, медицина (SNS, hospital, seguro, vacinação), аэропорт Sá Carneiro, portagens/Via Verde, Andante/метро/CP, счета, цены. Культура Norte и спорт — вторично, но проходят если есть куда/когда/билет",
    rejects:
      "дженерал «ни о чём», геополитика, преступления, партийная политика, сухой спорт, Lisboa-культура без севера, пустые пресс-релизы",
    minScore: 6,
  },
};

const SCHEMA = {
  type: "OBJECT",
  properties: {
    interesting: { type: "BOOLEAN" },
    score: { type: "NUMBER" },
    reason: { type: "STRING" },
  },
  required: ["interesting", "score", "reason"],
};

/**
 * Would the target audience actually open and care about this story?
 * Fail closed on API errors (caller may continue to next candidate).
 */
export async function audienceInterestGate(input: AudienceGateInput): Promise<AudienceGateResult> {
  const profile = AUDIENCE[input.channel];
  const title = input.title.replace(/\s+/g, " ").trim();
  if (!title) return { pass: false, score: 0, reason: "empty title" };

  const snippet = (input.snippet || "").replace(/\s+/g, " ").trim().slice(0, 500);
  const body = (input.body || "").replace(/\s+/g, " ").trim().slice(0, 1200);

  try {
    const raw = await geminiFastJson<{
      interesting: boolean;
      score: number;
      reason: string;
    }>(
      `Ты гейткипер новостного Telegram-канала. Решаешь только одно: будет ли сюжет интересен аудитории.

Аудитория: ${profile.label}.
Интересно: ${profile.wants}.
Не интересно: ${profile.rejects}.

Приоритет: документы, налоги, жильё, работа, транспорт, аэропорты, медицина, образование, счета/цены.
Культура/городские события с местом и датой — тоже интересны (score 6–7).
Нужен конкретный факт. Практический совет желателен, но не обязателен.
Геополитика / сухой спорт / чёрная хроника — interesting=false.

Оцени 0–10. interesting=true если score >= ${profile.minScore}.
reason — одна короткая фраза по-русски. При сомнении на полезной городской новости — скорее true.`,
      `Заголовок: ${title}\nКратко: ${snippet || "—"}\nФрагмент: ${body || "—"}`,
      SCHEMA,
      1024,
      { thinkingBudget: 0 }
    );

    const score = clampScore(raw.score);
    const interesting = Boolean(raw.interesting) && score >= profile.minScore;
    const reason = (raw.reason || "").replace(/\s+/g, " ").trim().slice(0, 200) || (interesting ? "ok" : "weak");
    return { pass: interesting, score, reason };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    // Do not block the whole channel when Gemini truncates JSON — heuristic filters already ran.
    console.warn(`[audience-gate] ${input.channel} degraded (pass): ${msg}`);
    return { pass: true, score: profile.minScore, reason: `gate degraded: ${msg.slice(0, 100)}` };
  }
}

function clampScore(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(10, Math.round(n)));
}
