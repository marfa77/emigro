import { geminiJson, FAST_MODEL } from "@/lib/news/gemini";
import {
  PORTUGAL_EDITORIAL_SYSTEM,
  TOPIC_LABELS,
  TOPIC_OFFICIAL_LINKS,
} from "@/lib/community-notes/editorial-voice";
import type { CommunityNoteFaq, CommunitySignalIngest } from "@/lib/community-notes/types";

export type SignalCluster = {
  topic: string;
  signals: CommunitySignalIngest[];
};

export type DraftedNote = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  seo_title: string;
  seo_description: string;
  quick_answer: string;
  body_paragraphs: string[];
  faq: CommunityNoteFaq[];
  official_links: Array<{ title: string; url: string }>;
  topic_tags: string[];
  source_channel: string;
  source_label: string;
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
    .replace(/\+?\d[\d\s()-]{8,}\d/g, "[тел]")
    .replace(/https?:\/\/\S+/g, "[ссылка]")
    .slice(0, 280);
}

export function clusterSignals(signals: CommunitySignalIngest[]): SignalCluster[] {
  const buckets = new Map<string, CommunitySignalIngest[]>();
  for (const s of signals) {
    const topic = s.topic_hints?.[0] || "general";
    const list = buckets.get(topic) ?? [];
    list.push(s);
    buckets.set(topic, list);
  }
  return [...buckets.entries()]
    .map(([topic, list]) => ({ topic, signals: list }))
    .sort((a, b) => b.signals.length - a.signals.length);
}

export async function draftNoteFromCluster(cluster: SignalCluster): Promise<DraftedNote> {
  const topic = cluster.topic;
  const channels = [...new Set(cluster.signals.map((s) => s.channel_username))];
  const snippets = cluster.signals.slice(0, 8).map((s) => anonymizeSnippet(s.text));

  const userPrompt = `Тема кластера: ${TOPIC_LABELS[topic] ?? topic}
Каналы-источники (только для метаданных, не цитируй): ${channels.map((c) => `@${c}`).join(", ")}
Число сообщений за период: ${cluster.signals.length}

Анонимизированные фрагменты обсуждений (НЕ цитировать, только понять intent):
${snippets.map((s, i) => `${i + 1}. ${s}`).join("\n")}

slug: лatin kebab-case, уникальный, с темой и годом 2026 если уместно.
seo_title: ≤55 символов без "| Emigro".
seo_description: 145–160 символов.
category: ${TOPIC_LABELS[topic] ?? "Быт в Португалии"}`;

  const raw = await geminiJson<Omit<DraftedNote, "category" | "official_links" | "topic_tags" | "source_channel" | "source_label">>(
    FAST_MODEL(),
    PORTUGAL_EDITORIAL_SYSTEM,
    userPrompt,
    draftSchema,
    4096
  );

  const slug = raw.slug
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

  return {
    ...raw,
    slug: slug || `pt-${topic}-2026`,
    category: TOPIC_LABELS[topic] ?? "Быт в Португалии",
    official_links: TOPIC_OFFICIAL_LINKS[topic] ?? TOPIC_OFFICIAL_LINKS.general,
    topic_tags: topic === "general" ? ["portugal"] : [topic, "portugal"],
    source_channel: channels.join("+"),
    source_label: `Темы из @chatlisboa и @por_tugal — редакция Emigro`,
  };
}
