/**
 * Portugal festivals 2026 — calendar, genres, tickets, lodging for relocants (Norte lens).
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { formatPracticeTakeaway } from "@/lib/community-notes/practice-format";
import { DOMESTIC_TOURISM_NORTE_SLUG } from "@/lib/community-notes/guides/domestic-tourism-portugal-norte";
import { PORTO_BRAGA_LONG_TERM_RENT_SLUG } from "@/lib/community-notes/guides/porto-braga-long-term-rent";
import { DRUGS_LAW_NORTE_SLUG } from "@/lib/community-notes/guides/drugs-law-norte-portugal";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const FESTIVALS_PORTUGAL_2026_SLUG = "festivali-portugalii-2026-muzyka-porto-norte";

const GLOSSARY_INTRO =
  "Слова с билетов, кемпинга и CP — чтобы early bird и Parque da Cidade не превратились в сюрприз у турникета.";

const DISCLAIMER =
  "**Emigro:** даты и лайн-апы меняются — перед оплатой сверяйте официальный сайт фестиваля. Мы не продвигаем употребление веществ; про закон и мифы — [отдельный гайд](/notes/" +
  DRUGS_LAW_NORTE_SLUG +
  "). Не юридическая и не туристическая страховка.";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(glossaryForSlug(FESTIVALS_PORTUGAL_2026_SLUG)!, GLOSSARY_INTRO),
    paragraphs: [GLOSSARY_INTRO, DISCLAIMER],
  },
  {
    heading: "Официально: как планировать сезон май–сентябрь",
    section_kind: "official",
    paragraphs: [
      "Зачем вам это сейчас: если живёте в Порту/Браге, фестивальный сезон бьёт по жилью, CP и нервам раньше, чем по Instagram — билеты и Airbnb в Порту на São João и Primavera разбирают за месяцы.",
      "Что делать: выбрать 1–2 must-see под жанр, купить early bird, забронировать ночлег, заложить транспорт (CP / шаттл / машина) и recovery day после.",
      "Главное: Boom — биеннале; издание **2027** (не путать с июлем 2025). На 2026 смотрите Neopop, Primavera Porto, NOS Alive, Paredes de Coura.",
    ],
    bullets: [
      "Официальные сайты фестивалей и Ticketmaster/Shotgun-партнёры организатора — первичный источник дат и лайн-апа.",
      "Легальный resale: TicketSwap и аналоги организатора; избегайте «перекупов» в чатах без гарантий.",
      "Visit Portugal / Turismo de Porto e Norte — общий туристический фон; программа конкретного феста — только у промоутера.",
      "На площадках часто запрет стеклянной тары и одноразового пластика; вода — refill-станции (проверяйте правила на сайте).",
      "Внутренние поездки вокруг фестов — [туризм по Norte](/notes/" + DOMESTIC_TOURISM_NORTE_SLUG + ").",
    ],
  },
  {
    heading: "Афиша 2026: май–июнь",
    section_kind: "practice",
    paragraphs: [
      "Что делать: зафиксировать май–июнь как «город + пляж + São João», не пытаться закрыть всё подряд.",
      "Зачем: Primavera в Порту и Festas de Lisboa/São João одновременно давят на жильё в Norte и Лиссабоне.",
    ],
    bullets: [
      "21–24 мая — YARD (окрестности Лиссабона): EDM/house, молодёжный драйв.",
      "27–31 мая — MOGA Caparica (Costa da Caparica): electronic / deep house, бутиковый пляжный формат.",
      "21–29 мая — Queima das Fitas (Coimbra): студенческий праздник, не «тикет-фест», но сильный локальный вайб.",
      "11–14 июня — Primavera Sound Porto (Parque da Cidade): indie / alternative / electronic — главный must для живущих в Norte.",
      "16–22 июня — Waking Life (Crato, Alentejo): electronic + art, иммерсив у озера.",
      "20 / 21 / 27 / 28 июня — Rock in Rio Lisboa (Bela Vista): stadium pop/rock.",
      "12–13 июня — пик Festas de Lisboa (Santo António); 23–24 июня — Festa de São João в Порту (бесплатно, жильё — бронировать очень заранее).",
    ],
  },
  {
    heading: "Афиша 2026: июль–сентябрь",
    section_kind: "practice",
    paragraphs: [
      "Что делать: июль — пик жары и крупных площадок; август — сильнее Norte (Neopop, Coura); сентябрь — хвост сезона.",
      "Главное: Boom в **2026 нет** (следующий цикл **18–25 июля 2027**, Idanha-a-Nova). В июле 2026 смотрите NOS Alive, Afro Nation, ZNA и локальные пляжные даты.",
    ],
    bullets: [
      "1–6 июля — GOAT Community (São Pedro do Sul): wellness / electronic, камерный формат.",
      "3–5 июля — Afro Nation (Portimão, Praia da Rocha): afrobeats / amapiano, пляж Алгарве.",
      "9–11 июля — NOS Alive (Algés / Lisboa, Tejo): крупнейший полированный multi-genre.",
      "15–22 июля — ZNA Gathering (Montargil): goa / psytrance у озера; билеты уходят быстро.",
      "17–19 июля — MEO Marés (Leça da Palmeira, метрополия Порту): pop/rap, пляжный и относительно семейный.",
      "5–9 августа — Vagos Metal Fest; 6–8 августа — SonicBlast (пляжный stoner/doom) и **Neopop** (Viana do Castelo) — техно, 20-летие, вотерфронт.",
      "12–15 августа — Vodafone Paredes de Coura (река + лес + indie); 18–22 августа — CA Vilar de Mouros (старейший рок, Caminha).",
      "24–30 августа — Him Dub (Rapoula do Côa); 27–31 августа — Arrábida Electrónica (закрытие лета, electronic).",
      "4–6 сентября — Festa do Avante! (Seixal); 11–13 сентября — Alive на Мадейре; 17–21 сентября — Equinox (Caparica).",
      "Июль целиком — Cool Jazz (Cascais): сидячие концерты jazz/soul у моря — для тех, кто без кемпинга.",
    ],
  },
  {
    heading: "По жанрам: куда ехать из Порту/Браги",
    section_kind: "practice",
    paragraphs: [
      "Что делать: выбрать жанр и не смешивать «три фестиваля за 10 дней» — Norte даёт Neopop, Primavera, Coura и São João без обязательного перелёта.",
      "Зачем: экономия на транспорте и жилье важнее «собрать все хедлайнеры Европы».",
    ],
    bullets: [
      "Techno / underground: **Neopop** (Viana, ~1.5 ч CP из Porto) — лидер сцены; MOGA — более мелодичный пляжный электрон у Лиссабона.",
      "Indie / alternative: **Primavera Sound Porto**; **Paredes de Coura** — кемпинг у реки; NOS Alive — мейнстрим + инди на Тежу.",
      "Rock legacy: Vilar de Mouros; metal — Vagos; stoner/doom — SonicBlast на пляже.",
      "Afrobeats / global bass: Afro Nation (Алгарве) — отдельная поездка на юг.",
      "Psy / transformational: Boom — планировать на **2027**; в 2026 ближе ZNA (goa) — без романтизации веществ, см. [закон и мифы](/notes/" + DRUGS_LAW_NORTE_SLUG + ").",
      "Jazz / спокойный формат: Cool Jazz в Cascais (июль).",
    ],
  },
  {
    heading: "Must-see 2026 (и Boom 2027): коротко",
    section_kind: "practice",
    paragraphs: [
      "Что делать: если бюджет на один–два крупных тикета — приоритет для релоканта Norte: Primavera Porto + Neopop или Coura.",
    ],
    bullets: [
      "Neopop (6–8 авг, Viana): техно, индустриальный вотерфронт / зона у форта; ориентир билета €150–200 early/regular (уточняйте на сайте).",
      "Primavera Sound Porto (11–14 июн): кураторский лайн-ап, Parque da Cidade у океана; ориентир €200–280.",
      "NOS Alive (9–11 июл, Algés): масштаб на Тежу; ориентир €180–250.",
      "Paredes de Coura (12–15 авг): indie + природа + кемпинг; ориентир €120–160 + кемпинг.",
      "Boom (18–25 июл **2027**): легенда psy/transformational; early bird часто €250–350 и уходит за месяцы — не путать с сезоном 2026.",
      "Afro Nation (3–5 июл, Portimão): пляж + global bass; жильё на Алгарве летом дорогое — бронировать заранее.",
    ],
  },
  {
    heading: "Билеты, жильё, транспорт и рюкзак",
    section_kind: "action_guide",
    paragraphs: [
      "Зачем вам это сейчас: без порядка «тикет → ночлег → дорога» вы получите билет и будете спать в машине у Viana или платить x2 за Airbnb в Порту.",
      "Что делать: early bird → бронь жилья → транспорт → чеклист рюкзака → recovery day.",
      "Главное: early bird + жильё за 2–3 месяца для городских дат; для Boom/ZNA — ещё раньше.",
    ],
    bullets: [
      "Шаг 1 — Билет: официальный сайт / партнёр; early bird экономит ~20–40%; resale — TicketSwap и т.п., не «перевод на MB Way незнакомцу».",
      "Шаг 2 — Жильё: NOS Alive / Rock in Rio — Lisboa + Cascais line до Algés (€80–150/ночь ориентир); Primavera — Porto centro/Foz (€60–120); Neopop — Viana или кемпинг; Coura — кемпинг на площадке; Afro Nation — Portimão/Rocha (€100–200+). Долгосрок в городе — [аренда Porto/Braga](/notes/" + PORTO_BRAGA_LONG_TERM_RENT_SLUG + ").",
      "Шаг 3 — Транспорт: Algés — CP Cascais line от Cais do Sodré; Caparica — автобус/Uber из Lx; Parque da Cidade — метро/автобус или ~30 мин пешком из центра Porto; Viana — CP ~1.5 ч из Porto; Coura — шаттлы организатора; Boom — шаттлы Lx/Porto/Coimbra (когда будет 2027).",
      "Шаг 4 — Рюкзак: SPF50+, кепка, refill-бутылка, power bank, беруши, репеллент (озеро/лес), наличные на фуд-корт (терминалы падают), лёгкий вентилятор.",
      "Шаг 5 — Жара: +30…35 °C на танцполе — вода и тень обязательны; не планируйте перелёт «сразу после трёх дней техно».",
      "Шаг 6 — Безопасность: карманники на крупных городских фестах — сумка через плечо; вещества не «часть программы» Emigro — см. [мифы и закон](/notes/" + DRUGS_LAW_NORTE_SLUG + ").",
      "Шаг 7 — Бюджет еды/напитков ориентир: блюдо €8–15, пиво €3–5 на крупных площадках, дешевле на камерных; на Boom (когда будет) часто разрешена своя еда — читайте правила года.",
    ],
  },
  {
    heading: "Уличные праздники: не ticketed, но важнее тикета",
    section_kind: "practice",
    paragraphs: [
      "Что делать: заложить в календарь бесплатные городские даты — они сильнее бьют по Airbnb, чем средний инди-фест.",
    ],
    bullets: [
      "Festas de Lisboa (июнь, пик ~12–13): сардины, улицы Alfama/Mouraria — бесплатно, толпы.",
      "São João (23–24 июня, Porto): фейерверки, сардины, «молоточки», костры — весь город; жильё бронировать за месяцы.",
      "Queima das Fitas (конец мая, Coimbra): студенческий ритуал, Fado de Coimbra — аутентичный опыт без «VIP wristband».",
    ],
  },
  {
    heading: "Где чаты и афиши расходятся",
    section_kind: "gap",
    bullets: [
      "Чат: «Boom этим летом» → в 2026 биеннале-пауза; следующее крупное окно — **2027**.",
      "Афиша в Telegram без ссылки на офсайт → риск фейкового тикета; платите только через официальный checkout.",
      "«Жильё найдём на месте» в Порту на São João / Primavera → часто нет; бронь заранее.",
      "«На фесте всё легально» → нет; декриминализация ≠ разрешение тусоваться с веществами — [гайд](/notes/" + DRUGS_LAW_NORTE_SLUG + ").",
      "Resale «в два раза дороже у перекупа» → сначала TicketSwap / официальный secondary.",
    ],
  },
  {
    heading: "Типичные ошибки релокантов на фестивальном сезоне",
    section_kind: "practice",
    paragraphs: [
      "Оптимально: один–два феста + São João без героизма «весь календарь». Ошибки ниже — классика чатов Porto.",
    ],
    bullets: [
      "Ошибка: купить Boom на «это лето», перепутав биеннале с ежегодным фестом.",
      "Ошибка: тикет Primavera без жилья в Порту — цены на São João/июнь взлетают раньше лайн-апа.",
      "Ошибка: оплата билета «другу из чата» на MB Way без официального resale.",
      "Ошибка: ехать на Neopop без плана ночёвки в Viana — кемпинг и гостиницы тоже заканчиваются.",
      "Ошибка: три дня техно и утренний перелёт — заложите recovery day.",
      "Ошибка: игнорировать жару и воду на открытых площадках у океана.",
      "Ошибка: считать фестиваль зоной вне закона про вещества — Emigro против употребления.",
    ],
  },
];

const keyTakeaways = [
  "Официально: даты и лайн-ап — только с сайта фестиваля; Boom в цикле 2026 пропускает, следующее окно — июль 2027.",
  formatPracticeTakeaway({
    channels: ["por_tugal", "lepta"],
    period: "2026",
    claim:
      "для релоканта в Norte разумный приоритет — Primavera Sound Porto, Neopop (Viana) и Paredes de Coura без обязательного перелёта",
    forReader: "один–два феста за сезон лучше, чем сжечь бюджет и Airbnb на всём календаре",
  }),
  formatPracticeTakeaway({
    channels: ["por_tugal"],
    period: "2026",
    claim:
      "São João и Primavera в Порту поднимают цены на жильё за месяцы — бронь важнее «раннего билета в последний момент»",
    forReader: "сначала ночлег и CP/шаттл, потом мерч и afterparty",
  }),
  "Расхождение: чат «на фесте можно всё» не отменяет закон — Emigro против употребления веществ; см. отдельный правовой гайд.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Какой фестиваль выбрать, если живу в Порту?",
    a: "В 2026 логичны Primavera Sound Porto (июнь), MEO Marés / локальные даты у океана, Neopop в Viana do Castelo и Paredes de Coura в августе. NOS Alive и Afro Nation — отдельные поездки в Lisboa/Алгарве. Boom — планировать на 2027.",
  },
  {
    q: "Когда Boom Festival?",
    a: "Boom — биеннале. После издания июля 2025 следующее крупное окно анонсируют как 18–25 июля 2027 (Idanha-a-Nova). В сезон 2026 Boom не подставляйте в календарь «обязательно в этом году».",
  },
  {
    q: "Где брать билеты и не попасть на фейк?",
    a: "Официальный сайт фестиваля и его кассовые партнёры. Перепродажа — TicketSwap и легальные площадки. Не переводите оплату незнакомцам в чатах за «скрин QR».",
  },
  {
    q: "Как добраться на Neopop и Primavera из Порту?",
    a: "Primavera — Parque da Cidade: метро/автобус или пешком ~30 мин из центра. Neopop — CP до Viana do Castelo ~1.5 часа из Porto; уточняйте шаттлы организатора. На Couра часто ходят фестивальные автобусы из Porto/Viana.",
  },
  {
    q: "Что с жильём на São João и крупные даты?",
    a: "Бронируйте за месяцы. 23–24 июня в Порту и дни Primavera — пик спроса. Ориентиры цен на Airbnb сильно плавают; альтернатива — ночь в Braga/Gaia + поздний транспорт, если ещё есть места.",
  },
  {
    q: "Можно ли «как на Boom» с проверкой веществ?",
    a: "Emigro категорически против употребления. Harm reduction на отдельных площадках не делает вещества разрешёнными. Правовой разбор — в гайде про мифы и закон о наркотиках в Португалии/Norte.",
  },
];

export const FESTIVALS_PORTUGAL_2026_GUIDE = {
  slug: FESTIVALS_PORTUGAL_2026_SLUG,
  category: "Досуг",
  content_kind: "guide" as ContentKind,
  title: "Фестивали Португалии 2026: календарь, жанры, билеты и логистика из Порту/Norte",
  excerpt:
    "Май–сентябрь 2026: Primavera Porto, Neopop, NOS Alive, Coura, Afro Nation. Boom — в 2027. Билеты, жильё, CP и уличные São João для релокантов.",
  seo_title: "Фестивали Португалии 2026 — Porto и Norte",
  seo_description:
    "Фестивали Португалии 2026 для релокантов в Порту/Norte: календарь, Primavera, Neopop, NOS Alive — билеты, жильё, транспорт и уличные праздники.",
  quick_answer:
    "Сезон открыли афиши — и в чате уже «едем на Boom в июле». Стоп: Boom в 2026 на паузе биеннале, следующее окно — 2027. Если вы в Порту, разумный стержень года: Primavera Sound в Parque da Cidade, августовский Neopop в Viana и Paredes de Coura у реки; NOS Alive и Afro Nation — отдельным выездом. Билет без жилья на São João = ночь в холле вокзала Campanhã. Early bird, офсайт, CP/шаттл, SPF и вода; вещества — не «часть программы» Emigro.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "Visit Portugal", url: "https://www.visitportugal.com/" },
    { title: "Primavera Sound", url: "https://www.primaverasound.com/" },
    { title: "Neopop Festival", url: "https://www.neopopfestival.com/" },
    { title: "NOS Alive", url: "https://www.nosalive.com/" },
    { title: "Boom Festival", url: "https://www.boomfestival.org/" },
    { title: "CP — Comboios de Portugal", url: "https://www.cp.pt/" },
    { title: "TicketSwap", url: "https://www.ticketswap.com/" },
  ],
  topic_tags: ["dosug", "portugal", "norte", "festivali"],
  hashtags: buildNoteHashtags({
    topicTags: ["dosug", "portugal", "norte"],
    contentKind: "guide",
    extra: ["porto", "braga", "primavera", "neopop", "festival"],
  }),
  source_channel: "editorial+official",
  source_label: "editorial:festivals-portugal-2026",
};
