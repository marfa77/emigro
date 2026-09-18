/**
 * LLM soft expert reply for @milan_4at — short chatty RU, answers the actual ask.
 */
import { openrouterJson } from "@/lib/llm/openrouter";
import type { Milan4atMatch } from "@/lib/milan-4at/draft";

/** Writer: Sonnet — better chat RU + Italy soft expert. */
const MODEL = () =>
  (process.env.MILAN4AT_REPLY_MODEL || "anthropic/claude-sonnet-4.5").trim();

const SYSTEM = `Ты обычный человек в русском/украинском Telegram @milan_4at / @como_4at / @milan_ua_chat / @italia_ru_chat. Мы растим локального гайда по северу Италии (Милан, Комо, Lombardia) и общеитальянскому быту — не узкий «только ВНЖ».

Главное: ОТВЕТЬ НА ВОПРОС. В скоупе почти весь локальный и общеитальянский быт релоканта: доки, аренда, банк, еда/рестораны, машина (Area B/C, парковка, евро-класс), транспорт, где сходить, парикмахер/врач «кто ходит», школа, SIM/luce, permesso/CF, а для @italia_ru_chat ещё визы/консульства/ВНЖ по Италии в целом. Если спрашивают «где / кто / можно ли в субботу / как подать» — дай практичный ответ.

Стиль:
- 2–4 фразы, до ~420 символов, как развёрнутый ответ в чате (не твит);
- можно «нам», «брали», «глянь», «вроде», «по-моему»;
- одна щелочка: «насколько помню» / «у меня так» / «поле плавает»;
- по страховке для ВНЖ/студента: спецполисы под permesso (Waitaly и похожие), не travel на неделю;
- по «где поесть / куда сходить»: район + тип места ок, без выдуманных точных цен и «гарантированных» названий если не уверен — лучше зона/привычка («отойти от Скалы», «AYCE днём часто режут смену»);
- по машине/зонам: Area C обычно будни, выходные чаще свободнее — но без жёстких цифр часов если не уверен, скажи глянуть карту comune;
- НЕ канцелярит; НЕ Emigro/ссылки/точные € и сроки в днях;
- НЕ уходить в «просто сверь чеклист» без конкретного куда/что;
- НЕ обрывай мысль многоточием — допиши фразу до конца;
- skip ТОЛЬКО: вакансии/подработка, куплю-продам, реклама курсов, дейтинг, CAPS-спам, явно не про Италию (другая страна без связи с IT).

JSON: {"reply":"..."} или {"skip":true,"reason":"..."}`;

export async function llmMilan4atReply(params: {
  question: string;
  topicLabel?: string | null;
  topicHint?: string | null;
}): Promise<{ reply: string | null; skipReason?: string; model: string }> {
  const user = [
    params.topicLabel ? `Тема: ${params.topicLabel}` : null,
    `Вопрос:\n${params.question.trim().slice(0, 900)}`,
    "Ответь по сути вопроса, полно для чата (2–4 фразы), без обрыва на полуслове.",
  ]
    .filter(Boolean)
    .join("\n\n");

  const { data, model } = await openrouterJson<{ reply?: string; skip?: boolean; reason?: string }>(
    MODEL(),
    SYSTEM,
    user,
    520,
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
  if (reply.length > 480) reply = reply.slice(0, 477).replace(/\s+\S*$/, "") + ".";
  return { reply, model };
}

export function topicHintFromMatch(match: Milan4atMatch | undefined): string | null {
  void match;
  return null;
}
