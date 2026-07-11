import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import type { CommunityNoteFaq, NoteBodySection } from "@/lib/community-notes/types";
import { bootstrapOfficialPracticeCopy, inferSectionKind } from "@/lib/community-notes/official-vs-practice";
import { sanitizeEmigroNoteUrls, sanitizeStringArray } from "@/lib/community-notes/note-url";
import {
  ARCHIVE_SLUGS,
  reconcileTopic,
} from "@/lib/community-notes/editorial-filter";
import { TOPIC_LABELS, TOPIC_OFFICIAL_LINKS } from "@/lib/community-notes/editorial-voice";
import type { CommunityNote, ContentKind } from "@/lib/community-notes/types";
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";

export type NoteRepairPatch = {
  slug: string;
  status?: "published" | "archived";
  category?: string;
  topic_tags?: string[];
  official_links?: Array<{ title: string; url: string }>;
  hashtags?: string[];
};

export function repairNoteRow(row: {
  slug: string;
  title: string;
  status: string;
  content_kind: ContentKind;
  topic_tags: string[];
  hashtags: string[];
}): NoteRepairPatch {
  const patch: NoteRepairPatch = { slug: row.slug };

  if (ARCHIVE_SLUGS.has(row.slug)) {
    patch.status = "archived";
    return patch;
  }

  const primaryHint = row.topic_tags.find((t) => t !== "portugal") ?? "general";
  const topic = reconcileTopic(primaryHint, row.title, row.slug);
  const topicTags = topic === "general" ? ["portugal"] : [topic, "portugal"];

  patch.category = TOPIC_LABELS[topic] ?? "Быт в Португалии";
  patch.topic_tags = topicTags;
  patch.official_links = TOPIC_OFFICIAL_LINKS[topic] ?? TOPIC_OFFICIAL_LINKS.general;
  patch.hashtags = buildNoteHashtags({ topicTags, contentKind: row.content_kind });

  return patch;
}

export type NoteContentRepairPatch = {
  quick_answer?: string;
  excerpt?: string;
  seo_description?: string;
  key_takeaways?: string[];
  body_paragraphs?: string[];
  body_sections?: NoteBodySection[];
  faq?: CommunityNoteFaq[];
};

function sanitizeFaq(faq: CommunityNoteFaq[]): { items: CommunityNoteFaq[]; changed: boolean } {
  let changed = false;
  const items = faq.map((item) => {
    const q = sanitizeEmigroNoteUrls(item.q);
    const a = sanitizeEmigroNoteUrls(item.a);
    if (q !== item.q || a !== item.a) changed = true;
    return { q, a };
  });
  return { items, changed };
}

function inferSectionKinds(sections: NoteBodySection[]): { sections: NoteBodySection[]; changed: boolean } {
  let changed = false;
  const next = sections.map((section) => {
    if (section.section_kind) return section;
    const kind = inferSectionKind(section);
    if (!kind) return section;
    changed = true;
    return { ...section, section_kind: kind };
  });
  return { sections: next, changed };
}

function sanitizeSections(sections: NoteBodySection[]): { sections: NoteBodySection[]; changed: boolean } {
  let changed = false;
  const next = sections.map((section) => {
    const paragraphs = section.paragraphs
      ? sanitizeStringArray(section.paragraphs)
      : { items: section.paragraphs, changed: false };
    const bullets = section.bullets ? sanitizeStringArray(section.bullets) : { items: section.bullets, changed: false };
    if (paragraphs.changed || bullets.changed) changed = true;
    return {
      ...section,
      paragraphs: paragraphs.items,
      bullets: bullets.items,
    };
  });
  return { sections: next, changed };
}

/** Fix localhost URLs, infer section_kind, bootstrap official/practice labels. */
export function repairNoteContent(row: {
  content_kind: ContentKind;
  quick_answer: string;
  excerpt: string;
  seo_description: string;
  key_takeaways: string[];
  body_paragraphs: string[];
  body_sections: NoteBodySection[];
  faq: CommunityNoteFaq[];
}): { patch: NoteContentRepairPatch; changed: boolean } {
  const patch: NoteContentRepairPatch = {};
  let changed = false;

  const quick = sanitizeEmigroNoteUrls(row.quick_answer);
  if (quick !== row.quick_answer) {
    patch.quick_answer = quick;
    changed = true;
  }
  const excerpt = sanitizeEmigroNoteUrls(row.excerpt);
  if (excerpt !== row.excerpt) {
    patch.excerpt = excerpt;
    changed = true;
  }
  const seo = sanitizeEmigroNoteUrls(row.seo_description);
  if (seo !== row.seo_description) {
    patch.seo_description = seo;
    changed = true;
  }

  const takeaways = sanitizeStringArray(row.key_takeaways);
  if (takeaways.changed) {
    patch.key_takeaways = takeaways.items;
    changed = true;
  }
  const paragraphs = sanitizeStringArray(row.body_paragraphs);
  if (paragraphs.changed) {
    patch.body_paragraphs = paragraphs.items;
    changed = true;
  }

  const sectionsSanitized = sanitizeSections(row.body_sections);
  const sectionsInferred = inferSectionKinds(sectionsSanitized.sections);
  if (sectionsSanitized.changed || sectionsInferred.changed) {
    patch.body_sections = sectionsInferred.sections;
    changed = true;
  }

  const faq = sanitizeFaq(row.faq);
  if (faq.changed) {
    patch.faq = faq.items;
    changed = true;
  }

  const bootstrapped = bootstrapOfficialPracticeCopy({
    content_kind: row.content_kind,
    quick_answer: String(patch.quick_answer ?? row.quick_answer),
    key_takeaways: (patch.key_takeaways ?? row.key_takeaways) as string[],
    body_sections: (patch.body_sections ?? sectionsInferred.sections) as NoteBodySection[],
  });
  if (bootstrapped.changed) {
    patch.key_takeaways = bootstrapped.key_takeaways;
    patch.body_sections = bootstrapped.body_sections;
    patch.body_paragraphs = flattenBodySections(bootstrapped.body_sections);
    changed = true;
  }

  return { patch, changed };
}

const COUNTRY_TOPIC_TAGS = new Set(["portugal", "spain"]);

export function getRelatedNotes(note: CommunityNote, allNotes: CommunityNote[], limit = 3): CommunityNote[] {
  const topicSet = new Set(
    note.topic_tags.map((t) => t.toLowerCase()).filter((t) => !COUNTRY_TOPIC_TAGS.has(t))
  );
  const tagSet = new Set(note.hashtags.map((t) => t.toLowerCase()));

  return allNotes
    .filter((n) => n.slug !== note.slug)
    .map((n) => {
      let score = 0;
      for (const t of n.topic_tags) {
        if (topicSet.has(t.toLowerCase())) score += 3;
      }
      for (const t of n.hashtags) {
        if (tagSet.has(t.toLowerCase())) score += 1;
      }
      if (n.content_kind === note.content_kind) score += 1;
      return { n, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.n);
}
