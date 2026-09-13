/**
 * Draft + fact-check pipeline for @milan_4at.
 * Writer (Claude Sonnet) → checker (Gemini) → only then human DM.
 */
import { llmMilan4atReply } from "@/lib/milan-4at/llm-reply";
import { factcheckMilan4atReply } from "@/lib/milan-4at/llm-factcheck";

export type Milan4atProducedReply = {
  reply: string | null;
  skipReason?: string;
  writerModel: string;
  checkerModel?: string;
  factVerdict?: "pass" | "fail" | "revise";
  factReason?: string;
};

export async function produceMilan4atReply(params: {
  question: string;
  topicLabel?: string | null;
}): Promise<Milan4atProducedReply> {
  const draft = await llmMilan4atReply({
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

  const check = await factcheckMilan4atReply({
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
