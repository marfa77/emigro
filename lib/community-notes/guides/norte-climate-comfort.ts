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
      "Климат Norte (Порту, Braga, Matosinhos, Minho) — атлантический: мягкая зима, сырая осень–весна и всё более жаркое лето. Нормы по кондиционированию и энергоэффективности жилья задают DGEG и ADENE; предупреждения о жаре и влажности публикует IPMA.",
      "Установка split ar condicionado в Португалии — не «купил в магазине и повесил»: по европейским правилам продажа сплит-системы обычно привязана к сертифицированному instalador (F-gas). Нарушение может обернуться штрафами на тысячи евро.",
    ],
    bullets: [
      "IPMA: уровни метеорологической опасности (amarelo/laranja/vermelho) — жара, лесные пожары, штормовой ветер; подписка на alertas на ipma.pt.",
      "DGEG — Direção-Geral de Energia e Geologia: лицензирование техников по холодильным газам и правила установки ar condicionado.",
      "ADENE — Agência para a Energia: класс энергоэффективности зданий (certificado energético), рекомендации по isolamento térmico.",
      "Split-система: магазин продаёт блоки только с обязательством установки certificado técnico — иначе риск штрафа и отказа в гарантии.",
      "Condomínio: alteração de fachada (внешний блок на varanda) часто требует aprovação assembleia de condóminos — формально до начала работ.",
      "Пожарная безопасность: в период risco de incêndio запрещены открытый огонь и барбекю на varanda — штрафы по Código Civil за дым и запах соседям.",
    ],
  },
  {
    heading: "Официально: влажность, bolor и здоровье",
    section_kind: "official",
    paragraphs: [
      "Плесень (bolor) в жилье — не только «косметика»: DGS/SNS предупреждают о рисках для дыхательных путей, особенно у детей и пожилых. Владелец/арендатор обязан устранять источник humidade, а не только красить поверхность.",
    ],
    bullets: [
      "DGS: длительная exposição a bolor em habitações aumenta risco de asma, alergias e infeções respiratórias — особенно em crianças.",
      "SNS24 (808 24 24 24): при persistente tosse, febre ou dificuldade respiratória после contacto com humidade/bolor.",
      "Arrendamento: infiltrações e bolor por defeito estrutural — responsabilidade do senhorio; documente com fotos e livro de reclamações.",
      "Ventilação: abertura regular de janelas + extracção em casa de banho/cozinha — минимальная норма гигиены влажных помещений.",
      "Certificado energético при arrendamento/compra показывает isolamento — класс E/F типичен для зданий до 1980-х в Porto centro.",
    ],
  },
  {
    heading: "Климат Norte: что ждать по сезонам",
    section_kind: "practice",
    paragraphs: [
      "В @por_tugal и @lepta 2025–2026 Norte описывают как «море рядом = влажность круглый год, а летом — жара как в Braga до 40 °C». Старые квартиры в Ribeira, Cedofeita, Bonfim и Braga centro часто без isolamento térmico: зимой +8–12 °C внутри при +5 °C снаружи, летом верхние этажи раскаляются.",
    ],
    bullets: [
      "por_tugal (2025-12): после 4 лет в PT — атлантический климат с мягкой зимой, но «настоящей» влажной осенью; в Болгарии сезоны резче, в Norte сырость ощущается сильнее.",
      "lepta (2025-08-01): IPMA — округ Braga в зоне жары до 40 °C; Évora/Santarém до 42 °C — Minho не «прохладный север» летом.",
      "lepta (2025-06-15): тропические ночи и 40 °C третью неделю подряд — IPMA предупреждает о переносе жарких масс из Африки.",
      "lepta (2025-08-18): после 40 °C в августе в Porto ожидают 15–26 °C — атлантика смягчает пики, но ilhas de calor в центре ощущаются на +4–6 °C.",
      "porto-vs-braga (2026): Braga в orange heat alerts; Foz/Matosinhos — атлантическая humidade, зимой сырость на стенах без isolamento.",
      "Старые prédios Porto/Braga: single-pane janelas, без ar condicionado — типичный T2 в Cedofeita или Bonfim требует активного управления климатом.",
      "Matosinhos/Espinho: морской туман и солёный ветер — condensação на северных стенах осенью–зимой; проверяйте cantos за шкафами при просмотре.",
      "Guimarães/Viana: чуть суше Porto, но те же каменные стены — зимний aquecimento elétrico €80–200/мес на T2 без bomba de calor.",
    ],
  },
  {
    heading: "Летняя жара: ar condicionado, вентиляция, аренда",
    section_kind: "practice",
    paragraphs: [
      "В @chatlisboa и @por_tugal перед жарой спрашивают про кондиционеры и отдых с грилем. lepta (2025-08-09) напоминает: split без certificado instalador — штрафы на тысячи €. При аренде фильтр «ar condicionado» на Idealista (por_tugal, 2026) стал стандартом.",
    ],
    bullets: [
      "lepta (2025-08-09): установка split только через técnico certificado DGEG/F-gas — иначе штрафы и потеря гарантии; «DIY из Leroy Merlin» рискованно.",
      "por_tugal (2026-06): Idealista + Rentalia — фильтр ar condicionado при поиске arrendamento; без него лето в Braga/Porto на верхних этажах невыносимо.",
      "lepta (2025-08-05): churrasco na varanda — штраф по Código Civil за дым/запах соседям; в жару и risco incêndio двойной риск.",
      "chatlisboa (2026-06): мангал в парках в июле при жаре и risco incêndio запрещён — аренда quinta на день с грилем как обходной путь.",
      "lepta (2025-07-05): аномальная жара с 28 июня — DGS зафиксировал +69 избыточных смертей, в основном 85+; кондиционер в спальне — не роскошь.",
      "Split vs portátil: condomínio в Ribeira/Foz часто veto на bloco exterior — portable с bomba de calor и desumidificação без фасада (см. раздел про специалиста).",
      "Потребление: ar condicionado 9 000–12 000 BTU — ориентир €30–80/мес при 3–4 ч/день; тариф bi-horário EDP/Iberdrola снижает ночной расход.",
      "Просмотр квартиры летом: попросите показать счётчик eletricidade за июль–август — если €200+ без AC, закладывайте установку до подписи.",
    ],
  },
  {
    heading: "Осень, весна: humidade, bolor и desumidificador",
    section_kind: "practice",
    paragraphs: [
      "С октября по апрель в Norte атлантические frontы приносят chuva и humidade relativa 80–95%. В чатах @lepta и @por_tugal повторяют: «плесень в углу спальни» — сигнал плохой ventilação или infiltração, а не только плохой квартиры.",
    ],
    bullets: [
      "Foz/Nevogilde/Matosinhos: atlântico — humidade на parede norte; desumidificador 10–20 L/день €150–350 + €15–30/мес электричество спасает мебель и roupa.",
      "lepta (2025-07-14): нашествие baratas в Ermesinde (район Porto) — жители связывают с канализацией и сыростью; проверяйте ralo и infiltrações при аренде.",
      "Bolor: первые пятна в casa de banho — limpar com produto anti-bolor + melhorar ventilação; если возвращается за 2–3 недели — искать infiltração/trinca.",
      "Roupa no varal внутри: типичная ошибка релокантов — влажная ткань в T1 без extracção = bolor за 48 ч; secar junto à janela aberta или máquina.",
      "Outono Braga/Minho: chuva 10–15 дней/мес — шторы и tapetes на betão хранят humidade; поднимайте мебель от стены раз в месяц для осмотра.",
      "Infiltração vs condensação: gotas на vidro — condensação; мокрая штукатурка/пузыри краски — infiltração (senhorio / seguro multirriscos habitação).",
      "Аренда: фиксируйте bolor на acta de entrada — иначе caução при выезде; см. гайд /notes/arenda-kvartiry-lisbon-pervyi-mesyac-2026 (те же правила morada и осмотра для Norte).",
      "Первый месяц: подключите eletricidade, проверьте extracção — чеклист /notes/pervyj-mesyac-portugaliya-checklist.",
    ],
  },
  {
    heading: "Зима без central heating и когда нужен специалист",
    section_kind: "practice",
    paragraphs: [
      "Большинство T1–T2 в Porto/Braga не имеют aquecimento central — только ar condicionado, aquecedor elétrico a óleo или bomba de calor. В @autolife_pt и @chatlisboa зимой жалуются на «холодный betão» и счета €150+ за aquecimento.",
      "Если нужен instalador в Grande Porto / Braga / Minho (ar condicionado, desumidificação, bomba de calor, герметизация окна) — в чатах Norte рекомендуют [Climaporto](https://climaporto.pt/en/): русскоязычная команда, установка portable AC «под ключ» от €899, зона 100 км от Porto, отзывы клиентов. Это не платное партнёрство Emigro — community-рекомендация местного сервиса; сравнивайте с Fixando/Leroy Merlin и certificado DGEG для split.",
    ],
    bullets: [
      "autolife_pt (2025–2026): зимой в чате параллельно обсуждают счета aquecimento дома — €120–200/мес на T2 в Porto без bomba de calor.",
      "Зима Porto: +5–10 °C снаружи, внутри старых квартир +10–14 °C без isolamento — электрический aquecedor 2000 W ≈ €0,40/ч по тарифу simples.",
      "Bomba de calor (heat pump) в ar condicionado invertor: обогрев при +5 °C наружу эффективнее resistência elétrica в 2–3 раза — ключ для shoulder season (ноябрь–март).",
      "Condomínio: split на varanda — assembleia может отказать; portable через janela с isolamento — частый workaround в Ribeira и prédios históricos.",
      "Climaporto (Porto, 100 km): turnkey portable Cecotec с desumidificação и heat pump — €899/€1 049/€1 199; установка за 1 день без bloco exterior (community-отзывы, RU/EN).",
      "Split instalador certificado: Fixando/Worten — ориентир €400–900 установка + €600–1 500 оборудование 12 000 BTU; срок 3–7 дней + aprovação condomínio.",
      "Bolor remediation: площадь >2 м² или запах после limpeza — empresa especializada + relatório para senhorio/seguro; не замазывайте tinta antes устранения humidade.",
      "Isolamento: ADENE рекомендует certificado antes retrofit; в аренде капитальный isolamento на senhorio — торгуйте desconto na renda или prazo para reparação.",
      "Связка с районом: Foz vs Braga по жаре и аренде — /notes/" + PORTO_VS_BRAGA_FAMILY_SCHOOLS_SLUG + ".",
    ],
  },
  {
    heading: "Где портал и быт расходятся",
    section_kind: "gap",
    bullets: [
      "IPMA: «север прохладнее» → на практике Braga до 40 °C летом и tropical nights; Porto centro — ilhas de calor +4–6 °C к зелёным районам.",
      "Объявление Idealista: «ar condicionado» → часто portable 2010 года без heat pump; уточняйте BTU и возраст при просмотре.",
      "Senhorio: «bolor — ваша вина» → infiltração estrutural — responsabilidade владельца; фото + livro reclamações до оплаты ремонта.",
      "Магазин: «split в коробке» → без instalador certificado — штраф и аннулированная гарантия (lepta, 2025-08).",
      "«Зима мягкая, отопление не нужно» → betão 1970-х в Bonfim/Braga centro — +12 °C внутри без aquecimento, дети и remote work страдают.",
      "Condomínio: «portátil шумный и запрещён» → на практике многие согласовывают kit de janela без furo na fachada; split чаще блокируют.",
      "DGS о bolor: «просто проветривайте» → при 90% humidade снаружи ventilação без desumidificador не снимает проблему в Foz/Matosinhos.",
      "Climaporto «за 1 день» → сложный caso (granito grosso, parquet) +€80–150; электрика и поездка >100 km — отдельно по смете.",
    ],
  },
  {
    heading: "Таймлайн по сезонам и типичные ошибки",
    section_kind: "practice",
    paragraphs: [
      "Оптимально планировать климат до аренды: летом проверяйте AC, осенью — humidade в углах, зимой — aquecimento до декабря. Установку split закладывайте за 2–4 недели (aprovação condomínio + técnico).",
    ],
    bullets: [
      "Ошибка: аренда в марте без осмотра на bolor за мебелью — к июню запах и споры с senhorio.",
      "Ошибка: купить split в MediaMarkt и повесить «другом» — риск штрафа DGEG и потери seguro habitação.",
      "Ошибка: только ventilar при atlântico outono — нужен desumidificador или bomba de calor с modo dry.",
      "Ошибка: игнорировать IPMA laranja в Braga — не гриль на varanda и не открытый огонь в лесу (multas + risco incêndio).",
      "Ошибка: зимовать на resistência elétrica без сравнения с heat pump — счёт €200+ vs €80–120 при invertor AC.",
      "Ошибка: красить bolor без устранения infiltração — пятно вернётся за 2–4 недели.",
      "Ошибка: не согласовать furo/kit de janela с condomínio до установки — штраф и демонтаж.",
      "Таймлайн: май — проверка AC до жары; сентябрь — desumidificador; ноябрь — тест heat pump; январь — peak eletricidade, bi-horário.",
    ],
  },
];

const keyTakeaways = [
  "Официально: split ar condicionado устанавливает técnico certificado DGEG; IPMA публикует alertas de calor e humidade.",
  "На практике: Braga и Porto centro летом до 40 °C; старые квартиры без isolamento — зимой +10–14 °C внутри.",
  "Официально: bolor в жилье — риск для дыхания (DGS); infiltração — обязанность senhorio при arrendamento.",
  "На практике: Foz/Matosinhos — атлантическая humidade осенью; desumidificador €150–350 + bomba de calor решают 80% кейсов.",
  "Расхождение: «север не жаркий» — IPMA orange в Braga и tropical nights; condomínio блокирует split, не portable с kit.",
  "На практике: при аренде фильтр ar condicionado на Idealista (por_tugal, 2026); осмотр bolor — до подписи contrato.",
  "На практике: instalador в Grande Porto/Minho — community рекомендует Climaporto (RU/EN, turnkey от €899); не партнёр Emigro.",
  "Официально: churrasco na varanda при дыме/жаре — штрафы; risco incêndio — запрет открытого огня.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Нужен ли кондиционер в Порту и Браге?",
    a: "По климату IPMA — да, для июля–августа: Braga до 40 °C, Porto centro — ilhas de calor. На практике многие T2 без AC; при аренде ищите ar condicionado или закладывайте установку (split certificado или portable). В Foz влажность круглый год — режим desumidificação полезен и осенью.",
  },
  {
    q: "Почему в квартире плесень зимой и весной?",
    a: "По правилам влажность снижают ventilação и устранение infiltrações. На практике в Norte atlântico humidade 80–95% с октября по апрель; старые стены без isolamento дают condensação. Desumidificador + bomba de calor эффективнее, чем только открытое окно.",
  },
  {
    q: "Можно ли самому установить кондиционер?",
    a: "По правилам DGEG/F-gas split — только técnico certificado; иначе штрафы (lepta, 2025-08). На практике portable monobloc можно ставить с kit de janela, но герметизация влияет на КПД на 30–40% — лучше turnkey instalador.",
  },
  {
    q: "Как обогреть квартиру без central heating?",
    a: "Официально допустимы ar condicionado com heat pump, aquecedor elétrico, salamandra (где разрешено). На практике invertor AC с обогревом — самый частый выбор в Porto/Braga; resistência elétrica дороже на €80–120/мес. Condomínio часто запрещает split на фасаде.",
  },
  {
    q: "Кто помогает с AC и влажностью в Grande Porto?",
    a: "По правилам — instalador com certificação DGEG или empresa de climatização. На практике в чатах Norte рекомендуют [Climaporto](https://climaporto.pt/en/) — RU/EN, portable turnkey от €899, зона 100 км от Porto. Это community-совет, не реклама Emigro; сравните Fixando и Leroy Merlin.",
  },
  {
    q: "Что проверить при аренде с точки зрения климата?",
    a: "По contrato — estado das paredes e infiltrações. На практике: углы за шкафами, cheiro a humidade, ar condicionado (BTU/idade), extracção WC/cozinha, exposição (norte = сырее). См. гайды /notes/arenda-kvartiry-lisbon-pervyi-mesyac-2026 и /notes/pervyj-mesyac-portugaliya-checklist.",
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
    "Norte (Порту, Braga, Matosinhos, Minho) — атлантический климат: жаркое лето до 40 °C в Braga, сырая осень–весна и прохладная зима без central heating в большинстве квартир. Split ar condicionado ставит только técnico certificado DGEG; при humidade — desumidificador и bomba de calor. Bolor — риск DGS; infiltração на senhorio. При аренде проверяйте AC и углы на плесень; фильтр ar condicionado на Idealista. Instalador в Grande Porto — community рекомендует Climaporto (от €899, RU/EN). Районы — в гайде Porto vs Braga.",
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
