import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { INTERNATIONAL_SCHOOLS_GUIDE_SLUG } from "@/lib/community-notes/guides/international-schools-portugal";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const PORTO_VS_BRAGA_FAMILY_SCHOOLS_SLUG = "porto-vs-braga-semya-mezhdunarodnaya-shkola-2026";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(glossaryForSlug(PORTO_VS_BRAGA_FAMILY_SCHOOLS_SLUG)!),
  },
  {
    heading: "Официально: школы, район и адрес в Norte",
    section_kind: "official",
    paragraphs: [
      "Для семьи с ребёнком в international school выбор города — это не только «где красиво», а связка: catchment escola pública (если нужен plan B), commute до кампуса, comprovativo de morada для matrícula и аренды.",
      "В Порту и Браге matrícula в público идёт через GEC concelho / agrupamento по адресу; international schools — прямой контракт. Подробный обзор British/IB/French — в гайде «Международные школы Португалии 2026».",
    ],
    bullets: [
      "Ensino obrigatório с 6 лет; для público приоритет — дети с morada в зоне agrupamento (SED / GEC Porto, GEC Braga).",
      "International school: NIF ребёнка, comprovativo de morada, transcripts, calendário vacinação; статус — D-visa + AIMA appointment или ВНЖ (зависит от школы).",
      "Аренда: contrato de arrendamento с registo в Finanças даёт morada для школы и SNS; без registo договор слабее для matrícula.",
      "Транспорт Porto: Andante (зоны Z2–Z4), Metro do Porto (линии A/B/E/F), CP до Matosinhos/Guimarães; Braga — автобусы TUB + A3/A7 до Porto.",
      "Школьный год: calendário MEC — старт 11–15 сентября, три períodos; дедлайны matrícula público — весна–лето по concelho.",
    ],
  },
  {
    heading: "Порту: Foz, Boavista, Matosinhos, Bonfim",
    section_kind: "practice",
    paragraphs: [
      "В @por_tugal и чатах Norte expat-семьи с детьми чаще селятся у четырёх international schools: OBS и LFIP/Deutsche Schule в Foz, CLIP в Boavista/Aldoar. Bonfim и Campanhã — дешевле, но commute длиннее; Matosinhos — компромисс море + 15–25 мин до Foz.",
    ],
    bullets: [
      "Foz do Douro — «золотой стандарт»: 10–15 мин пешком/автобусом до OBS, LFIP, Deutsche Schule; аренда T2 €1 100–1 600/мес (2026, Idealista), парковка сложная.",
      "Boavista / Aldoar — рядом с CLIP (~1 000 учеников); семьи ценят зелень Parque da Cidade и меньше туристической суеты, чем Ribeira.",
      "Matosinhos — lepta (2025): пляж часто закрывают из-за загрязнения, но жильё на 10–20% дешевле Foz; school bus CLIP/OBS €80–200/мес.",
      "Bonfim / Campanhã — аренда T2 €750–1 100; Metro до Boavista 10–15 мин, до Foz 20–25 мин; expat-сообщество меньше, зато бюджет.",
      "Cedofeita / Clérigos — центр, красиво, но шум и парковка; для семьи с авто см. гайд по машине — в centro histórico парковка боль.",
      "Commute Guimarães/Viana → Porto schools: A7 + 45–60 мин в часы пик; часть семей берут CLIB в Braga вместо ежедневной дороги.",
      "por_tugal (2025): Porto — 3-е место в рейтинге муниципальной конкурентоспособности (61,6 балла) — инфраструктура, культура, но аренда выше Minho.",
      "Школы: OBS/CLIP waiting list 6–12 мес. на Year 7; подробности fees и документов — в гайде /notes/" + INTERNATIONAL_SCHOOLS_GUIDE_SLUG + ".",
    ],
  },
  {
    heading: "Брага, Gualtar, Esposende и Minho",
    section_kind: "practice",
    paragraphs: [
      "Брага — один полноценный British international school (CLIB в Gualtar). Expat-плотность ниже Porto, зато аренда и темп жизни мягче. Семьи из Esposende, Guimarães и Viana часто выбирают: жить у моря/в пригороде + CLIB или commute в Porto.",
    ],
    bullets: [
      "Gualtar (CLIB) — кампус в 10 мин от Braga centro; fees ориентир €7 000–12 000/год (запрос у admissions), классы до ~27.",
      "Braga centro — T2 €700–1 000/мес; пешком/автобус до Gualtar 15–20 мин; expat-комьюнити меньше, зато сильная местная инфраструктура (больницы, спорт).",
      "Esposende / Viana do Castelo — море и спокойствие; commute до CLIB 25–40 мин, до CLIP/OBS Porto 50–70 мин по A3.",
      "Guimarães — lepta/Idealista Q2 2025: спрос на аренду растёт, цены ниже Porto; CLIB 20–30 мин, público vaga находят быстрее, чем в Lisboa.",
      "Minho expat-сообщество: Telegram/Facebook-группы Braga/Guimarães; детские кружки на PT, английский — через CLIB parent network.",
      "Escola pública plan B: matrícula через agrupamento Braga/Guimarães — lepta (2025): больше медиаторов для иностранных учеников в público.",
      "Летняя жара: lepta/IPMA — Braga в зоне orange heat alerts; кампусы без кондиционера редкость, но проверяйте классы при open day.",
      "Если CLIB заполнен — типичный сценарий из @por_tugal: год в público/privada PT + репетитор EN, параллельно waiting list CLIP/OBS.",
    ],
  },
  {
    heading: "Сравнение: аренда, commute, expat-среда",
    section_kind: "practice",
    paragraphs: [
      "В @chatlisboa и @lepta 2025–2026 повторяется: «не гонитесь за центром — сначала школа и commute». Idealista Q2 2025: Lisboa и Porto не в топ-50 спроса на аренду — семьи уходят в Braga, Guimarães, Matosinhos.",
    ],
    bullets: [
      "Аренда T2 (ориентир 2026): Foz €1 100–1 600, Matosinhos €900–1 300, Braga centro €700–1 000, Gualtar €650–950, Esposende €600–900.",
      "International schools: Porto — 4 школы (OBS, CLIP, LFIP, Deutsche); Braga — CLIB; French/German в Porto ближе, чем ехать из Braga.",
      "Commute: Porto intra-muros 10–25 мин до школ; Braga→Porto schools 45–60 мин; Esposende→CLIB 25–40 мин.",
      "Expat density: Porto (Foz/Boavista) >> Braga; русскоязычных семей больше в Porto-чатах, в Braga — компактнее, но теснее круг.",
      "SNS/быт: centro de saúde по morada; в Norte AIMA — balcões Porto/Braga/Marco de Canaveses (не только Lisboa).",
      "Детский досуг: chatlisboa — семьям не хватает «списка мест как для взрослых»; в Porto — Serralves, Oceanário (день поездки), Matosinhos surf schools.",
      "Банк + аренда: замкнутый круг NIF↔morada — см. чеклист первого месяца; Idealista + Rentalia (por_tugal, 2025) — один агрегатор.",
      "Выбор: Porto — если нужны 3–4 international tracks и сильное expat-окружение; Braga/Minho — если бюджет, спокойствие и CLIB достаточно.",
    ],
  },
  {
    heading: "Где портал и жизнь расходятся",
    section_kind: "gap",
    bullets: [
      "Idealista: «много объявлений в Porto» → lepta Q2 2025: реальный спрос смещается в Braga, Guimarães, Matosinhos — конкуренция за T2 в Foz высокая.",
      "Сайт школы: «places available» → waiting list OBS/CLIP 6–12 мес.; CLIB «fees on request» — бюджет ниже Lisboa, но bus/enrollment отдельно.",
      "SED: «vaga по адресу» → в Foz/Gualtar popular agrupamentos заполняются к июню; иногда соседний agrupamento в Matosinhos/Guimarães.",
      "«Matosinhos = дешёвый Foz» → lepta: пляж периодически закрывают по экологии; для семьи с морем смотрите Esposende/Ofir.",
      "Рейтинг Porto 61,6 → не значит «дешёвая аренда»; конкурентоспособность ≠ доступность жилья для expat.",
      "Braga «тише и дешевле» → commute в Porto schools съедает 1,5–2 ч/день — на практике выбирают CLIB или переезд ближе к A3.",
      "Португальский «не нужен» в international → PT lessons обязательны; для transfer в público без языка будет тяжело.",
      "D-visa без ВНЖ → многие школы дают conditional place, но NIF ребёнка и morada всё равно нужны до сентября.",
    ],
  },
  {
    heading: "Таймлайн переезда и типичные ошибки",
    section_kind: "practice",
    paragraphs: [
      "Оптимально: за 9–12 месяцев до сентября — open days школ (февраль–март), параллельно поиск аренды за 2–3 месяца до переезда. Для público — calendário matrículas GEC Porto/Braga.",
    ],
    bullets: [
      "Ошибка: аренда в Bonfim без проверки commute до выбранной школы и маршрута school bus.",
      "Ошибка: выбрать Esposende «ради моря», не заложив 50+ минут в CLIB/Porto каждый день.",
      "Ошибка: один NIF у родителя — оформите NIF ребёнку до deadline international school.",
      "Ошибка: игнорировать plan B público — без morada в catchment vaga не гарантирована.",
      "Ошибка: не регистрировать contrato в Finanças — morada не подтвердите для школы и AIMA.",
      "Ошибка: сравнивать только tuition — добавьте bus €80–200/мес, enrollment, депозит аренды 2–3 месяца.",
      "Ошибка: ждать пластик ВНЖ — уточняйте у admissions: D-visa + AIMA receipt часто достаточно.",
    ],
  },
];

const keyTakeaways = [
  "Официально: matrícula в público — по morada в agrupamento; international — прямой договор, NIF и morada обязательны.",
  "На практике: в Porto семьи селятся в Foz/Boavista/Matosinhos — 4 international schools в 10–25 мин.",
  "На практике: в Braga основной вариант — CLIB (Gualtar); аренда на 15–30% ниже Porto, expat-среда компактнее.",
  "Официально: calendário escolar MEC — старт 11–15 сентября; заявки international — за 9–12 месяцев.",
  "На практике: lepta/Idealista Q2 2025 — спрос на аренду смещается в Braga, Guimarães, Matosinhos, не только Porto centro.",
  "Расхождение: «дешёвый Matosinhos у моря» — пляж иногда закрывают; Foz дороже, но ближе к OBS/LFIP/Deutsche Schule.",
  "На практике: commute Braga→Porto schools 45–60 мин — многие остаются в CLIB или переезжают в Matosinhos/Boavista.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Где жить в Порту с ребёнком в international school?",
    a: "По правилам morada должна быть реальной — для OBS/LFIP/Deutsche Schule смотрите Foz; для CLIP — Boavista/Aldoar/Matosinhos. На практике Foz и Boavista — топ выбор expat-семей; Bonfim/Campanhã — бюджетнее, но +10–15 мин commute.",
  },
  {
    q: "Стоит ли выбирать Брагу вместо Порту для семьи?",
    a: "По правилам школ и ВНЖ разницы нет — важны morada и commute. На практике Braga выигрывает по аренде и спокойствию, если устраивает CLIB; для OBS/CLIP/LFIP или сильного expat-круга чаще выбирают Porto или Matosinhos.",
  },
  {
    q: "Сколько стоит аренда T2 в Foz vs Braga в 2026?",
    a: "Ориентир Idealista: Foz €1 100–1 600, Matosinhos €900–1 300, Braga centro €700–1 000, Gualtar €650–950. На практике залог 2–3 месяца + caução 1–2 месяца — закладывайте €4 000–8 000 на старте в Foz.",
  },
  {
    q: "Можно ли жить в Esposende и возить ребёнка в CLIB?",
    a: "Да, commute 25–40 мин по A3 — рабочий сценарий для семей, которые хотят море. По правилам school bus уточняйте маршрут у CLIB; на практике часть родителей ездят сами или делят carpool.",
  },
  {
    q: "Какие international schools в Norte?",
    a: "Porto: OBS, CLIP, LFIP, Deutsche Schule. Braga: CLIB. Подробный разбор curriculum, fees и документов — в гайде «Международные школы Португалии 2026» (/notes/" + INTERNATIONAL_SCHOOLS_GUIDE_SLUG + ").",
  },
  {
    q: "Нужен ли португальский, если ребёнок в British school?",
    a: "По программе international PT lessons обязательны с младших классов. На практике без базового PT сложнее кружки, врачи и transfer в escola pública — закладывайте репетитора или público parallel track.",
  },
];

export const PORTO_VS_BRAGA_FAMILY_SCHOOLS_GUIDE = {
  slug: PORTO_VS_BRAGA_FAMILY_SCHOOLS_SLUG,
  category: "Школы и дети",
  content_kind: "guide" as ContentKind,
  title: "Порту vs Брага для семьи с ребёнком в international school: районы, аренда, школы 2026",
  excerpt:
    "Foz, Matosinhos, Boavista, Gualtar, Esposende — где жить в Norte с ребёнком в OBS, CLIP или CLIB: аренда, commute, expat-среда и plan B escola pública.",
  seo_title: "Порту vs Брага — семья и international school 2026",
  seo_description:
    "Семья в Norte: Порту vs Брага с ребёнком в international school. Foz, Matosinhos, Gualtar — аренда, commute до OBS/CLIP/CLIB и expat-среда 2026.",
  quick_answer:
    "Семье с ребёнком в international school в Norte выбор — Порту (4 школы: OBS, CLIP, LFIP, Deutsche) или Брага (CLIB). Живут в Foz/Boavista/Matosinhos (Porto) или Gualtar/Braga centro/Esposende (Minho). Аренда T2: Foz €1 100–1 600, Braga €700–1 000. Commute до школ 10–25 мин в Porto vs 45–60 мин из Braga в Porto. Expat-среда плотнее в Porto; Braga дешевле. Подробности школ — в гайде международных школ; matrícula в público по morada в agrupamento.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "GEC Porto — Educação", url: "https://www.porto.pt/educacao" },
    { title: "Câmara Municipal de Braga — Educação", url: "https://www.cm-braga.pt/pt/101/educacao-e-ensino" },
    { title: "DGE — Direção-Geral da Educação", url: "https://www.dge.mec.pt/" },
    { title: "Idealista — аренда", url: "https://www.idealista.pt/arrendar-casas/" },
    { title: "Metro do Porto — Andante", url: "https://www.metrodoporto.pt/" },
  ],
  topic_tags: ["school", "arenda", "portugal"],
  hashtags: buildNoteHashtags({
    topicTags: ["school", "arenda", "portugal"],
    contentKind: "guide",
    extra: ["porto", "braga", "norte", "foz", "matosinhos", "дети", "семья"],
  }),
  source_channel: "chatlisboa+por_tugal+lepta",
  source_label: "editorial:porto-braga-family",
};
