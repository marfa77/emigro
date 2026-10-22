import {
  CHATPORTO_MIN_SCORE,
  CHATPORTO_TOPICS,
  type ChatportoTopic,
} from "@/lib/chatporto/topics";

export type ChatportoMatch = {
  topic: ChatportoTopic;
  score: number;
  hits: number;
};

export function matchChatportoTopics(question: string): ChatportoMatch[] {
  const text = question.trim();
  if (!text) return [];
  const out: ChatportoMatch[] = [];
  for (const topic of CHATPORTO_TOPICS) {
    let hits = 0;
    for (const re of topic.patterns) {
      if (re.test(text)) hits += 1;
    }
    if (hits === 0) continue;
    out.push({ topic, hits, score: topic.weight + hits * 8 });
  }
  return out.sort((a, b) => b.score - a.score || a.topic.id.localeCompare(b.topic.id));
}

export function chatportoNoteUrl(slug: string): string {
  // Always public satellite host — CLI on VPS is not Next production NODE_ENV.
  const base = `https://portugal.emigro.online/notes/${slug}`;
  const u = new URL(base);
  u.searchParams.set("utm_source", "chatporto");
  u.searchParams.set("utm_medium", "community_reply");
  u.searchParams.set("utm_campaign", "soft_expert");
  u.searchParams.set("utm_content", slug);
  return u.toString();
}

export function chatportoOpsLink(question: string): {
  score: number;
  topicLabel: string | null;
  topicId: string | null;
  noteUrl: string | null;
  noteSlug: string | null;
} {
  const top = matchChatportoTopics(question)[0];
  if (!top || top.score < CHATPORTO_MIN_SCORE) {
    return {
      score: top?.score ?? 0,
      topicLabel: top?.topic.label ?? null,
      topicId: top?.topic.id ?? null,
      noteUrl: null,
      noteSlug: null,
    };
  }
  return {
    score: top.score,
    topicLabel: top.topic.label,
    topicId: top.topic.id,
    noteUrl: chatportoNoteUrl(top.topic.noteSlug),
    noteSlug: top.topic.noteSlug,
  };
}
