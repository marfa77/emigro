/** Hand-curated guide — voice «релокант за кофе» (lib/community-notes/editorial-voice.ts). */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { formatPracticeTakeaway } from "@/lib/community-notes/practice-format";
import { CAR_PORTUGAL_GUIDE_SLUG } from "@/lib/community-notes/guides/car-portugal-buy-rent-import";
import { MEDITSINA_NORTE_HEALTHCARE_SLUG } from "@/lib/community-notes/guides/meditsina-norte-healthcare";
import { PORTO_VS_BRAGA_FAMILY_SCHOOLS_SLUG } from "@/lib/community-notes/guides/porto-vs-braga-family-schools";
import { TOLLS_FINES_ACCIDENTS_GUIDE_SLUG } from "@/lib/community-notes/guides/tolls-fines-accidents-norte-portugal";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const DOMESTIC_TOURISM_NORTE_SLUG = "turizm-vnutri-portugalii-norte-2026";

const LGOTY_GUIDE_SLUG = "lgoty-s-vnj-kulturnye-mesta-2026";

const GLOSSARY_INTRO =
  "Слова из объявлений turismo rural, на табло CP и в parque natural — разберём заранее, пока вы планируете выходные из Porto, а не стоите у автомата на Campanhã.";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(glossaryForSlug(DOMESTIC_TOURISM_NORTE_SLUG)!, GLOSSARY_INTRO),
  },
  {
    heading: "Официально: как устроен внутренний туризм в PT",
    section_kind: "official",
    paragraphs: [
      "Зачем вам это сейчас: вы уже живёте в Norte, а не «проезжаете через Лиссабон на 3 дня». Значит, другие правила — residente скидки, сезонность без отпуска в августе и транспорт на каждый день, а не только Uber из аэропорта.",
      "Что делать: понять базовую карту — monumentos nacionais, parques naturais, CP и autoestradas — и где искать официальную информацию.",
      "Главное: turismo de Portugal и ICNF публикуют маршруты и ограничения; льготы для residentes — отдельно от туристических билетов.",
    ],
    bullets: [
      "Visit Portugal / Turismo de Portugal — маршруты, события, aldeias históricas (turismodeportugal.pt).",
      "ICNF — parques naturais и reservas; правила костров, пикников и троп (icnf.pt).",
      "CP (Comboios de Portugal) — расписание Intercidades, Regional, historic trains; билеты на cp.pt.",
      "Monumentos nacionais — DGPC; часть объектов бесплатна в определённые дни или для residentes (dgpc.pt).",
      "Parques de estacionamento em zonas protegidas — штрафы за сбор ракушек/камней с пляжа (lepta 08.2025).",
    ],
  },
  {
    heading: "Вы живёте в Porto — куда на выходные (1–2 дня)",
    section_kind: "practice",
    paragraphs: [
      "Что делать: собрать 4–5 проверенных маршрутов без «объехать всю Португалию за неделю».",
      "Зачем: большинство релокантов в @chatlisboa и @por_tugal ездят по Norte и центру; юг и острова — отдельные поездки.",
    ],
    bullets: [
      "Minho (суббота): Guimarães (castelo + centro histórico) → Braga (Bom Jesus) — 40–50 мин на A3 или CP; вечером Viana do Castelo (forte + praia). База: [Порту vs Брага](/notes/" + PORTO_VS_BRAGA_FAMILY_SCHOOLS_SLUG + ").",
      "Douro (суббота–воскресенье): Peso da Régua / Pinhão — 1h15 по A4 или CP до Régua + boat cruise; летом historic train Douro (@lepta 08.2025).",
      "Gerês (2 дня): Parque Nacional Peneda-Gerês — Cascata do Arado, aldeia Vilarinho da Furna (@lepta 07.2025); ночь в turismo rural.",
      "Aveiro (день): «Venice of Portugal» — 1h CP Regional из Campanhã; moliceiro 45–60 мин (~€15–25, @chatlisboa 07.2025).",
      "Coimbra (день): Universidade + Baixa — Intercidades ~1h; IKEA открылся 07.2026 (@lepta) — удобная точка, если нужен бытовой стоп.",
      "Óbidos + Nazaré (2 дня): medieval wall walk + океан; ~2h по A1/A8; portagem — [гайд по платным дорогам](/notes/" + TOLLS_FINES_ACCIDENTS_GUIDE_SLUG + ").",
    ],
  },
  {
    heading: "Регионы дальше: Alentejo, Algarve, острова",
    section_kind: "practice",
    paragraphs: [
      "Что делать: планировать 3–5 дней off-season, когда Norte серый, а юг ещё тёплый.",
      "Зачем: это уже «мини-отпуск», не субботний выезд; бронируйте заранее или ловите Ryanair/CP promo.",
    ],
    bullets: [
      "Alentejo: Évora (UNESCO) + Monsaraz — 2–3h по A1/A6; зимой/весной меньше жары; turismo rural с pool от €60–90/ночь off-season.",
      "Algarve: Faro, Lagos, Sagres — 3h30 A2 или Ryanair OPO→FAR (~€25–80 OW); август = толпы и жара (@lepta 06.2025 — экстремальные температуры).",
      "Setúbal / Arrábida: 1h30; bioluminescence tours (@por_tugal 09.2025); пляжи без перелёта.",
      "Azores: SATA / Ryanair OPO→PDL или LIS→PDL; 3–4 дня минимум; вулканы, hot springs, частые задержки из-за погоды.",
      "Madeira: TP / Ryanair до FNC; 4–5 дней; levadas и орхидеи; зимой мягкий климат, летом дешевле перелёт, чем жильё.",
    ],
  },
  {
    heading: "Как добраться: машина, CP, автобус, самолёт",
    section_kind: "official",
    paragraphs: [
      "Зачем вам это сейчас: без машины в rural Norte сложно, но не обязательно — CP + один день аренды закрывают 80% выходных.",
      "Что делать: выбрать транспорт под маршрут и сезон; проверить забастовки CP (@lepta 06.2025, 02.2025).",
    ],
    bullets: [
      "Машина: A1 Porto–Lisboa ~€20–25 portagem OW; A3 commute; Via Verde обязателен — [машина](/notes/" + CAR_PORTUGAL_GUIDE_SLUG + ") + [portagens](/notes/" + TOLLS_FINES_ACCIDENTS_GUIDE_SLUG + ").",
      "CP Intercidades/AP: Porto–Coimbra ~€15–25; Porto–Lisboa ~€25–35; дети до 4 бесплатно без места; Andante не действует вне STCP.",
      "CP Regional: дешевле, медленнее; линия Porto–Aveiro — ремонты метро влияли на расписание (@lepta 07.2025).",
      "FlixBus: Porto–Lisboa от ~€8; Porto–Faro; ночные рейсы экономят отель; багаж и pet policy — на сайте до покупки.",
      "Ryanair domestic: OPO–LIS, OPO–FAR, иногда OPO–FNC; багаж платный; бронируйте за 4–8 недель off-season.",
      "STCP / Metro Porto: с 07.2026 бесплатный проезд для residentes Porto (@lepta) — не путать с туристическим Andante.",
    ],
  },
  {
    heading: "Бронирование: Booking, turismo rural, parques",
    section_kind: "practice",
    paragraphs: [
      "Что делать: комбинировать агрегаторы и прямое бронирование quintas; off-season = −30–50% к лету.",
      "Зачем: Idealista интегрировал Rentalia (@por_tugal 06.2025) — те же дома, что на Booking, иногда дешевле напрямую.",
    ],
    bullets: [
      "Booking.com / Airbnb: off-season (окт–март, кроме Christmas) — aldeia в Minho €50–80/ночь vs €120+ летом.",
      "Turismo rural / agroturismo: quinta с завтраком; искать «turismo rural» + distrito; часто только WhatsApp + IBAN.",
      "Rentalia / Idealista férias: длинные выходные и школьные каникулы — бронируйте за 6–8 недель.",
      "Parques naturais: вход часто бесплатный; visitor centers €2–5; ночёвка только в designated campsites или aldeias.",
      "Open House / бесплатные дни: Open House Porto — 70+ зданий (@lepta 07.2025); museum free days — [льготы с ВНЖ](/notes/" + LGOTY_GUIDE_SLUG + ").",
    ],
  },
  {
    heading: "Сезоны, толпы и взгляд релоканта",
    section_kind: "practice",
    paragraphs: [
      "Что делать: планировать отпуск не как турист «впервые в Европе», а как житель — shoulder season и будни.",
      "Зачем: август на побережье = цены ×2, CP переполнен, risco de incêndio запрещает мангал (@chatlisboa 06.2025).",
    ],
    bullets: [
      "Лучшие окна: апр–июнь и сен–окт для Douro/Minho; Algarve — май или сентябрь.",
      "Избегать: последняя неделя июня (São João Porto — @lepta 06.2025), 1–15 августа на пляжах, Easter в Óbidos.",
      "Будни vs выходные: Guimarães/Braga в субботу crowded; Coimbra/Aveiro — спокойнее вторник–четверг.",
      "Погода Norte: дождь ≠ отмена — музеи, wine cellars Douro, термальные купальни Gerês.",
      "Residente-скидки: carte de residente / título de residência на monumentos и CP — см. [льготы](/notes/" + LGOTY_GUIDE_SLUG + ").",
    ],
  },
  {
    heading: "Бюджет, семья с детьми, питомцы",
    section_kind: "practice",
    paragraphs: [
      "Что делать: заложить реальный бюджет на транспорт + питание + активности; проверить pet-friendly до оплаты.",
      "Зачем: «дешёвый уикенд» превращается в €300, если забыть portagem, парковку arrumadores (@por_tugal 12.2025) и платный пляжный parking.",
    ],
    bullets: [
      "Бюджет выходных (2 взрослых, машина): бензин €40–80 + portagem €20–50 + жильё €80–150 + еда €60–120 = €200–400.",
      "Бюджет CP-день (Aveiro/Coimbra): билеты €30–50 + еда €40–60 + moliceiro €30 = €100–140 на двоих.",
      "С детьми: Oceanário (Lisboa), Zoo Santo Inácio (Vila Nova Gaia), «moving sands» Praia da Adraga (@chatlisboa 07.2025), Guimarães castle.",
      "С собакой: многие praias летом запрещают cães; parque natural — поводок обязателен; ferry/tagus — «с собакой можно» (@chatlisboa 07.2025).",
      "Pet-friendly жильё: фильтр Booking «pets allowed»; turismo rural часто принимает cães за доплату €10–20/ночь.",
      "Здоровье в поездке: аптечка + SNS24; подробнее — [медицина Norte](/notes/" + MEDITSINA_NORTE_HEALTHCARE_SLUG + ").",
    ],
  },
  {
    heading: "Где портал и чаты расходятся с реальностью",
    section_kind: "gap",
    bullets: [
      "CP.pt «поезд в 10:12» → ремонты линии Porto–Aveiro сдвигали рейсы на 20–40 мин (@lepta 07.2025).",
      "«Gerês бесплатный parque» → парковка у популярных cascatas платная летом; приезжайте до 9:00.",
      "Booking «pet friendly» → на месте «только до 10 кг» или доплата cash — пишите хозяину до оплаты.",
      "«Douro historic train каждый день» → сезон июл–окт, места за 2–4 недели; не путать с обычным Regional.",
      "«Бесплатный транспорт Porto» → только residentes с cartão Porto (@lepta 07.2026); туристический Andante платный.",
      "«Собрать ракушки на память» → штраф в protected zones (@lepta 08.2025).",
    ],
  },
  {
    heading: "Типичные ошибки релокантов",
    section_kind: "practice",
    bullets: [
      "Ехать на Algarve в август «как все» — жара 40 °C+, цены и толпы; лучше май/сентябрь.",
      "Douro только на Instagram-locations без брони quinta — все parking lot full к 11:00.",
      "CP без проверки greves — забастовка 03.06.2026 отменяла рейсы (@lepta); смотрите cp.pt/greves.",
      "Мангал в parque natural летом — risco de incêndio, multa; @chatlisboa искали legal workaround — легче churrasqueira на quinta.",
      "Ryanair только hand luggage на 4 дня Algarve — доплата багажа съедает экономию vs FlixBus+ночь.",
      "Игнор [portagens](/notes/" + TOLLS_FINES_ACCIDENTS_GUIDE_SLUG + ") на «коротком» A1 до Óbidos — €15–20 OW неожиданно.",
    ],
  },
];

const keyTakeaways = [
  "Официально: внутренний туризм PT — CP, parques naturais (ICNF), monumentos (DGPC); residente-льготы отдельно от туристических тарифов.",
  formatPracticeTakeaway({
    channels: ["chatlisboa"],
    period: "2025–2026",
    claim:
      "из Porto на выходные чаще ездят в Minho, Douro, Gerês, Aveiro или Coimbra — это 1–2 дня на дорогу",
    forReader: "юг Португалии и острова (Madeira, Azores) закладывайте отдельно на 3–5 дней и лучше вне августа — меньше толп и жары",
  }),
  "Транспорт: машина + Via Verde для гибкости; CP/FlixBus для бюджета; Ryanair OPO–FAR/LIS для дальних маршрутов.",
  "Расхождение: расписание CP и «pet friendly» на Booking часто не совпадают с реальностью — проверяйте greves и пишите хозяину quinta заранее.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Нужна ли машина, если живёшь в Porto?",
    a: "Не обязательно для Aveiro, Coimbra, Braga/Guimarães — CP или FlixBus. Для Douro viewpoints, Gerês и Alentejo машина удобнее. Аренда на уикенд — см. [гайд по машине](/notes/" + CAR_PORTUGAL_GUIDE_SLUG + "); постоянная — Via Verde + [portagens](/notes/" + TOLLS_FINES_ACCIDENTS_GUIDE_SLUG + ").",
  },
  {
    q: "Сколько стоит выходные в Douro на двоих?",
    a: "Бюджет CP+quinta: €120–200 (билеты ~€40, turismo rural €80–120, еда €40–60). Машина: +€40–70 бензин/portagem. Historic train + boat — от €50–80/чел сверху; бронируйте заранее (@lepta 08.2025).",
  },
  {
    q: "Когда ехать в Algarve, если не турист?",
    a: "Май или сентябрь: тепло, меньше толп, жильё −30%. Август — экстремальная жара и цены (@lepta 06.2025). Ryanair OPO–FAR off-season от ~€25 OW; 3–4 ночи minimum.",
  },
  {
    q: "Есть ли бесплатные музеи с ВНЖ?",
    a: "Да, часть monumentos и cultural sites — льготы для residentes и бесплатные дни. Подробный список и carte — [льготы с ВНЖ](/notes/" + LGOTY_GUIDE_SLUG + "). Open House Porto — отдельные бесплатные выходные (@lepta 07.2025).",
  },
  {
    q: "Можно ли брать собаку в parque natural и на пляж?",
    a: "В parque natural — на поводке, иногда запрет на определённые trilhos. Пляжи летом часто ban cães; уточняйте placards. Ferry/tagus — по опыту @chatlisboa «с собакой можно»; жильё — фильтр pets + подтверждение у хозяина.",
  },
  {
    q: "CP или FlixBus Porto–Lisboa?",
    a: "CP Intercidades быстрее (~2h45) и комфортнее, €25–35. FlixBus дешевле (от ~€8), 3h30–4h; ночной рейс экономит отель. При greves (@lepta) проверяйте оба расписания в день выезда.",
  },
  {
    q: "Что если заболел в поездке по PT?",
    a: "SNS24 — 808 24 24 24; urgências в ближайшем hospital. С utente — taxa moderadora; без — частная urgência €80–150. Подробнее — [медицина Norte](/notes/" + MEDITSINA_NORTE_HEALTHCARE_SLUG + ").",
  },
];

export const DOMESTIC_TOURISM_NORTE_GUIDE = {
  slug: DOMESTIC_TOURISM_NORTE_SLUG,
  category: "Быт и досуг",
  content_kind: "guide" as ContentKind,
  title: "Внутренний туризм Португалии 2026: выходные из Porto, Minho, Douro, Algarve",
  excerpt:
    "Куда поехать из Porto и Norte на выходные: Minho, Douro, Gerês, Aveiro, Algarve, Azores. CP, FlixBus, Ryanair, turismo rural, бюджет, дети, pets и льготы с ВНЖ.",
  seo_title: "Внутренний туризм PT 2026 — выходные из Porto",
  seo_description:
    "Практический гайд по внутреннему туризму из Porto 2026: Minho, Douro, Gerês, CP и FlixBus, Ryanair, turismo rural, parques naturais и льготы с ВНЖ на monumentos.",
  quick_answer:
    "Пятница вечером вы смотрите на карту: Braga уже были десять раз, в Algarve все едут в августе, а вы — residente с работой в понедельник. Из Porto на выходные логичны Minho, Douro и Gerês на машине или CP; Aveiro и Coimbra — день поездом. Юг и Azores — off-season и Ryanair. Бронируйте turismo rural заранее; льготы на музеи — с ВНЖ.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "Visit Portugal", url: "https://www.visitportugal.com/" },
    { title: "Turismo de Portugal", url: "https://www.turismodeportugal.pt/" },
    { title: "CP — Comboios de Portugal", url: "https://www.cp.pt/" },
    { title: "ICNF — Parques naturais", url: "https://www.icnf.pt/" },
    { title: "DGPC — Monumentos", url: "https://www.monumentos.pt/" },
    { title: "FlixBus Portugal", url: "https://www.flixbus.pt/" },
    { title: "Ryanair", url: "https://www.ryanair.com/" },
    { title: "Idealista / Rentalia férias", url: "https://www.idealista.pt/" },
  ],
  topic_tags: ["turismo", "portugal"],
  hashtags: buildNoteHashtags({
    topicTags: ["turismo", "portugal"],
    contentKind: "guide",
    extra: ["porto", "norte", "douro", "minho", "algarve", "выходные", "cp", "turismorural"],
  }),
  source_channel: "chatlisboa+por_tugal+autolife_pt+lepta",
  source_label: "editorial:50-signals",
};
