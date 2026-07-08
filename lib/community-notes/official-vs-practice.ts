import type { ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export type SectionKind = "official" | "practice" | "gap" | "glossary";

/** Prompt block — Telegram practice vs official portals. */
export const OFFICIAL_VS_PRACTICE_RULES = `
ОФИЦИАЛЬНОЕ vs ПРАКТИКА (обязательно для guide/qa/news/tip):
Источник — обсуждения релокантов; опыт часто дополняет или расходится с gov.pt / AIMA / Finanças. Не смешивай в одном абзаце.

1. quick_answer — сначала суть для действия, затем 1 фраза «на практике» если есть типичное расхождение.
2. key_takeaways — 4–6 пунктов. Минимум 2 с меткой в начале строки:
   - «Официально: …» — формальное требование / что написано на портале
   - «На практике: …» — как проходит в Norte (Порту/Брага) или по Португалии по опыту чатов в 2026
   - «Расхождение: …» — если норма и реальность явно не совпадают (когда уместно)
3. body_sections — для guide/qa/news/tip добавь section_kind и отдельные секции:
   - section_kind "official" — что требуют органы, документы, сроки по правилам (без «в чате пишут»)
   - section_kind "practice" — пошагово как делают релоканты: очереди, слоты, что принимают на месте, типичные обходы в рамках закона
   - section_kind "gap" (если есть конфликт) — bullets «сайт говорит / на деле» или «ожидание / реальность»
   Заголовки секций — человеческие (не копируй «official» в heading). Пример: «Что требует Finanças» + «Как обычно проходит запись».
4. faq — в ответах разделяй: «По правилам…» и «На практике…» если вопрос про расхождение.
5. Не выдавай чатовый опыт за закон. Не обещай гарантий. Если практика рискованная — пометь «может отказать».
Для lifehack — достаточно явно пометить «На практике» в quick_answer или takeaways.`.trim();

const KINDS_NEEDING_SPLIT: ContentKind[] = ["guide", "qa", "news", "tip"];

const OFFICIAL_HEADING =
  /официальн|по правилам|что требует|формальн|на портале|по закону|норматив/i;
const PRACTICE_HEADING =
  /на практике|как бывает|в чате|реальн|обычно проходит|что делают|опыт релокант/i;
const GAP_HEADING = /расхожд|формально.*практик|где отличается|ожидание.*реальност|сайт.*деле/i;
const GLOSSARY_HEADING = /словарь\s+термин/i;

const TAKEAWAY_PREFIX = /^(Официально|На практике|Расхождение|В чате):/i;

export function inferSectionKind(section: NoteBodySection): SectionKind | null {
  if (section.section_kind) return section.section_kind;
  if (GLOSSARY_HEADING.test(section.heading)) return "glossary";
  if (OFFICIAL_HEADING.test(section.heading)) return "official";
  if (GAP_HEADING.test(section.heading)) return "gap";
  if (PRACTICE_HEADING.test(section.heading)) return "practice";
  return null;
}

export function hasOfficialPracticeSplit(
  contentKind: ContentKind,
  sections: NoteBodySection[]
): boolean {
  if (!KINDS_NEEDING_SPLIT.includes(contentKind)) return true;

  const kinds = sections.map((s) => inferSectionKind(s));
  const hasOfficial = kinds.includes("official") || sections.some((s) => OFFICIAL_HEADING.test(s.heading));
  const hasPractice = kinds.includes("practice") || sections.some((s) => PRACTICE_HEADING.test(s.heading));
  const hasGap = kinds.includes("gap") || sections.some((s) => GAP_HEADING.test(s.heading));

  return (hasOfficial && hasPractice) || hasGap;
}

export function countLabeledTakeaways(keyTakeaways: string[]): number {
  return keyTakeaways.filter((t) => TAKEAWAY_PREFIX.test(t.trim())).length;
}

export function validateOfficialPracticeCopy(input: {
  content_kind: ContentKind;
  body_sections: NoteBodySection[];
  key_takeaways: string[];
}): string[] {
  const errors: string[] = [];
  if (!KINDS_NEEDING_SPLIT.includes(input.content_kind)) return errors;

  if (!hasOfficialPracticeSplit(input.content_kind, input.body_sections)) {
    errors.push(
      "official/practice: need body_sections with section_kind official + practice, or a gap section"
    );
  }
  if (countLabeledTakeaways(input.key_takeaways) < 2) {
    errors.push(
      "official/practice: key_takeaways need ≥2 items prefixed «Официально:» / «На практике:» / «Расхождение:»"
    );
  }
  return errors;
}

export function bootstrapOfficialPracticeCopy(input: {
  content_kind: ContentKind;
  quick_answer: string;
  key_takeaways: string[];
  body_sections: NoteBodySection[];
}): { key_takeaways: string[]; body_sections: NoteBodySection[]; changed: boolean } {
  if (!KINDS_NEEDING_SPLIT.includes(input.content_kind)) {
    return { key_takeaways: input.key_takeaways, body_sections: input.body_sections, changed: false };
  }

  let changed = false;
  let sections = input.body_sections.map((section) => {
    if (section.section_kind) return section;
    const kind = inferSectionKind(section);
    if (!kind) return section;
    changed = true;
    return { ...section, section_kind: kind };
  });

  if (!hasOfficialPracticeSplit(input.content_kind, sections) && sections.length > 0) {
    const officialIdx = sections.findIndex((s) => inferSectionKind(s) === "official");
    const practiceIdx = sections.findIndex((s) => inferSectionKind(s) === "practice");

    if (officialIdx >= 0 && practiceIdx < 0) {
      const next = sections.map((s, i) =>
        i === officialIdx + 1 || (officialIdx === sections.length - 1 && i === officialIdx)
          ? s
          : i > officialIdx && !s.section_kind
            ? { ...s, section_kind: "practice" as const }
            : s
      );
      if (!next.some((s) => s.section_kind === "practice") && sections.length >= 2) {
        next[officialIdx === sections.length - 1 ? officialIdx - 1 : officialIdx + 1] = {
          ...next[officialIdx === sections.length - 1 ? officialIdx - 1 : officialIdx + 1],
          section_kind: "practice",
        };
      }
      sections = next;
      changed = true;
    } else if (sections.length === 1) {
      const source = sections[0];
      const bullets = source.bullets ?? [];
      const paragraphs = source.paragraphs ?? [];
      const items = bullets.length ? bullets : paragraphs;
      const mid = Math.max(1, Math.ceil(items.length / 2));
      sections = [
        {
          heading: OFFICIAL_HEADING.test(source.heading) ? source.heading : "Что требуют органы",
          section_kind: "official" as const,
          bullets: bullets.length ? bullets.slice(0, mid) : undefined,
          paragraphs: bullets.length ? undefined : paragraphs.slice(0, mid),
        },
        {
          heading: PRACTICE_HEADING.test(source.heading) ? `${source.heading} — на практике` : "Как обычно проходит",
          section_kind: "practice" as const,
          bullets: bullets.length ? bullets.slice(mid) : undefined,
          paragraphs: bullets.length ? undefined : paragraphs.slice(mid),
        },
      ];
      changed = true;
    } else if (sections.length >= 2) {
      sections = sections.map((section, index) => ({
        ...section,
        section_kind: section.section_kind ?? (index === 0 ? "official" : index === 1 ? "practice" : section.section_kind),
      }));
      changed = true;
    }
  }

  if (input.content_kind === "guide") {
    const hasBullets = sections.some((s) => (s.bullets?.length ?? 0) >= 3);
    if (!hasBullets) {
      const practiceSection = sections.find((s) => s.section_kind === "practice") ?? sections[sections.length - 1];
      const idx = sections.indexOf(practiceSection);
      const seed = input.key_takeaways
        .map((t) => t.replace(TAKEAWAY_PREFIX, "").trim())
        .filter(Boolean)
        .slice(0, 4);
      if (seed.length >= 3) {
        sections = sections.map((s, i) =>
          i === idx ? { ...s, bullets: [...(s.bullets ?? []), ...seed].slice(0, 6) } : s
        );
        changed = true;
      }
    }
  }

  let takeaways = [...input.key_takeaways];
  if (countLabeledTakeaways(takeaways) < 2 && takeaways.length >= 2) {
    takeaways = takeaways.map((item, index) => {
      if (TAKEAWAY_PREFIX.test(item.trim())) return item;
      if (index === 0) return `Официально: ${item.replace(TAKEAWAY_PREFIX, "").trim()}`;
      if (index === 1) return `На практике: ${item.replace(TAKEAWAY_PREFIX, "").trim()}`;
      return item;
    });
    changed = true;
  } else if (countLabeledTakeaways(takeaways) < 2 && takeaways.length === 1) {
    takeaways = [
      `Официально: ${takeaways[0].replace(TAKEAWAY_PREFIX, "").trim()}`,
      `На практике: ${input.quick_answer.replace(/\s+/g, " ").trim().slice(0, 220)}`,
    ];
    changed = true;
  }

  return { key_takeaways: takeaways, body_sections: sections, changed };
}

const HAND_CURATED_SLUGS = new Set(["zamena-voditelskih-prav-portugaliya-2026"]);
export function needsOfficialPracticeRefresh(note: {
  slug: string;
  content_kind: ContentKind;
  body_sections: NoteBodySection[];
  key_takeaways: string[];
}): boolean {
  if (HAND_CURATED_SLUGS.has(note.slug)) return false;
  return validateOfficialPracticeCopy(note).length > 0;
}

export const SECTION_KIND_LABELS: Record<SectionKind, string> = {
  official: "Официально",
  practice: "На практике",
  gap: "Где расходится",
  glossary: "Словарь",
};
