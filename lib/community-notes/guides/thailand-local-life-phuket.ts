/**
 * Hand-curated Thailand satellite guide — climate, monsoon and daily life Phuket (months 4–6).
 * Gold slot `local_life`. TMD / municipality / DDC separated from expat field practice.
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

export const KLIMAT_MUSSON_PHUKET_SLUG = "klimat-musson-byt-phuket-2026";

const PILLAR_THAILAND_SLUG = "tailand-dlya-rossiyan-2026";
const RAJONY_SLUG = "phuket-rajony-arenda-shkoly-bolnicy-2026";
const ARENDA_SLUG = "arenda-phuket-dolgosrok-2026";
const HEALTH_SLUG = "meditsina-phuket-strahovka-bolnicy-2026";

const GLOSSARY_INTRO =
  "Слова из прогноза TMD, договора аренды и чата соседей — чтобы «dry season на Пхукете» не означало «кондиционер не нужен» и «муссон = весь день льёт».";

const LOCAL_GLOSSARY: GlossaryTerm[] = [
  { pt: "southwest monsoon", context: "มรสุมตะวันตกเฉียงใต้", ru: "сезон муссона с мая–окт.: ветер с Андманского моря, ливни, высокий прибой на западном побережье" },
  { pt: "dry season", ru: "ноябрь–апрель: меньше дождя на западе, но влажность и жара остаются; «сухой» ≠ прохладный" },
  { pt: "TMD (Thai Meteorological Department)", context: "กรมอุตุนิยมวิทยา", ru: "официальный прогноз, предупреждения о ливнях, волнах и наводнениях; call center 1182" },
  { pt: "PEA (Provincial Electricity Authority)", context: "การไฟฟ้าส่วนภูมิภาค", ru: "региональный оператор электричества на Пхукете; счёт по meter, tier tariff" },
  { pt: "split air-con / inverter", ru: "настенный кондиционер; inverter снижает расход при длительной работе в wet season" },
  { pt: "dehumidifier", ru: "осушитель воздуха; часто нужнее «ещё одного вентилятора» в condo после ливня" },
  { pt: "red flag (beach)", ru: "купание запрещено — шторм, rip current; решение lifeguard, не «красивые волны»" },
  { pt: "flash flood / forest runoff", ru: "кратковременное затопление после ливня у подножий и в низинах — предупреждает TMD" },
  { pt: "Songkran", context: "สงกรานต์", ru: "тайский Новый год (апр.); магазины и банки закрыты, дороги мокрые и шумно" },
  { pt: "Makha Bucha / Visakha Bucha", ru: "буддийские праздники (март/май–июнь); алкоголь в ряде зон ограничен, офисы банков закрыты" },
];

const DISCLAIMER =
  "**Emigro — не юридическая консультация.** Климат, штормовые флаги и коммунальные тарифы **меняются**. Hard-правила — [TMD](https://www.tmd.go.th/en/weather/weatherthailand), [Phuket City waste](https://www.phuketcity.go.th/new/eco), [DDC dengue](https://www.ddc.moph.go.th/uploads/files_en/filedata/Prevent%20mosquito%20bites.pdf). Иммиграция и визы — [pillar Таиланд](/ru/guides/" +
  PILLAR_THAILAND_SLUG +
  ").";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(LOCAL_GLOSSARY, GLOSSARY_INTRO),
    paragraphs: [DISCLAIMER],
  },
  {
    heading: "Nota Emigro (fact-check)",
    section_kind: "official",
    paragraphs: [
      "Климат и быт Phuket — TMD, муниципалитет, DDC; практика condo и счёт PEA — soft из чатов. **OK** = fetch; **Soft** = поле; **UNCHECKED** = не верифицировали точную цифру.",
    ],
    bullets: [
      "OK: юго-западный муссон доминирует над Андаманским морем и югом Таиланда в wet season; TMD предупреждает о **flash floods, forest runoff и оползнях** у подножий, водотоков и низин ([TMD Thailand weather](https://www.tmd.go.th/en/weather/weatherthailand)).",
      "OK: в прогнозе для **Southern (West Coast) from Phuket upwards** волны **2–3 m** и **above 3 m in thundershowers**; малые суда — осторожность или не выходить ([TMD 7-day forecast](https://www.tmd.go.th/en/forecast/sevenday)).",
      "OK: нормали 1981–2010 по Таиланду — API **ThailandClimateNormal** ([data.tmd.go.th](https://data.tmd.go.th/api/index1.php)); станция Phuket в сервисе TMD Info.",
      "OK: **красный флаг** на пляже = не купаться; жёлтый/зелёный — с осторожностью ([TAT monsoon marine info](https://www.tatnews.org/2018/07/important-information-on-marine-tourism-in-thailand-during-the-southwest-monsoon-season/)).",
      "OK: DDC — dengue через укусы **Aedes**; профилактика: repellent, сетки, убрать стоячую воду, мусор ([DDC PDF](https://www.ddc.moph.go.th/uploads/files_en/filedata/Prevent%20mosquito%20bites.pdf), hotline **1422**).",
      "OK: Phuket City — eco/waste notices, hotline **1132**, bulky waste booking ([phuketcity.go.th/eco](https://www.phuketcity.go.th/new/eco), [cleanhome.phuketcity.go.th](https://cleanhome.phuketcity.go.th/)).",
      "OK: банковские выходные 2569 — BOT calendar incl. **2 Jan 2026** additional holiday ([BOT PDF](https://www.bot.or.th/content/dam/bot/fipcs/documents/FPG/2568/EngPDF/25680162.pdf)).",
      "Soft: счёт PEA ฿3k–8k/мес на 1–2 BR condo при AC 8–12 h/day в апр.–май — зависит от tier, inverter и этажа.",
      "Soft: «сентябрь = самый мокрый месяц» — близко к TMD monthly stats (Phuket ~277 mm в июле 2026 в bulletin), но год от года меняется.",
      "Fixed: «муссон = весь день дождь без солнца» → TMD и TAT описывают **кратковременные ливни** и переменную облачность, не непрерывный ливень 24/7.",
    ],
  },
  {
    heading: "Официально: муссон, жара и влажность TMD",
    section_kind: "official",
    paragraphs: [
      "Пхукет лежит на **западном побережье** Андаманского моря. С **мая по октябрь** (юго-западный муссон) TMD фиксирует частые грозовые ливни, усиление ветра и **волны 2–3 m** у побережья; в грозах — выше. Это не «закрытый остров», но **море и ferry** нужно сверять с [shipping forecast TMD](https://www5.tmd.go.th/en/forecast/shipping) в день поездки.",
      "С **ноября по апрель** (dry season на западе) дождя меньше, небо суше, но **влажность и UV** остаются тропическими. Нормали TMD 1981–2010 для Phuket (станция) — ориентир для «типичного года», не для El Niño 2026: краткосрочные bulletin TMD важнее блогов про «идеальный январь».",
      "TMD прямо просит жителей **беречься накопленных осадков**: flash floods, переполнение лотков, **forest runoff** на склонах. Это касается не только северных провинций — **Phuket, Krabi, Phang-Nga** попадают в южные предупреждения при сильном муссоне. Низины **Phuket Town**, участки у **Kathu hills** и дороги вдоль русел после ливня — зоны, где expat-чаты дублируют официальное «avoid flood-prone routes».",
      "Перед выездом на другой tambon в wet season откройте TMD app/web и saved locations **Phuket** + **Andaman Sea**. Call **1182** — справочная TMD.",
    ],
    bullets: [
      "Wet season west coast: ливни + swell; dry season: меньше rain days, жара днём.",
      "July 2026 TMD monthly: Phuket rainfall **277.2 mm** (bulletin) — ориентир интенсивности муссона.",
      "Strong wind warning → проверить окна, балкон, сушилку на terrace.",
      "El Niño / seasonal outlook — смотреть актуальный TMD regional outlook, не один blog post.",
    ],
  },
  {
    heading: "Жильё: влажность, плесень, кондиционер и PEA",
    section_kind: "practice",
    paragraphs: [
      "Месяцы **1–3** на Пхукете часто проходят в «медовом тумане» dry season: кондиционер включают ночью, днём — вентилятор. К **4–6 месяцу** (часто **апрель–сентябрь** в календаре переезда) приходит **первая полная wet season** в вашем condo или villa — и всплывают запах шкафа, пятна на потолке bathroom и скачок счёта **PEA**.",
      "Типичный **condo 1–2 BR**: split **inverter** 12k–18k BTU на спальню + living; без обслуживания (clean filter каждые 2–4 недели в муссон) — mold на diffusor и «кашель AC». **Portable** хуже по шуму и влаге; в villa важнее **roof leak** и drainage вокруг дома — см. [аренду](/notes/" +
        ARENDA_SLUG +
        ") и [районы](/notes/" +
        RAJONY_SLUG +
        ").",
      "Плесень: различайте **condensation** (капли на стекле, AC 22 °C vs 32 °C снаружи) и **infiltration** (мокрая штукатурка после ливня). Первое — режим dry/dehumidifier, второе — landlord/juristic person. Сушите бельё **не** в closed room без exhaust; в муссон — сушилка или комната с AC dry mode.",
      "PEA: оплата по **meter**; tier растёт с потреблением. Заложите **฿2,500–6,000+**/мес на семью с 2 AC в wet season (**soft**). Попросите прошлый bill у landlord или соседа в том же здании до продления контракта на год.",
    ],
    bullets: [
      formatPracticeBullet({
        channels: ["nashi_phuket_chat", "russianinphuket"],
        period: "2025–2026",
        claim:
          "к 4–5 месяцу в Cherng Talay/Kata condo без dehumidifier появлялся запах wardrobe и mold в bathroom ceiling",
        forReader: "осмотр после ливня; AC service до мая; dehumidifier с апреля",
      }),
      "Inverter AC + режим dry снижают humidity быстрее, чем только 18 °C cool.",
      "Этаж 1–3 у pool/garden — больше mozzies и damp; верхние — жарче, но суше при ветре.",
      "Villa: проверьте gutter и slope от дома при viewing в rain.",
      "Страховка имущества — отдельно от [медицины](/notes/" + HEALTH_SLUG + ").",
    ],
  },
  {
    heading: "Наводнения, склоны и дороги после ливня",
    section_kind: "official",
    paragraphs: [
      "TMD связывает **heavy to very heavy rain** с риском **flash floods** и **landslides** «along waterways near foothills and lowlands». На Пхукете это не абстракция: **Kathu–Patong** serpentine, участки **Chaofa** к югу, низины у **Phuket Town** и старые лотки в industrial soi заливаются за 20–40 минут ливня.",
      "DDPM и ONWR в периоды штормовых предупреждений ставят провинции на alert — следите **TMD + local news**, не только expat-канал. Не проезжайте **глубокую воду** на машине и байке: глубина обманчива, люк сорван.",
      "На склонах (Kata/Karon hills, Kamala hillside, некоторые villa в **Chalong**) после недели дождей возможен **runoff** на дорогу. Жителям villa — убрать листья с drainage grates до муссона.",
      "Ferry и speedboat на **Phi Phi / Racha** в дни red warning — отмены или жёсткие качки; официальный ориентир — TMD shipping + operator, не «у нас уже купили билет».",
    ],
    bullets: [
      "Сохраните alternate route home без низины (Phuket Town vs west coast).",
      "Rain app TMD + Google traffic — soft combo mes 4–6.",
      "Не стоять под steep bare soil на пляжах после long rain.",
      "Emergency municipal line Phuket City **1132** — soft для локальных затоплений.",
    ],
  },
  {
    heading: "Недельный ритм: магазины, рынки и праздники 2026",
    section_kind: "practice",
    paragraphs: [
      "**7-Eleven / Lotus’s / Big C** — ежедневно, часто 24h у 7-Eleven. **Central / Robinson Phuket** — стандарт mall hours ~10:00–22:00. **Fresh market** (Phuket Town, Chalong, Rawai) — раннее утро; к вечеру выбор меньше. **Sunday** не «мертвый день», но часть small shops и offices закрыта; mall работает.",
      "Государственные выходные **2569 (2026)** по BOT: **1–2 Jan** (New Year + additional day), **3 Mar** Makha Bucha, **6 Apr** Chakri, **13–15 Apr** Songkran, **1 May**, **4 May** Coronation, **1 Jun** Visakha substitute, **3 Jun** Queen’s birthday, **28–29 Jul** King’s birthday + Asalha Bucha, **12 Aug** Queen Mother, **13 Oct**, **23 Oct**, **7 Dec**, **31 Dec** ([BOT holiday PDF](https://www.bot.or.th/content/dam/bot/fipcs/documents/FPG/2568/EngPDF/25680162.pdf)). Банки закрыты; **7-Eleven** и больницы — по графику.",
      "**Songkran (13–15 Apr)** — водяные «битвы», пробки, мокрые документы в байке; заранее закупите еду и не планируйте Immigration в пик. **Vegetarian festival** (окт., Phuket Town) — уличное питание меняется; это не «обязательный фестивальный тур», но traffic и запахи в Old Town заметны — учитывайте в mes 4–6 если попадаете.",
      "Mes **4–6**: вы уже знаете, где **Lotus** ближе, чем **Tops**, и в какой день привозят рыбу на local market. Смена привычки «как в Москве/Лиссабоне — воскресный hypermarket» на **суббота + 7-Eleven top-up** снижает стресс.",
    ],
    bullets: [
      "PromptPay / cash — рынок часто cash-only.",
      "Alcohol sales windows — local rules + Buddhist holidays (soft).",
      "Grab/LINE Man — дождь = surge; держите запас еды в wet season.",
      "Phuket Town **1132** — вопросы муниципалитета на тайском; переводчик в телефоне.",
    ],
  },
  {
    heading: "Пляжи, флаги и безопасность в море",
    section_kind: "official",
    paragraphs: [
      "На **западных пляжах** (Patong, Karon, Kata, Kamala, Surin, Bang Tao) в муссон **rip currents** и dump shore break усиливаются. **Красный флаг** = не заходить в воду в зоне флага. **Красно-жёлтый** часто означает зону с **lifeguard** — спросите, если сомневаетесь ([TAT marine guidance](https://www.tatnews.org/2018/07/important-information-on-marine-tourism-in-thailand-during-the-southwest-monsoon-season/)).",
      "TMD в периоды **2–3 m waves** рекомендует малым судам **остаться у берега** на Андaman. Это тот же контекст, что и «не плыть далеко от берега на надувном круге». Дайв- и snorkel-trip отменяют по weather — не спорьте с captain.",
      "Солнечные ожоги и **UV** — круглый год; облачность в муссон не отменяет SPF. Jellyfish встречаются (**soft** по пляжам); при сильной реакции — [клиника](/notes/" + HEALTH_SLUG + ").",
      "Dry season: плавание приятнее, но **нет спасателей на каждом пляже** вне main beaches — проверяйте таблички.",
    ],
    bullets: [
      "Смотрите флаги каждый визит — условия меняются за час.",
      "Дети — только patrolled zones; не «как в бассейне condo».",
      "Monsoon sunset photos ≠ safe swim.",
      "TMD shipping forecast перед boat day trip.",
    ],
  },
  {
    heading: "Мусор, вода, таракан и комары",
    section_kind: "official",
    paragraphs: [
      "Phuket City Municipality публикует правила **waste fees, transport to landfill и eco programs** ([eco portal](https://www.phuketcity.go.th/new/eco)). На всём острове схема зависит от **condo juristic** vs частный дом: мешки у ворот, central bin room, или контейнер у soi.",
      "Крупный мусор: municipal campaign **cleanhome.phuketcity.go.th** — периодические **free bulky pickup** (даты на сайте; в 2569 указан период до **30 Jun 2569**). Не выставляйте диван у дороги без booking — штраф и соседский конфликт.",
      "**DDC**: dengue — убрать **standing water** (блюдца под цветами, bucket на terrace), мусор не копить, repellent **утром и перед закатом**. Hotline **1422**. Тараканы и ants — частый быт при влажности; герметичные контейнеры для еды, не оставлять посуду на ночь.",
      "Mes 4–6: вы знаете **day of garbage truck** в вашем soi или платите condo fee за вывоз. Это мелочь, пока не накопите 10 мешков после move.",
    ],
    bullets: [
      "Separate recycle — зависит от condo; soft sorting.",
      "Burning trash — запрещено; дым с соседней villa = жалоба juristic.",
      "Septic smell villa — проверка до signing lease cross-wet season.",
      "Mosquito coil — проветривание; не спать в closed smoke.",
    ],
  },
  {
    heading: "Выходные без «гайда по фестивалям»",
    section_kind: "practice",
    paragraphs: [
      "К **4–6 месяцу** хочется сменить картинку «пляж у condo» без погони за Full Moon Party. **Логистика**, не афиша: **Old Phuket Town** (кафе, Sino-Portuguese, музеи, кондиционированные mall) — работает в дождь. **Phang Nga** / **Ao Phang Nga NP** — смотреть погоду и запреты DNP на закрытые острова в peak monsoon (**soft** seasonal closures Similan и др. май–окт. по TAT/DNP pattern).",
      "**Cape Panwa**, **Promthep Cape** — вид, не обязательно swim. **Big Buddha / Wat Chalong** — утро до жары или после дождя. **Khao Rang** viewpoint — короткий выезд из Town. Не нужно «все храмы за weekend» — один маршрут + backup indoor.",
      "Дождь: план **B** — cinema Central, co-working, spa, Thai cooking class с крышей. Это stabilizes mood в mes 4–6, когда «мы переехали, а солнца нет неделю».",
      "Связка с [районами](/notes/" + RAJONY_SLUG + "): если живёте **Rawai**, weekend в **Cherng Talay** = 60 min traffic; планируйте обратно до evening rain.",
    ],
    bullets: [
      "Ferry tickets — refundable options в wet season.",
      "National park fees — cash + Thai ID rules; foreign passport — gate sign.",
      "Не дублировать boat tour два wet weekends подряд — burnout.",
      "Assist — если нужен human routing семьи, не visa law.",
    ],
  },
  {
    heading: "Где TMD и быт expat расходятся",
    section_kind: "gap",
    paragraphs: [
      "Официально TMD: **isolated heavy rain** в юге. На практике: «час ливня» заливает ваш soi, и Grab отменяется — это совместимо, не «TMD ошибся».",
      "Официально: red flag. На практике: туристы заходят в воду — не повод вам повторять; lifeguard не везде.",
      "Официально: dry season. На практике: **humidity 80%+** в апр.–мае до первых стабильных ливней — mold стартует раньше «сентября».",
      "«На Пхукете всегда +32» — нормали TMD и станция дают диапазон; **ощущение** зависит от wind, rain и AC fatigue.",
    ],
    bullets: [
      "Официально: waves 2–3 m. На практике: ваш pier «спокойный» ≠ open beach.",
      "«Муссон — low season = всё закрыто» — malls и hospitals работают; закрыты boat tours и часть beach clubs.",
      "PEA tier на форуме ≠ ваш meter после pool pump villa.",
      "DDC dengue — risk круглый год в тропиках; пик часто wet months.",
    ],
  },
  {
    heading: "К 4–6 месяцу: рутина, настроение и сезонный календарь",
    section_kind: "practice",
    paragraphs: [
      "Четвёртый–шестой месяц — первый полный цикл **dry → wet** (или наоборот, если переехали осенью). Типичный emotional dip: «мы не на отдыхе, а в серой влажности с mold». Это не «неправильный переезд» — это **tropical routine** без европейского лета.",
      "Стабилизаторы: **утро** для errands и sport до ливня; **fixed weekday** (market, gym, kids club); **one indoor hobby**; weekly check TMD только утром, не doomscroll каждый shower. Социальность: один регулярный meetup (beach cleanup, running group, school parent) лучше десяти чатов.",
      "Календарь действий (**soft**): **март–апр.** — service AC, купить dehumidifier; **май** — проверить drainage, repellent stock; **июнь–авг.** — минimize fixed evening beach plans; **сент.–окт.** — review lease renewal / room with less damp; **нояб.–фев.** — outdoor weekends и swim training детей.",
      "Если mold или leak портят sleep и health — эскалация landlord + [медицина](/notes/" + HEALTH_SLUG + "); смена жилья на mes 5–6 дешевле, чем год антигистаминов и испорченная мебель.",
    ],
    bullets: [
      "Review mes 5: AC filters, wardrobe gap from wall, bathroom fan hours.",
      "Kids: screen time rules в long rain week — заранее договор.",
      "Remote work: backup power bank для router; UPS soft для desktop.",
      "Pillar + Wizard — visa runway, не погода.",
      "[Assist Таиланд](/ru/assist?country=thailand&utm_source=emigro&utm_medium=guide&utm_campaign=local-life-phuket&utm_content=" + KLIMAT_MUSSON_PHUKET_SLUG + ") — если быт ломает retention (жильё, школа).",
    ],
  },
  {
    heading: "Типичные ошибки быта mes 4–6",
    section_kind: "practice",
    paragraphs: [
      "Игнорировать **red flag** «разок». Жить с **mold spot** «пока не renewal». Сушить бельё в bedroom с AC off. Ехать **Patong hill** в peak rain на slick tires. Планировать **Immigration + Songkran** в один день. Покупать **only portable fan** в villa без cross-ventilation.",
    ],
    bullets: [
      "Не верить «low season = cheap paradise» без просмотра leak.",
      "Не оставлять terrace drains clogged — mozzies + flood.",
      "Не хранить passport без zip bag в wet bike ride.",
      "Не стыдиться dehumidifier — дешевле нового sofa.",
    ],
  },
];

const keyTakeaways = [
  "Официально: TMD — southwest monsoon wet season, flash flood/landslide risk у foothills; west coast waves 2–3 m+; shipping forecast перед морем.",
  formatPracticeTakeaway({
    channels: ["nashi_phuket_chat", "info_phuket"],
    period: "2025–2026",
    claim:
      "к 4–6 месяцу expat чаще сталкиваются с mold в condo, PEA bill от AC и отменой boat plans в peak rain",
    forReader: "AC service до мая, dehumidifier, TMD check перед выходными",
  }),
  "Официально: red flag = no swim; DDC — dengue prevention и 1422; Phuket City — waste/bulky programs и 1132.",
  "На практике: Songkran и bank holidays BOT 2026; weekend Old Town / Phang Nga с plan B indoor; mental routine по утреннему окну dry.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Когда на Пхукете муссон и стоит ли бояться «low season»?",
    a: "По правилам TMD юго-западный муссон доминирует **~май–окт.** с ливнями и rough seas на западе. На практике: жизнь не останавливается — меняются **море, пробки после ливня и mold**; к 4–6 месяцу вы уже знаете свой soi-flood pattern.",
  },
  {
    q: "Нужен ли dehumidifier, если есть кондиционер?",
    a: "По правилам — бытовой comfort, не law. На практике в **condo 1–2 BR** после серии ливней AC cool mode не всегда снимает **80% RH** в wardrobe; dehumidifier часто спасает mes 4–5.",
  },
  {
    q: "Можно ли купаться при жёлтом флаге?",
    a: "По правилам TAT: жёлтый = swim с **осторожностью**, красный = **нет**; lifeguard zone — red-yellow flag. На практике: в муссон смотрите **и** флаг, **и** волну; дети — только patrolled beach.",
  },
  {
    q: "Как вывозить крупный мусор на Пхукете?",
    a: "По правилам Phuket City — municipal **bulky waste** campaigns и eco notices ([phuketcity.go.th/eco](https://www.phuketcity.go.th/new/eco)). На практике: condo — через juristic; частный дом — booking **cleanhome** или local service, не оставлять у дороги.",
  },
  {
    q: "Что закрыто в Songkran 2026?",
    a: "По правилам BOT **13–15 Apr 2026** — bank holidays ([BOT PDF](https://www.bot.or.th/content/dam/bot/fipcs/documents/FPG/2568/EngPDF/25680162.pdf)). На практике: банки и many offices закрыты; 7-Eleven и hospitals частично; дороги мокрые и хаотичные — не mix с visa run.",
  },
  {
    q: "Как не выгореть к 4–6 месяцу в wet season?",
    a: "По правилам — следить за health (DDC dengue). На практике: **утренний** rhythm, indoor plan B, один social anchor, review жилья на damp; TMD check утром, не вечером перед сном.",
  },
];

export const KLIMAT_MUSSON_PHUKET_GUIDE: ThailandEditorialGuide = {
  slug: KLIMAT_MUSSON_PHUKET_SLUG,
  category: "Климат и быт",
  content_kind: "guide" as ContentKind,
  title: "Климат и быт Phuket: муссон, влажность и ритм 4–6 месяцев",
  excerpt:
    "TMD муссон и волны, mold и PEA, flash floods на склонах, флаги на пляжах, мусор Phuket City, праздники 2026 и weekend без фестивального гайда — что всплывает к полугоду на Пхукете.",
  seo_title: "Климат Пхукет 2026 — муссон, быт 4–6 месяцев",
  seo_description:
    "Климат Пхукет 2026: TMD муссон, плесень, PEA, red flag, dengue DDC. Быт expat к 4–6 месяцу на западном побережье — wet season, официально и на практике.",
  quick_answer:
    "Пхукет: wet season (~май–окт.) — юго-западный муссон TMD, ливни, волны 2–3 m на западе, риск flash flood у foothills. К 4–6 месяцу expat сталкиваются с mold в condo, счётом PEA за AC, red flags на пляже и отменой boat trips. Dry season (нояб.–апр.) суше, но жарко и влажно. DDC — dengue; Phuket City — waste. Songkran 13–15 Apr 2026 — bank holiday. Утренний ритм, dehumidifier, TMD перед морем.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "TMD — Thailand weather & warnings", url: "https://www.tmd.go.th/en/weather/weatherthailand" },
    { title: "TMD — Andaman shipping forecast", url: "https://www5.tmd.go.th/en/forecast/shipping" },
    { title: "TMD — climate normals API", url: "https://data.tmd.go.th/api/index1.php" },
    { title: "Phuket City — environment & waste", url: "https://www.phuketcity.go.th/new/eco" },
    { title: "DDC — Prevent mosquito bites (dengue)", url: "https://www.ddc.moph.go.th/uploads/files_en/filedata/Prevent%20mosquito%20bites.pdf" },
    { title: "BOT — public holidays 2569 (2026)", url: "https://www.bot.or.th/content/dam/bot/fipcs/documents/FPG/2568/EngPDF/25680162.pdf" },
  ],
  topic_tags: ["climate", "phuket", "thailand", "daily-life", "monsoon"],
  hashtags: buildNoteHashtags({
    topicTags: ["climate", "phuket", "thailand", "daily-life", "monsoon"],
    contentKind: "guide",
    extra: ["musson", "humidity", "mold", "tmd", "pea"],
  }),
  source_channel: "nashi_phuket_chat+russianinphuket+info_phuket",
  source_label: "editorial:thailand-local-life-phuket-gold-2026",
  pillar_guide_slug: PILLAR_THAILAND_SLUG,
};

export default KLIMAT_MUSSON_PHUKET_GUIDE;
