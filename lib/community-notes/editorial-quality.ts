import { validateGuideGlossary, isGlossarySection } from "@/lib/community-notes/glossary";
import { validateOfficialPracticeCopy } from "@/lib/community-notes/official-vs-practice";
import { snsTextsFromDraft, validateSnsUtenteCopy } from "@/lib/community-notes/sns-editorial";
import type { ContentKind } from "@/lib/community-notes/types";
import type { NoteBodySection } from "@/lib/community-notes/types";
import { fitMetaDescription, fitSeoTitlePart } from "@/lib/seo";

export type DraftQualityInput = {
  content_kind: ContentKind;
  seo_title: string;
  seo_description: string;
  quick_answer: string;
  body_sections: NoteBodySection[];
  body_paragraphs: string[];
  faq: Array<{ q: string; a: string }>;
  key_takeaways: string[];
};

const MIN_BY_KIND: Record<
  ContentKind,
  { sections: number; faq: number; takeaways: number; minWords: number }
> = {
  guide: { sections: 4, faq: 4, takeaways: 4, minWords: 600 },
  qa: { sections: 3, faq: 4, takeaways: 3, minWords: 450 },
  news: { sections: 3, faq: 3, takeaways: 3, minWords: 400 },
  tip: { sections: 2, faq: 3, takeaways: 3, minWords: 350 },
  lifehack: { sections: 2, faq: 3, takeaways: 2, minWords: 280 },
};

function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function totalWords(input: DraftQualityInput): number {
  const parts = [
    input.quick_answer,
    ...input.body_paragraphs,
    ...input.body_sections.flatMap((s) => [...(s.paragraphs ?? []), ...(s.bullets ?? [])]),
    ...input.faq.flatMap((f) => [f.q, f.a]),
    ...input.key_takeaways,
  ];
  return parts.reduce((sum, t) => sum + wordCount(t), 0);
}

/** Returns human-readable quality errors; empty = pass. */
export function validateNoteDraft(input: DraftQualityInput): string[] {
  const errors: string[] = [];
  const rules = MIN_BY_KIND[input.content_kind] ?? MIN_BY_KIND.guide;

  if (input.seo_description.length < 140 || input.seo_description.length > 165) {
    errors.push(`seo_description length ${input.seo_description.length} (need 140–165)`);
  }
  if (input.seo_title.length > 58) {
    errors.push(`seo_title too long (${input.seo_title.length})`);
  }
  if (!/португал|lisbon|лиссабон|porto|порту|norte|север|брага|minho/i.test(`${input.quick_answer} ${input.seo_description}`)) {
    errors.push("missing geo (Португалия/Порту/Norte) in quick_answer or seo_description");
  }
  if (input.body_sections.length < rules.sections) {
    errors.push(`body_sections ${input.body_sections.length} < ${rules.sections}`);
  }
  if (input.faq.length < rules.faq) {
    errors.push(`faq ${input.faq.length} < ${rules.faq}`);
  }
  if (input.key_takeaways.length < rules.takeaways) {
    errors.push(`key_takeaways ${input.key_takeaways.length} < ${rules.takeaways}`);
  }
  const hasBullets = input.body_sections.some((s) => (s.bullets?.length ?? 0) >= 3);
  if (input.content_kind === "guide" && !hasBullets) {
    errors.push("guide needs at least one section with 3+ bullet items (checklist/steps)");
  }
  if (input.content_kind === "guide") {
    errors.push(...validateGuideGlossary(input.body_sections));
    const glossaryIdx = input.body_sections.findIndex(isGlossarySection);
    if (glossaryIdx > 0) {
      errors.push(`glossary: must be first body_section, got index ${glossaryIdx}`);
    }
  }
  if (totalWords(input) < rules.minWords) {
    errors.push(`word count ${totalWords(input)} < ${rules.minWords}`);
  }

  errors.push(...validateSnsUtenteCopy(snsTextsFromDraft(input)));
  errors.push(
    ...validateOfficialPracticeCopy({
      content_kind: input.content_kind,
      body_sections: input.body_sections,
      key_takeaways: input.key_takeaways,
    })
  );

  return errors;
}

export function flattenBodySections(sections: NoteBodySection[]): string[] {
  return sections.flatMap((s) => [
    s.heading,
    ...(s.paragraphs ?? []),
    ...(s.bullets ?? []).map((b) => `• ${b}`),
  ]);
}

/** Trim Gemini SEO fields to crawl-friendly lengths before quality gate. */
export function normalizeNoteDraftSeo<T extends { seo_title: string; seo_description: string }>(draft: T): T {
  return {
    ...draft,
    seo_title: fitSeoTitlePart(draft.seo_title),
    seo_description: fitMetaDescription(draft.seo_description, 140, 160),
  };
}
