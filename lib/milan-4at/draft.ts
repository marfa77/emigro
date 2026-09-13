import { cityChatForCountry } from "@/lib/satellite/city-chats";
import { cityChatDeepLink } from "@/lib/telegram/deep-link";
import { italySatellitePublicUrl } from "@/lib/site-url";
import {
  MILAN_4AT_MIN_SCORE,
  MILAN_4AT_TOPICS,
  type Milan4atTopic,
} from "@/lib/milan-4at/topics";

export type Milan4atMatch = {
  topic: Milan4atTopic;
  score: number;
  hits: number;
};

export type Milan4atDraft = {
  relevant: boolean;
  score: number;
  topicId: string | null;
  topicLabel: string | null;
  /** Paste into @milan_4at — soft neighbour tone, no hard CTA. */
  publicReply: string;
  /** Optional last line; include ~1/4 of the time. */
  softClose: string | null;
  /** Ops only — Emigro note + city chat. */
  ops: {
    noteUrl: string | null;
    noteSlug: string | null;
    milanChatDeepLink: string;
    assistHint: string;
    matches: Array<{ id: string; label: string; score: number }>;
  };
};

function noteUrl(slug: string): string {
  const base = italySatellitePublicUrl(`/notes/${slug}`);
  const u = new URL(base);
  u.searchParams.set("utm_source", "milan_4at");
  u.searchParams.set("utm_medium", "community_reply");
  u.searchParams.set("utm_campaign", "soft_expert");
  u.searchParams.set("utm_content", slug);
  return u.toString();
}

export function matchMilan4atTopics(question: string): Milan4atMatch[] {
  const text = question.trim();
  if (!text) return [];
  const out: Milan4atMatch[] = [];
  for (const topic of MILAN_4AT_TOPICS) {
    let hits = 0;
    for (const re of topic.patterns) {
      if (re.test(text)) hits += 1;
    }
    if (hits === 0) continue;
    out.push({ topic, hits, score: topic.weight + hits * 8 });
  }
  return out.sort((a, b) => b.score - a.score || a.topic.id.localeCompare(b.topic.id));
}

export function draftMilan4atReply(question: string, opts?: { includeSoftClose?: boolean }): Milan4atDraft {
  const matches = matchMilan4atTopics(question);
  const top = matches[0];
  const milan = cityChatForCountry("italy")!;
  const chatLink = cityChatDeepLink(milan, "milan4at");

  if (!top || top.score < MILAN_4AT_MIN_SCORE) {
    return {
      relevant: false,
      score: top?.score ?? 0,
      topicId: top?.topic.id ?? null,
      topicLabel: top?.topic.label ?? null,
      publicReply: "",
      softClose: null,
      ops: {
        noteUrl: null,
        noteSlug: null,
        milanChatDeepLink: chatLink,
      assistHint: "Вопрос слабо бьётся в Italy inventory — лучше пропустить или ответить от себя. Чат Милана пока не питчить — там ещё пусто.",
        matches: matches.slice(0, 5).map((m) => ({
          id: m.topic.id,
          label: m.topic.label,
          score: m.score,
        })),
      },
    };
  }

  const includeClose =
    opts?.includeSoftClose ??
    // ~25% by hash of question length — deterministic, not always
    question.trim().length % 4 === 0;

  const publicReply = top.topic.reply.trim();
  const softClose = includeClose && top.topic.softClose ? top.topic.softClose.trim() : null;

  return {
    relevant: true,
    score: top.score,
    topicId: top.topic.id,
    topicLabel: top.topic.label,
    publicReply,
    softClose,
    ops: {
      noteUrl: noteUrl(top.topic.noteSlug),
      noteSlug: top.topic.noteSlug,
      milanChatDeepLink: chatLink,
      assistHint:
        "В публичный ответ Emigro/ссылки/чат Милана не совать — чат пока пустой, питч «ребят» звучит фальшиво. Только личный опыт или нейтральная щелочка.",
      matches: matches.slice(0, 5).map((m) => ({
        id: m.topic.id,
        label: m.topic.label,
        score: m.score,
      })),
    },
  };
}

export function formatMilan4atDraftForHuman(draft: Milan4atDraft, question: string): string {
  const lines: string[] = [];
  lines.push("=== @milan_4at draft ===");
  lines.push(`Q: ${question.trim().slice(0, 500)}${question.trim().length > 500 ? "…" : ""}`);
  lines.push(`score=${draft.score} topic=${draft.topicLabel ?? "—"} relevant=${draft.relevant}`);
  lines.push("");
  if (!draft.relevant) {
    lines.push("SKIP — не экспертный слот (или слабый матч).");
    lines.push(draft.ops.assistHint);
  } else {
    lines.push("--- COPY INTO GROUP ---");
    lines.push(draft.publicReply);
    if (draft.softClose) {
      lines.push("");
      lines.push(draft.softClose);
    }
    lines.push("--- END COPY ---");
    lines.push("");
    lines.push("OPS (не в группу):");
    lines.push(`note: ${draft.ops.noteUrl}`);
    lines.push(`milan chat bot: ${draft.ops.milanChatDeepLink}`);
    lines.push(draft.ops.assistHint);
  }
  if (draft.ops.matches.length) {
    lines.push("");
    lines.push(
      "matches: " + draft.ops.matches.map((m) => `${m.id}:${m.score}`).join(", ")
    );
  }
  return lines.join("\n");
}
