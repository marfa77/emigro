import type { CommunityNote } from "@/lib/community-notes/types";

export const MILAN_GROUP_MIN_INTERVAL_MS = 3 * 24 * 60 * 60 * 1000;
export const MILAN_GROUP_RECYCLE_AFTER_MS = 45 * 24 * 60 * 60 * 1000;
export const MILAN_GROUP_NEWS_QUIET_AFTER_GUIDE_MS = 2 * 24 * 60 * 60 * 1000;

export const MILAN_GROUP_REPLY_HINT =
  "Можно одной строкой — даже если приехали на этой неделе.";

type PromptRule = {
  re: RegExp;
  hook: string;
  question: string;
};

const PROMPT_RULES: PromptRule[] = [
  {
    re: /rajony|район|district|isola|navigli|loreto|bicocca|como/,
    hook: "Районы Milano хвалят по-разному: Isola «живо», Navigli шумно, Como — другой ритм и commute Trenord.",
    question: "Кто где живёт или смотрит жильё: район/город и одна вещь, что в быту зашло или бесит?",
  },
  {
    re: /ssn|медицин|стомат|tessera|ats|здоров/,
    hook: "В Milano tessera и medico di base часто ждут после CF и residenza, стоматология почти всегда частная.",
    question: "SSN уже есть или сразу частная? У кого medico di base в Milano — сколько ждали?",
  },
  {
    re: /arenda|affitto|idealista|жиль|caparra|deposito/,
    hook: "Долгая аренда в Milano часто упирается не в цену, а в codice fiscale, IBAN и «oggi ultimo giorno».",
    question: "Кто снимал в Milano / Como в этом году: без garante реально или только через agenzia?",
  },
  {
    re: /codice-fiscale|codice fiscale|aa4/,
    hook: "Codice fiscale — не permesso: без него банк и luce встают, а очередь в Entrate живёт своей жизнью.",
    question: "Кто недавно брал codice fiscale в Milano: consulate, Entrate или Questura вместе с permesso?",
  },
  {
    re: /permesso|questura|kit.postale|kit-postale/,
    hook: "Kit postale в 8 giorni — правило; слот Questura Milano — уже другая история.",
    question: "У кого в последние недели kit / Questura Milano: сколько ждали ricevuta и что спросили?",
  },
  {
    re: /bank|iban|intesa|unicredit|revolut|conto/,
    hook: "Для аренды и bollette часто просят итальянский IBAN, а нерезиденту филиал может отказать без CF + permesso.",
    question: "Каким счётом в Milano в итоге пользуетесь для аренды — и где развернули?",
  },
  {
    re: /sim|esim|internet|luce|gas|fiber|fibra/,
    hook: "eSIM на первые дни спасает, а luce и fibra на имя tenant часто ждут недели и codice fiscale.",
    question: "Кто какой оператор и свет взял в Milano — сколько ждали voltura и мастера?",
  },
  {
    re: /metro|atm|trenord|транспорт|auto/,
    hook: "Первые месяцы Milano закрывается ATM; Como/Monza — уже Trenord, не «ещё один район».",
    question: "Кто без машины в Milano или на севере: какая карта и куда уже бесит ехать?",
  },
  {
    re: /перв(ый|ые)-?мес|checklist|30-dnej|30 дней/,
    hook: "Первый месяц — CF, жильё, банк, kit — и почти у всех один шаг встаёт колом.",
    question: "Кто переехал в Milano недавно: какой шаг реально завис и чем выкрутились?",
  },
];

function haystack(note: Pick<CommunityNote, "slug" | "title" | "category" | "topic_tags" | "hashtags">): string {
  return [note.slug, note.title, note.category, ...(note.topic_tags ?? []), ...(note.hashtags ?? [])].join(" ");
}

export function discussionPromptForMilanNote(
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
    .map((t) => t.replace(/^(Официально|На практике|Расхождение|В чате|Сегодня):\s*/i, "").trim())
    .find((t) => t.length > 20);
  const hook = (takeaway || note.quick_answer || note.excerpt || note.title).replace(/\s+/g, " ").trim();
  return {
    hook: hook.length > 220 ? `${hook.slice(0, 217).trim()}…` : hook,
    question: "Как у вас с этим в Milano и вокруг (север, Como) — что сработало, что нет?",
  };
}

export function milanGroupGuideDue(lastPostedAt: string | undefined, now = Date.now()): boolean {
  if (!lastPostedAt) return true;
  const last = Date.parse(lastPostedAt);
  if (!Number.isFinite(last)) return true;
  return now - last >= MILAN_GROUP_MIN_INTERVAL_MS;
}
