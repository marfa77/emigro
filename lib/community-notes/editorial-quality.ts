import { validateAgainstBlueprint } from "@/lib/community-notes/article-blueprint";
import { ephemeralRelativeTimeErrors } from "@/lib/community-notes/evergreen";
import { validateGuideGlossary, isGlossarySection } from "@/lib/community-notes/glossary";
import { validateOfficialPracticeCopy } from "@/lib/community-notes/official-vs-practice";
import {
  looksLikeEphemeralPolitics,
  POLITICS_GUIDE_TITLE_RE,
} from "@/lib/community-notes/politics-news";
import { snsTextsFromDraft, validateSnsUtenteCopy } from "@/lib/community-notes/sns-editorial";
import type { CommunityNoteFaq, CommunityNoteLink, ContentKind } from "@/lib/community-notes/types";
import type { NoteBodySection } from "@/lib/community-notes/types";
import { fitMetaDescription, fitSeoTitlePart } from "@/lib/seo";

export type DraftQualityInput = {
  content_kind: ContentKind;
  slug?: string;
  seo_title: string;
  seo_description: string;
  quick_answer: string;
  body_sections: NoteBodySection[];
  body_paragraphs: string[];
  faq: Array<{ q: string; a: string }>;
  key_takeaways: string[];
  official_links?: CommunityNoteLink[];
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

function sectionSubstance(section: NoteBodySection): number {
  return [...(section.paragraphs ?? []), ...(section.bullets ?? [])]
    .map((t) => t.trim())
    .filter(Boolean).length;
}

/** Reject headings-only / empty-body drafts that padded word count via FAQ. */
export function hollowBodySectionErrors(
  sections: NoteBodySection[],
  contentKind: ContentKind
): string[] {
  const errors: string[] = [];
  const hollow = sections.filter((s) => sectionSubstance(s) === 0);
  if (hollow.length > 0) {
    errors.push(
      `hollow body_sections (${hollow.length}): ${hollow
        .map((s) => s.heading.slice(0, 40))
        .join("; ")}`
    );
  }
  const substantial = sections.filter((s) => sectionSubstance(s) >= 2).length;
  const minSubstantial = contentKind === "guide" ? 4 : contentKind === "news" ? 2 : 2;
  if (substantial < minSubstantial) {
    errors.push(`substantial body_sections ${substantial} < ${minSubstantial}`);
  }
  return errors;
}

/** Reject telegraphic «Что делать:» / «Зачем:» skeletons and jargon-stuffed «Главное». */
export function telegraphicVoiceErrors(sections: NoteBodySection[]): string[] {
  const errors: string[] = [];
  const LABEL_RE =
    /^\s*(что делать|зачем вам это сейчас|зачем)\s*:/i;
  const STEP_PARA_RE = /^\s*шаг\s*\d+\s*[—–\-.:]/i;
  const JARGON_TOKEN_RE =
    /\b(CPCV|IMT|IVA|promotor|entrega|asking|sinal|escritura|munic[ií]pio|condom[ií]nio|off-plan|LTV|PDM|PIP)\b/gi;

  for (const section of sections) {
    if (isGlossarySection(section)) continue;
    for (const p of section.paragraphs ?? []) {
      const trimmed = p.trim();
      if (LABEL_RE.test(trimmed) || STEP_PARA_RE.test(trimmed)) {
        errors.push(
          `telegraphic voice in «${section.heading.slice(0, 40)}»: remove «Что делать:» / «Зачем:» / «Шаг N —» paragraph labels`
        );
        break;
      }
      const glavnoe = trimmed.match(/главное\s*:\s*(.+)$/i);
      if (glavnoe) {
        const body = glavnoe[1].trim();
        const words = body.split(/\s+/).filter(Boolean);
        const jargonHits = body.match(JARGON_TOKEN_RE) ?? [];
        const hasInequalityStack = (body.match(/≠|!=/g) ?? []).length >= 1 && jargonHits.length >= 2;
        if (
          (words.length < 12 && jargonHits.length >= 2) ||
          hasInequalityStack ||
          /asking\s*≠|entrega\s*[—–-]|promotor\s*\/\s*агент/i.test(body)
        ) {
          errors.push(
            `telegraphic «Главное» in «${section.heading.slice(0, 40)}»: rewrite as one plain-Russian sentence`
          );
          break;
        }
      }
    }
  }
  return errors;
}

function politicsAsGuideErrors(input: DraftQualityInput): string[] {
  if (input.content_kind !== "guide") return [];
  const blob = `${input.slug ?? ""} ${input.seo_title} ${input.quick_answer}`;
  if (POLITICS_GUIDE_TITLE_RE.test(blob) || looksLikeEphemeralPolitics(blob)) {
    return ["ephemeral politics must be content_kind=news, not guide"];
  }
  return [];
}

/** Returns human-readable quality errors; empty = pass. */
export function validateNoteDraft(
  input: DraftQualityInput,
  countryKey: "portugal" | "spain" = "portugal"
): string[] {
  const errors: string[] = [];
  const rules = MIN_BY_KIND[input.content_kind] ?? MIN_BY_KIND.guide;

  if (input.seo_description.length < 140 || input.seo_description.length > 165) {
    errors.push(`seo_description length ${input.seo_description.length} (need 140–165)`);
  }
  if (input.seo_title.length > 58) {
    errors.push(`seo_title too long (${input.seo_title.length})`);
  }
  const geoText = `${input.quick_answer} ${input.seo_description}`;
  const geoOk =
    countryKey === "spain"
      ? /испан|valencia|валенс|madrid|barcelona|barcelon|nie|tie|extranjer/i.test(geoText)
      : /португал|lisbon|лиссабон|porto|порту|norte|север|брага|minho/i.test(geoText);
  if (!geoOk) {
    errors.push(
      countryKey === "spain"
        ? "missing geo (Испания/Valencia) in quick_answer or seo_description"
        : "missing geo (Португалия/Порту/Norte) in quick_answer or seo_description"
    );
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
  errors.push(...hollowBodySectionErrors(input.body_sections, input.content_kind));
  errors.push(...telegraphicVoiceErrors(input.body_sections));
  errors.push(...politicsAsGuideErrors(input));
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
  errors.push(
    ...ephemeralRelativeTimeErrors([
      input.quick_answer,
      ...input.key_takeaways,
      ...input.body_sections.flatMap((s) => [...(s.paragraphs ?? []), ...(s.bullets ?? [])]),
      ...input.faq.flatMap((f) => [f.q, f.a]),
    ])
  );

  if (input.content_kind === "guide") {
    const blueprint = validateAgainstBlueprint(
      {
        content_kind: input.content_kind,
        slug: input.slug,
        quick_answer: input.quick_answer,
        seo_description: input.seo_description,
        body_sections: input.body_sections,
        key_takeaways: input.key_takeaways,
        faq: input.faq as CommunityNoteFaq[],
        official_links: input.official_links,
      },
      countryKey
    );
    errors.push(...blueprint.errors);
  }

  return errors;
}

export function flattenBodySections(sections: NoteBodySection[]): string[] {
  return sections.flatMap((s) => [
    s.heading,
    ...(s.paragraphs ?? []),
    ...(s.bullets ?? []).map((b) => `• ${b}`),
    ...(s.table
      ? [
          s.table.columns.join(" | "),
          ...s.table.rows.map((row) => row.join(" | ")),
        ]
      : []),
  ]);
}

/** Trim Gemini SEO fields to crawl-friendly lengths before quality gate. */
export function normalizeNoteDraftSeo<T extends { seo_title: string; seo_description: string }>(draft: T): T {
  return {
    ...draft,
    seo_title: fitSeoTitlePart(draft.seo_title),
    seo_description: fitMetaDescription(draft.seo_description, 145, 160),
  };
}
