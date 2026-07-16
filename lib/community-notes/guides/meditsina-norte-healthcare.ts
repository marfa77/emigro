/**
 * Hand-curated guide — editorial presentation rules:
 * - quick_answer: 2–3 plain Russian sentences (hook first, jargon later)
 * - key_takeaways: max 4 action items («Что решить сегодня»)
 * - Each section: lead «зачем читать» + max 5 bullets (≤2 lines)
 * See lib/community-notes/editorial-presentation.ts
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { formatPracticeTakeaway } from "@/lib/community-notes/practice-format";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const MEDITSINA_NORTE_HEALTHCARE_SLUG = "meditsina-norte-sns-chastnaya-stomatologiya-2026";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(glossaryForSlug(MEDITSINA_NORTE_HEALTHCARE_SLUG)!),
  },
  {
    heading: "Официально: SNS, utente и первичная помощь",
    section_kind: "official",
    paragraphs: [
      "Зачем читать: чтобы понять, как устроена бесплатная (с доплатами) медицина в Португалии и что нужно для регистрации в Norte.",
    ],
    bullets: [
      "SNS (Serviço Nacional de Saúde) — государственная система; número de utente — ID пациента после inscrição в centro de saúde по morada (sns.gov.pt).",
      "Документы: NIF, comprovativo de morada, autorização de residência / título / виза с правом пребывания; EHIC/CESD — для краткого визита, не заменяет utente.",
      "médico de família — участковый терапевт в USF/centro de saúde; запись через SNS24, MySNS ou balcão; taxa moderadora ≈ €4,50 за приём GP (ACSS, 2025).",
      "SNS24 — 808 24 24 24 и mysns24.sns24.gov.pt: triagem, запись, teleconsulta; при острой боли/лихорадке — звоните до поездки в urgências.",
      "Urgências hospitalares — для экстренных случаев; taxa moderadora ≈ €18–20 при отсутствии направления médico de família (ACSS).",
    ],
  },
  {
    heading: "Официально: частная медицина, Multicare и ADSE",
    section_kind: "official",
    paragraphs: [
      "Зачем читать: D7/D8 и многие релоканты держат частную страховку параллельно с SNS — важно не путать продукты.",
    ],
    bullets: [
      "Seguro de saúde privado (Multicare, Médis, Tranquilidade и др.) — покрывает clínicas/hospitais privados; условия по визе D7/D8 часто требуют полис до/параллельно SNS.",
      "Multicare — линейка Fidelidade; план Multicare 3 популярен у семей (ambulatório + hospitalização); цена зависит от idade и franquia.",
      "ADSE — benefício для funcionários públicos и пенсионеров госсектора; expat без contrato público ADSE не получает — не путать с Multicare.",
      "Rede convencionada — список клиник по договору со страховщиком; вне сети — copagamento выше или 100% из кармана.",
      "CUF, Lusíadas, Hospital da Luz — крупные частные сети с unidades в Porto, Braga, Guimarães; запись онлайн или по телефону.",
    ],
  },
  {
    heading: "SNS на практике в Porto, Braga и Minho",
    section_kind: "practice",
    paragraphs: [
      "Зачем читать: как реально записаться, ждать и пользоваться госмедициной на севере — по опыту чатов 2025–2026.",
    ],
    bullets: [
      "Inscrição: centro de saúde по morada (USF Porto Ocidental, USF Braga, USF Guimarães и др.); Atestado de Residência в Junta — 3–14 дней, без него часть balcões откладывают, но utente обязаны выдать (por_tugal, 2025).",
      "Norte vs Lisboa: очереди в Finanças/Junta в Braga/Guimarães часто короче; SNS-регистрация по тому же правилу — morada определяет centro de saúde.",
      "Дефицит персонала: участники @lepta в 2025 писали, что SNS не хватает ~14 000 enfermeiros; очереди к especialistas реальны, не «миф чата».",
      "Специалисты: участники @lepta в 2025 отмечали, что вместо чисто хронологической очереди вводят triagem по клинической необходимости; сроки по-прежнему месяцы на ортопедию/дерматологию.",
      "Острые случаи: por_tugal (2025-10) — при отравлении у подростка семья параллельно звонила SNS24 и ехала в частную urgência, не дожидаясь médico de família.",
      "Первый месяц: чеклист utente + NIF + morada — в [первый месяц в Португалии](/notes/pervyj-mesyac-portugaliya-checklist); изменения правил SNS — [регистрация SNS 2026](/notes/sns-registration-changes-2026).",
    ],
  },
  {
    heading: "Карта больниц Norte: публичные и частные",
    section_kind: "practice",
    paragraphs: [
      "Зачем читать: куда ехать при urgência и где частная клиника рядом с домом в Grande Porto и Minho.",
    ],
    bullets: [
      "Hospital de São João (Porto) — крупнейший госпиталь Norte, urgências 24/7, все especialidades; метро IPO/São João.",
      "Hospital Pedro Hispano (Matosinhos) — urgências для побережья; близко Foz/Matosinhos expat-районам.",
      "Hospital de Braga — главный госпиталь Braga/Minho interior; urgências и internamento.",
      "Hospital da Senhora da Oliveira (Guimarães) — USF Guimarães направляет сюда сложные случаи.",
      "Hospital de Santa Luzia (Viana do Castelo) — опора Minho litoral; до Porto ~45–60 мин по A28/A3.",
      "CUF Porto — несколько clínicas (Boavista, Gaia, Arrábida); exames, consultas, cirurgia ambulatória.",
      "Hospital Lusíadas Porto — частный hospital с urgências convencionadas; рядом с Hospital da Prelada.",
      "Hospital da Luz Braga / Guimarães — частные urgências и maternidade в Minho.",
      "Trofa Saúde (Maia, Santo Tirso) — частная сеть с urgências и internamento; популярна у семей в Grande Porto.",
    ],
  },
  {
    heading: "Госпитализация: от urgências до internamento",
    section_kind: "practice",
    paragraphs: [
      "Пятница, полночь, São João: вы между triagem и результатом анализов и не знаете, оставят на ночь или отпустят домой. Разница centro de saúde / hospital и путь к internamento лучше понять заранее.",
      "Что делать: при угрозе жизни — 112; при острой боли — SNS24 (808 24 24 24), затем urgências ближайшего hospital; плановую операцию или отделение — только с referenciação от médico de família или especialista SNS.",
      "Зачем: без utente и referenciação taxa moderadora в urgências выше; «не экстренный» случай — 5+ часов triagem; частный internamento без seguro — €800–2 500/сутки только за палату.",
      "Главное: на admissão имейте cartão de utente, паспорт, apólice seguro и список лекарств — это ускоряет оформление и снижает copagamento.",
    ],
    bullets: [
      "Centro de saúde — ambulatório: GP, exames, referenciação; hospital urgências — triagem → tratamento или internamento; плановый internamento — com направлением médico de família.",
      "Referenciação vs emergência: без направления в urgências taxa moderadora ≈ €18–20 (ACSS), но при реальной угрозе не откажут; насморк и лёгкая боль — низкий приоритет triagem.",
      "Частные CUF, Lusíadas, Trofa Saúde, Hospital da Luz — когда очередь SNS месяцы, нужен parto по договору или семья параллельно едет в частную urgência, не дожидаясь GP.",
      "Страховка и документы: utente SNS — internamento для residentes с низкой taxa moderadora; Multicare hospitalização — rede convencionada, autorização 24–72 ч на cirurgia; ADSE — только госсектор; туристы EU — EHIC/CESD на экстренное, не заменяет utente. На admissão: cartão de utente, BI/passaporte, título, apólice, alergias; детям — caderneta de vacinas.",
      "Язык и pediatria/maternidade: госпитальные urgências Norte — в основном португальский; частные — английский на ресепшене; urgência pediátrica — São João, Braga; maternidade — São João, Senhora da Oliveira (Guimarães) или частная Hospital da Luz; регистрация utente — [SNS 2026](/notes/sns-registration-changes-2026), [первый месяц](/notes/pervyj-mesyac-portugaliya-checklist).",
    ],
  },
  {
    heading: "Стоматология: SNS, частная и типичные цены",
    section_kind: "practice",
    paragraphs: [
      "Зачем читать: зубы — слабое место SNS; большинство expat идут в частную стоматологию, но есть нюансы.",
    ],
    bullets: [
      "SNS dental: centro de saúde oral / программы для детей и льготных групп; взрослым полный спектр (импланты, эстетика) — почти всегда privado.",
      "Частная consulta dentista — €40–70 первичный приём; higiene oral (limpeza) €50–90; obturação (пломба) €60–120 за зуб.",
      "Canal / coroa — €250–450 канал, coroa €400–900; implant + coroa €1 200–2 500; цены Porto ≈ Lisboa, Braga на 10–15% ниже.",
      "chatlisboa (2025-05): ATESTADO MÉDICO для обмена прав — можно в стomatologia, ≈ €35, e-mail справки + регистрация в IMT.",
      "Детский dentista: chatlisboa (2025-07) — спрос на RU/EN детского стоматолога; в Norte ищите через CLIB/OBS parent groups или Fixando.",
      "Очереди SNS dental: для детей и extractions иногда месяцы; с болью — частная urgência dentária €80–150 в тот же день.",
      "Multicare dental: не все планы покрывают ortodontia/implantes; читайте cobertura — chatlisboa (2025-06) спрашивали годовую котировку Multicare 3 для семьи.",
    ],
  },
  {
    heading: "Multicare, ADSE и когда платить из кармана",
    section_kind: "practice",
    paragraphs: [
      "Зачем читать: выбрать страховку до отказа от частной клиники и не переплатить за дублирующее покрытие.",
    ],
    bullets: [
      "Multicare 3 (семья): chatlisboa (2025-06) — годовая премия сильно зависит от idade детей и родителей; запросите simulação у 2–3 mediadores до подписи.",
      "D7/D8: apólice часто нужна на подачу/consulado; после utente SNS можно снизить план, но не отменяйте до стабильного GP.",
      "ADSE: только для trabalhadores/ reformados do Estado; expat на D8 не eligible — не тратьте время на «как получить ADSE».",
      "Copagamento: даже с Multicare franquia €15–50 за consulta; exames (RMN, TAC) — предварительное autorização страховщика 24–72 ч.",
      "Без страховки: consulta privada GP €60–100, pediatra €70–120; urgências CUF/Lusíadas €90–150 triagem + exames отдельно.",
      "Receita médica: в SNS аптека (farmácia) с taxa reduzida; частный receituário — полная цена лекарств, но быстрее при редких препаратах.",
    ],
  },
  {
    heading: "Где портал SNS и жизнь расходятся",
    section_kind: "gap",
    paragraphs: [
      "Зачем читать: типичные расхождения между sns.gov.pt и тем, что пишут релоканты в Norte.",
    ],
    bullets: [
      "Портал: «inscrição online за 5 минут» → на деле нужны morada, NIF и иногда Atestado; в Porto centro balcão — очередь 30–90 мин.",
      "В чатах релокантов часто пишут «SNS бесплатный», но на практике taxa moderadora €4,50–20 за визит + лекарства; стоматология взрослым почти всегда paid.",
      "В чатах путают Multicare и ADSE — разные системы; ADSE только госслужба, Multicare — частный seguro для всех.",
      "SNS: «médico de família за неделю» → в USF перегруженных Porto/Braga attach 2–8 недель; без GP urgências дороже.",
      "Страховка: «Multicare покрывает всё» → implantes, ortodontia, психотерапия часто с limites; simulação обязательна.",
      "Norte: «в Braga всё быстрее» → Junta/Finanças да, но Hospital de Braga urgências в сезон гриппа — 4–8 ч ожидания.",
    ],
  },
  {
    heading: "Таймлайн для новичка и типичные ошибки",
    section_kind: "practice",
    paragraphs: [
      "Зачем читать: порядок шагов в первые 60 дней и ошибки, которые повторяются в чатах @chatlisboa и @por_tugal.",
    ],
    bullets: [
      "Ошибка: ждать карту ВНЖ для utente — можно с NIF + morada + виза/residência; откладывание = нет GP при болезни.",
      "Ошибка: ехать в São João urgências с насмorkом — triagem низкий приоритет, 5+ часов; сначала SNS24 или USF.",
      "Ошибка: отменить частную страховку сразу после utente — специалисты SNS месяцы; Multicare пригодится на exames.",
      "Ошибка: путать SNS и utente в документах — правильно «número de utente do SNS» после inscrição в centro de saúde.",
      "Таймлайн: неделя 1 — NIF + morada; неделя 2 — inscrição centro de saúde + simulação Multicare; неделя 3–4 — attach médico de família, стоматолог profilaxia.",
      "Humidade/bolor: при астме после сырой квартиры — SNS24; профилактика жилья — [климат Norte](/notes/klimat-norte-zhara-vlazhnost-plesen-zima-2026).",
    ],
  },
];

const keyTakeaways = [
  "Сегодня: проверьте morada → запишитесь в centro de saúde → сохраните SNS24 808 24 24 24 в телефоне.",
  "Официально: utente после inscrição в centro de saúde; urgências → triagem → internamento; referenciação от GP для плановой госпитализации; taxa moderadora по ACSS.",
  formatPracticeTakeaway({
    channels: ["lepta", "chatlisboa"],
    period: "2025–2026",
    claim:
      "очередь к especialistas (узким врачам) через SNS часто занимает месяцы, а частная страховка Multicare 3 для семьи сильно зависит от возраста (idade) — цену нужно запрашивать индивидуально",
    forReader:
      "заложите simulação у 2–3 посредников до отказа от частной клиники; стоматология (зубы) для взрослых в SNS почти не покрывается — чистка (limpeza) в частной клинике ≈ €50–90",
  }),
  "Расхождение: «SNS бесплатный» — доплаты и почти нет adult dental; ADSE не для expat, только funcionários públicos.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Как получить número de utente в Porto или Braga?",
    a: "Да, через inscrição в centro de saúde по morada. По правилам SNS нужны NIF, comprovativo de morada и документ резидентства. На практике Atestado de Residência из Junta ускоряет приём; utente выдают в balcão или через MySNS после attach к USF.",
  },
  {
    q: "Куда ехать в urgências в Grande Porto?",
    a: "São João (Porto) или Pedro Hispano (Matosinhos). При угрозе жизни — 112. По правилам SNS — ближайший hospital com urgências. На практике при «не экстренно» сначала SNS24 — направят в USF или скажут, ждать ли urgências 4+ часа.",
  },
  {
    q: "Нужна ли частная страховка, если есть SNS?",
    a: "Зависит от визы и терпения. D7/D8 часто требуют apólice до utente. По правилам SNS покрывает основное при utente. На практике expat держат Multicare для especialistas и стomatologia; chatlisboa (2025-06) сравнивали Multicare 3 — цена индивидуальна.",
  },
  {
    q: "Сколько стоит стomatolog частный в Norte?",
    a: "Consulta €40–70, limpeza €50–90, plomb €60–120. По правилам SNS детям и льготникам — centro de saúde oral. На практике взрослым импланты и эстетика только privado; Braga на 10–15% дешевле Porto.",
  },
  {
    q: "Что такое internamento и как попасть в госпиталь SNS?",
    a: "Internamento — стационар в hospital. По правилам SNS — через urgências после triagem или с referenciação médico de família/especialista. На практике в São João/Braga без utente примут при экстренной угрозе, но taxa выше; cartão de utente ускоряет admissão.",
  },
  {
    q: "Сколько стоит госпитализация в частном hospital Norte?",
    a: "Палата €800–2 500/сутки без cirurgia; triagem urgências €90–150 + exames отдельно. С Multicare — copagamento по плану после autorização. По правилам SNS resident с utente платит taxa moderadora, не полный счёт за экстренный internamento.",
  },
  {
    q: "Multicare и ADSE — это одно и то же?",
    a: "Нет. ADSE — benefício для funcionários públicos (id.gov.pt). Multicare — частный seguro Fidelidade для всех. Expat на D8 ADSE не получает; для семьи смотрят Multicare, Médis или Allianz.",
  },
  {
    q: "Что делать при острой боли, если нет médico de família?",
    a: "Звоните SNS24 (808 24 24 24). По правилам направят в urgências или teleconsulta. На практике por_tugal (2025-10) при отравлении не ждали GP — параллельно частная urgência; для зубной боли — dentista urgência €80–150 в тот же день.",
  },
];

export const MEDITSINA_NORTE_HEALTHCARE_GUIDE = {
  slug: MEDITSINA_NORTE_HEALTHCARE_SLUG,
  category: "Здоровье и быт",
  content_kind: "guide" as ContentKind,
  title: "Медицина Norte 2026: SNS, частные клиники и стоматология в Порту, Браге и Minho",
  excerpt:
    "Госпитализация SNS и частных hospital, São João и Braga, utente, referenciação, Multicare vs ADSE, CUF/Lusíadas/Trofa, стоматология и urgências — практический гайд для релокантов на севере Португалии.",
  seo_title: "Медицина Norte PT 2026 — SNS, стomatologia",
  seo_description:
    "Гайд Norte 2026: SNS utente, госпитализация internamento, urgências São João/Braga, referenciação, Multicare, частные CUF/Lusíadas, стоматология €.",
  quick_answer:
    "Третий день кашля, а врач записывает через три недели — знакомая картина в Norte. Базовая медицина здесь через SNS: centro de saúde по адресу → número de utente → médico de família. Экстренные — urgências в São João или Braga; SNS24 — 808 24 24 24. Стоматология почти всегда частная (€50–90 за чистку).",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "SNS — Serviço Nacional de Saúde", url: "https://www.sns.gov.pt/" },
    { title: "SNS24", url: "https://www.sns24.gov.pt/" },
    { title: "ACSS — taxas moderadoras", url: "https://www.acss.min-saude.pt/" },
    { title: "Hospital de São João (Porto)", url: "https://portal-chsj.min-saude.pt/" },
    { title: "Hospital de Braga", url: "https://www.hospitaldebraga.pt/" },
    { title: "CUF Porto", url: "https://www.cuf.pt/hospitais-e-clinicas/cuf-porto" },
    { title: "Hospital Lusíadas Porto", url: "https://www.lusiadas.pt/pt/hospitais-e-clinicas/hospital-lusiadas-porto" },
    { title: "Multicare (Fidelidade)", url: "https://www.multicare.pt/" },
  ],
  topic_tags: ["sns", "portugal"],
  hashtags: buildNoteHashtags({
    topicTags: ["sns", "portugal"],
    contentKind: "guide",
    extra: ["porto", "braga", "norte", "matosinhos", "guimarães", "стоматология", "здоровье", "multicare"],
  }),
  source_channel: "chatlisboa+por_tugal+autolife_pt+lepta",
  source_label: "editorial:meditsina-norte",
};
