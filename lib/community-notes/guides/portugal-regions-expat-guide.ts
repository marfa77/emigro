/**
 * Hand-curated guide — voice «Опытный релокант за кофе» (lib/community-notes/editorial-voice.ts):
 * - quick_answer: микросцена-хук + 2 факта
 * - key_takeaways: max 4; glossary ≤8 с literary intro
 * - Each section: «зачем вам это сейчас» + «Что/Зачем» + «Главное: …»
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
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const PORTUGAL_REGIONS_EXPAT_GUIDE_SLUG = "regiony-portugalii-ekspaty-klimat-tseny-2026";

const APARTMENT_BUY_SLUG = "kupit-kvartiru-portugaliya-norte-2026";
const DOMESTIC_TOURISM_SLUG = "turizm-vnutri-portugalii-norte-2026";

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
      "Зачем вам это сейчас: виза и AIMA привязаны к стране, а жизнь — к concelho, климату и рынку труда конкретного региона.",
      "Что делать: понять семь макрорегионов NUTS II — от них зависят IMI, SNS по morada, школы и реальная стоимость жизни.",
      "Зачем: «Португалия» в Instagram — это не один вайб; Lisboa, Algarve и Norte живут по разным правилам аренды и сезонности.",
      "Главное: выбирайте регион под сценарий (работа, remote, семья, пенсия) — потом уже concelho и bairro.",
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
      "Что делать: рассматривать Norte как базу для семьи, remote и техспециалистов — с детальным выбором между Porto, Braga, Matosinhos и побережьем.",
      "Зачем: здесь сильнейшая expat-инфраструктура севернее Лиссабона при аренде на 15–30% ниже capital.",
      "Главное: Porto — urban coastal vibe; Braga — university town; Matosinhos — компромисс море + commute; подробнее по семье — в [Порту vs Брага](/notes/" +
        PORTO_VS_BRAGA_FAMILY_SCHOOLS_SLUG +
        ").",
    ],
    bullets: [
      "Экономика: tech (Blip, Farfetch, remote hubs), туризм Douro, manufacturing Braga/Guimarães; зарплаты ниже Lisboa на 10–20%, но и renta.",
      "Expat-среда: OBS/CLIP/LFIP/Deutsche в Porto, CLIB в Braga; Erasmus, бразильцы, UK/FR; coworking Porto (CRU, Porto i/o), Braga Startup.",
      "Климат: атлантический, humid зимой; лето до 40 °C — см. [климат Norte](/notes/" + NORTE_CLIMATE_COMFORT_SLUG + ").",
      "Аренда T2 (2026): Foz €1 100–1 600, Matosinhos €900–1 300, Braga €700–1 000; покупка — [гайд Norte](/notes/" + APARTMENT_BUY_SLUG + ").",
      "Плюсы: international schools, SNS Hospital Santo António/Braga, CP до Lisboa 2h40; минусы: влажность, парковка в centro histórico.",
    ],
  },
  {
    heading: "Lisboa e Vale do Tejo: гравитация столицы",
    section_kind: "practice",
    paragraphs: [
      "Что делать: ехать в Lisboa, если работа/стартап в capital, нужен максимум англоязычной среды или Cascais schools.",
      "Зачем: здесь плотность digital nomads, InterNations и international schools — но аренда и commute съедают бюджет.",
      "Главное: Cascais/Oeiras/Sintra — expat-магниты; centro Lisboa — шум, heat islands и T2 €1 400–2 200.",
    ],
    bullets: [
      "Экономика: финансы, туризм, стартапы, госсектор; вакансии концентрируются в Lx, но конкуренция за жильё выше.",
      "Expat-среда: St Julian's, IPS, Carlucci, United Lisbon; nomad-кластер Chiado/Parque das Nações; AIMA Saldanha — очереди.",
      "Климат: меньше humidade, чем Norte; лето +35–40 °C в бетонном centro; зима мягче, но без отопления в старых T2 холодно.",
      "Аренда T2 (2026): Cascais €1 500–2 500, Oeiras €1 200–1 800, Lisboa centro €1 400–2 200; commute Cascais line 40–60 мин.",
      "Плюсы: карьера, аэропорт, события; минусы: цены, пробки A5/IP7, меньше «локальной» Португалии в expat-пузыре.",
    ],
  },
  {
    heading: "Algarve: пенсия, туризм, английский пузырь",
    section_kind: "practice",
    paragraphs: [
      "Что делать: рассматривать Algarve для retirement, seasonal life или remote с готовностью к тишине зимой.",
      "Зачем: максимум солнца и англоязычных сервисов — но экономика и соцсеть сильно зависят от сезона.",
      "Главное: летом шумно и дорого; с ноября по март многие рестораны закрыты, expat-активность падает.",
    ],
    bullets: [
      "Экономика: туризм, golf, недвижимость, рыболовство; рабочие места сезонные; зимой без remote — сложнее.",
      "Expat-среда: британцы, голландцы, немцы; Facebook-группы Faro/Lagos/Albufeira; мало international schools (смотрите Lx/Porto).",
      "Климат: 300+ солнечных дней; лето сухое +35 °C; зима +12–18 °C, дожди короткие.",
      "Аренда T2 (2026): Faro €900–1 400, Lagos/Albufeira €1 000–1 600 (лето +30%); покупка популярна у retirees.",
      "Плюсы: море, безопасность, английский в быту; минусы: сезонность, слабый tech-рынок, удалённость от Porto/Lx.",
    ],
  },
  {
    heading: "Centro и Alentejo: студенты, тишина, жара",
    section_kind: "practice",
    paragraphs: [
      "Что делать: смотреть Centro для бюджета и университетской среды; Alentejo — для slow life и remote с авто.",
      "Зачем: цены ниже, но expat-инфраструктура разреженная; без португальского интеграция медленнее.",
      "Главное: Coimbra/Aveiro — молодой вайб и каналы; Alentejo — пустые дороги, +40 °C летом и редкие expat-встречи.",
    ],
    bullets: [
      "Centro: Coimbra (университет, студенты), Aveiro (каналы, tech-офисы поменьше), Leiria (промышленность); T2 €650–1 000.",
      "Alentejo: Évora (UNESCO), Beja (сельхоз); T2 €500–850; expat — единичные remote и винодельни.",
      "Expat-среда: мало coworking и international schools; интеграция через PT-курсы и местные festas.",
      "Климат Centro: умеренный океанический; Alentejo — континентальный, жаркое лето, холодные зимние ночи.",
      "Плюсы: доступное жильё, природа; минусы: слабый expat-network, commute до аэропортов 2–3 ч.",
    ],
  },
  {
    heading: "Madeira и Açores: острова и remote-ниша",
    section_kind: "practice",
    paragraphs: [
      "Что делать: рассматривать острова для remote с готовностью к логистике и изоляции.",
      "Зачем: Madeira продвигает digital nomad visa и coworking; Açores — природа и тишина, но перелёты дорогие.",
      "Главное: вайб «курорт + remote»; не ждите Porto/Lisboa по школам, больницам tier-1 и аренде off-season.",
    ],
    bullets: [
      "Madeira (Funchal): nomad-хабы, мягкий климат круглый год; T2 €800–1 300; перелёт Lisboa 1h45.",
      "Açores (Ponta Delgada): вулканы, whale-watching; T2 €600–1 000; expat — редкие EN/RU чаты.",
      "Экономика: туризм, сельхоз (банан, вино), рыба; tech-рынок минимален.",
      "Плюсы: природа, безопасность, сообщество nomads (Madeira); минусы: логистика, ураганы (Açores), слабый SNS tier-2.",
      "Сравните с материком: [внутренний туризм Norte](/notes/" + DOMESTIC_TOURISM_SLUG + ") — другой масштаб поездок.",
    ],
  },
  {
    heading: "Пошагово: как выбрать регион под ваш сценарий",
    section_kind: "action_guide",
    paragraphs: [
      "Что делать: пройти чеклист сценария — работа, remote, семья, пенсия — и сверить с таблицами климата и аренды ниже.",
      "Зачем: «красивый город на фото» и «удобный быт на 3 года» редко совпадают без честного trade-off.",
      "Главное: сначала сценарий и бюджет T2, потом concelho; expat-пузырь vs интеграция — осознанный выбор.",
    ],
    bullets: [
      "Офис в PT → Lisboa/Porto/Braga по локации работодателя; remote → Norte или Algarve off-season по бюджету.",
      "Семья с детьми → Norte/Lisboa из-за [международных школ](/notes/" + INTERNATIONAL_SCHOOLS_GUIDE_SLUG + "); Centro — público + PT.",
      "Пенсия → Algarve/Alentejo при готовности к сезонности; проверьте SNS hospital ближе 30 мин.",
      "Соберите shortlist 3 concelhos, 2 недели «пробной» аренды (AL) в разных сезонах — см. [аренда Norte](/notes/" + PORTO_BRAGA_LONG_TERM_RENT_SLUG + ").",
      "Интеграция: InterNations, Meetup, coworking, festas locais; русскоязычный Telegram — старт, не финал.",
    ],
  },
  {
    heading: "Климат и аренда T2: сравнение регионов 2026",
    section_kind: "practice",
    paragraphs: [
      "Что делать: сверить ориентиры по сезонам и renta — цифры из Idealista и чатов релокантов, не «средняя по Португалии».",
      "Зачем: один регион может быть на 40% дешевле другого при той же площади T2.",
      "Главное: Norte — влажность; Alentejo/Algarve — жара; Lisboa — heat island; острова — стабильнее, но дороже перелёт.",
    ],
    bullets: [
      "**Климат (типично):** Norte — +14 °C зима / +32 °C лето, humidade 80–95%; Lisboa — суше; Algarve — +300 солнца; Alentejo — жара +40 °C.",
      "**Аренда T2 (€/мес, 2026):** Norte Foz 1 100–1 600; Lisboa Cascais 1 500–2 500; Centro Coimbra 700–1 000; Algarve Faro 900–1 400; Alentejo Évora 550–850.",
      "**Expat density:** Lisboa/Cascais >> Porto >> Algarve >> Centro >> Alentejo >> Açores.",
      "**Commute до аэропорта:** Porto 20 мин; Lisboa 30–50 мин; Faro 15 мин; Funchal 20 мин; Ponta Delgada 10 мин.",
      "Покупка vs аренда: в Norte см. [покупка квартиры](/notes/" + APARTMENT_BUY_SLUG + "); в Lx конкуренция выше на €/m².",
    ],
  },
  {
    heading: "Где Instagram и чаты расходятся с реальностью",
    section_kind: "gap",
    paragraphs: [
      "Что делать: сверять «красивые карточки» с сезонностью, арендой и expat-пузырём.",
      "Зачем: разочарование на третьем месяце дороже, чем две недели пробы в разных регионах.",
      "Главное: Португалия не однородна — у каждого региона свой минус, который прячут в reels.",
    ],
    bullets: [
      "«Algarve круглый год как лето» → зимой половина сервисов закрыта, expat-встречи редеют.",
      "«Porto дешевле Lisboa вдвое» → Foz и Matosinhos догоняют; экономия — Braga/Guimarães, не Ribeira.",
      "«Везде говорят по-английски» → в Alentejo/Centro без PT — быт и врачи сложнее; пузырь ≠ страна.",
      "«Remote — хоть на остров» → Madeira/Açores: перелёты, доставка, SNS специалисты — реже, чем в Porto.",
      "«Международная школа в любом городе» → 90% в Lisboa/Porto; в Algarve/Centro — ездить или público.",
    ],
  },
  {
    heading: "Типичные ошибки при выборе региона",
    section_kind: "practice",
    paragraphs: [
      "Что делать: избегать решений «по одному видео» и закладывать пробный период в разных сезонах.",
      "Зачем: смена региона после ВНЖ и школы обходится дороже, чем две недели AL-аренды на старте.",
      "Главное: выбирайте регион под 3-летний сценарий, не под отпускную неделю.",
    ],
    bullets: [
      "Ошибка: Algarve по фото июля — приехать в ноябре и удивиться пустым praia и закрытым кафе.",
      "Ошибка: Lisboa/Cascais без бюджета T2 €1 500+ — полгода в поисках «дешёвого Cascais».",
      "Ошибка: Braga «ради тишины» при работе в Porto — 2 ч commute в день съедают вайб.",
      "Ошибка: игнорировать климат Norte — аренда без AC и desumidificador; см. [климат](/notes/" + NORTE_CLIMATE_COMFORT_SLUG + ").",
      "Ошибка: жить только в expat-пузыре — без PT не откроются SNS, школы plan B и местные друзья.",
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
    "Вы листаете Idealista и не понимаете: Porto, Cascais и Faro — это три разных страны в одной визе. В Norte expat-плотность и international schools без цен Lisboa; в Algarve — солнце и сезонность; в Centro — бюджет, но мало инфраструктуры. Аренда T2: Braga от €700, Cascais до €2 500.",
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
  source_label: "editorial:portugal-regions",
};
