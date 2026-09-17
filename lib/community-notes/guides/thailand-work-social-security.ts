/**
 * Hand-curated Thailand satellite guide — work permit, SSO, tax/TIN (Phuket focus).
 * Gold life slot work_ss; permission to stay ≠ permission to work.
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

export const THAILAND_WORK_SS_SLUG = "rabota-work-permit-social-security-thailand-2026";

const PILLAR_SLUG = "tailand-dlya-rossiyan-2026";
const VISA_DTV_LTR_SLUG = "viza-dtv-ltr-thailand-2026";
const TIN_PHUKET_SLUG = "tax-id-tin-phuket-2026";
const PERVYE_30_SLUG = "pervye-30-dnej-phuket-2026";

const DISCLAIMER =
  "**Emigro — не иммиграционная и не трудовая консультация.** Work permit, SSO и TIN регулируют **разные** ведомства (DOE/MOL, SSO, Revenue). На Пхукете employer часто в Bangkok или в другой провинции — процесс не «в очереди Immigration Chalermprakiat». Актуальные формы — [e-WorkPermit](https://eworkpermit.doe.go.th/Home), [SSO](https://www.sso.go.th/), [Revenue EN](https://www.rd.go.th/english/21987.html).";

const GLOSSARY: GlossaryTerm[] = [
  { pt: "Permission to stay", ru: "миграционный статус (штамп, extension, DTV, LTR) — **не** равен праву занять должность у тайского employer" },
  { pt: "Non-Immigrant B", ru: "виза категории B для business/work; для work permit обычно нужен именно non-immigrant статус, не tourist exemption" },
  { pt: "Work Permit (WP)", ru: "разрешение MOL/Department of Employment на конкретную должность у конкретного employer; без него «работа» у Thai company — нарушение Alien Working Act" },
  { pt: "e-WorkPermit", ru: "онлайн-подача заявок DOE с 13.10.2025; employer регистрируется, затем biometrics и выдача в service center" },
  { pt: "WP3 / Form WP.25", ru: "документы employer для согласования найма иностранца; WP.25 — основная анкета work permit (DOE)" },
  { pt: "SSO (Social Security Office)", ru: "государственное соцстрахование; employer регистрирует наёмного работника (Section 33), взносы 5%+5%" },
  { pt: "Sor.Por.Sor. 1-03 (SSO 1-03)", ru: "форма регистрации застрахованного; для иностранца — паспорт + work permit (или Smart Visa/LTR digital permit где применимо)" },
  { pt: "DTV (Destination Thailand Visa)", ru: "долгое пребывание + workcation **для работодателя/клиентов вне Таиланда**; **не** заменяет work permit у Thai company" },
  { pt: "LTR Digital Work Permit", ru: "для части LTR (Highly Skilled Professional с Thai employer); категория Work-from-Thailand **без** Thai employer — permit не выдаётся (BOI LTR)" },
  { pt: "TIN / tax resident 180 days", ru: "налоговый резидент календарного года при >180 дней; TIN — Revenue Department, отдельно от work permit" },
];

const GLOSSARY_INTRO =
  "В чатах Phuket «виза есть» часто путают с «можно числиться в Thai payroll». Разберём термины **до** подписания offer letter — иначе к 4–6 месяцу прилетает и Immigration, и Labour, и Revenue одновременно.";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(GLOSSARY, GLOSSARY_INTRO),
    paragraphs: [DISCLAIMER],
  },
  {
    heading: "Nota Emigro (fact-check)",
    section_kind: "official",
    paragraphs: [
      "Утверждения сверены с MFA/DOE/MOL, thailand.go.th (SSO), Revenue EN и BOI LTR. **OK** = официальный текст; **soft** = Phuket/Bangkok field 2025–2026; **fixed** = смягчено под рамку 2026.",
    ],
    bullets: [
      "OK: иностранец с Non-Immigrant B **может работать только после выдачи work permit** ([MFA Non-B EN](https://www.mfa.go.th/en/publicservice/non-immigrant-visa-b-for-business-and-work)).",
      "OK: заявка work permit — **Non-Immigrant visa** + квалификация + пакет employer; форма **WP.25** (DOE PDF EN).",
      "OK: **e-WorkPermit** — nationwide с **13 октября 2025**, 24/7 подача, биометрия в service center ([MOL news EN](https://www.mol.go.th/en/news/labour-minister-launches-e-workpermit-online-system-for-foreign-worker-registration-24-hour-nationwide-service-begins-october-13)).",
      "OK: legally working foreign employee регистрируется в SSO: форма **Sor.Por.Sor. 1-03**, копия паспорта, **work permit** (или Smart Visa где применимо) ([thailand.go.th SSO FAQ](https://thailand.go.th/guide-book-detail/007-029-2-2)).",
      "OK: employer регистрирует employee **в течение 30 дней** с первого рабочего дня (MOL employer handbook EN PDF на mol.go.th).",
      "OK: **tax resident** — >**180 дней** суммарно в календарном налоговом году; TIN иностранцу без PIN — **60 дней** с assessable income ([RD Tax Identification EN](https://www.rd.go.th/english/21987.html), [PIT EN](https://www.rd.go.th/english/6045)).",
      "OK: DTV purposes включают **Workcation** (remote worker / freelancer с доходом **вне** Таиланда) ([MFA DTV PDF](https://image.mfa.go.th/mfa/0/P5NCnBapvr/Visa_17.05.2024/Visa_Destination_Thailand_(DTV)_Multiple_EN_FR_Dutch.pdf)).",
      "OK: LTR **Highly Skilled** с Thai entity — digital work permit через LTR system; **Work-from-Thailand Professionals** — permit **не выдаётся** (нет Thai employer) ([BOI LTR visa issuance](https://ltr.boi.go.th/page/visa-issuance-info.html)).",
      "Fixed: «DTV = нельзя открыть ноутбук» → **нет** blanket; DTV **не** разрешает **employment у Thai employer / услуги Thai clients за pay** без work permit; remote для **overseas** employer — заявленная цель визы.",
      "Fixed: «LTR = work permit в комплекте» → только для категорий **с Thai employment**; WFT и DTV-like remote — другая ветка.",
      "Fixed: «Thailand Privilege = можно подрабатывать» → membership даёт long-stay, **не** заменяет Non-B + WP (официальные материалы Privilege 2026 — work/study вне membership).",
      "Soft: Phuket office DOE — часто едут в **Phuket Provincial Employment Office** или Bangkok OSS/TIESC; e-WorkPermit снижает «живые» очереди, но collection slot всё равно нужен.",
      "UNCHECKED: точный список service centers на Пхукете для biometrics e-WorkPermit на дату вашей подачи — смотрите eworkpermit.doe.go.th при booking.",
    ],
  },
  {
    heading: "Официально: permission to stay ≠ permission to work",
    section_kind: "official",
    paragraphs: [
      "Таиланд разводит **иммиграцию** (Immigration Bureau: въезд, extension, 90-day report) и **труд** (Ministry of Labour / Department of Employment: work permit). Штамп безвиза, tourist extension, DTV, LTR или Thailand Privilege описывают **как долго и на каком основании вы находитесь в королевстве**. Work permit описывает **можете ли вы занимать конкретную должность у конкретного тайского employer** (или иное разрешённое исключение вроде digital work permit LTR).",
      "Non-Immigrant Visa **B** выдаётся для business/work, но MFA прямо указывает: alien **может работать после grant work permit**. Employer до визы часто получает letter of approval (historically Form WP3) в DOE. Без этой цепочки «я уже в Phuket на DTV и Thai startup хочет меня в штат» — юридически это **смена track**, а не «дополнительная бумажка».",
      "Remote work **для employer outside Thailand** — отдельная история: DTV и LTR Work-from-Thailand **заявлены** под workcation. Это **не** даёт права нанимать Thai staff от вашего имени, выставлять счета Thai B2B «как local» или занимать reserved occupation — даже если ноутбук стоит в Rawai.",
      "Immigration officer на въезде проверяет **визу и цель визита**, не ваш employment contract с Berlin или Dubai. Labour inspector или SSO audit смотрит **employer, permit и payroll**. Revenue смотрит **TIN, withholding и remittance**. Три контуры не синхронизируются автоматически — типичная ошибка mes 2–3 «у меня же DTV, значит legal всё».",
    ],
    bullets: [
      "Immigration status — паспорт, виза, extension, TM30, 90-day.",
      "Work authorization — work permit / LTR digital permit / иные узкие режимы (Smart Visa и т.д.).",
      "Non-Imm B + WP — классический найм Thai company.",
      "DTV / LTR-WFT — remote overseas; Thai payroll **не** в этом пакете.",
      "Violation Alien Working Act — штрафы, deportation, re-entry risk (не детализируем суммы — см. актуальный кодекс).",
    ],
  },
  {
    heading: "Work permit: employer onboarding и e-WorkPermit",
    section_kind: "official",
    paragraphs: [
      "Employer — **инициатор**. Он регистрируется в **e-WorkPermit** (eworkpermit.doe.go.th), выбирает тип юрлица (company, sole prop с ограничениями), загружает corporate pack: registration, shareholder list, VAT P.P.20, balance sheet, map, описание должности. DOE проверяет, что позиция **не** в prohibited list и что компания обосновывает найм иностранца (опыт, salary, ratio foreign staff — детали в WP.25 и внутренних правилах DOE).",
      "С **13.10.2025** MOL перевёл подачу в **24/7 online**: fee online, tracking по email/SMS/Line OA, затем appointment в service center для **biometrics** (face, iris, fingerprint) и выдачи permit booklet. Hotline Labour **1506** (press 2) — официальный канал вопросов по e-WorkPermit.",
      "На Пхукете expat часто работает на **remote hub** Bangkok или на resort management company в Mueang Phuket — юридически employer всё равно Thai entity. Не начинайте work **до** approval: в чатах «начали понедельник, permit через месяц» — это риск для employer и employee.",
      "WP3 / pre-approval letter для consulate Non-B: employer инициирует в DOE **до** вашего visa run. После entry на Non-B подаётся WP.25 через e-WorkPermit. Renewal — отдельный цикл до expiry permit и visa stamp; HR должен напоминать за 60–90 дней, не за неделю.",
    ],
    bullets: [
      "e-WorkPermit — подача, оплата, статус, booking center ([DOE portal](https://eworkpermit.doe.go.th/Home)).",
      "WP.25 + 3 photos 3×4 — базовый комплект first-time ([DOE WP.25 EN PDF](https://www.doe.go.th/prd/assets/upload/files/alien_en/2bf65c018f67113a959f9e83dd9f697e.pdf)).",
      "Employer corporate documents — по checklist DOE для juristic person.",
      "Position description — должность, salary, location; смена employer → **новый** permit.",
      "MOL prohibited occupations — отдельная проверка до HR hype.",
    ],
  },
  {
    heading: "Запрещённые профессии и «серая» занятость",
    section_kind: "official",
    paragraphs: [
      "Даже с work permit часть работ **закрыта** для иностранцев Cabinet resolutions (список на [MOL prohibited occupations EN](https://www.mol.go.th/employee/occupation_prohibited_en)). Примеры: manual labour, большинство строительных trades, driving (кроме piloting international aircraft), shop floor retail, hairdressing, **legal services / lawsuit work**, traditional Thai massage, tour guiding, многие clerical/secretarial roles, civil engineering design/supervision без «special expertise», и др.",
      "На практике Phuket tourism economy создаёт соблазн «consultant», «marketing for villa», «fixer» — если оплата и место работы в Таиланде и роль попадает под employment, это **не** remote DTV track. Foreign Business Act и Working of Aliens Act не заменяются красивым LinkedIn title.",
      "Исключения для migrant workers из Myanmar/Laos/Cambodia на **labour** и **domestic work** — отдельный режим; на post-Soviet passport это **не** ваш shortcut.",
      "HR иногда предлагает должность «Manager» в permit, а фактические обязанности — продажи на пляже или ведение групп: при проверке DOE смотрит **фактическую** работу. Penalties бьют и employer, и employee — не полагайтесь на «все так делают на Bangla Road».",
    ],
    bullets: [
      "Prohibited list — проверять **до** offer letter, не после relocation family.",
      "Tour guide / taxi / street vendor — типичные red flags на острове.",
      "«Volunteer» с implicit salary — не loophole.",
      "Freelance invoices Thai clients — ближе к local business, не DTV workcation.",
      "Employer HR должен подтвердить occupation code **до** WP submission.",
    ],
  },
  {
    heading: "SSO: регистрация, взносы, benefits",
    section_kind: "official",
    paragraphs: [
      "Social Security Office (SSO) — mandatory для legally employed employees. Foreign worker с valid work permit регистрируется как **insured person** (Section 33): employer подаёт **Sor.Por.Sor. 1-03**, копию паспорта, копию work permit в SSO branch или через employer e-SSO channel. Smart Visa/LTR cases: thailand.go.th указывает, что для Smart Visa **можно** использовать visa вместо work permit copy при регистрации.",
      "Employer handbook MOL: register employee **within 30 days** from first day of work; monthly contribution statement (Form 1-10 class), remit by **15th** of following month. Employee и employer каждый платят **5%** от salary в пределах statutory wage ceiling (ceiling меняется — на 2026 проверяйте SSO notice, не чат).",
      "Benefits пакет (7 cases на thailand.go.th): sickness/medical, maternity, disability, death, child allowance, old age, unemployment — **при** qualifying contributions. Это **не** private expat insurance из [мед-guides](/notes/meditsina-phuket-strahovka-bolnicy-2026); больница может принять SSO card, но deductible и network — отдельная тема.",
      "Медицинский benefit SSO — через designated hospitals/clinics в системе; emergency на Phuket часто начинается с **private** bill, затем reimbursement по правилам SSO — читайте employer handbook, не TikTok «SSO = всё бесплатно». Unemployment benefit требует qualifying termination и сроков взносов; voluntary quit remote job abroad **не** активирует Thai unemployment.",
      "Sole proprietor employer **не** может зарегистрировать себя как insured employee в том же sole prop — типичная ловушка для «открыл Thai company и сам себе payroll».",
    ],
    bullets: [
      "SSO hotline **1506** (24h) — тот же номер, что Labour.",
      "Form 1-01 — employer registration; 1-03 — each employee.",
      "Work permit change employer — **update** SSO registration.",
      "Gap in contributions — влияет на benefit eligibility.",
      "Remote on DTV без Thai payroll — **нет** Section 33 SSO от Thai job.",
    ],
  },
  {
    heading: "TIN и 180 дней: пересечение с payroll",
    section_kind: "official",
    paragraphs: [
      "Work permit и SSO **не выдают** TIN. Revenue Department: иностранец без Thai PIN получает **TIN** при попадании под personal income tax — **60 дней** с assessable income. **Tax resident** (>180 days in calendar tax year) отчитывается по Thai-source income и, с правилами remittance с 2024 года, по части **foreign income brought into Thailand** ([PIT EN](https://www.rd.go.th/english/6045)).",
      "Thai employer обычно withholds PIT и просит TIN для payroll. Если вы remote на DTV с salary abroad only и **не** remit — tax picture **индивидуальна**; blanket «не платить ничего» или «автоматически resident day 181» — оба неверны. Детальный маршрут Phuket Revenue — [TIN guide](/notes/" +
        TIN_PHUKET_SLUG +
        ").",
      "К **4–6 месяцу** на острове многие уже пересекают 180-day window в calendar year: совместите SSO payslips, employer PND.1 withholding, и личный PND.90/91 deadline (March following year).",
    ],
    bullets: [
      "TIN — L.P. 10.1; walk-in area revenue office.",
      "180 days — **tax** resident test, не immigration «long stay».",
      "Assessable income trigger — раньше, чем «ощущение полугода».",
      "Foreign income remittance 2024+ — отдельный блок RD PDF.",
      "Assist — структура доходов, не substitute licensed tax agent.",
    ],
  },
  {
    heading: "DTV, LTR, Thailand Privilege: work-right matrix",
    section_kind: "official",
    paragraphs: [
      "**DTV** (MFA/consulate): цели включают Workcation — employment contract или portfolio remote worker; **500k THB** liquidity (или эквивалент по консульству). Разрешённая модель — работа на **foreign** employer/clients. **Не** заменяет Non-B + WP для Thai company. Одновременно «DTV + Thai work permit» в marketing часто описывают как mutually exclusive paths — при смене на local hire планируйте **новую** visa category, не extension «на месте» без проверки.",
      "**LTR** (BOI): четыре типа. **Highly Skilled Professional** с entity в Таиланде — **digital work permit** через LTR portal, fee **3,000 THB/year**, collection TIESC/One Bangkok; BOI notes temporary work **while permit processing**. **Work-from-Thailand Professional** — **work permit not granted** (remote abroad). Зависимые LTR — отдельные visa, не автоматический work right.",
      "**Thailand Privilege** (state membership): long-stay **без** work/study authorization в рамках membership. Работа = Non-B, LTR, Smart или иной eligible track **поверх** или **вместо** Privilege — не «апгрейд кнопкой».",
      "Не стройте matrix «какая виза лучше для work» без employer: **нет Thai employer** → DTV/LTR-WFT/Privilege; **есть signed Thai offer** → Non-B + WP или LTR-HSP + digital WP; **passive income only** → retirement/non-O tracks вне этого note. Dual intent («DTV пока ищу Thai job») — plan B до истечения runway.",
      "Сравнение виз — sibling [DTV/LTR/Privilege note](/notes/" + VISA_DTV_LTR_SLUG + "); первый месяц порядка документов — [30 days Phuket](/notes/" + PERVYE_30_SLUG + ").",
    ],
    bullets: [
      "DTV — workcation **overseas**; soft power training — отдельное основание визы.",
      "LTR HSP — digital WP + optional 17% PIT regime (BOI marketing — проверять eligibility).",
      "LTR WFT — **no** Thai employer → **no** digital WP.",
      "Privilege — residency product; payroll нужен другой visa.",
      "Smart Visa — вне scope note; отсылка BOI при tech hire.",
    ],
  },
  {
    heading: "Phuket mes 4–6: payroll, SSO card, tax runway",
    section_kind: "practice",
    paragraphs: [
      "К четвёртому–шестому месяцу на HKT типичный сценарий «local hire» уже прошёл e-WorkPermit collection (Bangkok trip или provincial center), employee держит **pink/yellow ID** timeline parallel immigration, SSO number пришёл от HR. Банк salary account часто просит work permit + employer letter — см. bank guide в satellite inventory.",
      "Remote на DTV: к mes 4–6 проверьте **90-day report** calendar, DTV validity, и **не** ли вы случайно начали Thai B2B contracts. Если employer в EU/US переводит salary на Thai account — tax/remittance questions escalate; не смешивайте с «SSO автоматически дали в аэропорту».",
      "Couples: один spouse на WP+SSO, второй на dependent visa **без** work — второй **не** может «подменять» WP первого в family business без своего permit.",
      "Если mes 4–6 совпал с **monsoon**, trip в Bangkok за permit collection планируйте с запасом: рейсы HKT–BKK задерживаются, а slot e-WorkPermit переносится не всегда. Держите digital copies WP, SSO receipt и employment contract в одном folder — Immigration extension иногда запрашивает proof of income и WP одновременно.",
    ],
    bullets: [
      "HR deadline — SSO 30 days; просите copy 1-03 receipt.",
      "Payslip + SSO — proof для visa renewal некоторых категорий.",
      formatPracticeBullet({
        channels: ["russianinphuket", "nashi_phuket_chat"],
        period: "2025–2026",
        claim:
          "employers на острове иногда задерживают WP «пока probation» — employee legally не должен perform restricted duties до permit",
        forReader: "зафиксируйте start date vs permit date письменно до переезда семьи",
      }),
      formatPracticeBullet({
        channels: ["thailand_chatik", "pkhuket2"],
        period: "2025–2026",
        claim:
          "remote DTV holders открывают Thai Ltd «для invoicing» без WP — red flag при audit",
        forReader: "разделяйте DTV remote и Thai entity track **до** mes 4",
      }),
      "Revenue Phuket — Narisorn Rd office; TIN + PND при первом local income.",
      "Wizard — если неясно DTV vs Non-B: [/ru/wizard](/ru/wizard?utm_source=emigro&utm_medium=guide&utm_campaign=work-ss-phuket&utm_content=" +
        THAILAND_WORK_SS_SLUG +
        ").",
    ],
  },
  {
    heading: "Где сайт MOL/SSO и чаты Phuket расходятся",
    section_kind: "gap",
    paragraphs: [
      "Порталы DOE, SSO и Revenue задают порядок; в expat-чатах часто сводят всё к «виза есть — можно работать». Ниже типичные расхождения, которые всплывают к mes 4–6 на Пхукете.",
    ],
    bullets: [
      "На сайте: Non-B **можно работать после work permit**. В чате: «уже в штате, permit подождёт» — риск Alien Working Act для employer и employee.",
      "Официально: e-WorkPermit **24/7 online** с 13.10.2025. На практике: biometrics и collection slot на Пхукете или BKK остаются узким местом.",
      "SSO FAQ: регистрация **30 дней** с первого рабочего дня. На практике: HR «оформит после probation» — без 1-03 receipt вы юридически уязвимы.",
      "Revenue: TIN **60 дней** с assessable income. На практике: «180 дней — автоматически TIN в аэропорту» — миф.",
      "DTV Workcation vs MOL: remote **overseas** ≠ Thai payroll и ≠ invoicing Thai B2B без work permit.",
    ],
  },
  {
    heading: "Типичные ошибки work permit, SSO и налогов",
    section_kind: "practice",
    paragraphs: [
      "К четвёртому–шестому месяцу на HKT три контура — Immigration, Labour и Revenue — наказывают те же shortcuts, что «работали» в EU remote-мире; сверьте до подписи offer letter.",
    ],
    bullets: [
      "Подписать Thai employment и начать duties **до** collection work permit booklet.",
      "DTV/LTR-WFT + Thai Ltd «для счетов клиентам на Пхукете» без Non-B и WP.",
      "Не проверить MOL **prohibited occupation** до relocation семьи.",
      "Считать SSO card заменой private health insurance для serious inpatient.",
      "Игнорировать PND/withholding и TIN, пока «salary идёт на зарубежный счёт» — remittance и resident rules отдельно.",
    ],
  },
  {
    heading: "Assist и pillar",
    section_kind: "practice",
    paragraphs: [
      "Offer letter от Phuket hotel chain и contract с Estonian OÜ — разные compliance paths. [Emigro Assist](/ru/assist?country=thailand&utm_source=emigro&utm_medium=guide&utm_campaign=work-ss-phuket&utm_content=" +
        THAILAND_WORK_SS_SLUG +
        ") помогает разложить timeline **до** подписи; не подаёт WP за employer. Pillar [Таиланд для россиян 2026](/ru/guides/" +
        PILLAR_SLUG +
        ") — corridor context; этот note — **work_ss** slot satellite.",
    ],
    bullets: [
      "Employer must sponsor WP — Assist не заменяет HR Thai company.",
      "Role Radar — если ищете remote EU/US job из Phuket (DTV track).",
      "Не переносите EU «autónomo = work» логику на Thai SSO.",
    ],
  },
];

const keyTakeaways = [
  "Официально: work permit (DOE/MOL) нужен для employment у Thai employer; Non-Imm B visa **не** равна permit. e-WorkPermit с 13.10.2025 — online подача + biometrics в center.",
  "Официально: SSO Section 33 — employer, форма 1-03, 30 дней, work permit copy; 5% + 5% contributions, seven benefit cases (thailand.go.th).",
  "Официально: DTV Workcation — remote **overseas**; LTR digital WP — для HSP с Thai entity, **не** для Work-from-Thailand; Privilege **не** даёт work rights.",
  formatPracticeTakeaway({
    channels: ["russianinphuket", "nashi_phuket_chat"],
    period: "2025–2026",
    claim:
      "к mes 4–6 на Phuket смешивают DTV remote, Thai side gig и TIN после 180 дней — три разных enforcement track",
    forReader: "разведите visa, WP/SSO и Revenue **до** fourth month on island",
  }),
  "Prohibited occupations MOL — проверка **до** offer; «consultant на пляже» не bypass.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Достаточно ли DTV, чтобы работать в Thai company на Пхукете?",
    a: "По правилам DTV включает Workcation для **remote worker / foreign employer**, а employment у **Thai entity** требует **Non-Immigrant B + work permit** ([MFA DTV](https://image.mfa.go.th/mfa/0/P5NCnBapvr/Visa_17.05.2024/Visa_Destination_Thailand_(DTV)_Multiple_EN_FR_Dutch.pdf), [MFA Non-B](https://www.mfa.go.th/en/publicservice/non-immigrant-visa-b-for-business-and-work)). На практике «DTV + payroll Phuket hotel» без WP — риск для employer и вас; смена track планируется заранее.",
  },
  {
    q: "Кто регистрирует меня в SSO и когда?",
    a: "По правилам **employer** подаёт Sor.Por.Sor. **1-03** с копией паспорта и work permit **в течение 30 дней** с первого рабочего дня ([thailand.go.th SSO](https://thailand.go.th/guide-book-detail/007-029-2-2)). На практике просите SSO number и payslip с deduction line; без permit (DTV remote) Thai SSO от local job **нет**.",
  },
  {
    q: "180 дней на острове = автоматически нужен TIN и Thai tax на всё?",
    a: "По правилам >180 дней делает вас **tax resident** для PIT; filing зависит от **уровня income** и источников ([RD PIT EN](https://www.rd.go.th/english/6045)). TIN — **60 дней** с assessable income, не «в аэропорту day 181» ([Tax Identification EN](https://www.rd.go.th/english/21987.html)). На практике remote salary **не remitted** и DTV без Thai employer — другой профиль, чем WP+payroll; см. [TIN Phuket](/notes/" +
      TIN_PHUKET_SLUG +
      ").",
  },
  {
    q: "LTR даёт work permit «из коробки»?",
    a: "По правилам BOI: **Highly Skilled** с Thai employer — digital work permit через LTR system (fee 3,000 THB/year); **Work-from-Thailand** — permit **не выдаётся** ([LTR issuance](https://ltr.boi.go.th/page/visa-issuance-info.html)). На практике путают LTR visa sticker с правом любой работы — категория решает.",
  },
  {
    q: "Можно ли быть tour guide или открыть massage на WP?",
    a: "По правилам многие tourism/wellness roles в **prohibited occupations** list MOL даже для иностранцев с WP ([MOL EN list](https://www.mol.go.th/employee/occupation_prohibited_en)). На практике Instagram «Russian guide in Phuket» не отменяет Cabinet resolution.",
  },
  {
    q: "e-WorkPermit заменяет визит в Immigration?",
    a: "По правилам e-WorkPermit закрывает **DOE** track (подача, fee, biometrics, collection) ([MOL e-WorkPermit news](https://www.mol.go.th/en/news/labour-minister-launches-e-workpermit-online-system-for-foreign-worker-registration-24-hour-nationwide-service-begins-october-13)). На практике visa extension, 90-day report и TM30 остаются **Immigration** — см. immigration notes satellite.",
  },
];

export const THAILAND_WORK_SS_GUIDE: ThailandEditorialGuide = {
  slug: THAILAND_WORK_SS_SLUG,
  category: "Работа и SSO",
  content_kind: "guide" as ContentKind,
  title: "Work permit и SSO Таиланд 2026: Phuket, remote vs local hire",
  excerpt:
    "Permission to stay ≠ work permit: Non-B, e-WorkPermit DOE, SSO 1-03 за 30 дней, prohibited occupations MOL. DTV/LTR/Privilege — разные work rights без blanket мифов. TIN и 180 дней — Revenue. Mes 4–6 Phuket: payroll, SSO, tax runway. Wizard и Assist.",
  seo_title: "Work permit Таиланд 2026 — SSO, DTV, Пхукет",
  seo_description:
    "Work permit и SSO на Пхукете 2026: e-WorkPermit DOE, SSO 1-03 за 30 дней, DTV remote vs Thai payroll, LTR digital WP, TIN 180 дней Revenue, ошибки mes 4–6.",
  quick_answer:
    "В Таиланде **visa/extension (DTV, LTR, безвиз)** — это permission to **stay**; **work permit** (Department of Employment / e-WorkPermit с 13.10.2025) — permission to **work у Thai employer** на named должности. DTV Workcation — для **remote employer/clients outside Thailand**, не Thai payroll. Legally hired employee: employer регистрирует в **SSO** формой **1-03** в **30 дней**, 5%+5% взносы, benefits по SSO. **TIN** и tax resident **>180 дней** — Revenue Department, отдельно от WP. LTR Highly Skilled — digital work permit; Work-from-Thailand — **без** WP; Thailand Privilege — **без** work rights. Prohibited occupations — список MOL даже с WP. К 4–6 месяцу на Phuket сверьте permit, SSO payslips и TIN.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    {
      title: "MOL — e-WorkPermit launch (EN)",
      url: "https://www.mol.go.th/en/news/labour-minister-launches-e-workpermit-online-system-for-foreign-worker-registration-24-hour-nationwide-service-begins-october-13",
    },
    {
      title: "DOE — e-WorkPermit portal",
      url: "https://eworkpermit.doe.go.th/Home",
    },
    {
      title: "MFA — Non-Immigrant B (work visa)",
      url: "https://www.mfa.go.th/en/publicservice/non-immigrant-visa-b-for-business-and-work",
    },
    {
      title: "Thailand.go.th — SSO for foreign workers",
      url: "https://thailand.go.th/guide-book-detail/007-029-2-2",
    },
    {
      title: "MOL — prohibited occupations (EN)",
      url: "https://www.mol.go.th/employee/occupation_prohibited_en",
    },
    {
      title: "BOI LTR — digital work permit",
      url: "https://ltr.boi.go.th/page/visa-issuance-info.html",
    },
    {
      title: "Revenue Department — Tax Identification (EN)",
      url: "https://www.rd.go.th/english/21987.html",
    },
  ],
  topic_tags: ["phuket", "work-permit", "sso", "dtv", "ltr"],
  hashtags: buildNoteHashtags({
    topicTags: ["phuket", "work-permit", "sso"],
    contentKind: "guide",
    extra: ["thailand", "mol", "remote"],
  }),
  source_channel: "russianinphuket+nashi_phuket_chat+thailand_chatik",
  source_label: "editorial:thailand-work-ss-gold-phuket-2026",
  pillar_guide_slug: PILLAR_SLUG,
};

export default THAILAND_WORK_SS_GUIDE;
