/**
 * Medicina Norte — SNS, private insurance, dentistry (Porto/Braga/Minho).
 * Grok 4.3 structural pass + editorial expand: continuous practical prose,
 * detailed seguro de saúde providers / prices / coverage (2026).
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { formatPracticeTakeaway } from "@/lib/community-notes/practice-format";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const MEDITSINA_NORTE_HEALTHCARE_SLUG = "meditsina-norte-sns-chastnaya-stomatologiya-2026";

const GLOSSARY_INTRO =
  "В centro de saúde, на рецепте и в разговоре с mediador de seguros эти слова звучат чаще цифр. Разберём их до первой записи и до первой simulação полиса.";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(glossaryForSlug(MEDITSINA_NORTE_HEALTHCARE_SLUG)!, GLOSSARY_INTRO),
  },
  {
    heading: "Официально: SNS, utente и первичная помощь",
    section_kind: "official",
    paragraphs: [
      "Государственная медицина в Португалии — это SNS (Serviço Nacional de Saúde). Доступ к участковому врачу и плановым направлениям открывается после inscrição в centro de saúde по morada: вам выдают número de utente — номер пациента. Без NIF, подтверждения адреса и документа легального пребывания (виза / autorização / título) balcão обычно не закрывает регистрацию; EHIC/CESD покрывает лишь краткий визит EU-гражданина и не заменяет utente.",
      "Médico de família (участковый терапевт) — точка входа в систему: осмотр, receita, referenciação к especialista или на exames. Запись идёт через SNS24, приложение MySNS или окошко USF. Taxa moderadora за приём GP — ориентир около €4,50 (таблица ACSS; сверяйте актуальную). При острой боли или лихорадке сначала звоните SNS24 (808 24 24 24): triagem подскажет, ехать ли в urgências или достаточно teleconsulta / USF.",
      "Urgências hospitalares — для реальной неотложки, не для «насморка в пятницу вечером». Без направления GP taxa moderadora выше (ориентир €18–20 по ACSS), но при угрозе жизни отказать не должны. Главное: сначала morada и utente, потом споры про очереди к дерматологу.",
    ],
    bullets: [
      "Соберите NIF + comprovativo de morada + документ резидентства до похода в centro de saúde.",
      "Сохраните SNS24 808 24 24 24 и откройте MySNS / sns24.gov.pt до первой болезни.",
      "При угрозе жизни звоните 112; при «остро, но не ясно» — сначала SNS24.",
      "Уточните taxa moderadora на acss.min-saude.pt — цифры в чатах устаревают.",
      "Сверьте шаги первого месяца: [чеклист](/notes/pervyj-mesyac-portugaliya-checklist) и [регистрация SNS](/notes/sns-registration-changes-2026).",
    ],
  },
  {
    heading: "Частные страховки: провайдеры, цены и покрытие",
    section_kind: "official",
    paragraphs: [
      "Seguro de saúde privado — отдельный продукт от SNS. Для многих D7/D8 полис нужен уже на подачу в консульство или AIMA; после появления utente его часто снижают, но редко отменяют в первый год: специалисты SNS и стоматология всё равно тянут в rede privada. Путать ADSE с Multicare нельзя: ADSE — benefício для funcionários públicos и reformados do Estado; экспату на D8 туда дорога закрыта.",
      "Три имени, которые чаще всего встречаются в симуляциях. Multicare (линейка Fidelidade) — планы 1 / 2 / 3 с разным капиталом internamento (на витрине планов — порядка €25–50 тыс. на базовых ступенях и выше на семейных) плюс ambulatório и опции dental / parto. Médis публикует витринные цены «desde»: около €13/мес за Opção 1 base для 25 лет и около €40/мес за семейный Opção 1 (пара ~30 лет + ребёнок 2 года); при покрытии ambulatório consulta в rede часто около €19, вход в urgência — около €50 (условия конкретной apólice важнее рекламы). Generali Tranquilidade продаёт здоровье с доступом к rede AdvanceCare: на витрине entry-уровни от примерно €7–8/мес в молодых Escalões, усиленные — десятки евро, top — порядка €80+/мес в молодых Escalões при широком пакете. AdvanceCare сама по себе — прежде всего сеть и управление (десятки тысяч prestadores в PT и часть ES), а не «единственный бренд страховки».",
      "Ориентиры поля 2025–2026 (не прайс-лист): базовый индивидуальный полис для молодого здорового взрослого часто попадает в коридор примерно €25–45/мес; полный пакет с ambulatório, dental и maternity для семьи легко уходит в €55–80+ на человека в месяц в зависимости от idade и franquia. Премия растёт с возрастом и с добавлением estomatologia, parto, doenças graves и международного покрытия. Carências типичны: порядка 60 дней на ambulatório и около 90 дней на hospitalização — точные сроки только в IPID и условиях договора. Вне rede convencionada copagamento выше или счёт на 100%; RMN/TAC часто требуют autorização страховщика за 24–72 часа.",
      "Главное: не выбирайте полис по чужому скрину из чата — сделайте simulação на medis.pt, multicare.pt / fidelidade.pt и у mediador Tranquilidade/AdvanceCare на ваш idade и состав семьи, затем сравните capital internamento, лимиты dental и carências.",
    ],
    bullets: [
      "Сравните Multicare (Fidelidade), Médis и Tranquilidade+AdvanceCare на одной таблице: capital, ambulatório, dental, parto, carências.",
      "Запросите 2–3 simulações до подписи — премия зависит от idade и franquia сильнее бренда.",
      "Проверьте rede convencionada в Porto/Braga: CUF, Lusíadas, Trofa, Hospital da Luz.",
      "Не путайте ADSE с частным seguro — ADSE только для госслужбы.",
      "Держите apólice активной, пока нет стабильного médico de família и понятного маршрута к especialistas.",
    ],
  },
  {
    heading: "SNS на практике в Porto, Braga и Minho",
    section_kind: "practice",
    paragraphs: [
      "На бумаге inscrição — «формальность». На месте вы приносите NIF и comprovativo, а окошко просит Atestado de Residência из Junta: в одном USF его принимают как ускоритель, в другом без него откладывают папку. Utente при этом обязаны оформить при полном пакете документов — спор «карта ВНЖ ещё не пришла» часто решается визой/recibo, а не ожиданием пластика месяцами.",
      "Norte не равен Lisboa по очередям в Junta и Finanças: Braga и Guimarães нередко быстрее Porto centro. Но Hospital de Braga в сезон гриппа так же забит, как São João: 4–8 часов в urgências при низком приоритете triagem — обычная жалоба, не редкость. К especialistas через SNS сроки часто измеряются месяцами; triagem по клинической необходимости иногда двигает очередь, но не превращает дерматологию в «на следующей неделе».",
      "При действительно остром случае семьи не ждут GP неделями: звонят SNS24 и параллельно едут в частную urgência, если полис и бюджет позволяют. Главное: SNS — база и экстренный контур; частный полис — скорость к специалисту, а не замена utente.",
    ],
    bullets: [
      "Оформите Atestado в Junta заранее — многие USF его ждут на balcão.",
      "Не откладывайте inscrição «до карты ВНЖ», если уже есть NIF + morada + виза/residência.",
      "Заложите месяцы ожидания especialista SNS в план семьи — не в сюрприз февраля.",
      "При отравлении, травме, высокой температуре — SNS24 + решение ехать в urgências, не форум.",
      "Сверьте климат и астму после сырой квартиры: [климат Norte](/notes/klimat-norte-zhara-vlazhnost-plesen-zima-2026).",
    ],
  },
  {
    heading: "Карта больниц Norte: публичные и частные",
    section_kind: "practice",
    paragraphs: [
      "Зачем эта карта: чтобы ночью не выбирать hospital впервые по рейтингу Google. Публичный контур Grande Porto опирается на Hospital de São João — крупный hospital с urgências 24/7 и широким набором especialidades (метро IPO/São João). Для Matosinhos и Foz ближе Hospital Pedro Hispano. В Minho якорь — Hospital de Braga; Guimarães опирается на Hospital da Senhora da Oliveira; Viana do Castelo — Santa Luzia с дорогой до Porto около часа по A28/A3.",
      "Частный контур для семей с seguro: CUF Porto (несколько clínicas — Boavista, Gaia, Arrábida), Hospital Lusíadas Porto, Trofa Saúde (Maia, Santo Tirso), Hospital da Luz в Braga и Guimarães. Там быстрее consultas и exames, но без apólice или вне rede счёт за urgência и internamento бьёт по бюджету сильнее taxa moderadora SNS.",
      "Главное: заранее знайте два адреса — ближайший public urgências и ближайшая частная rede по вашему полису.",
    ],
    bullets: [
      "Запишите São João и/или Pedro Hispano как public urgências Grande Porto.",
      "Для Braga/Minho держите Hospital de Braga + частную Luz/Trofa по полису.",
      "Проверьте, какие CUF/Lusíadas/Trofa в вашей rede convencionada.",
      "На admissão возьмите cartão de utente, паспорт, apólice и список лекарств.",
      "Детям — отдельно уточните urgência pediátrica (São João / Braga) до кризиса.",
    ],
  },
  {
    heading: "Стоматология: SNS, частная клиника и цены",
    section_kind: "practice",
    paragraphs: [
      "Зубы — слабое место SNS для взрослых. Centro de saúde oral и программы для детей/льготных групп существуют, но импланты, эстетика и большая часть плановой работы уходят в privado. Поэтому dental rider в Multicare/Médis или отдельный бюджет на клинику — не «роскошь», а базовая статья переезда.",
      "Ориентиры Norte 2025–2026: первичный dentista €40–70, limpeza €50–90, obturação €60–120 за зуб; canal часто €250–450, coroa €400–900, implant + coroa €1 200–2 500. Braga нередко на 10–15% ниже Porto при сопоставимом качестве. Острая боль — частная urgência dentária в тот же день за ориентир €80–150; ждать SNS extraction месяцами с флюсом — плохая стратегия.",
      "Главное: читайте cobertura dental в apólice — ortodontia и implantes часто с лимитами или вне базового плана; simulação без вкладки «зубы» обманывает семейный бюджет.",
    ],
    bullets: [
      "Заложите limpeza раз в 6–12 месяцев в семейный бюджет до выбора полиса.",
      "Сверьте dental capital / exclusions в Multicare и Médis до подписи.",
      "При острой боли ищите urgência dentária в тот же день, не очередь SNS.",
      "Сравните Porto vs Braga на 2–3 клиниках — разброс цен реальный.",
      "Детский dentista с RU/EN — через parent-группы школ и Fixando, не через urgências São João.",
    ],
  },
  {
    heading: "Где портал SNS и жизнь расходятся",
    section_kind: "gap",
    paragraphs: [
      "Что пишут в чатах: «SNS онлайн за пять минут», «медицина бесплатная», «Multicare покрывает всё», «в Braga всё быстрее». Что на sns.gov.pt: inscrição при полном пакете документов, taxa moderadora по таблице ACSS, стоматология взрослым почти не в полном спектре. На деле без morada, NIF и иногда Atestado вы занимаете очередь 30–90 минут в Porto centro и уходите со списком «принесите ещё».",
      "Путаница Multicare и ADSE тоже из чатов: ADSE — госслужба, Multicare — частный продукт. Attach к médico de família «за неделю» в перегруженном USF часто оказывается неделями; implantes и ortodontia упираются в лимиты полиса. Braga быстрее в Junta — не значит, что urgências зимой короче.",
      "Главное: портал задаёт правила; очередь, carências и exclusions полиса задают ваш реальный доступ к помощи.",
    ],
    bullets: [
      "Не планируйте неделю жизни вокруг «онлайн SNS за 5 минут» без пакета документов.",
      "Не отменяйте privado в день получения utente — специалисты SNS ещё месяцы.",
      "Не покупайте полис без чтения dental/parto/carências.",
      "Не езжайте в São João с лёгкой простудой — сначала SNS24.",
      "Не ждите ADSE на D8 — её нет для этого статуса.",
    ],
  },
  {
    heading: "Таймлайн первых 60 дней и типичные ошибки",
    section_kind: "practice",
    paragraphs: [
      "Неделя 1: NIF и morada (contrato / Junta). Неделя 2: inscrição в centro de saúde + две-три simulações Multicare / Médis / Tranquilidade. Недели 3–4: attach к médico de família, если дают слот; параллельно профилактика у dentista. К концу второго месяца у семьи должны быть utente, понятный public urgências и работающий privado на специалистов — иначе любая температура превращается в хаос навигации.",
      "Типичные ошибки: ждать пластик ВНЖ для utente; отменить страховку в день inscrição; путать número de utente с «просто SNS на словах»; тащить лёгкий случай в São João на пять часов triagem. Главное: порядок NIF → morada → utente → полис под ваш возраст → стоматолог, а не наоборот.",
    ],
    bullets: [
      "Ошибка: ждать карту ВНЖ, если уже можно пройти inscrição с визой/recibo.",
      "Ошибка: отменять apólice до стабильного GP и понятного маршрута к especialista.",
      "Ошибка: путать «есть SNS» и «есть número de utente после inscrição».",
      "Ошибка: идти в hospital urgências с лёгким случаем без звонка в SNS24.",
      "Сверьте полный чеклист быта: [первый месяц](/notes/pervyj-mesyac-portugaliya-checklist).",
    ],
  },
];

const keyTakeaways = [
  "Сегодня: сохраните номер SNS24 (808 24 24 24), проверьте morada и запишитесь в centro de saúde на número de utente.",
  "Официально: SNS покрывает базу после inscrição; частный seguro — отдельный продукт с carências и rede; ADSE не для expat.",
  formatPracticeTakeaway({
    channels: ["lepta", "chatlisboa"],
    period: "2025–2026",
    claim:
      "к especialistas через SNS часто ждут месяцы, а премия Multicare/Médis для семьи сильно зависит от idade — чужой скрин цены бесполезен",
    forReader:
      "сделайте 2–3 simulações и отдельно заложите стоматологию (€50–90 limpeza; импланты почти всегда privado)",
  }),
  "Расхождение: фраза «SNS бесплатный» скрывает taxa moderadora и почти полное отсутствие взрослой стоматологии; «Multicare покрывает всё» не читает exclusions.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Как получить número de utente в Porto или Braga?",
    a: "Да — через inscrição в centro de saúde по morada. По правилам SNS нужны NIF, comprovativo de morada и документ резидентства. На практике Atestado из Junta ускоряет balcão; utente выдают после attach к USF / оформления в системе, не «по обещанию чата».",
  },
  {
    q: "Куда ехать в urgências в Grande Porto?",
    a: "Два основных: São João (Porto) или Pedro Hispano (Matosinhos). При угрозе жизни — 112. По правилам — ближайший hospital com urgências. На практике при «не экстренно» сначала SNS24: иначе низкий приоритет triagem легко превращается в 4–5 часов ожидания.",
  },
  {
    q: "Нужна ли частная страховка, если есть SNS?",
    a: "Часто да на старте. D7/D8 нередко требуют apólice до/на подачу. По правилам SNS закрывает базу при utente. На практике expat держат Multicare/Médis ради специалистов и dental, пока очереди SNS измеряются месяцами.",
  },
  {
    q: "Сколько стоит частная страховка в месяц?",
    a: "Ориентир, не прайс: базовый план молодого взрослого часто ~€25–45/мес; витрина Médis — от ~€13/мес (25 лет, Opção 1 base); полный семейный пакет легко €55–80+ на человека. Точная премия — только simulação по idade на medis.pt / multicare.pt / Tranquilidade.",
  },
  {
    q: "Multicare, Médis и AdvanceCare — что выбрать?",
    a: "Multicare — линейка Fidelidade (планы 1/2/3). Médis — отдельный бренд с витринными «desde» и фиксированными copagos в rede при ambulatório. AdvanceCare — прежде всего rede/gestora; через неё часто идёт Tranquilidade. Сравнивайте capital, dental, carências и клиники Porto/Braga в rede — не логотип.",
  },
  {
    q: "Multicare и ADSE — это одно и то же?",
    a: "Нет. ADSE — benefício госслужбы (id.gov.pt). Multicare — частный seguro Fidelidade. Expat на D7/D8 ADSE не получает.",
  },
  {
    q: "Сколько стоит стоматолог в Norte?",
    a: "Consulta €40–70, limpeza €50–90, plomb €60–120. По правилам SNS детям/льготникам — centro de saúde oral. На практике взрослым импланты и эстетика — privado; Braga часто на 10–15% дешевле Porto.",
  },
  {
    q: "Что такое internamento и как попасть в hospital SNS?",
    a: "Internamento — стационар. По правилам — через urgências после triagem или с referenciação médico de família/especialista. На практике cartão de utente ускоряет admissão; без него при угрозе жизни примут, но оформление и taxa тяжелее.",
  },
];

export const MEDITSINA_NORTE_HEALTHCARE_GUIDE = {
  slug: MEDITSINA_NORTE_HEALTHCARE_SLUG,
  category: "Здоровье и быт",
  content_kind: "guide" as ContentKind,
  title: "Медицина Norte 2026: SNS, частные страховки и стоматология",
  excerpt:
    "SNS и utente в Porto/Braga, частные Multicare / Médis / AdvanceCare с ориентирами цен и покрытия, urgências São João, стоматология и таймлайн первых 60 дней.",
  seo_title: "Медицина Norte PT 2026: SNS и страховки",
  seo_description:
    "Португалия Norte 2026: SNS utente, Multicare и Médis — цены и покрытие, urgências São João/Braga, стоматология. Практика для релокантов Porto и Minho.",
  quick_answer:
    "Третий день кашля, а к врачу запись через недели — в Португалии Norte это система, не личный заговор. База: centro de saúde по адресу → número de utente → médico de família; экстренное — SNS24 808 24 24 24 и urgências São João/Braga. Параллельно почти все держат seguro de saúde (Multicare, Médis, Tranquilidade+AdvanceCare): специалисты и зубы иначе бьют по срокам и бюджету.",
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
    { title: "Médis — simular", url: "https://www.medis.pt/seguros-de-saude/saude-medis/" },
    { title: "AdvanceCare", url: "https://www.advancecare.pt/para-si" },
    { title: "Generali Tranquilidade Saúde", url: "https://www.generalitranquilidade.pt/particulares/seguros/saude/saude-individual" },
  ],
  topic_tags: ["sns", "portugal"],
  hashtags: buildNoteHashtags({
    topicTags: ["sns", "portugal"],
    contentKind: "guide",
    extra: ["porto", "braga", "norte", "стоматология", "здоровье", "multicare", "medis", "страховка"],
  }),
  source_channel: "chatlisboa+por_tugal+autolife_pt+lepta",
  source_label: "editorial:meditsina-norte+grok-4.3-expand-insurance-2026",
};
