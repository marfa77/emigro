/** Hand-curated guide — see lib/community-notes/editorial-presentation.ts for writing rules. */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
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
      "Если вы живёте в Norte (Порту, Braga, Minho) — загран вашей страны всё равно оформляется через посольство/консульство в Лиссабоне или, для украинцев, иногда в Порту. Это отдельная поездка от NIF и AIMA.",
    ],
    bullets: [
      "**Россия** — только консульский отдел Посольства РФ в Lisboa (Restelo); отдельного консульства в Porto нет. Jurisdição — вся Португалия.",
      "**Украина** — Embaixada в Lisboa (Avenida das Descobertas 18) или Consulado da Ucrânia no Porto (Avenida de França 352) — для Norte логичнее Porto.",
      "**Казахстан** — Embassy в Lisboa (Rua Pêro da Covilhã 20); запись через consul.lisbon@mfa.kz.",
      "**Беларусь** — в PT нет миссии; исторически — Embaixada em Paris. С 2023 г. продление паспорта за рубежом фактически закрыто — см. блок про BY ниже.",
      "Португальский passaporte (Cartão de Cidadão) — отдельный трек через IRN/Siga; этот гайд про паспорт страны гражданства.",
      "Сначала оформите comprovativo de morada и NIF — без них сложнее банк и часть consular-пакетов; чеклист: [первый месяц в Португалии](/notes/pervyj-mesyac-portugaliya-checklist).",
    ],
  },
  {
    heading: "Документы и сборы: что готовить до agendamento",
    section_kind: "official",
    paragraphs: [
      "Консульство принимает пакет целиком или не принимает вовсе — в @chatlisboa часто пишут про отказ из‑за одной копии или неверной анкеты. Заполните форму онлайн до визита.",
    ],
    bullets: [
      "**РФ (биометрия, 10 лет)** — действующий загран + внутренний паспорт (если есть), анкета с zp.midpass.ru (лист со штрих-кодом), comprovativo de morada в PT; фото на месте.",
      "**РФ (5 лет, небиометр.)** — те же ID + 4 цветных фото 3,5×4,5 см; анкета на passportzu.kdmid.ru (форма 2П, 2 экз.).",
      "**Дети до 18** — ребёнок и оба родителя (или один с нотариальным согласием второго) лично; у представителя обязателен действующий загран; после 14 лет — отдельный passaporte.",
      "**Португальские бумаги** — certidão, contrato, справки Finanças: apostila + перевод на русский с нотариальным заверением (embrussia.ru).",
      "**Сборы РФ** — оплата в consulado, на практике часто наличные €; сумма зависит от типа passaporte (уточняйте на embrussia.ru перед визитом).",
      "**Украина / KZ** — паспорт, заявление, фото, proof of residence; детали — на porto.mfa.gov.ua или gov.kz/mfa-lisbon.",
    ],
  },
  {
    heading: "Запись, подача и сроки изготовления",
    section_kind: "official",
    paragraphs: [
      "Без agendamento в консульство РФ не попасть на подачу. Выдача готового passaporte — отдельный визит, часто без записи, но только лично.",
    ],
    bullets: [
      "**РФ — запись** — lisboa.kdmid.ru (бесплатно): «Первичная запись» → услуга загранпаспорт; можно несколько услуг в один визит.",
      "**РФ — приём документов** — пн, ср, чт, пт по записи; вне графика не принимают (embrussia.ru/node/59).",
      "**РФ — выдача** — пн, ср, чт, пт 9:15–12:45, общая очередь; с 14 лет — только лично, родственникам не выдают.",
      "**Официальный срок РФ** — до 3 месяцев на биометрический и небиометрический passaporte.",
      "**Срочный выезд** — свидетельство на возвращение в РФ (svidetelstvo na vozvrashchenie) по записи при доказанной необходимости; не заменяет полноценный загран для дальних поездок.",
      "**Украина** — agendamento онлайн через сайт миссии; Porto: пн–ср, пт 9:30–12:45, чт 14:30–17:45.",
    ],
  },
  {
    heading: "Norte на практике: поездка, очереди, выдача",
    section_kind: "practice",
    paragraphs: [
      "Для жителей Порту и Braga закладывайте полный день в Lisboa: CP/FlixBus ~3 ч в одну сторону + consulado + запас на пробки. Многие совмещают с AIMA или Finanças — см. [запись в AIMA](/notes/aima-agora-zapis-2026).",
    ],
    bullets: [
      "**Запись РФ** — слоты на lisboa.kdmid.ru мониторят неделями; в @chatlisboa (июль 2026) жалуются на сбои e-mail подтверждений — сохраняйте скрин статуса «Проверка записи».",
      "**Копии** — в @chatlisboa (июнь 2026) спрашивали: цветные или ч/б для биометрии; безопаснее цветные копии разворотов, как для любых consular-пакетов.",
      "**«Запись без очереди»** — в @chatlisboa предлагали «контакты»; это не официальный agendamento — риск мошенничества и отказа на входе.",
      "**Выдача passaporte** — второй рейс в Lisboa; утренняя очередь 9:15–12:45, приезжайте к открытию.",
      "**Украинцы в Norte** — Consulado no Porto сокращает логистику vs поездка в Lisboa; уточняйте, какие услуги доступны именно там.",
      "**Срок vs ВНЖ** — если загран истекает раньше título de residência, параллельно планируйте продление AIMA ([запись в AIMA](/notes/aima-agora-zapis-2026)): банки и перелёты смотрят на оба документа.",
    ],
  },
  {
    heading: "Где официальные правила и жизнь расходятся",
    section_kind: "gap",
    bullets: [
      "Сайт: «запись за пару дней» → в чатах слот на подачу ловят 2–6 недель; полный цикл с выдачей — часто 2–4 месяца.",
      "Сайт: «до 3 месяцев изготовление» → на деле зависит от очереди в Москве/МИД; без звонка в consulado статус не узнать.",
      "Сайт: e-mail подтверждения agendamento → @chatlisboa (2026): письма не доходят — проверяйте статус на kdmid и спам.",
      "Сайт: можно подать в одном consulado, получить в другом → @chatlisboa (2025): для РФ cross-border выдача в другой стране ЕС не работает.",
      "Сайт BY: consulado Paris → декрет 2023: продление за границей закрыто; на деле — только возврат в BY или travel document / защита в PT.",
      "Сайт: загран = проездной → с EES (с 2025) RU passaporte не проходит e-gates в EU; только живая очередь (@chatlisboa, @por_tugal).",
    ],
  },
  {
    heading: "Дети, Беларусь и двойное гражданство",
    section_kind: "practice",
    paragraphs: [
      "Отдельный кейс — семьи с детьми и граждане BY/KZ с двумя паспортами. Здесь важно не перепутать consular passaporte и португальский ВНЖ.",
    ],
    bullets: [
      "**Ребёнок до 12** — биометрия в consulado: должен сидеть неподвижно; иначе берут 5-летний passaporte с фото заранее (embrussia.ru).",
      "**Вписание в passaporte родителя** — только небиометрический 5 лет; Iberia и часть стран требуют отдельный документ ребёнку.",
      "**Согласие на выезд** — отдельная услуга consulado РФ; в @chatlisboa (2025) сбор оплачивали наличными, сумму лучше уточнить при agendamento.",
      "**Беларусь** — без valid passaporte сложно продлить ВНЖ в AIMA; обсуждали proteção temporária / travel document — индивидуально с AIMA и адвокатом.",
      "**Два гражданства** — EU passaporte PT не отменяет обязанность обновлять RU/BY/UA документ для поездок «на родину»; для EU-перелётов используйте тот passaporte, на который оформлен Schengen-статус.",
      "**Потеря заграна** — сначала заявление о признании недействительным, потом новый; без данных утерянного — запрос consulado в страну выдачи (месяцы).",
    ],
  },
  {
    heading: "Типичные ошибки и ориентир по срокам",
    section_kind: "practice",
    bullets: [
      "Ждать последний месяц срока passaporte — слот agendamento + 3 месяца изготовления могут пересечься с отпуском или продлением ВНЖ.",
      "Ехать в consulado без проверки праздников PT/RF и забастовок — в @chatlisboa (июнь 2026) спрашивали «работает ли завтра»; сверяйте embrussia.ru.",
      "Неполный пакет «дополним потом» — консульство РФ не принимает частично; потеряете слот.",
      "Доверенность вместо личной выдачи (14+) — passaporte не отдадут родственникам.",
      "Игнорировать comprovativo de morada — нужен для PT-бюрократии и часто для consular-пакета; см. [гайд по NIF](/notes/nif-lissabon-chto-puutayut).",
      "**Ориентир:** за 6–9 мес. до expiry — agendamento; +1–3 мес. изготовление; +1 поездка на выдачу.",
    ],
  },
];

const keyTakeaways = [
  "Официально: загран RU/BY/UA/KZ в PT — через посольство в Lisboa (UA также Consulado no Porto); agendamento онлайн обязателен для подачи.",
  "На практике (@chatlisboa): слот lisboa.kdmid.ru — недели ожидания; закладывайте 2 поездки в Lisboa (подача + выдача) и полный день из Norte.",
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
    "Загран паспорт RU/BY/UA/KZ в Португалии оформляется только через посольство в Lisboa — для украинцев есть ещё consulado в Porto. Запись (agendamento) онлайн обязательна; из Norte закладывайте две поездки: подача по записи и личная выдача. По опыту @chatlisboa слот на lisboa.kdmid.ru ловят неделями, изготовление до 3 месяцев.",
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
  source_label: "editorial:19-signals+consulates",
};
