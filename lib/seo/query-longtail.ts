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
    seoTitle: "ВНЖ Португалия D8/D7 2026 — €3 680 / €920",
    seoDescription:
      "D8 и D7 Португалия 2026: €3 680 / €920, AIMA, NIF, практика сообщества. Коридор №1 Emigro для паспортов RU/BY/UA/KZ.",
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
    seoTitle: "D8 Португалия 2026: €3 680 + AIMA — RU/BY/UA",
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
    seoTitle: "NIF Португалия 2026 — 30 дней для RU/BY",
    seoDescription:
      "NIF за 7 дней, банк, SIM, SNS и AIMA после прилёта: пошаговый чек-лист для граждан RU/BY/UA/KZ с D7 или D8 в 2026 году.",
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
    seoTitle: "Digital nomad ES 2026: €2 849 — RU/BY",
    seoDescription:
      "Digital nomad visa Испания 2026: порог €2 849/мес, teletrabajo, Beckham 24%, non-lucrative. Wizard, программы и новости для RU/BY/UA/KZ.",
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
    seoTitle: "Digital nomad ES 2026: €2 849 teletrabajo",
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
    path: "/ru/guides/digital-nomad-vizy-evropy-sravnenie-2026",
    guideSlug: "digital-nomad-vizy-evropy-sravnenie-2026",
    primaryQuery: "digital nomad европа 2026 сравнение",
    queries: [
      "digital nomad визы европа сравнение 2026",
      "digital nomad португалия испания италия 2026",
      "digital nomad испания vs португалия 2026",
      "куда переехать digital nomad европа 2026",
    ],
    seoTitle: "Digital Nomad визы Европы 2026 — полное сравнение",
    seoDescription:
      "Сравнение Digital Nomad 2026: PT D8, ES, IT, GR, HR, MT, HU, CY и др. Пороги, налоги, ПМЖ, матрица RU/UA/BY/KZ.",
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
    path: "/ru/guides/vnj-germaniya-2026",
    guideSlug: "vnj-germaniya-2026",
    primaryQuery: "внж германия 2026",
    queries: [
      "внж германия 2026",
      "blue card германия 2026 для россиян",
      "chancenkarte германия 2026",
      "миграция через blue card eu",
    ],
    seoTitle: "ВНЖ Германия 2026 — Blue Card, Chancenkarte, §21",
    seoDescription:
      "Все пути ВНЖ Германия 2026: Blue Card €50 700/€45 934, Chancenkarte, фриланс §21, семья, ПМЖ 21–27 мес. Для RU/BY/UA/KZ.",
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
    seoTitle: "Белорусы ВНЖ Европа 2026 — без TP",
    seoDescription:
      "ВНЖ в Европе для белорусов 2026: нет TP, подача через Польшу и Чехию. Work permit, EU Blue Card, B2B IT, D7/D8. Консульства и санкции.",
  },
  {
    path: "/ru/guides/podtverdit-dohod-dengi-dlya-vnj-esli-dohod-iz-rossii-2026",
    guideSlug: "podtverdit-dohod-dengi-dlya-vnj-esli-dohod-iz-rossii-2026",
    primaryQuery: "подтвердить доход из россии для внж 2026",
    queries: [
      "подтвердить доход из россии для внж 2026",
      "доход из россии d8 d7 португалия",
      "выписки банка для внж европа",
      "санкции доход россия внж",
    ],
    seoTitle: "Доход из РФ для D8/D7 2026 — документы",
    seoDescription:
      "Как подтвердить доход и сбережения из РФ для D8/D7 Португалия: выписки, договоры, санкции, типовые ошибки консульства. Для граждан РФ и СНГ.",
  },
  {
    path: "/ru/guides/d7-vs-digital-nomad-visa-sravnenie",
    guideSlug: "d7-vs-digital-nomad-visa-sravnenie",
    primaryQuery: "d7 vs d8 португалия 2026",
    queries: [
      "d7 vs d8 португалия 2026",
      "d7 или digital nomad португалия",
      "d7 vs digital nomad visa сравнение",
    ],
    seoTitle: "D7 vs D8 Португалия 2026 — что выбрать",
    seoDescription:
      "D7 (~€920/мес) или D8 (~€3 680/мес): чем отличаются, кому подходит каждый маршрут. Налоги, право на работу — для граждан РФ, BY, KZ в 2026.",
  },
  {
    path: "/ru/guides/portugaliya-vs-ispaniya-vnj-2026",
    guideSlug: "portugaliya-vs-ispaniya-vnj-2026",
    primaryQuery: "португалия vs испания внж 2026",
    queries: [
      "португалия vs испания внж 2026",
      "куда переехать португалия или испания 2026",
      "d8 vs digital nomad испания",
    ],
    seoTitle: "Португалия vs Испания ВНЖ 2026 — RU/BY",
    seoDescription:
      "Сравнение ВНЖ Португалии и Испании 2026: D8 €3 680 vs DNV €2 849, налоги, сроки, гражданство. Для граждан РФ, BY, UA, KZ.",
  },
  {
    path: "/ru/guides/konsulskaya-podacha-rf-by-kz-2026-yurisdiktsiya",
    guideSlug: "konsulskaya-podacha-rf-by-kz-2026-yurisdiktsiya",
    primaryQuery: "консульская подача d виза рф 2026",
    queries: [
      "консульская подача d виза рф 2026",
      "где подавать d8 португалия гражданин россии",
      "консульская юрисдикция беларусь внж",
    ],
    seoTitle: "Консульская подача RU/BY/KZ 2026 — D-виза",
    seoDescription:
      "Консульская юрисдикция для D8/D7 Португалия: где граждане РФ, Беларуси и Казахстана могут подаваться в 2026, резиденция и типовые ошибки.",
  },
  {
    path: "/ru/guides/dokumenty-dlya-pereezda-iz-rossii-2026-apostil-nesudimost",
    guideSlug: "dokumenty-dlya-pereezda-iz-rossii-2026-apostil-nesudimost",
    primaryQuery: "документы для переезда из россии 2026 апостиль",
    queries: [
      "документы для переезда из россии 2026 апостиль",
      "справка о несудимости для внж европа",
      "апостиль свидетельство о рождении внж",
    ],
    seoTitle: "Документы переезд РФ 2026 — апостиль, ВНЖ",
    seoDescription:
      "Какие документы подготовить для переезда из России в Европу: апостиль, справка о несудимости, доверенности, переводы, дети, дипломы, сроки.",
  },
  {
    path: "/ru/guides/pervye-30-dnej-v-ispanii-2026",
    guideSlug: "pervye-30-dnej-v-ispanii-2026",
    primaryQuery: "первые 30 дней в испании после прилёта чеклист",
    queries: [
      "первые 30 дней в испании после прилёта чеклист",
      "nie испания гражданин россии как получить",
      "empadronamiento tie extranjería 2026",
    ],
    seoTitle: "NIE Испания 2026 — 30 дней для RU/BY",
    seoDescription:
      "NIE, empadronamiento, банк, SIM и extranjería после прилёта: пошаговый чек-лист для граждан RU/BY/UA/KZ с DNV в 2026 году.",
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
      "ВНЖ Черногория 2026: nomad €1800 — до октября 2026; DOO после 17.01.2026 дороже. Безвиз РФ до 31.10.2026, с 01.11 — виза.",
  },
  {
    path: "/ru/guides/gruziya-dlya-rossiyan-2026",
    guideSlug: "gruziya-dlya-rossiyan-2026",
    primaryQuery: "соглашение об избежании двойного налогообложения россия грузия 2026",
    queries: [
      "соглашение об избежании двойного налогообложения россия грузия 2026",
      "грузия для россиян 2026",
      "сидн россия грузия действует",
      "медстраховка грузия 2026",
      "work permit грузия 2026",
      "внж грузия недвижимость 150000",
      "it residence permit грузия",
    ],
    seoTitle: "Грузия для россиян 2026 — ВНЖ $150k, IT permit, СИДН",
    seoDescription:
      "Грузия 2026: медстраховка на въезд, work permit с 1.03, ВНЖ по недвижимости от $150 000, IT Residence Permit $25k/год. СИДН с РФ не действует.",
  },

  // —— Spanish LATAM corridor (/es) ——
  {
    path: "/es",
    primaryQuery: "residencia España latinoamericanos 2026",
    queries: [
      "residencia España latinoamericanos 2026",
      "emigrar a España desde Latinoamérica 2026",
      "nacionalidad española 2 años iberoamericanos",
      "nómada digital España LATAM 2026",
    ],
    seoTitle: "LATAM → España y Portugal 2026 — Emigro",
    seoDescription:
      "Residencia para hispanohablantes LATAM: UY/EC/PE/PY/CO → España y Portugal. Evaluador, pilares y nacionalidad española ~2 años (art. 22).",
  },
  {
    path: "/es/guides/residencia-espana-desde-colombia-2026",
    guideSlug: "residencia-espana-desde-colombia-2026",
    primaryQuery: "residencia en España para colombianos 2026",
    queries: [
      "residencia en España para colombianos 2026",
      "visa nómada digital España colombianos",
      "nacionalidad española colombianos 2 años",
      "emigrar a España desde Colombia requisitos",
    ],
    seoTitle: "Residencia España colombianos 2026 — 2 años",
    seoDescription:
      "Colombianos en España 2026: Schengen ≠ residencia. Nómada digital (~€2.849), no lucrativa, Bogotá/BLS y nacionalidad en 2 años (art. 22).",
  },
  {
    path: "/es/guides/residencia-espana-desde-uruguay-2026",
    guideSlug: "residencia-espana-desde-uruguay-2026",
    primaryQuery: "residencia en España para uruguayos 2026",
    queries: [
      "residencia en España para uruguayos 2026",
      "emigrar a España desde Uruguay",
      "visa nómada digital España uruguayos",
    ],
    seoTitle: "Residencia España Uruguay 2026 — rutas UY",
    seoDescription:
      "Uruguayos en España 2026: Schengen corto ≠ residencia. Nómada digital, no lucrativa y nacionalidad en 2 años (art. 22).",
  },
  {
    path: "/es/guides/residencia-espana-desde-ecuador-2026",
    guideSlug: "residencia-espana-desde-ecuador-2026",
    primaryQuery: "residencia en España para ecuatorianos 2026",
    queries: [
      "residencia en España para ecuatorianos 2026",
      "visado Schengen Ecuador España residencia",
      "nómada digital España ecuatorianos",
    ],
    seoTitle: "Residencia España Ecuador 2026 — Schengen",
    seoDescription:
      "Ecuatorianos en España 2026: visado Schengen vs residencia. Nómada digital, no lucrativa y nacionalidad en 2 años (art. 22).",
  },
  {
    path: "/es/guides/residencia-espana-desde-peru-2026",
    guideSlug: "residencia-espana-desde-peru-2026",
    primaryQuery: "residencia en España para peruanos 2026",
    queries: [
      "residencia en España para peruanos 2026",
      "emigrar a España desde Perú requisitos",
      "nacionalidad española peruanos 2 años",
    ],
    seoTitle: "Residencia España peruanos 2026 — 2 años",
    seoDescription:
      "Cómo emigrar a España desde Perú 2026: Schengen ≠ residencia. Nómada (~€2.849), no lucrativa, Lima y nacionalidad en 2 años (art. 22).",
  },
  {
    path: "/es/guides/residencia-espana-desde-paraguay-2026",
    guideSlug: "residencia-espana-desde-paraguay-2026",
    primaryQuery: "residencia en España para paraguayos 2026",
    queries: [
      "residencia en España para paraguayos 2026",
      "emigrar a España desde Paraguay",
      "visa nómada digital España paraguayos",
    ],
    seoTitle: "Residencia España Paraguay 2026 — rutas PY",
    seoDescription:
      "Paraguayos en España 2026: Schengen ≠ residencia. Nómada digital, no lucrativa y nacionalidad en 2 años (art. 22).",
  },
  {
    path: "/es/guides/visa-nomada-digital-espana-latam-2026",
    guideSlug: "visa-nomada-digital-espana-latam-2026",
    primaryQuery: "visa nómada digital España 2026 requisitos LATAM",
    queries: [
      "visa nómada digital España 2026 requisitos",
      "nómada digital España 2849 euros",
      "UGE nómada digital España desde turista",
      "teletrabajo España latinoamericanos",
    ],
    seoTitle: "Nómada digital España LATAM 2026 — €2.849",
    seoDescription:
      "Teletrabajo España 2026 para LATAM: ~€2.849/mes (200% SMI), UGE vs consulado, ≤20% clientes ES y cómputo a nacionalidad en 2 años.",
  },
  {
    path: "/es/guides/visado-no-lucrativa-espana-latam-2026",
    guideSlug: "visado-no-lucrativa-espana-latam-2026",
    primaryQuery: "residencia no lucrativa España 2026 requisitos",
    queries: [
      "residencia no lucrativa España 2026 requisitos",
      "no lucrativa España IPREM 400%",
      "visado no lucrativa Latinoamérica",
    ],
    seoTitle: "No lucrativa España 2026 — IPREM LATAM",
    seoDescription:
      "No lucrativa España 2026 para LATAM: ~€2.400/mes (400% IPREM), consulado primero, familia y camino a nacionalidad en 2 años.",
  },
  {
    path: "/es/guides/nacionalidad-espanola-latam-2026",
    guideSlug: "nacionalidad-espanola-latam-2026",
    primaryQuery: "nacionalidad española 2 años latinoamericanos",
    queries: [
      "nacionalidad española 2 años latinoamericanos",
      "nacionalidad española art 22 iberoamericanos",
      "CCSE DELE nacionalidad española LATAM",
      "nacionalidad española colombianos venezolanos mexicanos",
    ],
    seoTitle: "Nacionalidad española LATAM: 2 años art. 22",
    seoDescription:
      "Nacionalidad por residencia 2026: 2 años para iberoamericanos (art. 22), CCSE, DELE, ausencias y dualidad. Fuentes Justicia — no automática.",
  },
  {
    path: "/es/guides/portugal-d8-d7-latam-2026",
    guideSlug: "portugal-d8-d7-latam-2026",
    primaryQuery: "Portugal D8 D7 latinoamericanos 2026",
    queries: [
      "Portugal D8 D7 latinoamericanos 2026",
      "nómada digital Portugal D8 LATAM",
      "D7 Portugal rentista latinoamericanos",
      "Portugal vs España nacionalidad años",
    ],
    seoTitle: "Portugal D8/D7 LATAM 2026 vs España 2 años",
    seoDescription:
      "D8 (~€3.680) y D7 (~€920) para LATAM 2026: AIMA, familia. Nacionalidad PT 7/10 años vs España art. 22 (~2 años).",
  },
  {
    path: "/es/wizard",
    primaryQuery: "evaluador residencia España Portugal LATAM",
    queries: [
      "evaluador residencia España Portugal LATAM",
      "comparar nómada digital España Portugal",
      "ruta residencia España desde Colombia Uruguay",
    ],
    seoTitle: "Evaluador LATAM → España y Portugal",
    seoDescription:
      "Compare rutas de residencia ES/PT con pasaporte UY/EC/PE/PY/CO: ingresos, familia y horizonte de nacionalidad.",
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
