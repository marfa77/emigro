/**
 * Hand-curated Thailand satellite guide — consulate_docs slot.
 * Phuket focus: Gen.consul Phuket + when Bangkok (Sap Road / MFA legalization).
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

export const KONSULSTVO_RF_BANGKOK_DOCS_SLUG = "konsulstvo-rf-bangkok-dokumenty-2026";

const PERVYE_30_SLUG = "pervye-30-dnej-phuket-2026";
const PILLAR_THAILAND_SLUG = "tailand-dlya-rossiyan-2026";

const GLOSSARY: GlossaryTerm[] = [
  {
    pt: "phuket.kdmid.ru / bangkok.kdmid.ru",
    ru: "электронная очередь на приём в ГКС Phuket или консульский отдел Посольства РФ в Bangkok — разные учреждения",
  },
  {
    pt: "ГКС Phuket (Gen.consul)",
    ru: "Генеральное консульство РФ на острове; адрес Kohkaew — см. phuket.mid.ru; загран — через phuket.kdmid.ru",
  },
  {
    pt: "Консульский отдел Bangkok",
    ru: "приём по Sap Road 78 (вход с Soi Santiphap); очередь bangkok.kdmid.ru — не путать с канцелярией посольства",
  },
  {
    pt: "passportzu.kdmid.ru / zp.midpass.ru",
    ru: "заявления на загран 5 лет и биометрический 10 лет — заполнять до слота, не «на месте от руки»",
  },
  {
    pt: "Legalization (นิติกรณ์)",
    ru: "легализация/«нитиган» в MFA Thailand — штамп Department of Consular Affairs; до 28.02.2027 без замены апostille",
  },
  {
    pt: "Apostille (1961 Hague)",
    ru: "упрощённая форма для стран-участниц; Таиланд депонировал accession 30.06.2026, вступление **28.02.2027** (HCCH)",
  },
  {
    pt: "qlegal.consular.go.th",
    ru: "онлайн-запись на легализацию в MFA (Bangkok Chaeng Watthana, Phuket passport office и др.)",
  },
  {
    pt: "Почётный консул (Phuket)",
    ru: "Chalong, Patak Road — другой статус, не замена ГКС; перечень услуг ограничен (thailand.mid.ru contacts)",
  },
  {
    pt: "Оригинал + копия",
    ru: "на приём RF — развороты оригиналом; Thai MFA часто требует original + copy для штампа",
  },
];

const DISCLAIMER =
  "**Emigro — не юридическая консультация.** Порядок записи, легализации и перечень документов **меняются** MID/kdmid и MFA Thailand. Не переносите схему из Lisboa/Barcelona/Milano. Актуальные инструкции — [phuket.mid.ru](https://phuket.mid.ru/), [thailand.mid.ru](https://thailand.mid.ru/), [consular.mfa.go.th](https://consular.mfa.go.th/th/page/legalization).";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(
      GLOSSARY,
      "На Пхукете в одном чате смешивают «консул на Sap Road», ГКС Kohkaew, почётного консула в Chalong и легализацию в Central Festival — разберём до истечения заграна и до сделки с Thai bank."
    ),
    paragraphs: [DISCLAIMER],
  },
  {
    heading: "Nota Emigro (fact-check)",
    section_kind: "official",
    paragraphs: [
      "Разбор для граждан РФ на Phuket / Krabi / Phang-nga (2026). **OK** = thailand.mid.ru, phuket.mid.ru, bangkok/phuket kdmid, HCCH/MFA Thailand; **soft** = часы и provincial offices; **fixed** = смягчено. Не consular advice — пакет и запись на день визита только с официального сайта.",
    ],
    bullets: [
      "OK: консульский отдел Bangkok — **78 Sap Road**, Bangrak 10500, вход **Soi Santiphap**; приём посетителей **пн–пт 09:00–12:00** ([thailand.mid.ru contacts EN](https://thailand.mid.ru/en/consular-services/contacts/)).",
      "OK: очередь Bangkok — **bangkok.kdmid.ru/queue/**; Phuket Gen.consul — **63/501 Moo 2, Thepkasattri Rd, Kohkaew**, загран: **phuket.kdmid.ru/queue/** + **passportzu.kdmid.ru** ([phuket.mid.ru passport RU](https://phuket.mid.ru/ru/consular-questions/consulate-ru/international-passport/)).",
      "OK: **1 заявитель = 1 слот**; запись на загран по телефону/email **не** делают (phuket.mid.ru).",
      "OK: Таиланд **не** принимает apostille как замену полной цепочки до **28.02.2027** — instrument deposited 30.06.2026 ([HCCH](https://www.hcch.net/en/news-archive/details/?varevent=1158), [MFA Thailand](https://www.mfa.go.th/en/content/apostille-convention-eng)).",
      "OK: MFA legalization Bangkok — Legalization Division, **123 Chaeng Watthana Rd**, 08:30–14:30 ([mfa.go.th EN](https://www.mfa.go.th/en/publicservice/naturalization-legalization)).",
      "Soft: Phuket Temporary Passport Office — **CentralFestival Phuket**, phase B, 3rd floor; legalization **10:00–15:30**, запись **qlegal.consular.go.th** ([consular.mfa.go.th](https://consular.mfa.go.th/th/page/legalization)).",
      "Soft: почётный консул Phuket/Krabi/Phang-nga — **75/149 Patak Road, Chalong** (thailand.mid.ru); не равен ГКС Kohkaew.",
      "Fixed: «все документы только в Bangkok» — **устарело** для многих RF-услуг: есть **ГКС Phuket**; Bangkok всё ещё нужен для части MFA-цепочек и если услуги нет в меню Phuket.",
      "UNCHECKED: полный перечень нотариата/ЗАГС через Phuket vs только Bangkok — сверять меню **phuket.kdmid.ru** на день записи.",
      "UNCHECKED: biometрический 10 лет через Phuket — на сайте акцент на passportzu; наличие zp.midpass.ru для Kohkaew — подтвердить в инструкции слота.",
    ],
  },
  {
    heading: "Кому куда: Phuket, Bangkok и почётный консул",
    section_kind: "official",
    paragraphs: [
      "До покупки билета HKT–BKK определите **учреждение** — ГКС Phuket, консульский отдел Bangkok, MFA Thailand или почётный консул. Иначе пустая поездка на Sap Road или Chaeng Watthana съедает день и бюджет; смешение адресов остаётся главной ошибкой чата @nashi_phuket_chat.",
      "Официально на Phuket действует **Генеральное консульство РФ** (Royal Phuket Marina / Kohkaew) с отдельной очередью **phuket.kdmid.ru**. Консульский **отдел посольства** в Bangkok на Sap Road обслуживает весь королевство через **bangkok.kdmid.ru** — это не «более главный паспорт», а **другое** окно приёма с тем же MID, но своим календарём слотов.",
      "Почётный консул в Chalong (Patak Road) — контакт из реестра MID ([thailand.mid.ru contacts](https://thailand.mid.ru/en/consular-services/contacts/)); **не** подменяет загранпакет и правила kdmid для ГКС.",
    ],
    bullets: [
      "Живёте на Phuket / Krabi / Phang-nga — **первая** точка: phuket.mid.ru + phuket.kdmid.ru.",
      "Нужна легализация **таilandского** документа для РФ или наоборот — часто цепочка MFA + консульство; часть шагов только **Bangkok** или **qlegal** в Phuket office.",
      "Bangkok Sap Road — когда услуги **нет** в меню Phuket, отказ/перенаправление с Kohkaew, или вы сознательно выбрали Bangkok slot.",
      "Immigration Phuket (Chalermprakiat) — **не** консульство РФ; визы DTV/LTR и TM30 — отдельный трек ([первые 30 дней](/notes/" + PERVYE_30_SLUG + ")).",
    ],
  },
  {
    heading: "Запись: phuket.kdmid.ru, bangkok.kdmid.ru, qlegal",
    section_kind: "official",
    paragraphs: [
      "В kdmid выберите **точную** услугу, заполните портал паспорта **до** слота, сохраните номер заявки и используйте email **.ru / .рф** (Gmail на Phuket часто «теряет» письма kdmid — предупреждение на phuket.mid.ru). На входе разворачивают при неверной услуге, а семья из трёх человек = **три** отдельных времени.",
      "Bangkok queue ([bangkok.kdmid.ru/queue/](https://bangkok.kdmid.ru/queue/)) — первичная запись, перенос, отмена, проверка статуса; логика та же, что в EU consulates, но часовой пояс и трафик Sap Road другие.",
      "Thai MFA legalization — отдельная система **[qlegal.consular.go.th](https://qlegal.consular.go.th/)**; без кода из email не попасть в очередь Chaeng Watthana или Phuket passport office.",
      "Если слот на Sap Road выпал на тот же день, что qlegal в Chaeng Watthana, **сначала** выигрывает окно с более жёстким cut-off (consular 12:00) — не ставьте MFA на утро перед consular без запаса в один календарный день.",
    ],
    bullets: [
      "Загран 5 лет: анкета **[passportzu.kdmid.ru](https://passportzu.kdmid.ru/)** → печать → **phuket.kdmid.ru** (или bangkok.kdmid.ru, если так записались).",
      "Биометрия 10 лет: **[zp.midpass.ru](https://zp.midpass.ru/)** — **UNCHECKED** для вашего меню Phuket; сверить перед записью.",
      "Подтверждения визита: мониторить кабинет kdmid, не только почту; скрин «статус записи» в телефон.",
      "MFA: original + copy, паспорт, иногда перевод — по типу doc ([consular.mfa.go.th legalization](https://consular.mfa.go.th/th/page/legalization)).",
      "Оплата consular fee Phuket: по странице fees — **квитанция Bangkok Bank**, не cash/карта в окне ([phuket.mid.ru prices](https://phuket.mid.ru/en/consular-services/consulate/prices/)).",
    ],
  },
  {
    heading: "Паспорт, нотариат и civil docs: что готовить",
    section_kind: "official",
    paragraphs: [
      "Соберите пакет **полностью** дома на Phuket — консул не «допишет» ЗАГС за вас. Второй слот на Kohkaew или Sap Road может быть через недели, а просроченный загран бьёт по DTV/extension и бронированиям.",
      "Загран старше 18 ([phuket.mid.ru docs](https://phuket.mid.ru/ru/consular-questions/consulate-ru/international-passport/neobkhodimye_dokumenty/dlya_grazhdan_starshe_18_let/)): заявление passportzu, действующий загран (если есть), **внутренний паспорт РФ**, фото по форме, квитанция сбора после записи. Утеря/порча — сначала проверка гражданства (**UNCHECKED** детали на сайте).",
      "Доверенности, согласия на выезд ребёнка, копии — отдельные пункты меню kdmid; не записывайтесь на «загран», если нужен только notarial.",
    ],
    bullets: [
      "Оригиналы разворотов + **цветные копии** в отдельной папке — так требуют на практике и EU consulates, и Phuket Gen.consul.",
      "Thai **lease / TM30** — для пакета «где живёте» могут спросить; не путать с легализацией MFA.",
      "Свидетельства ЗАГС РФ: лучше **апostille в РФ до выезда** + перевод; в 2026 для **таilandских** органов apostille **ещё не** финальный шаг — см. цепочку ниже.",
      "Legalization в ГКС Phuket: тариф **USD 42 за document** (fees page) — не все doc types; уточнить до поездки.",
      "Дети: каждый ребёнок — отдельный kdmid slot; оба родителя или нотариальное согласие по правилам MID.",
      "Справка о составе семьи / marital status для Thai или RF процедур — **не** выдаётся «на коленке» в окне; если пункт есть в kdmid — отдельная запись.",
      "Смена фамилии после брака в РФ: новый загран + совпадение с Thai visa — планируйте **до** продления stamp, иначе расхождение имён в bank.",
    ],
  },
  {
    heading: "Оригиналы, копии и переводы: что класть в папку",
    section_kind: "official",
    paragraphs: [
      "Для каждого визита соберите **три слоя**: (1) удостоверяющие личность оригиналы, (2) комплект копий, (3) легализованные/переведённые doc для третьей стороны (bank, MFA, РФ). Консул не копирует весь пакет бесплатно; MFA откажет без original+copy; Immigration смотрит на **wet stamp**, не на PDF из Telegram.",
      "Переводы: для MFA часто нужен **certified** English/Thai перевод с последующим штампом Department of Consular Affairs — «перевод от знакомого» не равен legalization.",
    ],
    bullets: [
      "Паспорт РФ: оригинал + цветные копии всех заполненных страниц, включая штампы въезда в Thailand.",
      "Lease: оригинал или заверенная копия + TM30 receipt — для «proof of address», не путать с MFA legalization lease для суда РФ.",
      "Доверенность: текст на русском, иногда bilingual — **до** записи согласовать форму на phuket.mid.ru / consul.embrussia.ru.",
      "Фото: формат и количество — только из актуальной инструкции passportzu; «как на визу Шенgen» часто не подходит.",
      "USB/флешки с midpass — **soft**: если просят — без вирусов и с backup в cloud; основной носитель — бумага.",
    ],
  },
  {
    heading: "Маршрут Phuket → Bangkok: когда лететь или ехать",
    section_kind: "practice",
    paragraphs: [
      "Закладывайте **полный день** (лучше с ночёвкой) для Sap Road + Chaeng Watthana, если совмещаете RF и MFA. Утренний приём consular 09:00–12:00 не совпадает с MFA 08:30–14:30 без планирования; пробки Bangrak/Chaeng Watthana съедают буфер.",
      "На практике из HKT: рейс ~1,5 ч до BKK + Grab/BTS/MRT до **Chong Nonsi / Sam Yan** (Sap Road) или такси на Chaeng Watthana (~45–90 мин от аэропорта в зависимости от часа).",
      "Если только RF на Sap Road — можно day-trip; если MFA legalization + RF — два адреса в разные очереди → **не** один час между ними.",
    ],
    bullets: [
      "Билет HKT–BKK с запасом: consular window закрывается в **12:00** (official contacts).",
      "MFA Chaeng Watthana: последний приём **14:30** (mfa.go.th); qlegal slot **обязателен**.",
      "Альтернатива Bangkok MFA: легализация в **Phuket passport office** (CentralFestival) 10:00–15:30 — меньше перелётов, но не все categories.",
      "Сохраните PDF слотов kdmid + qlegal + скрин оплаты Bangkok Bank.",
      formatPracticeBullet({
        channels: ["nashi_phuket_chat", "pkhuket2"],
        period: "2025–2026",
        claim:
          "совмещение «загран Kohkaew утром + MFA Bangkok тем же днём» часто срывается из‑за traffic и разных систем записи — планируют 2 дня или только Phuket MFA office",
        forReader: "не покупайте обратный HKT–BKK до подтверждения обоих слотов",
      }),
    ],
  },
  {
    heading: "Легализация и apostille: цепочка в 2026 (Таиланд ещё не Hague на практике)",
    section_kind: "official",
    paragraphs: [
      "Для каждого doc нарисуйте **линейную** цепочку: кто выдал → кто ставит следующий штамп → куда предъявите (Immigration, bank, court, РФ). Утверждение «апostille в Москве хватит» — **ложь** для Thailand до **28.02.2027**; HCCH и MFA Thailand прямо указывают, что accession вступает позже ([HCCH 30.06.2026](https://www.hcch.net/en/news-archive/details/?varevent=1158)).",
      "**Россия — участник Apostille**; **Таиланд до feb 2027** — классическая **legalization**: Thai MFA (Department of Consular Affairs) и/или посольство страны выдачи.",
      "Документ **из Таиланда для РФ**: обычно Thai MFA legalization → **легализация в консульстве РФ** (Bangkok Sap Road или услуга Phuket Gen.consul — **UNCHECKED** типы).",
      "Документ **из РФ для тайlandского** органа: часто apostille РФ + **посольство Таиланда в Москве** / MFA Thailand — **UNCHECKED** ваш case; не пропускайте шаг «Royal Thai Embassy» если bank/land office требует.",
      "С **28.02.2027** (если нет objection): apostille от designated authority MFA Thailand ↔ другие HCCH states — **пересмотрите** архив doc, оформленных по старой цепочке.",
    ],
    bullets: [
      "MFA Bangkok: 123 Chaeng Watthana — regular ~200 THB/seal, ~2 рабочих дня (provincial pages).",
      "Phuket: qlegal + CentralFestival office — для многих expat кейсов **без** перелёта.",
      "Перевод на английский: certified translation может требовать отдельного штампа MFA.",
      "Консульская легализация РФ в Thailand: fee **USD 42/doc** (Phuket fees) — не замена Thai MFA для **входящих** Thai docs.",
      "Не покупайте «легализацию за час» в чате без выхода на qlegal/kdmid — риск подделки.",
      "Doc из **третьей страны** (EU, UAE): цепочка может требовать apostille страны выдачи **+** Thai MFA — не assume «EU apostille = OK» до 28.02.2027.",
      "Обратный путь (doc Thailand → РФ): после MFA — consulate РФ; храните **все** промежуточные штампы — ЗАГС/MFC в РФ смотрит на полный trail.",
      "Mail legalization MFA ([consular.mfa.go.th mail service](https://consular.mfa.go.th/th/publicservice/%E0%B8%9A%E0%B8%A3%E0%B8%B4%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B8%A3%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3%E0%B8%97%E0%B8%B2%E0%B8%87%E0%B9%84%E0%B8%9B%E0%B8%A3%E0%B8%A9%E0%B8%93%E0%B8%B5%E0%B8%A2%E0%B9%8C)) — **soft** для срочных кейсов с Phuket; закладывайте почту + tracking.",
    ],
  },
  {
    heading: "Что консульство РФ не сделает",
    section_kind: "gap",
    paragraphs: [
      "Держите **RF consular** отдельно от Immigration, Thai bank KYC, Russian tax и «исправлений» чужих виз — очередь на Kohkaew не ускорит TM30, DTV stamp или work permit.",
    ],
    bullets: [
      "**Не** выдаёт и **не** продлевает Thai visa / 90-day report — только Immigration.",
      "**Не** легализует Thai gov doc без прохождения MFA Thailand (или будущего apostille post-2027).",
      "**Не** заменяет нотариуса РФ для doc, которые по law должны быть оформлены **в России**.",
      "**Не** принимает «запись по WhatsApp» на загран — только kdmid (phuket/bangkok).",
      "**Не** гарантирует срок изготовления заграна «к вашему рейсу» — закладывайте **2 визита** и месяцы.",
      "**Не** консультирует по Thai tax / condo quota — см. pillar и профильных юристов.",
      "Почётный консул **не** равен полномочиям ГКС для passportzu-пакета.",
    ],
  },
  {
    heading: "Архив документов к 4–6 месяцу на Phuket",
    section_kind: "practice",
    paragraphs: [
      "К **4–6 месяцу** жизни на острове имейте **единую папку** (бумага + encrypted cloud) для visa renewal, bank, школы и RF consular: к этому сроку истекают первые lease, страховки, безвиз/DTV окна, и без копий вы снова летите в Bangkok или ловите слоты.",
      "Минимальный архив: сканы загран + внутренний РФ, штампы въезда, TM6/TM30 receipts, lease, страховка, Thai bank book, qlegal/kdmid confirmations, доверенности с датами expiry.",
    ],
    bullets: [
      "**Месяц 4:** проверить expiry заграна всех членов семьи → phuket.kdmid.ru **сейчас**, не «после Songkran».",
      "**Месяц 4–5:** если нужен doc для bank/land — пройти MFA chain **до** сделки, не после отказа.",
      "**Месяц 5–6:** доверенность на РФ (квартира, счёт, ЗАГС) — отдельный kdmid slot; apostille/legalization time не укладывается в «3 дня».",
      "Хранить **оригиналы** отдельно от «рабочих» копий; wet signatures — в zip-пакете.",
      "Calendar reminders: 90-day report, visa, страховка, **подтверждение kdmid** (если система требует, как в EU — проверять статус).",
      formatPracticeBullet({
        channels: ["russianinphuket", "thailand_chatik"],
        period: "2025–2026",
        claim:
          "к 5–6 месяцу часть семей впервые упирается в просроченный загран + DTV extension в один месяц — двойная очередь",
        forReader: "старт consular track за 6–9 мес. до expiry заграна",
      }),
    ],
  },
  {
    heading: "Где сайт MID и жизнь на Phuket расходятся",
    section_kind: "gap",
    paragraphs: [
      "Читайте phuket.mid.ru **и** закладывайте запас по слотам, как в EU satellites: «есть ГКС — значит без Bangkok» верно только для части услуг; легализация Thai docs и редкие civil cases всё ещё тянут в Bangkok или Chaeng Watthana.",
    ],
    bullets: [
      "На сайте «запись круглосуточно» — на практике свободные окна phuket.kdmid.ru **мониторят** неделями.",
      "Предупреждение про Gmail — на практике @nashi_phuket_chat повторяет: завести **.ru** mailbox для kdmid.",
      "«Apostille с 2026» в новостях — **fixed**: operational date **28.02.2027**, не «уже можно».",
      "Чат советует «все паспорта на Sap Road» — **устарело** при живом phuket.kdmid.ru.",
      "Путают **phuketconsul@yandex.ru** (общие вопросы) с записью на загран — для passport **только** kdmid.",
    ],
  },
  {
    heading: "Типичные ошибки у консульства и легализации",
    section_kind: "practice",
    paragraphs: [
      "На Пхукете отказы консульского трека чаще связаны со смешением учреждений, apostille до 2027 и семейными слотами, чем с «не тем фото» — ниже чеклист, который ловит разворот на входе или возврат пакета в Thai bank.",
    ],
    bullets: [
      "Запись на «загран» в kdmid, когда нужен только notarial doc — перебронируйте услугу, не надеясь «в окне поправят».",
      "Один Gmail на семью из трёх — один человек не видит подтверждение; у каждого заявителя свой **.ru/.рф** inbox и свой слот.",
      "Apostille РФ на Thai lease «вместо» MFA legalization до **28.02.2027** — bank или land office часто возвращают пакет.",
      "Day-trip HKT–BKK с MFA утром и Sap Road после обеда без запаса — cut-off 12:00/14:30 срывает вторую точку.",
      "Почётный консул Chalong вместо phuket.kdmid для passportzu — перенаправление на Kohkaew или отказ в приёме пакета.",
    ],
  },
  {
    heading: "Связанные шаги и Assist",
    section_kind: "practice",
    paragraphs: [
      "Консульство РФ — **параллельно** Immigration и bank, не заменяет их. Порядок: [/ru/wizard](/ru/wizard?utm_source=emigro&utm_medium=guide&utm_campaign=consul-phuket&utm_content=" +
        KONSULSTVO_RF_BANGKOK_DOCS_SLUG +
        ").",
      "Для аудита «visa runway + consular + MFA chain» — [Assist по Таиланду](/ru/assist?country=thailand&utm_source=emigro&utm_medium=guide&utm_campaign=consul-phuket&utm_content=" +
        KONSULSTVO_RF_BANGKOK_DOCS_SLUG +
        ").",
    ],
    bullets: [
      "[Первые 30 дней Phuket](/notes/" + PERVYE_30_SLUG + ") — TM30 и порядок до consular.",
      "Pillar: [Таиланд для россиян 2026](/ru/guides/" + PILLAR_THAILAND_SLUG + ").",
      "Хаб: [/ru/thailand](/ru/thailand).",
    ],
  },
];

const keyTakeaways = [
  "Официально: ГКС Phuket — Thepkasattri Kohkaew, **phuket.kdmid.ru**; Bangkok consular — **78 Sap Road** (Soi Santiphap), **bangkok.kdmid.ru**, приём **09:00–12:00** (thailand.mid.ru).",
  "Официально: загран — **passportzu.kdmid.ru** + личная подача; **1 человек = 1 слот**; email **.ru/.рф** (phuket.mid.ru).",
  "Официально: Таиланд accession Apostille **30.06.2026**, в силе **28.02.2027** — до этой даты полная **legalization** MFA, не «только apostille» (HCCH/MFA).",
  formatPracticeTakeaway({
    channels: ["nashi_phuket_chat", "pkhuket2"],
    period: "2025–2026",
    claim:
      "Phuket Gen.consul закрывает многие RF-визиты без BKK, но MFA legalization и редкие услуги всё ещё тянут Bangkok или qlegal в CentralFestival",
    forReader: "планируйте 2 дня BKK или Phuket MFA office до сделки bank/lease",
  }),
  "К 4–6 месяцу: архив TM30/visa/загран + старт renewal за 6–9 мес. до expiry; consular очередь не ускоряется «к high season».",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Нужно ли ехать в Bangkok за заграном, если живу на Phuket?",
    a: "По правилам — загран через **ГКС Phuket** и **phuket.kdmid.ru** после **passportzu.kdmid.ru** (phuket.mid.ru). На практике часть семей всё ещё едет на Sap Road, если нет слотов Kohkaew или перепутали учреждение — мониторьте оба kdmid, но официальный island track — Phuket Gen.consul.",
  },
  {
    q: "Таиланд уже принимает apostille?",
    a: "По правилам HCCH/MFA — instrument deposited **30.06.2026**, Convention enters force **28.02.2027**. На практике в **сентябре 2026** Thai органы и bank по-прежнему часто требуют **MFA legalization chain** — не пропускайте qlegal/MFA шаг «потому что apostille есть».",
  },
  {
    q: "Где легализовать Thai документ для банка или РФ?",
    a: "По правилам — **Department of Consular Affairs** MFA (Chaeng Watthana или provincial office + **qlegal.consular.go.th**). На практике expat на Phuket часто идёт в **CentralFestival passport office** 10:00–15:30, затем consulate РФ при необходимости — **UNCHECKED** тип doc; не смешивайте с TM30.",
  },
  {
    q: "Оригинал или копия на приём?",
    a: "По правилам kdmid/MFA — предъявляют **оригиналы** удостоверяющих doc; MFA просит **original + copy** для штампа. На практике несите цветные копии разворотов заграна и внутреннего паспорта отдельной папкой — так же, как в EU consulate guides.",
  },
  {
    q: "Что нельзя откладывать к 4–6 месяцу?",
    a: "По правилам — просроченный загран ограничивает выезд и часть consular услуг. На практике к 4–6 мес.: renewal заграна, доверенности на РФ, MFA/legalization для lease/bank, проверка DTV/extension — очередь phuket.kdmid **не** ускорится к декабрю.",
  },
  {
    q: "Чем почётный консул в Chalong отличается от ГКС?",
    a: "По правилам thailand.mid.ru — **разные** статусы и адреса (Patak Road vs Kohkaew). На практике загран и passportzu-пакет — **ГКС + kdmid**, не «консул на Patak»; honorario — ограниченный контур, **soft** перечень услуг.",
  },
];

export const KONSULSTVO_RF_BANGKOK_DOCS_GUIDE: ThailandEditorialGuide = {
  slug: KONSULSTVO_RF_BANGKOK_DOCS_SLUG,
  category: "Консульство RF",
  content_kind: "guide" as ContentKind,
  title: "Консульство РФ с Phuket: документы и поездка в Bangkok 2026",
  excerpt:
    "ГКС Phuket (phuket.kdmid.ru), Bangkok Sap Road, MFA legalization и apostille до 28.02.2027 — запись, загран, нотариат, оригиналы, маршрут HKT–BKK. Архив doc к 4–6 месяцу.",
  seo_title: "Консульство РФ Phuket Bangkok 2026 — загран, легализация",
  seo_description:
    "Документы в консульство РФ с Пхукета: phuket.kdmid.ru, Bangkok 78 Sap Road, passportzu, MFA qlegal. Apostille Тailand с 28.02.2027. Маршрут, копии, mes 4–6.",
  quick_answer:
    "На **Phuket** загран и многие RF-услуги — **Генконсульство Kohkaew** (**phuket.kdmid.ru/queue/**) после **passportzu.kdmid.ru**; **Bangkok** ( **78 Sap Road**, вход Soi Santiphap, **bangkok.kdmid.ru**, приём **09:00–12:00**) — когда нет нужной услуги на острове или нужен consular track посольства. **Apostille в Таиланде** заработает **28.02.2027** (deposit 30.06.2026, HCCH); до этой даты — **MFA legalization** (**qlegal.consular.go.th**, Chaeng Watthana или Phuket CentralFestival). **1 заявитель = 1 слот**; email **.ru/.рф**. К **4–6 месяцу** обновите архив visa/TM30/загран и начните renewal за **6–9 мес.** до expiry.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    {
      title: "phuket.mid.ru — загран и запись",
      url: "https://phuket.mid.ru/ru/consular-questions/consulate-ru/international-passport/",
    },
    {
      title: "phuket.kdmid.ru — очередь",
      url: "https://phuket.kdmid.ru/queue/",
    },
    {
      title: "thailand.mid.ru — контакты consular Bangkok",
      url: "https://thailand.mid.ru/en/consular-services/contacts/",
    },
    {
      title: "HCCH — Thailand Apostille accession",
      url: "https://www.hcch.net/en/news-archive/details/?varevent=1158",
    },
    {
      title: "MFA Thailand — legalization guidance",
      url: "https://www.mfa.go.th/en/publicservice/naturalization-legalization",
    },
    {
      title: "qlegal — запись MFA legalization",
      url: "https://qlegal.consular.go.th/",
    },
  ],
  topic_tags: ["consulado", "phuket", "bangkok", "legalization", "rf"],
  hashtags: buildNoteHashtags({
    topicTags: ["consulado", "phuket", "bangkok"],
    contentKind: "guide",
    extra: ["kdmid", "zagran", "thailand"],
  }),
  source_channel: "nashi_phuket_chat+pkhuket2+russianinphuket",
  source_label: "editorial:thailand-consulate-docs-gold-phuket-2026",
  pillar_guide_slug: PILLAR_THAILAND_SLUG,
};

export default KONSULSTVO_RF_BANGKOK_DOCS_GUIDE;
