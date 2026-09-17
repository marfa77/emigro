/**
 * Hand-curated Thailand satellite guide — yellow pages relocant Phuket.
 * Gold life slot yellow_pages: verification-first directory, not citizenship/law sales.
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

export const SERVISY_PHUKET_SLUG = "servisy-phuket-relokant-2026";

const PERVYE_30_SLUG = "pervye-30-dnej-phuket-2026";
const IMMIGRATION_SLUG = "immigration-phuket-tm30-90-days-2026";
const ARENDA_SLUG = "arenda-phuket-dolgosrok-2026";
const BANK_SLUG = "bank-schet-phuket-inostrancu-2026";
const HEALTH_SLUG = "meditsina-phuket-strahovka-bolnicy-2026";
const UTILITIES_SLUG = "sim-internet-svet-voda-phuket-2026";
const VISA_SLUG = "viza-dtv-ltr-thailand-2026";

const GLOSSARY: GlossaryTerm[] = [
  { pt: "Immigration Bureau / Phuket office", ru: "продления, 90-day report, смена штампа; не «visa shop» в чате" },
  { pt: "TM30", ru: "уведомление о проживании; подаёт landlord/hotel, не «услуга агента»" },
  { pt: "DBD DataWarehouse", ru: "публичный реестр юрлиц Таиланда — имя, статус, capital, directors" },
  { pt: "Lawyers Council of Thailand", ru: "реестр licensed attorney (ทนายความ); не «legal consultant» без номера" },
  { pt: "OCPB / สคบ.", ru: "Office of Consumer Protection Board; жалоба 1166 и complaint.ocpb.go.th" },
  { pt: "Foreign quota (condo)", ru: "доля иностранцев в проекте; покупка ≠ автоматический иммиграционный статус" },
  { pt: "Work permit / SSF", ru: "право работы у Thai employer; отдельно от DTV/LTR и от «visa agent»" },
  { pt: "Quotation / invoice (ใบเสนอราคา)", ru: "письменная смета до работ; основа спора в OCPB" },
];

const DISCLAIMER =
  "**Emigro — не рекламный каталог и не юридическая фирма.** Жёлтые страницы = **кого звать в месяцы 1–6**, не рейтинг «лучший immigration lawyer». Экстренная медицина — **1669** (скорая) / **191** (полиция). Hard-правила — [Immigration Bureau](https://www.immigration.go.th/) и ваш тип визы; чат Telegram — только сигнал, не источник права.";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(
      GLOSSARY,
      "Слова с визиток Rawai, Cherng Talay и очереди на Chalermprakiat — до того, как чат предложит «DTV за 3 дня без банка»."
    ),
    paragraphs: [DISCLAIMER],
  },
  {
    heading: "Nota Emigro (fact-check)",
    section_kind: "official",
    paragraphs: [
      "Directorio Phuket 2026: **verification-first** — сначала госреестр/лицензия, потом отзывы. OK / soft / fixed ниже; SERP по «юрист Пхукет» и «visa agent Thailand» перегружен агентствами без публичного номера адвоката.",
    ],
    bullets: [
      "OK: **Immigration** — офис Phuket (Chalermprakiat Rd) и порталы [immigration.go.th](https://www.immigration.go.th/), [tm30.immigration.go.th](https://tm30.immigration.go.th/) для TM30 (обязанность принимающей стороны по §38).",
      "OK: **Licensed attorney** — публичный поиск на [Lawyers Council of Thailand](https://www.lawyerscouncil.or.th/) (имя или номер license); form ท.8 — официальная справка о status.",
      "OK: **Юрлицо-сервис** — [DBD DataWarehouse](https://datawarehouse.dbd.go.th/) (13-digit registration, active/dissolved); English certificate ref — [encert.dbd.go.th](https://encert.dbd.go.th/encert-inter/public/en/checkbyref).",
      "OK: **Consumer dispute** — [OCPB](https://www.ocpb.go.th/index_en.php), online [complaint.ocpb.go.th](https://complaint.ocpb.go.th/), hotline **1166** (договор, реклама, невыполнение услуги).",
      "Fixed: «gestoría / visa shop заменяет Immigration» → агент максимум **подаёт пакет от вашего имени**; решение — officer; «гарантия 100%» — red flag.",
      "Fixed: «риелтор с license REITA как в EU» → **обязательной гослицензии broker** в TH нет; проверяйте DBD + договор + Land Department на сделке, не badge в Instagram.",
      "Fixed: «Empyreal / любой broker = виза семье от покупки» — владение condo **не заменяет** отдельное иммиграционное основание; см. pillar.",
      "Soft: «сертифицированный переводчик» — для consulate/embassy часто нужен ** sworn / approved format** конкретного ведомства; универсального «TH translator ID» для всех случаев нет.",
      "Soft: tariff plumber/electrician Phuket 2026 — только после **ใบเสนอราคา**; диапазоны в чатах не тариф OCPB.",
      "UNCHECKED: конкретные фирмы с русским языком на Chalong — звоните и сверяйте DBD + scope письменно.",
    ],
  },
  {
    heading: "Метод: verification-first (7 шагов до оплаты)",
    section_kind: "official",
    paragraphs: [
      "Жёлтые страницы Emigro — **не список «топ-10»**, а повторяемый фильтр. На Пхукете рынок услуг для expat плотный: visa boutiques, property, «family office», repair — часто одна и та же визитка в @nashi_phuket_chat и @pkhuket2. SERP и чат дают **имя**; государство и письменный scope дают **проверяемость**.",
      "**Шаг 1 — задача:** immigration (extension/90-day), civil contract, property **viewing**, hospital plan, leak/condo, Thai tax — это **разные** исполнители; «универсальный relocator» без disclosure — риск смешения ответственности.",
      "**Шаг 2 — реестр:** attorney → Lawyers Council; компания → DBD; TM30/entry → Immigration; спор по услуге → OCPB. **Шаг 3 — письменный quotation:** scope, fee, refund if denied, кто signatory, срок и язык договора (TH/EN). **Шаг 4 — conflict:** agent продаёт объект **и** visa **и** bank intro — разделите роли или откажитесь; попросите **written disclosure** комиссий от developer, landlord и visa desk. **Шаг 5 — consent:** передача копий паспорта, lease, bank statement третьим лицам — только с пониманием, что они **не** госорган и не insurer; храните watermark и log кому что отправлено. **Шаг 6 — две ссылки:** сравните двух провайдеров по одному ТЗ (не «дешевле на 5000 бат» без scope). **Шаг 7 — receipt:** tax invoice (ใบกำกับภาษี) на Thai entity с DBD name match, не только PromptPay на личный номер без описания услуги — иначе OCPB и Revenue trail слабые.",
      "SERP по запросам «юрист Пхукет русский» и «visa agent Phuket» в 2026 в топе смешаны **law firms**, **property boutiques** и **anonymous Telegram**. AEO-ответ для релоканта: **сначала тип задачи**, потом реестр, потом цена — не наоборот.",
    ],
    bullets: [
      "Immigration queue — лично или уполномоченный representative с power of attorney; не «сдача паспорта неизвестному».",
      "Hospital — проверяйте **JCI / hospital license** на сайте сети (Bangkok Hospital Phuket, Siriroj и др.), не только «recommended in chat».",
      "Accountant — Revenue Department registration / TAX ID фирмы + scope (personal vs company); не «сделаю TIN за вас без вашего присутствия» без доверенности.",
      "Utilities — PEA (электричество), PWA (вода), ISP contract на ваше имя или landlord per lease ([utilities guide](/notes/" + UTILITIES_SLUG + ")).",
      "Repair — juristic person condo часто имеет **preferred vendor list**; частный master — DBD или sole proprietor receipt.",
      "[Первые 30 дней](/notes/" + PERVYE_30_SLUG + ") — порядок SIM → TM30 → bank до yellow pages deep dive.",
    ],
  },
  {
    heading: "Immigration и visa-сопровождение",
    section_kind: "official",
    paragraphs: [
      "**Официальный контур:** безвиз/штамп, extension, 90-day report, DTV/LTR до/после въезда — правила на [immigration.go.th](https://www.immigration.go.th/) и консульских страницах; Phuket field office — Chalermprakiat Rd (очередь/appointment по актуальной схеме). Детальный satellite track — [immigration Phuket TM30/90-day](/notes/" +
        IMMIGRATION_SLUG +
        "); маршруты DTV/LTR — [visa guide](/notes/" +
        VISA_SLUG +
        ").",
      "**Visa agent / immigration consultant:** законная роль — **подготовка форм, запись, check-list, сопровождение в очереди** с вашим присутствием или POA где допустимо. **Незаконная роль** — «гарантия штампа», хранение паспорта неделями, «border run без риска», подделка bank statement. Проверка: DBD компании + **кто подписывает** (attorney license или только «consultant») + sample успешных **official receipts** (не скрин «approved» без номера).",
      "**По правилам** overstayer и false documents — санкции Immigration Act; **на практике** чат продаёт «продление без очереди» — если нет receipt от Immigration с датой и категорией, это не status. После изменения безвиза для РФ с **15.09.2026** (30 дней вместо прежнего 60-дневного окна в общей схеме) runway короче — agent должен работать от **вашей** даты entry, не от «у всех 90 дней».",
      "Для семьи: у каждого члена свой пакет и свой 90-day/report calendar; «one agent for family» ok только если договор явно перечисляет **per person** fees и documents.",
    ],
    bullets: [
      "TM30 receipt — от landlord; agent не substitute для §38.",
      "90-day — ваш calendar, не «агент напомнит» без договора.",
      "Copy passport — watermark «for [service] only».",
      "Extension denied — attorney, не второй agent «fix».",
      "DTV proof — bank balance rules на дату подачи; agent не создаёт деньги на счёте.",
      "Work — [work permit guide](/notes/rabota-work-permit-social-security-thailand-2026) отдельно от tourist/DTV.",
    ],
  },
  {
    heading: "Адвокат, переводчик, нотариус",
    section_kind: "official",
    paragraphs: [
      "**Attorney (ทนายความ):** для споров с landlord, due diligence condo, labor dispute, appeal immigration denial — ищите **license** в [Lawyers Council registry](https://www.lawyerscouncil.or.th/), не «legal advisor» без номера. Retainer и scope — письменно; hourly vs fixed fee — до старта.",
      "**Переводчик:** для RF consulate Bangkok, Thai authority, school — уточните **формат** (certified copy, apostille chain, bilingual affidavit). Универсальный «переводчик Пхукет» из чата годится для быта; для **official packet** — сверка с receiving office.",
      "**Notary / witness:** часть документов — только в **Thai MFA/legalisation chain** или consulate; «нотarius на Rawai» не заменяет требование embassy без проверки. Для lease >1 year и SPA condo часто достаточно bilingual contract + attorney review; для **inheritance, marriage, criminal record** — отдельная цепочка, не «переводчик за час».",
      "Письменное **conflict waiver**: если переводчик или lawyer работает на landlord/developer, вы вправе требовать independent counsel — особенно когда deposit уже переведён и спор идёт о TM30 или возврате.",
    ],
    bullets: [
      "Form ท.8 — official lawyer history certificate (fee soft ~40 THB/copy per Council materials).",
      "Dual role: attorney **same** as seller's lawyer — отказ или separate counsel.",
      "Russian+English contract lease — attorney review до deposit ([аренда](/notes/" + ARENDA_SLUG + ")).",
      "Power of attorney — scope limited by date and act.",
      "Chat «юрист гражданство EU» на Phuket — red flag для TH быта mes 1–6.",
      "Emigro Assist — audit **вашего** порядка документов, не substitution attorney.",
    ],
  },
  {
    heading: "Недвижимость: agent, due diligence, Empyreal (disclosure)",
    section_kind: "practice",
    paragraphs: [
      "**Property agent на Пхукете:** нет EU-style mandatory broker license; **verification** = DBD юрлица агентства + **written buyer/listing agreement** + due diligence at **Land Department** (chanote, foreign quota, charges). TREBA/REBA membership — **soft** signal ethics, не гослицензия; проверяйте membership напрямую, не скриншот.",
      "**Conflicts:** agent получает commission от **developer** → цена и inclusion услуг раскрыты письменно; agent же ведёт visa/bank — разделите или зафиксируйте в одном contract все fees и who pays whom.",
      "**Empyreal Estate Phuket — только disclosed pilot partner Emigro:** если вы пришли с [Assist / pillar](/ru/guides/tailand-dlya-rossiyan-2026) и **согласились** на передачу контакта, запрос может уйти пилотному партнёру по недвижимости. Это **не endorsement** Emigro качества всех сделок, **не** legal authority и **не** гарантия визы; Emigro не получает процент от вашей покупки. Услуги buyer-side по данным партнёра могут оплачиваться commission застройщика — **сравните** total price, inclusions и independent lawyer до deposit. Альтернатива всегда есть: другой agent + свой attorney + тот же Land Department.",
      "Перед viewing запишите **три числа**: list price, all-in fees (transfer, sinking fund, common fee months), и **имя seller/developer** для DBD/Land Dept check. Agent, который отказывается письменно раскрыть commission source, — yellow flag независимо от бренда.",
    ],
    bullets: [
      formatPracticeBullet({
        channels: ["nashi_phuket_chat", "pkhuket2"],
        period: "2025–2026",
        claim:
          "relocant платили «due diligence» agent без DBD invoice — chanote проверили только после спора",
        forReader: "Land Department + attorney до transfer; agent = intro, не title insurance",
      }),
      "Foreign quota — juristic person condo; villa/land — другая структура (pillar).",
      "Viewing-only — отдельный scope без exclusivity trap.",
      "Deposit — escrow or developer account name сверка с contract.",
      "Rental — agent fee: who pays, refund if fail TM30 landlord.",
      "[Assist Empyreal program](/ru/assist?country=thailand&provider=empyreal-estate-phuket#assist-form) — opt-in transfer, не default.",
    ],
  },
  {
    heading: "Клиника, utilities, ремонт, бухгалтерия",
    section_kind: "practice",
    paragraphs: [
      "**Hospital / clinic:** плановая care — Bangkok Hospital Phuket, Siriroj, Phuket International Hospital и др.; проверяйте **insurance network** ([медицина](/notes/" +
        HEALTH_SLUG +
        ")). Urgency — 1669; не «telegram doctor» для acute.",
      "**Utilities:** подключение электричества/воды/интернет — контракт и meter на имя tenant или landlord per lease; «fixer» за cash без receipt — проблема при возврате deposit. См. [SIM/internet/вода](/notes/" +
        UTILITIES_SLUG +
        ").",
      "**Repair (AC, leak, electric):** juristic office condo — ticket first; частный house — quotation + warranty period; OCPB если prepaid и no-show.",
      "**Accounting / Thai tax:** нужен при **Thai-sourced income**, Thai company, VAT registration, employer payroll; remote-only foreign employer без PE в TH — другой контур (pillar + tax-id note). TIN personal — [tax-id guide slot](/notes/tax-id-tin-phuket-2026). Проверка: firm DBD + who signs tax return (PND forms); не отдавать passport agent «на неделю для TIN» без limited POA. К **4–6 месяцу** часть релокантов открывает Thai side activity (rent out, local sales) — тогда «visa agent» без accountant — пробел.",
      "Phuket **juristic person** (управление condo): платежи common fee, access card, move-in/out rules — официальный desk проекта; «fixer» обходит juristic — риск штрафа и конфликта с соседями, не экономия.",
    ],
    bullets: [
      "AC service — filter+gas line item в quotation.",
      "Leak — photo до repair; landlord vs tenant per contract.",
      "Electric — licensed contractor soft для panel work.",
      "Bank intro — [bank guide](/notes/" + BANK_SLUG + "); agent не substitute KYC.",
      "Social security — employer route, не visa shop.",
      "Invoice VAT 7% — проверка DBD name match.",
    ],
  },
  {
    heading: "Кого вызывают в месяцы 1–3 vs 4–6",
    section_kind: "practice",
    paragraphs: [
      "**Месяц 1–3:** SIM и TM30 receipt; landlord/juristic для leak; Thai bank appointment; insurance; **Immigration calendar** (extension/90-day); один **attorney consult** если lease >1 year или condo deposit >500k THB. Не нанимайте «full relocation package» до того, как прочитали [первые 30 дней](/notes/" +
        PERVYE_30_SLUG +
        ").",
      "**Месяц 4–6:** накапливаются **90-day reports**, renewal runway, mold/AC после monsoon, спор deposit, decision buy vs rent, wear on vehicle/scooter contracts. Здесь нужны **accountant** (если доход в TH), **immigration attorney** если denial или overstay risk, **OCPB** если prepaid service vanished, **hospital billing** если страховка оспаривает счёт. Жёлтые страницы не заменяют просроченный report — только напоминают **кого** звать.",
      "Типичный сценарий mes 4: «agent исчез после commission» — у вас остаются DBD printout, quotation и transfer; это пакет для OCPB, не новый «fixer». Типичный mes 6: продление lease — attorney review indexation clause до подписи второго года.",
    ],
    bullets: [
      formatPracticeBullet({
        channels: ["info_phuket", "russianinphuket"],
        period: "2025–2026",
        claim: "family missed 90-day window — fix через Immigration queue, не «agent fix fee» без receipt",
        forReader: "calendar + official queue; attorney если overstay risk",
      }),
      "Monsoon mold — AC clean vendor с invoice.",
      "School mid-year — registrar, не visa agent.",
      "Consulate RF — Bangkok trip plan ([consulate slot](/notes/konsulstvo-rf-bangkok-dokumenty-2026)).",
      "Second opinion lawyer — before signing SPA.",
      "Assist Route Check — document order audit €129.",
    ],
  },
  {
    heading: "Red flags в чатах и SERP",
    section_kind: "practice",
    paragraphs: [
      "**Red flags:** «100% visa», «без visit Immigration», passport custody, cash only no invoice, «гражданство / EU passport» в Phuket ad, pressure «deposit today», agent = sole lawyer, **no DBD name**. **Green flags:** license number verifiable online, quotation PDF on letterhead, POA limited, separate roles buyer agent vs legal, OCPB-visible company address.",
      "Emigro **не** marketplace мастеров; сигналы из third-party chats — **не** editorial endorsement. Сохраняйте PDF quotation и DBD printout в одной папке — к mes 4 это быстрее, чем искать скрины в Telegram.",
    ],
    bullets: [
      "Google Maps reviews — soft; cross-check DBD.",
      "Two quotations — repair and legal.",
      "Video office — not proof of license.",
      "«Included visa» in property — split fees line by line.",
      "Telegram anonymous — no contract path.",
      "Report scam — Royal Thai Police + OCPB по типу harm.",
    ],
  },
  {
    heading: "Assist, официальный портал и мастер",
    section_kind: "official",
    paragraphs: [
      "**Официально / бесплатно или gov fee:** Immigration forms, TM30 portal, DBD lookup, OCPB complaint, hospital emergency triage.",
      "**Assist Emigro (Route Check €129):** аудит **вашего** порядка visa→TM30→bank→rent; **не** подаёт за вас в Immigration и **не** vouches за частного master. Wizard — [/ru/wizard?utm_source=emigro&utm_medium=guide&utm_campaign=yellow-pages&utm_content=" +
        SERVISY_PHUKET_SLUG +
        "](/ru/wizard?utm_source=emigro&utm_medium=guide&utm_campaign=yellow-pages&utm_content=" +
        SERVISY_PHUKET_SLUG +
        ").",
      "**Мастер / agent / attorney:** физическая или commercial work; выбираются через verification-first метод выше.",
    ],
    bullets: [
      "Assist ≠ Empyreal unless you opt in on Assist form.",
      "Empyreal ≠ Immigration authority.",
      "Pillar [Таиланд для россиян 2026](/ru/guides/tailand-dlya-rossiyan-2026) — country frame.",
      "Satellite host — thailand.emigro.online notes.",
      "Consent to share contact — explicit checkbox Assist.",
      "No pay for unverified «express visa».",
    ],
  },
  {
    heading: "Где SERP, чаты и Immigration расходятся с проверкой",
    section_kind: "gap",
    paragraphs: [
      "Google «лучший visa agent Phuket» смешивает **property boutique**, **anonymous Telegram** и редкую licensed firm. «100% extension» в чате — при отсутствии **Immigration receipt** status не изменился. «Legal» в названии канала ≠ **Lawyers Council** match.",
      "Главное: DBD printout и quotation на letterhead — не парanoia, а минимальный paper trail для OCPB и для mes 4, когда «agent пропал после commission».",
    ],
    bullets: [
      "«Visa shop заменяет Immigration» → fixed: agent готовит пакет; **решение** — officer.",
      "«Due diligence included in commission» → часто без Land Department check; attorney отдельно.",
      "«Gestoría как в ES» → fixed: TM30/Revenue/Land — **разные** ведомства, один desk редко licensed везде.",
      "«Passport custody для speed» → red flag; POA limited + ваш контроль.",
      "SERP «EU citizenship lawyer Phuket» → не substitute TH lease/Immigration mes 1–6.",
      "Cash PromptPay без **ใบกำกับภาษี** → слабый OCPB trail при споре repair/visa fee.",
    ],
  },
  {
    heading: "Типичные ошибки жёлтых страниц Phuket",
    section_kind: "practice",
    paragraphs: ["Relocant теряют деньги и status runway в первые полгода."],
    bullets: [
      "Ошибка: visa agent вместо reading Immigration checklist для своей категории.",
      "Ошибка: property «due diligence» у seller's agent без своего attorney.",
      "Ошибка: переводчик без spec consulate → reject packet.",
      "Ошибка: repair prepaid cash — нет OCPB paper trail.",
      "Ошибка: смешать DTV bank proof и rent deposit timing.",
      formatPracticeBullet({
        channels: ["thailand_chatik", "nashi_phuket_chat"],
        period: "2025–2026",
        claim: "«legal» в названии чата не имело Lawyers Council match",
        forReader: "lawyerscouncil.or.th search before retainer",
      }),
    ],
  },
];

const keyTakeaways = [
  "Официально: Immigration + TM30 portal для status; Lawyers Council для attorney; DBD для компании; OCPB 1166 для consumer dispute — до оплаты частному «consultant».",
  "Verification-first: quotation, conflict disclosure, separate roles (agent / lawyer / immigration), invoice на Thai entity.",
  formatPracticeTakeaway({
    channels: ["nashi_phuket_chat", "pkhuket2"],
    period: "2025–2026",
    claim: "DBD + written scope отсекали «visa 100%» и ghost repair prepaid",
    forReader: "7-step filter before PromptPay",
  }),
  "Empyreal — только opt-in pilot partner Emigro по недвижимости; не endorsement, не visa authority; сделку и Land Department ведите с independent counsel.",
  "На практике к 4–6 месяцу: 90-day, monsoon repair, deposit disputes — attorney/accountant/OCPB, не новый Telegram «fixer».",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Как проверить, что «юрист на Пхукете» настоящий?",
    a: "По правилам practicing attorney должен быть в реестре [Lawyers Council of Thailand](https://www.lawyerscouncil.or.th/) (имя или license number). На практике «legal consultant» без номера — не substitute; для спорной суммы закажите form ท.8 или written retainer на licensed firm.",
  },
  {
    q: "Нужен ли visa agent для extension на Phuket?",
    a: "По правилам многие trámites можно подать лично в Immigration с полным пакетом. На практике agent экономит очередь/формы, но **не** гарантирует approve; проверяйте DBD, scope и что паспорт не удерживают без receipt.",
  },
  {
    q: "Как пожаловаться на мастера или агентство?",
    a: "По правилам OCPB принимает жалобы при договор/реклама/оплата услуги — [complaint.ocpb.go.th](https://complaint.ocpb.go.th/) или **1166**. На практике соберите quotation, chat, transfer proof, invoice; без paper trail mediation слабее.",
  },
  {
    q: "Чем Empyreal отличается от «любого риелтора»?",
    a: "По правилам Emigro это **disclosed pilot partner** только если вы согласились на transfer через Assist/pillar — не общий рейтинг рынка Phuket. На практике due diligence, attorney и Land Department остаются на вас; покупка не = виза.",
  },
  {
    q: "Кого звать к 4–6 месяцу, если «всё было ок»?",
    a: "По правилам 90-day report и visa expiry — Immigration calendar. На практике monsoon → AC/mold vendor; deposit return → lease attorney; Thai income → accountant; просрочка → immigration attorney, не второй visa shop.",
  },
  {
    q: "Есть ли gestoría как в Испании?",
    a: "По правилам единого «gestoría для всех trámites» в TH нет — разные ведомства (Immigration, Revenue, Land). На практике gestoría-style desk = **admin agent** с DBD; проверяйте, что они не продают illegal visa promises.",
  },
  {
    q: "Можно ли доверить паспорт visa agent «на оформление»?",
    a: "По правилам представительство возможно только в рамках допустимого POA и вашего контроля. На практике длительное хранение оригинала у частного desk — red flag; работайте с копиями, tracking и receipt каждого visit Immigration.",
  },
];

export const SERVISY_PHUKET_GUIDE: ThailandEditorialGuide = {
  slug: SERVISY_PHUKET_SLUG,
  category: "Сервисы",
  content_kind: "guide" as ContentKind,
  title: "Жёлтые страницы Phuket 2026: сервисы релоканта с проверкой",
  excerpt:
    "Кого звать на Пхукете в месяцы 1–6: Immigration, attorney, переводчик, agent, hospital, utilities, repair, accountant — verification-first (DBD, Lawyers Council, OCPB). Фильтр чат-рекламы; Empyreal только как opt-in pilot partner, не endorsement.",
  seo_title: "Сервисы Пхукет 2026 — юрист, visa agent, мастер",
  seo_description:
    "Phuket 2026: visa agent, attorney, repair, OCPB 1166. DBD и Lawyers Council до оплаты; written quotation — быт релоканта mes 1–6, не «топ lawyer».",
  quick_answer:
    "На Пхукете в первые полгода жизни вызывают не «лучшего адвоката для гражданства», а проверяемые сервисы: Immigration и TM30 для status, licensed attorney (Lawyers Council) для договоров и споров, DBD-verified компании для visa support/repair/accounting, клиники по страховке, utilities по lease. Метод Emigro: реестр → письменная смета → conflict disclosure → invoice. Жалоба на невыполнение — OCPB complaint.ocpb.go.th / 1166. Property agent без госlicense — due diligence через Land Department и своего lawyer; Empyreal только если вы opt-in передали контакт через Emigro Assist — не endorsement и не visa authority. К 4–6 месяцу: 90-day, monsoon repair, deposit — attorney/OCPB, не новый Telegram fixer.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "Immigration Bureau Thailand", url: "https://www.immigration.go.th/" },
    { title: "Lawyers Council of Thailand", url: "https://www.lawyerscouncil.or.th/" },
    { title: "OCPB — consumer protection", url: "https://www.ocpb.go.th/index_en.php" },
    { title: "OCPB online complaint", url: "https://complaint.ocpb.go.th/" },
    { title: "DBD DataWarehouse", url: "https://datawarehouse.dbd.go.th/" },
  ],
  topic_tags: ["yellow_pages", "phuket", "servisy", "thailand"],
  hashtags: buildNoteHashtags({
    topicTags: ["yellow_pages", "phuket", "servisy", "thailand"],
    contentKind: "guide",
    extra: ["directory", "verification", "satellite"],
  }),
  source_channel: "nashi_phuket_chat+pkhuket2+info_phuket+russianinphuket",
  source_label: "editorial:thailand-yellow-pages-gold-phuket-2026",
  pillar_guide_slug: "tailand-dlya-rossiyan-2026",
};

export default SERVISY_PHUKET_GUIDE;
