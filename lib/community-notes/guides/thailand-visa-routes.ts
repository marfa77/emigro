/**
 * Hand-curated Thailand satellite guide — gold visa_route slot.
 * Compares RU bilateral 30-day entry (from 15 Sep 2026), TR/METV, DTV, BOI LTR, Thailand Privilege;
 * property Orders 237/2568 & 238/2568 with review caveat — never «automatic visa».
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

export const VIZA_DTV_LTR_SLUG = "viza-dtv-ltr-thailand-2026";

const PERVYE_30_SLUG = "pervye-30-dnej-phuket-2026";
const IMMIGRATION_SLUG = "immigration-phuket-chalermprakiat-2026";
const PILLAR_SLUG = "tailand-dlya-rossiyan-2026";

const WWW_PILLAR = "/ru/guides/" + PILLAR_SLUG;

const GLOSSARY: GlossaryTerm[] = [
  { pt: "Visa exemption (bilateral 30 days)", ru: "безвиз по соглашению РФ–Таиланд; штамп на въезде, туризм, не работа в TH" },
  { pt: "TR / Tourist Visa", ru: "туристическая виза через thaievisa.go.th; single или METV multi-entry" },
  { pt: "DTV (Destination Thailand Visa)", ru: "5 лет multiple entry; workcation/soft power; подача **вне** Таиланда" },
  { pt: "LTR (Long-Term Resident)", ru: "10 лет через BOI endorsement + виза; категории wealth/pension/remote/pro" },
  { pt: "Thailand Privilege Card", ru: "платное членство (бывш. Elite); long-stay visa-пакет, не work permit" },
  { pt: "Non-Immigrant B (investment)", ru: "категория для инвестиционного stay; приказы 237/2568 и 238/2568 — отдельный трек" },
  { pt: "Work permit", ru: "разрешение на работу у **тайского** работодателя; DTV ≠ work permit" },
  { pt: "TM30 / 90-day report", ru: "уведомление о адресе и отчёт для долгого статуса; см. immigration guide" },
  { pt: "thaievisa.go.th", ru: "единый портал e-Visa; для резидентов РФ оплата USD cash в посольстве Москвы" },
  { pt: "Foreign quota (condo)", ru: "до 49% иностранцев в проекте; Land Department ≠ Immigration автоматом" },
];

const DISCLAIMER =
  "**Emigro — не юридическая консультация.** Безвиз с 15.09.2026, DTV, LTR и штрафы Immigration **меняются**. Официальные каналы: [Royal Thai Embassy Moscow](https://moscow.thaiembassy.org/), [thaievisa.go.th](https://www.thaievisa.go.th/), [BOI LTR](https://ltr.boi.go.th/), [Thailand Privilege](https://www.thailandprivilege.co.th/). Полный правовой pillar — [Таиланд для россиян 2026](" +
  WWW_PILLAR +
  "). Не переносите Spain UGE, Portugal D8 или Italy nomade как «тот же DNV».";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(
      GLOSSARY,
      "Слова из чата @nashi_phuket_chat и объявления «виза с condo» — разберём до того, как безвиз 30 дней смешается с DTV, LTR и Thailand Privilege."
    ),
    paragraphs: [DISCLAIMER],
  },
  {
    heading: "Nota Emigro (fact-check)",
    section_kind: "official",
    paragraphs: [
      "Satellite **visa_route** для Phuket/Thailand 2026: сравнение маршрутов для RU. OK / soft / fixed / UNCHECKED; источники — посольство Москвы, MFA e-Visa, BOI, оператор Privilege, Immigration orders — не только expat-форумы.",
    ],
    bullets: [
      "OK: с **15 сентября 2026** общий 60-дневный безвиз для многих национальностей **заканчивается**; для **обычных паспортов РФ** остаётся **до 30 дней** по **двустороннему** соглашению РФ–Таиланд ([посольство Москва — revision visa exemption](https://moscow.thaiembassy.org/en/publicservice/revision-of-thailand-s-visa-exemption-and-visa-on-arrival-schemes)).",
      "OK: визы для резидентов РФ/РБ/УЗ/АМ/MD с **1 января 2025** — через [thaievisa.go.th](https://www.thaievisa.go.th/); оплата **cash USD** в посольстве Москвы в течение 14 дней после подачи ([e-Visa procedures Moscow](https://moscow.thaiembassy.org/en/publicservice/e-visa-application-procedures)).",
      "OK: **DTV** — validity **5 years / multiple entry**, fee **350 USD** (Moscow checklist), минимум **500 000 THB** на счёте + employment certificate / portfolio ([DTV Moscow](https://moscow.thaiembassy.org/en/publicservice/dtv)); с **31.08.2026** — **proof of permanent residence** и **criminal record clearance** ([adjustment DTV Moscow](https://moscow.thaiembassy.org/en/publicservice/adjustment-to-supporting-documents-for-destination-thailand-visa-dtv-a)).",
      "OK: **LTR** — критерии BOI **Announcement Por. 3/2568** (январь 2025): категории Wealthy Global Citizen, Wealthy Pensioner, Work-from-Thailand Professional, Highly Skilled Professional + dependents ([ltr.boi.go.th PDF](https://ltr.boi.go.th/documents/Announcement_of_the_Office_of_the_Board_of_Investment_No_Por_3_2568_(EN).pdf)).",
      "OK: **Thailand Privilege** — официальные пакеты Bronze **650 000 THB / 5 лет** … Reserve **5 000 000 THB / 20 лет** ([thailandprivilege.co.th](https://www.thailandprivilege.co.th/home)); membership ≠ гарантия визы без screening.",
      "Fixed: «**купил condo — виза выдалась автоматически**» → владение недвижимостью **не равно** иммиграционному статусу. Immigration опубликовал приказы **№237/2568** и **№238/2568** (1.10.2025), но Emigro не подтверждает по доступной официальной карточке рекламную формулу **investment / tourism-linked Non-Imm B от 3M THB** для любого нового покупателя ([immigration.go.th notice](https://www.immigration.go.th/?p=34090)).",
      "Fixed: «**DTV = work permit в Таиланде**» → DTV **workcation** для дохода **из-за рубежа**; работа у тайского employer требует **другой** категории и work permit.",
      "Fixed: «**безвиз 30 дней = digital nomad legal**» → безвиз — **туризм**; remote work из штампа **не легализует** долгий stay и **не заменяет** DTV/LTR.",
      "Soft: сроки e-Visa Москва «14 business days после оплаты» — типично; MFA может запросить согласование **4–6 недель** ([e-Visa procedures](https://moscow.thaiembassy.org/en/publicservice/e-visa-application-procedures)).",
      "Soft: практика Immigration **Phuket** (очереди, extension) — поле 2025–2026; сверяйте [Immigration Phuket guide](/notes/" + IMMIGRATION_SLUG + ").",
      "UNCHECKED: детали **3M THB property** certification через Ministry of Tourism and Sports / TLS на дату вашей сделки — приказы есть, но **пошаговая** доступность сертификации для каждого объекта Emigro не верифицировала; только lawyer + Immigration file review.",
    ],
  },
  {
    heading: "Официально: пять дорожек — безвиз, TR, DTV, LTR, Privilege",
    section_kind: "official",
    paragraphs: [
      "Для релоканта с **российским** паспортом в 2026 году на столе обычно **пять разных** дорожек. Их нельзя «склеить» в одну: у каждой — свой **срок**, **место подачи**, **деньги** и **право на работу**.",
      "**1. Безвиз 30 дней (bilateral).** Въезд **без визы** для tourism; officer ставит stay **до 30 дней** (с 15.09.2026 вместо прежних 60 дней **общего** режима для РФ). Подача — **на границе** (HKT/BKK). Деньги: proof of funds на check-in **может** спросить авиакомпания; фиксированного депозита в законе для безвиза нет. Семья: **каждый** паспорт — свой штамп. Работа: **нет** права работать в Таиланде; удалёнка для foreign client **не** оформлена как workcation без DTV.",
      "**2. Tourist Visa (TR / METV).** Если нужен **запас дней** до DTV или цикл «въезд–выезд», оформляют **TR** (single, fee на странице посольства **40 USD**) или **METV** (**200 USD**, multi-entry) через **thaievisa.go.th**, затем **личная оплата USD** в Москве. Работа: цель **туризм** — не employment в TH. Семья: **отдельные** заявки на каждого. Продление и конверсия — только по правилам Immigration для категории TR, **не** «любой статус → DTV внутри» без оснований.",
      "**3. DTV (Destination Thailand Visa).** Кабинет одобрил категорию с **июля 2024**; Moscow публикует checklist **workcation**, Muay Thai/culinary/medical, **супруг/дети до 20** у holder DTV. **5 лет**, **multiple entry**; каждый entry — stay по Immigration (часто обсуждают **180 дней + extension 180** — soft, сверяйте штамп и [Immigration](/notes/" +
        IMMIGRATION_SLUG +
        ")). Подача — **только вне Таиланда** через e-Visa + посольство/competent mission. Деньги: **≥500 000 THB** на statement (+ **2-НДФЛ** / income cert для Moscow workcation). Семья-dependents: **500k THB** и документы связи + **DTV primary**. Работа: **remote / freelance для иностранных контрагентов** — track workcation; **не** наём в Thai company.",
      "**4. LTR (BOI Long-Term Resident).** Не «ещё один DTV», а **endorsement BOI** (Por. 3/2568) → pre-approval visa → долгий stay **10 лет** при сохранении условий. Категории: **Wealthy Global Citizen** (инвестиции **USD 500k** в TH + **USD 1M** global assets — см. brochure BOI), **Wealthy Pensioner** (50+, passive income **USD 80k/год** или **USD 40k** + инвестиции), **Work-from-Thailand Professional** (employer revenue **USD 50M/3 года**, personal income **USD 80k** или **USD 40k** + degree/IP/Series A), **Highly Skilled Professional** (отдельные employer/expert rules). Страховка: **USD 50k** health или депозиты по таблице BOI. Подача: **онлайн ltr.boi.go.th**, затем виза/штамп через Immigration — **не** очередь «на пляже». Семья: супруг, **родители**, дети **до 20**, legal dependents (2025 update). Работа: **WFH professional** — remote для **foreign** employer; highly skilled — может включать work in Thailand **по условиям категории**; pensioner/global citizen — **не** local salary.",
      "**5. Thailand Privilege Card.** Государственный оператор membership ([thailandprivilege.co.th](https://www.thailandprivilege.co.th/home)): плата **650k–5M THB** за пакет на 5–20 лет + сервисы (EPA в **HKT** и BKK). Это **commercial long-stay programme**, связанный с visa privilege, но **покупка membership не равна** автоматическому одобрению без background check. Работа: **не** заменяет work permit. Семья: уточняйте пакет и immigration permission для dependents у оператора.",
      "**Как читать «30 vs 60 дней» в новостях сентября 2026.** Общий **tourist visa exemption** для списка из ~60 стран стал **30 дней** вместо прежних **60** с 15.09.2026. **Россия** в этом списке **не** «потеряла безвиз целиком»: для **ordinary passport** действует **отдельное** двустороннее правило **30 дней** — то есть срок **может совпасть** с новым general cap, но **правовое основание** другое ([Moscow revision notice](https://moscow.thaiembassy.org/en/publicservice/revision-of-thailand-s-visa-exemption-and-visa-on-arrival-schemes)). Въезд **до 14.09.2026** ещё по старым general правилам для тех, кто попадал под 60-дневный режим; с **15.09** — новая матрица. Для планирования Phuket **не** опирайтесь на заголовки «России теперь нужна виза» без чтения bilateral абзаца.",
      "**METV vs одиночный TR.** Multiple Entry Tourist Visa (**200 USD** на consular fee sheet Moscow) удобен, когда семья делает **несколько** въездов в окне 6 months, пока основной holder ждёт DTV или BOI. Это **не** замена DTV по праву работы: каждый entry остаётся **туризмом**. Financial evidence и travel itinerary проверяет consulate; «пустой» METV ради бесконечного stay — частый отказ и риск **entry denial** на следующем border.",
    ],
    bullets: [
      "Безвиз РФ — **30 дней bilateral** с 15.09.2026 ([Moscow embassy](https://moscow.thaiembassy.org/en/publicservice/revision-of-thailand-s-visa-exemption-and-visa-on-arrival-schemes)).",
      "TR/METV — **thaievisa.go.th** + cash USD Moscow.",
      "DTV — **500k THB**, 5y multiple, **вне TH**; Moscow **350 USD** + 2-НДФЛ workcation.",
      "LTR — **ltr.boi.go.th**, Por. 3/2568, USD пороги по категории.",
      "Privilege — membership fee + screening; EPA Phuket airport.",
      "Полный pillar law — [" + PILLAR_SLUG + "](" + WWW_PILLAR + ").",
    ],
  },
  {
    heading: "Где подавать: Москва, e-Visa, BOI — не «Immigration на Пхукете с нуля»",
    section_kind: "official",
    paragraphs: [
      "**Первичная виза** (TR, METV, DTV, non-immigrant для LTR после BOI OK) — **за пределами Таиланда** через [thaievisa.go.th](https://www.thaievisa.go.th/) и **Royal Thai Embassy Moscow** (Serpov Lane 6; consular **+7 495 109 1199**). Российские документы — **перевод EN + нотариус** ([e-Visa Moscow](https://moscow.thaiembassy.org/en/publicservice/e-visa-application-procedures)).",
      "**LTR qualification** — портал **[ltr.boi.go.th](https://ltr.boi.go.th/)**: загрузка evidence, запросы BOI (~**20 working days** endorsement soft), затем этап **pre-approval for visa issuance** и виза в competent embassy/consulate. Это **не** подача «в окно Phuket Immigration без prior status».",
      "**После въезда** — **Immigration Bureau** (Phuket: Chalermprakiat — см. [guide](/notes/" +
        IMMIGRATION_SLUG +
        ")): **extension**, **90-day report**, смена категории **только** если закон и приказы позволяют. TM30 по-прежнему подаёт **арендодатель** ([первые 30 дней](/notes/" +
        PERVYE_30_SLUG +
        ")).",
      "DTV с **31.08.2026**: Moscow транслирует MFA — **proof of permanent residence** вместо «current location» + **criminal record clearance**. Для граждан РФ в РФ «permanent residence» трактуйте по checklist **именно Moscow e-Visa**, не по форуму Vientiane ([adjustment notice](https://moscow.thaiembassy.org/en/publicservice/adjustment-to-supporting-documents-for-destination-thailand-visa-dtv-a)).",
      "**Почему «подам DTV в Vientiane будучи туристом» — отдельный риск.** Department of Consular Affairs не публикует единый список «какой TRP принимается» для proof of permanent residence; миссии **различаются**. Русский паспорт + **residence in Russia** логичнее вести через **Moscow** e-Visa jurisdiction ([General visa info](https://moscow.thaiembassy.org/en/page/84779-general-visa-information): apply at embassy competent for **country of residence**). Поездка «в соседнее consulate» без статуса в той стране — soft deny в чатах 2026; Emigro не рекомендует строить plan только на форумных успехах.",
      "**Оплата и сроки Moscow e-Visa.** После upload пакета система выдаёт QR; **within 14 days** нужен **cash USD** в Serpov Lane (пн–пт 9:30–12:30). Только после оплаты стартует **14 business days** processing; MFA Thailand может запросить дополнительные документы (**4–6 weeks** soft). e-Visa приходит на email — **распечатать** для airline и Immigration. Отмена после submit может означать **non-refundable** fee — читайте confirmation letter.",
    ],
    bullets: [
      "e-Visa — submit online; pay **USD cash** Moscow within **14 days**.",
      "Processing — **14 business days** после оплаты (soft + до 4–6 weeks MFA).",
      "DTV/LTR first visa — **outside Thailand** ([General visa info Moscow](https://moscow.thaiembassy.org/en/page/84779-general-visa-information)).",
      "Phuket Immigration — **post-entry** trámites, не consular filing.",
      "Privilege — заявка через **thailandprivilege.co.th** / MCC **+66 2352 3000**.",
    ],
  },
  {
    heading: "Право на работу, семья и деньги — таблица решений",
    section_kind: "official",
    paragraphs: [
      "Главная ошибка чатов — считать, что «я работаю на ноутбуке» автоматически попадает под DTV или LTR. Immigration смотрит на **категорию визы** и **источник дохода**, а не на локацию Wi‑Fi.",
      "**Работа у Thai employer** (школа, ресторан, local IT) почти всегда требует **Non-Immigrant B** + **work permit** — отдельный от DTV workcation track. **DTV** legalizes **workcation** narrative для **foreign** income; **LTR WFH Professional** — remote для компании с **foreign revenue** по Por. 3/2568. **Безвиз/TR** — tourism; local work **запрещён**.",
      "**Семья:** безвиз/TR — индивидуально. DTV dependents — **500k THB** + marriage/birth certs + visa primary. LTR — расширенный круг dependents (включая **родителей** по BOI 2025 brochure) с дополнительными insurance/deposit rules. Privilege — по контракту пакета.",
      "**Деньги (ориентиры official):** безвиз — нет фиксированного THB в bilateral notice; TR — financial evidence по e-Visa; DTV — **500 000 THB** ending balance (Moscow); LTR — **USD 40k–80k/year** income и/или **USD 500k** TH investment + **USD 1M** assets (Global Citizen) — см. [BOI LTR](https://ltr.boi.go.th/); Privilege — **650 000+ THB** membership.",
      "**Сравнение в одном абзаце (не юридическая таблица, а navigator).** Безвиз: **0 THB** госfee, **30** дней, работа **нет**, подача **airport**. TR/METV: **40–200 USD** + документы, tourism, **консульство**. DTV: **350 USD** + **500k THB**, remote workcation **да** (foreign), **5 лет** multi, **консульство вне TH**. LTR: **USD** пороги + BOI time, **10 лет**, категория решает work. Privilege: **650k+ THB**, сервисы, **не** payroll. Property 3M: **investment Non-Imm B** по приказам **237/238** — **отдельный** дорогостоящий legal track, **не** визовый бонус к ключам.",
      "**Страховка и медицина.** TR и DTV часто требуют policy на срок поездки; LTR — **USD 50k** health cover 10 months или альтернативы BOI. Tourist stamp **не** даёт Thai universal healthcare; частные клиники Phuket (Bangkok Hospital, Siriroj) принимают cash/insurance — см. health slot satellite. Для семьи закладывайте **отдельные** полисы на каждого traveler.",
    ],
    bullets: [
      "Work permit ≠ DTV ≠ tourist stamp.",
      "Remote for RU LLC — DTV/LTR WFH **если** документы сходятся.",
      "Thai payroll — другой visa + WP.",
      "Family DTV — secondary после primary holder.",
      "Insurance LTR — **USD 50k** min (BOI).",
      "Assist Route Check — audit **категории** до оплаты fee.",
    ],
  },
  {
    heading: "Недвижимость и приказы 237/2568, 238/2568 — не «автовиза»",
    section_kind: "official",
    paragraphs: [
      "Риелторские объявления «**купи condo — получи визу**» — главный источник overstayer и frozen transfers. **Покупка** регистрируется в **Land Department** (foreign quota **49%** в condo). **Иммиграционный статус** — отдельное решение Immigration/MFA.",
      "Immigration опубликовал **[№237/2568 и №238/2568](https://www.immigration.go.th/?p=34090)** с датой 1 октября 2025 года. Доступная официальная карточка подтверждает номера и предмет приказов, но не даёт Emigro достаточного англоязычного текста, чтобы самостоятельно подтвердить рекламную формулу **«3M THB за объект = новый маршрут для любого покупателя»**.",
      "Emigro **review caveat:** вторичные юридические обзоры описывают certification Ministry of Tourism and Sports, подходящий объект и последовательность смены категории/продления. Пока эти критерии не подтверждены по полному официальному тексту и конкретному делу, статус — **UNCHECKED**, а не готовый продукт. Перед DD сделки нужны письменное заключение независимого immigration lawyer и подтверждение Immigration, что объект, паспорт и payment trail подходят.",
      "Для сравнения: **LTR Wealthy Global Citizen** допускает **USD 500k** в Thai bonds/companies/**property** как часть **LTR** пакета — это **другой** programme (BOI), не замена приказам 237/238 без отдельного соответствия.",
      "Типичный **marketing funnel** застройщика: SPA → «мы оформим визу» → клиент живёт на tourist stamp. Emigro фиксирует только проверяемую границу: **Land Department transfer** и решение **Immigration** — разные государственные контуры. Срок, категория, certification и право семьи должны быть названы в письменном заключении; без этого обещание остаётся рекламой, а не основанием для въезда.",
      "Если риелтор обещает «**виза на всю семью от одного condo**» — требуйте **письменный** immigration checklist на **ваш** паспорт и **дату** transfer, а не буклет sales office. Emigro satellite **не** валидирует конкретные проекты Rawai/Kata/Bang Tao; только general law frame выше.",
    ],
    bullets: [
      "Condo quota — Land Department; visa — Immigration/MFA.",
      "Orders 237/2568 & 238/2568 — официально опубликованы; применимость к новому покупателю и срок статуса требуют отдельной проверки.",
      "3M THB ads — **UNCHECKED** как готовый универсальный маршрут на вашей дате.",
      "Property purchase **never** = automatic visa (Emigro policy).",
      "Separate DD: taxes, TM30, bank — [первые 30 дней](/notes/" + PERVYE_30_SLUG + ").",
    ],
  },
  {
    heading: "Typical RU → Phuket: безвиз, DTV или LTR на практике",
    section_kind: "practice",
    paragraphs: [
      "Типичный **remote worker** 2025–2026: **(A)** безвиз 30 → аренда Rawai/Bang Tao → TM30 → понимание, что через месяц нужен **exit или extension**; **(B)** заранее **DTV** через Moscow e-Visa (500k THB + contract + 2-НДFL + с августа 2026 **criminal record**); **(C)** при доходе **USD 80k+** и готовности к BOI dossier — **LTR WFH Professional**; **(D)** capital-heavy без remote — **Privilege Gold/Platinum** или LTR Wealthy, не «туристический штамп».",
      "После landing **HKT**: распечатайте e-Visa; сохраните штамп; попросите TM30; **не** начинайте Thai payroll без work permit. Банк на DTV **сложен** (многие branch просят long-term visa + address) — см. future bank guide; Revolut/Wise не заменяют immigration compliance.",
      "Конкуренты в SERP путают **60→30** безвиза с «России нужна виза» — для **ordinary RU passport** bilateral **30** **остаётся**, но **не** полгода туризма подряд без trámite.",
      "**Timeline пример (soft, не guarantee).** Март: безвиз entry HKT, TM30 Rawai condo rent. Апрель: сбор **500k THB** statements + employment letter + 2-НДФЛ. Май: e-Visa submit Moscow, cash USD, ждать DTV. Июнь: re-entry на DTV, 90-day report calendar. Июль–август: extension window если stay approach limit. Альтернатива: параллельно старт **LTR BOI** — дольше на endorsement, но другой horizon. **Не** смешивайте с «куплю studio и забуду про Immigration».",
      "**Soft power track DTV** (Muay Thai, culinary, medical): нужны **invitation / hospital letter** в Таиланде — популярен у тех, кто **не** remote worker; funds **500k THB** сохраняются. Семейный DTV dependent: сначала **primary** holder, потом супруг/ребёнок с **500k** и proof of relationship — планируйте **двойной** consular fee и синхронный travel.",
    ],
    bullets: [
      formatPracticeBullet({
        channels: ["nashi_phuket_chat", "thailand_chatik"],
        period: "2025–2026",
        claim:
          "DTV Moscow после полного пакета часто 3–6 недель с момента cash payment; METV брали для «моста» до одобрения DTV",
        forReader: "закладывайте runway до expiry безвиза; не overstay «пока ждём»",
      }),
      "HKT → Phuket Immigration для extension **только** по вашей категории.",
      "Soft power DTV (Muay Thai) — invitation letter host в TH.",
      "Wizard — [/ru/wizard?country=thailand](/ru/wizard?country=thailand&utm_source=emigro&utm_medium=guide&utm_campaign=viza-dtv-ltr&utm_content=" +
        VIZA_DTV_LTR_SLUG +
        ").",
      "[Assist €129](/ru/assist?country=thailand&utm_source=emigro&utm_medium=guide&utm_campaign=viza-dtv-ltr&utm_content=" +
        VIZA_DTV_LTR_SLUG +
        ") — Route Check категории.",
    ],
  },
  {
    heading: "К 4–6 месяцу: что ломается без правильного track",
    section_kind: "gap",
    paragraphs: [
      "Если месяц 1 прошёл на **безвизе/TR** без плана, к **4–6 месяцу** типичные хвосты: **overstay** fines/blacklist, **отказ extension**, аренда без TM30 receipts, **банк** закрывает счёт, страховка не покрывает chronic care. DTV holder без **90-day report** / extension теряет runway; LTR без maintained **USD assets/income/insurance** — риск non-renewal.",
      "**Property без immigration file:** к полугоду возможна «замороженная» сделка — объект куплен, **stay** всё ещё tourist. Это не редкий кейс @pkhuket2; лечится **только** сменой track **до** expiry, не нотариусом SPA.",
      "Семья на tourist stamps: ребёнок школа/медицина OK частно, но **статус** родителей irregular → проблемы при следующем entry.",
      "**DTV «5 years» не отменяет calendar.** Multiple entry ≠ бессрочное **single** stay: Immigration считает **permission to stay** каждого entry и **90-day reports** для long categories. К **mes 4–6** holder, который «забыл» extension, получает **overstay stamp** при exit — airline на re-entry может спросить history. **LTR** holder без updated BOI insurance или broken employment attestation рискует **non-renewal** на год 2.",
      "**Privilege member:** если membership fee paid, но **visa affixation** задержали, не начинайте work in TH. EPA в **Phuket International** ускоряет **airport** meet, но **не** заменяет вашу категорию в passport.",
    ],
    bullets: [
      "Overstay — штрафы + ban risk ([Immigration](/notes/" + IMMIGRATION_SLUG + ")).",
      "DTV 180+180 — следите за датами; не «5 лет = live forever».",
      "LTR — maintain BOI conditions **10 years**.",
      "Privilege — renewal membership + visa sync.",
      "3M property — **annual** extension under 238/2568 if ever approved — lawyer review.",
      "Pillar depth — [" + WWW_PILLAR + "](" + WWW_PILLAR + ").",
    ],
  },
  {
    heading: "Типичные ошибки маршрута (Phuket / RU)",
    section_kind: "practice",
    paragraphs: [
      "Повторяющиеся кейсы из Phuket chats — смешение **EU DNV** логики с Thailand.",
    ],
    bullets: [
      "Ошибка: «**60 дней безвиза** для русских в 2026» → с **15.09.2026** general 60 ended; **RU bilateral 30** ([Moscow](https://moscow.thaiembassy.org/en/publicservice/revision-of-thailand-s-visa-exemption-and-visa-on-arrival-schemes)).",
      "Ошибка: оформить **DTV изнутри** Thailand → primary application **outside** ([General visa info](https://moscow.thaiembassy.org/en/page/84779-general-visa-information)).",
      "Ошибка: **Privilege membership** = work permit → **нет**.",
      "Ошибка: **LTR** без BOI endorsement → сначала **ltr.boi.go.th**, не только e-Visa tourist.",
      formatPracticeBullet({
        channels: ["info_phuket", "russianinphuket"],
        period: "2025–2026",
        claim: "«конвертировать tourist stamp в DTV на Phuket» без exit — отказы; выезд + e-Visa заново",
        forReader: "планируйте visa run **до** overstayer, не после",
      }),
      "Ошибка: condo **= visa** — см. Nota; orders 237/238 **≠** auto.",
    ],
  },
];

const keyTakeaways = [
  "Официально: с 15.09.2026 RU ordinary passport — **безвиз 30 дней bilateral**, не general 60; tourism, не work in TH.",
  "Официально: DTV — **500k THB**, 5y multiple, подача **вне TH** via thaievisa + Moscow; с 31.08.2026 + criminal record & permanent residence proof.",
  "Официально: LTR — BOI Por. 3/2568, USD пороги, 10y track; Privilege — membership **650k+ THB**, screening.",
  formatPracticeTakeaway({
    channels: ["nashi_phuket_chat", "thailand_chatik"],
    period: "2025–2026",
    claim: "к 4–6 месяцу без DTV/LTR/Privilege extension plan — overstayer, rent без TM30, bank drop",
    forReader: "выберите track **до** expiry первого штампа; property **never** auto-visa",
  }),
  "На практике: work permit ≠ DTV workcation; orders 237/238 — investment stay с review caveat, не «купил и живи».",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Нужна ли виза россиянам в Таиланд с 15 сентября 2026?",
    a: "По правилам — **ordinary passport РФ** остаётся на **безвизе до 30 дней** по двустороннему соглашению, хотя общий 60-дневный режим для многих стран заканчивается ([Moscow embassy](https://moscow.thaiembassy.org/en/publicservice/revision-of-thailand-s-visa-exemption-and-visa-on-arrival-schemes)). На практике авиакомпания и officer могут спросить обратный билет и funds; для stay >30 нужны TR/METV, DTV, LTR или Privilege.",
  },
  {
    q: "DTV или LTR — что выбрать remote worker на Phuket?",
    a: "По правилам — **DTV workcation** при **500k THB** и foreign employment/portfolio ([DTV Moscow](https://moscow.thaiembassy.org/en/publicservice/dtv)); **LTR Work-from-Thailand Professional** при employer revenue **USD 50M/3y** и personal **USD 80k** (или **USD 40k** + degree/IP) через [ltr.boi.go.th](https://ltr.boi.go.th/). На практике DTV быстрее войти при готовом пакете; LTR — если проходите BOI wealth/income и нужен **10-летний** horizon.",
  },
  {
    q: "Можно ли работать в тайской компании на DTV?",
    a: "По правилам — DTV **workcation** для digital nomad/remote worker с доходом **вне** local employment contract в TH; Thai employer требует **Non-Imm B + work permit**. На практике payroll Phuket school/restaurant на DTV — риск отказа extension и штрафов.",
  },
  {
    q: "Купили condo 3 млн бат — виза автоматически?",
    a: "По правилам — **нет automatic visa**: официальная карточка подтверждает публикацию приказов **237/2568** и **238/2568**, но не подтверждает на доступном английском универсальную формулу для любого condo ([immigration.go.th](https://www.immigration.go.th/?p=34090)). На практике до сделки нужны полный текст критериев, письменная позиция Immigration и независимый lawyer review; SPA не является immigration approval.",
  },
  {
    q: "Где подать DTV из России?",
    a: "По правилам — [thaievisa.go.th](https://www.thaievisa.go.th/), оплата **USD cash** Royal Thai Embassy **Moscow**, applicant **outside Thailand** ([e-Visa procedures](https://moscow.thaiembassy.org/en/publicservice/e-visa-application-procedures)). На практике закладывайте переводы RU→EN нотариус + **2-НДFL** + с 31.08.2026 справку о несудимости.",
  },
  {
    q: "Чем Thailand Privilege отличается от LTR?",
    a: "По правилам — **Privilege** = membership programme ([thailandprivilege.co.th](https://www.thailandprivilege.co.th/home)) с fee **650k+ THB** и visa privilege после screening; **LTR** = BOI economic programme Por. 3/2568 с USD tests. На практике Privilege продают EPA в **HKT**; LTR — tax/BOI perks другого контура; оба **≠ work permit**.",
  },
];

export const VIZA_DTV_LTR_GUIDE: ThailandEditorialGuide = {
  slug: VIZA_DTV_LTR_SLUG,
  category: "Статус",
  content_kind: "guide" as ContentKind,
  title: "Виза Таиланд 2026: DTV, LTR, безвиз 30 дней — Phuket для RU",
  excerpt:
    "Сравнение безвиза 30 (bilateral с 15.09.2026), TR/METV, DTV, BOI LTR и Thailand Privilege для россиян: работа, семья, Москва e-Visa, деньги. Condo ≠ автовиза; приказы 237/2568 и 238/2568 — с review caveat. Satellite Phuket; pillar на www.",
  seo_title: "DTV LTR Таиланд 2026 — виза Phuket RU",
  seo_description:
    "Безвиз 30 дней RU с 15.09.2026, DTV 500k THB, BOI LTR, Privilege: работа, семья, подача в Москве thaievisa. Phuket 2026 — не Spain DNV. Condo не даёт автовизу.",
  quick_answer:
    "Для россиян с 15 сентября 2026 безвиз по соглашению РФ–Таиланд — до 30 дней tourism на въезде (общий 60-дневный режим для РФ закончился). Дольше: tourist TR/METV через thaievisa.go.th и cash USD в посольстве Москвы; DTV (500 000 THB, 5 лет multiple, workcation вне Таиланда, с 31.08.2026 справка о несудимости); LTR через ltr.boi.go.th (USD пороги Por. 3/2568); Thailand Privilege — membership от 650 000 THB. Работа у Thai employer — work permit, не DTV. Покупка condo не даёт автоматическую визу; применимость приказов 237/2568 и 238/2568 к новому покупателю — UNCHECKED до полного официального review. К 4–6 месяцу без track — overstayer и блок аренды/банка на Phuket.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    {
      title: "Посольство Таиланда Москва — безвиз 15.09.2026",
      url: "https://moscow.thaiembassy.org/en/publicservice/revision-of-thailand-s-visa-exemption-and-visa-on-arrival-schemes",
    },
    {
      title: "Thailand e-Visa (MFA)",
      url: "https://www.thaievisa.go.th/",
    },
    {
      title: "DTV — Royal Thai Embassy Moscow",
      url: "https://moscow.thaiembassy.org/en/publicservice/dtv",
    },
    {
      title: "BOI Long-Term Resident (LTR)",
      url: "https://ltr.boi.go.th/",
    },
    {
      title: "Thailand Privilege Card",
      url: "https://www.thailandprivilege.co.th/home",
    },
    {
      title: "Immigration — orders 237/2568 & 238/2568 notice",
      url: "https://www.immigration.go.th/?p=34090",
    },
  ],
  topic_tags: ["dtv", "ltr", "phuket", "visa_route", "thailand"],
  hashtags: buildNoteHashtags({
    topicTags: ["dtv", "ltr", "phuket", "visa_route", "thailand"],
    contentKind: "guide",
    extra: ["privilege", "moscow", "satellite"],
  }),
  source_channel: "nashi_phuket_chat+thailand_chatik+pkhuket2",
  source_label: "editorial:thailand-visa-route-gold-phuket-2026",
  pillar_guide_slug: PILLAR_SLUG,
};

export default VIZA_DTV_LTR_GUIDE;
