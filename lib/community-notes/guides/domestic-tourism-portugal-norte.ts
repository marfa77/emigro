/**
 * Domestic tourism from Norte — weekend routes for relocants.
 * Visual canon: Emigro atlas icons + map vignettes (inline/turismo-norte).
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { formatPracticeTakeaway } from "@/lib/community-notes/practice-format";
import { CAR_PORTUGAL_GUIDE_SLUG } from "@/lib/community-notes/guides/car-portugal-buy-rent-import";
import { MEDITSINA_NORTE_HEALTHCARE_SLUG } from "@/lib/community-notes/guides/meditsina-norte-healthcare";
import { PORTO_VS_BRAGA_FAMILY_SCHOOLS_SLUG } from "@/lib/community-notes/guides/porto-vs-braga-family-schools";
import { TOLLS_FINES_ACCIDENTS_GUIDE_SLUG } from "@/lib/community-notes/guides/tolls-fines-accidents-norte-portugal";
import type {
  CommunityNoteFaq,
  ContentKind,
  NoteBodyImage,
  NoteBodySection,
} from "@/lib/community-notes/types";

export const DOMESTIC_TOURISM_NORTE_SLUG = "turizm-vnutri-portugalii-norte-2026";

const LGOTY_GUIDE_SLUG = "lgoty-s-vnj-kulturnye-mesta-2026";

const IMG = "/images/community-notes/inline/turismo-norte";
const CANON = "Emigro · Norte weekend atlas";

function zoneVisuals(id: string, place: string, symbolCaption: string): NoteBodyImage[] {
  return [
    {
      src: `${IMG}/${id}-map.webp`,
      alt: `${place} на карте выходных из Porto`,
      caption: `${place} на карте Norte`,
      credit: CANON,
      fit: "cover",
    },
    {
      src: `${IMG}/${id}-symbol.webp`,
      alt: `${place} — символ маршрута`,
      caption: symbolCaption,
      credit: CANON,
      fit: "contain",
    },
  ];
}
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
      "Вы уже живёте в Norte. Не тот человек, что «проезжает через Лиссабон на три дня», а тот, для кого суббота начинается с кофе и карты, а понедельник — с работы. Здесь другие правила: residente-скидки, сезонность без отпуска в августе, транспорт на каждый день, а не только Uber из аэропорта. Monumentos nacionais, parques naturais, CP и autoestradas — базовая карта, которую стоит держать в голове до того, как visitor center окажется закрыт.",
      "Turismo de Portugal и ICNF публикуют маршруты и ограничения; льготы для residentes живут отдельно от туристических билетов. В lepta летом 2025 напоминали и про штрафы в zonas protegidas — в том числе за сбор ракушек и камней с пляжа. Это не страшилка для туристов: это быт человека, который сюда уже переехал.",
      "Главное: сначала Visit Portugal / ICNF / CP / DGPC — потом Booking и Instagram; residente-тариф не равен туристическому билету.",
    ],
    images: [
      {
        src: `${IMG}/norte-overview.webp`,
        alt: "Обзорная карта выходных маршрутов из Porto по Norte",
        caption: "Пять зон выходных из Porto — Minho, Douro, Gerês, Aveiro, Coimbra",
        credit: CANON,
        fit: "cover",
      },
    ],
    bullets: [
      "Сверьте маршруты и события на Visit Portugal / Turismo de Portugal — aldeias históricas (turismodeportugal.pt).",
      "Откройте ICNF для parques naturais и reservas: правила костров, пикников и троп (icnf.pt).",
      "Проверьте расписание Intercidades, Regional и historic trains на cp.pt.",
      "Уточните бесплатные дни и residente-тарифы на monumentos nacionais через DGPC (dgpc.pt).",
      "Помните про штрафы в zonas protegidas — ракушки и камни с пляжа тоже считаются.",
    ],
  },
  {
    heading: "Вы живёте в Porto — куда на выходные (1–2 дня)",
    section_kind: "practice",
    paragraphs: [
      "Пятница вечером карта уже знакома, почти слишком знакома. Braga была десятый раз, Douro всё ещё «надо бы», в Algarve все едут в августе, а у вас понедельник на работе и дети, которым в воскресенье хочется домашнего ужина. Хороший уикенд здесь — не объехать всю Португалию, а четыре-пять проверенных дорог в радиусе пары часов, когда асфальт ещё пахнет дождём Norte, а не чужим отпуском. В чатах Lisboa и por_tugal чаще катают по Norte и центру; юг и острова — отдельные поездки, когда есть три–пять дней и терпение к бронированию.",
      "Minho закрывает субботу без героизма. Guimarães — castelo и centro histórico, Braga — Bom Jesus, вечером Viana do Castelo: сорок–пятьдесят минут по A3 или CP. База сравнения городов — [Порту vs Брага](/notes/" +
        PORTO_VS_BRAGA_FAMILY_SCHOOLS_SLUG +
        "). Douro просит субботу–воскресенье: Peso da Régua или Pinhão, час пятнадцать по A4 или CP до Régua и boat cruise; летом historic train Douro лучше бронировать заранее — так в lepta и советовали. Gerês держит два дня: Cascata do Arado, aldeia Vilarinho da Furna, ночь в turismo rural, когда в квартире ещё пахнет сыростью, а в горах уже другой воздух.",
      "Aveiro — день: «Venice of Portugal», час CP Regional из Campanhã, moliceiro сорок пять–шестьдесят минут, ориентир €15–25 по опыту chatlisboa. Coimbra — Universidade и Baixa, Intercidades около часа; IKEA открылся в июле 2026 — бытовой стоп по пути, если нужен. Óbidos и Nazaré на два дня — medieval wall walk и океан, около двух часов по A1/A8; portagem не забудьте — [гайд по платным дорогам](/notes/" +
        TOLLS_FINES_ACCIDENTS_GUIDE_SLUG +
        "). Если нужен не уикенд, а 10–14 дней пешком из Porto до Santiago — [Путь Сантьяго](/notes/put-santyago-porto-camino-portugues-2026). Юг и Azores с Madeira уже не воскресный ужин дома.",
      "Главное: Minho, Douro, Gerês, Aveiro и Coimbra закрывают большинство суббот без отпуска; юг и Azores/Madeira — уже мини-отпуск, не «вернусь к воскресному ужину дома».",
    ],
    images: [
      ...zoneVisuals("minho", "Minho", "Guimarães, Braga, Viana — суббота без героизма"),
      ...zoneVisuals("douro", "Douro", "Régua / Pinhão — террасы и historic train"),
      ...zoneVisuals("geres", "Gerês", "Cascata do Arado — два дня и turismo rural"),
      ...zoneVisuals("aveiro", "Aveiro", "Moliceiro и каналы — день на CP"),
      ...zoneVisuals("coimbra", "Coimbra", "Universidade и Baixa — Intercidades ~1 ч"),
    ],
    bullets: [
      "Съездите в Minho (суббота): Guimarães → Braga → вечером Viana; 40–50 мин A3/CP.",
      "Заложите Douro (суббота–воскресенье): Régua/Pinhão — 1h15 A4 или CP; historic train бронируйте заранее.",
      "Выберите Gerês на 2 дня: Cascata do Arado, Vilarinho da Furna, ночь в turismo rural.",
      "Сгоняйте в Aveiro или Coimbra на день: ~1h CP; moliceiro ~€15–25; Coimbra + IKEA с 07.2026.",
      "Запланируйте Óbidos + Nazaré (2 дня): ~2h A1/A8; заложите portagem.",
    ],
  },
  {
    heading: "Регионы дальше: Alentejo, Algarve, острова",
    section_kind: "practice",
    paragraphs: [
      "Когда Norte серый, а на термометре ещё не хочется сидеть дома, юг и острова тянут сами — но это уже не «суббота с кофе в Matosinhos», а мини-отпуск на три–пять дней. Off-season здесь выигрывает: меньше толп, жильё дешевле, Ryanair и CP promo ловят за месяцы, а не в последний момент перед августом.",
      "Alentejo — Évora (UNESCO) и Monsaraz, два–три часа по A1/A6; зимой и весной меньше жары, turismo rural с pool от €60–90 за ночь off-season. Algarve — Faro, Lagos, Sagres: три с половиной часа по A2 или Ryanair OPO→FAR, ориентир €25–80 в одну сторону; в lepta предупреждали про август — толпы, жара, экстремальные температуры. Setúbal и Arrábida — полтора часа, bioluminescence tours (в por_tugal осенью 2025 делились опытом), пляжи без перелёта. Полная карта кластеров дальше Norte (Sintra, Golegã, Tomar, Alentejo, Madeira) — [атлас поездок по PT](/notes/portugal-destination-tips-regiony-2026).",
      "Azores — SATA или Ryanair OPO→PDL или LIS→PDL, минимум три–четыре дня, вулканы, hot springs, частые задержки из‑за погоды. Madeira — TP или Ryanair до FNC, четыре–пять дней, levadas и орхидеи; зимой мягкий климат, летом иногда дешевле перелёт, чем жильё. Это уже другой ритм: вы не «вернетесь к воскресному ужину в Porto», и лучше принять это до оплаты билета.",
      "Главное: Alentejo, Algarve, Setúbal/Arrábida, Azores и Madeira — отдельное планирование; не смешивайте с «вернусь к воскресному ужину в Porto».",
    ],
    bullets: [
      "Съездите в Alentejo: Évora + Monsaraz — 2–3h A1/A6; turismo rural от €60–90 off-season.",
      "Заложите Algarve вне августа: 3h30 A2 или Ryanair OPO→FAR (~€25–80 OW).",
      "Выберите Setúbal / Arrábida на 1h30 без перелёта — bioluminescence и пляжи.",
      "Летите на Azores: 3–4 дня минимум; погода часто сдвигает рейсы.",
      "Запланируйте Madeira: 4–5 дней; levadas; зимой климат мягче.",
    ],
  },
  {
    heading: "Как добраться: машина, CP, автобус, самолёт",
    section_kind: "official",
    paragraphs: [
      "Без машины в rural Norte неудобно — но не фатально. CP плюс один день аренды закрывают большинство выходных; постоянная машина имеет смысл, если Gerês, Douro viewpoints и Alentejo — не раз в год. Перед выездом стоит сверить транспорт под маршрут и сезон: в lepta в 2025–2026 не раз напоминали про greves CP — расписание «на бумаге» и реальность расходятся.",
      "A1 Porto–Lisboa — ориентир €20–25 portagem в одну сторону; A3 — привычный commute; Via Verde обязателен. CP Intercidades и AP: Porto–Coimbra €15–25, Porto–Lisboa €25–35; дети до четырёх бесплатно без места. Regional дешевле и медленнее; линия Porto–Aveiro летом 2025 сдвигалась из‑за ремонтов метро. FlixBus — Porto–Lisboa от €8, ночные рейсы экономят отель. Ryanair domestic — OPO–LIS, OPO–FAR, иногда OPO–FNC; багаж платный; бронируйте за четыре–восемь недель off-season. С июля 2026 для residentes Porto в lepta писали про бесплатный проезд STCP/Metro — не путать с туристическим Andante.",
      "Главное: машина + Via Verde даёт гибкость; CP/FlixBus — бюджет; Ryanair — дальние маршруты; Andante не заменяет билет за пределами STCP.",
    ],
    bullets: [
      "Возьмите машину с Via Verde — [машина](/notes/" + CAR_PORTUGAL_GUIDE_SLUG + ") + [portagens](/notes/" + TOLLS_FINES_ACCIDENTS_GUIDE_SLUG + ").",
      "Сядьте на CP Intercidades/AP: Coimbra ~€15–25; Lisboa ~€25–35.",
      "Сравните FlixBus: Porto–Lisboa от ~€8; ночные рейсы экономят отель.",
      "Проверьте Ryanair domestic за 4–8 недель off-season; багаж платный.",
      "Не путайте бесплатный проезд residentes Porto (lepta 07.2026) с Andante.",
    ],
  },
  {
    heading: "Бронирование: Booking, turismo rural, parques",
    section_kind: "practice",
    paragraphs: [
      "Off-season часто даёт минус тридцать–пятьдесят процентов к лету — и это главный козырь релоканта, у которого отпуск не привязан к школьным каникулам Европы. На Booking красиво; на WhatsApp и IBAN у хозяина quinta иногда дешевле. В por_tugal летом 2025 обсуждали интеграцию Idealista с Rentalia — те же дома, что на Booking, иногда выгоднее напрямую.",
      "Длинные выходные и школьные каникулы разбирают за шесть–восемь недель. Parques naturais часто бесплатны на вход, но ночёвка — только в designated campsites или aldeias; visitor centers обычно €2–5. Open House Porto — семьдесят с лишним зданий (lepta, лето 2025); museum free days — [льготы с ВНЖ](/notes/" +
        LGOTY_GUIDE_SLUG +
        "). «Бесплатный parque» не отменяет правил ночёвки и parking — это выясняется уже у шлагбаума, когда хочется просто прилечь.",
      "Главное: длинные выходные бронируйте за 6–8 недель; «бесплатный parque» не отменяет правил ночёвки и parking.",
    ],
    bullets: [
      "Сравните Booking / Airbnb: aldeia в Minho €50–80 off-season vs €120+ летом.",
      "Ищите turismo rural / agroturismo напрямую — часто WhatsApp + IBAN.",
      "Проверьте Rentalia / Idealista férias за 6–8 недель до длинных выходных.",
      "Уточните правила parques: вход часто бесплатный; ночёвка — только designated.",
      "Отметьте Open House Porto и free days — [льготы с ВНЖ](/notes/" + LGOTY_GUIDE_SLUG + ").",
    ],
  },
  {
    heading: "Сезоны, толпы и взгляд релоканта",
    section_kind: "practice",
    paragraphs: [
      "Планируйте не как турист «впервые в Европе», а как житель: shoulder season, будни, и понимание, что São João — не «просто фейерверки», а неделя, когда Porto не ваш. Август на побережье — цены вдвое, CP переполнен, risco de incêndio режет мангал в parque natural; в chatlisboa летом 2025 это обсуждали как ежегодную реальность, не страшилку.",
      "Лучшие окна — апрель–июнь и сентябрь–октябрь для Douro и Minho; Algarve — май или сентябрь. Guimarães и Braga в субботу crowded; Coimbra и Aveiro спокойнее во вторник–четверг. Дождь Norte не отменяет поездку: музеи, wine cellars Douro, термальные купальни Gerês работают и без солнца. Carte de residente / título de residência на monumentos и CP — [льготы](/notes/" +
        LGOTY_GUIDE_SLUG +
        ").",
      "Главное: апр–июнь и сен–окт для Douro/Minho; Algarve — май или сентябрь; пики São João, 1–15 августа и Easter в Óbidos обходите.",
    ],
    bullets: [
      "Выберите окна: апр–июнь и сен–окт для Douro/Minho; Algarve — май/сентябрь.",
      "Избегайте пиков: последняя неделя июня (São João), 1–15 августа, Easter в Óbidos.",
      "Сравните будни и выходные: Guimarães/Braga crowded в субботу; Aveiro/Coimbra — вторник–четверг.",
      "Не отменяйте поездку из‑за дождя Norte — музеи, cellars, термы работают.",
      "Возьмите carte de residente на monumentos и CP — [льготы](/notes/" + LGOTY_GUIDE_SLUG + ").",
    ],
  },
  {
    heading: "Бюджет, семья с детьми, питомцы",
    section_kind: "practice",
    paragraphs: [
      "«Дешёвый уикенд» легко превращается в €300, если забыть portagem, парковку arrumadores — уличных «парковщиков», на которых в por_tugal зимой 2025 жаловались на навязчивость — и платный parking у пляжа. С детьми и собакой правила другие: praia летом часто ban cães, parque natural — поводок; pet-friendly на Booking без переписки с хозяином — лотерея.",
      "Ориентир на двоих с машиной: бензин €40–80 плюс portagem €20–50 плюс жильё €80–150 плюс еда €60–120 — итого €200–400. CP-день в Aveiro или Coimbra: билеты €30–50, еда €40–60, moliceiro €30 — около €100–140. С детьми — Oceanário в Lisboa, Zoo Santo Inácio в Vila Nova Gaia, «moving sands» Praia da Adraga (chatlisboa), Guimarães castle. Аптечка и SNS24 — [медицина Norte](/notes/" +
        MEDITSINA_NORTE_HEALTHCARE_SLUG +
        ").",
      "Главное: заложите реальный бюджет на транспорт + питание + активности; pet policy подтверждайте у хозяина до оплаты.",
    ],
    bullets: [
      "Посчитайте уикенд на машине: €200–400 на двоих с жильём и едой.",
      "Сравните CP-день Aveiro/Coimbra: ~€100–140 на двоих с moliceiro.",
      "Возьмите детей: Oceanário, Zoo Santo Inácio, Adraga, Guimarães castle.",
      "Уточните ban cães на praia летом и поводок в parque natural.",
      "Отфильтруйте pet-friendly: Booking + подтверждение; turismo rural часто +€10–20/ночь.",
    ],
  },
  {
    heading: "Где портал и чаты расходятся с реальностью",
    section_kind: "gap",
    paragraphs: [
      "Официальный сайт и Booking дают уверенность — а на месте сдвинутое расписание CP, платная парковка у cascata и «pet friendly до 10 кг». Это не повод не ехать; повод сверить greves, написать хозяину quinta и выехать раньше девяти. Доверяйте, но перепроверяйте в день выезда — особенно CP, pet policy и «бесплатный» parque с платной parking lot.",
      "Главное: greves, pet policy и parking у cascatas сверяйте в день выезда — не в день бронирования месяц назад.",
    ],
    bullets: [
      "Сверьте CP.pt с реальностью — Porto–Aveiro сдвигали на 20–40 мин (lepta, лето 2025).",
      "Приезжайте к Gerês до 9:00 — у популярных cascatas parking платный летом.",
      "Напишите хозяину до оплаты: «pet friendly» ≠ любой вес без доплаты.",
      "Бронируйте Douro historic train за 2–4 недели (сезон июл–окт).",
      "Не путайте бесплатный транспорт residentes Porto с туристическим Andante.",
    ],
  },
  {
    heading: "Типичные ошибки релокантов",
    section_kind: "practice",
    paragraphs: [
      "Большинство промахов — не «не туда поехали», а «поехали как все туристы в пик сезона без брони и без Via Verde». Вы уже живёте здесь — используйте это: shoulder season, churrasqueira на quinta вместо мангала в parque летом, проверка greves перед CP. Август на Algarve, поезд в день забастовки и Instagram-location в Douro без брони quinta к одиннадцати — три классики, которые дорого обходятся.",
      "Главное: август на Algarve, CP в день greve и мангал в parque летом — три ошибки, которые проще обойти, чем потом оплачивать.",
    ],
    bullets: [
      "Не ездите на Algarve в август «как все» — жара 40 °C+, цены и толпы; лучше май/сентябрь.",
      "Не полагайтесь на Instagram-locations в Douro без брони — parking full к 11:00.",
      "Проверьте greves перед CP — 03.06.2026 отменяла рейсы (lepta); cp.pt/greves.",
      "Не жарьте мангал в parque natural летом — risco de incêndio, multa; churrasqueira на quinta.",
      "Не игнорируйте [portagens](/notes/" + TOLLS_FINES_ACCIDENTS_GUIDE_SLUG + ") на «коротком» A1 до Óbidos — €15–20 OW.",
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
    a: "Бюджет CP+quinta: €120–200 (билеты ~€40, turismo rural €80–120, еда €40–60). Машина: +€40–70 бензин/portagem. Historic train + boat — от €50–80/чел сверху; бронируйте заранее — в lepta летом 2025 советовали не тянуть.",
  },
  {
    q: "Когда ехать в Algarve, если не турист?",
    a: "Май или сентябрь: тепло, меньше толп, жильё −30%. Август — экстремальная жара и цены (lepta, лето 2025). Ryanair OPO–FAR off-season от ~€25 OW; 3–4 ночи minimum.",
  },
  {
    q: "Есть ли бесплатные музеи с ВНЖ?",
    a: "Да, часть monumentos и cultural sites — льготы для residentes и бесплатные дни. Подробный список и carte — [льготы с ВНЖ](/notes/" + LGOTY_GUIDE_SLUG + "). Open House Porto — отдельные бесплатные выходные (lepta, лето 2025).",
  },
  {
    q: "Можно ли брать собаку в parque natural и на пляж?",
    a: "В parque natural — на поводке, иногда запрет на определённые trilhos. Пляжи летом часто ban cães; уточняйте placards. Ferry/tagus — в chatlisboa писали, что с собакой можно; жильё — фильтр pets + подтверждение у хозяина.",
  },
  {
    q: "CP или FlixBus Porto–Lisboa?",
    a: "CP Intercidades быстрее (~2h45) и комфортнее, €25–35. FlixBus дешевле (от ~€8), 3h30–4h; ночной рейс экономит отель. При greves (lepta) проверяйте оба расписания в день выезда.",
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
  title: "Выходные из Porto: дороги Norte, Douro и дальше — внутренний туризм 2026",
  excerpt:
    "Суббота жителя Norte: Minho, Douro, Gerês, Aveiro, Coimbra; потом Alentejo, Algarve и острова. CP, машина, turismo rural, бюджет, дети и pets — без туристического спектакля августа.",
  seo_title: "Выходные из Porto 2026 — Minho, Douro, Gerês",
  seo_description:
    "Внутренний туризм из Porto 2026: Minho, Douro, Gerês на 1–2 дня; CP, FlixBus, Via Verde, turismo rural, parques ICNF и льготы residente — для жителя Norte.",
  quick_answer:
    "Пятница вечером вы смотрите на карту так, как смотрят на жизнь, в которой уже есть понедельник. Braga была десять раз, в Algarve все едут в августе, а вы — residente с работой и желанием увидеть долину, а не чужой пик сезона. Из Porto на выходные логичны Minho, Douro и Gerês на машине или CP; Aveiro и Coimbra — день поездом. Юг и Azores — off-season и Ryanair. Бронируйте turismo rural заранее; льготы на музеи — с ВНЖ.",
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
  source_label: "editorial:50-signals+grok-remarque-pass",
};
