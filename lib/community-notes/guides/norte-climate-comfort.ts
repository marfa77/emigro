/**
 * Norte climate comfort — heat, humidity, mold, winter (Porto/Braga/Minho).
 * Grok Remarque pass: damp morning flat, bolor behind wardrobe, summer heat as lived scenes.
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
      "Если вы в марте только смотрите квартиры, воздух ещё кажется мягким — почти как обещание «прохладного севера». Через три месяца в Porto centro может быть +38 °C, стены нагреются к вечеру, а сон станет коротким и липким. Вы стоите у открытой janela и понимаете: климат здесь — не фон открытки, а быт. Split без сертификата в такой момент превращается не в прохладу, а в штраф и разговор со страховщиком.",
      "Летом IPMA шлёт alertas — amarelo, laranja, vermelho — не для драмы, а чтобы успеть закрыть ставни и не планировать дорогу в пик. Ar condicionado ставят с técnico certificado по правилам DGEG: DIY-монтаж — не экономия, а потеря страховки и двойная оплата. При аренде загляните в certificado energético (ADENE): класс E/F типичен для зданий до 1980-х в Porto centro, и это объясняет, почему зимой внутри холоднее, чем на улице кажется.",
      "Внешний блок на varanda согласуйте с condomínio на assembleia до начала работ — иначе соседский спор съест лето. На varanda действуют правила risco de incêndio: гриль и открытый огонь запрещены, даже если «все так делают». Без alertas вы узнаете про orange или vermelho, когда уже поздно менять планы.",
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
      "Утром вы отодвигаете шкаф — и видите серое пятно в углу, будто стена дышит сыростью. Запах старой штукатурки и влажного дерева уже был в комнате вчера, вы просто не хотели его замечать. Плесень здесь — не «косметика для фото», а повод для спора при выезде и реальный риск для здоровья. Bolor по DGS связан с астмой и обострениями; если senhorio не увидит документов, вину спишут на вас.",
      "При просмотре загляните за мебель, в углы casa de banho, к потолку у окна — туда, куда не светят на Idealista. При кашле и одышке после contacto с humidade или bolor звоните SNS24 (808 24 24 24): это не «просто аллергия на переезд». Структурная infiltração — на senhorio: фиксируйте в livro de reclamações, проветривайте janelas, включайте extracção в WC и cozinha ежедневно. Certificado energético при arrendamento показывает isolamento — и объясняет, почему стена мокнет изнутри.",
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
      "Norte — не «прохладный север из брошюры», а жизнь по сезонам, где одно и то же утро в марте и в августе — разные миры. Летом Braga может дойти до 40 °C; Porto centro на 4–6 °C жарче зелёных районов — ilhas de calor, камни и асфальт держат тепло до ночи. Вы выходите после работы, и воздух уже не освежает, а давит. Tropical nights здесь не метафора из чата — ночи, когда открытое окно не спасает.",
      "С октября humidade 80–95%: бельё сохнет медленно, стены холодеют, а Foz и Matosinhos несут сырость круглый год, как будто море живёт в штукатурке. Desumidificador нужен не «на всякий случай», а с осени, пока ещё не запахло. Зимой в старых T2 без aquecimento внутри +10–14 °C: вы просыпаетесь в свитере и думаете о счёте за электричество раньше, чем о кофе.",
      "Cedofeita, Bonfim, Braga centro — старые prédios часто без AC; красота azulejos не греет. Счета aquecimento elétrico в Guimarães и Viana — €80–200/мес на T2, если греться resistência. Без этой картины легко выбрать квартиру без AC и isolamento — и удивиться счетам и дискомфорту в один и тот же год.",
      "Главное: закладывайте жару, сырость и холод заранее — иначе квартира без AC и isolamento удивит счетами и дискомфортом.",
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
      "В июле верхние этажи без AC становятся невыносимыми: пол горячий, ночь короткая, работа на следующий день начинается с усталости. На Idealista ищите ar condicionado, но уточняйте BTU и возраст — «с AC» часто значит portable 2010 без heat pump, который гудит и почти не охлаждает. Split заказывайте только у instalador certificado DGEG; DIY из магазина — штраф и отказ seguro, когда уже поздно спорить.",
      "Portable и split — разные судьбы в condomínio. В Ribeira и Foz часто veto на bloco exterior: красивый фасад важнее вашей прохлады. Закладывайте €30–80/мес на AC 9 000–12 000 BTU при 3–4 ч/день; bi-horário снижает ночной расход, если умеете пользоваться тарифом. При просмотре попросите счёт за июль–август: €200+ без AC значит установку до подписи contrato, а не «потом, когда будет жарко».",
      "Главное: без AC верхние этажи невыносимы в июле; split — только через certificado, не «друг за выходные».",
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
      "С октября по апрель humidade — главный бытовой враг, тише жары и злее. Вы открываете шкаф — и чувствуете влажный холод на одежде. Desumidificador 10–20 L/день (€150–350 + €15–30/мес) спасает мебель в Foz и Matosinhos раньше, чем запах станет «характером квартиры». Первые пятна bolor в casa de banho обработайте anti-bolor и вентиляцией; если вернутся за 2–3 недели — это infiltração, не condensação на стекле.",
      "Сушите roupa у открытого окна: влажная ткань в T1 без extracção даёт bolor за 48 ч — быстрее, чем вы успеете спорить в чате. Различите condensação (капли на стекле) и infiltração (мокрая штукатурка): второе на senhorio, первое — на привычки и осушитель. Зафиксируйте bolor на acta de entrada; чеклист — [первый месяц в Португалии](/notes/pervyj-mesyac-portugaliya-checklist). Влажность не ждёт, пока вы «обживётесь».",
      "Главное: влажность — главная причина плесени и споров с senhorio при выезде; desumidificador с октября, не когда уже запахло.",
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
      "Central heating в старых T2 часто отсутствует — вы греете комнату resistência elétrica и слушаете, как счётчик считает евро. €200+/мес на обогрев — не редкость, если не сравнить с bomba de calor, которая в 2–3 раза эффективнее. Invertor AC с heat pump в shoulder season выгоднее голой resistência; типичный счёт €120–200/мес на T2 в Porto без heat pump — цена «просто включить обогреватель».",
      "Смету запросите у instalador: Fixando или Worten €400–900 плюс €600–1 500 оборудование, плюс согласие condomínio. В чатах Norte рекомендуют Climaporto (Porto, 100 km) — community-рекомендация: portable turnkey от €899, RU/EN; сравните сами, Emigro не рекламирует. При bolor больше 2 м² закажите empresa especializada — не красьте tinta до устранения humidade, иначе пятно вернётся под свежим слоем.",
      "Главное: resistência elétrica без сравнения с heat pump — €200+ vs €80–120/мес; сравните до первого холодного ноября.",
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
      "Чаты и объявления расходятся с порталами — и типичные расхождения стоят штрафов, плесени и переплаты за «квартиру с AC». В чатах релокантов пишут «север не жаркий», а IPMA уже красит Braga orange до 40 °C и предупреждает про tropical nights. Porto centro — ilhas de calor: зелёный район и Baixa — разные ночи в одном городе.",
      "Idealista пишет «ar condicionado» — на деле portable 2010 без heat pump; уточняйте BTU и возраст, пока ещё можно уйти. Senhorio говорит «bolor — ваша вина» — infiltração estrutural на владельце: фото и livro de reclamações. Магазин предлагает «split в коробке» — без instalador certificado штраф DGEG и отказ страховщика. DGS советует «просто проветривать» — при 90% humidade в Foz вентиляция без desumidificador не помогает, только охлаждает надежду.",
      "Главное: сверяйте советы из чатов с порталами и объявлениями — не верьте на слово.",
    ],
    bullets: [
      "Сверьте «север не жаркий» с IPMA — orange в Braga до 40 °C и tropical nights; Porto centro — ilhas de calor.",
      "Уточняйте BTU и возраст AC на Idealista — «ar condicionado» часто = portable 2010 без heat pump.",
      "Фиксируйте infiltração фото + livro reclamações — bolor от протечки на senhorio, не на вас.",
      "Не покупайте split «в коробке» — без instalador certificado штраф DGEG и отказ страховщика.",
      "Добавьте desumidificador при 90% humidade — вентиляция в Foz без него не спасает.",
    ],
  },
  {
    heading: "Таймлайн по сезонам и типичные ошибки",
    section_kind: "practice",
    paragraphs: [
      "Одна ошибка — аренда без осмотра bolor или DIY split — стоит месяцев споров и сотен евро. Аренда в марте без взгляда за мебель — к июню запах и senhorio, который «ничего не видел». Split «другом за выходные» — штраф DGEG и потеря seguro habitação в самый жаркий месяц. Вы уже жили этот сценарий в чужих историях из чата; не надо проживать его в своей квартире.",
      "Только ventilar осенью — мало: нужен desumidificador или bomba de calor с modo dry. Resistência elétrica без сравнения с heat pump — €200+ против €80–120/мес, и разница чувствуется в январе. Сезонный календарь почти скучен — и поэтому работает: май — AC; сентябрь — desumidificador; ноябрь — тест heat pump; январь — bi-horário. Следуйте ему раньше, чем «когда уже невыносимо».",
      "Главное: следуйте сезонному календарю и избегайте ошибок, которые повторяются в чатах Norte каждый год.",
    ],
    bullets: [
      "Осмотрите bolor за мебелью до аренды в марте — к июню запах и споры с senhorio.",
      "Закажите split у certificado — «друг за выходные» = штраф DGEG и потеря seguro habitação.",
      "Купите desumidificador осенью — одного ventilar при 90% humidade недостаточно.",
      "Сравните heat pump и resistência elétrica — €80–120/мес vs €200+.",
      "Следуйте календарю: май — AC; сентябрь — desumidificador; ноябрь — heat pump; январь — bi-horário.",
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
    "Гайд по климату Norte Португалии 2026: лето до 40 °C в Braga, humidade и bolor в Porto, зима без central heating. Сертифицированный AC, desumidificador, IPMA и DGEG.",
  quick_answer:
    "Первое утро в Porto: на термометре +14 °C, а внутри квартиры — сырость и запах старой штукатурки. Вы открываете janela и понимаете, что это не «прохладный север из брошюры»: humidade здесь живёт в стенах раньше, чем жара на улице. Лето в Norte уже до +40 °C, зимой в старой квартире бывает +12 °C без отопления; ar condicionado и desumidificador — не роскошь, а план. Сплит ставит только técnico certificado (DGEG).",
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
  source_label: "editorial:norte-climate+grok-remarque-pass",
};
