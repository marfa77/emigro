import { geminiProJson } from "@/lib/news/gemini";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import {
  flattenBodySections,
  normalizeNoteDraftSeo,
  validateNoteDraft,
} from "@/lib/community-notes/editorial-quality";
import { reconcileTopic } from "@/lib/community-notes/editorial-filter";
import {
  PORTUGAL_EDITORIAL_SYSTEM,
  TOPIC_LABELS,
  TOPIC_OFFICIAL_LINKS,
} from "@/lib/community-notes/editorial-voice";
import type {
  CommunityNote,
  CommunityNoteFaq,
  CommunitySignalIngest,
  ContentKind,
  NoteBodySection,
} from "@/lib/community-notes/types";

export type SignalCluster = {
  topic: string;
  contentKind: ContentKind;
  signals: CommunitySignalIngest[];
};

export type DraftedNote = {
  slug: string;
  category: string;
  content_kind: ContentKind;
  title: string;
  excerpt: string;
  seo_title: string;
  seo_description: string;
  quick_answer: string;
  body_paragraphs: string[];
  body_sections: NoteBodySection[];
  key_takeaways: string[];
  faq: CommunityNoteFaq[];
  official_links: Array<{ title: string; url: string }>;
  topic_tags: string[];
  hashtags: string[];
  source_channel: string;
  source_label: string | null;
};

const draftSchema = {
  type: "object",
  properties: {
    slug: { type: "string" },
    title: { type: "string" },
    excerpt: { type: "string" },
    seo_title: { type: "string" },
    seo_description: { type: "string" },
    quick_answer: { type: "string" },
    key_takeaways: { type: "array", items: { type: "string" } },
    body_sections: {
      type: "array",
      items: {
        type: "object",
        properties: {
          heading: { type: "string" },
          paragraphs: { type: "array", items: { type: "string" } },
          bullets: { type: "array", items: { type: "string" } },
        },
        required: ["heading"],
      },
    },
    faq: {
      type: "array",
      items: {
        type: "object",
        properties: { q: { type: "string" }, a: { type: "string" } },
        required: ["q", "a"],
      },
    },
  },
  required: [
    "slug",
    "title",
    "excerpt",
    "seo_title",
    "seo_description",
    "quick_answer",
    "key_takeaways",
    "body_sections",
    "faq",
  ],
};

function anonymizeSnippet(text: string): string {
  return text
    .replace(/@[\w\d_]+/g, "[чат]")
    .replace(/\+?\d[\d\s()-]{8,}\d/g, "[tel]")
    .replace(/https?:\/\/\S+/g, "[link]")
    .slice(0, 320);
}

function pickBestSnippets(signals: CommunitySignalIngest[], limit = 3): string[] {
  return [...signals]
    .sort((a, b) => b.text.length - a.text.length)
    .slice(0, limit)
    .map((s) => anonymizeSnippet(s.text));
}

function dominantContentKind(signals: CommunitySignalIngest[]): ContentKind {
  const counts = new Map<ContentKind, number>();
  for (const s of signals) {
    const k = (s.content_kind ?? "tip") as ContentKind;
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "tip";
}

export function clusterSignals(signals: CommunitySignalIngest[]): SignalCluster[] {
  const buckets = new Map<string, CommunitySignalIngest[]>();
  for (const s of signals) {
    const topic = s.topic_hints?.[0] || "general";
    const list = buckets.get(topic) ?? [];
    list.push(s);
    buckets.set(topic, list);
  }
  return Array.from(buckets.entries())
    .map(([topic, list]) => ({
      topic,
      contentKind: dominantContentKind(list),
      signals: list,
    }))
    .sort((a, b) => b.signals.length - a.signals.length);
}

function buildUserPrompt(cluster: SignalCluster, snippets: string[]): string {
  const topic = cluster.topic;
  const contentKind = cluster.contentKind;
  const channels = Array.from(new Set(cluster.signals.map((s) => s.channel_username)));

  return `Тема кластера: ${TOPIC_LABELS[topic] ?? topic}
Тип материала (content_kind): ${contentKind}
Каналы (метаданные, не цитировать): ${channels.map((c) => `@${c}`).join(", ")}
Сообщений в кластере: ${cluster.signals.length} (используй только intent, не количество)

Фрагменты обсуждений (intent only, max 3):
${snippets.map((s, i) => `${i + 1}. ${s}`).join("\n")}

slug: latin kebab-case, уникальный, тема + 2026 если уместно.
category: ${TOPIC_LABELS[topic] ?? "Быт в Португалии"}

Напиши ПЛОТНУЮ заметку с body_sections (H2 + bullets). Не дублируй один смысл в разных секциях.
Для guide про первый месяц / чеклист — секции по неделям + секция «типичные ошибки» с bullets.`;
}

async function generateDraft(cluster: SignalCluster): Promise<Omit<
  DraftedNote,
  "category" | "content_kind" | "official_links" | "topic_tags" | "hashtags" | "source_channel" | "source_label" | "body_paragraphs"
>> {
  const snippets = pickBestSnippets(cluster.signals, 3);
  const userPrompt = buildUserPrompt(cluster, snippets);

  return geminiProJson<
    Omit<
      DraftedNote,
      | "category"
      | "content_kind"
      | "official_links"
      | "topic_tags"
      | "hashtags"
      | "source_channel"
      | "source_label"
      | "body_paragraphs"
    >
  >(PORTUGAL_EDITORIAL_SYSTEM, userPrompt, draftSchema, 12288);
}

function finalizeDraft(
  cluster: SignalCluster,
  raw: Awaited<ReturnType<typeof generateDraft>>,
  inlineTags: string[]
): DraftedNote {
  const topic = cluster.topic;
  const contentKind = cluster.contentKind;
  const channels = Array.from(new Set(cluster.signals.map((s) => s.channel_username)));

  const slug = raw.slug
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

  const resolvedTopic = reconcileTopic(topic, raw.title, slug || `pt-${topic}`);
  const topicTags = resolvedTopic === "general" ? ["portugal"] : [resolvedTopic, "portugal"];
  const bodySections = raw.body_sections ?? [];

  return normalizeNoteDraftSeo({
    ...raw,
    slug: slug || `pt-${resolvedTopic}-${contentKind}-2026`,
    category: TOPIC_LABELS[resolvedTopic] ?? "Быт в Португалии",
    content_kind: contentKind,
    body_sections: bodySections,
    body_paragraphs: flattenBodySections(bodySections),
    key_takeaways: raw.key_takeaways ?? [],
    official_links: TOPIC_OFFICIAL_LINKS[resolvedTopic] ?? TOPIC_OFFICIAL_LINKS.general,
    topic_tags: topicTags,
    hashtags: buildNoteHashtags({ topicTags, contentKind, extra: inlineTags }),
    source_channel: channels.join("+"),
    source_label: null,
  });
}

export async function draftNoteFromCluster(cluster: SignalCluster): Promise<DraftedNote> {
  const inlineTags = cluster.signals.flatMap((s) => s.hashtags ?? []).slice(0, 6);
  let lastError: string | undefined;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const raw = await generateDraft(cluster);
    const draft = finalizeDraft(cluster, raw, inlineTags);
    const errors = validateNoteDraft(draft);
    if (errors.length === 0) return draft;
    lastError = errors.join("; ");
  }

  throw new Error(`Draft quality gate failed: ${lastError ?? "unknown"}`);
}

/** Rewrite an existing published note to rich editorial format (no new signals). */
export async function rewriteCommunityNote(note: CommunityNote): Promise<DraftedNote> {
  const topic = note.topic_tags.find((t) => t !== "portugal") ?? "general";
  const cluster: SignalCluster = {
    topic,
    contentKind: note.content_kind,
    signals: [
      {
        message_id: 0,
        channel_username: note.source_channel?.split("+")[0] ?? "chatlisboa",
        text: [note.title, note.excerpt, note.quick_answer, ...note.body_paragraphs].join("\n"),
        topic_hints: note.topic_tags,
        content_kind: note.content_kind,
        city: note.city,
        country_key: note.country_key,
        posted_at: note.published_at ?? new Date().toISOString(),
      },
    ],
  };

  const userPrompt = `${buildUserPrompt(cluster, pickBestSnippets(cluster.signals, 1))}

ПЕРЕПИСЫВАНИЕ существующей заметки. Сохрани slug: ${note.slug}
Текущий заголовок: ${note.title}
Улучши глубину, структуру body_sections, SEO/AEO. Не делай текст тоньше — только плотнее и полезнее.`;

  const raw = await geminiProJson<
    Omit<
      DraftedNote,
      | "category"
      | "content_kind"
      | "official_links"
      | "topic_tags"
      | "hashtags"
      | "source_channel"
      | "source_label"
      | "body_paragraphs"
    >
  >(PORTUGAL_EDITORIAL_SYSTEM, userPrompt, draftSchema, 12288);

  const draft = finalizeDraft(cluster, { ...raw, slug: note.slug }, note.hashtags);
  if (note.slug === "pervyj-mesyac-portugaliya-checklist") {
    draft.category = "Первый месяц";
  } else if (!note.category.includes("CIPLE")) {
    draft.category = TOPIC_LABELS[topic] ?? note.category;
  } else {
    draft.category = note.category;
  }

  const errors = validateNoteDraft(draft);
  if (errors.length > 0) {
    throw new Error(`Rewrite quality gate failed: ${errors.join("; ")}`);
  }
  return draft;
}
