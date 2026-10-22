import { llmChatportoReply } from "@/lib/chatporto/llm-reply";
import { factcheckChatportoReply } from "@/lib/chatporto/llm-factcheck";

export type ChatportoProducedReply = {
  reply: string | null;
  skipReason?: string;
  writerModel: string;
  checkerModel?: string;
  factVerdict?: "pass" | "fail" | "revise";
  factReason?: string;
};

export async function produceChatportoReply(params: {
  question: string;
  topicLabel?: string | null;
}): Promise<ChatportoProducedReply> {
  const draft = await llmChatportoReply({
    question: params.question,
    topicLabel: params.topicLabel,
  });
  if (!draft.reply) {
    return {
      reply: null,
      skipReason: draft.skipReason || "writer skip",
      writerModel: draft.model,
    };
  }

  const check = await factcheckChatportoReply({
    question: params.question,
    draft: draft.reply,
  });

  if (!check.reply) {
    return {
      reply: null,
      skipReason: `factcheck ${check.verdict}: ${check.reason}`,
      writerModel: draft.model,
      checkerModel: check.model,
      factVerdict: check.verdict,
      factReason: check.reason,
    };
  }

  return {
    reply: check.reply,
    writerModel: draft.model,
    checkerModel: check.model,
    factVerdict: check.verdict,
    factReason: check.reason,
  };
}
