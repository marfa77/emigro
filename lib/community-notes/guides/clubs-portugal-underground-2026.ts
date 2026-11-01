/**
 * Portugal nightlife — editorial club & party guide (18+).
 * Voice: NYC Rave Girls–style reviews (music, crowd, venue, value) + accessible Ellie tone.
 * Not a tourist listicle; club ≠ guaranteed good night.
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { FESTIVALS_PORTUGAL_2026_SLUG } from "@/lib/community-notes/guides/festivals-portugal-2026";
import { formatPracticeTakeaway } from "@/lib/community-notes/practice-format";
import { DRUGS_LAW_NORTE_SLUG } from "@/lib/community-notes/guides/drugs-law-norte-portugal";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const CLUBS_PORTUGAL_UNDERGROUND_SLUG = "kluby-portugalii-tehno-underground-2026";

const GLOSSARY_INTRO =
  "Lineup, guest list, munch — коротко, чтобы не путать форматы вечеринок и не спорить с дверью из‑за слов.";

const DISCLAIMER =
  "**18+.** Emigro — редакционный гид по ночной жизни для релокантов: клубы, queer- и sex-positive-события, правила входа. Это не реклама секс-услуг и не инструкция по play. **Мы категорически против употребления наркотиков** — см. [закон и мифы](/notes/" +
  DRUGS_LAW_NORTE_SLUG +
  "). Афиши, цены и house rules меняются — перед выходом сверяйте официальные источники организатора.";

const EMIGRO_RATING_TABLE = {
  columns: ["Критерий", "Что оцениваем"],
  rows: [
    ["Music", "Музыка и DJ lineup"],
    ["Sound", "Качество звука"],
    ["Crowd", "Публика и атмосфера"],
    ["Venue", "Пространство и организация"],
    ["Value", "Соотношение цены и впечатлений"],
  ],
};

const QUICK_PICK_TABLE = {
  columns: ["Если вам хочется…", "С чего начать"],
  rows: [
    ["Классического клубного techno", "Kremlin — по конкретной программе"],
    ["Знаковой клубной культуры", "Lux Frágil — по конкретной ночи"],
    ["Электронных и экспериментальных событий", "Ministerium, Musicbox"],
    ["Techno в Порту", "Gare Porto"],
    ["Более масштабных вечеринок в Порту", "Industria — по lineup"],
    ["LGBTQ+ электронной сцены", "Planeta Manas"],
    ["Fetish community", "Gear Club Portugal"],
    ["Sex-positive мероприятий", "The Shameless Society — по правилам ивента"],
  ],
};

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(glossaryForSlug(CLUBS_PORTUGAL_UNDERGROUND_SLUG)!, GLOSSARY_INTRO),
    paragraphs: [GLOSSARY_INTRO, DISCLAIMER],
  },
  {
    heading: "Португалия — не Берлин, и это нормально",
    section_kind: "official",
    paragraphs: [
      "Португалия — не Берлин. Здесь нет такого количества больших техно-клубов, бесконечных вечеринок и огромной международной underground-сцены. Но это не значит, что здесь нечего искать.",
      "В Лиссабоне есть клубы с серьёзной электронной историей, небольшие площадки с экспериментальной музыкой, queer-вечеринки и закрытые sex-positive мероприятия. В Порту — своя сцена; ради хорошего techno не обязательно каждый раз ехать на юг.",
      "Главное — понимать, **куда** вы идёте. Название известного клуба не гарантирует хорошую ночь: иногда решает DJ, иногда публика, иногда звук, иногда переполненный зал. Мы собрали площадки, которые стоит знать, объяснили их характер и добавили практические ориентиры.",
      "**Nota Emigro (fact-check):** названия и официальные сайты сверены по публичным страницам клубов и организаторов (2026). Лайн-апы, цены, дресс-код и время работы зависят от **конкретной вечеринки** — не покупайте билет, не глядя программу на [ra.co](https://ra.co/), [shotgun.live](https://shotgun.live/) или сайте клуба.",
    ],
    bullets: [
      "Официально: вход и house rules задаёт организатор конкретной ночи — не «клуб навсегда».",
      "Официально: билеты и возвраты — по условиям RA, Shotgun или сайта клуба.",
      "Официально: на закрытых adult-ивентах съёмка часто запрещена — это правило площадки, не совет чата.",
      "Официально: декриминализация в PT ≠ легальная продажа и ≠ «можно на танцполе» — см. гайд про закон.",
    ],
  },
  {
    heading: "Лиссабон: Kremlin, Lux, Ministerium и другие",
    section_kind: "practice",
    paragraphs: [
      "Если вы ищете techno и электронную музыку в Португалии, логично начать с Лиссабона: больше разнообразия — от клубов с международными артистами до камерных площадок, где важнее эксперимент, чем громкое имя в афише.",
      "**Kremlin** — один из узнаваемых адресов сценической электроники: чаще techno и house, акцент на танцпол, а не на «instagrammable» интерьер. **Наш совет:** не покупайте билет только из‑за названия клуба — посмотрите lineup и послушайте сеты DJ. Сайт: [kremlin.pt](https://www.kremlin.pt/).",
      "**Lux Frágil** — часть истории лиссабонской ночи: несколько залов, электроника, мода и городская культура. Программа сильно меняется от ночи к ночи. Lux стоит посетить хотя бы раз, но не ждите, что каждая вечеринка попадёт в ваш вкус — изучайте афишу. [luxfragil.com](https://www.luxfragil.com/).",
      "**Ministerium Club** — электронная программа в центре; следите за тематическими сериями и приглашёнными артистами. [ministerium.pt](https://www.ministerium.pt/). **Temple** — смотрите конкретные события, а не «один жанр навсегда». **Musicbox** — live, электроника и более камерные форматы, если большой клубный зал не ваш формат.",
      "**Planeta Manas** — LGBTQ+-ориентированная электронная программа; queer-friendly площадки — полноценная часть сцены, а не «отдельная экзотика». Следите за конкретными ивентами и организаторами.",
    ],
  },
  {
    heading: "Порту: Gare, Industria и события вне столиц",
    section_kind: "practice",
    paragraphs: [
      "Сцена в Порту компактнее лиссабонской — зато не нужно каждую субботу ехать на юг. Особенно важно следить за **расписанием** и организаторами, а не за «рейтингом клуба».",
      "**Gare Porto** у São Bento — industrial-эстетика, на первом плане музыка и танцпол. Следите за вечеринками и локальными collectives; маленький ивент без «звёздного» имени иногда лучше переполненного хедлайнера. [gareporto.com](https://www.gareporto.com/).",
      "**Industria Club** — более масштабный формат и приглашённые DJ; ориентируйтесь на **lineup**, а не на адрес. На одни выходные сравните программу Gare и Industria — выбор между ними часто важнее «Порту vs Лиссабон».",
      "Вне двух столиц периодически проходят **Stereogun (Leiria)**, серии **Vinculum**, **Basilar**, pop-up **Techno Bunker** — не «клуб каждую субботу», а события по анонсам в Instagram и на RA. Летом добавьте [фестивальный календарь](/notes/" +
        FESTIVALS_PORTUGAL_2026_SLUG +
        ") — open-air не заменяет еженедельный клуб.",
    ],
    bullets: [
      "Kremlin, Lux, Ministerium, Temple, Musicbox, Planeta Manas — сверяйте неделю на RA/Shotgun.",
      "Порту: Gare и Industria — сравнивайте lineup на одни выходные, а не «рейтинг клуба».",
      "Adult: заявка и house rules до оплаты — Gear Club, Shameless и аналоги.",
      "Не покупайте билет только из‑за бренда клуба — смотрите DJ и формат ночи.",
      "Заложите такси после 2:00 — ночной транспорт не везде удобен.",
      "Подпишитесь на 2–3 организаторов в Instagram вместо десяти «секретных» чатов.",
      "Летние open-air — отдельно от еженедельного клуба; см. фестивальный гайд.",
      "Оценивайте вечер по music / sound / crowd / venue / value — не по одному имени в афише.",
    ],
  },
  {
    heading: "Adult, fetish и sex-positive",
    section_kind: "practice",
    paragraphs: [
      "Закрытые вечеринки, fetish и sex-positive community — отдельный слой ночи. Не ждите точной копии KitKatClub: здесь чаще небольшие сообщества, организаторы и предварительный отбор.",
      "**Gear Club Portugal** — ориентир мужского fetish-коммьюнити; следите за Lisbon Meets Fetish и официальными анонсами. [gearclubportugal.com](https://www.gearclubportugal.com/).",
      "**The Shameless Society** — sex-positive коллектив в Лиссабоне; часть мероприятий — заявка или знакомство с правилами. Не рассчитывайте на обычный walk-in без изучения условий.",
      "**Divalicious** и другие femdom-проекты — тематика и культура важнее «красивой афиши». **Munch**, Kinky Market и образовательные форматы — не play-party: другие правила и темп.",
      "Перед любым закрытым ивентом читайте house rules: возраст, дресс-код, съёмка, согласие. Emigro не учит BDSM-практикам и не помогает искать play-партнёров — только ориентиры входа и этики.",
    ],
  },
  {
    heading: "Где чаты расходятся с дверью",
    section_kind: "gap",
    paragraphs: [
      "В переписке ночь всегда проще: «как в Берлине», «приди в джинсах», «сниму stories», «вещества — часть вайба». У двери правила короче и жёстче.",
    ],
    bullets: [
      "Чат: «как KitKat / Berghain» — на деле камерная PT-сцена и другие форматы входа.",
      "Чат: «джинсы на fetish» — на деле часто отказ; дресс-код на афише.",
      "Чат: «сниму сторис» — на деле камера на adult часто под запретом.",
      "Чат: «вещества = вайб» — на деле риск для здоровья и статуса; см. гайд про закон.",
    ],
  },
  {
    heading: "Типичные ошибки на ночной сцене",
    section_kind: "practice",
    paragraphs: [
      "Редакция видит одни и те же промахи у новичков в Лиссабоне и Порту — их легче избежать, чем спорить с охраной.",
    ],
    bullets: [
      "Покупать билет в «известный клуб» без просмотра lineup.",
      "Ехать в LIS каждую субботу, не открыв афишу Gare / Industria.",
      "Идти на закрытый adult-ивент без заявки и без прочитанных house rules.",
      "Спорить с фейсконтролем и публиковать чужие лица без согласия.",
    ],
  },
  {
    heading: "Как выбрать хорошую вечеринку",
    section_kind: "action_guide",
    paragraphs: [
      "Частая ошибка — выбирать **клуб** по известности, а **ночь** — по одному громкому имени. Хороший вечер складывается из музыки, звука, публики, пространства, организации и цены.",
      "Послушайте DJ заранее. Оцените, будет ли на танцполе место и не превратится ли зал в фотозону. Дорогой билет не гарантирует хорошую ночь — сравнивайте lineup, длительность и формат.",
      "В Emigro удобно оценивать **конкретное мероприятие** по пяти критериям (шкала 1–5 для себя). Это не вечный рейтинг клуба: в одном заведении две соседние субботы могут быть разными.",
    ],
    table: EMIGRO_RATING_TABLE,
    bullets: [
      "Music — lineup; Sound — акустика и mix; Crowd — танцуют или снимают stories?",
      "Venue — место на полу и выход «передохнуть»; Value — билет vs программа.",
      "Покупайте только конкретную вечеринку, не «бренд клуба».",
    ],
  },
  {
    heading: "Афиша и билеты",
    section_kind: "practice",
    paragraphs: [
      "Не опирайтесь на старые подборки и скрины без ссылки на организатора.",
      "**Resident Advisor** — [ra.co](https://ra.co/): поиск по городам, артисты, промоутеры. **Shotgun** — [shotgun.live](https://shotgun.live/): билеты и локальные collectives. **Instagram** — официальные аккаунты клубов и организаторов; многие small events анонсируются только там.",
      "Выберите несколько организаторов и следите за их программой — эффективнее, чем каждый четверг искать «куда пойти» с нуля.",
    ],
  },
  {
    heading: "Перед выходом",
    section_kind: "action_guide",
    paragraphs: [
      "Билеты — через официальные платформы или организатора. Проверьте время, адрес и условия входа. Изучите дресс-код; на закрытых ивентах он часто жёстче, чем в «обычном» клубе.",
      "Не спорьте с охраной. Не снимайте людей без согласия. Продумайте дорогу домой. Не оставляйте напитки без присмотра. На fetish и sex-positive мероприятиях запрет съёмки — не формальность.",
    ],
    bullets: [
      "Walk-in в пиковую ночь без билета — лотерея; на member-ивентах — почти всегда нет.",
      "Консенс: только явное «да»; «может быть» — нет.",
      "Вещества — не «часть вайба»; см. [гайд про закон](/notes/" + DRUGS_LAW_NORTE_SLUG + ").",
    ],
  },
  {
    heading: "Быстрый выбор: с чего начать",
    section_kind: "practice",
    paragraphs: [
      "Это не рейтинг «от лучшего к худшему» — отправная точка. Иногда лучшая ночь месяца — у маленького коллектива, о котором вы узнали за три дня до субботы.",
    ],
    table: QUICK_PICK_TABLE,
  },
  {
    heading: "Итог",
    section_kind: "practice",
    paragraphs: [
      "Португальская электронная сцена не притворяется Берлином или Амsterdam — и в этом плюс: большие клубы, камерные залы, collectives и закрытые сообщества в одной стране.",
      "Следите за артистами и организаторами, смотрите на публику и не покупайте билет только из‑за красивого названия. Мы идём не за галочкой в списке заведений — за музыкой, атмосферой и ночью, которую потом вспоминают.",
      "*Редакция Emigro. 18+. Афиши и правила входа могут меняться — перед посещением проверяйте официальные источники.*",
    ],
  },
];

const keyTakeaways = [
  "Официально: правила входа, билеты и запрет съёмки задаёт организатор конкретной ночи — сверяйте RA, Shotgun и сайт клуба.",
  formatPracticeTakeaway({
    channels: ["por_tugal"],
    period: "2026",
    claim: "хорошую ночь выбирают по lineup и публика, а не по бренду клуба; в LIS — Kremlin/Lux/Ministerium, в Порту — Gare/Industria",
    forReader: "оцените вечер по music, sound, crowd, venue, value",
  }),
  "Расхождение: чат обещает «как Берлин» и walk-in на adult — дверь чаще требует заявку, дресс-код и уважение к консенсу.",
  formatPracticeTakeaway({
    channels: ["chatlisboa"],
    period: "2026",
    claim: "афишу и билеты берут на RA и Shotgun, не у «парня из чата»",
    forReader: "подпишитесь на 2–3 организаторов в Instagram",
  }),
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Где в Португалии лучше всего слушать techno?",
    a: "В Лиссабоне начните с Kremlin, Lux, Ministerium и Temple — по конкретной программе. В Порту — Gare и Industria. Выбирайте вечеринку, а не только адрес клуба.",
  },
  {
    q: "Есть ли в Португалии клуб уровня Berghain или KitKatClub?",
    a: "Полного аналога по масштабу нет. Сцена компактнее и сильнее завязана на community. В fetish-направлении смотрите Gear Club и курированные sex-positive коллективы.",
  },
  {
    q: "Где искать underground-вечеринки?",
    a: "Resident Advisor, Shotgun и официальные аккаунты локальных организаторов в Instagram. Не все интересные события широко рекламируются.",
  },
  {
    q: "Нужно ли соблюдать дресс-код?",
    a: "Зависит от клуба и конкретного мероприятия. На тематических и закрытых вечеринках правила строже — читайте афишу заранее.",
  },
  {
    q: "Можно ли прийти одному?",
    a: "На обычные клубные вечеринки — как правило, да. На закрытые community events могут быть дополнительные требования.",
  },
  {
    q: "Когда лучше ехать в Лиссабон ради клубной жизни?",
    a: "Ориентируйтесь на конкретные мероприятия и артистов, а не только на календарный месяц. Проверяйте афишу перед поездкой.",
  },
];

export const CLUBS_PORTUGAL_UNDERGROUND_GUIDE = {
  slug: CLUBS_PORTUGAL_UNDERGROUND_SLUG,
  category: "Досуг",
  content_kind: "guide" as ContentKind,
  title: "Ночные клубы Португалии 2026: техно, андеграунд и своя тусовка",
  excerpt:
    "Редакционный гид Emigro: Kremlin, Lux, Gare, Industria, queer- и sex-positive-сцена. Как выбрать вечеринку, а не только клуб. 18+.",
  seo_title: "Ночные клубы Португалии 2026 — техно, Порту и Лиссабон",
  seo_description:
    "Куда идти за techno в Лиссабоне и Порту: Kremlin, Gare, Lux, queer и adult-сцена. Как оценить вечеринку — music, crowd, value. Гид Emigro 18+.",
  quick_answer:
    "Португалия — не Берлин: сцена компактнее, но techno, queer- и sex-positive-события есть. Название клуба не гарантирует ночь — смотрите lineup на RA/Shotgun. Лиссабон: Kremlin, Lux, Ministerium, Temple, Musicbox, Planeta Manas. Порту: Gare и Industria. Оценивайте вечер по music, sound, crowd, venue и value. 18+, Emigro против наркотиков; adult — только с правилами организатора.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "Resident Advisor", url: "https://ra.co/" },
    { title: "Shotgun", url: "https://shotgun.live/" },
    { title: "Kremlin Lisboa", url: "https://www.kremlin.pt/" },
    { title: "Lux Frágil", url: "https://www.luxfragil.com/" },
    { title: "Ministerium Club", url: "https://www.ministerium.pt/" },
    { title: "Gare Porto", url: "https://www.gareporto.com/" },
    { title: "Gear Club Portugal", url: "https://www.gearclubportugal.com/" },
  ],
  topic_tags: ["dosug", "portugal", "kluby", "norte"],
  hashtags: buildNoteHashtags({
    topicTags: ["dosug", "portugal", "norte"],
    contentKind: "guide",
    extra: ["porto", "lisbon", "techno", "club", "lgbtq", "nightlife"],
  }),
  source_channel: "editorial+official",
  source_label: "editorial:clubs-underground-2026-v2",
};
