/** Exact-match SEO targets for high-intent queries (Google + Yandex). */
export type QueryLongTailTarget = {
  path?: string;
  guideSlug?: string;
  programSlug?: string;
  primaryQuery: string;
  queries: string[];
  seoTitle: string;
  seoDescription: string;
};

export const QUERY_LONG_TAIL_TARGETS: QueryLongTailTarget[] = [
  // —— Portugal (flagship) ——
  {
    path: "/ru/portugal",
    primaryQuery: "внж португалия d8 d7 2026 для россиян",
    queries: [
      "внж португалия d8 d7 2026 для россиян",
      "переехать в португалию из россии легально 2026",
      "aima португалия запись биометрия после визы",
      "d8 digital nomad португалия 2026",
    ],
    seoTitle: "ВНЖ Португалия D8 и D7 2026 — коридор №1 Emigro",
    seoDescription:
      "D8 и D7 Португалия 2026: €3 680 / €920, AIMA, NIF, практика сообщества. Самый проработанный коридор Emigro для паспортов RU/BY/UA/KZ.",
  },
  {
    path: "/ru/guides/vnj-portugaliya-d8-d7-grazhdanstvo-2026",
    guideSlug: "vnj-portugaliya-d8-d7-grazhdanstvo-2026",
    primaryQuery: "d8 португалия минимальный доход 2026",
    queries: [
      "d8 португалия минимальный доход 2026",
      "d7 португалия пассивный доход сбережения 2026",
      "внж португалия d8 d7 2026 для россиян",
      "закон о гражданстве португалия 10 лет d8",
      "aima португалия запись 2026",
    ],
    seoTitle: "D8 и D7 Португалия 2026 — доход, AIMA, гражданство",
    seoDescription:
      "D8 digital nomad и D7 Португалия 2026: €3 680 / €920, AIMA, NIF, гражданство 10 лет. Pillar-гид + практика для RU/BY/UA/KZ.",
  },
  {
    path: "/ru/portugal/programs/portugal-d8-digital-nomad",
    programSlug: "portugal-d8-digital-nomad",
    primaryQuery: "d8 digital nomad португалия 2026",
    queries: [
      "d8 digital nomad португалия 2026",
      "d8 португалия минимальный доход 2026",
      "внж португалия удалённая работа",
    ],
    seoTitle: "D8 digital nomad Португалия 2026 — доход и документы",
    seoDescription:
      "D8 digital nomad Португалия 2026: ~€3 680/мес, доход из-за рубежа, виза D + AIMA. Для паспортов RU/BY/UA/KZ.",
  },
  {
    path: "/ru/portugal/programs/portugal-d7-passive-income",
    programSlug: "portugal-d7-passive-income",
    primaryQuery: "d7 португалия пассивный доход 2026",
    queries: [
      "d7 португалия пассивный доход 2026",
      "d7 португалия сбережения 2026",
      "внж португалия пенсия россиян",
    ],
    seoTitle: "D7 Португалия 2026 — пассивный доход и сбережения",
    seoDescription:
      "D7 Португалия 2026: ~€920/мес + сбережения, без работы в PT. Виза D, AIMA для RU/BY/UA/KZ.",
  },
  {
    path: "/ru/guides/pervye-30-dnej-v-portugalii-2026",
    guideSlug: "pervye-30-dnej-v-portugalii-2026",
    primaryQuery: "nif португалия гражданин россии как получить",
    queries: [
      "nif португалия гражданин россии как получить",
      "первые 30 дней в португалии после переезда чеклист",
      "activobank португалия счёт для иностранца",
      "aima биометрия после прилёта",
    ],
    seoTitle: "NIF и первые 30 дней в Португалии 2026 — чек-лист",
    seoDescription:
      "NIF, банк, SIM, SNS и запись AIMA после прилёта в Португалию: пошаговый чек-лист для граждан РФ/BY/UA/KZ с D7 или D8 в 2026 году.",
  },
  // —— Spain ——
  {
    path: "/ru/spain",
    primaryQuery: "digital nomad испания 2026",
    queries: [
      "digital nomad испания 2026",
      "внж испания digital nomad 2026",
      "teletrabajo испания внж",
    ],
    seoTitle: "Digital nomad Испания 2026 — коридор ВНЖ Emigro",
    seoDescription:
      "Digital nomad visa Испания 2026: порог €2 849/мес, teletrabajo, Beckham 24%, non-lucrative. Wizard, программы и новости для паспортов RU/BY/UA/KZ.",
  },
  {
    path: "/ru/guides/vnj-ispaniya-2026",
    guideSlug: "vnj-ispaniya-2026",
    primaryQuery: "digital nomad испания 2026",
    queries: [
      "digital nomad испания 2026",
      "digital nomad visa испания для россиян 2026",
      "внж испания teletrabajo порог дохода",
    ],
    seoTitle: "Digital nomad Испания 2026 — ВНЖ и все маршруты",
    seoDescription:
      "Digital nomad visa Испания 2026: €2 849/мес, teletrabajo, Beckham, non-lucrative, Golden Visa закрыта. Pillar-гид для граждан РФ, BY, UA, KZ.",
  },
  {
    path: "/ru/spain/programs/spain-digital-nomad",
    programSlug: "spain-digital-nomad",
    primaryQuery: "digital nomad visa испания 2026",
    queries: [
      "digital nomad visa испания 2026",
      "виза цифрового кочевника испания 2026",
      "teletrabajo внж испания требования",
    ],
    seoTitle: "Digital nomad visa Испания 2026 — teletrabajo",
    seoDescription:
      "ВНЖ digital nomad (teletrabajo) в Испании 2026: доход от €2 849/мес, до 20% из ES, медстраховка, сроки подачи. Для паспортов RU/BY/UA/KZ.",
  },
  {
    path: "/ru/guides/digital-nomad-portugaliya-ispaniya-italiya-2026",
    guideSlug: "digital-nomad-portugaliya-ispaniya-italiya-2026",
    primaryQuery: "digital nomad европа 2026 сравнение",
    queries: [
      "digital nomad португалия испания италия 2026",
      "digital nomad испания vs португалия 2026",
      "куда переехать digital nomad европа 2026",
    ],
    seoTitle: "Digital nomad Испания vs Португалия 2026 — сравнение",
    seoDescription:
      "Сравнение digital nomad 2026: Испания €2 849/мес vs Португалия D8 €3 680 vs Италia. Налоги, сроки ВНЖ, гражданство — для граждан РФ и СНГ.",
  },
  // —— Germany ——
  {
    path: "/ru/germany",
    primaryQuery: "blue card германия 2026",
    queries: ["blue card германия 2026", "eu blue card germany 2026", "миграция через blue card eu"],
    seoTitle: "EU Blue Card Германия 2026 — коридор релокации",
    seoDescription:
      "Blue Card и Chancenkarte Германия 2026: пороги €50 700 / €45 934, документы, ПМЖ за 21–27 мес. Wizard и программы для паспортов RU/BY/UA/KZ.",
  },
  {
    path: "/ru/guides/germaniya-blue-card-chancenkarte-2026-sng",
    guideSlug: "germaniya-blue-card-chancenkarte-2026-sng",
    primaryQuery: "миграция через blue card eu",
    queries: [
      "миграция через blue card eu",
      "germany blue card 2026 для россиян",
      "chancenkarte германия 2026",
    ],
    seoTitle: "EU Blue Card Германия 2026 — работа для СНГ",
    seoDescription:
      "EU Blue Card и Chancenkarte 2026: пороги зарплаты, документы, IT без диплома, Chancenkarte. Легальный ВНЖ через работу для граждан РФ, BY, UA, KZ.",
  },
  {
    path: "/ru/germany/programs/germany-eu-blue-card",
    programSlug: "germany-eu-blue-card",
    primaryQuery: "eu blue card германия 2026",
    queries: ["eu blue card германия 2026", "blue card germany salary threshold 2026"],
    seoTitle: "EU Blue Card Германия 2026 — пороги и документы",
    seoDescription:
      "EU Blue Card Германия 2026: зарплата от €50 700 (общий) или €45 934 (shortage/IT), оффер, диплом. Требования для паспортов RU/BY/UA/KZ.",
  },
  // —— Belarus ——
  {
    path: "/ru/guides/belorusy-v-evropu-vnj-2026",
    guideSlug: "belorusy-v-evropu-vnj-2026",
    primaryQuery: "белорусы внж европа 2026",
    queries: [
      "белорусы внж европа 2026",
      "внж в европе для белорусов без temporary protection",
      "беларусь work permit польша 2026",
    ],
    seoTitle: "Белорусы в Европе 2026 — ВНЖ без TP, Польша",
    seoDescription:
      "ВНЖ в Европе для белорусов 2026: нет TP, подача через Польшу и Чехию. Work permit, EU Blue Card, B2B IT, D7/D8. Консульства и санкции.",
  },
  // —— Transit hubs (Google long-tail) ——
  {
    path: "/ru/guides/bali-indoneziya-dlya-rossiyan-2026",
    guideSlug: "bali-indoneziya-dlya-rossiyan-2026",
    primaryQuery: "бали для россиян 2026",
    queries: [
      "бали для россиян 2026",
      "бали digital nomad 2026",
      "e33g remote worker indonesia 2026",
    ],
    seoTitle: "Бали для россиян 2026 — E33G Remote Worker, B211A",
    seoDescription:
      "Бали для россиян 2026: E33G Remote Worker ($60k/год), B211A, Second Home отдельно. Стоимость жизни, налоги и подготовка EU-маршрута.",
  },
  {
    path: "/ru/guides/chernogoriya-vnj-dlya-rossiyan-2026",
    guideSlug: "chernogoriya-vnj-dlya-rossiyan-2026",
    primaryQuery: "черногория внж для россиян 2026",
    queries: [
      "черногория внж для россиян 2026",
      "черногория digital nomad 2026",
      "внж черногория 1800 евро",
    ],
    seoTitle: "Черногория ВНЖ для россиян 2026 — nomad €1800, DOO",
    seoDescription:
      "ВНЖ Черногория 2026: digital nomad от €1800/мес, DOO, безвиз. Программа до 31.12.2026, Будва, путь в EU.",
  },
  {
    path: "/ru/guides/gruziya-dlya-rossiyan-2026",
    guideSlug: "gruziya-dlya-rossiyan-2026",
    primaryQuery: "соглашение об избежании двойного налогообложения россия грузия 2026",
    queries: [
      "соглашение об избежании двойного налогообложения россия грузия 2026",
      "грузия для россиян 2026",
      "сидн россия грузия действует",
    ],
    seoTitle: "Грузия для россиян 2026 — въезд, ВНЖ, СИДН с РФ",
    seoDescription:
      "Грузия 2026: въезд, ВНЖ, банки. СИДН Россия–Грузия не ратифицировано — двойное налогообложение возможно. Факты для релокантов.",
  },
];

export function getLongTailByGuideSlug(slug: string): QueryLongTailTarget | undefined {
  return QUERY_LONG_TAIL_TARGETS.find((t) => t.guideSlug === slug);
}

export function getLongTailByPath(path: string): QueryLongTailTarget | undefined {
  return QUERY_LONG_TAIL_TARGETS.find((t) => t.path === path);
}

export function getLongTailByProgramSlug(slug: string): QueryLongTailTarget | undefined {
  return QUERY_LONG_TAIL_TARGETS.find((t) => t.programSlug === slug);
}
