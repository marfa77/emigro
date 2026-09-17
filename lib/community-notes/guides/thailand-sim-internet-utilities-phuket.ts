/**
 * Hand-curated Thailand satellite guide — SIM/eSIM, home fibre, PEA/PWA on Phuket.
 * Official NBTC / operator / utility pages separated from field practice in RU chats.
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import {
  formatPracticeBullet,
  formatPracticeTakeaway,
} from "@/lib/community-notes/practice-format";
import type { ThailandEditorialGuide } from "@/lib/community-notes/guides/thailand-editorial-index";
import type {
  CommunityNoteFaq,
  ContentKind,
  GlossaryTerm,
  NoteBodySection,
} from "@/lib/community-notes/types";

export const SIM_INTERNET_SVET_VODA_SLUG = "sim-internet-svet-voda-phuket-2026";

const PILLAR_SLUG = "tailand-dlya-rossiyan-2026";

const GLOSSARY_INTRO =
  "Эти слова всплывают в AIS Shop, в квитанции PEA, в письме от juristic person кондо и в чате арендодателя ещё до того, как вы разложили чемоданы на Пхукете. Разберём заранее — так проще не перепутать Tourist SIM с «обычным» prepaid и не ждать fibre там, где в доме нет точки оператора.";

const LOCAL_TERMS: GlossaryTerm[] = [
  {
    pt: "NBTC",
    context: "National Broadcasting and Telecommunications Commission",
    ru: "регулятор связи; лимиты регистрации SIM для иностранцев, правила Tourist SIM и liveness-проверки у операторов",
  },
  {
    pt: "Tourist SIM",
    ru: "туристический prepaid у AIS / True / dtac; по мерам NBTC срок использования не более 60 дней, продление одним top-up не заменяет повторную идентификацию",
  },
  {
    pt: "prepaid (regular)",
    ru: "обычный предоплатный номер, оформленный на паспорт в фирменном салоне; для долгого проживания предпочтительнее tourist-пакета в аэропорту",
  },
  {
    pt: "eSIM",
    ru: "виртуальная SIM; у AIS/True есть онлайн и салонные потоки, но KYC и продукт (tourist vs resident) нужно сверять до оплаты",
  },
  {
    pt: "PEA",
    context: "Provincial Electricity Authority",
    ru: "региональная сеть электричества на Пхукете; лицевой счёт, депозит (หลักประกัน), перенос имени через офис или PEA Smart Plus",
  },
  {
    pt: "PWA",
    context: "Provincial Waterworks Authority",
    ru: "водоканал; заявка «เป็นชาวต่างชาติ» онлайн или в офисе, для арендатора часто нужно согласие владельца и house registration",
  },
  {
    pt: "house registration",
    context: "ทะเบียนบ้าน",
    ru: "регистрация дома/юнита; PEA и PWA запрашивают копию по адресу подключения — у арендатора её даёт собственник или juristic office кондо",
  },
  {
    pt: "juristic person",
    ru: "управляющая компания кондоминиума; выдаёт письма для utilities, пропуска, иногда копии house registration по внутренним правилам",
  },
  {
    pt: "common fee",
    ru: "ежемесячный взнос в кондо (охрана, бассейн, lift); не путать с PEA/PWA — оплачивается отдельно juristic person",
  },
];

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(LOCAL_TERMS, GLOSSARY_INTRO),
  },
  {
    heading: "Nota Emigro (fact-check)",
    section_kind: "official",
    paragraphs: [
      "Короткая сверка черновика с NBTC/операторами, PEA, PWA и полевой практикой чатов — без вырезания текста. **OK** = совпадает с официальной страницей; **soft** = ориентир рынка/чатов; **fixed** = смягчено под норму; **UNCHECKED** = не подтверждено fetch в этой сессии.",
    ],
    bullets: [
      "OK: NBTC — лимит **не более 3 номеров на человека на одного оператора** для иностранцев, верификация **оригинальным паспортом**; Tourist SIM **не более 60 дней**, после — повторная идентификация (меры NBTC 2025–2026, в т.ч. уведомление №2 от 16.05.2026 — soft: полный текст на nbtc.go.th за Cloudflare).",
      "OK: AIS — Tourist SIM: повторная идентификация после 60 дней через SMS 4444161 или AIS Shop ([ais.th tourist plan](https://www.ais.th/en/consumers/package/international/tourist-plan)); активация зарегистрированного номера **в течение 60 дней** от регистрации — иначе повторная верификация (тот же источник).",
      "OK: True/dtac Tourist SIM — регистрация паспортом, max 3 SIM/бренд, validity **не более 60 дней**, top-up **не продлевает** срок; продолжение — re-identify в True dtac Shop или call center ([true.th tourist](https://www.true.th/en/prepaid/sim/tourist)).",
      "OK / soft: liveness detection для новых регистраций — требование NBTC, внедрение операторами (Nation Thailand, NBTC commissioner statement); детали канала (app vs салон) — у конкретного оператора.",
      "OK: PEA — иностранец: копия **passport**, **house registration** по адресу, документ **право пользования** (ownership/lease); заявки через [pea.co.th](https://www.pea.co.th), PEA Smart Plus, офисы; перенос имени — PDF «การโอนชื่อผู้ใช้ไฟฟ้า» на pea.co.th.",
      "OK: PWA — customer guide: ID заявителя; если заявитель **не владелец/не occupant** — согласие владельца и house registration ([pwa.co.th customer guide EN](https://www.pwa.co.th/en/contents/service/customer-guide)); онлайн-форма с флагом **เป็นชาวต่างชาติ** — [customer-application.pwa.co.th](https://customer-application.pwa.co.th/register-service/add).",
      "Soft: типичный счёт PEA 1-bed с кондиционером **1 500–3 500 THB/мес** — рынок Пхукета, не тариф PEA; официальная сетка — progressive residential на сайте PEA.",
      "Soft: fibre **500 Mbps ~500–700 THB/мес** — ориентир AIS/True/3BB на Пхукете; точная цена только после проверки адреса.",
      "UNCHECKED: сумма **หลักประกัน** PEA для конкретного юнита на Пхукете — зависит от типа счётчика и договора; не копируйте цифры из expat-блогов без presupuesto PEA.",
      "UNCHECKED: juristic office каждого кондо выдаёт house registration копию арендатору — внутренний регламент; soft-verify у управляющей до подписи lease.",
    ],
  },
  {
    heading: "Официально: мобильная связь и NBTC",
    section_kind: "official",
    paragraphs: [
      "Таиланд не EU: номер телефона — не «SIM в Duty Free без имени», а **зарегистрированная линия на titular**. NBTC обязует операторов собирать данные абонента, ограничивать злоупотребления (мошенничество, SIM box) и применять **liveness** при регистрации новых линий и смене SIM с сохранением номера.",
      "Для **иностранца без тайского ID** базовый документ — **оригинал passport**. Work permit как универсальное условие для prepaid в мерах NBTC не фигурирует; конкретный продукт (Tourist vs regular prepaid vs postpaid) оператор может ограничить каналом продажи.",
      "Жёсткое правило 2025–2026: **не более трёх активных номеров на одного человека на одного оператора** (AIS, True, dtac считаются отдельно после слияния True+dtac бренда — уточняйте в салоне, какой «бренд» в договоре). **Tourist SIM** — отдельный продукт с **потолком 60 дней**; «докупил пакет — продлил год» для tourist **не работает** по правилам AIS и True/dtac — нужна **re-identification**.",
      "Международный **travel eSIM** (Airalo/Holafly и т.п.) даёт data roaming, но **не заменяет** тайский номер для банков, Immigration SMS и длинного lease — это мост на 48–72 часа, не home_setup.",
    ],
    bullets: [
      "Регистрация: passport in person в authorized dealer / AIS Shop / True dtac Shop; приложения операторов — с liveness и PDPA.",
      "Tourist SIM: max 60 days → re-verify (AIS SMS 4444161 или салон; True — shop 1242/1678).",
      "Regular prepaid: просите в салоне явно **не Tourist**, регистрацию на passport и печать/скрин subscriber data.",
      "Postpaid и fibre bundle: чаще нужны стабильный адрес, иногда credit check — soft; не обещайте «postpaid в день прилёта».",
      "Port-in номера: отдельная процедура от PEA/PWA; сохраняйте SIM holder и receipt.",
    ],
  },
  {
    heading: "Официально: домашний интернет (fibre / FWA)",
    section_kind: "official",
    paragraphs: [
      "На Пхукете домашний интернет — **контракт оператора** (AIS Fibre, True Online, 3BB и др.), а не «розетка в стене как в EU». Оператор проверяет **coverage по адресу** (condo tower, villa soi, Rawai vs Kathu) — не по «району в Telegram».",
      "Titular контракта — тот, кто подписывает и платит; арендодатель **не обязан** быть в договоре, если вы inquilino с passport и способом оплаты. В **condo** часто нужно письмо **juristic person** на установку или использование существующей точки — это house rules, не NBTC.",
      "Срок установки на сайтах — «несколько рабочих дней»; в высокий сезон и в виллах без готового drop **1–2 недели** — soft, не SLA Emigro. **FWA/5G home** — запасной вариант, если FO не дошла до юнита.",
    ],
    bullets: [
      "Проверка адреса: сайты AIS/True/3BB — condo name + unit или villa address.",
      "Документы: passport, контакт, иногда lease + juristic letter (soft по дому).",
      "Оборудование: router часто в аренде у оператора; при переезде — return или штраф по контракту.",
      "Связка fibre + mobile postpaid — скидка, но длиннее KYC; до bank account часто разумнее prepaid + fibre отдельно.",
      "Смена titular fibre — через оператора, не через PEA.",
    ],
  },
  {
    heading: "Официально: PEA (свет) и PWA (вода)",
    section_kind: "official",
    paragraphs: [
      "Пхукет — зона **PEA** (не MEA Бангкок). Электричество: **лицевой счёт** на titular, **депозит (หลักประกัน)** до подключения по правилам PEA, ежемесячные счета по tiered tariff. **Перенос имени** (โอนเปลี่ยนเจ้าของ) — когда счётчик уже есть: заявление, passport, house registration, документ на право пользования; часть шагов — **PEA Smart Plus** без визита (официальные посты PEA).",
      "Новое подключение (**ขอใช้ไฟฟ้า**) дороже и дольше transfer: возможны работы по линии, если точки не было. Для **foreign individual** PEA перечисляет: passport, house registration по адресу, proof of ownership/occupancy ([eservice.pea.co.th individual](https://eservice.pea.co.th/cos/individual/)).",
      "Вода **PWA**: заявитель — passport (онлайн «foreigner»); если вы **не owner/occupant** в house book — **letter of approval** владельца и его ID + house registration (англ. customer guide PWA). Счёт воды обычно скромный в THB, но **долг на старом titular** блокирует transfer — проверяйте meter reading при acte de entrega.",
      "В **condo** PEA/PWA счёт часто оформлен на **juristic person** или owner; lease может требовать **перевод на арендатора** или оплату по QR без transfer — это **cláusula contrato**, не «так везде в Таиланде».",
    ],
    bullets: [
      "PEA hotline **1129**; outages — также **1134** (24h) по island practice.",
      "PWA: офис + онлайн customer application; foreigner flag в форме.",
      "Депозит PEA: оплачивается до energization по тарифам PEA — сумму берите из офиса/app, не из чата.",
      "Gas: в типичном condo — **LPG баллон**, не mains; отдельный vendor, не PWA.",
      "Common fee кондо: juristic invoice — не включайте в «коммуналку PEA» в бюджете.",
    ],
  },
  {
    heading: "Практика Пхукет: аэропорт HKT, eSIM и салон",
    section_kind: "practice",
    paragraphs: [
      "Аэропорт **HKT** (International Hall, baggage claim) — официальные точки **AIS** и **True** ([AIS where-to-buy](https://www.ais.th/en/consumers/package/international/tourist-plan/where-to-buy)). Это быстрый интернет в день прилёта, но продукт чаще **Tourist SIM** с потолком **60 дней** — для [первых 30 дней](/notes/" +
        PILLAR_SLUG +
        ") норм, для полугода — планируйте второй шаг в салоне.",
      "Разумный маршрут: **день 1** — Tourist SIM или travel eSIM для Grab/банка; **неделя 1–2** после выбора района — **AIS Shop / True dtac Shop** (Central Festival, Jungceylon, Phuket Town) с passport: **regular prepaid** или eSIM с подтверждённой регистрацией; попросите показать, что номер **не tourist-only**.",
      "7-Eleven продаёт SIM нерегулярно — в чатах массовые отказы «нет в наличии»; не стройте setup на этом канале.",
    ],
    bullets: [
      formatPracticeBullet({
        channels: ["nashi_phuket_chat", "pkhuket2", "russianinphuket"],
        period: "2025–2026",
        claim:
          "в HKT брали AIS/True tourist в зоне baggage; через 4–8 недель шли в Central Festival AIS Shop за regular prepaid на тот же passport",
        forReader:
          "сохраните receipt; для банка и Immigration лучше один long-term номер с подтверждённой регистрацией",
      }),
      "Airport eSIM online (AIS eSIM page) — проверьте tourist vs exclusive plan до оплаты.",
      "dtac/True merge: салоны брендированы True dtac — уточняйте, какой prepaid portfolio активен.",
      "Dual SIM: тайский номер + home roaming — следите за 2FA банков РФ/ЕС отдельно.",
      "Wi‑Fi condo/Airbnb — не замена для SMS от Thai bank и DTV/LTR переписки.",
    ],
  },
  {
    heading: "Практика: аренда, депозиты, juristic office",
    section_kind: "practice",
    paragraphs: [
      "Типовой **lease** на Пхукете: **2 депозита + 1 месяц** (2+1) или **1+1** в low season — это **dogovor**, не закон «для всех». **Utilities deposit** (PEA) — **отдельно** от rental deposit; не смешивайте в одной cash payment агенту без receipt.",
      "До подписи попросите: **последний счёт PEA/PWA**, фото счётчиков, **common fee** rate, правила **juristic** (passport copy, workmen, pets). Если owner держит PEA на себе — зафиксируйте в lease: **кто платит**, **как передаётся QR/bill**, штраф за просрочку.",
      "**Juristic person** выдаёт: пропуск, иногда **letter for PEA/PWA/fibre**, копию house registration — срок **1–3 рабочих дня**; в peak season дольше. Без письма fibre в новом tower иногда не ставят — не «оператор плохой», а internal rule.",
      "Scam-сигналы: «оплатите PEA deposit только наличными агенту без PEA receipt»; «SIM уже зарегистрирована на тайца — вам не надо passport»; «utilities включены» без строк в lease и без sample bill.",
    ],
    bullets: [
      formatPracticeBullet({
        channels: ["info_phuket", "thailand_chatik"],
        period: "2025–2026",
        claim:
          "перенос PEA на passport арендатора занимал 3–7 рабочих дней после lease + house reg от juristic; в villa без juristic нужен owner at PEA office",
        forReader:
          "не включайте кондиционер «на максимум» до первого счёта — tiered tariff бьёт по kWh",
      }),
      "Rental deposit возврат: часто **30–45 дней** после checkout — не ждите в день выезда.",
      "TM30/Immigration — вне scope этого гайда; номер телефона и адрес utilities должны **не противоречить** lease.",
      "Villa pool pump + AC: PEA bill **3 000–6 000+ THB** — soft; заложите в бюджет месяца 2–3.",
      "Оплата: 7-Eleven / bank app по barcode на счёте — стандарт island practice.",
    ],
  },
  {
    heading: "Где официальный сайт и чат расходятся",
    section_kind: "gap",
    paragraphs: [
      "Операторы рекламируют «unlimited» tourist data, а NBTC режет **срок SIM**, не гигабайты. В чатах пишут «top-up продлевает на год» — для **Tourist SIM** это **расходится** с AIS/True T&C.",
      "PEA Smart Plus обещает transfer online, но **foreign passport + lease + house reg** часто упираются в **ручную проверку** — «онлайн за 5 минут» vs **3–7 дней**.",
    ],
    bullets: [
      "«Куплю SIM без passport» → блокировка линии и риск для banking KYC.",
      "«Utilities включены в 25k THB rent» → часто только **common fee** или только **water**; PEA отдельно.",
      "«Fibre 500 Mbps везде на Пхукете» → coverage by building; villa in Soi — FWA или 4G router.",
      "«Owner всегда платит PEA» → lease может обратное; спор — contract, не «тайская традиция».",
      "«eSIM в HKT = postpaid» → проверьте product code на receipt.",
      "Ожидание: счёт PEA «как в EU kWh» → tier blocks + fuel adjustment — читайте breakdown.",
    ],
  },
  {
    heading: "Типичные ошибки и мошенничество",
    section_kind: "practice",
    paragraphs: [
      "Большинство срывов в месяц 1 — не «Таиланд сложный», а **не тот продукт**: tourist вместо regular, **новый meter PEA** вместо transfer, fibre заказ до **juristic letter**, или **наличные агенту** без utility receipt.",
    ],
    bullets: [
      "Ошибка: три tourist SIM у одного бренда — упираетесь в лимит NBTC; закройте лишние в салоне.",
      "Ошибка: 60 дней tourist прошли — номер умер; банк SMS не доходит; re-ID не сделали.",
      "Ошибка: PEA остался на owner — долг копится, арендатор не видит bill.",
      "Ошибка: нет фото meter start — спор с landlord при выезде.",
      "Scam: «дешёвый интернет» через чужой registered SIM — связь с fraud enforcement 2025–2026.",
      "Ошибка: пить tap без filter — PWA quality ≠ EU; бутылка/filter — бытовая норма expat.",
    ],
  },
  {
    heading: "К 4–6 месяцу: что откладывают и чем бьёт",
    section_kind: "practice",
    paragraphs: [
      "К **4–6 месяцу** на Пхукете у релоканта уже паттерн жизни: visa run заменён на **DTV/LTR** или продление, банк, школа, постоянный район. Всплывает то, что в месяц 1 казалось мелочью: **tourist SIM** без re-ID, **PEA** на landlord, **fibre** с annual prepay, **common fee** debt блокирует juristic letter для renovation.",
      "К 4–6 месяцу Thai bank и employer ожидают **стабильный номер**; смена passport (renewal RF) — **обновите данные у оператора** (soft: NBTC кампании update passport до 30.08.2026 — UNCHECKED exact sanction). Переезд в другой district без **закрытия PEA/PWA** — debt follows meter.",
      "Если маршрут **DTV/LTR/безвиз 30 дней** не сходится с фактическими контрактами — [Emigro wizard](https://www.emigro.online/ru/wizard) и [Assist по Таиланду](https://www.emigro.online/ru/assist?country=thailand): не для выбора пакета AIS, а чтобы связать статус, адрес и бюджет utilities.",
    ],
    bullets: [
      "К 4–6 месяцу: tourist SIM expired — потеря номера для 2FA и messenger.",
      "К 4–6 месяцу: PEA debt на старом titular — disconnect + новый deposit.",
      "К 4–6 месяцу: fibre contract 12 mo — штраф при переезде на другой beach.",
      "К 4–6 месяцу: juristic blacklist за unpaid common fee — нет letter для fibre/AC service.",
      "К 4–6 месяцу: три passport SIM на AIS — не добавить линию для ребёнка без закрытия старых.",
    ],
  },
];

const keyTakeaways = [
  "Официально: NBTC — passport, max 3 номера/оператор; Tourist SIM ≤60 дней, затем re-ID (AIS, True/dtac). PEA/PWA — отдельные titular с house registration и lease/owner consent.",
  formatPracticeTakeaway({
    channels: ["nashi_phuket_chat", "pkhuket2"],
    period: "2025–2026",
    claim:
      "день 1 — tourist/eSIM в HKT; неделя 2 — regular prepaid + заявка PEA transfer после house reg от juristic",
    forReader:
      "не смешивайте rental deposit и PEA หลักประกัน; храните receipts отдельно",
  }),
  "Расхождение: «top-up продлевает tourist» vs официальные T&C AIS/True — нужна повторная идентификация.",
  "На практике: к 4–6 месяцу больнее всего просроченный tourist, PEA на landlord и fibre с годовым контрактом — закройте titular и номер до рутины visa/bank.",
  "Juristic + lease: без sample PEA bill и meter photo вы спорите вслепую при выезде.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Можно ли в день прилёта на Пхукет получить местный номер без визы DTV/LTR?",
    a: "По правилам NBTC иностранец регистрирует prepaid на **оригинал passport**; категория визы для базового prepaid не указана как барьер в мерах NBTC. На практике в HKT и салонах оформляют Tourist или regular prepaid; для stay >60 дней plan regular + re-ID tourist до истечения срока.",
  },
  {
    q: "eSIM в аэропорту или физическая SIM — что лучше для полугода?",
    a: "По правилам AIS/True eSIM и физическая SIM проходят тот же KYC; tourist eSIM наследует лимит **60 дней**. На практике expat на 6+ месяцев берёт **regular prepaid или postpaid** в фирменном салоне после выбора района; travel eSIM — мост на первые дни.",
  },
  {
    q: "На чьё имя оформлять PEA и PWA — арендатора или владельца?",
    a: "По правилам PEA/PWA titular может быть occupant с passport, house registration и proof of occupancy; если не owner — **согласие владельца** (PWA guide). На практике в condo lease часто требует transfer на арендатора или оплату по счёту owner — проверьте cláusula до ключей.",
  },
  {
    q: "Сколько стоит депозит PEA и вход в воду?",
    a: "По правилам PEA взимает **หลักประกัน** по тарифам до подключения; PWA — fees по customer guide и online form. На практике суммы на Пхукете **не унифицированы** в одной строке для всех юнитов — получите presupuesto в PEA Smart Plus/офисе, не копируйте чат-цифры.",
  },
  {
    q: "Что ломается к 4–6 месяцу, если utilities «на потом»?",
    a: "По правилам impay/debt ведёт к solleciti и отключению supply; tourist SIM — к блокировке номера после 60 дней. На практике к месяцу 4–6 накапливаются **PEA tier summer bill**, **common fee** debt у juristic и **fibre penalty** при переезде — закройте titular в первые 2–3 недели после lease.",
  },
];

export const SIM_INTERNET_UTILITIES_PHUKET_GUIDE = {
  slug: SIM_INTERNET_SVET_VODA_SLUG,
  category: "Связь и ЖКХ",
  content_kind: "guide" as ContentKind,
  title: "SIM, интернет, свет и вода на Пхукете: 2026",
  excerpt:
    "Tourist SIM в HKT vs regular prepaid, AIS/True/dtac и fibre по адресу, перенос PEA/PWA на арендатора, juristic office и депозиты — порядок для Phuket без выдуманных тарифов.",
  seo_title: "SIM и коммуналка Пхукет 2026: PEA PWA",
  seo_description:
    "SIM, fibre, свет PEA и вода PWA на Пхукете 2026: NBTC 3 SIM, tourist 60 дней, juristic, lease. Практика RU-релокантов vs официальные правила.",
  quick_answer:
    "На Пхукете в день прилёта удобен Tourist SIM или eSIM в HKT (AIS/True), но NBTC и операторы ограничивают tourist **60 днями** — для полугода оформите **regular prepaid** на passport в салоне (до 3 номеров на оператора). Домашний интернет — контракт AIS/True/3BB по coverage адреса; в кондо часто нужно письмо juristic. Свет **PEA**, вода **PWA**: passport, house registration, lease; перенос имени через PEA Smart Plus или офис. Депозит PEA отдельно от rental deposit. К 4–6 месяцу критичны просроченный tourist, счёт на landlord и долг common fee.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "AIS — Tourist SIM (NBTC 60 days)", url: "https://www.ais.th/en/consumers/package/international/tourist-plan" },
    { title: "True — Tourist SIM terms", url: "https://www.true.th/en/prepaid/sim/tourist" },
    { title: "PEA — заявка физлица (foreign)", url: "https://eservice.pea.co.th/cos/individual/" },
    { title: "PEA — главный портал", url: "https://www.pea.co.th" },
    { title: "PWA — customer guide (EN)", url: "https://www.pwa.co.th/en/contents/service/customer-guide" },
    { title: "PWA — online заявка (foreigner)", url: "https://customer-application.pwa.co.th/register-service/add" },
  ],
  topic_tags: ["sim", "internet", "utilities", "phuket", "thailand"],
  hashtags: buildNoteHashtags({
    topicTags: ["sim", "internet", "utilities", "phuket", "thailand"],
    contentKind: "guide",
    extra: ["pea", "pwa", "nbtc", "esim", "condo"],
  }),
  source_channel: "nashi_phuket_chat+pkhuket2+info_phuket+russianinphuket+thailand_chatik",
  source_label: "editorial:home-setup-phuket",
  pillar_guide_slug: PILLAR_SLUG,
} satisfies ThailandEditorialGuide;
