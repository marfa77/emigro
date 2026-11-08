import fs from "fs";
import path from "path";
import { geminiFastJson } from "@/lib/news/gemini";
import {
  SHORT_DURATION_ESTIMATE_TARGET,
  SHORT_DURATION_TARGET_MIN,
  SCRIPT_QA_MAX_ATTEMPTS,
} from "./config";
import { normalizeHighlightStats, type HighlightStat } from "./highlight-stats";
import {
  buildTipSegments,
  countSpokenWords,
  durationTargetBandLabel,
  estimateTipDurationSeconds,
  maxWordsForDuration,
  minWordsForDuration,
} from "./tip-script";
import { compact, wordCount } from "./text-utils";
import type { TipShortTopic } from "./topics";

export type TipShortScript = {
  hook: string;
  body: string;
  cta: string;
  visual_hook: string;
  visual_body: string;
  youtube_title: string;
  description_bullets: string[];
  highlight_stats: HighlightStat[];
};

const SCRIPT_SCHEMA = {
  type: "OBJECT",
  properties: {
    hook: { type: "STRING" },
    body: { type: "STRING" },
    cta: { type: "STRING" },
    visual_hook: { type: "STRING" },
    visual_body: { type: "STRING" },
    youtube_title: { type: "STRING" },
    description_bullets: { type: "ARRAY", items: { type: "STRING" } },
    highlight_stats: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: { value: { type: "STRING" }, label: { type: "STRING" } },
        required: ["value", "label"],
      },
    },
  },
  required: ["hook", "body", "cta", "visual_hook", "visual_body", "youtube_title", "description_bullets", "highlight_stats"],
};

const QA_MIN_WORDS = minWordsForDuration(SHORT_DURATION_TARGET_MIN);
const QA_MAX_WORDS = maxWordsForDuration(SHORT_DURATION_ESTIMATE_TARGET);

const SYSTEM = `Ты сценарист YouTube Shorts уровня топ-авторов. Канал @Emigro_news, зрители — русскоязычные релоканты (фокус: Португалия). Задача: зритель не свайпает первые 2 секунды, досматривает до конца и пишет комментарий.

Длина: ${QA_MIN_WORDS}–${QA_MAX_WORDS} слов всего (hook + body + cta), 30–45 секунд озвучки.

HOOK (первая секунда решает всё), 5–12 слов. Одна из формул, на фактах темы:
- ошибка и цена: «Эта ошибка с NIF стоит вам месяца ожидания.»
- запрет: «Не идите в AIMA, пока не сделали вот это.»
- цифра: «Четырнадцать дней — и без этого письма ВНЖ не продлить.»
- обещание шагов: «Продление ВНЖ в Португалии за три шага.»
Запрещено начинать с вопроса «Куда/Как/Что…?», с «Сегодня», «Привет», «В этом видео».

BODY, 40–62 слова. Только конкретика из заметки и фактов ниже:
- 2–3 шага или «ошибка → как правильно». Шаги называй «Первое… Второе… Третье…».
- Названия порталов, органов, документов, сроки и суммы — как в фактах. Нет факта — не пиши цифру.
- Каждое предложение до 12 слов. Ритм: коротко, коротко, ещё короче.
- Запрещено: «зависит от ситуации», «следуйте своему кабинету», «универсальные советы», «важно отметить», «на самом деле», «не секрет», канцелярит, новостной тон.

CTA, 6–12 слов: один живой вопрос по теме, на который хочется ответить в комментариях («А вам сколько ждать пришлось?»). Без «подписывайтесь» и без ссылок — ссылка будет в описании.

Озвучка: числа и даты словами («четырнадцать дней», «в две тысячи двадцать шестом»), без цифр в hook/body/cta.

Экран:
- visual_hook: 3–7 слов, самый сильный тезис, можно с цифрами («Продление ВНЖ: 3 шага»). Это первое, что видит зритель. Обещай только то, что реально есть в body и фактах: никаких «без очереди», «за день», «гарантированно», если этого нет в фактах.
- visual_body: до 12 слов, суть шагов.
- highlight_stats: 1–2 крупные цифры из фактов (value: «€1200», «14», «3»; label: «дней на ответ», «шага»). Не выдумывай.
- youtube_title: до 70 символов, с главным ключом и цифрой, честно.
- description_bullets: 3–4 пункта для описания.`;

function loadGuideContext(slug: string): string {
  try {
    const guidePath = path.join(process.cwd(), "content/guides/ru", `${slug}.md`);
    if (!fs.existsSync(guidePath)) return "";
    const raw = fs.readFileSync(guidePath, "utf8");
    const body = raw.replace(/^---[\s\S]*?---\n/, "").slice(0, 4000);
    const qa = raw.match(/quick_answer:\s*"([^"]+)"/)?.[1];
    return [qa ? `Quick answer: ${qa}` : "", body].filter(Boolean).join("\n\n");
  } catch {
    return "";
  }
}

/** Drop filler sentences from source text so the model cannot copy them into the script. */
function stripVagueSentences(text: string): string {
  return text
    .split(/(?<=[.!?…])\s+/)
    .filter((sentence) => !VAGUE_BANNED.test(sentence))
    .join(" ");
}

function userPrompt(topic: TipShortTopic): string {
  const guideContext = topic.guide_slug ? loadGuideContext(topic.guide_slug) : "";
  const noteContext = topic.note_context
    ? `\nЗаметка с portugal.emigro.online (кратко):\n${stripVagueSentences(topic.note_context.slice(0, 2000))}`
    : topic.note_url
      ? `\nИсточник: ${topic.note_url}`
      : "";
  return [
    `Тема: ${topic.title}`,
    `Формат: ${topic.format}`,
    `Страна: ${topic.country}`,
    `Крючок (энергия): ${topic.hookSeed}`,
    noteContext,
    "",
    "Факты (используй только проверенное, не выдумывай новые цифры):",
    ...topic.facts.map(stripVagueSentences).filter((f) => f.trim()).map((f) => `- ${f}`),
    guideContext ? `\nКонтекст из гайда Emigro:\n${guideContext.slice(0, topic.note_context ? 1200 : 2500)}` : "",
  ].join("\n");
}

const VAGUE_BANNED = /(зависит от (вашей )?ситуац|следуйте своему|универсальн\S* совет|важно отметить|на самом деле|не секрет)/i;

const NEWS_BANNED = /\b(новост|на этой неделе|сегодня сообщ|правительство объяв|парламент принял|breaking|дайджест)\b/i;

function isTooLongError(error: string): boolean {
  return (
    error.includes("too long") ||
    /total words \d+ \(want \d+–\d+/.test(error) && error.includes("total words") && Number(error.match(/total words (\d+)/)?.[1] ?? 0) > QA_MAX_WORDS
  );
}

function isTooShortError(error: string): boolean {
  return (
    error.includes("too short") ||
    error.includes("body too short") ||
    (/total words (\d+)/.test(error) && Number(error.match(/total words (\d+)/)?.[1] ?? 999) < QA_MIN_WORDS)
  );
}

function buildRetryHint(errors: string[]): string {
  const joined = errors.join("; ");
  const base = `\n\nПредыдущая версия не прошла QA: ${joined}. Цель: ${durationTargetBandLabel()} озвучки (${QA_MIN_WORDS}–${QA_MAX_WORDS} слов всего, оценка ≤${SHORT_DURATION_ESTIMATE_TARGET}s).`;

  const tooLong = errors.some(isTooLongError);
  const tooShort = errors.some(isTooShortError);

  if (tooLong && !tooShort) {
    return `${base} СОКРАТИ: убери 12–20 слов из body, оставь только 2 главных факта. Не расширяй hook и cta. Перепиши body короче, без повторов и вводных фраз.`;
  }
  if (tooShort && !tooLong) {
    return `${base} РАСШИРЬ body: добавь 1–2 конкретных факта из темы (€, сроки, названия). Не раздувай hook и cta.`;
  }
  if (tooLong && tooShort) {
    return `${base} Перепиши body заново: 2 факта, ${QA_MIN_WORDS}–${QA_MAX_WORDS} слов всего, без воды.`;
  }
  return `${base} Исправь замечания QA, сохрани ${QA_MIN_WORDS}–${QA_MAX_WORDS} слов всего.`;
}

function validateScript(script: TipShortScript, topic: TipShortTopic): string[] {
  const errors: string[] = [];
  const totalWords = countSpokenWords(script);
  const hookWords = wordCount(script.hook);
  const minWords = QA_MIN_WORDS;
  const maxWords = QA_MAX_WORDS;

  if (hookWords < 5 || hookWords > 14) errors.push(`hook word count ${hookWords} (want 5–12)`);
  if (/^(куда|как|что|почему|зачем|сегодня|привет|в этом видео)\b/i.test(script.hook.trim())) {
    errors.push("hook opens with a weak question/greeting — use mistake, ban, number or N-steps formula");
  }
  const vague = `${script.hook} ${script.body} ${script.cta}`.match(VAGUE_BANNED);
  if (vague) errors.push(`vague filler phrase «${vague[0]}» — delete it and write the concrete step from the facts instead`);
  if (wordCount(script.visual_hook) > 8) errors.push(`visual_hook ${wordCount(script.visual_hook)} words (want 3–7)`);
  if (totalWords < minWords || totalWords > maxWords) {
    errors.push(`total words ${totalWords} (want ${minWords}–${maxWords} for ${durationTargetBandLabel()})`);
  }
  if (NEWS_BANNED.test(`${script.hook} ${script.body} ${script.cta}`)) errors.push("news-style language detected");
  if (!/[.!?…]$/.test(script.hook.trim())) errors.push("hook must end with punctuation");
  if (wordCount(script.body) < 40) errors.push("body too short");

  const segments = buildTipSegments(script, topic);
  const estimate = estimateTipDurationSeconds(segments);
  if (estimate < SHORT_DURATION_TARGET_MIN) {
    errors.push(
      `estimated duration ${estimate.toFixed(1)}s too short (need ${durationTargetBandLabel()}, expand body with facts from the topic)`
    );
  } else if (estimate > SHORT_DURATION_ESTIMATE_TARGET) {
    errors.push(
      `estimated duration ${estimate.toFixed(1)}s too long (need ≤${SHORT_DURATION_ESTIMATE_TARGET}s estimate, ${durationTargetBandLabel()} target band, shorten body)`
    );
  }

  return errors;
}

export async function writeTipShortScript(topic: TipShortTopic): Promise<TipShortScript> {
  let lastErrors: string[] = [];

  for (let attempt = 0; attempt < SCRIPT_QA_MAX_ATTEMPTS; attempt += 1) {
    const retryHint = attempt === 0 ? "" : buildRetryHint(lastErrors);

    let script: TipShortScript;
    let lastJsonError: Error | undefined;
    for (let jsonAttempt = 0; jsonAttempt < 3; jsonAttempt += 1) {
      try {
        script = await geminiFastJson<TipShortScript>(
          SYSTEM,
          userPrompt(topic) + retryHint,
          SCRIPT_SCHEMA,
          8192
        );
        lastJsonError = undefined;
        break;
      } catch (error) {
        lastJsonError = error instanceof Error ? error : new Error(String(error));
        const retryable =
          /invalid JSON/i.test(lastJsonError.message) || /empty response/i.test(lastJsonError.message);
        if (!retryable || jsonAttempt >= 2) throw lastJsonError;
        console.warn(
          `[script] Gemini JSON retry ${jsonAttempt + 2}/3 for ${topic.id}: ${lastJsonError.message}`
        );
      }
    }
    if (!script!) {
      throw lastJsonError ?? new Error("Gemini script generation failed");
    }

    const normalized: TipShortScript = {
      hook: compact(script.hook),
      body: compact(script.body),
      cta: compact(script.cta),
      visual_hook: compact(script.visual_hook || script.hook),
      visual_body: compact(script.visual_body || topic.title),
      youtube_title: compact(script.youtube_title || topic.title),
      description_bullets: (script.description_bullets ?? topic.facts).map(compact).slice(0, 4),
      highlight_stats: normalizeHighlightStats(script.highlight_stats, `${script.hook} ${script.body} ${script.cta}`),
    };

    const errors = validateScript(normalized, topic);
    if (errors.length === 0) return normalized;
    lastErrors = errors;
    console.warn(
      `[script] QA attempt ${attempt + 1}/${SCRIPT_QA_MAX_ATTEMPTS} for ${topic.id}: ${errors.join("; ")} (${countSpokenWords(normalized)} words)`
    );
  }

  throw new Error(`Tip script QA failed: ${lastErrors.join("; ")}`);
}
