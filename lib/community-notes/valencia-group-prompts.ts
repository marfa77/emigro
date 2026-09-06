import type { CommunityNote } from "@/lib/community-notes/types";

export const VALENCIA_GROUP_MIN_INTERVAL_MS = 3 * 24 * 60 * 60 * 1000;
export const VALENCIA_GROUP_RECYCLE_AFTER_MS = 45 * 24 * 60 * 60 * 1000;
export const VALENCIA_GROUP_NEWS_QUIET_AFTER_GUIDE_MS = 2 * 24 * 60 * 60 * 1000;

export const VALENCIA_GROUP_REPLY_HINT =
  "Можно одной строкой — даже если приехали на этой неделе.";

type PromptRule = {
  re: RegExp;
  hook: string;
  question: string;
};

/** City-chat discussion, not a visa lecture. Matched against slug + title + tags. */
const PROMPT_RULES: PromptRule[] = [
  {
    re: /rajony|район|district|ruzafa|russafa|benimaclet|cabanyal|campanar|patraix/,
    hook: "Районы Valencia хвалят по-разному: Ruzafa «живо и шумно», Benimaclet «свой», Cabanyal — море и ремонт.",
    question: "Кто где живёт или смотрит жильё: район и одна вещь, что в быту зашло или бесит?",
  },
  {
    re: /sip|медицин|стомат|salud|tarjeta sanitaria|здоров/,
    hook: "В Valencia SIP и médico de familia часто ждут после padrón, стоматология почти всегда частная.",
    question: "SIP уже есть или сразу частная? У кого centro de salud в Valencia — сколько ждали терапевта?",
  },
  {
    re: /arenda|alquiler|idealista|жиль|fianza/,
    hook: "Долгая аренда в Valencia часто упирается не в цену, а в NIE, IBAN и «hoy último día».",
    question: "Кто снимал в Valencia в этом году: без aval реально или только через agency и тройной депозит?",
  },
  {
    re: /nie|empadron|padrón|padron/,
    hook: "NIE и padrón — разные органы, а банк и TIE просят оба почти сразу.",
    question: "Кто недавно делал NIE и empadronamiento в Valencia: какой порядок сработал и где застряли?",
  },
  {
    re: /tie|cita|extranjer|huellas/,
    hook: "Cita на huellas в ICPPlus то появляется, то нет — Valencia не Madrid, но «завтра запишусь» тоже не работает.",
    question: "У кого в последние недели cita TIE в Valencia вообще открывалась? Что сработало?",
  },
  {
    re: /bank|iban|caixa|revolut|cuenta/,
    hook: "Для аренды и recibos часто просят испанский IBAN, а нерезиденту филиал может отказать без NIE + padrón.",
    question: "Каким счётом в Valencia в итоге пользуетесь для аренды — и где развернули?",
  },
  {
    re: /sim|esim|internet|luz|gas|emivasa|suministr/,
    hook: "eSIM на первые дни спасает, а luz и интернет на имя tenant часто ждут недели.",
    question: "Кто какой оператор и свет взял в Valencia — сколько ждали alta и мастера?",
  },
  {
    re: /metro|emt|транспорт|coche|dgt|coche/,
    hook: "Первые месяцы Valencia закрывается метро/EMT, машина — уже другой бюджет и DGT.",
    question: "Кто без машины в Valencia: какая карта и куда уже бесит ехать общественным?",
  },
  {
    re: /школ|school|семья|infantil|colegio/,
    hook: "Школа в Valencia — не только International, но и padrón, очередь и дорога утром.",
    question: "У кого дети в Valencia: район и почему именно эта школа — очередь, язык, дорога?",
  },
  {
    re: /климат|плесен|влажн|жара|verano|invierno/,
    hook: "Лето в Valencia без кондея и зима без отопления — две разные жалобы к 4–6 месяцу.",
    question: "Кто уже пережил лето или зиму в Valencia: чем спасались, что не сработало в квартире?",
  },
  {
    re: /желт|yellow|gestor|сервис|поиск-мест/,
    hook: "Жёлтые страницы релоканта бесполезны без живых «этот gestor/клиника не кинули».",
    question: "Какой сервис в Valencia уже проверили на себе (gestoría, клиника, интернет)? Без рекламы своей фирмы.",
  },
  {
    re: /beckham|autonomo|autónomo|reta|irpf|ss-/,
    hook: "Beckham, autónomo и alta в Seguridad Social — разные двери; чаты их склеивают в один миф.",
    question: "Кто уже проходил alta SS или autónomo в Valencia: что спросили, чего не хватило?",
  },
  {
    re: /dnv|uge|nómada|nomad|телераб/,
    hook: "DNV — не «виза в UGE для всех»: консульство и UGE путают даже те, кто уже в городе.",
    question: "Кто въезжал через DNV/другую Residencia: какой канал был на самом деле?",
  },
  {
    re: /паспорт|konsul|консульств|embassy|апостил/,
    hook: "Из Valencia в консульство РФ — это день в Madrid или Barcelona, а не «заскочить».",
    question: "Кто записывался в консульство из Valencia: куда ехали и что взять, о чём не пишут?",
  },
  {
    re: /перв(ый|ые)-?мес|checklist|30-dnej|30 дней/,
    hook: "Первый месяц — NIE, жильё, банк, SIP — и почти у всех один шаг встаёт колом.",
    question: "Кто переехал в Valencia недавно: какой шаг реально завис и чем выкрутились?",
  },
];

function haystack(note: Pick<CommunityNote, "slug" | "title" | "category" | "topic_tags" | "hashtags">): string {
  return [note.slug, note.title, note.category, ...(note.topic_tags ?? []), ...(note.hashtags ?? [])].join(" ");
}

export function discussionPromptForValenciaNote(
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
    question: "Как у вас с этим в Valencia и вокруг — что сработало, что нет?",
  };
}

export function valenciaGroupGuideDue(lastPostedAt: string | undefined, now = Date.now()): boolean {
  if (!lastPostedAt) return true;
  const last = Date.parse(lastPostedAt);
  if (!Number.isFinite(last)) return true;
  return now - last >= VALENCIA_GROUP_MIN_INTERVAL_MS;
}
