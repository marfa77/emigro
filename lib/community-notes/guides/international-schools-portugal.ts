/**
 * Hand-curated guide (blueprint reference) — editorial presentation rules:
 * - quick_answer: 2–3 plain Russian sentences; key_takeaways: max 4 action items
 * - Each section: lead «зачем читать» + actionable bullets; gap: «чат vs сайт»
 * Ranking: Emigro composite for relocants (not an official league table).
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { formatPracticeTakeaway } from "@/lib/community-notes/practice-format";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const INTERNATIONAL_SCHOOLS_GUIDE_SLUG = "mezhdunarodnye-shkoly-portugaliya-2026";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(
      glossaryForSlug(INTERNATIONAL_SCHOOLS_GUIDE_SLUG)!,
      "Термины с сайтов школ, DGE и из переписки admissions — разберём до open day, пока waiting list не съел сентябрь."
    ),
  },
  {
    heading: "Три дорожки: pública, privada и internacional",
    section_kind: "official",
    paragraphs: [
      "Что делать: выбрать систему — escola pública, colégio privado PT или international — до поиска жилья и shortlist школ.",
      "Зачем: от выбора зависят morada, бюджет и waiting list; смена трека mid-year почти всегда болезненна.",
      "В Португалии дети с 6 лет обязаны учиться (ensino básico). Для семьи релоканта это не «одна английская школа», а три разных правила поступления.",
      "Главное: сначала система и горизонт переезда (2 года vs навсегда), потом район и Idealista.",
    ],
    bullets: [
      "Escola pública: matrícula через agrupamento / Câmara; приоритет — дети с адресом в зоне школы (SED / GEC).",
      "Colégio privado PT: договор с учреждением, португальский язык, подготовка к exames nacionais.",
      "International: прямой контракт со школой; English/French/German + португальский как второй язык почти всегда обязателен.",
      "Пакет почти везде: паспорт ребёнка, NIF ребёнка и родителя, comprovativo de morada, calendário vacinação, school report / transcripts.",
      "Официальные рамки: DGE (Direção-Geral da Educação), calendário escolar MEC; international — свои admissions + аккредитации IB / Cambridge / AEFE.",
    ],
  },
  {
    heading: "Как мы ранжируем (и чего рейтинг не делает)",
    section_kind: "official",
    paragraphs: [
      "Что делать: читать Emigro-ранг как shortlist для релоканта, а не как «официальную таблицу MEC».",
      "Зачем: в PT нет публичного league table для international schools как в UK; Google-звёзды легко искажаются туристами и троллями.",
      "Критерии Emigro (2026): институциональная репутация (Spear’s / IB scores / аккредитации) → давление waiting list → объём и тон отзывов (Google + school aggregators) → пригодность для RU/BY/UA/KZ-семей (язык, fees, Norte vs Lisboa).",
      "Главное: ранг ниже — от сильного «якоря» для мобильных семей к более узким или новым опциям; всегда подтверждайте fees и места письмом admissions.",
    ],
    bullets: [
      "Официально сильнее всего: IB Diploma averages выше world average (~30), статус IB World School / Cambridge / AEFE / US State Department.",
      "На практике Google Maps: смотрите и ★, и число отзывов; 4.9 из двух отзывов ≠ надёжнее 3.7 из 80.",
      "Спрос (waiting list 9–18 мес.) — косвенный сигнал репутации, но и барьер входа.",
      "Language-track (French/German) поднимаем в ранге только если язык семьи совпадает — иначе это не «хуже», а «не ваш трек».",
      "Сверяйте цифры на сайте школы и fee schedule 2025/26–2026/27 — tuition меняют каждый год.",
    ],
  },
  {
    heading: "Рейтинг школ: от лучших к более узким",
    section_kind: "practice",
    paragraphs: [
      "Что делать: пройти список сверху вниз и выписать 2–3 школы под ваш curriculum и город — потом open day.",
      "Зачем: в @por_tugal и семейных разборах Norte/Lisboa повторяется одно: «не выбирайте по красивому сайту — смотрите IB/аккредитацию, commute и лист ожидания».",
      "Ориентиры Google / агрегаторов — на июль 2026; перед решением откройте карточку школы в Maps сами.",
    ],
    bullets: [
      "1) [St. Julian’s School](https://www.stjulians.com/) (Carcavelos) — British → IGCSE → IB; Spear’s Schools Index: European Top 10 и единственная PT-школа в global Top 100 (4-й год подряд, март 2026). IB average ориентир 34.5–35.7. Google ~3.7★ / ~86 отзывов (смесь «сильная академия» и жалоб на bullying). Fees в верхнем сегменте Lisboa (~€13k–30k по годам). Waiting list жёсткий — подавайте за 12+ мес.",
      "2) [CAISL — Carlucci American](https://www.caislisbon.org/) (Linho / Sintra) — единственная US State Department-sponsored школа в PT; American Diploma + IB/AP. IB avg ~34.3. iSchoolAdvisor ~4.65★ (13 отзывов). Для семей с треком US-вузов — часто №1 по смыслу, не по «британскому престижу».",
      "3) [Oeiras International School (OIS)](https://ois.pt/) — IB continuum (PYP/MYP/DP), сильный спрос Oeiras/Queijas. iSchoolAdvisor ~4.37★ / 24 отзыва (высокие баллы за academics/teachers). Хороший баланс IB без «старого клуба» Cascais line.",
      "4) [Oporto British School — OBS](https://www.obs.edu.pt/) (Foz) — с 1894, старейшая British на материковой Европе; единственный IB Diploma в Norte. Fees 2025/26 ~€8 990–14 585. Агрегаторы: ~3.8–4.9★ при малой выборке; родители хвалят community и pastoral care. Класс меньше CLIP — плюс для одних, минус для других.",
      "5) [CLIP — Oporto International School](https://www.clip.edu.pt/) (Aldoar/Boavista) — крупнее OBS (~800–1000+), Cambridge/British track, IGCSE/A-Levels; fees ~€9 140–15 190. На aggregators десятки отзывов (guiaempresas ~87); хвалят кампус и extracurriculars, в негативе — sixth form / язык учителей. Более «международно-разнообразный» состав, чем OBS.",
      "6) [Lycée Français Charles Lepierre (Lisboa)](https://www.lfcl.pt/) / [LFIP Porto](https://www.lfip.pt/) + [Deutsche Schule Lisboa](https://dslissabon.com/) / [Deutsche Schule Porto](https://dsp.pt/) — AEFE / немецкий Abitur. Fees LFIP Porto ~€4 915–6 214 (часто ниже British/IB; субсидии для граждан FR). Ранг высокий при French/German дома; для англоязычных релокантов — осознанный выбор языка, не «запасной вариант».",
      "7) [King’s College Cascais](https://www.cascais.kingscollegeschool.pt/) / [United Lisbon](https://www.unitedlisbon.school/) / [IPS Cascais](https://www.ipsschool.org/) (primary) — растущие кампусы British/IB; на International Schools Database у King’s встречались очень низкие выборки отзывов (ориентир ~1.4★ / 2 отзыва — не приговор, а сигнал «мало данных»). Посещайте лично, не доверяйте двум звёздам.",
      "8) [CLIB — Braga International School](https://www.clib.edu.pt/) (Gualtar) — главный полноценный British в Minho (IGCSE/AICE, 3–18). Fees «on request», ориентир семей €7k–12k. Публичных Google-обзоров мало — оценивайте open day + plan B (Porto commute 45–60 мин или pública).",
      "9) [CJD International (Porto)](https://www.cjd.pt/) и другие новые Cambridge-ветки — открытие ~2023/24, fees ориентир €9.3k–11k. Track record короче; подходит как запасной слот, если OBS/CLIP закрыты.",
    ],
  },
  {
    heading: "Norte vs Lisboa: куда смотреть по городу",
    section_kind: "practice",
    paragraphs: [
      "Что делать: если цель — Norte, shortlist OBS/CLIP (+ LFIP/Deutsche при языке) или CLIB в Braga; Lisboa/Cascais — St Julian’s, OIS, CAISL.",
      "Зачем: аренда в Foz/Boavista ниже Cascais на 15–25%, но waiting list OBS/CLIP на Year 7 всё равно 6–12 месяцев.",
      "Районы и аренда T2 — в [Porto vs Braga для семьи со школой](/notes/porto-vs-braga-semya-mezhdunarodnaya-shkola-2026).",
    ],
    bullets: [
      "Porto: OBS/LFIP/Deutsche в Foz; CLIP у Boavista — семьи селятся в Foz, Boavista, Matosinhos.",
      "Braga: CLIB в Gualtar; иначе A3/A7 до Porto schools ~45–60 мин в пик.",
      "Lisboa line: Cascais / Carcavelos / Oeiras / Sintra — St Julian’s, IPS, OIS, CAISL; подача за 9–12 мес. до сентября.",
      "В @braga_pt_rus (июль 2026) чаще разбирают не CLIB, а pública/colégios: Quinta da Veiga (ремонт ~2 года, временная площадка у Taberna Belga, agrupamento Francisco Sanches), Santa Tecla (компактная, мало кружков), Enguardas, creche Lamaçães / Colégio Leonardo da Vinci.",
      "Secundário 10–12: сначала curso/направление (~4), потом школа — в конкретной escola нужного направления может не быть; secundário «одна на район».",
      "Pública básica: несколько школ в порядке предпочтения по morada; к июлю jardim/creche часто уже распределены — сначала квартира + визит в agrupamento.",
      "Полная стоимость British/IB в Porto (tuition + bus + lunch + enrollment): часто €25k–30k/год на двоих детей в primary — не «цена с сайта».",
      "Pública plan B: PLNM в Porto растёт; lepta 2025 — больше медиаторов, но качество зависит от agrupamento.",
    ],
  },
  {
    heading: "Официально vs Google и чаты",
    section_kind: "gap",
    paragraphs: [
      "Что делать: сверяйте fee schedule и письмо admissions с карточкой Google — не с одним яростным отзывом.",
      "Зачем: «места есть» на сайте и 1★ про bullying в Maps решают разные вопросы.",
    ],
    bullets: [
      "Официально: IB/Cambridge/AEFE и calendário MEC задают рамку; Google не аккредитует школу.",
      "На практике: St Julian’s при Spear’s Top 100 имеет Google ~3.7 — престиж и «токсичные» отзывы сосуществуют; читайте свежие parent reviews, не только ★.",
      "На сайте «places available» ≠ место в вашем year group; Year 7 / IB DP закрываются раньше.",
      "В чатах Lisboa/Porto мало разборов конкретных школ; в @braga_pt_rus (2026) живая практика по pública Braga (Veiga, Sanches, Santa Tecla) и creche — CLIB упоминают реже, чем госшколы района.",
      "D-visa + AIMA receipt часто хватает для provisional place; без NIF ребёнка договор не закроют.",
      "«Английская без португальского» — миф: PT lessons обязательны почти везде с младших классов.",
    ],
  },
  {
    heading: "Таймлайн и типичные ошибки",
    section_kind: "practice",
    paragraphs: [
      "Что делать: старт за 9–12 месяцев до сентября — contact → assessment → депозит; для público — calendário matrículas concelho.",
      "Зачем: ошибки ниже съедают семестр и enrollment fee.",
    ],
    bullets: [
      "Ошибка: аренда без проверки commute до выбранной школы / catchment público.",
      "Ошибка: NIF только у родителя — оформите NIF ребёнку до deadline.",
      "Ошибка: верить только Google ★ при выборке <10 отзывов.",
      "Ошибка: один shortlist без plan B (публичная / другая international / другой город).",
      "Ошибка: игнорировать bus + lunch + exam fees — к tuition легко добавить €3k–6k/год.",
      "Ошибка: ждать пластик ВНЖ — многие школы берут D-visa + AIMA receipt, но фиксируйте письменно.",
    ],
  },
];

const keyTakeaways = [
  "Официально: ensino obrigatório с 6 лет; internacional — контракт со школой + NIF ребёнка и morada; pública — matrícula по адресу в agrupamento.",
  formatPracticeTakeaway({
    channels: ["por_tugal"],
    period: "2025–2026",
    claim:
      "waiting list в топ-школах (St Julian’s, OBS, CLIP, OIS) часто 6–18 месяцев, а полная стоимость British/IB в Porto на двоих детей ближе к €25k–30k/год",
    forReader: "подавайте за 9–12 месяцев и закладывайте bus/lunch/enrollment сверх tuition с сайта",
  }),
  "Официально: St Julian’s — единственная PT-школа в Spear’s global Top 100 (март 2026); IB averages ~34–36 выше world average.",
  "Расхождение: высокий престиж ≠ высокие Google ★; читайте число отзывов и свежие parent reviews, не одну цифру.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Какая международная школа в Португалии «лучшая»?",
    a: "Официального MEC-рейтинга нет. По институциональной репутации для мобильных семей чаще ставят St Julian’s (Spear’s Top 100, сильный IB). Для US-трека — CAISL. В Norte якоря — OBS (IB DP) и CLIP. Выбор = curriculum + город + waiting list, не одна звезда Google.",
  },
  {
    q: "Как читать Google-рейтинг школы?",
    a: "Смотрите ★ и число отзывов. 4.9 из двух отзывов слабее 3.7 из 80. У St Julian’s смешанные Google-отзывы при сильной академической репутации — типичный разрыв «престиж vs Maps».",
  },
  {
    q: "Можно ли поступить в international school без ВНЖ?",
    a: "Часто да — D-visa + запись AIMA. По правилам школы нужен легальный статус. На практике conditional place возможен, но NIF и morada понадобятся до старта занятий.",
  },
  {
    q: "Сколько стоят международные школы в 2026?",
    a: "British/IB tuition ориентир €9k–22k/год (Lisboa выше Norte). LFIP Porto ~€5–6k. Полный бюджет с bus/lunch/enrollment часто на 20–40% выше tuition. Уточняйте fee schedule школы.",
  },
  {
    q: "Какие школы в Порту и Браге?",
    a: "Porto: OBS, CLIP, LFIP, Deutsche Schule (+ новые вроде CJD). Braga: CLIB в Gualtar. Районы и аренда — в гайде Porto vs Braga для семьи со школой.",
  },
  {
    q: "Чем IB отличается от British curriculum?",
    a: "British (National Curriculum / IGCSE / A-Levels) — линейная UK-система. IB (PYP/MYP/DP) — международный диплом для EU/US вузов. В PT оба трека есть; St Julian’s и OBS закрывают путь к IB Diploma.",
  },
  {
    q: "Нужен ли ребёнку NIF?",
    a: "Да — для matrícula público и договора private/international. Родительский NIF не заменяет. Finanças / Loja de Cidadão.",
  },
  {
    q: "Когда подавать на сентябрь?",
    a: "International: за 9–12 месяцев, пик январь–март (open days, assessment). Público: calendário matrículas concelho (часто апрель–июнь). Mid-year — меньше мест.",
  },
];

export const INTERNATIONAL_SCHOOLS_GUIDE = {
  slug: INTERNATIONAL_SCHOOLS_GUIDE_SLUG,
  category: "Школы и дети",
  content_kind: "guide" as ContentKind,
  title: "Международные школы в Португалии 2026: рейтинг, Google-отзывы и поступление",
  excerpt:
    "Ранжирование international schools от St Julian’s и CAISL до OBS, CLIP и CLIB: Spear’s/IB, Google-оценки, fees, waiting list и практика для семей в Norte и Lisboa.",
  seo_title: "Рейтинг международных школ PT 2026",
  seo_description:
    "Рейтинг международных школ Португалии 2026: St Julian’s, CAISL, OBS, CLIP, CLIB. IB, Spear’s, Google-отзывы, стоимость и waiting list для релокантов Norte/Lisboa.",
  quick_answer:
    "Вы открываете Maps у Carcavelos и видите 3.7★ у школы из Spear’s Top 100 — и понимаете, что одна цифра не выбирает школу. Для релокантов Emigro ранжирует от St Julian’s и CAISL к OBS/CLIP в Porto и CLIB в Braga: престиж и IB, спрос waiting list, отзывы с размером выборки. Без NIF ребёнка и подачи за 9–12 месяцев сентябрь всё равно ускользнёт.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "DGE — Direção-Geral da Educação", url: "https://www.dge.mec.pt/" },
    { title: "IB — Find a programme", url: "https://www.ibo.org/programmes/find-a-programme/" },
    { title: "Cambridge International", url: "https://www.cambridgeinternational.org/" },
    { title: "St Julian’s School", url: "https://www.stjulians.com/" },
    { title: "CAISL Lisbon", url: "https://www.caislisbon.org/" },
    { title: "Oeiras International School", url: "https://ois.pt/" },
    { title: "Oporto British School", url: "https://www.obs.edu.pt/" },
    { title: "CLIP Porto", url: "https://www.clip.edu.pt/" },
    { title: "Lycée Français Charles Lepierre", url: "https://www.lfcl.pt/" },
    { title: "LFIP Porto", url: "https://www.lfip.pt/" },
    { title: "Deutsche Schule Lisboa", url: "https://dslissabon.com/" },
    { title: "Deutsche Schule Porto", url: "https://dsp.pt/" },
    { title: "King’s College Cascais", url: "https://www.cascais.kingscollegeschool.pt/" },
    { title: "United Lisbon", url: "https://www.unitedlisbon.school/" },
    { title: "IPS Cascais", url: "https://www.ipsschool.org/" },
    { title: "CLIB Braga", url: "https://www.clib.edu.pt/" },
    { title: "CJD Porto", url: "https://www.cjd.pt/" },
    { title: "Porto — Educação", url: "https://www.porto.pt/educacao" },
    { title: "Braga — Educação", url: "https://www.cm-braga.pt/pt/101/educacao-e-ensino" },
  ],
  topic_tags: ["school", "portugal"],
  hashtags: buildNoteHashtags({
    topicTags: ["school", "portugal"],
    contentKind: "guide",
    extra: ["школа", "дети", "рейтинг", "ib", "porto", "braga", "cascais"],
  }),
  source_channel: "por_tugal+chatlisboa+lepta+braga_pt_rus+spears+google-aggregators",
  source_label: "editorial:ranking-pass+braga-chat+ib-spears+google-2026",
};
