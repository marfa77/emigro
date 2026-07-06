import fs from "fs";
import path from "path";
import { geminiFastJson } from "@/lib/news/gemini";
import {
  SHORT_DURATION_ESTIMATE_TARGET,
  SHORT_DURATION_TARGET_MIN,
} from "./config";
import { normalizeHighlightStats, type HighlightStat } from "./highlight-stats";
import {
  buildTipSegments,
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
  type: "object",
  properties: {
    hook: { type: "string" },
    body: { type: "string" },
    cta: { type: "string" },
    visual_hook: { type: "string" },
    visual_body: { type: "string" },
    youtube_title: { type: "string" },
    description_bullets: { type: "array", items: { type: "string" } },
    highlight_stats: {
      type: "array",
      items: {
        type: "object",
        properties: { value: { type: "string" }, label: { type: "string" } },
        required: ["value", "label"],
      },
    },
  },
  required: ["hook", "body", "cta", "visual_hook", "visual_body", "youtube_title", "description_bullets", "highlight_stats"],
};

const SYSTEM = `Ты пишешь сценарии YouTube Shorts для канала @Emigro_news — русскоязычные релоканты в Европу (фокус: Португалия).

Формат Short:
- 30–45 секунд озвучки (~55–75 слов всего; короче лучше — длинный текст не влезет в Short)
- Один факт или лайфхак, НЕ новости и НЕ дайджест
- Крючок в первые 2 секунды — провокационный, конкретный, без «сегодня», «на этой неделе», «новость»
- После крючка — сразу суть: цифры, шаги, ошибки
- CTA мягкий: emigro.online или подписка, без агрессивной рекламы. Обязательно вопрос в конце для комментариев.

Стиль:
- Разговорный русский, «вы» или без местоимения
- Короткие предложения
- Конкретика: €, сроки, названия (NIF, AIMA, D7, D8, IBAN)
- Запрещено: «важно отметить», «на самом деле», «не секрет что», новостной тон

Структура JSON:
- hook: 6–14 слов, удар с первой секунды (может начинаться с «Этого никто не говорит…», «Три ошибки…», «D7 или D8…»)
- body: 55–80 слов — один лайфхак или 2–3 пункта без нумерации «первое второе»; добавь конкретные €, сроки, районы
- cta: 8–15 слов — закончи **вопросом для комментариев** (например: «А вы уже…?», «Сколько платите…?», «Какой визу выбрали бы?»)
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
  return [
    `Тема: ${topic.title}`,
    `Формат: ${topic.format}`,
    `Страна: ${topic.country}`,
    `Крючок (энергия): ${topic.hookSeed}`,
    "",
    "Факты (используй только проверенное, не выдумывай новые цифры):",
    ...topic.facts.map((f) => `- ${f}`),
    guideContext ? `\nКонтекст из гайда Emigro:\n${guideContext.slice(0, 2500)}` : "",
  ].join("\n");
}

const NEWS_BANNED = /\b(новост|на этой неделе|сегодня сообщ|правительство объяв|парламент принял|breaking|дайджест)\b/i;

function validateScript(script: TipShortScript, topic: TipShortTopic): string[] {
  const errors: string[] = [];
  const full = `${script.hook} ${script.body} ${script.cta}`;
  const totalWords = wordCount(full);
  const hookWords = wordCount(script.hook);
  const minWords = minWordsForDuration(SHORT_DURATION_TARGET_MIN);
  const maxWords = maxWordsForDuration(SHORT_DURATION_ESTIMATE_TARGET);

  if (hookWords < 5 || hookWords > 16) errors.push(`hook word count ${hookWords} (want 5–16)`);
  if (totalWords < minWords || totalWords > maxWords) {
    errors.push(`total words ${totalWords} (want ${minWords}–${maxWords} for ${durationTargetBandLabel()})`);
  }
  if (NEWS_BANNED.test(full)) errors.push("news-style language detected");
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

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const retryHint =
      attempt === 0
        ? ""
        : `\n\nПредыдущая версия не прошла QA: ${lastErrors.join("; ")}. Цель: ${durationTargetBandLabel()} озвучки (~${minWordsForDuration(SHORT_DURATION_TARGET_MIN)}–${maxWordsForDuration(SHORT_DURATION_ESTIMATE_TARGET)} слов, оценка ≤${SHORT_DURATION_ESTIMATE_TARGET}s). Если слишком коротко — 1–2 факта из темы. Если длинно — сократи body, убери повторы.`;

    const script = await geminiFastJson<TipShortScript>(
      SYSTEM,
      userPrompt(topic) + retryHint,
      SCRIPT_SCHEMA,
      2048
    );

    const fullText = `${script.hook} ${script.body} ${script.cta}`;
    const normalized: TipShortScript = {
      hook: compact(script.hook),
      body: compact(script.body),
      cta: compact(script.cta),
      visual_hook: compact(script.visual_hook || script.hook),
      visual_body: compact(script.visual_body || topic.title),
      youtube_title: compact(script.youtube_title || topic.title),
      description_bullets: (script.description_bullets ?? topic.facts).map(compact).slice(0, 4),
      highlight_stats: normalizeHighlightStats(script.highlight_stats, fullText),
    };

    const errors = validateScript(normalized, topic);
    if (errors.length === 0) return normalized;
    lastErrors = errors;
  }

  throw new Error(`Tip script QA failed: ${lastErrors.join("; ")}`);
}
