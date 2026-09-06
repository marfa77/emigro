/**
 * Valencia districts overview — where relocants rent, commute, and what bites by month 4–6.
 * Literary Remarque-adjacent voice. Rental lens only — not property-buy guide.
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { formatPracticeTakeaway } from "@/lib/community-notes/practice-format";
import { ARENDA_VALENCIA_SLUG } from "@/lib/community-notes/guides/spain-arenda-valencia-idealista";
import { NIE_EMPADRONAMIENTO_SLUG } from "@/lib/community-notes/guides/spain-nie-empadronamiento-poryadok";
import { PERVYE_30_SLUG } from "@/lib/community-notes/guides/spain-pervye-30-dnej-checklist";
import type {
  CommunityNoteFaq,
  ContentKind,
  GlossaryTerm,
  NoteBodySection,
} from "@/lib/community-notes/types";

export const VALENCIA_RAJONY_SLUG = "valencia-rajony-arenda-shkoly-metro-2026";

const GLOSSARY_INTRO =
  "Слова с Idealista, таблички у подъезда и карты Metrovalencia — чтобы distrito, barrio и línea 3 не смешались, пока вы ещё выбираете morada, а не открытку.";

const DISCLAIMER =
  "**Emigro (сент. 2026):** обзор **аренды** и характера районов Valencia, не каталог объявлений и **не гайд по покупке жилья**. Цены — ориентиры рынка (Idealista, авг.–сент. 2026), не официальная статистика Ayuntamiento. Статистику преступности и «рейтинги безопасности» мы не приводим — на просмотре смотрите улицу, освещение и соседей, а не мем из чата. Связанные материалы: [аренда Idealista](/notes/" +
  ARENDA_VALENCIA_SLUG +
  "), [NIE и empadronamiento](/notes/" +
  NIE_EMPADRONAMIENTO_SLUG +
  "), [первые 30 дней](/notes/" +
  PERVYE_30_SLUG +
  "). Не юридическая консультация.";

const LOCAL_GLOSSARY: GlossaryTerm[] = [
  { pt: "distrito", ru: "административный район города; 19 distritos в municipio Valencia — не путать с barrio на Idealista" },
  { pt: "barrio", ru: "жилой квартал внутри distrito; Ruzafa — barrio в L'Eixample, не отдельный distrito" },
  { pt: "Ruzafa", context: "Russafa", ru: "модный barrio к югу от Ciutat Vella; в объявлениях часто «Russafa»" },
  { pt: "Metrovalencia", ru: "метро и tram города; líneas 1–10 + tranvía — карта на metrovalencia.es" },
  { pt: "EMT", context: "Empresa Municipal de Transportes", ru: "городской автобус Valencia; emtvalencia.es — маршруты и Bonobús" },
  { pt: "fianza", ru: "обязательная fianza по LAU: 1 mensualidad для vivienda; дополнительные гарантии считаются отдельно" },
  { pt: "empadronamiento", context: "padrón", ru: "прописка по адресу в ayuntamiento; certificado нужен для TIE и школы" },
  { pt: "humidity", context: "humedad", ru: "влажность у моря и в старых pisos; плесень часто проявляется к 4–6 месяцу, не на viewing" },
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
      "Короткий разбор цифр и формулировок — без вырезания практики. **Soft** = ориентир рынка Idealista / полевые сигналы @valenciarusia и @valenforum; **OK** = сверено с порталами Ayuntamiento / операторов транспорта; **fixed** = смягчено под официальную рамку.",
    ],
    bullets: [
      "Soft: €/m² и вилки T1/T2 по distritos — данные Idealista (jul.–ago. 2026): media ciudad ~16,3–16,4 €/m²; Ciutat Vella ~19,3 €/m²; Patraix ~13,7 €/m²; Benimaclet ~14,7 €/m². Это **рыночный сигнал**, не тариф Ayuntamiento.",
      "UNCHECKED: статус zona de mercado residencial tensionado нельзя доказывать «отсутствием найденного decreto». Перед подписью сверяйте актуальный список Ministerio/BOE; этот гайд не использует предполагаемое отсутствие зоны для расчёта допустимой renta.",
      "Fixed: не называем районы «безопасными/опасными» по рейтингу — таких официальных таблиц для barrio в гайде нет; только бытовые наблюдения (шум, туристы, состояние дома).",
      "OK: empadronamiento — процедура Ayuntamiento de Valencia; certificado de empadronamiento запрашивается онлайн или в **junta de distrito** / Oficina de Atención al Ciudadano ([valencia.es](https://www.valencia.es/)).",
      "Soft: «T2 в Ruzafa €1 100–1 400» — вилка из чатов и объявлений 2025–2026; конкретное объявление может быть выше/ниже.",
      "Soft: commute «8 мин до Colon» на Metro — ориентир в часы без пересадок; пик +5–12 мин и переполненные вагоны.",
      "Fixed: гайд **не** про compraventa / hipoteca — только alquiler de larga duración и быт арендатора.",
      "OK: Metrovalencia и EMT — официальные операторы; расписание и tarifas на metrovalencia.es и emtvalencia.es.",
    ],
  },
  {
    heading: "Официально: distritos Valencia и empadronamiento",
    section_kind: "official",
    paragraphs: [
      "Valencia на бумаге — один municipio с мэром в Ayuntamiento, но жить вы будете не «в Валенсии вообще», а в конкретном **distrito** и ещё более узком **barrio**. На Idealista фильтр «Ciutat Vella» и разговорное «Ruzafa» не совпадают один к одному: Ruzafa — barrio внутри L'Eixample, El Cabanyal — часть Poblats Marítims у моря, Benimaclet когда-то был отдельной деревней и до сих пор ощущается иначе, чем сетка Gran Vía.",
      "Для быта первых месяцев важнее не название на открытке, а **junta de distrito**, куда привязан ваш адрес. Empadronamiento (padrón) оформляется в Ayuntamiento de Valencia по месту жительства: нужны pasaporte/NIE, contrato de alquiler или autorización propietario и иногда последняя factura utilities. Certificado de empadronamiento — бесплатный документ для TIE, школы и банка; historial de empadronamiento запрашивают, когда extranjería смотрит непрерывность. Порядок с NIE — в [отдельном гайде](/notes/" +
        NIE_EMPADRONAMIENTO_SLUG +
        "); здесь только связка **район → адрес → padrón**.",
      "Город делится на девятнадцать distritos administrativos; релоканты чаще всего останавливаются в восьми зонах ниже — не потому что остальные «плохие», а потому что там сходятся аренда, метро и привычный expat-быт. Официальная карта и список juntas — на [valencia.es](https://www.valencia.es/).",
      "Главное: distrito на contrato определяет, куда ехать за padrón и какой у вас commute; открытка Turia не заменяет вечерний шум на Calle de Cadiz.",
    ],
    bullets: [
      "Municipio Valencia — один Ayuntamiento; distritos — административные единицы для padrón, школ и статистики.",
      "Empadronamiento: contrato или autorización владельца + identificación; certificado — через sede или junta de distrito.",
      "Barrio ≠ distrito: Ruzafa ⊂ L'Eixample; Cabanyal ⊂ Poblats Marítims; Carmen ⊂ Ciutat Vella.",
      "Права tenant на padrón после contrato — LAU; если agency отказывает в empadronamiento, это red flag до подписи.",
      "Официальные порталы: [Ayuntamiento de Valencia](https://www.valencia.es/), [Metrovalencia](https://www.metrovalencia.es/), [EMT Valencia](https://www.emtvalencia.es/).",
    ],
  },
  {
    heading: "Как читать карту Valencia",
    section_kind: "official",
    paragraphs: [
      "Утром в Turia ещё прохладно, а к полудню солнце уже выжигает плитку у Mercado Central — и вы понимаете, что «центр Valencia» в чатах это три разных ощущения: Ciutat Vella с туристами у собора, сетка L'Eixample с широкими chamfered углами и морской Cabanyal, где пахнет солью, а не incienso.",
      "Ниже — восемь зон, как их **снимают** русскоязычные релоканты в 2025–2026: не рейтинг «лучший район», а характер улицы, commute и то, что всплывает к четвёртому месяцу. Аренда — ориентир рынка; перед fianza сверяйте [Idealista-практику](/notes/" +
        ARENDA_VALENCIA_SLUG +
        ") и contrato.",
      "Главное: сначала характер (шум, влажность, расстояние до метро/tram), потом € на карточке объявления.",
    ],
    bullets: [
      "Ciutat Vella и L'Eixample — самые дорогие distritos по €/m² (Idealista ~18–20 €/m²); Patraix и Benimaclet — ниже media (~14–14,7 €/m²).",
      "Море — только Poblats Marítims (Cabanyal, Malvarrosa); «центр» — пешком/Turia, не пляж.",
      "Metro + tram: Benimaclet и Cabanyal сильнее других по линиям; Campanar — метро без моря.",
      "Туристический слой густеет у Carmen и Mercado; в Ruzafa — вечером и в Fallas.",
    ],
  },
  {
    heading: "1. Ruzafa (Russafa)",
    section_kind: "practice",
    paragraphs: [
      "**Характер.** Бывший рабочий квартал, превращённый в capital expat-ночной жизни: независимые cafés, vintage-витрины, co-working и очередь на viewing в субботу. Хорошо — всё пешком до Turia и Estación del Norte, международная тусовка, рестораны на каждом втором углу. Плохо — шум до полуночи на Calle de Cadiz и Calle Sueca, Fallas как двухнедельный фестиваль у вашего окна, аренда выше media.",
      "**Кому.** Solo и пары без детей, remote workers, creatives до ~45 — «хочу быть в социальном центре». Семьям со школой часто тесно и шумно; budget-conscious уходят в Benimaclet или Campanar.",
      "**Commute.** Estación del Norte / Xàtiva и Joaquín Sorolla доступны пешком из разных частей barrio; ближайшая линия зависит от конкретной calle (Russafa L10, Xàtiva L3/L5/L9, Bailén L7). Проверяйте маршрут по официальной карте, а не по ярлыку района.",
      "**Аренда (soft, Idealista/чаты 2026).** T1 часто €900–1 100; T2 €1 100–1 400; меблированные studio дороже. Distrito L'Eixample в целом ~18 €/m² — внутри разброс: El Pla del Remei дороже, Ruzafa чуть ниже пика, но растёт.",
      "Главное: Ruzafa — энергия и цена «центра без Ciutat Vella»; платите за vibe, не за тишину.",
    ],
    bullets: [
      "+ пешком, cafés, expat-сцена; − шум, Fallas, конкуренция на viewing.",
      "Solo/пара remote — да; семья с детьми — редко первый выбор.",
      "Russafa L10; Xàtiva L3/L5/L9 и Bailén L7 — в пешей доступности в зависимости от calle; время до пляжа проверяйте планировщиком.",
      "Soft: T2 €1 100–1 400; agency fee +1 mes — см. гайд по аренде.",
    ],
  },
  {
    heading: "2. Benimaclet",
    section_kind: "practice",
    paragraphs: [
      "**Характер.** Деревня, которую город поглотил в 1878, но не переделал: низкая застройка, plaza с соседскими разговорами, студенты UPV и «самоорганизованный» дух. Хорошо — одни из более доступных €/m² внутри городской черты, сильное community, vegan/Asian grocers, несколько линий метро и tram. Плохо — старые дома без ascensor, улицы «не отполированы», на окраинах barrio шумнее от студентов.",
      "**Кому.** Budget solo, grad students, пары remote до 35, кто хочет village scale без уезда в pueblo. Семьи с детьми — да, если устраивает state school в районе; premium bilingual — реже, чем в Eixample.",
      "**Commute.** Benimaclet объединяет metro L3/L9 и tram L4/L6; это сильный пересадочный узел. До Colón есть прямой metro, но минуты зависят от ожидания и конкретного входа.",
      "**Аренда (soft).** Distrito Benimaclet ~14,7 €/m² (Idealista ago. 2026); T1 €700–950; T2 €850–1 100. Рост trimestral +9,2% €/m² — один из самых резких в городе.",
      "Главное: Benimaclet — value + метро; charm старого piso покупаете вместе с humedad и соседскими fiestas.",
    ],
    bullets: [
      "+ цена, метро/tram, community; − старые pisos, студенческий шум на краях.",
      "Budget / solo / студент — идеальный матч.",
      "L3/L9 + tram L4/L6; до centro — по актуальному планировщику Metrovalencia.",
      "Soft: T2 €850–1 100; проверяйте empadronamiento в contrato.",
    ],
  },
  {
    heading: "3. El Cabanyal / Poblats Marítims",
    section_kind: "practice",
    paragraphs: [
      "**Характер.** Рыбацкий квартал у Средиземного: azulejos на фасадах, низкая застройка, пляж в пяти минутах. После кампании против сноса — gentrification: surf-шопы рядом с bodega, новые рестораны на Calle de la Reina. Хорошо — море, аутdoor, ощущение village у воды. Плохо — до «офисного» centro ~20 мин tram; зимой часть улиц пустует; супermarket density ниже, чем у Gran Vía.",
      "**Кому.** Пары и solo, кто prioritizes море; runners и surfers; remote без ежедневной поездки в centro. Не для тех, кто хочет nightlife Ruzafa каждый четверг без поездки.",
      "**Commute.** Tram L4/L6/L8 к centro и UPV; metro менее прямой, чем в Benimaclet. Poblats Marítims distrito ~17,4 €/m² — Cabanyal внутри может быть ниже/выше в зависимости от блока до пляжа.",
      "**Аренда (soft).** T2 €950–1 300 у моря; gentrification подтягивает к Ruzafa — «ещё на 10–15% дешевле при том же качестве» (чаты 2026), но gap сужается.",
      "Главное: Cabanyal — единственный district с пляжем в черте города; commute и зимняя пустота — цена за соль на коже.",
    ],
    bullets: [
      "+ пляж, azulejos, outdoor; − distance до centro, зимняя изоляция, gentrification.",
      "Solo/пара «море > bars» — да.",
      "Tram L4/L6; до centro ~18–25 мин (soft).",
      "Soft: T2 €950–1 300; влажность и соль — проверяйте ventanas и persianas.",
    ],
  },
  {
    heading: "4. Ciutat Vella / El Carmen",
    section_kind: "practice",
    paragraphs: [
      "**Характер.** Средневековый лабиринт: Torres de Serranos, Mercado Central, стены, туристы с картой в руке. El Carmen — сердце nightlife и street art. Хорошо — «настоящий Valencia» в пешей доступности, культура, рынки. Плохо — туристический шум, узкие callejones без солнца, старые здания с acoustic с соседями, паркинг почти myth.",
      "**Кому.** Solo на короткий срок, кто хочет postcard life; пары без машины на 1–2 года. Семьям с коляской — hard mode; budget — только если готовы к compromise по метражу.",
      "**Commute.** Внутри centro многое пешком; ближайшие Xàtiva, Àngel Guimerà, Colón или Túria зависят от края Ciutat Vella. До пляжа маршрут обычно с пересадкой — проверяйте планировщик.",
      "**Аренда (soft).** Distrito Ciutat Vella ~19,3 €/m² — лидер таблицы Idealista; T1 €950–1 200; T2 €1 200–1 600+. Меблированные tourist-oriented — отдельный рынок.",
      "Главное: Carmen — туристы и fiestas; если нужна тишь после 23:00, смотрите inner courtyards или другой distrito.",
    ],
    bullets: [
      "+ история, пешком, рынки; − туристы, шум, humedad во дворах.",
      "Solo/краткосрок — да; семья — редко.",
      "Станция зависит от части Ciutat Vella; машина часто неудобна из-за ограничений и парковки.",
      "Soft: €/m² ~19,3; T2 €1 200–1 600+.",
    ],
  },
  {
    heading: "5. Campanar",
    section_kind: "practice",
    paragraphs: [
      "**Характер.** Жилой distrito севернее centro: mix 70–80-х и новостройки, семьи, парки, меньше туристов. Хорошо — больше метров за euro, тише Ruzafa, метро L1/L3/L5/L7/L9, близко Turia на северной стороне. Плохо — меньше «charisma» и walkable cafés; часть zona industrial на окраине.",
      "**Кому.** Пары и семьи с детьми, budget-conscious с детьми в state school, кто ездит на машине или metro на работу. Solo expat без машины — ok, если станция рядом.",
      "**Commute.** Túria обслуживают L1/L2; tram Campanar — L4. Конкретный выбор зависит от части большого distrito; до centro проверяйте по адресу.",
      "**Аренда (soft).** ~17,5 €/m²; рост +19% год к году €/m² (один из сильных); T2 €950–1 200; T3 семейные €1 200–1 500.",
      "Главное: Campanar — семейный compromise между ценой и доступом к centro без туристического гула.",
    ],
    bullets: [
      "+ метры, семьи, метро; − меньше vibe, окраины industrial.",
      "Семья / budget / пара с metro — strong match.",
      "Túria L1/L2 или Campanar L4; линии зависят от конкретной calle.",
      "Soft: T2 €950–1 200; рост цен быстрый — не «дешёвая тайна».",
    ],
  },
  {
    heading: "6. Patraix",
    section_kind: "practice",
    paragraphs: [
      "**Характер.** Рабочий юго-запад: Patraix centro с рынком, смешение старых pisos и renovación. Хорошо — среди самых низких €/m² в городе (~13,7), связь с centro через metro L1/L7 и EMT, authentic без туристов. Плохо — не «красивый» Instagram-barrio, часть улиц шум от трафика, до пляжа далеко.",
      "**Кому.** Budget solo/пара, первый contrato без aval, семьи местные; expat с машиной или терпением к bus. Не для «хочу Ruzafa, но дешевле» — другой ритм.",
      "**Commute.** Patraix обслуживают L1/L2/L7; время до Xàtiva зависит от линии и ожидания.",
      "**Аренда (soft).** T1 €650–850; T2 €800–1 000; T3 €1 000–1 250. Idealista: ~960 €/mes эквивалент 70 m².",
      "Главное: Patraix — бюджет внутри города; charm не продаётся, продаётся метраж.",
    ],
    bullets: [
      "+ самый доступный centro-adjacent €/m² (soft); − трафик, меньше expat-сцены.",
      "Budget / первый contrato — strong match.",
      "Metro L1/L2/L7; время до centro проверяйте по расписанию.",
      "Soft: T2 €800–1 000.",
    ],
  },
  {
    heading: "7. L'Eixample / Gran Vía",
    section_kind: "practice",
    paragraphs: [
      "**Характер.** Плановая сетка XIX века: широкие улицы, modernista фасады, Gran Vía Marqués del Turia с магазинами. Внутри — от premium Pla del Remei до более живого Ruzafa (см. выше). Хорошо — schools (Cervantes, Luis Vives), playgrounds, Turia в 5 мин, семейный формат. Плохо — traffic на Gran Vía, cafés дороже Ruzafa, €/m² второй после Ciutat Vella (~18 €/m²).",
      "**Кому.** Семьи с детьми в state/bilingual school, пары 30+, кто хочет space и порядок сетки. Solo party — скорее Ruzafa внутри того же distrito.",
      "**Commute.** Colón / Xàtiva / Bailén metro; EMT по Gran Vía; пешком до centro 10–20 мин.",
      "**Аренда (soft).** T3 семейные €1 400–2 000; T2 €1 200–1 550; Pla del Remei — premium.",
      "Главное: Eixample — «взрослый» centro; Ruzafa внутри него — молодой и шумный полюс.",
    ],
    bullets: [
      "+ школы, Turia, сетка; − traffic, цена, меньше night life (кроме Ruzafa).",
      "Семья / школа / пара 30+ — strong match.",
      "Metro L1/L5/L10; Gran Vía EMT.",
      "Soft: T3 €1 400–2 000; distrito ~18 €/m².",
    ],
  },
  {
    heading: "8. Malilla / Quatre Carreres (кратко)",
    section_kind: "practice",
    paragraphs: [
      "**Malilla** — barrio на юге Quatre Carreres, рядом с La Fe: спокойнее Ruzafa, с жилой застройкой и зависимостью от EMT/пешего доступа к L10 в зависимости от адреса. Это не университетская зона UPV.",
      "**Quatre Carreres** — большой юго-восток: Mont-Olivet, En Corts, Malilla и другие barrios; mix новостроек у Ciutat de les Arts и жилых кварталов. Хорошо — метры, парковки в новых домах, близко к La Fe. Плохо — размазанность; рельсовый доступ в основном через L10, остальное закрывает EMT. Soft: T2 €900–1 150.",
      "Главное: оба — «не открытка», но practical для семьи и long stay, когда Ruzafa и Cabanyal уже просмотрены.",
    ],
    bullets: [
      "Malilla: тише, La Fe рядом; Quatre Carreres: новостройки, hospital, L10 + EMT.",
      "Семья / студент / long stay — ok; solo party — слабее Ruzafa.",
      "Soft: T2 €900–1 150 в Quatre Carreres; Malilla сопоставим с Campanar.",
    ],
  },
  {
    heading: "Кому куда: solo, пара, школа, тишина, бюджет",
    section_kind: "practice",
    paragraphs: [
      "Карта выбора не линейна, но паттерны в @valenciarusia повторяются: solo remote без машины — Ruzafa или Benimaclet; пара «море + remote» — Cabanyal; семья state school — Eixample/Gran Vía или Campanar; budget первый год — Patraix или Benimaclet; postcard tourism — Ciutat Vella на год, не на десять; тишина без suburbs — Malilla или inner Campanar.",
      "Школа: domicilio/empadronamiento может давать баллы в ежегодном proceso de admisión, но distrito сам по себе не гарантирует место. Проверяйте карту áreas de influencia и правила Conselleria на конкретный учебный год до подписи.",
      "Главное: профиль «solo/пара/семья/бюджет» сужает список до 2–3 distritos быстрее, чем неделя скролла Idealista.",
    ],
    bullets: [
      "Solo / remote / nightlife → Ruzafa, Benimaclet (budget).",
      "Пара / море → Cabanyal; пара / culture → Ruzafa или Carmen (краткосрок).",
      "Семья / школа → Eixample, Campanar, часть Quatre Carreres.",
      "Тишина / budget → Patraix, Malilla, Campanar (не у highway).",
      "Postcard / tourist life → Ciutat Vella — max 1–2 года без burnout.",
      "Перед viewing: [чеклист аренды](/notes/" + ARENDA_VALENCIA_SLUG + ").",
      "Первые документы: [30 дней](/notes/" + PERVYE_30_SLUG + ").",
      "Не sure в визовом треке → [wizard](/ru/spain/wizard) или [Assist Route Check](/ru/assist) — разбор маршрута до fianza.",
    ],
  },
  {
    heading: "Metro, tram и EMT: сигнал commute (не полный транспорт-гайд)",
    section_kind: "practice",
    paragraphs: [
      "Valencia на первые месяцы живётся без машины, если адрес близок к **Metrovalencia**, tram или частому EMT. Не переносите линию на весь distrito: Benimaclet — L3/L9 и L4/L6, Cabanyal — tram L4/L6 и станции ближе к Marítim, Patraix — L1/L2/L7, Ruzafa/Quatre Carreres — прежде всего L10. Актуальную связку проверяйте на официальной карте.",
      "На viewing спросите: сколько минут до станции **ночью**, есть ли ascensor в старом piso, как часто L1 переполняется в 8:30 (ответ: часто). Полный разбор tarifas, coche и aeropuerto — в отдельном материале [транспорт Valencia (скоро)](/notes/transport-valencia-metro-emt-coche-2026); здесь только привязка **район → линия**.",
      "Главное: Benimaclet и Cabanyal выигрывают линиями; Patraix — L1 hub; Ciutat Vella — пешком; Campanar — metro без tram до пляжа.",
    ],
    bullets: [
      "Ruzafa / Eixample: Russafa L10; Xàtiva L3/L5/L9, Bailén L7 и Colón L3/L5/L7/L9 — в зависимости от адреса.",
      "Benimaclet: metro L3/L9 + tram L4/L6.",
      "Cabanyal: tram L4/L6 до centro; пляж пешком.",
      "Patraix: L1/L2/L7.",
      "Campanar: Túria L1/L2 или Campanar L4 — по части distrito.",
      "EMT: ночные и pop-up маршруты; карта emtvalencia.es.",
      "Aeropuerto: L3/L5 + bus; из Cabanyal дольше, чем из Benimaclet.",
      "Детали — transport guide (скоро); первый месяц — [30 дней](/notes/" + PERVYE_30_SLUG + ").",
    ],
  },
  {
    heading: "Где чаты и Idealista расходятся с улицей",
    section_kind: "gap",
    paragraphs: [
      "В Telegram «Cabanyal = дёшево у моря», а на viewing двухкомнатный у Las Arenas уже просит почти Ruzafa. «Benimaclet village» — да, но calle с общагой гремит до 2:00. «Ciutat Vella romantic» — без упоминания, что мусоровоз в 7:00 echo во дворе.",
      "Главное: фильтр Idealista не показывает humedad, соседскую fiesta и туристический маршрут под окном — это только вечерний визит и соседи у лифта.",
    ],
    bullets: [
      "«Ruzafa = все expats» → конкуренция и agency fee; без NIE+IBAN viewing бесполезен.",
      "«Cabanyal cheap» → gentrification 2024–2026 сужает gap; soft-verify цену блока.",
      "«Centro без машины» → Ciutat Vella да; Campanar/Cabanyal — зависит от станции.",
      "«Distrito = школа» → catchment уточняйте в ayuntamiento, не в чате.",
    ],
  },
  {
    heading: "Типичные ошибки при выборе района",
    section_kind: "practice",
    paragraphs: [
      "Брать Ruzafa по фото cafés и удивляться Fallas и ночному гулу. Снимать Cabanyal «ради пляжа» без поездки в centro в будний вечер. Путать tourist apartment в Carmen с larga duración и правом padrón. Выбирать Patraix только по €/m², не выйдя из metro ночью.",
      "Главное: один вечер на месте и разговор с concierge/neighbor стоят больше, чем десять отзывов в @valenforum.",
    ],
    bullets: [
      "Не выбирайте только по €/m² Idealista — soft signal, не контракт.",
      "Не пропускайте вопрос empadronamiento в contrato — см. [NIE/padrón](/notes/" + NIE_EMPADRONAMIENTO_SLUG + ").",
      "Не оценивайте шум в Tuesday noon — приезжайте пятницу 22:00.",
      "Не игнорируйте humedad в ground floor у моря — попросите facturas luz/агua.",
      "Не путайте alquiler temporal с TIE-track larga duración.",
    ],
  },
  {
    heading: "К 4–6 месяцу: что всплывает после просмотра",
    section_kind: "practice",
    paragraphs: [
      "К четвёртому месяцу контракт уже не новость — и район показывает зубы. **Шум:** в Ruzafa и Carmen соседи и terrazas не заканчиваются с сезоном; Fallas только начало. **Commute:** привыкли к 12 мин metro — в сентябре переполнение L1 добавляет стресс, если не заложили buffer; из Cabanyal «ещё один tram» устаёт на daily.",
      "**Humedad / плесень:** старые pisos в Ciutat Vella, Cabanyal и ground floor Benimaclet — пятна в углах после первой зимы дождя; на viewing с AC hide следы. **Туризм:** соседний Airbnb в Carmen — тележки в 6:00 круглый год; в Ruzafa — weekend bachelor groups.",
      "Что откладывают: сменить distrito «когда NIE будет» — смена = новый depósito + agency; дождаться «тихого сезона» — в Valencia его нет у пляжа и у Fallas. **Seguro hogar** и inventario фото — не luxury. Если район не fit — лучше решить на 4–6 месяце, чем терпеть до года и burnout.",
      "Главное: viewing — snapshot; 4–6 месяц — weather, соседи и счета за calefacción/humedad.",
    ],
    bullets: [
      "Шум: terrazas, Fallas, Airbnb-соседи — Ruzafa/Carmen.",
      "Commute: пик L1/L5; Cabanyal зимой — реже social life в centro.",
      "Humedad: у моря и старых стен — осмотр после дождя, не только солнце.",
      "Тourism: Airbnb rotation в Ciutat Vella — утренний шум.",
      "Смена района на 4–6 мес. = новый fianza; закладывайте в [аренду](/notes/" + ARENDA_VALENCIA_SLUG + ").",
      "Не sure в документах для следующего contrato → [Assist](/ru/assist) или [wizard](/ru/spain/wizard).",
    ],
  },
];

const keyTakeaways = [
  "Официально: Valencia — 19 distritos; empadronamiento в Ayuntamiento/junta по адресу contrato; barrio ≠ distrito.",
  formatPracticeTakeaway({
    channels: ["valenciarusia", "valenforum"],
    period: "2025–2026",
    claim:
      "релоканты чаще снимают Ruzafa, Benimaclet, Cabanyal, Ciutat Vella, Campanar, Patraix и Eixample — не потому что «лучшие», а из-за аренды, метро и expat-инфраструктуры",
    forReader: "сначала профиль (solo/семья/море/бюджет), потом фильтр Idealista",
  }),
  formatPracticeTakeaway({
    channels: ["valenciarusia"],
    period: "2026",
    claim:
      "к 4–6 месяцу чаще жалуются на шум (Ruzafa/Carmen), humedad у моря и в старых pisos, commute в пик L1 и туристический Airbnb под окном — это редко видно на дневном viewing",
    forReader: "проверяйте район пятница вечером и после дождя, не только в солнечный вторник",
  }),
  "Расхождение: «€/m² на Idealista» vs реальный contrato с agency fee и отказом без NIE+IBAN — рынок soft, документы hard.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "С какого района начать первый просмотр в Valencia?",
    a: "По правилам района «для всех» нет. На практике solo remote — Ruzafa + Benimaclet за один день (конtrast шума и цены); семья — Eixample/Gran Vía + Campanar; море — Cabanyal. Contrato — [гайд по аренде](/notes/" + ARENDA_VALENCIA_SLUG + ").",
  },
  {
    q: "Где дешевле снимать внутри города?",
    a: "По Idealista (soft, ago. 2026) ниже media: Patraix (~13,7 €/m²), Benimaclet (~14,7 €/m²). На практике Patraix и окраины Campanar — первые contrato без aval; Ruzafa и Ciutat Vella дороже.",
  },
  {
    q: "Нужен ли район для empadronamiento?",
    a: "По правилам padrón привязан к адресу, не к «лучшему» distrito. На практике agency в tourist zones иногда ограничивает empadronamiento — проверьте cláusula до fianza. Порядок шагов — [NIE/padrón](/notes/" + NIE_EMPADRONAMIENTO_SLUG + ").",
  },
  {
    q: "Можно жить без машины?",
    a: "По правилам город покрыт Metrovalencia и EMT. На практике Benimaclet, Ruzafa, Eixample, Patraix и Campanar у метро — ok; Cabanyal — ok с tram, но centro вечером дальше. Детали — transport guide (скоро).",
  },
  {
    q: "Что проверить на viewing, кроме фото?",
    a: "По правилам — contrato и состояние. На практике: шум в 22:00, ventanas на calle с terrazas, следы humedad, минуты до metro ночью, право empadronamiento. Первый месяц — [чеклист](/notes/" + PERVYE_30_SLUG + ").",
  },
];

export const VALENCIA_RAJONY_GUIDE = {
  slug: VALENCIA_RAJONY_SLUG,
  category: "Жильё",
  content_kind: "guide" as ContentKind,
  title: "Районы Valencia: аренда, метро, кому куда — обзор 2026",
  excerpt:
    "Ruzafa, Benimaclet, Cabanyal, Ciutat Vella, Campanar, Patraix, Eixample: чем отличаются, кому подходят, что бесит к 4–6 месяцу — практика аренды без гайда по покупке.",
  seo_title: "Районы Valencia 2026 — аренда, метро, школы",
  seo_description:
    "Районы Valencia 2026: Ruzafa, Benimaclet, Cabanyal, Campanar и Patraix — аренда, метро, школы. Что бесит к 4–6 месяцу и не видно на viewing.",
  quick_answer:
    "Valencia — не один «центр у моря»: Ruzafa — expat-ночь и € выше media, Benimaclet и Patraix — budget и метро, Cabanyal — пляж с commute, Ciutat Vella — туристы и humedad, Campanar и Eixample — семьи. Цены — soft Idealista ~16 €/m² city avg; выбирайте по профилю и вечернему viewing, не по открытке.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "Ayuntamiento de Valencia", url: "https://www.valencia.es/" },
    { title: "Metrovalencia", url: "https://www.metrovalencia.es/" },
    { title: "Metrovalencia — станции и линии", url: "https://www.metrovalencia.es/es/consulta-estaciones/" },
    { title: "EMT Valencia", url: "https://www.emtvalencia.es/" },
    { title: "Idealista — alquiler Valencia", url: "https://www.idealista.com/alquiler-viviendas/valencia-valencia/" },
  ],
  topic_tags: ["arenda", "valencia", "distritos", "alquiler"],
  hashtags: buildNoteHashtags({
    topicTags: ["arenda", "valencia", "alquiler"],
    contentKind: "guide",
    extra: ["ruzafa", "benimaclet", "cabanyal", "metrovalencia"],
  }),
  source_channel: "valenciarusia+valenforum",
  source_label: "editorial:districts-valencia",
  pillar_guide_slug: "pervye-30-dnej-v-ispanii-2026",
};
