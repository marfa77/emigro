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
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const NORTE_CLIMATE_COMFORT_SLUG = "klimat-norte-zhara-vlazhnost-plesen-zima-2026";

const CLIMATE_GLOSSARY_INTRO =
  "Слова, которые услышите у senhorio, в объявлении на Idealista и в разговоре с instalador — разберём заранее, пока не наступило лето или не запахло сыростью.";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(glossaryForSlug(NORTE_CLIMATE_COMFORT_SLUG)!, CLIMATE_GLOSSARY_INTRO),
  },
  {
    heading: "Официально: климат, энергетика и установка HVAC",
    section_kind: "official",
    paragraphs: [
      "Зачем вам это сейчас: если вы только смотрите квартиры в марте — через три месяца в Porto centro может стать +38 °C, а split без сертификата обернётся штрафом.",
      "Что делать: подготовиться к жаре и установке кондиционера (ar condicionado) по правилам DGEG — подписка на оповещения IPMA и выбор сертифицированного мастера.",
      "Зачем: DIY-установка split — штраф и потеря страховки; без alertas вы не узнаете о orange/vermelho заранее.",
      "Главное: split ставит только técnico certificado — иначе платите дважды: за монтаж и за штраф.",
    ],
    bullets: [
      "Подпишитесь на alertas на ipma.pt перед летом — amarelo/laranja/vermelho.",
      "Закажите split ar condicionado только у técnico certificado (F-gas) — DIY = штрафы и потеря гарантии.",
      "Проверьте certificado energético (ADENE) при аренде — класс E/F типичен для зданий до 1980-х в Porto centro.",
      "Согласуйте внешний блок на varanda с condomínio — assembleia до начала работ.",
      "Уточните правила risco de incêndio — гриль и открытый огонь на varanda запрещены.",
    ],
  },
  {
    heading: "Официально: влажность, bolor и здоровье",
    section_kind: "official",
    paragraphs: [
      "Зачем вам это сейчас: плесень в углу за шкафом — не «косметика», а повод для спора при выезде и риск для здоровья.",
      "Что делать: распознать плесень (bolor) как проблему здоровья и зафиксировать её при аренде.",
      "Зачем: без документов senhorio спишет вину на вас; длительный bolor — риск астмы по DGS.",
      "Главное: сфотографируйте углы до подписи contrato — это ваша страховка на весь срок аренды.",
    ],
    bullets: [
      "Проверьте углы за мебелью на bolor при просмотре квартиры.",
      "Позвоните SNS24 (808 24 24 24) при кашле и одышке после contacto с humidade/bolor.",
      "Сфотографируйте infiltração и подайте в livro de reclamações — структурная протечка на senhorio.",
      "Проветривайте janelas и включайте extracção в WC/cozinha ежедневно.",
      "Спросите certificado energético при arrendamento — он показывает isolamento.",
    ],
  },
  {
    heading: "Климат Norte: что ждать по сезонам",
    section_kind: "practice",
    paragraphs: [
      "Что делать: заранее понять, как ощущается жизнь в Porto, Braga и на побережье по сезонам — не по клише «прохладный север».",
      "Зачем: без этого выберете квартиру без AC или isolamento и удивитесь счетам и дискомфорту.",
    ],
    bullets: [
      "Закладывайте Braga до 40 °C летом; Porto centro +4–6 °C к зелёным районам (ilhas de calor).",
      "Планируйте desumidificador с октября — humidade 80–95%; Foz/Matosinhos сырость круглый год.",
      "Проверьте температуру внутри зимой: в старых T2 +10–14 °C без aquecimento.",
      "Сравните районы: Cedofeita, Bonfim, Braga centro — старые prédios без AC.",
      "Уточните счета aquecimento elétrico — €80–200/мес на T2 в Guimarães/Viana.",
    ],
  },
  {
    heading: "Летняя жара: ar condicionado, вентиляция, аренда",
    section_kind: "practice",
    paragraphs: [
      "Что делать: перед жарой и при поиске квартиры проверить AC, счета и правила condomínio.",
      "Зачем: без AC верхние этажи невыносимы; DIY split — штраф DGEG.",
    ],
    bullets: [
      "Закажите split только у instalador certificado DGEG — DIY из магазина = штраф и потеря seguro.",
      "Ищите ar condicionado на Idealista — без AC верхние этажи невыносимы в июле.",
      "Сравните portable vs split — condomínio в Ribeira/Foz часто veto на bloco exterior.",
      "Закладывайте €30–80/мес на AC 9 000–12 000 BTU при 3–4 ч/день; bi-horário снижает ночной расход.",
      "Попросите счёт за июль–август при просмотре — €200+ без AC = установка до подписи contrato.",
    ],
  },
  {
    heading: "Осень, весна: humidade, bolor и desumidificador",
    section_kind: "practice",
    paragraphs: [
      "Что делать: с октября по апрель активно бороться с humidade — desumidificador, ventilação, фиксация bolor.",
      "Зачем: влажность — главная причина плесени и споров с senhorio при выезде.",
    ],
    bullets: [
      "Купите desumidificador 10–20 L/день — €150–350 + €15–30/мес; спасает мебель в Foz/Matosinhos.",
      "Обработайте первые пятна bolor в casa de banho anti-bolor + ventilação; если вернётся за 2–3 недели — infiltração.",
      "Сушите roupa у открытого окна — влажная ткань в T1 без extracção = bolor за 48 ч.",
      "Различите condensação (капли на стекле) и infiltração (мокрая штукатурка) — второе на senhorio.",
      "Зафиксируйте bolor на acta de entrada; чеклист: [первый месяц в Португалии](/notes/pervyj-mesyac-portugaliya-checklist).",
    ],
  },
  {
    heading: "Зима без central heating и когда нужен специалист",
    section_kind: "practice",
    paragraphs: [
      "Что делать: выбрать способ обогрева без central heating и знать, когда звать специалиста по bolor.",
      "Зачем: resistência elétrica обходится в €200+/мес; bomba de calor в 2–3 раза эффективнее.",
    ],
    bullets: [
      "Сравните invertor AC с heat pump и resistência elétrica — shoulder season выгоднее bomba de calor.",
      "Закладывайте €120–200/мес на T2 в Porto без bomba de calor — типичный счёт за resistência elétrica.",
      "Запросите смету у instalador — Fixando/Worten €400–900 + €600–1 500 оборудование; + condomínio.",
      "Сравните Climaporto (Porto, 100 km) — community-рекомендация: portable turnkey от €899, RU/EN.",
      "Закажите empresa especializada при bolor >2 м² — не красьте tinta до устранения humidade.",
    ],
  },
  {
    heading: "Где портал и быт расходятся",
    section_kind: "gap",
    paragraphs: [
      "Что делать: сверять советы из чатов с порталами и объявлениями — не верить на слово.",
      "Зачем: типичные расхождения приводят к штрафам, плесени и переплате за «квартиру с AC».",
    ],
    bullets: [
      "В чатах релокантов часто пишут «север не жаркий», но IPMA orange в Braga до 40 °C и tropical nights; Porto centro — ilhas de calor.",
      "Idealista: «ar condicionado» → на деле portable 2010 без heat pump; уточняйте BTU и возраст.",
      "Senhorio: «bolor — ваша вина» → infiltração estrutural — responsabilidade владельца; фото + livro reclamações.",
      "Магазин: «split в коробке» → без instalador certificado — штраф DGEG и отказ страховщика.",
      "DGS: «просто проветривайте» → при 90% humidade ventilação без desumidificador не помогает в Foz.",
    ],
  },
  {
    heading: "Таймлайн по сезонам и типичные ошибки",
    section_kind: "practice",
    paragraphs: [
      "Что делать: следовать сезонному календарю и избегать ошибок, которые повторяются в чатах Norte каждый год.",
      "Зачем: одна ошибка (аренда без осмотра bolor, DIY split) стоит месяцев споров и € сотен.",
    ],
    bullets: [
      "Ошибка: аренда в марте без осмотра bolor за мебелью — к июню запах и споры с senhorio.",
      "Ошибка: split «другом» — штраф DGEG и потеря seguro habitação.",
      "Ошибка: только ventilar осенью — нужен desumidificador или bomba de calor с modo dry.",
      "Ошибка: resistência elétrica без сравнения с heat pump — €200+ vs €80–120/мес.",
      "Таймлайн: май — AC; сентябрь — desumidificador; ноябрь — тест heat pump; январь — bi-horário.",
    ],
  },
];

const keyTakeaways = [
  "Сегодня: при просмотре — AC (BTU/возраст), углы за мебелью на bolor, счёт за июль–август.",
  "Официально: split ar condicionado — только técnico certificado DGEG; bolor — риск DGS, infiltração на senhorio.",
  formatPracticeTakeaway({
    channels: ["por_tugal", "lepta"],
    period: "2025–2026",
    claim: "летом в Braga и Porto centro температура доходит до 40 °C, а в Foz humidade (влажность) высокая круглый год",
    forReader: "desumidificador (осушитель) €150–350 часто нужен не только зимой — при аренде проверяйте AC и вентиляцию",
  }),
  "Расхождение: «север прохладнее» — tropical nights; Idealista «с AC» часто = старый portable.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Нужен ли кондиционер в Порту и Браге?",
    a: "Да, для июля–августа. По IPMA Braga до 40 °C, Porto centro — ilhas de calor. На практике многие T2 без AC; при аренде ищите ar condicionado или закладывайте установку (split certificado или portable). В Foz режим desumidificação полезен и осенью.",
  },
  {
    q: "Почему в квартире плесень зимой и весной?",
    a: "Да, из-за humidade 80–95% с октября по апрель. По правилам — ventilação и устранение infiltraций. На практике старые стены без isolamento дают condensação; desumidificador + bomba de calor эффективнее одного открытого окна.",
  },
  {
    q: "Можно ли самому установить кондиционер?",
    a: "Нет для split — только técnico certificado DGEG/F-gas; иначе штрафы и отказ страховщика. Portable monobloc с kit de janela можно, но герметизация снижает КПД на 30–40% — лучше turnkey instalador.",
  },
  {
    q: "Как обогреть квартиру без central heating?",
    a: "Чаще всего — invertor AC с heat pump: €80–120/мес vs €200+ на resistência elétrica. Официально допустимы aquecedor elétrico и salamandra (где разрешено). Condomínio часто запрещает split на фасаде.",
  },
  {
    q: "Кто помогает с AC и влажностью в Grande Porto?",
    a: "Instalador com certificação DGEG или empresa de climatização. В чатах Norte рекомендуют Climaporto — RU/EN, portable turnkey от €899, зона 100 км. Community-совет, не реклама Emigro; сравните Fixando и Leroy Merlin.",
  },
  {
    q: "Что проверить при аренде с точки зрения климата?",
    a: "AC (BTU/idade), углы за шкафами, cheiro a humidade, extracção WC/cozinha, exposição (norte = сырее). По contrato — estado das paredes e infiltrações. Чеклисты: [аренда в первый месяц](/notes/arenda-kvartiry-lisbon-pervyi-mesyac-2026) и [первый месяц в Португалии](/notes/pervyj-mesyac-portugaliya-checklist).",
  },
];

export const NORTE_CLIMATE_COMFORT_GUIDE = {
  slug: NORTE_CLIMATE_COMFORT_SLUG,
  category: "Жильё и быт",
  content_kind: "guide" as ContentKind,
  title: "Климат Norte 2026: жара, влажность, плесень и зима в Порту, Браге и Minho",
  excerpt:
    "Как пережить лето до 40 °C, осеннюю humidade, bolor и холодную зиму без central heating в Porto, Braga, Matosinhos: ar condicionado, desumidificador, isolamento и когда звать специалиста.",
  seo_title: "Климат Norte PT 2026 — жара, плесень, зима",
  seo_description:
    "Гайд по климату Norte Португалии 2026: жара в Braga, влажность в Porto, bolor, зима без отопления. AC, desumidificador, DGEG, IPMA и местные сервисы.",
  quick_answer:
    "Первое утро в Porto: на термометре +14 °C, а внутри — сырость и запах старой штукатурки. На севере (Порту, Брага, побережье) лето уже до +40 °C, зимой в старой квартире бывает +12 °C без отопления. Кондиционер (ar condicionado) и осушитель — не роскошь; сплит ставит только сертифицированный мастер (DGEG).",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "IPMA — Instituto Português do Mar e da Atmosfera", url: "https://www.ipma.pt/" },
    { title: "DGEG — Energia e instalação HVAC", url: "https://www.dgeg.gov.pt/" },
    { title: "ADENE — Eficiência energética", url: "https://www.adene.pt/" },
    { title: "DGS — Saúde e humidade/bolor", url: "https://www.dgs.pt/" },
    { title: "SNS24", url: "https://www.sns24.gov.pt/" },
    { title: "Portal da Construção — certificação energética", url: "https://www.portaldaenergia.pt/" },
  ],
  topic_tags: ["arenda", "portugal"],
  hashtags: buildNoteHashtags({
    topicTags: ["arenda", "portugal"],
    contentKind: "guide",
    extra: ["porto", "braga", "norte", "matosinhos", "климат", "жильё", "humidade"],
  }),
  source_channel: "chatlisboa+por_tugal+autolife_pt+lepta",
  source_label: "editorial:norte-climate+voice-pass",
};
