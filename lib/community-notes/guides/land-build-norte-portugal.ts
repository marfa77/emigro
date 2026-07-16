/** Hand-curated guide — voice «Опытный релокант за кофе» (lib/community-notes/editorial-voice.ts). */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { formatPracticeTakeaway } from "@/lib/community-notes/practice-format";
import { CAR_PORTUGAL_GUIDE_SLUG } from "@/lib/community-notes/guides/car-portugal-buy-rent-import";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const LAND_BUILD_NORTE_GUIDE_SLUG = "pokupka-zemli-postroyka-doma-norte-portugaliya-2026";

const APARTMENT_BUY_SLUG = "kupit-kvartiru-portugaliya-norte-2026";
const NORTE_CLIMATE_SLUG = "klimat-norte-zhara-vlazhnost-plesen-zima-2026";
const PORTO_BRAGA_RENT_SLUG = "arenda-dolgosrok-porto-braga-2026";
const PORTO_VS_BRAGA_SLUG = "porto-vs-braga-semya-mezhdunarodnaya-shkola-2026";
const REGIONS_SLUG = "regiony-portugalii-ekspaty-klimat-tseny-2026";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(glossaryForSlug(LAND_BUILD_NORTE_GUIDE_SLUG)!),
  },
  {
    heading: "Официально: PDM, зонирование и право строить",
    section_kind: "official",
    paragraphs: [
      "Покупка terreno и постройка casa em Portugal — не «купил поле и строю». Сначала проверяют Plano Director Municipal (PDM) concelho: можно ли там жилое строительство, какой coeficiente de utilização, высота, отступы от границ.",
      "Земля делится на solo urbano (можно строить при соблюдении PDM), solo rustico (сельхоз/лес — строительство ограничено; жилой дом только при reconversão или особых случаях) и solo industrial. Новый lei dos solos (2025) расширяет перевод сельхозземель в urbano для доступного жилья — но решение за Câmara Municipal.",
    ],
    bullets: [
      "PDM (Plano Director Municipal) — муниципальный генеральный план; смотрите на сайте Câmara (Porto, Braga, Guimarães, Viana, Esposende и т.д.).",
      "Certidão de informação urbanística — официальная выписка Câmara: зона, можно ли licença de construção, ограничения (Natura, flood, archaeological).",
      "Solo urbano: licença de construção (obra nova) через Câmara + projeto arquiteto + topógrafo; срок рассмотрения — месяцы, не недели.",
      "Solo rustico: строительство жилого дома почти всегда требует alteração PIP/PDM или reconversão — без этого licença не выдадут.",
      "IMT (Imposto Municipal sobre Transmissões) при покупке земли — ставка зависит от типа imóvel и муниципалитета; симулятор на Portal das Finanças.",
      "Registo Predial / Conservatória — проверка собственника, encargos, servidões; покупка без certidão permanente — риск.",
    ],
  },
  {
    heading: "Официально: licença de construção и IMT",
    section_kind: "official",
    paragraphs: [
      "После покупки terreno с правом строить подают pedido de licença de construção в Câmara Municipal. Нужны: projeto de arquitetura, topografia, estudos (estrutural, térmico, acústico), comprovativo propriedade, taxas municipais.",
    ],
    bullets: [
      "Arquiteto (arquiteto habilitado OA) — обязателен для projeto; подаёт в Câmara от имени владельца.",
      "Topógrafo — levantamento topográfico границ, кадастр, привязка к PDM; без точных границ соседи могут оспорить licença.",
      "Licença de construção: этапы — instrução → публикация → decisão; при дозапросах prazo продлевается.",
      "Alvará de construção / empreiteiro: работы ведёт licenciado construtor; самострой без licença — multa и снос.",
      "IMT на покупку terreno: для urbano часто 6,5–7,5% + Imposto do Selo; для rustico другие ставки — считайте до сделки.",
      "Vistoria final + licença de utilização (habitação) — без неё нельзя легально жить; подключение água/luz требует licença de utilização.",
    ],
  },
  {
    heading: "Norte: где смотреть участки и что спрашивать",
    section_kind: "practice",
    paragraphs: [
      "В @lepta и @por_tugal 2025–2026 Norte популярен у релокантов, которые хотят дом вместо аренды в Porto/Braga. Типичные concelhos: Braga (пригороды Gualtar, Celeirós), Guimarães, Vila Nova de Famalicão, Esposende, Viana, Ponte de Lima, Amarante.",
    ],
    bullets: [
      "Idealista / Imovirtual — основные порталы; фильтр «terreno» + concelho; цены rustico в Minho от €15–40/м², urbano выше.",
      "Участники @lepta в 2025–2026 писали, что около 30% земель в PT с неизвестными владельцами — перед сделкой certidão permanente и advogado обязательны.",
      "Braga / Guimarães: PSD силён на севере (по разборам @por_tugal после выборов 2025) — муниципалитеты консервативнее в выдаче licenças, чем «на словах» обещают.",
      "Esposende / Ofir: terreno у моря дороже; проверяйте PDM на flood/coastal constraints — не всё «с видом на океан» можно застроить.",
      "Ponte de Lima / Amarante: rustico дешевле, но reconversão solo pode занять 12–24 мес. + €5 000–15 000 юрист/архитектор.",
      "Vila do Conde / Maia: ближе к Porto OPO. Участники @lepta описывали кейс лесопилки в 50 см от дома — всегда проверяйте соседние licenças и PIP.",
      "Очистка участка: по опыту @lepta владельцы обязаны чистить terreno от brushwood до срока против пожаров; штрафы за просрочку.",
      "Связь с бытом: без авто в rural Norte сложно — см. [гайд по машине](/notes/" + CAR_PORTUGAL_GUIDE_SLUG + "); OPO 30–60 мин от Minho.",
    ],
  },
  {
    heading: "Бюджет строительства и подрядчики",
    section_kind: "practice",
    paragraphs: [
      "В чатах @chatlisboa и @por_tugal типичный бюджет «участок + дом под ключ» в Norte 2026 — €200 000–450 000 в зависимости от м², отделки и близости к Porto. Участники @lepta в 2025–2026 писали, что правительство признало рост цен на стройматериалы — закладывайте инфляцию 5–10% в смету.",
    ],
    bullets: [
      "Terreno urbano 500–1 000 m² в Braga/Guimarães: €50 000–120 000; rustico с reconversão — дешевле участок, дороже согласования.",
      "Строительство casa 150–200 m²: €1 200–1 800/m² (empreiteiro geral, 2026); архитектура + topografia + проекты — €8 000–25 000.",
      "Сроки: покупка terreno 1–2 мес.; licença de construção 4–12 мес.; стройка 10–18 мес. — итого 18–30 мес. «под ключ».",
      "IMT + notário + registo: €5 000–15 000 на сделку земли (зависит от цены); на стройку IVA 23% на работы (частично возмещается при habitação própria permanente).",
      "Empreiteiro: берите с alvará и referências в concelho; orçamento фиксируйте в contrato com prazos e penalidades.",
      "Arquiteto: 8–12% от стоимости стройки или фикс €10 000–20 000; ведёт licenciamento и vistorias Câmara.",
      "Topógrafo: €600–1 500 за levantamento; нужен до projeto и для границ при спорах с соседями.",
      "Первый месяц после сдачи: NIF, morada, utente SNS, электричество EDP/Iberdrola — [чеклист первого месяца](/notes/pervyj-mesyac-portugaliya-checklist).",
    ],
  },
  {
    heading: "Кейс: два дома на одном участке в Norte",
    section_kind: "practice",
    paragraphs: [
      "Вы открываете Idealista вечером: зелёный участок в Guimarães, 900 m², «com possibilidade de construção». На следующий день едете смотреть — тишина, виноградники, дорога гравийная, но проезжая. Вопрос не «нравится ли вид», а можно ли здесь жить, а потом сдавать гостевой домик.",
      "Зачем вам это сейчас: двухфазная застройка — гостевой ~60 m², затем основной ~120 m² — популярна у релокантов, которые не хотят 18 месяцев [аренды в Porto/Braga](/notes/" +
        PORTO_BRAGA_RENT_SLUG +
        ") и готовы жить на своей земле раньше, чем сдастся большой дом.",
      "Что делать: читайте кейс ниже как иллюстрацию реального подхода семьи-релоканта — не как юридическую инструкцию. Правила PDM, licença de construção и AL различаются по concelho; перед сделкой сверяйтесь с Câmara Municipal, arquiteto и advogado.",
      "Зачем: такой план экономит аренду и даёт моральный якорь, но проигрывает, если участок не тянет два жилья или коммуникации «на бумаге».",
      "Главное: два дома на одном terreno — это не «построю второй сарай», а отдельный проект с PDM, licença и, возможно, AL; без certidão urbanística до escritura не начинайте.",
    ],
    bullets: [
      "Иллюстративный кейс — не юридическая консультация; в Braga, Guimarães, Esposende и Ponte de Lima правила отличаются.",
      "Сравните с [покупкой квартиры](/notes/" + APARTMENT_BUY_SLUG + ") и [выбором региона](/notes/" + REGIONS_SLUG + ") — участок даёт пространство, но тянет сроки и риски.",
      "Участники @por_tugal и @lepta в 2025–2026 писали, что «два дома на участке» часто означает reconversão или coeficiente на два volumes — не каждый terreno это допускает.",
      "Перед поездкой на осмотр: запросите у продавца certidão de informação urbanística и план границ — иначе визит только для фото.",
      "Связка с бытом: rural Norte без авто тяжело — см. [Порту vs Брага](/notes/" + PORTO_VS_BRAGA_SLUG + ") по школам и commute.",
    ],
  },
  {
    heading: "Кейс по шагам: гостевой дом 60 m² → основной 120 m²",
    section_kind: "action_guide",
    paragraphs: [
      "Зачем вам это сейчас: пошаговый план помогает не перепутать порядок — сначала due diligence, потом деньги, потом проекты, и только затем первая стройка.",
      "Что делать: пройдите семь фаз ниже; на каждом этапе фиксируйте документы (certidão, CPCV, licença) — без них следующий шаг не стартует.",
      "Зачем: гостевой дом — не «временная халупа», а легальное habitação с licença de utilização; от качества фундамента и вентиляции зависит и основной дом, и будущий AL.",
      "Главное: переезд в гостевой возможен только после licença de utilização фазы 1 — до этого вы всё ещё на аренде или у соседей.",
    ],
    bullets: [
      "Фаза 1 — Поиск онлайн: Idealista/Imovirtual, фильтр terreno + concelho (Guimarães, Braga periphery, Ponte de Lima). Отсечь rustico без reconversão, если нет бюджета на 12–24 мес. согласований.",
      "Фаза 2 — Визит на месте: дорога (estrada municipal vs грунтовка), соседи, шум, вид, реальный уклон. @autolife_pt в чатах советует смотреть участок после дождя — вода покажет дренаж и подъезд.",
      "Фаза 3 — Due diligence до CPCV: certidão urbanística (два жилья?), PDM/coeficiente, água/eletricidade/saneamento/telecom, servidão de passagem в registo predial.",
      "Фаза 4 — Сделка: CPCV → IMT → escritura → registo na Conservatória; advogado + certidão permanente обязательны (lepta: ~30% объявлений со спорным titular).",
      "Фаза 5 — Бюро arquiteto + topógrafo: projeto для двух volumes, pedido licença de construção фазы 1 (гостевой ~60 m²); согласуйте разводку коммуникаций на оба дома.",
      "Фаза 6 — Стройка гостевого: современные материалы, solid fundação (betão armado или pré-fabricado с licença); obra 4–8 мес. после licença; vistoria → licença de utilização → переезд.",
      "Фаза 7 — Основной дом ~120 m²: второй pedido licença (или fase obra в том же projeto — уточняет arquiteto); живёте в гостевом; проектируйте отдельный вход, счётчики и parking для будущего AL.",
    ],
  },
  {
    heading: "План по месяцам: от объявления до основного дома",
    section_kind: "practice",
    paragraphs: [
      "Что делать: заложите 24–36 месяцев на полный цикл «земля → гостевой → основной» — быстрее бывает только при solo urbano с готовыми коммуникациями у забора.",
      "Зачем: аренда в Porto/Braga €900–1 400/мес. съедает бюджет, если вы недооценили срок licença; гостевой сокращает «мёртвое» время, но не отменяет бюрократию.",
      "Главное: резерв 3–6 мес. на задержки Câmara и подключения EDP/água — в rural Norte это норма, не исключение.",
    ],
    bullets: [
      "Мес. 1–2: поиск, визиты, due diligence, CPCV.",
      "Мес. 2–3: escritura, registo, выбор arquiteto/topógrafo.",
      "Мес. 4–10: projeto + licença de construção фазы 1 (гостевой).",
      "Мес. 11–16: obra гостевого 60 m² + licença de utilização → переезд.",
      "Мес. 12–18: параллельно projeto фазы 2 (основной 120 m²) — старт после сдачи гостевого или overlap по согласованию Câmara.",
      "Мес. 19–28: licença + obra основного дома.",
      "Мес. 29–32: licença de utilização основного, разводка AL (если планируете), ландшафт.",
    ],
  },
  {
    heading: "Чеклист до escritura: два жилья, коммуникации, дорога",
    section_kind: "practice",
    paragraphs: [
      "Зачем вам это сейчас: депозит в CPCV без этого списка — самая дорогая ошибка в чатах @por_tugal; откат после sinal стоит 10–20% или суд.",
      "Что делать: попросите advogato заказать certidão de informação urbanística и certidão permanente; arquiteto даст предварительное мнение по двум volumes до подписи.",
      "Зачем: «água есть на карте» и «água у границы участка» — разные бюджеты; servidão без записи в registo — повод для соседа закрыть проезд.",
      "Главное: три блока — право строить два жилья, физические подключения, юридический доступ — должны быть зелёными до escritura, не «потом разберёмся».",
    ],
    bullets: [
      "Два жилья: certidão urbanística + PDM — coeficiente de utilização, отступы, макс. высота; спросите Câmara явно про segunda unidade habitacional.",
      "Água: точка подключения, тариф acesso, очередь Câmara/EPAL; без licença de utilização счётчик не откроют.",
      "Eletricidade: EDP/Iberdrola — potência (kVA), расстояние до опоры; в rural часто €3 000–12 000 acesso.",
      "Saneamento: rede pública vs fossa séptica (licença ARH); telecom — MEO/NOS/ Vodafone coverage на участке.",
      "Дорога: estrada municipal в хорошем состоянии vs servidão de passagem — проверьте registo predial и план; зимой проезд после дождя (@autolife_pt).",
    ],
  },
  {
    heading: "Бюджет кейса Norte 2026: земля → гостевой → основной",
    section_kind: "practice",
    paragraphs: [
      "Что делать: считайте четыре корзины — terreno, бюро (arquiteto/topógrafo/licenças), гостевой 60 m², основной 120 m² — плюс 12–15% резерв на инфляцию материалов (по сигналам @lepta, 2025).",
      "Зачем: «участок дешёвый» часто компенсируется acesso água/luz и reconversão; гостевой не всегда дешевле за m², если нужен качественный фундамент под влажный Norte.",
      "Главное: мягкие вилки ниже — для solo urbano Braga/Guimarães с коммуникациями; rustico, reconversão или AL добавят €15 000–40 000 сверху.",
    ],
    bullets: [
      "Terreno 800–1 200 m² solo urbano (Braga/Guimarães periphery): €60 000–130 000; IMT + notário + registo: €5 000–12 000.",
      "Бюро: arquiteto + topógrafo + проекты на два объёма + сопровождение licenças: €18 000–35 000 (два цикла согласования).",
      "Гостевой ~60 m² (фундамент, кровля, инженерка, отделка средняя+): €85 000–110 000 (€1 400–1 800/m²).",
      "Основной ~120 m² (полный empreiteiro, средняя+ отделка): €170 000–230 000.",
      "Итого ориентир: €340 000–520 000 «под два дома» без мебели; сравните с [покупкой готовой квартиры](/notes/" + APARTMENT_BUY_SLUG + ") €280 000–440 000 за T2 в Porto — trade-off время vs готовность.",
    ],
  },
  {
    heading: "Риски двухфазной застройки и когда «сначала гостевой»",
    section_kind: "gap",
    paragraphs: [
      "Зачем вам это сейчас: стратегия «гостевой → основной» спасает от аренды, но проигрывает, если PDM режет второй объём или AL в concelho почти невозможен.",
      "Что делать: сравните три сценария — двухфазная застройка, один дом сразу 180 m², готовый дом/квартира — по сроку, cashflow и стрессу семьи.",
      "Зачем: humidade Norte бьёт по лёгким конструкциям без isolamento — см. [климат Norte](/notes/" + NORTE_CLIMATE_SLUG + "); экономия на гостевом оборачивается bolor через два сезона.",
      "Главное: гостевой-first имеет смысл при подтверждённом праве на два жилья, готовом доступе и горизонте 2+ лет; иначе быстрее купить готовое жильё и строить без давления.",
    ],
    bullets: [
      "PDM не допускает два habitacao — второй объём не licenciруют; reconversão rustico затягивает кейс на годы.",
      "AL (Alojamento Local): в Porto centro и части concelhos мораторiums; в rural Norte проще, но нужны отдельный вход, estacionamento, licença municipal — правила 2026 ужесточаются.",
      "Влажность и плесень: без ventilação и isolamento гостевой на pré-fabricado страдает первым — закладывайте desumidificador и projeto térmico.",
      "Соседи и obra: lepta — шумные работы по horário; жить на участке во время стройки основного дома — пыль, грязь, конфликты.",
      "«Сначала гостевой» оправдан: семья с детьми, подтверждённый urbano, коммуникации у границы, бюджет на два цикла licença, готовность к 24–36 мес.",
      "Купить готовый дом/квартиру лучше: нужен переезд за 3–6 мес., нет уверенности в PDM, нет advogado/arquiteto в команде, rustico «ради вида».",
    ],
  },
  {
    heading: "Где закон и практика расходятся",
    section_kind: "gap",
    bullets: [
      "Lei dos solos: «снизит цены на жильё на 20%» (lepta, 2025) → reconversão rustico в urbano занимает годы; не каждый участок подходит.",
      "Объявление: «terreno com possibilidade de construção» → без certidão urbanística это маркетинг; possibilidade ≠ licença garantida.",
      "«Куплю rustico дёшево и поставлю modular» → modular тоже требует licença; вне solo urbano почти всегда отказ.",
      "Соседи: «участок тихий» → lepta Vila do Conde: лицензированное производство в 50 см от дома — проверяйте PIP соседей.",
      "Цены материалов: план правительства (lepta) — на практике смета empreiteiro растёт по ходу obra; закладывайте 10–15% резерв.",
      "30% земель без известного владельца → наследственные споры и двойные продажи; advogado + certidão до депозита.",
      "Шум и работы: lepta — закон о тишине ограничивает часы obra; штрафы за работы вне horário.",
      "Подключения: Câmara выдала licença → на практике água/ESGOTOS/EDP в rural 3–9 мес. очередь и взносы acesso.",
    ],
  },
  {
    heading: "Таймлайн покупки и типичные ошибки",
    section_kind: "practice",
    paragraphs: [
      "Реалистичный путь релоканта: NIF → поиск terreno с advogado → certidão urbanística → CPCV (предконтракт) → escritura → projeto → licença → obra → licença de utilização → переезд.",
    ],
    bullets: [
      "Ошибка: депозит на terreno без certidão de informação urbanística и проверки PDM.",
      "Ошибка: экономия на topógrafo — споры по границам останавливают licença на месяцы.",
      "Ошибка: verbal deal с empreiteiro без contrato, prazos и IVA в fatura.",
      "Ошибка: не заложить IMT + notário + проекты в бюджет — «только цена земли» обманчива.",
      "Ошибка: покупка rustico «ради вида» без плана reconversão — licença de habitação может не случиться.",
      "Ошибка: игнорировать limpeza de terreno — штрафы GNR/мunicipio и риск пожара (lepta, 2025).",
      "Ошибка: начать obra до licença de construção — multa, снос, невозможность utilização.",
    ],
  },
];

const keyTakeaways = [
  "Официально: строить можно только при соответствии PDM; certidão urbanística Câmara — первый документ после выбора участка.",
  "Официально: licença de construção требует arquiteto, topógrafo и empreiteiro с alvará; IMT при покупке земли — через Finanças.",
  formatPracticeTakeaway({
    channels: ["por_tugal", "lepta"],
    period: "2026",
    claim:
      "в Norte популярны concelhos (муниципалитеты) Braga, Guimarães, Esposende и Viana — бюджет участок+дом €200k–450k",
    forReader: "сравнивайте не только цену terreno, но и commute и инфраструктуру — дешёвый участок может быть далеко от школ и больниц",
  }),
  formatPracticeTakeaway({
    channels: ["lepta"],
    period: "2025–2026",
    claim: "по опыту чатов у ~30% земель в объявлениях владелец неочевиден или спорен",
    forReader: "advogado (юрист) и certidão permanente (выписка из реестра) до сделки обязательны — иначе риск потерять депозит",
  }),
  formatPracticeTakeaway({
    channels: ["por_tugal", "lepta"],
    period: "2025–2026",
    claim: "срок проекта «под ключ» обычно 18–30 месяцев — licença de construção (разрешение) 4–12 мес., стройка 10–18 мес.",
    forReader: "закладывайте резерв 10–15% на смету — empreiteiro (подрядчик) часто пересматривает цену по ходу obra",
  }),
  formatPracticeTakeaway({
    channels: ["por_tugal", "lepta", "autolife_pt"],
    period: "2026",
    claim:
      "двухфазный кейс «гостевой 60 m² → основной 120 m²» занимает 24–36 мес. и €340k–520k в Norte при solo urbano",
    forReader:
      "до escritura проверьте certidão urbanística на два жилья, servidão de passagem и точки água/luz — иначе гостевой-first превращается в аренду + суд",
  }),
  "Расхождение: «terreno com possibilidade de construção» в объявлении → без certidão urbanística это не гарантия licença.",
  formatPracticeTakeaway({
    channels: ["lepta"],
    period: "2025–2026",
    claim:
      "участок solo rustico (сельхозземля) дешевле, но reconversão (перевод в застройку) по lei dos solos занимает годы",
    forReader: "solo urbano (земля под застройку) дороже, зато licença предсказуемее — для семьи с детьми это часто безопаснее",
  }),
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Можно ли купить землю в Norte и сразу строить дом?",
    a: "По правилам — только если участок solo urbano и PDM разрешает habitação. На практике сначала certidão urbanística в Câmara, затем projeto и licença (4–12 мес.); стройка без licença — штраф и снос.",
  },
  {
    q: "Что такое PDM и где его смотреть?",
    a: "Plano Director Municipal — генеральный план concelho. Официально публикуется на сайте Câmara Municipal (Braga, Porto, Guimarães и др.). На практике закажите certidão de informação urbanística по конкретному terreno — это юридически точнее карты.",
  },
  {
    q: "Сколько стоит IMT при покупке участка?",
    a: "По правилам Finanças ставка зависит от типа imóvel и муниципалитета (часто 6,5–7,5% для urbano + Imposto do Selo). На практике используйте симулятор IMT на portaldasfinancas.gov.pt до подписания CPCV.",
  },
  {
    q: "Нужны ли arquiteto и topógrafo?",
    a: "Да, по правилам licenciamento arquiteto OA обязателен для projeto; topógrafo — для границ и привязки к PDM. На практике без topografia споры с соседями — частая причина задержки licença на 6+ месяцев.",
  },
  {
    q: "Какие муниципалитеты Norte выбирают релоканты?",
    a: "Braga, Guimarães, Esposende, Viana do Castelo, Ponte de Lima, Amarante, Vila Nova de Famalicão — баланс цены и доступа к Porto. По правилам везде свой PDM; на практике Braga/Guimarães проще с инфраструктурой, Esposende — с морем, но дороже terreno.",
  },
  {
    q: "Сколько времени занимает постройка дома?",
    a: "Официально сроки licença задаёт Câmara (месяцы). На практике полный цикл 18–30 мес.: сделка 1–2 мес., licença 4–12 мес., obra 10–18 мес., licença de utilização 1–2 мес. Двухфазный кейс гостевой + основной — 24–36 мес.",
  },
  {
    q: "Можно ли построить два дома на одном участке в Norte?",
    a: "По правилам — только если PDM и certidão urbanística допускают две unidades habitacionais на terreno. На практике это чаще solo urbano с достаточным coeficiente; rustico почти всегда reconversão. Закажите certidão до CPCV и спросите arquiteto — не верьте объявлению «possibilidade de duas moradias».",
  },
  {
    q: "Имеет ли смысл сначала гостевой дом, потом основной?",
    a: "Да, если подтверждено право на два жилья, есть коммуникации и servidão, и вы готовы к 24–36 мес. и аренде только до сдачи гостевого. Нет, если PDM неясен, rustico без reconversão или нужен переезд за 3–6 мес. — тогда сравните с покупкой готовой квартиры или дома.",
  },
];

export const LAND_BUILD_NORTE_GUIDE = {
  slug: LAND_BUILD_NORTE_GUIDE_SLUG,
  category: "Жильё и быт",
  content_kind: "guide" as ContentKind,
  title: "Покупка земли и постройка дома в Norte Португалии 2026: PDM, licença, IMT",
  excerpt:
    "Terreno в Braga, Guimarães, Esposende: PDM, certidão urbanística, licença de construção. Кейс: гостевой 60 m² → основной 120 m², чеклист до escritura, бюджет Norte 2026.",
  seo_title: "Земля и постройка дома Norte PT 2026",
  seo_description:
    "Гайд по покупке земли и стройке дома в Norte 2026: PDM, licença de construção, кейс двух домов на участке, чеклист до escritura, бюджет и риски в Braga.",
  quick_answer:
    "На Idealista — зелёный участок в Guimarães, а в Câmara вопрос не про вид, а про PDM: можно ли два жилья и где água. Покупка terreno в Norte начинается с certidão urbanística; кейс «гостевой 60 m² → основной 120 m²» — 24–36 мес., €340k–520k. До escritura проверьте servidão и коммуникации; IMT — симулятор Finanças.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "Portal das Finanças — IMT", url: "https://www.portaldasfinancas.gov.pt/" },
    { title: "ePortugal — Urbanismo", url: "https://eportugal.gov.pt/" },
    { title: "Câmara Municipal de Braga", url: "https://www.cm-braga.pt/" },
    { title: "Câmara Municipal de Guimarães", url: "https://www.guimaraes.pt/" },
    { title: "Ordem dos Arquitetos", url: "https://www.arquitetos.pt/" },
    { title: "Diário da República — lei dos solos", url: "https://dre.pt/" },
  ],
  topic_tags: ["arenda", "portugal"],
  hashtags: buildNoteHashtags({
    topicTags: ["arenda", "portugal"],
    contentKind: "guide",
    extra: ["porto", "braga", "norte", "terreno", "строительство", "жильё"],
  }),
  source_channel: "chatlisboa+por_tugal+lepta",
  source_label: "editorial:land-build-norte",
};
