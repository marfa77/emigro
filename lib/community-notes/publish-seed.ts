import { createServerClient } from "@/lib/supabase/server";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

type SeedNote = {
  slug: string;
  category: string;
  content_kind: ContentKind;
  title: string;
  excerpt: string;
  seo_title: string;
  seo_description: string;
  quick_answer: string;
  body_paragraphs: string[];
  body_sections?: NoteBodySection[];
  key_takeaways?: string[];
  faq: CommunityNoteFaq[];
  official_links: Array<{ title: string; url: string }>;
  topic_tags: string[];
};

/** Baseline editorial notes — full voice, not truncated seed fallback. */
export const PORTUGAL_EDITORIAL_SEED: SeedNote[] = [
  {
    slug: "pervyj-mesyac-portugaliya-checklist",
    category: "Первый месяц",
    content_kind: "guide",
    title: "Первый месяц в Португалии: чеклист миграции",
    excerpt:
      "NIF, SNS, банк, адрес, AIMA — что закрыть в первые 30 дней после прилёта, чтобы не потерять неделю на типичных ошибках.",
    seo_title: "Первый месяц в Португалии 2026 — чеклист релоканта",
    seo_description:
      "Чеклист на 30 дней после переезда в Португалии: NIF, e-Fatura, SNS, банк, аренда, AIMA. Практический порядок шагов для Лиссабона.",
    quick_answer:
      "В первый месяц закройте базу: адрес → NIF и e-Fatura → регистрация в centro de saúde (número de utente) → банковский счёт → договор аренды с регистрацией → запись AIMA, если срок по visе уже идёт.",
    body_paragraphs: [
      "Первые 30 дней — не про «успеть всё», а про правильный порядок. Ошибка недели один: сначала аренда без NIF, потом банк, потом выясняется, что адрес не подходит для AIMA.",
      "Неделя 1 — документы и связь. SIM/eSIM, адрес для корrespondência, NIF в Finanças, активация e-Fatura. Без этого сложнее аренда и банк.",
      "Неделя 2 — жильё и быт. Договор с NIF обеих сторон, caução с назначением платежа, регистрация arrendamento, фото состояния квартиры. Параллельно — запись в centro de saúde и número de utente do SNS или частная страховка до подключения.",
      "Неделя 3 — деньги и миграция. Банковский счёт (часто нужны NIF + контракт/справка), сбор папки для AIMA/Agora, охота за слотом с готовыми PDF.",
      "Неделя 4 — закрепление. Проверьте сроки по визе/D visa, подтвердите адрес в Finanças, сохраните все квитанции. Не откладывайте AIMA «на потом» — слоты не ждут.",
      "Типичные потери времени: «временный NIF у знакомого», перевод caução на личную карту, поездка в AIMA без записи, VPN при работе с Agora.",
    ],
    faq: [
      {
        q: "С чего начать в первый день?",
        a: "SIM и адрес для корrespondência, затем запись на NIF. Не переводите крупные суммы за аренду до проверки договора.",
      },
      {
        q: "Можно отложить AIMA на второй месяц?",
        a: "Зависит от типа визы и сроков. Сверьте дедлайн в документах — просрочка часто дороже, чем ранняя подготовка PDF.",
      },
      {
        q: "Нужен ли банк в первый месяц?",
        a: "Не всегда обязателен, но сильно упрощает аренду, подписки и подтверждение платежей. NIF обычно нужен раньше банка.",
      },
    ],
    official_links: [
      { title: "Portal das Finanças", url: "https://www.portaldasfinancas.gov.pt/" },
      { title: "SNS — número de utente", url: "https://www.sns.gov.pt/" },
      { title: "AIMA", url: "https://aima.gov.pt/" },
      { title: "Agora", url: "https://agora.imigrante.pt/" },
    ],
    topic_tags: ["nif", "aima", "sns", "bank", "arenda"],
  },
  {
    slug: "nif-lissabon-chto-puutayut",
    category: "NIF и налоги",
    content_kind: "guide",
    title: "NIF в Лиссабоне: что чаще всего путают в чате",
    excerpt:
      "Finanças, e-Fatura, представитель и сроки — типичные вопросы из чатов релокантов. Где теряют неделю и что проверить до подачи на ВНЖ.",
    seo_title: "NIF в Лиссабоне 2026 — типичные ошибки",
    seo_description:
      "NIF в Португалии: Finanças, e-Fatura, representante fiscal. Что путают в чатах релокантов и безопасный порядок шагов для RU/BY/UA/KZ.",
    quick_answer:
      "NIF выдаёт Finanças. Это налоговый номер, не ВНЖ. Для нерезидента часто нужен representante fiscal; без NIF и e-Fatura не закроете аренду, банк и часть шагов по AIMA.",
    body_paragraphs: [
      "Вы только прилетели, нашли комнату на неделю и уже спрашиваете в чате: «NIF сегодня можно?» — и получаете три противоречивых ответа. Это нормально: в @chatlisboa и @por_tugal каждую неделю повторяются одни и те же путаницы.",
      "Первая — «NIF = право жить». Нет. NIF нужен для налогов и контрактов; право пребывания — отдельная цепочка: виза → AIMA → карта резидента.",
      "Вторая — «можно без representante fiscal, я же в Airbnb». Иногда получается, иногда нет — зависит от статуса и адреса. Представитель — не «развод посредников», а типовая схема для нерезидента. Проверяйте договор; пароли от Portal das Finanças никому не давайте.",
      "Третья — «e-Fatura не нужна, пока не работаю». На практике без неё сложнее закрывать быт: чеки, аренда, споры с арендодателем. Просите NIF на кассе — это привычка на пять секунд.",
      "Безопасный порядок: адрес для корrespondência → Finanças (NIF) → e-Fatura → договор аренды с NIF → банк. Не подменяйте это «временным NIF у знакомого» — частая причина повторных визитов и отказов.",
    ],
    faq: [
      {
        q: "NIF даёт право жить в Португалии?",
        a: "Нет. Это налоговый идентификатор. ВНЖ оформляется через консульство и AIMA отдельно.",
      },
      {
        q: "Можно ли получить NIF без адреса в PT?",
        a: "Часто нужен адрес для корrespondência или representante fiscal — сверяйте с Portal das Finanças на дату обращения.",
      },
      {
        q: "Зачем e-Fatura без работы в Португалии?",
        a: "Для учёта расходов и подтверждения бытовых платежей; многие шаги с арендой и банком проще с активным профилем.",
      },
    ],
    official_links: [
      { title: "Portal das Finanças", url: "https://www.portaldasfinancas.gov.pt/" },
      { title: "e-Fatura", url: "https://faturas.portaldasfinancas.gov.pt/" },
    ],
    topic_tags: ["nif", "financas", "e-fatura"],
  },
  {
    slug: "aima-agora-zapis-2026",
    category: "AIMA и записи",
    content_kind: "lifehack",
    title: "AIMA и Agora: как не потерять неделю на записи",
    excerpt:
      "Слот исчез, PDF не грузится, «можно без записи?» — разбираем стресс из чатов без мифов про секретные окна.",
    seo_title: "AIMA Agora 2026 — запись без потери слота",
    seo_description:
      "Запись в AIMA через Agora: типичные ошибки, подготовка PDF и что делать, если слот пропал. Практика для Лиссабона и Португалии.",
    quick_answer:
      "Запись — через Agora. Слоты конкурентные: соберите PDF заранее, не верьте «контактам внутри AIMA» и не езжайте без подтверждённой записи.",
    body_paragraphs: [
      "В чатах Португалии три боли звучат каждую неделю: «слот исчез за минуту», «портал не принимает файл», «можно прийти живой очередью в Лиссабоне?»",
      "Agora — основной путь для большинства процедур AIMA. Обходные «контакты» — риск мошенничества и потерянного времени.",
      "Перед охотой за слотом соберите папку: паспорт, адрес, страховка, квитанции, фото по требованиям портала. Частая техническая причина отказа — размер PDF или нечитаемый скан.",
      "Слот сорвался — нормально в пиковые недели. Пробуйте утренние окна по Europe/Lisbon; VPN иногда ломает геолокацию портала.",
      "Без записи вас чаще всего развернут. Час на подготовку PDF обычно дешевле, чем день поездки в офис.",
    ],
    faq: [
      {
        q: "Можно попасть в AIMA без записи?",
        a: "В большинстве случаев нет — нужна запись через Agora.",
      },
      {
        q: "Почему Agora не принимает документ?",
        a: "Проверьте размер, формат PDF и читаемость скана; сожмите файл и сверьте требования процедуры.",
      },
    ],
    official_links: [
      { title: "AIMA", url: "https://aima.gov.pt/" },
      { title: "Agora", url: "https://agora.imigrante.pt/" },
    ],
    topic_tags: ["aima", "agora", "vng"],
  },
  {
    slug: "arenda-lissabon-do-podpisi",
    category: "Аренда",
    content_kind: "tip",
    title: "Аренда в Лиссабоне: вопросы из чата до подписи",
    excerpt:
      "Caução, fiador, NIF в договоре и регистрация arrendamento — что обсудить до перевода денег.",
    seo_title: "Аренда Лиссабон 2026 — до подписи договора",
    seo_description:
      "Аренда в Лиссабоне: caução, fiador, NIF, регистрация arrendamento. Что проверить до подписи — для русскоязычных релокантов.",
    quick_answer:
      "До подписи: NIF обеих сторон, лимит caução, опись имущества, регистрация договora и платёж с назначением — не наличными без trace.",
    body_paragraphs: [
      "Типичная история из чата: договор на английском, caução на личный счёт, через месяц — arrendamento не зарегистрирован, адрес не подходит для AIMA.",
      "NIF в договоре — не формальность. Без него сложнее банк и миграционные шаги. Отказ арендодателя указывать NIF — красный флаг.",
      "Caução — обычно до одного месяца (NRAU ограничивает максимум). Перевод с назначением «caução + адрес», не «на карту другу».",
      "Fiador для иностранцев — частое требование. «Три месяца вперёд + fiador + залог» — сравните с рынком, не подписывайте под давлением «последний шанс сегодня».",
      "После подписи: регистрация arrendamento в Finanças, фото состояния квартиры, первая квитанция с вашим NIF.",
    ],
    faq: [
      {
        q: "Нужен ли NIF в договоре?",
        a: "Да — для большинства административных шагов адрес подтверждается через зарегистрированный договор.",
      },
      {
        q: "Сколько может быть caução?",
        a: "Обычно до одного месячного платежа; сверяйте с действующим законом об аренде.",
      },
    ],
    official_links: [{ title: "Portal das Finanças", url: "https://www.portaldasfinancas.gov.pt/" }],
    topic_tags: ["arenda", "arrendamento", "lisboa"],
  },
];

export async function publishPortugalSeedNotes(): Promise<number> {
  const supabase = createServerClient();
  const now = new Date().toISOString();
  let published = 0;

  for (const note of PORTUGAL_EDITORIAL_SEED) {
    const { data: existing } = await supabase.from("community_notes").select("id").eq("slug", note.slug).maybeSingle();
    if (existing) continue;

    const { error } = await supabase.from("community_notes").insert({
      ...note,
      hashtags: buildNoteHashtags({ topicTags: note.topic_tags, contentKind: note.content_kind }),
      country_key: "portugal",
      city: "lisbon",
      source_channel: "chatlisboa+por_tugal",
      source_label: null,
      status: "published",
      published_at: now,
      updated_at: now,
    });

    if (error) {
      console.warn(`[seed] ${note.slug}: ${error.message}`);
    } else {
      published += 1;
      console.log(`[seed] published ${note.slug}`);
    }
  }

  return published;
}
