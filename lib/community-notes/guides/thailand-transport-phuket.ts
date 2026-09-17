/**
 * Hand-curated Thailand satellite guide — transport Phuket (bus, taxi apps, bike, car).
 * Life slot `transport`. Public transport first; DLT / rental legality in second half.
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

export const TRANSPORT_PHUKET_SLUG = "transport-phuket-baik-avto-2026";

const PERVYE_30_SLUG = "pervye-30-dnej-phuket-2026";
const RAJONY_SLUG = "phuket-rajony-arenda-shkoly-bolnicy-2026";
const PILLAR_THAILAND_SLUG = "tailand-dlya-rossiyan-2026";

const GLOSSARY: GlossaryTerm[] = [
  { pt: "HKT", ru: "Phuket International Airport — север острова; отсюда Airport Bus 8411 и Phuket Smart Bus" },
  { pt: "Airport Bus 8411", ru: "оранжевый государственный автобус маршрута 8411 между аэропортом и Phuket Bus Terminal 1" },
  { pt: "Phuket Smart Bus (PKSB)", ru: "контактless-автобус вдоль западного побережья; тарифы на phuketsmartbus.com" },
  { pt: "Songthaew (blue bus)", ru: "местный пикап с двумя рядами сидений; маршрут и цена часто устные, не PKSB" },
  { pt: "Grab / Bolt", ru: "ride-hail приложения; дополняют bus, не заменяют проверку прав на байк" },
  { pt: "DLT", ru: "Department of Land Transport — права, штрафы, временные Thai licence" },
  { pt: "IDP", ru: "международное водительское удостоверение по Женеве 1949 или Вене 1968; категория должна совпадать с ТС" },
  { pt: "Por Ror Bor (Compulsory MT)", ru: "обязательная страховка ОСАГО-типа на ТС; у rental должна быть на момент выдачи" },
];

const DISCLAIMER =
  "**Emigro — не транспортная и не юридическая консультация.** Расписания HKT, тарифы PKSB и требования DLT **меняются** — сверяйте [airportbusphuket.com](https://www.airportbusphuket.com/), [phuketsmartbus.com](https://www.phuketsmartbus.com/) и [dlt.go.th](https://www.dlt.go.th/en/). Не переносите порядок «Navegante + canje DGT» из Valencia или «patente MIT» из Milano на Пхукет.";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(
      GLOSSARY,
      "Слова из HKT, остановки PKSB и проката у 7-Eleven — до того как «байк за 200 бат» превратится в блокировку паспорта и спор с DLT."
    ),
    paragraphs: [DISCLAIMER],
  },
  {
    heading: "Nota Emigro (fact-check)",
    section_kind: "official",
    paragraphs: [
      "Первая половина — bus и apps **без своего ТС**; вторая — scooter/car, DLT, страховка и договор проката. OK / soft / fixed / UNCHECKED на дату fetch сент. 2026.",
    ],
    bullets: [
      "OK: **Airport Bus 8411** — официальный маршрут аэропорт ↔ Phuket Bus Terminal 1; матрица тарифов **30–100 THB** по сегментам, **100 THB** между Terminal 1 и Airport ([price-table](https://www.airportbusphuket.com/price-table/), [timetable](https://www.airportbusphuket.com/time-table/)).",
      "OK: **Phuket Smart Bus** — flat **100 THB** Airport ⇄ Patong ⇄ Rawai; **50 THB** Bus Terminal ⇄ Patong; **Dragon Line** city shuttle **бесплатно** ([payment](https://www.phuketsmartbus.com/payment), [timetable](https://www.phuketsmartbus.com/timetable)).",
      "OK: HKT публикует Airport Bus, Airport Bus Express (Patong) и PKSB у Domestic Terminal ([phuket.airportthai.co.th](https://phuket.airportthai.co.th/)).",
      "OK: DLT признаёт **IDP** по конвенциям 1949/1968 и ASEAN-licence с переводом; вождение **без** valid licence — offence ([FVP manual](https://fvp.dlt.go.th/Manual2)).",
      "OK: **§122 Land Traffic Act** — шлем обязателен водителю и пассажиру мото; штраф **до 2 000 THB**, удвоение если пассажир без шлема (кампания RTP с **1 июня 2025**, secondary: [RTP via gcc.go.th](https://gcc.go.th/2025/05/27/%E0%B8%AA%E0%B8%B3%E0%B8%99%E0%B8%B1%E0%B8%81%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B8%95%E0%B8%B3%E0%B8%A3%E0%B8%A7%E0%B8%88%E0%B9%81%E0%B8%AB%E0%B9%88%E0%B8%87%E0%B8%8A%E0%B8%B2%E0%B8%95%E0%B8%B4-237/)).",
      "OK: Посольство Таиланда (London public page) — при вождении показывать **IDP + passport + national licence**; временный Thai licence — в DLT с visa/residence пакетом ([driving in Thailand](https://london.thaiembassy.org/en/publicservice/84710-driving-in-thailand)).",
      "Fixed: «категория B в IDP = можно любой скутер» → нужна **мото-категория** в national licence **и** IDP; car-only не покрывает 125 cc.",
      "Fixed: «Grab = легальный substitute прав на арендованный байк» → ride-hail **не** снимает требование licence/helmet/страховки на вашем rental.",
      "Soft: **songthaew** — нет единого официального тарифа; цена по маршруту и переговорам.",
      "Soft: стоимость **Grab/Bolt HKT–Patong** — динамическая; в гайде **не** фиксируем baht.",
      "UNCHECKED: точные часы **Airport Bus Express Patong** на дату поездки — сверяйте HKT + стойку у arrival hall.",
      "UNCHECKED: удержание паспорта прокатом как залог — практика поля, не единый текст DLT; риск описан как soft ниже.",
    ],
  },
  {
    heading: "Официально: из HKT без машины — Airport Bus 8411 и Express",
    section_kind: "official",
    paragraphs: [
      "После прилёта в **Phuket International Airport (HKT)** самый предсказуемый бюджетный выход в город — **Airport Bus 8411**: кондиционированный государственный автобус между **Phuket Bus Terminal 1** (Phuket Town / Old Town area) и терминалом аэропорта. Остановка у arrival hall; маршрут проходит через Thalang, Heroines Monument, Central/Big C, Surakul Stadium — полезно, если временное жильё в городе или вы меняете транспорт на **songthaew** / **PKSB**.",
      "Тарифы **не** «одна цена на весь остров»: на официальной матрице сегменты **30, 50, 70, 100 THB** в зависимости от пары остановок; поездка **Airport ↔ Bus Terminal 1** — **100 THB** (таблица на airportbusphuket.com). Расписание — hourly blocks на [timetable](https://www.airportbusphuket.com/time-table/); HKT дублирует ориентир **08:15–20:15** airport→city и **09:15–21:15** city→airport ([airportthai](https://phuket.airportthai.co.th/)).",
      "Отдельно **Airport Bus Express** ведёт по маршруту airport–Patong (HKT указывает окно **08:00–20:00** airport→Patong). Это **не** PKSB: билет и остановки — у стойки у выхода arrival; **не** подставляйте цену 8411 или 100 THB PKSB без проверки.",
    ],
    bullets: [
      "8411 — оплата на борту; контакт оператора на сайте 8411.",
      "Багаж — умеренный; с семьёй и четырьмя чемоданами чаще bus + такси последней мили.",
      "Terminal 1 — hub для **local van** в Patong (доп. fare, soft — у кассы terminal).",
      "Первый день: см. [первые 30 дней](/notes/" + PERVYE_30_SLUG + ") — SIM и Grab до выхода на bus.",
    ],
  },
  {
    heading: "Официально: Phuket Smart Bus, Dragon Line и songthaew",
    section_kind: "official",
    paragraphs: [
      "**Phuket Smart Bus (PKSB)** — основной «официальный» spine вдоль **западного побережья**: Airport → Cherng Talay → Surin/Kamala → Patong → Karon → Kata → Rawai (и обратно). Оплата: **contactless** Visa/Mastercard/JCB, **PromptPay QR**, **наличные** ([payment](https://www.phuketsmartbus.com/payment)). Flat **100 THB** на линии Airport–Rawai; **50 THB** Bus Terminal 2 ↔ Patong; дети **до 6 лет** бесплатно с paying adult.",
      "**Dragon Line** — бесплатный городской shuttle между Central Festival, Old Town и OTOP Market — удобен для банка, Immigration errands и прогулок по Phuket Town без аренды авто. Время **approximate** — на сайте PKSB прямо указано влияние traffic; используйте live tracking.",
      "**Songthaew** (синие пикапы) — параллельная сеть **без** единого тарифа на phuketsmartbus.com: маршруты Phuket Town ↔ пляжи, посадка по ходу, цена часто объявляется водителем. Это **soft** транспорт: полезен между Terminal 1 и Kathu/Patong, но для новичка менее предсказуем, чем PKSB с flat fare.",
    ],
    bullets: [
      "PKSB — посадка у Domestic Terminal у HKT (airportthai + PKSB blog).",
      "100 THB flat — тот же для tourist и local (официальный FAQ PKSB).",
      "Phuket OneMap — доп. слой маршрутов ([onemap.phuket.cloud](https://onemap.phuket.cloud/)).",
      "Выбор района определяет частоту bus — см. [районы](/notes/" + RAJONY_SLUG + ").",
    ],
  },
  {
    heading: "Практика: первые 1–2 месяца без своего ТС",
    section_kind: "practice",
    paragraphs: [
      "Типичный русскоязычный релокант на Пхукете **первые 1–2 mesi** закрывает быт так: **день 1** — Grab/Bolt из HKT до temporary condo (или 8411 до Terminal 1 + songthaew/PKSB); **неделя 1** — PKSB/Dragon Line для банка и мебели; **mes 2** — mix PKSB + Grab в вечерние часы, когда PKSB реже. Покупка или долгий lease **scooter/car в неделю 1** — частая ошибка: права, шлем, страховка и привычка левостороннего движения не успевают «сесть».",
      "Если жильё в **Cherng Talay / Bang Tao** — PKSB с севера; **Rawai / Nai Harn** — конец ветки Airport–Rawai; **Phuket Town** — 8411 + Dragon Line, иногда songthaew на Big C/Central. С детьми и school run bus **может** не хватить к **mes 3–4** — но это не повод арендовать байк **без** moto-licence.",
      "Grab и Bolt легальны как **тaxi-сервис**; фиксируйте pickup point у condo gate и сохраняйте receipt для работодателя/налога. Не путайте «удобно ездить на Grab» с «можно не оформлять права на свой rental».",
    ],
    bullets: [
      formatPracticeBullet({
        channels: ["nashi_phuket_chat", "pkhuket2", "russianinphuket"],
        period: "2025–2026",
        claim:
          "relocant в Patong/Rawai первые 6–8 недель: PKSB 100 THB + Grab вечером; scooter с mes 3 только после Thai licence или проверенного IDP moto",
        forReader: "bus first, bike not week 1",
      }),
      "8411 + van Patong — альтернатива Express, если расписание Express не сходится.",
      "Cash на songthaew — мелкие банкноты.",
      "LINE @pksb — support PKSB (официальный контакт на сайте).",
      "Муссон — задержки PKSB; закладывайте buffer (soft).",
    ],
  },
  {
    heading: "Grab, Bolt и последняя миля",
    section_kind: "practice",
    paragraphs: [
      "Там, где PKSB идёт раз в час или остановка далеко от villa gate, **Grab/Bolt** закрывают последнюю милю. Официального «единого тарифа» нет — surge в high season и в дождь. Для аэропорта HKT официальная альтернатива taxi queue остаётся; сравнивайте **8411/Express/PKSB + короткий Grab**, а не только «taxi из arrival».",
      "Мото-taxi на улице — отдельный риск: шлем и licence у водителя проверяются реже, чем у вас на rental; для семьи с детьми чаще car Grab.",
    ],
    bullets: [
      "Привязка Thai SIM — нужна для OTP Grab (см. sim guide в satellite).",
      "Bolt — второй app; имейте оба при отказе водителя.",
      "Не фиксируем THB за HKT–Kata — UNCHECKED на дату.",
    ],
  },
  {
    heading: "К 4–6 месяцу: когда bus перестаёт хватать",
    section_kind: "gap",
    paragraphs: [
      "К **4–6 mesu** у части relocant появляются **school run**, второй адрес (office/coworking), поездки в **Immigration Chalermprakiat** и Big C вне ветки PKSB. Bus остаётся для «линейных» поездок, но **время** становится дороже flat 100 THB. Типичный fork: **долгосрочная аренда авто** (lease rare для tourist visa), **покупка подержанного авто** (отдельный track — Land Department + страховка), **scooter 125 cc** или **fixed driver**.",
      "Если к этому сроку вы на **DTV/LTR** и планируете Thai bank loan на авто — без **Thai driving licence** и stable visa истории банк часто отказывает (soft, см. bank guide). Решение «куплю байк на companny» без work permit — **не** shortcut из этого note.",
      "Перед переходом на своё ТС закройте: licence/IDP, шлемы на всех членов семьи, **Por Ror Bor** и optional **class 1** health insurance — hospital bills после ДТП без coverage бьют сильнее штрафа DLT.",
    ],
    bullets: [
      "Mes 4–6 — оцените km/неделю; если >150 km и дети — car чаще окупается временем, не только baht.",
      "PKSB + Grab hybrid часто дешевле ownership без garage.",
      "Parking у condo — спросите juristic **до** покупки авто.",
      "Пробки Patong–Kathu — soft 30–60 min в peak.",
    ],
  },
  {
    heading: "Официально: DLT, IDP, Thai licence и категории",
    section_kind: "official",
    paragraphs: [
      "**Department of Land Transport (DLT)** регулирует, **имеете ли вы право управлять** конкретным ТС в Таиланде. Для краткого визита посольский public guidance: при остановке показывают **international driving permit**, **passport** и **national driving licence** ([Royal Thai Embassy London — Driving in Thailand](https://london.thaiembassy.org/en/publicservice/84710-driving-in-thailand)).",
      "DLT в manual **Foreign Vehicle Permit** перечисляет признаваемые документы: ASEAN licence (с certified English translation при необходимости), **IDP Geneva 1949**, **IDP Vienna 1968**. Если licence **не** в списке — возможен **temporary Thai licence (30 days)** в provincial office в день въезда через travel agency track для **иностранного** авто; для **аренды местного** байка логика та же: без valid moto-permission — offence.",
      "**Temporary / one-year Thai licence** (для staying > tourist): passport с **non-tourist visa** (кроме pure tourist visa в embassy text), proof of residence, medical certificate, IDP или national licence с переводом — подача в DLT Phuket или Bangkok ([dlt.go.th](https://www.dlt.go.th/en/)). U.S. Embassy публикует ориентир госпошлины **205 THB** (car) / **105 THB** (motorcycle) за Thai licence — не путать с rental daily rate.",
      "**Критично:** IDP и national licence должны содержать **мото-категорию**, если арендуете scooter. Категория **B / passenger car** **не** авторизует 125 cc automatic у DLT logic — fixed в Nota.",
    ],
    bullets: [
      "РФ — party Vienna 1968; IDP оформляйте **до** вылета в уполномоченном выдающем органе.",
      "Копии licence + passport — отдельно от rental contract.",
      "DLT Phuket — provincial office; очереди soft.",
      "FVP track — только для **иностранных** номеров, не для Hertz local fleet.",
    ],
  },
  {
    heading: "Шлемы, стандарты и полицейский контроль",
    section_kind: "official",
    paragraphs: [
      "Промышленный стандарт мото-шлема — **TIS 369** (มอก. 369); «eggshell» из проката часто формально слабее. **Land Traffic Act §122** обязывает водителя и **пассажира** носить шлем; с усилением кампании **Safe Roads** с 1.06.2025 RTP публикует штраф **до 2 000 THB** и **удвоение**, если водитель везёт пассажира без шлема (secondary press + gcc.go.th summary).",
      "На практике на Patong ещё видят riders без шлема — это **не** отмена закона; для иностранца после ДТП отсутствие шлема ухудшает и страховой спор.",
    ],
    bullets: [
      "Дети на байке — шлем обязателен; детское сиденье на scooter — отдельный риск (soft).",
      "Свой full-face — лучше, чем rental half-shell.",
      "Hotline RTP traffic **1197** (из пресс-релизов кампании).",
    ],
  },
  {
    heading: "Аренда scooter/car: договор, залог, страховка, ДТП",
    section_kind: "practice",
    paragraphs: [
      "Прокат на Пхукете — сотни точек у пляжей и в city. **По правилам** у выдачи должны быть: rental agreement, copy **registration**, действующий **compulsory motor insurance (Por Ror Bor)**, и вы должны предъявить **valid licence/IDP** matching vehicle class. **На практике** часть магазинов просит только passport и cash deposit — это **не** снимает вашей ответственности при checkpoint DLT или после аварии.",
      "Договор: фиксируйте **VIN/номер**, стартовые scratches **на фото/video**, fuel policy, **who pays** при mechanical failure, и **не** подписывайте blank liability waiver на «full repair cost». Залог passport — распространённый **soft** риск: при споре после scratch rental может задержать документ; официально passport belongs to holder — решайте deposit cash/card где возможно.",
      "**Страховка:** Por Ror Bor покрывает минимум third-party по закону; **class 1 voluntary** на rental часто **не** включена — спросите письменно. Без voluntary ваш damage + hospital может остаться на вас и deposit.",
      "**ДТП:** вызов полиции для report (especially при травме или споре fault); страховщик и rental agent; **не** покидайте место без report, если хотите претензию. На практике в лёгком scrape иногда «решают на месте» — риск, что rental позже выставит полную сумму.",
    ],
    bullets: [
      formatPracticeBullet({
        channels: ["info_phuket", "thailand_chatik"],
        period: "2025–2026",
        claim:
          "споры rental: deposit 5–15k THB удержан за paint scratch; без pre-rent video проигрывают арендатор",
        forReader: "video walkaround обязателен",
      }),
      "Международная карта — rental может блокировать сумму; проверьте franchise.",
      "Пьяное вождение — уголовный риск, страховка void soft.",
      "Электросамокат >25 km/h — по moto rules (soft), не «игрушка».",
    ],
  },
  {
    heading: "Типичные ошибки транспорта на Пхукете",
    section_kind: "practice",
    paragraphs: [
      "Ошибки, которые повторяют relocant из EU-corridor, адаптированные под остров.",
    ],
    bullets: [
      "Ошибка: scooter в **неделю 1** с car-only IDP.",
      "Ошибка: «PKSB 100 THB = unlimited island» — только corridor западного coast + city lines.",
      "Ошибка: игнор **8411 timetable** → час жары у curb при наличии Express/PKSB.",
      "Ошибка: ехать без шлема «как местные».",
      "Ошибка: подписать rental на Thai без перевода ключевых пунктов liability.",
      "Ошибка: копировать Valencia «metro flat» — здесь **несколько** тарифных систем.",
    ],
  },
  {
    heading: "Wizard, pillar и Assist",
    section_kind: "practice",
    paragraphs: [
      "Маршрут визы (DTV vs 30-day) влияет на **можно ли** получить Thai licence — [pillar Таиланд](/ru/guides/" +
        PILLAR_THAILAND_SLUG +
        "). Оценка «bus vs bike vs car» для вашей семьи — [Wizard](/ru/wizard?utm_source=emigro&utm_medium=guide&utm_campaign=transport-phuket&utm_content=" +
        TRANSPORT_PHUKET_SLUG +
        "). Спор после ДТП или блок deposit — [Assist Route Check](/ru/assist?country=thailand&utm_source=emigro&utm_medium=guide&utm_campaign=transport-phuket&utm_content=" +
        TRANSPORT_PHUKET_SLUG +
        ").",
    ],
    bullets: [
      "[Первые 30 дней](/notes/" + PERVYE_30_SLUG + ") — HKT transfer.",
      "[Районы и commute](/notes/" + RAJONY_SLUG + ").",
    ],
  },
];

const keyTakeaways = [
  "Официально: HKT — Airport Bus 8411 (матрица 30–100 THB, Terminal 1–Airport 100 THB) и PKSB (100 THB Airport–Rawai, 50 THB Terminal–Patong, Dragon Line free) — phuketsmartbus.com + airportbusphuket.com.",
  "Официально: DLT — IDP 1949/1968 или ASEAN licence; moto требует moto-категории; §122 — шлем водителю и пассажиру, до 2 000 THB штраф (кампания с 01.06.2025).",
  formatPracticeTakeaway({
    channels: ["nashi_phuket_chat", "russianinphuket"],
    period: "2025–2026",
    claim: "первые 1–2 mesi: PKSB/8411 + Grab; scooter не в неделю 1 без проверенных прав",
    forReader: "bus spine, licence before bike",
  }),
  "На практике: rental — video осмотр, Por Ror Bor, не отдавать passport если можно cash deposit; к 4–6 mesu bus может не покрыть school run — планируйте car/licence заранее.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Можно ли первый месяц на Пхукете без машины и байка?",
    a: "По правилам HKT связан с Phuket Town через Airport Bus 8411, западное побережье — Phuket Smart Bus с flat fare на официальном сайте. На практике relocant в Patong/Kata/Rawai первые 1–2 mesi комбинируют PKSB 100 THB, Dragon Line в город и Grab вечером; scooter не обязателен в неделю 1.",
  },
  {
    q: "Сколько стоит автобус из аэропорта на Patong?",
    a: "По правилам PKSB Airport–Patong входит в линию Airport–Rawai с flat **100 THB** (phuketsmartbus.com/payment). Отдельно HKT указывает **Airport Bus Express** Patong — тариф **не** смешивайте с 8411; на практике сравните Express, PKSB и Grab по времени, не по выдуманной цене taxi.",
  },
  {
    q: "Достаточно ли российских прав или только IDP?",
    a: "По правилам посольский public guidance и DLT признают **IDP** (Vienna/Geneva) вместе с national licence; вождение без valid permission — offence. На практике на checkpoint показывают IDP + passport + national; **car-only** не покрывает аренду 125 cc scooter.",
  },
  {
    q: "Обязателен ли шлем пассажиру на байке?",
    a: "По правилам §122 Land Traffic Act — да, для водителя и пассажира; штраф до 2 000 THB, удвоение при пассажире без шлема (усиление контроля с 01.06.2025, RTP). На практике rental иногда выдаёт один шлем — докупите второй до поездки вдвоём.",
  },
  {
    q: "Что проверить в договоре проката перед подписью?",
    a: "По правилам — registration, Por Ror Bor, соответствие licence классу ТС. На практике — video scratches, сумма deposit, кто платит при ДТП, можно ли **не** оставлять passport; class 1 voluntary insurance спросите письменно.",
  },
  {
    q: "Когда bus перестаёт хватать?",
    a: "По правилам PKSB и 8411 покрывают corridor, не каждый soi. На практике к **4–6 mesu** school run и частые поездки в Immigration/Big C толкают к car, fixed driver или scooter — но только после licence/шлем/страховки, не «по умолчанию mes 2».",
  },
];

export const TRANSPORT_PHUKET_GUIDE: ThailandEditorialGuide = {
  slug: TRANSPORT_PHUKET_SLUG,
  category: "Транспорт",
  content_kind: "guide" as ContentKind,
  title: "Транспорт Пхукета 2026: bus из HKT, PKSB, байк и права DLT",
  excerpt:
    "Airport Bus 8411, Phuket Smart Bus 100 THB, songthaew и Grab — первые 1–2 месяца без ТС. DLT, IDP moto-категория, шлем §122, rental и ДТП. Mes 4–6: когда bus не тянет school run. Тарифы с официальных сайтов, без выдуманных цен taxi.",
  seo_title: "Транспорт Пхукет 2026 — автобус HKT, байк, права",
  seo_description:
    "Пхукет 2026: Airport Bus 8411, Smart Bus 100 THB, Grab. Без машины 1–2 mesi. DLT IDP, шлем, аренда скутера и страховка. Официальные тарифы PKSB и DLT.",
  quick_answer:
    "На Пхукете первые 1–2 месяца можно обойтись без своего авто: из HKT — Airport Bus 8411 (официальная матрица 30–100 THB, Terminal 1–Airport 100 THB) и Phuket Smart Bus flat 100 THB вдоль Patong–Kata–Rawai; в город — Dragon Line free. Grab/Bolt — последняя миля; songthaew — soft без единого тарифа. Scooter/car: DLT требует valid licence/IDP с **мото-категорией** для 125 cc; §122 — шлем всем, штраф до 2 000 THB. Rental: Por Ror Bor, video осмотр, осторожно с залогом passport. К 4–6 месяцу bus часто не покрывает school run — планируйте car или licence заранее.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "Airport Bus Phuket 8411 — тарифы", url: "https://www.airportbusphuket.com/price-table/" },
    { title: "Phuket Smart Bus — оплата и тарифы", url: "https://www.phuketsmartbus.com/payment" },
    { title: "Phuket International Airport — ground transport", url: "https://phuket.airportthai.co.th/" },
    { title: "DLT — Foreign Vehicle Permit manual (licence rules)", url: "https://fvp.dlt.go.th/Manual2" },
    { title: "Royal Thai Embassy — driving in Thailand", url: "https://london.thaiembassy.org/en/publicservice/84710-driving-in-thailand" },
  ],
  topic_tags: ["transport", "phuket", "thailand", "dlt", "pksb"],
  hashtags: buildNoteHashtags({
    topicTags: ["transport", "phuket", "thailand", "dlt", "pksb"],
    contentKind: "guide",
    extra: ["hkt", "scooter", "satellite"],
  }),
  source_channel: "nashi_phuket_chat+pkhuket2+russianinphuket",
  source_label: "editorial:thailand-transport-gold-phuket-2026",
  pillar_guide_slug: PILLAR_THAILAND_SLUG,
};

export default TRANSPORT_PHUKET_GUIDE;
