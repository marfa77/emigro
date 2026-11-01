/**
 * Day trips and longer routes from Porto — published from the editorial draft.
 * Weekday of Feira de Espinho corrected to Monday (Turismo de Espinho); the rest is the draft.
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import type { CommunityNoteFaq, ContentKind, NoteBodyImage, NoteBodySection } from "@/lib/community-notes/types";

export const PORTUGAL_DESTINATION_TIPS_SLUG = "portugal-destination-tips-regiony-2026";

function shot(
  file: string,
  alt: string,
  caption: string,
  credit: string,
  creditUrl: string,
): NoteBodyImage {
  return {
    src: `/images/community-notes/${file}`,
    alt,
    caption,
    credit,
    creditUrl,
    fit: "cover",
  };
}

const bodySections: NoteBodySection[] = [
  {
    heading: "Порту — отличная база для путешествий по Португалии",
    paragraphs: [
      "Порту — отличная база для путешествий по Португалии. За час можно оказаться в средневековом городе, за полтора — среди виноградников долины Дору, а за два — в горах национального парка Peneda-Gerês. Если есть машина и свободные выходные, выбор становится ещё интереснее.",
      "Мы собрали маршруты, которые действительно хочется проехать: рыбацкие города, старинные мосты, дворцы, винодельни, горные деревни, океанские пляжи и места, где туристов заметно меньше, чем в центре Порту.",
      "Это не рейтинг достопримечательностей и не список из сотни точек на карте. Это путеводитель для тех, кто живёт в Порту или приехал сюда надолго и хочет постепенно открыть для себя страну.",
      "Для каждого маршрута мы указали, сколько времени закладывать, нужен ли автомобиль, что посмотреть, где остановиться и какие точки добавить в Google Maps.",
    ],
  },
  {
    heading: "Сначала выберите направление",
    table: {
      columns: ["Если у вас есть", "Куда ехать"],
      rows: [
        ["Полдня", "Vila do Conde, Espinho, Afurada"],
        ["Один день", "Braga, Guimarães, Aveiro, Amarante"],
        ["Полный день на природе", "Arouca, Gerês"],
        ["Выходные", "Douro, Viana do Castelo, Minho"],
        ["2–3 дня", "Serra da Estrela, Coimbra, Trás-os-Montes"],
        ["3–5 дней", "Silver Coast, Tomar, Alentejo"],
        ["Неделя", "Lisbon, Sintra и южное побережье"],
        ["Отдельный отпуск", "Madeira"],
      ],
    },
    bullets: [
      "Маленькое правило: не пытайтесь посмотреть всю Португалию за один уикенд. Здесь гораздо интереснее ехать медленно, останавливаться в небольших городах и обедать там, где меню написано от руки.",
    ],
  },
  {
    heading: "Vila do Conde и Póvoa de Varzim — океан, старые улочки и рыбацкий север",
    paragraphs: [
      "Если хочется просто сесть в машину или метро и провести несколько часов у океана, отправляйтесь на север от Порту.",
      "Vila do Conde — симпатичный исторический город у устья реки Ave. Здесь есть старый акведук, монастырь Santa Clara, небольшие площади и набережная, по которой приятно гулять без конкретной цели.",
      "Обязательно загляните к Mosteiro de Santa Clara. Даже если вы не любитель религиозной архитектуры, силуэт монастыря и акведука стоит увидеть.",
      "Дальше — Póvoa de Varzim. Это уже более выраженный курортный город с длинной набережной, казино, пляжами и ресторанами.",
      "**Транспорт:** метро Porto до Vila do Conde / Póvoa de Varzim или автомобиль.",
      "**Время:** полдня или неспешный день.",
      "Google Maps: [Vila do Conde](https://www.google.com/maps/search/?api=1&query=Vila+do+Conde+Portugal) · [Mosteiro de Santa Clara](https://www.google.com/maps/search/?api=1&query=Mosteiro+de+Santa+Clara+Vila+do+Conde) · [Póvoa de Varzim](https://www.google.com/maps/search/?api=1&query=Povoa+de+Varzim+Portugal)",
    ],
    bullets: [
      "Утро — прогулка по историческому центру Vila do Conde.",
      "Кофе на берегу реки Ave.",
      "Обед с рыбой или морепродуктами.",
      "После обеда — пляж и набережная Póvoa de Varzim.",
      "Если погода хорошая — задержитесь до заката.",
    ],
    images: [
      shot(
        "dest-vila-do-conde.webp",
        "Акведук в Vila do Conde",
        "Акведук Vila do Conde.",
        "Nmmacedo, CC BY-SA 3.0, Wikimedia Commons",
        "https://commons.wikimedia.org/wiki/File:Aqueduto_de_Vila_do_Conde.jpg",
      ),
    ],
  },
  {
    heading: "Espinho — пляж, океан и свежая рыба",
    paragraphs: [
      "Espinho не пытается изображать старинную португальскую сказку. Это простой прибрежный город, куда едут ради широкого пляжа, океана и обеда.",
      "Здесь можно провести совершенно незапланированный день: прогуляться вдоль воды, посидеть в кафе, поесть grilled fish и посмотреть, как местные серферы ловят волны.",
      "Feira de Espinho — одна из интересных местных традиций города. По [Turismo de Espinho](https://www.turismo.espinho.pt/pt/turismo/feira-semanal/) большая еженедельная ярмарка проходит по понедельникам, обычно с 7:00 до 19:00.",
      "**Как провести день:** рынок, пляж, обед, прогулка по набережной.",
      "**Транспорт:** удобнее всего поездом из Porto.",
      "**Время:** 3–5 часов.",
      "Google Maps: [Feira de Espinho](https://www.google.com/maps/search/?api=1&query=Feira+de+Espinho) · [Praia de Espinho](https://www.google.com/maps/search/?api=1&query=Praia+de+Espinho) · [Маршрут Porto — Espinho](https://www.google.com/maps/dir/?api=1&origin=Porto+Portugal&destination=Espinho+Portugal)",
    ],
  },
  {
    heading: "Afurada — маленькая рыбацкая Португалия напротив города",
    paragraphs: [
      "Это не совсем поездка за город, но Afurada заслуживает отдельного упоминания.",
      "На другом берегу Douro, напротив Porto, сохранилась настоящая рыбацкая атмосфера: небольшие дома, лодки, сети, запах жареной рыбы и рестораны, где никто не пытается сделать из обеда гастрономическое шоу.",
      "Лучше приезжать ближе к обеду. Выбирайте ресторан с рыбой на гриле и не торопитесь.",
      "Google Maps: [Afurada](https://www.google.com/maps/search/?api=1&query=Afurada+Vila+Nova+de+Gaia) · [Маршрут Porto — Afurada](https://www.google.com/maps/dir/?api=1&origin=Porto+Portugal&destination=Afurada+Portugal)",
    ],
  },
  {
    heading: "Guimarães — место, где начиналась Португалия",
    paragraphs: [
      "Если выбрать только один исторический город для первой поездки из Porto, я бы начал с Guimarães.",
      "Здесь находится один из важнейших символов португальской государственности. Именно с этим регионом связана история Afonso Henriques — первого короля Португалии.",
      "Но Guimarães интересен не только историей. Старый центр очень цельный: каменные дома, аркады, небольшие площади, балконы, кафе и рестораны.",
      "Не ограничивайтесь замком. Настоящее удовольствие — просто пройтись по старому центру, заглянуть в небольшие магазины и найти террасу для обеда.",
      "**Где поесть:** выбирайте традиционную кухню Minho, особенно rojões, arroz de pica no chão и региональные вина.",
      "**Транспорт:** прямой поезд из Porto, автомобиль тоже удобен.",
      "**Время:** полный день.",
      "Google Maps: [Castelo de Guimarães](https://www.google.com/maps/search/?api=1&query=Castelo+de+Guimaraes) · [Paço dos Duques](https://www.google.com/maps/search/?api=1&query=Paco+dos+Duques+de+Braganca) · [Largo da Oliveira](https://www.google.com/maps/search/?api=1&query=Largo+da+Oliveira+Guimaraes) · [Monte da Penha](https://www.google.com/maps/search/?api=1&query=Santuario+da+Penha+Guimaraes) · [Маршрут Porto — Guimarães](https://www.google.com/maps/dir/?api=1&origin=Porto+Portugal&destination=Guimaraes+Portugal)",
    ],
    bullets: [
      "Castelo de Guimarães — средневековая крепость.",
      "Paço dos Duques de Bragança — дворец XV века.",
      "Largo da Oliveira — одна из самых красивых площадей города.",
      "Praça de Santiago — место для кофе и обеда.",
      "Monte da Penha — панорамные виды на город и окрестности.",
    ],
    images: [
      shot(
        "dest-guimaraes-castle.webp",
        "Замок Guimarães",
        "Castelo de Guimarães.",
        "David Stanley, CC BY 4.0, Wikimedia Commons",
        "https://commons.wikimedia.org/wiki/File:Guimaraes_Castle_(55226526419).jpg",
      ),
    ],
  },
  {
    heading: "Braga — церкви, лестницы и совершенно другой ритм",
    paragraphs: [
      "Braga часто недооценивают, считая её просто ещё одним старым португальским городом. На самом деле это один из самых интересных исторических центров севера.",
      "Главная причина приехать сюда — Bom Jesus do Monte.",
      "Представьте огромную барочную лестницу, которая поднимается по склону холма к святилищу. Сверху открывается впечатляющий вид на город и окрестности.",
      "Можно подняться пешком или воспользоваться историческим фуникулёром.",
      "В самом Braga стоит пройтись по старому центру, посмотреть Sé de Braga, Praça da República и Jardim de Santa Bárbara.",
      "Braga и Guimarães можно объединить в одну поездку, но это получится насыщенный день. Если любите гулять без спешки, лучше разделить их.",
      "**Транспорт:** поезд из Porto.",
      "**Время:** полный день или половина дня при сочетании с Guimarães.",
      "Google Maps: [Sé de Braga](https://www.google.com/maps/search/?api=1&query=Se+de+Braga) · [Bom Jesus do Monte](https://www.google.com/maps/search/?api=1&query=Bom+Jesus+do+Monte+Braga) · [Elevador do Bom Jesus](https://www.google.com/maps/search/?api=1&query=Elevador+do+Bom+Jesus+Braga) · [Santuário do Sameiro](https://www.google.com/maps/search/?api=1&query=Santuario+do+Sameiro+Braga) · [Маршрут Porto — Braga](https://www.google.com/maps/dir/?api=1&origin=Porto+Portugal&destination=Braga+Portugal)",
    ],
    bullets: [
      "Утро — исторический центр и собор.",
      "Кофе в центре.",
      "Обед.",
      "После обеда — Bom Jesus do Monte.",
      "Если останутся силы — Santuário do Sameiro.",
    ],
    images: [
      shot(
        "dest-braga-bom-jesus.webp",
        "Лестница Bom Jesus do Monte в Braga",
        "Bom Jesus do Monte, Braga.",
        "lumoplank, CC0, Wikimedia Commons",
        "https://commons.wikimedia.org/wiki/File:Braga,_sanctuaries_-_BragaSanctuaries5906.jpg",
      ),
    ],
  },
  {
    heading: "Barcelos — португальский петушок и настоящий рынок",
    paragraphs: [
      "Знакомый всем Galo de Barcelos родом именно отсюда.",
      "Но ехать стоит не только за сувениром. Barcelos — хороший пример небольшого северного города, в котором до сих пор живёт традиционная торговля.",
      "Главная точка — еженедельный рынок Feira de Barcelos, который обычно проходит по четвергам. Здесь продают керамику, продукты, текстиль, растения, предметы быта и многое другое.",
      "Добавьте к этому исторический центр, мост через реку Cávado и старые церкви.",
      "**Совет:** если любите блошиные рынки, винтаж и местные товары, четверг — лучший день для поездки.",
      "Google Maps: [Feira de Barcelos](https://www.google.com/maps/search/?api=1&query=Feira+de+Barcelos) · [Ponte Medieval de Barcelos](https://www.google.com/maps/search/?api=1&query=Ponte+Medieval+de+Barcelos) · [Galo de Barcelos](https://www.google.com/maps/search/?api=1&query=Galo+de+Barcelos) · [Маршрут Porto — Barcelos](https://www.google.com/maps/dir/?api=1&origin=Porto+Portugal&destination=Barcelos+Portugal)",
    ],
  },
  {
    heading: "Viana do Castelo и Ponte de Lima — один из лучших маршрутов Minho",
    paragraphs: [
      "Если хочется увидеть более спокойную, зелёную и аутентичную Португалию, отправляйтесь на север.",
      "Viana do Castelo — красивый город у океана, известный архитектурой, традиционными украшениями и панорамой с холма Santa Luzia.",
      "Сверху открывается один из самых эффектных видов на побережье северной Португалии.",
      "После города можно продолжить поездку в Ponte de Lima — один из старейших городов страны.",
      "Здесь стоит прогуляться по старому мосту через реку Lima, пройтись по набережной и пообедать в одном из местных ресторанов.",
      "**Маршрут:** Porto → Viana do Castelo → Santa Luzia → Ponte de Lima → Porto.",
      "**Время:** полный день, лучше на автомобиле.",
      "Google Maps: [Viana do Castelo](https://www.google.com/maps/search/?api=1&query=Viana+do+Castelo) · [Santuário de Santa Luzia](https://www.google.com/maps/search/?api=1&query=Santuario+de+Santa+Luzia+Viana) · [Ponte de Lima](https://www.google.com/maps/search/?api=1&query=Ponte+de+Lima) · [Ponte Romana e Medieval](https://www.google.com/maps/search/?api=1&query=Ponte+Romana+e+Medieval+Ponte+de+Lima) · [Полный маршрут Porto — Viana — Ponte de Lima](https://www.google.com/maps/dir/?api=1&origin=Porto+Portugal&destination=Porto+Portugal&waypoints=Viana+do+Castelo+Portugal%7CPonte+de+Lima+Portugal)",
    ],
    images: [
      shot(
        "dest-viana-santa-luzia.webp",
        "Святилище Santa Luzia над Viana do Castelo",
        "Santuário de Santa Luzia, Viana do Castelo.",
        "Krzysztof Golik, CC BY-SA 4.0, Wikimedia Commons",
        "https://commons.wikimedia.org/wiki/File:Monte_de_Santa_Luzia_sanctuary_in_Viana_do_Castelo_05.jpg",
      ),
      shot(
        "dest-ponte-de-lima.webp",
        "Средневековый мост в Ponte de Lima",
        "Мост через Lima в Ponte de Lima.",
        "Håkan Svensson, CC BY-SA 3.0, Wikimedia Commons",
        "https://commons.wikimedia.org/wiki/File:Ponte_de_Lima-Ponte_Medieval_e_Romana-View_towards_town_center.jpg",
      ),
    ],
  },
  {
    heading: "Peso da Régua и Pinhão — виноградники, река и лучшие виды",
    paragraphs: [
      "Долина Douro — одно из тех мест, которые сложно передать фотографиями.",
      "Крутые склоны, виноградники террасами, небольшие quintas, белые дома и река, которая извивается между холмами.",
      "Это не просто винодельческий регион. Это целый ландшафт, сформированный человеком на протяжении столетий.",
      "Самый простой вариант — доехать до Peso da Régua, а затем продолжить путь в Pinhão.",
      "В Régua можно посетить Museu do Douro и познакомиться с историей производства портвейна.",
      "Pinhão — пожалуй, один из самых красивых небольших городков долины. Железнодорожная станция известна своими азулежу, изображающими сцены сбора винограда.",
      "Если собираетесь на дегустацию, лучше воспользоваться организованным туром или поездом, а не садиться за руль после вина.",
      "Linha do Douro — самостоятельное путешествие. Поезд идёт вдоль реки и постепенно уводит вас из городской Португалии в виноградные долины.",
      "Можно ехать из Porto через Régua до Pinhão, а при желании продолжить до Pocinho.",
      "Не путайте Pocinho с Vila Nova de Foz Côa: до археологического парка от станции потребуется дополнительный автомобильный трансфер.",
      "Google Maps: [Peso da Régua](https://www.google.com/maps/search/?api=1&query=Peso+da+Regua) · [Museu do Douro](https://www.google.com/maps/search/?api=1&query=Museu+do+Douro) · [Pinhão](https://www.google.com/maps/search/?api=1&query=Pinhao+Portugal) · [Estação de Pinhão](https://www.google.com/maps/search/?api=1&query=Estacao+de+Pinhao) · [Miradouro de Casal de Loivos](https://www.google.com/maps/search/?api=1&query=Miradouro+de+Casal+de+Loivos) · [Маршрут Porto — Régua — Pinhão](https://www.google.com/maps/dir/?api=1&origin=Porto+Portugal&destination=Pinhao+Portugal&waypoints=Peso+da+Regua+Portugal)",
    ],
    bullets: [
      "Проехать вдоль реки.",
      "Посмотреть виноградные террасы.",
      "Зайти на винодельню.",
      "Попробовать местные вина.",
      "Прогуляться по Pinhão.",
      "Устроить обед с видом на Douro.",
    ],
    images: [
      shot(
        "dest-douro-terraces.webp",
        "Виноградные террасы долины Дору у реки",
        "Террасы долины Douro.",
        "Feliciano Guimarães, CC BY 2.0, Wikimedia Commons",
        "https://commons.wikimedia.org/wiki/File:Terras_do_Douro.jpg",
      ),
    ],
  },
  {
    heading: "Vila Nova de Foz Côa — древнее искусство под открытым небом",
    paragraphs: [
      "Это уже более дальняя поездка, но она совершенно особенная.",
      "В долине Côa находятся тысячи наскальных изображений, созданных ещё в доисторические времена. Это один из важнейших археологических комплексов такого рода в Европе.",
      "Здесь стоит посетить Museu do Côa и организованную экскурсию к наскальным рисункам.",
      "Это не обычный музейный визит: часть впечатления — сама дорога через сухие холмы и долины северо-востока Португалии.",
      "**Время:** 1–2 дня.",
      "**Транспорт:** автомобиль предпочтителен. Можно доехать поездом до Pocinho, но последнюю часть маршрута нужно организовать отдельно.",
      "Google Maps: [Museu do Côa](https://www.google.com/maps/search/?api=1&query=Museu+do+Coa) · [Parque Arqueológico do Vale do Côa](https://www.google.com/maps/search/?api=1&query=Parque+Arqueologico+do+Vale+do+Coa) · [Pocinho](https://www.google.com/maps/search/?api=1&query=Pocinho+Portugal) · [Маршрут Porto — Foz Côa](https://www.google.com/maps/dir/?api=1&origin=Porto+Portugal&destination=Museu+do+Coa)",
    ],
  },
  {
    heading: "Peneda-Gerês — горы, водопады и другая Португалия",
    paragraphs: [
      "Если вы устали от городов и хотите настоящей природы, отправляйтесь в единственный национальный парк Португалии.",
      "Peneda-Gerês — это горы, гранитные деревни, водопады, реки, леса и дороги, на которых хочется останавливаться через каждые несколько километров.",
      "Здесь совсем другая Португалия: меньше туристических витрин, больше тишины и пространства.",
      "Не пытайтесь охватить всё за один день. Для Gerês лучше выделить хотя бы два дня.",
      "Летом здесь можно купаться в природных водоёмах, но популярные места бывают переполнены. Осенью и весной парк особенно красив, хотя погода может быстро меняться.",
      "**Транспорт:** автомобиль практически необходим.",
      "Google Maps: [Parque Nacional da Peneda-Gerês](https://www.google.com/maps/search/?api=1&query=Parque+Nacional+da+Peneda+Geres) · [Cascata do Arado](https://www.google.com/maps/search/?api=1&query=Cascata+do+Arado) · [Miradouro da Pedra Bela](https://www.google.com/maps/search/?api=1&query=Miradouro+da+Pedra+Bela) · [Soajo](https://www.google.com/maps/search/?api=1&query=Soajo+Portugal) · [Lindoso](https://www.google.com/maps/search/?api=1&query=Lindoso+Portugal) · [Маршрут Porto — Gerês — Soajo — Lindoso](https://www.google.com/maps/dir/?api=1&origin=Porto+Portugal&destination=Porto+Portugal&waypoints=Miradouro+da+Pedra+Bela%7CSoajo+Portugal%7CLindoso+Portugal)",
    ],
    bullets: [
      "Lindoso — деревня с традиционными каменными зернохранилищами espigueiros и замком.",
      "Soajo — ещё одна знаменитая деревня с гранитными espigueiros.",
      "Cascata do Arado — один из популярных водопадов парка.",
      "Miradouro da Pedra Bela — впечатляющая панорама гор и долины.",
      "Vila do Gerês — удобная база для ночёвки.",
    ],
    images: [
      shot(
        "dest-geres.webp",
        "Водопад и гранитные ванны в Peneda-Gerês",
        "Вода и гранит в Peneda-Gerês.",
        "Nivasbabus, CC BY-SA 3.0, Wikimedia Commons",
        "https://commons.wikimedia.org/wiki/File:Geres,_Portugal.jpg",
      ),
      shot(
        "dest-soajo-espigueiros.webp",
        "Каменные espigueiros в деревне Soajo",
        "Espigueiros в Soajo.",
        "Krzysztof Golik, CC BY-SA 4.0, Wikimedia Commons",
        "https://commons.wikimedia.org/wiki/File:Granaries_in_Soajo_07.jpg",
      ),
    ],
  },
  {
    heading: "Arouca — подвесной мост над рекой и Paiva Walkways",
    paragraphs: [
      "Одна из самых интересных поездок для тех, кто любит активный отдых.",
      "Главная достопримечательность — 516 Arouca, пешеходный подвесной мост длиной 516 метров, расположенный на высоте около 175 метров над рекой Paiva.",
      "Он соединяет берега над глубоким речным ущельем. Если высота вас не пугает, впечатления будут незабываемые.",
      "Рядом находятся Passadiços do Paiva — деревянные дорожки вдоль реки. Это примерно восьмикилометровый маршрут через красивые природные участки.",
      "Важно: мост и дорожки требуют предварительного планирования. Билет на мост приобретается онлайн, а доступ зависит от погодных условий.",
      "**Время:** полный день.",
      "Google Maps: [516 Arouca](https://www.google.com/maps/search/?api=1&query=516+Arouca) · [Passadiços do Paiva — Areinho](https://www.google.com/maps/search/?api=1&query=Passadicos+do+Paiva+Areinho) · [Passadiços do Paiva — Espiunca](https://www.google.com/maps/search/?api=1&query=Passadicos+do+Paiva+Espiunca) · [Mosteiro de Arouca](https://www.google.com/maps/search/?api=1&query=Mosteiro+de+Arouca) · [Маршрут Porto — Arouca](https://www.google.com/maps/dir/?api=1&origin=Porto+Portugal&destination=516+Arouca)",
      "Билеты: [516arouca.pt](https://516arouca.pt/)",
    ],
    bullets: [
      "Приехать к забронированному времени на мост.",
      "Перейти 516 Arouca.",
      "Пройти часть или весь маршрут Passadiços do Paiva.",
      "Пообедать в Arouca.",
      "Посетить Mosteiro de Arouca, если останутся силы.",
    ],
    images: [
      shot(
        "dest-arouca-516.webp",
        "Пешеходный подвесной мост 516 Arouca",
        "516 Arouca над рекой Paiva.",
        "Hyméros, CC BY-SA 4.0, Wikimedia Commons",
        "https://commons.wikimedia.org/wiki/File:516_Arouca_access.jpg",
      ),
    ],
  },
  {
    heading: "Aveiro и Costa Nova — португальская Венеция, но не совсем",
    paragraphs: [
      "Aveiro — очень удобное направление из Porto. Поездка на поезде занимает около часа в зависимости от станции и рейса.",
      "В центре города проходят каналы, по которым ходят традиционные лодки moliceiros. Вдоль воды стоят красивые дома в стиле Art Nouveau, есть небольшие музеи, кафе и кондитерские.",
      "Обязательно попробуйте ovos moles — местные сладости из яичного желтка и сахара.",
      "Но не ограничивайтесь каналами. Если приехали на машине, продолжайте путь к Costa Nova.",
      "Здесь стоят знаменитые полосатые дома, когда-то связанные с рыбацкой жизнью побережья. Рядом — длинные пляжи Атлантики.",
      "**Маршрут:** Aveiro → Costa Nova → Praia da Barra → Porto.",
      "**Время:** полный день.",
      "Google Maps: [Canais de Aveiro](https://www.google.com/maps/search/?api=1&query=Canais+de+Aveiro) · [Museu de Arte Nova](https://www.google.com/maps/search/?api=1&query=Museu+Arte+Nova+Aveiro) · [Costa Nova](https://www.google.com/maps/search/?api=1&query=Costa+Nova+Ilhavo) · [Farol da Barra](https://www.google.com/maps/search/?api=1&query=Farol+da+Barra+Aveiro) · [Полный маршрут Porto — Aveiro — Costa Nova](https://www.google.com/maps/dir/?api=1&origin=Porto+Portugal&destination=Porto+Portugal&waypoints=Aveiro+Portugal%7CCosta+Nova+Portugal%7CPraia+da+Barra+Portugal)",
    ],
    images: [
      shot(
        "dest-aveiro-canal.webp",
        "Лодки moliceiro на канале Aveiro",
        "Канал и moliceiros в Aveiro.",
        "John Samuel, CC BY-SA 4.0, Wikimedia Commons",
        "https://commons.wikimedia.org/wiki/File:Canal_in_Aveiro_02.jpg",
      ),
      shot(
        "dest-costa-nova.webp",
        "Полосатые рыбацкие дома Costa Nova",
        "Полосатые дома Costa Nova.",
        "Einaz80, CC BY-SA 4.0, Wikimedia Commons",
        "https://commons.wikimedia.org/wiki/File:Costa_Nova_-_Colorful_houses_01.jpg",
      ),
    ],
  },
  {
    heading: "Coimbra и Conímbriga — университет, книги и Римская империя",
    paragraphs: [
      "Coimbra — город, который стоит посетить хотя бы раз.",
      "В течение столетий он был одним из важнейших центров португальской истории, а его университет входит в число старейших в Европе.",
      "Главная точка — Paço das Escolas и Biblioteca Joanina. Это одна из самых впечатляющих исторических библиотек Европы: резные интерьеры, позолота, деревянные шкафы и старинные книги.",
      "После университета прогуляйтесь по старому городу и спуститесь к реке Mondego.",
      "Если у вас автомобиль, добавьте Conímbriga — большой римский археологический комплекс с мозаиками и остатками древнего города.",
      "**Маршрут:** Coimbra → Conímbriga → Porto.",
      "**Время:** полный день, лучше два дня, если хотите спокойно всё посмотреть.",
      "**Важно:** посещение Biblioteca Joanina требует планирования по времени и билетам.",
      "Google Maps: [Universidade de Coimbra](https://www.google.com/maps/search/?api=1&query=Universidade+de+Coimbra) · [Biblioteca Joanina](https://www.google.com/maps/search/?api=1&query=Biblioteca+Joanina) · [Sé Velha de Coimbra](https://www.google.com/maps/search/?api=1&query=Se+Velha+Coimbra) · [Conímbriga](https://www.google.com/maps/search/?api=1&query=Ruinas+de+Conimbriga) · [Маршрут Porto — Coimbra — Conímbriga](https://www.google.com/maps/dir/?api=1&origin=Porto+Portugal&destination=Porto+Portugal&waypoints=Universidade+de+Coimbra%7CRuinas+de+Conimbriga)",
    ],
    images: [
      shot(
        "dest-coimbra-university.webp",
        "Двор Paço das Escolas в университете Coimbra",
        "Paço das Escolas, Universidade de Coimbra.",
        "Daniel Villafruela, CC BY-SA 4.0, Wikimedia Commons",
        "https://commons.wikimedia.org/wiki/File:Coimbra-Pa%C3%A7o_das_Escolas-Vista_da_biblioteca-20140914.jpg",
      ),
    ],
  },
  {
    heading: "Buçaco и Luso — дворец посреди сказочного леса",
    paragraphs: [
      "Это направление для тех, кто любит не только города, но и необычные места.",
      "Mata Nacional do Buçaco — огромный исторический лес с дорожками, старинными деревьями, фонтанами и небольшими религиозными сооружениями.",
      "В центре находится Palace Hotel do Bussaco — дворец с впечатляющей архитектурой конца XIX века.",
      "Даже если вы не останавливаетесь в отеле, поездка ради самого места уже оправданна.",
      "Рядом находится Luso — небольшой курортный город, известный термальными водами.",
      "**Маршрут:** Buçaco Forest → Palace Hotel → Luso.",
      "**Время:** полный день, можно совместить с Coimbra, если выезжать рано, но лучше не спешить.",
      "Google Maps: [Mata Nacional do Buçaco](https://www.google.com/maps/search/?api=1&query=Mata+Nacional+do+Bucaco) · [Palace Hotel do Bussaco](https://www.google.com/maps/search/?api=1&query=Palace+Hotel+do+Bussaco) · [Luso](https://www.google.com/maps/search/?api=1&query=Luso+Portugal) · [Маршрут Porto — Buçaco — Luso](https://www.google.com/maps/dir/?api=1&origin=Porto+Portugal&destination=Porto+Portugal&waypoints=Palace+Hotel+do+Bussaco%7CLuso+Portugal)",
    ],
  },
  {
    heading: "Nazaré — город, где океан показывает характер",
    paragraphs: [
      "Nazaré известна гигантскими волнами Praia do Norte. Именно здесь серферы пытаются покорять волны высотой с многоэтажный дом.",
      "Но Nazaré интересна и без экстремального серфинга.",
      "Нижняя часть города — рыбацкая набережная, рестораны и пляж. Верхняя — Sítio, куда можно подняться на фуникулёре и посмотреть на океан с высоты.",
      "Обязательно загляните к Forte de São Miguel Arcanjo. Отсюда открывается вид на место, где формируются знаменитые волны.",
      "**Совет:** если хотите увидеть гигантские волны, не приезжайте наугад. Их появление зависит от океанских условий. Проверяйте прогнозы и местные сообщения.",
      "Google Maps: [Praia do Norte](https://www.google.com/maps/search/?api=1&query=Praia+do+Norte+Nazare) · [Forte de São Miguel Arcanjo](https://www.google.com/maps/search/?api=1&query=Forte+de+Sao+Miguel+Arcanjo) · [Sítio da Nazaré](https://www.google.com/maps/search/?api=1&query=S%C3%ADtio+da+Nazare) · [Маршрут Porto — Nazaré](https://www.google.com/maps/dir/?api=1&origin=Porto+Portugal&destination=Nazare+Portugal)",
    ],
    images: [
      shot(
        "dest-nazare-waves.webp",
        "Гигантская волна у форта São Miguel Arcanjo в Nazaré",
        "Praia do Norte и Forte de São Miguel Arcanjo.",
        "Luís Ascenso, CC BY 3.0, Wikimedia Commons",
        "https://commons.wikimedia.org/wiki/File:Praia_Do_Norte_Nazar%C3%A9_High_Waves_(205617995).jpeg",
      ),
    ],
  },
  {
    heading: "Óbidos — город внутри средневековых стен",
    paragraphs: [
      "Óbidos — одна из самых фотогеничных исторических деревень страны.",
      "Белые дома с цветными окантовками, цветы на стенах, узкие улицы и средневековая крепость создают почти театральную атмосферу.",
      "Здесь стоит попробовать ginjinha — вишнёвый ликёр, который часто подают в маленькой шоколадной чашечке.",
      "Но главное удовольствие — гулять по городу, не пытаясь успеть всё.",
      "**Время:** 2–4 часа. Лучше объединить с Batalha или Alcobaça в двухдневной поездке.",
      "Google Maps: [Óbidos](https://www.google.com/maps/search/?api=1&query=Obidos+Portugal) · [Castelo de Óbidos](https://www.google.com/maps/search/?api=1&query=Castelo+de+Obidos) · [Маршрут Porto — Óbidos](https://www.google.com/maps/dir/?api=1&origin=Porto+Portugal&destination=Obidos+Portugal)",
    ],
    images: [
      shot(
        "dest-obidos.webp",
        "Средневековые стены и белые дома Óbidos",
        "Стены и замок Óbidos.",
        "Pedro Ribeiro Simões, CC BY 2.0, Wikimedia Commons",
        "https://commons.wikimedia.org/wiki/File:The_%C3%93bidos%27_Castle_(4017081137).jpg",
      ),
    ],
  },
  {
    heading: "Batalha и Alcobaça — два великих монастыря",
    paragraphs: [
      "Если вам интересна архитектура, это обязательная поездка.",
      "Mosteiro da Batalha — один из самых впечатляющих готических памятников Португалии. Его строительство началось после победы португальцев в битве при Aljubarrota в 1385 году.",
      "Mosteiro de Alcobaça — другой характер: масштаб, строгая архитектура и знаменитая история Педру и Инеш.",
      "Оба монастыря входят в список Всемирного наследия UNESCO.",
      "Не нужно пытаться пробежать их за час. Это места, где стоит задержаться.",
      "**Маршрут:** Batalha → Alcobaça → Porto.",
      "**Время:** полный день, но комфортнее с ночёвкой на Silver Coast.",
      "Google Maps: [Mosteiro da Batalha](https://www.google.com/maps/search/?api=1&query=Mosteiro+da+Batalha) · [Mosteiro de Alcobaça](https://www.google.com/maps/search/?api=1&query=Mosteiro+de+Alcobaca) · [Маршрут Porto — Batalha — Alcobaça](https://www.google.com/maps/dir/?api=1&origin=Porto+Portugal&destination=Porto+Portugal&waypoints=Mosteiro+da+Batalha%7CMosteiro+de+Alcobaca)",
    ],
    images: [
      shot(
        "dest-batalha.webp",
        "Готический фасад монастыря Batalha",
        "Mosteiro da Batalha.",
        "Alvesgaspar, CC BY-SA 4.0, Wikimedia Commons",
        "https://commons.wikimedia.org/wiki/File:Batalha_September_2021-2.jpg",
      ),
    ],
  },
  {
    heading: "Tomar — город тамплиеров",
    paragraphs: [
      "Tomar — один из самых интересных исторических городов центральной Португалии.",
      "Главная достопримечательность — Convento de Cristo, огромный монастырско-замковый комплекс, связанный с орденом тамплиеров и позднее Орденом Христа.",
      "Здесь можно провести несколько часов, изучая архитектуру, внутренние дворы, знаменитое окно в стиле мануэлино и монастырские пространства.",
      "После посещения замка спуститесь в центр города, прогуляйтесь вдоль реки Nabão и зайдите в Jardim do Mouchão.",
      "**Время:** полный день, лучше с ночёвкой, если планируете продолжить маршрут.",
      "Google Maps: [Convento de Cristo](https://www.google.com/maps/search/?api=1&query=Convento+de+Cristo+Tomar) · [Castelo de Tomar](https://www.google.com/maps/search/?api=1&query=Castelo+de+Tomar) · [Jardim do Mouchão](https://www.google.com/maps/search/?api=1&query=Jardim+do+Mouchao+Tomar) · [Маршрут Porto — Tomar](https://www.google.com/maps/dir/?api=1&origin=Porto+Portugal&destination=Tomar+Portugal)",
    ],
    images: [
      shot(
        "dest-tomar-convent.webp",
        "Свод церкви Convento de Cristo в Tomar",
        "Церковь Convento de Cristo, Tomar.",
        "Jules Verne Times Two, CC BY-SA 4.0, Wikimedia Commons",
        "https://commons.wikimedia.org/wiki/File:Upper_Choir_of_the_Church_of_Convento_de_Cristo,_Tomar,_Portugal_julesvernex2.jpg",
      ),
    ],
  },
  {
    heading: "Castelo de Almourol — замок на острове",
    paragraphs: [
      "Недалеко от Tomar находится одно из самых необычных мест Португалии.",
      "Castelo de Almourol стоит на небольшом скалистом острове посреди реки Tejo.",
      "К замку добираются на лодке. Именно эта короткая переправа и делает визит особенно интересным.",
      "Проверьте расписание лодок и условия посещения перед выездом.",
      "**Маршрут:** Tomar → Almourol → Constância.",
      "Google Maps: [Castelo de Almourol](https://www.google.com/maps/search/?api=1&query=Castelo+de+Almourol) · [Constância](https://www.google.com/maps/search/?api=1&query=Constancia+Portugal) · [Маршрут Porto — Tomar — Almourol — Constância](https://www.google.com/maps/dir/?api=1&origin=Porto+Portugal&destination=Porto+Portugal&waypoints=Tomar+Portugal%7CCastelo+de+Almourol%7CConstancia+Portugal)",
    ],
    images: [
      shot(
        "dest-almourol.webp",
        "Замок Almourol на скале посреди реки Тежу",
        "Castelo de Almourol на Tejo.",
        "Luís Ascenso, CC BY 3.0, Wikimedia Commons",
        "https://commons.wikimedia.org/wiki/File:Almourol_Castle_(152955943).jpeg",
      ),
    ],
  },
  {
    heading: "Bragança и Miranda do Douro",
    paragraphs: [
      "Если хочется увидеть другую страну, отправляйтесь на северо-восток.",
      "Trás-os-Montes буквально означает «за горами». Это более суровый и менее туристический регион, где сильнее чувствуется сельская Португалия.",
      "Bragança — город с великолепной средневековой цитаделью, каменными улицами и замком.",
      "Miranda do Douro — совсем другая история. Город расположен над глубоким каньоном реки Douro, на границе с Испанией. Здесь сохранился мирандский язык, признанный региональным языком Португалии.",
      "Если повезёт с погодой, виды на каньон будут одним из самых сильных впечатлений поездки.",
      "**Время:** минимум два дня.",
      "Google Maps: [Bragança](https://www.google.com/maps/search/?api=1&query=Braganca+Portugal) · [Castelo de Bragança](https://www.google.com/maps/search/?api=1&query=Castelo+de+Braganca) · [Miranda do Douro](https://www.google.com/maps/search/?api=1&query=Miranda+do+Douro) · [Miradouro Fraga do Puio](https://www.google.com/maps/search/?api=1&query=Miradouro+Fraga+do+Puio) · [Маршрут Porto — Bragança — Miranda do Douro](https://www.google.com/maps/dir/?api=1&origin=Porto+Portugal&destination=Porto+Portugal&waypoints=Braganca+Portugal%7CMiranda+do+Douro+Portugal)",
    ],
    bullets: [
      "Castelo de Bragança.",
      "Cidadela de Bragança.",
      "Museu Ibérico da Máscara e do Traje.",
      "Miranda do Douro.",
      "Miradouro Fraga do Puio.",
    ],
  },
  {
    heading: "Vila Real и Mateus Palace",
    paragraphs: [
      "Vila Real — удобная остановка на пути в Douro и Trás-os-Montes.",
      "Главная достопримечательность — Palácio de Mateus, один из самых узнаваемых дворцов Португалии.",
      "Его фасад с отражением в воде — почти готовая открытка.",
      "Но внутри тоже есть что посмотреть: исторические интерьеры, сад и винодельческое наследие.",
      "**Время:** полдня или остановка на пути в Douro.",
      "Google Maps: [Palácio de Mateus](https://www.google.com/maps/search/?api=1&query=Casa+de+Mateus+Vila+Real) · [Vila Real](https://www.google.com/maps/search/?api=1&query=Vila+Real+Portugal) · [Маршрут Porto — Vila Real](https://www.google.com/maps/dir/?api=1&origin=Porto+Portugal&destination=Vila+Real+Portugal)",
    ],
  },
  {
    heading: "Alentejo — совсем другая Португалия",
    paragraphs: [
      "Alentejo лучше не пытаться смотреть за один день из Porto. Это направление для поездки на 3–5 дней.",
      "Здесь нет зелёных гор Minho. Вместо них — широкие равнины, оливковые деревья, пробковые дубы, белые деревни, винодельни и крепости на холмах.",
      "Это Португалия с другим ритмом: длинные обеды, жаркие дни и очень красивые закаты.",
    ],
  },
  {
    heading: "Évora — римская история и белые улицы",
    paragraphs: [
      "Évora — исторический центр региона и объект Всемирного наследия UNESCO.",
      "Здесь можно увидеть римский храм, средневековый собор, площадь Giraldo и знаменитую Capela dos Ossos.",
      "Сам город очень приятен для пеших прогулок. Белые дома, узкие улицы и небольшие рестораны создают совершенно другой образ страны.",
      "Google Maps: [Templo Romano de Évora](https://www.google.com/maps/search/?api=1&query=Templo+Romano+de+Evora) · [Capela dos Ossos](https://www.google.com/maps/search/?api=1&query=Capela+dos+Ossos+Evora) · [Praça do Giraldo](https://www.google.com/maps/search/?api=1&query=Praca+do+Giraldo+Evora)",
    ],
    images: [
      shot(
        "dest-evora-temple.webp",
        "Римский храм в Évora",
        "Templo Romano de Évora.",
        "Norbert Nagel, CC BY-SA 3.0, Wikimedia Commons",
        "https://commons.wikimedia.org/wiki/File:Roman_Temple_Evora_Portugal_01.jpg",
      ),
    ],
  },
  {
    heading: "Monsaraz и озеро Alqueva",
    paragraphs: [
      "Monsaraz — маленький белый город на холме, откуда открываются виды на огромное водохранилище Alqueva.",
      "Это одно из тех мест, куда хочется приехать ближе к вечеру и остаться до темноты.",
      "Регион Alqueva известен низким уровнем светового загрязнения и возможностями для наблюдения за звёздами.",
      "Google Maps: [Monsaraz](https://www.google.com/maps/search/?api=1&query=Monsaraz+Portugal) · [Lago Alqueva](https://www.google.com/maps/search/?api=1&query=Alqueva+Lake+Portugal) · [Observatório do Lago Alqueva](https://www.google.com/maps/search/?api=1&query=Observatorio+do+Lago+Alqueva)",
    ],
    images: [
      shot(
        "dest-monsaraz.webp",
        "Белые улицы Monsaraz в Alentejo",
        "Улицы Monsaraz.",
        "Guy Moll, CC BY 2.0, Wikimedia Commons",
        "https://commons.wikimedia.org/wiki/File:Monsaraz_-_Alentejo_(383570557).jpg",
      ),
    ],
  },
  {
    heading: "Estremoz, Vila Viçosa и Marvão",
    paragraphs: [
      "Это маршрут для любителей замков, мраморной архитектуры и небольших исторических городов.",
      "Estremoz известен белым мрамором и рынком по субботам.",
      "Vila Viçosa — дворцом Paço Ducal и историей династии Bragança.",
      "Marvão — крепостью на вершине горы, практически у испанской границы.",
      "**Время:** 3–5 дней на весь регион.",
      "Google Maps: [Estremoz](https://www.google.com/maps/search/?api=1&query=Estremoz+Portugal) · [Paço Ducal de Vila Viçosa](https://www.google.com/maps/search/?api=1&query=Paco+Ducal+Vila+Vicosa) · [Marvão](https://www.google.com/maps/search/?api=1&query=Marvao+Portugal) · [Маршрут Porto — Évora — Monsaraz — Marvão](https://www.google.com/maps/dir/?api=1&origin=Porto+Portugal&destination=Porto+Portugal&waypoints=Evora+Portugal%7CMonsaraz+Portugal%7CMarvao+Portugal)",
    ],
  },
  {
    heading: "Lisbon и Sintra — отдельное путешествие",
    paragraphs: [
      "Лиссабон не стоит воспринимать как поездку на несколько часов из Porto.",
      "Да, скоростной поезд позволяет добраться достаточно быстро, но столица заслуживает как минимум двух дней.",
      "Сюда стоит ехать ради исторических районов, смотровых площадок, ресторанов, музеев, набережной и совершенно особой городской атмосферы.",
      "Google Maps: [Alfama](https://www.google.com/maps/search/?api=1&query=Alfama+Lisbon) · [Praça do Comércio](https://www.google.com/maps/search/?api=1&query=Praca+do+Comercio+Lisbon) · [Mosteiro dos Jerónimos](https://www.google.com/maps/search/?api=1&query=Mosteiro+dos+Jeronimos) · [LX Factory](https://www.google.com/maps/search/?api=1&query=LX+Factory+Lisbon) · [Oceanário de Lisboa](https://www.google.com/maps/search/?api=1&query=Oceanario+de+Lisboa)",
    ],
    bullets: [
      "Alfama — старые улицы и Fado.",
      "Praça do Comércio — главная площадь у реки.",
      "Belém — монастырь Jerónimos, башня и Pastéis de Belém.",
      "LX Factory — магазины, рестораны и творческое пространство.",
      "Oceanário — особенно если путешествуете с детьми.",
    ],
  },
  {
    heading: "Sintra — дворцы, сады и туманные холмы",
    paragraphs: [
      "Sintra — одно из самых необычных мест страны.",
      "Здесь можно провести целый день среди дворцов, романтических парков и лесных дорожек.",
      "Не пытайтесь увидеть всё за один день. Выберите две основные точки и оставьте время для прогулки.",
      "Важная логистика: в Sintra действуют ограничения для частных автомобилей, в том числе к Pena и Castelo dos Mouros. Посещение Pena требует предварительного бронирования времени. Планируйте перемещение общественным транспортом и шаттлами.",
      "Официальные билеты и часы: [parquesdesintra.pt](https://www.parquesdesintra.pt/)",
      "Google Maps: [Palácio da Pena](https://www.google.com/maps/search/?api=1&query=Palacio+da+Pena+Sintra) · [Quinta da Regaleira](https://www.google.com/maps/search/?api=1&query=Quinta+da+Regaleira) · [Monserrate](https://www.google.com/maps/search/?api=1&query=Palacio+de+Monserrate) · [Castelo dos Mouros](https://www.google.com/maps/search/?api=1&query=Castelo+dos+Mouros) · [Convento dos Capuchos](https://www.google.com/maps/search/?api=1&query=Convento+dos+Capuchos) · [Маршрут Lisbon — Sintra](https://www.google.com/maps/dir/?api=1&origin=Lisbon+Portugal&destination=Sintra+Portugal)",
    ],
    bullets: [
      "Palácio da Pena — яркий дворец на вершине холма.",
      "Quinta da Regaleira — загадочный парк, гроты и Initiation Well.",
      "Monserrate — дворец и ботанический сад.",
      "Castelo dos Mouros — средневековая крепость.",
      "Convento dos Capuchos — крошечный монастырь среди леса.",
    ],
    images: [
      shot(
        "dest-sintra-pena.webp",
        "Дворец Pena на холме в Sintra",
        "Palácio da Pena, Sintra.",
        "Jakub Hałun, CC BY 4.0, Wikimedia Commons",
        "https://commons.wikimedia.org/wiki/File:Pal%C3%A1cio_Nacional_da_Pena,_Sintra,_Portugal,_20250606_1155_0102.jpg",
      ),
    ],
  },
  {
    heading: "Южное побережье: Arrábida, Setúbal и Tróia",
    paragraphs: [
      "Это уже не короткая поездка из Porto, а хороший маршрут на несколько дней.",
      "Arrábida — один из самых красивых прибрежных природных парков страны. Зелёные холмы спускаются к прозрачной воде, а между ними прячутся небольшие бухты.",
      "Setúbal стоит посетить ради морепродуктов, особенно choco frito — жареной каракатицы.",
      "Tróia — длинный песчаный полуостров напротив Setúbal. До него можно добраться на пароме.",
      "Google Maps: [Parque Natural da Arrábida](https://www.google.com/maps/search/?api=1&query=Parque+Natural+da+Arrabida) · [Praia de Galapinhos](https://www.google.com/maps/search/?api=1&query=Praia+de+Galapinhos) · [Portinho da Arrábida](https://www.google.com/maps/search/?api=1&query=Portinho+da+Arrabida) · [Sesimbra](https://www.google.com/maps/search/?api=1&query=Sesimbra+Portugal) · [Mercado do Livramento](https://www.google.com/maps/search/?api=1&query=Mercado+do+Livramento+Setubal) · [Tróia](https://www.google.com/maps/search/?api=1&query=Troia+Portugal) · [Маршрут Porto — Arrábida — Setúbal](https://www.google.com/maps/dir/?api=1&origin=Porto+Portugal&destination=Porto+Portugal&waypoints=Sesimbra+Portugal%7CPortinho+da+Arrabida%7CSetubal+Portugal)",
    ],
    bullets: [
      "Praia de Galapinhos.",
      "Praia da Figueirinha.",
      "Portinho da Arrábida.",
      "Sesimbra.",
      "Castelo de Palmela.",
      "Setúbal и Mercado do Livramento.",
      "Tróia.",
    ],
  },
  {
    heading: "Madeira — когда хочется совсем другой Португалии",
    paragraphs: [
      "Madeira не подходит для автомобильного путешествия из Porto: это остров, и сюда нужно лететь.",
      "Но если вы уже живёте в Португалии, стоит выделить на Madeira отдельный отпуск.",
      "Фуншал, горные дороги, левады, лавровые леса, вулканические бассейны Porto Moniz и невероятные виды с Cabo Girão — это совсем другой мир.",
      "**На остров стоит заложить 4–7 дней.**",
      "Проверьте актуальные правила посещения пешеходных маршрутов и необходимость бронирования слотов на официальном портале Madeira.",
      "Google Maps: [Funchal](https://www.google.com/maps/search/?api=1&query=Funchal+Madeira) · [Cabo Girão](https://www.google.com/maps/search/?api=1&query=Cabo+Girao) · [Porto Moniz](https://www.google.com/maps/search/?api=1&query=Porto+Moniz) · [Santana](https://www.google.com/maps/search/?api=1&query=Santana+Madeira) · [Ponta de São Lourenço](https://www.google.com/maps/search/?api=1&query=Ponta+de+Sao+Lourenco) · [Pico do Arieiro](https://www.google.com/maps/search/?api=1&query=Pico+do+Arieiro)",
    ],
    bullets: [
      "Funchal Old Town.",
      "Mercado dos Lavradores.",
      "Cabo Girão.",
      "Porto Moniz.",
      "Santana.",
      "Ponta de São Lourenço.",
      "Pico do Arieiro.",
    ],
    images: [
      shot(
        "dest-madeira-cabo-girao.webp",
        "Вид на Фуншал и океан с Cabo Girão на Мадейре",
        "Фуншал с Cabo Girão.",
        "Diego Delso, CC BY-SA 4.0, Wikimedia Commons",
        "https://commons.wikimedia.org/wiki/File:Vista_de_Funchal_desde_Cabo_Gir%C3%A3o,_Madeira,_Portugal,_2019-05-30,_DD_59.jpg",
      ),
    ],
  },
  {
    heading: "Календарь поездок: когда куда ехать",
    paragraphs: [
      "Португалия хороша круглый год, но направления сильно зависят от сезона.",
    ],
    table: {
      columns: ["Сезон", "Лучшие направления"],
      rows: [
        ["Январь–февраль", "Braga, Guimarães, Coimbra, исторические города"],
        ["Март–апрель", "Minho, Gerês, Douro, Arouca"],
        ["Май–июнь", "Gerês, Viana, Douro, побережье"],
        ["Июль–август", "океан, северное побережье, горные районы"],
        ["Сентябрь–октябрь", "Douro, виноградники, Alentejo"],
        ["Ноябрь–декабрь", "города, гастрономия, Golegã, рождественские рынки"],
      ],
    },
    bullets: [
      "Feira Nacional do Cavalo в Golegã — в 2026 году 6–15 ноября ([feiranacionaldocavalo.com](https://feiranacionaldocavalo.com/fnc-2026-2/)).",
      "Виноградный сезон Douro — конец лета и начало осени.",
      "São João в Porto — ночь с 23 на 24 июня.",
      "Рождественские рынки — декабрь, даты уточняйте по городам.",
    ],
  },
  {
    heading: "Машина или поезд?",
    paragraphs: [
      "Для Guimarães, Braga, Aveiro и Coimbra поезд часто удобнее автомобиля. Не нужно думать о парковке, а железнодорожные станции находятся достаточно близко к центрам.",
      "Для Gerês, Arouca, деревень Minho, Douro Superior и Trás-os-Montes машина даёт гораздо больше свободы.",
    ],
    table: {
      columns: ["Направление", "Лучший транспорт"],
      rows: [
        ["Braga", "Поезд"],
        ["Guimarães", "Поезд"],
        ["Barcelos", "Поезд"],
        ["Aveiro", "Поезд"],
        ["Coimbra", "Поезд"],
        ["Douro", "Поезд или автомобиль"],
        ["Gerês", "Автомобиль"],
        ["Arouca", "Автомобиль"],
        ["Viana do Castelo", "Поезд или автомобиль"],
        ["Ponte de Lima", "Автомобиль"],
        ["Alentejo", "Автомобиль"],
        ["Silver Coast", "Автомобиль"],
      ],
    },
  },
  {
    heading: "Что учитывать перед выездом",
    paragraphs: [
      "**Платные дороги.** В Португалии есть обычные portagens и электронные участки. Перед поездкой проверьте способ оплаты и маршрут.",
      "**Парковка.** В старых центрах городов улицы узкие. Лучше заранее найти парковку на Google Maps, а не пытаться заехать в исторический центр.",
      "**Погода.** Север страны значительно влажнее юга. Для Gerês и горных маршрутов проверяйте прогноз в день поездки.",
      "**Билеты.** Pena, Biblioteca Joanina, 516 Arouca и некоторые винодельни требуют предварительного бронирования.",
      "**Время.** Не доверяйте только Google Maps: время в пути не учитывает остановки, парковку, обед и очереди.",
      "Полезные официальные ресурсы: [CP — железные дороги Португалии](https://www.cp.pt/) · [Visit Portugal](https://www.visitportugal.com/) · [Parques de Sintra](https://www.parquesdesintra.pt/) · [516 Arouca](https://516arouca.pt/) · [ICNF — природные парки и охраняемые территории](https://www.icnf.pt/) · [Arouca Geopark](https://aroucageopark.pt/)",
    ],
  },
  {
    heading: "Пять поездок, с которых стоит начать",
    paragraphs: [
      "Если вы только начинаете исследовать Португалию из Porto, я бы расставил приоритеты так:",
      "**1. Douro Valley.** Ради пейзажей, виноградников и одной из самых красивых железнодорожных поездок страны.",
      "**2. Guimarães.** Ради истории, старого города и настоящей северной Португалии.",
      "**3. Peneda-Gerês.** Ради гор, водопадов и природы. Лучше с ночёвкой.",
      "**4. Aveiro и Costa Nova.** Лёгкая и красивая поездка, которую можно организовать без автомобиля.",
      "**5. Arouca.** Ради моста 516 и прогулки вдоль реки Paiva.",
      "Но не ограничивайтесь этими пятью. Португалия особенно интересна там, где заканчиваются стандартные туристические маршруты.",
      "Иногда лучший день — это не посещение очередного объекта UNESCO, а дорога через маленькие деревни, остановка у семейной pastelaria и обед в ресторане, который вы нашли случайно.",
      "**Берите машину, выбирайте направление и оставляйте немного места для спонтанности. Португалия лучше всего открывается не по списку достопримечательностей, а в дороге.**",
      "Редакция Emigro. Время в пути, расписания, доступ к природным объектам и условия посещения могут меняться. Проверяйте информацию у перевозчиков и организаторов перед выездом.",
    ],
  },
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Куда поехать из Порту на полдня?",
    a: "Vila do Conde, Espinho и Afurada. Метро Porto доходит до Vila do Conde и Póvoa de Varzim, в Espinho удобнее поезд. На Feira de Espinho закладывайте понедельник.",
  },
  {
    q: "Где хватит поезда, а где нужна машина?",
    a: "Поезд удобен в Guimarães, Braga, Barcelos, Aveiro и Coimbra. Для Gerês, Arouca, деревень Minho, Douro Superior, Trás-os-Montes, Alentejo и Silver Coast машина даёт больше свободы.",
  },
  {
    q: "Поезд по Douro доезжает до наскальных рисунков?",
    a: "Linha do Douro идёт из Porto через Régua до Pinhão и при желании до Pocinho. До археологического парка Vila Nova de Foz Côa от станции нужен отдельный трансфер. После дегустации лучше не садиться за руль.",
  },
  {
    q: "Сколько времени закладывать на Lisbon и Sintra?",
    a: "Лиссабон — минимум два дня, это не поездка на несколько часов из Porto. В Sintra выберите две точки: к Pena и Castelo dos Mouros есть ограничения для частных автомобилей, слот на Pena бронируют на parquesdesintra.pt.",
  },
  {
    q: "Когда ехать в Gerês и на ярмарку в Golegã?",
    a: "Для Gerês лучше хотя бы два дня: летом популярные водоёмы переполнены, осенью и весной парк особенно красив. Feira Nacional do Cavalo в Golegã в 2026 году — 6–15 ноября.",
  },
];

const quickAnswer =
  "Порту — отличная база для путешествий по Португалии. За час можно оказаться в средневековом городе, за полтора — среди виноградников долины Дору, а за два — в горах национального парка Peneda-Gerês. На полдня хватит Vila do Conde, Espinho и Afurada. На день — Braga, Guimarães, Aveiro. Gerês, Arouca и Alentejo просят машину и больше времени. Лиссабон и Sintra — отдельная поездка, не вечер из Porto.";

const seoDescription =
  "Из Порту за час — средневековый город, за полтора — виноградники Дору, за два — горы Gerês. 20 маршрутов по Португалии: океан, Minho, Alentejo.";

export const PORTUGAL_DESTINATION_TIPS_GUIDE = {
  slug: PORTUGAL_DESTINATION_TIPS_SLUG,
  category: "Досуг",
  content_kind: "guide" as ContentKind,
  title: "Куда поехать из Порту: 20 маршрутов по Португалии от океана до виноградников",
  excerpt:
    "Путеводитель для тех, кто живёт в Порту или приехал надолго: маршруты от океана и Minho до Дору, Gerês, Silver Coast, Alentejo и Мадейры.",
  seo_title: "Куда поехать из Порту: 20 маршрутов 2026",
  seo_description: seoDescription,
  quick_answer: quickAnswer,
  city: "porto",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: [
    "Не пытайтесь посмотреть всю Португалию за один уикенд: интереснее ехать медленно и обедать там, где меню написано от руки.",
    "С чего начать: Douro, Guimarães, Peneda-Gerês с ночёвкой, Aveiro и Costa Nova, Arouca.",
    "Поезд удобен в Guimarães, Braga, Aveiro и Coimbra. Для Gerês, Arouca, Alentejo и Silver Coast нужна машина.",
    "Pena, Biblioteca Joanina, 516 Arouca и часть виноделен бронируйте заранее. Feira de Espinho — по понедельникам, Feira de Barcelos — по четвергам, Golegã 2026 — 6–15 ноября.",
  ],
  faq,
  official_links: [
    { title: "CP — Comboios de Portugal", url: "https://www.cp.pt/" },
    { title: "Visit Portugal", url: "https://www.visitportugal.com/" },
    { title: "Parques de Sintra", url: "https://www.parquesdesintra.pt/" },
    { title: "516 Arouca", url: "https://516arouca.pt/" },
    { title: "ICNF", url: "https://www.icnf.pt/" },
    { title: "Arouca Geopark", url: "https://aroucageopark.pt/" },
    { title: "Turismo de Espinho — Feira Semanal", url: "https://www.turismo.espinho.pt/pt/turismo/feira-semanal/" },
    { title: "Feira Nacional do Cavalo 2026", url: "https://feiranacionaldocavalo.com/fnc-2026-2/" },
  ],
  topic_tags: ["turismo", "portugal", "porto"],
  hashtags: buildNoteHashtags({
    topicTags: ["turismo", "portugal", "porto"],
    contentKind: "guide",
    extra: ["douro", "geres", "minho", "sintra", "alentejo", "madeira", "aveiro"],
  }),
  source_channel: "editorial",
  source_label: "editorial:porto-routes-2026-voice",
};
