/**
 * Hand-curated Lisbon first-month rent guide — voice «Опытный релокант за кофе».
 * Source: pillar draft 2026 + Telegram practice (@lepta, @chatlisboa, @por_tugal).
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { formatPracticeBullet, formatPracticeTakeaway } from "@/lib/community-notes/practice-format";
import { PORTO_BRAGA_LONG_TERM_RENT_SLUG } from "@/lib/community-notes/guides/porto-braga-long-term-rent";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const LISBON_RENT_FIRST_MONTH_SLUG = "arenda-kvartiry-lisbon-pervyi-mesyac-2026";

const GLOSSARY_INTRO =
  "Слова из contrato, Idealista и WhatsApp senhorio — разберём до open house, пока вас не попросили «переведите caução за час».";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(glossaryForSlug(LISBON_RENT_FIRST_MONTH_SLUG)!, GLOSSARY_INTRO),
  },
  {
    heading: "Официально: NIF, caução и Art. 1076",
    section_kind: "official",
    paragraphs: [
      "Что делать: получить NIF и понять лимиты caução/предоплаты до первого просмотра в Лиссабоне.",
      "Зачем: без NIF нельзя подписать contrato de arrendamento, открыть счёт и зарегистрировать коммуналки — это hard-зависимость всего месяца.",
      "Главное: по Art. 1076 Гражданского кодекса caução — максимум 2 месяца renda, предоплата — максимум 2 месяца при письменном соглашении.",
    ],
    bullets: [
      "NIF: лично в Finanças / Loja do Cidadão (часто в день визита) или через fiscal representative онлайн (€50–150, 3–5 раб. дней) — для нерезидентов RU/UA/BY/KZ представитель обычно обязателен (€300–700/год).",
      "После NIF: Portal das Finanças → senha de acesso; адрес обновить на португальский в течение 60 дней после заселения.",
      "Caução (депозит) — до 2 meses renda; условия возврата должны быть в contrato.",
      "Предоплата adiantamento — до 2 meses при письменном соглашении; требование 6–12 месяцев вперёд формально выходит за Art. 1076.",
      "Комиссия imobiliária: по правилам платит senhorio; если агент просит деньги с inquilino — красный флаг.",
      "Индексация renda 2026: ориентир ~2,2% (INE / lepta, август 2025) — senhorio обязан уведомить, не «тихо» поднять в MB Way.",
    ],
  },
  {
    heading: "Официально: registo в Finanças и Modelo 2",
    section_kind: "official",
    paragraphs: [
      "Что делать: заложить registo contrato в Finanças как обязательный шаг рядом с подписью — не «потом как-нибудь».",
      "Зачем: без регистрации слабый comprovativo de morada для AIMA, нет IRS-вычета и слабая защита при споре.",
      "Главное: senhorio должен зарегистрировать договор в течение 30 дней; с 1.08.2025 inquilino может сделать это сам, если senhorio тянет.",
    ],
    bullets: [
      "Portal das Finanças → e-arrendamento → «Comunicar Início de Contrato» — путь senhorio для registo.",
      "С 1 августа 2025 арендатор может сам зарегистрировать contrato, если senhorio не сделал это за месяц (por_tugal / lepta, 2025).",
      "Требуйте Modelo 2 (подтверждение registo) — без него AIMA и банк часто не принимают договор как morada.",
      "AIMA (2025–2026): ужесточили адрес — для части кейсов могут просить declaração do senhorio, не только Termo у друга (lepta, 08.2025).",
      "Stamp duty / Imposto do Selo — обычно на стороне senhorio; уточняйте в contrato, кто платит.",
    ],
  },
  {
    heading: "Неделя 1–2: документы, банк и поиск на практике",
    section_kind: "practice",
    paragraphs: [
      "Что делать: собрать папку (сканы + печать) и открыть путь к PT IBAN до массовых open house.",
      "Зачем: в Лиссабоне хорошие T1/T2 уходят за 24–48 часов — без пакета вас просто не рассматривают.",
    ],
    bullets: [
      formatPracticeBullet({
        channels: ["por_tugal", "lepta"],
        period: "2025–2026",
        claim:
          "Idealista интегрировал Rentalia: на одном сайте и долгосрочный arrendamento, и отпускные объявления — фильтруйте тип, чтобы не переплатить за mid-term",
        forReader: "параллельно смотрите Imovirtual; OLX и Facebook — больше прямых senhorio и больше скама",
      }),
      formatPracticeBullet({
        channels: ["lepta"],
        period: "Q2 2026",
        claim:
          "спрос на аренду вырос примерно на 36% год к году, а конкуренция остаётся высокой даже при небольшом снижении средних цен (Idealista)",
        forReader: "закладывайте open house и решение в день просмотра, а не «подумаю до выходных»",
      }),
      formatPracticeBullet({
        channels: ["lepta"],
        period: "Q2 2025",
        claim:
          "Lisboa и Porto не входили в топ-50 муниципалитетов по спросу на аренду — фокус смещается на периферию при тех же Idealista-объявлениях в центре",
        forReader: "бюджетный plan B: Areeiro, Alameda, Penha de França, Benfica или Almada/Cacilhas (−€300–600/мес, +20–40 мин commute)",
      }),
      "Папка на просмотр: паспорт + NIF + IBAN proof + 3–6 мес. выписок + proof of income + D-visa/AIMA receipt/ВНЖ + (желательно) reference letter.",
      "Банк: Millennium BCP и ActivoBank чаще лояльны к D7/D8; Santander жёстче KYC. Наличные за аренду — красный флаг; целевой способ — transferência / domiciliação.",
      "Замкнутый круг банк↔адрес: сначала NIF + онлайн-счёт (ActivoBank/Revolut с PT IBAN), затем Termo или краткая аренда для morada — детали в [открытии счёта](/notes/kak-otkryt-bankovskiy-schet-portugalia-2026).",
      "Ориентиры цен 2026 (запрашиваемая): Baixa/Chiado T1 €1 500–2 200; Arroios/Anjos T1 €1 000–1 600; Campo de Ourique T1 €1 100–1 700; Almada T1 €800–1 300; медиана Lx ~€21.8/м² (май 2026).",
      "Spotahome / Uniplaces — без fiador, но дороже и не всегда принимают как «традиционный» lease для AIMA/консульства.",
      "Чеклист до подписи (вода, luz, humidade, NIF senhorio): [аренда до подписи](/notes/arenda-lissabon-do-podpisi). Для Porto/Braga бюджеты — [аренда Norte](/notes/" +
        PORTO_BRAGA_LONG_TERM_RENT_SLUG +
        ").",
    ],
  },
  {
    heading: "Неделя 3–4: fiador, контракт, заселение",
    section_kind: "practice",
    paragraphs: [
      "Что делать: заранее выбрать альтернативу fiador и не переводить деньги до подписи contrato с NIF обеих сторон.",
      "Зачем: в Лиссабоне fiador-резидент — почти стандарт; без него рынок толкает к предоплате 6–12 месяцев.",
    ],
    bullets: [
      formatPracticeBullet({
        channels: ["chatlisboa", "por_tugal"],
        period: "2025–2026",
        claim:
          "без португальского fiador senhorio часто просит 2–3 месяца adiantado плюс caução 1–2 месяца — или корпоративный договор",
        forReader: "закладывайте на T2 €1 500 старт €9k–13.5k на практике, не «€4.5k по учебнику»",
      }),
      formatPracticeBullet({
        channels: ["chatlisboa"],
        period: "2026",
        claim:
          "споры по возврату caução типичны: сначала «тостер + €60 клининг», потом игнор, потом «квартира в ужасном состоянии» без inventory",
        forReader: "в день заселения снимайте датированные фото всего mobiliado и отправляйте senhorio в WhatsApp/e-mail",
      }),
      "Альтернативы fiador: предоплата 6–12 мес.; Garantia Bancária; seguro de arrendamento (€150–300/год); mid-term без fiador (+20–40% к цене).",
      "В contrato обязательно: адрес, NIF senhorio/inquilino, срок, renda, caução, кто платит condomínio/коммуналку, notice period, перечень мебели если mobiliado.",
      "Open house: 10–30 кандидатов на 30 минут; кто первый прислал полный пакет + готовность перевести в 2–4 часа — тот и забирает.",
      "Коммуналки после заселения: EDP/Galp/Endesa + EPAL + MEO/NOS/Vodafone — ориентир €120–160/мес; condomínio часто отдельно (проверяйте contrato).",
      "Atestado de residência в Junta de Freguesia — для банка, SNS, AIMA; документы: паспорт, contrato, NIF.",
      "Не переводите caução до личной встречи и подписи — перевод «по фото» без контракта = классический скам.",
    ],
  },
  {
    heading: "Пошагово: первый месяц от Idealista до Modelo 2",
    section_kind: "action_guide",
    paragraphs: [
      "Что делать: идти по неделям — документы → просмотры → contrato/оплата → registo и услуги.",
      "Зачем: без порядка шагов вы либо проигрываете open house, либо платите без Modelo 2.",
      "Главное: NIF и папка документов до первого «серьёзного» просмотра; registo Finanças — в первые 30 дней.",
    ],
    bullets: [
      "Шаг 1 — NIF (+ fiscal representative при необходимости) и senha Portal das Finanças.",
      "Шаг 2 — Онлайн/PT счёт с IBAN; папка документов для просмотров (см. неделю 1–2).",
      "Шаг 3 — Idealista/Imovirtual: 5–10 объявлений/день, фильтр arrendamento не férias; районы под бюджет.",
      "Шаг 4 — Open house с папкой; фото дефектов; уточнить condomínio и что входит в renda.",
      "Шаг 5 — Contrato: NIF сторон, caução, срок, notice; не платить до подписи.",
      "Шаг 6 — Первый платёж: caução + adiantamento на IBAN из contrato; сохранить comprovativo.",
      "Шаг 7 — Modelo 2 / registo e-arrendamento (senhorio или вы после 30 дней с 08.2025).",
      "Шаг 8 — EPAL/EDP/интернет + inventory фото + Atestado в Junta.",
    ],
  },
  {
    heading: "Где закон и рынок Лиссабона расходятся",
    section_kind: "gap",
    paragraphs: [
      "Что делать: читать Art. 1076 и одновременно готовить план B без fiador — иначе open house закончится отказом.",
      "Зачем: «по закону нельзя» не отменяет очередь из 20 кандидатов с предоплатой.",
    ],
    bullets: [
      "Официально: предоплата ≤ 2 meses → на практике без fiador просят 6–12 месяцев («последние месяцы контракта» / corporate lease).",
      "Официально: комиссию агенту платит senhorio → на практике иногда пытаются списать с inquilino — отказывайтесь письменно.",
      "Официально: senhorio регистрирует contrato за 30 дней → на практике многие частники тянут; с 08.2025 регистрируйте сами (por_tugal/lepta).",
      "Официально: «договор есть» → для AIMA нужен registo / Modelo 2 и иногда declaração do senhorio (lepta, 2025).",
      "Сайт Idealista: много объявлений в Lx → lepta: конкуренция и спрос остаются жёсткими (Q2 2026 +36% желающих снять).",
      "Mid-term без fiador «удобно» → консульство/AIMA могут не принять как стабильную morada — уточняйте до оплаты.",
      "«Серая» аренда дешевле → нет IRS-вычета, нет защиты, риск отказа AIMA.",
    ],
  },
  {
    heading: "Типичные ошибки при аренде в Лиссабоне",
    section_kind: "practice",
    paragraphs: [
      "Оптимально: папка и деньги готовы до просмотра; Contrato + Modelo 2 до того, как вызывать EPAL.",
    ],
    bullets: [
      "Ошибка: ждать ответа агента днями — если откладывают просмотр, квартира уже «ушла» или фейк; идите дальше.",
      "Ошибка: перевод залога до подписи contrato — классический скам.",
      "Ошибка: недооценить open house — без пакета документов и готовности платить за часы вы проигрываете гонку.",
      "Ошибка: contrato без registo Finanças / Modelo 2 — отказ AIMA и слабый IRS.",
      "Ошибка: забыть inventory при mobiliado — потом спор по caução, как в разборах @chatlisboa 2026.",
      "Ошибка: не уточнить, кто платит condomínio — неожиданный счёт со 2-го месяца.",
      "Ошибка: согласиться на «серую» аренду ради цены — нет юридической защиты.",
    ],
  },
];

const keyTakeaways = [
  "Официально: для contrato de arrendamento нужны NIF и платёжеспособность; caução и предоплата — максимум по 2 месяца (Art. 1076).",
  formatPracticeTakeaway({
    channels: ["chatlisboa", "por_tugal"],
    period: "2025–2026",
    claim:
      "в Лиссабоне без fiador-резидента часто требуют предоплату 6–12 месяцев или corporate lease, хотя закон ограничивает adiantamento двумя месяцами",
    forReader: "закладывайте бюджет старта в 2–3 раза выше «учебниковых» €4.5k на T2 €1 500",
  }),
  formatPracticeTakeaway({
    channels: ["lepta"],
    period: "Q2 2026",
    claim:
      "спрос на аренду вырос ~на 36% г/г при высокой конкуренции на Idealista — open house и решение в день просмотра стали нормой",
    forReader: "папка документов и готовность к transferência в 2–4 часа важнее идеального района",
  }),
  "Расхождение: контракт без Modelo 2 / registo в Finanças почти бесполезен для AIMA и IRS — требуйте регистрацию или сделайте сами после 30 дней (с 08.2025).",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Можно ли снять квартиру в Лиссабоне без ВНЖ?",
    a: "По правилам закон не запрещает. На практике без ВНЖ/рабочего контракта почти всегда нужен fiador, предоплата 6–12 месяцев или mid-term через агентство. Для AIMA важнее registered contrato, чем «красивый» Airbnb.",
  },
  {
    q: "Что такое fiador и как обойтись без него?",
    a: "Fiador — поручитель-резидент Португалии со стабильным доходом. Альтернативы: предоплата, Garantia Bancária, seguro de arrendamento, mid-term (Spotahome/Uniplaces). На практике в @chatlisboa без fiador чаще всего упираются в деньги вперёд.",
  },
  {
    q: "Сколько месяцев предоплаты обычно просят?",
    a: "Официально — не более 2 месяцев. На практике для иностранцев без fiador — 6–12 месяцев. Это расхождение с Art. 1076, но рынок Лиссабона 2026 так устроен.",
  },
  {
    q: "Как проверить, что договор официальный?",
    a: "Нужен registo в Finanças и Modelo 2. Проверьте NIF senhorio в contrato. С 1.08.2025 inquilino может зарегистрировать договор сам, если senhorio не сделал это за месяц (por_tugal/lepta).",
  },
  {
    q: "Нужно ли платить риелтору?",
    a: "По правилам комиссию агенту платит senhorio. Если просят с вас — отказывайтесь. Honorários иногда маскируют под «оплату брони» — сверяйте до перевода.",
  },
  {
    q: "Что делать, если landlord не возвращает депозит?",
    a: "Письменное требование + inventory фото. Дальше — медиация CACCL в Лиссабоне или Julgados de Paz до €15 000. В @chatlisboa (2026) типичная схема: мелкие удержания → игнор → «ужасное состояние» без доказательств.",
  },
  {
    q: "Подходит ли mid-term (Spotahome, Uniplaces) для AIMA?",
    a: "Зависит от кейса и консульства. Часть принимает registered mid-term, часть хочет «традиционный» lease. Уточняйте до оплаты; иначе деньги заморожены, а morada для AIMA не проходит.",
  },
  {
    q: "Какие права у арендатора в 2026?",
    a: "Защита от самоуправного выселения; индексация renda ориентир ~2,2% (INE); субаренда с лимитами. Самовольное отключение света/смена замков — зона полиции, не «бытовой спор».",
  },
];

export const LISBON_RENT_FIRST_MONTH_GUIDE = {
  slug: LISBON_RENT_FIRST_MONTH_SLUG,
  category: "Аренда",
  content_kind: "guide" as ContentKind,
  title: "Аренда квартиры в Лиссабоне: пошаговый план на первый месяц в 2026",
  excerpt:
    "NIF, fiador, Idealista, open house, caução и Modelo 2: первый месяц аренды в Лиссабоне для релокантов — закон Art. 1076 vs практика чатов 2026.",
  seo_title: "Аренда в Лиссабоне: первый месяц 2026",
  seo_description:
    "Аренда квартиры в Лиссабоне 2026: NIF, fiador, Idealista, open house, caução и Modelo 2. Art. 1076 vs практика предоплаты 6–12 месяцев для релокантов.",
  quick_answer:
    "Вы стоите в очереди open house в Arroios: 20 человек, агент смотрит на часы, а senhorio уже спрашивает «есть fiador?». В Лиссабоне 2026 без NIF и папки документов вы не кандидат; без fiador рынок часто требует предоплату далеко за лимит Art. 1076. Держите курс на registered contrato и Modelo 2 — иначе AIMA не увидит вашу morada.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "Portal das Finanças — arrendamento", url: "https://www.portaldasfinancas.gov.pt/" },
    { title: "AIMA", url: "https://aima.gov.pt/" },
    { title: "Idealista — arrendar", url: "https://www.idealista.pt/arrendar-casas/" },
    { title: "Imovirtual", url: "https://www.imovirtual.com/" },
    { title: "IRN — NRAU / arrendamento urbano", url: "https://irn.justica.gov.pt/" },
  ],
  topic_tags: ["arenda", "portugal", "lisbon"],
  hashtags: buildNoteHashtags({
    topicTags: ["arenda", "portugal", "lisbon"],
    contentKind: "guide",
    extra: ["лиссабон", "fiador", "idealista", "nif", "caucao", "modelo2"],
  }),
  source_channel: "chatlisboa+por_tugal+lepta",
  source_label: "editorial:lisbon-rent-first-month+tg-practice-2026",
};
