import { CHANNEL_STYLE_BANNED_RU } from "./editorial";
import {
  findBlockedUrlsInText,
  googleNewsLinkRatio,
  isBlockedSourceName,
  isBlockedSourceUrl,
  isGoogleGroundingRedirectUrl,
} from "./article-resolve";
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
export const SPAIN_GOLDEN_VISA_REAL_ESTATE_CLOSED_AT = Date.UTC(2025, 3, 3);

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

export function spainGoldenVisaFactualGuardrailRu(): string {
  return `КРИТИЧЕСКИЕ факты по Испании:
- Spain Golden Visa через недвижимость закрыта с 2025-04-03.
- НЕ пиши, что маршрут через недвижимость ещё открыт, «скоро закроется», «последний шанс» или что покупатели могут гарантированно успеть подать.
- Если источник говорит о переходных/ранее поданных кейсах, прямо ограничь формулировку: только заявки/сделки, подпадающие под переходные правила; не для новых покупателей.
- Предпочитай спокойную формулировку риска: «проверить переходные правила и BOE», а не срочность/страшилки.`;
}

export function spainTelegramFactualGuardrailRu(): string {
  return spainGoldenVisaFactualGuardrailRu();
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

function hasSpainGoldenVisaText(text: string): boolean {
  return /(?:golden visa|золот\w*\s+виз|инвесторск\w*\s+виз|внж\s+за\s+инвестиц)/i.test(text);
}

function hasRealEstateText(text: string): boolean {
  return /(?:real[\s-]?estate|property|недвижимост|покупк\w*\s+жиль|покупател\w*)/i.test(text);
}

function hasTransitionalLimitation(text: string): boolean {
  return /(?:переходн\w*\s+правил|только\s+(?:для\s+)?(?:ранее\s+)?подан|ранее\s+подан|уже\s+подан|до\s+2025-04-03|до\s+3\s+апрел[яь]\s+2025|before\s+2025-04-03|transitional|pending|already\s+filed)/i.test(
    text
  );
}

function spainGoldenVisaFactualErrors(text: string): string[] {
  const errors: string[] = [];
  const n = normalizeText(text);
  if (!hasSpainGoldenVisaText(n) || !hasRealEstateText(n)) return errors;

  const impliesOpen =
    /(?:ещ[её]\s+открыт|оста[её]тся\s+открыт|still\s+(?:open|available)|можно\s+подать|могут\s+подать|can\s+(?:still\s+)?apply|доступн\w*\s+(?:маршрут|программ)|available\s+(?:route|program))/i.test(
      n
    );
  const impliesClosingSoon =
    /(?:скоро\s+закро|вот-вот\s+закро|на\s+грани\s+закрыт|закроется\s+скоро|about\s+to\s+close|closing\s+soon|last\s+chance|последн\w*\s+шанс|успеть\s+подать|срочно\s+подать)/i.test(
      n
    );
  const impliesGuaranteedFiling =
    /(?:гарантир\w*.{0,50}подать|гарантир\w*.{0,50}успеть|guarantee\w*.{0,50}(?:filing|apply|application)|buyers?\s+can\s+still\s+secure)/i.test(
      n
    );

  if ((impliesOpen || impliesClosingSoon || impliesGuaranteedFiling) && !hasTransitionalLimitation(n)) {
    errors.push(
      "Испания: Golden Visa через недвижимость закрыта с 2025-04-03; нельзя писать, что маршрут открыт/скоро закроется/можно гарантированно успеть без явной оговорки о переходных кейсах."
    );
  }

  return Array.from(new Set(errors));
}

const ALARMIST_TONE_MARKERS_RU: RegExp[] = [
  /(^|[^а-яё])срочно([^а-яё]|$)/i,
  /(^|[^а-яё])катастрофа([^а-яё]|$)/i,
  /(^|[^а-яё])шок([^а-яё]|$)/i,
  /последн\w*\s+шанс/i,
  /остан(?:е|ё)тесь\s+без/i,
  /(^|[^а-яё])коллапс([^а-яё]|$)/i,
  /пока\s+не\s+поздно/i,
  /вс[её]\s+пропало/i,
  /(^|[^а-яё])паника([^а-яё]|$)/i,
  /(^|[^а-яё])крах([^а-яё]|$)/i,
  /(^|[^а-яё])обвал([^а-яё]|$)/i,
];

const GENERIC_NEWS_NOISE_MARKERS_RU: RegExp[] = [
  /кажд[а-яё]*\s+ситуаци[а-яё]*\s+индивидуальн/i,
  /не\s+являет(?:ся|ься)?\s+юридическ[а-яё]*\s+консультац/i,
  /проконсультируйт[а-яё]*\s+с\s+(?:юрист|адвокат|специалист)/i,
  /обратит(?:есь|ься)\s+к\s+(?:юрист|адвокат|специалист)/i,
  /(?:подготовьт[а-яё]*|соберит[а-яё]*)\s+документ[а-яё]*\s+заранее/i,
  /планируйт[а-яё]*\s+заранее/i,
  /следит[а-яё]*\s+за\s+(?:новост|обновлен)/i,
  /держит[а-яё]*\s+руку\s+на\s+пульс/i,
  /пошагов[а-яё]*\s+план/i,
  /универсальн[а-яё]*\s+(?:совет|рекомендац|решени)/i,
  /общ[а-яё]*\s+рекомендац/i,
  /инвестор[а-яё]*\s+стоит\s+внимательн[а-яё]*\s+оцен/i,
];

function isQuotedAndContextualized(text: string, index: number, length: number): boolean {
  const before = text.slice(Math.max(0, index - 80), index);
  const after = text.slice(index + length, Math.min(text.length, index + length + 80));
  const quoted = /[«"“][^»"”]{0,80}$/i.test(before) && /^[^«"“]{0,80}[»"”]/i.test(after);
  const contextualized = /(?:цитат|цитиру|заголов|формулиров|по\s+словам|так\s+пишет|так\s+назвал)/i.test(
    `${before} ${after}`
  );
  return quoted && contextualized;
}

function alarmistToneErrors(text: string): string[] {
  const errors: string[] = [];
  for (const marker of ALARMIST_TONE_MARKERS_RU) {
    const match = marker.exec(text);
    if (!match?.[0]) continue;
    if (isQuotedAndContextualized(text, match.index, match[0].length)) continue;
    errors.push(`Убери алармистскую формулировку «${match[0].trim()}» — используй спокойный язык риска.`);
  }
  return Array.from(new Set(errors));
}

function editorialGenericErrors(text: string): string[] {
  const errors: string[] = [];
  const banned = new RegExp(CHANNEL_STYLE_BANNED_RU, "i").exec(text);
  if (banned) errors.push(`Убери LLM-штамп: «${banned[0]}».`);
  errors.push(...alarmistToneErrors(text));
  for (const marker of GENERIC_NEWS_NOISE_MARKERS_RU) {
    const match = marker.exec(text);
    if (match?.[0]) {
      errors.push(
        `Убери общий совет/шум «${match[0].trim()}» — новость должна быть привязана к фактам исходной статьи.`
      );
    }
  }
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
  const grounding = links.filter((l) => isGoogleGroundingRedirectUrl(l.url));
  if (grounding.length > 0) {
    errors.push("Источники не должны содержать Vertex AI Search grounding redirect URL — нужны прямые URL изданий.");
  }
  const badTitles = links.filter((l) => isBlockedSourceName(l.title));
  if (badTitles.length > 0) {
    errors.push(`Источники не должны называться «${badTitles[0].title}» — укажи издание, не Google.`);
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
    if (block.source_url && isBlockedSourceUrl(block.source_url)) {
      errors.push(`Блок «${block.heading}» ссылается на обёртку Google (${block.source_url}) — нужен прямой URL издания.`);
    }
    if (block.source_name && isBlockedSourceName(block.source_name)) {
      errors.push(`Блок «${block.heading}» использует недопустимое имя источника «${block.source_name}».`);
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
  if (params.topic.trim().toLowerCase() === "spain") {
    errors.push(...spainGoldenVisaFactualErrors(text));
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
  if (params.topic.trim().toLowerCase() === "spain") {
    errors.push(...spainGoldenVisaFactualErrors(text));
  }

  if (params.sourceLinks && params.sourceLinks.some((l) => isBlockedSourceUrl(l.url))) {
    errors.push("Telegram: все ссылки должны вести на издания, не на Google News или grounding redirect.");
  }

  return Array.from(new Set(errors));
}

export function validateThreadsQuality(params: { threadsText: string; topic: string }): string[] {
  const errors = [...editorialGenericErrors(params.threadsText)];
  const posts = params.threadsText.split(/\n\n(?=\d+\/\d+\n)/).filter(Boolean);
  const numbered = posts.filter((p) => /^\d+\/\d+/.test(p.trim()));

  const blockedUrls = findBlockedUrlsInText(params.threadsText);
  if (blockedUrls.length > 0) {
    errors.push(
      "Threads: запрещены Google, Google News, google.com и Vertex AI grounding redirect — только emigro.online и t.me."
    );
  }

  const allowedUrlRe = /^https?:\/\/(?:www\.)?emigro\.online\/|(?:https?:\/\/)?(?:t\.me\/|telegram\.me\/)/i;
  const allUrls = params.threadsText.match(/https?:\/\/[^\s<>"')\]]+/gi) ?? [];
  const disallowed = allUrls.filter((url) => !allowedUrlRe.test(url));
  if (disallowed.length > 0) {
    errors.push("Threads: в тексте допустимы только ссылки на emigro.online и t.me/telegram.");
  }

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

  if (/\bgoogle(?:\s+news|\s+search)?\b/i.test(params.threadsText)) {
    errors.push("Threads: не должно быть упоминаний Google как источника.");
  }

  if (/^Источник:\s*/im.test(params.threadsText)) {
    errors.push("Threads: не должно быть строк «Источник: …» — только emigro.online и канал Telegram.");
  }

  if (/^Источники:/im.test(params.threadsText)) {
    errors.push("Threads: не должно быть блока «Источники:» — только «Полная версия» и «Канал».");
  }

  if (/^Emigro:\s*https?:\/\//im.test(params.threadsText)) {
    errors.push("Threads: не должно быть строк «Emigro: …» — используй «Полная версия».");
  }

  if (/(?:^|\s)Источник:\s*(?:Com|Unknown|Google(?:\s+News)?)\b/im.test(params.threadsText)) {
    errors.push("Threads: источник не должен называться Com/Unknown/Google.");
  }

  if (/(?:mshale\.com|harici\.com\.tr)/i.test(params.threadsText)) {
    errors.push("Threads: слабые/нерелевантные источники не должны попадать в публикацию.");
  }

  if (params.topic.trim().toLowerCase() === "spain") {
    errors.push(...spainGoldenVisaFactualErrors(params.threadsText));
  }

  return Array.from(new Set(errors));
}
