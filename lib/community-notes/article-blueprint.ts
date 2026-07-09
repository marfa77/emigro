/**
 * Editorial blueprint for portugal.emigro.online guides.
 * Reference article: mezhdunarodnye-shkoly-portugaliya-2026 (hand-curated gold standard).
 */
import {
  countGlossaryTerms,
  isGlossarySection,
  upsertGlossarySection,
  validateGuideGlossary,
} from "@/lib/community-notes/glossary";
import {
  bootstrapOfficialPracticeCopy,
  countLabeledTakeaways,
  inferSectionKind,
  validateOfficialPracticeCopy,
} from "@/lib/community-notes/official-vs-practice";
import { auditPracticeQuality } from "@/lib/community-notes/practice-enrichment";
import type { CommunityNoteFaq, CommunityNoteLink, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

/** Hand-curated guide used as structural reference. */
export const BLUEPRINT_SOURCE_SLUG = "mezhdunarodnye-shkoly-portugaliya-2026";

export const BLUEPRINT_MIN = {
  glossaryTerms: 5,
  officialBullets: 4,
  practiceBullets: 8,
  gapBullets: 4,
  mistakeBullets: 4,
  faq: 4,
  keyTakeaways: 4,
  labeledTakeaways: 2,
  officialLinks: 2,
  bodySections: 6,
} as const;

export const BLUEPRINT_PASS_SCORE = 70;

const GAP_HEADING = /расхожд|где.*расход|формально.*практик|ожидание.*реальност|сайт.*деле/i;
const MISTAKES_HEADING = /типичн.*ошибк|ошибк.*релокант|чего избегать|не делайте/i;
const TIMELINE_HEADING = /таймлайн|сроки|календарь|пошагов|timeline/i;
const OFFICIAL_CLAIM_RE =
  /официальн|по правилам|требует|портал|gov\.pt|finanças|aima|imt|sns|dge|sed|decreto|статья|налог|обязател/i;
const NORTE_RE = /norte|порту|porto|брага|braga|matosinhos|guimarães|minho|foz|boavista|gualtar/i;
const FAQ_OFFICIAL_PRACTICE_RE = /по правилам|официальн|на практике/i;

export type BlueprintDraftInput = {
  content_kind: ContentKind;
  slug?: string;
  quick_answer: string;
  seo_description?: string;
  body_sections: NoteBodySection[];
  key_takeaways: string[];
  faq: CommunityNoteFaq[];
  official_links?: CommunityNoteLink[];
};

export type BlueprintValidation = {
  score: number;
  errors: string[];
  warnings: string[];
};

function sectionKinds(sections: NoteBodySection[]): Array<ReturnType<typeof inferSectionKind>> {
  return sections.map((s) => inferSectionKind(s));
}

function countBulletsByKind(sections: NoteBodySection[], kind: "official" | "practice" | "gap"): number {
  return sections
    .filter((s) => inferSectionKind(s) === kind)
    .flatMap((s) => s.bullets ?? []).length;
}

function hasMistakesOrTimelineSection(sections: NoteBodySection[]): boolean {
  return sections.some(
    (s) =>
      inferSectionKind(s) === "practice" &&
      (MISTAKES_HEADING.test(s.heading) || TIMELINE_HEADING.test(s.heading)) &&
      (s.bullets?.length ?? 0) >= BLUEPRINT_MIN.mistakeBullets
  );
}

function hasGapSection(sections: NoteBodySection[]): boolean {
  return sections.some(
    (s) =>
      inferSectionKind(s) === "gap" ||
      (GAP_HEADING.test(s.heading) && (s.bullets?.length ?? 0) >= BLUEPRINT_MIN.gapBullets)
  );
}

/** Verify canonical section order: glossary → official* → practice* → gap → mistakes/timeline. */
export function validateSectionOrder(sections: NoteBodySection[]): string[] {
  const errors: string[] = [];
  if (sections.length === 0) return ["blueprint: empty body_sections"];

  const kinds = sectionKinds(sections);
  const glossaryIdx = kinds.indexOf("glossary");
  if (glossaryIdx < 0) {
    errors.push("blueprint: missing glossary section");
    return errors;
  }
  if (glossaryIdx !== 0) {
    errors.push(`blueprint: glossary must be first section (index ${glossaryIdx})`);
  }

  const firstOfficial = kinds.findIndex((k) => k === "official");
  const firstPractice = kinds.findIndex((k) => k === "practice");
  const firstGap = kinds.findIndex((k) => k === "gap");

  if (firstOfficial >= 0 && firstOfficial < glossaryIdx) {
    errors.push("blueprint: official section before glossary");
  }
  if (firstPractice >= 0 && firstOfficial >= 0 && firstPractice < firstOfficial) {
    errors.push("blueprint: practice section before official");
  }
  if (firstGap >= 0 && firstPractice >= 0 && firstGap < firstPractice) {
    errors.push("blueprint: gap section before practice");
  }

  const mistakesIdx = sections.findIndex(
    (s) =>
      inferSectionKind(s) === "practice" &&
      (MISTAKES_HEADING.test(s.heading) || TIMELINE_HEADING.test(s.heading))
  );
  if (mistakesIdx >= 0 && firstGap >= 0 && mistakesIdx < firstGap) {
    errors.push("blueprint: mistakes/timeline section before gap");
  }

  return errors;
}

function scoreComponent(passed: boolean, weight: number): number {
  return passed ? weight : 0;
}

/** 0–100 quality score against the gold-standard blueprint. */
export function scoreBlueprint(input: BlueprintDraftInput): number {
  if (input.content_kind !== "guide") return 100;

  const sections = input.body_sections;
  const kinds = sectionKinds(sections);
  let score = 0;

  score += scoreComponent(kinds[0] === "glossary", 10);
  const glossary = sections.find(isGlossarySection);
  const glossaryCount = glossary ? countGlossaryTerms(glossary) : 0;
  score += scoreComponent(glossaryCount >= BLUEPRINT_MIN.glossaryTerms, 8);

  score += scoreComponent(countBulletsByKind(sections, "official") >= BLUEPRINT_MIN.officialBullets, 8);
  score += scoreComponent(countBulletsByKind(sections, "practice") >= BLUEPRINT_MIN.practiceBullets, 15);

  const practiceAudit = auditPracticeQuality(
    {
      slug: input.slug ?? "draft",
      content_kind: input.content_kind,
      body_sections: sections,
      key_takeaways: input.key_takeaways,
    },
    { strict: true }
  );
  score += scoreComponent(practiceAudit.status === "OK", 12);

  score += scoreComponent(hasGapSection(sections), 8);
  score += scoreComponent(hasMistakesOrTimelineSection(sections), 8);

  score += scoreComponent(countLabeledTakeaways(input.key_takeaways) >= BLUEPRINT_MIN.labeledTakeaways, 6);
  score += scoreComponent(input.key_takeaways.length >= BLUEPRINT_MIN.keyTakeaways, 4);

  const faqWithSplit = input.faq.filter((f) => FAQ_OFFICIAL_PRACTICE_RE.test(`${f.q} ${f.a}`)).length;
  score += scoreComponent(input.faq.length >= BLUEPRINT_MIN.faq, 5);
  score += scoreComponent(faqWithSplit >= 2, 5);

  const links = input.official_links ?? [];
  score += scoreComponent(links.length >= BLUEPRINT_MIN.officialLinks, 8);

  const geoText = `${input.quick_answer} ${input.seo_description ?? ""}`;
  score += scoreComponent(/португал/i.test(geoText), 3);
  score += scoreComponent(NORTE_RE.test(geoText), 3);

  score += scoreComponent(validateSectionOrder(sections).length === 0, 7);

  return Math.min(100, score);
}

/** Blocking errors + non-blocking warnings for editorial QA. */
export function validateAgainstBlueprint(input: BlueprintDraftInput): BlueprintValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (input.content_kind !== "guide") {
    return { score: 100, errors, warnings };
  }

  errors.push(...validateGuideGlossary(input.body_sections));
  errors.push(...validateSectionOrder(input.body_sections));
  errors.push(...validateOfficialPracticeCopy(input));

  const officialBullets = countBulletsByKind(input.body_sections, "official");
  const practiceBullets = countBulletsByKind(input.body_sections, "practice");

  if (officialBullets < BLUEPRINT_MIN.officialBullets) {
    errors.push(`blueprint: official bullets ${officialBullets} < ${BLUEPRINT_MIN.officialBullets}`);
  }
  if (practiceBullets < BLUEPRINT_MIN.practiceBullets) {
    errors.push(`blueprint: practice bullets ${practiceBullets} < ${BLUEPRINT_MIN.practiceBullets}`);
  }
  if (!hasGapSection(input.body_sections)) {
    errors.push(`blueprint: need gap section with ≥${BLUEPRINT_MIN.gapBullets} bullets`);
  }
  if (!hasMistakesOrTimelineSection(input.body_sections)) {
    errors.push(
      `blueprint: need mistakes/timeline section with ≥${BLUEPRINT_MIN.mistakeBullets} bullets`
    );
  }
  if (input.body_sections.length < BLUEPRINT_MIN.bodySections) {
    errors.push(`blueprint: body_sections ${input.body_sections.length} < ${BLUEPRINT_MIN.bodySections}`);
  }
  if (countLabeledTakeaways(input.key_takeaways) < BLUEPRINT_MIN.labeledTakeaways) {
    errors.push(
      `blueprint: key_takeaways need ≥${BLUEPRINT_MIN.labeledTakeaways} with «Официально:/На практике:/Расхождение:»`
    );
  }
  if (input.faq.length < BLUEPRINT_MIN.faq) {
    errors.push(`blueprint: faq ${input.faq.length} < ${BLUEPRINT_MIN.faq}`);
  }

  const faqWithSplit = input.faq.filter((f) => FAQ_OFFICIAL_PRACTICE_RE.test(`${f.q} ${f.a}`)).length;
  if (faqWithSplit < 2) {
    warnings.push("blueprint: faq should split «По правилам…» / «На практике…» in ≥2 answers");
  }

  const links = input.official_links ?? [];
  if (links.length < BLUEPRINT_MIN.officialLinks) {
    errors.push(`blueprint: official_links ${links.length} < ${BLUEPRINT_MIN.officialLinks} (fact-check)`);
  }

  const officialSections = input.body_sections.filter((s) => inferSectionKind(s) === "official");
  const hasOfficialClaims = officialSections.some(
    (s) =>
      (s.paragraphs ?? []).some((p) => OFFICIAL_CLAIM_RE.test(p)) ||
      (s.bullets ?? []).some((b) => OFFICIAL_CLAIM_RE.test(b))
  );
  if (hasOfficialClaims && links.length === 0) {
    errors.push("blueprint: official sections need official_links citations");
  }

  const geoText = `${input.quick_answer} ${input.seo_description ?? ""}`;
  if (!/португал/i.test(geoText)) {
    warnings.push("blueprint: quick_answer/seo_description missing Португалия");
  }
  if (!NORTE_RE.test(geoText) && !NORTE_RE.test(input.body_sections.flatMap((s) => s.bullets ?? []).join(" "))) {
    warnings.push("blueprint: missing Norte geo (Порту/Braga) in quick_answer or practice");
  }

  const practiceAudit = auditPracticeQuality(
    {
      slug: input.slug ?? "draft",
      content_kind: input.content_kind,
      body_sections: input.body_sections,
      key_takeaways: input.key_takeaways,
    },
    { strict: true }
  );
  if (practiceAudit.status !== "OK") {
    errors.push(...practiceAudit.reasons.map((r) => `blueprint practice: ${r}`));
  }

  const score = scoreBlueprint(input);
  if (score < BLUEPRINT_PASS_SCORE && errors.length === 0) {
    warnings.push(`blueprint: score ${score} < ${BLUEPRINT_PASS_SCORE}`);
  }

  return { score, errors, warnings };
}

/** Prompt block for Gemini — mirrors gold-standard section order. */
export const BLUEPRINT_STRUCTURE_RULES = `
СТРУКТУРА ПО БЛЮПРИНТУ (обязательно для guide; эталон — международные школы PT):
Порядок body_sections (section_kind в скобках):
1. «Словарь терминов» (glossary) — ПЕРВАЯ секция, 5–12 PT-PT терминов в bullets (**termo** — пояснение).
2. 1–2 секции official — что требуют органы/порталы: документы, сроки, нормы. Минимум 4 bullets суммарно.
3. 2+ секции practice — опыт релокантов из чатов: Porto/Braga/Norte в примерах, цифры €, сроки, названия органов. Минимум 8 bullets суммарно.
4. «Где расходится» / gap — bullets «сайт говорит → на деле» (минимум 4).
5. «Типичные ошибки» или «Таймлайн» (practice) — минимум 4 bullets ошибок или шагов по срокам.
Не смешивай official и practice в одной секции. Не ставь gap до practice.

key_takeaways: 4–6 пунктов, минимум 2 с префиксами «Официально:» / «На практике:» / «Расхождение:».
faq: 4–5 вопросов; в ответах разделяй «По правилам…» и «На практике…».
quick_answer: суть + гео (Norte: Порту/Braga) + 1 фраза практики если есть расхождение.
official_links: не в JSON тела — редактор добавит по теме; в official-секциях ссылайся на порталы по имени (Finanças, AIMA, IMT, DGE…).`.trim();

function gapBulletsFromTakeaways(takeaways: string[]): string[] {
  return takeaways
    .filter((t) => /^Расхождение:/i.test(t.trim()))
    .map((t) => {
      const body = t.replace(/^Расхождение:\s*/i, "").trim();
      const parts = body.split(/[—–-]\s+/);
      if (parts.length >= 2) return `«${parts[0].trim()}» → ${parts.slice(1).join(" — ")}`;
      return body;
    })
    .slice(0, 6);
}

function mistakeBulletsFromPractice(sections: NoteBodySection[]): string[] {
  const candidates = sections
    .filter((s) => inferSectionKind(s) === "practice")
    .flatMap((s) => s.bullets ?? [])
    .filter((b) => /^ошибка:/i.test(b.trim()) || /не (платите|ждите|игнорируйте|откладывайте)/i.test(b));
  return candidates.slice(0, 6);
}

function ensureOfficialBullets(sections: NoteBodySection[]): { sections: NoteBodySection[]; changed: boolean } {
  let changed = false;
  const next = sections.map((section) => {
    if (inferSectionKind(section) !== "official") return section;
    const bullets = section.bullets ?? [];
    if (bullets.length >= BLUEPRINT_MIN.officialBullets) return section;
    const fromParagraphs = (section.paragraphs ?? [])
      .flatMap((p) => p.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter((s) => s.length > 25))
      .filter((s) => !bullets.some((b) => b.includes(s.slice(0, 30))));
    const merged = [...bullets, ...fromParagraphs].slice(0, 8);
    if (merged.length < BLUEPRINT_MIN.officialBullets) return section;
    changed = true;
    return { ...section, bullets: merged, paragraphs: section.paragraphs?.slice(0, 1) };
  });
  return { sections: next, changed };
}

/** Best-effort structural fixes without Gemini rewrite. */
export function applyBlueprintFixes(input: {
  content_kind: ContentKind;
  quick_answer: string;
  key_takeaways: string[];
  body_sections: NoteBodySection[];
  faq: CommunityNoteFaq[];
  glossaryTerms?: import("@/lib/community-notes/types").GlossaryTerm[];
}): {
  body_sections: NoteBodySection[];
  key_takeaways: string[];
  changed: boolean;
} {
  if (input.content_kind !== "guide") {
    return { body_sections: input.body_sections, key_takeaways: input.key_takeaways, changed: false };
  }

  let changed = false;
  let sections = [...input.body_sections];
  let takeaways = [...input.key_takeaways];

  const boot = bootstrapOfficialPracticeCopy({
    content_kind: input.content_kind,
    quick_answer: input.quick_answer,
    key_takeaways: takeaways,
    body_sections: sections,
  });
  if (boot.changed) {
    sections = boot.body_sections;
    takeaways = boot.key_takeaways;
    changed = true;
  }

  if (input.glossaryTerms?.length) {
    const prev = sections.findIndex(isGlossarySection);
    sections = upsertGlossarySection(sections, input.glossaryTerms);
    if (prev < 0 || prev > 0) changed = true;
  }

  const kinds = sections.map((s) => inferSectionKind(s));
  const glossaryEnd = kinds.indexOf("glossary") >= 0 ? 1 : 0;
  if (!kinds.includes("official") && sections.length > glossaryEnd) {
    sections = sections.map((s, i) =>
      i === glossaryEnd && !s.section_kind ? { ...s, section_kind: "official" as const } : s
    );
    changed = true;
  }
  if (!sections.some((s) => inferSectionKind(s) === "practice") && sections.length > glossaryEnd + 1) {
    const practiceIdx = sections.findIndex(
      (s, i) => i > glossaryEnd && inferSectionKind(s) !== "official" && inferSectionKind(s) !== "gap"
    );
    if (practiceIdx >= 0 && !sections[practiceIdx].section_kind) {
      sections = sections.map((s, i) =>
        i === practiceIdx ? { ...s, section_kind: "practice" as const } : s
      );
      changed = true;
    }
  }

  const officialBullets = ensureOfficialBullets(sections);
  if (officialBullets.changed) {
    sections = officialBullets.sections;
    changed = true;
  }

  if (!hasGapSection(sections)) {
    const gapBullets = gapBulletsFromTakeaways(takeaways);
    if (gapBullets.length >= 2) {
      sections = [
        ...sections,
        {
          heading: "Где официальные правила и жизнь расходятся",
          section_kind: "gap" as const,
          bullets: gapBullets,
        },
      ];
      changed = true;
    } else if (takeaways.some((t) => /^На практике:/i.test(t))) {
      sections = [
        ...sections,
        {
          heading: "Где расходится портал и практика",
          section_kind: "gap" as const,
          bullets: [
            "Портал: формальные сроки и список документов — на деле очереди и дозапросы типичны в Norte (Porto, Braga).",
            "Сайт: «всё онлайн» — финальный визит или бумажный шаг часто обязателен по опыту чатов 2026.",
            "Ожидание: единые правила по всей PT — на практике сроки IMT/AIMA/Finanças в Lisboa и Porto различаются.",
            "Чат: «у всех прокатило» — индивидуальный кейс; сверяйте с gov.pt и держите plan B по срокам.",
          ],
        },
      ];
      changed = true;
    }
  }

  if (!hasMistakesOrTimelineSection(sections)) {
    const mistakeBullets = mistakeBulletsFromPractice(sections);
    if (mistakeBullets.length >= 2) {
      sections = [
        ...sections,
        {
          heading: "Типичные ошибки релокантов",
          section_kind: "practice" as const,
          bullets: mistakeBullets.map((b) =>
            /^ошибка:/i.test(b) ? b : `Ошибка: ${b.replace(/^[-•]\s*/, "")}`
          ),
        },
      ];
      changed = true;
    } else {
      sections = [
        ...sections,
        {
          heading: "Типичные ошибки релокантов",
          section_kind: "practice" as const,
          bullets: [
            "Ошибка: полагаться на один источник из чата без проверки на gov.pt / портале органа.",
            "Ошибка: не закладывать 2–4 недели на дозапрос документов или запись в balcão.",
            "Ошибка: игнорировать Norte-специфику — Porto/Braga быстрее по очередям, но те же формальные требования.",
            "Ошибка: откладывать NIF, morada или comprovativo — без них следующий шаг встанет.",
          ],
        },
      ];
      changed = true;
    }
  }

  return { body_sections: sections, key_takeaways: takeaways, changed };
}
