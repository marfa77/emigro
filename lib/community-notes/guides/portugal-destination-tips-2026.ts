/**
 * Full Portugal destination atlas from user travel notes (Aug 2026).
 * Keep all regions, food notes, combinations and link lists — overlays only.
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { formatPracticeTakeaway } from "@/lib/community-notes/practice-format";
import { CAR_PORTUGAL_GUIDE_SLUG } from "@/lib/community-notes/guides/car-portugal-buy-rent-import";
import { DOMESTIC_TOURISM_NORTE_SLUG } from "@/lib/community-notes/guides/domestic-tourism-portugal-norte";
import { FESTIVALS_PORTUGAL_2026_SLUG } from "@/lib/community-notes/guides/festivals-portugal-2026";
import { GASTRONOMY_NORTE_SLUG } from "@/lib/community-notes/guides/gastronomy-norte-portugal";
import { PORTUGAL_REGIONS_EXPAT_GUIDE_SLUG } from "@/lib/community-notes/guides/portugal-regions-expat-guide";
import { TOLLS_FINES_ACCIDENTS_GUIDE_SLUG } from "@/lib/community-notes/guides/tolls-fines-accidents-norte-portugal";
import { PORTO_VS_BRAGA_FAMILY_SCHOOLS_SLUG } from "@/lib/community-notes/guides/porto-vs-braga-family-schools";
import { WINES_WINERIES_NORTE_SLUG } from "@/lib/community-notes/guides/wines-wineries-norte-portugal";
import { ROLE_RADAR_LANDING_PATH } from "@/lib/role-radar";
import type {
  CommunityNoteFaq,
  ContentKind,
  NoteBodySection,
  NoteBodyTable,
} from "@/lib/community-notes/types";

export const PORTUGAL_DESTINATION_TIPS_SLUG = "portugal-destination-tips-regiony-2026";

const LGOTY_SLUG = "lgoty-s-vnj-kulturnye-mesta-2026";

const GLOSSARY_INTRO =
  "Слова с ementa, с билета Parques de Sintra и с табло Linha do Douro — чтобы bica, traveseiro и Acesso 52 не путались, пока вы уже живёте в Norte и собираете поездку, а не «три дня через Лиссабон».";

function trio(character: string, bestFor: string, combine: string): NoteBodyTable {
  return {
    columns: ["Характер", "Для кого", "С чем сочетать"],
    rows: [[character, bestFor, combine]],
  };
}

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(glossaryForSlug(PORTUGAL_DESTINATION_TIPS_SLUG)!, GLOSSARY_INTRO),
  },
  {
    heading: "Nota Emigro (fact-check)",
    section_kind: "official",
    paragraphs: [
      "Ниже — полный атлас личных travel notes (обзор август 2026): места, еда, дневные петли и ссылки. Это не юридическая консультация и не обещание часов работы. Даты фестивалей и билеты перепроверяйте на официальных страницах перед выездом.",
      "OK: Feira Nacional do Cavalo в Golegã на 2026 VisitPortugal ставит **6–15 ноября** (feiranacionaldocavalo.com). Acesso 52 — программа Museus e Monumentos de Portugal: до **52 бесплатных дней в год** в участвующих музеях/дворцах для residentes с NIF; правила и список объектов — museusemonumentos.pt / gov.pt, не блог. Soft: «вторая в мире коллекция меди» на кухнях Palácio da Vila и «здесь всегда пил Байрон» — легенды гидов, не hard-факт. История Педру и Инеш (в т.ч. коронация тела) — средневековая традиция/хроника, не инструкция к визиту. Caretos de Podence — живой Entrudo, не отдельная «языческая религия». Список вакансий в конце PDF — не подбор работы Emigro.",
      "Главное: часы, слоты и льготы residente сверяйте в день поездки; этот текст держит карту мест, а не кассу.",
    ],
    bullets: [
      "Откройте Visit Portugal как национальную точку входа: visitportugal.com.",
      "Для дворцов Sintra/Queluz — parquesdesintra.pt, не только TripAdvisor.",
      "Acesso 52: museusemonumentos.pt (bilhetes) + [льготы с ВНЖ](/notes/" + LGOTY_SLUG + ").",
      "Golegã 2026: 6–15 ноября на странице VisitPortugal события.",
      "Выходные из Porto на 1–2 дня — отдельный гайд [внутренний туризм Norte](/notes/" + DOMESTIC_TOURISM_NORTE_SLUG + ").",
    ],
  },
  {
    heading: "Как читать этот атлас, если вы уже в Porto",
    section_kind: "action_guide",
    paragraphs: [
      "Заметки собраны как личный справочник: не энциклопедия всех памятников, а характер регионов и рабочие связки. Lisbon + Sintra сидят рядом. Sesimbra–Arrábida–Setúbal–Palmela — прибрежный кластер южнее Лиссабона. Tomar, Almourol и Constância — тамплиерская/речная петля. Coimbra хорошо стыкуется с Conímbriga, Buçaco и Luso. Nazaré, Batalha, Alcobaça и Óbidos — западный Centro на машине. Guimarães, Braga и Barcelos легко из Porto; Peneda-Gerês просит больше времени. Верхний Douro: scenic train до Pocinho, последние ~7 км до Vila Nova de Foz Côa по дороге.",
      "Если цель — суббота без отпуска, сначала [выходные из Porto](/notes/" +
        DOMESTIC_TOURISM_NORTE_SLUG +
        "). Этот текст — когда хотите карту всей страны: Лиссабон, Ribatejo, Centro, Alentejo, Madeira. Климат и «где жить» — [регионы для экспатов](/notes/" +
        PORTUGAL_REGIONS_EXPAT_GUIDE_SLUG +
        "). Машина и portagens — [авто](/notes/" +
        CAR_PORTUGAL_GUIDE_SLUG +
        ") и [tolls](/notes/" +
        TOLLS_FINES_ACCIDENTS_GUIDE_SLUG +
        ").",
      "Главное: из Norte на 1–2 дня берите Minho/Douro/Gerês; этот атлас — для петель на 2–5 дней и «куда ещё», когда карта Porto уже знакома.",
    ],
    bullets: [
      "Решите заранее: это суббота из Porto или мини-отпуск 3–5 дней.",
      "Выберите один кластер ниже — не три региона за выходные.",
      "Сверьте CP, паром и слот дворца на официальном сайте в день выезда.",
      "Закройте portagem и парковку до выезда, не на шлагбауме.",
      "Еду региона читайте как характер места, не как рейтинг Michelin.",
    ],
  },
  {
    heading: "Кофе и еда: café, cheirinho, bolo de mel",
    section_kind: "practice",
    paragraphs: [
      "Чёрный кофе по умолчанию — **um café** (в Лиссабоне часто **uma bica**): это эспрессо. Если нужен длиннее и больше воды — **um abatanado**. После кофе **café com cheirinho** — глоток крепкого (часто aguardente). Шутливая фраза «Tem alguma coisa para lavar a chávena?» («есть чем сполоснуть чашку?») — способ спросить про дижестив; иногда нальют «от заведения», рассчитывать на это нельзя.",
      "**Bolo de mel** особенно стоит попробовать на Madeira: классика — bolo de mel de cana, тёмный пряный кекс на тростниковом сиропе, орехи и специи, хорошо хранится, связан с рождественской традицией острова, но продаётся весь год. Северная кухня Porto/Braga — в [гастрономии Norte](/notes/" +
        GASTRONOMY_NORTE_SLUG +
        ").",
      "Главное: um café = эспрессо; abatanado — длиннее; cheirinho не входит в счёт по умолчанию.",
    ],
    bullets: [
      "Закажите um café / uma bica, если хотите стандартный эспрессо.",
      "Скажите um abatanado, если нужен более длинный чёрный.",
      "Не ждите бесплатный cheirinho — это жест, не правило.",
      "Попробуйте bolo de mel de cana на Madeira, не путайте с обычным «медовым тортом».",
      "Для Porto/Braga откройте отдельный гайд по кухне Norte.",
    ],
  },
  {
    heading: "Lisbon и Sintra: дворцы, сады, бары с характером",
    section_kind: "practice",
    paragraphs: [
      "**Palácio dos Marqueses da Fronteira** (São Domingos de Benfica, XVII в.) — менее очевидный лиссабонский визит: изразцовые интерьеры и формальные сады, фонтаны, статуи, большие панели azulejos XVII века. Хороший выбор, если любите дома и сады без толпы у «главных» памятников. **Casa do Alentejo** у Rossio — культурный центр и ресторан в бывшем дворце (позже Majestic Club): неомавританский двор и комнаты в revival-стилях; архитектура — половина причины зайти, даже без полного обеда. **Palácio Nacional da Ajuda** — официальная королевская резиденция со времён D. Luís I до конца монархии: парадные залы XIX в., тронный зал; рядом Museu do Tesouro Real (регалии и золото).",
      "Ещё по Лиссабону из заметок: Planetário de Marinha в Belém (семейный стоп к памятникам); Oceanário в Parque das Nações; Museu de Marinha («музей лодок») в Belém; реплика каравеллы **Vera Cruz** (APORVELA) — ходит между портами, проверяйте текущую стоянку; Museu Nacional de Arte Antiga; Quinta Pedagógica dos Olivais — муниципальная ферма, спокойный семейный выход. Рестораны и интерьеры: The Fifties (1950s diner в Oriente, скорее тема, чем португальский стол); Cervejaria Trindade (бывший Convento da Santíssima Trindade — зал и azulejos важнее меню). Бары: Pavilhão Chinês (бар-музей с тысячами курьёзов); Foxtrot; Procópio у Amoreiras (живое пианино бывает — смотрите афишу).",
      "**Queluz** — дворец между Лиссабоном и Синтрой, часто сравнивают с Версалем из‑за рококо и партера; канал с изразцами, связь с королевской семьёй. **Sintra** не умещается в один день: пару «громких» точек плюс тихий Convento dos Capuchos или Monserrate. Capuchos — маленький францисканский монастырь XVI в. в пробке и камне, не дворец. Palácio Nacional de Sintra (два конических дымохода) — королевская резиденция, кухни с медной посудой; утверждение «вторая коллекция меди в мире» не подтверждаем — смотрите как местный колорит. Quinta da Regaleira — романтический парк, гроты, Initiation Well. Monserrate — дворец и ботанический сад без обязательного Pena. **Plataforma** — Harry Potter-атмосфера и pizza rodízio; отзывы на еду смешанные, смысл — тема, особенно с детьми. **Casa Piriquita** — travesseiro и queijadas. **Cantinho do Lord Byron** — имя Байрона (Sintra, 1809); «здесь он всегда пил» — легенда заведения, не архивная справка.",
      "Главное: Sintra — не чеклист Pena+Regaleira за три часа; заложите тихий стоп и официальные слоты Parques de Sintra.",
    ],
    table: trio(
      "Исторические дворцы, сады, old-world атмосфера",
      "Архитектура, сады, еда, лёгкий day trip",
      "Центр Лиссабона, Cascais или длинный Lisbon-area stay"
    ),
    bullets: [
      "Заложите Fronteira или Ajuda, если не хотите только Belém-очередь.",
      "Зайдите в Casa do Alentejo хотя бы посмотреть двор.",
      "Купите Sintra на parquesdesintra.pt, не с уличного перекупа.",
      "Добавьте Capuchos или Monserrate к одной «громкой» точке.",
      "С Acesso 52 сверяйте, входит ли конкретный дворец в список MMP.",
    ],
  },
  {
    heading: "Sesimbra, Setúbal, Arrábida, Tróia и Palmela",
    section_kind: "practice",
    paragraphs: [
      "**Sesimbra** — рыбацкий городок в бухте: пляж у центра, Castelo de Sesimbra сверху. Атлантика даже летом прохладная: VisitPortugal даёт ориентир средней летней температуры воды около **17–18 °C**. **Parque Natural da Arrábida** — зелёные холмы, известняковые обрывы, бухты (Portinho, Galapos, Figueirinha). В высокий сезон доступ и парковка у пляжей меняются — смотрите актуальные ограничения до поездки на машине. **Setúbal** — город, не курорт: choco frito, рынок Mercado do Livramento, эстуарий Саду. **Tróia** — узкий полуостров напротив Setúbal (не остров): длинные пляжи, курорт, гольф, казино; паром из Setúbal часто удобнее объезда. **Palmela** — холм и замок, виды на полуостров и винодельческий край Setúbal.",
      "Почему кластер работает: Sesimbra даёт рыбацкий ритм, Arrábida — берег, Setúbal — еду, Palmela — вид, паром — Tróia. Простая форма дня: утро Sesimbra → дорога через Arrábida → обед choco frito в Setúbal → вечер в замке Palmela. Tróia лучше как отдельный полдень, если паром и пляж — цель, а не добавка.",
      "Главное: это 1–2 дня южнее Лиссабона, не «заехать по пути из Porto на часок».",
    ],
    table: trio(
      "Прибрежный кластер южнее Лиссабона: рыбацкие города, бухты, холмы",
      "Морепродукты, купание, scenic drive, побег на 1–2 дня",
      "Лиссабон, Azeitão, Cabo Espichel или длинный Setúbal Peninsula"
    ),
    bullets: [
      "Не ждите тёплого моря: 17–18 °C летом — норма VisitPortugal, не «плохой год».",
      "Перед Arrábida проверьте, не закрыли ли доступ к пляжам в сезон.",
      "Ешьте choco frito в Setúbal, не только «вид с трассы».",
      "Tróia считайте паромным полуднём, не третьей точкой того же утра.",
      "Palmela закрывает день видом, когда пляж уже полный.",
    ],
  },
  {
    heading: "Golegã — национальная конная ярмарка",
    section_kind: "practice",
    paragraphs: [
      "Golegã называют «конной столицей» Португалии. **Feira Nacional do Cavalo** — повод ехать специально: лузитано, всадники, экипажи, конкурсы, каштаны, молодое вино. Лошади ходят по городу; часть баров устроена так, что можно остановиться не спешиваясь. На 2026 VisitPortugal указывает **6–15 ноября**. Жильё в самой Golegã бронируйте рано. Календарь других фестов — [фестивали 2026](/notes/" +
        FESTIVALS_PORTUGAL_2026_SLUG +
        ").",
      "Главное: это ноябрьская поездка под даты ярмарки, не «заедем как-нибудь в Ribatejo».",
    ],
    table: trio(
      "Маленький Ribatejo, который на дни ярмарки становится национальной сценой",
      "Лошади, лузитано, традиционный костюм, атмосфера феста",
      "Tomar, Santarém или центральный road trip"
    ),
    bullets: [
      "Сверьте 6–15 ноября 2026 на visitportugal.com и feiranacionaldocavalo.com.",
      "Бронируйте ночь в Golegã или рядом до заполнения ноября.",
      "Не путайте с обычным рынком четверга — это десятидневный национальный фест.",
      "Сочетайте с Tomar, если уже в Centro на машине.",
    ],
  },
  {
    heading: "Tomar, Almourol и Constância",
    section_kind: "practice",
    paragraphs: [
      "**Tomar** — город тамплиеров и позже Ордена Христа. Главное — Convento de Cristo и замок над городом: средневековье, мануэлино, ренессанс. Внизу река Nabão и Jardim do Mouchão. **Taverna Antiqua** — средневековый антураж, свечи; бронь имеет смысл. **Festa dos Tabuleiros** — огромные «подносы» из цветов и хлеба, раз в четыре года; в заметках следующая — **2027** (сверьте на turismo.tomar.pt). **Castelo de Almourol** — замок на островке в Тежу, короткая лодка, тамплиерская линия XII в. **Constância** — белый городок у слияния Тежу и Zêzere, спокойный финиш; местная память о Luís de Camões.",
      "Маршрут: утро Tomar (не сжимайте Convento) → Almourol после полудня → Constância к реке. Если цель — только монастырь, не натягивайте все три точки.",
      "Главное: Convento de Cristo ест время; Almourol и Constância — добавка, не три «галочки» за утро.",
    ],
    table: trio(
      "Тамплиеры, речные крепости, маленький Centro",
      "Крупные памятники, средневековая атмосфера, лёгкий кластер на машине",
      "Golegã, Santarém, Castelo de Bode, Coimbra"
    ),
    bullets: [
      "Отведите Convento de Cristo отдельный слот, не «на полчаса с парковки».",
      "Проверьте лодку на Almourol в день визита (сезон/вода).",
      "Tabuleiros — 2027 по заметкам; подтвердите на turismo.tomar.pt.",
      "Constância — обед и река, не третий замок.",
      "Бронь Taverna Antiqua, если едете вечером в сезон.",
    ],
  },
  {
    heading: "Centro: Aveiro, Coimbra, Buçaco, Guarda, Serra da Estrela",
    section_kind: "practice",
    paragraphs: [
      "**Aveiro** — Ria и каналы, moliceiro (когда-то водоросли, теперь гости), ар-нуво в центре, **ovos moles**. **Costa Nova** — полосатые дома рыбаков и атлантический пляж. **Coimbra** — средневековая столица и один из старейших университетов Европы: Paço das Escolas и библиотека Joanina (десятки тысяч ранних книг) — бронируйте время, не фотостоп. **Portugal dos Pequenitos** — мини-Португалия, сильный семейный стоп. **Conímbriga** южнее Coimbra — римский город с мозаиками in situ и музеем. **Quinta das Lágrimas** — усадьба и сад, связанные с историей Педру и Инеш (тайный брак, убийство 1355, позднейшая легенда о коронации тела); сейчас отель и парк. **Guarda** (~1056 м) — самый высокий город материковой PT, гранит, Sé. **Mata Nacional do Buçaco** у Luso — лес, тропы, Palace Hotel do Bussaco (неомануэлино конца XIX в. для королевской семьи, затем отель). **Termas de Luso** и Grande Hotel de Luso — термальная база рядом с лесом. **Aldeias do Xisto** — сланцевые деревни Centro. **Serra da Estrela** — высочайший хребет материка, Torre, ледниковая долина Zêzere; зима — снег, лето — трек и речные пляжи; сыр **Queijo Serra da Estrela**; база Manteigas, рядом Belmonte и Linhares da Beira. **Piódão** — тёмный сланец и синие двери; **Sortelha** — гранит и цельные стены. Сеть: Aldeias Históricas de Portugal.",
      "Главное: Coimbra + Conímbriga или Buçaco+Luso закрывают день; Estrela и aldeias — уже ночёвка, не «заедем с Joanina».",
    ],
    table: trio(
      "Каналы и океан, университет, Рим, лес, термы, горы материка",
      "Архитектура, семья, руины, хайк, прохладный сезон, медленный road trip",
      "Porto, Tomar, Silver Coast, Bairrada, исторические деревни Beiras"
    ),
    bullets: [
      "Купите Joanina заранее — это не «зайдём без очереди».",
      "Свяжите Coimbra с Conímbriga на машине, не вторым поездом вслепую.",
      "Buçaco — день леса и дворца, Luso — ночь в термах.",
      "Estrela зимой — отдельный климат, не пикник из Porto «как в Gerês».",
      "Сеть aldeiasdoxisto.pt — для ночёвок в камне, не только для фото.",
    ],
  },
  {
    heading: "Серебряный берег: Nazaré, Batalha, Alcobaça, Óbidos, Buddha Eden",
    section_kind: "practice",
    paragraphs: [
      "**Nazaré** — рыбацкий нижний город и волны Praia do Norte; сверху Sítio и Forte de São Miguel Arcanjo; семислойные юбки ещё встречаются вокруг туристической зоны. **Mosteiro da Batalha** — готика в память Aljubarrota 1385, UNESCO; капелла основателя и недостроенные капеллы — зайдите внутрь. **Mosteiro de Alcobaça** — цистерцианцы XII в., гробницы Педру и Инеш, масштаб и более строгая церковь рядом с Batalha. **Óbidos** — стены, белые дома, ginjinha в шоколадной чашке; сезонно Medieval Market, шоколад, Рождество. **Buddha Eden** (Bombarral, Bacalhôa) — сад скульптур, терракотовые воины, озёра — нарочито эклектичный контраст монастырям.",
      "Связка: Batalha + Alcobaça — самая лёгкая пара. Óbidos — если день ещё тянет. Nazaré заслуживает отдельного времени, если цель — океан и рыбацкая культура, не «вид с парковки».",
      "Главное: два монастыря UNESCO плюс один характерный стоп; не четыре «must» без обеда.",
    ],
    table: trio(
      "Атлантика, UNESCO-монастыри, классический walled town",
      "Берег, средневековье, монументальная архитектура, разнообразие на машине",
      "Лиссабон, Tomar, Coimbra, Fátima или петля Centro"
    ),
    bullets: [
      "Batalha и Alcobaça берите парой — они рядом и разные по тону.",
      "Óbidos — стены и ginjinha, не три часа сувениров.",
      "Nazaré: Sítio отдельно от нижней набережной.",
      "Buddha Eden — смена ритма, не «ещё один монастырь».",
      "Fátima в заметках как стыковка — только если вам нужен паломнический слой.",
    ],
  },
  {
    heading: "Guimarães, Braga, Barcelos и Peneda-Gerês",
    section_kind: "practice",
    paragraphs: [
      "Это уже **домашний север** для жителя Porto. **Guimarães** связан с рождением Португалии и Afonso Henriques: замок — символ, UNESCO-центр — зачем оставлять время. Рядом **Paço dos Duques de Bragança** (XV в.): мебель, гобелены, оружие. **Braga** — концентрация церквей: Sé в центре, Bom Jesus do Monte с лестницей, Sameiro. **Barcelos** — Galo de Barcelos, керамика, мост через Cávado; **четверговый рынок** — повод выбрать день. **Peneda-Gerês** — единственный национальный парк PT: горы, реки, водопады, деревни Soajo и Lindoso; Cascata do Alado и «Tahiti» популярны, доступ зависит от погоды. Сравнение городов для жизни — [Porto vs Braga](/notes/" +
        PORTO_VS_BRAGA_FAMILY_SCHOOLS_SLUG +
        "). Вино Douro/Vinho Verde — [винный гайд](/notes/" +
        WINES_WINERIES_NORTE_SLUG +
        "). Логистика 1–2 дней — [внутренний туризм](/notes/" +
        DOMESTIC_TOURISM_NORTE_SLUG +
        ").",
      "Главное: Minho закрывает субботу из Porto; Gerês просит ночь, не «водопад после Braga к ужину в Foz».",
    ],
    table: trio(
      "Исторический Minho, памятники происхождения, ремёсла, горы",
      "Средневековые центры, церкви, рынок, хайк, водопады",
      "Porto, Viana do Castelo, долина Lima, длинный северный road trip"
    ),
    bullets: [
      "Guimarães: центр важнее, чем только фото замка.",
      "Braga: Bom Jesus — отдельный подъём, не «ещё одна церковь в Baixa».",
      "Barcelos планируйте на четверг, если нужен рынок.",
      "Gerês — два дня и проверка доступа к cascatas.",
      "Не смешивайте Gerês с «быстрым Minho» в одну субботу.",
    ],
  },
  {
    heading: "Douro и Vila Nova de Foz Côa",
    section_kind: "practice",
    paragraphs: [
      "**Vila Nova de Foz Côa** — Douro Superior: суше и дальше, чем нижняя долина у Porto. Ядро — Parque Arqueológico do Vale do Côa и музей (открытое палеолитическое искусство). База для виноградников и смотровых. **Linha do Douro Porto → Pocinho**: для любителей железной дороги — один из самых красивых длинных маршрутов PT; река и террасы особенно после Régua/Pinhão. Scenic train **не заходит** в сам Foz Côa: конечная **Pocinho**, дальше ~**7 км** по дороге. Сидите у реки, где возможно; расписание — cp.pt. Винодельни — [гайд по quinta](/notes/" +
        WINES_WINERIES_NORTE_SLUG +
        ").",
      "Главное: поезд — до Pocinho; Foz Côa — последняя дорога, иначе останетесь на перроне без скал Côa.",
    ],
    table: trio(
      "Верхний Douro, великий train ride, наскальное искусство",
      "Scenic rail, вино, археология, медленный восток",
      "Régua, Pinhão, Pocinho, Trás-os-Montes"
    ),
    bullets: [
      "Купите Linha do Douro как цель дня, не «доедем как электричка».",
      "Закладывайте трансфер Pocinho → Foz Côa (~7 км).",
      "Музей Côa и полевые выезды бронируйте отдельно от поезда.",
      "Не путайте нижний Douro у Porto с Douro Superior.",
    ],
  },
  {
    heading: "Trás-os-Montes: «за горами»",
    section_kind: "practice",
    paragraphs: [
      "Trás-os-Montes — историко-культурный край, не одна административная единица. Два главных города — **Vila Real** и **Bragança**; «столица края» для Vila Real — привычное сокращение, лучше держать два центра. Vila Real — ворота между Douro и северо-востоком, рядом **Mateus**. Bragança — цитадель и каменный центр. **Mirandela** связана с **alheira**. **Miranda do Douro** — обрыв над Дуэро, граница с Испанией; **мирандский** признан языком Португалии в регионе. **Macedo de Cavaleiros** и **Caretos de Podence** (Entrudo Chocalheiro, карнавал): маски и бубенцы, живая традиция, часто с доримскими корнями в описаниях, но это не отдельный культ. Рядом водохранилище Azibo.",
      "Главное: это road trip на северо-восток, не пригород Porto; еда и карнавал — повод выбрать неделю, не «заедем с Douro за час».",
    ],
    table: trio(
      "Дальний северо-восток: жёстче, традиционнее, меньше туристического шума",
      "Road trip, исторические города, еда, зима, локальные традиции",
      "Douro Superior, испанская граница, север PT"
    ),
    bullets: [
      "Не называйте Vila Real единственной «столицей» края — держите Bragança.",
      "Alheira в Mirandela — региональный стол, не «любая колбаса с рынка».",
      "Miranda do Douro — язык и каньон, не только смотровая.",
      "Caretos — даты Entrudo; не путайте с летним фестом Minho.",
      "Зимой в горах другой климат, чем на Foz.",
    ],
  },
  {
    heading: "Alentejo: Évora, мрамор, крепости, Marvão",
    section_kind: "practice",
    paragraphs: [
      "Регион лучше как **road trip**, не набор разрозненных day trip из Porto. **Évora** — UNESCO: римский храм, собор, **Capela dos Ossos**, еда и вино. **Estremoz** — белый мрамор, замок, субботний рынок, глиняные фигурки. **Vila Viçosa** — дом Браганса, Paço Ducal, кареты; тоже мраморный край. **Elvas** — звёздные укрепления у Испании, акведук Amoreira, UNESCO. **Monsaraz** — деревня над Alqueva, тёмное небо. **Marvão** — крепость в Serra de São Mamede у испанской границы.",
      "Главное: из Porto это 3+ дня; не «Évora в воскресенье и домой к ужину в Matosinhos».",
    ],
    table: trio(
      "Равнины Alentejo, Рим и короли, мрамор, холмы-крепости",
      "Машина, архитектура, вино, замки, звёзды, медленный юг",
      "Mérida (ES), Alqueva, Portalegre, длинный южный маршрут"
    ),
    bullets: [
      "Évora — якорь; остальное — кольцо на машине.",
      "Estremoz имеет смысл в субботу из‑за рынка.",
      "Elvas — фортификация, не «ещё одна белая деревня».",
      "Monsaraz вечером — тёмное небо Alqueva, не только закат Instagram.",
      "Marvão — высота и вид, закладывайте крутые подъезды.",
    ],
  },
  {
    heading: "Madeira: Funchal, Santa María, Новый год, bolo de mel",
    section_kind: "practice",
    paragraphs: [
      "Madeira — **отдельное направление**, не «ещё один район PT». В заметках акцент на Funchal: реплика **Santa María de Colombo** (морская прогулка, удобно с детьми); **Новый год** — фейерверк над бухтой, с воды нужно бронировать круиз заранее; **bolo de mel de cana** на месте, к мадере или ликёру. Перелёт и 4–5 дней — в [внутреннем туризме](/notes/" +
        DOMESTIC_TOURISM_NORTE_SLUG +
        "), не в воскресном ритме Campanhã.",
      "Главное: остров требует слота и билета; не смешивайте с weekend Minho.",
    ],
    bullets: [
      "Бронируйте NYE-круиз в Funchal задолго, если фейерверк — цель поездки.",
      "Santa María — смотрите расписание прогулок, не «всегда у причала».",
      "Bolo de mel de cana пробуйте на острове, не только сувенир в LIS.",
      "4–5 дней minimum, как в гайде выходных Norte.",
    ],
  },
  {
    heading: "Официальные сайты и планирование",
    section_kind: "official",
    paragraphs: [
      "Национальный вход — **Visit Portugal**. **Turismo de Portugal** — скорее ведомство, чем витрина. Centro: turismocentro.pt. Сланцевые деревни: aldeiasdoxisto.pt. Foz Côa: explore.cm-fozcoa.pt и муниципалитет. Setúbal/Arrábida: visitsetubal.com. Термы: termasdeportugal.pt, Termas de Luso. Cork/фермы: Portugal Farm Experience. Речные пляжи Setúbal — каталоги вроде Praia Fluvial (проверяйте сезон). Независимые подборки городов (Viagens e Caminhos, VagaMundos) — идеи, не касса и не льготы residente.",
      "**Acesso 52:** residentes в PT с NIF — до 52 бесплатных дней в год в объектах MMP (список и регистрация на кассе: документ + NIF). Режим менялся и обсуждался на уровне ЕС — перед поездкой откройте museusemonumentos.pt. Не путать с «все музеи страны бесплатны всегда». Подробнее льготы — [гайд](/notes/" +
        LGOTY_SLUG +
        ").",
      "Главное: Visit Portugal + сайт объекта + Acesso 52 на кассе; независимые блоги не заменяют слот и льготу.",
    ],
    bullets: [
      "visitportugal.com — старт по стране.",
      "parquesdesintra.pt — Sintra/Queluz.",
      "cp.pt — Linha do Douro и Intercidades.",
      "museusemonumentos.pt — Acesso 52 и билеты MMP.",
      "icnf.pt — национальный парк и правила троп.",
    ],
  },
  {
    heading: "Где расходится «сайт / гид / касса»",
    section_kind: "gap",
    paragraphs: [
      "Заметки честно говорят: даты событий и часы меняются. TripAdvisor в исходнике часто стоит рядом с official — для Emigro secondary: сначала оператор памятника, потом отзывы. «Вторая коллекция меди в мире», «Байрон всегда пил здесь», смешанные отзывы Plataforma — это характер стопа, не факт для карточки. Acesso 52 не покрывает все частные дворцы и не гарантирован на любой день без регистрации. Паром Tróia и лодка Almourol зависят от сезона. Поезд в Foz Côa «до города» — частая ошибка чтения карты.",
      "Главное: расхождение почти всегда в часах, льготах и последней миле транспорта, не в «существует ли дворец».",
    ],
    bullets: [
      "На сайте Visit Portugal и у оператора дворец «открыт». На деле слот закончился или объект выпал из списка MMP на этот день.",
      "В чатах пишут «scenic train на Foz Côa». На сайте CP конечная — Pocinho, дальше ~7 км по дороге.",
      "На портале MMP — Acesso 52. На деле только участвующие объекты, NIF на кассе и счётчик дней, не «все музеи страны».",
      "В отзывах «обязательный обед в Casa do Alentejo». На деле интерьер можно посмотреть без полного стола.",
      "Гиды пишут «вторая коллекция меди в мире». На деле это superlative без источника — смотрите кухни Palácio da Vila как есть.",
    ],
  },
  {
    heading: "Типичные ошибки релоканта с этой картой",
    section_kind: "practice",
    paragraphs: [
      "Сжать Lisbon+Sintra+Arrábida в один день из Porto. Ехать в Gerês «после Braga к ночи». Строить Foz Côa без Pocinho. Ловить Golegã без ноябрьских дат. Путать туристический билет Sintra с Acesso 52. Верить часам TripAdvisor. Вести себя в parque natural как на городском пляже Porto. В исходных заметках в конце ещё лежат job boards Net-Empregos и Expresso Emprego — это архив ссылок автора, не подбор работы Emigro; роли под CV — [Role Radar](" +
        ROLE_RADAR_LANDING_PATH +
        ").",
      "Главное: один кластер на выезд; официальный сайт в день выезда; северные парки — не декорация к Instagram.",
    ],
    bullets: [
      "Не ставьте Sintra и Arrábida в одну субботу из Campanhã.",
      "Не едьте в Gerês без ночёвки, если цель — водопады, не фото с трассы.",
      "Не планируйте «поезд до Foz Côa» без пересадки на дорогу.",
      "Не путайте Acesso 52 с бесплатным воскресеньем «как раньше».",
      "Не бронируйте Golegã «когда-нибудь осенью» без 6–15 ноября.",
    ],
  },
];

const keyTakeaways = [
  "Официально: Visit Portugal, сайты операторов (Parques de Sintra, MMP/Acesso 52, CP, ICNF) — касса и часы; льготы residente не равны туристическому билету.",
  formatPracticeTakeaway({
    claim:
      "атлас закрывает кластеры всей страны: Lisbon/Sintra, Arrábida, Golegã, Tomar, Centro, Silver Coast, Minho/Gerês, Douro Superior, Trás-os-Montes, Alentejo, Madeira",
    forReader:
      "из Porto на 1–2 дня сначала берите [выходные Norte](/notes/" +
      DOMESTIC_TOURISM_NORTE_SLUG +
      "), а этот текст — когда нужны 2–5 дней и «куда ещё»",
  }),
  "Golegã 2026: 6–15 ноября (VisitPortugal). Поезд Douro scenic — до Pocinho, не до Foz Côa.",
  "Расхождение: TripAdvisor и легенды (медь, Байрон, «бесплатный cheirinho») не заменяют слот и NIF на кассе Acesso 52.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Это вместо гайда «выходные из Porto»?",
    a: "Нет. [Внутренний туризм Norte](/notes/" +
      DOMESTIC_TOURISM_NORTE_SLUG +
      ") — суббота–воскресенье в радиусе работы. Этот атлас — полная карта регионов из личных notes: Лиссабон, Ribatejo, Alentejo, Madeira. Читайте оба.",
  },
  {
    q: "Как работает Acesso 52?",
    a: "До 52 дней в год по правилам MMP для residentes с NIF в участвующих музеях и дворцах, регистрация на кассе. На практике список не равен «все музеи страны» — сверяйте museusemonumentos.pt. Подробнее — [льготы с ВНЖ](/notes/" +
      LGOTY_SLUG +
      ").",
  },
  {
    q: "Когда Feira do Cavalo в Golegã в 2026?",
    a: "По правилам календаря VisitPortugal на 2026: **6–15 ноября**. На практике жильё в самой Golegã разбирают рано — сверьте feiranacionaldocavalo.com до брони.",
  },
  {
    q: "Поезд по Douro идёт в Vila Nova de Foz Côa?",
    a: "Linha do Douro идёт до **Pocinho**. До Foz Côa ещё около 7 км по дороге. Иначе останетесь на конечной без парка Côa.",
  },
  {
    q: "Стоит ли Sintra за один день с детьми?",
    a: "Одна–две точки плюс тихий стоп (Capuchos/Monserrate) лучше, чем Pena+Regaleira+центр без обеда. Oceanário и planetarium — лиссабонские семейные стопы из тех же notes.",
  },
  {
    q: "Это вакансии в конце PDF?",
    a: "Нет, архив ссылок автора (Net-Empregos, Expresso Emprego). Подбор ролей — [Role Radar](" +
      ROLE_RADAR_LANDING_PATH +
      "), не этот гайд.",
  },
];

export const PORTUGAL_DESTINATION_TIPS_GUIDE = {
  slug: PORTUGAL_DESTINATION_TIPS_SLUG,
  category: "Досуг",
  content_kind: "guide" as ContentKind,
  title: "Куда поехать в Португалии: регионы, еда, петли — атлас 2026",
  excerpt:
    "Полный travel atlas: Lisbon и Sintra, Arrábida, Golegã, Tomar, Centro, Silver Coast, Minho и Gerês, Douro Superior, Trás-os-Montes, Alentejo, Madeira — плюс кофе, Acesso 52 и официальные ссылки. Для тех, кто уже живёт в Norte, не для трёхдневного трансфера через LIS.",
  seo_title: "Куда поехать в Португалии 2026 из Porto",
  seo_description:
    "Куда поехать в Португалии 2026 из Porto: Lisbon, Sintra, Arrábida, Golegã 6–15 ноя, Douro, Alentejo, Madeira. Acesso 52 и Visit Portugal — не тур через LIS.",
  quick_answer:
    "Если вы уже в Porto, субботу закрывают Minho, Douro и Gerês. Этот атлас — когда нужны остальные кластеры страны: дворцы Lisbon/Sintra, бухты Arrábida, кони Golegã 6–15 ноября 2026, тамплиеры Tomar, UNESCO западного Centro, Côa после поезда до Pocinho, Alentejo и Madeira. Часы и Acesso 52 — на официальных сайтах; легенды гидов не билет.",
  city: "porto",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "Visit Portugal", url: "https://www.visitportugal.com/" },
    { title: "VisitPortugal — Feira Nacional do Cavalo", url: "https://www.visitportugal.com/pt-pt/content/feira-nacional-do-cavalo" },
    { title: "Feira Nacional do Cavalo", url: "https://feiranacionaldocavalo.com/" },
    { title: "Parques de Sintra", url: "https://www.parquesdesintra.pt/" },
    { title: "Museus e Monumentos — bilhetes / Acesso 52", url: "https://www.museusemonumentos.pt/pt/pagina/bilhetes" },
    { title: "gov.pt — museus 52 dias", url: "https://www2.gov.pt/pt/noticias/museus-monumentos-e-palacios-com-entrada-gratis-52-dias-por-ano" },
    { title: "CP — Comboios de Portugal", url: "https://www.cp.pt/" },
    { title: "ICNF", url: "https://www.icnf.pt/" },
    { title: "Aldeias do Xisto", url: "https://aldeiasdoxisto.pt/" },
    { title: "Visit Setúbal", url: "https://www.visitsetubal.com/" },
    { title: "Turismo de Portugal", url: "https://www.turismodeportugal.pt/" },
  ],
  topic_tags: ["turismo", "portugal"],
  hashtags: buildNoteHashtags({
    topicTags: ["turismo", "portugal"],
    contentKind: "guide",
    extra: ["porto", "norte", "lisboa", "douro", "sintra", "alentejo", "madeira", "выходные"],
  }),
  source_channel: null,
  source_label: "user-pdf:portugal-destination-tips-aug-2026+emigro-factcheck",
};
