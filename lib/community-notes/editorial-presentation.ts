/**
 * Editorial presentation — how guides READ, not just how they render in UI.
 * Complements article-blueprint.ts (completeness/fact-check) with narrative flow.
 */
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";
import { isGlossarySection } from "@/lib/community-notes/glossary";

export const PRESENTATION_LIMITS = {
  quickAnswerSentences: { min: 2, max: 3 },
  keyTakeawaysMax: 4,
  glossaryTermsMax: 8,
  sectionBulletsMax: 5,
  sectionLeadSentences: { min: 1, max: 2 },
  bulletLinesMax: 2,
  faqMin: 4,
} as const;

const JARGON_FIRST_RE =
  /^(split|ar condicionado|bolor|humidade|desumidificador|bomba de calor|condomínio|senhorio|isolamento|IPMA|DGEG|ADENE|técnico certificado)/i;
const LEAD_RE = /^(зачем|если вы|если планируете|этот блок|здесь|сначала|перед тем|важно понять|кратко)/i;
const FAQ_DIRECT_START_RE =
  /^(да|нет|можно|нельзя|нужен|не нужен|обычно|в среднем|\d|около|примерно|от \d|до \d|€|\$)/i;
const GAP_CHAT_FRAME_RE = /чат|пишут|говорят|на деле|объявлен|сайт|портал|idealista|senhorio/i;

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

  return { warnings, score: Math.max(0, score) };
}

/** Prompt block for Gemini — reading flow and tone. */
export const EDITORIAL_PRESENTATION_RULES = `
ПОДАЧА ДЛЯ ЧТЕНИЯ (editorial presentation — не путать с UI):
Цель: приятно, понятно, логично — как совет опытного релоканта, не как техспецификация.

Порядок смысла: контекст → что нужно → как сделать → подводные камни → термины.

1. quick_answer (хук) — ровно 2–3 коротких предложения простым русским БЕЗ жаргона в первой фразе.
   Сначала «что это значит для семьи», потом гео (Norte/Порту/Braga), PT-термин — один раз в скобках.

2. key_takeaways («Что решить сегодня») — максимум 4 пункта, глагол действия, без дубля body.
   Не пересказывай секции; это решения на сегодня/на просмотр/перед подписью.

3. «Словарь» — только термины из текста ниже, максимум 8, одна строка: **termo** — пояснение.

4. body_sections — каждая открывается LEAD: 1–2 предложения «зачем читать этот блок».
   Затем максимум 5 bullets. Не больше.

5. Bullets — максимум 2 строки. Формат: **суть** — пояснение; PT-термин в скобках один раз.
   Вне glossary не злоупотребляй ** — только для сути пункта.

6. gap — формулируй как «что пишут в чатах / что на сайте / что на деле», не абстрактно.
   Пример: «Idealista: ar condicionado → на деле portable 2010 без heat pump».

7. «Типичные ошибки» — коротко, запоминающиеся, «чего не делать»; без воды.

8. faq — вопрос = реальный вопрос пользователя («можно ли…», «сколько…», «нужен ли…»).
   Ответ начинается с прямого да/нет/цифры/срока, затем «По правилам…» / «На практике…».

9. Перелинковка между гайдами — только [читаемый текст](/notes/slug), не голый путь /notes/slug.
   Пример: «см. [запись в AIMA](/notes/aima-agora-zapis-2026)», не «см. /notes/aima-agora-zapis-2026».

Тон: дружелюбный советник релоканта. Короткие предложения. Активный залог.
Запрещено: стена bullets без lead, повтор одного факта в quick_answer + takeaway + gap, бюрократический канцелярит.`.trim();

/** Compact rewrite hint for presentation-only passes (lighter than full blueprint rewrite). */
export const PRESENTATION_REWRITE_HINT = `
ПЕРЕПИСЫВАНИЕ ПОДАЧИ (сохрани все факты, цифры, органы, ссылки):
- Сожми quick_answer до 2–3 предложений простым русским.
- key_takeaways: максимум 4, action-oriented.
- Добавь lead (зачем читать) в каждую секцию; bullets ≤5, ≤2 строки.
- gap: «чат vs сайт»; faq: ответ с да/нет/цифры в начале.
- Перелинковка: [читаемый текст](/notes/slug), не голый /notes/slug.
Не удаляй факты и practice-цитаты — только улучши читаемость.`.trim();
