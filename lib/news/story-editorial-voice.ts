/**
 * Editorial voice for short news story tiles.
 * Same register as community notes (`editorial-voice.ts` / voice-pass):
 * warm relocant-blogger — not telegraphic @lepta attribution style.
 */
import {
  EDITORIAL_VOICE_PORTUGAL,
  EDITORIAL_VOICE_SPAIN,
  voiceExamples,
} from "@/lib/community-notes/editorial-voice";

const NEWS_VOICE_CORE = `
ГОЛОС НОВОСТНОЙ ПЛИТКИ Emigro («Опытный релокант за кофе»):
- На «вы»; иногда «мы» (команда Emigro). Тёплый, спокойный — без паники из чатов и без канцелярита.
- Сначала хук, который снимает страх или ставит сцену в 1 предложение, затем факт → «что это значит» → «кого заденет / кого нет».
- Абзацы 2–4 предложения; не телеграф, не стена bullets, не «В соответствии с… / Важно отметить…».
- Сухая ирония к admin-хаосу — максимум одна фраза; не стендап.
- Локальные термины (AIMA, IND, NIE, Finanças…) при первом упоминании — с краткой русской расшифровкой в скобках.
- key_takeaways = «Для кого важно»: action-oriented, полные предложения, без @username и без «(lepta, 2025)».
- Мягкий тон: сверить оригинал / портал; без обещаний «гарантированного ВНЖ» и hard-sell.
- Дата новости — календарно («6 августа 2026»), не «вчера / на этой неделе».

Хороший разбор паники:
${voiceExamples.goodDemystify}

Плохо (не пишите так):
${voiceExamples.bad}
`.trim();

const GENERIC_CORRIDOR_VOICE = `
РЕДАКЦИОННЫЙ ГОЛОС — «Опытный релокант за кофе» (европейский коридор):
Тот же тёплый личный ритм, что у Португалии/Испании: спокойно разбирать новость для релоканта с паспортами RU/BY/UA/KZ.
Хук → факт → кого заденет. Без канцелярита, без телеграфа, без спама @username.
`.trim();

/** Extra voice block for Gemini story batch, keyed by topic. */
export function storyEditorialVoiceForTopic(topicKey: string): string {
  if (topicKey === "portugal") {
    return `${EDITORIAL_VOICE_PORTUGAL}\n\n${NEWS_VOICE_CORE}`;
  }
  if (topicKey === "spain") {
    return `${EDITORIAL_VOICE_SPAIN}\n\n${NEWS_VOICE_CORE}`;
  }
  return `${GENERIC_CORRIDOR_VOICE}\n\n${NEWS_VOICE_CORE}`;
}
