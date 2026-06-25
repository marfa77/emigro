import { CHANNEL_STYLE_BANNED_RU } from "./editorial";
import { googleNewsLinkRatio, isGoogleNewsUrl } from "./article-resolve";
import { domainFromLink, isLowTrustSource } from "./scoring";

type SiteBlock = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  source_name?: string;
  source_url?: string;
  story_title?: string;
};

export type SiteDigestForQuality = {
  title: string;
  excerpt: string;
  seo_title: string;
  seo_description: string;
  key_takeaways: string[];
  content_blocks: SiteBlock[];
};

export const PORTUGAL_2026_NATIONALITY_LAW_SIGNED_AT = Date.UTC(2026, 4, 3);

function normalizeText(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function digestText(digest: SiteDigestForQuality): string {
  return [
    digest.title,
    digest.excerpt,
    digest.seo_title,
    digest.seo_description,
    ...digest.key_takeaways,
    ...digest.content_blocks.flatMap((b) => [b.heading, ...b.paragraphs, ...(b.bullets ?? [])]),
  ].join(" ");
}

function toTimestamp(dateLike: string | Date): number {
  const date = typeof dateLike === "string" ? new Date(`${dateLike.slice(0, 10)}T00:00:00.000Z`) : dateLike;
  return date.getTime();
}

export function isPortugalPost2026LawWeek(weekEnd: string | Date): boolean {
  const ms = toTimestamp(weekEnd);
  return Number.isFinite(ms) && ms >= PORTUGAL_2026_NATIONALITY_LAW_SIGNED_AT;
}

export function portugalSiteDigestFactualGuardrailRu(): string {
  return `КРИТИЧЕСКИЕ факты по Португалии (недели после 2026-05-03):
- Срок 10 лет для многих заявителей — изменение Nationality Law (подписан 3 мая 2026), а НЕ следствие задержек AIMA.
- НЕ пиши, что легальное требование остаётся 5 лет (кроме явных переходных правил из источников).
- Задержки AIMA — отдельный административный риск; они не «превращают» 5 лет в 10.
- Запрещено: «10 лет из-за AIMA», «AIMA превращает 5 лет в 10».`;
}

export function portugalTelegramFactualGuardrailRu(): string {
  return portugalSiteDigestFactualGuardrailRu();
}

function portugalFactualErrors(text: string): string[] {
  const errors: string[] = [];
  const n = normalizeText(text);

  if (
    /легальн\w*.{0,50}(?:требован\w*|срок\w*).{0,50}5\s*лет/.test(n) ||
    /(?:требован\w*|срок\w*).{0,50}5\s*лет.{0,80}(?:гражданств|натурализ)/.test(n)
  ) {
    errors.push("После 2026-05-03 нельзя писать, что легальный срок остаётся 5 лет без оговорок из источников.");
  }

  if (
    (/(?:10\s*лет|10 years?).{0,40}(?:из-за|вследствие|потому что).{0,40}(?:aima|аима|задержк)/.test(n)) ||
    (/(?:aima|аима|задержк).{0,40}(?:из-за|вследствие|потому что).{0,40}(?:10\s*лет|10 years?)/.test(n)) ||
    /(?:10\s*лет|10 years?).{0,30}(?:из-за|из за).{0,30}(?:aima|аима|бэклог)/.test(n)
  ) {
    errors.push("Нельзя объяснять 10-летний срок только задержками AIMA — это изменение закона.");
  }

  return Array.from(new Set(errors));
}

function editorialGenericErrors(text: string): string[] {
  const errors: string[] = [];
  const banned = new RegExp(CHANNEL_STYLE_BANNED_RU, "i").exec(text);
  if (banned) errors.push(`Убери LLM-штамп: «${banned[0]}».`);
  const n = normalizeText(text);
  if (/некотор\w+\s+(?:обозревател|эксперт|аналитик)/.test(n)) {
    errors.push("Не пиши «некоторые обозреватели» — назови издание или факт из источника.");
  }
  if (/общ\w*\s+европейск\w*\s+тенденц/.test(n)) {
    errors.push("Не заменяй конкретные новости общими «европейскими трендами».");
  }
  if (/появля\w*\s+(?:обновл|новые)\s+руководств/.test(n) && !/(?:aima|d8|d7|консульств|vfs|парламент|decreto|закон)/i.test(text)) {
    errors.push("«Появляются руководства» без AIMA/D8/консульства/закона — слишком абстрактно.");
  }
  return errors;
}

function hasSpecificEntity(text: string, topic: string): boolean {
  const common =
    /aima|d8|d7|внж|консульств|vfs|парламент|decreto|nationality law|citizenship law|blue card|digital nomad|talent passport|ind\b|migrationsverket/i;
  if (common.test(text)) return true;
  if (topic === "portugal") return /португал|portugal|ciple|nif|sef\b/i.test(text);
  return new RegExp(topic, "i").test(text);
}

export function validateSourceLinksQuality(links: Array<{ title: string; url: string }>): string[] {
  const errors: string[] = [];
  if (links.length < 3) errors.push("Нужно минимум 3 источника.");
  const ratio = googleNewsLinkRatio(links.map((l) => ({ url: l.url })));
  if (ratio > 0.34) errors.push(`Слишком много ссылок на Google News (${Math.round(ratio * 100)}%) — нужны прямые URL изданий.`);
  const badTitles = links.filter((l) => /^google news$/i.test(l.title.trim())).length;
  if (badTitles > 1) errors.push("Источники не должны называться «Google News» — укажи издание.");
  const genericTitles = links.filter((l) => /^(com|www|unknown)$/i.test(l.title.trim()));
  if (genericTitles.length > 0) {
    errors.push(`Источник не должен называться «${genericTitles[0].title}» — нужно нормальное название издания.`);
  }
  const lowTrust = links.find((l) => isLowTrustSource(l.url));
  if (lowTrust) {
    errors.push(`Слабый или нерелевантный источник: ${domainFromLink(lowTrust.url)}.`);
  }
  return errors;
}

export function validateSiteDigestQuality(params: {
  topic: string;
  weekEnd: string | Date;
  digest: SiteDigestForQuality;
  selectedCount?: number;
  sourceLinks?: Array<{ title: string; url: string }>;
}): string[] {
  const text = digestText(params.digest);
  const errors = [
    ...editorialGenericErrors(text),
    ...(params.sourceLinks ? validateSourceLinksQuality(params.sourceLinks) : []),
  ];

  const blocks = params.digest.content_blocks;
  const minBlocks = Math.min(params.selectedCount ?? 4, 4);
  if (blocks.length < minBlocks) {
    errors.push(`Нужно минимум ${minBlocks} блоков — по одному на каждую выбранную новость.`);
  }

  const withSource = blocks.filter((b) => b.source_url && b.source_name);
  if (withSource.length < Math.min(blocks.length, minBlocks)) {
    errors.push("Каждый content_block должен иметь source_name и source_url из входных новостей.");
  }

  for (const block of blocks) {
    if (block.source_url && isGoogleNewsUrl(block.source_url)) {
      errors.push(`Блок «${block.heading}» ссылается на news.google.com — нужен прямой URL издания.`);
    }
    if (block.source_url && isLowTrustSource(block.source_url)) {
      errors.push(`Блок «${block.heading}» использует слабый источник: ${domainFromLink(block.source_url)}.`);
    }
  }

  if (!hasSpecificEntity(text, params.topic)) {
    errors.push("В тексте нет конкретных сущностей (AIMA, D8, консульство, закон) — дайджест слишком абстрактный.");
  }

  if (params.topic.trim().toLowerCase() === "portugal" && isPortugalPost2026LawWeek(params.weekEnd)) {
    errors.push(...portugalFactualErrors(text));
  }

  return Array.from(new Set(errors));
}

export function validateTelegramDigestQuality(params: {
  topic: string;
  weekEnd: string | Date;
  digestHtml: string;
  sourceLinks?: Array<{ title: string; url: string }>;
}): string[] {
  const text = stripHtml(params.digestHtml);
  const errors = [
    ...editorialGenericErrors(text),
    ...(params.sourceLinks ? validateSourceLinksQuality(params.sourceLinks) : []),
  ];

  if (params.topic.trim().toLowerCase() === "portugal" && isPortugalPost2026LawWeek(params.weekEnd)) {
    errors.push(...portugalFactualErrors(text));
  }

  if (params.sourceLinks && params.sourceLinks.some((l) => isGoogleNewsUrl(l.url))) {
    errors.push("Telegram: все ссылки должны вести на издания, не на Google News.");
  }

  return Array.from(new Set(errors));
}

export function validateThreadsQuality(params: { threadsText: string; topic: string }): string[] {
  const errors = [...editorialGenericErrors(params.threadsText)];
  const posts = params.threadsText.split(/\n\n(?=\d+\/\d+\n)/).filter(Boolean);
  const numbered = posts.filter((p) => /^\d+\/\d+/.test(p.trim()));

  if (numbered.length < 3) {
    errors.push("Threads: нужно минимум 3 нумерованных поста для копипаста.");
  }

  for (const post of numbered) {
    const body = post.replace(/^\d+\/\d+\n/, "").trim();
    if (body.length < 80) errors.push("Threads: один из постов слишком короткий — добавь факт из источника.");
    if (body.length > 520) errors.push("Threads: пост длиннее 500 символов — сократи для Threads.");
  }

  if (!hasSpecificEntity(params.threadsText, params.topic)) {
    errors.push("Threads: нет конкретных сущностей (AIMA, D8, консульство, закон).");
  }

  if (/google news/i.test(params.threadsText)) {
    errors.push("Threads: не должно быть ссылок на Google News — только издания.");
  }

  if (/^Источник:\s*(?:Com|Unknown|Google News)\b/im.test(params.threadsText)) {
    errors.push("Threads: источник не должен называться Com/Unknown/Google News.");
  }

  if (/(?:mshale\.com|harici\.com\.tr)/i.test(params.threadsText)) {
    errors.push("Threads: слабые/нерелевантные источники не должны попадать в публикацию.");
  }

  return Array.from(new Set(errors));
}
