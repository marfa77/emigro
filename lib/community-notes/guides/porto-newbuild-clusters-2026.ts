/**
 * Porto / Gaia / Matosinhos new-build clusters 2026.
 * Seasoned-realtor market overview: comparison table → one card per project (district, price, photos).
 * Fact-checked: NoLiPa/Avenue 466 = Lisboa; Fábrica Vilar = under construction; IVA 6% = construction contracts.
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { APARTMENT_BUY_NORTE_GUIDE_SLUG } from "@/lib/community-notes/guides/apartment-buy-norte-portugal";
import { MATOSINHOS_LIFE_SLUG } from "@/lib/community-notes/guides/matosinhos-life";
import { PORTO_DISTRICTS_GUIDE_SLUG } from "@/lib/community-notes/guides/porto-districts-life";
import type {
  CommunityNoteFaq,
  ContentKind,
  GlossaryTerm,
  NoteBodyImage,
  NoteBodySection,
  NoteBodyTable,
} from "@/lib/community-notes/types";

export const PORTO_NEWBUILD_CLUSTERS_SLUG = "porto-novostrojki-klastery-community-2026";

const IMG = "/images/community-notes/inline/novostrojki-porto";

function photo(
  file: string,
  project: string,
  label: string,
  credit: string,
  creditUrl: string
): NoteBodyImage {
  return {
    src: `${IMG}/${file}`,
    alt: `${project} — ${label}`,
    caption: `${label}`,
    credit,
    creditUrl,
  };
}

function projectCard(input: {
  heading: string;
  lead: string;
  detail: string;
  closing: string;
  images: NoteBodyImage[];
  bullets: string[];
}): NoteBodySection {
  return {
    heading: input.heading,
    section_kind: "practice",
    paragraphs: [input.lead, input.detail, `Главное: ${input.closing}`],
    images: input.images,
    bullets: input.bullets,
  };
}

/** Comparison matrix — official / dedicated project pages only. */
export const PORTO_NEWBUILD_CATALOG: NoteBodyTable = {
  columns: ["Проект", "Район / город", "Статус", "Ориентир T2", "Сайт"],
  rows: [
    ["Jardins da Seara", "Gaia, Oliveira do Douro", "Сданы фазы 1–2", "≈ €279–350k", "[Youropa](https://www.youropapt.com/developments/jardins-da-seara-phase-1)"],
    ["Essence", "Porto, Antas", "Сдан", "от ≈ €206k", "[ALMA](https://almadevelopment.pt/essence-porto/)"],
    ["BOAVISTA II", "Porto, Boavista", "Готов", "от ≈ €600k", "[Lucas Fox](https://www.lucasfox.pt/novos-empreendimentos/boavista-ii.html)"],
    ["COVELO PARK", "Porto, Paranhos", "Сдан", "T2 от ≈ €310k", "[ImoEquity](https://www.imoequity.pt/covelopark)"],
    ["The Avenue (Nort)", "Porto, Combatentes", "Готов", "≈ €750–950k", "[Nort](https://the-avenue.nort-properties.com/)"],
    ["Fernão Magalhães 127", "Porto, Bonfim", "Продажа / сдан", "T2 от €395k", "[Сайт проекта](https://www.fernaomagalhaes127.pt/)"],
    ["Antas Atrium", "Porto, Antas", "Строится", "T2 ≈ €397–482k", "[antasatrium.com](https://antasatrium.com/)"],
    ["Fábrica Vilar", "Porto, Cedofeita", "Строится", "по прайсу Youropa", "[Youropa](https://www.youropapt.com/developments/fabrica-vilar)"],
    ["NOMAD EDEN", "Porto, Foz", "Продажа", "от ≈ €1.1M", "[nomadeden.com](https://www.nomadeden.com/)"],
    ["Foz Nature", "Porto, Foz", "Продажа", "класс €1.2M+", "[foznature.pt](https://foznature.pt/)"],
    ["Marina Douro", "Gaia, у Douro", "Продажа / фазы", "T2 ≈ €450–630k", "[marinadouro.com](https://marinadouro.com/)"],
    ["Privilege Gardens", "Porto, Costa Cabral", "Продажа", "от ≈ €378k", "[HomeLovers](https://homelovers.com/empreendimento/porto/a155700/privilegegardens-porto-campanha)"],
    ["Costa Cabral Flats", "Porto, Antas", "Сдача ≈ дек. 2026", "от ≈ €220k", "[Prestige](https://prestigerealtyadvisors.pt/imovel/empreendimentos/porto/venda/costa-cabral-flats/)"],
    ["The Garden · Natura", "Matosinhos", "Сдан", "остатки T2 ≈ €465k", "[Efanor](https://www.jardinsefanor.pt/)"],
    ["Nautilus IV", "Matosinhos Sul", "Сдан ≈ 2025", "почти распродан", "[Prestige](https://prestigerealtyadvisors.pt/imovel/empreendimentos/matosinhos/venda/nautilus-iv/)"],
    ["Condomínio do Sobreiro", "Senhora da Hora", "Ключи ≈ конец 2025", "T2 ≈ €360–390k", "[Névoa](https://www.nevoa.pt/imobiliario/condominio-do-sobreiro)"],
    ["Lake · The Garden", "Matosinhos", "Строится ≈ 2027", "по прайсу Efanor", "[Lake](https://www.jardinsefanor.pt/pages/edificio-lake/)"],
    ["Menéres 777", "Matosinhos Sul", "Строится ≈ 2028", "T2 от ≈ €535k", "[MCaetano](https://grupomcaetano.pt/empreendimentos/meneres-777/)"],
  ],
};

const GLOSSARY_INTRO =
  "Пара слов из прайса и договора — чтобы не путать «двушку» с португальским T2 и цену в объявлении с тем, что вы реально заплатите у нотариуса.";

const DISCLAIMER =
  "**Emigro, август 2026.** Цены ниже — ориентиры из объявлений и маркетинга застройщиков, не финальная сделка. Сроки сдачи часто сдвигаются. Комплекс **Avenue на 466 квартир (NoLiPa) — это Лиссабон**, не Порту; в Порту у бренда Avenue смотрите [Fernão Magalhães 127](https://www.fernaomagalhaes127.pt/). Льгота IVA 6% касается строительных подрядов при условиях закона 2026, а не «скидки на любую новостройку на кассе». Это обзор рынка, не юридическая и не инвестиционная консультация. Рядом: [как купить квартиру на Norte](/notes/" +
  APARTMENT_BUY_NORTE_GUIDE_SLUG +
  "), [районы Порту](/notes/" +
  PORTO_DISTRICTS_GUIDE_SLUG +
  "), [жизнь в Matosinhos](/notes/" +
  MATOSINHOS_LIFE_SLUG +
  ").";

const LOCAL_GLOSSARY: GlossaryTerm[] = [
  { pt: "T2", ru: "две спальни + гостиная; не «двушка» в смысле СНГ" },
  { pt: "asking", ru: "цена в объявлении; до сделки обычно торгуются" },
  { pt: "promotor", ru: "застройщик / девелопер" },
  { pt: "CPCV", ru: "предварительный договор купли; обычно задаток 10–20%" },
  { pt: "off-plan", ru: "покупка на этапе стройки, до ключей" },
  { pt: "condomínio", ru: "ежемесячные платежи за общие зоны (бассейн, gym, охрана)" },
  { pt: "IMT", ru: "налог при покупке — считают до задатка" },
  { pt: "município", ru: "муниципалитет: Porto, Gaia и Matosinhos — три разных" },
];

const glossaryTerms = glossaryForSlug(PORTO_NEWBUILD_CLUSTERS_SLUG) ?? LOCAL_GLOSSARY;

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(glossaryTerms, GLOSSARY_INTRO),
    paragraphs: [GLOSSARY_INTRO, DISCLAIMER],
  },
  {
    heading: "Как сейчас выглядит рынок новостроек",
    section_kind: "official",
    paragraphs: [
      "Если смотреть Порту и окрестности глазами риелтора в 2026-м, картина такая: сильные локации (Foz, часть Boavista, хороший вид на Douro) легко уходят выше **€5–7.5k за м²**, а семейные комплексы в Gaia и Antas чаще держатся ближе к **€3.5–5k**. «Средняя цена по городу» из газеты вам почти не поможет — решают конкретный адрес, этаж и что входит в общий двор.",
      "Налоги и банк считают отдельно от красивой картинки на сайте. **IMT** и Imposto do Selo нужно прикинуть до задатка; сниженный IVA 6% — это про подряд на стройку при своих условиях и потолке цены около **€660k**, а не автоматическая скидка покупателю. Ипотека для нерезидента обычно жёстче по первоначальному взносу — сделайте расчёт в банке до эмоций от бассейна на крыше. Подробная цепочка сделки — в [гайде по покупке на Norte](/notes/" +
        APARTMENT_BUY_NORTE_GUIDE_SLUG +
        ").",
      "Главное: цена в объявлении — не финальный чек; налог на покупку никто не отменяет красивым рендером; Porto, Gaia и Matosinhos — разные муниципалитеты, это влияет на школы, налоги и ожидания.",
    ],
    bullets: [
      "Посчитайте налог на покупку на [Portal das Finanças](https://www.portaldasfinancas.gov.pt/) до задатка.",
      "Спросите банк, как они кредитуют объект на этапе стройки и какой нужен свой капитал.",
      "Заложите ежемесячные платежи за двор и общие зоны — бассейн после ключей не бесплатный.",
      "У застройщика уточните срок сдачи, штрафы за просрочку и разрешение на пользование.",
    ],
  },
  {
    heading: "Сравнительная таблица проектов",
    section_kind: "practice",
    paragraphs: [
      "Ниже — один взгляд на весь каталог: район, статус и ориентир по T2. Цены — из маркетинга и объявлений на момент обзора; перед визитом всегда сверяйте актуальный прайс на сайте проекта.",
      "Частая путаница в чатах: «Avenue на 466 квартир в Порту». Это **NoLiPa в Лиссабоне**. В Порту у Avenue — крупный [Fernão Magalhães 127](https://www.fernaomagalhaes127.pt/) и boutique [The Avenue от Nort](https://the-avenue.nort-properties.com/).",
      "Главное: сначала выберите 2–3 строки таблицы под бюджет и район, потом открывайте карточки проектов ниже — не пытайтесь смотреть все восемнадцать за один день.",
    ],
    table: PORTO_NEWBUILD_CATALOG,
    bullets: [
      "Откройте сайт проекта и попросите актуальную таблицу свободных T2.",
      "Проверьте, в каком муниципалитете объект: Порту, Gaia или Matosinhos.",
      "Idealista удобен для сравнения аренды и перепродаж, но не заменяет страницу застройщика.",
    ],
  },
  {
    heading: "Проекты по одному: что смотреть",
    section_kind: "practice",
    paragraphs: [
      "Дальше — каждый комплекс отдельно: где стоит, на какой стадии, какой ориентир по цене и что видно на фото (фасад, интерьер, где есть — планировка T2). Клик по фото увеличивает.",
      "Главное: читайте карточку как разговор с риелтором — район и бюджет важнее красивого дрона.",
    ],
  },

  projectCard({
    heading: "Jardins da Seara — Gaia, семейный формат",
    lead: "Oliveira do Douro, муниципалитет Gaia. Закрытый двор, сады, спортзал — типичный «семейный» продукт для тех, кто не хочет жить в центре Порту, но хочет новостройку с инфраструктурой внутри комплекса.",
    detail:
      "Фазы 1–2 уже сданы; фаза 3 ещё в работе. По объявлениям **T2 около €279–350k**. До центра Порту — через мост и пробки: замерьте утренний маршрут до школы или офиса, прежде чем влюбиться в рендер.",
    closing: "Хороший кандидат для семьи с бюджетом «средний+», если вас устраивает Gaia, а не открытка Ribeira.",
    images: [
      photo("jardins-seara-facade.jpg", "Jardins da Seara", "Фасад / двор", "Youropa", "https://www.youropapt.com/developments/jardins-da-seara-phase-1"),
      photo("jardins-seara-interior.jpg", "Jardins da Seara", "Гостиная", "Youropa", "https://www.youropapt.com/developments/jardins-da-seara-phase-1"),
      photo("jardins-seara-suite.jpg", "Jardins da Seara", "Спальня", "Youropa", "https://www.youropapt.com/developments/jardins-da-seara-phase-1"),
      photo("jardins-seara-kitchen.jpg", "Jardins da Seara", "Кухня", "Youropa", "https://www.youropapt.com/developments/jardins-da-seara-phase-1"),
    ],
    bullets: [
      "Сайт: [Youropa · Phase 1](https://www.youropapt.com/developments/jardins-da-seara-phase-1) и [Phase 3](https://www.youropapt.com/developments/jardins-da-seara---phase-3).",
      "Сверьте, какая фаза продаётся и есть ли уже разрешение на заселение.",
      "Замерьте дорогу до CLIP / OBS / работы в час пик.",
    ],
  }),

  projectCard({
    heading: "Essence — Antas, входной билет в новостройку",
    lead: "Район Antas / Monte Aventino в Порту. Четыре корпуса, около 84 квартир от студий до T4, закрытый сад и «цифровой» concierge в маркетинге. Это один из самых заметных объёмных проектов на востоке города.",
    detail:
      "Комплекс уже сдан. В рекламе вход **от ≈ €206k** — часто это меньшие типологии; реальный T2 смотрите в актуальной таблице на [сайте ALMA](https://almadevelopment.pt/essence-porto/). Рядом Dragão и новая ткань Antas: удобно, но не путайте с тихой Foz.",
    closing: "Берите как объёмный современный продукт в Antas — и всегда сверяйте именно нужную квартиру, а не «от» на баннере.",
    images: [
      photo("essence-facade.jpg", "Essence", "Вид на комплекс", "ALMA Development", "https://almadevelopment.pt/essence-porto/"),
      photo("essence-interior.jpg", "Essence", "Интерьер", "ALMA Development", "https://almadevelopment.pt/essence-porto/"),
      photo("essence-terrace.jpg", "Essence", "Терраса", "ALMA Development", "https://almadevelopment.pt/essence-porto/"),
      photo("essence-plan-t2.jpg", "Essence", "Планировка T2", "ALMA Development", "https://almadevelopment.pt/essence-porto/tipologia-t2/"),
    ],
    bullets: [
      "Сайт и типологии: [almadevelopment.pt/essence-porto](https://almadevelopment.pt/essence-porto/).",
      "Откройте страницу T2 и сравните площади, а не только цену «от».",
      "Спросите размер ежемесячных платежей за общий двор.",
    ],
  }),

  projectCard({
    heading: "BOAVISTA II — Boavista, urban-премиум",
    lead: "У Авениды da Boavista — один из самых понятных «городских» адресов Порту: сервисы, клиники, дорога на запад к CLIP/Aldoar. Около 46 квартир T1–T4, дом уже построен / в финальной отделке.",
    detail:
      "Маркетинг держит вход **от ≈ €600k**. Это уже не «первый вход в новостройку», а более дорогой сегмент. Имеет смысл, если вам важен именно коридор Boavista, а не вид на океан.",
    closing: "Смотрите, если бюджет ближе к премиуму и нужен городской ритм, а не family-gated в Gaia.",
    images: [
      photo("boavista-facade.jpg", "BOAVISTA II", "Фасад", "Lucas Fox", "https://www.lucasfox.pt/novos-empreendimentos/boavista-ii.html"),
      photo("boavista-interior.jpg", "BOAVISTA II", "Интерьер", "Lucas Fox", "https://www.lucasfox.pt/novos-empreendimentos/boavista-ii.html"),
      photo("boavista-interior2.jpg", "BOAVISTA II", "Интерьер", "Lucas Fox", "https://www.lucasfox.pt/novos-empreendimentos/boavista-ii.html"),
      photo("boavista-extra.jpg", "BOAVISTA II", "Интерьер", "Lucas Fox", "https://www.lucasfox.pt/novos-empreendimentos/boavista-ii.html"),
    ],
    bullets: [
      "Карточка агента: [Lucas Fox · BOAVISTA II](https://www.lucasfox.pt/novos-empreendimentos/boavista-ii.html).",
      "Сверьте этаж, паркинг и что уже включено в отделку.",
      "Сравните с Fernão Magalhães 127, если нужен другой «центр/восток».",
    ],
  }),

  projectCard({
    heading: "COVELO PARK — Paranhos у парка",
    lead: "Три корпуса у Parque do Covelo: зелень рядом, городская ткань Paranhos, гараж с возможностью зарядки электромобиля в маркетинге. Формат спокойнее Foz и дешевле Boavista.",
    detail:
      "Статус — сдан. **T2 от ≈ €310k** по объявлениям агентов. Удобный средний сегмент, если вам важен парк и не нужен океан за окном.",
    closing: "Разумный «средний» Porto без переплаты за бренд Foz.",
    images: [
      photo("covelo-facade.jpg", "COVELO PARK", "Фасад / двор", "Prestige", "https://prestigerealtyadvisors.pt/imovel/empreendimentos/porto/venda/edificio-covelo-park/"),
      photo("covelo-interior.jpg", "COVELO PARK", "Интерьер", "Prestige", "https://prestigerealtyadvisors.pt/imovel/empreendimentos/porto/venda/edificio-covelo-park/"),
      photo("covelo-extra.jpg", "COVELO PARK", "Интерьер", "Prestige", "https://prestigerealtyadvisors.pt/imovel/empreendimentos/porto/venda/edificio-covelo-park/"),
      photo("covelo-extra2.jpg", "COVELO PARK", "Общие зоны", "Prestige", "https://prestigerealtyadvisors.pt/imovel/empreendimentos/porto/venda/edificio-covelo-park/"),
    ],
    bullets: [
      "Страницы: [ImoEquity](https://www.imoequity.pt/covelopark) и [Prestige](https://prestigerealtyadvisors.pt/imovel/empreendimentos/porto/venda/edificio-covelo-park/).",
      "Проверьте остатки T2 и стоимость паркинга.",
      "Пройдитесь до парка и метро пешком — это главный плюс локации.",
    ],
  }),

  projectCard({
    heading: "The Avenue (Nort) — Combatentes, boutique",
    lead: "Маленький премиум-дом на Avenida dos Combatentes: всего около 11 квартир T2–T4, бассейн на крыше, concierge в презентации. Награда Luxury Lifestyle 2022 — маркетинг это любит повторять.",
    detail:
      "Ориентир **≈ €750–950k**. Это не «массовая новостройка», а узкий boutique. Не путать с лиссабонским Avenue/NoLiPa на сотни квартир.",
    closing: "Только если бюджет и вкус совпадают с маленьким люксовым домом у Combatentes.",
    images: [
      photo("the-avenue-facade.jpg", "The Avenue", "Фасад", "Nort Properties", "https://the-avenue.nort-properties.com/"),
      photo("the-avenue-interior.jpg", "The Avenue", "Гостиная", "Nort Properties", "https://the-avenue.nort-properties.com/"),
      photo("the-avenue-kitchen.jpg", "The Avenue", "Кухня", "Nort Properties", "https://the-avenue.nort-properties.com/"),
      photo("the-avenue-plan-t2.jpg", "The Avenue", "Планировка T2", "Luximos / Nort", "https://www.luximos.pt/pt/novos-empreendimentos/the-avenue-apartamentos-novos-t2-a-t4-no-porto"),
    ],
    bullets: [
      "Официальный сайт: [the-avenue.nort-properties.com](https://the-avenue.nort-properties.com/).",
      "Сверьте, что ещё свободно — юнитов мало, часть уже продана.",
      "Сравните ежемесячные платежи: на маленьком доме они часто выше «на квартиру».",
    ],
  }),

  projectCard({
    heading: "Fernão Magalhães 127 — Bonfim, большой Avenue Porto",
    lead: "Крупный комплекс бренда Avenue в Bonfim: сотни квартир, офисы, спорт, padel, coworking. Это как раз португальский «Avenue» в Порту — не лиссабонский NoLiPa на 466 квартир.",
    detail:
      "**T2 от €395k** на сайте проекта; студии и T1 дешевле. Масштаб большой: удобно тем, кто хочет инфраструктуру «внутри», но готов к городскому Bonfim, а не к тихой Foz.",
    closing: "Если в чате вам прислали «Avenue 466 в Порту» — покажите эту карточку и сайт fernaomagalhaes127.pt.",
    images: [
      photo("fernao-facade.jpg", "Fernão Magalhães 127", "Фасад", "Fernão Magalhães 127", "https://www.fernaomagalhaes127.pt/"),
      photo("fernao-interior.jpg", "Fernão Magalhães 127", "Интерьер", "Fernão Magalhães 127", "https://www.fernaomagalhaes127.pt/"),
      photo("fernao-amenity.jpg", "Fernão Magalhães 127", "Общие зоны", "Fernão Magalhães 127", "https://www.fernaomagalhaes127.pt/"),
      photo("fernao-plan-t2.jpg", "Fernão Magalhães 127", "Планировка T2", "Fernão Magalhães 127", "https://www.fernaomagalhaes127.pt/tipologias/"),
    ],
    bullets: [
      "Сайт и типологии: [fernaomagalhaes127.pt](https://www.fernaomagalhaes127.pt/).",
      "Сверьте корпус, этаж и вид — в большом комплексе разброс огромный.",
      "Не смешивайте с NoLiPa Lisboa в семейном чате.",
    ],
  }),

  projectCard({
    heading: "Antas Atrium — масштаб у Dragão",
    lead: "Один из самых крупных проектов на востоке Порту: фазы, сотни (в перспективе до ~1000) юнитов, зелень и amenities в презентации. Рядом Antas и стадион — это «новый город», а не исторический центр.",
    detail:
      "Строится по фазам (ориентир 2026–2028). **T2 ≈ €397–482k** в маркетинге; цифры «от €199k» обычно про студии — не про семейную двушку. Покупать off-plan имеет смысл только с понятным штрафом за сдвиг сроков и планом банка.",
    closing: "Смотрите T2 и срок конкретной фазы — не рекламу студий на баннере.",
    images: [
      photo("antas-facade.jpg", "Antas Atrium", "Визуализация фасада", "Antas Atrium", "https://antasatrium.com/"),
      photo("antas-facade2.jpg", "Antas Atrium", "Второй ракурс", "Antas Atrium", "https://antasatrium.com/"),
      photo("antas-plan.jpg", "Antas Atrium", "Планировка", "Antas Atrium", "https://antasatrium.com/"),
    ],
    bullets: [
      "Сайт: [antasatrium.com](https://antasatrium.com/).",
      "Уточните, какая фаза и когда ключи по договору.",
      "Сравните с Essence рядом — разный масштаб и стадия.",
    ],
  }),

  projectCard({
    heading: "Fábrica Vilar — Cedofeita, ещё стройка",
    lead: "Редевелопмент в Cedofeita (Youropa): жильё плюс hotel-формат, rooftop, gym, coworking в презентации. Локация ближе к «городскому центру», чем Antas или Gaia.",
    detail:
      "На 2025–2026 шла стройка — **не бронируйте как «уже сдан под ключ»** без свежего статуса у Youropa. Цены — только с актуального прайса, не со скрина прошлого года.",
    closing: "Подходит тем, кто готов ждать и любит Cedofeita; статус объекта проверяйте в день визита.",
    images: [
      photo("fabrica-facade.jpg", "Fábrica Vilar", "Фасад", "Youropa", "https://www.youropapt.com/developments/fabrica-vilar"),
      photo("fabrica-interior.jpg", "Fábrica Vilar", "Интерьер", "Youropa", "https://www.youropapt.com/developments/fabrica-vilar"),
      photo("fabrica-terrace.jpg", "Fábrica Vilar", "Терраса", "Youropa", "https://www.youropapt.com/developments/fabrica-vilar"),
      photo("fabrica-patio.jpg", "Fábrica Vilar", "Двор", "Youropa", "https://www.youropapt.com/developments/fabrica-vilar"),
    ],
    bullets: [
      "Сайт: [Youropa · Fábrica Vilar](https://www.youropapt.com/developments/fabrica-vilar).",
      "Спросите письменный срок сдачи и что будет, если он сорвётся.",
      "Не верьте чатам «уже сдан» без подтверждения застройщика.",
    ],
  }),

  projectCard({
    heading: "NOMAD EDEN — Foz, верхний люкс",
    lead: "Foz do Douro: 43 резиденции, бассейны, gym, concierge, BREEAM в презентации. Это сегмент «как в рекламе Дубая», только с атлантическим климатом и португальскими налогами.",
    detail:
      "Ориентир **от ≈ €1.1M**. Имеет смысл только при бюджете люкса и желании жить именно у океана / Foz, а не «где-то в Порту».",
    closing: "Не сравнивайте эту цену со средним Antas — это другой рынок.",
    images: [
      photo("nomad-facade.jpg", "NOMAD EDEN", "Комплекс", "Nomad Capital", "https://www.nomadeden.com/"),
      photo("nomad-interior.jpg", "NOMAD EDEN", "Интерьер", "Nomad Capital", "https://www.nomadeden.com/"),
      photo("nomad-extra.jpg", "NOMAD EDEN", "Терраса / вид", "Nomad Capital", "https://www.nomadeden.com/"),
    ],
    bullets: [
      "Сайт: [nomadeden.com](https://www.nomadeden.com/).",
      "Сверьте свободные квартиры и размер ежемесячных платежей.",
      "Параллельно посмотрите Foz Nature — тот же класс локации.",
    ],
  }),

  projectCard({
    heading: "Foz Nature — Foz, мало юнитов",
    lead: "Ещё один премиум в Foz: около 17 exclusive residences, community garden, награды в маркетинге. Очень узкое предложение.",
    detail:
      "Класс цен **€1.2M+**. Покупатель здесь обычно уже выбрал Foz и сравнивает два-три адреса, а не «весь Порту».",
    closing: "Только для люкс-бюджета и жизни у океана.",
    images: [
      photo("foz-facade.jpg", "Foz Nature", "Фасад", "Foz Nature", "https://foznature.pt/"),
      photo("foz-interior.jpg", "Foz Nature", "Интерьер", "Foz Nature", "https://foznature.pt/"),
      photo("foz-extra.jpg", "Foz Nature", "Интерьер", "Foz Nature", "https://foznature.pt/"),
    ],
    bullets: [
      "Сайт: [foznature.pt](https://foznature.pt/).",
      "Юнитов мало — свободные квартиры уточняйте напрямую.",
      "Сравните с NOMAD EDEN по локации и платежам за двор.",
    ],
  }),

  projectCard({
    heading: "Marina Douro — Gaia с видом на реку",
    lead: "Четыре корпуса в Gaia у Douro: часть квартир с видом на реку и private pool в маркетинге. Альтернатива «воде», если Foz по бюджету уже не ваш.",
    detail:
      "**T2 около €450–630k** в объявлениях (в брифах встречалось и «от €530k» — смотрите конкретную квартиру). Муниципалитет Gaia: школы, налоги и «я живу в Порту» в голове гостей — разные вещи.",
    closing: "Берите ради вида и Gaia; не продавайте себе это как «центр Порту».",
    images: [
      photo("marina-facade.jpg", "Marina Douro", "Фасад / вид", "Marina Douro", "https://marinadouro.com/"),
      photo("marina-terrace.jpg", "Marina Douro", "Терраса", "Marina Douro", "https://marinadouro.com/"),
      photo("marina-night.jpg", "Marina Douro", "Вечерний вид", "Marina Douro", "https://marinadouro.com/"),
    ],
    bullets: [
      "Сайт: [marinadouro.com](https://marinadouro.com/).",
      "Спросите, какой именно вид у выбранной фракции — река или двор.",
      "Замерьте дорогу до работы/школы в Порту через мост.",
    ],
  }),

  projectCard({
    heading: "Privilege Gardens — Costa Cabral, boutique",
    lead: "Небольшой дом на оси Costa Cabral / Antas: около 32 квартир, акцент на отделку и класс A+ в маркетинге. Тихий «средний+» без масштаба Antas Atrium.",
    detail:
      "Ориентир **от ≈ €378k**. Удобно сравнивать с Essence и Costa Cabral Flats рядом — разный продукт в одной зоне города.",
    closing: "Подходит, если нужен компактный новый дом без гигантского condomínio на тысячу соседей.",
    images: [
      photo("privilege-facade.jpg", "Privilege Gardens", "Фасад", "HomeLovers", "https://homelovers.com/empreendimento/porto/a155700/privilegegardens-porto-campanha"),
      photo("privilege-interior.jpg", "Privilege Gardens", "Интерьер", "HomeLovers", "https://homelovers.com/empreendimento/porto/a155700/privilegegardens-porto-campanha"),
      photo("privilege-extra.jpg", "Privilege Gardens", "Интерьер", "HomeLovers", "https://homelovers.com/empreendimento/porto/a155700/privilegegardens-porto-campanha"),
    ],
    bullets: [
      "Страница: [HomeLovers · Privilege Gardens](https://homelovers.com/empreendimento/porto/a155700/privilegegardens-porto-campanha).",
      "Сверьте остатки и этажность.",
      "Сравните цену м² с Essence в том же районе.",
    ],
  }),

  projectCard({
    heading: "Costa Cabral Flats — входной бюджет в Antas",
    lead: "Около 50 квартир T0–T2 со садом, ориентир сдачи **декабрь 2026**. Один из самых доступных «новых» адресов в зоне Antas / Costa Cabral.",
    detail:
      "Маркетинг держит вход **от ≈ €220k**. Off-plan: банк, задаток и сдвиг сроков — обязательный разговор до подписи.",
    closing: "Рассматривайте как вход в новостройку Antas, а не как готовые ключи «на следующей неделе».",
    images: [
      photo("costa-facade.jpg", "Costa Cabral Flats", "Фасад", "Prestige", "https://prestigerealtyadvisors.pt/imovel/empreendimentos/porto/venda/costa-cabral-flats/"),
      photo("costa-interior.jpg", "Costa Cabral Flats", "Интерьер", "Prestige", "https://prestigerealtyadvisors.pt/imovel/empreendimentos/porto/venda/costa-cabral-flats/"),
      photo("costa-extra.jpg", "Costa Cabral Flats", "Интерьер", "Prestige", "https://prestigerealtyadvisors.pt/imovel/empreendimentos/porto/venda/costa-cabral-flats/"),
    ],
    bullets: [
      "Страница: [Prestige · Costa Cabral Flats](https://prestigerealtyadvisors.pt/imovel/empreendimentos/porto/venda/costa-cabral-flats/).",
      "Зафиксируйте в договоре срок сдачи и ответственность за задержку.",
      "Спросите банк про кредит на объект до ключей.",
    ],
  }),

  projectCard({
    heading: "The Garden · Natura — Matosinhos, уже сдан",
    lead: "Matosinhos — отдельный муниципалитет, не «район Порту». Natura / Jardins Efanor: большой сад, метро рядом, продукт для тех, кто ездит на CLIP/NorteShopping и хочет новостройку без соли Brito Capelo.",
    detail:
      "Сдача Natura примерно конец 2024 / лицензия 2025. Остатки **T2 ≈ €465k**. Аренда T2 в таких домах часто **€1 500–1 750** — выше «среднего Matosinhos €900» из чатов.",
    closing: "Если цель — жить и/или сдавать в сильном новом комплексе Matosinhos, это один из первых адресов в списке.",
    images: [
      photo("jardinsefanor.jpg", "The Garden · Natura", "Комплекс / сад", "Jardins Efanor", "https://www.jardinsefanor.pt/"),
    ],
    bullets: [
      "Сайт: [jardinsefanor.pt](https://www.jardinsefanor.pt/).",
      "Сверьте остатки и размер платежей за сад/amenities.",
      "Быт муниципалитета — в [гайде Matosinhos](/notes/" + MATOSINHOS_LIFE_SLUG + ").",
    ],
  }),

  projectCard({
    heading: "Nautilus IV — Matosinhos Sul",
    lead: "Matosinhos Sul у Parque da Cidade: сдача примерно 2025, T2–T4, в продаже почти разобран. Формат «новый берег» без поездки в Foz Porto.",
    detail:
      "Аренда T2 в зоне Sul/novo часто **€1 300–1 700**. Для инвестора важна дата объявления и что входит в аренду — не скрин из чата годичной давности.",
    closing: "Смотрите остатки и реальные сдачи рядом по названию комплекса, не «средний Matosinhos».",
    images: [
      photo("nautilus-iv.jpg", "Nautilus IV", "Фасад", "Prestige", "https://prestigerealtyadvisors.pt/imovel/empreendimentos/matosinhos/venda/nautilus-iv/"),
    ],
    bullets: [
      "Страница: [Prestige · Nautilus IV](https://prestigerealtyadvisors.pt/imovel/empreendimentos/matosinhos/venda/nautilus-iv/).",
      "Уточните, что ещё свободно — объект почти распродан.",
      "Сравните аренду с Natura в том же município.",
    ],
  }),

  projectCard({
    heading: "Condomínio do Sobreiro — у метро Senhora da Hora",
    lead: "Два корпуса, около 97 квартир у метро и NorteShopping. Промоутер Névoa S.A. Формат «удобно жить без машины в каждый магазин».",
    detail:
      "Ключи ориентир **конец 2025**. Продажа T2 около **€360–390k**; аренда после сдачи ориентир **€1 100–1 500**. Статус стройки лучше подтвердить на [сайте Névoa](https://www.nevoa.pt/imobiliario/condominio-do-sobreiro).",
    closing: "Сильный бытовой аргумент — метро; слабый — ждать ключи и не путать с уже сданной Natura.",
    images: [
      photo("sobreiro-facade.jpg", "Sobreiro", "Фасад", "Névoa S.A.", "https://www.nevoa.pt/imobiliario/condominio-do-sobreiro"),
      photo("sobreiro-facade2.jpg", "Sobreiro", "Второй ракурс", "Névoa S.A.", "https://www.nevoa.pt/imobiliario/condominio-do-sobreiro"),
      photo("sobreiro-balcony.jpg", "Sobreiro", "Балкон / вид", "Névoa S.A.", "https://www.nevoa.pt/imobiliario/condominio-do-sobreiro"),
    ],
    bullets: [
      "Сайт застройщика: [nevoa.pt · Sobreiro](https://www.nevoa.pt/imobiliario/condominio-do-sobreiro).",
      "Уточните дату ключей письменно.",
      "Сверьте расстояние до станции метро пешком.",
    ],
  }),

  projectCard({
    heading: "Lake · The Garden и Menéres 777 — ещё строят",
    lead: "Два следующих горизонта Matosinhos: **Lake** в Efanor (ориентир ≈ 2027) и **Menéres 777** в Sul (≈ 2028, T2 от ≈ €535k в маркетинге). Это не «ключи в этом квартале».",
    detail:
      "Имеет смысл, если вы планируете горизонт 2–3 года и готовы к off-plan. Для жизни «сейчас» смотрите Natura / Nautilus / Sobreiro выше.",
    closing: "Не смешивайте эти адреса со сданными комплексами в одной таблице «уже можно заезжать».",
    images: [
      photo("lake-garden.jpg", "Lake · The Garden", "Визуализация", "Jardins Efanor", "https://www.jardinsefanor.pt/pages/edificio-lake/"),
      photo("meneres-777.jpg", "Menéres 777", "Визуализация", "Grupo MCaetano", "https://grupomcaetano.pt/empreendimentos/meneres-777/"),
    ],
    bullets: [
      "[Lake · The Garden](https://www.jardinsefanor.pt/pages/edificio-lake/) — срок и прайс у Efanor.",
      "[Menéres 777](https://grupomcaetano.pt/empreendimentos/meneres-777/) — срок и T2 у MCaetano.",
      "Off-plan: банк и штрафы за сдвиг сроков обсудите до задатка.",
    ],
  }),

  {
    heading: "Как выбрать без хаоса",
    section_kind: "action_guide",
    paragraphs: [
      "Рабочая схема риелтора: зафиксируйте бюджет и тип (обычно T2/T3) → выберите район и муниципалитет в таблице → оставьте **два-три** проекта, не двенадцать → съездите на шоурум → только потом предварительный договор с адвокатом.",
      "На объекте спросите простым языком: когда ключи, какой задаток, что будет при задержке, сколько платить за двор каждый месяц, в каком муниципалитете дом.",
      "Главное: сначала таблица и район, потом эмоции от бассейна на крыше — не наоборот.",
    ],
    bullets: [
      "Выпишите 2–3 проекта из таблицы под ваш бюджет T2.",
      "Запросите свежий прайс у застройщика или агента проекта.",
      "Замерьте утро до школы или метро — [районы Порту](/notes/" + PORTO_DISTRICTS_GUIDE_SLUG + ").",
      "Отдайте предварительный договор адвокату до подписи.",
      "Сделайте расчёт ипотеки в банке до финального «да».",
    ],
  },
  {
    heading: "Где обычно ошибаются",
    section_kind: "gap",
    paragraphs: [
      "В чатах смешивают Лиссабон и Порту, обещают «IVA 6% на всё» и продают студию как семейный T2. На договоре и в муниципалитете картина спокойнее и жёстче.",
      "Главное: проверьте город, стадию стройки и налог на покупку до задатка — три простые проверки, которые отсекают половину чужих скринов.",
    ],
    bullets: [
      "«Avenue 466 в Порту» — это Лиссабон; в Порту смотрите Fernão Magalhães 127.",
      "Сниженный IVA не отменяет налог на покупку.",
      "«T2 от €199k» у Antas Atrium часто про студии, не про две спальни.",
      "Fábrica Vilar и Lake/Menéres — не «уже сдан», пока застройщик не подтвердил.",
    ],
  },
  {
    heading: "Типичные ошибки покупателя",
    section_kind: "practice",
    paragraphs: [
      "Подписывают договор по дрону, не посчитав ежемесячные платежи за двор. Покупают «Порту», а ключи оказываются в Gaia или Matosinhos. Верят сроку сдачи без штрафа в договоре. Сравнивают люкс Foz и средний Antas в одной «средней цене».",
      "Главное: одна простая таблица — бюджет, T2, район, срок, платежи за двор — и адвокат до задатка.",
    ],
    bullets: [
      "Не путайте Лиссабон и Порту в названии проекта.",
      "Не считайте цену в объявлении финальной.",
      "Не забывайте ежемесячные платежи за бассейн и gym.",
      "Не берите объект на этапе стройки без запасного плана по срокам банка.",
    ],
  },
];

const keyTakeaways = [
  "Официально: налог на покупку считают до задатка; IVA 6% — про стройподряд при условиях 2026, не «скидка на кассе».",
  "На практике (ориентиры 2026): T2 Seara ≈ €279–350k; Fernão Magalhães 127 от €395k; Antas Atrium ≈ €397–482k; Marina Douro ≈ €450–630k; Foz — от ≈ €1.1M; остатки Natura ≈ €465k.",
  "На практике: в Matosinhos уже сданные Natura и Nautilus; аренда T2 там часто €1.3–1.75k — выше «средних €900» из чатов.",
  "Расхождение: Avenue 466 — Лиссабон; Fábrica Vilar и Lake/Menéres — ещё стройка; «от €199k» часто про студии.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Сколько стоит T2 в новостройке Porto/Gaia в 2026?",
    a: "Ориентиры из объявлений: Seara ≈ €279–350k; Fernão Magalhães 127 от €395k; Antas Atrium ≈ €397–482k; Marina Douro ≈ €450–630k; Foz luxury от ≈ €1.1M. Остатки Natura в Matosinhos ≈ €465k. Не оферта Emigro.",
  },
  {
    q: "Какие проекты уже можно смотреть с ключами?",
    a: "Seara фазы 1–2, Essence, BOAVISTA II, COVELO PARK, The Avenue (Nort), Fernão Magalhães 127 (уточняйте), в Matosinhos — Natura и Nautilus IV. Antas Atrium, Fábrica Vilar, NOMAD, Foz Nature, Lake, Menéres — стройка или фазы.",
  },
  {
    q: "Что с арендой T2 в Matosinhos?",
    a: "В новых сданных комплексах часто €1 500–1 750 (Natura) и €1 300–1 700 (Sul novo). Это выше общей вилки муниципалитета около €900–1 200.",
  },
  {
    q: "Где смотреть все проекты списком?",
    a: "Сравнительная таблица в начале этого гайда, ниже — отдельная карточка каждого проекта с районом, ценой и фото.",
  },
  {
    q: "Avenue на 466 квартир — это Порту?",
    a: "Нет, это NoLiPa в Лиссабоне. В Порту: Fernão Magalhães 127 и boutique The Avenue (Nort).",
  },
  {
    q: "IVA 6% снижает цену квартиры?",
    a: "Не автоматически. Режим про строительные подряды при условиях 2026. Покупатель отдельно считает налог на покупку. Нужен адвокат или налоговый консультант.",
  },
  {
    q: "Что проверить до предварительного договора?",
    a: "Актуальный прайс T2, срок ключей, задаток и штрафы, платежи за двор, разрешение, муниципалитет, расчёт банка. Подробнее — в гайде «Купить квартиру Norte».",
  },
];

export const PORTO_NEWBUILD_CLUSTERS_GUIDE = {
  slug: PORTO_NEWBUILD_CLUSTERS_SLUG,
  category: "Жильё",
  content_kind: "guide" as ContentKind,
  city: "porto",
  title: "Новостройки Порту 2026: обзор рынка, таблица и проекты",
  excerpt:
    "Обзор новостроек Porto, Gaia и Matosinhos глазами риелтора: сравнительная таблица, затем каждый проект отдельно — район, цены, статус и фото. Без путаницы с Lisboa NoLiPa.",
  seo_title: "Новостройки Porto 2026 — обзор, таблица, проекты T2",
  seo_description:
    "Новостройки Porto/Gaia/Matosinhos 2026: обзор рынка, сравнительная таблица и карточки проектов с районом, ценами T2 и фото. Без путаницы с Lisboa.",
  quick_answer:
    "Сначала сравнительная таблица под бюджет T2, потом 2–3 карточки проектов. Ориентиры: Seara €279–350k, Fernão Magalhães 127 от €395k, Antas Atrium ≈ €397–482k, Marina Douro €450–630k; Foz — от ≈ €1.1M. Avenue 466 — Лиссабон, не Порту.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "Jardins da Seara (Youropa)", url: "https://www.youropapt.com/developments/jardins-da-seara-phase-1" },
    { title: "Essence (ALMA)", url: "https://almadevelopment.pt/essence-porto/" },
    { title: "BOAVISTA II (Lucas Fox)", url: "https://www.lucasfox.pt/novos-empreendimentos/boavista-ii.html" },
    { title: "COVELO PARK (ImoEquity)", url: "https://www.imoequity.pt/covelopark" },
    { title: "The Avenue (Nort Properties)", url: "https://the-avenue.nort-properties.com/" },
    { title: "Antas Atrium", url: "https://antasatrium.com/" },
    { title: "Fernão Magalhães 127", url: "https://www.fernaomagalhaes127.pt/" },
    { title: "Marina Douro", url: "https://marinadouro.com/" },
    { title: "NOMAD EDEN", url: "https://www.nomadeden.com/" },
    { title: "Foz Nature", url: "https://foznature.pt/" },
    { title: "Fábrica Vilar (Youropa)", url: "https://www.youropapt.com/developments/fabrica-vilar" },
    { title: "Privilege Gardens (HomeLovers)", url: "https://homelovers.com/empreendimento/porto/a155700/privilegegardens-porto-campanha" },
    { title: "Costa Cabral Flats (Prestige)", url: "https://prestigerealtyadvisors.pt/imovel/empreendimentos/porto/venda/costa-cabral-flats/" },
    { title: "The Garden / Jardins Efanor", url: "https://www.jardinsefanor.pt/" },
    { title: "Lake · The Garden", url: "https://www.jardinsefanor.pt/pages/edificio-lake/" },
    { title: "Menéres 777", url: "https://grupomcaetano.pt/empreendimentos/meneres-777/" },
    { title: "Nautilus IV", url: "https://prestigerealtyadvisors.pt/imovel/empreendimentos/matosinhos/venda/nautilus-iv/" },
    { title: "Condomínio do Sobreiro (Névoa)", url: "https://www.nevoa.pt/imobiliario/condominio-do-sobreiro" },
    { title: "Portal das Finanças — IMT", url: "https://www.portaldasfinancas.gov.pt/" },
  ],
  topic_tags: ["zhile", "portugal", "norte", "porto", "novostrojka", "matosinhos"],
  hashtags: buildNoteHashtags({
    contentKind: "guide",
    topicTags: ["zhile", "portugal", "norte", "porto", "novostrojka", "matosinhos"],
    extra: ["porto", "gaia", "matosinhos", "novostrojka"],
  }),
  source_channel: "editorial+official",
  source_label: "editorial:porto-newbuild-clusters-2026",
};
