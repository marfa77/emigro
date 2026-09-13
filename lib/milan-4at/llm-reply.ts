/**
 * LLM soft expert reply for @milan_4at — short chatty RU, answers the actual ask.
 */
import { openrouterJson } from "@/lib/llm/openrouter";
import type { Milan4atMatch } from "@/lib/milan-4at/draft";

/** Writer: Sonnet — better chat RU + Italy soft expert. */
const MODEL = () =>
  (process.env.MILAN4AT_REPLY_MODEL || "anthropic/claude-sonnet-4.5").trim();

const SYSTEM = `Ты обычный человек в русском Telegram @milan_4at (Милан/Италия). Не бот, не юрист, не SEO-гайд.

Главное: ОТВЕТЬ НА ВОПРОС. Если спрашивают «где купить / где оформить / кто делал» — скажи куда обычно ходят или что берут, а не «глянь чеклист / сверьте требования».

Стиль:
- 1–2 фразы, до ~170 символов, как в чате;
- можно «нам», «брали», «глянь», «вроде», «по-моему»;
- одна щелочка: «насколько помню» / «у меня так» / «у разных консульств список плавает»;
- по страховке для ВНЖ/студента: люди берут спецполисы под permesso (типа Waitaly и похожие), не обычный travel на неделю — можно так и сказать;
- по «где купить» быт: нормально назвать тип места (TIM/Iliad точка, Idealista, Subito, Esselunga, фарма) без выдуманных адресов и цен;
- НЕ канцелярит («обязательна», «необходимо», «по требованиям», «репатриация»);
- НЕ «у нас в чате / ребята / наш чат Emigro»;
- НЕ ссылки, Emigro, точные € и сроки в днях;
- НЕ уходить в «просто сверь чеклист» без конкретного куда/что;
- не по теме IT/Milano/доки/быт/страховка/учёба → skip.

Плохо: «нам для внж страховку просили — глянь чеклист у консульства»
Хорошо: «студентам под внж обычно берут спецполис (waitaly и аналоги), не туристический — насколько помню, главное чтобы срок/покрытие совпали с их списком»

JSON: {"reply":"..."} или {"skip":true,"reason":"..."}`;

export async function llmMilan4atReply(params: {
  question: string;
  topicLabel?: string | null;
  topicHint?: string | null;
}): Promise<{ reply: string | null; skipReason?: string; model: string }> {
  const user = [
    params.topicLabel ? `Тема: ${params.topicLabel}` : null,
    `Вопрос:\n${params.question.trim().slice(0, 900)}`,
    "Ответь по сути вопроса, коротко, как в чате.",
  ]
    .filter(Boolean)
    .join("\n\n");

  const { data, model } = await openrouterJson<{ reply?: string; skip?: boolean; reason?: string }>(
    MODEL(),
    SYSTEM,
    user,
    220,
    { temperature: 0.65 }
  );

  if (data.skip === true || !data.reply?.trim()) {
    return { reply: null, skipReason: data.reason || "model skip", model };
  }
  let reply = data.reply.trim();
  reply = reply
    .replace(/^["«]|["»]$/g, "")
    .replace(/^(привет[!.]?\s*|всем\s+привет[!.]?\s*|добр(ый|ое)\s+(день|утро|вечер)[!.]?\s*)/i, "")
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/\bemigro\b/gi, "")
    .replace(/€\s?\d[\d.,]*\s*(?:k|к|тыс\.?|тысяч)?/gi, "")
    .replace(/\b\d[\d.,]*\s*€/gi, "")
    // keep Waitaly — it's the usual VNJ tip in this chat; strip other invented carriers
    .replace(/\b(?:generali|unipol|allianz|axa|cigna|aon)\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .trim();
  // capitalize after greeting strip
  if (reply) reply = reply.charAt(0).toUpperCase() + reply.slice(1);

  if (
    /у\s+нас\s+в\s+чат|в\s+нашем\s+чат|ребят[аы]|присоединя|наш\s+чат\s+милан|чат\s+милана/i.test(
      reply
    )
  ) {
    return { reply: null, skipReason: "chat community CTA", model };
  }

  if (/обязательн|необходимо|репатриац/i.test(reply)) {
    return { reply: null, skipReason: "brochure tone", model };
  }

  // empty deflectors — not an answer to "где купить/оформить"
  const asksWhere = /где\s+(можно|купить|оформи|сделать|взять)|кто\s+(знает|делал|оформ)/i.test(
    params.question
  );
  if (
    asksWhere &&
    /^(нам\s+)?для\s+.+(просили|требовали)/i.test(reply) &&
    /чеклист|требования|консульств/i.test(reply) &&
    !/(waitaly|полис|специал|брали|покупа|типо|типа|через)/i.test(reply)
  ) {
    return { reply: null, skipReason: "empty deflector", model };
  }

  if (reply.length < 24) return { reply: null, skipReason: "too short", model };
  if (reply.length > 180) reply = reply.slice(0, 177).replace(/\s+\S*$/, "") + "…";
  return { reply, model };
}

export function topicHintFromMatch(match: Milan4atMatch | undefined): string | null {
  void match;
  return null;
}
