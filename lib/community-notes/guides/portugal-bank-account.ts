/**
 * Unified Portugal bank account + first credit card guide (canonical).
 * Pillar draft 2026 + Telegram practice (@chatlisboa, @por_tugal, @lepta)
 * + field KYC (Millennium: criminal record RF/UAE + apostille).
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { formatPracticeBullet, formatPracticeTakeaway } from "@/lib/community-notes/practice-format";
import { LISBON_RENT_FIRST_MONTH_SLUG } from "@/lib/community-notes/guides/lisbon-rent-first-month";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const PORTUGAL_BANK_ACCOUNT_SLUG = "kak-otkryt-bankovskiy-schet-portugalia-2026";
/** Legacy slug — archived + redirected to PORTUGAL_BANK_ACCOUNT_SLUG. */
export const PORTUGAL_BANK_ACCOUNT_LEGACY_SLUG = "otkrytie-scheta-kreditnaya-karta-portugaliya-2026";

const GLOSSARY_INTRO =
  "Слова из отделения, KYC-анкеты и приложения банка — разберём до визита, пока менеджер не попросил comprovativo de morada, которого ещё нет.";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(glossaryForSlug(PORTUGAL_BANK_ACCOUNT_SLUG)!, GLOSSARY_INTRO),
  },
  {
    heading: "Официально: зачем PT IBAN и что собрать",
    section_kind: "official",
    paragraphs: [
      "Что делать: получить NIF и пакет KYC до записи в банк — без налогового номера conta à ordem не откроют.",
      "Зачем: PT IBAN нужен для domiciliação аренды, EPAL/EDP, зарплаты, Portal das Finanças и proof of funds по визам (порог D7 сверяйте на актуальном сайте консульства/AIMA — ориентир часто около €11k на основном заявителе, цифра индексируется).",
      "Главное: банк обязан провести PBC/KYC и проверить origem dos fundos — «только паспорт» почти нигде не проходит.",
    ],
    bullets: [
      "NIF (9 цифр): Finanças / Loja do Cidadão (часто в день) или fiscal representative онлайн (1–3 недели); для non-EU/EEA (RU/UA/BY/KZ) представитель обычно обязателен (€150–400/год ориентир).",
      "Taxa NIF в Finanças для нерезидента — мелкие фиксированные суммы + карта; через посредника NIF часто €60–300 — сверяйте квитанцию, не «прайс из чата».",
      "Documento de identificação — паспорт; для резидентов часто título de residência / AIMA receipt.",
      "Comprovativo de morada: резиденты — contrato с registo, atestado Junta, коммуналка; нерезиденты — иностранный utility bill ≤3 мес (если банк вообще открывает non-resident).",
      "Comprovativo de rendimentos / origem dos fundos — выписки 3–6 мес., контракт, пенсия, tax returns; для крупных входящих из РФ/РБ — письменное объяснение.",
      "Certificado de registo criminal — не в базовом чеклисте всех банков, но compliance может запросить по странам проживания/гражданства (apostille + перевод).",
      "PT SIM (MEO/NOS/Vodafone, €10–15) — почти всегда нужна для SMS home banking.",
      "Banco de Portugal + CRC (Central de Responsabilidades de Crédito) — рамка для conta и cartão de crédito; права клиента: clientebancario.bportugal.pt.",
    ],
  },
  {
    heading: "Официально: дебет сразу, crédito — позже",
    section_kind: "official",
    paragraphs: [
      "Что делать: рассчитывать на cartão de débito Multibanco в первую неделю; cartão de crédito — после истории счёта и PT-дохода.",
      "Зачем: иностранная кредитная история в CRC Португалии «с нуля»; банк смотрит recibos/IRS и поведение по conta.",
      "Главное: debit ≠ credit; для прокачки CRC нужна именно crédito с limite.",
    ],
    bullets: [
      "Débito / Multibanco: оплата, ATM, многие налоги и коммуналки — база быта.",
      "Crédito básica: типично после 3–6 мес. счёта; лимит часто €500–2 000 на старте.",
      "Anuidade и 3D Secure — читайте условия до активации.",
      "Ипотека — отдельный продукт: для нерезидентов LTV часто 60–80% (por_tugal, 2025); BPI в форумах хвалят при высоком взносе — не путать с «лёгкой кредиткой».",
      "Proof of funds для D7/D8/GV консульства обычно хотят счёт в банке под надзором Banco de Portugal — fintech с чужим IBAN часто слабее; сверяйте инструкцию вашего консульства.",
    ],
  },
  {
    heading: "Матрица банков 2026: комиссии и кому что подходит",
    section_kind: "practice",
    paragraphs: [
      "Что делать: выбрать plan A + plan B по сценарию (уже в PT / remote / минимум комиссий) — не один «лучший банк из таблицы».",
      "Зачем: английский на сайте ≠ KYC в отделении для RU-паспорта; комиссии waiver'ят при salary или мин. балансе.",
    ],
    bullets: [
      "ActivoBank (дочка BCP): €0 счёт / €0 карта, сильное EN-приложение; открытие только лично в Португалии — нет remote.",
      "Millennium BCP: €5–8.60/мес (часто waiver при salary или балансе ~€500), EN и international desk; remote через представительства/посредников для части паспортов — для RU 2026 не обещание.",
      "CGD: €0–5/мес, самая широкая сеть; EN слабее в регионах; в англоязычных форумах бывают кейсы non-resident с NIF+паспортом — для RU/BY это не гарантия (см. чаты ниже).",
      "Novo Banco: ~€5–8.60; продукт +351 / Algarve для инвесторов; EN limited.",
      "Santander Totta: знакомый бренд, EN есть; в чатах — месяцы задержек и жёсткий KYC для новых.",
      "BPI: средняя сеть; чаще в разговорах про ипотеку при депозите ≥40%, не как «лёгкий первый счёт».",
      "Revolut: с PT IBAN + MB Way (por_tugal, 10.2025) — сильный мост; не всегда принимают как «банковский» IBAN для renda/AIMA.",
      "N26 (DE IBAN) / Wise — быстрый FX-старт; не замена PT IBAN для аренды и многих proof of funds.",
      "Скрытые расходы: SEPA €0–5; SWIFT €15–50; FX 1–3%; замена карты €10–20; овердрафт — дорого.",
      "Разовый бюджет: NIF + (опц.) fiscal rep + апостиль/переводы €50–150+ + начальный депозит €0–250; посредник remote €250–500 — только если реально нужен счёт до прилёта.",
    ],
  },
  {
    heading: "Практика KYC: RU/BY/UA/KZ, Millennium и чаты",
    section_kind: "practice",
    paragraphs: [
      "Что делать: для non-EU заложить усиленный source of funds и запас по срокам на criminal record — особенно РФ + другие страны проживания.",
      "Зачем: «матрица для американского туриста» из Reddit не равна кейсу RU-паспорта в Lisboa 2026.",
    ],
    bullets: [
      formatPracticeBullet({
        channels: ["chatlisboa"],
        period: "2026",
        claim:
          "получить португальский IBAN с российским паспортом без ВНЖ сейчас почти нереально — участники прямо подтверждают отказы",
        forReader: "после AIMA receipt/ВНЖ шансы выше; до этого держите Revolut с PT IBAN как мост и не жгите единственный зарубежный счёт",
      }),
      "RU: fiscal representative для NIF + детальный origem dos fundos обязателен; KYC жёстче, чем у UA/KZ в среднем.",
      "UA: Temporary Protection в другой стране ЕС ≠ автоматический счёт в PT — нужен NIF и стандартный пакет банка.",
      "BY: похожий KYC на RU, но меньше «новостных» писем о закрытии; полный proof of funds всё равно готовьте.",
      "KZ: часто проще по KYC среди четырёх паспортов — не отменяет morada и выписки.",
      "Millennium BCP на практике у клиентов с треком РФ + ОАЭ запрашивал certificado de registo criminal из обеих стран: apostille + tradução certificada / нотариальный перевод. Закладывайте 2–6 недель; список стран просите письменно до оплаты.",
      formatPracticeBullet({
        channels: ["chatlisboa", "por_tugal"],
        period: "2025–2026",
        claim:
          "ActivoBank и Millennium чаще называют рабочим стартом уже в стране; Santander — plan B из-за жёсткого KYC",
        forReader: "в туристическом отделении Baixa отказ не приговор — пробуйте спальный район или international desk",
      }),
      formatPracticeBullet({
        channels: ["por_tugal"],
        period: "октябрь 2025",
        claim:
          "Revolut с португальским IBAN интегрировался с MB Way: QR, Multibanco-ссылки, налоги, ATM",
        forReader: "удобно для быта; senhorio и часть договоров всё равно просят «классический» PT-банк",
      }),
      formatPracticeBullet({
        channels: ["chatlisboa"],
        period: "июнь 2026",
        claim:
          "в чатах обсуждали письма CGD отдельным клиентам-россиянам о возможном закрытии счетов",
        forReader: "это не закон «всем закрыть» — действуйте по своему письму и держите второй счёт",
      }),
      formatPracticeBullet({
        channels: ["por_tugal"],
        period: "2025",
        claim:
          "по блокировкам Revolut для россиян Еврокомиссия указывала на KYC-требование ВНЖ/гражданства ЕЭЗ у банка",
        forReader: "не стройте единственный канал на fintech",
      }),
      "Замкнутый круг банк↔аренда: NIF + Termo/краткая аренда → conta — см. [аренда Lx](/notes/" +
        LISBON_RENT_FIRST_MONTH_SLUG +
        ").",
    ],
  },
  {
    heading: "Кредитная карта: лимиты и отказ без PT-дохода",
    section_kind: "practice",
    paragraphs: [
      "Что делать: 3–6 месяцев крутить доход через conta, потом просить crédito — ориентир чистого дохода часто €1 000–1 500/мес.",
      "Зачем: без зарплаты/пенсии на счёт в PT разговор часто обрывают на входе.",
    ],
    bullets: [
      formatPracticeBullet({
        channels: ["chatlisboa"],
        period: "2026",
        claim:
          "в Caixa и других банках на вопрос «получаете зарплату в Португалии?» при ответе «нет» разговор про кредитную карту часто заканчивают сразу",
        forReader: "debit и pré-pago не качают CRC как crédito",
      }),
      "Первый лимит €500–2 000 — норма; premium (€2k–10k+) обычно после 12+ мес. и высокого дохода.",
      "Аренда авто / отели часто требуют credit; без неё — прокаты на debit или залог (боль Lx-чатов).",
      "МИР почти не принимают; UnionPay — частично. Не стройте быт на российских картах.",
    ],
  },
  {
    heading: "Пошагово: remote до прилёта и лично в PT",
    section_kind: "action_guide",
    paragraphs: [
      "Что делать: выбрать сценарий A (счёт до визы) или B (уже в стране) — не смешивать чеклисты.",
      "Зачем: remote через посредника (€250–500) имеет смысл для proof of funds; для RU-паспорта 2026 success rate не как в брошюре посредника.",
      "Главное: PT IBAN Banco de Portugal-банка для визы/аренды важнее «красивого» приложения.",
    ],
    bullets: [
      "A1 — NIF через fiscal representative + пакет: паспорт, foreign address, income, доверенность посреднику.",
      "A2 — Millennium international / Novo Banco +351 / проверенный посредник; срок non-EU часто 2–4 недели; апостиль на копии — часто да.",
      "A3 — перевод proof of funds (порог D7 сверяйте официально; ориентир ~€11 040 на основного) только на подходящий счёт.",
      "B1 — NIF (если нет) + PT SIM в день/два.",
      "B2 — запись ActivoBank или Millennium (plan A) + второй банк (plan B); утро 8:30–9:00, талон.",
      "B3 — выписки 3–6 мес. + origem dos fundos; спросите про criminal record (какие страны) до визита.",
      "B4 — визит с оригиналами; при запросе — apostille + нотариальный перевод; возьмите comprovativo de IBAN на бланке.",
      "B5 — MB Way, domiciliação аренды/коммуналок; через 90–180 дней — заявка на cartão de crédito с recibos/IRS.",
    ],
  },
  {
    heading: "Где сайт, Reddit и отделение расходятся",
    section_kind: "gap",
    paragraphs: [
      "Что делать: читать продукт банка и одновременно готовить plan B — кейс «американца-туриста в CGD» не копируйте на RU 2026.",
      "Зачем: remote opening в маркетинге ≠ политика отделения для вашего паспорта.",
    ],
    bullets: [
      "Сайт: «online за 10 минут» → новым нерезидентам чаще presencial KYC.",
      "«CGD откроет без residency» (Reddit) → для RU/BY в @chatlisboa 2026 без ВНЖ IBAN почти не дают.",
      "Чеклист Millennium «стандарт» → на практике РФ+ОАЭ: criminal record с apostille и переводом.",
      "Revolut «не PT IBAN» (устаревшие гайды) → с 10.2025 у многих есть PT IBAN + MB Way; всё равно не всегда замена класического банка для renda.",
      "«Кредитку дадут сразу» → нет; нужен PT-доход и месяцы истории.",
      "Посредник «гарантирует счёт из РФ» → success не гарантирован; читайте договор и refund policy.",
      "Письма CGD о закрытии → по своему письму + второй банк, не по репосту.",
      "Termo как morada → одно отделение да, соседнее нет.",
    ],
  },
  {
    heading: "Типичные ошибки",
    section_kind: "practice",
    paragraphs: [
      "Оптимально: NIF → SIM → два банка за неделю → IBAN на бланке → через квартал crédito.",
    ],
    bullets: [
      "Ошибка: идти без NIF или без PT-номера — home banking и SMS не заведутся.",
      "Ошибка: один визит в туристический филиал и сдаться.",
      "Ошибка: закрыть зарубежный счёт до PT IBAN — нет моста для caução.",
      "Ошибка: врать в origem dos fundos.",
      "Ошибка: не заложить 2–6 недель на criminal record + апостиль для Millennium.",
      "Ошибка: класть proof of funds D7 только на N26/Wise с чужим IBAN без проверки консульства.",
      "Ошибка: ждать кредитку в день открытия conta.",
      "Ошибка: единственный канал = Revolut при KYC-рисках для RU.",
      "Ошибка: путать debit и credit при аренде авто.",
    ],
  },
];

const keyTakeaways = [
  "Официально: без NIF нет conta; банк обязан сделать KYC и проверить origem dos fundos; debit дают сразу, crédito — после истории и дохода.",
  formatPracticeTakeaway({
    channels: ["chatlisboa", "por_tugal"],
    period: "2025–2026",
    claim:
      "ActivoBank (€0) и Millennium — частый старт уже в PT, а с RU-паспортом без ВНЖ португальский IBAN почти не открывают",
    forReader: "Revolut с PT IBAN + MB Way как мост; для Millennium с треком РФ/ОАЭ готовьте criminal record с апостилем",
  }),
  formatPracticeTakeaway({
    channels: ["chatlisboa"],
    period: "2026",
    claim:
      "кредитную карту без португальского дохода часто даже не рассматривают",
    forReader: "3–6 месяцев активности по счёту и recibos важнее «премиальной» заявки в день открытия",
  }),
  "Расхождение: Reddit/сайт про non-resident CGD ≠ практика RU 2026; порог D7 на счету и список документов — только с актуального консульства/AIMA.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Какие документы нужны для счёта?",
    a: "NIF, паспорт (и/или ВНЖ), comprovativo de morada, почти всегда выписки и origem dos fundos. PT SIM для SMS. Compliance может добавить criminal record с apostille — особенно при нескольких странах проживания.",
  },
  {
    q: "Откроют ли счёт с российским паспортом без ВНЖ?",
    a: "В @chatlisboa 2026 пишут, что PT IBAN без ВНЖ с RU-паспортом почти не получить — вопреки англоязычным гайдам про CGD/BCP для туристов. Мост: Revolut с PT IBAN + повтор после AIMA receipt/ВНЖ.",
  },
  {
    q: "Какой банк выбрать первым?",
    a: "Уже в PT и хотите €0 — ActivoBank. Нужны EN и сеть — Millennium BCP. Santander — plan B. CGD/Novo Banco — по отделению и продукту. Всегда два банка за одну неделю.",
  },
  {
    q: "Может ли Millennium потребовать справку о несудимости?",
    a: "Да. На практике при треке РФ + ОАЭ запрашивали certificado de registo criminal из обеих стран с apostille и нотариальным/сертифицированным переводом. Список стран — письменно до заказа документов.",
  },
  {
    q: "Можно ли открыть счёт удалённо до прилёта?",
    a: "Часть банков/посредников обещает remote (Millennium international, Novo Banco +351, сервисы вроде Bordr/E-residence). Для RU/BY 2026 это не гарантия. Стоимость посредника ориентир €250–500 + срок 2–4 недели. Сверяйте refund и список документов.",
  },
  {
    q: "Хватит ли Revolut / N26 / Wise?",
    a: "Revolut с PT IBAN + MB Way (с 10.2025) закрывает много быта. N26/Wise — чужой IBAN, слабее для аренды и части proof of funds. Для D7/D8 часто нужен банк под Banco de Portugal — уточняйте в консульстве.",
  },
  {
    q: "Сколько держать на счету для D7?",
    a: "Ориентир в гайдах ~€11 040 на основного заявителя, но порог индексируется. Берите цифру только с актуальной инструкции консульства/AIMA на год подачи.",
  },
  {
    q: "Как получить кредитную карту?",
    a: "После 3–6 месяцев conta и регулярного PT-дохода (часто €1 000–1 500 net). Без зарплаты в PT в чатах — мгновенный отказ. Первый лимит обычно низкий.",
  },
  {
    q: "Что делать при отказе?",
    a: "Другое отделение / international desk → второй банк → ActivoBank если уже в стране → посредник только если понимаете договор. Сохраняйте письменный отказ/список недостающих документов.",
  },
];

export const PORTUGAL_BANK_ACCOUNT_GUIDE = {
  slug: PORTUGAL_BANK_ACCOUNT_SLUG,
  category: "Банки",
  content_kind: "guide" as ContentKind,
  title: "Как открыть банковский счёт и получить кредитную карту в Португалии в 2026",
  excerpt:
    "NIF, матрица банков, KYC для RU/BY/UA/KZ, Millennium с apostille, ActivoBank, Revolut MB Way и первая кредитка — полный разбор для релокантов.",
  seo_title: "Счёт и кредитка в Португалии 2026",
  seo_description:
    "Открыть счёт в Португалии 2026: NIF, Millennium, ActivoBank, CGD, Revolut MB Way, KYC и справка о несудимости. Как получить кредитную карту.",
  quick_answer:
    "Без NIF нет conta; без PT IBAN спотыкаются аренда, EPAL и часть виз. В 2026 с RU-паспортом без ВНЖ классический банк почти закрыт — ActivoBank/Millennium после статуса и Revolut с PT IBAN + MB Way как мост. Millennium может запросить criminal record из РФ и ОАЭ с апостилем; кредитку просите через 3–6 месяцев PT-дохода, не в день открытия.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "Banco de Portugal — Cliente Bancário", url: "https://clientebancario.bportugal.pt/" },
    { title: "Banco de Portugal", url: "https://www.bportugal.pt/" },
    { title: "Portal das Finanças", url: "https://www.portaldasfinancas.gov.pt/" },
    { title: "ActivoBank", url: "https://www.activobank.pt/" },
    { title: "Millennium BCP", url: "https://www.millenniumbcp.pt/" },
    { title: "AIMA", url: "https://aima.gov.pt/" },
  ],
  topic_tags: ["bank", "portugal"],
  hashtags: buildNoteHashtags({
    topicTags: ["bank", "portugal"],
    contentKind: "guide",
    extra: ["iban", "millennium", "activobank", "revolut", "кредитнаякарта", "nif", "kyc"],
  }),
  source_channel: "chatlisboa+por_tugal+lepta+editorial-pillar",
  source_label: "editorial:portugal-bank-pillar-enrich+tg-2026",
};
