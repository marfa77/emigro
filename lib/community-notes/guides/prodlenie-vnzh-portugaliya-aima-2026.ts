/** Hand-curated guide — VNJ renewal (renovação título de residência).
 * Triple fact-check: aima.gov.pt / portal-renovacoes / services.aima + TG practice.
 * review_tier: volatile — fees & portals change; verify on submit date.
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { formatPracticeBullet, formatPracticeTakeaway } from "@/lib/community-notes/practice-format";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const VNJ_RENEWAL_SLUG = "prodlenie-vnzh-portugaliya-aima-2026";

const DISCLAIMER_TOP =
  "**Emigro — не юридическая консультация.** Авторы проходят продление ВНЖ через **advogados / solicitadores**, а не «сами по форумам». Информация собрана из **официальных источников AIMA и gov.pt** и **сверена с реальным опытом** релокантов в Telegram-чатах (@chatlisboa, @por_tugal, @autolife_pt, @lepta). Правила, **taxas** (пошлины) и порталы **меняются** — в тексте возможны ошибки и отставание от практики. **Перед подачей сверяйтесь** с актуальными данными на [aima.gov.pt](https://aima.gov.pt/) и с вашим юристом.";

const DISCLAIMER_FOOTER =
  "Повторяем честно: мы не иммиграционная фирма. Сложные кейсы (просрочка, смена основания, семья, судимость) — только с лицензированным **advogado de imigração**. Emigro не несёт ответственности за решения AIMA; при расхождении с официальным порталом верьте порталу.";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(
      glossaryForSlug(VNJ_RENEWAL_SLUG)!,
      "Слова, которые услышите в balcão AIMA, в письме от Estrutura de Missão и на portal-renovacoes — разберём заранее, пока не истёк срок título."
    ),
    paragraphs: [
      "Слова, которые услышите в balcão AIMA, в письме от Estrutura de Missão и на portal-renovacoes — разберём заранее, пока не истёк срок título.",
      DISCLAIMER_TOP,
    ],
  },
  {
    heading: "Когда начинать продление: сроки до expiry",
    section_kind: "official",
    paragraphs: [
      "Что делать: отметьте дату на обратной стороне título de residência и поставьте напоминание за **2–3 месяца** — не за последнюю неделю.",
      "Зачем: AIMA открывает **Portal das Renovações** (портал продлений) поэтапно, по месяцам истечения карты; без регистрации и оплаты taxa (госпошлины) процесс не стартует.",
      "Главное: по состоянию на **июль 2026** онлайн-продление идёт через [portal-renovacoes.aima.gov.pt](https://portal-renovacoes.aima.gov.pt/) — см. [новость AIMA](https://aima.gov.pt/pt/noticias/o-portal-das-renovacoes-ja-esta-disponivel); доступ расширяется по cohorts, не для всех сразу.",
    ],
    bullets: [
      "Проверьте expiry на карте — первый título D7/D8/work обычно **2 года**, продления тоже по правилам вашей autorização.",
      "Зарегистрируйтесь на portal-renovacoes, когда AIMA открыла ваш месяц caducidade — пароль придёт на e-mail из базы.",
      "Сверьте morada и NISS в системе AIMA до «Criar pedido» — несовпадение блокирует валидацию ([aima.gov.pt](https://aima.gov.pt/)).",
      "Закладывайте **90 дней** до expiry как безопасный горизонт старта — точный срок в вашем письме AIMA важнее общих советов.",
      "Параллельно проверьте срок **загранпаспорта** — см. [замена заграна](/notes/zamena-zagranpasporta-portugaliya-2026).",
    ],
  },
  {
    heading: "Типы ВНЖ: D7, D8, trabalho, estudo, família, EU",
    section_kind: "official",
    paragraphs: [
      "Что делать: определить, **renovação** (то же основание) или **nova autorização** (смена категории) — это разные trâmites и taxas.",
      "Зачем: подать «как D7», когда вы уже работаете в PT по contrato (трудовому договору) — типичная причина pedido de indeferimento (отказа по заявлению).",
      "Главное: hard-требования — на [aima.gov.pt](https://aima.gov.pt/) и в Portaria n.º 307/2023; ниже — ориентиры по состоянию на июль 2026.",
    ],
    bullets: [
      "**D7 (rendimentos próprios):** comprovativo rendimentos recorrentes (~€920/мес по RMMG 2026), extratos 3–6 мес., morada, seguro — без trabalho dependente в PT.",
      "**D8 (teletrabalho):** contrato/ invoices из-за рубежа, доход ~4× RMMG, подтверждение налогового резидентства за рубежом где применимо.",
      "**Trabalho (atividade profissional):** contrato de trabalho или recibos verdes + declaração Segurança Social/Finanças; taxas renovação — типовой пакет **€133 + €307,20 ≈ €440,20** с 01.03.2026 ([Tabela AIMA](https://aima.gov.pt/pt/noticias/atualizacao-da-tabela-de-taxas)).",
      "**Estudo:** comprovativo matrícula, progresso académico, meios de subsistência; часто stricter morada — см. [студенческий ВНЖ](/notes/studencheskiy-vnzh-portugal-mify-aima-2026).",
      "**Reagrupamento familiar:** vínculo + rendimentos agregado familiar; те же типовые taxas на pessoa — сверяйте DUC (не устаревшее «€99,80 за всё»).",
      "**Cidadão UE / CPLP:** outros formulários на portal-renovacoes — не путать с маршрутом D-visa СНГ.",
    ],
  },
  {
    heading: "Куда подавать: Agora, portal-renovacoes и services.aima.gov.pt",
    section_kind: "official",
    paragraphs: [
      "Что делать: выбрать **один** канал под ваш статус — онлайн-renovação, Agora (agendamento) или services.aima после e-mail AIMA.",
      "Зачем: «приду без записи» или «заполню не тот портал» = потерянные недели; в 2026 AIMA развела потоки.",
      "Главное: **Portal das Renovações** — основной путь для действующих и части просроченных títulos ([aima.gov.pt](https://aima.gov.pt/pt/noticias/o-portal-das-renovacoes-ja-esta-disponivel)); **Agora** — когда нужен balcão/биометрия; **services.aima.gov.pt** — просроченные кейсы **после** письма AIMA с оплатой taxa.",
    ],
    bullets: [
      "portal-renovacoes.aima.gov.pt: registo → validação AT/SS → «Criar pedido» → DUC оплатить за **24 ч** → upload PDF → recibo pedido renovação.",
      "agora.imigrante.pt: слот на presencial, если portal направил или основание требует balcão — см. [запись в AIMA](/notes/aima-agora-zapis-2026).",
      "services.aima.gov.pt (сервис для просроченных карт): форма продления открывается только после e-mail от AIMA (Estrutura de Missão) с инструкцией оплатить пошлину — без письма кнопки на сайте нет.",
      "Не смешивайте первичную biometriю после визы D и renovação — разные filas в чатах, одинаково нервные слоты Agora.",
      "Сохраняйте comprovativo agendamento и recibo renovação — банк и аренда принимают как proof of legal stay.",
    ],
  },
  {
    heading: "Документы: паспорт, morada, rendimentos, seguro, NIF",
    section_kind: "official",
    paragraphs: [
      "Что делать: собрать **цифровую папку PDF** до открытия portal — размер и читаемость скана = частая техническая причина отказа.",
      "Зачем: AIMA валидирует morada (адрес проживания) через Finanças/Junta; доход — через extratos (выписки) и contratos (договоры); seguro (страховка) — на весь срок autorização (разрешения).",
      "Главное: список зависит от tipo autorização — сверяйте checklist в portal на дату подачи.",
    ],
    bullets: [
      "Passaporte + título de residência (frente/verso), фото по шаблону portal.",
      "Comprovativo morada: contrato arrendamento registo Finanças, Atestado Junta или declaração senhorio — см. [Termo de responsabilidade](/notes/termo-responsabilidade-podtverzhdenie-zhilya-2026).",
      "NIF + NISS актуальные; обновите morada на portaldasfinancas.gov.pt до pedido.",
      "Comprovativo rendimentos: extratos 3–6 мес., contrato trabalho, pensão, invoices D8 — по типу ВНЖ.",
      "Seguro saúde válido (private или SNS + complementar) на период renovação.",
      "Для семьи: certidões vínculo, rendimentos agregado, passaportes dependentes.",
    ],
  },
  {
    heading: "Пошлины (taxas): официальные суммы и оговорка даты",
    section_kind: "official",
    paragraphs: [
      "Что делать: перед оплатой DUC откройте **Tabela de Taxas** на aima.gov.pt — не ориентируйтесь на суммы из чатов 2024 года.",
      "Зачем: с **1 марта 2026** AIMA обновила taxas (пошлины) по Portaria n.º 307/2023; ошибка в valor (сумме) = pedido (заявление) не анализируют.",
      "Главное: с **01.03.2026** типовая temporary renovação — **два платежа**: **€133** (receção e análise) + **€307,20** (concessão/renovação) ≈ **€440,20** ([AIMA](https://aima.gov.pt/pt/noticias/atualizacao-da-tabela-de-taxas)); ARI/Golden Visa renovação — ориентир **€4 210,30**. Не путать с устаревшим «€99,80 за acto».",
    ],
    bullets: [
      "Оплата DUC — в течение **24 часов** после emissão guia на portal-renovacoes ([aima.gov.pt](https://aima.gov.pt/pt/noticias/o-portal-das-renovacoes-ja-esta-disponivel)).",
      "Сохраните recibo и número processo — для advogado и повторных обращений.",
      "Taxa emissão cartão / иные actos могут дать дополнительные строки — смотрите полный DUC.",
      "Не переводите «наличными знакомому» — только официальные каналы AT/AIMA.",
      "При сомнении в сумме — advogado сверит acto administrativo в письме AIMA + DUC.",
    ],
  },
  {
    heading: "Ожидание решения — мягко, по чатам 2025–2026",
    section_kind: "practice",
    paragraphs: [
      "Что делать: после recibo pedido renovação планируйте жизнь **без пластика** 1–3 месяца — comprovativo pedido + старый título держите при себе.",
      "Зачем: закон говорит о prazo análise (сроке рассмотрения) ~60 dias, практика длиннее; регион и tipo autorização (тип разрешения) влияют.",
      "Главное: цифры ниже — **не гарантия**, а диапазоны из чатов; ваш advogado даст прогноз по processo.",
    ],
    bullets: [
      formatPracticeBullet({
        channels: ["chatlisboa", "por_tugal"],
        period: "2025–2026",
        claim:
          "от загрузки документов на portal-renovacoes до решения (deferimento) по онлайн-renovação часто проходит 30–90 дней",
        forReader: "закладывайте 1–3 месяца без пластика и держите comprovativo pedido renovação при себе",
      }),
      "В Norte (Porto, Braga) часть кейсов получала cartão de residência (карту ВНЖ) по correio на morada без второго визита; presencial — если portal запросил.",
      "Слот Agora (запись на личный визит) для renovação presencial разбирают так же быстро, как при первичной записи — см. [Agora](/notes/aima-agora-zapis-2026).",
      formatPracticeBullet({
        channels: ["chatlisboa"],
        period: "2026",
        claim:
          "в аэропорту LIS держателям ВНЖ выделили отдельную линию паспортного контроля",
        forReader: "на границе покажите comprovativo pedido renovação и старый título — это не гарантия прохода, но снижает риск вопросов",
      }),
      "Не планируйте дальний выезд за день до expiry без consulta юриста — EES и авиакомпании смотрят на документы строго.",
    ],
  },
  {
    heading: "Morada, паспорт и координация с другими процедурами",
    section_kind: "practice",
    paragraphs: [
      "Что делать: синхронизировать обновление morada, заграна и pedido renovação — AIMA шлёт cartão на адрес из базы.",
      "Зачем: cartão (карта ВНЖ) уйдёт на старый адрес; новый passaporte (паспорт) без обновления в processo (деле) — mismatch на границе.",
      "Главное: morada — Finanças + AIMA; passaporte — consulado Lisboa/Porto — см. [замена заграна](/notes/zamena-zagranpasporta-portugaliya-2026).",
    ],
    bullets: [
      "Обновите morada на portaldasfinancas.gov.pt и в AIMA **до** «Criar pedido».",
      formatPracticeBullet({
        channels: ["chatlisboa"],
        period: "2026",
        claim:
          "Termo de responsabilidade (заявление о проживании у друга) без зарегистрированного contrato de arrendamento (договора аренды) AIMA может не принять",
        forReader: "безопаснее Atestado de Residência из Junta de Freguesia (парафии)",
      }),
      "Начинайте agendamento consulado за **6–9 мес.** до expiry passaporte — параллельно с renovação ВНЖ.",
      "Первое продление в первый год — см. [первый месяц](/notes/pervyj-mesyac-portugaliya-checklist) и pillar [D7/D8](/ru/guides/vnj-portugaliya-d8-d7-grazhdanstvo-2026).",
      "Сохраните PDF всех шагов — при споре с senhorio или банком comprovativo pedido работает месяцами.",
    ],
  },
  {
    heading: "Просроченный título: осторожно и с disclaimer",
    section_kind: "gap",
    paragraphs: [
      "Что делать: если карта уже **caducada**, не исчезайте — но и не подавайте «как будто в сроке» без инструкции AIMA.",
      "Зачем: неправильный канал = indeferimento (отказ); длительная просрочка может потребовать **nova autorização** (новое разрешение) или advogado (адвоката).",
      "Главное: Emigro **не** советует «просто лететь в Schengen с просроченной картой» — это риск отказа во въезде; сверяйтесь с AIMA и advogado.",
    ],
    bullets: [
      "Caducados до 30.06.2025: AIMA уведомляла по e-mail через Estrutura de Missão — следуйте ссылке в письме ([aima.gov.pt](https://aima.gov.pt/pt/noticias/o-portal-das-renovacoes-ja-esta-disponivel)).",
      formatPracticeBullet({
        channels: ["chatlisboa"],
        period: "2025–2026",
        claim:
          "если карта уже просрочена, портал services.aima.gov.pt не открывают сразу — ссылку и доступ присылают только после письма от AIMA с оплатой пошлины",
        forReader: "без e-mail от AIMA форма недоступна — не ищите кнопку на сайте вручную",
      }),
      "В чатах (2025–2026) писали, что portal-renovacoes **не принимает** títulos caducados **>6 meses** — нужен balcão/advogado; **проверьте** на дату вашего кейса.",
      "Миф «просрочка автоматически = deportação» — нет единого сценария; но **stay irregular** — штрафы и проблемы при следующей подаче.",
      "При caducidade + смена основания (D7→trabalho) — часто **nova autorização**, не renovação; не economьте на consulta.",
    ],
  },
  {
    heading: "Типичные ошибки при renovação — мифы из чатов",
    section_kind: "practice",
    paragraphs: [
      "Что делать: вычеркнуть «лайфхаки» без официального источника — особенно про просрочку и «контакты внутри AIMA».",
      "Зачем: мошенники и устаревшие советы 2023 SEF-эпохи до сих пор циркулируют в @por_tugal.",
      "Главное: если совет противоречит aima.gov.pt — верьте порталу или advogado.",
    ],
    bullets: [
      "Не покупайте «гарантированный слот Agora» — риск мошенничества и отказа на входе.",
      "Не езжайте в balcão без agendamento «потому что сосед прошёл» — в 2026 чаще разворачивают.",
      "Не подавайте renovação D7 с recibos verdes от работы в PT — смена категории, не renovação.",
      "Не игнорируйте e-mail AIMA с DUC — 24 часа на оплату, иначе pedido expira.",
      "Не полагайтесь на «просроченная карта = бессрочное право» — stay может быть irregular.",
      "Не путайте portal-renovacoes с первичной записью Agora после визы D — разные задачи.",
    ],
  },
  {
    heading: "Пошагово: renovação через portal (action manual)",
    section_kind: "action_guide",
    paragraphs: [
      "Что делать: пройти типовой онлайн-маршрут, когда AIMA открыла ваш mês de caducidade.",
      "Зачем: каждый шаг оставляет след — recibo (квитанция), DUC (платёжное поручение), upload — без них advogado (адвокат) не восстановит хронологию.",
      "Главное: при блокировке на validação AT/SS — сначала Finanças/Segurança Social, потом повтор pedido.",
    ],
    bullets: [
      "Шаг 1: registo на portal-renovacoes.aima.gov.pt — пароль на e-mail из базы AIMA.",
      "Шаг 2: проверка morada, NIF, NISS; исправление через форму AIMA при расхождении.",
      "Шаг 3: «Criar pedido» → DUC → оплата за 24 ч → сохранить recibo.",
      "Шаг 4: upload PDF (passaporte, título, morada, rendimentos, seguro) — ≤ лимита portal, читаемые сканы.",
      "Шаг 5: ждать e-mail deferimento; cartão — correio на morada или instruция balcão; comprovativo pedido — для банка и поездок.",
    ],
  },
  {
    heading: "Дисклеймер в конце",
    section_kind: "gap",
    paragraphs: [DISCLAIMER_FOOTER],
  },
];

const keyTakeaways = [
  "Официально: renovação título — portal-renovacoes.aima.gov.pt (поэтапно по mês caducidade); DUC оплатить за 24 ч; taxas обновлены 01.03.2026 — сверяйте tabela на aima.gov.pt.",
  formatPracticeTakeaway({
    channels: ["chatlisboa", "por_tugal"],
    period: "2025–2026",
    claim:
      "от загрузки документов до решения по онлайн-renovação часто проходит 30–90 дней",
    forReader:
      "если карта уже просрочена, портал services.aima.gov.pt открывают только после письма от AIMA с оплатой пошлины — без письма форма недоступна. Для личного визита через Agora (agendamento presencial) по-прежнему нужна запись, слоты разбирают быстро",
  }),
  "Официально: temporary renovação с 01.03.2026 — €133 + €307,20 ≈ €440,20; ARI renovação — ориентир €4 210,30 (не «€99,80 за всё»).",
  "Расхождение: «можно без записи» и «просрочка не страшна» — мифы; Emigro проходит продление через advogados — сверяйте кейс с юристом.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "За сколько до expiry подавать на renovação?",
    a: "Официально portal открывается по cohorts по месяцу caducidade — следите за aima.gov.pt. На практике начинайте готовить документы за 2–3 месяца; безопасный горizont ~90 дней до expiry часто упоминают в чатах, но ваш e-mail AIMA важнее.",
  },
  {
    q: "Agora или portal-renovacoes — куда идти?",
    a: "Renovação онлайн — portal-renovacoes.aima.gov.pt когда ваш mês доступен. Agora — agendamento presencial (слоты — см. гайд Agora). services.aima.gov.pt — просроченные после письма AIMA. Не смешивайте с первичной biometriей после визы D.",
  },
  {
    q: "Сколько стоит продление D7/D8 в 2026?",
    a: "С 01.03.2026 типовой пакет temporary renovação: €133 (análise) + €307,20 (renovação) ≈ €440,20. ARI — ориентир €4 210,30. Сверяйте Tabela de Taxas на aima.gov.pt и **DUC в своём pedido** — не устаревшее «€99,80 за acto».",
  },
  {
    q: "Карта просрочена — можно летать?",
    a: "Emigro не даёт «разрешений» на поездки с caducado título. Официально — следуйте instruções AIMA (portal/e-mail). На практике риск отказа на границе реален; comprovativo pedido renovação иногда принимают, но это не гарантия — consulta advogado.",
  },
  {
    q: "Нужен ли advogado для renovação?",
    a: "Официально многие проходят portal сами. Мы в Emigro для своих кейсов используем advogados/solicitadores — особенно при просрочке, смене основания или семье. Это не обязательство, а снижение риска indeferimento.",
  },
  {
    q: "Какие документы для D7 renovação?",
    a: "Типовой пакет: passaporte, título, morada (contrato registo Finanças или Atestado), comprovativo rendimentos recorrentes, seguro, NIF/NISS. Точный checklist — в portal на дату подачи; порог дохода ~€920/мес RMMG 2026 — уточняйте decreto vigente.",
  },
  {
    q: "Сменил работу с D8 на contrato PT — это renovação?",
    a: "Скорее nova autorização (trabalho), не renovação D8. Подать «как D8» с local trabalho — путь к отказу. Consulta advogado до pedido.",
  },
];

export const VNJ_RENEWAL_GUIDE = {
  slug: VNJ_RENEWAL_SLUG,
  category: "AIMA и записи",
  content_kind: "guide" as ContentKind,
  title: "Продление ВНЖ в Португалии 2026: AIMA, Agora и portal-renovacoes",
  excerpt:
    "Renovação título de residência: когда начинать, документы по типу D7/D8/work/study, taxas с 01.03.2026, portal-renovacoes vs Agora vs services.aima — официально + практика чатов, с честными disclaimers.",
  seo_title: "Продление ВНЖ Португалия 2026 — AIMA",
  seo_description:
    "Продление ВНЖ Португалия 2026: portal-renovacoes AIMA, Agora, документы D7/D8/work, taxas, просрочка. Официально + чаты; не юридическая консультация.",
  quick_answer:
    "Дата на título de residência приближается — и чат уже советует «срочно в Agora», будто это единственная дверь. Спокойно: renovação чаще стартует на portal-renovacoes.aima.gov.pt (поэтапно по месяцам expiry); с 01.03.2026 типовой пакет temporary renovação ≈ €440,20 (€133 + €307,20), ARI ≈ €4 210,30; просроченные кейсы — часто через e-mail AIMA и services.aima.gov.pt. Мы в Emigro идём через advogados; сверяйте DUC и aima.gov.pt перед «Criar pedido».",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "AIMA — главный портал", url: "https://aima.gov.pt/" },
    {
      title: "Portal das Renovações",
      url: "https://portal-renovacoes.aima.gov.pt/",
    },
    {
      title: "Новость AIMA — Portal das Renovações",
      url: "https://aima.gov.pt/pt/noticias/o-portal-das-renovacoes-ja-esta-disponivel",
    },
    { title: "Agora — agendamento", url: "https://agora.imigrante.pt/" },
    { title: "services.aima.gov.pt", url: "https://services.aima.gov.pt/" },
    { title: "Portal das Finanças — morada/NIF", url: "https://www.portaldasfinancas.gov.pt/" },
  ],
  topic_tags: ["aima", "agora", "vng", "documents"],
  hashtags: buildNoteHashtags({
    topicTags: ["aima", "agora", "vng"],
    contentKind: "guide",
    extra: ["продление", "ВНЖ", "renovação", "AIMA", "2026"],
  }),
  source_channel: "chatlisboa+por_tugal+autolife_pt+lepta",
  source_label: "editorial:taxas-fix-aug-2026+voice-pass",
};
