/**
 * Portugal festivals 2026 — calendar (month-by-month) + logistics for relocants (Norte lens).
 * Visuals: real Portugal festival photos from Wikimedia Commons (CC / CC0), credited.
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { formatPracticeTakeaway } from "@/lib/community-notes/practice-format";
import { DOMESTIC_TOURISM_NORTE_SLUG } from "@/lib/community-notes/guides/domestic-tourism-portugal-norte";
import { PORTO_BRAGA_LONG_TERM_RENT_SLUG } from "@/lib/community-notes/guides/porto-braga-long-term-rent";
import { DRUGS_LAW_NORTE_SLUG } from "@/lib/community-notes/guides/drugs-law-norte-portugal";
import type {
  CommunityNoteFaq,
  ContentKind,
  NoteBodyImage,
  NoteBodySection,
  NoteBodyTable,
} from "@/lib/community-notes/types";

export const FESTIVALS_PORTUGAL_2026_SLUG = "festivali-portugalii-2026-muzyka-porto-norte";

const IMG = "/images/community-notes/inline/festivals";

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

const GLOSSARY_INTRO =
  "Слова с билетов, кемпинга и CP — чтобы early bird и Parque da Cidade не превратились в сюрприз у турникета.";

const DISCLAIMER =
  "**Emigro:** даты и лайн-апы меняются — перед оплатой сверяйте официальный сайт фестиваля. Мы не продвигаем употребление веществ; про закон и мифы — [отдельный гайд](/notes/" +
  DRUGS_LAW_NORTE_SLUG +
  "). Не юридическая и не туристическая страховка.";

/** Master calendar — dates first. */
const CALENDAR_2026: NoteBodyTable = {
  columns: ["Даты", "Событие", "Где", "Жанр", "Из Porto"],
  rows: [
    ["21–24 мая", "YARD", "Lisboa area", "EDM", "выезд"],
    ["27–31 мая", "MOGA Caparica", "Costa da Caparica", "electronic / пляж", "выезд"],
    ["конец мая", "Queima das Fitas", "Coimbra", "студенческий / улица", "~1.5 ч"],
    ["11–14 июн", "Primavera Sound Porto", "Parque da Cidade", "indie / кураторский", "метро / пешком"],
    ["12–13 июн", "Festas de Lisboa (пик)", "Lisboa / Alfama", "улица / сардины", "выезд"],
    ["16–22 июн", "Waking Life", "Crato", "electronic", "выезд"],
    ["20–28 июн", "Rock in Rio Lisboa", "Bela Vista", "stadium / pop-rock", "выезд"],
    ["23–24 июн", "São João", "Porto", "город / бесплатно", "дома"],
    ["1–6 июл", "GOAT", "São Pedro do Sul", "electronic", "выезд"],
    ["3–5 июл", "Afro Nation", "Portimão", "afrobeats / пляж", "Алгарве"],
    ["9–11 июл", "NOS Alive", "Algés", "stadium / мейнстрим", "CP Cascais"],
    ["15–22 июл", "ZNA Gathering", "Montargil", "goa / psy", "выезд"],
    ["17–19 июл", "MEO Marés Vivas", "Leça / Matosinhos", "порт / сцена", "рядом"],
    ["июль", "Cool Jazz", "Cascais", "jazz", "CP Cascais"],
    ["5–9 авг", "Vagos MetalFest", "Vagos", "metal", "~1 ч"],
    ["6–8 авг", "Neopop", "Viana do Castelo", "techno", "CP ~1.5 ч"],
    ["6–8 авг", "SonicBlast", "praia (Norte)", "rock / пляж", "выезд"],
    ["12–15 авг", "Paredes de Coura", "Coura", "indie / кемпинг", "шаттл"],
    ["18–22 авг", "Vilar de Mouros", "Caminha", "rock / indie", "выезд"],
    ["сент.", "хвост: Him Dub, Arrábida, Avante!, Equinox", "Norte / Lisboa", "разное", "по афише"],
    ["18–25 июл 2027", "Boom Festival", "Idanha-a-Nova", "psy / биеннале", "не 2026"],
  ],
};

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(glossaryForSlug(FESTIVALS_PORTUGAL_2026_SLUG)!, GLOSSARY_INTRO),
    paragraphs: [GLOSSARY_INTRO, DISCLAIMER],
  },
  {
    heading: "Как читать афишу 2026",
    section_kind: "official",
    paragraphs: [
      "Жара ещё только обещает себя, а в чатах уже пахнет midsummer: скрины афиш, чужие wristband. Ниже — календарь май–сентябрь: сначала даты, потом логистика. Одного–двух must-see под ваш жанр достаточно; Boom в 2026 нет (биеннале → 18–25 июля 2027).",
      "Стержень для живущих в Porto/Norte: Primavera Sound Porto, São João, Neopop, Paredes de Coura. NOS Alive и Afro Nation — отдельные выезды. Жильё на городские даты бронируйте раньше тикета. Выходные вокруг фестов — [туризм Norte](/notes/" +
        DOMESTIC_TOURISM_NORTE_SLUG +
        ").",
      "Главное: сначала дата и ночлег, потом лайн-ап. Resale — TicketSwap, не MB Way «другу из чата».",
    ],
    bullets: [
      "Сверьте даты на официальном сайте до оплаты.",
      "Early bird у организатора; resale — TicketSwap.",
      "Жильё за 2–3 месяца на São João и Primavera.",
      "Boom не ставьте в июль 2026 — окно 2027.",
    ],
  },
  {
    heading: "Таблица дат: май–сентябрь 2026",
    section_kind: "practice",
    paragraphs: [
      "Таблица — скелет сезона. Даты ориентировочные; финал всегда на сайте фестиваля. Колонка «Из Porto» — насколько событие «домашнее» для Norte.",
      "Главное: отметьте 2–3 строки, не весь столбец. Календарь, который выбирает за вас, редко жалеет.",
    ],
    table: CALENDAR_2026,
  },
  {
    heading: "Май 2026",
    section_kind: "practice",
    paragraphs: [
      "В мае воздух в Порту ещё терпимый, а жара ещё вежлива. Это месяц «разгона»: Lisboa area и Coimbra, пока Parque da Cidade в июне не заберёт весь фокус Norte.",
      "Главное: май — разведка юга и Coimbra; якорь Norte ещё впереди.",
    ],
    images: [
      photo(
        "may-crowd",
        "The Hives на Queima das Fitas, Coimbra",
        "Май · Queima das Fitas, Coimbra — сцена без VIP-тикета",
        "Manuel Madeira · CC BY 3.0 / Wikimedia",
        "https://commons.wikimedia.org/wiki/File:The_Hives_Queima_Das_Fitas_Coimbra_2012_(23514791).jpeg"
      ),
    ],
    bullets: [
      "**21–24 мая — YARD** · Lisboa area · EDM · отдельный выезд.",
      "**27–31 мая — MOGA Caparica** · пляжный electronic · песок и крем.",
      "**Конец мая — Queima das Fitas** · Coimbra · без VIP-тикета: улица, Fado, студенческий ритуал.",
    ],
  },
  {
    heading: "Июнь 2026",
    section_kind: "practice",
    paragraphs: [
      "Июнь бьёт по Airbnb сильнее среднего инди-феста: Primavera в Parque da Cidade и São João без wristband, но со всем городом. Festas de Lisboa и Rock in Rio — если едете на юг; Waking Life — отдельное окно.",
      "Главное: São João важнее среднего платного уикенда для жилья. Бронь на 23–24 июня — раньше «ещё подумаю».",
    ],
    images: [
      photo(
        "june-primavera",
        "Сцена NOS Primavera Sound, Porto",
        "Primavera Sound Porto · Parque da Cidade — якорь июня для Norte",
        "Bene Riobó · CC BY-SA 4.0 / Wikimedia",
        "https://commons.wikimedia.org/wiki/File:NOS_Primavera_Sound_2015_02.jpg"
      ),
      photo(
        "june-saojoao",
        "Толпа на São João в Порту",
        "São João 23–24 июня — весь город без wristband",
        "Stefano Aguiar · CC0 / Wikimedia",
        "https://commons.wikimedia.org/wiki/File:S%C3%A3o_Jo%C3%A3o_2018_(29275721458).jpg"
      ),
    ],
    bullets: [
      "**11–14 июн — Primavera Sound Porto** · Parque da Cidade · must для Norte · метро / ~30 мин пешком.",
      "**12–13 июн — пик Festas de Lisboa** · Alfama, сардины · выезд.",
      "**16–22 июн — Waking Life** · Crato · electronic.",
      "**20–28 июн — Rock in Rio Lisboa** · Bela Vista · не клеить к Primavera.",
      "**23–24 июн — São João** · Porto · бесплатно · жильё бронировать за месяцы.",
    ],
  },
  {
    heading: "Июль 2026",
    section_kind: "practice",
    paragraphs: [
      "Июль — stadium и жара +30…35 °C на Тежу плюс пляжный выезд на Алгарве. Рядом с Porto — MEO Marés в Leça. Cool Jazz в Cascais — сидеть у моря, не стоять три дня у сцены.",
      "Главное: NOS Alive или Afro Nation — отдельная поездка с жильём, не «хвост уикенда».",
    ],
    images: [
      photo(
        "july-alive",
        "Сцена и толпа NOS Alive",
        "NOS Alive · Algés — июльский stadium на Тежу",
        "Chris · CC BY-SA 2.0 / Wikimedia",
        "https://commons.wikimedia.org/wiki/File:Nos_Alive_(19559879263).jpg"
      ),
      photo(
        "july-beach",
        "Площадка Optimus/NOS Alive у реки",
        "Alive у воды — масштаб, жара и отдельный выезд из Porto",
        "luismad · CC BY-SA 3.0 / Wikimedia",
        "https://commons.wikimedia.org/wiki/File:Optimus_Alive_13.jpg"
      ),
    ],
    bullets: [
      "**1–6 июл — GOAT** · São Pedro do Sul.",
      "**3–5 июл — Afro Nation** · Portimão · afrobeats / пляж · Алгарве.",
      "**9–11 июл — NOS Alive** · Algés · CP Cascais line.",
      "**15–22 июл — ZNA Gathering** · Montargil · goa/psy · без романтизации веществ ([закон](/notes/" +
        DRUGS_LAW_NORTE_SLUG +
        ")).",
      "**17–19 июл — MEO Marés Vivas** · Leça / Matosinhos · рядом с Porto.",
      "**Июль — Cool Jazz** · Cascais · сидя у моря.",
    ],
  },
  {
    heading: "Август 2026",
    section_kind: "practice",
    paragraphs: [
      "Август сильнее Norte: Neopop в Viana, Coura у реки, Vilar de Mouros. Жара тоже часть лайн-апа — только её не пишут на афише. Из Porto часто добрее, чем третий stadium на юге.",
      "Главное: Neopop или Coura — августовский якорь из Porto; CP до Viana ~1.5 ч.",
    ],
    images: [
      photo(
        "aug-neopop",
        "Выступление на Super Bock Super Rock",
        "Август Norte: Neopop в Viana рядом по календарю; на фото — Super Bock Super Rock (та же лига open-air)",
        "José Goulão · CC BY-SA 2.0 / Wikimedia",
        "https://commons.wikimedia.org/wiki/File:Duffy_@_Super_Bock_Super_Rock_02.jpg"
      ),
      photo(
        "aug-coura",
        "Сцена Paredes de Coura",
        "Paredes de Coura · река, лес, кемпинг",
        "Bene Riobó · CC BY-SA 4.0 / Wikimedia",
        "https://commons.wikimedia.org/wiki/File:Escenario_Paredes_de_Coura_2011.jpg"
      ),
    ],
    bullets: [
      "**5–9 авг — Vagos MetalFest** · Vagos.",
      "**6–8 авг — Neopop** · Viana · techno · CP ~1.5 ч из Porto.",
      "**6–8 авг — SonicBlast** · пляжный rock Norte.",
      "**12–15 авг — Paredes de Coura** · кемпинг, шаттлы из Porto/Viana.",
      "**18–22 авг — Vilar de Mouros** · Caminha.",
    ],
  },
  {
    heading: "Сентябрь 2026 и хвост сезона",
    section_kind: "practice",
    paragraphs: [
      "Сентябрь — хвост: Him Dub, Arrábida Electrónica, Festa do Avante!, Equinox Caparica — если ещё остались ноги и слух. Alive на Мадейре — отдельный перелёт, не «ещё один» уикенд после Coura.",
      "Главное: хвост сезона — по остатку сил, не по чужой афише в чате.",
    ],
    images: [
      photo(
        "sep-tail",
        "Речной пляж у Paredes de Coura",
        "Хвост сезона: река и тишина после Coura — не третий stadium",
        "Vitor Oliveira · CC BY-SA 2.0 / Wikimedia",
        "https://commons.wikimedia.org/wiki/File:Praia_fluvial_de_Paredes_de_Coura_(148733742).jpg"
      ),
    ],
    bullets: [
      "**Сент. — Him Dub / Arrábida Electrónica / Avante! / Equinox** · по афише.",
      "**Boom** — не сентябрь 2026: следующее окно **18–25 июля 2027**.",
    ],
  },
  {
    heading: "Стержень Norte: что брать первым",
    section_kind: "practice",
    paragraphs: [
      "Если бюджет на один–два крупных тикета: Primavera Porto + Neopop или Coura. NOS Alive / Afro Nation — если готовы к югу. Ориентиры цен 2026 уточняйте на сайте: Neopop ~€150–200; Primavera ~€200–280; NOS Alive ~€180–250; Coura ~€120–160 + кемпинг.",
      "Главное: два сильных уикенда лучше календаря из семи «надо». Boom early bird — на 2027.",
    ],
    bullets: [
      "Primavera Porto — кураторский лайн-ап у океана.",
      "Neopop — техно-август ближе Лиссабона.",
      "Coura — река и кемпинг без stadium-пафоса.",
      "São João — в календарь жилья раньше платного феста.",
    ],
  },
  {
    heading: "Билеты, жильё, транспорт и рюкзак",
    section_kind: "action_guide",
    paragraphs: [
      "Порядок: тикет → ночлег → дорога. Иначе — ночь в машине у площадки или x2 за Airbnb. Долгосрок не путайте с фестивальным Airbnb — [аренда Porto/Braga](/notes/" +
        PORTO_BRAGA_LONG_TERM_RENT_SLUG +
        ").",
      "Algés — CP Cascais; Caparica — автобус/Uber из Lisboa; Parque da Cidade — метро; Viana — CP ~1.5 ч; Coura — шаттлы. В рюкзаке: SPF50+, refill, power bank, беруши, репеллент у озера, наличные на фуд-корт.",
      "Главное: early bird, жильё и трезвый план дороги. Утренний перелёт «сразу после» — ошибка усталости.",
    ],
    bullets: [
      "Билет — офсайт; resale — TicketSwap.",
      "Ночлег: Porto/Foz, Viana, кемпинг Coura, Lisboa/Cascais под Alive.",
      "SPF, вода, беруши, recovery day после трёх ночей.",
      "Вещества — не «часть программы» ([закон](/notes/" + DRUGS_LAW_NORTE_SLUG + ")).",
    ],
  },
  {
    heading: "Где чаты и афиши расходятся",
    section_kind: "gap",
    paragraphs: [
      "«Boom этим летом», «жильё на месте», «плачу другу за QR» — классика чатов. В 2026 у Boom пауза биеннале. Афиша без офсайта — риск фейкового QR.",
      "Главное: офсайт и TicketSwap важнее скрина из чата.",
    ],
    bullets: [
      "«Boom этим летом» → смотрите 2027.",
      "«Жильё на месте» на São João → бронь заранее.",
      "«Другу за QR» → только checkout / TicketSwap.",
      "«На фесте можно всё» → нет; см. [гайд](/notes/" + DRUGS_LAW_NORTE_SLUG + ").",
    ],
  },
  {
    heading: "Типичные ошибки",
    section_kind: "practice",
    paragraphs: [
      "Оптимально: один–два феста + São João. Классика: Boom «на это лето», тикет без жилья, MB Way перекупу, Neopop без ночёвки в Viana, три дня техно и утренний перелёт.",
      "Главное: сезон длинный — выгорание быстрее лайн-апа.",
    ],
    bullets: [
      "Не путайте Boom-биеннале с ежегодным фестом.",
      "Не покупайте тикет без жилья на São João / Primavera.",
      "Не ставьте три феста за десять дней.",
      "Заложите recovery day.",
    ],
  },
];

const keyTakeaways = [
  "Официально: календарь май–сентябрь 2026 — сверяйте даты на сайте; Boom пропускает год → июль 2027.",
  formatPracticeTakeaway({
    channels: ["por_tugal", "lepta"],
    period: "2026",
    claim:
      "для релоканта в Norte стержень календаря — Primavera Sound Porto, São João, Neopop и Paredes de Coura",
    forReader: "один–два феста за сезон лучше, чем сжечь бюджет на всём столбце дат",
  }),
  formatPracticeTakeaway({
    channels: ["por_tugal"],
    period: "2026",
    claim: "São João и Primavera поднимают жильё за месяцы — бронь важнее позднего early bird",
    forReader: "сначала ночлег и CP/шаттл, потом мерч",
  }),
  "Расхождение: чат «на фесте можно всё» не отменяет закон — см. правовой гайд.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "С чего начать календарь, если живу в Порту?",
    a: "Отметьте Primavera (11–14 июня), São João (23–24 июня), затем Neopop или Coura в августе. NOS Alive и Afro Nation — отдельные строки выезда. Boom — 2027.",
  },
  {
    q: "Когда Boom Festival?",
    a: "Биеннале. После 2025 следующее окно — 18–25 июля 2027 (Idanha-a-Nova). В календарь 2026 не ставьте.",
  },
  {
    q: "Где брать билеты?",
    a: "Официальный сайт и кассовые партнёры. Перепродажа — TicketSwap. Не QR из чата.",
  },
  {
    q: "Как добраться на Neopop и Primavera?",
    a: "Primavera — Parque da Cidade (метро / ~30 мин пешком). Neopop — CP до Viana ~1.5 ч. Coura — фестивальные автобусы.",
  },
  {
    q: "Что с жильём на São João?",
    a: "Бронируйте за месяцы. 23–24 июня и дни Primavera — пик. Альтернатива — Braga/Gaia + поздний транспорт.",
  },
];

export const FESTIVALS_PORTUGAL_2026_GUIDE = {
  slug: FESTIVALS_PORTUGAL_2026_SLUG,
  category: "Досуг",
  content_kind: "guide" as ContentKind,
  title: "Календарь фестивалей Португалии 2026: даты, Porto/Norte, билеты",
  excerpt:
    "Календарь май–сентябрь 2026: Primavera, São João, Neopop, Coura, NOS Alive, Afro Nation. Boom — 2027. Таблица дат + логистика из Porto.",
  seo_title: "Календарь фестивалей Португалии 2026 — Porto",
  seo_description:
    "Календарь фестивалей Португалии 2026 для релокантов в Porto и Norte: таблица дат май–сентябрь, Primavera, São João, Neopop, Coura, билеты и жильё.",
  quick_answer:
    "Календарь 2026 читают сверху вниз: май — YARD/MOGA/Queima; июнь — Primavera Porto и São João; июль — NOS Alive / Afro Nation / Marés; август — Neopop и Coura; сентябрь — хвост. Boom — 18–25 июля 2027. Из Porto берите 1–2 крупных тикета + São João; жильё раньше лайн-апа; билеты — офсайт или TicketSwap.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "Visit Portugal", url: "https://www.visitportugal.com/" },
    { title: "Primavera Sound", url: "https://www.primaverasound.com/" },
    { title: "Neopop Festival", url: "https://www.neopopfestival.com/" },
    { title: "NOS Alive", url: "https://www.nosalive.com/" },
    { title: "Boom Festival", url: "https://www.boomfestival.org/" },
    { title: "CP — Comboios de Portugal", url: "https://www.cp.pt/" },
    { title: "TicketSwap", url: "https://www.ticketswap.com/" },
  ],
  topic_tags: ["dosug", "portugal", "norte", "festivali"],
  hashtags: buildNoteHashtags({
    topicTags: ["dosug", "portugal", "norte"],
    contentKind: "guide",
    extra: ["porto", "kalendar", "primavera", "neopop", "festival"],
  }),
  source_channel: "editorial+official",
  source_label: "editorial:festivals-portugal-2026-calendar",
};
