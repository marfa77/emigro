import type { CommunityNoteFaq, NoteBodySection } from "@/lib/community-notes/types";

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

/** Rough Russian reading speed (~180 wpm). */
export function estimateNoteReadMinutes(input: {
  quick_answer: string;
  key_takeaways: string[];
  body_sections: NoteBodySection[];
  faq: CommunityNoteFaq[];
}): number {
  const chunks = [
    input.quick_answer,
    ...input.key_takeaways,
    ...input.body_sections.flatMap((section) => [
      ...(section.paragraphs ?? []),
      ...(section.bullets ?? []),
    ]),
    ...input.faq.flatMap((item) => [item.q, item.a]),
  ];
  const words = chunks.reduce((sum, text) => sum + countWords(text), 0);
  return Math.max(3, Math.ceil(words / 180));
}

export function formatReadTime(minutes: number): string {
  return `${minutes} мин чтения`;
}
