/**
 * Hand-curated Thailand satellite guide — schools & family Phuket (gold life slot: schools_family).
 * MOE/OBEC public calendar vs international admissions; visa status for minors; month 4–6 lens.
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

export const SHKOLY_SEMYA_PHUKET_SLUG = "shkoly-semya-phuket-2026";

const PILLAR_THAILAND_SLUG = "tailand-dlya-rossiyan-2026";
const DISTRICTS_SLUG = "phuket-rajony-arenda-shkoly-bolnicy-2026";
const PERVYE_30_SLUG = "pervye-30-dnej-phuket-2026";
const HEALTH_SLUG = "meditsina-phuket-strahovka-bolnicy-2026";
const VISA_SLUG = "viza-dtv-ltr-thailand-2026";
const IMMIGRATION_SLUG = "immigration-phuket-tm30-90-days-2026";

const GLOSSARY: GlossaryTerm[] = [
  { pt: "MOE / ศธ.", ru: "Ministry of Education — госшколы и часть частных; международные в реестре สช." },
  { pt: "OBEC", ru: "Office of Basic Education Commission — календарь и приём в общеобразовательные госшколы" },
  { pt: "Compulsory education", context: "9 years", ru: "обязательное базовое обучение ~7–16 лет или до 9 класса (Mathayom 3)" },
  { pt: "International school", context: "โรงเรียนนานาชาติ", ru: "частная школа в системе MOE с иностранной программой; отдельные admissions и fees" },
  { pt: "English Programme", context: "EP / IEP", ru: "англоязычная параллель внутри тайской школы; не то же самое, что British/IB campus" },
  { pt: "Non-Immigrant ED", ru: "виза категории «обучение»; для многих expat-детей — отдельный track от DTV родителя" },
  { pt: "G Code", ru: "13-значный ученический ID для ребёнка без thai household registration (политика MOE с 2025 a.y.)" },
  { pt: "Safeguarding / Child Protection Act B.E. 2546", ru: "закон о защите детей: учителя обязаны сообщать о подозрении на насилие; школы — системы безопасности" },
];

const DISCLAIMER =
  "**Emigro — не школьная и не иммиграционная консультация.** Календари OBEC, fees international schools и visa category **меняются** — сверяйте [MOE Phuket school list](https://sp.moe.go.th/web_sp_68/sp_information/index.php?id_province=83&module=view_detail_province), admissions office выбранной школы и [Immigration](https://www.immigration.go.th/). Не переносите порядок matrícula из Португалии/Испании или «школа = автомат DTV».";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(
      GLOSSARY,
      "Слова из OpenApply, TM30 и чата «школа на Пхукете» — до того как «British рядом с пляжем» станет ежедневным school run в monsoon."
    ),
    paragraphs: [DISCLAIMER],
  },
  {
    heading: "Nota Emigro (fact-check)",
    section_kind: "official",
    paragraphs: [
      "Слот **schools_family** закрываем и без детей (абзац ниже). **OK** = MOE/школьные PDF; **soft** = Phuket chats; **UNCHECKED** = fees школ без fetch в этой сессии.",
    ],
    bullets: [
      "OK: **9 лет** compulsory education, зачисление с **7 лет** до **16** или до окончания grade 9 ([Compulsory Education Act B.E. 2545 PDF](https://www.moe.go.th/backend/wp-content/uploads/2021/02/809783_0001.pdf); UNESCO HerAtlas — National Education Act §17).",
      "OK: на Пхукете MOE перечисляет **international schools** (British International Phuket, QSI, UWC, HeadStart, Kajonkiet, Oak Meadow и др.) — [sp.moe.go.th province 83](https://sp.moe.go.th/web_sp_68/sp_information/index.php?id_province=83&module=view_detail_province).",
      "OK: **BISP tuition 2026–27** — Nursery/Reception **489 000 THB/год**, Year 1–3 **750 000**, Year 7–8 **977 900**, Year 9–10/12 **982 700** ([School Fees PDF 2026–2027](https://cdn.bisphuket.ac.th/theme-content/uploads/2026/04/School-Fees-2026-2027.pdf); web [bisphuket.ac.th/admissions/school-fees](https://www.bisphuket.ac.th/admissions/school-fees/)).",
      "OK: **UWC Thailand** — Part B enrollment: копия **Non-Immigrant visa** ребёнка (ED, O, F, D), vaccination records EN, local emergency contact ([Required Admissions Documents PDF](https://resources.finalsite.net/images/v1739946190/uwcthailandacth/kiljtpmrj1jecqxo2lxs/RequiredAdmissionsDocuments.pdf)).",
      "OK: **Child Protection Act B.E. 2546** — учителя/воспитатели **обязаны** сообщать при подозрении на жестокое обращение; школы — системы guidance и safety (§29, §63 PDF [childlinethailand.org](https://www.childlinethailand.org/wp-content/uploads/2019/09/Child-Protection-Act-BE-2546.pdf)).",
      "Soft (Jan 2026 press): MOE расширило приём **иностранных/stateless** детей в **госшколы** под надзором MOE — G Code без 13-digit ID; **international schools** на другом regulatory track — не путать с «автозачисление в BISP».",
      "Fixed: «DTV родителя = ребёнок legal в любой школе без visa» → у non-Thai часто нужен **собственный** Non-Immigrant статус (ED/O и т.д.) — см. admissions pack школы.",
      "Fixed: «госшкола = сентябрь как в EU» → **OBEC**: семестр 1 **май–октябрь**, семестр 2 **ноябрь–март** (ориентир 2025–26: 5 May – 9 Oct / 1 Nov – 30 Mar — [Expatica MOE summary](https://www.expatica.com/th/education/children/school-holidays-thailand-2172857/); точные даты — приказ OBEC).",
      "UNCHECKED: fees **HeadStart**, **QSI**, **Oak Meadow** 2026–27 — только после PDF/web школы; не используем агрегаторы как источник.",
    ],
  },
  {
    heading: "Если детей нет: зачем этот гайд",
    section_kind: "official",
    paragraphs: [
      "Многие RU relocant на Phuket **без детей**, но slot **schools_family** задаёт **географию аренды**: Cherng Talay vs Rawai — разница в **40 минут** утреннего пробега, не в «красоте пляжа». Прочитав Nota и таблицу public/international, вы не арендуете villa в Nai Harn «под BISP север» и понимаете, почему соседи обсуждают **ED visa** и **school bus**. Без планов на детей — переходите к [районам](/notes/" +
        DISTRICTS_SLUG +
        ") и [первым 30 дням](/notes/" +
        PERVYE_30_SLUG +
        ").",
    ],
    bullets: [
      "Wizard family scenario: [/ru/wizard?utm_source=emigro&utm_medium=guide&utm_campaign=schools-phuket&utm_content=" +
        SHKOLY_SEMYA_PHUKET_SLUG +
        "](/ru/wizard?utm_source=emigro&utm_medium=guide&utm_campaign=schools-phuket&utm_content=" +
        SHKOLY_SEMYA_PHUKET_SLUG +
        ").",
      "Assist — audit school + visa + rent order: [/ru/assist?country=thailand#assist-form](/ru/assist?country=thailand&utm_source=emigro&utm_medium=guide&utm_campaign=schools-phuket&utm_content=" +
        SHKOLY_SEMYA_PHUKET_SLUG +
        ").",
    ],
  },
  {
    heading: "Официально: тайская госшкола vs частная vs international",
    section_kind: "official",
    paragraphs: [
      "**Государственные и муниципальные школы (OBEC)** ведут **тайскую национальную программу** на **тайском**; обучение базового уровня государство обеспечивает **бесплатно минимум 12 лет** по рамке National Education Act (§10 — quality basic education free; §17 — 9 лет compulsory). Для expat-ребёнка без thai языка это **реальный**, но тяжёлый plan B: нужен **зачисляющий школу** документ (паспорт, transcripts, при отсутствии civil registration — **G Code** по правилам MOE для школ под надзором министерства).",
      "**Частные тайские школы и English Programme (EP)** — fee ниже international, но curriculum всё ещё привязан к MOE; EP/IEP даёт больше английского **внутри** тайской системы, не заменяет IGCSE/IB track.",
      "**International schools (โรงเรียนนานาชาติ)** — отдельный **прямой договор** с школой: application fee, placement, tuition по **собственному** календарю (часто **август–июнь**, три term). На Пхукете MOE фиксирует реестр (см. Nota); крупные имена для expat: **British International School Phuket (BISP)**, **HeadStart** (Chaofah + Cherng Talay campus), **UWC Thailand**, **QSI**, **Oak Meadow**, **Kajonkiet International** — campus и возрастные диапазоны **разные**, «Phuket international» в рекламе condo не равно одному адресу.",
    ],
    bullets: [
      "Compulsory: **7–16** или grade 9 завершён — [MOE Compulsory Education Act PDF](https://www.moe.go.th/backend/wp-content/uploads/2021/02/809783_0001.pdf).",
      "Public calendar **2025–26** (orientir): sem 1 **5 May – 9 Oct 2025**, sem 2 **1 Nov 2025 – 30 Mar 2026** — сверка с OBEC/школой.",
      "International calendar **2025–26** (пример BISP PDF): Term 1 с **20 Aug 2025**, Term 2 **6 Jan 2026**, Term 3 **20 Apr 2026** — у каждой школы свой PDF.",
      "Mid-year entry international — часто **по местам** (UWC: case-by-case throughout the year; TCIS handbook: enrollment if space).",
      "Homologation при переходе **из international в public** — отдельный MOE track (**soft**, не автомат).",
    ],
  },
  {
    heading: "Официально: программы, приём и документы",
    section_kind: "official",
    paragraphs: [
      "**Curriculum:** British/IGCSE (BISP, HeadStart), **IB** (UWC Thailand — PYP/MYP/DP), American/AP у отдельных campus, **Singapore/Thai hybrid** у части Kajonkiet — выбирайте не бренд, а **exit diploma** (IBDP vs A-Level vs Thai Matayom) и **university target**.",
      "**Admissions international (типовой пакет Part A):** online form, **passport** ребёнка (UWC: ≥6 months validity), birth certificate, **2–3 года transcripts/report cards**, medical form, passport родителей, иногда **CAT4/English placement** (HeadStart: Years 3–13). **Part B после offer:** updated transcripts, **vaccination record (English)**, **Non-Immigrant visa page**, proof **health insurance**, local **emergency contact on island** (UWC day students).",
      "**Госшкола:** зачисление через **образовательный округ Phuket** / директора школы; для mid-year — наличие **vacancy** в классе; документы переводов **soft** — apostille/legalisation по запросу школы.",
      "**Safeguarding:** Child Protection Act — **mandatory reporting** для teacher/instructor при подозрении на torture/unlawful care (§29); schools shall set up **safety systems** (§63). International schools публикуют **Child Protection Policy** + Designated Safeguarding Lead (пример framework — King's Bangkok policy ссылается на Thai Act + UK KCSIE). На open day спросите: **DSL contact**, процедура report, **background checks** staff — это не «лишний вопрос», а baseline.",
    ],
    bullets: [
      "BISP one-time (2026–27 web): **application 6 000 THB**, **placement 200 000 THB** (250 000 multi-child), **refundable bond 150 000 THB** — сверх annual tuition ([fees page](https://www.bisphuket.ac.th/admissions/school-fees/)).",
      "UWC: **Non-Immigrant ED** для non-Thai — school letter **после offer**; plan **30–60 days** ([Admissions Process Guide PDF](https://resources.finalsite.net/images/v1739864580/uwcthailandacth/yjuofkmvc27aw10lckgl/UWCThailandAdmissionsProcessGuide.pdf)).",
      "ED visa consular checklist: enrollment letter + school license + MOE approval letter — [Non-Immigrant ED (embassy sample)](https://www.thaiembassy.at/en/type-of-visa/non-immigrant-visa-ed-education.html).",
      "Не путать **страховку школы** (BISP: accident до 20 000 THB on campus) с **family health insurance** — см. [медицина Phuket](/notes/" + HEALTH_SLUG + ").",
    ],
  },
  {
    heading: "Commute по районам: школа → жильё",
    section_kind: "practice",
    paragraphs: [
      "На Пхукете **нет catchment** как в EU: international school **не гарантирует** место по tambon, но **гарантирует commute**. Связка campus ↔ condo — главный фильтр аренды (подробнее [районы](/notes/" +
        DISTRICTS_SLUG +
        ")).",
      "**BISP / северный кластер (Cherng Talay, Thalang):** семьи часто живут **Laguna/Bang Tao**, **Surin/Kamala**, **Nai Yang** — 10–25 мин в dry, **25–45** в peak rain на Srisoonthorn/Cherng Talay Rd.",
      "**HeadStart Cherng Talay** (9/2 Srisoonthorn Rd) vs **Chaofah City** (Vichit, Muang) — **разные** school run: с Rawai до Cherng Talay **35–55 min**, до Chaofah **20–35 min** (soft, пробки 07:30).",
      "**UWC Thailand** (Thalang, north-east) — часть семей из **Phuket Town/Koh Kaew** или **east coast**; west beach condo = длинный утренний пробег.",
      "**Юг (Rawai, Chalong, Nai Harn):** villa-life + **school bus** или driver; public **songthaew** с car seat — **не** school commute.",
    ],
    bullets: [
      formatPracticeBullet({
        channels: ["nashi_phuket_chat", "pkhuket2"],
        period: "2025–2026",
        claim:
          "семьи с BISP/HeadStart north чаще снимают Cherng Talay/Laguna; с юга жалуются на school run 2×/день в monsoon",
        forReader: "test-drive 07:30 в wet week до deposit",
      }),
      "School bus fee — отдельная строка бюджета (**UNCHECKED** rate 2026 — только invoice школы).",
      "Phuket OneMap bus — adult mobility, не daily K–12.",
      "Парковка campus — очереди в drop-off; закладывайте **15 min** на loop.",
    ],
  },
  {
    heading: "Визы и статус: родитель DTV, ребёнок ED",
    section_kind: "official",
    paragraphs: [
      "**Родитель на DTV / LTR / безвиз** и **ребёнок в international school** — **два** imмиграционных контура. DTV (Destination Thailand Visa) — **основание родителя**, не enrollment ребёнка. Ребёнку часто нужен **Non-Immigrant O** (dependent) или **ED** (education) **до** или **после** offer — по пакету школы и consulate.",
      "**Безвиз 30 дней** (с 15.09.2026 для обычных паспортов РФ — до **30 days**, не 60): ребёнок тоже на **штампе**; mid-term school start **не продлевает** stay автоматически — нужен **extension/visa change** до expiry ([embassy notice](https://moscow.thaiembassy.org/en/publicservice/revision-of-thailand-s-visa-exemption-and-visa-on-arrival-schemes)).",
      "**TM30** — по месту проживания **каждого**; школа ≠ TM30. **90-day report** — для long-term status родителей; ребёнок на ED — свой reporting track (**soft** по category).",
      "План: **offer letter → school docs for ED → consulate/Immigration** параллельно аренде с TM30-friendly landlord — см. [visa guide](/notes/" +
        VISA_SLUG +
        ") и [Immigration Phuket](/notes/" +
        IMMIGRATION_SLUG +
        ").",
    ],
    bullets: [
      "UWC: visa types **ED, O, F, D** на enrollment checklist — не только ED.",
      "Не начинайте school year на **overstay** — штрафы и blacklist хуже waiting list.",
      "Work permit родителя **не заменяет** student visa ребёнка.",
      "Pillar: [/ru/guides/" + PILLAR_THAILAND_SLUG + "](/ru/guides/" + PILLAR_THAILAND_SLUG + ").",
    ],
  },
  {
    heading: "Nurseries, медицина и быт семьи",
    section_kind: "practice",
    paragraphs: [
      "**0–3 (nursery / preschool):** BISP **Little Ducks/Nursery** (489k THB tier 2026–27), HeadStart от **2 years**, частные **Montessori/Rainbow** на острове — **не** MOE compulsory до 7 лет, но waiting list конкурирует с Year 1.",
      "**Медицина:** Bangkok Hospital Phuket (Phuket Town) — **inpatient/pediatrics hub**; routine GP в Cherng Talay/Rawai. Для школы — **vaccination record EN**, иногда **health insurance card** copy (UWC Part B). Семейная страховка — [health guide](/notes/" +
        HEALTH_SLUG +
        "); ER без policy бьёт сильнее school fee.",
      "**Логистика:** lunch/snack часто **в tuition** BISP; halal/allergy — письменно в medical form. **ECA/after-school** — отдельная оплата. **Domestic helper** не заменяет **legal guardian** на visa forms.",
    ],
    bullets: [
      formatPracticeBullet({
        channels: ["info_phuket", "russianinphuket"],
        period: "2025–2026",
        claim:
          "родители закрывали pediatrics Bangkok Hospital + school medical form в одной неделе перед Term 1",
        forReader: "страховка и перевод vaccination — до offer deadline",
      }),
      "Childline Thailand **1323** — hotline (soft complement to school DSL).",
      "Apostille на birth certificate — если запросит admissions (**case-by-case**).",
      "Double campus HeadStart — уточните **какой** campus в offer letter.",
    ],
  },
  {
    heading: "Бюджет семьи: только диапазоны из официальных fees",
    section_kind: "official",
    paragraphs: [
      "Ниже — **не** «стоимость жизни на Phuket», а **school-side** цифры с официальных источников. Аренда, машина, helper — soft в [районах](/notes/" +
        DISTRICTS_SLUG +
        ").",
      "**BISP 2026–27 (annual tuition только):** Nursery/Reception **489 000 THB**; Year 1–3 **750 000**; Year 6 **767 700**; Year 7–8 **977 900**; Year 9–10/12 **982 700**; Year 11/13 **960 200** ([PDF](https://cdn.bisphuket.ac.th/theme-content/uploads/2026/04/School-Fees-2026-2027.pdf)). **Первый год** добавьте one-time: application **6 000**, placement **200 000**, bond **150 000** (refundable) — [fees page](https://www.bisphuket.ac.th/admissions/school-fees/).",
      "**Госшкола MOE:** tuition **0** на базовом уровне (National Education Act §10); расходы — uniform, lunch, transport, репетитор **Thai** (**soft**).",
      "**Transport BISP PDF line:** school bus **95 100 THB/year** (2025–26 fees PDF — проверьте актуальность в 2026–27 invoice).",
      "Остальные international — **UNCHECKED** в Nota; симуляция только с PDF школы.",
    ],
    bullets: [
      "Оплата term: BISP **40% / 30% / 30%** (Years 11/13 иной split) — cashflow planning.",
      "Sibling discount BISP: 5% / 15% — web fees page.",
      "Не вычитайте bond из tuition при сравнении с EU schools — это deposit.",
    ],
  },
  {
    heading: "К 4–6 месяцу: что всплывает у семьи со школой",
    section_kind: "practice",
    paragraphs: [
      "Если в **месяц 1** выбрали жильё «у моря», а школу «потом», к **4–6 месяцу** стекаются **Term 2 fees**, **monsoon school run**, **visa renewal** ребёнка и **90-day** родителей. Типичный хвост: ребёнок на **tourist stamp** mid-year, ED **ещё в consulate**, waiting list **открывается**, а lease уже **6+1**.",
      "**Monsoon (≈май–окт.):** mold в uniform closet, **отмены** outdoor ECA, опоздания на Srisoonthorn/Chaofa — не «ленивый водитель», а **инфраструктура**. Viewing schools в **Aug Term 1** не показывает **October rain run**.",
      "**Смена школы** = новый placement fee + потеря term tuition (withdrawal clauses в handbook). Лучше **1 test term** с bus, чем два campus за год.",
      "Проверьте к mes 4–6: **visa expiry** ребёнка, **receipt TM30**, **insurance renewal**, **school fee invoice** в baht со счёта ([bank guide](/notes/bank-schet-phuket-inostrancu-2026)).",
    ],
    bullets: [
      formatPracticeTakeaway({
        channels: ["thailand_chatik", "nashi_phuket_chat"],
        period: "2025–2026",
        claim:
          "к 4–6 месяцу семьи без ED visa ребёнка упирались в Immigration перед mid-year reports",
        forReader: "visa track параллельно admissions, не после lease",
      }),
      "Overstay ребёнка = риск для **re-enrollment** и travel.",
      "Public school mid-year — возможен, но **Thai language** gap к mes 4 уже огромен.",
      "Assist — разбор school+visa timeline: см. CTA в takeaways.",
    ],
  },
  {
    heading: "Где MOE-календарь, виза и реклама condo расходятся",
    section_kind: "gap",
    paragraphs: [
      "В объявлении «international school рядом» — три campus HeadStart и BISP в **Cherng Talay**, не «любая точка west coast». «DTV родителя = ребёнок ok в школе» — admissions и Immigration смотрят **отдельный** Non-Immigrant page.",
      "Главное: public **май–март** и international **август–июнь** — разные часы жизни семьи; mid-year переезд без ED visa — не «просто доплатить tuition».",
    ],
    bullets: [
      "«Госшкола бесплатно» → Thai curriculum + **G Code**/vacancy; не замена BISP без языка.",
      "«Near UWC/BISP» на Rawai → **35–55 min** school run soft — не «15 мин на карте».",
      "«School place guarantees visa» → fixed: offer letter **после** admissions; ED consulate отдельно.",
      "«EP = international diploma» → fixed: English Programme внутри MOE ≠ IGCSE/IB exit.",
      "Marketing «family villa + British school» без campus → двойной commute или смена lease к mes 4.",
      "Безвиз **30 days** (RF с 15.09.2026) → mid-term start **не продлевает** stay ребёнка автоматически.",
    ],
  },
  {
    heading: "Таймлайн и типичные ошибки",
    section_kind: "practice",
    paragraphs: [
      "**9–12 месяцев до августовского Term 1:** open day, application, CAT4; параллельно **district shortlist**. **3–4 месяца:** offer + **ED visa** + long-term rent с TM30. **Май (public track):** OBEC sem 1 start — только если готовы к **Thai** и vacancy.",
    ],
    bullets: [
      "Ошибка: condo marketing «near international school» без **campus name**.",
      "Ошибка: один passport родителя на все forms — у ребёнка **свой** visa page.",
      "Ошибка: сравнить только tuition — **placement + bus + insurance**.",
      "Ошибка: DTV родителя = «ребёнок legal» без stamp/visa.",
      "Ошибка: игнор **safeguarding** policy на tour.",
      "Ошибка: public school «бесплатно» без плана **Thai literacy**.",
      "Ошибка: school start на **overstay** после безвиза 30 days.",
    ],
  },
];

const keyTakeaways = [
  "Официально: MOE/OBEC public — май–март, Thai curriculum, 9 лет compulsory; international — свой календарь (часто август–июнь) и fees по PDF школы.",
  formatPracticeTakeaway({
    channels: ["nashi_phuket_chat", "pkhuket2"],
    period: "2025–2026",
    claim:
      "expat-семьи на Phuket чаще выбирают BISP/HeadStart/UWC + жильё Cherng Talay или Chaofah corridor, не «пляж по карте»",
    forReader: "campus → rent → visa ребёнка — в таком порядке",
  }),
  "Официально: BISP 2026–27 tuition **489k–983k THB/год** по классу + one-time placement/bond ([PDF MOE school list + BISP fees](https://cdn.bisphuket.ac.th/theme-content/uploads/2026/04/School-Fees-2026-2027.pdf)).",
  "Официально: Child Protection Act — mandatory report; ED visa ребёнка — отдельно от DTV родителя (UWC/embassy checklists).",
  formatPracticeTakeaway({
    channels: ["info_phuket"],
    period: "2026",
    claim: "к 4–6 месяцу без ED/overstay и с monsoon commute семья чаще меняет район, чем школу",
    forReader: "test-drive rain season до второго lease cycle",
  }),
  "Wizard + Assist: [/ru/wizard?utm_source=emigro&utm_medium=guide&utm_campaign=schools-phuket&utm_content=" +
    SHKOLY_SEMYA_PHUKET_SLUG +
    "](/ru/wizard?utm_source=emigro&utm_medium=guide&utm_campaign=schools-phuket&utm_content=" +
    SHKOLY_SEMYA_PHUKET_SLUG +
    ") · [/ru/assist?country=thailand&utm_source=emigro&utm_medium=guide&utm_campaign=schools-phuket&utm_content=" +
    SHKOLY_SEMYA_PHUKET_SLUG +
    "](/ru/assist?country=thailand&utm_source=emigro&utm_medium=guide&utm_campaign=schools-phuket&utm_content=" +
    SHKOLY_SEMYA_PHUKET_SLUG +
    ").",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Можно ли ребёнку учиться в тайской госшколе без визы ED?",
    a: "По правилам MOE школы под надзором министерства должны принимать детей **независимо от nationality** (G Code без Thai ID с 2025 a.y. — soft press). На практике нужны **passport**, transcripts и **legal stay**; imмиграция и школа могут запросить **Non-Immigrant** статус — уточняйте округ Phuket + Immigration **до** зачисления.",
  },
  {
    q: "Где жить с ребёнком в BISP или HeadStart Cherng Talay?",
    a: "По правилам школы не привязаны к tambon. На практике Cherng Talay, Laguna/Bang Tao, Kamala/Surin — короткий run до северных campus; Rawai/Nai Harn — **длинный** daily commute или school bus (**UNCHECKED** fee). См. [районы](/notes/" +
      DISTRICTS_SLUG +
      ").",
  },
  {
    q: "Сколько стоит international school на Phuket в 2026?",
    a: "По официальному PDF **BISP 2026–27**: tuition **489 000 THB** (Nursery) до **982 700 THB** (Year 9–10) в год; первый год + **200 000** placement и **150 000** bond. HeadStart/QSI — **UNCHECKED** здесь; только их fees page. Госшкола MOE — **0** tuition на базовом уровне (§10 National Education Act).",
  },
  {
    q: "Нужна ли ребёнку ED visa, если родитель на DTV?",
    a: "По правилам **DTV не заменяет** student status ребёнка. На практике international schools (UWC checklist) требуют **Non-Immigrant visa page** (ED/O/F/D) **до** class list; школa выдаёт support letter **после offer** — закладывайте **30–60 days** ([UWC Admissions Guide PDF](https://resources.finalsite.net/images/v1739864580/uwcthailandacth/yjuofkmvc27aw10lckgl/UWCThailandAdmissionsProcessGuide.pdf)).",
  },
  {
    q: "Когда начинается учебный год — в мае или августе?",
    a: "По правилам **OBEC public** — **май** (sem 1) и **ноябрь** (sem 2). **International** — чаще **август–июнь** (пример BISP: Term 1 **20 Aug 2025**). На практике не путайте tracks при переезде в **January**: public mid-sem vs international Term 2.",
  },
  {
    q: "Как устроено safeguarding на Phuket?",
    a: "По **Child Protection Act B.E. 2546** учителя обязаны **немедленно** сообщать при подозрении на жестокое обращение; школы — системы safety (§63). На практике international schools публикуют **Child Protection Policy** и DSL; на tour спросите reporting chain и **1323** Childline как backup.",
  },
];

export const SHKOLY_SEMYA_PHUKET_GUIDE: ThailandEditorialGuide = {
  slug: SHKOLY_SEMYA_PHUKET_SLUG,
  category: "Школы и дети",
  content_kind: "guide" as ContentKind,
  title: "Школы и семья на Пхукете 2026: тайские, international, визы и районы",
  excerpt:
    "MOE/OBEC vs BISP, HeadStart, UWC: календарь, ED visa, documents, safeguarding, commute Cherng Talay–Rawai, nurseries, бюджет по официальным fees и mes 4–6.",
  seo_title: "Семья Phuket 2026: international vs тайская школа, ED visa",
  seo_description:
    "Phuket 2026: тайская vs international (BISP, HeadStart, UWC), OBEC май–март, ED visa ребёнка, fees по PDF, safeguarding и school run по районам.",
  quick_answer:
    "На Пхукете три контура: **тайская госшкола (OBEC)** — май–март, Thai, tuition 0 на базовом уровне; **international (MOE สช.)** — свой календарь (часто август–июнь), прямой admissions. BISP 2026–27: **489k–983k THB/год** tuition по классу ([PDF](https://cdn.bisphuket.ac.th/theme-content/uploads/2026/04/School-Fees-2026-2027.pdf)). Ребёнку часто нужен **Non-Immigrant ED/O**, не «DTV родителя». Жильё: BISP/HeadStart north → **Cherng Talay**; юг → длинный run. Child Protection Act — mandatory reporting. К 4–6 месяцу — visa renewal, monsoon commute, Term fees.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    {
      title: "MOE — Phuket international & private school list (province 83)",
      url: "https://sp.moe.go.th/web_sp_68/sp_information/index.php?id_province=83&module=view_detail_province",
    },
    {
      title: "MOE — Compulsory Education Act B.E. 2545 (PDF)",
      url: "https://www.moe.go.th/backend/wp-content/uploads/2021/02/809783_0001.pdf",
    },
    {
      title: "BISP — School Fees 2026–2027 (PDF)",
      url: "https://cdn.bisphuket.ac.th/theme-content/uploads/2026/04/School-Fees-2026-2027.pdf",
    },
    {
      title: "UWC Thailand — Required Admissions Documents (PDF)",
      url: "https://resources.finalsite.net/images/v1739946190/uwcthailandacth/kiljtpmrj1jecqxo2lxs/RequiredAdmissionsDocuments.pdf",
    },
    {
      title: "Child Protection Act B.E. 2546 (PDF)",
      url: "https://www.childlinethailand.org/wp-content/uploads/2019/09/Child-Protection-Act-BE-2546.pdf",
    },
    {
      title: "Royal Thai Embassy Moscow — visa exemption 2026",
      url: "https://moscow.thaiembassy.org/en/publicservice/revision-of-thailand-s-visa-exemption-and-visa-on-arrival-schemes",
    },
  ],
  topic_tags: ["school", "phuket", "thailand", "family"],
  hashtags: buildNoteHashtags({
    topicTags: ["school", "phuket", "thailand", "family"],
    contentKind: "guide",
    extra: ["bisp", "headstart", "uwc", "ed-visa", "дети", "international"],
  }),
  source_channel: "nashi_phuket_chat+pkhuket2+info_phuket",
  source_label: "editorial:thailand-schools-family-phuket-gold-2026",
  pillar_guide_slug: PILLAR_THAILAND_SLUG,
};

export default SHKOLY_SEMYA_PHUKET_GUIDE;
