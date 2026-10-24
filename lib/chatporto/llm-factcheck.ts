/**
 * Second pass — same job as milan4at checker, Porto/Norte frame.
 */
import { openrouterJson } from "@/lib/llm/openrouter";

const MODEL = () =>
  (
    process.env.CHATPORTO_FACTCHECK_MODEL ||
    process.env.MILAN4AT_FACTCHECK_MODEL ||
    "google/gemini-2.5-flash"
  ).trim();

const SYSTEM = `Ты факт-чекер черновика ответа в @chatporto (Porto / Norte). Писал «сосед» — не юрист.

FAIL:
- точные выдуманные €, дни, адреса, телефоны, «гарантированные» клиники/таксисты;
- абсолюты без щелочки («обязательно», «всегда», «всем дают»);
- любая отсылка к чату/группе («поищи в чате», «тут писали», «спросите у ребят»);
- мимо вопроса; питч Emigro; другая страна вместо PT;
- опасный юрсовет как жёсткий факт без hedge;
- вода без конкретного банка/сервиса/шага.

PASS:
- 1 короткая конкретная фраза (~≤120 символов);
- щелочка «слышал / раньше» — не «у меня так»;
- имя канала/привычки (Millennium, Finanças, Idealista…) ок.

REVISE: почти ок — верни ≤120 символов, конкретный шаг, щелочка «слышал/раньше», без чат-мета и абсолютов.

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
    .replace(/^(привет[!.]?\s*|всем\s+привет[!.]?\s*)/i, "")
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/\bemigro\b/gi, "")
    .replace(/€\s?\d[\d.,]*/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
  if (reply) reply = reply.charAt(0).toUpperCase() + reply.slice(1);
  if (reply.length > 140) reply = reply.slice(0, 137).replace(/\s+\S*$/, "") + ".";
  return reply;
}

export async function factcheckChatportoReply(params: {
  question: string;
  draft: string;
}): Promise<ChatportoFactcheck> {
  const user = `Вопрос:\n${params.question.trim().slice(0, 900)}\n\nЧерновик:\n${params.draft.trim().slice(0, 900)}`;
  const { data, model } = await openrouterJson<{
    verdict?: string;
    reason?: string;
    reply?: string;
  }>(MODEL(), SYSTEM, user, 480, { temperature: 0.15 });

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
    if (revised.length < 24) return { verdict: "fail", reason: "revise empty", reply: null, model };
    return { verdict, reason, reply: revised, model };
  }
  return { verdict: "pass", reason, reply: sanitizeReply(params.draft), model };
}
