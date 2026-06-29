import type { RawNewsItem } from "./rss";
import type { NewsTopicConfig } from "@/lib/news/topics";
import {
  AUTHOR_VOICE_RU,
  CHANNEL_STYLE_BANNED_RU,
  MIN_SELECTED_FLOOR,
  SELECTED_COUNT,
  TELEGRAM_DIGEST_MAX_CHARS,
} from "./editorial";
import {
  isPortugalPost2026LawWeek,
  portugalSiteDigestFactualGuardrailRu,
  portugalTelegramFactualGuardrailRu,
  spainGoldenVisaFactualGuardrailRu,
  spainTelegramFactualGuardrailRu,
} from "./quality";

export function buildSelectionPrompts(topic: NewsTopicConfig, candidates: RawNewsItem[]) {
  const forSelector = candidates.slice(0, 30).map((item, candidate_idx) => ({
    candidate_idx,
    title: item.title,
    source: item.source,
    snippet: item.snippet.slice(0, 500),
    pubDate: item.pubDate,
    score: item.score,
  }));

  const system = `You select news for a Russian-speaking channel focused on ${topic.audienceRu} — not generic Schengen travel.
Return strict JSON only.
Drop fluff/clickbait, listicles ("top 10 countries"), and stories without a concrete policy/process angle.
Prefer: law changes, parliament/decrees, named agencies (AIMA, IND, prefecture), consulate policy, visa route updates, citizenship timelines.
REJECT vague trend pieces ("Europe tightens immigration") unless they cite a specific bill, decree, or agency action.
MANDATORY: if candidates include citizenship/nationality timeline risk (5→10 years, waiting period changes), at least one such item must be selected.
Each candidate has candidate_idx (0-based). Copy candidate_idx exactly — do NOT include URLs.`;

  const user = `Pick up to ${SELECTED_COUNT} items by candidate_idx (min ${MIN_SELECTED_FLOOR} if list is thin).
Focus: ${topic.focusHintRu}
For each selected row: { candidate_idx, title, source, why (Russian), score 0-100 }

Candidates (no links):
${JSON.stringify(forSelector, null, 2)}`;

  return { system, user, pool: candidates.slice(0, 30) };
}

export function buildTelegramPrompts(
  topic: NewsTopicConfig,
  selected: Array<{ title: string; link: string; source: string; why: string }>,
  weekFrom: Date,
  weekTo: Date,
  articleUrl: string
) {
  const windowText = `${weekFrom.toISOString().slice(0, 10)} - ${weekTo.toISOString().slice(0, 10)}`;
  const portugalGuard =
    topic.key === "portugal" && isPortugalPost2026LawWeek(weekTo)
      ? `\n${portugalTelegramFactualGuardrailRu()}`
      : "";
  const spainGuard = topic.key === "spain" ? `\n${spainTelegramFactualGuardrailRu()}` : "";

  const linkManifest = selected
    .map((s, i) => `${i + 1}. «${s.source}» — ${s.title}\n   href: ${s.link}`)
    .join("\n\n");

  const system = `Ты главный редактор Emigro — Telegram-канал про ${topic.countryRu} для ${topic.audienceRu}.
${AUTHOR_VOICE_RU}

Правила:
- Факты только из входных новостей; в <i>Мы:</i> — интерпретация без выдуманных цифр
- Каждый <b>Факт:</b> — конкретика из заголовка/snippet (дата, орган, маршрут, цифра)
- Запрещено: «европейские тренды», «некоторые обозреватели», «появляются руководства» без органа
- Фокус: ${topic.focusHintRu}
- Блок «Критические риски инвестора» обязателен
- Закон и задержки ведомств (AIMA, IND, префектура) — в разных предложениях
- Telegram HTML: <b>, <i>, <a href="https://..."> только
- Одно сообщение, до ${TELEGRAM_DIGEST_MAX_CHARS} символов
- Без шапки с датой — её добавит код
- В <b>Источники</b> — ссылка на каждую новость с названием издания (не «Google News»)
- Запрещённые фразы: ${CHANNEL_STYLE_BANNED_RU}
${portugalGuard}
${spainGuard}

Верни JSON: { "digest_html": "..." }`;

  const user = `Weekly digest за ${windowText}, только ${topic.countryRu}.

Манифест href (копируй точно в <b>Источники</b>):
${linkManifest}

Структура digest_html:
1) <b>Главное</b> — 1-2 строки
2) <b>Разбор</b> — для КАЖДОЙ новости (${selected.length}):
   <b>Факт:</b> ...
   <i>Мы:</i> ...
3) <b>Критические риски инвестора</b> — 1-3 bullets (5→10 лет если есть в источниках)
4) <b>Фокус по стране</b> — 2-4 bullets
5) <b>Что сделать сейчас</b> — 2-3 пункта
6) <b>На сайте</b> — <a href="${articleUrl}">полная версия</a>
7) <b>Источники</b> — <a href="...">название издания</a> (не Google News) на каждый материал
8) Одна спокойная оптимистичная строка-финал

Входные новости:
${JSON.stringify(selected, null, 2)}`;

  return { system, user };
}

export function buildSiteDigestPrompts(
  topic: NewsTopicConfig,
  selected: RawNewsItem[],
  weekStart: string,
  weekEnd: string
) {
  const portugalGuard =
    topic.key === "portugal" && isPortugalPost2026LawWeek(weekEnd)
      ? `\n${portugalSiteDigestFactualGuardrailRu()}`
      : "";
  const spainGuard = topic.key === "spain" ? `\n${spainGoldenVisaFactualGuardrailRu()}` : "";

  const system = `Ты старший редактор Emigro. Пиши на русском для ${topic.audienceRu}.
Правила:
- Не юридическая консультация; осторожные формулировки
- Только факты из выбранных новостей — никаких общих «европейских трендов» без привязки к источнику
- Ровно ${selected.length} content_blocks — ОДИН блок на КАЖДУЮ входную новость (порядок сохрани)
- В каждом блоке: heading (конкретный), paragraphs (2-3 предложения с фактом из snippet), source_name, source_url, story_title
- source_name и source_url — ТОЧНО копируй из полей source и link соответствующей новости (не «Google News»)
- Запрещено обобщать: «европейская тенденция», «появляются руководства» без органа
- 4-5 key_takeaways — конкретные действия с упоминанием маршрута/органа (AIMA, D8, консульство)
- seo_title до 70 символов, seo_description до 155
- title: конкретный заголовок недели (закон, AIMA, консульство) — без «еженедельный обзор»
- Тон: спокойная экспертиза, без LLM-штампов (${CHANNEL_STYLE_BANNED_RU})
${portugalGuard}
${spainGuard}`;

  const user = `Страна: ${topic.countryRu}
Неделя: ${weekStart} — ${weekEnd}
Фокус: ${topic.focusHintRu}

Выбранные новости (по одному content_block на каждую, с source_name + source_url):
${JSON.stringify(
    selected.map((s) => ({
      title: s.title,
      source: s.source,
      link: s.link,
      snippet: s.snippet,
    })),
    null,
    2
  )}`;

  return { system, user };
}

export function buildCompressPrompt(html: string, topic: NewsTopicConfig): { system: string; user: string } {
  const system = `Сожми Telegram-дайджест Emigro (${topic.countryRu}) до <= ${TELEGRAM_DIGEST_MAX_CHARS} символов.
Сохрани структуру: Главное, Разбор (Факт/Мы), Критические риски, Фокус, Что сделать, Источники.
Сохрани все <a href="https://...">. Без LLM-штампов.`;
  const user = `Сожми:\n${html.slice(0, 6000)}`;
  return { system, user };
}
