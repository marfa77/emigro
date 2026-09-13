/**
 * Second-pass fact-check for @milan_4at drafts.
 * Writer = chatty neighbour; checker = stricter Italy/expat bullshit filter.
 * Never posts — only pass / revise / fail for the human DM pipeline.
 */
import { openrouterJson } from "@/lib/llm/openrouter";

/** Checker: Gemini — cheap second pass, different family from writer. */
const MODEL = () =>
  (process.env.MILAN4AT_FACTCHECK_MODEL || "google/gemini-2.5-flash").trim();

const SYSTEM = `Ты факт-чекер черновика ответа в русский Telegram-чат про Милан/Италию (ВНЖ, страховка, CF, Questura, быт).

Черновик писал «сосед» — не юрист. Твоя задача: не пропустить буллшит к человеку, который сам не эксперт.

FAIL если есть:
- выдуманные точные €, дни, адреса, названия тарифов/«офизов»;
- абсолюты без щелочки («обязательно», «всегда», «всем дают»);
- ответ мимо вопроса (спрашивали «где», ответили «глянь чеклист»);
- питч чужого чата / Emigro / «ребята у нас»;
- опасный юрсовет как факт (конкретная процедура «сделай X в Questura Y» без hedge);
- явно устаревшее или смешанные страны (Испания/Португалия вместо Италии).

PASS если:
- отвечает на вопрос по сути;
- типичный полевой совет с hedge («насколько помню», «у меня так», «списки плавают»);
- общие каналы ок: Waitaly/аналоги под ВНЖ, Idealista, TIM/Iliad, Agenzia Entrate — без цен и адресов.

REVISE если почти ок, но надо убрать цифру/абсолют/канцелярит — верни короткий исправленный текст (1–2 фразы, ≤170 символов, чатовый тон, одна щелочка).

JSON only:
{"verdict":"pass"|"fail"|"revise","reason":"кратко","reply":"только если revise"}`;

export type Milan4atFactcheck = {
  verdict: "pass" | "fail" | "revise";
  reason: string;
  /** Final text to send when pass/revise; null on fail */
  reply: string | null;
  model: string;
};

function sanitizeReply(text: string): string {
  let reply = text.trim();
  reply = reply
    .replace(/^["«]|["»]$/g, "")
    .replace(/^(привет[!.]?\s*|всем\s+привет[!.]?\s*|добр(ый|ое)\s+(день|утро|вечер)[!.]?\s*)/i, "")
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/\bemigro\b/gi, "")
    .replace(/€\s?\d[\d.,]*\s*(?:k|к|тыс\.?|тысяч)?/gi, "")
    .replace(/\b\d[\d.,]*\s*€/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .trim();
  if (reply) reply = reply.charAt(0).toUpperCase() + reply.slice(1);
  if (reply.length > 180) reply = reply.slice(0, 177).replace(/\s+\S*$/, "") + "…";
  return reply;
}

export async function factcheckMilan4atReply(params: {
  question: string;
  draft: string;
}): Promise<Milan4atFactcheck> {
  const user = [
    `Вопрос:\n${params.question.trim().slice(0, 900)}`,
    `Черновик:\n${params.draft.trim().slice(0, 400)}`,
    "Верни verdict.",
  ].join("\n\n");

  const { data, model } = await openrouterJson<{
    verdict?: string;
    reason?: string;
    reply?: string;
  }>(MODEL(), SYSTEM, user, 280, { temperature: 0.15 });

  const raw = (data.verdict || "").toLowerCase().trim();
  const verdict: Milan4atFactcheck["verdict"] =
    raw === "pass" || raw === "revise" || raw === "fail" ? raw : "fail";
  const reason = (data.reason || "no reason").trim().slice(0, 200);

  if (verdict === "fail") {
    return { verdict, reason, reply: null, model };
  }

  if (verdict === "revise") {
    const fixed = sanitizeReply(data.reply || "");
    if (fixed.length < 24) {
      return { verdict: "fail", reason: `revise empty: ${reason}`, reply: null, model };
    }
    return { verdict: "revise", reason, reply: fixed, model };
  }

  return {
    verdict: "pass",
    reason,
    reply: sanitizeReply(params.draft),
    model,
  };
}
