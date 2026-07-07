import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const INTERNATIONAL_SCHOOLS_GUIDE_SLUG = "mezhdunarodnye-shkoly-portugaliya-2026";

const bodySections: NoteBodySection[] = [
  {
    heading: "Три дорожки: pública, privada и internacional",
    section_kind: "official",
    paragraphs: [
      "В Португалии дети с 6 лет обязаны учиться (ensino básico). Для семьи релоканта выбор — не только «английская школа», а три разных системы с разными правилами поступления и стоимостью.",
      "Государственная escola pública бесплатна при наличии места в agrupamento по адресу проживания. Частная portuguesa (colégio privado) учит по национальной программе MEC. International school — отдельный сегмент: British, American, IB, French, German; аккредитация Cambridge/IB/neasc и т.д.",
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
      "Официальная запись в público идёт через местную структуру образования (SED / agrupamento escolar). International schools работают по своим регламентам, но почти всегда просят подтверждение легального пребывания семьи в Португалии.",
    ],
    bullets: [
      "NIF ребёнка и родителя — нужен для matrícula и договора (Finanças / Loja de Cidadão).",
      "Comprovativo de morada: договор arrendamento с registo na Finanças или справка freguesia.",
      "Autorização de residência / D-visa + AIMA appointment — для подтверждения легального статуса (требование зависит от школы).",
      "Boletim / transcripts: перевод на PT или EN; для IB/British — часто достаточно английского отчёта.",
      "Calendário vacinação (Plano Nacional de Vacinação) — сверка с SNS; прививки можно донести после зачисления.",
      "Para requerer vaga em público: заявка в agrupamento до дедлайна SED (обычно весна на сентябрь).",
    ],
  },
  {
    heading: "Как выбрать: international vs portuguesa",
    section_kind: "practice",
    paragraphs: [
      "В чатах релокантов (@por_tugal, @chatlisboa) спор сводится к горизонту: «переходный год на английском» vs «сразу в локальную систему ради интеграции и экономии». В Norte (Порту, Брага) expat-семьи чаще селятся в Foz, Boavista, Matosinhos или Gualtar — оба пути рабочие, если заранее понятен бюджет и район.",
    ],
    bullets: [
      "International — если переезд на 2–4 года, ребёнок старше 10–12 лет или нужен IB/A-Levels/AP для университета за рубежом.",
      "Escola pública / privada PT — если планируете жить долго, важен португальский и местный круг; бюджет ограничен.",
      "Гибрид: 1–2 года international + португальский репетитор, затем transfer в privada PT — частый сценарий в Кашкайше/Синтре.",
      "Смотрите commute: St Julian's / IPS — Cascais line; Oeiras International — Oeiras; Carlucci — Belém/Ajuda; в Порту — OBS/CLIP в Foz/Boavista; в Браге — CLIB в Gualtar.",
      "Стоимость international 2026: ориентир €9 000–22 000/год + enrollment €500–3 000 + автобус/питание; в Norte British/IB чуть ниже Lisboa, LFIP/Deutsche Schule — от €5k.",
      "Проверяйте аккредитацию: Cambridge, IB World School, NEASC, CIS — влияет на признание аттестата в EU/UK/US.",
    ],
  },
  {
    heading: "Лиссабон и linha de Cascais: куда смотреть",
    section_kind: "practice",
    paragraphs: [
      "Большинство русскоязычных семей концентрируются в Cascais, Oeiras, Sintra, Lisbon (Belém, Restelo, Parque das Nações). Ниже — ориентиры, не рейтинг: состав классов и waiting list меняются ежегодно.",
    ],
    bullets: [
      "St. Julian's School (Carcavelos) — British, сильная репутация, высокий спрос, ранний application.",
      "International Preparatory School / IPS (Cascais) — primary, British, компактные классы.",
      "Oeiras International School — IB continuum, популярен у семей в Oeiras/Queijas.",
      "Carlucci American International School (Lisbon) — American + IB options, крупный кампус.",
      "United Lisbon International School — новый кампус, IB, Parque das Nações / центр.",
      "Astoria International School (Sintra/Cascais) — несколько кампусов, British/IB blend.",
      "King's College School Cascais — British, растущий кампус на линии к морю.",
      "Lycée Français Charles Lepierre (Lisbon) — French national curriculum, для франкофонов.",
      "Deutsche Schule Lissabon — немецкий Abitur track, Alvalade.",
      "St. Dominic's International School (Odivelas) — IB, севернее центра.",
    ],
  },
  {
    heading: "Порту: OBS, CLIP и french/german track",
    section_kind: "practice",
    paragraphs: [
      "В Порту четыре устоявшихся international schools; большинство expat-семей с детьми селятся в Foz do Douro, Boavista или Matosinhos — commute 10–20 минут до кампусов. Правила поступления те же: NIF ребёнка, morada, transcripts; matrícula в público — через SED/GEC do concelho do Porto.",
    ],
    bullets: [
      "Oporto British School (OBS, Foz) — British National Curriculum, IGCSE, IB Diploma; старейшая British school в континентальной Европе (с 1894), COBIS/CIS; €9 700–17 300/год, высокий спрос на Year 7.",
      "CLIP — Colégio Luso-Internacional do Porto (Boavista/Aldoar) — крупнейшая в городе (~1 000 учеников), Cambridge IGCSE/A-Levels и IB Diploma; €9 100–15 200/год, сильная международная среда.",
      "Lycée Français International de Porto (LFIP, Foz) — French national curriculum, сеть AEFE; €5 100–6 200/год (французские граждане — субсидии), Baccalauréat.",
      "Deutsche Schule zu Porto (Foz) — German Abitur / DSD, bilingual DE–PT; субсидированные fees ~€5 000–10 000/год, логичный выбор для семей из DACH.",
      "Escola pública no Porto: agrupamento по адресу через GEC Porto; очередь в Foz/Matosinhos, но мягче, чем Cascais — чаще находят место в соседнем agrupamento.",
      "Waiting list OBS/CLIP: подавайте за 9–12 месяцев; mid-year entry возможен в младших классах, Year 7/IB DP — самый конкурентный.",
      "Стоимость жизни и аренда в Foz/Boavista ниже Lisboa/Cascais на 15–25%; школьный автобус €80–200/мес в зависимости от района.",
    ],
  },
  {
    heading: "Брага и Minho: CLIB и соседние варианты",
    section_kind: "practice",
    paragraphs: [
      "В Браге и долине Minho один полноценный British international school — CLIB (Braga International School). Expat-сообщество меньше, чем в Lisboa/Porto; семьи из Guimarães, Viana do Castelo и даже Vila Real часто выбирают CLIB или ездят в Porto (CLIP/OBS) 45–60 минут.",
    ],
    bullets: [
      "CLIB — Colégio Luso-Internacional de Braga (Gualtar) — British National Curriculum, Cambridge IGCSE и AICE Diploma; 3–18 лет, английский язык обучения; admission через assessment + interview.",
      "Fees CLIB не публикуются на сайте — запрашивайте у admissions; ориентир семей €7 000–12 000/год (ниже Lisboa, уточняйте актуальный schedule).",
      "Классы до ~25–27 учеников; EAL-поддержка, school bus — уточняйте маршруты под ваш район (Braga centro, Esposende, Guimarães).",
      "Альтернатива при заполненном CLIB: CLIP/OBS в Porto с commute по A3/A7; часть семей год в CLIB, затем transfer в Porto для secundário/IB.",
      "Escola pública в Braga/Guimarães: matrícula через agrupamento местного concelho — те же NIF, morada, vacinação; на практике vaga находят быстрее, чем в Lisboa.",
      "Colégio privado PT в Braga (национальная программа MEC) — бюджетный вариант для долгосрочной интеграции; португальский с нуля + репетитор.",
      "Сроки: CLIB принимает круглый год при наличии мест; popular year groups — лучше contact за 6–9 месяцев до сентября.",
    ],
  },
  {
    heading: "Где портал и реальность расходятся",
    section_kind: "gap",
    bullets: [
      "SED: «место по адресу» → в Lisboa/Cascais в popular agrupamentos очередь; иногда направляют в соседнюю escola.",
      "Сайт школы: «places available» → на практике waiting list на 6–18 месяцев по классам; Year 7 / Grade 6 — самый конкурентный.",
      "Требование ВНЖ: формально D-visa + AIMA appointment часто достаточно для provisional enrollment; без NIF matrícula не закроют.",
      "«Свободный перевод оценок» → international просят notarized translation + иногда apostille на предыдущий отчёт.",
      "Португальский «не нужен» в international → на практике PT lessons обязательны с 1 класса; без языка сложнее в быту и при transfer в público.",
      "Школьный год сентябрь–июнь → mid-year entry возможен, но выбор предметов и дружеский круг уже сформированы.",
      "SED Porto/Braga: «свободные места в agrupamento» → в Foz и Gualtar популярные школы заполняются к июню; иногда предлагают соседний agrupamento в Matosinhos или Guimarães.",
      "CLIP/OBS сайт: «admissions open» → Year 7 и IB DP часто закрыты за 9–12 месяцев; LFIP и Deutsche Schule — мягче, но French/German track требует языка.",
      "CLIB «fees on request» → на практике бюджет ниже Lisboa, но enrollment и bus — отдельно; сравнивайте полный package, а не только tuition.",
    ],
  },
  {
    heading: "Таймлайн поступления и типичные ошибки",
    section_kind: "practice",
    paragraphs: [
      "Оптимально начинать за 9–12 месяцев до сентября: open days в феврале–марте, assessment весной, контракт и депозит до лета. Для público — следите за calendário matrículas вашего concelho.",
    ],
    bullets: [
      "Ошибка: аренда без проверки catchment público / commute до выбранной international.",
      "Ошибка: один NIF только у родителя — оформите NIF ребёнку до application deadline.",
      "Ошибка: ждать ВНЖ в пластике — многие школы зачисляют по D-visa + AIMA receipt, но уточняйте письменно.",
      "Ошибка: не готовить transcripts — запросите apostilled report из текущей школы заранее (2–8 недель).",
      "Ошибка: игнорировать PT — даже в British school ребёнку нужен базовый португальский для SNS, кружков, местных друзей.",
      "Ошибка: не закладывать bus fee — школьный автобус €100–250/мес в зависимости от расстояния.",
      "Ошибка: перевод ребёнка в 11–12 классе без сверки эквивалентности предметов для IB Diploma / A-Levels.",
    ],
  },
];

const keyTakeaways = [
  "Официально: ensino obrigatório с 6 лет; público бесплатна при наличии vaga в agrupamento по адресу.",
  "На практике: international schools — прямой договор, waiting list 6–18 мес., бюджет €9k–22k/год.",
  "Официально: для matrícula нужны NIF, morada, vacinação и документы о предыдущем обучении.",
  "На практике: многие школы зачисляют по D-visa + AIMA appointment до карты ВНЖ — уточняйте у admissions.",
  "Расхождение: «английская школа без португальского» — на деле PT уроки обязательны; для público без языка будет тяжело.",
  "На практике: подавайте заявки за 9–12 месяцев до сентября; open days — февраль–март.",
  "На практике: в Порту семьи с детьми селятся в Foz/Boavista/Matosinhos — OBS, CLIP, LFIP и Deutsche Schule в 10–20 мин.",
  "Официально: matrícula в agrupamento do Norte (Porto, Braga) — те же NIF, morada и calendário SED concelho, что и в Lisboa.",
  "На практике: в Браге основной international — CLIB; при нехватке мест семьи ездят в Porto (CLIP/OBS) или берут público/privada PT.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Можно ли поступить в international school без ВНЖ?",
    a: "По правилам школы обычно нужен легальный статус: D-visa + запись AIMA или ВНЖ. На практике часть школ даёт conditional place по паспорту и proof of relocation, но NIF и morada всё равно понадобятся до начала занятий.",
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
    "В Португалии три дорожки: бесплатная escola pública по адресу, colégio privado с национальной программой и international schools (British, IB, American, French, German). Для поступления нужны NIF ребёнка, morada и school reports; international — прямой контракт, €9k–22k/год, заявки за 9–12 месяцев до сентября. В Norte: Porto — OBS, CLIP, LFIP, Deutsche Schule; Braga — CLIB. В Lisboa/Cascais — St Julian's, IPS, Oeiras International. Matrícula в público do Norte по тем же правилам; многие школы зачисляют по D-visa до пластика ВНЖ.",
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
