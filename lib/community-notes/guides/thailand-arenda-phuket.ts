/**
 * Long-term rent Phuket 2026 — condo/villa, TM30, OCPB leasing rules.
 * Gold CORE slot (rent). Voice: seasoned market advisor.
 * Official Thai law first; SERP/practice secondary. Nota Emigro overlays.
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

export const ARENDA_PHUKET_DOLGOSROK_SLUG = "arenda-phuket-dolgosrok-2026";

const THAILAND_PILLAR_SLUG = "tailand-dlya-rossiyan-2026";

const RENT_GLOSSARY_INTRO =
  "Термины из lease agreement, переписки с landlord/agent и квитанций juristic person — чтобы на viewing в Rawai или Kamala понимать, long-term это или скрытый Airbnb, а не кивать на каждое английское слово.";

const LOCAL_TERMS: GlossaryTerm[] = [
  {
    pt: "hire of property",
    context: "CCC §537",
    ru: "договор найма недвижимости в Таиланде; письменное подтверждение обязательно для судебной защиты арендатора",
  },
  {
    pt: "security deposit",
    ru: "залог (депозит); условия возврата — только из договора и применимых норм, не «единый закон для всех»",
  },
  {
    pt: "TM30",
    ru: "уведомление о месте проживания иностранца; по Immigration Act §38 подаёт landlord/владелец жилья в течение 24 часов",
  },
  {
    pt: "condominium / juristic person",
    ru: "кондоминиум с управляющей компанией; отдельные правила foreign quota на **покупку**, не на аренду, но устав может ограничивать срок и sublet",
  },
  {
    pt: "common area fee",
    ru: "ежемесячный взнос за общие зоны кондо (бассейн, охрана); часто **не** входит в rent",
  },
  {
    pt: "contract-controlled business",
    context: "OCPB B.E. 2568",
    ru: "регулируемый найм жилья у арендодателя с **≥3** жилыми объектами; отдельные потолки депозита/аванса и сроки возврата",
  },
  {
    pt: "short-term lease",
    context: "≤3 years",
    ru: "краткосрочный найм по классификации OCPB; не путать с Hotel Act / nightly Airbnb",
  },
  {
    pt: "Chanote / condo title",
    ru: "тип права на землю/юнит; при сомнениях в «вилле с участком» сверяют, кто реальный lessor и есть ли право сдавать",
  },
];

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(LOCAL_TERMS, RENT_GLOSSARY_INTRO),
  },
  {
    heading: "Nota Emigro (fact-check)",
    section_kind: "official",
    paragraphs: [
      "Короткий разбор мифов из RU-чатов и агрегаторов — без вырезания практики. **OK** = подтверждено официальным текстом или страницей госоргана; **soft** = рынок Пхукета 2025–2026; **fixed** = смягчено под рамку закона. Аудитория: RU/BY/UA/KZ с DTV/LTR/безвизом и горизонтом 6–12+ месяцев на Пхукете.",
    ],
    bullets: [
      "Fixed: «депозит по закону всегда 1 месяц» → **единого потолка депозита в Civil and Commercial Code (CCC) для частного найма нет**. Потолки **депозит + advance rent** (3 месяца при помесячной оплате или 1 год при годовой) — у **арендодателей в статусе contract-controlled business** (OCPB Notification B.E. 2568, с 4 сентября 2025), не у каждого частника с одной квартирой.",
      "OK: CCC **§538** — найм недвижимости не enforceable без **письменного доказательства** подписи ответственной стороны; срок **>3 лет** — только **3 года** без письменной регистрации у competent official; максимальный срок **§540** — **30 лет**.",
      "OK: Immigration Act **§38** + [Immigration Bureau TM30](https://www.immigration.go.th/en/?p=14721) — **landlord** (или manager отеля/гостевого дома) уведомляет о foreign guest **в течение 24 часов**; онлайн — [tm30.immigration.go.th](https://tm30.immigration.go.th/TM30/Foreigner/TM30EN/Home.html).",
      "OK: Condominium Act **§19/2** — foreign **ownership** в проекте capped **49%** площади юнитов; на **аренду** иностранцем это не переносится автоматически, но вилла «на земле» ≠ condo freehold.",
      "Soft: «2 месяца депозит + 1 месяц upfront» — типовой рынок Пхукета на 12-месячном контракте (агрегаторы и блоги 2026); не statutory cap для частного landlord.",
      "Soft: медиана long-term (апрель 2026, AIProperty): studio ~฿29k, 1BR ~฿37k, 2BR ~฿69k, villa 3BR ~฿126k — **не** официальная статистика DOL/REIC.",
      "Fixed: «Airbnb = тот же договор, только короче» → nightly / platform stay часто под **Hotel Act** и правилами juristic person / HOA; long-term lease — другой объект договора и рисков (TM30, коммуналка, возврат депозита).",
      "Soft / UNCHECKED: enforcement OCPB на конкретном agent с 5+ units в Rawai — жалоба через [complaint.ocpb.go.th](https://complaint.ocpb.go.th) или 1166; исход кейса в этой сессии не проверяли.",
    ],
  },
  {
    heading: "Официально: договор найма (CCC) и OCPB 2568",
    section_kind: "official",
    paragraphs: [
      "Долгосрочная аренда жилья на Пхукете для иностранца — это прежде всего **hire of property** по **Thai Civil and Commercial Code**, Book III, §537–571. Арендатор (hirer) и арендодатель (letter) согласуют срок, rent, депозит и обслуживание — но без **письменного доказательства** (§538) спор в суде резко сложнее. Договор на **более 3 лет** enforceable только на **3 года**, если не оформлен письменно и **не зарегистрирован** у competent official; абсолютный потолок срока — **30 лет** (§540) с возможностью renewal по соглашению.",
      "С **4 сентября 2025** действует **Notification of the Contract Committee on Residential Property Leasing as a Contract-Controlled Business B.E. 2568** ([OCPB](https://www.ocpb.go.th/news_view_en.php?nid=17943)): она касается **арендодателей с минимум тремя жилыми объектами** (раньше порог был выше). Для таких lessors запрещены условия, которые позволяют брать **security deposit + advance rent** больше **трёх месячных плат** при помесячной или «краткосрочной» схеме, или больше **годовой** rent при оплате раз в год. Возврат депозита — **сразу** при выезде; если нужен осмотр — **7 дней** без damage или **14 дней** после вычета подтверждённого ремонта (по пересказу notification в профессиональных обзорах; спорные суммы — Thai counsel).",
      "Частный владелец **одной** виллы или condo, который не попадает под «contract-controlled business», формально остаётся в рамке **CCC + вашего контракта**. Отсюда практика «2+1 месяца на входе» на рынке: она **не** означает, что государство разрешило любую сумму, и **не** означает, что OCPB-потолок автоматически действует на Facebook-landlord. Перед подписью фиксируйте: **deposit**, **first month**, **common fee**, **utilities**, **notice period**, **early termination**, язык договора (Thai имеет вес в суде — soft: общая практика, не пересказ одного блога).",
    ],
    bullets: [
      "Письменный lease + паспортные данные сторон, адрес unit/house, срок, rent, deposit, inventory.",
      "Срок >3 лет — планируйте **Land Office registration**, иначе защита только на 3 года (§538).",
      "OCPB 2568: regulated lessor (≥3 units) — caps на deposit+advance и сроки refund; жалоба OCPB **1166** / online complaint.",
      "Standard forms «Form A / Form B» на сайте OCPB — **не обязательны**, но запрещены противоречащие notification clausulae.",
      "CCC Book III (English reference): [Thailand Law Online §537–571](https://www.thailandlawonline.com/civil-and-commercial-code/537-571-lease-or-hire-of-property-laws).",
    ],
  },
  {
    heading: "Официально: TM30 и связь с визой",
    section_kind: "official",
    paragraphs: [
      "**TM30** — это не «виза арендатора», а **immigration notification of residence**. По **Section 38 Immigration Act 1979** владелец дома, head of household, **landlord** или manager licensed hotel/guesthouse обязан уведомить immigration **within 24 hours** с момента, когда foreign national **легально** проживает у них. На Пхукете это часто Bangkok Immigration Bureau jurisdiction для онлайн-системы; в province without immigration office — local police (см. [Immigration Bureau](https://www.immigration.go.th/en/?p=14721)).",
      "Landlord регистрируется на [tm30.immigration.go.th](https://tm30.immigration.go.th/TM30/Foreigner/TM30EN/Home.html), добавляет address (house registration / business license / condo docs), затем подаёт stay foreign tenant. Tenant должен дать **копию passport**, дату въезда, **TM6 arrival card number** — данные должны совпадать с штампом. Нижняя часть формы TM30 остаётся у notifying person — попросите **копию/скрин** для своего файла (soft: при 90-day report и продлении статуса спрашивают morada).",
      "**12-month lease ≠ право пребывания**: DTV, безвиз 30 дней, LTR и Thailand Privilege решаются отдельно. Можно подписать годовой контракт на DTV, но если immigration status не покрывает даты — проблема не в lease, а в visa/tax. См. [pillar Таиланд](/guides/" +
        THAILAND_PILLAR_SLUG +
        ") и [Assist Route Check](https://www.emigro.online/ru/assist?country=thailand&utm_source=emigro&utm_medium=guide&utm_campaign=phuket_rent).",
    ],
    bullets: [
      "До подписи спросите: «Who files TM30?» — если landlord отказывается, это red flag для long-term.",
      "При смене адреса внутри острова — новое уведомление (soft: практика immigration).",
      "Condo juristic office иногда помогает с TM30 — уточняйте письменно, это не их statutory duty.",
      "Официальная инструкция заполнения: [THAILAND.GO.TH — TM30](https://www.thailand.go.th/public/index.php/guide-book-detail/001_01_088).",
    ],
  },
  {
    heading: "Condo vs villa: что подписываете на Пхукете",
    section_kind: "official",
    paragraphs: [
      "**Condominium** — unit в зарегистрированном проекте + **juristic person** (управление, common fee, house rules). Иностранец **арендует** condo свободно, если owner имеет право сдавать; проверяйте, не запрещает ли **condo bylaws** short-term / subletting / minimum lease term. Foreign **purchase** quota **49%** floor area (Condominium Act §19/2) на покупку не распространяется на lease, но объясняет, почему «владелец-иностранец» в premium-проектах часто company или Thai nominee — **не** повод платить без проверки lessor.",
      "**Villa / house** на земле — часто lease от Thai individual или company; **foreigners не own land** outright (Land Code framework). Длинные «30-year lease + renewal» схемы для вилл — отдельный продукт покупки/структурирования, не типовой expat rent на 12 месяцев. На viewing villa: **Chanote/title**, кто подписывает, включены ли gardener/pool/cleaning, кто платит **property tax** (soft).",
      "**Serviced apartment / aparthotel** — могут быть ближе к hotel regulation; уточняйте, hotel license или residential lease, и кто делает TM30.",
    ],
    bullets: [
      "Condo: попросите **house rules**, размер **common area fee**, parking slot, pets.",
      "Villa: pool chemicals, mosquito, security — в annex к lease или отдельный service agreement.",
      "Foreign quota certificate — для **sale**, не для rent; но показывает легальность проекта.",
      "Official foreign ownership registration docs overview: [THAILAND.GO.TH — property registration](https://thailand.go.th/public/issue-focus-detail/010_011).",
    ],
  },
  {
    heading: "На практике: бюджеты, сезон и где искать",
    section_kind: "practice",
    paragraphs: [
      "На карточках агрегаторов цифра почти всегда — **monthly rate при 12-month contract**. **High season** (ноябрь–март) конкуренция выше: меньше торг, быстрее «deposit first». **Low season** (май–октябрь, особенно сентябрь) — больше vacant units, иногда **-10–15%** к asking или бесплатный второй месяц common fee (soft, чаты Phuket 2025–2026).",
      "Ориентиры **долгосрока** (не nightly Airbnb): **Kathu / Phuket Town / Chalong** — studio от ~฿10–18k; **Rawai / Chalong** — 1BR часто ~฿25–45k; **Kata/Karon beach** — premium; **Bang Tao / Surin / Kamala** — выше медианы острова; **villa 3BR+ pool** — от ~฿80k и выше (агрегаторы + полевые вилки). Всегда складывайте **rent + common fee + electricity + water + internet**.",
      "Каналы: Facebook groups, Telegram, **Facebook Marketplace**, локальные agencies (Phuket Property, etc.), русскоязычные брокеры — вторично после проверки договора. Idealista-style единого RU-портала нет; дубли объявлений с разными ценами — норма.",
      "SERP-конкуренты (RU/EN blogs 2026) повторяют одни hooks: «депозит 1–2 месяца», «TM30 обязателен», «вилла от 40k». Emigro добавляет различие **CCC vs OCPB**: не обещаем «закон = 2 месяца депозита», пока не знаем, regulated lessor это или частник. Для семьи с детьми смотрите **Cherng Talay / Phuket Town** (школы, less party noise), для nomad — **Rawai / Chalong** (кафе, fiber), для beach daily — **Kata/Karon** с premium budget.",
      "Перед transfer сравните **3 объекта all-in**: один «дешёвый» rent с x2 electricity может обойтися дороже condo с government tariff. Попросите **sample utility bill** за прошлый месяц (soft — не все покажут).",
    ],
    bullets: [
      "6-month contract — часто **+10–20%** к 12-month rate (рынок 2026).",
      "3-month «winter» — ближе к short-stay pricing; не путать с OCPB «short-term lease» legal term.",
      "Просмотр утром: шум стройки, запах сырости, давление воды, скорость интернета.",
      "Plan B район: если Patong/Kata дорого — Phuket Town + scooter/car commute.",
      formatPracticeBullet({
        channels: ["nashi_phuket_chat", "pkhuket2"],
        period: "2025–2026",
        claim:
          "landlords и agents на long-term чаще просят passport + deposit transfer до выдачи ключей, без Thai bank account",
        forReader:
          "готовьте Wise/THB transfer или cash receipt с подписью; IBAN в европейском смысле не используется",
      }),
    ],
  },
  {
    heading: "Договор, inventory, коммуналка и агент",
    section_kind: "action_guide",
    paragraphs: [
      "**Inventory** (фото/видео + signed checklist) — ваша страховка от удержания депозита за «старые» царапины. Фиксируйте **meter readings** water/electricity в день check-in. **Utilities**: в condo часто electricity **government rate + small admin** у regulated lessor; у частников встречается **markup 1.5–2×** на kWh — если не прописано, торгуйте или ищите другой объект (OCPB для regulated lessor требует обоснованные service charges и notice — soft).",
      "**Agent fee**: на Пхукете часто **half month to one month** from tenant или split — **не** как LAU Испании; всё negotiable. Проверка **owner**: copy Thai ID / company affidavit + **title deed / condo unit title** + match name on lease; если agent — **authorization letter**. Не переводите deposit на личный счёт без имени в contract.",
      "**Early termination**: unless fixed in contract, CCC general rules on breach apply — типичный рынок: **1–2 months notice** or forfeit deposit (soft). **Extension**: новый annex лучше, чем verbal «same price next year».",
      "Чек-лист подписания: (1) Thai + English версии — если расходятся, уточните, какая controlling; (2) **repair threshold** — кто меняет лампочки vs AC compressor; (3) **guests/overstay** — можно ли гостям без TM30; (4) **parking/motorbike** — slot number; (5) **deposit refund bank account** и currency. Две подписи на каждой странице — привычка, которая спасает при споре.",
      "Если платите через компанию или семейный transfer, **payer name** должен быть в receipt note («rent Unit 512, May 2026»). Landlord иногда просит **post-dated cheques** — редко у foreigners; cash culture всё ещё жива, но **written receipt** обязателен.",
    ],
    bullets: [
      "Annex: furniture list, AC remote count, key sets, pool equipment.",
      "Internet: confirm fiber provider (3BB, AIS, True) and who pays install.",
      "Cleaning at exit: agree standard (professional vs self) in writing.",
      "Receipt for every cash payment — date, address, period covered.",
      "Regulated lessor: ask whether OCPB Form A/B used; compare prohibited clauses list.",
    ],
  },
  {
    heading: "Red flags и Airbnb / nightly",
    section_kind: "practice",
    paragraphs: [
      "Красные флаги: **no written lease**; deposit только cash без receipt; landlord **refuses TM30**; цена «слишком низкая» для sea-view 1BR; **different person** на viewing и в contract; давление «pay today or next client»; **utilities at x2** без clause; building **explicitly short-term only** while you need immigration-stable address; pool/villa **without maintenance contact**.",
      "**Airbnb / Booking nightly** — hospitality / platform rules + возможный Hotel Act angle; juristic person многих condo **запрещает** <30 days. Для **DTV/LTR/семьи** long-term lease + TM30 + stable address обычно спокойнее, чем rotation по Airbnb каждые 2 недели (immigration/tax — отдельный counsel).",
      "Если объявление «monthly on Airbnb» — читайте platform contract; это не замена Thai lease для депозита и споров.",
    ],
    bullets: [
      "Спросите juristic person: minimum rental period and foreign guest policy.",
      "Проверьте шум: Patong nightlife, bar district, mosque call if sensitive.",
      "Mold: AC drip, bathroom ventilation — tropical risk.",
      "Duplicate listing photos — reverse image search (soft).",
      formatPracticeBullet({
        channels: ["info_phuket"],
        period: "2026",
        claim: "объявления «long term 25k» иногда оказывались short-term illegal sublet в condo с 30-day rule",
        forReader: "попросите lease draft до transfer и имя owner в Chanote/title copy",
      }),
    ],
  },
  {
    heading: "Сценарий «к 4–6 месяцу» на Пхукете",
    section_kind: "practice",
    paragraphs: [
      "К **4–6 месяцу** всплывают темы, которые на check-in кажутся мелочами: **продление visa** (DTV entry days, 90-day report, TM30 history), **seasonal rent renewal** (landlord поднимает rent или предлагает только 6-month renewal), **кондиционеры** (сервис фильтров = ваш comfort bill), **мold после rainy season**, споры о **deposit refund** при досрочном выезде.",
      "Если приехали на **безвиз/коротком статусе**, а контракт на 12 месяцев — к 4-му месяцу должна быть ясность: **visa run / extension / смена статуса** (см. [pillar Таиланд](/guides/" +
        THAILAND_PILLAR_SLUG +
        ")). Если планируете **смену района** (Rawai → Bang Tao) — закладывайте overlap 1 week + новый TM30.",
      "Tax: remote work income in Thailand — отдельная тема; lease itself не создаёт tax residency (soft; не tax advice).",
      "Типовой timeline: **месяц 1** — TM30, интернет, мебель; **2–3** — реальный electricity bill и шум соседей; **4** — окно **90-day report** для длинных статусов; **5** — сезон дождей, проверка протечек; **6** — письмо landlord «renew or 60 days notice». К **month 5** обновите фото inventory — baseline перед спором о депозите.",
      "Если juristic person шлёт warning о **illegal short-term** в вашем condo — не ждите month 6: ищите legal long-term unit; eviction идёт через owner/juristic person, visa сама по себе не «спасёт» договор.",
    ],
    bullets: [
      "Month 4: проверьте visa days left; соберите TM30 copies.",
      "Month 5 (rain): inspect wardrobes/walls; document to landlord.",
      "Month 6: renewal negotiation — сравните market, не только landlord offer.",
      "Exit plan: written notice per contract; pre-exit inspection with photos.",
      "Assist: спорный deposit или illegal sublet — [Route Check](https://www.emigro.online/ru/assist?country=thailand&utm_source=emigro&utm_medium=guide&utm_campaign=phuket_rent_m4).",
    ],
  },
  {
    heading: "Где агрегаторы, SEO и договор расходятся",
    section_kind: "gap",
    paragraphs: [
      "Карточки «депозит 1 месяц по закону» и «TM30 подаст tenant» противоречат **CCC/OCPB** и **Immigration §38**. Ниже — типовые расхождения между объявлением, агентом и enforceable lease на Пхукете 2026.",
    ],
    bullets: [
      "«Депозит всегда 1 month по закону» → в CCC нет единого cap; OCPB 2568 — только regulated lessor (≥3 units).",
      "«Airbnb monthly = long-term lease» → platform contract ≠ hire of property для спора и TM30.",
      "«Landlord скажет, что TM30 не нужен на 12 months» → duty landlord в 24h; отказ — red flag.",
      "«Utilities included» на фото → часто markup kWh у частника; сверяйте clause и sample bill.",
      "«Foreign quota» в объявлении аренды → quota на **покупку** condo, не на ваш lease как tenant.",
      "«Agent fee 0%» → часто заложен в rent; half-month fee — рынок, не statutory zero.",
    ],
  },
  {
    heading: "Типичные ошибки арендатора на Пхукете",
    section_kind: "practice",
    paragraphs: [
      "Ошибки month 1–6 из RU-чатов и споров о депозите: перевод до draft lease, слабый inventory, игнор juristic rules. Исправляемо до подписи и в первую неделю проживания.",
    ],
    bullets: [
      "Transfer deposit до written lease и копии title/ID owner — highest scam risk.",
      "Verbal «same price next year» без annex — landlord поднимает rent в high season.",
      "No TM30 copy в личном файле — проблемы при 90-day report и visa extension.",
      "Check-in без meter readings и video inventory — спор о «ваших» царапинах при exit.",
      "Подпись только English page при расхождении с Thai — в суде вес Thai (soft).",
      "6-month stay в condo с 30-day minimum rule — warning от juristic person к month 3–4.",
    ],
  },
];

const keyTakeaways = [
  "Официально: CCC §538 — письменный lease; >3 лет без registration — защита только 3 года; max term 30 лет (§540). Универсального statutory cap депозита в CCC **нет**.",
  "Официально: OCPB B.E. 2568 (≥3 units lessor) — limits на deposit+advance (3 monthly или 1 annual) и сроки refund; частный landlord 1 condo — primarily contract + CCC.",
  "Официально: TM30 — duty landlord в 24h (Immigration §38); tenant хранит подтверждение.",
  formatPracticeTakeaway({
    channels: ["russianinphuket", "info_phuket"],
    period: "2025–2026",
    claim:
      "12-month Phuket lease часто 2 months deposit + 1st month; utilities и common fee сверху; high season торг слабее",
    forReader:
      "budget all-in; не путайте nightly Airbnb с long-term lease для visa/TM30",
  }),
  "К 4–6 месяцу: visa runway, rainy season defects, renewal rent — заранее copies TM30 и inventory.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Сколько депозита «по закону» на Пхукете?",
    a: "По правилам: в CCC **нет** единого потолка security deposit для обычного частного найма; у **regulated residential lessor** (OCPB 2568, ≥3 units) сумма **deposit + advance rent** ограничена (3 monthly payments или 1 year rent при годовой оплате). На практике на 12-month lease часто просят **~2 months deposit + 1st month** — договорная норма рынка, не автоматический statutory cap для каждого объявления.",
  },
  {
    q: "Кто подаёт TM30 — я или арендодатель?",
    a: "По правилам Immigration Act §38 уведомление подаёт **landlord / owner / hotel manager** в течение 24 часов; система TM30 online регистрирует **хост**. На практике tenant даёт passport/TM6 данные и должен получить **копию подтверждения**; если landlord отказывается — ищите другой объект или counsel.",
  },
  {
    q: "Можно ли жить по Airbnb 6 месяцев вместо договора?",
    a: "По правилам nightly/platform stay ≠ типичный **hire of property** lease; многие condo запрещают short stays в bylaws; Hotel Act может затрагивать commercial accommodation. На практике «monthly Airbnb» не заменяет lease для **deposit disputes**, стабильного TM30 и переговоров о rent renewal — для long stay безопаснее written 6–12 month lease.",
  },
  {
    q: "Нужен ли Thai bank account для аренды?",
    a: "По правилам закон не требует Thai bank для подписания lease. На практике agents принимают **cash + receipt**, **Thai bank transfer** или Wise; без подтверждения платежа ключи не отдают — подготовьте способ оплаты до viewing.",
  },
  {
    q: "Condo или villa для семьи с DTV?",
    a: "По правилам оба варианта возможны как lease если lessor имеет право сдавать; TM30 обязателен в обоих случаях. На практике **condo** проще с security/pool/common fee; **villa** — больше maintenance и риск «не того» lessor на земле; сверяйте school commute (Phuket Town / Cherng Talay) и budget utilities.",
  },
  {
    q: "Когда возвращают депозит?",
    a: "По правилам: у **OCPB-regulated lessor** notification задаёт **immediate** refund или **7/14 days** после inspection; в CCC общий срок не fixed как «7 дней для всех». На практике частники часто возвращают в **7–30 days** после check-out — пропишите **date and method** в lease.",
  },
];

export const ARENDA_PHUKET_DOLGOSROK_GUIDE: ThailandEditorialGuide = {
  slug: ARENDA_PHUKET_DOLGOSROK_SLUG,
  category: "Аренда",
  content_kind: "guide" as ContentKind,
  title: "Долгосрочная аренда на Пхукете 2026: condo, villa, TM30",
  excerpt:
    "CCC hire of property, OCPB 2568 deposit rules для regulated lessors, TM30 за 24 часа, condo vs villa, inventory, markup utilities, сезонные цены, Airbnb vs lease, red flags и сценарий к 4–6 месяцу — gold CORE rent Phuket с Nota Emigro.",
  seo_title: "Аренда Пхукет 2026 — долгосрок, депозит, TM30",
  seo_description:
    "Аренда Пхукет 2026: 12-month lease, депозит без мифа «1 мес по закону», TM30 landlord, condo vs villa, OCPB 2568, коммуналка. DTV/LTR — отдельно от договора.",
  quick_answer:
    "Долгосрок на Пхукете оформляйте письменным lease (CCC §538). Депозит не имеет единого потолка в CCC для частного landlord; у арендодателя с ≥3 units действуют лимиты OCPB 2568 на deposit+advance. Landlord подаёт TM30 в 24 часа. Рынок часто просит ~2 месяца deposit + 1-й месяц на 12-month condo; utilities и common fee сверху. Nightly Airbnb ≠ long-term lease для TM30 и возврата депозита.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    {
      title: "Immigration Bureau — TM30 notification",
      url: "https://www.immigration.go.th/en/?p=14721",
    },
    {
      title: "TM30 online system",
      url: "https://tm30.immigration.go.th/TM30/Foreigner/TM30EN/Home.html",
    },
    {
      title: "OCPB — Residential leasing B.E. 2568",
      url: "https://www.ocpb.go.th/news_view_en.php?nid=17943",
    },
    {
      title: "THAILAND.GO.TH — TM30 how to fill",
      url: "https://www.thailand.go.th/public/index.php/guide-book-detail/001_01_088",
    },
    {
      title: "THAILAND.GO.TH — Foreign property registration",
      url: "https://thailand.go.th/public/issue-focus-detail/010_011",
    },
  ],
  topic_tags: ["arenda", "phuket", "thailand"],
  hashtags: buildNoteHashtags({
    topicTags: ["arenda", "phuket", "thailand"],
    contentKind: "guide",
    extra: [
      "phuket",
      "rawai",
      "kata",
      "bangtao",
      "condo",
      "villa",
      "tm30",
      "dtv",
      "deposit",
      "longterm",
    ],
  }),
  source_channel: "nashi_phuket_chat+pkhuket2+russianinphuket",
  source_label: "editorial:phuket-rent-gold-core-2026",
  pillar_guide_slug: THAILAND_PILLAR_SLUG,
};

export default ARENDA_PHUKET_DOLGOSROK_GUIDE;
