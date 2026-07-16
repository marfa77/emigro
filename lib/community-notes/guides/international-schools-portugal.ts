/**
 * Hand-curated guide (blueprint reference) — editorial presentation rules:
 * - quick_answer: 2–3 plain Russian sentences; key_takeaways: max 4 action items
 * - Each section: lead «зачем читать» + max 5 bullets; gap: «чат vs сайт»
 * See lib/community-notes/editorial-presentation.ts
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
    ...buildGlossarySection(glossaryForSlug(INTERNATIONAL_SCHOOLS_GUIDE_SLUG)!),
  },
  {
    heading: "Три дорожки: pública, privada и internacional",
    section_kind: "official",
    paragraphs: [
      "Зачем вам это сейчас: чтобы не путать «английскую школу» с бесплатной público по адресу и не арендовать квартиру «на глаз».",
      "Что делать: выберите одну из трёх систем — escola pública, colégio privado PT или international — до поиска жилья.",
      "Зачем: от выбора зависят morada, бюджет и waiting list; смена трека mid-year почти всегда болезненна.",
      "В Португалии дети с 6 лет обязаны учиться (ensino básico). Для семьи релоканта это не «одна английская школа», а три разных правила поступления.",
      "Главное: сначала система и горизонт переезда (2 года vs навсегда), потом район и Idealista.",
    ],
    bullets: [
      "Escola pública: matrícula через agrupamento / Câmara Municipal; приоритет — дети с адресом в зоне школы.",
      "Colégio privado PT: договор с учреждением, португальский язык, подготовка к exames nacionais.",
      "International: прямой контракт со школой, английский/французский/немецкий + португальский как второй язык.",
      "Ensino básico: 1.º–3.º ciclo (примерно 6–15 лет); secundário — до 18 лет.",
      "Для поступления в любую систему обычно нужны: паспорт ребёнка, NIF, comprovativo de morada, calendário vacinação, предыдущий school report.",
    ],
  },
  {
    heading: "Что требуют школы и муниципалитет по документам",
    section_kind: "official",
    paragraphs: [
      "Зачем вам это сейчас: без NIF ребёнка и morada matrícula не закроют — ни в público, ни в international.",
      "Что делать: соберите пакет NIF + comprovativo de morada + transcripts до open day и дедлайна SED.",
      "Зачем: D-visa + AIMA appointment часто хватает для provisional place, но без NIF договор не подпишут.",
      "Официальная запись в público идёт через SED / agrupamento escolar. International schools работают по своим регламентам, но почти всегда просят подтверждение легального пребывания.",
      "Главное: NIF ребёнка оформляйте раньше application deadline — родительский NIF его не заменяет.",
    ],
    bullets: [
      "NIF ребёнка и родителя — нужен для matrícula и договора (Finanças / Loja de Cidadão).",
      "Comprovativo de morada: договор arrendamento с registo na Finanças или справка freguesia.",
      "Autorização de residência / D-visa + AIMA appointment — для подтверждения легального статуса (требование зависит от школы).",
      "Boletim / transcripts: перевод на PT или EN; для IB/British — часто достаточно английского отчёта.",
      "Calendário vacinação (Plano Nacional de Vacinação) — сверка с SNS; прививки можно донести после зачисления.",
    ],
  },
  {
    heading: "Как выбрать: international vs portuguesa",
    section_kind: "practice",
    paragraphs: [
      "Зачем вам это сейчас: в @por_tugal и @chatlisboa спор сводится к горизонту — «переходный год на английском» vs «сразу в локальную систему».",
      "Что делать: зафиксируйте горизонт (2–4 года vs долго), бюджет tuition и commute до shortlist школ.",
      "Зачем: в Norte семьи чаще селятся в Foz, Boavista, Matosinhos или Gualtar — район без школы превращается в ежедневный стресс.",
      "Главное: international имеет смысл при коротком горизонте или IB/A-Levels за рубежом; иначе pública/privada PT + репетитор часто выгоднее.",
    ],
    bullets: [
      "International — если переезд на 2–4 года, ребёнок старше 10–12 лет или нужен IB/A-Levels/AP для университета за рубежом.",
      "Escola pública / privada PT — если планируете жить долго, важен португальский и местный круг; бюджет ограничен.",
      "Гибрид: 1–2 года international + португальский репетитор, затем transfer в privada PT — частый сценарий в Кашкайше/Синтре.",
      "Смотрите commute: St Julian's / IPS — Cascais line; в Порту — OBS/CLIP в Foz/Boavista; в Браге — CLIB в Gualtar.",
      "Стоимость international 2026: ориентир €9 000–22 000/год + enrollment €500–3 000 + автобус/питание; в Norte British/IB чуть ниже Lisboa.",
    ],
  },
  {
    heading: "Лиссабон и linha de Cascais: куда смотреть",
    section_kind: "practice",
    paragraphs: [
      "Зачем вам это сейчас: большинство русскоязычных семей концентрируются в Cascais, Oeiras, Sintra и Lisbon — waiting list там самый жёсткий.",
      "Что делать: shortlist 2–3 школ на linha de Cascais / Oeiras и подавайте за 9–12 месяцев до сентября.",
      "Зачем: «places available» на сайте часто не значит место в вашем year group — Year 7 и IB DP закрываются раньше всех.",
      "Главное: ориентиры ниже — не рейтинг; состав классов и лист ожидания меняются ежегодно.",
    ],
    bullets: [
      "St. Julian's School (Carcavelos) — British, сильная репутация, высокий спрос, ранний application.",
      "International Preparatory School / IPS (Cascais) — primary, British, компактные классы.",
      "Oeiras International School — IB continuum, популярен у семей в Oeiras/Queijas.",
      "Carlucci American International School (Lisbon) — American + IB options, крупный кампус.",
      "United Lisbon / Astoria / King's College Cascais — растущие кампусы; LFIP и Deutsche Schule — для French/German track.",
    ],
  },
  {
    heading: "Порту: OBS, CLIP и french/german track",
    section_kind: "practice",
    paragraphs: [
      "Зачем вам это сейчас: в Порту четыре устоявшихся international schools — большинство семей с детьми селятся в Foz, Boavista или Matosinhos.",
      "Что делать: сравните OBS, CLIP, LFIP и Deutsche Schule по curriculum, fees и commute 10–20 минут до кампуса.",
      "Зачем: аренда в Foz/Boavista ниже Cascais на 15–25%, но waiting list OBS/CLIP на Year 7 всё равно 6–12 месяцев.",
      "Главное: matrícula в público — через GEC Porto по morada; international — прямой application + NIF ребёнка.",
    ],
    bullets: [
      "Oporto British School (OBS, Foz) — British + IB Diploma; €9 700–17 300/год, высокий спрос на Year 7.",
      "CLIP (Boavista/Aldoar) — Cambridge/IB, ~1 000 учеников; €9 100–15 200/год.",
      "Lycée Français International de Porto (LFIP, Foz) — AEFE; €5 100–6 200/год для французских граждан с субсидиями.",
      "Deutsche Schule zu Porto (Foz) — German Abitur / DSD; ориентир €5 000–10 000/год для семей из DACH.",
      "Waiting list OBS/CLIP: подавайте за 9–12 месяцев; mid-year мягче в младших классах.",
    ],
  },
  {
    heading: "Брага и Minho: CLIB и соседние варианты",
    section_kind: "practice",
    paragraphs: [
      "Зачем вам это сейчас: в Minho один полноценный British international school — CLIB; иначе commute в Porto 45–60 минут.",
      "Что делать: запросите fee schedule у CLIB admissions и параллельно plan B — CLIP/OBS или pública по адресу.",
      "Зачем: expat-сообщество меньше Lisboa/Porto; без plan B семья зависает на год в «временной» школе.",
      "Главное: CLIB в Gualtar — главный вариант в Braga; при заполненных местах смотрите Porto или colégio privado PT.",
    ],
    bullets: [
      "CLIB (Gualtar) — British National Curriculum, IGCSE/AICE; 3–18 лет; admission через assessment + interview.",
      "Fees CLIB «on request» — ориентир семей €7 000–12 000/год; enrollment и bus считайте отдельно.",
      "Альтернатива: CLIP/OBS в Porto по A3/A7; часть семей год в CLIB, затем transfer для IB.",
      "Escola pública в Braga/Guimarães: matrícula через agrupamento — vaga находят быстрее, чем в Lisboa.",
      "Сроки: popular year groups — contact за 6–9 месяцев до сентября.",
    ],
  },
  {
    heading: "Где портал и реальность расходятся",
    section_kind: "gap",
    paragraphs: [
      "Что делать: сверяйте сайт школы и SED с письмом admissions — не с чужим кейсом из чата.",
      "Зачем: «места есть» и «ВНЖ обязателен» часто значат другое для вашего year group и статуса.",
      "Главное: waiting list и NIF решают больше, чем красивая страница Admissions.",
    ],
    bullets: [
      "На сайте SED звучит как «место по адресу», а в Lisboa/Cascais в popular agrupamentos очередь — иногда направляют в соседнюю escola.",
      "На сайте школы звучит как «places available», а на деле waiting list 6–18 месяцев; Year 7 / Grade 6 — самый конкурентный.",
      "Формально D-visa + AIMA appointment часто достаточно для provisional enrollment; без NIF matrícula не закроют.",
      "«Свободный перевод оценок» — international просят notarized translation + иногда apostille на предыдущий отчёт.",
      "Португальский «не нужен» в international — на практике PT lessons обязательны с 1 класса.",
      "SED Porto/Braga: в Foz и Gualtar популярные школы заполняются к июню; иногда предлагают соседний agrupamento.",
    ],
  },
  {
    heading: "Таймлайн поступления и типичные ошибки",
    section_kind: "practice",
    paragraphs: [
      "Зачем вам это сейчас: оптимально начинать за 9–12 месяцев до сентября — иначе сентябрь уходит на público без plan B.",
      "Что делать: open days в феврале–марте, assessment весной, контракт и депозит до лета; для público — calendário matrículas concelho.",
      "Зачем: типичные ошибки ниже съедают семестр и депозит enrollment.",
      "Главное: NIF ребёнка + transcripts + проверка commute до подписи аренды — три фильтра, которые нельзя откладывать.",
    ],
    bullets: [
      "Ошибка: аренда без проверки catchment público / commute до выбранной international.",
      "Ошибка: один NIF только у родителя — оформите NIF ребёнку до application deadline.",
      "Ошибка: ждать ВНЖ в пластике — многие школы зачисляют по D-visa + AIMA receipt, но уточняйте письменно.",
      "Ошибка: не готовить transcripts — запросите apostilled report заранее (2–8 недель).",
      "Ошибка: игнорировать PT и bus fee — даже в British school нужен базовый португальский; автобус €100–250/мес.",
    ],
  },
];

const keyTakeaways = [
  "Сегодня: оформите NIF ребёнку и соберите transcripts — без них matrícula не закроют.",
  "Официально: ensino obrigatório с 6 лет; público бесплатна при vaga в agrupamento по morada.",
  formatPracticeTakeaway({
    channels: ["por_tugal", "chatlisboa"],
    period: "2025–2026",
    claim:
      "в international schools (международных школах) waiting list (очередь) часто 6–18 месяцев, стоимость €9k–22k/год",
    forReader: "подавайте за 9–12 месяцев до желаемого старта — иначе рискуете годом в público (госшколе) без плана B",
  }),
  "Расхождение: «английская без португальского» — PT уроки обязательны; для público без языка тяжело.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Можно ли поступить в international school без ВНЖ?",
    a: "Часто да — D-visa + запись AIMA или ВНЖ. По правилам школы обычно нужен легальный статус. На практике часть школ даёт conditional place по паспорту и proof of relocation, но NIF и morada всё равно понадобятся до начала занятий.",
  },
  {
    q: "Сколько стоят международные школы в Португалии в 2026?",
    a: "Ориентир €9 000–22 000 в год tuition плюс enrollment fee, транспорт и питание. В Norte (Porto/Braga) British/IB часто на 10–20% ниже Lisboa/Cascais; LFIP/Deutsche Schule — от €5k. Уточняйте fee schedule на сайте школы.",
  },
  {
    q: "Чем IB отличается от British curriculum?",
    a: "British (National Curriculum / IGCSE / A-Levels) — линейная система UK. IB (PYP/MYP/DP) — международный диплом, популярен для поступления в EU/US. В Португалии оба трека есть; выбор зависит от целевого университета ребёнка.",
  },
  {
    q: "Нужен ли ребёнку NIF для школы?",
    a: "Да, для matrícula в público и для договора в private/international. Оформите NIF ребёнку в Finanças или Loja de Cidadão — родительский NIF не заменяет.",
  },
  {
    q: "Когда подавать документы на сентябрь?",
    a: "International: за 9–12 месяцев, активная фаза — январь–март (open days, assessment). Público: calendário matrículas concelho (часто апрель–июнь). Mid-year возможен, но меньше мест.",
  },
  {
    q: "Можно ли после international перейти в португальскую школу?",
    a: "Да, через equivalência de estudos в agrupamento. На практике потребуется португальский на уровне класса и сверка предметов; проще переход в 1.º–2.º ciclo, сложнее в 3.º ciclo / secundário.",
  },
  {
    q: "Какие international schools есть в Порту?",
    a: "Четыре основных: Oporto British School (British + IB DP, Foz), CLIP (Cambridge/IB, Boavista), Lycée Français International de Porto (French AEFE, Foz) и Deutsche Schule zu Porto (German Abitur, Foz). Все требуют NIF и morada; OBS и CLIP — waiting list 6–12 месяцев на популярные классы.",
  },
  {
    q: "Есть ли международная школа в Браге?",
    a: "Да — CLIB (Braga International School) в Gualtar: British curriculum, IGCSE/AICE, 3–18 лет. Это главный вариант в Minho; при заполненных местах семьи ездят в CLIP/OBS (Porto, ~45–60 мин) или записываются в escola pública/privada PT по адресу.",
  },
];

export const INTERNATIONAL_SCHOOLS_GUIDE = {
  slug: INTERNATIONAL_SCHOOLS_GUIDE_SLUG,
  category: "Школы и дети",
  content_kind: "guide" as ContentKind,
  title: "Международные школы в Португалии 2026: British, IB, American и поступление",
  excerpt:
    "International schools в Порту, Браге и Лиссабоне: British, IB, French, German — документы, сроки, бюджет, waiting list и отличия от escola pública для семей релокантов.",
  seo_title: "Международные школы Португалии 2026 — гайд",
  seo_description:
    "Гайд по международным школам Португалии 2026: British, IB и French в Порту, Браге и Лиссабоне. Документы NIF, стоимость, waiting list и отличия от escola pública.",
  quick_answer:
    "Сентябрь уже на календаре, а школа просит заявку за год до поступления. В Португалии у семьи три дорожки: бесплатная pública по адресу, частная с португальской программой или international (British, IB, French). Для любой нужны NIF ребёнка и morada; international — от €9 000/год.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "DGE — Direção-Geral da Educação", url: "https://www.dge.mec.pt/" },
    { title: "gov.pt — Educação", url: "https://www.gov.pt/pt/servicos" },
    { title: "IB World Schools", url: "https://www.ibo.org/programmes/find-a-programme/" },
    { title: "Cambridge International Education", url: "https://www.cambridgeinternational.org/" },
    { title: "Cascais — Educação", url: "https://www.cascais.pt/educacao" },
    { title: "Oeiras — Educação", url: "https://www.oeiras.pt/viver/educacao" },
    { title: "Porto — Educação", url: "https://www.porto.pt/educacao" },
    { title: "Braga — Educação", url: "https://www.cm-braga.pt/pt/101/educacao-e-ensino" },
  ],
  topic_tags: ["school", "portugal"],
  hashtags: buildNoteHashtags({
    topicTags: ["school", "portugal"],
    contentKind: "guide",
    extra: ["школа", "дети", "cascais", "lisboa", "porto", "braga", "ib"],
  }),
  source_channel: "chatlisboa+por_tugal+lepta",
  source_label: "editorial:school-research",
};
