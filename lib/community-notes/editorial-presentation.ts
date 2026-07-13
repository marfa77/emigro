/**
 * Editorial presentation — how guides READ, not just how they render in UI.
 * Complements article-blueprint.ts (completeness/fact-check) with narrative flow.
 */
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";
import { isGlossarySection } from "@/lib/community-notes/glossary";
import { isTelegraphicPractice, PRACTICE_BLOCK_FORMAT_RULES } from "@/lib/community-notes/practice-format";

export const PRESENTATION_LIMITS = {
  quickAnswerSentences: { min: 2, max: 3 },
  keyTakeawaysMax: 4,
  glossaryTermsMax: 10,
  sectionBulletsMax: 5,
  sectionLeadSentences: { min: 1, max: 2 },
  bulletLinesMax: 2,
  faqMin: 4,
} as const;

/** Required lead labels per non-glossary section (Что / Как / Зачем pattern). */
export const ACTION_GUIDE_LABELS = {
  what: "Что делать",
  how: "Как",
  why: "Зачем",
  unifiedHeading: "Пошагово для новичка",
} as const;

const JARGON_FIRST_RE =
  /^(split|ar condicionado|bolor|humidade|desumidificador|bomba de calor|condomínio|senhorio|isolamento|IPMA|DGEG|ADENE|técnico certificado)/i;
const LEAD_RE = /^(зачем|если вы|если планируете|этот блок|здесь|сначала|перед тем|важно понять|кратко|первое|вы только|вы уже|сейчас|утро|вечер|после|когда)/i;
const WHAT_RE = /что делать\s*:/i;
const WHY_RE = /зачем\s*:|зачем читать/i;
const HOW_RE = /^(как\s*:|шаг\s*\d|\d+[\).]\s)/i;
const ACTION_VERB_RE =
  /(проверьте|запишитесь|сохраните|подайте|закажите|купите|сравните|спросите|позвоните|оформите|возьмите|подготовьте|запланируйте|выберите|запишите|сфотографируйте|приезжайте|сверяйте|уточняйте|закладывайте|ищите|попросите|подпишите|откройте|включите|установите|мониторите|подпишитесь|сушите|сохраняйте|фиксируйте|обработайте|различите|зафиксируйте|проветривайте|запросите|не езжайте|не отправляйте|не покупайте|не ждите)/i;
const ABSTRACT_BULLET_RE =
  /^(это|данный|является|представляет|согласно|в соответствии|норматив|законодательств|регулирует|определяет|устанавливает)/i;
const UNEXPLAINED_ACRONYM_RE = /\b(AIMA|SNS|NIF|NIPC|IMT|IRN|DGEG|ADENE|IPMA|DGS)\b(?!\s*[\(—–-])/i;
const INLINE_GLOSS_RE = /\([^)]{4,60}\)/;
const FAQ_DIRECT_START_RE =
  /^(да|нет|можно|нельзя|нужен|не нужен|обычно|в среднем|\d|около|примерно|от \d|до \d|€|\$)/i;
const GAP_CHAT_FRAME_RE = /чат|пишут|говорят|на деле|объявлен|сайт|портал|idealista|senhorio|ожидани/i;
const GLAVNOE_RE = /главное\s*:/i;
const CHANNEL_ATTRIB_RE = /@[\w\d_]+|\([a-z_]+,\s*20\d{2}/i;

export type PresentationDraftInput = {
  content_kind: ContentKind;
  quick_answer: string;
  key_takeaways: string[];
  body_sections: NoteBodySection[];
  faq: CommunityNoteFaq[];
};

export type PresentationValidation = {
  warnings: string[];
  score: number;
};

function sectionLeadText(section: NoteBodySection): string {
  return (section.paragraphs ?? []).join(" ");
}

const MISTAKES_HEADING_RE = /типичн.*ошибк|ошибк|таймлайн/i;
const GAP_SECTION_KIND = "gap";

function sectionHasActionGuidePattern(section: NoteBodySection): boolean {
  if (section.section_kind === "action_guide") return true;
  if (section.heading.includes(ACTION_GUIDE_LABELS.unifiedHeading)) return true;
  const lead = sectionLeadText(section);
  const hasWhat = WHAT_RE.test(lead);
  const hasWhy = WHY_RE.test(lead);
  const bullets = section.bullets ?? [];
  const isGap = section.section_kind === GAP_SECTION_KIND;
  const isMistakes = MISTAKES_HEADING_RE.test(section.heading);
  const gapText = bullets.join(" ");
  const hasHow =
    bullets.some((b) => HOW_RE.test(b.trim())) ||
    bullets.some((b) => ACTION_VERB_RE.test(b)) ||
    (isGap && GAP_CHAT_FRAME_RE.test(gapText)) ||
    (isMistakes && bullets.some((b) => /ошибка:|таймлайн:/i.test(b)));
  return hasWhat && hasWhy && hasHow;
}

function bulletsLackActionVerbs(section: NoteBodySection): boolean {
  if (section.section_kind === GAP_SECTION_KIND) return false;
  if (MISTAKES_HEADING_RE.test(section.heading)) return false;
  const bullets = section.bullets ?? [];
  if (bullets.length === 0) return false;
  const actionable = bullets.filter(
    (b) => ACTION_VERB_RE.test(b) || HOW_RE.test(b.trim()) || !ABSTRACT_BULLET_RE.test(b.trim())
  );
  return actionable.length < Math.ceil(bullets.length / 2);
}

/** Validate Что/Как/Зачем pattern and term glosses for Portugal guides. */
export function validateActionGuideSections(
  sections: NoteBodySection[],
  options?: { strict?: boolean }
): { warnings: string[]; errors: string[] } {
  const warnings: string[] = [];
  const errors: string[] = [];
  const strict = options?.strict ?? false;

  for (const section of sections) {
    if (isGlossarySection(section)) continue;

    if (!sectionHasActionGuidePattern(section)) {
      const msg = `action_guide: «${section.heading}» needs «Что делать» + «Зачем» in lead and actionable «Как» bullets`;
      if (strict) errors.push(msg);
      else warnings.push(msg);
    }

    if (bulletsLackActionVerbs(section)) {
      const msg = `action_guide: «${section.heading}» bullets read abstract — add verbs (проверьте, запишитесь, подготовьте…)`;
      if (strict) errors.push(msg);
      else warnings.push(msg);
    }

    const bodyText = [...(section.paragraphs ?? []), ...(section.bullets ?? [])].join(" ");
    const acronymsInGlossary = isGlossarySection(section);
    if (
      !acronymsInGlossary &&
      UNEXPLAINED_ACRONYM_RE.test(bodyText) &&
      !INLINE_GLOSS_RE.test(bodyText.slice(0, 240))
    ) {
      warnings.push(
        `action_guide: «${section.heading}» has acronym without inline gloss — add «термин (расшифровка)» or glossary`
      );
    }
  }

  return { warnings, errors };
}

function countSentences(text: string): number {
  return text.split(/(?<=[.!?…])\s+/).filter((s) => s.trim().length > 8).length;
}

function countLines(text: string): number {
  return text.split(/\n/).filter(Boolean).length || 1;
}

/** Non-blocking presentation QA — warnings for editorial review and cron logs. */
export function validateEditorialPresentation(input: PresentationDraftInput): PresentationValidation {
  const warnings: string[] = [];
  if (input.content_kind !== "guide") {
    return { warnings, score: 100 };
  }

  let score = 100;

  const qaSentences = countSentences(input.quick_answer);
  if (qaSentences < PRESENTATION_LIMITS.quickAnswerSentences.min) {
    warnings.push(`presentation: quick_answer ${qaSentences} sentences (need ${PRESENTATION_LIMITS.quickAnswerSentences.min}–${PRESENTATION_LIMITS.quickAnswerSentences.max})`);
    score -= 8;
  }
  if (qaSentences > PRESENTATION_LIMITS.quickAnswerSentences.max) {
    warnings.push(`presentation: quick_answer ${qaSentences} sentences (max ${PRESENTATION_LIMITS.quickAnswerSentences.max} plain Russian)`);
    score -= 6;
  }
  if (JARGON_FIRST_RE.test(input.quick_answer.trim())) {
    warnings.push("presentation: quick_answer starts with PT jargon — lead with plain Russian");
    score -= 10;
  }

  if (input.key_takeaways.length > PRESENTATION_LIMITS.keyTakeawaysMax) {
    warnings.push(
      `presentation: key_takeaways ${input.key_takeaways.length} > ${PRESENTATION_LIMITS.keyTakeawaysMax} («Что решить сегодня»)`
    );
    score -= 8;
  }

  for (const takeaway of input.key_takeaways) {
    if (/^На практике:/i.test(takeaway) && isTelegraphicPractice(takeaway)) {
      warnings.push(
        "presentation: key_takeaways «На практике» reads telegraphic — use full sentences with reader impact (see PRACTICE_BLOCK_FORMAT_RULES)"
      );
      score -= 8;
      break;
    }
  }

  for (const section of input.body_sections) {
    if (isGlossarySection(section)) {
      const terms = section.bullets?.length ?? 0;
      if (terms > PRESENTATION_LIMITS.glossaryTermsMax) {
        warnings.push(
          `presentation: glossary ${terms} terms > ${PRESENTATION_LIMITS.glossaryTermsMax} (only terms used below)`
        );
        score -= 4;
      }
      continue;
    }

    const leadCount = (section.paragraphs ?? []).filter((p) => p.trim().length > 20).length;
    if (leadCount < PRESENTATION_LIMITS.sectionLeadSentences.min) {
      warnings.push(`presentation: «${section.heading}» missing lead (1–2 sentences: зачем читать)`);
      score -= 5;
    } else if (leadCount > 0 && !LEAD_RE.test((section.paragraphs ?? [])[0] ?? "")) {
      const first = (section.paragraphs ?? [])[0] ?? "";
      if (first.length > 120 && !/[.:]/.test(first.slice(0, 80))) {
        warnings.push(`presentation: «${section.heading}» lead should explain зачем читать, not dump facts`);
        score -= 3;
      }
    }

    const bullets = section.bullets ?? [];
    if (bullets.length > PRESENTATION_LIMITS.sectionBulletsMax) {
      warnings.push(
        `presentation: «${section.heading}» ${bullets.length} bullets > ${PRESENTATION_LIMITS.sectionBulletsMax}`
      );
      score -= 4;
    }

    for (const bullet of bullets) {
      if (countLines(bullet) > PRESENTATION_LIMITS.bulletLinesMax) {
        warnings.push(`presentation: bullet too long in «${section.heading}» (max ${PRESENTATION_LIMITS.bulletLinesMax} lines)`);
        score -= 2;
        break;
      }
      if (section.section_kind === "practice" && isTelegraphicPractice(bullet)) {
        warnings.push(
          `presentation: «${section.heading}» practice bullet is telegraphic — explain what it means for the reader`
        );
        score -= 4;
        break;
      }
      if (CHANNEL_ATTRIB_RE.test(bullet)) {
        warnings.push(`presentation: «${section.heading}» bullet has channel attribution — weave as story`);
        score -= 3;
        break;
      }
    }

    const leadText = sectionLeadText(section);
    if (!isGlossarySection(section) && leadText.length > 80 && !GLAVNOE_RE.test(leadText)) {
      warnings.push(`presentation: «${section.heading}» missing «Главное: …» closing line`);
      score -= 2;
    }
  }

  const gapSection = input.body_sections.find((s) => s.section_kind === "gap");
  if (gapSection) {
    const gapText = (gapSection.bullets ?? []).join(" ");
    if (!GAP_CHAT_FRAME_RE.test(gapText)) {
      warnings.push("presentation: gap section should frame «что пишут в чатах vs что на сайте»");
      score -= 5;
    }
  }

  for (const item of input.faq) {
    const answerStart = item.a.trim().slice(0, 40);
    if (!FAQ_DIRECT_START_RE.test(answerStart)) {
      warnings.push(`presentation: FAQ «${item.q.slice(0, 40)}…» answer should start with yes/no/number`);
      score -= 3;
      break;
    }
  }

  const actionGuide = validateActionGuideSections(input.body_sections);
  warnings.push(...actionGuide.warnings);
  for (const w of actionGuide.warnings) {
    if (w.startsWith("action_guide:")) score -= 4;
  }
  for (const e of actionGuide.errors) {
    warnings.push(e);
    score -= 8;
  }

  return { warnings, score: Math.max(0, score) };
}

/** Prompt block — action manual for Portugal newcomers (Что / Как / Зачем). */
export const EDITORIAL_ACTION_GUIDE_RULES = `
РУКОВОДСТВО К ДЕЙСТВИЮ (мы сами проходили через это — пишем для новичка в Португалии):
Не справочник и не энциклопедия. Каждый блок отвечает: ЧТО делать, КАК делать, ЗАЧЕМ это нужно.

Паттерн в КАЖДОЙ секции body (кроме glossary):
- paragraphs[0]: «Что делать: …» — 1–2 предложения простым русским, без жаргона.
- paragraphs[1]: «Зачем: …» — 1 предложение, почему этот шаг важен (что будет, если пропустить).
- bullets = «Как»: до 5 пунктов с глаголом действия (проверьте, запишитесь, подготовьте, сравните…).
  Можно «Как: 1) … 2) …» или нумерованные шаги. Не абстрактные факты без действия.

Альтернатива: одна секция section_kind "action_guide" с heading «Пошагово для новичка» — тот же Что/Как/Зачем внутри.

Термины PT-PT и аббревиатуры:
- Первое упоминание в секции: termo (русская расшифровка) ИЛИ термин уже в «Словарь терминов».
- Словарь: максимум 10 терминов, только те, что реально встречаются в тексте ниже.
- Без расшифровки: AIMA, SNS, NIF, IMT, DGEG, IPMA и др. — запрещены в первой фразе секции.

Тон: «мы сами проходили через это» — практичный совет, не бюрократический канцелярит.
Запрещено: абзацы «согласно нормативам», bullets без глагола, стена терминов без пояснения.`.trim();

/** Prompt block for Gemini — reading flow and tone. */
export const EDITORIAL_PRESENTATION_RULES = `
ПОДАЧА ДЛЯ ЧТЕНИЯ (editorial presentation — голос «Опытный релокант за кофе»):
Цель: приятно, понятно, с лёгкой художественностью — как совет за кофе, не техспецификация.

Порядок смысла: микросцена/контекст → что нужно → как сделать → подводные камни → «Главное».

1. quick_answer (хук) — микросцена + 2 факта; 2–3 коротких предложения БЕЗ жаргона в первой фразе.
   Пример: «Первое утро в Porto: влажность 90%, отопления нет…» → факт + гео + один PT-термин в скобках.

2. key_takeaways («Что решить сегодня») — максимум 4 пункта, глагол действия, без дубля body.
   Минимум 2 с «Официально:» / «На практике:» / «Расхождение:».
   «На практике:» — 1–3 полных предложения: что происходит + что это значит для читателя; без цепочек через «;».

${PRACTICE_BLOCK_FORMAT_RULES}

3. «Словарь» — literary intro («Слова, которые услышите в balcão…»); максимум 8 терминов из текста ниже.

4. body_sections — в КАЖДОЙ секции (кроме glossary):
   - lead «зачем вам это сейчас» (1–2 предложения, можно микросцену)
   - «Что делать: …» + «Зачем: …» в paragraphs
   - bullets = «Как» — до 5 actionable пунктов с глаголом
   - финал paragraphs: «Главное: …» — одна запоминающаяся строка
   Или section_kind "action_guide" / heading «Пошагово для новичка».

5. Bullets — максимум 2 строки. Формат: глагол + **суть** — пояснение; PT-термин в скобках при первом use.
   Practice bullets: одна мысль, без «;»-списков; атрибуция чата — «Участники @channel писали, что…».
   Без @username в скобках и «(lepta, 2025-08)» — вплетайте смысл в текст.

6. gap — «что пишут в чатах / что на сайте / что на деле», не абстрактно.

7. «Типичные ошибки» — коротко, «чего не делать»; без воды.

8. faq — вопрос = реальный вопрос пользователя; ответ: да/нет/цифра, затем «По правилам…» / «На практике…».

9. Перелинковка — [читаемый текст](/notes/slug), не голый путь.

Тон: тёплый советник релоканта. Короткие + средние предложения. Активный залог.
Запрещено: стена bullets, бюрократический канцелярит, спам атрибуции чатов.`.trim();

/** Compact rewrite hint for presentation-only passes (lighter than full blueprint rewrite). */
export const PRESENTATION_REWRITE_HINT = `
ПЕРЕПИСЫВАНИЕ ПОДАЧИ (сохрани все факты, цифры, органы, ссылки):
- Сожми quick_answer до 2–3 предложений простым русским.
- key_takeaways: максимум 4, action-oriented; «На практике:» — полные предложения, не «;»-списки.
- В каждой секции: «Что делать» + «Зачем» в lead; bullets = «Как» с глаголами; ≤5 bullets, ≤2 строки.
- PT-термины: в словаре (≤10) или inline (расшифровка) при первом упоминании.
- gap: «чат vs сайт»; faq: ответ с да/нет/цифры в начале.
- Перелинковка: [читаемый текст](/notes/slug), не голый /notes/slug.
Не удаляй факты и practice-цитаты — только улучши читаемость.`.trim();

export { PRACTICE_BLOCK_FORMAT_RULES } from "@/lib/community-notes/practice-format";
