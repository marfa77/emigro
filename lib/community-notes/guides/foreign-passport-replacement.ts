/** Hand-curated guide — action-manual rules: lib/community-notes/editorial-presentation.ts
 * Each section: «Что делать» + «Зачем» in paragraphs; bullets = actionable «Как»
 * PT terms in glossary (≤10) or inline gloss. Tone: «мы сами проходили через это».
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { formatPracticeTakeaway } from "@/lib/community-notes/practice-format";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const FOREIGN_PASSPORT_REPLACEMENT_SLUG = "zamena-zagranpasporta-portugaliya-2026";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(glossaryForSlug(FOREIGN_PASSPORT_REPLACEMENT_SLUG)!),
  },
  {
    heading: "Куда обращаться: одно консульство на всю Португалию",
    section_kind: "official",
    paragraphs: [
      "Что делать: определить, в какое консульство (consulado) вашей страны ехать — для Norte почти всегда Lisboa, для UA возможен Porto.",
      "Зачем: без этого потратите день на поездку не туда; это отдельный трек от NIF и AIMA (иммиграционная служба).",
    ],
    bullets: [
      "Проверьте юрисдикцию: **Россия** — только Посольство РФ в Lisboa (Restelo); в Porto консульства нет.",
      "Сравните для **Украины**: Embaixada в Lisboa или Consulado no Porto (Avenida de França 352) — для Norte логичнее Porto.",
      "Запишитесь в Embassy Казахстана в Lisboa — запись через consul.lisbon@mfa.kz.",
      "Уточните для **Беларуси**: в PT нет миссии; продление за рубежом с 2023 фактически закрыто.",
      "Оформите comprovativo de morada и NIF до consular-пакета — [первый месяц в Португалии](/notes/pervyj-mesyac-portugaliya-checklist).",
    ],
  },
  {
    heading: "Документы и сборы: что готовить до agendamento",
    section_kind: "official",
    paragraphs: [
      "Что делать: собрать полный пакет документов до agendamento (записи) — консульство не примет частично.",
      "Зачем: одна неверная копия или анкета = потерянный слот и новая поездка в Lisboa.",
    ],
    bullets: [
      "Подготовьте **РФ биометрия (10 лет)**: загран + внутренний паспорт, анкета zp.midpass.ru (штрих-код), comprovativo de morada.",
      "Для **РФ 5 лет**: 4 фото 3,5×4,5 см + анкета passportzu.kdmid.ru (форма 2П, 2 экз.).",
      "Возьмите ребёнка до 18 и обоих родителей (или нотариальное согласие) — после 14 лет отдельный passaporte.",
      "Заверьте PT-документы: certidão, contrato — apostila + перевод на русский (embrussia.ru).",
      "Уточните сборы на embrussia.ru — на практике часто наличные € в consulado.",
    ],
  },
  {
    heading: "Запись, подача и сроки изготовления",
    section_kind: "official",
    paragraphs: [
      "Что делать: записаться на agendamento, подать документы лично и запланировать отдельный визит на выдачу.",
      "Зачем: без записи в консульство РФ не попасть; готовый passaporte выдают только лично.",
    ],
    bullets: [
      "Запишитесь на lisboa.kdmid.ru: «Первичная запись» → загранпаспорт; можно несколько услуг в один визит.",
      "Приезжайте пн/ср/чт/пт по записи на приём — вне графика не принимают (embrussia.ru/node/59).",
      "Запланируйте второй визит на выдачу: пн/ср/чт/пт 9:15–12:45, общая очередь; с 14 лет — только лично.",
      "Закладывайте до 3 месяцев на изготовление биометрического passaporte.",
      "Запросите svidetelstvo na vozvrashchenie по записи при срочном выезде — не заменяет загран для дальних поездок.",
    ],
  },
  {
    heading: "Norte на практике: поездка, очереди, выдача",
    section_kind: "practice",
    paragraphs: [
      "Что делать: спланировать полный день в Lisboa из Norte — поездка, consulado, запас на пробки.",
      "Зачем: CP/FlixBus ~3 ч в одну сторону; многие совмещают с AIMA или Finanças — см. [запись в AIMA](/notes/aima-agora-zapis-2026).",
    ],
    bullets: [
      "Мониторите слоты lisboa.kdmid.ru неделями — сохраняйте скрин «Проверка записи» (сбои e-mail в @chatlisboa, июль 2026).",
      "Подготовьте цветные копии разворотов — безопаснее для биометрического пакета.",
      "Не покупайте «запись без очереди» из чата — риск мошенничества и отказа на входе.",
      "Приезжайте к 9:15 на выдачу passaporte — утренняя очередь без записи.",
      "Сравните срок заграна и título de residência — параллельно планируйте [продление AIMA](/notes/aima-agora-zapis-2026).",
    ],
  },
  {
    heading: "Где официальные правила и жизнь расходятся",
    section_kind: "gap",
    paragraphs: [
      "Что делать: сверять официальные сроки с тем, что пишут релоканты в чатах — и закладывать запас.",
      "Зачем: «запись за пару дней» на сайте ≠ реальность 2–6 недель ожидания слота.",
    ],
    bullets: [
      "На сайте звучит как «запись за пару дней», а в чатах слот на подачу ловят 2–6 недель; полный цикл с выдачей — часто 2–4 месяца.",
      "На сайте «до 3 месяцев изготовление» — на деле зависит от очереди в Москве/МИД; без звонка в consulado статус не узнать.",
      "На сайте обещают e-mail подтверждения agendamento — участники @chatlisboa в 2026 писали, что письма не доходят; проверяйте статус на kdmid и спам.",
      "На сайте допускают подачу в одном consulado и получение в другом — участники @chatlisboa в 2025 писали, что для РФ cross-border выдача в другой стране ЕС не работает.",
      "На сайте BY consulado Paris — декрет 2023: продление за границей закрыто; на деле — возврат в BY или proteção temporária.",
      "На сайте загран = проездной, а с EES (с 2025) RU passaporte не проходит e-gates; только живая очередь.",
    ],
  },
  {
    heading: "Дети, Беларусь и двойное гражданство",
    section_kind: "practice",
    paragraphs: [
      "Что делать: отдельно разобрать кейсы детей, граждан BY и двойного гражданства — не путать consular passaporte и португальский ВНЖ.",
      "Зачем: ошибка здесь блокирует выезд, банк и продление título de residência.",
    ],
    bullets: [
      "Проверьте, сидит ли ребёнок до 12 для биометрии — иначе берите 5-летний passaporte с фото заранее.",
      "Оформите отдельный документ ребёнку — Iberia и часть стран не принимают вписание в passaporte родителя.",
      "Запросите согласие на выезд отдельной услугой consulado РФ — уточните сбор при agendamento.",
      "Для **Беларуси** без valid passaporte — обсудите proteção temporária / travel document с AIMA и адвокатом.",
      "Используйте EU passaporte PT для EU-перелётов, RU/BY/UA — для поездок «на родину».",
    ],
  },
  {
    heading: "Типичные ошибки и ориентир по срокам",
    section_kind: "practice",
    paragraphs: [
      "Что делать: начать за 6–9 месяцев до expiry и избегать типичных ошибок из @chatlisboa.",
      "Зачем: слот + 3 месяца изготовления + выдача могут пересечься с отпуском или продлением ВНЖ.",
    ],
    bullets: [
      "Запланируйте agendamento за 6–9 мес. до expiry — не ждите последний месяц.",
      "Сверяйте график consulado с праздниками PT/RF перед поездкой (embrussia.ru).",
      "Не езжайте с неполным пакетом — консульство РФ не принимает частично.",
      "Не отправляйте родственника за passaporte 14+ — не выдадут.",
      "Оформите comprovativo de morada — см. [гайд по NIF](/notes/nif-lissabon-chto-puutayut).",
    ],
  },
];

const keyTakeaways = [
  "Официально: загран RU/BY/UA/KZ в PT — через посольство в Lisboa (UA также Consulado no Porto); agendamento онлайн обязателен для подачи.",
  formatPracticeTakeaway({
    channels: ["chatlisboa"],
    period: "2025–2026",
    claim:
      "слот на lisboa.kdmid.ru (консульство РФ в Лиссабоне) часто открывается с ожиданием в несколько недель",
    forReader:
      "закладывайте минимум 2 поездки в Lisboa — на подачу и на выдачу — плюс полный день, если живёте на Norte",
  }),
  "Официально: биометрический RU passaporte — 10 лет, zp.midpass.ru, срок до 3 мес.; выдача пн/ср/чт/пт 9:15–12:45 лично.",
  "Расхождение: BY паспорт за рубежом почти не продлевается — параллельно планируйте AIMA/защиту, не только consulado.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Можно ли заменить загран в консульстве в Porto?",
    a: "Для граждан РФ — нет, только Lisboa. Для граждан Украины — да, работает Consulado da Ucrânia no Porto (Avenida de França 352). Казахстан — только Embassy в Lisboa.",
  },
  {
    q: "За сколько месяцев до окончания срока подавать на новый загран?",
    a: "Официально — с любым опережением, штрафов нет. На практике начинайте за 6–9 месяцев: agendamento 2–6 недель + до 3 месяцев изготовление + отдельный визит на выдачу.",
  },
  {
    q: "Нужен ли comprovativo de morada для заграна в консульстве РФ?",
    a: "Для пакета в PT-residence его готовят: contrato, recibos, declaração de morada. Без morada сложнее и банк, и часть consular-услуг — оформите NIF и адрес по [чеклисту первого месяца](/notes/pervyj-mesyac-portugaliya-checklist).",
  },
  {
    q: "Можно ли получить паспорт без личного визита?",
    a: "Нет для граждан 14+: выдача только лично в consulado. Подача документов — тоже лично по agendamento. Доверенность на получение не принимают.",
  },
  {
    q: "Что делать, если загран и внутренний паспорт РФ просрочены?",
    a: "Consulado не примет заявление — сначала процедура подтверждения гражданства РФ (месяцы). Не допускайте одновременного expiry обоих документов; пишите consulado заранее.",
  },
  {
    q: "Как белорусу обновить паспорт, живя в Португалии?",
    a: "С 2023 г. BY consulates за рубежом практически не продлевают passaporte — нужен визит в BY или альтернативный travel document / proteção temporária через AIMA. Embaixada BY — Paris, не Lisboa.",
  },
  {
    q: "Биометрический или 5-летний загран — что выбрать?",
    a: "Consulado рекомендует биометрию взрослым: 10 лет, фото на месте, лучше для EES и авиакомпаний. 5-летний — если ребёнок не сидит для отпечатков или нужен срочный passaporte с заранее напечатанными фото.",
  },
];

export const FOREIGN_PASSPORT_REPLACEMENT_GUIDE = {
  slug: FOREIGN_PASSPORT_REPLACEMENT_SLUG,
  category: "Документы",
  content_kind: "guide" as ContentKind,
  title: "Замена загранпаспорта в Португалии 2026: консульство, запись и практика для Norte",
  excerpt:
    "Гайд по embrussia.ru и сигналам @chatlisboa, @por_tugal, @autolife_pt: agendamento в Lisboa, документы RU/UA/KZ/BY, поездки из Porto/Braga и реальные сроки.",
  seo_title: "Загранпаспорт в Португалии 2026 — консульство",
  seo_description:
    "Как заменить загран RU/BY/UA/KZ в Португалии: consulado Lisboa, agendamento kdmid, документы, сроки, выдача и опыт релокантов из Porto и Norte.",
  quick_answer:
    "Вы сидите в кафе в Cedofeita, открываете consulado.ru — и понимаете неприятную географию: одно посольство на всю Португалию, в Lisboa. Загранпаспорт RU/BY/UA/KZ оформляется только через него; украинцам доступен ещё consulado в Porto. Agendamento онлайн обязателен: из Norte закладывайте две поездки — подача и личная выдача, изготовление до 3 месяцев.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "lisboa.kdmid.ru — запись в консульство РФ", url: "https://lisboa.kdmid.ru/queue/" },
    { title: "embrussia.ru — порядок оформления загранпаспорта", url: "http://www.embrussia.ru/node/60" },
    { title: "embrussia.ru — режим работы и выдача", url: "http://www.embrussia.ru/node/59" },
    { title: "Consulado da Ucrânia no Porto", url: "https://porto.mfa.gov.ua/pt" },
    { title: "Embassy of Kazakhstan in Lisbon", url: "https://www.gov.kz/memleket/entities/mfa-lisbon?lang=en" },
    { title: "gov.pt — proteção temporária Ucrânia", url: "https://www2.gov.pt/-/acolhimento-de-pessoas-deslocadas-da-ucr%C3%A2nia" },
  ],
  topic_tags: ["documents", "portugal"],
  hashtags: buildNoteHashtags({
    topicTags: ["documents", "portugal"],
    contentKind: "guide",
    extra: ["загранпаспорт", "консульство", "паспорт", "lisboa"],
  }),
  source_channel: "chatlisboa+por_tugal+autolife_pt+lepta",
  source_label: "editorial:19-signals+consulates+voice-pass",
};
