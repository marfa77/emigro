/**
 * Portugal regions for relocants — climate, rent, expat vibe by NUTS II.
 * Remarque leisure voice. Visual canon: Emigro atlas (inline/regioes-portugal).
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { formatPracticeTakeaway } from "@/lib/community-notes/practice-format";
import { INTERNATIONAL_SCHOOLS_GUIDE_SLUG } from "@/lib/community-notes/guides/international-schools-portugal";
import { NORTE_CLIMATE_COMFORT_SLUG } from "@/lib/community-notes/guides/norte-climate-comfort";
import { PORTO_BRAGA_LONG_TERM_RENT_SLUG } from "@/lib/community-notes/guides/porto-braga-long-term-rent";
import { PORTO_VS_BRAGA_FAMILY_SCHOOLS_SLUG } from "@/lib/community-notes/guides/porto-vs-braga-family-schools";
import type {
  CommunityNoteFaq,
  ContentKind,
  NoteBodyImage,
  NoteBodySection,
} from "@/lib/community-notes/types";

export const PORTUGAL_REGIONS_EXPAT_GUIDE_SLUG = "regiony-portugalii-ekspaty-klimat-tseny-2026";

const APARTMENT_BUY_SLUG = "kupit-kvartiru-portugaliya-norte-2026";
const DOMESTIC_TOURISM_SLUG = "turizm-vnutri-portugalii-norte-2026";

const IMG = "/images/community-notes/inline/regioes-portugal";
const CANON = "Emigro · Portugal regions atlas";

/** Map first (full-bleed), then symbol — woven through the section, not a tiny strip. */
function zoneVisuals(id: string, place: string, symbolCaption: string): NoteBodyImage[] {
  return [
    {
      src: `${IMG}/${id}-map.webp`,
      alt: `${place} на карте Португалии`,
      caption: `${place} на карте страны`,
      credit: CANON,
      fit: "cover",
    },
    {
      src: `${IMG}/${id}-symbol.webp`,
      alt: `${place} — символ региона`,
      caption: symbolCaption,
      credit: CANON,
      fit: "contain",
    },
  ];
}

const GLOSSARY_INTRO =
  "Слова с Idealista, из coworking и с собрания condomínio — чтобы NUTS II, concelho и T2 не слились в одно «Португалия», пока вы ещё выбираете не улицу, а климат.";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(glossaryForSlug(PORTUGAL_REGIONS_EXPAT_GUIDE_SLUG)!, GLOSSARY_INTRO),
  },
  {
    heading: "Одна виза — разные утра",
    section_kind: "official",
    paragraphs: [
      "На бумаге вы уже «в Португалии». Утром выясняется другое: в Porto соль на стекле, в Cascais очередь за кофе на английском, в Faro в ноябре половина esplanada закрыта, а в Évora асфальт греет подошвы уже в мае. Виза и AIMA привязаны к стране. Жизнь — к concelho, влажности, школе и тому, сколько стоит T2 в вашей реальной неделе, а не в среднем по Instagram.",
      "Семь макрорегионов NUTS II — не экзамен по географии. Это рамка, от которой зависят IMI, SNS по morada, рынок труда и то, сколько раз в месяц вам захочется уехать «куда угодно, лишь бы не сюда». Lisboa, Algarve и Norte живут по разным правилам аренды и сезонности; путать их — всё равно что выбирать квартиру по открытке аэропорта.",
      "Главное: сначала сценарий — работа, remote, семья, пенсия — потом уже карта. Concelho и bairro приходят третьими.",
    ],
    images: [
      {
        src: `${IMG}/overview.webp`,
        alt: "Обзорная карта макрорегионов Португалии",
        caption: "Norte, Lisboa, Centro, Alentejo, Algarve и острова — одна карта перед shortlist",
        credit: CANON,
        fit: "cover",
      },
    ],
    bullets: [
      "Держите в голове Norte: Grande Porto и Minho, AIMA в Porto/Braga.",
      "Отдельно считайте Lisboa e Vale do Tejo — максимум инфраструктуры и цен.",
      "Сверьте Centro (Coimbra, Aveiro, Leiria) — университеты и умеренная renta.",
      "Не смешивайте Alentejo с «тихим Algarve»: жара, сельхоз, разреженный expat.",
      "Заложите Algarve как сезон: солнце и английский пузырь, зима другая.",
    ],
  },
  {
    heading: "Norte: соль, tech и второй город страны",
    section_kind: "practice",
    paragraphs: [
      "В Grande Porto утро пахнет Атлантикой даже вдали от воды. Здесь собирают семьи, remote и техспециалистов, которым нужен не «дешёвый юг», а школы, coworking и больница без эпоса. Аренда обычно на пятнадцать–тридцать процентов ниже столицы — и это чувствуется, когда Idealista перестаёт быть наказанием. Porto держит город у океана, Braga — университетский ритм, Matosinhos — море плюс commute; для семьи сравнение уже разобрано в [Порту vs Брага](/notes/" +
        PORTO_VS_BRAGA_FAMILY_SCHOOLS_SLUG +
        ").",
      "Tech, Douro, manufacturing в Braga и Guimarães — экономика не туристическая витрина. OBS, CLIP, LFIP, Deutsche в Porto, CLIB в Braga; зимой humidade напоминает о себе быстрее, чем любой чат. Лето бывает до сорока — см. [климат Norte](/notes/" +
        NORTE_CLIMATE_COMFORT_SLUG +
        "). Foz тянет T2 к €1 100–1 600, Matosinhos спокойнее, Braga ещё ниже; покупку разбирали отдельно — [гайд Norte](/notes/" +
        APARTMENT_BUY_SLUG +
        ").",
      "Главное: Norte закрывает школы, SNS и хабы без цен Lisboa — если вы готовы к соли на раме и парковке в centro histórico.",
    ],
    images: zoneVisuals("norte", "Norte", "Порт и атлантический берег — якорь Grande Porto / Minho"),
    bullets: [
      "Сверьте школы и хабы: OBS/CLIP/LFIP/Deutsche, CLIB; coworking CRU, Porto i/o, Braga Startup.",
      "Сравните аренду T2 (2026): Foz €1 100–1 600, Matosinhos €900–1 300, Braga €700–1 000.",
      "Учтите климат и [влажность](/notes/" + NORTE_CLIMATE_COMFORT_SLUG + ") — desumidificador не роскошь.",
      "Закройте логистику: SNS Santo António/Braga, CP до Lisboa ~2h40.",
      "Не путайте Ribeira с «дешёвым Porto» — экономия живёт восточнее и в Braga.",
    ],
  },
  {
    heading: "Lisboa: гравитация, от которой устают ноги",
    section_kind: "practice",
    paragraphs: [
      "Столица не спрашивает, готовы ли вы. Она просто тянет: работа, стартап, InterNations, школа в Cascais, ночной рейс, очередь в AIMA Saldanha. Здесь densest digital-nomad воздух страны — и самый дорогой T2. Cascais, Oeiras и Sintra манят англоязычной средой; centro Lisboa отвечает жарой бетона, шумом и арендой €1 400–2 200, будто вы платите не за метры, а за право быть в центре карты.",
      "Финансы, туризм, стартапы, госсектор — вакансии густеют здесь же, где конкуренция за жильё. Климат суше Norte, но летом +35–40 °C в каменном котле; зимой старый T2 без отопления холодит так же честно. Cascais line сорок–шестьдесят минут — это не «рядом», это ежедневный торг с собой.",
      "Главное: Lisboa даёт карьеру и события, если бюджет T2 и пробки A5/IP7 вы уже прожили в голове — не на третьем месяце.",
    ],
    images: zoneVisuals("lisboa", "Lisboa e Vale do Tejo", "Тежу и столичная дуга — якорь Lisboa / Cascais"),
    bullets: [
      "Сверьте школы: St Julian's, IPS, Carlucci, United Lisbon — и заложите admissions заранее.",
      "Сравните аренду T2 (2026): Cascais €1 500–2 500, Oeiras €1 200–1 800, centro €1 400–2 200.",
      "Примите commute Cascais line 40–60 мин как часть бюджета нервов.",
      "Не ждите «локальной» Португалии внутри плотного expat-пузыря — она рядом, но не в том же кафе.",
      "Держите plan B по жилью: один «идеальный Cascais» съедает полгода поиска.",
    ],
  },
  {
    heading: "Algarve: лето, которое заканчивается",
    section_kind: "practice",
    paragraphs: [
      "В июле Algarve обещает вечность: скалы, praia, английский в меню, golf и ощущение, что вы навсегда выбрали солнце. К ноябрю меню редеет, esplanada закрываются, встречи редеют — и выясняется, что вы купили не климат, а сезон. Для retirement, seasonal life или remote с любовью к тишине зимой регион честен. Для круглогодичного tech и школ tier-1 — нет.",
      "Три сотни солнечных дней, сухое лето под +35 °C, мягкая зима. Faro держит T2 около €900–1 400, Lagos и Albufeira летом прибавляют примерно треть. International schools почти нет — смотрите Lisboa или Porto. Экономика живёт туризмом и недвижимостью; без remote зимой рынок труда тонкий, как off-season пляж.",
      "Главное: берите Algarve на солнце и английский быт — и отдельно проживите ноябрь до перевода caução.",
    ],
    images: zoneVisuals("algarve", "Algarve", "Скалы и praia — якорь Faro / Lagos"),
    bullets: [
      "Проживите off-season неделю до долгосрочного contrato.",
      "Сравните аренду T2: Faro €900–1 400; Lagos/Albufeira летом +~30%.",
      "Не рассчитывайте на international school «на месте» — чаще Lx/Porto или público.",
      "Закройте remote заранее: зимой локальных вакансий мало.",
      "Примите удалённость от Porto и Lisboa как цену тишины и света.",
    ],
  },
  {
    heading: "Centro: студенты, каналы, спокойный бюджет",
    section_kind: "practice",
    paragraphs: [
      "Coimbra всё ещё пахнет университетом — в хорошем смысле: молодой шум, старые камни, аренда, которая не требует второго паспорта ради T2. Aveiro отвечает каналами и более тихим tech; Leiria — промышленностью без открытки. Centro берут те, кому важнее бюджет и воздух, чем плотность InterNations. Без португальского интеграция здесь медленнее: никто не будет переводить вам быт из вежливости.",
      "T2 часто укладывается в €650–1 000. Климат умеренный, без алгарвийской витрины и без столичной духоты. International schools и густой coworking — редкость; школа plan B и PT-курсы — не опция, а инфраструктура.",
      "Главное: Centro даёт цену и студенческий ритм — expat-сеть здесь надо строить, её не выдают на стойке coworking.",
    ],
    images: zoneVisuals("centro", "Centro", "Университет и каналы — якорь Coimbra / Aveiro"),
    bullets: [
      "Сверьте Coimbra / Aveiro / Leiria под работу, учёбу и бюджет T2 €650–1 000.",
      "Заложите PT-курсы и местные festas — англоязычный пузырь тонкий.",
      "Не ждите OBS/CLIP «как в Porto» — школы чаще público или commute.",
      "Учтите дорогу до аэропортов: 2–3 часа — цена тишины.",
      "Сравните с Norte, если нужны international schools без столичных цен.",
    ],
  },
  {
    heading: "Alentejo: жара, пробковый лес и редкие голоса",
    section_kind: "practice",
    paragraphs: [
      "За Лиссабоном на юг карта редеет. Évora держит UNESCO и туристический день; дальше — пустые дороги, пробковые дубы, винодельни и лето, которое жжёт асфальт под +40 °C. Alentejo выбирают ради slow life и remote с машиной, не ради встреч дважды в неделю. Expat здесь — единичные голоса, не плотность Cascais.",
      "T2 часто €500–850. Зимние ночи холодные, больница и школа — вопрос километров, не приложений. Английский в быту не спасает: без PT врачи и Câmara звучат иначе. Это не «дешёвый Algarve» — это другой край страны.",
      "Главное: Alentejo честен про тишину и жару; нечестным будет ждать здесь Porto по школам и SNS.",
    ],
    images: zoneVisuals("alentejo", "Alentejo", "Пробковые дубы и равнина — якорь Évora / Beja"),
    bullets: [
      "Сверьте Évora / Beja и радиус до hospital до просмотра дома.",
      "Заложите авто: без машины rural Alentejo быстро становится островом.",
      "Учтите жару: AC и режим дня летом — не «приятный бонус».",
      "Планируйте интеграцию через PT и festas, не через Facebook-группы на тысячу человек.",
      "Сравните аренду T2 €500–850 с тем, что вы теряете в инфраструктуре.",
    ],
  },
  {
    heading: "Madeira и Açores: остров, который не отпускает на день",
    section_kind: "practice",
    paragraphs: [
      "Остров обещает remote с видом и мягким воздухом — и держит слово, пока вы не вспомните про школу tier-1, узкого специалиста SNS или билет «на вторник». Madeira продвигает nomad-хабы и coworking в Funchal; Açores дают вулканы и тишину, но рейсы чаще спорят с погодой. Это уже не weekend из Porto — другой быт. Масштаб материковых поездок — в [внутреннем туризме Norte](/notes/" +
        DOMESTIC_TOURISM_SLUG +
        ").",
      "T2 в Funchal ориентир €800–1 300, в Ponta Delgada часто ниже. Климат Madeira ровнее материка; логистика, доставка и глубина медицины — слабее Grande Porto. Tech-рынок тонкий: вы привозите работу с собой или принимаете тишину как профессию.",
      "Главное: острова — отдельная жизнь; не сравнивайте их с Porto по одному солнечному сторис.",
    ],
    images: zoneVisuals("ilhas", "Madeira e Açores", "Островной горизонт — якорь Funchal / Ponta Delgada"),
    bullets: [
      "Сверьте Madeira: nomad-хабы, T2 €800–1 300, перелёт Lisboa ~1h45.",
      "Сверьте Açores: природа, T2 €600–1 000, запас на погодные сдвиги рейсов.",
      "Примите минусы: логистика, редкие специалисты SNS, тонкий tech.",
      "Не везите семью «на красивый климат» без плана школ и больницы.",
      "Сравните с материком через [туризм Norte](/notes/" + DOMESTIC_TOURISM_SLUG + ").",
    ],
  },
  {
    heading: "Как выбрать регион, не купив открытку",
    section_kind: "action_guide",
    paragraphs: [
      "Назовите сценарий вслух: работа в офисе, remote, семья со школой, пенсия. Пока слова не сказаны, Idealista будет подсовывать виды на воду вместо вашей реальной недели. Красивый город на фото и удобный быт на три года редко совпадают без trade-off — и это нормально, если trade-off выбран вами, а не алгоритмом ленты.",
      "Дальше — бюджет T2, готовность к expat-пузырю или к интеграции, климат, который вы переживёте в феврале. Shortlist из трёх concelhos и две недели AL в разных сезонах дешевле, чем смена региона после школы и ВНЖ. Аренду Norte разбирали отдельно — [долгосрок](/notes/" +
        PORTO_BRAGA_LONG_TERM_RENT_SLUG +
        ").",
      "Главное: сценарий и бюджет T2 раньше фильтра «море в кадре»; пузырь против интеграции — осознанный выбор.",
    ],
    bullets: [
      "Выберите офис → Lisboa/Porto/Braga по работодателю; remote → Norte или Algarve off-season.",
      "Закройте семью через Norte/Lisboa и [школы](/notes/" + INTERNATIONAL_SCHOOLS_GUIDE_SLUG + ").",
      "Проверьте пенсию в Algarve/Alentejo на зиму и hospital в радиусе 30 мин.",
      "Соберите 3 concelhos и 2 недели AL в разных сезонах.",
      "Начните интеграцию с Meetup, coworking и festas — Telegram на русском только старт.",
    ],
  },
  {
    heading: "Климат и аренда T2: один лист, разные страны",
    section_kind: "practice",
    paragraphs: [
      "«Средняя Португалия» не существует в вашем радиаторе и в вашем IBAN. Norte отвечает влажностью 80–95% зимой; Lisboa — сухостью и heat island; Algarve — солнцем и off-season пустотой; Alentejo — жарой до +40 °C. Один и тот же T2 может отличаться на сорок процентов между регионами — и это ещё до того, как вы посчитаете отопление, AC и нервы на commute.",
      "Ориентиры 2026 из рынка и чатов: Foz €1 100–1 600, Cascais €1 500–2 500, Coimbra €700–1 000, Faro €900–1 400, Évora €550–850. Плотность expat падает от Cascais к Açores почти по карте. Покупку в Norte смотрите отдельно — [квартира](/notes/" +
        APARTMENT_BUY_SLUG +
        ").",
      "Главное: сверьте humidade, жару и €/мес по T2 в одном листе — иначе shortlist снова соберётся из reels.",
    ],
    bullets: [
      "Сверьте климат: Norte влажный; Lisboa суше; Algarve 300+ солнца; Alentejo до +40 °C.",
      "Сравните T2 (€/мес): Foz 1 100–1 600; Cascais 1 500–2 500; Coimbra 700–1 000; Faro 900–1 400; Évora 550–850.",
      "Оцените expat density: Lisboa/Cascais >> Porto >> Algarve >> Centro >> Alentejo >> Açores.",
      "Закройте commute до аэропорта до выбора «тихого» concelho.",
      "Решите покупка vs аренда до sinal — в Lx конкуренция на €/m² выше.",
    ],
  },
  {
    heading: "Где Instagram и чаты расходятся с реальностью",
    section_kind: "gap",
    paragraphs: [
      "Reels обещают вечное лето, дешёвый Porto и английский в каждой farmácia. На третьем месяце приходит другая страна: закрытые кафе в Algarve, Foz по цене почти Lisboa, врач в Alentejo без вашего языка. Разочарование здесь дороже двух недель честной пробы — и дешевле, чем смена региона после matrícula.",
      "Португалия не однородна. У каждого региона свой минус, который красиво обрезают в кадре. Верьте сезону и Idealista сильнее, чем одному ролику.",
      "Главное: сверяйте открытку с февралём и с вашей реальной неделей — не с чужим отпуском.",
    ],
    bullets: [
      "Не копируйте «Algarve круглый год» — зимой сервисы редеют.",
      "Не ждите Porto «вдвое дешевле Lisboa» в Foz — экономия восточнее и в Braga.",
      "Не рассчитывайте на английский в Centro/Alentejo без PT.",
      "Не путайте remote на острове с инфраструктурой Porto.",
      "Не ищите international school «везде» — 90% в Lisboa/Porto.",
    ],
  },
  {
    heading: "Типичные ошибки при выборе региона",
    section_kind: "practice",
    paragraphs: [
      "Одно видео июля стоит дорого, если по нему выбирают три года жизни. Смена региона после ВНЖ и школы тянет сильнее двух недель AL на старте. Закладывайте разные сезоны и думайте горизонтом семьи или remote — не горизонтом отпуска.",
      "Algarve по фото, Cascais без бюджета, Braga «ради тишины» при офисе в Porto, Norte без desumidificador, жизнь только в пузыре без PT — всё это уже проходили в чатах. Вам не обязательно повторять сюжет.",
      "Главное: выбирайте регион под трёхлетний сценарий — не под одну солнечную неделю.",
    ],
    bullets: [
      "Не выбирайте Algarve только по июлю — проживите ноябрь.",
      "Не ищите Cascais без бюджета T2 €1 500+.",
      "Не берите Braga при ежедневном офисе в Porto без честного счёта часов.",
      "Не игнорируйте [климат Norte](/notes/" + NORTE_CLIMATE_COMFORT_SLUG + ").",
      "Не живите только в пузыре — без PT сложнее SNS и школа plan B.",
    ],
  },
];

const keyTakeaways = [
  "Сегодня: назовите сценарий (работа, remote, семья, пенсия) — от него зависит shortlist регионов.",
  "Официально: жизнь привязана к concelho (IMI, SNS, школы); NUTS II задаёт климат и экономику.",
  formatPracticeTakeaway({
    channels: ["por_tugal", "chatlisboa"],
    period: "2025–2026",
    claim: "Norte даёт лучший баланс expat-инфраструктуры и цены аренды",
    forReader:
      "Lisboa сильнее для карьеры и international schools, но дороже; Algarve честен сезоном — зимой инфраструктура тоньше",
  }),
  "Расхождение: «английский везде» и «дешёвая Португалия» — миф; без PT в Centro/Alentejo быт сложнее.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Куда переехать в Португалии с семьёй и детьми?",
    a: "По правилам школ и SNS важен concelho с morada. На практике Norte (Porto/Braga) или Lisboa/Cascais — из-за international schools и expat-среды; подробнее в [международных школах](/notes/" +
      INTERNATIONAL_SCHOOLS_GUIDE_SLUG +
      ") и [Порту vs Брага](/notes/" +
      PORTO_VS_BRAGA_FAMILY_SCHOOLS_SLUG +
      ").",
  },
  {
    q: "Где дешевле жить: Porto, Lisboa или Algarve?",
    a: "Ориентир T2 2026: Braga €700–1 000, Porto Matosinhos €900–1 300, Lisboa centro €1 400–2 200, Faro €900–1 400. На практике Algarve летом +30% к аренде; Lisboa — самый дорогой макрорегион.",
  },
  {
    q: "Где больше expat-комьюнити, кроме русскоязычных чатов?",
    a: "Lisboa/Cascais и Porto (Foz/Boavista) — InterNations, Meetup, coworking, international schools. Algarve — англоязычные retirees. Centro/Alentejo — разреженная среда; интеграция через PT и местные festas.",
  },
  {
    q: "Подходит ли Algarve для remote-работы круглый год?",
    a: "Да, если бюджет и готовность к тихой зиме. По инфраструктуре Porto/Lisboa сильнее (coworking, перелёты, больницы). На практике многие nomads зимуют в Norte/Lx, летом — Algarve.",
  },
  {
    q: "Какой климат лучше для чувствительных к влажности?",
    a: "Суше — Lisboa и Algarve. Влажнее — Norte (Porto, Matosinhos). По IPMA зимой humidade 80–95% на побережье Norte; см. [гайд по климату Norte](/notes/" +
      NORTE_CLIMATE_COMFORT_SLUG +
      ").",
  },
  {
    q: "Стоит ли выбирать Madeira вместо материка?",
    a: "Для remote с любовью к природе — да. Для семьи со школами tier-1 и частых перелётов — чаще Porto/Lisboa. T2 Funchal €800–1 300; логистика и SNS — слабее, чем в Grande Porto.",
  },
];

export const PORTUGAL_REGIONS_EXPAT_GUIDE = {
  slug: PORTUGAL_REGIONS_EXPAT_GUIDE_SLUG,
  category: "Жильё и быт",
  content_kind: "guide" as ContentKind,
  title: "Регионы Португалии 2026: куда переехать — экспаты, экономика, климат, цены и вайб",
  excerpt:
    "Norte, Lisboa, Algarve, Centro, Alentejo, Madeira и Açores — не одна страна в Instagram. Климат, аренда T2 и плотность expat — честный гид по макрорегионам.",
  seo_title: "Регионы Португалии 2026 — куда ехать",
  seo_description:
    "Где жить в Португалии 2026: регионы, экспаты, климат, аренда T2 и вайб. Norte, Lisboa, Algarve, Centro, Alentejo, острова — честный гид для релокантов.",
  quick_answer:
    "Вы листаете Idealista — Porto, Cascais, Faro — и чувствуете, что это три разные страны в одной визе. Так и есть по быту. В Norte соль на стекле и школы без цен Lisboa; в Algarve июль врёт про ноябрь; в Centro бюджет дышит, а английский — нет. T2: Braga от €700, Cascais до €2 500. Выбирайте неделю семьи, не кадр из отпуска.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "INE — Estatísticas regionais", url: "https://www.ine.pt/" },
    { title: "IPMA — Clima", url: "https://www.ipma.pt/" },
    { title: "Idealista — аренда", url: "https://www.idealista.pt/arrendar-casas/" },
    { title: "Turismo de Portugal", url: "https://www.visitportugal.com/" },
    { title: "AIMA", url: "https://aima.gov.pt/" },
  ],
  topic_tags: ["arenda", "portugal"],
  hashtags: buildNoteHashtags({
    topicTags: ["arenda", "portugal"],
    contentKind: "guide",
    extra: ["регионы", "porto", "lisboa", "algarve", "экспаты", "климат", "norte"],
  }),
  source_channel: "chatlisboa+por_tugal+lepta",
  source_label: "editorial:portugal-regions+remarque-atlas",
};
