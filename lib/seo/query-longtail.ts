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
      "d7 пассивный доход португалия порог",
      "nif aima activobank португалия",
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
      "сравнение дн виз ес пороги 2026",
      "лучшая digital nomad виза европа для россиян",
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
      "oswiadczenie польша белорусы",
      "type a польша vs oświadczenie",
      "mazowieckie очередь внж 2026",
      "edoręczenia польша иностранец",
      "банк после 19 пакета белорусы ес",
    ],
    seoTitle: "Белорусы ВНЖ Европа 2026 — без TP",
    seoDescription:
      "ВНЖ в Европе для белорусов 2026: нет TP, Польша oświadczenie/Type A, Mazowieckie, eDoręczenia, банки после 19 пакета. D7/D8/Blue Card.",
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
      "виза бали россияне 2026",
      "second home индонезия vs e33g",
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
      "черногория безвиз россияне 2026",
      "doo черногория после января 2026",
      "черногория хаб перед шенгеном",
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
  // —— Top discovery (search+LLM) ——
  {
    path: "/ru/guides/bank-i-iban-dlya-rossiyan-v-evrope-2026",
    guideSlug: "bank-i-iban-dlya-rossiyan-v-evrope-2026",
    primaryQuery: "банк iban для россиян в европе 2026",
    queries: [
      "банк iban для россиян в европе 2026",
      "wise для россиян 2026 внж",
      "открыть счёт в европе с паспортом рф",
      "revolut блокировка россиян 2026",
      "paysera россияне внж",
      "19 пакет санкций wise карта",
      "n26 для россиян с внж",
      "activo bank португалия россияне",
    ],
    seoTitle: "Банк и IBAN для россиян в ЕС 2026 — после 19 пакета",
    seoDescription:
      "После 19-го пакета Wise/Revolut/Paysera требуют ВНЖ или гражданство EEA/CH. Дерево по статусу, карта ≠ счёт, ActivoBank практика.",
  },
  {
    path: "/ru/guides/prodlenie-vnzh-portugaliya-aima-2026",
    guideSlug: "prodlenie-vnzh-portugaliya-aima-2026",
    primaryQuery: "продление внж португалия aima 2026",
    queries: [
      "продление внж португалия aima 2026",
      "portal renovacoes aima.gov.pt",
      "taxa renovação aima 2026",
      "aima продление d7 d8 сколько стоит",
      "просроченный título португалия летать",
      "agora imigrante renovação",
      "duc aima 24 часа",
    ],
    seoTitle: "Продление ВНЖ Португалия 2026 — AIMA renovação",
    seoDescription:
      "Renovação AIMA: portal до 31.10.2026, DUC 24ч, taxas ~€440 (€133+€307). Agora vs services.aima, caducado и TIMATIC.",
  },
  {
    path: "/ru/guides/kazahstantsy-v-evropu-vnj-2026",
    guideSlug: "kazahstantsy-v-evropu-vnj-2026",
    primaryQuery: "казахстанцы внж европа 2026",
    queries: [
      "казахстанцы внж европа 2026",
      "казахстан шенген виза 2026",
      "blue card германия из алматы",
      "d8 португалия казахстан москва",
      "внж польша гражданин казахстана",
      "facilitation казахстан ес 2026",
      "национальная виза pt из казахстана",
    ],
    seoTitle: "Казахстан → Европа 2026 — виза и ВНЖ",
    seoDescription:
      "KZ→EU: безвиза нет. DE/PL из Алматы; PT D только Москва. Blue Card / D8 / DNV пороги 2026.",
  },
  {
    path: "/ru/guides/vnj-serbiya-dlya-rossiyan-2026",
    guideSlug: "vnj-serbiya-dlya-rossiyan-2026",
    primaryQuery: "сербия внж для россиян 2026",
    queries: [
      "сербия внж для россиян 2026",
      "сербия безвиз 30 дней россияне",
      "ип паушал сербия 2026",
      "doo сербия внж",
      "estranci unified permit сербия",
      "пмж сербия 3 года",
      "white card сербия банк",
    ],
    seoTitle: "Сербия для россиян 2026 — ВНЖ, DOO, паушал",
    seoDescription:
      "Сербия хаб: безвиз 30 дней, eStranci, DOO/ИП-паушал, ПМЖ 3 года. Не Шенген — консульства EU из Белграда.",
  },
  {
    path: "/ru/netherlands",
    primaryQuery: "highly skilled migrant нидерланды 2026",
    queries: [
      "highly skilled migrant нидерланды 2026",
      "hsm нидерланды порог зарплаты 2026",
      "kennismigrant ind 2 недели",
      "внж нидерланды через работу офер",
      "erkend referent нидерланды",
      "30% ruling нидерланды 2026",
    ],
    seoTitle: "Нидерланды HSM 2026 — коридор Emigro",
    seoDescription:
      "Highly Skilled Migrant NL: пороги IND 2026, erkend referent, офер обязателен. Wizard и программы для RU/BY/UA/KZ.",
  },
  {
    path: "/ru/emigro-score",
    primaryQuery: "emigro score рейтинг стран релокация",
    queries: [
      "emigro score рейтинг стран релокация",
      "рейтинг стран для релокантов с паспортом рф",
      "emigro score методология",
      "сравнение стран въезд статус банки налоги",
      "куда легче переехать россиянину 2026 score",
    ],
    seoTitle: "Emigro Score — методология /100",
    seoDescription:
      "Как Emigro считает Score /100: въезд, статус, банки, налоги, перспектива; база паспорт РФ; таблица стран 2026.",
  },
  {
    path: "/ru/guides/kuda-pereehat-iz-rossii-2026-evropa-vnj",
    guideSlug: "kuda-pereehat-iz-rossii-2026-evropa-vnj",
    primaryQuery: "куда переехать из россии в европу 2026",
    queries: [
      "куда переехать из россии в европу 2026",
      "куда уехать из россии легально внж",
      "сравнение стран внж европа для россиян",
      "лучшие страны для релокации 2026 рф",
      "легальный переезд в ес с паспортом россии",
    ],
    seoTitle: "Куда переехать из России 2026 — ВНЖ Европа",
    seoDescription:
      "Pillar: куда легально переехать из РФ в Европу 2026 — коридоры, пороги, хабы, wizard.",
  },
  // —— Extra corridors & guides (AEO density parity) ——
  {
    path: "/ru/wizard",
    primaryQuery: "подбор внж европа wizard",
    queries: [
      "подбор внж европа wizard",
      "какой внж подходит россиянину 2026",
      "калькулятор внж европа",
      "emigro wizard маршрут",
      "подобрать страну для внж без выбора заранее",
    ],
    seoTitle: "Wizard Emigro — подбор ВНЖ",
    seoDescription:
      "Глобальный wizard Emigro: подбор маршрута ВНЖ по паспорту, доходу и цели без заранее выбранной страны.",
  },
  {
    path: "/ru/assist",
    primaryQuery: "route check emigro assist",
    queries: [
      "route check emigro assist",
      "проверка маршрута внж консультация",
      "emigro assist сколько стоит",
      "помощь с документами внж европа",
    ],
    seoTitle: "Emigro Assist — Route Check",
    seoDescription:
      "Route Check / Assist Emigro: проверка маршрута ВНЖ (€129) + почасовая помощь. Не юридическая фирма.",
  },
  {
    path: "/ru/poland",
    primaryQuery: "внж польша для россиян 2026",
    queries: [
      "внж польша для россиян 2026",
      "work permit польша 2026",
      "blue card польша порог",
      "b2b it польша иностранец",
      "освядчение польша россияне",
    ],
    seoTitle: "Польша ВНЖ 2026 — work / Blue Card / B2B",
    seoDescription:
      "Коридор Польша: work permit, EU Blue Card, B2B IT, oświadczenie. Практика для RU/BY/UA/KZ 2026.",
  },
  {
    path: "/ru/guides/vnj-polsha-2026",
    guideSlug: "vnj-polsha-2026",
    primaryQuery: "внж польша 2026 россияне белорусы",
    queries: [
      "внж польша 2026 россияне белорусы",
      "карта побыту польша сроки",
      "тип а work permit польша",
      "польша it b2b внж",
      "очередь urzędu mazowieckie",
    ],
    seoTitle: "ВНЖ Польша 2026 — гайд Emigro",
    seoDescription:
      "Польша 2026: Type A, oświadczenie, Blue Card, карта побыту, очереди Mazowieckie. Для RU/BY/UA/KZ.",
  },
  {
    path: "/ru/italy",
    primaryQuery: "внж италия digital nomad 2026",
    queries: [
      "внж италия digital nomad 2026",
      "elective residency италия",
      "italy digital nomad visa порог",
      "lavoro subordinato италия россияне",
    ],
    seoTitle: "Италия ВНЖ 2026 — DN / elective",
    seoDescription:
      "Коридор Италия: digital nomad, elective residency, lavoro. Пороги и консульская практика 2026.",
  },
  {
    path: "/ru/guides/vnj-italiya-2026-digital-nomad",
    guideSlug: "vnj-italiya-2026-digital-nomad",
    primaryQuery: "италия digital nomad visa 2026",
    queries: [
      "италия digital nomad visa 2026",
      "digital nomad италия доход порог",
      "visto digitale nomade italia",
      "внж италия удалённая работа",
      "италия дн виза из россии",
    ],
    seoTitle: "Италия Digital Nomad 2026",
    seoDescription:
      "Italian Digital Nomad Visa 2026: порог дохода, документы, консульство. Для паспортов RU/BY/UA/KZ.",
  },
  {
    path: "/ru/guides/vnj-italiya-2026-elective-residency",
    guideSlug: "vnj-italiya-2026-elective-residency",
    primaryQuery: "elective residency италия 2026",
    queries: [
      "elective residency италия 2026",
      "residenza elettiva италия доход",
      "италия внж без работы пассивный доход",
      "visto residenza elettiva россияне",
    ],
    seoTitle: "Италия Elective Residency 2026",
    seoDescription:
      "Residenza elettiva Италия 2026: пассивный доход, жильё, без работы в IT. Практика для RU/BY.",
  },
  {
    path: "/ru/france",
    primaryQuery: "passeport talent франция 2026",
    queries: [
      "passeport talent франция 2026",
      "внж франция для россиян 2026",
      "vls-ts франция национальная виза",
      "talent passport salary threshold",
    ],
    seoTitle: "Франция ВНЖ 2026 — Passeport Talent",
    seoDescription:
      "Коридор Франция: Passeport Talent, VLS-TS, пороги 2026. Для RU/BY/UA/KZ — wizard и гайды.",
  },
  {
    path: "/ru/guides/vnj-frantsiya-2026-passeport-talent",
    guideSlug: "vnj-frantsiya-2026-passeport-talent",
    primaryQuery: "passeport talent франция порог зарплаты 2026",
    queries: [
      "passeport talent франция порог зарплаты 2026",
      "talent passport france россияне",
      "внж франция через работу офер",
      "carte de séjour talent salarié",
    ],
    seoTitle: "Passeport Talent Франция 2026",
    seoDescription:
      "Passeport Talent / salarié qualifié Франция 2026: зарплата, офер, VLS-TS. Гайд Emigro.",
  },
  {
    path: "/ru/guides/vnj-niderlandy-2026-highly-skilled",
    guideSlug: "vnj-niderlandy-2026-highly-skilled",
    primaryQuery: "внж нидерланды highly skilled migrant гайд",
    queries: [
      "внж нидерланды highly skilled migrant гайд",
      "hsm ind зарплата 2026 under 30",
      "kennismigrant через агентство",
      "нидерланды внж без офера невозможно",
    ],
    seoTitle: "Нидерланды HSM 2026 — гайд",
    seoDescription:
      "Highly Skilled Migrant NL: erkend referent, пороги IND, 30% ruling. Офер обязателен.",
  },
  {
    path: "/ru/greece",
    primaryQuery: "digital nomad греция 2026",
    queries: [
      "digital nomad греция 2026",
      "fip греция financially independent",
      "golden visa греция 2026 порог",
      "внж греция для россиян",
    ],
    seoTitle: "Греция ВНЖ 2026 — DN / FIP / GV",
    seoDescription:
      "Коридор Греция: Digital Nomad, FIP, Golden Visa. Пороги и практика 2026 для RU/BY/UA/KZ.",
  },
  {
    path: "/ru/guides/vnj-gretsiya-2026-digital-nomad-fip-golden-visa",
    guideSlug: "vnj-gretsiya-2026-digital-nomad-fip-golden-visa",
    primaryQuery: "внж греция digital nomad fip 2026",
    queries: [
      "внж греция digital nomad fip 2026",
      "греция дн виза доход",
      "financially independent person греция",
      "golden visa афины порог недвижимости",
    ],
    seoTitle: "Греция DN / FIP / Golden Visa 2026",
    seoDescription:
      "Греция 2026: Digital Nomad, FIP, Golden Visa — пороги, документы, консульство для RU/BY.",
  },
  {
    path: "/ru/hungary",
    primaryQuery: "white card венгрия 2026",
    queries: [
      "white card венгрия 2026",
      "guest investor венгрия",
      "внж венгрия digital nomad",
      "венгрия white card порог",
    ],
    seoTitle: "Венгрия White Card 2026",
    seoDescription:
      "Коридор Венгрия: White Card, Guest Investor. Пороги 2026 для паспортов RU/BY/UA/KZ.",
  },
  {
    path: "/ru/guides/vnj-vengriya-2026-white-card-guest-investor",
    guideSlug: "vnj-vengriya-2026-white-card-guest-investor",
    primaryQuery: "венгрия white card для россиян",
    queries: [
      "венгрия white card для россиян",
      "hungary white card income 2026",
      "guest investor program hungary",
      "внж венгрия удалёнка",
    ],
    seoTitle: "Венгрия White Card / Guest Investor 2026",
    seoDescription:
      "White Card и Guest Investor Венгрия 2026: доход, инвестиции, документы. Гайд Emigro.",
  },
  {
    path: "/ru/cyprus",
    primaryQuery: "digital nomad кипр 2026",
    queries: [
      "digital nomad кипр 2026",
      "fip кипр category f",
      "non-dom кипр налоги",
      "внж кипр для россиян",
    ],
    seoTitle: "Кипр ВНЖ 2026 — DN / FIP / Non-Dom",
    seoDescription:
      "Коридор Кипр: Digital Nomad, Category F, Non-Dom. Практика 2026 для RU/BY/UA/KZ.",
  },
  {
    path: "/ru/guides/vnj-kipr-2026-digital-nomad-fip-non-dom",
    guideSlug: "vnj-kipr-2026-digital-nomad-fip-non-dom",
    primaryQuery: "кипр digital nomad visa порог 2026",
    queries: [
      "кипр digital nomad visa порог 2026",
      "category f кипр financially independent",
      "non dom cyprus 17 years",
      "внж кипр удалённая работа",
    ],
    seoTitle: "Кипр DN / FIP / Non-Dom 2026",
    seoDescription:
      "Кипр 2026: Digital Nomad, FIP/Category F, Non-Dom — пороги и налоговая рамка.",
  },
  {
    path: "/ru/malta",
    primaryQuery: "nomad residence malta 2026",
    queries: [
      "nomad residence malta 2026",
      "mprp мальта",
      "non-dom мальта налоги",
      "внж мальта для россиян",
    ],
    seoTitle: "Мальта ВНЖ 2026 — Nomad / MPRP",
    seoDescription:
      "Коридор Мальта: Nomad Residence, MPRP, Non-Dom. Пороги 2026 для RU/BY/UA/KZ.",
  },
  {
    path: "/ru/guides/vnj-malta-2026-nomad-mprp-non-dom",
    guideSlug: "vnj-malta-2026-nomad-mprp-non-dom",
    primaryQuery: "мальта nomad residence permit 2026",
    queries: [
      "мальта nomad residence permit 2026",
      "malta nomad income requirement",
      "mprp malta investment",
      "внж мальта digital nomad",
    ],
    seoTitle: "Мальта Nomad / MPRP / Non-Dom 2026",
    seoDescription:
      "Мальта 2026: Nomad Residence, MPRP, Non-Dom — доход, инвестиции, документы.",
  },
  {
    path: "/ru/croatia",
    primaryQuery: "digital nomad хорватия 2026",
    queries: [
      "digital nomad хорватия 2026",
      "внж хорватия удалёнка",
      "croatia digital nomad visa порог",
    ],
    seoTitle: "Хорватия Digital Nomad 2026",
    seoDescription:
      "Коридор Хорватия: Digital Nomad (временный). Пороги и практика для RU/BY 2026.",
  },
  {
    path: "/ru/guides/vnj-horvatiya-2026-digital-nomad",
    guideSlug: "vnj-horvatiya-2026-digital-nomad",
    primaryQuery: "хорватия digital nomad visa 2026",
    queries: [
      "хорватия digital nomad visa 2026",
      "digital nomad croatia income",
      "внж хорватия 18 месяцев",
      "хорватия дн для россиян",
    ],
    seoTitle: "Хорватия Digital Nomad 2026 — гайд",
    seoDescription:
      "Croatia Digital Nomad 2026: срок, доход, документы. Не путь к ПМЖ — честно в гайде Emigro.",
  },
  {
    path: "/ru/bulgaria",
    primaryQuery: "digital nomad болгария 2026",
    queries: [
      "digital nomad болгария 2026",
      "eood болгария внж",
      "type d болгария виза",
      "внж болгария для россиян",
    ],
    seoTitle: "Болгария ВНЖ 2026 — DN / EOOD",
    seoDescription:
      "Коридор Болгария: Type D, Digital Nomad, EOOD. Практика 2026 для RU/BY/UA/KZ.",
  },
  {
    path: "/ru/guides/vnj-bolgariya-2026-type-d-digital-nomad-eood",
    guideSlug: "vnj-bolgariya-2026-type-d-digital-nomad-eood",
    primaryQuery: "болгария digital nomad eood 2026",
    queries: [
      "болгария digital nomad eood 2026",
      "type d bulgaria residence",
      "открыть eood болгария россияне",
      "внж болгария удалённая работа",
    ],
    seoTitle: "Болгария Type D / DN / EOOD 2026",
    seoDescription:
      "Болгария 2026: Type D, Digital Nomad, EOOD — пороги, компания, документы.",
  },
  {
    path: "/ru/czechia",
    primaryQuery: "внж чехия 2026 россияне",
    queries: [
      "внж чехия 2026 россияне",
      "employee card чехия",
      "živnost чехия ит",
      "blue card чехия порог",
    ],
    seoTitle: "Чехия ВНЖ 2026 — Employee Card / živnost",
    seoDescription:
      "Коридор Чехия: Employee Card, EU Blue Card, živnost IT. Для RU/BY/UA/KZ 2026.",
  },
  {
    path: "/ru/guides/vnj-chehiya-2026",
    guideSlug: "vnj-chehiya-2026",
    primaryQuery: "чехия employee card 2026",
    queries: [
      "чехия employee card 2026",
      "внж чехия через работу",
      "živnostenský list иностранец",
      "чехия blue card зарплата",
    ],
    seoTitle: "ВНЖ Чехия 2026 — гайд",
    seoDescription:
      "Чехия 2026: Employee Card, Blue Card, živnost — документы и консульская практика.",
  },
  {
    path: "/ru/austria",
    primaryQuery: "rwr card австрия 2026",
    queries: [
      "rwr card австрия 2026",
      "внж австрия для россиян",
      "eu blue card австрия",
      "red white red card points",
    ],
    seoTitle: "Австрия RWR Card 2026",
    seoDescription:
      "Коридор Австрия: RWR Card, EU Blue Card, самозанятость. Пороги 2026.",
  },
  {
    path: "/ru/guides/vnj-austria-2026",
    guideSlug: "vnj-austria-2026",
    primaryQuery: "австрия внж red-white-red card",
    queries: [
      "австрия внж red-white-red card",
      "rwr card points calculator",
      "австрия blue card порог",
      "внж австрия без работы сложно",
    ],
    seoTitle: "ВНЖ Австрия 2026 — RWR / Blue Card",
    seoDescription:
      "Австрия 2026: RWR Card (баллы), Blue Card — гайд Emigro для RU/BY/UA/KZ.",
  },
  {
    path: "/ru/guides/investitsionnyy-vnj-evropa-golden-visa-2026",
    guideSlug: "investitsionnyy-vnj-evropa-golden-visa-2026",
    primaryQuery: "golden visa европа 2026 сравнение",
    queries: [
      "golden visa европа 2026 сравнение",
      "инвестиционный внж португалия греция",
      "golden visa пороги 2026",
      "где купить внж за инвестиции ес",
    ],
    seoTitle: "Golden Visa Европа 2026 — сравнение",
    seoDescription:
      "Инвестиционный ВНЖ ЕС 2026: Греция, Кипр, Мальта, Венгрия… Португалия ARI закрыт по недвижимости.",
  },
  {
    path: "/ru/guides/grazhdanstvo-portugaliya-ispaniya-2026",
    guideSlug: "grazhdanstvo-portugaliya-ispaniya-2026",
    primaryQuery: "гражданство португалия сроки 2026",
    queries: [
      "гражданство португалия сроки 2026",
      "гражданство испания 10 лет",
      "натурализация после внж pt es",
      "язык a2 ciple португалия",
    ],
    seoTitle: "Гражданство PT / ES 2026",
    seoDescription:
      "Путь к гражданству Португалии и Испании после ВНЖ: сроки, язык, оговорки 2026.",
  },
  {
    path: "/ru/guides/shengen-turist-vs-vnzh-2026",
    guideSlug: "shengen-turist-vs-vnzh-2026",
    primaryQuery: "шенген турист vs внж 2026",
    queries: [
      "шенген турист vs внж 2026",
      "можно ли жить в европе по шенгену",
      "90/180 правило шенген",
      "туристическая виза не даёт работу ес",
    ],
    seoTitle: "Шенген vs ВНЖ 2026",
    seoDescription:
      "Почему шенген-турист ≠ ВНЖ: 90/180, работа, банки, консульский риск. Emigro 2026.",
  },
  {
    path: "/ru/guides/kuda-uehat-iz-rossii-srochno-2026-evropa-bezviz-haby",
    guideSlug: "kuda-uehat-iz-rossii-srochno-2026-evropa-bezviz-haby",
    primaryQuery: "куда уехать из россии срочно 2026",
    queries: [
      "куда уехать из россии срочно 2026",
      "безвиз для россиян хабы 2026",
      "срочный выезд сербия грузия армения",
      "легализация после выезда из рф",
    ],
    seoTitle: "Срочный выезд из РФ 2026 — хабы",
    seoDescription:
      "Срочный выезд: безвизовые хабы, затем легализация в EU. Не обход санкций — честный маршрут.",
  },
  {
    path: "/ru/guides/vnj-bez-raboty-passivnyy-dohod-sberezheniya-2026",
    guideSlug: "vnj-bez-raboty-passivnyy-dohod-sberezheniya-2026",
    primaryQuery: "внж европа без работы пассивный доход",
    queries: [
      "внж европа без работы пассивный доход",
      "d7 non-lucrative fip сравнение",
      "внж на сбережениях европа 2026",
      "пассивный доход для внж пороги",
    ],
    seoTitle: "ВНЖ без работы 2026 — пассивный доход",
    seoDescription:
      "D7, non-lucrative, FIP, elective: ВНЖ на пассиве/сбережениях. Сравнение порогов 2026.",
  },
  {
    path: "/ru/serbia",
    primaryQuery: "сербия хаб релокация 2026",
    queries: [
      "сербия хаб релокация 2026",
      "переехать в сербию из россии",
      "сербия консульства ес белград",
      "транзитный хаб сербия перед внж",
    ],
    seoTitle: "Сербия — транзитный хаб Emigro",
    seoDescription:
      "Сербия как хаб: безвиз, DOO, консульства EU. Не Шенген — мост к ВНЖ.",
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
      "visado no lucrativa España latinoamericanos",
      "residencia España vs Portugal LATAM",
      "art 22 codigo civil nacionalidad española",
    ],
    seoTitle: "LATAM → España y Portugal 2026 — Emigro",
    seoDescription:
      "Residencia para hispanohablantes LATAM: UY/EC/PE/PY/CO/CL → España y Portugal. Evaluador, pilares y nacionalidad española ~2 años (art. 22).",
  },
  {
    path: "/es/wizard",
    primaryQuery: "evaluador residencia España Portugal LATAM",
    queries: [
      "evaluador residencia España Portugal LATAM",
      "comparar nómada digital España Portugal",
      "ruta residencia España desde Colombia Uruguay Chile",
      "qué visa me conviene España LATAM",
      "wizard emigro residencia española",
      "comparar no lucrativa vs nómada digital",
    ],
    seoTitle: "Evaluador LATAM → España y Portugal",
    seoDescription:
      "Compare rutas de residencia ES/PT con pasaporte UY/EC/PE/PY/CO/CL: ingresos, familia y horizonte de nacionalidad.",
  },
  {
    path: "/es/assist",
    primaryQuery: "consulta residencia España Emigro assist",
    queries: [
      "consulta residencia España Emigro assist",
      "route check residencia LATAM España",
      "ayuda documentos visa España latinoamericanos",
      "revisión ruta nómada digital España",
    ],
    seoTitle: "Emigro Assist ES — Route Check",
    seoDescription:
      "Route Check / Assist en español: revisión de ruta de residencia ES/PT. No es un despacho de abogados.",
  },
  {
    path: "/es/spain",
    primaryQuery: "hub España residencia LATAM 2026",
    queries: [
      "hub España residencia LATAM 2026",
      "España destino residencia latinoamericanos",
      "programas residencia España Emigro",
      "nómada digital y no lucrativa España hub",
    ],
    seoTitle: "España — hub destino LATAM",
    seoDescription:
      "Hub España para LATAM: nómada digital, no lucrativa, nacionalidad art. 22. Enlace a guías y wizard.",
  },
  {
    path: "/es/portugal",
    primaryQuery: "Portugal D8 D7 latinoamericanos 2026",
    queries: [
      "Portugal D8 D7 latinoamericanos 2026",
      "alternativa Portugal vs España residencia",
      "digital nomad Portugal LATAM umbral",
      "D7 Portugal pasaporte colombiano chileno",
    ],
    seoTitle: "Portugal — hub destino LATAM",
    seoDescription:
      "Hub Portugal LATAM: D8 ~€3.680 / D7 ~€920 vs horizonte nacionalidad España art. 22.",
  },
  {
    path: "/es/uruguay",
    primaryQuery: "Uruguay a España residencia 2026",
    queries: [
      "Uruguay a España residencia 2026",
      "emigrar a España desde Uruguay requisitos",
      "visa nómada digital España uruguayos",
      "nacionalidad española uruguayos 2 años",
      "hub Uruguay Emigro España",
    ],
    seoTitle: "Uruguay → España 2026",
    seoDescription:
      "Hub Uruguay→España: Schengen corto ≠ residencia, nómada, no lucrativa, nacionalidad ~2 años.",
  },
  {
    path: "/es/ecuador",
    primaryQuery: "Ecuador a España residencia 2026",
    queries: [
      "Ecuador a España residencia 2026",
      "visado Schengen Ecuador España residencia",
      "nómada digital España ecuatorianos",
      "nacionalidad española ecuatorianos 2 años",
      "emigrar a España desde Ecuador visa",
    ],
    seoTitle: "Ecuador → España 2026",
    seoDescription:
      "Hub Ecuador→España: Schengen a menudo obligatorio; nómada/no lucrativa; nacionalidad ~2 años.",
  },
  {
    path: "/es/peru",
    primaryQuery: "Perú a España residencia 2026",
    queries: [
      "Perú a España residencia 2026",
      "emigrar a España desde Perú requisitos",
      "visa nómada digital España peruanos",
      "nacionalidad española peruanos 2 años",
      "hub Perú Emigro España",
    ],
    seoTitle: "Perú → España 2026",
    seoDescription:
      "Hub Perú→España: Schengen ≠ residencia, nómada ~€2.849, no lucrativa, nacionalidad ~2 años.",
  },
  {
    path: "/es/paraguay",
    primaryQuery: "Paraguay a España residencia 2026",
    queries: [
      "Paraguay a España residencia 2026",
      "emigrar a España desde Paraguay",
      "visa nómada digital España paraguayos",
      "nacionalidad española paraguayos 2 años",
      "hub Paraguay Emigro España",
    ],
    seoTitle: "Paraguay → España 2026",
    seoDescription:
      "Hub Paraguay→España: rutas de residencia y nacionalidad ~2 años (art. 22).",
  },
  {
    path: "/es/colombia",
    primaryQuery: "Colombia a España residencia 2026",
    queries: [
      "Colombia a España residencia 2026",
      "emigrar a España desde Colombia requisitos",
      "visa nómada digital España colombianos",
      "nacionalidad española colombianos 2 años",
      "BLS Bogotá visa nacional España",
      "hub Colombia Emigro España",
    ],
    seoTitle: "Colombia → España 2026",
    seoDescription:
      "Hub Colombia→España: nómada, no lucrativa, BLS/consulado, nacionalidad ~2 años.",
  },
  {
    path: "/es/chile",
    primaryQuery: "Chile a España residencia 2026",
    queries: [
      "Chile a España residencia 2026",
      "emigrar a España desde Chile requisitos",
      "visa nómada digital España chilenos",
      "nacionalidad española chilenos 2 años",
      "hub Chile Emigro España",
    ],
    seoTitle: "Chile → España residencia 2026",
    seoDescription:
      "Hub Chile→España: Schengen 90 días ≠ residencia, nómada digital, no lucrativa y nacionalidad en 2 años (art. 22).",
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
      "no lucrativa España colombianos umbral",
      "Schengen vs residencia Colombia España",
      "cuánto se gana para nómada digital España Colombia",
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
      "nacionalidad española uruguayos 2 años",
      "no lucrativa España uruguayos",
      "Montevideo consulado visa España",
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
      "nacionalidad española ecuatorianos 2 años",
      "no lucrativa España Ecuador",
      "visa corta Ecuador vs residencia España",
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
      "visa nómada digital España peruanos",
      "no lucrativa España Perú umbral",
      "Lima consulado residencia España",
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
      "nacionalidad española paraguayos 2 años",
      "no lucrativa España Paraguay",
      "Asunción visa nacional España",
    ],
    seoTitle: "Residencia España Paraguay 2026 — 2 años",
    seoDescription:
      "Cómo emigrar a España desde Paraguay 2026: Schengen ≠ residencia. Nómada (~€2.849), no lucrativa, Asunción y nacionalidad en 2 años (art. 22).",
  },
  {
    path: "/es/guides/residencia-espana-desde-chile-2026",
    guideSlug: "residencia-espana-desde-chile-2026",
    primaryQuery: "residencia en España para chilenos 2026",
    queries: [
      "residencia en España para chilenos 2026",
      "emigrar a España desde Chile requisitos",
      "visa nómada digital España chilenos",
      "nacionalidad española chilenos 2 años",
      "no lucrativa España Chile",
      "Santiago BLS visa España",
    ],
    seoTitle: "Residencia España chilenos 2026 — 2 años",
    seoDescription:
      "Cómo emigrar a España desde Chile 2026: Schengen ≠ residencia. Nómada (~€2.849), Santiago y nacionalidad en 2 años (art. 22).",
  },
  {
    path: "/es/guides/visa-nomada-digital-espana-latam-2026",
    guideSlug: "visa-nomada-digital-espana-latam-2026",
    primaryQuery: "visa nómada digital España 2026 umbral",
    queries: [
      "visa nómada digital España 2026 umbral",
      "teletrabajo internacional España requisitos",
      "nómada digital España 2849 euros",
      "UGE vs consulado nómada digital",
      "20% clientes españoles nómada digital",
      "visa digital nomad España LATAM 2026",
      "cuánto hay que ganar nómada digital España",
    ],
    seoTitle: "Nómada digital España 2026 — LATAM",
    seoDescription:
      "Visa nómada digital España 2026: ~€2.849/mes, UGE vs consulado, ≤20% clientes ES. Para pasaportes LATAM.",
  },
  {
    path: "/es/guides/visado-no-lucrativa-espana-latam-2026",
    guideSlug: "visado-no-lucrativa-espana-latam-2026",
    primaryQuery: "visado no lucrativa España 2026",
    queries: [
      "visado no lucrativa España 2026",
      "residencia no lucrativa umbral IPREM",
      "no lucrativa España 2400 euros",
      "turista a no lucrativa España error",
      "medios económicos no lucrativa LATAM",
      "visa no lucrativa consulado primero",
    ],
    seoTitle: "No lucrativa España 2026 — LATAM",
    seoDescription:
      "Residencia no lucrativa España 2026: ~€2.400/mes (400% IPREM). Consulado primero — no planificar turista→NL.",
  },
  {
    path: "/es/guides/nacionalidad-espanola-latam-2026",
    guideSlug: "nacionalidad-espanola-latam-2026",
    primaryQuery: "nacionalidad española 2 años latinoamericanos",
    queries: [
      "nacionalidad española 2 años latinoamericanos",
      "artículo 22 codigo civil nacionalidad",
      "CCSE DELE nacionalidad española LATAM",
      "nacionalidad española iberoamericanos requisitos",
      "estudios cuentan para nacionalidad española",
      "cuántos años para nacionalidad española colombianos",
    ],
    seoTitle: "Nacionalidad española LATAM 2026 — 2 años",
    seoDescription:
      "Nacionalidad española ~2 años (art. 22) para iberoamericanos: CCSE, DELE a menudo exento, estudios suelen no contar.",
  },
  {
    path: "/es/guides/ley-memoria-democratica-latam-2026",
    guideSlug: "ley-memoria-democratica-latam-2026",
    primaryQuery: "ley de memoria democrática nacionalidad 2026",
    queries: [
      "ley de memoria democrática nacionalidad 2026",
      "nacionalidad española por abuelos España",
      "LMD plazos y requisitos LATAM",
      "memoria democrática vs art 22 residencia",
      "quién puede pedir nacionalidad LMD 2026",
    ],
    seoTitle: "Ley Memoria Democrática 2026 — LATAM",
    seoDescription:
      "LMD / nacionalidad por ascendencia española: plazos, quién califica, vs ruta residencia art. 22.",
  },
  {
    path: "/es/guides/impuestos-beckham-espana-latam-2026",
    guideSlug: "impuestos-beckham-espana-latam-2026",
    primaryQuery: "régimen Beckham España 2026",
    queries: [
      "régimen Beckham España 2026",
      "impatriados España impuestos LATAM",
      "Beckham law España requisitos 2026",
      "impuestos nómada digital España",
      "IRNR vs residente fiscal España",
    ],
    seoTitle: "Impuestos Beckham España 2026 — LATAM",
    seoDescription:
      "Régimen de impatriados (Beckham) España 2026: quién califica, plazos, interacción con nómada digital.",
  },
  {
    path: "/es/guides/portugal-d8-d7-latam-2026",
    guideSlug: "portugal-d8-d7-latam-2026",
    primaryQuery: "Portugal D8 D7 para latinoamericanos 2026",
    queries: [
      "Portugal D8 D7 para latinoamericanos 2026",
      "D8 Portugal umbral 3680 LATAM",
      "D7 Portugal vs no lucrativa España",
      "nacionalidad Portugal vs España 2 años",
      "digital nomad Portugal colombianos chilenos",
      "cuándo elegir Portugal en vez de España",
    ],
    seoTitle: "Portugal D8/D7 LATAM 2026",
    seoDescription:
      "D8/D7 Portugal para LATAM vs España: umbrales, nacionalidad 7–10 años PT vs ~2 años ES art. 22.",
  },
  {
    path: "/es/guides/primeros-30-dias-en-espana-2026",
    guideSlug: "primeros-30-dias-en-espana-2026",
    primaryQuery: "primeros 30 días en España checklist",
    queries: [
      "primeros 30 días en España checklist",
      "NIE empadronamiento TIE extranjería",
      "abrir cuenta bancaria España extranjero",
      "cita extranjería tras llegada España",
      "seguro médico residencia España",
      "empadronamiento obligatorio España",
    ],
    seoTitle: "Primeros 30 días en España 2026",
    seoDescription:
      "Checklist post-llegada: NIE, empadronamiento, TIE, banco, SIM. Para titulares de residencia LATAM.",
  },

  // —— FR Afrique → France ——
  {
    path: "/fr",
    primaryQuery: "résidence France Maghreb 2026",
    queries: [
      "résidence France Maghreb 2026",
      "émigrer en France depuis le Maroc Algérie Tunisie",
      "VLS-TS France Afrique francophone",
      "Passeport Talent Maghreb 2026",
      "naturalisation France 5 ans Maghreb",
      "visa long séjour France Sénégal",
    ],
    seoTitle: "Afrique francophone → France 2026",
    seoDescription:
      "Hub Emigro FR: VLS-TS, Passeport Talent, naturalisation ~5 ans pour MA/DZ/TN/SN — sources officielles.",
  },
  {
    path: "/fr/wizard",
    primaryQuery: "wizard résidence France Maghreb",
    queries: [
      "wizard résidence France Maghreb",
      "quelle voie résidence France Maroc",
      "comparer Passeport Talent naturalisation France",
      "évaluateur parcours France Afrique",
      "Emigro wizard France sans pays choisi",
    ],
    seoTitle: "Wizard FR — résidence France",
    seoDescription:
      "Wizard Emigro FR: parcours VLS-TS / Talent / naturalisation pour passeports MA/DZ/TN/SN.",
  },
  {
    path: "/fr/assist",
    primaryQuery: "assist Emigro France Route Check",
    queries: [
      "assist Emigro France Route Check",
      "vérification dossier VLS-TS France",
      "consultation résidence France Maghreb",
      "aide Passeport Talent dossier",
    ],
    seoTitle: "Emigro Assist FR — Route Check",
    seoDescription:
      "Route Check / Assist FR: revue de parcours résidence France. Pas un cabinet d’avocats.",
  },
  {
    path: "/fr/france",
    primaryQuery: "hub France résidence Afrique 2026",
    queries: [
      "hub France résidence Afrique 2026",
      "France destination Maghreb Sénégal",
      "programmes résidence France Emigro",
      "VLS-TS Passeport Talent hub France",
    ],
    seoTitle: "France — hub destination FR",
    seoDescription:
      "Hub France: VLS-TS, Passeport Talent, naturalisation. Liens guides Maghreb/Sénégal.",
  },
  {
    path: "/fr/maroc",
    primaryQuery: "Maroc vers France résidence 2026",
    queries: [
      "Maroc vers France résidence 2026",
      "émigrer en France depuis le Maroc",
      "visa long séjour France Marocains",
      "Passeport Talent depuis Maroc",
      "hub Maroc Emigro France",
    ],
    seoTitle: "Maroc → France 2026",
    seoDescription:
      "Hub Maroc→France: visa court ≠ résidence, VLS-TS, Talent, naturalisation ~5 ans.",
  },
  {
    path: "/fr/algerie",
    primaryQuery: "Algérie vers France résidence 2026",
    queries: [
      "Algérie vers France résidence 2026",
      "émigrer en France depuis l’Algérie",
      "VLS-TS Algérie France",
      "Passeport Talent Algériens",
      "apostille Algérie 2026 France",
      "hub Algérie Emigro France",
    ],
    seoTitle: "Algérie → France 2026",
    seoDescription:
      "Hub Algérie→France: VLS-TS, Talent, apostille (HCCH 2026). Naturalisation ~5 ans.",
  },
  {
    path: "/fr/tunisie",
    primaryQuery: "Tunisie vers France résidence 2026",
    queries: [
      "Tunisie vers France résidence 2026",
      "émigrer en France depuis la Tunisie",
      "VLS-TS Tunisie France",
      "Passeport Talent Tunisiens",
      "hub Tunisie Emigro France",
    ],
    seoTitle: "Tunisie → France 2026",
    seoDescription:
      "Hub Tunisie→France: VLS-TS, Passeport Talent, naturalisation ~5 ans.",
  },
  {
    path: "/fr/senegal",
    primaryQuery: "Sénégal vers France résidence 2026",
    queries: [
      "Sénégal vers France résidence 2026",
      "émigrer en France depuis le Sénégal",
      "VLS-TS Sénégal France",
      "Passeport Talent Sénégalais",
      "hub Sénégal Emigro France",
    ],
    seoTitle: "Sénégal → France 2026",
    seoDescription:
      "Hub Sénégal→France: VLS-TS, Talent, naturalisation ~5 ans — sources officielles.",
  },
  {
    path: "/fr/guides/residence-france-depuis-maroc-2026",
    guideSlug: "residence-france-depuis-maroc-2026",
    primaryQuery: "résidence France Marocains 2026",
    queries: [
      "résidence France Marocains 2026",
      "visa long séjour France depuis Maroc",
      "Passeport Talent Maroc France",
      "VLS-TS Marocains démarches",
      "émigrer France depuis Casablanca Rabat",
      "consulat France Maroc résidence",
      "visa court séjour vs VLS-TS Maroc",
    ],
    seoTitle: "Résidence France Marocains 2026 — VLS-TS",
    seoDescription:
      "Émigrer en France depuis le Maroc 2026 : visa obligatoire, VLS-TS, Talent, naturalisation ~5 ans.",
  },
  {
    path: "/fr/guides/residence-france-depuis-algerie-2026",
    guideSlug: "residence-france-depuis-algerie-2026",
    primaryQuery: "résidence France Algériens 2026",
    queries: [
      "résidence France Algériens 2026",
      "VLS-TS Algérie France 2026",
      "Passeport Talent Algérie",
      "émigrer en France depuis l’Algérie démarches",
      "apostille documents Algérie France",
      "visa long séjour Algériens",
    ],
    seoTitle: "Résidence France Algériens 2026",
    seoDescription:
      "Algérie → France 2026: VLS-TS, Talent, apostille. Naturalisation ~5 ans — pas un raccourci 2 ans.",
  },
  {
    path: "/fr/guides/residence-france-depuis-tunisie-2026",
    guideSlug: "residence-france-depuis-tunisie-2026",
    primaryQuery: "résidence France Tunisiens 2026",
    queries: [
      "résidence France Tunisiens 2026",
      "VLS-TS Tunisie France",
      "Passeport Talent Tunisie",
      "émigrer en France depuis Tunis",
      "visa long séjour Tunisiens 2026",
      "consulat France Tunisie résidence",
    ],
    seoTitle: "Résidence France Tunisiens 2026",
    seoDescription:
      "Tunisie → France 2026: VLS-TS, Passeport Talent, naturalisation ~5 ans.",
  },
  {
    path: "/fr/guides/residence-france-depuis-senegal-2026",
    guideSlug: "residence-france-depuis-senegal-2026",
    primaryQuery: "résidence France Sénégalais 2026",
    queries: [
      "résidence France Sénégalais 2026",
      "VLS-TS Sénégal France",
      "Passeport Talent Sénégal",
      "émigrer en France depuis Dakar",
      "visa long séjour Sénégalais 2026",
      "consulat France Sénégal résidence",
    ],
    seoTitle: "Résidence France Sénégalais 2026",
    seoDescription:
      "Sénégal → France 2026: VLS-TS, Talent, naturalisation ~5 ans — sources service-public.",
  },
  {
    path: "/fr/guides/residence-france-afrique-francophone-2026",
    guideSlug: "residence-france-afrique-francophone-2026",
    primaryQuery: "résidence France Afrique francophone 2026",
    queries: [
      "résidence France Afrique francophone 2026",
      "comparer Maghreb Sénégal résidence France",
      "VLS-TS Afrique francophone guide",
      "quelle voie résidence France MA DZ TN SN",
      "émigrer France depuis Afrique francophone",
    ],
    seoTitle: "Résidence France Afrique francophone 2026",
    seoDescription:
      "Pilier: résidence France pour MA/DZ/TN/SN — VLS-TS, Talent, naturalisation. Matrice origines.",
  },
  {
    path: "/fr/guides/passeport-talent-france-afrique-2026",
    guideSlug: "passeport-talent-france-afrique-2026",
    primaryQuery: "Passeport Talent France salaire 2026",
    queries: [
      "Passeport Talent France salaire 2026",
      "Passeport Talent 39582 euros",
      "titre Talent salarié qualifié France Maghreb",
      "Passeport Talent catégories 2026",
      "seuil salaire Talent France Afrique",
      "VLS-TS Passeport Talent consulat",
      "Talent passport France from Morocco Algeria",
    ],
    seoTitle: "Passeport Talent France 2026 — Afrique",
    seoDescription:
      "Passeport Talent pour Maghreb/Sénégal : seuils ~€39.582, catégories, VLS-TS — confirmez service-public.",
  },
  {
    path: "/fr/guides/naturalisation-france-afrique-2026",
    guideSlug: "naturalisation-france-afrique-2026",
    primaryQuery: "naturalisation France 5 ans Maghreb",
    queries: [
      "naturalisation France 5 ans Maghreb",
      "nationalité française après résidence Maghreb",
      "examen civique naturalisation France 2026",
      "B2 naturalisation France obligatoire",
      "timbre fiscal nationalité 255 euros",
      "naturalisation France pas 2 ans Maghreb",
      "délai naturalisation décret France 2026",
    ],
    seoTitle: "Naturalisation France 2026 — 5 ans, B2, civique",
    seoDescription:
      "Naturalisation FR 2026 : 5 ans, B2, examen civique, timbre €255. Pas un « 2 ans Maghreb ». Sources F2213 / F11926.",
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
