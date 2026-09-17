import type { CommunityNote } from "@/lib/community-notes/types";

export const PHUKET_GROUP_MIN_INTERVAL_MS = 3 * 24 * 60 * 60 * 1000;
export const PHUKET_GROUP_RECYCLE_AFTER_MS = 45 * 24 * 60 * 60 * 1000;
export const PHUKET_GROUP_NEWS_QUIET_AFTER_GUIDE_MS = 2 * 24 * 60 * 60 * 1000;

export const PHUKET_GROUP_REPLY_HINT =
  "Можно одной строкой: район, срок жизни на острове и что реально сработало.";

type PromptRule = {
  re: RegExp;
  hook: string;
  question: string;
};

/** City-chat discussion starters: practical experience, not visa lectures or advertising. */
const PROMPT_RULES: PromptRule[] = [
  {
    re: /rajony|район|bang tao|rawai|nai harn|kata|karon|kamala|town/,
    hook: "На Пхукете один и тот же бюджет означает разную жизнь: пробки Bang Tao, машина в Rawai или городские сервисы Phuket Town.",
    question: "В каком районе живёте или ищете жильё — и какой бытовой минус обнаружили только после заселения?",
  },
  {
    re: /meditsin|health|strahov|hospital|clinic|здоров/,
    hook: "Частная медицина на острове доступна быстро, но счёт без страховки и exclusions могут удивить.",
    question: "Какая страховка или клиника на Пхукете реально сработала, а что пришлось оплачивать отдельно?",
  },
  {
    re: /arenda|rent|жиль|deposit|condo|villa/,
    hook: "Долгая аренда на Пхукете ломается на сезонности, коммунальной наценке и обещании TM30 «потом».",
    question: "Кто снимал на 6–12 месяцев: сколько просили вперёд и какой пункт договора оказался самым важным?",
  },
  {
    re: /sim|internet|svet|voda|utility|ais|true|dtac/,
    hook: "SIM решается в день прилёта, а fibre, счёт за свет и вода зависят от собственника и juristic office.",
    question: "Какой оператор и интернет используете, и где обнаружилась наценка владельца на коммунальные услуги?",
  },
  {
    re: /tax-id|tin|nalog|revenue/,
    hook: "Thai TIN, банковский KYC и налоговое резидентство 180+ дней — три разные задачи.",
    question: "Кто уже получал TIN на Пхукете: для какой задачи понадобился и какие документы запросили?",
  },
  {
    re: /bank|schet|promptpay|kyc/,
    hook: "Банк рассматривает иностранца индивидуально: одинаковые документы в двух отделениях могут дать разный результат.",
    question: "Какой пакет документов у вас приняли на Пхукете и для чего в итоге используете Thai account?",
  },
  {
    re: /immigration|tm30|90-days|extension|re-entry/,
    hook: "TM30, extension, 90-day report и re-entry permit — не одна очередь и не один срок.",
    question: "Какой процесс в Phuket Immigration проходили недавно и на каком документе потеряли время?",
  },
  {
    re: /dtv|ltr|privilege|visa|viza/,
    hook: "DTV, LTR и Thailand Privilege дают разные права; покупка квартиры не заменяет проверку основания.",
    question: "Какой долгий статус вы выбрали и что оказалось сложнее рекламного обещания?",
  },
  {
    re: /transport|baik|avto|smart bus|songthaew|taxi/,
    hook: "Первые недели можно прожить без транспорта, но школа, клиника и ежедневный маршрут быстро меняют расчёт.",
    question: "Кто живёт без байка или машины: район и маршрут, который оказался самым неудобным?",
  },
  {
    re: /shkol|school|semya|family|kindergarten/,
    hook: "Школа на Пхукете — это не только curriculum и tuition, но и ежедневная дорога через остров.",
    question: "Что было решающим при выборе школы или сада: программа, район, цена или дорога?",
  },
  {
    re: /servisy|service|yellow|agent|lawyer|translator/,
    hook: "Рекомендация из чата полезна только вместе с письменной сметой, проверкой роли и понятным конфликтом интересов.",
    question: "Какой сервис уже проверили на себе и по какому признаку поняли, что ему можно доверять?",
  },
  {
    re: /konsul|bangkok|passport|apostil|dokument/,
    hook: "Консульская задача из Пхукета часто превращается в отдельную поездку в Бангкок с оригиналами и копиями.",
    question: "Кто ездил по документам в Бангкок: что стоило подготовить заранее, чтобы не ехать повторно?",
  },
  {
    re: /work-permit|social-security|rabota|ss-/,
    hook: "Виза для пребывания, разрешение на работу, SSO и налоговый номер — отдельные контуры.",
    question: "Кто проходил onboarding у тайского работодателя: какой документ задержал старт сильнее всего?",
  },
  {
    re: /klimat|musson|plesen|humidity|flood|byt/,
    hook: "К 4–6 месяцу тропики проверяют жильё влажностью, плесенью, счётом за кондиционер и ливневой логистикой.",
    question: "Что в квартире или районе проявилось только в муссон и как вы это решили?",
  },
  {
    re: /30-dnej|30 дней|first|pervye/,
    hook: "Первый месяц на Пхукете — связь, адрес, TM30, транспорт, деньги и здоровье; почти у каждого зависает один шаг.",
    question: "Какой шаг в первый месяц оказался самым неожиданным и что вы сделали бы раньше?",
  },
];

function haystack(note: Pick<CommunityNote, "slug" | "title" | "category" | "topic_tags" | "hashtags">): string {
  return [note.slug, note.title, note.category, ...(note.topic_tags ?? []), ...(note.hashtags ?? [])].join(" ");
}

export function discussionPromptForPhuketNote(
  note: Pick<
    CommunityNote,
    "slug" | "title" | "category" | "excerpt" | "quick_answer" | "key_takeaways" | "topic_tags" | "hashtags"
  >
): { hook: string; question: string } {
  const hay = haystack(note);
  for (const rule of PROMPT_RULES) {
    if (rule.re.test(hay)) return { hook: rule.hook, question: rule.question };
  }
  const takeaway = (note.key_takeaways ?? [])
    .map((text) => text.replace(/^(Официально|На практике|Расхождение|Сегодня):\s*/i, "").trim())
    .find((text) => text.length > 20);
  const hook = (takeaway || note.quick_answer || note.excerpt || note.title).replace(/\s+/g, " ").trim();
  return {
    hook: hook.length > 220 ? `${hook.slice(0, 217).trim()}…` : hook,
    question: "Как у вас с этим на Пхукете и вокруг — что сработало, а что нет?",
  };
}

export function phuketGroupGuideDue(lastPostedAt: string | undefined, now = Date.now()): boolean {
  if (!lastPostedAt) return true;
  const last = Date.parse(lastPostedAt);
  if (!Number.isFinite(last)) return true;
  return now - last >= PHUKET_GROUP_MIN_INTERVAL_MS;
}
