import { AUTHOR_VOICE_RU, CHANNEL_STYLE_BANNED_RU } from "@/lib/news/editorial";
import { geminiProJson, SCHEMA_SITE_DIGEST_RU } from "@/lib/news/gemini";
import type { NewsContentBlock, NewsSourceLink } from "@/lib/news/digests";
import type { NewsTopicConfig } from "@/lib/news/topics";
import type { Prep2GoArticle } from "@/lib/news/prep2go-fetch";
import {
  isPortugalPost2026LawWeek,
  portugalSiteDigestFactualGuardrailRu,
  spainGoldenVisaFactualGuardrailRu,
} from "@/lib/news/quality";

type SiteDigestRu = {
  title: string;
  excerpt: string;
  seo_title: string;
  seo_description: string;
  key_takeaways: string[];
  content_blocks: NewsContentBlock[];
  tags: string[];
};

function internalLinksHint(topic: NewsTopicConfig): string {
  const paths: string[] = [];
  if (topic.sitePaths?.landing) paths.push(topic.sitePaths.landing);
  if (topic.sitePaths?.wizard) paths.push(topic.sitePaths.wizard);
  if (topic.sitePaths?.guide) paths.push(topic.sitePaths.guide);
  paths.push("/ru/wizard", `/ru/news?country=${topic.urlSegment}`);
  return paths.join(", ");
}

function articleGroundingText(article: Prep2GoArticle): string {
  return [
    article.title,
    article.excerpt,
    ...article.keyTakeaways,
    ...article.sections.flatMap((section) => [section.heading, ...section.paragraphs, ...section.bullets]),
  ].join("\n");
}

export async function translatePrep2GoArticle(
  article: Prep2GoArticle,
  topic: NewsTopicConfig,
  weekStart: string,
  resolvedSources: NewsSourceLink[]
): Promise<SiteDigestRu> {
  const portugalGuard =
    topic.key === "portugal" && isPortugalPost2026LawWeek(article.weekEnd)
      ? `\n${portugalSiteDigestFactualGuardrailRu()}`
      : "";
  const spainGuard = topic.key === "spain" ? `\n${spainGoldenVisaFactualGuardrailRu()}` : "";

  const system = `Ты старший редактор Emigro — медиа о релокации русскоязычных в Европу.
${AUTHOR_VOICE_RU}

Задача: перевести и редакторски адаптировать конкретную статью Prep2Go для аудитории Emigro (${topic.audienceRu}).

Правила перевода и адаптации:
- Профессиональный редакторский русский («по-взрослому»), без кальк с английского и без LLM-штампов (${CHANNEL_STYLE_BANNED_RU})
- Сохраняй фактическую точность: даты, названия законов, органы (AIMA, IND, префектура), суммы, сроки; не добавляй факты, которых нет в статье
- Это не синтетический «дайджест недели»: не добавляй общие советы, чеклисты, universal investor tips, SEO-филлер или boilerplate risk language
- title — конкретный заголовок статьи на русском, привязанный к главному факту исходника
- excerpt — 1–2 коротких предложения, только суть статьи
- seo_title до 70 символов, seo_description до 155 — без рекламных клише и общих обещаний
- key_takeaways: 3–5 пунктов — только факты/последствия из исходной статьи; практические действия допустимы только если прямо вытекают из сообщённого изменения
- content_blocks: по одному блоку на каждую смысловую секцию исходника (кроме Key takeaways и Sources); лучше сжато перевести/адаптировать, чем расширять
- В каждом content_block: heading, paragraphs (2–4 предложения), опционально bullets
- source_name, source_url, story_title — привяжи к релевантному источнику из списка resolvedSources; если секция общая — используй наиболее подходящий источник или первый из списка с корректным publisher URL
- tags: 5–8 русскоязычных тегов (ВНЖ, гражданство, маршрут)
- Внутренние ссылки Emigro markdown-форматом добавляй максимум 1 раз и только если ссылка прямо помогает понять конкретный факт статьи; пути: ${internalLinksHint(topic)}
- Осторожные формулировки используй только когда это нужно из-за неопределённости в источнике; не вставляй стандартный дисклеймер «не юридическая консультация»
- Акцент на конкретные изменения для русскоязычных релокантов, не на generic expat advice
${portugalGuard}
${spainGuard}

Верни строго JSON по схеме.`;

  const user = `Страна: ${topic.countryRu}
Неделя: ${weekStart} — ${article.weekEnd}
Фокус Emigro: ${topic.focusHintRu}

Исходный заголовок (EN): ${article.title}
Исходный excerpt (EN): ${article.excerpt}

Key takeaways (EN):
${JSON.stringify(article.keyTakeaways, null, 2)}

Секции (EN):
${JSON.stringify(article.sections, null, 2)}

Источники (resolved):
${JSON.stringify(resolvedSources, null, 2)}

Не выходи за пределы этой фактологической базы:
${articleGroundingText(article)}`;

  return geminiProJson<SiteDigestRu>(system, user, SCHEMA_SITE_DIGEST_RU, 16384);
}
