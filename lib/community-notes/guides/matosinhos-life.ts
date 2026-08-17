/**
 * Matosinhos município deep guide; anti-cliché Remarque voice.
 * Visual canon: Emigro atlas icons + map vignettes (inline/matosinhos).
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { formatPracticeTakeaway } from "@/lib/community-notes/practice-format";
import { GASTRONOMY_NORTE_SLUG } from "@/lib/community-notes/guides/gastronomy-norte-portugal";
import { INTERNATIONAL_SCHOOLS_GUIDE_SLUG } from "@/lib/community-notes/guides/international-schools-portugal";
import { NORTE_CLIMATE_COMFORT_SLUG } from "@/lib/community-notes/guides/norte-climate-comfort";
import { PORTO_BRAGA_LONG_TERM_RENT_SLUG } from "@/lib/community-notes/guides/porto-braga-long-term-rent";
import { PORTO_DISTRICTS_GUIDE_SLUG } from "@/lib/community-notes/guides/porto-districts-life";
import type {
  CommunityNoteFaq,
  ContentKind,
  GlossaryTerm,
  NoteBodyImage,
  NoteBodySection,
} from "@/lib/community-notes/types";

export const MATOSINHOS_LIFE_SLUG = "matosinhos-zhizn-arenda-plyazh-leca-2026";

/** Avoid circular import with porto-newbuild-clusters-2026. */
const PORTO_NEWBUILD_CLUSTERS_SLUG = "porto-novostrojki-klastery-community-2026";

const IMG = "/images/community-notes/inline/matosinhos";
const CANON = "Emigro · Matosinhos atlas canon";

function zoneVisuals(id: string, place: string, symbolCaption: string): NoteBodyImage[] {
  return [
    {
      src: `${IMG}/${id}-map.webp`,
      alt: `${place} на карте município Matosinhos`,
      caption: `${place} на карте município`,
      credit: CANON,
      fit: "cover",
    },
    {
      src: `${IMG}/${id}-symbol.webp`,
      alt: `${place} — символ зоны`,
      caption: symbolCaption,
      credit: CANON,
      fit: "contain",
    },
  ];
}

const GLOSSARY_INTRO =
  "Слова с конверта Câmara и с фильтра Idealista — чтобы município, Leça и Leixões не слились в одно «Порту у пляжа», пока вы ещё выбираете morada.";

const DISCLAIMER =
  "**Emigro / fact-check (авг. 2026):** Matosinhos — отдельный município в агломерации Porto, не freguesia и не «район» Câmara do Porto. Портал — [cm-matosinhos.pt](https://www.cm-matosinhos.pt/). Аренда — ориентиры рынка, не каталог объявлений; расписание метро и сезон бассейна сверяйте на сайтах операторов. Не юридическая консультация. Связанные гайды: [районы Porto](/notes/" +
  PORTO_DISTRICTS_GUIDE_SLUG +
  "), [аренда](/notes/" +
  PORTO_BRAGA_LONG_TERM_RENT_SLUG +
  "), [новостройки-кластеры](/notes/" +
  PORTO_NEWBUILD_CLUSTERS_SLUG +
  "), [климат Norte](/notes/" +
  NORTE_CLIMATE_COMFORT_SLUG +
  ").";

const LOCAL_GLOSSARY: GlossaryTerm[] = [
  { pt: "município", ru: "муниципалитет со своей Câmara; Matosinhos ≠ район Porto" },
  { pt: "Leça", context: "Leça da Palmeira", ru: "прибрежная часть município у маяка и Piscina das Marés" },
  { pt: "Leixões", ru: "торговый порт конца XIX века; не гавань эпохи Discoveries" },
  { pt: "marisqueira", ru: "заведение морепродуктов; в Matosinhos смотрите витрину, не вывеску" },
  { pt: "Metro", context: "Metro do Porto", ru: "линия A и узел Senhora da Hora; в центр Porto ориентир ~20 мин" },
  { pt: "T2", ru: "квартира с двумя спальнями; ориентир аренды здесь €900–1 200/мес" },
  { pt: "humidade", ru: "влажность; у океана живёт в стенах круглый год, не только зимой" },
  { pt: "Câmara", context: "Câmara Municipal de Matosinhos", ru: "городская управа município; cm-matosinhos.pt" },
];

const glossaryTerms = glossaryForSlug(MATOSINHOS_LIFE_SLUG) ?? LOCAL_GLOSSARY;

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(glossaryTerms, GLOSSARY_INTRO),
    paragraphs: [GLOSSARY_INTRO, DISCLAIMER],
  },
  {
    heading: "Официально: Matosinhos — município, не bairro Porto",
    section_kind: "official",
    paragraphs: [
      "На столбе у Avenida da República табличка не зовёт вас в Porto. Она пишет União das Freguesias de Matosinhos e Leça da Palmeira — и в этой строке уже другой юридический воздух: своя Câmara, свой IMI, свои правила praia и свои окна приёма. Вы искали «район у океана» и нашли муниципалитет. Разница выясняется не в споре, а когда письмо приходит на бланке cm-matosinhos.pt, а не cm-porto.pt.",
      "Matosinhos входит в Área Metropolitana do Porto и живёт рядом с городом так тесно, что карта в телефоне путает границы. Юридически это отдельный município. После реформы 2013 года имеет смысл держать в голове союзы freguesias, а не туристические ярлыки: Matosinhos e Leça da Palmeira — полоса у воды, порт и рынок; São Mamede de Infesta e Senhora da Hora — метро, nova construção, будни без соли на стекле; Perafita, Lavra e Santa Cruz do Bispo — севернее, ближе к аэропорту и к более тихому берегу; Custóias, Leça do Balio e Guifões — внутрь, дальше от прилива. Senhora da Hora в речи живёт отдельно, хотя на бумаге она в союзе с São Mamede.",
      "Porto de Leixões — не сцена Discoveries и не «старая гавань принцев». Это коммерческий порт конца XIX века: работы с 1880-х, ввод в 1890-е, контейнеры и рыба сегодня, а не каравеллы. Кто путает его с Belém, ждёт романтики и получает дизель грузовиков на круге. Для быта это якорь município: работа, шум, рынок, ветер с мола. Подробная карта соседних freguesias Porto — в [гайде по районам](/notes/" +
        PORTO_DISTRICTS_GUIDE_SLUG +
        "); здесь важнее не сравнить «красивость», а не подписать contrato в чужом município по ошибке фильтра.",
      "Главное: Matosinhos — свой município в агломерации; Câmara — cm-matosinhos.pt; Leixões — торговый порт XIX века, не гавань Discoveries.",
    ],
    images: [
      {
        src: `${IMG}/matosinhos-overview.webp`,
        alt: "Обзорная карта союзов freguesias município Matosinhos",
        caption: "Четыре союза на одной карте — прежде чем фильтровать Idealista",
        credit: CANON,
        fit: "cover",
      },
    ],
    bullets: [
      "Откройте cm-matosinhos.pt до просмотра квартиры — это ваша Câmara, не Porto.",
      "Запомните союзы freguesias: Matosinhos e Leça; Senhora da Hora / São Mamede; Perafita–Lavra; Custóias–Leça do Balio–Guifões.",
      "Не ставьте фильтр Idealista на «Porto», если ищете Matosinhos — município другой.",
      "Отделите Leixões от «исторического порта»: это коммерция конца XIX века.",
    ],
  },
  {
    heading: "Союзы freguesias на карте",
    section_kind: "official",
    paragraphs: [
      "После 2013 года на бланке Câmara живут союзы, а не туристические ярлыки. Четыре пятна на карте — четыре разных утра: соль на ставне, ступени метро, тихий северный берег или холмы без прилива.",
      "Главное: выберите союз до просмотра — Brito Capelo и Custóias не спорят на одной неделе.",
    ],
    images: [
      ...zoneVisuals("matosinhos-leca", "Matosinhos e Leça", "Маяк и полоса у воды — якорь Matosinhos–Leça"),
      ...zoneVisuals("senhora-hora", "Senhora da Hora / São Mamede", "Метро и nova construção — якорь Senhora da Hora"),
      ...zoneVisuals("perafita-lavra", "Perafita–Lavra", "Дюны и тихий север — якорь Perafita–Lavra"),
      ...zoneVisuals("custoias", "Custóias–Guifões", "Вглубь от прилива — якорь Custóias–Leça do Balio–Guifões"),
    ],
    bullets: [
      "Matosinhos e Leça da Palmeira — praia, рынок, порт, humidade.",
      "São Mamede / Senhora da Hora — линия A, garagem, меньше соли на раме.",
      "Perafita, Lavra e Santa Cruz do Bispo — севернее, ближе к аэропорту и тихому берегу.",
      "Custóias, Leça do Balio e Guifões — внутрь município, дальше от прилива.",
    ],
  },
  {
    heading: "Жильё и аренда: ставня, полоса у воды, Senhora da Hora",
    section_kind: "practice",
    paragraphs: [
      "В ноябре за деревянной ставней на Brito Capelo пальцы находят холодную плёнку. Не протечку — humidade, которая здесь не сезон, а климат: соль и влага живут в штукатурке и летом, когда турист ещё верит в «сухое побережье». Вы отодвигаете шкаф до подписи contrato и смотрите угол, куда агент не светит лампой. Ориентир рынка 2026: T2 €900–1 200, T3 €1 500–2 400 в месяц — не каталог, а вилка, внутри которой полоса у пляжа и квартал у метро расходятся сильнее, чем кажется на карте. Про сырость, bolor и desumidificador — [климат Norte](/notes/" +
        NORTE_CLIMATE_COMFORT_SLUG +
        ").",
      "Senhora da Hora встречает иначе: пыль nova construção, подземный garagem, станция метро в пешей доступности. Здесь меньше соли на раме и чаще лифт, который не скрипит, как в старом prédio у praia. Полоса Matosinhos–Leça даёт океан в окне и ветер в щелях; внутри, к Custóias и São Mamede, тише и обычно проще с парковкой. Гараж в новостройке — не роскошь, а способ не кружить у рынка в субботу. Старое жильё у воды часто красивее на фото и честнее в счёте за электричество, если нет isolamento.",
      "За последние ~5 лет município добрал кластеры, которые семья ищет после CLIP и NorteShopping. **The Garden · Natura** (Jardins Efanor) сдан около 2024/25: сад ~30 000 м², рядом Colégio Efanor; **аренда T2 asking часто €1 500–1 750**. **Nautilus IV** в Matosinhos Sul у Parque da Cidade — сдача ~2025; по зоне novo/Sul T2 часто **€1 300–1 700**. Sobreiro у метро — ключи ориентир конец 2025; Lake и Menéres 777 ещё строят. Пины, прайсы продажи и карта — в [новостройках-кластерах](/notes/" +
        PORTO_NEWBUILD_CLUSTERS_SLUG +
        "). Не смешивайте эту аренду с общей вилкой €900–1 200: сданный condomínio fechado — другой чек.",
      "Contrato читайте до восторга от вида на мол. Morada в Matosinhos означает другую Câmara для licenças и части школьных catchment; IMI и condomínio не «как в Foz». Сравнивать с Foz по одной цифре T3 бессмысленно: там океан плюс OBS-премиум, здесь океан плюс município. Долгосрок, recibo, caução — в [гайде по аренде Porto/Braga](/notes/" +
        PORTO_BRAGA_LONG_TERM_RENT_SLUG +
        "). Без осмотра углов и вопроса про garagem цифра с Idealista остаётся чужой победой.",
      "Главное: вилка T2 €900–1 200 / T3 €1 500–2 400 для «обычного» рынка; в сданных nova construção (Natura, Nautilus) T2 чаще €1.3–1.75k; полоса у воды сырее; Senhora da Hora чаще даёт метро и garagem.",
    ],
    bullets: [
      "Ищите T2 €900–1 200 и T3 €1 500–2 400 как ориентир «среднего» Matosinhos 2026, не как прайс.",
      "В сданных кластерах смотрите отдельно: Natura ~€1 500–1 750 T2; Matosinhos Sul novo / Nautilus зона ~€1 300–1 700.",
      "Сравните полосу Matosinhos–Leça и Senhora da Hora: океан vs метро и nova construção.",
      "Проверьте garagem в новостройке; у praia в старом prédio часто только улица.",
      "Загляните за шкаф и к ставням на humidade до assinatura — см. климат Norte.",
      "Карта проектов — [новостройки-кластеры](/notes/" + PORTO_NEWBUILD_CLUSTERS_SLUG + "); фильтр Idealista — município Matosinhos, не Porto.",
    ],
  },
  {
    heading: "Commute: ступени метро, CLIP, OBS, дизель Leixões",
    section_kind: "practice",
    paragraphs: [
      "На станции Senhora da Hora ступени ещё мокрые после ночного дождя, и Andante пищит коротко, как чужая привычка, которую вы уже почти выучили. Линия A ведёт к Senhor de Matosinhos; узел Senhora da Hora собирает пересадки. До Trindade и центра Porto ориентир около двадцати минут, если состав не встал между станциями — метро здесь ближе к быту, чем к аттракциону. Кто живёт у Brito Capelo, спускается к Mercado или Câmara; кто у nova construção — чаще к Senhora da Hora. Расписание и зоны Andante — metrodoporto.pt, не скрин из переписки.",
      "У круга к Leixões в семь утра стоит запах солярки и мокрого асфальта: фуры, не романтика мола. Отсюда до CLIP на Rua de Vila Nova 1071 часто пять–двенадцать минут: Aldoar почти соседний, и это одна из причин, почему семьи смотрят Matosinhos всерьёз. До OBS на Rua da Cerca вдоль океана — восемь–пятнадцать; в пик у Castelo do Queijo и въезда в Foz тот же путь раздувается примерно до двадцати. Минуты — off-peak ориентир; меряйте конкретный адрес в тот час, когда вам ехать, а не в воскресенье в полдень.",
      "Школьный якорь важнее вида на контейнеры. Curriculum, fees и waiting list — в [гайде по международным школам](/notes/" +
        INTERNATIONAL_SCHOOLS_GUIDE_SLUG +
        "); связка район–кампус по всей агломерации — в [районах Porto](/notes/" +
        PORTO_DISTRICTS_GUIDE_SLUG +
        "). Matosinhos не «заменяет Foz для OBS», но и не «полчаса до школы», как пишут те, кто мерил маршрут один раз в августе. Без машины метро закрывает центр; без замера до ворот школы красивый T3 у praia остаётся красивым T3 у praia.",
      "Главное: метро в центр ~20 мин; CLIP ~5–12; OBS ~8–15 вдоль океана, в пик ~20 — меряйте адрес, не среднее по município.",
    ],
    bullets: [
      "Проедьте линию A / узел Senhora da Hora в свой рабочий час — metrodoporto.pt.",
      "Замерьте до CLIP: часто ~5–12 мин с запада Matosinhos / Senhora da Hora.",
      "Замерьте до OBS вдоль океана: ~8–15 мин, в пик до ~20.",
      "Не берите «двадцать минут до всего» из одного воскресного замера.",
    ],
  },
  {
    heading: "Море и спорт: мокрый песок, Siza, Quinta, вело",
    section_kind: "practice",
    paragraphs: [
      "После отлива доски настила ещё держат крупинки, и подошва узнаёт Matosinhos раньше глаз. Praia de Matosinhos широкая, рабочая, с ветром, который сбивает речь; Praia de Leça da Palmeira тише у маяка и ближе к тем, кто приехал не «на пляж Porto», а домой к воде. Зимой полоса не исчезает — она меняет характер: мокро, пусто, для бега и собаки, не для полотенца. Летом здесь тесно у кромки, и место на песке занимает тот, кто пришёл раньше, а не тот, кто лучше знает Instagram.",
      "Piscina das Marés в Leça — бетон Álvaro Siza Vieira, открытие 1966, Monumento Nacional с 2011. Бассейн врезан в скалу так, будто прилив согласился на архитектуру. Сезон обычно тёплые месяцы — в 2026 Câmara указывала ориентир июнь–сентябрь; день €5–10, часы и закрытия — на cm-matosinhos.pt и matosinhosport.pt, не в памяти прошлого августа. Рядом Quinta da Conceição: парк, тень платанов, муниципальный бассейн, тоже связанный с наследием Siza. Один океанский ритуал на выходные закрывает «спорт у воды» лучше трёх абонементов, которые вы не откроете.",
      "Серф здесь — не клубная легенда, а утро с мокрым костюмом в багажнике и школой волн у Matosinhos, когда зыбь позволяет. Велодорожка тянется к Foz и Castelo do Queijo: суббота на велосипеде короче, чем спор о том, «есть ли здесь жизнь». Parque da Cidade лежит на границе с Porto — 83 гектара, куда ходят и из Aldoar, и из Matosinhos, будто парк не признаёт município. Кто ищет только лето, ошибается в ноябре; кто ищет только лето в бассейне Siza, ошибается в октябре, когда ворота уже закрыты.",
      "Главное: пляжи Matosinhos и Leça — быт, не курорт; Piscina das Marés сезонная; Quinta и вело закрывают будни без второго зала.",
    ],
    bullets: [
      "Обойдите Praia de Matosinhos и Praia de Leça в будний день, не только в воскресенье июля.",
      "Сверьте сезон Piscina das Marés на cm-matosinhos.pt / matosinhosport.pt до поездки.",
      "Зайдите в Quinta da Conceição: парк и муниципальный бассейн рядом с бытом, не с туром.",
      "Проедьте вело к Foz; заложите Parque da Cidade как общую границу, не «парк Porto».",
    ],
  },
  {
    heading: "Еда: лёд на рынке, peixe, marisqueira",
    section_kind: "practice",
    paragraphs: [
      "Под навесом Mercado лёд хрустит в ящиках, и рыба лежит так близко, что холод поднимается к запястью, когда вы спрашиваете preço do dia. Это не голод туриста у реки и не очередь за francesinha: здесь выбирают глаз и жабры, а не фото витрины. Улица потом подхватывает то, что утро положило на лёд — grelhada, sardinha в сезон, dourada, когда она ещё блестит. Кто приходит к неону с английским меню у воды, платит за перевод; кто приходит к прилавку, платит за вес.",
      "Marisqueira в Matosinhos умеет быть честной и умеет быть дорогой без честности — разница на льду, не на скатерти. Заказывайте то, что видели сырым; спросите вес; не берите «меню на двоих» с креветкой, которая уже устала. Уличный grill — ритуал município, не обязательная программа для гостя из Baixa. Полная карта блюд Norte, домашний caldo verde и где бронь на tasting — в [гастрономии Norte](/notes/" +
        GASTRONOMY_NORTE_SLUG +
        "); этот текст не повторяет чужой голод у Ribeira. Здесь еда — продолжение порта: Leixões кормит прилавок, прилавок кормит вечер.",
      "Главное: сначала лёд и preço do dia, потом grill; marisqueira по витрине, не по языку меню.",
    ],
    bullets: [
      "Придите на Mercado утром будня — лёд и глаз рыбы честнее вечерней вывески.",
      "Спросите preço do dia и вес, прежде чем сесть в marisqueira.",
      "Оставьте francesinha и tasting гастрогайду Norte — здесь якорь peixe.",
      "Не путайте уличный grill município с туристическим меню у воды.",
    ],
  },
  {
    heading: "Ритм дня: кому сюда, кому мимо",
    section_kind: "practice",
    paragraphs: [
      "После обеда с рабочего стола у окна видны надстройки контейнеровоза — медленно, почти беззвучно за стёклами, пока наушники ещё держат чужой созвон. Remote, которому нужен океан без цены Foz, узнаёт Matosinhos в этом кадре: вода есть, метро есть, и никто не требует, чтобы вы жили «в правильном bairro». Семья у CLIP складывает день иначе: утро на Rua de Vila Nova, вечер у praia или в Quinta, суббота без моста в Gaia. Кто хочет услуги своего município — Junta, школы público, licenças на вывеску, бассейн Câmara — остаётся здесь не из экономии, а потому что бланк и адрес совпадают.",
      "Сюда плохо едет тот, кто ищет тишину старого Foz и готов платить за неё дважды, и тот, кто хочет Baixa пешком каждую ночь. Сюда плохо едет и тот, кто верит, что «всегда дешевле» — nova construção у метро уже спорит с ожиданиями 2019 года. Сюда хорошо едет тот, кто держит школу, влажность и линию метро в одной голове. Агломерация даёт работу в Porto и сон у воды; município даёт Câmara, которая отвечает на письмо. Если вам нужна только Ribeira по субботам, достаточно гостя; если нужна morada — читайте дальше про фильтр и углы.",
      "Главное: CLIP-семьи, remote у океана без Foz-ценника, люди с делами в Câmara Matosinhos — да; охотники за ночной Baixa и «вечной скидкой» — чаще мимо.",
    ],
    bullets: [
      "Сверьте день: CLIP ~5–12 мин vs желание жить у praia — оба сценария здесь живут.",
      "Закладывайте remote у воды, если Foz T3 не входит в бюджет.",
      "Идите в Câmara Matosinhos, если licenças и público привязаны к этому município.",
      "Не выбирайте Matosinhos ради ночной Baixa — метро есть, пешая ночь нет.",
    ],
  },
  {
    heading: "Как выбрать адрес: фильтр município, линия, школа, сырость",
    section_kind: "action_guide",
    paragraphs: [
      "На Idealista выпадающий список município легко оставить на Porto — и тогда вы неделю смотрите чужие стены. Поставьте Matosinhos. Затем линия метро: пешком до Senhora da Hora, Mercado, Brito Capelo или Câmara важнее «вида на воду» в объявлении, где фото снято с дрона. Третье — школа: если CLIP или OBS уже в плане, замерьте утро в тот же день, что и просмотр, тем же маршрутом. Четвёртое — рука за шкаф и к раме окна: humidade не спорит, она просто есть.",
      "Ключ в замке старого T2 у praia поворачивается туго, будто дерево набрало море. В новостройке Senhora da Hora ключ ходит легко, и вы сразу ищете, где блок AC и где место в garagem. Оба адреса могут быть правильными — если вы знаете, за что платите. Запишите condomínio, этаж, exposição, наличие extracção в WC. Сфотографируйте углы до assinatura. Потом откройте cm-matosinhos.pt и убедитесь, что Junta вашей freguesia — та, куда вы реально дойдёте с бумагой.",
      "Кольцо осмотра за полдня: станция → объявление → praia или Quinta → замер до CLIP или OBS → рынок на лёд, чтобы понять шум и вечер. Не смотрите четыре T3 в разных союзах freguesias за час: Perafita и Brito Capelo — разные жизни. Contratos и платежи — [долгосрок](/notes/" +
        PORTO_BRAGA_LONG_TERM_RENT_SLUG +
        "); карта соседних районов Porto — [районы](/notes/" +
        PORTO_DISTRICTS_GUIDE_SLUG +
        ").",
      "Главное: фильтр município → метро → школа → углы на humidade → фото до подписи; не четыре союза freguesias за один час.",
    ],
    bullets: [
      "Поставьте Idealista на município Matosinhos, не Porto.",
      "Выберите якорь метро (Senhora da Hora / Mercado / Brito Capelo / Câmara) до просмотра.",
      "Замерьте утро до CLIP или OBS в тот же день, что и visita.",
      "Проверьте углы, ставню, extracção и garagem; сфотографируйте до contrato.",
      "Откройте Junta своей freguesia на cm-matosinhos.pt.",
    ],
  },
  {
    heading: "Где переписка и Câmara расходятся",
    section_kind: "gap",
    paragraphs: [
      "В пересланном сообщении три строки: «район Порту», «всегда дешевле Foz», «пляж всегда открыт». На бланке Câmara — герб Matosinhos и часы приёма. Расхождение не в злобе чата, а в масштабе: люди описывают свой год, а вы читаете это как закон município. Пляж зимой открыт ветру и закрыт для того лета, которое вы себе нарисовали; Piscina das Marés вообще живёт сезоном. «Дешевле Foz» бывает и не бывает — у воды в новом prédio цифра уже спорит с мифом.",
      "Главное: Matosinhos не район Porto; дешевле Foz — не правило; praia и Piscina das Marés — разные режимы года.",
    ],
    bullets: [
      "«Район Порту» → отдельный município, Câmara на cm-matosinhos.pt.",
      "«Всегда дешевле Foz» → вилка T2/T3 ориентир; nova construção и полоса у воды часто близки к Foz-ожиданиям.",
      "«Пляж всегда открыт» → полоса доступна, купальный сезон и бассейн Siza — нет.",
      "«Двадцать минут до всего» → метро в центр ~20; CLIP и OBS меряйте адресом.",
      "«Leixões — исторический порт Discoveries» → коммерческий порт конца XIX века.",
    ],
  },
  {
    heading: "Типичные ошибки",
    section_kind: "practice",
    paragraphs: [
      "Contrato уже лежит на столе, а вы только потом замечаете, что фильтр был Porto, адрес — Custóias, а школа — OBS в час, когда вдоль океана стоит ряд фар. Ошибки Matosinhos редко драматичны в первый день: они проступают к первому счёту, к первой плесени за шкафом, к первой субботе, когда парковки у рынка нет. Кто снимает «как в Foz, только выгоднее», не заложив humidade и condomínio, спорит потом не с океаном, а с senhorio.",
      "Главное: не подписывайте, пока município, метро, школа и углы не сошлись в одном адресе.",
    ],
    bullets: [
      "Не оставляйте Idealista на Porto, ища Matosinhos.",
      "Не берите старый T2 у praia без осмотра углов и вопроса про isolamento.",
      "Не считайте CLIP и OBS «рядом», не замерив пик.",
      "Не планируйте год на Piscina das Marés так, будто она открыта в январе.",
      "Не путайте услуги Câmara Matosinhos с кабинетами Porto.",
    ],
  },
];

const keyTakeaways = [
  "Официально: Matosinhos — município в Área Metropolitana do Porto со своей Câmara (cm-matosinhos.pt); Leixões — торговый порт конца XIX века, не гавань Discoveries; freguesias после 2013 — союзы, Senhora da Hora в речи живёт отдельно.",
  formatPracticeTakeaway({
    channels: ["por_tugal"],
    period: "2026",
    claim:
      "ориентир аренды T2 €900–1 200 и T3 €1 500–2 400 для «среднего» рынка; в сданных nova construção (Natura ~€1 500–1 750, Matosinhos Sul novo ~€1 300–1 700) чек выше; Senhora da Hora — метро и garagem, полоса Matosinhos–Leça — океан и humidade",
    forReader: "фильтр Idealista на município Matosinhos; сданные кластеры — в гайде новостроек",
  }),
  formatPracticeTakeaway({
    channels: ["por_tugal"],
    period: "2026",
    claim:
      "метро в центр Porto около 20 минут, до CLIP часто 5–12, до OBS 8–15 вдоль океана и до ~20 в пик",
    forReader: "меряйте конкретный адрес в свой час, не среднее по карте",
  }),
  "Расхождение: «район Порту», «всегда дешевле Foz» и «пляж всегда открыт» не держатся на бланке Câmara — município другой, цены плавают, Piscina das Marés сезонная.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Matosinhos — это район Порту?",
    a: "Нет. Это отдельный município в агломерации Porto со своей Câmara (cm-matosinhos.pt). Метро и быт связаны с городом; налоги, Junta и часть услуг — нет. В речи «Grande Porto» путает границу; в contrato граница важна.",
  },
  {
    q: "Сколько стоит аренда в 2026?",
    a: "Ориентир «среднего» рынка: T2 €900–1 200, T3 €1 500–2 400 в месяц. В сданных новостройках выше: Natura (The Garden) T2 часто €1 500–1 750; зона Matosinhos Sul / Nautilus novo — около €1 300–1 700. Сверяйте Idealista на дату и condomínio отдельно. Кластеры и карта — в гайде новостроек; долгосрок — в гайде по аренде Porto/Braga.",
  },
  {
    q: "Как добираться до центра Porto, CLIP и OBS?",
    a: "Metro do Porto: ориентир ~20 минут до центра (линия A / узел Senhora da Hora). CLIP — часто 5–12 минут на машине. OBS — 8–15 вдоль океана, в пик около 20. Меряйте адрес. Школы — в гайде по международным школам; районы — в гайде по Porto.",
  },
  {
    q: "Чем Leça отличается от Senhora da Hora?",
    a: "Leça da Palmeira — берег, маяк, Piscina das Marés, выше humidade. Senhora da Hora — метро, новостройки, garagem, дальше от соли на раме. На бумаге Senhora da Hora в союзе с São Mamede de Infesta; в поиске жилья их всё равно разделяют.",
  },
  {
    q: "Piscina das Marés открыта круглый год?",
    a: "Нет. Это сезонный океанский бассейн Siza Vieira (с 1966; Monumento Nacional с 2011). Ориентир тёплых месяцев, в 2026 Câmara указывала июнь–сентябрь. Часы и тариф — cm-matosinhos.pt и matosinhosport.pt. Зимой остаются praia, вело и Quinta da Conceição.",
  },
  {
    q: "Куда смотреть дальше по еде, климату и школам?",
    a: "Peixe и marisqueira — гастрономия Norte. Сырость и bolor — климат Norte. CLIP/OBS — международные школы и районы Porto. Contratos — аренда Porto/Braga.",
  },
];

export const MATOSINHOS_LIFE_GUIDE = {
  slug: MATOSINHOS_LIFE_SLUG,
  category: "Быт",
  content_kind: "guide" as ContentKind,
  city: "porto",
  title: "Жизнь в Matosinhos 2026: município, аренда, Leça, метро и океан",
  excerpt:
    "Matosinhos — не район Porto, а свой município: T2 €900–1 200, метро ~20 мин, CLIP и OBS рядом, Leça, Leixões, Piscina das Marés и humidade у ставень — карта быта без чужого ярлыка «bairro».",
  seo_title: "Matosinhos 2026 — жизнь, аренда, Leça, метро",
  seo_description:
    "Matosinhos município 2026: не район Porto. Аренда T2 €900–1200, метро ~20 мин, CLIP/OBS рядом, Leça, Leixões, Piscina das Marés, humidade. cm-matosinhos.pt.",
  quick_answer:
    "Туман с Атлантики ложится на мол Leça раньше, чем на крыши Foz. Вы стоите у мокрого парапета, и GPS всё ещё пишет Porto, а конверт в руке — Câmara Municipal de Matosinhos (cm-matosinhos.pt): другой município, свои freguesias, Porto de Leixões конца XIX века — не гавань Discoveries. T2 часто €900–1 200, T3 €1 500–2 400; метро в центр ~20 мин, до CLIP 5–12; кто искал «район Порту у пляжа», через месяц учит humidade у ставень и фильтр Idealista на Matosinhos.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "Câmara Municipal de Matosinhos", url: "https://www.cm-matosinhos.pt/" },
    { title: "Metro do Porto", url: "https://www.metrodoporto.pt/" },
    { title: "Visit Porto", url: "https://visitporto.travel/" },
    { title: "Visit Porto & Norte", url: "https://www.visitportoandnorth.travel/" },
    {
      title: "Piscina das Marés — CM Matosinhos",
      url: "https://www.cm-matosinhos.pt/conhecer/lazer/piscina-das-mares",
    },
    { title: "Idealista — arrendar Matosinhos", url: "https://www.idealista.pt/arrendar-casas/matosinhos/" },
  ],
  topic_tags: ["arenda", "portugal", "norte", "porto", "byt"],
  hashtags: buildNoteHashtags({
    topicTags: ["arenda", "portugal", "norte"],
    contentKind: "guide",
    extra: ["porto", "matosinhos", "leca", "leixoes", "metro", "быт"],
  }),
  source_channel: "editorial+official",
  source_label: "editorial:matosinhos-life-grok-remarque-2026",
};
