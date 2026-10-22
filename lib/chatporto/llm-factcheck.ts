import { openrouterJson } from "@/lib/llm/openrouter";

const MODEL = () =>
  (
    process.env.CHATPORTO_FACTCHECK_MODEL ||
    process.env.MILAN4AT_FACTCHECK_MODEL ||
    "google/gemini-2.5-flash"
  ).trim();

const SYSTEM = `Ты факт-чекер короткого ответа в @chatporto (Порту / Norte / Португалия).

FAIL: выдуманные €/дни/адреса/клиники/врачи/таксисты; абсолюты без hedge; мимо вопроса; питч Emigro; другая страна вместо PT; опасный юрсовет как факт; «пойди в CUF/Luz» без hedge как будто факт.

PASS: полевой совет с «насколько помню» / «у меня так»; общие каналы Finanças / Idealista / AIMA / MEO-NOS без цен.

REVISE: почти ок — верни исправленный текст ≤260 символов, 1–2 фразы.

JSON: {"verdict":"pass"|"fail"|"revise","reason":"кратко","reply":"только если revise"}`;

export type ChatportoFactcheck = {
  verdict: "pass" | "fail" | "revise";
  reason: string;
  reply: string | null;
  model: string;
};

function sanitizeReply(text: string): string {
  let reply = text.trim();
  reply = reply
    .replace(/^["«]|["»]$/g, "")
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/\bemigro\b/gi, "")
    .replace(/€\s?\d[\d.,]*/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
  if (reply) reply = reply.charAt(0).toUpperCase() + reply.slice(1);
  if (reply.length > 280) reply = reply.slice(0, 277).replace(/\s+\S*$/, "") + ".";
  return reply;
}

export async function factcheckChatportoReply(params: {
  question: string;
  draft: string;
}): Promise<ChatportoFactcheck> {
  const user = `Вопрос:\n${params.question.trim().slice(0, 700)}\n\nЧерновик:\n${params.draft.trim().slice(0, 400)}`;
  const { data, model } = await openrouterJson<{
    verdict?: string;
    reason?: string;
    reply?: string;
  }>(MODEL(), SYSTEM, user, 280, { temperature: 0.2 });

  const verdictRaw = (data.verdict || "").toLowerCase();
  const verdict =
    verdictRaw === "pass" || verdictRaw === "fail" || verdictRaw === "revise"
      ? verdictRaw
      : "fail";
  const reason = (data.reason || "").trim() || "no reason";

  if (verdict === "fail") {
    return { verdict, reason, reply: null, model };
  }
  if (verdict === "revise") {
    const revised = data.reply ? sanitizeReply(data.reply) : "";
    if (revised.length < 20) return { verdict: "fail", reason: "revise empty", reply: null, model };
    return { verdict, reason, reply: revised, model };
  }
  return { verdict: "pass", reason, reply: sanitizeReply(params.draft), model };
}
