/**
 * Phuket districts — families, schools, hospitals, rent, monsoon; month 4–6 lens.
 * Gold CORE slot `districts`. Tambon vs beach marketing names.
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { formatPracticeTakeaway } from "@/lib/community-notes/practice-format";
import type { ThailandEditorialGuide } from "@/lib/community-notes/guides/thailand-editorial-index";
import type {
  CommunityNoteFaq,
  ContentKind,
  GlossaryTerm,
  NoteBodySection,
} from "@/lib/community-notes/types";

export const PHUKET_DISTRICTS_SLUG = "phuket-rajony-arenda-shkoly-bolnicy-2026";

const PILLAR_THAILAND_SLUG = "tailand-dlya-rossiyan-2026";

const DISCLAIMER =
  "**Emigro (сен. 2026):** обзор **аренды** и характера **районов Пхукета**, не каталог объявлений и **не гайд по покупке** condo/villa. Цены — soft (Facebook/агрегаторы 2025–2026), не тариф провинции. Визы DTV/LTR и foreign quota — в [pillar Таиланд](/ru/guides/" +
  PILLAR_THAILAND_SLUG +
  "). [Assist по Таиланду](/ru/assist?country=thailand#assist-form). Не юридическая консультация.";

const GLOSSARY_INTRO =
  "Слова с объявления, Google Maps и чата риелтора — чтобы **tambon**, название пляжа и бренд **Laguna** не смешались, пока вы ещё выбираете адрес, а не открытку.";

const LOCAL_GLOSSARY: GlossaryTerm[] = [
  { pt: "amphoe / district", context: "อำเภอ", ru: "административный район острова; на Пхукете три: Thalang (север), Kathu (центр), Mueang Phuket (юг и восток)" },
  { pt: "tambon", context: "ตำบล", ru: "подрайон; именно он часто в адресе condo и в booking.com — не «название пляжа»" },
  { pt: "Phuket City Municipality", context: "เทศบาลนครภูเก็ต", ru: "городская администрация только двух tambon: Talat Yai и Talat Nuea (~12 км²) — это «Phuket Town», не весь остров" },
  { pt: "Cherng Talay", ru: "tambon к северу от Patong; маркетинг «Bang Tao / Laguna» живёт здесь, не отдельный amphoe" },
  { pt: "Laguna Phuket", ru: "управляемый resort-комplex (Banyan Tree, Angsana и др.) в Cherng Talay; аренда и ПЖК часто с resort fee" },
  { pt: "condominium", context: "คอนโด", ru: "квартира в здании с foreign quota; villa на земле — другая правовая история (см. pillar)" },
  { pt: "songthaew", context: "รถสองแถว", ru: "местный shared pickup; на западном побережье часто «без расписания», не замена личной машины с детьми" },
  { pt: "monsoon season", ru: "сезон юго-западного муссона (~май–окт.): сильный прибой на западе, ливни, местные затопления в низинах — официально купание на ряде пляжей не рекомендуют" },
];

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(LOCAL_GLOSSARY, GLOSSARY_INTRO),
    paragraphs: [GLOSSARY_INTRO, DISCLAIMER],
  },
  {
    heading: "Nota Emigro (fact-check)",
    section_kind: "official",
    paragraphs: [
      "Короткий разбор формулировок — без вырезания практики. **OK** = порталы провинции/города/транспорта; **Soft** = аренда и commute из чатов и агрегаторов; **Fixed** = смягчено под официальную рамку.",
    ],
    bullets: [
      "OK: провинция Пхукет делится на **3 amphoe** и **17 tambon**; карта и описания пляжей — [phuket.go.th (eng.)](https://www.phuket.go.th/eng/).",
      "OK: **Phuket City Municipality** отвечает только за **Talat Yai + Talat Nuea** (исторический Phuket Town), не за Karon или Bang Tao — [phuketcity.go.th](https://www.phuketcity.go.th/new/content/general).",
      "OK: сезон для спокойного моря и дайвинга на сайте провинции — **с mid-October по May**; в monsoon на ряде пляжей купание **не рекомендуют** из‑за течений ([Mai Khao](https://www.phuket.go.th/eng/Beaches-Mai%20Khao%20Beach.php), [diving](https://www.phuket.go.th/eng/diving.php)).",
      "OK: общественный транспорт агрегирует **Phuket OneMap / SmartBus** — маршруты PPAO и аэропортные линии, тарифы на платформе ([onemap.phuket.cloud](https://onemap.phuket.cloud/); обзор TAT [2025](https://www.tatnews.org/2025/07/phuket-onemap-a-convenient-guide-to-getting-around-by-public-bus/)).",
      "Soft: 1BR condo **฿15 000–35 000/мес** по зонам — сигнал рынка 2025–2026, не реестр аренды.",
      "Soft: Bangkok Hospital Phuket — крупный частный стационар в **Talat Nuea**; Thalang International Clinic в Cherng Talay — полевая GP-точка для семей (не государственная «поликлиника по адресу»).",
      "Fixed: **«Laguna = отдельный город»** — нет; это бренд estate в tambon Cherng Talay (Thalang).",
      "Fixed: покупка condo **не** автоматически даёт визу семье — Immigration отдельно ([pillar](/ru/guides/" + PILLAR_THAILAND_SLUG + ")).",
    ],
  },
  {
    heading: "Официально: три amphoe, tambon и «название пляжа»",
    section_kind: "official",
    paragraphs: [
      "На карте expat часто живут **пляжами** (Kata, Kamala, Bang Tao), а в **contrato** и 90-day report — **tambon** и дорога (Thepkasattri, Viset, Chaofa). Остров administrativo делится на **Thalang** (север и аэропорт), **Kathu** (Patong и центральные холмы) и **Mueang Phuket** (южное побережье, восточные заливы и Phuket Town). **Phuket City Municipality** — лишь два tambon старого города; когда агент пишет «Phuket Town schools/hospital», имеется в виду эта городская зона и соседние **Ratsada, Koh Kaew, Chalong**, а не «любая точка острова».",
      "Маркетинговые имена: **Laguna**, **Boat Avenue**, **Boat Lagoon** — инфраструктурные кластеры внутри tambon, не отдельные районы в паспорте адреса. **Kamala** и **Surin** — пляжи в tambon **Kamala** (amphoe **Kathu**); **Bang Tao** — пляж в tambon **Cherng Talay** (amphoe **Thalang**). В объявлении «Laguna Phuket» адрес всё равно сводится к Cherng Talay или названию condo.",
      "Для семьи сначала фиксируют **школу → маршрут утром → больница/поликлиника**, потом фильтр condo. Государственная школа по адресу — отдельный трек (тайский язык); этот гайд про **international/bilingual** и expat-быт.",
      "Главное: tambon в адресе определяет commute и «где вы реально живёте»; название пляжа в Instagram — нет.",
    ],
    bullets: [
      "Thalang: Cherng Talay (Bang Tao/Laguna), Pa Khlok, Sri Sunthon, Mai Khao…",
      "Kathu: Kathu town, Kamala tambon (Kamala/Surin beaches), Patong.",
      "Mueang Phuket: Karon, Kata, Rawai, Chalong, Wichit, Koh Kaew, Talat Yai/Nuea.",
      "Порталы: [Phuket Province](https://www.phuket.go.th/eng/), [Phuket City](https://www.phuketcity.go.th/new/content/general), [Phuket OneMap](https://onemap.phuket.cloud/).",
    ],
  },
  {
    heading: "Как читать карту Пхукета для аренды",
    section_kind: "official",
    paragraphs: [
      "Пхукет — не «один Patong»: **запад** — пляжи и resort-аренда; **восток** — заливы, марinas, меньше купания; **центр города** — сервисы, больницы, рынки без туристической наценки на каждый завтрак. Без машины или постоянного Grab реalisticны **Phuket Town + часть Kata/Karon** у супермаркетов; семья с BISP/HeadStart чаще принимает **авто или minivan** из Rawai или Bang Tao.",
      "Ниже — **пять пар зон**, как их сравнивают релоканты 2025–2026: не рейтинг «лучший пляж», а **школы, больницы, аренда, сезон дождей и commute**. Перед deposit проверьте foreigner rental rules в house rules condo.",
    ],
    bullets: [
      "Семья + British/American curriculum → чаще **Cherng Talay / Bang Tao** или **Rawai** (школы на юге).",
      "Remote без детей → **Kata/Karon**, **Kamala** или **Phuket Town** (цена/тишина trade-off).",
      "Медицина tier-1 на острове → **Bangkok Hospital Phuket** (Phuket Town); запад — клиники и эвакуация в Bangkok при сложных кейсах.",
      "Monsoon: западные склоны — ливни и волна; низины у Chaofa/Chalong после ливня — soft risk затопления подъезда (не «весь остров под водой»).",
    ],
  },
  {
    heading: "Сводка: пять зон одним взглядом",
    section_kind: "practice",
    paragraphs: [
      "Таблица — не «рейтинг», а **чеклист trade-off** перед просмотром. Цифры аренды **soft** (2025–2026); commute — минуты на машине в dry season без аварии на 402; в monsoon и peak season добавляйте буфер. Школы названы как ориентиры рынка — campus и waiting list проверяйте у admissions.",
    ],
    table: {
      columns: ["Зона (маркетинг)", "Tambon / amphoe", "Семья / школы", "Hospital run", "1BR soft", "Monsoon bite"],
      rows: [
        [
          "Bang Tao / Laguna",
          "Cherng Talay, Thalang",
          "HeadStart, UWC, BISP рядом",
          "Bangkok Hosp. ~25–40 мин",
          "฿18k–35k",
          "Swell, traffic на подъезде",
        ],
        [
          "Rawai / Nai Harn",
          "Rawai, Mueang",
          "Южные campus; север — длинный run",
          "~20–35 мин",
          "฿20k–40k (condo)",
          "Villa leak, hill road",
        ],
        [
          "Kata / Karon",
          "Karon/Kata, Mueang",
          "QSI Kathu ~15–25 мин",
          "~25–45 мин",
          "฿20k–32k",
          "Tourism noise, damp",
        ],
        [
          "Kamala / Surin",
          "Kamala, Kathu",
          "Schools далеко — auto daily",
          "~30–50 мин",
          "฿18k–60k+",
          "Landslide pocket, 402 jam",
        ],
        [
          "Phuket Town / Koh Kaew / Chalong",
          "Talat Yai/Nuea, Koh Kaew, Chalong",
          "QSI, bilingual corridor",
          "Bangkok Hosp. ~5–20 мин",
          "฿15k–22k",
          "Humidity, local flood spots",
        ],
      ],
    },
    bullets: [
      "Foreign quota и house rules condo — до deposit, не после.",
      "OneMap — для **bus** experiment, не для daily school unless teen solo.",
    ],
  },
  {
    heading: "1. Bang Tao и Laguna (Cherng Talay, Thalang)",
    section_kind: "practice",
    paragraphs: [
      "**Характер.** Длинный **Bang Tao** beach, upscale **Laguna** estates, **Boat Avenue** как expat-«главная улица» с кафе, банками и рынком. Хорошо — концентрация **international schools** (HeadStart, UWC Thailand в зоне, BISP в соседнем Cherng Talay), villa и condo stock с бассейном, спокойнее Patong. Плохо — **расстояние до Bangkok Hospital** (часто 25–40 мин в dry season traffic), зависимость от машины, в high season пробки на подъезде к Boat Avenue.",
      "**Кому.** Семьи с детьми на **British/IB** track, пара с авто, remote workers с бюджетом на 2BR condo или villa. Solo budget — редко первый выбор.",
      "**Школы (soft).** **British International School Phuket (BISP)** — Cherng Talay; **HeadStart International** — fringe Bang Tao; **UWC Thailand** — Thalang. Все в северной дуге; утренний commute из южного Rawai сюда утомляет за semester. Fees **฿280k–900k+/год** по tier (soft, 2025/26) — budget отдельно от аренды.",
      "**Медицина.** Thalang International Clinic и стоматологии в Cherng Talay для routine; стационар и pediatrics — планируйте поездку в **Phuket Town**.",
      "**Аренда (soft, 2025–2026).** 1BR condo **฿18 000–35 000**; 2BR **฿35 000–55 000+**; villa **฿80 000+**. Laguna и branded residences — premium + management fee.",
      "Главное: Bang Tao/Laguna — «семейный север» с школами и beach club vibe; платите commute и авто.",
    ],
    bullets: [
      "+ школы, expat-инфра, пляж; − traffic, Bangkok Hospital далеко, monsoon swell на открытом участке пляжа.",
      "Tambon **Cherng Talay**, не «район Laguna» в документах.",
      "Soft: 1BR **฿18k–35k**; проверьте foreign quota в condo (pillar).",
    ],
  },
  {
    heading: "2. Rawai и Nai Harn (Mueang Phuket, юг)",
    section_kind: "practice",
    paragraphs: [
      "**Характер.** **Rawai** — рыбацкая бухта, pier на острова, много expat-villa на холмах; **Nai Harn** — один из любимых пляжей для плавания в dry season. Хорошо — ощущение «живу на острове, не в отеле», близость к **Promthep Cape**, много villa 3–4BR для семьи. Плохо — **нет «центра»** как Boat Avenue; шум стройки на холмах; в monsoon южные пляжи тоже получают волну, хотя Nai Harn часто мягче открытых west-facing участков.",
      "**Кому.** Семьи, уже решившие школу на **юге** (например British Curriculum Phuket, Lighthouse, некоторые bilingual) или готовые ездить на север к BISP. Remote workers с **двумя машинами** или терпимостью к Grab.",
      "**Школы.** Смешанный карман: часть семей ездит на **HeadStart/BISP** (30–50 мин в peak), часть выбирает **локальные international** ближе к Chalong/Wichit — сверяйте campus, не рекламный slug.",
      "**Медицина.** До **Bangkok Hospital** ~20–35 мин; для emergency закладывают знание маршрута ночью.",
      "**Аренда (soft).** Villa 3BR **฿50 000–120 000**; condo у Rawai/Nai Harn **฿20 000–40 000** (1–2BR). Много **short-term** stock — проверяйте, что owner согласен **12-mo contract** и TM30.",
      "Главное: Rawai/Nai Harn — villa-life и пляж Nai Harn; schools и hospital — планируйте маршрут, не надеяться на songthaew с car seat.",
    ],
    bullets: [
      "+ villa, Nai Harn, expat community; − commute к северным школам, стройка, нужна машина.",
      "Rawai beach — не для купания; пляж — **Nai Harn**, **Ya Nui**.",
      "Soft: 3BR villa **฿50k+**; договор и deposit 2 months — норма рынка.",
    ],
  },
  {
    heading: "3. Kata и Karon (Mueang Phuket, запад)",
    section_kind: "practice",
    paragraphs: [
      "**Характер.** Классическая **tourist west coast** полоса: Karon длиннее, Kata компактнее и дороже view. Хорошо — пешая жизнь у пляжа, много condo с pool, кафе, dive shops, **QSI International** в **Kathu** как компромисс «центр острова». Плохо — **seasonality**: high season шум и traffic; monsoon — ливни с гор, иногда мутная вода; туристические цены на продукты у beach road.",
      "**Кому.** Пары, remote без школьного age, «хочу море из окна». Семье с маленькими детьми — ok, если school и hospital приняты заранее.",
      "**Commute.** До **Central Phuket**, аэропорта и Bangkok Hospital — **25–45 мин**; до Cherng Talay schools — далеко.",
      "**Аренда (soft).** 1BR **฿20 000–32 000**; 2BR с view **฿35 000–50 000**. Старые condo без lift — редкость, но проверьте **damp** на floor 1–2 к monsoon month 4.",
      "Главное: Kata/Karon — пляж и condo; для школ на севере или BISP будет ежедневный автобус minivan stress.",
    ],
    bullets: [
      "+ пляж, инфра expat; − tourism noise, monsoon, schools не walking distance.",
      "Kata Noi — отдельный pocket; адрес может быть tambon **Karon**.",
      "Soft: 1BR **฿20k–32k**; viewing после rain — проверка протечек.",
    ],
  },
  {
    heading: "4. Kamala и Surin (Kamala tambon, Kathu)",
    section_kind: "practice",
    paragraphs: [
      "**Характер.** **Kamala** — семейнее Patong, **Surin** («Millionaire's Row») — дороже и тише. Холм между Kamala и Patong даёт **landslide risk** в strong rain (soft: смотрите retaining wall на villa viewing). Хорошо — западный sunset, рестораны, близость к **Patong** services без жизни в Patong. Плохо — узкая **402** road в peak; monsoon swell на открытых участках.",
      "**Кому.** Пары 35+, семьи с teen, кто хочет west coast без полного Patong. Младшие дети + daily school run на север — тяжело.",
      "**Аренда (soft).** Kamala 1BR **฿18 000–28 000**; Surin/hills **฿30 000–60 000+**. Villa на склоне — проверьте **drainage** и generator.",
      "Главное: Kamala/Surin — «тихий запад» между Patong и Bang Tao; schools и hospital — как у Kata, через машину.",
    ],
    bullets: [
      "+ sunset, upscale Kamala village; − дорога, monsoon, schools далеко.",
      "Surin beach ⊂ tambon Kamala — marketing «Surin» ≠ отдельный tambon.",
      "Soft: hillside villa — drainage и access road в ливень.",
    ],
  },
  {
    heading: "5. Phuket Town, Koh Kaew и Chalong (восток и город)",
    section_kind: "practice",
    paragraphs: [
      "**Характер.** **Talat Yai/Nuea** — Sino-Portuguese old town, рынки, кофе; **Koh Kaew** — marinas (Boat Lagoon, Royal Phuket Marina); **Chalong** — Wat Chalong, pier, круг Chaofa. Хорошо — **Bangkok Hospital Phuket** рядом, condo **฿15 000–22 000** за 1BR (soft), меньше beach premium, **Central Phuket** и Big C. Плохо — **нет пляжа для daily swim**; humidity выше; expat «вайб» слабее west coast.",
      "**Кому.** Семьи, prioritizing **hospital + budget**; staff hospital; remote workers с поездками на пляж по выходным; кто на **QSI** или школах в Kathu/Chalong corridor.",
      "**Школы.** QSI **Kathu**; несколько bilingual в городской дуге — campus by name, не «Phuket Town» generically.",
      "**Commute.** **Phuket OneMap** показывает **PPAO EV buses** (ориентир **15–40 baht** по TAT-обзору) и аэропортные линии; маршруты через **Central Phuket**, **Chalong Pier**, остановки у **Bangkok Hospital** на отдельных линиях — сверяйте актуальную схему на [onemap.phuket.cloud](https://onemap.phuket.cloud/). До Kata beach на машине — **20–30 мин** off-peak; в evening peak Chaofa и выезд из town — дольше.",
      "**Koh Kaew** удобен, если работа/лодка в **Boat Lagoon** или **Royal Phuket Marina**; **Chalong** — pier tours и Wat Chalong, но Chaofa Circle в rush hour — bottleneck для всего юга.",
      "Главное: Phuket Town/Koh Kaew/Chalong — urban hub острова; пляж — destination, не район out the door.",
    ],
    bullets: [
      "+ Bangkok Hospital, аренда ниже west premium; − нет beach daily, humidity.",
      "Municipality **≠** весь Mueang Phuket amphoe.",
      "Soft: 1BR **฿15k–22k** near hospital; проверьте flood history у Chaofa low points.",
    ],
  },
  {
    heading: "Сезон: дождь, волна и локальные затопления",
    section_kind: "official",
    paragraphs: [
      "Официальный туристический контур провинции: **лучшее море и дайвинг — mid-October to May**; в **monsoon** на ряде пляжей купание **не рекомендуют** из‑за течений. План развития провинции прямо называет **heavy rain, flooding, landslides** среди рисков — это не страшилка форума, а признанная инфраструктурная нагрузка.",
      "На практике к **4–6 месяцу** expat в west coast condo замечает: **плесень** в шкафах, **жужжание** кондиционеров 24/7, **скользкие** холмы к villa, **отмены** boat trips. Низины у **Chalong Circle**, старые участки **Phuket Town** и подъезды к **Kamala hills** — первые кандидаты на «вода стояла 20 минут после ливня». Это не значит «не ехать», значит **смотреть elevation** и ливневку на viewing в **сентябре–октябре**, если переезжаете перед monsoon.",
      "Главное: dry season продаёт район; monsoon показывает drainage и commute — планируйте оба.",
    ],
    bullets: [
      "OK: monsoon swim caution — phuket.go.th beach pages.",
      "Soft: mold — dehumidifier + cleaning contract; не ground floor без проверки.",
      "Fixed: «на востоке не идёт дождь» — идёт, но другой pattern волн и быта.",
    ],
  },
  {
    heading: "К 4–6 месяцу: что всплывает после viewing",
    section_kind: "practice",
    paragraphs: [
      "К четвёртому месяцу контракт и «море из окна» уже routine — и район показывает зубы. **Traffic:** Cherng Talay и Chaofa в high season добавляют **+15–30 мин** к school run; Rawai→BISP перестаёт быть «немного далеко». **Шум:** стройка villa на соседнем slope в Rawai/Kamala; karaoke Patong доносится в некоторые Kamala pockets.",
      "**Быт:** **electricity** bill с кондиционерами; **pool maintenance** в villa; **pest** (муравьи после rain). **Соседи short-term:** condo с Airbnb rotation — лифт и parking в weekend. **Документы:** renewal **90-day report**, TM30 от landlord — если собственник «забыл», проблема не район, но stress привязан к адресу.",
      "Если fit нет — смена tambon = новый **deposit 2 months** + moving в monsoon. Лучше решить на 4–6 месяце, чем терпеть год. Маршрут виз и банк — [pillar](/ru/guides/" + PILLAR_THAILAND_SLUG + ") и [Assist](/ru/assist?country=thailand#assist-form).",
      "Главное: viewing в dry season — snapshot; month 4–6 — rain, traffic и school run.",
    ],
    bullets: [
      "Traffic peak: Cherng Talay, Patong hill, Chaofa.",
      "Mold/pests: west condo floor 1–3; villa — roof leak первый monsoon.",
      "Short-term соседи: проверьте house rules condo до signing.",
      "Смена района = новый deposit; не «переедем потом дёшево» без расчёта.",
    ],
  },
  {
    heading: "Где объявления и чаты расходятся с tambon и сезоном",
    section_kind: "gap",
    paragraphs: [
      "В Facebook «Laguna = свой город с визой», на contrato — **Cherng Talay** и resort fee. «5 мин до BISP» на карте — **40 мин** в rain season на Srisoonthorn. «Phuket Town скучно» — пока не нужен **Bangkok Hospital** в 10 минут ночью с ребёнком.",
      "Главное: marketing beach name ≠ адрес TM30; dry-season viewing ≠ monsoon drainage — это не «негатив», а фильтр до deposit.",
    ],
    bullets: [
      "«Walking distance to international school» → campus name и **07:30 test drive**, не Google radius.",
      "«Bang Tao cheap 1BR ฿12k» → soft outlier; median Cherng Talay выше; foreign quota отдельно.",
      "«East coast без дождя» → fixed: ливни есть; другой pattern волн, не «zero rain».",
      "«Kamala family quiet» → peak season traffic на 402 и karaoke pockets из Patong hills.",
      "«Buy condo = live near hospital» → Bangkok Hospital в **Talat Nuea**, не «любой condo Phuket».",
      "Idealista-style фото pool → не показывает mold floor 2 и flood spot у Chaofa после ливня.",
    ],
  },
  {
    heading: "Типичные ошибки при выборе района",
    section_kind: "practice",
    paragraphs: [
      "Брать **Laguna** по фото pool, не посчитав **school bus** и hospital run. Снимать **Rawai villa** «рядом с морем», забыв что пляж — Nai Harn, а pier — smell и traffic. Путать **Surin** marketing с «walking to BISP». Выбирать **Kata** для семьи на HeadStart без test drive в **07:30 rain**. Думать, что **Phuket Town** = скучно — и не закладывать **weekend beach** trips.",
      "Главное: один school-day run и один вечер после ливня стоят десяти постов в чате.",
    ],
    bullets: [
      "Не путать пляж и tambon в contrato.",
      "Не skip viewing в monsoon month если контракт cross-season.",
      "Не assume public bus = school commute с car seat.",
      "Не смешивать покупку condo и визу — Immigration отдельно.",
    ],
  },
];

const keyTakeaways = [
  "Официально: 3 amphoe, 17 tambon; Phuket City Municipality — только Talat Yai/Nuea; пляжи и Laguna — marketing внутри tambon.",
  formatPracticeTakeaway({
    channels: ["nashi_phuket_chat", "pkhuket2"],
    period: "2025–2026",
    claim:
      "семьи с international schools чаще сравнивают Cherng Talay (Bang Tao/Laguna) и Rawai/Nai Harn; urban hub с Bangkok Hospital — Phuket Town/Koh Kaew/Chalong",
    forReader: "сначала школа и hospital run, потом фильтр condo",
  }),
  formatPracticeTakeaway({
    channels: ["russianinphuket"],
    period: "2026",
    claim:
      "к 4–6 месяцу на западе чаще всплывают monsoon mold, peak traffic на Chaofa/Cherng Talay и усталость от school run на север из Rawai",
    forReader: "тест-drive утром в rain season и viewing после ливня",
  }),
  "Расхождение: «пляж на карте» vs tambon в TM30; «рядом BISP» vs 40 мин в peak — soft commute, hard calendar.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "С какого района начать просмотр семье с international school?",
    a: "По правилам школы не привязаны к tambon — зачисление по местам и документам. На практике с HeadStart/UWC/BISP начинают **Cherng Talay/Bang Tao**; с южными campus — **Rawai/Chalong**; budget + hospital — **Phuket Town**. Сверьте campus name, не «Phuket» в рекламе.",
  },
  {
    q: "Где ближе Bangkok Hospital Phuket?",
    a: "По правилам стационар один — **Talat Nuea / Phuket Town** area. На практике из Bang Tao едут 25–40 мин; из Rawai ~20–35 мин; routine GP есть в Cherng Talay, но pediatrics/inpatient планируют в город.",
  },
  {
    q: "Можно без машины на Пхукете?",
    a: "По правилам есть Phuket OneMap bus и songthaew. На практике с детьми и school run **машина или fixed driver** — norm; Phuket Town–Central ok на bus; Rawai–Cherng Talay daily — нет.",
  },
  {
    q: "Laguna — это отдельный район для адреса?",
    a: "По правилам адрес — tambon **Cherng Talay**, amphoe Thalang. На практике «Laguna» = managed estate бренд; contrato может указывать condo name + Cherng Talay; resort fee отдельно.",
  },
  {
    q: "Когда лучше смотреть жильё с учётом monsoon?",
    a: "По правилам monsoon ~май–окт. с сильным прибоем на западе (phuket.go.th). На практике viewing **в конце wet season** показывает drainage и leak; если подписываетесь в dry — заложите dehumidifier и страховку имущества.",
  },
  {
    q: "Чем Kamala отличается от Surin?",
    a: "По правилам оба на tambon **Kamala** (Kathu). На практике Surin — дороже hillside и beach club segment; Kamala village — семейнее и чуть доступнее по аренде (soft).",
  },
];

export const PHUKET_DISTRICTS_GUIDE: ThailandEditorialGuide = {
  slug: PHUKET_DISTRICTS_SLUG,
  category: "Районы и быт",
  content_kind: "guide" as ContentKind,
  title: "Районы Пхукета 2026: аренда, школы, больницы и сезон дождей",
  excerpt:
    "Bang Tao/Laguna, Rawai/Nai Harn, Kata/Karon, Kamala/Surin и Phuket Town/Koh Kaew/Chalong — tambon vs пляж, школы, Bangkok Hospital, monsoon и что бесит к 4–6 месяцу.",
  seo_title: "Районы Пхукета 2026 — аренда, школы, больницы",
  seo_description:
    "Районы Пхукета 2026: Bang Tao, Rawai, Kata, Kamala, Phuket Town — аренда condo, international schools, Bangkok Hospital, monsoon и commute. Tambon vs пляж для семьи.",
  quick_answer:
    "Пхукет — 3 amphoe и 17 tambon: «Bang Tao/Laguna» = Cherng Talay, «Phuket Town» = Talat Yai/Nuea, не весь остров. Семьям с BISP/HeadStart чаще север (Cherng Talay); hospital hub — Bangkok Hospital в городе; Rawai/Nai Harn — villa-life с school run. Аренда 1BR soft ฿15k–35k по зоне; monsoon (≈май–окт.) — ливни, swell на западе, mold к 4–6 месяцу. Сначала школа и маршрут, потом condo.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "Phuket Province — beaches & season", url: "https://www.phuket.go.th/eng/" },
    { title: "Phuket City Municipality — area & tambons", url: "https://www.phuketcity.go.th/new/content/general" },
    { title: "Phuket OneMap — public bus routes", url: "https://onemap.phuket.cloud/" },
    { title: "Bangkok Hospital Phuket", url: "https://www.bangkokhospitalphuket.com/" },
  ],
  topic_tags: ["districts", "phuket", "thailand", "rent", "schools"],
  hashtags: buildNoteHashtags({
    topicTags: ["districts", "phuket", "thailand", "rent", "schools"],
    contentKind: "guide",
    extra: ["bang-tao", "rawai", "kata", "phuket-town", "monsoon"],
  }),
  source_channel: "nashi_phuket_chat+pkhuket2+russianinphuket",
  source_label: "editorial:phuket-districts-gold-2026",
  pillar_guide_slug: PILLAR_THAILAND_SLUG,
};
