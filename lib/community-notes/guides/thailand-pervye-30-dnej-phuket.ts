/**
 * Hand-curated Thailand satellite guide — first 30 days checklist Phuket.
 * CORE slot first_30_days; orchestrator linking core satellite slugs; pillar on emigro.online.
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import {
  formatPracticeBullet,
  formatPracticeTakeaway,
} from "@/lib/community-notes/practice-format";
import type { ThailandEditorialGuide } from "@/lib/community-notes/guides/thailand-editorial-index";
import type { CommunityNoteFaq, ContentKind, GlossaryTerm, NoteBodySection } from "@/lib/community-notes/types";

export const PERVYE_30_PHUKET_SLUG = "pervye-30-dnej-phuket-2026";

const TIN_PHUKET_SLUG = "tin-thailand-phuket-2026";
const SIM_UTILITIES_SLUG = "sim-internet-utilities-phuket-2026";
const ARENDA_SLUG = "arenda-phuket-dolgosrok-2026";
const IMMIGRATION_SLUG = "immigration-phuket-chalermprakiat-2026";
const BANK_SLUG = "bank-schet-phuket-nerezident-2026";
const HEALTH_SLUG = "meditsina-phuket-strahovka-kliniki-2026";
const RAJONY_SLUG = "phuket-rajony-bangtao-rawai-2026";

const GLOSSARY: GlossaryTerm[] = [
  { pt: "Visa exemption (30 days)", ru: "безвиз по соглашению; штамп на въезде, не «виза навсегда»" },
  { pt: "TM6", ru: "карта прибытия; номер нужен для TM30" },
  { pt: "TM30", ru: "уведомление о месте проживания; подаёт владелец жилья в 24 часа" },
  { pt: "TM47 / 90-day report", ru: "отчёт каждые 90 дней для долгого статуса; не для чистого 30-дневного безвиза" },
  { pt: "DTV (Destination Thailand Visa)", ru: "долгое пребывание; оформляется до въезда, не «автовиза от квартиры»" },
  { pt: "Foreign quota (condo)", ru: "доля иностранцев в кондоминиуме; покупка ≠ автоматический иммиграционный статус" },
  { pt: "PromptPay", ru: "мгновенные переводы по номеру телефона после Thai bank account" },
  { pt: "Immigration Phuket", ru: "офис на Chalermprakiat Rd; продления и отчёты по записи/очереди" },
];

const DISCLAIMER =
  "**Emigro — не юридическая консультация.** Безвиз, DTV, LTR и штрафы Immigration **меняются**. Satellite-оркестратор для Phuket (HKT); не переносите порядок NIF/AIMA из Португалии или NIE/TIE из Испании. Hard-правила — [Royal Thai Embassy Moscow](https://moscow.thaiembassy.org/en/publicservice/revision-of-thailand-s-visa-exemption-and-visa-on-arrival-schemes) / [Immigration Bureau](https://www.immigration.go.th/) / ваш тип визы.";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(
      GLOSSARY,
      "Слова из HKT, чата арендодателя и очереди Immigration — разберём до того, как форум предложит «купить condo и виза сама придёт»."
    ),
    paragraphs: [DISCLAIMER],
  },
  {
    heading: "Nota Emigro (fact-check)",
    section_kind: "official",
    paragraphs: [
      "Satellite-чеклист связывает seven core guides Phuket. OK / soft / fixed ниже; источники — посольство и Immigration, не только expat-блоги.",
    ],
    bullets: [
      "OK: с **15 сентября 2026** для обычных паспортов РФ 60-дневный общий безвиз заканчивается; остаётся **до 30 дней** по двустороннему соглашению РФ–Таиланд ([посольство в Москве](https://moscow.thaiembassy.org/en/publicservice/revision-of-thailand-s-visa-exemption-and-visa-on-arrival-schemes)).",
      "OK: **TM30** — уведомление о проживании в течение **24 часов** с момента заселения; по Immigration Act §38 подаёт **владелец/управляющий** жилья ([immigration.go.th](https://www.immigration.go.th/en/?p=14721), портал [tm30.immigration.go.th](https://tm30.immigration.go.th/)).",
      "Fixed: «покупка condo от 3 млн THB / $90k **автоматически** даёт визу семье» — приказы Immigration №237/2568 и №238/2568 существуют, но **автоматической** визы «за объект» в официальных материалах Emigro в таком виде не подтверждает; основание и пакет документов проверяйте отдельно от сделки (см. pillar).",
      "Fixed: «безвиз 30 дней = можно жить полгода без продления» → после штампа нужен **extension**, смена категории (DTV/LTR/Privilege) или **выезд**; иначе overstayer.",
      "Soft: порядок SIM → жильё с TM30 → банк → страховка → Immigration — полевой Phuket 2025–2026, не текст одного приказа.",
      "Soft: адреса филиалов KBank/Bangkok Hospital на острове — сверяйте на сайте банка/клиники; ниже — ориентиры Rawai / Phuket Town.",
    ],
  },
  {
    heading: "Официально: три контура первого месяца на Пхукете",
    section_kind: "official",
    paragraphs: [
      "Первые 30 дней после прилёта в **HKT** — три параллельных контура: **иммиграционный статус** (штамп безвиза / виза / DTV), **адрес и TM30** (аренда или отель с уведомлением), **быт и деньги** (SIM, счёт, страховка). Они связаны, но идут через разные каналы: Immigration Bureau, арендодатель или hotel manager, банк и страховщик.",
      "Безвиз **30 дней** с 15.09.2026 — это **разрешение на пребывание**, которое officer ставит при въезде; оно **не заменяет** долгосрочную визу и **не возникает** от покупки недвижимости. DTV, LTR и Thailand Privilege — **отдельные** маршруты до или после прилёта; детали — в pillar и будущем [immigration guide](/notes/" +
        IMMIGRATION_SLUG +
        ").",
      "Для семьи: у каждого взрослого и ребёнка — свой штамп/виза и свой TM30 по месту фактического проживания; «один договор на всех» не отменяет индивидуальный учёт Immigration.",
      "Паспорт: посольство уточняет, что при безвизе officer обычно даёт 30 дней, если validity паспорта больше 30 дней; при меньшем сроке — stay не длиннее validity. Авиакомпании **могут** требовать 6 месяцев validity при посадке — это уже их правила, не текст штампа.",
      "Обратный билет: для туристического безвиза на check-in часто просят подтверждение выезда в разумном окне; храните PDF в телефоне. Это не заменяет иммиграционный plan, но снижает stress в HKT.",
    ],
    bullets: [
      "Въезд без визы РФ — до 30 дней по соглашению (с 15.09.2026 вместо прежних 60 дней общего режима).",
      "TM30 — обязанность **принимающей стороны**; попросите копию/скрин receipt.",
      "Extension / смена статуса — Immigration Phuket или Бангкок по правилам категории.",
      "TIN / tax — только если доход в Таиланде или локальный business; см. [налоговый ID](/notes/" + TIN_PHUKET_SLUG + ").",
      "Страховка — часто условие виз и здравый смысл на острове; см. [здоровье](/notes/" + HEALTH_SLUG + ").",
      "Condo purchase — Land Department + foreign quota; **не** shortcut к визе без отдельного основания.",
    ],
  },
  {
    heading: "Календарь mes 1: 72 часа → неделя 4",
    section_kind: "action_guide",
    paragraphs: [
      "Этот note — **маршрут по неделям**, не энциклопедия. Детали SIM, аренды, банка и Immigration — в sibling guides; здесь только **когда** их открывать.",
      "**72 часа** после HKT: Thai SIM/eSIM (AIS, DTAC, True — в аэропорту или 7-Eleven), Grab/Bolt/LINE, temporary жильё на 2–4 недели с **письменным** обязательством хозяина подать TM30. Сфотографируйте страницу паспорта со **штампом** и дату expiry — от неё считается безвиз. Не подписывайте годовой lease в jet lag; сначала район — [районы Phuket](/notes/" +
        RAJONY_SLUG +
        ").",
      "**Неделя 1–2:** подтвердите TM30 (receipt от landlord или hotel). Если уже на **DTV/Non-O** — отметьте дедлайн **90-day report** в календаре. Начните KYC в Thai bank: паспорт, адрес из контракта, иногда visa stamp; порядок — [банк](/notes/" +
        BANK_SLUG +
        "). Параллельно — [SIM и utilities](/notes/" +
        SIM_UTILITIES_SLUG +
        ") (интернет дома, оплата condo fees если аренда в комплексе). Просмотры long-term — [аренда](/notes/" +
        ARENDA_SLUG +
        ") когда готовы deposit 2+1 month.",
      "**Неделя 3–4:** подпишите mid-term/long-term только после района и TM30-практики. Оформите expat health insurance до «случайного» визита в ER. Если безвиз заканчивается — **заранее** решите: extension (если доступно), переход на DTV **до** overstayer, или контролируемый выезд. К концу mes 1 должны быть: рабочая связь, подтверждённый адрес с TM30, план статуса на mes 2–3, черновик бюджета острова.",
      "Бюджет mes 1 на Пхукете сильно зависит от района: Rawai/Nai Harn и Phuket Town часто дешевле западных пляжей на 15–25% в long-term, но commute длиннее. Заложите deposit **2 месяца + 1 месяц вперёд** как типичный минимум в expat-сегменте; juristic person может просить дополнительные fees — это предмет [аренды](/notes/" +
        ARENDA_SLUG +
        "), не этого orchestrator.",
      "Транспорт: многие живут на scooter (Honda Click/Aerox) с helmet; IDP действует ограниченный срок, Thai license — отдельный слот transport satellite. Grab покрывает airport и вечерние поездки; в season пробки Kata–Patong закладывайте в time budget для Immigration.",
    ],
    bullets: [
      formatPracticeBullet({
        channels: ["nashi_phuket_chat", "pkhuket2"],
        period: "2025–2026",
        claim:
          "типичный порядок Phuket: SIM → temporary housing с TM30 → Thai bank attempt → страховка → long-term rent",
        forReader: "не копируйте EU-чеклист «сначала tax ID в Finanças»",
      }),
      "72h — SIM, apps, штамп в облаке, TM30 у хозяина.",
      "Sem 1–2 — TM30 receipt, bank KYC, utilities.",
      "Sem 3–4 — контракт, страховка, visa plan, Immigration slot если нужен.",
      "Не переводите deposit за год, пока не проверили TM30 и район.",
    ],
  },
  {
    heading: "Порядок шагов: SIM → жильё/TM30 → банк → здоровье → Immigration",
    section_kind: "practice",
    paragraphs: [
      "Полевой порядок Phuket (soft): **SIM первым** — PromptPay, 2FA банков и LINE с арендодателями завязаны на Thai number. **Жильё вторым** — без TM30 receipt вы уязвимы при проверках и при смене статуса. **Банк третьим** — политика KBank/Bangkok Bank/SCB к RU/BY паспортам **нестабильна**; имейте Wise/Revolut как мост, но renta в baht часто просит local account. **Здоровье четвёртым** — Bangkok Hospital Phuket, Siriroj, Mission — выберите до экстренного случая. **Immigration пятым** — extension, 90-day, DTV stamp — по календарю, не «когда-нибудь».",
      "**72 часа** закрывают связь, штамп и крышу с TM30; **неделя 4** — контракт, страховка и подтверждённый visa runway. Между ними — документы и банк, не «всё за один день в Chalermprakiat».",
      "LINE — де-факто рабочий мессенджер: landlord, motorbike rental и school admin отвечают там быстрее, чем в e-mail. Попросите add официальный account juristic person condo до перевода deposit.",
      "Если вы remote worker: не путайте **право пребывания** с **правом работать на тайскую компанию** — DTV и безвиз не дают автоматического work permit; локальный employer track — отдельная ветка, не mes 1 checklist.",
    ],
    bullets: [
      "SIM → housing + TM30 → bank → insurance → Immigration appointment.",
      "72h ≠ неделя 4: TM30 — в первые сутки; extension — до expiry штампа.",
      "No Portugal NIF order — другая страна и другие формы.",
    ],
  },
  {
    heading: "Что ломается к 4–6 месяцу, если mes 1 закрыли «на потом»",
    section_kind: "gap",
    paragraphs: [
      "Пропуск TM30, страховки или плана статуса в первый mes кажется «решим потом», но к **4–6 месяцу** на Пхукете стекаются **продление визы**, **90-day reports**, renta в baht, school fees и налоговые вопросы при локальном доходе. Overstayer fine и blacklist бьют сильнее, чем очередь в Immigration в неделю 1.",
      "Пропуск Thai bank в mes 1 оставляет вас на переводах SWIFT с комиссией и без PromptPay — landlord и condo juristic person часто хотят local transfer к mes 3–4.",
      "Вера в «**виза от квартиры**» без проверенного основания к mes 4–6 упирается в отказ Immigration и sunk cost сделки — pillar [Таиланд для россиян](/ru/guides/tailand-dlya-rossiyan-2026) разводит **property** и **status**.",
      "Школа: international schools (BCIS, UWC proximity, HeadStart и др.) требуют proof address и иногда visa category уже в mes 2 — waiting list на semester start закрывается раньше, чем кажется в mes 1. Даже без детей знайте, что districts guide влияет на commute.",
      "Налоги: если к mes 4–6 появляется локальный доход (rent out, Thai company, office), без TIN и понимания PDPA/accounting хвост бьёт сильнее, чем разовый штраф за scooter — см. [TIN guide](/notes/" +
        TIN_PHUKET_SLUG +
        ").",
    ],
    bullets: [
      "Sin TM30 receipt — риск штрафа host и проблем при extension.",
      "Sin visa plan — overstayer после 30-дневного безвиза с 15.09.2026.",
      "Sin insurance — ER счёт + отказ renewal DTV/LTR.",
      "Sin local bank — renta и condo fees дороже через SWIFT.",
      "Sin 90-day calendar — штраф на long-stay категориях.",
      "Копировать Spain TIE 30 días — wrong country, wrong forms.",
    ],
  },
  {
    heading: "Карта satellite: куда углубиться",
    section_kind: "practice",
    paragraphs: [
      "Этот чеклист — **маршрут**, не энциклопедия. Остальные Thailand satellite guides закрывают узлы, которые здесь только named:",
    ],
    bullets: [
      "[SIM, internet, utilities](/notes/" + SIM_UTILITIES_SLUG + ") — связь и дом mes 1.",
      "[TIN / tax ID](/notes/" + TIN_PHUKET_SLUG + ") — если локальный доход или business.",
      "[Аренда long-term](/notes/" + ARENDA_SLUG + ") — deposit, juristic person, foreign lease.",
      "[Районы Phuket](/notes/" + RAJONY_SLUG + ") — Bang Tao, Rawai, Phuket Town, Kata.",
      "[Банк и PromptPay](/notes/" + BANK_SLUG + ") — KYC RU/BY, Wise как мост.",
      "[Медицина и страховка](/notes/" + HEALTH_SLUG + ") — ER, стоматология, DTV proof.",
      "[Immigration Phuket](/notes/" + IMMIGRATION_SLUG + ") — extension, 90-day, очереди.",
      "Pillar: [Таиланд для россиян 2026](/ru/guides/tailand-dlya-rossiyan-2026) · хаб [/ru/thailand](/ru/thailand).",
    ],
  },
  {
    heading: "Типичные ошибки первого mes на Пхукете",
    section_kind: "practice",
    paragraphs: [
      "Остров прощает медленный тайский, но не пустой TM30 и не «безвиз бесконечно». Ниже — ошибки, которые RU-чаты повторяют чаще всего.",
      "Отдельный класс ошибок — **перенос EU-логики**: «сначала tax ID, потом адрес» (Portugal NIF), «empadronamiento = TM30» (Spain), «Schengen 90/180 = тайский безвиз» — всё это ломает порядок на острове. Thailand satellite inventory заточен под **HKT + Phuket Town Immigration**, не под Bangkok-only советы.",
    ],
    bullets: [
      "Годовой lease в первые 48 часов без района.",
      "Airbnb без TM30 от хозяина — «отель всегда сам» не ваш случай в villa.",
      "Ждать «визу от застройщика» вместо DTV/LTR/Privilege.",
      "Border run как единственный plan с ребёнком и школой.",
      "Один отказ банка — сдача; нужен второй филиал/банк.",
      "Чеклист Valencia/Lisboa — wrong immigration portal.",
      "Паспорт <6 месяцев — airline deny + короткий штамп.",
    ],
  },
  {
    heading: "День 0 в HKT: аэропорт и первая ночь",
    section_kind: "practice",
    paragraphs: [
      "Phuket International (HKT) — не Bangkok Suvarnabhumi: такси Grab/Bolt/Airport limo до temporary жилья в Rawai, Kata или Bang Tao. В первую ночь нужны три вещи: **SIM**, **адрес с Wi‑Fi** и **фото штампа** в облаке. Не обещайте landlord годовой контракт уставшими.",
      "Officer на паспорте решает **фактический** срок; при безвизе после 15.09.2026 ориентир — **до 30 дней**, не 60. Обратный билет или onward иногда спрашивают на check-in — держите маршрут правдоподобным.",
      "Customs: личные вещи обычно без drama; не ввозите drone без проверки правил CAAT. Наличные — declare по порогам; карты Visa/MC работают в супермаркете, но landlord deposit часто хочет transfer.",
      "Если landing ночью: 24h mini-mart и pharmacy реже на quiet beaches — закладывайте такси до Phuket Town или Rawai, где инфраструктура круглосуточнее.",
    ],
    bullets: [
      "SIM в arrivals или Central — unlimited data для карт.",
      "Grab preferred — фикс цена; избегайте «wild» taxi без meter.",
      "Temporary booking — pin для delivery и TM30 адрес.",
      "Фото штампа + TM6 number — в облако.",
      "Вода/7-Eleven — ближайший к жилью; кондиционер проверьте в первую ночь.",
    ],
  },
  {
    heading: "DTV, LTR, Privilege vs безвиз: ветки mes 1",
    section_kind: "gap",
    paragraphs: [
      "Этот checklist покрывает **прилёт и быт**; категория статуса выбирается **до** или **в** mes 1. **Безвиз 30 дней** — тест острова, не семейный plan на год. **DTV** — оформление через консульство до въезда, порог ~500k THB на счету и proof remote work ([консульские требования](https://thaiconsulatela.thaiembassy.org/en/publicservice/dtv-visa) — soft для RU, сверяйте jurisdiction). **LTR / Privilege** — отдельные пакеты и бюджеты; не смешивайте с «condo = visa».",
      "Если вы уже **inside** на безвизе — extension не безлимитен; планируйте DTV **до** красной даты штампа, не на день 29.",
      "Thailand Privilege и LTR — другие бюджеты и insurance proof; их не смешивайте с «дешёвым» mes 1 безвиза. BOI LTR Work-from-Thailand требует порог дохода и пакет от licensed agent — это mes 2–3 работа, но решение «идём в LTR» принимают в mes 1, иначе безвиз с 15.09.2026 заканчивается быстро.",
      "Дети: school deposit и visa status ребёнка должны совпадать; «родитель на DTV, ребёнок на безвизе tourist» — частая soft-ошибка в чатах, officer смотрит на каждого.",
    ],
    bullets: [
      "Безвиз — short test; mes 1 = TM30 + runway plan.",
      "DTV — consulate first; не «купил condo — получил DTV».",
      "LTR/Privilege — BOI/Privilege portals; отдельный бюджет.",
      "Семья — документы на каждого; сделка на одного не cover all.",
      "Wizard Emigro — если маршрут не выбран.",
    ],
  },
  {
    heading: "Wizard и Assist",
    section_kind: "practice",
    paragraphs: [
      "Если безвиз, DTV и покупка condo переплетены, прогоните факты через [Emigro Wizard](/ru/wizard?utm_source=emigro&utm_medium=guide&utm_campaign=30days-phuket&utm_content=pervye-30-dnej-phuket-2026). Для аудита порядка шагов, TM30 и visa runway — [Assist по Таиланду](/ru/assist?country=thailand&utm_source=emigro&utm_medium=guide&utm_campaign=30days-phuket&utm_content=pervye-30-dnej-phuket-2026). Подбор жилья на Пхукете — только с явным согласием на передачу партнёру из формы Assist.",
    ],
    bullets: [
      "Wizard — сопоставление маршрута без выбора страны заранее.",
      "Assist — разбор case, не substituto immigration lawyer.",
      "Satellite inventory — 15 notes Thailand; этот файл orchestrator.",
    ],
  },
];

const keyTakeaways = [
  "Официально: с 15.09.2026 безвиз РФ — до 30 дней по соглашению; TM30 подаёт host в 24h; покупка condo не равна автоматической визе.",
  formatPracticeTakeaway({
    channels: ["nashi_phuket_chat", "russianinphuket"],
    period: "2025–2026",
    claim:
      "orden típico Phuket mes 1: SIM → жильё с TM30 → bank attempt → страховка → Immigration по календарю",
    forReader: "72h — SIM + штамп + TM30; неделя 4 — контракт и visa plan",
  }),
  "Официально: permission to stay определяет officer на въезде; паспорт <30 дней valid — stay не длиннее validity ([посольство](https://moscow.thaiembassy.org/en/publicservice/102399-validity-of-passport-(30-day-visa-free))).",
  "На практике: пропуск TM30/visa plan в mes 1 → overstayer, SWIFT-renta и ER без страховки к 4–6 mes — см. sibling guides.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "С чего начать в первый день на Пхукете после HKT?",
    a: "По правилам — соблюдать срок штампа безвиза/визы и требования Immigration. На практике: SIM, temporary жильё, фото штампа и убедиться, что хозяин подаст TM30 в 24 часа — в первые 72 часа.",
  },
  {
    q: "Кто подаёт TM30 — я или арендодатель?",
    a: "По правилам §38 Immigration Act — **house owner, landlord или hotel manager** в течение 24 часов ([immigration.go.th](https://www.immigration.go.th/en/?p=14721)). На практике попросите copy receipt; без него сложнее extension и спор с juristic person.",
  },
  {
    q: "72 часа vs неделя 4 — в чём разница?",
    a: "По правилам не все trámites срочны в один день. На практике: 72h = SIM + штамп + TM30 + temporary адрес; неделя 4 = long-term контракт, страховка, bank и решение по DTV/extension.",
  },
  {
    q: "Достаточно ли безвиза 30 дней для семьи на полгода?",
    a: "По правилам безвиз — **временный** въезд до 30 дней (с 15.09.2026 для РФ). На практике для полугода нужны DTV, LTR, Privilege или иная **оформленная** категория — не «просто остаться».",
  },
  {
    q: "Купили condo — виза уже есть?",
    a: "По правилам владение condo ≠ автоматический иммиграционный статус; приказы 237/2568 и 238/2568 не заменяют проверку вашего основания. На практике сделку и visa track ведите **раздельно**; см. pillar и [Immigration guide](/notes/" + IMMIGRATION_SLUG + ").",
  },
  {
    q: "Где полный чеклист по стране?",
    a: "Pillar [Таиланд для россиян 2026](/ru/guides/tailand-dlya-rossiyan-2026) на emigro.online; этот note — satellite orchestrator **Phuket**.",
  },
];

export const PERVYE_30_PHUKET_GUIDE: ThailandEditorialGuide = {
  slug: PERVYE_30_PHUKET_SLUG,
  category: "Первый месяц",
  content_kind: "guide" as ContentKind,
  title: "Первые 30 дней на Phuket: чеклист satellite 2026",
  excerpt:
    "72h → неделя 4: SIM, TM30, Thai bank, страховка, visa runway — orchestrator Phuket с seven core guides. Безвиз 30 дней с 15.09.2026 для РФ. Пропуск mes 1 бьёт overstayer и renta к 4–6 месяцу. Condo ≠ автовиза. Wizard и Assist.",
  seo_title: "Первые 30 дней Пхукет 2026 — checklist переезд",
  seo_description:
    "Первые 30 дней Пхукет 2026: SIM, TM30, аренда, банк, Immigration. Порядок 72 ч → 4-я неделя для RU; безвиз 30 дней с 15.09.2026. Не копируйте EU-чеклист.",
  quick_answer:
    "Первые 30 дней на Пхукете: в первые 72 часа — Thai SIM, temporary жильё, фото штампа безвиза (с 15 сентября 2026 для РФ до 30 дней, не 60) и TM30 от арендодателя в 24 часа. Недели 1–2 — receipt TM30, попытка Thai bank, utilities; недели 3–4 — страховка, long-term аренда и план DTV/extension до expiry. Покупка condo не даёт визу автоматически. К 4–6 месяцу проверьте 90-day reports, renta в baht и статус без overstayer.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    {
      title: "Посольство Таиланда — безвиз с 15.09.2026",
      url: "https://moscow.thaiembassy.org/en/publicservice/revision-of-thailand-s-visa-exemption-and-visa-on-arrival-schemes",
    },
    {
      title: "Immigration — TM30 notification",
      url: "https://www.immigration.go.th/en/?p=14721",
    },
    {
      title: "TM30 online portal",
      url: "https://tm30.immigration.go.th/",
    },
    {
      title: "Pillar — Таиланд для россиян",
      url: "https://www.emigro.online/ru/guides/tailand-dlya-rossiyan-2026",
    },
  ],
  topic_tags: ["phuket", "checklist", "tm30"],
  hashtags: buildNoteHashtags({
    topicTags: ["phuket", "checklist", "tm30"],
    contentKind: "guide",
    extra: ["30days", "satellite", "thailand"],
  }),
  source_channel: "nashi_phuket_chat+pkhuket2+info_phuket",
  source_label: "editorial:thailand-30-days-gold-phuket-2026",
  pillar_guide_slug: "tailand-dlya-rossiyan-2026",
};

export default PERVYE_30_PHUKET_GUIDE;
