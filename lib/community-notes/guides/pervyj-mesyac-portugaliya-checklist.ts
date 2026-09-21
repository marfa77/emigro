/**
 * Hand-curated Portugal guide — Grok 4.3 rewrite + editorial apply (2026-09-21).
 * Continuous practical prose; no «Что делать:/Зачем читать:» telegraph.
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const PERVYJ_MESYAC_CHECKLIST_SLUG = "pervyj-mesyac-portugaliya-checklist";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(glossaryForSlug(PERVYJ_MESYAC_CHECKLIST_SLUG)!),
  },
  {
    heading: "Официальный порядок ARI, NIF, morada и SNS",
    section_kind: "official",
    paragraphs: [
      "Семья из трёх человек закрывает базовый набор документов: налоговый номер, адрес, доступ к медицине и статус ARI. Без NIF и comprovativo de morada не откроешь счёт в банке и не подашь matrícula в школу. Без отслеживания Portal ARI легко пропустить biometria. Жёсткие правила ARI публикует только aima.gov.pt, а ниже — практический каркас первых недель.",
    ],
    bullets: [
      "Получите NIF в Autoridade Tributária или через Portal das Finanças — один номер на человека на всю страну.",
      "Зафиксируйте comprovativo de morada через contrato de arrendamento с registo, Atestado de Residência в Junta или другой документ, который принимает balcão.",
      "Зарегистрируйтесь в centro de saúde по адресу и получите número de utente SNS.",
      "Ведите весь процесс ARI, включая DUC и agendamento, через Portal ARI, а не по общему маршруту D7.",
      "Храните PDF паспортов, título или comprovativo pedido, NIF и recibos — их часто запрашивают повторно.",
    ],
  },
  {
    heading: "Подготовка до прилёта",
    section_kind: "action_guide",
    paragraphs: [
      "До вылета соберите цифровую и бумажную папку на каждого члена семьи и забронируйте temporary жильё рядом с shortlist школ. Подтвердите аренду авто в аэропорту OPO с детским креслом. В первые 72 часа не хочется искать, где получить NIF ребёнка или какая школа ещё принимает в сентябре. Школа и временный адрес важнее поиска «идеальной» T3 на долгий срок.",
    ],
    bullets: [
      "Соберите на каждого загранпаспорт, título ARI или comprovativo pedido, NIF при наличии и страховку на первые недели.",
      "Добавьте на ребёнка свидетельство о рождении с apostille и переводом, табели, caderneta de vacinação и 2–4 фото.",
      "Составьте shortlist из двух-трёх международных школ и запросите admissions checklist.",
      "Забронируйте temporary на 2–4 недели в зоне commute до shortlist.",
      "Подтвердите rent-a-car с full-to-full, детским креслом и Via Verde.",
    ],
  },
  {
    heading: "Дни 1–3 после прилёта",
    section_kind: "practice",
    paragraphs: [
      "Заберите авто в OPO, доезжайте до temporary адреса и активируйте связь. Закройте NIF, если его ещё нет. Без номера и адреса для корреспонденции школа, Finanças и банк встанут. Via Verde на A3 и A28 убережёт от поздних и дорогих счетов за portagens. Первые три дня — это логистика семьи, а не попытка закрыть всю бюрократию сразу.",
    ],
    bullets: [
      "Проверьте авто на повреждения по фото и активируйте Via Verde или EasyToll.",
      "Доехайте сразу в Porto или Braga, не ночуя в Lisboa ради AIMA.",
      "Купите eSIM или SIM на взрослых, ребёнку — только по запросу школы.",
      "Получите NIF в Finanças или Loja do Cidadão на всех троих.",
      "Зафиксируйте temporary morada и сфотографируйте акт приёма жилья.",
    ],
  },
  {
    heading: "Неделя 1: школа в приоритете",
    section_kind: "action_guide",
    paragraphs: [
      "Запишитесь на visit и open day в 1–2 школы из shortlist. Подайте пакет документов параллельно с обновлением morada fiscal и открытием счёта. Waiting list на Year 7 в Porto часто тянется 6–12 месяцев, поэтому откладывать школу ради банка — частая ошибка. Школа, comprovativo de morada и банк идут именно в таком порядке.",
    ],
    bullets: [
      "Посетите школы в первые три рабочих дня с transcripts, vacinas, NIF ребёнка и паспортами родителей.",
      "Подайте enrollment или waiting list с temporary или long-term адресом.",
      "Обновите morada на Portal das Finanças и при необходимости получите Atestado de Residência в Junta.",
      "Откройте или активируйте счёт в португальском банке по NIF, паспорту и morada.",
      "Не вносите caução за долгосрочную аренду до проверки contrato адвокатом.",
    ],
  },
  {
    heading: "Неделя 2: SNS, ARI и коммунальные услуги",
    section_kind: "practice",
    paragraphs: [
      "Зарегистрируйтесь в centro de saúde по адресу и получите utente SNS. Сверьте статус ARI с адвокатом и подключите eletricidade, água и интернет на имя арендатора. Ребёнок без номера пациента SNS рискует платить полный счёт в urgências, а пропуск biometria стоит дороже любой сделки с арендой. Здоровье и статус проживания идут на той же неделе, что и Wi-Fi.",
    ],
    bullets: [
      "Запишитесь в centro de saúde или USF по morada с NIF и comprovativo.",
      "Держите частную страховку активной до появления médico de família.",
      "Сверьте Portal ARI, agendamento Loja AIMA и biometria с advogado.",
      "Подключите электричество, воду и fibra по покрытию адреса.",
      "Сохраните все recibos и comprovativo pedido ARI.",
    ],
  },
  {
    heading: "Недели 3–4: долгосрочное жильё и машина",
    section_kind: "practice",
    paragraphs: [
      "Переходите с temporary на contrato от 12 месяцев рядом со школой. Решите, оставлять ли арендованную машину или покупать свою. К концу месяца у семьи должен быть стабильный адрес, понятный commute и план по авто. Школа и morada стоят выше покупки квартиры «навсегда».",
    ],
    bullets: [
      "Подпишите long-term T2 или T3 с registo в Finanças.",
      "Проверьте жильё на humidade и bolor и составьте acta de entrada с фото.",
      "Сравните продление аренды, покупку или импорт авто.",
      "Если рассматриваете покупку, пройдите CPCV и escritura по правилам Norte.",
      "Отметьте срок действия título и горизонт продления ARI.",
    ],
  },
  {
    heading: "Porto или Braga: что выбрать",
    section_kind: "practice",
    paragraphs: [
      "Базу на первые 30 дней выбирают от школы и commute, а не от вида на Ribeira. Одна международная школа в Braga против нескольких треков в Porto определяет район, бюджет T2 и километраж на машине. Сначала школа, потом город.",
    ],
    bullets: [
      "В Porto temporary размещают в Foz, Boavista или Matosinhos ближе к OBS, CLIP и LFIP.",
      "В Braga temporary выбирают centro или Gualtar ближе к CLIB, а A3 до Porto занимает 45–60 минут.",
      "Педиатрическая urgência — São João в Porto или Hospital de Braga.",
      "Климат в обоих городах сырой зимой, поэтому проверка bolor важнее вида.",
      "Бюджеты аренды в Foz и Gualtar различаются, сравнение — в отдельном гайде.",
    ],
  },
  {
    heading: "Чем ARI отличается от D7 и D8",
    section_kind: "gap",
    paragraphs: [
      "Семья идёт по маршруту Portal ARI и инструкциям адвоката, а не копирует чеклист D8 из чата. Путаница каналов отнимает недели, а у троих biometria и документы оформляются на каждого. Мягкий ориентир ниже, а жёсткие правила — только на aima.gov.pt и в вашем processo.",
    ],
    bullets: [
      "В чатах часто советуют начинать с Agora, но для ARI первичный трек — Portal ARI и Loja AIMA по процессу.",
      "Минимальное пребывание по ARI исторически мягче, чем 183 дня по D7; актуальный минимум уточняйте у адвоката.",
      "Agregado familiar проходит в одном investment-кейсе через Portal ARI с отдельными pedido и taxas.",
      "NIF и comprovativo legal stay часто хватает раньше пластиковой карты.",
      "Продление ARI стоит около €4 210,30, а temporary renovação D7/D8 — около €440,20.",
    ],
  },
  {
    heading: "Частые ошибки первого месяца",
    section_kind: "practice",
    paragraphs: [
      "Семьи с ARI теряют недели не на инвестициях, а на неправильном порядке. Школа, адрес и банк идут до caução и отмены temporary. Чеклист из Lisboa под D8 не подходит под Norte и ARI без правок.",
    ],
    bullets: [
      "Искать long-term квартиру до shortlist школы и потом переезжать через две недели.",
      "Ехать в AIMA Lisboa, игнорируя Portal ARI и Loja в Norte.",
      "Арендовать авто без Via Verde и получать штрафы за portagens.",
      "Забыть caderneta de vacinação и apostille на свидетельстве о рождении.",
      "Отменять частную страховку в день получения utente SNS.",
    ],
  },
  {
    heading: "Типичные ошибки релокантов",
    section_kind: "practice",
    paragraphs: [

    ],
    bullets: [
      "Ошибка: полагаться на один источник из чата без проверки на gov.pt / портале органа.",
      "Ошибка: не закладывать 2–4 недели на дозапрос документов или запись в balcão.",
      "Ошибка: игнорировать Norte-специфику — Porto/Braga быстрее по очередям, но те же формальные требования.",
      "Ошибка: откладывать NIF, morada или comprovativo — без них следующий шаг встанет.",
    ],
  }
];

const keyTakeaways = [
  "Официально: NIF, comprovativo de morada, matrícula в школу и inscrição в SNS оформляют по порядку, который принимают Finanças и AIMA; все данные по ARI лежат только на Portal ARI.",
  "На практике: семьи в Norte чаще всего теряют первую неделю, когда начинают с Idealista вместо admissions в школу и NIF ребёнка; temporary жильё на 2–4 недели решает эту задачу.",
  "На практике: арендованная машина из OPO требует Via Verde или EasyToll сразу, иначе счета за portagens на A3 и A28 приходят позже и дороже.",
  "Расхождение: «первый месяц как в Lisboa по D7» не работает для ARI в Porto или Braga; здесь база — школа Norte, локальные Finanças и Junta, а также отдельный трек Portal ARI.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Для кого этот чеклист — какая семья?",
    a: "Да, ориентир — семья из трёх: двое взрослых и один ребёнок школьного возраста. При двух детях или младенце те же блоки, только больше времени на педиатрию и кресла в авто.",
  },
  {
    q: "С чего начать в первый день после OPO?",
    a: "Три шага: авто с детским креслом и Via Verde, temporary в Porto или Braga, eSIM и визит в Finanças за NIF. По правилам школа не обязательна в день первый, на практике visit планируют в первые три рабочих дня.",
  },
  {
    q: "Golden Visa — те же шаги, что у D7/D8?",
    a: "Нет. По правилам быт похож, а миграционный канал ARI идёт через Portal ARI и Loja AIMA. На практике сверяйте aima.gov.pt и адвоката; Emigro не заменяет юридическую консультацию.",
  },
  {
    q: "Porto или Braga выбрать на первый месяц?",
    a: "От школы. По правилам оба города принимают SNS и Finanças локально. На практике несколько треков — temporary в Porto, CLIB и бюджет — Braga. Сравнение в отдельном гайде.",
  },
  {
    q: "Какие документы ребёнка просят в international school?",
    a: "Обычно 5–7 файлов: паспорт, NIF, transcripts, caderneta de vacinação, comprovativo de morada; часто apostille и перевод свидетельства о рождении. По правилам точный список у admissions, на практике пакет без vacinas возвращают.",
  },
  {
    q: "Когда покупать машину вместо аренды?",
    a: "Не в дни 1–7. По правилам владение авто не требуется для ARI в первый месяц. На практике сначала школа и адрес, потом rent vs buy. На аренде сразу закройте tolls.",
  },
];

export const PERVYJ_MESYAC_CHECKLIST_GUIDE = {
  slug: PERVYJ_MESYAC_CHECKLIST_SLUG,
  category: "Первый месяц",
  content_kind: "guide" as ContentKind,
  title: "Первый месяц семьи с Golden Visa в Porto или Braga",
  excerpt: "Семья с ARI приезжает в Norte и выстраивает порядок: школа раньше долгосрочной аренды, NIF и SNS по адресу, Portal ARI отдельно от общих каналов. По неделям без паники из чатов.",
  seo_title: "Первый месяц в Португалии: семья Golden Visa Porto Braga",
  seo_description: "Чеклист первого месяца для семьи с ARI в Porto или Braga: школа в приоритете, temporary жильё, NIF, SNS, Via Verde и Portal ARI. По дням и неделям без.",
  quick_answer: "Семья с Golden Visa прилетает в Португалию и сразу видит в чатах список из двадцати дел. На деле для троих в Porto или Braga хватает одной последовательности: сначала школа и временный адрес, потом NIF, SNS и long-term жильё ближе к третьей-четвёртой неделе. Portal ARI работает отдельно, поэтому сверяйте статус только на aima.gov.pt и с адвокатом.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "AIMA — Portal ARI (Golden Visa)", url: "https://aima.gov.pt/pt/viver/autorizacao-de-residencia-para-investimento-art-90-o-a/portal-ari" },
    { title: "AIMA", url: "https://aima.gov.pt/" },
    { title: "Portal das Finanças", url: "https://www.portaldasfinancas.gov.pt/" },
    { title: "SNS — número de utente", url: "https://www.sns.gov.pt/" },
    { title: "Agora", url: "https://agora.imigrante.pt/" },
    { title: "Banco de Portugal", url: "https://www.bportugal.pt/" },
  ],
  topic_tags: ["nif","aima","sns","bank","arenda","portugal"],
  hashtags: buildNoteHashtags({
    topicTags: ["nif","aima","sns","bank","arenda","portugal"],
    contentKind: "guide",
  }),
  source_channel: "chatlisboa+por_tugal+lepta",
  source_label: "editorial:grok-4.3-rewrite-2026-09-21",
};
