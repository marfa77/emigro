/**
 * Norte wines & wineries — Douro / Port / Vinho Verde for relocants (stories + logistics).
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { formatPracticeTakeaway } from "@/lib/community-notes/practice-format";
import { CAR_PORTUGAL_GUIDE_SLUG } from "@/lib/community-notes/guides/car-portugal-buy-rent-import";
import { DOMESTIC_TOURISM_NORTE_SLUG } from "@/lib/community-notes/guides/domestic-tourism-portugal-norte";
import { TOLLS_FINES_ACCIDENTS_GUIDE_SLUG } from "@/lib/community-notes/guides/tolls-fines-accidents-norte-portugal";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const WINES_WINERIES_NORTE_SLUG = "vina-vinodelni-norte-douro-vinho-verde-2026";

const GLOSSARY_INTRO =
  "Слова с этикетки, с сайта quinta и с билета на Linha do Douro — чтобы «Vintage» и «Vinho Verde» не путались у дегустационного стола.";

const DISCLAIMER =
  "**Emigro:** энотуризм и культура вина — не приглашение садиться за руль после дегустации. Такси/Uber/CP домой; в Португалии за рулём с алкоголем — штрафы и риск для ВНЖ. Цены и слоты 2026 уточняйте на сайтах quinta. Фото в гайде — с сайтов производителей (см. подписи). Не юридическая консультация.";

const IMG = "/images/community-notes/inline/vina-norte";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(glossaryForSlug(WINES_WINERIES_NORTE_SLUG)!, GLOSSARY_INTRO),
    paragraphs: [GLOSSARY_INTRO, DISCLAIMER],
  },
  {
    heading: "Официально: карта вин Norte",
    section_kind: "official",
    paragraphs: [
      "Зачем вам это сейчас: вы живёте в Porto/Braga — Douro и Vinho Verde в 1–2 часах, а не «когда-нибудь в отпуск». Понимать DOC/DOP и кто регулирует Port — чтобы не купить сувенирный сироп вместо настоящего портвейна.",
      "Что делать: выучить три опоры Norte — **Douro** (тихие вина + Port), **Porto/Gaia** (lodges и погреба), **Vinho Verde** (Minho) — и официальные органы.",
      "Главное: регион Douro — один из старейших demarcated wine regions в мире (**1756**, указ маркиза де Помбала); контроль Port — через **IVDP**.",
    ],
    bullets: [
      "IVDP (Instituto dos Vinhos do Douro e do Porto) — сертификация Port и Douro, правила Vintage / LBV / Tawny: ivdp.pt.",
      "CVRVV / Comissão de Viticultura da Região dos Vinhos Verdes — Vinho Verde DOC: vinhoverde.pt.",
      "Visit Porto & Norte / Turismo do Porto e Norte — маршруты энотуризма (не замена сайту конкретной quinta).",
      "UNESCO: Alto Douro Wine Region (2001) — террасы socalcos как культурный ландшафт, не «просто Instagram».",
      "Linha do Douro (CP) — historic scenic rail Porto–Régua–Pinhão–Pocinho; расписание и historic trains: cp.pt.",
      "Выходные вокруг вина — часть [внутреннего туризма Norte](/notes/" + DOMESTIC_TOURISM_NORTE_SLUG + ").",
    ],
  },
  {
    heading: "История, которую стоит знать за бокалом",
    section_kind: "practice",
    paragraphs: [
      "Что делать: взять 4–5 историй — они делают дегустацию живой и отличают релоканта от круизного туриста «two glasses and selfie».",
      "Зачем: Douro продают как пейзаж; сила региона — в политике, реке и британских торговых домах.",
    ],
    images: [
      {
        src: `${IMG}/taylors-douro.webp`,
        alt: "Террасы виноградников Douro — вид с пятой Taylor’s",
        caption: "Socalcos Douro — ландшафт UNESCO, не только фон для selfie.",
        credit: "Taylor’s",
        creditUrl: "https://www.taylor.pt/",
      },
      {
        src: `${IMG}/taylors-terrace.webp`,
        alt: "Терраса и вид у Taylor’s в Vila Nova de Gaia",
        caption: "Погреба на южном берегу: дегустация «в Порту» часто начинается с моста в Gaia.",
        credit: "Taylor’s",
        creditUrl: "https://www.taylor.pt/en/visit-taylors",
      },
    ],
    bullets: [
      "**1756, Помбал:** королевский указ создал demarcação Douro — борьба с фальсификатом портвейна и хаосом урожаев. Вы пьёте продукт региона с кадастром, а не «домашнее» без контроля.",
      "**Rabelo:** плоские лодки везли бочки Port вниз по Douro к Gaia до железной дороги и плотин. Сегодня rabelo у Ribeira — в основном символ; настоящая логистика ушла на грузовики и склад в Gaia.",
      "**Почему Gaia, а не Porto:** погреба (lodges) исторически стояли на южном берегу — налоги, влажность, складская традиция британских house (Taylor’s, Graham’s, Sandeman, Fonseca…). Дегустация «в Порту» часто = прогулка по мосту в **Vila Nova de Gaia**.",
      "**Филоксера (конец XIX):** тля уничтожила европейские виноградники; Douro выжил через американские подвои и перестройку. Поэтому «старые лозы» — отдельная ценность (и цена).",
      "**Quinta do Noval Nacional:** крошечный участок несвойственного корнесобственного виноградника (не на американском подвое) — легенда Vintage; бутылки уходят в коллекционеров. История не про «купите в Duty Free», а про редкость.",
      "**Vinho Verde ≠ «зелёное вино»:** название от молодости вина и региона Minho (зелёные холмы), не от цвета. Бывает белое, красное, розе; игристость лёгкая — часто от остаточного CO₂, не обязательно «шампанский метод».",
      "**Alvarinho (Monção e Melgaço):** северный Minho у границы с Испанией — флагманский белый сорт Vinho Verde; соседи называют тот же сорт Albariño. Пересечение границ в бокале — буквально.",
      "**Виндима (урожай):** сентябрь–октябрь — давка ногами в лагарах ещё встречается на традиционных quinta; современность — техника и сортировочные столы. Энотуризм в сезон бронируют заранее.",
    ],
  },
  {
    heading: "Douro: тихие вина, Port и как выбрать маршрут",
    section_kind: "practice",
    paragraphs: [
      "Что делать: разделить день «Gaia lodges» (город) и день «долина» (Régua / Pinhão) — это разные жанры.",
      "Зачем: круиз из Ribeira без quinta = красиво, но поверхностно; quinta без плана дороги = усталость и portagens.",
    ],
    images: [
      {
        src: `${IMG}/sandeman-seixo.webp`,
        alt: "Виноградники Quinta do Seixo в долине Douro",
        caption: "Quinta do Seixo (Sandeman) — классика долины: террасы + тур + дегустация по слоту.",
        credit: "Sandeman",
        creditUrl: "https://www.sandeman.com/",
      },
      {
        src: `${IMG}/sandeman-seixo-winery.webp`,
        alt: "Погреб и производство на Quinta do Seixo",
        caption: "В долине смотрите не только вид с круиза — зайдите в winery/cellar на quinta.",
        credit: "Sandeman",
        creditUrl: "https://www.sandeman.com/",
      },
    ],
    bullets: [
      "**Тихие Douro (DOC Douro):** Touriga Nacional, Touriga Franca, Tinta Roriz (Tempranillo), Tinta Barroca — красные; белые — Viosinho, Rabigato, Gouveio. Ищите Douro на этикетке отдельно от Port.",
      "**Port — стили коротко:** Ruby / Reserve (молодой фруктовый); Late Bottled Vintage (LBV); Vintage (год + долгая выдержка в бутылке после короткой в бочке); Tawny 10/20/30/40 (окислительная выдержка в бочке); White Port + тоник — лёгкий аперитив в жару.",
      "**Peso da Régua:** «ворота» долины, музеи, отправная точка круизов; CP и A4 удобны из Porto (~1h15 авто).",
      "**Pinhão:** открыточная станция с azulejos про виндиму; вокруг — плотная концентрация quinta на холмах. Идеальная база на 1 ночь.",
      "**Quinta с визитом (ориентиры, слоты на сайте):** Quinta do Crasto, Quinta do Seixo (Sandeman), Quinta da Pacheca (с отелем), Quinta do Bomfim (Dow’s), Quinta do Noval, Quinta do Portal — бронируйте timed tasting; walk-in летом часто отказ.",
      "**Круиз 1–2 ч vs полный день:** короткий boat из Régua/Pinhão — пейзаж; полный день Porto↔Barca d’Alva — круизный продукт, меньше «вина», больше «реки». Для релоканта чаще выгоднее CP + 1–2 quinta.",
      "**Бюджет дегустации:** городской lodge в Gaia часто €15–35 за flight; quinta в долине €25–60+ с туром по винограднику; lunch на quinta €40–80. Цены 2026 плавают — смотрите офсайт.",
    ],
  },
  {
    heading: "Gaia lodges: день без машины",
    section_kind: "practice",
    paragraphs: [
      "Что делать: один субботний день — метро/пешком в Gaia, 2 lodge максимум, прогулка по Cais de Gaia, закат на Ribeira без героизма «все погреба подряд».",
      "Главное: после третьего Tawny история Помбала уже не усваивается.",
    ],
    images: [
      {
        src: `${IMG}/taylors-lodge.webp`,
        alt: "Визит в lodge Taylor’s в Gaia",
        caption: "Taylor’s — удобный старт: сад, вид, понятный visitor centre.",
        credit: "Taylor’s",
        creditUrl: "https://www.taylor.pt/en/visit-taylors",
      },
      {
        src: `${IMG}/grahams-lodge.webp`,
        alt: "Бочки в aging lodge Graham’s",
        caption: "Graham’s — бочки и терраса; один lodge глубже, чем шесть «на бегу».",
        credit: "Graham’s Port",
        creditUrl: "https://www.grahams-port.com/visit-us",
      },
      {
        src: `${IMG}/grahams-visit.webp`,
        alt: "Дегустация и визит у Graham’s",
        caption: "Бронь timed tasting на сайте бренда — walk-in летом часто отказ.",
        credit: "Graham’s Port",
        creditUrl: "https://www.grahams-port.com/",
      },
      {
        src: `${IMG}/sandeman-gaia.webp`,
        alt: "Винный опыт в погребах Sandeman в Porto/Gaia",
        caption: "Sandeman Porto cellars — ещё одна точка на карте Gaia без машины.",
        credit: "Sandeman",
        creditUrl: "https://www.sandeman.com/",
      },
    ],
    bullets: [
      "Классика для первого раза: **Taylor’s** (сад + вид), **Graham’s** (терраса), **Sandeman** (икона в шляпе), **Cálem** / **Ferreira** ближе к набережной — удобно без подъёмов.",
      "Билеты: online на сайте бренда или через партнёров; в высокий сезон (апрель–октябрь) слоты утром и после 16:00 разбирают быстрее.",
      "Как добраться: метро D (amarela) до Jardim do Morro / General Torres + подъём; или автобус/Uber из centro Porto; пешком по Dom Luís I — красиво, но жарко летом.",
      "Покупки: duty-free миф на месте; в lodge shop цены туристические. Для дома — Garrafeira (специализированный магазин) в Porto/Matosinhos часто лучше по выбору тихих Douro.",
      "Еда рядом: Cais de Gaia — рестораны с видом; не путайте «wine experience lunch» quinta с быстрым bifana у вокзала.",
    ],
  },
  {
    heading: "Vinho Verde и Minho: из Браги и Порту",
    section_kind: "practice",
    paragraphs: [
      "Что делать: отдельный выезд на север Minho (Monção / Melgaço / Ponte de Lima) или quinta ближе к Braga/Guimarães — не смешивать с Douro в один день.",
      "Зачем: стиль вина другой (свежесть, низкий алкоголь часто 11–12%), и дороги другие (N-ки, не только A4).",
    ],
    images: [
      {
        src: `${IMG}/moncao-vinhas.webp`,
        alt: "Виноградники Adega de Monção в регионе Vinho Verde",
        caption: "Monção / Melgaço — родина Alvarinho; отдельный день из Braga, не «хвост» после Douro.",
        credit: "Adega de Monção",
        creditUrl: "https://adegademoncao.pt/",
      },
      {
        src: `${IMG}/moncao-adega.webp`,
        alt: "Adega de Monção — вид на кооператив",
        caption: "Кооператив Adega de Monção — честная точка входа в Alvarinho без пафоса lodge Gaia.",
        credit: "Adega de Monção",
        creditUrl: "https://adegademoncao.pt/",
      },
      {
        src: `${IMG}/moncao-muralhas.webp`,
        alt: "Бутылка Muralhas de Monção белого Vinho Verde",
        caption: "Muralhas — узнаваемая этикетка Alvarinho; лучше купить у adega/garrafeira, чем «сувенир» в аэропорту.",
        credit: "Adega de Monção",
        creditUrl: "https://adegademoncao.pt/",
      },
    ],
    bullets: [
      "**Маршрут дня из Braga:** Ponte de Lima (мост + vinho verde bars) → опционально Viana do Castelo к океану; или север до Monção за Alvarinho.",
      "**Quinta / adega (ориентиры):** Solar de Merufe, Quinta da Lixa, Adega de Monção (кооператив — честная цена на Alvarinho), Quinta do Ameal (Loureiro) — проверяйте визиты на сайте.",
      "**Еда к Vinho Verde:** морепродукты Minho, bacalhau, petiscos; летом — сад и тень, не «тяжёлый Vintage после полудня».",
      "**Фестивали урожая / вина:** местные festas da vindima и ярмарки — даты у камер муниципального turismo; общий фон сезона — [фестивали 2026](/notes/festivali-portugalii-2026-muzyka-porto-norte).",
      "Транспорт: CP до Nine/Viana + автобус; машина удобнее для adega — [авто](/notes/" + CAR_PORTUGAL_GUIDE_SLUG + ") и [portagens](/notes/" + TOLLS_FINES_ACCIDENTS_GUIDE_SLUG + ").",
    ],
  },
  {
    heading: "Пошагово: спланировать эно-выходные из Porto",
    section_kind: "action_guide",
    paragraphs: [
      "Зачем вам это сейчас: без порядка «слот → дорога → кто трезвый водитель» получается либо сорванная quinta, либо штраф GNR.",
      "Что делать: выбрать формат (Gaia / Douro day / Minho day) → бронь → транспорт → лимит бокалов → ночлег при необходимости.",
      "Главное: один фокус на день; Douro + Vinho Verde за сутки — плохой план.",
    ],
    bullets: [
      "Шаг 1 — Формат: A) только Gaia lodges; B) CP/авто Régua–Pinhão + 1–2 quinta; C) Minho Alvarinho. Не смешивать B и C.",
      "Шаг 2 — Бронь: timed tasting на сайте quinta/lodge за 3–14 дней (летом — раньше); подтверждение на телефон/email сохранить offline.",
      "Шаг 3 — Дорога: Gaia — метро/пешком; Douro — CP Linha do Douro до Régua/Pinhão или A4 + N222 (живописная, узкая); заложить portagem и время на серпантин.",
      "Шаг 4 — Водитель: заранее назначить sober driver / Uber / ночь в Pinhão. Дегустация ≠ «я нормально поеду».",
      "Шаг 5 — Что взять: удобная обувь на гравий quinta, SPF, вода, лёгкая куртка (ветер на террасах), переводчик PT на телефоне для сомелье.",
      "Шаг 6 — Покупки: 1–2 бутылки с смыслом (год/стиль), не ящик «на всех в чате»; багаж Ryanair помнит о стекле.",
      "Шаг 7 — После: вода, еда, не планировать сложный AIMA-слот на утро после Vintage vertical.",
    ],
  },
  {
    heading: "Где чаты и этикетка расходятся",
    section_kind: "gap",
    bullets: [
      "Чат: «Port = сладкое дешёвое из супермаркета» → настоящий Port сертифицирует IVDP; digests «портвейн» в РФ ≠ DOC Porto.",
      "Чат: «Vinho Verde всегда игристое и кислое» → стиль разный; хороший Alvarinho может быть серьёзным и тихим.",
      "«Бесплатная дегустация без брони в августе на топовой quinta» → редко; чаще платный timed tour.",
      "«Круиз из Ribeira = вы видели весь Douro» → вы видели реку у города; террасы UNESCO — выше по долине.",
      "«После трёх бокалов на N222 нормально» → нет; GNR и извилистая дорога не прощают «я же дегустировал профессионально».",
    ],
  },
  {
    heading: "Типичные ошибки релокантов на винном маршруте",
    section_kind: "practice",
    paragraphs: [
      "Оптимально: один lodge + одна quinta за уикенд, с историей и без эпоса. Ошибки ниже — классика por_tugal после первого «wine day».",
    ],
    bullets: [
      "Ошибка: шесть lodges подряд в Gaia — вкусовое небо отключается после третьего.",
      "Ошибка: приехать в Pinhão без брони quinta в сентябре (виндима + туристы).",
      "Ошибка: путать Ruby Port с тихим Douro DOC на ужин к стейку — стили и сахар разные.",
      "Ошибка: вести машину после дегустации «потому что все так делают».",
      "Ошибка: купить ящик сувенирного Tawny в аэропорту и удивиться, что друзья в Лиссабоне пьют лучше за те же деньги в garrafeira.",
      "Ошибка: ждать, что каждый гид расскажет про Помбала и филоксеру — иногда это fast selfie-tour; читайте заранее.",
      "Ошибка: планировать Douro day с детьми без тени/воды — террасы летом +35 °C.",
    ],
  },
];

const keyTakeaways = [
  "Официально: Port и Douro контролирует IVDP; Vinho Verde — отдельный DOC Minho; Alto Douro — UNESCO с 2001.",
  formatPracticeTakeaway({
    channels: ["por_tugal", "lepta"],
    period: "2025–2026",
    claim:
      "релоканту в Porto выгоднее связка «1 день Gaia lodges + 1 день Régua/Pinhão с бронью quinta», чем бесконечный круиз без вкуса",
    forReader: "история Помбала и rabelo запоминается лучше, чем десятый бокал без плана",
  }),
  formatPracticeTakeaway({
    channels: ["por_tugal"],
    period: "2026",
    claim:
      "N222 и серпантин после дегустации — частая тема штрафов и страхов; трезвый водитель или ночёвка в долине важнее «ещё одной quinta»",
    forReader: "энотуризм без плана дороги быстро становится проблемой с GNR",
  }),
  "Расхождение: «портвейн из супермаркета» и сертифицированный Port — разные вселенные; смотрите IVDP и этикетку DOC.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "С чего начать, если я в Порту и никогда не был на quinta?",
    a: "День 1: один–два lodge в Vila Nova de Gaia (Taylor’s / Graham’s / Sandeman) с бронью онлайн. День 2: CP или авто до Régua/Pinhão + одна забронированная quinta. Не смешивайте с Vinho Verde в тот же день.",
  },
  {
    q: "Чем Port отличается от вина Douro?",
    a: "По правилам Port — креплёное вино региона Douro с сертификацией IVDP и выдержкой по стилям (Ruby, LBV, Vintage, Tawny…). Тихие вина Douro DOC — обычные (не креплёные) красные/белые с тех же холмов. На этикетке разные обозначения.",
  },
  {
    q: "Как добраться в долину без машины?",
    a: "Linha do Douro (CP) из Porto Campanhã до Régua и Pinhão — живописный и рабочий вариант. Дальше — такси/трансфер quinta или пешие короткие визиты у станции. Расписание и occasional historic trains — на cp.pt. Круизы — отдельно.",
  },
  {
    q: "Что такое Vinho Verde и куда ехать из Браги?",
    a: "DOC на северо-западе (Minho): свежие вина, часто с лёгкой игристостью. Для Alvarinho целитесь в Monção/Melgaço; для мягкого дня — Ponte de Lima и окрестные adega. Бронь визита на сайте производителя.",
  },
  {
    q: "Можно ли дегустировать и сразу вести машину?",
    a: "По правилам и здравому смыслу — нет. Назначьте трезвого водителя, Uber/такси или ночёвку. Штрафы за álcool ao volante реальны; для релоканта это ещё и риск для статуса. Emigro не считает «wine day» оправданием.",
  },
  {
    q: "Где читать официальные правила и маршруты?",
    a: "IVDP (Port/Douro), сайт Vinho Verde (CVRVV), Visit Porto & Norte для туристических маршрутов, CP для поезда. Конкретные слоты и цены — только сайт выбранной quinta или lodge.",
  },
];

export const WINES_WINERIES_NORTE_GUIDE = {
  slug: WINES_WINERIES_NORTE_SLUG,
  category: "Досуг",
  content_kind: "guide" as ContentKind,
  title: "Вина и винодельни Norte: Douro, Port, Vinho Verde — маршруты, истории и дегустации",
  excerpt:
    "Douro и Port с историей Помбала и rabelo, lodges в Gaia, Vinho Verde и Alvarinho, бронь quinta, CP Linha do Douro и трезвый план дороги для релокантов в Porto/Braga.",
  seo_title: "Вина Norte — Douro, Port, Vinho Verde 2026",
  seo_description:
    "Вина и винодельни Norte 2026: Douro, портвейн, Vinho Verde, Gaia lodges, quinta, CP и истории региона — практический гайд для релокантов в Порту и Браге.",
  quick_answer:
    "Живя в Порту, вы в часе от UNESCO-террасов Douro и в двух — от Alvarinho у границы с Испанией. Не начинайте с ящика «портвейна» из супермаркета: день в Gaia lodges (Taylor’s, Graham’s) + день Régua/Pinhão с бронью quinta даст и вкус, и историю — указ Помбала 1756, rabelo, филоксера, погреба на южном берегу. Vinho Verde — отдельный выезд в Minho. Билет на дегустацию ≠ право садиться за руль на N222.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "IVDP — Douro e Porto", url: "https://www.ivdp.pt/" },
    { title: "Vinho Verde — CVRVV", url: "https://www.vinhoverde.pt/" },
    { title: "Visit Porto & Norte", url: "https://www.visitportoandnorth.travel/" },
    { title: "UNESCO — Alto Douro Wine Region", url: "https://whc.unesco.org/en/list/1046/" },
    { title: "CP — Comboios de Portugal", url: "https://www.cp.pt/" },
    { title: "Taylor’s Port", url: "https://www.taylor.pt/" },
    { title: "Graham’s Port", url: "https://www.grahams-port.com/" },
  ],
  topic_tags: ["dosug", "portugal", "norte", "vino", "douro"],
  hashtags: buildNoteHashtags({
    topicTags: ["dosug", "portugal", "norte"],
    contentKind: "guide",
    extra: ["porto", "douro", "vinhoverde", "gaia", "enoturismo"],
  }),
  source_channel: "editorial+official",
  source_label: "editorial:wines-wineries-norte-2026",
};
