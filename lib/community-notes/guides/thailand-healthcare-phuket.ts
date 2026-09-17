/**
 * Hand-curated Thailand satellite — CORE health slot (Phuket 2026).
 * Official MOPH / SSO / NIEMS / NHSO separated from field practice on the island.
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import {
  formatPracticeBullet,
  formatPracticeTakeaway,
} from "@/lib/community-notes/practice-format";
import type {
  CommunityNoteFaq,
  ContentKind,
  GlossaryTerm,
  NoteBodySection,
} from "@/lib/community-notes/types";
import type { ThailandEditorialGuide } from "@/lib/community-notes/guides/thailand-editorial-index";

export const MEDITSINA_PHUKET_SLUG = "meditsina-phuket-strahovka-bolnicy-2026";

const PILLAR_SLUG = "tailand-dlya-rossiyan-2026";

const GLOSSARY_INTRO =
  "Термины SSO, UCS и 1669 — до первого dengue или мото-ДТП, пока «как в Европе по полису EHIC» не превратилось в счёт на сотни тысяч бат.";

const LOCAL_TERMS: GlossaryTerm[] = [
  { pt: "MOPH", context: "Ministry of Public Health", ru: "Минздрав Таиланда; госпитали provincial/district под его системой" },
  { pt: "SSO Section 33", context: "มาตรา 33", ru: "соцстрах наёмных работников; медицина в hospital, выбранном при регистрации" },
  { pt: "NHSO / UCS", context: "บัตรทอง", ru: "Universal Coverage Scheme — «30 baht» / Gold Card для eligible резидентов; не автоматически для туриста" },
  { pt: "1669", ru: "единый EMS NIEMS — скорая для критических случаев вне стационара (не «кашель»)" },
  { pt: "OPD / IPD", ru: "ambulatory vs inpatient — амбулаторный приём и стационар; разные тарифы и страховые лимиты" },
  { pt: "direct billing", ru: "прямой расчёт страховщика с hospital; нужен pre-authorization и список сети" },
  { pt: "TM30", ru: "уведомление о месте пребывания; не медстраховка, но влияет на легальный статус и споры с insurer" },
  { pt: "pre-existing condition", ru: "заболевание до начала полиса; частые исключения или waiting period" },
];

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(LOCAL_TERMS, GLOSSARY_INTRO),
  },
  {
    heading: "Nota Emigro (fact-check)",
    section_kind: "official",
    paragraphs: [
      "Короткая сверка формулировок по MOPH, SSO, NHSO и порталам hospital Phuket (сентябрь 2026). **OK** — официальная страница; **soft** — цены и direct billing без вашего полиса; **fixed** — типичные мифы expat-чатов.",
    ],
    bullets: [
      "OK: **1669** — Narenthorn EMS / NIEMS для критической экстренной помощи вне hospital; также **191** (полиция), **1155** (Tourist Police) — [thailand.go.th](https://www.thailand.go.th/issue-focus-detail/003_003).",
      "OK: **Vachira Phuket Hospital** (MOPH) — 353 Yaowarat Rd, Talat Yai, Mueang Phuket 83000; tel. 076-361-234; hotline **1669** на странице contact — [vachiraphuket.go.th](https://www.vachiraphuket.go.th/contact/).",
      "OK: иностранный **Section 33** — при приёме показывают **SSO card + passport** (или pink ID); employer регистрирует в **30 дней** — [sso.go.th](https://www.sso.go.th/wpr/main/general/%E0%B8%A1%E0%B8%B2%E0%B8%95%E0%B8%A3%E0%B8%B033_singleview_detail_1_190_0/437_437/?id=437&page=preview).",
      "OK: **UCS (NHSO)** — налоговая universal scheme для eligible граждан/групп; отдельная программа регистрации иностранцев **вне SSO** существует на nhso.go.th — не путать с «любой expat автоматом бесплатно».",
      "Fixed: «DTV / LTR = бесплатная госмедицина как у тайца» → без **SSO / UCS eligibility** платите cash или по **private insurance**; виза ≠ UCS.",
      "Fixed: «Patong = Bangkok Hospital Patong» → **Bangkok Hospital Phuket** (BDMS) — **2/1 Hongyok Utis, Phuket Town** (soft: филиалы сети на острове уточняйте на bangkokhospital.com перед визитом).",
      "Soft: тарифы consulta в частных hospital, франшиза expat-полисов, список direct billing для вашего insurer — только из **policy wording** и call center hospital.",
      "Soft / UNCHECKED: минимальная сумма health insurance для **DTV/LTR** на дату подачи — проверять BOI / консульский checklist, не блоги.",
    ],
  },
  {
    heading: "Официально: госбольницы MOPH, SSO и NHSO",
    section_kind: "official",
    paragraphs: [
      "Зачем читать: понять, **когда вы не «просто платите картой»**, а имеете право на госпакет — и куда вас отправит employer или SSO.",
      "Государственные hospital Phuket (Vachira, Thalang и др.) работают под **MOPH**. Для наёмных с **work permit** employer обязан зарегистрировать в **Social Security Section 33**; медуслуги — в **contract hospital**, выбранном в системе SSO, с предъявлением карты и passport.",
      "**UCS** (NHSO, «Gold Card») — отдельный универсальный маршрут для категорий, определённых законом; большинство релокантов на **DTV, Elite, туристическом stay** сами по себе в UCS **не попадают**, пока не выполнят условия регистрации (например, отдельные программы для foreign workers вне SSO — см. nhso.go.th).",
    ],
    bullets: [
      "Section 33: регистрация employer **≤30 дней** от start; документы — work permit + passport (копии) для foreign worker.",
      "Foreign insured: **SSO card + passport** (или non-Thai ID) на reception contract hospital.",
      "Section 40 / voluntary SSO — иной набор льгот; медчасть часто через NHSO или существующие права (не дублировать с Section 33 без проверки).",
      "UCS: финансируется из taxation; перечень льгот и бюджет FY2026 публикует NHSO — не обещать expat «30 baht за всё» без enrollment.",
      "Occupational injury: employer может нести treatment cost по Workers’ Compensation rules (SSO) — отдельно от «простудились в выходной».",
    ],
  },
  {
    heading: "Официально: частная медицина, полисы и визовый контур",
    section_kind: "official",
    paragraphs: [
      "Зачем читать: на Пхукете **частный сектор BDMS** (Bangkok Hospital Phuket, Bangkok Hospital Siriroj) — стандарт для expat с international insurance; гос Vachira/Thalang — backup и травма, но язык и comfort иной.",
      "Полис для **DTV/LTR/Thailand Privilege** — отдельное требование консульского/BOI track: обычно **inpatient + emergency**, territory Thailand, min coverage **soft/UNCHECKED** на дату подачи. Туристический stay 30 дней **не заменяет** annual expat policy, если вы живёте 4–6+ месяцев.",
      "Direct billing: hospital сверяет номер policy, иногда требует **deposit** до подтверждения insurer; без pre-auth плановые MRI/operation — cash first.",
    ],
    bullets: [
      "International Patient Services / Insurance desk — extension на сайтах Bangkok Hospital Phuket (076 254 425, insurance ext. в official phone list).",
      "Inpatient guarantee letter — запрашивайте до плановой госпитализации; emergency — stabilisation first, paperwork after.",
      "Travel insurance ≤90 days ≠ long-stay expat product; renewal и **continuous coverage** критичны для pre-existing disputes.",
      "Telemedicine и second opinion — часто **исключены** или лимитированы; читать Schedule.",
      "Связка со статусом: [pillar Таиланд 2026](/notes/" + PILLAR_SLUG + ") — LTR/DTV/Privilege; медполис не подменяет TM30 и visa conditions.",
    ],
  },
  {
    heading: "Экстренные номера и что сказать диспетчеру",
    section_kind: "official",
    paragraphs: [
      "Зачем читать: на мото-ДТП или anaphylaxis минуты решают; неправильный номер = часы в ER без скорой.",
      "**1669** — NIEMS: **критическая** помощь **вне** hospital; диспетчер triage по severity (не для «простуды»). Дайте **GPS pin**, landmark, тип травмы, сознание/дыхание, callback number, опасности (traffic, fire).",
      "**1155** Tourist Police — язык и координация при инциденте с иностранцем; **191** — полиция общая. Для **Bangkok-only** 1554 (Vajira) на Пхукете не primary — ориентир **1669** + ближайший ER.",
    ],
    bullets: [
      "1669 — ambulance EMS NIEMS (24/7); приложение EMS 1669 для geolocation (MOPH/NIEMS PR).",
      "191 — полиция; 1155 — tourist police.",
      "Vachira ER 076-361-234; Thalang Hospital 076-311034; Bangkok Hospital Phuket +66 76 254 425.",
      "При сознании и stable fracture — taxi/Grab в ER допустим; при head injury, chest pain, heavy bleed — 1669.",
      "Сохраните в телефон: policy hotline, hospital contact center, blood type / allergies card на EN+TH.",
    ],
  },
  {
    heading: "Hospital и клиники по районам Пхукета (адреса soft-verified)",
    section_kind: "practice",
    paragraphs: [
      "Зачем читать: выбрать **«свой» ER** до сезона дождей, а не в 2 ночи по Google Maps.",
      "Адреса сверены с official hospital sites (2026); перед поездкой перепроверьте **contact/location** — филиалы BDMS меняют branding (Siriroj → Bangkok Hospital Siriroj).",
    ],
    bullets: [
      formatPracticeBullet({
        channels: ["nashi_phuket_chat", "pkhuket2"],
        period: "2025–2026",
        claim:
          "для cardiology и planned surgery семьи чаще едут в Bangkok Hospital Phuket (Town), а Vachira — при ДТП и когда нужен крупный гос ER рядом с Old Town",
        forReader:
          "заложите 25–45 мин из Patong/Kata в Town в час пик; сохраните 1669 и ER номер заранее",
      }),
      "**Phuket Town / Old Town:** Vachira Phuket Hospital — 353 Yaowarat Rd, Talat Yai, Mueang Phuket 83000 (MOPH, ER 24/7). Bangkok Hospital Phuket — 2/1 Hongyok Utis Rd, Talat Yai 83000 (private, JCI network).",
      "**Wichit / Central:** Bangkok Hospital Siriroj — 44 Chalermprakiat Ror 9 Rd, Wichit, Mueang Phuket 83000 (бывш. Phuket International; у Central Festival).",
      "**Thalang / север / аэропорт:** Thalang Hospital (MOPH) — 358 Moo 1, Thep Krasattri Rd, Thalang 83110; tel. 076-311034; travel clinic (MOPH listing).",
      "**Patong / Kata / Karon:** много **clinic** уровня OPD; тяжёлые случаи — transfer в Town (Bangkok/Vachira) — soft: уточняйте 24/7 ER у конкретной clinic, не assume ICU.",
      "**Rawai / Chalong / юг:** планируйте маршрут через Chalong circle → Town; пробки после 16:00 — фактор triage.",
      "Pharmacy chain (Boots, hospital pharmacy) — receita для antibiotic; hospital pharmacy дороже, но ночью проще.",
    ],
  },
  {
    heading: "Стоматология, аптеки и лекарства",
    section_kind: "practice",
    paragraphs: [
      "Зачем читать: зубы и хронические рецепты — **out of pocket**, если полис не покрывает dental rider.",
      "Dental tourism на Пхукете развит: consulta у expat-oriented clinic часто **800–1 500 THB** (soft); implant/crown — десятки тысяч бат; SSO dental — только если вы **insured employee** в contract hospital с stomatology (редко priority для expat).",
      "Лекарства: многие OTC как в EU, но **antibiotic и controlled** — по receita; дубликаты brand name спрашивайте generic; храните box label для customs при regional travel.",
    ],
    bullets: [
      "Страховка: dental часто **optional rider**; cosmetic whitening — almost never covered.",
      "Emergency dental pain: private clinic same-day slot проще, чем queue Vachira oral surgery — soft.",
      "Chronic meds: возите 30–90 day supply + receita EN; local refill — visit GP private (1 500–3 000 THB consult soft).",
      "Vaccines (rabies post-exposure): Thalang travel clinic listed on Thai Travel Med — не откладывать после укуса.",
      "Counterfeit risk: только licensed pharmacy; street «pack» без receita — avoid.",
    ],
  },
  {
    heading: "Исключения, pre-existing и спорные кейсы",
    section_kind: "gap",
    paragraphs: [
      "Зачем читать: к **4–6 месяцу** полис уже «живой», и insurer начинает смотреть на **declarations** при крупном claim.",
      "Typical exclusions: pre-existing без rider, **motorsport / jet ski**, alcohol-related injury, **self-harm**, cosmetic, fertility, experimental treatment, war/riot (wording varies).",
      "Waiting period 30–180 days на некоторые conditions даже если не «pre-existing» в вашем понимании.",
    ],
    bullets: [
      "Декларируйте hypertension, diabetes, mental health honestly — иначе risk denial entire hospitalization.",
      "Moto без license / без helmet — insurer может оспорить (soft: зависит от policy).",
      "Dengue / COVID — usually covered as illness, но verify sub-limits per day.",
      "Pregnancy — часто waiting 10–12 months; plan до переезда.",
      "Gap между policies >24–48 h — reset waiting periods; не прерывайте при renewal.",
      "Dispute: gather ER report, itemized bill, nurse notes; Tourist Police 1155 при мошенничестве clinic — soft.",
    ],
  },
  {
    heading: "Типичные ошибки с медициной и страховкой",
    section_kind: "practice",
    paragraphs: [
      "К **4–6 месяцу** полис и «любимая clinic» уже привычны — и именно тогда всплывают ошибки месяца 1: travel вместо annual, Patong OPD вместо ER, «UCS автоматом с DTV».",
      "Главное: один dry-run OPD billing и сохранённые номера 1669/ER стоят дороже, чем десять постов «как лечились без страховки».",
    ],
    bullets: [
      "Ошибка: только **30-day travel policy** на 180-day DTV — IPD без continuous annual coverage.",
      "Ошибка: «госпital бесплатно» без SSO card/UCS enrollment — полный cash-счёт при стационаре.",
      "Ошибка: ехать в **Patong clinic** при head injury вместо **1669** + ER Vachira/Bangkok Hospital.",
      "Ошибка: не декларировать **pre-existing** — denial всего claim при первом крупном IPD.",
      "Ошибка: gap **>48 h** между renewals — сброс waiting period и спор с insurer.",
      "Ошибка: assume **direct billing** без pre-auth — deposit 50k–200k+ THB до подтверждения.",
    ],
  },
  {
    heading: "Месяцы 4–6: чеклист после «медицина потом»",
    section_kind: "action_guide",
    paragraphs: [
      "Зачем читать: к этому моменту статус (DTV/LTR/work) и полис уже должны совпадать с реальной жизнью на острове — иначе один ER съедает депозит condo.",
      "Если вы на **employment + work permit** — проверьте SSO portal: правильный hospital, contributions идут, card активна. Если **remote DTV** — annual policy renewal, copy в cloud, добавьте **Assist Route Check** при смене visa track: [Emigro Assist Таиланд](https://www.emigro.online/ru/assist?country=thailand).",
    ],
    bullets: [
      "Неделя 1 (месяц 4): audit policy PDF — inpatient limit, evacuation, dental, deductible, Thailand territory.",
      "Неделя 2: один **planned OPD** в chosen hospital — проверить direct billing на вашем insurer (dry run).",
      "Неделя 3: dentist cleaning + pano если не было 12 мес — baseline до claims.",
      "Неделя 4: аптечка home + car/bike: antihistamine, ORS, dressings; allergy card TH.",
      "Месяц 5: если семья — pediatra contact + school medical form requirements (soft).",
      "Месяц 6: renewal reminder 60 days before expiry; сравнить 2 quotes — не downgrade inpatient ради цены.",
      "Ошибка: «госбольница бесплатная» без SSO/UCS — счёт IPD cash; ошибка: только travel 30-day policy на 180-day DTV.",
    ],
  },
];

const keyTakeaways = [
  "Сегодня: сохраните **1669**, **1155**, ER Vachira 076-361-234 и Bangkok Hospital Phuket 076 254 425; положите policy number в Health app.",
  "Официально: SSO Section 33 — work permit + employer registration + contract hospital; UCS/NHSO — отдельные категории, не «любой expat»; 1669 — critical EMS вне hospital.",
  formatPracticeTakeaway({
    channels: ["nashi_phuket_chat", "info_phuket", "russianinphuket"],
    period: "2025–2026",
    claim:
      "без direct billing confirmation семьи платят deposit 50 000–200 000+ THB при IPD, даже с «международной» страховкой",
    forReader:
      "до месяца 4 сделайте test OPD billing; держите credit limit / wire path; не езжайте в ER без triage 1669 при life-threatening",
  }),
  "Расхождение: виза DTV/LTR ≠ UCS; Patong clinic ≠ полноценный ICU — тяжёлые случаи в Town (Vachira/Bangkok Hospital Phuket).",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Есть ли на Пхукете бесплатная медицина для россиян с DTV?",
    a: "По правилам бесплатный UCS/NHSO и SSO Section 33 доступны только eligible категориям (например, insured employee Section 33 или отдельные NHSO registration tracks) — не «любой DTV». На практике большинство DTV-релокантов лечатся **private cash или expat insurance**; Vachira примет экстренно, но без права на UCS/SSO — полный счёт или ваш polis.",
  },
  {
    q: "Куда звонить при ДТП на мото?",
    a: "По правилам при угрозе жизни — **1669** (EMS NIEMS) + **191**; иностранцу помогает **1155** Tourist Police. На практике при minor injury без head trauma многие едут taxi в **Vachira ER** (Yaowarat) или Bangkok Hospital Siriroj — но при потере сознания, крови, подозрении на перелом шеи — только 1669 и не двигать.",
  },
  {
    q: "Bangkok Hospital Phuket и Siriroj — это одно и то же?",
    a: "По правилам BDMS это **разные hospital** с разными адресами: Phuket — **2/1 Hongyok Utis, Town**; Siriroj — **44 Chalermprakiat Ror 9, Wichit**. На практике оба private с direct billing; insurance desk даст pre-auth. Не путать с **Vachira** (MOPH, Yaowarat 353).",
  },
  {
    q: "Покрывает ли expat-полис хронические болезни?",
    a: "По правилам зависит от декларации и rider pre-existing; часто waiting 12 мес или полное exclusion. На практике к 4–6 месяцу insurer запрашивает history при крупном IPD — занижение в application → denial; храните continuity без gap между renewals.",
  },
  {
    q: "Нужен ли полис, если есть work permit и SSO?",
    a: "По правилам Section 33 покрывает медуслуги в contract hospital по SSO rules; не всё (например, premium room, некоторые dental). На практике expat держат **top-up private** для second opinion, English GP и transfer в BDMS; без work permit SSO нет — только private/travel.",
  },
  {
    q: "Где стomatolog для семьи в Patong/Kata?",
    a: "По правилам SSO dental — только если вы insured и hospital предоставляет услугу. На практике семьи идут в **private dental** (Patong/Kata clinics); цена consulta soft 800–1 500 THB; implantes — проверьте dental rider. SOS зубной боли — same-day private, не Vachira queue.",
  },
];

export const MEDITSINA_PHUKET_GUIDE: ThailandEditorialGuide = {
  slug: MEDITSINA_PHUKET_SLUG,
  category: "Здоровье",
  content_kind: "guide" as ContentKind,
  title: "Медицина на Пхукете 2026: страховка, SSO, гос и частные hospital",
  excerpt:
    "1669 и ER Vachira/Bangkok Hospital, SSO Section 33 vs UCS, expat insurance и direct billing, стomatology и аптеки, pre-existing — практический CORE-гайд для релокантов на Пхукете.",
  seo_title: "Медицина Пхукет 2026 — страховка, больницы, 1669",
  seo_description:
    "Пхукет 2026: 1669 EMS, Vachira и Bangkok Hospital, SSO для work permit, DTV/LTR insurance, частные BDMS, стomatolog, pre-existing и чеклист 4–6 месяц.",
  quick_answer:
    "На Пхукете expat без work permit и SSO обычно живут на **частной медицине и polis** (DTV/LTR требуют coverage отдельно от «30 baht UCS»). Экстренно вне hospital — **1669** (NIEMS); Tourist Police **1155**. Крупные ER: **Vachira** (MOPH, Yaowarat) и **Bangkok Hospital Phuket** (2/1 Hongyok Utis). С work permit employer регистрирует **SSO Section 33** — лечение в contract hospital с SSO card + passport. К 4–6 месяцу проверьте direct billing и renewal polis — иначе IPD deposit съедает бюджет.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "Thailand — emergency telephone numbers", url: "https://www.thailand.go.th/issue-focus-detail/003_003" },
    { title: "Vachira Phuket Hospital (MOPH) — contact", url: "https://www.vachiraphuket.go.th/contact/" },
    { title: "SSO — Section 33 registration (foreign workers)", url: "https://www.sso.go.th/wpr/main/general/%E0%B8%A1%E0%B8%B2%E0%B8%95%E0%B8%A3%E0%B8%B033_singleview_detail_1_190_0/437_437/?id=437&page=preview" },
    { title: "NHSO — Universal Coverage Scheme", url: "https://www.nhso.go.th/en" },
    { title: "Bangkok Hospital Phuket — contact", url: "https://www.bangkokhospital.com/en/phuket/contact/head-office" },
    { title: "Thalang Hospital (MOPH) — contact", url: "https://thalanghospital.go.th/tl/web/site/contact" },
  ],
  topic_tags: ["health", "phuket", "thailand"],
  hashtags: buildNoteHashtags({
    topicTags: ["health", "phuket", "thailand"],
    contentKind: "guide",
    extra: ["sso", "1669", "vachira", "bangkok_hospital", "страховка", "stomatolog", "DTV"],
  }),
  source_channel: "nashi_phuket_chat+pkhuket2+info_phuket+russianinphuket+thailand_chatik",
  source_label: "editorial:thailand-core-health",
  pillar_guide_slug: PILLAR_SLUG,
};
