import { geminiFastJson } from "@/lib/news/gemini";
import type { NewsContentBlock, NewsSourceLink } from "@/lib/news/digests";
import type { Prep2GoArticle } from "@/lib/news/prep2go-fetch";
import type { NewsTopicConfig } from "@/lib/news/topics";

type SiteDigestForFactCheck = {
  title: string;
  excerpt: string;
  seo_title: string;
  seo_description: string;
  key_takeaways: string[];
  content_blocks: NewsContentBlock[];
};

export type Prep2GoFactCheckStage = "site" | "telegram_threads";

export type Prep2GoFactCheckReport = {
  ok: boolean;
  stage: Prep2GoFactCheckStage;
  criticalErrors: string[];
  warnings: string[];
};

export type RunPrep2GoFactCheckParams = {
  stage: Prep2GoFactCheckStage;
  article: Prep2GoArticle;
  topic: NewsTopicConfig;
  weekStart: string;
  weekEnd: string;
  sourceLinks: NewsSourceLink[];
  siteDigest?: SiteDigestForFactCheck;
  threadsText?: string;
  useLlm?: boolean;
};

type LlmFactCheckVerdict = {
  verdict: "pass" | "fail";
  critical_errors: string[];
  warnings: string[];
  high_risk_claims?: Array<{
    claim: string;
    affected_group: string;
    unaffected_or_excluded_group: string;
    effective_date: string;
    legal_status: "proposal" | "adopted" | "in_force" | "guidance" | "admin_notice" | "unclear";
    application_scope: string;
    impact_frame: "improvement" | "deterioration" | "neutral" | "uncertain";
    missing_critical_qualifier: boolean;
    misleading_framing: boolean;
  }>;
};

const SCHEMA_FACT_CHECK = {
  type: "OBJECT",
  properties: {
    verdict: { type: "STRING" },
    critical_errors: { type: "ARRAY", items: { type: "STRING" } },
    warnings: { type: "ARRAY", items: { type: "STRING" } },
    high_risk_claims: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          claim: { type: "STRING" },
          affected_group: { type: "STRING" },
          unaffected_or_excluded_group: { type: "STRING" },
          effective_date: { type: "STRING" },
          legal_status: { type: "STRING" },
          application_scope: { type: "STRING" },
          impact_frame: { type: "STRING" },
          missing_critical_qualifier: { type: "BOOLEAN" },
          misleading_framing: { type: "BOOLEAN" },
        },
        required: [
          "claim",
          "affected_group",
          "unaffected_or_excluded_group",
          "effective_date",
          "legal_status",
          "application_scope",
          "impact_frame",
          "missing_critical_qualifier",
          "misleading_framing",
        ],
      },
    },
  },
  required: ["verdict", "critical_errors", "warnings", "high_risk_claims"],
};

const MONTHS: Record<string, string> = {
  january: "01",
  jan: "01",
  января: "01",
  январь: "01",
  february: "02",
  feb: "02",
  февраля: "02",
  февраль: "02",
  march: "03",
  mar: "03",
  марта: "03",
  март: "03",
  april: "04",
  apr: "04",
  апреля: "04",
  апрель: "04",
  may: "05",
  мая: "05",
  june: "06",
  jun: "06",
  июня: "06",
  июнь: "06",
  july: "07",
  jul: "07",
  июля: "07",
  июль: "07",
  august: "08",
  aug: "08",
  августа: "08",
  август: "08",
  september: "09",
  sep: "09",
  sept: "09",
  сентября: "09",
  сентябрь: "09",
  october: "10",
  oct: "10",
  октября: "10",
  октябрь: "10",
  november: "11",
  nov: "11",
  ноября: "11",
  ноябрь: "11",
  december: "12",
  dec: "12",
  декабря: "12",
  декабрь: "12",
};

const NUMBER_WORDS: Record<string, string> = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
  ten: "10",
  eleven: "11",
  twelve: "12",
  один: "1",
  одна: "1",
  два: "2",
  две: "2",
  три: "3",
  четыре: "4",
  пять: "5",
  шесть: "6",
  семь: "7",
  восемь: "8",
  девять: "9",
  десять: "10",
  одиннадцать: "11",
  двенадцать: "12",
};

const GENERIC_ADVICE_MARKERS: RegExp[] = [
  /не\s+являет(?:ся|ься)?\s+юридическ[а-яё]*\s+консультац/i,
  /проконсультируйт[а-яё]*\s+с\s+(?:юрист|адвокат|специалист)/i,
  /обратит(?:есь|ься)\s+к\s+(?:юрист|адвокат|специалист)/i,
  /(?:подготовьт[а-яё]*|соберит[а-яё]*)\s+документ[а-яё]*\s+заранее/i,
  /планируйт[а-яё]*\s+заранее/i,
  /следит[а-яё]*\s+за\s+(?:новост|обновлен)/i,
  /кажд[а-яё]*\s+ситуаци[а-яё]*\s+индивидуальн/i,
  /generic\s+(?:advice|tips?|guidance)/i,
];

const LEGAL_CLAIM_MARKER =
  /(?:виз|внж|пмж|гражданств|резидент|миграц|иммиграц|разрешени[ея]\s+на\s+(?:проживание|работу)|permit|visa|residen|citizenship|migration|immigration|naturalisation|naturalization)/i;

const PROPOSAL_MARKER =
  /(?:proposal|proposed|draft|bill|would|could|proposition|проект|предлож|законопроект|планиру|может\s+быть|обсужда)/i;

const APPLICATION_SCOPE_MARKER =
  /(?:new\s+applications?|renewals?|extensions?|transitional|pending\s+cases?|applications?\s+submitted|нов\w+\s+заяв|первичн\w+\s+заяв|продлен|продлени|renewal|extension|переходн\w+|уже\s+поданн\w+\s+заяв)/i;

const SALARY_THRESHOLD_MARKER =
  /(?:salary|income|threshold|зарплат|доход|порог|минимальн\w+\s+(?:зарплат|доход)|€|eur\b|евро|sek\b|крон)/i;

const BROAD_AFFECTED_GROUP_MARKER =
  /(?:все\s+(?:иностранц|мигрант|заявител|резидент)|иностранц\w+|мигрант\w+|заявител\w+|резидент\w+|переезжающ\w+|all\s+(?:foreigners|migrants|applicants|residents)|foreigners|migrants|applicants|residents)/i;

const PROTECTION_STATUS_GROUP_MARKER =
  /(?:protection-status|protection\s+status|refugees?|subsidiary\s+protection|temporary\s+protection|беженц|статус\w+\s+защит|держател\w+\s+защит|получател\w+\s+защит|субсидиарн\w+\s+защит|дополнительн\w+\s+защит)/i;

const EXCLUDED_GROUP_MARKER =
  /(?:labou?r\s+migrants?|work(?:er|ing)?\s+migrants?|family\s+reunification|permanent\s+residence\s+not\s+(?:currently\s+)?affected|not\s+affected|unaffected|трудов\w+\s+мигрант|рабоч\w+\s+миграц|воссоединени\w+\s+семь|семейн\w+\s+миграц|пмж\s+не\s+затронут|не\s+затрагива(?:ет|ются|ются)|не\s+затронут)/i;

const POSITIVE_FRAME_MARKER =
  /(?:дает\s+стабильност|даст\s+стабильност|стабильност|улучшен|послаблен|смягчен|облегч|упрощ|расширя|better|improv|relax|easier|stability|stable)/i;

const NEGATIVE_FRAME_MARKER =
  /(?:ухудшен|ужесточен|ограничен|сокращ|вместо\s+постоянн|временн\w+\s+(?:разрешени|внж)|downgrade|restrict|stricter|deteriorat|instead\s+of\s+(?:indefinite|permanent)|temporary\s+permits?\s+instead)/i;

const COUNTRY_ALIASES: Array<{ key: string; names: string[] }> = [
  { key: "portugal", names: ["portugal", "португал"] },
  { key: "spain", names: ["spain", "испан"] },
  { key: "france", names: ["france", "франц"] },
  { key: "italy", names: ["italy", "итал"] },
  { key: "germany", names: ["germany", "герман"] },
  { key: "netherlands", names: ["netherlands", "нидерланд", "голланд"] },
  { key: "poland", names: ["poland", "польш"] },
  { key: "czechia", names: ["czech", "чех"] },
  { key: "austria", names: ["austria", "австри"] },
  { key: "scandinavia", names: ["sweden", "norway", "denmark", "finland", "швец", "норвег", "дани", "финлянд"] },
];

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/\s+/g, " ")
    .trim();
}

function mentionsCountryName(text: string, names: string[]): boolean {
  for (const name of names) {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`(?:^|[^a-zа-яё])${escaped}(?:[^a-zа-яё]|$)`, "i");
    if (re.test(text)) return true;
  }
  return false;
}

function stripUrlsAndThreadNumbers(text: string): string {
  return text
    .replace(/https?:\/\/\S+/gi, " ")
    .replace(/^\s*\d+\/\d+\s*$/gm, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pad2(value: string): string {
  return value.padStart(2, "0");
}

function addIsoDateVariants(out: Set<string>, y: string, m: string, d: string): void {
  const month = pad2(m);
  const day = pad2(d);
  out.add(`${y}-${month}-${day}`);
  out.add(`${month}-${day}`);
}

function extractDateClaims(text: string): Set<string> {
  const out = new Set<string>();
  const n = normalizeText(stripUrlsAndThreadNumbers(text));

  for (const match of Array.from(n.matchAll(/\b(20\d{2})[-/.](0?[1-9]|1[0-2])[-/.]([0-3]?\d)\b/g))) {
    addIsoDateVariants(out, match[1], match[2], match[3]);
  }

  const monthPattern = Object.keys(MONTHS).join("|");
  const dayMonthYear = new RegExp(`\\b([0-3]?\\d)\\s+(${monthPattern})\\s+(20\\d{2})\\b`, "g");
  for (const match of Array.from(n.matchAll(dayMonthYear))) {
    addIsoDateVariants(out, match[3], MONTHS[match[2]], match[1]);
  }

  const monthDayYear = new RegExp(`\\b(${monthPattern})\\s+([0-3]?\\d),?\\s+(20\\d{2})\\b`, "g");
  for (const match of Array.from(n.matchAll(monthDayYear))) {
    addIsoDateVariants(out, match[3], MONTHS[match[1]], match[2]);
  }

  const dayMonth = new RegExp(`\\b([0-3]?\\d)\\s+(${monthPattern})\\b`, "g");
  for (const match of Array.from(n.matchAll(dayMonth))) {
    out.add(`${MONTHS[match[2]]}-${pad2(match[1])}`);
  }

  return out;
}

function extractNumbers(text: string): Set<string> {
  const out = new Set<string>();
  const n = normalizeText(stripUrlsAndThreadNumbers(text));
  const unit =
    "(?:%|процент\\w*|лет|года|год|месяц\\w*|дн\\w*|евро|€|тыс\\.?|миллион\\w*|million\\w*|year\\w*|month\\w*|day\\w*|age|возраст\\w*|час\\w*|hour\\w*)";

  for (const match of Array.from(
    n.matchAll(new RegExp(`(?:^|\\s)(\\d+(?:[.,]\\d+)?)\\s*${unit}(?=$|\\s|[.,;:!?])`, "g"))
  )) {
    const value = match[1].replace(",", ".");
    const numeric = Number(value);
    if (Number.isInteger(numeric) && numeric >= 1900 && numeric <= 2100) continue;
    out.add(value);
  }

  const words = Object.keys(NUMBER_WORDS).join("|");
  for (const match of Array.from(
    n.matchAll(new RegExp(`(?:^|\\s)(${words})\\s+${unit}(?=$|\\s|[.,;:!?])`, "g"))
  )) {
    out.add(NUMBER_WORDS[match[1]]);
  }

  return out;
}

function numberAppearsInPlainSourceText(sourceText: string, value: string): boolean {
  const n = normalizeText(stripUrlsAndThreadNumbers(sourceText));
  const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\./g, "[.,]");
  if (new RegExp(`(?:^|[^\\d])${escaped}(?:[^\\d]|$)`).test(n)) return true;
  for (const [word, mapped] of Object.entries(NUMBER_WORDS)) {
    if (mapped !== value) continue;
    const wordEscaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (new RegExp(`(?:^|[^a-zа-яё])${wordEscaped}(?:[^a-zа-яё]|$)`, "i").test(n)) return true;
  }
  return false;
}

function digestText(digest: SiteDigestForFactCheck): string {
  return [
    digest.title,
    digest.excerpt,
    digest.seo_title,
    digest.seo_description,
    ...digest.key_takeaways,
    ...digest.content_blocks.flatMap((b) => [b.heading, ...b.paragraphs, ...(b.bullets ?? [])]),
  ].join("\n");
}

export function prep2GoArticleGroundingText(params: {
  article: Prep2GoArticle;
  topic: NewsTopicConfig;
  weekStart: string;
  weekEnd: string;
  sourceLinks: NewsSourceLink[];
}): string {
  const { article, topic, weekStart, weekEnd, sourceLinks } = params;
  return [
    `Topic: ${topic.key} / ${topic.countryEn} / ${topic.countryRu}`,
    `Prep2Go URL: ${article.link}`,
    `Week: ${weekStart} - ${weekEnd}`,
    article.title,
    article.excerpt,
    ...article.keyTakeaways,
    ...article.sections.flatMap((section) => [section.heading, ...section.paragraphs, ...section.bullets]),
    "Resolved sources:",
    ...sourceLinks.map((s) => `${s.title}: ${s.url}`),
  ]
    .filter(Boolean)
    .join("\n");
}

function hasAdoptedOrInForceClaim(text: string): boolean {
  return /(?:вступ(?:ил|ает|или)\s+в\s+силу|действу(?:ет|ющий)|принят(?:ы|о|а)?|утвержден(?:ы|о|а)?|подписан(?:ы|о|а)?|adopted|approved|signed|enacted|in\s+force|entered\s+into\s+force)/i.test(
    text
  );
}

function sourceIsOnlyProposed(sourceText: string): boolean {
  const n = normalizeText(sourceText);
  const proposed = /(?:proposal|proposed|draft|bill|would|could|parliament\s+(?:debates|considers)|проект|предлож|законопроект|планиру|может\s+быть|обсужда)/i.test(
    n
  );
  const finalContext = n
    .replace(/\b(?:not|has\s+not|have\s+not|had\s+not)\s+(?:been\s+)?(?:adopted|approved|signed|enacted)\b/gi, " ")
    .replace(/\bif\s+(?:adopted|approved|signed|enacted)\b/gi, " ")
    .replace(/\b(?:не|ещ[её]\s+не)\s+(?:принят|утвержден|подписан|вступил\s+в\s+силу)\b/gi, " ")
    .replace(/\bесли\s+(?:примут|принят|утвердят|подпишут)\b/gi, " ");
  const final =
    /(?:adopted|approved|signed|enacted|entered\s+into\s+force|in\s+force|принят|утвержден|подписан|вступил\s+в\s+силу)/i.test(
      finalContext
    );
  return proposed && !final;
}

function hasOpenEligibilityClaim(text: string): boolean {
  return /(?:можно\s+подать|могут\s+подать|имеют\s+право|доступн\w*\s+(?:маршрут|программ)|eligible|qualif\w+|can\s+(?:still\s+)?apply|may\s+apply)/i.test(
    text
  );
}

function sourceSupportsEligibility(sourceText: string): boolean {
  return /(?:eligible|qualif\w+|can\s+apply|may\s+apply|requirements?|conditions?|имеют\s+право|можно\s+подать|услови\w+|требован\w+)/i.test(
    sourceText
  );
}

function hasLegalClaim(text: string): boolean {
  return LEGAL_CLAIM_MARKER.test(text);
}

function hasProposalClaim(text: string): boolean {
  return PROPOSAL_MARKER.test(text);
}

function sourceHasLimitedAffectedGroup(sourceText: string): boolean {
  return PROTECTION_STATUS_GROUP_MARKER.test(sourceText);
}

function generatedMentionsLimitedAffectedGroup(generatedText: string): boolean {
  return PROTECTION_STATUS_GROUP_MARKER.test(generatedText);
}

function sourceHasExcludedGroup(sourceText: string): boolean {
  return EXCLUDED_GROUP_MARKER.test(sourceText);
}

function generatedMentionsExcludedGroup(generatedText: string): boolean {
  return EXCLUDED_GROUP_MARKER.test(generatedText);
}

function hasBroadAffectedGroup(generatedText: string): boolean {
  return BROAD_AFFECTED_GROUP_MARKER.test(generatedText);
}

function sourceSupportsImpactFrame(sourceText: string, frame: "improvement" | "deterioration"): boolean {
  if (frame === "improvement") {
    return POSITIVE_FRAME_MARKER.test(sourceText);
  }
  return NEGATIVE_FRAME_MARKER.test(sourceText);
}

function sourceContradictsImpactFrame(sourceText: string, frame: "improvement" | "deterioration"): boolean {
  return sourceSupportsImpactFrame(sourceText, frame === "improvement" ? "deterioration" : "improvement");
}

function detectImpactFrames(generatedText: string): Array<"improvement" | "deterioration"> {
  const frames: Array<"improvement" | "deterioration"> = [];
  if (POSITIVE_FRAME_MARKER.test(generatedText)) frames.push("improvement");
  if (NEGATIVE_FRAME_MARKER.test(generatedText)) frames.push("deterioration");
  return frames;
}

function detectMissingQualifiersAndFraming(generatedText: string, sourceText: string): string[] {
  const errors: string[] = [];
  if (!hasLegalClaim(generatedText)) return errors;

  const impactFrames = detectImpactFrames(generatedText);
  const sourceLimited = sourceHasLimitedAffectedGroup(sourceText);
  const sourceExcluded = sourceHasExcludedGroup(sourceText);
  const needsPreciseGroup = impactFrames.length > 0 || hasBroadAffectedGroup(generatedText);

  if (sourceLimited && needsPreciseGroup && !generatedMentionsLimitedAffectedGroup(generatedText)) {
    errors.push(
      "missing_critical_qualifier: не указана точная affected_group для юридического/миграционного изменения."
    );
  }

  if (sourceExcluded && needsPreciseGroup && !generatedMentionsExcludedGroup(generatedText)) {
    errors.push(
      "missing_critical_qualifier: не указана unaffected_or_excluded_group, хотя источник ограничивает охват изменения."
    );
  }

  for (const frame of impactFrames) {
    if (sourceContradictsImpactFrame(sourceText, frame)) {
      errors.push(
        `misleading_framing: impact_frame "${frame}" противоречит источнику или скрывает важный контекст.`
      );
      continue;
    }

    if (!sourceSupportsImpactFrame(sourceText, frame)) {
      errors.push(
        `misleading_framing: impact_frame "${frame}" не подтвержден источником для указанной affected_group.`
      );
    }
  }

  return errors;
}

function detectMissingDateAndScopeForThresholds(generatedText: string, sourceText: string): string[] {
  const errors: string[] = [];
  if (!hasLegalClaim(generatedText) || !SALARY_THRESHOLD_MARKER.test(generatedText)) return errors;

  const generatedDates = extractDateClaims(generatedText);
  const sourceDates = extractDateClaims(sourceText);
  if (sourceDates.size > 0 && generatedDates.size === 0) {
    errors.push(
      "missing_critical_qualifier: salary/threshold claim omits the effective_date/deadline stated by the source."
    );
  }

  if (APPLICATION_SCOPE_MARKER.test(sourceText) && !APPLICATION_SCOPE_MARKER.test(generatedText)) {
    errors.push(
      "missing_critical_qualifier: salary/threshold claim omits application_scope (new applications, renewals, extensions, or transitional cases)."
    );
  }

  return errors;
}

function detectCountryMixups(generatedText: string, sourceText: string, topic: NewsTopicConfig): string[] {
  const errors: string[] = [];
  const generated = normalizeText(generatedText);
  const source = normalizeText(sourceText);
  const topicKey = topic.key.toLowerCase();

  for (const country of COUNTRY_ALIASES) {
    if (country.key === topicKey) continue;
    const generatedMention = mentionsCountryName(generated, country.names);
    if (!generatedMention) continue;
    const sourceMention = mentionsCountryName(source, country.names);
    if (!sourceMention) {
      errors.push(`В тексте есть возможная путаница стран: упомянута ${country.key}, но этого нет в статье Prep2Go.`);
    }
  }

  return errors;
}

function deterministicPrep2GoFactCheck(params: {
  stage: Prep2GoFactCheckStage;
  generatedText: string;
  sourceText: string;
  topic: NewsTopicConfig;
}): Prep2GoFactCheckReport {
  const criticalErrors: string[] = [];
  const warnings: string[] = [];
  const generatedText = stripUrlsAndThreadNumbers(params.generatedText);
  const sourceText = params.sourceText;
  const sourceDates = extractDateClaims(sourceText);
  const generatedDates = extractDateClaims(generatedText);
  const sourceNumbers = extractNumbers(sourceText);
  const generatedNumbers = extractNumbers(generatedText);

  for (const date of Array.from(generatedDates)) {
    if (!sourceDates.has(date)) {
      criticalErrors.push(`Неподтвержденная дата/дедлайн: ${date}.`);
    }
  }

  for (const number of Array.from(generatedNumbers)) {
    if (sourceNumbers.has(number)) continue;
    if (numberAppearsInPlainSourceText(sourceText, number)) continue;
    criticalErrors.push(`Неподтвержденное число/порог/срок: ${number}.`);
  }

  if (sourceIsOnlyProposed(sourceText) && hasAdoptedOrInForceClaim(generatedText)) {
    criticalErrors.push("Статус закона/программы искажен: источник говорит о предложении/проекте, а текст пишет как о принятом или действующем правиле.");
  }

  if (sourceIsOnlyProposed(sourceText) && hasLegalClaim(generatedText) && !hasProposalClaim(generatedText)) {
    criticalErrors.push(
      "missing_critical_qualifier: legal_status не указан как proposal/proposed, хотя источник описывает проект или предложение."
    );
  }

  if (hasOpenEligibilityClaim(generatedText) && !sourceSupportsEligibility(sourceText)) {
    criticalErrors.push("Заявление о праве подать/eligibility не подтверждено условиями из статьи Prep2Go.");
  }

  criticalErrors.push(...detectMissingQualifiersAndFraming(generatedText, sourceText));
  criticalErrors.push(...detectMissingDateAndScopeForThresholds(generatedText, sourceText));

  for (const marker of GENERIC_ADVICE_MARKERS) {
    const match = marker.exec(generatedText);
    if (match?.[0]) {
      criticalErrors.push(`Запрещенная экстраполяция/generic advice: «${match[0].trim()}».`);
    }
  }

  criticalErrors.push(...detectCountryMixups(generatedText, sourceText, params.topic));

  return {
    ok: criticalErrors.length === 0,
    stage: params.stage,
    criticalErrors: Array.from(new Set(criticalErrors)),
    warnings: Array.from(new Set(warnings)),
  };
}

async function llmPrep2GoFactCheck(params: {
  stage: Prep2GoFactCheckStage;
  generatedText: string;
  sourceText: string;
  topic: NewsTopicConfig;
}): Promise<Prep2GoFactCheckReport> {
  const system = `You are a strict pre-publication fact-checker for Emigro immigration news.

Verify the generated Russian output against ONLY the Prep2Go article text and resolved source list provided by the user.

Return fail if the generated output contains any critical unsupported or distorted claim about:
- dates, deadlines, effective dates;
- numbers, thresholds, ages, durations, money amounts, percentages;
- whether a law/program/status is proposed, adopted, signed, closed, open, or in force;
- visa/residency/citizenship eligibility conditions;
- affected groups and excluded/unaffected groups;
- application scope: new applications, renewals, extensions, transitional cases, pending cases;
- impact framing: improvement, deterioration, stability, relaxation, tightening, downgrade;
- missing critical qualifiers that would change reader understanding;
- misleading framing by omission, especially when a true detail is presented as a broad improvement or stability while the source limits the affected group or indicates a downgrade;
- country/topic mix-ups;
- generic advice extrapolated beyond the article.

For each high-risk immigration/legal-status claim, classify:
- affected_group: who is affected;
- unaffected_or_excluded_group: who is not affected, if the source indicates it;
- effective_date/deadline;
- legal_status: proposal, adopted, in_force, guidance, admin_notice, or unclear;
- application_scope: new applications, renewals, extensions, transitional cases, pending cases, or unclear;
- impact_frame: improvement, deterioration, neutral, or uncertain;
- missing_critical_qualifier: true when any omitted qualifier would materially change meaning;
- misleading_framing: true when the framing is directionally wrong or too broad.

Critical rule: fail visa/residency/citizenship/legal-status claims when missing_critical_qualifier or misleading_framing is true.
Unsupported positive/negative framing such as "даёт стабильность", "улучшение", "послабление", or "ужесточение" is critical unless the source supports both the impact and the precise affected group.

Uncertainty is acceptable only when the generated text explicitly marks it as uncertain and the article is also uncertain.
Do not require word-for-word translation; require factual support.`;

  const user = `Topic: ${params.topic.key} / ${params.topic.countryEn} / ${params.topic.countryRu}
Stage: ${params.stage}

SOURCE ARTICLE AND RESOLVED LINKS:
${params.sourceText}

GENERATED OUTPUT TO VERIFY:
${params.generatedText}

Return JSON:
- verdict: "pass" or "fail"
- critical_errors: concise list, empty if pass
- warnings: non-blocking issues only
- high_risk_claims: one object per visa/residency/citizenship/legal-status claim, with the dimensions requested above`;

  const verdict = await geminiFastJson<LlmFactCheckVerdict>(system, user, SCHEMA_FACT_CHECK, 8192);
  const claimErrors = (verdict.high_risk_claims ?? [])
    .filter((claim) => claim?.missing_critical_qualifier || claim?.misleading_framing)
    .map((claim) => {
      const issues = [
        claim.missing_critical_qualifier ? "missing_critical_qualifier" : null,
        claim.misleading_framing ? "misleading_framing" : null,
      ]
        .filter(Boolean)
        .join(", ");
      return `${issues}: ${claim.claim}`;
    });
  const criticalErrors = [...(verdict.critical_errors ?? []).filter(Boolean), ...claimErrors];
  const warnings = (verdict.warnings ?? []).filter(Boolean);
  const failed = verdict.verdict !== "pass" || criticalErrors.length > 0;

  return {
    ok: !failed,
    stage: params.stage,
    criticalErrors,
    warnings,
  };
}

export async function runPrep2GoFactCheck(params: RunPrep2GoFactCheckParams): Promise<Prep2GoFactCheckReport> {
  const generatedText = params.siteDigest ? digestText(params.siteDigest) : params.threadsText ?? "";
  if (!generatedText.trim()) {
    return {
      ok: false,
      stage: params.stage,
      criticalErrors: ["Fact-check input is empty."],
      warnings: [],
    };
  }

  const sourceText = prep2GoArticleGroundingText({
    article: params.article,
    topic: params.topic,
    weekStart: params.weekStart,
    weekEnd: params.weekEnd,
    sourceLinks: params.sourceLinks,
  });

  const deterministic = deterministicPrep2GoFactCheck({
    stage: params.stage,
    generatedText,
    sourceText,
    topic: params.topic,
  });

  if (!deterministic.ok || params.useLlm === false) {
    return deterministic;
  }

  let llm: Prep2GoFactCheckReport | null = null;
  let lastLlmError: Error | undefined;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      llm = await llmPrep2GoFactCheck({
        stage: params.stage,
        generatedText,
        sourceText,
        topic: params.topic,
      });
      lastLlmError = undefined;
      break;
    } catch (e) {
      lastLlmError = e instanceof Error ? e : new Error(String(e));
      const retryable = /invalid JSON|JSON at position/i.test(lastLlmError.message);
      if (!retryable || attempt === 2) break;
    }
  }

  if (!llm) {
    if (deterministic.ok) {
      console.warn(
        `[fact-check:${params.stage}] LLM check unavailable (${lastLlmError?.message ?? "unknown"}); using deterministic pass`
      );
      return deterministic;
    }
    throw lastLlmError ?? new Error("LLM fact-check failed");
  }

  return {
    ok: llm.ok,
    stage: params.stage,
    criticalErrors: Array.from(new Set([...deterministic.criticalErrors, ...llm.criticalErrors])),
    warnings: Array.from(new Set([...deterministic.warnings, ...llm.warnings])),
  };
}

export async function assertPrep2GoFactCheck(params: RunPrep2GoFactCheckParams): Promise<Prep2GoFactCheckReport> {
  const report = await runPrep2GoFactCheck(params);
  if (!report.ok) {
    throw new Error(`Prep2Go ${report.stage} fact-check failed: ${report.criticalErrors.join("; ")}`);
  }
  return report;
}
