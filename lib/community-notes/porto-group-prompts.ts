import type { CommunityNote } from "@/lib/community-notes/types";

export const PORTO_GROUP_MIN_INTERVAL_MS = 3 * 24 * 60 * 60 * 1000;
export const PORTO_GROUP_RECYCLE_AFTER_MS = 45 * 24 * 60 * 60 * 1000;
/** Do not stack a news card on top of a fresh guide prompt. */
export const PORTO_GROUP_NEWS_QUIET_AFTER_GUIDE_MS = 2 * 24 * 60 * 60 * 1000;

export const PORTO_GROUP_REPLY_HINT =
  "Можно одной строкой — даже если приехали на этой неделе.";

type PromptRule = {
  re: RegExp;
  hook: string;
  question: string;
};

/** City-chat discussion, not a visa lecture. Matched against slug + title + tags. */
const PROMPT_RULES: PromptRule[] = [
  {
    re: /rajony|район|district|cedofeita|campanh|foz|boavista/,
    hook: "Районы Porto хвалят по-разному: Foz «тихо и дорого», Campanhã «дешевле, но своё», Gaia — уже другой ритм.",
    question: "Кто где живёт или смотрит жильё: район и одна вещь, что в быту зашло или бесит?",
  },
  {
    re: /matosinhos|leça|leca/,
    hook: "Matosinhos рядом с морем и метро — кто-то переезжает «насовсем», кто-то жалеет по вечерам без центра.",
    question: "Matosinhos vs центр Porto: кто переезжал к морю — не пожалели?",
  },
  {
    re: /arenda|arrendamento|rent|idealista|жиль/,
    hook: "Долгая аренда в Norte часто упирается не в цену, а в fiador, NIF в договоре и «сегодня последний шанс».",
    question: "Кто снимал в Porto/Braga в этом году: без fiador реально или только через знакомых?",
  },
  {
    re: /sns|медицин|stomat|utente|multicare|здоров/,
    hook: "В Norte utente и médico de família часто ждут неделями, стоматология почти всегда частная.",
    question: "SNS или сразу частная? У кого уже utente в Porto/Gaia — сколько ждали запись к терапевту?",
  },
  {
    re: /nif/,
    hook: "NIF один на всю страну, но очередь и «нужен ли representante» в Porto и Lisboa ощущаются по-разному.",
    question: "Кто недавно делал NIF через Porto: Finanças сами или gestor, сколько заняло?",
  },
  {
    re: /aima|agora|prodlenie|внж|titulo|título/,
    hook: "Agora и portal-renovacoes — разные двери; слот в Porto то появляется, то нет.",
    question: "У кого в последние недели Agora в Porto вообще открывалась? Что сработало — ночь, VPN, ничего?",
  },
  {
    re: /bank|iban|conta|актив|millennium|revolut/,
    hook: "Для аренды и MB Way часто просят местный IBAN, а нерезиденту филиал может отказать без NIF + morada.",
    question: "Каким счётом в Porto в итоге пользуетесь для аренды и MB Way — и где развернули?",
  },
  {
    re: /mashina|авто|auto|imt|via.verde|portagen|штраф|tesla|электром/,
    hook: "Машина в Porto — удобно на Norte и Douro, но portagens и парковка съедают «экономию» на метро.",
    question: "Кто на машине в Porto: купили, аренда или пока Uber/метро? Что бесит в быту?",
  },
  {
    re: /школ|school|семья|braga/,
    hook: "Porto vs Braga для школы — не только International, но и очередь, аренда T2 и дорога утром.",
    question: "У кого дети в Norte: Porto или Braga и почему именно так — школа, аренда, дорога?",
  },
  {
    re: /климат|плесен|влажн|zima|жара/,
    hook: "Зима в Norte без отопления + влажность = плесень. Лето — другая история, но не «сухо как в Испании».",
    question: "Кто уже пережил зиму в Porto: чем спасались от влаги, что не сработало?",
  },
  {
    re: /гастро|ресторан|вино|douro|vinho/,
    hook: "Туристические меню в Ribeira и реальная кухня в районах — разные миры.",
    question: "Где в Porto/Braga едите по-местному, не для тура? Район и одно место.",
  },
  {
    re: /фестив|клуб|underground|techno|техн/,
    hook: "Ночная жизнь Norte не только «у Recife» — часть тусовок уезжает из центра.",
    question: "Кто ходит в Porto по ночам: что ещё живо в 2026, а что уже для туристов?",
  },
  {
    re: /желт|yellow|сервис|поиск-мест/,
    hook: "Жёлтые страницы релоканта бесполезны без живых «этот gestor/клиника не кинули».",
    question: "Какой сервис в Porto уже проверили на себе (gestor, клиника, интернет, Junta)? Без рекламы своей фирмы.",
  },
  {
    re: /интернет|provayder|sim|esim|vodafone|nos|meo/,
    hook: "Домашний интернет в Porto часто ждут неделями, а eSIM на первые дни спасает не всех.",
    question: "Кто какой оператор взял в Norte на дом — и сколько ждали мастера?",
  },
  {
    re: /перв(ый|ые)-?мес|checklist|termo/,
    hook: "Первый месяц — NIF, жильё, банк, SNS — и почти у всех один шаг встаёт колом.",
    question: "Кто переехал в Porto недавно: какой шаг реально завис и чем выкрутились?",
  },
  {
    re: /паспорт|konsul|консульств|embassy/,
    hook: "Из Porto в Lisboa на консульство — это день, а не «заскочить».",
    question: "Кто записывался в консульство из Norte: сколько ехали и что взять с собой, о чём не пишут?",
  },
  {
    re: /питом|pet|dgav|собак|кошк/,
    hook: "Собака в Porto — не только перелёт, но Junta, чип и кто принимает в аренде.",
    question: "Кто с питомцем в Norte: аренда пустила сразу или искали через объявления?",
  },
  {
    re: /гражданств|ciple|caple/,
    hook: "CIPLE — отдельная история, не путать с бытовым португальским в магазине.",
    question: "Кто сдавал CIPLE из Porto: курс, самоподготовка или оба — что помогло на аудировании?",
  },
  {
    re: /туризм|camino|музей/,
    hook: "Norte удобен как база на выходные, если не строить маршрут как из путеводителя.",
    question: "Куда из Porto реально стоит рвануть на день-два, а куда уже не стоит?",
  },
];

function haystack(note: Pick<CommunityNote, "slug" | "title" | "category" | "topic_tags" | "hashtags">): string {
  return [note.slug, note.title, note.category, ...(note.topic_tags ?? []), ...(note.hashtags ?? [])].join(" ");
}

export function discussionPromptForNote(
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
    question: "Как у вас с этим в Porto и вокруг — что сработало, что нет?",
  };
}

export function portoGroupGuideDue(lastPostedAt: string | undefined, now = Date.now()): boolean {
  if (!lastPostedAt) return true;
  const last = Date.parse(lastPostedAt);
  if (!Number.isFinite(last)) return true;
  return now - last >= PORTO_GROUP_MIN_INTERVAL_MS;
}

export function portoGroupNewsQuietAfterGuide(lastGuideAt: string | undefined, now = Date.now()): boolean {
  if (!lastGuideAt) return false;
  const last = Date.parse(lastGuideAt);
  if (!Number.isFinite(last)) return false;
  return now - last < PORTO_GROUP_NEWS_QUIET_AFTER_GUIDE_MS;
}
