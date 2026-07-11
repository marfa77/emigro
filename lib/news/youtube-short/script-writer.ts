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

const SYSTEM = `Ты пишешь сценарии YouTube Shorts для канала @Emigro_news — русскоязычные релоканты в Европу (фокус: Португалия).

Формат Short:
- 30–45 секунд озвучки (строго ${QA_MIN_WORDS}–${QA_MAX_WORDS} слов всего: hook + body + cta; короче лучше — длинный текст не влезет в Short)
- Один факт или лайфхак, НЕ новости и НЕ дайджест
- Крючок в первые 2 секунды — провокационный, конкретный, без «сегодня», «на этой неделе», «новость»
- После крючка — сразу суть: цифры, шаги, ошибки
- CTA мягкий: emigro.online или подписка, без агрессивной рекламы. Обязательно вопрос в конце для комментариев.

Стиль:
- Разговорный русский, «вы» или без местоимения
- Короткие предложения
- Конкретика: €, сроки, названия (NIF, AIMA, D7, D8, IBAN)
- Числа и сроки для озвучки: пиши «трёхлетняя гарантия», «четырнадцать дней», «в две тысячи двадцать шестом» — не «3-летняя», не «14 дней», не «2026»
- Запрещено: «важно отметить», «на самом деле», «не секрет что», новостной тон

Структура JSON:
- hook: 5–14 слов, удар с первой секунды
- body: 38–58 слов — один лайфхак или 2–3 пункта; максимум 2 факта с €/сроками
- cta: 8–12 слов — закончи **вопросом для комментариев**
- visual_hook / visual_body: короткие тексты на экран (до 12 / 18 слов)
- youtube_title: до 70 символов, кликабельный но честный
- description_bullets: 3–4 пункта для описания YouTube
- highlight_stats: 1–2 крупные цифры для экрана (value: «€1200», «3», «30»; label: «аренда T1», «ошибки AIMA», «дней»). Только факты из текста, не выдумывай`;

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

function userPrompt(topic: TipShortTopic): string {
  const guideContext = topic.guide_slug ? loadGuideContext(topic.guide_slug) : "";
  const noteContext = topic.note_context
    ? `\nЗаметка с portugal.emigro.online (кратко):\n${topic.note_context.slice(0, 2000)}`
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
    ...topic.facts.map((f) => `- ${f}`),
    guideContext ? `\nКонтекст из гайда Emigro:\n${guideContext.slice(0, topic.note_context ? 1200 : 2500)}` : "",
  ].join("\n");
}

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

  if (hookWords < 5 || hookWords > 16) errors.push(`hook word count ${hookWords} (want 5–16)`);
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
