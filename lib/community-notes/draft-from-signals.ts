import { geminiJson, FAST_MODEL } from "@/lib/news/gemini";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import {
  PORTUGAL_EDITORIAL_SYSTEM,
  TOPIC_LABELS,
  TOPIC_OFFICIAL_LINKS,
} from "@/lib/community-notes/editorial-voice";
import type { CommunityNoteFaq, CommunitySignalIngest, ContentKind } from "@/lib/community-notes/types";

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
    body_paragraphs: { type: "array", items: { type: "string" } },
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
    "body_paragraphs",
    "faq",
  ],
};

function anonymizeSnippet(text: string): string {
  return text
    .replace(/@[\w\d_]+/g, "[чат]")
    .replace(/\+?\d[\d\s()-]{8,}\d/g, "[tel]")
    .replace(/https?:\/\/\S+/g, "[link]")
    .slice(0, 280);
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

export async function draftNoteFromCluster(cluster: SignalCluster): Promise<DraftedNote> {
  const topic = cluster.topic;
  const contentKind = cluster.contentKind;
  const channels = Array.from(new Set(cluster.signals.map((s) => s.channel_username)));
  const snippets = cluster.signals.slice(0, 8).map((s) => anonymizeSnippet(s.text));
  const inlineTags = cluster.signals.flatMap((s) => s.hashtags ?? []).slice(0, 10);

  const userPrompt = `Тема кластера: ${TOPIC_LABELS[topic] ?? topic}
Тип материала (content_kind): ${contentKind}
Каналы-источники (только для метаданных, не цитируй): ${channels.map((c) => `@${c}`).join(", ")}
Число сообщений за период: ${cluster.signals.length}

Анонимизированные фрагменты обсуждений (НЕ цитировать, только понять intent):
${snippets.map((s, i) => `${i + 1}. ${s}`).join("\n")}

slug: latin kebab-case, уникальный, с темой и годом 2026 если уместно.
seo_title: ≤55 символов без "| Emigro".
seo_description: 145–160 символов.
category: ${TOPIC_LABELS[topic] ?? "Быт в Португалии"}

Если content_kind=lifehack — первый абзац = конкретный приём в одном предложении.
Если content_kind=tip — дай честный trade-off (плюс/минус).
Если content_kind=news — укажи что проверить официально.`;

  const raw = await geminiJson<
    Omit<
      DraftedNote,
      "category" | "content_kind" | "official_links" | "topic_tags" | "hashtags" | "source_channel" | "source_label"
    >
  >(FAST_MODEL(), PORTUGAL_EDITORIAL_SYSTEM, userPrompt, draftSchema, 4096);

  const slug = raw.slug
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

  const topicTags = topic === "general" ? ["portugal"] : [topic, "portugal"];

  return {
    ...raw,
    slug: slug || `pt-${topic}-${contentKind}-2026`,
    category: TOPIC_LABELS[topic] ?? "Быт в Португалии",
    content_kind: contentKind,
    official_links: TOPIC_OFFICIAL_LINKS[topic] ?? TOPIC_OFFICIAL_LINKS.general,
    topic_tags: topicTags,
    hashtags: buildNoteHashtags({ topicTags, contentKind, extra: inlineTags }),
    source_channel: channels.join("+"),
    source_label: null,
  };
}
