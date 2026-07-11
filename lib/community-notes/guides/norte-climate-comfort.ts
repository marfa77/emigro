/**
 * Hand-curated guide — editorial presentation rules:
 * - quick_answer: 2–3 plain Russian sentences (hook first, jargon later)
 * - key_takeaways: max 4 action items («Что решить сегодня»)
 * - Each section: lead «зачем читать» + max 5 bullets (≤2 lines)
 * - gap: «чат vs сайт» framing; faq: direct yes/no/number first
 * See lib/community-notes/editorial-presentation.ts
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { PORTO_VS_BRAGA_FAMILY_SCHOOLS_SLUG } from "@/lib/community-notes/guides/porto-vs-braga-family-schools";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const NORTE_CLIMATE_COMFORT_SLUG = "klimat-norte-zhara-vlazhnost-plesen-zima-2026";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(glossaryForSlug(NORTE_CLIMATE_COMFORT_SLUG)!),
  },
  {
    heading: "Официально: климат, энергетика и установка HVAC",
    section_kind: "official",
    paragraphs: [
      "Зачем читать: чтобы понять, что требуют органы при установке кондиционера и какие предупреждения о жаре и влажности действуют на севере Португалии.",
    ],
    bullets: [
      "IPMA — метеоопасность (amarelo/laranja/vermelho): подпишитесь на alertas на ipma.pt перед жарой и штормами.",
      "DGEG — split ar condicionado ставит только técnico certificado (F-gas); DIY — штрафы и потеря гарантии.",
      "ADENE — certificado energético показывает isolamento; класс E/F типичен для зданий до 1980-х в Porto centro.",
      "Condomínio — внешний блок на varanda часто требует aprovação assembleia до начала работ.",
      "Пожарная безопасность — в risco de incêndio запрещены гриль и открытый огонь на varanda.",
    ],
  },
  {
    heading: "Официально: влажность, bolor и здоровье",
    section_kind: "official",
    paragraphs: [
      "Зачем читать: плесень — не «косметика», а вопрос здоровья и ответственности при аренде.",
    ],
    bullets: [
      "DGS — длительный bolor повышает риск астмы и аллергий, особенно у детей.",
      "SNS24 (808 24 24 24) — при кашле и одышке после contacto с humidade/bolor.",
      "Arrendamento — infiltração estrutural на senhorio; фиксируйте фото и livro de reclamações.",
      "Ventilação — abertura de janelas + extracção em WC/cozinha — минимальная норма.",
      "Certificado energético при arrendamento показывает isolamento — спросите при просмотре.",
    ],
  },
  {
    heading: "Климат Norte: что ждать по сезонам",
    section_kind: "practice",
    paragraphs: [
      "Зачем читать: чтобы заранее понять, как ощущается жизнь в Porto, Braga и на побережье — не по клише «прохладный север».",
    ],
    bullets: [
      "Лето — Braga до 40 °C, Porto centro +4–6 °C к зелёным районам (ilhas de calor); tropical nights с июня.",
      "Осень–весна — humidade 80–95%; Foz/Matosinhos сырость круглый год, condensação на северных стенах.",
      "Зима — +5–10 °C снаружи, в старых T2 внутри +10–14 °C без aquecimento; betão 1970-х холодный.",
      "Старые prédios — single-pane janelas, без AC; Cedofeita, Bonfim, Braga centro требуют активного управления климатом.",
      "Guimarães/Viana — чуть суше Porto, но те же каменные стены; aquecimento elétrico €80–200/мес на T2.",
    ],
  },
  {
    heading: "Летняя жара: ar condicionado, вентиляция, аренда",
    section_kind: "practice",
    paragraphs: [
      "Зачем читать: перед жарой и при поиске квартиры — что проверить и как не попасть на штрафы.",
    ],
    bullets: [
      "Split — только instalador certificado DGEG; «DIY из Leroy Merlin» = штраф + потеря seguro (lepta, 2025-08).",
      "Аренда — фильтр ar condicionado на Idealista стал стандартом (por_tugal, 2026); без AC верхние этажи невыносимы.",
      "Portable vs split — condomínio в Ribeira/Foz часто veto на bloco exterior; portable с kit de janela — workaround.",
      "Счёт — AC 9 000–12 000 BTU ≈ €30–80/мес при 3–4 ч/день; bi-horário снижает ночной расход.",
      "Просмотр — попросите счёт за июль–август; €200+ без AC = закладывайте установку до подписи contrato.",
    ],
  },
  {
    heading: "Осень, весна: humidade, bolor и desumidificador",
    section_kind: "practice",
    paragraphs: [
      "Зачем читать: с октября по апрель влажность — главная причина плесени и споров с senhorio.",
    ],
    bullets: [
      "Desumidificador 10–20 L/день — €150–350 + €15–30/мес; спасает мебель и roupa в Foz/Matosinhos.",
      "Bolor — первые пятна в casa de banho: anti-bolor + ventilação; если вернётся за 2–3 недели — infiltração.",
      "Roupa внутри — влажная ткань в T1 без extracção = bolor за 48 ч; сушите у открытого окна.",
      "Infiltração vs condensação — капли на стекле = condensação; мокрая штукатурка = infiltração (senhorio).",
      "Аренда — bolor на acta de entrada; иначе caução при выезде. Чеклист: /notes/pervyj-mesyac-portugaliya-checklist.",
    ],
  },
  {
    heading: "Зима без central heating и когда нужен специалист",
    section_kind: "practice",
    paragraphs: [
      "Зачем читать: большинство квартир без central heating — нужно понять варианты обогрева и когда звать мастера.",
    ],
    bullets: [
      "Aquecimento — invertor AC с heat pump в 2–3 раза эффективнее resistência elétrica (shoulder season).",
      "Счета — €120–200/мес на T2 в Porto без bomba de calor (autolife_pt, 2025–2026).",
      "Split instalador — Fixando/Worten €400–900 установка + €600–1 500 оборудование; + 3–7 дней и condomínio.",
      "Climaporto (Porto, 100 km) — community-рекомендация: portable turnkey от €899, RU/EN; не партнёр Emigro.",
      "Bolor >2 м² — empresa especializada + relatório; не красьте tinta до устранения humidade.",
    ],
  },
  {
    heading: "Где портал и быт расходятся",
    section_kind: "gap",
    paragraphs: [
      "Зачем читать: типичные расхождения между порталами, объявлениями и тем, что пишут релоканты в чатах Norte.",
    ],
    bullets: [
      "Чат: «север не жаркий» → IPMA orange в Braga до 40 °C и tropical nights; Porto centro — ilhas de calor.",
      "Idealista: «ar condicionado» → на деле portable 2010 без heat pump; уточняйте BTU и возраст.",
      "Senhorio: «bolor — ваша вина» → infiltração estrutural — responsabilidade владельца; фото + livro reclamações.",
      "Магазин: «split в коробке» → без instalador certificado — штраф DGEG (lepta, 2025-08).",
      "DGS: «просто проветривайте» → при 90% humidade ventilação без desumidificador не помогает в Foz.",
    ],
  },
  {
    heading: "Таймлайн по сезонам и типичные ошибки",
    section_kind: "practice",
    paragraphs: [
      "Зачем читать: короткий календарь действий и ошибки, которые повторяются в чатах Norte каждый сезон.",
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
  "На практике: Braga/Porto до 40 °C летом; Foz — humidade круглый год, desumidificador €150–350.",
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
    a: "Нет для split — только técnico certificado DGEG/F-gas; иначе штрафы (lepta, 2025-08). Portable monobloc с kit de janela можно, но герметизация влияет на КПД на 30–40% — лучше turnkey instalador.",
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
    a: "AC (BTU/idade), углы за шкафами, cheiro a humidade, extracção WC/cozinha, exposição (norte = сырее). По contrato — estado das paredes e infiltrações. Чеклисты: /notes/arenda-kvartiry-lisbon-pervyi-mesyac-2026 и /notes/pervyj-mesyac-portugaliya-checklist.",
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
    "На севере Португалии (Порту, Брага, побережье) лето уже до +40 °C, а зимой в старой квартире может быть +12 °C без отопления. Влажность с октября по апрель — главная причина плесени. Кондиционер (ar condicionado) и осушитель реально нужны; сплит ставит только сертифицированный мастер (DGEG).",
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
  source_label: "editorial:norte-climate",
};
