/**
 * Portugal regions for relocants — climate, rent, expat vibe by NUTS II.
 * Visual canon: Emigro atlas icons + map vignettes (inline/regioes-portugal).
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

function zoneVisuals(id: string, place: string, symbolCaption: string): NoteBodyImage[] {
  return [
    {
      src: `${IMG}/${id}-symbol.webp`,
      alt: `${place} — символ региона`,
      caption: symbolCaption,
      credit: CANON,
      fit: "contain",
    },
    {
      src: `${IMG}/${id}-map.webp`,
      alt: `${place} на карте Португалии`,
      caption: `${place} на карте страны`,
      credit: CANON,
    },
  ];
}
const GLOSSARY_INTRO =
  "Слова, которые всплывут в объявлении на Idealista, в разговоре с coworking-админом и на assembleia condomínio — разберём заранее, пока вы ещё выбираете не город, а регион.";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(glossaryForSlug(PORTUGAL_REGIONS_EXPAT_GUIDE_SLUG)!, GLOSSARY_INTRO),
  },
  {
    heading: "Официально: регионы Portugal (NUTS II) и что они значат",
    section_kind: "official",
    paragraphs: [
      "Виза и AIMA привязаны к стране, а жизнь — к concelho, климату и рынку труда конкретного региона. Семь макрорегионов NUTS II задают рамку: от них зависят IMI, SNS по morada, школы и реальная стоимость жизни. «Португалия» в Instagram — не один вайб; Lisboa, Algarve и Norte живут по разным правилам аренды и сезонности.",
      "Главное: сначала сценарий (работа, remote, семья, пенсия), потом уже concelho и bairro — не наоборот.",
    ],
    images: [
      {
        src: `${IMG}/overview.webp`,
        alt: "Обзорная карта макрорегионов Португалии",
        caption: "Norte, Lisboa, Centro, Alentejo, Algarve и острова — одна карта перед shortlist",
        credit: CANON,
      },
    ],
    bullets: [
      "Norte (Grande Porto + Minho) — второй по ВВП регион; AIMA balcões Porto/Braga/Marco de Canaveses.",
      "Lisboa e Vale do Tejo — столица, максимум expat-инфраструктуры и цен на жильё.",
      "Centro — Coimbra, Aveiro, Leiria; университеты, промышленность, умеренные цены.",
      "Alentejo — Évora, Beja; сельхоз, туризм, жара и разреженная expat-среда.",
      "Algarve — Фару, Лагуш; туризм, англоязычный пузырь, сезонность.",
    ],
  },
  {
    heading: "Grande Porto и Norte: tech, море, Minho",
    section_kind: "practice",
    paragraphs: [
      "Norte часто становится базой для семьи, remote и техспециалистов — с детальным выбором между Porto, Braga, Matosinhos и побережьем. Здесь сильнейшая expat-инфраструктура севернее Лиссабона при аренде примерно на 15–30% ниже capital. Porto держит urban coastal vibe, Braga — university town, Matosinhos — компромисс море и commute; сравнение для семьи — в [Порту vs Брага](/notes/" +
        PORTO_VS_BRAGA_FAMILY_SCHOOLS_SLUG +
        ").",
      "Главное: Norte закрывает школы, SNS и coworking без цен Lisboa — если готовы к влажности и парковке в centro histórico.",
    ],
    images: zoneVisuals("norte", "Norte", "Порт и атлантический берег — якорь Grande Porto / Minho"),
    bullets: [
      "Сверьте экономику: tech и remote hubs, Douro, manufacturing Braga/Guimarães; зарплаты ниже Lisboa на 10–20%.",
      "Проверьте школы и хабы: OBS/CLIP/LFIP/Deutsche в Porto, CLIB в Braga; coworking CRU, Porto i/o, Braga Startup.",
      "Учтите климат: атлантический, humid зимой; лето до 40 °C — [климат Norte](/notes/" + NORTE_CLIMATE_COMFORT_SLUG + ").",
      "Сравните аренду T2 (2026): Foz €1 100–1 600, Matosinhos €900–1 300, Braga €700–1 000; [покупка](/notes/" + APARTMENT_BUY_SLUG + ").",
      "Закройте логистику: SNS Santo António/Braga, CP до Lisboa ~2h40; заложите парковку в centro histórico.",
    ],
  },
  {
    heading: "Lisboa e Vale do Tejo: гравитация столицы",
    section_kind: "practice",
    paragraphs: [
      "Lisboa имеет смысл, если работа или стартап в capital, нужен максимум англоязычной среды или Cascais schools. Здесь плотность digital nomads, InterNations и international schools — но аренда и commute съедают бюджет. Cascais, Oeiras и Sintra тянут expat-магнитом; centro Lisboa отвечает шумом, heat islands и T2 в диапазоне €1 400–2 200.",
      "Главное: столица даёт карьеру и события, если бюджет T2 и пробки A5/IP7 уже заложены в план.",
    ],
    images: zoneVisuals("lisboa", "Lisboa e Vale do Tejo", "Тежу и столичная дуга — якорь Lisboa / Cascais"),
    bullets: [
      "Оцените рынок: финансы, туризм, стартапы, госсектор; вакансии в Lx, конкуренция за жильё выше.",
      "Сверьте школы и хабы: St Julian's, IPS, Carlucci, United Lisbon; AIMA Saldanha — очереди.",
      "Учтите климат: суше Norte; лето +35–40 °C в бетонном centro; зимой без отопления в старых T2 холодно.",
      "Сравните аренду T2 (2026): Cascais €1 500–2 500, Oeiras €1 200–1 800, centro €1 400–2 200; Cascais line 40–60 мин.",
      "Примите trade-off: аэропорт и события vs цены и меньше «локальной» Португалии в expat-пузыре.",
    ],
  },
  {
    heading: "Algarve: пенсия, туризм, английский пузырь",
    section_kind: "practice",
    paragraphs: [
      "Algarve подходит для retirement, seasonal life или remote — если вы готовы к тишине зимой. Солнца и англоязычных сервисов максимум, но экономика и соцсеть сильно зависят от сезона. Летом шумно и дорого; с ноября по март многие рестораны закрыты, expat-активность падает.",
      "Главное: берите Algarve на солнце и английский быт, а не на круглогодичный tech-рынок и школы tier-1.",
    ],
    images: zoneVisuals("algarve", "Algarve", "Скалы и praia — якорь Faro / Lagos"),
    bullets: [
      "Оцените экономику: туризм, golf, недвижимость; зимой без remote рабочие места редеют.",
      "Проверьте expat-среду: британцы, голландцы, немцы; Facebook Faro/Lagos/Albufeira; школ мало — смотрите Lx/Porto.",
      "Учтите климат: 300+ солнечных дней; лето сухое +35 °C; зима +12–18 °C, дожди короткие.",
      "Сравните аренду T2 (2026): Faro €900–1 400, Lagos/Albufeira €1 000–1 600 (лето +30%).",
      "Закройте минусы: сезонность, слабый tech, удалённость от Porto и Lisboa.",
    ],
  },
  {
    heading: "Centro и Alentejo: студенты, тишина, жара",
    section_kind: "practice",
    paragraphs: [
      "Centro берут ради бюджета и университетской среды; Alentejo — ради slow life и remote с авто. Цены ниже, но expat-инфраструктура разреженная: без португальского интеграция медленнее. Coimbra и Aveiro держат молодой вайб и каналы; Alentejo отвечает пустыми дорогами, жарой до +40 °C летом и редкими expat-встречами.",
      "Главное: дешёвое жильё и природа здесь реальны — expat-network и international schools почти нет.",
    ],
    images: [
      ...zoneVisuals("centro", "Centro", "Университет и каналы — якорь Coimbra / Aveiro"),
      ...zoneVisuals("alentejo", "Alentejo", "Пробковые дубы и равнина — якорь Évora / Beja"),
    ],
    bullets: [
      "Сверьте Centro: Coimbra, Aveiro, Leiria; T2 €650–1 000.",
      "Сверьте Alentejo: Évora (UNESCO), Beja; T2 €500–850; expat — единичные remote и винодельни.",
      "Планируйте интеграцию через PT-курсы и festas — coworking и international schools редки.",
      "Учтите климат: Centro умеренный; Alentejo — жаркое лето и холодные зимние ночи.",
      "Заложите commute до аэропортов 2–3 ч — это цена тишины.",
    ],
  },
  {
    heading: "Madeira и Açores: острова и remote-ниша",
    section_kind: "practice",
    paragraphs: [
      "Острова имеют смысл для remote с готовностью к логистике и изоляции. Madeira продвигает digital nomad visa и coworking; Açores дают природу и тишину, но перелёты дороже и чаще срываются погодой. Вайб «курорт + remote» — не Porto и не Lisboa по школам, больницам tier-1 и аренде off-season.",
      "Главное: острова — отдельный быт; сравнивайте с материком через [внутренний туризм Norte](/notes/" + DOMESTIC_TOURISM_SLUG + "), а не через один weekend.",
    ],
    images: zoneVisuals("ilhas", "Madeira e Açores", "Островной горизонт — якорь Funchal / Ponta Delgada"),
    bullets: [
      "Сверьте Madeira (Funchal): nomad-хабы, мягкий климат; T2 €800–1 300; перелёт Lisboa ~1h45.",
      "Сверьте Açores (Ponta Delgada): вулканы, whale-watching; T2 €600–1 000; EN/RU чаты редки.",
      "Оцените экономику: туризм, банан, вино, рыба; tech-рынок минимален.",
      "Примите минусы: логистика, ураганы на Açores, SNS слабее материковых hub.",
      "Сравните масштаб поездок с [внутренним туризмом Norte](/notes/" + DOMESTIC_TOURISM_SLUG + ").",
    ],
  },
  {
    heading: "Пошагово: как выбрать регион под ваш сценарий",
    section_kind: "action_guide",
    paragraphs: [
      "Сначала честно назовите сценарий — работа, remote, семья или пенсия — и только потом сверстайте shortlist с климатом и арендой ниже. Красивый город на фото и удобный быт на три года редко совпадают без trade-off. Бюджет T2 и готовность к expat-пузырю или к интеграции решают раньше, чем фильтр Idealista по «виду на море».",
      "Главное: сценарий и бюджет T2 раньше concelho; пузырь против интеграции — осознанный выбор, не случайность.",
    ],
    bullets: [
      "Выберите офис в PT → Lisboa/Porto/Braga по работодателю; remote → Norte или Algarve off-season по бюджету.",
      "Закройте семью через Norte/Lisboa и [международные школы](/notes/" + INTERNATIONAL_SCHOOLS_GUIDE_SLUG + "); Centro — público + PT.",
      "Проверьте пенсию в Algarve/Alentejo на сезонность и SNS hospital в радиусе 30 мин.",
      "Соберите shortlist 3 concelhos и 2 недели AL-аренды в разных сезонах — [аренда Norte](/notes/" + PORTO_BRAGA_LONG_TERM_RENT_SLUG + ").",
      "Начните интеграцию с InterNations, Meetup, coworking и festas; русскоязычный Telegram — старт, не финал.",
    ],
  },
  {
    heading: "Климат и аренда T2: сравнение регионов 2026",
    section_kind: "practice",
    paragraphs: [
      "Ориентиры по сезонам и renta берите из Idealista и чатов релокантов, не из «средней по Португалии». Один регион может быть на 40% дешевле другого при той же площади T2. Norte отвечает влажностью, Alentejo и Algarve — жарой, Lisboa — heat island; острова стабильнее по погоде, но дороже перелётом.",
      "Главное: сравнивайте humidade, жару и €/мес по T2 в одном листе — иначе shortlist снова соберётся по красивым карточкам.",
    ],
    bullets: [
      "Сверьте климат: Norte +14/+32 °C и humidade 80–95%; Lisboa суше; Algarve 300+ солнца; Alentejo до +40 °C.",
      "Сравните аренду T2 (€/мес, 2026): Foz 1 100–1 600; Cascais 1 500–2 500; Coimbra 700–1 000; Faro 900–1 400; Évora 550–850.",
      "Оцените expat density: Lisboa/Cascais >> Porto >> Algarve >> Centro >> Alentejo >> Açores.",
      "Закройте commute до аэропорта: Porto ~20 мин; Lisboa 30–50; Faro ~15; Funchal ~20; Ponta Delgada ~10.",
      "Решите покупка vs аренда: Norte — [покупка](/notes/" + APARTMENT_BUY_SLUG + "); в Lx конкуренция выше на €/m².",
    ],
  },
  {
    heading: "Где Instagram и чаты расходятся с реальностью",
    section_kind: "gap",
    paragraphs: [
      "Красивые карточки стоит сверять с сезонностью, арендой и плотностью expat-пузыря. Разочарование на третьем месяце дороже двух недель пробы в разных регионах. Португалия не однородна: у каждого региона свой минус, который reels обычно прячут.",
      "Главное: верьте сезону и Idealista сильнее, чем одному ролику про «вечное лето» или «дешёвый Porto».",
    ],
    bullets: [
      "Не копируйте «Algarve круглый год как лето» — зимой сервисы закрываются, встречи редеют.",
      "Не ждите Porto «вдвое дешевле Lisboa» в Foz/Matosinhos — экономия в Braga/Guimarães, не в Ribeira.",
      "Не рассчитывайте на английский везде: в Alentejo/Centro без PT быт и врачи сложнее.",
      "Не путайте remote на острове с Porto: перелёты, доставка и SNS-специалисты реже.",
      "Не ищите international school «в любом городе» — 90% в Lisboa/Porto; иначе público или commute.",
    ],
  },
  {
    heading: "Типичные ошибки при выборе региона",
    section_kind: "practice",
    paragraphs: [
      "Решение «по одному видео» дорого обходится: смена региона после ВНЖ и школы тянет сильнее, чем две недели AL-аренды на старте. Закладывайте пробный период в разных сезонах и думайте горизонтом на три года, а не отпускной неделей.",
      "Главное: выбирайте регион под трёхлетний сценарий семьи или remote — не под одну солнечную неделю в июле.",
    ],
    bullets: [
      "Не выбирайте Algarve по фото июля — в ноябре praia пустые, кафе закрыты.",
      "Не ищите Cascais без бюджета T2 €1 500+ — «дешёвый Cascais» съест полгода поиска.",
      "Не берите Braga «ради тишины» при офисе в Porto — два часа commute в день съедают вайб.",
      "Не игнорируйте климат Norte: без AC и desumidificador — [климат](/notes/" + NORTE_CLIMATE_COMFORT_SLUG + ").",
      "Не живите только в expat-пузыре — без PT сложнее SNS, школа plan B и местные друзья.",
    ],
  },
];

const keyTakeaways = [
  "Сегодня: определите сценарий (работа/remote/семья/пенсия) — от него зависит shortlist регионов, не наоборот.",
  "Официально: жизнь привязана к concelho (IMI, SNS, школы); NUTS II — макро-ориентир для климата и экономики.",
  formatPracticeTakeaway({
    channels: ["por_tugal", "chatlisboa"],
    period: "2025–2026",
    claim: "Norte даёт лучший баланс expat-инфраструктуры и цены аренды",
    forReader:
      "Lisboa сильнее для карьеры и international schools, но дороже; Algarve привлекателен сезоном — зимой инфраструктура тоньше",
  }),
  "Расхождение: «английский везде» и «дешёвая Португалия» — миф; без PT в Centro/Alentejo быт сложнее.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Куда переехать в Португалии с семьёй и детьми?",
    a: "По правилам школ и SNS важен concelho с morada. На практике Norte (Porto/Braga) или Lisboa/Cascais — из-за international schools и expat-среды; подробнее в [международных школах](/notes/" + INTERNATIONAL_SCHOOLS_GUIDE_SLUG + ") и [Порту vs Брага](/notes/" + PORTO_VS_BRAGA_FAMILY_SCHOOLS_SLUG + ").",
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
    a: "Суше — Lisboa и Algarve. Влажнее — Norte (Porto, Matosinhos). По IPMA зимой humidade 80–95% на побережье Norte; см. [гайд по климату Norte](/notes/" + NORTE_CLIMATE_COMFORT_SLUG + ").",
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
    "Norte, Lisboa, Algarve, Centro, Alentejo, Madeira и Açores — expat-комьюнити, экономика, погода, аренда T2, плюсы и минусы для релокантов. Честный региональный гид.",
  seo_title: "Регионы Португалии 2026 — куда ехать",
  seo_description:
    "Где жить в Португалии 2026: регионы, экспаты, климат, аренда T2 и вайб. Norte, Lisboa, Algarve, Centro, Alentejo, острова — честный гид для релокантов.",
  quick_answer:
    "Вы листаете Idealista и ловите себя на мысли: Porto, Cascais и Faro — будто три разные страны в одной визе. Так и есть по быту. В Norte — expat-плотность и international schools без цен Lisboa; в Algarve — солнце и сезонность; в Centro — бюджет, но меньше инфраструктуры. Аренда T2: Braga от €700, Cascais до €2 500 — выбирайте не «красивое фото», а неделю семьи.",
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
  source_label: "editorial:portugal-regions+voice-pass",
};
