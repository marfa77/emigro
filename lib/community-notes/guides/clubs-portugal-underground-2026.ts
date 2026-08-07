/**
 * Portugal club / underground nightlife for relocants — techno + adult community spaces.
 * Adult 18+; consent-first; no substance how-to.
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { formatPracticeTakeaway } from "@/lib/community-notes/practice-format";
import { FESTIVALS_PORTUGAL_2026_SLUG } from "@/lib/community-notes/guides/festivals-portugal-2026";
import { DRUGS_LAW_NORTE_SLUG } from "@/lib/community-notes/guides/drugs-law-norte-portugal";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const CLUBS_PORTUGAL_UNDERGROUND_SLUG = "kluby-portugalii-tehno-underground-2026";

const GLOSSARY_INTRO =
  "Слова с фейсконтроля, guest list и member-ивентов — чтобы «берлинский вайб» в Лиссабоне не закончился отказом у двери.";

const DISCLAIMER =
  "**18+.** Emigro описывает ночную и adult-сцену для релокантов: клубы, коммьюнити, правила входа и консенса. Это не реклама секс-услуг и не инструкция по play. **Мы категорически против употребления наркотиков** — [закон и мифы](/notes/" +
  DRUGS_LAW_NORTE_SLUG +
  "). Закрытые ивенты меняются — сверяйте анонсы организаторов.";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(glossaryForSlug(CLUBS_PORTUGAL_UNDERGROUND_SLUG)!, GLOSSARY_INTRO),
    paragraphs: [GLOSSARY_INTRO, DISCLAIMER],
  },
  {
    heading: "Официально: Португалия ≠ Берлин, и это нормально",
    section_kind: "official",
    paragraphs: [
      "Зачем вам это сейчас: после Берлина/Амстердама релоканты ищут «свой KitKat» и разочаровываются. В PT сцена меньше, камернее и сильнее завязана на коммьюнити и отбор.",
      "Что делать: выбирать формат — сырой техно, queer-коллектив или member/interview adult-ивент — и читать правила до оплаты тикета.",
      "Главное: нет круглосуточного weekend-комплекса уровня Berghain; зато меньше хаоса и жёстче культура согласия на закрытых вечеринках.",
    ],
    bullets: [
      "Крупных коммерческих sex-clubs формата KitKat/Insomnia в классическом берлинском масштабе нет — и вряд ли появятся «один в один».",
      "Многие adult/kink-ивенты — членские, по заявке или с коротким интервью: фильтр токсичности, не «понты у двери».",
      "Клубы обычно до утра (ориентир закрытия ~6–7), не весь уикенд без перерыва.",
      "Тикеты: Shotgun, Resident Advisor, страницы клубов; для member-ивентов — сайт/Instagram коллектива.",
      "Летние open-air и фесты — отдельно: [фестивали 2026](/notes/" + FESTIVALS_PORTUGAL_2026_SLUG + ").",
    ],
  },
  {
    heading: "Лиссабон: техно и андеграунд",
    section_kind: "practice",
    paragraphs: [
      "Что делать: держать короткий список площадок и следить за анонсами — лайн-апы и дни недели плавают.",
      "Зачем: LIS — основной хаб сцены; отсюда же большинство kink/queer-коллективов.",
    ],
    bullets: [
      "Kremlin — тёмный камерный техно/house; очереди; ориентир cover невысокий; «чёрный» дресс-код.",
      "Lux Frágil — икона с видом на Тежу; фейсконтроль и более премиальный вход; techno/house/electronic.",
      "Ministerium — underground / industrial vibe; серии вроде A L I C E!; чаще тикеты/лист.",
      "Temple Club — сильный техно-звук, immersive; тикеты заранее.",
      "Musicbox — камерный live + клуб, экспериментальнее «тёмного бункера».",
      "5A — микро-формат, очень локально; часто invite/list.",
      "Planeta Manas (у аэропорта) — LGBTQ+-центричный, house/techno/bass; коллективы вроде Mina — следить за Instagram.",
    ],
  },
  {
    heading: "Порту и между городами",
    section_kind: "practice",
    paragraphs: [
      "Что делать: если база в Norte — Gare и Industria закрывают большинство суббот без переезда в LIS; на спец-серии всё равно ездят в столицу.",
    ],
    bullets: [
      "Gare Porto — сырое industrial у São Bento: пятница чаще house/dnb, суббота techno; ориентир входа €10–15.",
      "Industria — больший зал и хедлайнеры; масштабнее, менее «подпольно», чем Gare.",
      "Серии вроде Orbits / локальные collectives на площадке Gare — лист или Shotgun; смотрите афишу недели.",
      "Вне двух столиц: Stereogun (Leiria), pop-up Techno Bunker, природные серии (Vinculum / Basilar и аналоги) — реже, анонсы в Instagram/RA.",
      "После клуба в Порту на рассвете закладывайте Uber/такси: не все линии Metro работают ночью.",
    ],
  },
  {
    heading: "Adult / kink / sex-positive: коммьюнити, не «берлинский floor»",
    section_kind: "practice",
    paragraphs: [
      "Что делать: понимать разницу — PT-сцена adult чаще про членство, образование и жёсткий консенс, чем про анонимный mega-club.",
      "Главное: Emigro не учит практикам BDSM и не публикует «как найти play-партнёра». Ниже — ориентиры коммьюнити и входа; дальше — правила организатора.",
    ],
    bullets: [
      "Gear Club Portugal (с ~2014) — мужское fetish-коммьюнити: Lisbon Meets Fetish (обычно сентябрь), social drinks (часто Bar TR3S), партнёрства вроде XXL Lisbon Club — уточняйте на сайте клуба.",
      "Lisbon Meets Fetish — ежегодный слет (вечеринки + social / ужины в пакетах); акцент на коммьюнити, регистрация заранее.",
      "The Shameless Society — sex-positive коллектив в LIS; вход часто через заявку/короткое интервью (фильтр), гетеро и квир-френдли ивенты.",
      "Divalicious (femdom-вечеринки) — курация, заявка, акцент на ethics/consent; не «турпакет для любопытных».",
      "Kinky Market, The Whole (dinner/munch), Fetish Academy / rope jams — маркеты, социальные встречи и образование; munch ≠ play-party.",
      "Тематические вечеринки (Playful Night и аналоги) анонсируются локально — читайте house rules: телефоны, зоны, дресс-код.",
    ],
  },
  {
    heading: "Берлинский чеклист: аналоги и пробелы",
    section_kind: "practice",
    paragraphs: [
      "Что делать: искать не «клон названия», а близкий вайб — и принять, что масштаб другой.",
    ],
    bullets: [
      "Fetish + techno mega-club (KitKat) → в PT скорее Gear Club + фетиш-уикенды, не один огромный floor.",
      "Легенда фейсконтроля (Berghain) → Kremlin / Gare дают сырость и отбор, без той же «мифологии».",
      "Queer techno (Mina и аналоги) → Planeta Manas + локальные collectives.",
      "Garden / nature techno → летние серии и фесты вроде Waking Life / Vinculum — сезонно, не каждую субботу.",
      "Плюс PT: меньше анонимного хаоса на member-ивентах, строже «спроси до касания», чаще знакомые лица.",
    ],
  },
  {
    heading: "Вход, дресс-код, консенс и безопасность",
    section_kind: "action_guide",
    paragraphs: [
      "Зачем вам это сейчас: отказ у двери и конфликт из‑за телефона портят ночь чаще, чем «не тот трек».",
      "Что делать: тикет/заявка → дресс-код → buddy → правила дома → выход без геройства.",
      "Главное: только явное «да»; «может быть» = нет. На first adult-ивент — с человеком, которому доверяете.",
    ],
    bullets: [
      "Шаг 1 — Тикет: Shotgun / RA / сайт клуба. Member/interview: пишите организатору заранее, не «в лоб у двери».",
      "Шаг 2 — Техно-дресс: чёрное, закрытая обувь; кожа/винил ок. В Lux и премиум — аккуратнее с шортами и шумными all-male groups.",
      "Шаг 3 — Fetish/kink: gear по афише (кожа, латекс, harness и т.д.); casual джинсы+футболка часто = no entry.",
      "Шаг 4 — Телефон: на многих adult-ивентах запрет съёмки или стикеры на камеру — нарушение = выход.",
      "Шаг 5 — Консенс: не трогать людей и gear без спроса; voyeurism только где разрешено правилами площадки.",
      "Шаг 6 — Алкоголь в меру; вещества — нет (позиция Emigro и закон PT). Если стало плохо — staff / медпомощь / 112, не «добивать стимулятором».",
      "Шаг 7 — После: вода, еда, безопасная дорога домой; не оставляйте незнакомым доступ к жилью «на after».",
    ],
  },
  {
    heading: "Афиша: что смотреть в сезоне (ориентиры)",
    section_kind: "practice",
    paragraphs: [
      "Что делать: подписаться на 3–4 источника и не верить скринам из чатов без ссылки на организатора.",
    ],
    bullets: [
      "Сентябрь — Lisbon Meets Fetish (часто конец месяца): пакеты на сайте Gear Club — даты года уточняйте официально.",
      "Ежемесячно в LIS — social drinks Gear Club; munch/dinner форматы The Whole и аналоги.",
      "Kinky Market / Fetish Academy — даты TBA, смотрите kink-календари и Instagram организаторов.",
      "Еженедельно: Kremlin, Gare Porto, Temple и анонсы Planeta Manas / Mina — по афише недели.",
      "Лето — пересечение с фестивальным календарём: [фестивали PT 2026](/notes/" + FESTIVALS_PORTUGAL_2026_SLUG + ").",
    ],
  },
  {
    heading: "Где чаты расходятся с дверью",
    section_kind: "gap",
    bullets: [
      "Чат: «как в Берлине» → масштаб меньше; ищите коммьюнити, не клон KitKat.",
      "Чат: «просто приди в джинсах» на fetish → часто отказ; читайте dress code.",
      "Чат: «сниму сторис с танцпола» → на adult-ивентах камера часто запрещена.",
      "Чат: «вещества часть вайба» → нет; закон и позиция Emigro — [гайд](/notes/" + DRUGS_LAW_NORTE_SLUG + ").",
      "Чат: «зайду без заявки на Shameless» → interview/apply заранее.",
      "Чат: «после Gare пешком до дома в 6:00» → закладывайте транспорт.",
    ],
  },
  {
    heading: "Типичные ошибки релокантов-тусовщиков",
    section_kind: "practice",
    paragraphs: [
      "Оптимально: одна площадка в неделю + уважение к правилам дома. Ошибки ниже — классика первых месяцев в LIS/Porto.",
    ],
    bullets: [
      "Ошибка: ждать Berghain-легенду и обесценивать Gare/Kremlin за «мало людей».",
      "Ошибка: прийти на kink-ивент «просто посмотреть» без заявки и дресс-кода.",
      "Ошибка: трогать harness/латекс «для фото» без спроса.",
      "Ошибка: идти в первый раз одному на закрытый adult-ивент без buddy.",
      "Ошибка: спорить с фейсконтролем — отказ окончательный, идите в другое место.",
      "Ошибка: смешивать жару клуба, алкоголь и неизвестные таблетки — риск для жизни и для ВНЖ.",
      "Ошибка: публиковать лица людей с вечеринки без согласия.",
    ],
  },
];

const keyTakeaways = [
  "Официально: PT — камерная коммьюнити-сцена, не берлинский mega-complex; member/interview — норма, не прихоть.",
  formatPracticeTakeaway({
    channels: ["por_tugal", "chatlisboa"],
    period: "2026",
    claim:
      "для техно в Лиссабоне держат Kremlin / Temple / Lux / Planeta Manas, в Порту — Gare и Industria; тикеты через Shotgun/RA, не «у парня из чата»",
    forReader: "чёрный дресс-код и закрытая обувь закрывают половину отказов у двери",
  }),
  formatPracticeTakeaway({
    channels: ["por_tugal"],
    period: "2026",
    claim:
      "adult/kink в LIS строится вокруг Gear Club, Shameless Society, маркетов и курированных вечеринок с жёстким консенсом",
    forReader: "только явное «да»; камера часто под запретом; Emigro не учит play",
  }),
  "Расхождение: «вещества = вайб клуба» в чате не отменяет закон — см. гайд про наркотики и мифы.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Где танцевать техно в Порту, если не ехать в Лиссабон?",
    a: "База северной сцены — Gare Porto (часто techno в субботу) и Industria на более крупных именах. Серии collectives смотрите в афише Shotgun/Instagram. На спец-ивенты многие всё равно едут в LIS.",
  },
  {
    q: "Есть ли в Португалии «свой KitKat»?",
    a: "В берлинском масштабе — нет. Ближе форматы Gear Club / Lisbon Meets Fetish и курированные sex-positive коллективы: меньше анонимности, больше отбора и правил консенса. Это другая философия, не «хуже Берлина».",
  },
  {
    q: "Как попасть на The Shameless Society или Gear Club?",
    a: "Через официальные каналы: членство/пакеты на сайте Gear Club; у Shameless часто заявка или короткое интервью. Не пытайтесь обойти фильтр «через знакомого у двери» — так чаще получают бан.",
  },
  {
    q: "Что надеть в Kremlin / Gare?",
    a: "Тёмная одежда, закрытая обувь; кожа и минимализм уместны. Яркий tourist-casual и открытая обувь повышают шанс отказа, особенно в более селективных местах.",
  },
  {
    q: "Можно ли снимать в клубе и на kink-вечеринке?",
    a: "В обычных клубах — смотрите правила вечера. На многих adult-ивентах съёмка запрещена или камеры заклеивают. Чужие лица без согласия — этический и иногда правовой риск.",
  },
  {
    q: "Вещества на танцполе — «все так делают»?",
    a: "Emigro категорически против. Декриминализация ≠ легализация сбыта; для релоканта ещё и риск для статуса. Разбор — в гайде про наркотики в Португалии/Norte. Если плохо — staff или 112.",
  },
];

export const CLUBS_PORTUGAL_UNDERGROUND_GUIDE = {
  slug: CLUBS_PORTUGAL_UNDERGROUND_SLUG,
  category: "Досуг",
  content_kind: "guide" as ContentKind,
  title: "Клубы Португалии 2026: техно, андеграунд и adult-коммьюнити (Лиссабон и Порту)",
  excerpt:
    "Kremlin, Gare, Lux, Planeta Manas; Gear Club и sex-positive сцена. Вход, дресс-код, консенс. 18+. Emigro против наркотиков.",
  seo_title: "Клубы Португалии 2026 — техно и Порту",
  seo_description:
    "Клубы Лиссабона и Порту 2026: техно (Kremlin, Gare, Lux), queer и adult-коммьюнити. Вход, дресс-код и консенс — гайд Emigro для релокантов. 18+.",
  quick_answer:
    "Ищете «берлинский вайб» в Португалии — не ищите клон Berghain. Сцена камерная: в Лиссабоне Kremlin, Temple, Lux, Planeta Manas; в Порту — Gare и Industria. Adult/kink — через Gear Club, Shameless Society и курированные ивенты с заявкой и жёстким консенсом, не через «просто зайти посмотреть». Чёрное, закрытая обувь, тикет с Shotgun/RA, камера по правилам дома. Emigro — 18+, против наркотиков; вещества не «часть вайба».",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "Resident Advisor — афиша", url: "https://ra.co/" },
    { title: "Shotgun — тикеты", url: "https://shotgun.live/" },
    { title: "Gear Club Portugal", url: "https://www.gearclubportugal.com/" },
    { title: "Gare Porto", url: "https://www.gareporto.com/" },
    { title: "Lux Frágil", url: "https://www.luxfragil.com/" },
  ],
  topic_tags: ["dosug", "portugal", "kluby", "norte"],
  hashtags: buildNoteHashtags({
    topicTags: ["dosug", "portugal", "norte"],
    contentKind: "guide",
    extra: ["porto", "lisbon", "techno", "club", "lgbtq"],
  }),
  source_channel: "editorial+official",
  source_label: "editorial:clubs-underground-2026",
};
