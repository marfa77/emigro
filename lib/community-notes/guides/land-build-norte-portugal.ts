/**
 * Hand-curated guide — grandfather-to-grandson voice for a modern ~120 m² house
 * in Norte: land search → contracts → build control; plus buy-ready vs renovate vs build.
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { formatPracticeTakeaway } from "@/lib/community-notes/practice-format";
import { CAR_PORTUGAL_GUIDE_SLUG } from "@/lib/community-notes/guides/car-portugal-buy-rent-import";
import type {
  CommunityNoteFaq,
  ContentKind,
  NoteBodyImage,
  NoteBodySection,
  NoteBodyTable,
} from "@/lib/community-notes/types";

export const LAND_BUILD_NORTE_GUIDE_SLUG = "pokupka-zemli-postroyka-doma-norte-portugaliya-2026";

const APARTMENT_BUY_SLUG = "kupit-kvartiru-portugaliya-norte-2026";
const NORTE_CLIMATE_SLUG = "klimat-norte-zhara-vlazhnost-plesen-zima-2026";
const PORTO_BRAGA_RENT_SLUG = "arenda-dolgosrok-porto-braga-2026";
const PORTO_VS_BRAGA_SLUG = "porto-vs-braga-semya-mezhdunarodnaya-shkola-2026";
const REGIONS_SLUG = "regiony-portugalii-ekspaty-klimat-tseny-2026";
const PORTO_NEWBUILD_SLUG = "porto-novostrojki-klastery-community-2026";

const IMG = "/images/community-notes/inline/land-build-norte";

function photo(
  file: string,
  alt: string,
  caption: string,
  credit: string,
  creditUrl: string
): NoteBodyImage {
  return {
    src: `${IMG}/${file}.webp`,
    alt,
    caption,
    credit,
    creditUrl,
  };
}

const PATH_COMPARE: NoteBodyTable = {
  columns: ["Параметр", "Готовый дом", "Под реновацию", "Стройка с нуля (~120 m²)"],
  rows: [
    [
      "Когда въезжаете",
      "Часто 1–3 месяца после сделки",
      "3–18 месяцев (глубина obra)",
      "Обычно 18–30 месяцев от поиска земли",
    ],
    [
      "Контроль планировки",
      "Почти никакого — берёте как есть",
      "Средний: старый каркас диктует многое",
      "Высокий: объём, свет, изоляция, сад",
    ],
    [
      "Риск сюрприза",
      "Скрытые дефекты, крыша, канализация",
      "Высокий: humidade, фундамент, электрика",
      "Средний: сроки Câmara, сети, рельеф",
    ],
    [
      "Ориентир работ",
      "Мелкий ремонт по желанию",
      "Часто ≈ €500–1 200/m²; глубокая — дороже",
      "Часто ≈ €1 200–1 800/m² (средняя отделка)",
    ],
    [
      "IVA на obra (типично)",
      "Как у подрядчика на мелкий ремонт",
      "В ARU / reabilitação часто 6% при условиях",
      "Новая construção обычно 23%",
    ],
    [
      "Кому подходит",
      "Ключи и школа уже в этом году",
      "Любите локацию, готовы к пыли и сметам",
      "Дом «под себя» и терпите срок",
    ],
  ],
};

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(
      glossaryForSlug(LAND_BUILD_NORTE_GUIDE_SLUG)!,
      "Эти слова встретятся у Câmara, у адвоката и на стройплощадке. Лучше выучить их до первого задатка — как таблицу умножения перед экзаменом."
    ),
  },
  {
    heading: "Официально: бумаги до любого sinal",
    section_kind: "official",
    paragraphs: [
      "До задатка advogado берёт certidão permanente в Registo Predial и сверяет владельца, границы, hipotecas и servidões. Матрица и реестр должны говорить об одном участке — если имена и площади пляшут, останавливаешься.",
      "Архитектор смотрит PDM и просит certidão de informação urbanística или PIP: можно ли посадить современный дом около 120 m², какие отступы, высота, коэффициент. Solo urbano предсказуемее; solo rústico не становится строительным от фразы «скоро переведут». Reconversão, если вообще возможна, часто тянется 12–24 месяца без гарантии.",
      "Отдельно проверяют flood/coastal/fire constraints, limpeza de mato, água, saneamento и eletricidade у границы. «Сеть на карте» не равна точке подключения с техническими условиями и сметой.",
      "Главное: CPCV подписывают только после титула и письменной градостроительной ясности — не после ужина с риелтором.",
    ],
    bullets: [
      "Certidão permanente + matriz + planta → advogado.",
      "PDM + informação urbanística / PIP → независимый arquiteto OA.",
      "Сети и ограничения — письменно, до sinal.",
      "Откажитесь от сделки, если право строить держится на обещании продавца.",
      "Не копируйте чужую ставку IMT из чата на свой terreno.",
    ],
  },
  {
    heading: "Официально: CPCV, налоги, escritura и registo",
    section_kind: "official",
    paragraphs: [
      "В CPCV прописывают выход, если Câmara не подтвердит заявленную capacidade construtiva, и разумный срок на due diligence. Шаблон агентства правит ваш адвокат.",
      "Перед escritura считают IMT и Imposto do Selo на Portal das Finanças по классификации именно этого terreno и цене сделки.",
      "После escritura сразу Conservatória do Registo Predial и новая certidão. Только потом платят за полный проект и серьёзные работы.",
      "Главное: CPCV → налоги → escritura → registo — в этом порядке, без «потом зарегистрируем».",
    ],
    bullets: [
      "Защитные условия в CPCV до перевода sinal.",
      "Симуляция IMT/Selo у Finanças перед нотариусом.",
      "Registo в тот же цикл, что и сделка.",
      "Храните certidões и квитанции в одном досье проекта.",
    ],
  },
  {
    heading: "Официально: проект, PIP и licença de construção",
    section_kind: "official",
    paragraphs: [
      "Архитектор собирает архитектуру и специальности. Если параметров мало, сначала PIP — письменная предварительная позиция Câmara; благоприятный PIP связывает муниципалитет в рамках оценённого объёма и имеет срок (ориентир порядка двух лет по актуальному RJUE — сверяйте дату решения). Меняете объём — можете потерять силу старого PIP.",
      "Затем pedido de licença de construção или путь, который укажет Câmara. На ответы закладывайте 4–12 месяцев: дозапросы — норма. Строить до licença — путь к штрафу и проблемам с utilização.",
      "Современный дом 120 m² в Norte спорит с влажностью: изоляция, вентиляция, отвод воды — часть проекта, не опции. См. [климат Norte](/notes/" +
        NORTE_CLIMATE_SLUG +
        ").",
      "Главное: licença разрешает строить; красивый 3D-рендер — ещё нет.",
    ],
    bullets: [
      "Не начинайте obra до письменного разрешения Câmara.",
      "Храните ofícios муниципалитета в одной папке.",
      "Согласуйте изменения проекта до бетона.",
      "Проверьте регистрацию архитектора в Ordem dos Arquitectos.",
    ],
  },
  {
    heading: "Официально: utilização, сети и въезд",
    section_kind: "official",
    paragraphs: [
      "После завершения obra оформляют документы и предусмотренную Câmara проверку для licença / autorização de utilização. Без этого постоянный въезд — риск. Постоянные água и luz доводят по правилам поставщиков; временный свет на стройке не равен финальному договору на жилой дом.",
      "Сохраните as-built, гарантии, faturas, certidões — при продаже через годы это золото. Сроки гарантии уточняйте в contrato и у юриста.",
      "Главное: дом закончен, когда есть utilização, а не когда подрядчик сказал «почти готово».",
    ],
    bullets: [
      "Utilização до постоянного переезда.",
      "Архив документов проекта в одном месте.",
      "Финальная приёмка с чек-листом дефектов.",
      "Не путайте временные сети стройки с постоянными договорами.",
    ],
  },
  {
    heading: "Сядь рядом: о чём этот путь",
    section_kind: "practice",
    paragraphs: [
      "Слушай. Хочешь современный дом около 120 квадратов в Norte — не «коробку из Instagram», а место, где зимой не пахнет сыростью. Тогда забудь сказку «купил участок в понедельник — въехал в среду». Путь честный: земля и бумаги, архитектор, подрядчик, контроль obra, и только потом ключи.",
      "Ниже — полный разбор стройки такого дома и короткое сравнение с готовым жильём и домом «под реновацию», чтобы не путать три разные жизни. Цифры 2026 — рыночные ориентиры: перед деньгами пересчитай у advogado, архитектора и трёх сметчиков.",
      "Главное: каждый следующий платёж открывается документом предыдущего шага.",
    ],
    bullets: [
      "Цель — один современный дом ≈ 120 m², не «два дома на участке».",
      "Сравни готовое / реновацию / стройку до shortlist.",
      "Бумаги сильнее чата: certidão, PDM, licença, contrato, faturas.",
    ],
  },
  {
    heading: "Три дороги: готовый дом, реновация или стройка",
    section_kind: "practice",
    paragraphs: [
      "Готовый дом — если нужны школа и тишина этой осенью. Смотри [покупку жилья](/notes/" +
        APARTMENT_BUY_SLUG +
        ") и [новостройки Porto](/notes/" +
        PORTO_NEWBUILD_SLUG +
        "): быстрее, меньше творчества.",
      "Дом под реновацию — когда влюбился в улицу. Косметика и глубокая reabilitação — разные бюджеты. В Norte humidade не прощает «подкрасим». В ARU на reabilitação иногда IVA 6% — только при условиях закона и нормальном contrato; это не скидка на любой ремонт.",
      "Стройка с нуля — современный объём, isolamento, ориентация к солнцу. 18–30 месяцев от поиска земли — обычный горизонт для традиционной obra под проектом архитектора.",
      "Главное: выбирай путь по сроку жизни семьи, а не по красивому объявлению.",
    ],
    table: PATH_COMPARE,
    images: [
      photo(
        "pronto-casa-minho",
        "Традиционный дом в Minho — пример готового жилья в Norte",
        "Готовый дом: ключи быстрее, планировку диктует прошлое",
        "João Paulo Martins · CC BY 4.0 / Wikimedia",
        "https://commons.wikimedia.org/wiki/File:Casa_de_Lamas_-_Vieira_do_Minho_-_Portugal_%F0%9F%87%B5%F0%9F%87%B9_(54749784896).jpg"
      ),
      photo(
        "renovacao-gaia",
        "Реставрация фасада дома в Gaia, рядом с Porto",
        "Реновация: локация может быть золотой, смета — с сюрпризами",
        "Adam Jones · CC BY-SA 2.0 / Wikimedia",
        "https://commons.wikimedia.org/wiki/File:Restoration_Work_on_House_in_Gaia_District_-_Porto_-_Portugal_(4642315593).jpg"
      ),
    ],
    bullets: [
      "Нужны ключи за квартал — смотри готовое.",
      "Нравится старый квартал — считай реновацию с инженером.",
      "Хочешь 120 m² под себя — стройка; заложи аренду на весь срок.",
    ],
  },
  {
    heading: "Где искать землю под современный дом",
    section_kind: "practice",
    paragraphs: [
      "Начни с shortlist concelhos: работа, школа, аэропорт. Braga, Guimarães, Famalicão — быт; Maia и Vila do Conde — ближе к Porto; Esposende и Viana — coastal/flood; Ponte de Lima и Amarante — спокойнее rural. Сверься с [регионами](/notes/" +
        REGIONS_SLUG +
        "), [климатом](/notes/" +
        NORTE_CLIMATE_SLUG +
        ") и [Porto vs Braga](/notes/" +
        PORTO_VS_BRAGA_SLUG +
        ").",
      "Idealista и Imovirtual: «terreno» / «para construção». Сохраняй loteamento aprovado, projeto aprovado, PIP favorável — но адвокат и архитектор должны увидеть само решение Câmara, срок, площади и сети. Реклама «aprovado» без бумаги не считается.",
      "До поездки — artigo matricial, certidão, planta, pin. На месте — подъезд после дождя, уклон, servidão, соседние стройки.",
      "Главное: shortlist из трёх-четырёх concelhos и документы до визита.",
    ],
    bullets: [
      "15–20 объявлений → 5–7 по commute и типу solo.",
      "Лоты с проектом/PIP — всё равно проверь бумагу Câmara.",
      "Повтори осмотр лучшего участка после дождя.",
    ],
  },
  {
    heading: "Где искать архитектора и как его выбрать",
    section_kind: "practice",
    paragraphs: [
      "Архитектор ведёт тебя через Câmara. Ищи в Ordem dos Arquitectos (arquitectos.pt), через рекомендации в том же concelho, у eng. civil и topógrafo. Муниципалитеты отличаются характером.",
      "На встречу принеси pin, certidão и программу: ≈ 120 m², спальни, кабинет, гараж, бюджет. Попроси примеры licenças в твоей Câmara и гонорар по фазам. Проектная команда часто ≈ €8 000–25 000 — вилка рынка, не тариф.",
      "Без OA «друг из чата» вернёт тебя к нулю на дозапросах. Topografia — до финальной посадки дома.",
      "Главное: arquiteto OA с опытом твоего concelho дешевле двух кругов отказа.",
    ],
    bullets: [
      "Проверь OA на arquitectos.pt.",
      "Referências в том же муниципалитете.",
      "Письменный договор на фазы с архитектором.",
      "Не начинай проект без topografia участка.",
    ],
  },
  {
    heading: "Где искать строителей",
    section_kind: "practice",
    paragraphs: [
      "Empreiteiro — по alvará IMPIC, завершённым домам в том же concelho и готовности выставлять faturas с IVA. Попроси у архитектора три имени, сходи на их объекты, поговори с хозяевами без посредника. Объявления «под ключ дёшево» без alvará и без адреса конторы — мимо.",
      "Опция, не ось статьи: часть компаний предлагает modular / pré-fabricado. Это способ собрать дом быстрее на площадке, но PDM, licença и contrato всё равно нужны — как у обычной стройки. Если смотришь такую смету, отдельно спроси фундамент, сети, гарантию и кто ведёт utilização.",
      "Главное: сначала законный проект и понятный contrato с проверяемым подрядчиком, потом споры о технологии стен.",
    ],
    bullets: [
      "Три сметы на одном техническом задании.",
      "Alvará IMPIC + faturas + живые referências.",
      "Не путай скорость монтажа с отменой licença Câmara.",
    ],
  },
  {
    heading: "Как заключать контракты",
    section_kind: "practice",
    paragraphs: [
      "С архитектором — фазы, сроки подачи в Câmara, acompanhamento, оплата изменений. С empreiteiro — contrato de empreitada: mapa de quantidades, материалы, календарь, этапные платежи, retenção, alterações, страховки.",
      "Не плати половину «вперёд на материалы». Этапы под акты: фундамент, структура, кровля, сети, отделка. Каждая оплата — fatura. Наличные без IVA экономят сегодня и дорожают при продаже и споре.",
      "Юрист, который понимает construção, читает contrato до подписи. Зафиксируй diário de obra и приёмку скрытых работ.",
      "Главное: договор — твоя память на бумаге, когда через полгода все «помнили иначе».",
    ],
    bullets: [
      "Объём, цена, сроки, изменения, retenção — в тексте.",
      "Оплата только по этапам и faturas.",
      "Юрпроверка contrato до крупного платежа.",
      "Не принимай устные «договоренности» вместо приложения к договору.",
    ],
  },
  {
    heading: "Как контролировать стройку",
    section_kind: "practice",
    paragraphs: [
      "Ходи на площадку с архитектором или fiscalização. Фотографируй арматуру до бетона, гидроизоляцию, утеплитель, кровлю, сети. Сверяй с проектом.",
      "На каждый этап — письменный акт. В Norte особенно смотри воду и узлы, где родится bolor. Если подрядчик тянет — письма с датой и консультация по contrato; не доплачивай «чтобы доделали» без нового графика.",
      "Аренду считай полной строкой — [Porto/Braga](/notes/" +
        PORTO_BRAGA_RENT_SLUG +
        "). Для rural — [машина](/notes/" +
        CAR_PORTUGAL_GUIDE_SLUG +
        ").",
      "Главное: контроль — ритм визитов и бумаг, не разовый заезд в воскресенье.",
    ],
    bullets: [
      "Визиты + фото скрытых работ до закрытия.",
      "Акты этапов до оплаты.",
      "Резерв 5–10% сверх договора.",
      "Фиксируй отклонения от проекта письменно в тот же день.",
    ],
  },
  {
    heading: "Бюджет и срок современного дома ≈ 120 m²",
    section_kind: "practice",
    paragraphs: [
      "Ориентир 2026 Norte: стройка средней отделки часто ≈ €1 200–1 800/m²; для ≈ 120 m² это грубо €145k–220k только obra, плюс terreno, налоги, проекты (€8k–25k), сети, ландшафт и аренда на 18–30 месяцев. Полный «земля + дом» часто ≈ €200k–450k; близость к Porto выталкивает выше.",
      "Сравни с готовым домом той же площади: разница меньше ≈ 15–20% — стройка может не окупить нервы. Разница больше и важны планировка/энергия — стройка имеет смысл.",
      "Nota Emigro (fact-check): вилки €/m², сроки Câmara и IVA 6%/23% — ориентиры; soft-verify у Finanças, IMPIC, Câmara, OA и в сметах. PIP и «проект aprovado» читай в оригинале решения.",
      "Главное: считай цепочку до въезда, не только цену участка.",
    ],
    bullets: [
      "Три сметы + резерв 5–10%.",
      "Аренда и сети — отдельные строки.",
      "Сравни стройку с готовым домом до CPCV на землю.",
    ],
  },
  {
    heading: "Дорожная карта: от Idealista до ключей",
    section_kind: "action_guide",
    paragraphs: [
      "Месяцы 0–2: shortlist, осмотры после дождя, advogado + arquiteto до sinal, CPCV, налоги, escritura, registo.",
      "Месяцы 2–12: topografia, проект, PIP при необходимости, licença; выбор empreiteiro и contrato.",
      "Месяцы 8–24: obra под контролем, акты, сети; аренда продолжается.",
      "Финиш: utilização, постоянные подключения, переезд. На спокойном solo urbano часто 18–30 месяцев.",
      "Главное: не перескакивай фазы — Norte наказывает спешку сыростью и бумагой.",
    ],
    bullets: [
      "Сначала земля и бумаги, потом бетон.",
      "Сначала contrato, потом крупные платежи.",
      "Сначала utilização, потом новоселье.",
    ],
  },
  {
    heading: "Что обещают чаты — и как бывает на деле",
    section_kind: "gap",
    paragraphs: [
      "Чат: «possibilidade de construção — почти licença». На деле нужны informação urbanística / PIP и часто полный licenciamento.",
      "Чат: «модульный дом без бюрократии». На деле это только опция сборки; Câmara всё равно смотрит PDM и разрешение.",
      "Чат: «знакомый без IVA». На деле без faturas сложнее кредит, продажа и спор.",
      "Главное: документ Câmara и подписанный договор сильнее голосового в Telegram.",
    ],
    bullets: [
      "Проверяй «проект aprovado» в бумаге Câmara.",
      "Не путай рекламу технологии с отменой licença.",
      "Плати по faturas.",
    ],
  },
  {
    heading: "Типичные ошибки релокантов и чего избегать",
    section_kind: "practice",
    paragraphs: [
      "Sinal до проверки титула и PDM. Покупка rústico «ради вида» с бюджетом на быструю reconversão. Устная смета и оплата вперёд. Empreiteiro без alvará. Obra до licença. Въезд до utilização. Экономия на topografia и скрытых работах.",
      "Главное: участок — после due diligence, стройка — после licença, оплата — по этапам, въезд — после utilização.",
    ],
    bullets: [
      "Не переводи sinal вслепую.",
      "Не строй без разрешения Câmara.",
      "Не плати крупные суммы без акта этапа и fatura.",
      "Не принимай дом без акта и utilização.",
      "Не нанимай empreiteiro без alvará IMPIC и referências.",
    ],
  },
];

const keyTakeaways = [
  "Официально: до CPCV — certidão permanente, PDM и письменная informação urbanística / PIP.",
  "Официально: CPCV → IMT/Selo → escritura → registo → проект → licença → obra → utilização.",
  formatPracticeTakeaway({
    period: "2026",
    claim: "современный дом ≈ 120 m² в Norte часто требует 18–30 месяцев и ≈ €1 200–1 800/m² стройки",
    forReader: "заложи сети, аренду, проекты и резерв 5–10%, сравни с готовым домом в том же concelho",
  }),
  formatPracticeTakeaway({
    period: "2026",
    claim: "arquiteto OA, empreiteiro с alvará IMPIC, contrato с этапами и контроль скрытых работ",
    forReader: "ищи через OA и concelho, плати по faturas и актам",
  }),
  "Расхождение: готовый / реновация / стройка — разные сроки; «possibilidade de construção» ≠ licença.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "С чего начать дом ≈ 120 m²?",
    a: "С shortlist concelhos и terreno para construção, затем due diligence до sinal, CPCV/escritura/registo, arquiteto OA, licença, contrato с empreiteiro и контроль до utilização.",
  },
  {
    q: "Что лучше: готовый, реновация или стройка?",
    a: "Готовый — быстрые ключи. Реновация — критична локация старого дома. Стройка — планировка «под себя» и готовность к 18–30 месяцам. Сравни полную стоимость в одном concelho.",
  },
  {
    q: "Брать участок с проектом aprovado или PIP?",
    a: "Да как ускоритель — если видите само решение Câmara, срок, площади и условия. Фраза в Idealista без документа не считается.",
  },
  {
    q: "Где искать архитектора?",
    a: "Ordem dos Arquitectos, рекомендации в concelho, инженеры и геодезисты. Просите примеры лицензий в вашей Câmara и договор на фазы.",
  },
  {
    q: "Где искать строителя?",
    a: "По alvará IMPIC, referências на завершённых домах в concelho и готовности работать по fatura. Три сопоставимые сметы на одном ТЗ. Modular/pré-fabricado — лишь опция сборки при тех же PDM и licença.",
  },
  {
    q: "Что писать в contrato с empreiteiro?",
    a: "Объём, материалы, календарь, этапные платежи, retenção, изменения, страховки. Оплата после актов, не половина наличкой вперёд.",
  },
  {
    q: "Как контролировать стройку без опыта?",
    a: "Визиты с архитектором/fiscalização, фото скрытых работ, сверка с проектом, акты до оплаты. В Norte — вода и изоляция.",
  },
  {
    q: "Сколько денег и времени?",
    a: "Ориентир стройки ≈ €1 200–1 800/m² плюс земля, налоги, проекты, сети и аренда; срок часто 18–30 месяцев. Берите три сметы.",
  },
  {
    q: "Можно ли начать до licença?",
    a: "Нет. Работа без разрешения Câmara рискует штрафом, остановкой и проблемами с utilização.",
  },
];

export const LAND_BUILD_NORTE_GUIDE = {
  slug: LAND_BUILD_NORTE_GUIDE_SLUG,
  category: "Жильё и быт",
  content_kind: "guide" as ContentKind,
  title: "Современный дом ≈120 m² в Norte 2026: земля, архитектор, стройка и контроль",
  excerpt:
    "Дед внуку: путь от поиска terreno до ключей дома ≈120 m² — бумаги, arquiteto, contrato, контроль obra; сравнение с готовым домом и реновацией.",
  seo_title: "Дом 120 m² в Norte 2026: стройка по шагам",
  seo_description:
    "Дом ≈120 m² в Norte 2026: поиск земли, PDM/PIP, CPCV, архитектор OA, empreiteiro, contrato и контроль стройки; сравнение с готовым и реновацией.",
  quick_answer:
    "Хочешь современный дом ≈120 m² в Norte — сначала земля и бумаги (certidão, PDM, PIP), потом CPCV → escritura → registo, затем arquiteto OA, licença, contrato с empreiteiro и контроль obra до utilização. Закладывай roughly 18–30 месяцев и стройку ≈ €1 200–1 800/m² плюс земля, сети и аренду; готовый дом и реновация — другие сроки и риски.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "Portal das Finanças — IMT", url: "https://www.portaldasfinancas.gov.pt/" },
    { title: "ePortugal — Urbanismo", url: "https://eportugal.gov.pt/" },
    { title: "Conservatória / Registo Predial", url: "https://justica.gov.pt/Servicos/Pedir-certidao-permanente-predial" },
    { title: "Ordem dos Arquitectos", url: "https://www.arquitectos.pt/" },
    { title: "IMPIC — alvarás construção", url: "https://www.impic.pt/" },
    { title: "Câmara Municipal de Braga", url: "https://www.cm-braga.pt/" },
    { title: "Câmara Municipal de Guimarães", url: "https://www.guimaraes.pt/" },
    { title: "Diário da República", url: "https://diariodarepublica.pt/" },
  ],
  topic_tags: ["arenda", "portugal"],
  hashtags: buildNoteHashtags({
    topicTags: ["arenda", "portugal"],
    contentKind: "guide",
    extra: ["porto", "braga", "norte", "terreno", "строительство", "жильё", "архитектор"],
  }),
  source_channel: "chatlisboa+por_tugal+lepta",
  source_label: "editorial:land-build-norte+120m2-grandpa+compare",
};
