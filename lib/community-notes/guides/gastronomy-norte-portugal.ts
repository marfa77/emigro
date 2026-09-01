/**
 * Norte gastronomy — dishes, home recipes, restaurants (Porto/Braga).
 * Grok Remarque pass.
 * Voice: «Полный Ремарк» — hunger, mercado smell, sauce and river air first; logistics inside the story.
 * Emigro still closes sections with «Главное:» and keeps a few actionable bullets.
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { formatPracticeTakeaway } from "@/lib/community-notes/practice-format";
import { WINES_WINERIES_NORTE_SLUG } from "@/lib/community-notes/guides/wines-wineries-norte-portugal";
import { DOMESTIC_TOURISM_NORTE_SLUG } from "@/lib/community-notes/guides/domestic-tourism-portugal-norte";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const GASTRONOMY_NORTE_SLUG = "gastronomiya-norte-porto-braga-restorany-2026";

const GLOSSARY_INTRO =
  "Слова с ementa и счёта — чтобы francesinha, tripas и reserva не путались в первую субботу в Baixa.";

const DISCLAIMER =
  "**Emigro:** рецепты — домашние ориентиры, не учебник повара; аллергии и диеты уточняйте в ресторане. Цены и Michelin-статус меняются — сверяйте сайт и TheFork/Google перед бронью. Фото блюд — с сайтов заведений (подписи). Не реклама и не спонсорский обзор.";

const IMG = "/images/community-notes/inline/gastro-norte";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(glossaryForSlug(GASTRONOMY_NORTE_SLUG)!, GLOSSARY_INTRO),
    paragraphs: [GLOSSARY_INTRO, DISCLAIMER],
  },
  {
    heading: "Официально: как устроена гастрокарта Norte",
    section_kind: "official",
    paragraphs: [
      "Первая неделя в Porto начинается не с карты музеев, а с голода. Он приходит рано, ещё до того, как вы выучите станции метро, и стоит рядом, пока чат кидает двенадцать «лучших francesinha». В Ribeira вам протягивают меню на английском с наценкой, воздух у реки пахнет жареным и мокрым камнем, и вы чувствуете, что город уже ест без вас. Спокойно: еда здесь — не туристический чеклист на три дня, а ритм недели, который выучивается медленнее, чем схема линий.",
      "Держите карту в трёх слоях и не смешивайте ожидания, как не смешивают соус и десерт. Культ улицы — francesinha, bifana, sardinha — живёт очередью, салфетками и тем жаром, который поднимается от тарелки, когда вы ещё не сели. Классика дома и tasca — tripas, caldo verde, cabrito — пахнет воскресеньем, жиром на сковороде и чужой кухней, в которую вас всё-таки пустили. Fine dining — tasting и вид на реку — раз в месяц, не попытка «закрыть Michelin за уикенд», пока язык ещё помнит только соль перелёта. Visit Porto и Visit Porto & Norte дают фон и события; бронь и ementa (меню) — только у ресторана, не у скрина из чата.",
      "Вино к столу лучше держать отдельно, иначе голод и жажда начнут спорить в одном бокале. К сардинам — Vinho Verde, к мясу — тихий Douro; подробнее — [винный гайд](/notes/" +
        WINES_WINERIES_NORTE_SLUG +
        "). Выезд в Minho или долину — [туризм внутри PT](/notes/" +
        DOMESTIC_TOURISM_NORTE_SLUG +
        "). ASAE следит за гигиеной, а не за «вкусом из чата 2019 года». Рынок Bolhão утром будня и витрина в Matosinhos честнее неоновой вывески у воды, где воздух уже чужой, а рыба — нет.",
      "Главное: Bolhão и Matosinhos честнее неоновой вывески у реки; ASAE — про гигиену, не про «вкус из чата».",
    ],
    bullets: [
      "Откройте Visit Porto / Visit Porto & Norte для событий — не как рейтинг francesinha.",
      "Сверьте свежесть у витрины в Matosinhos и спросите preço do dia.",
      "Приезжайте на Bolhão утром будня — суббота красивее и шумнее.",
      "Заложите вино отдельно: к сардинам Vinho Verde, к мясу — тихий Douro.",
    ],
  },
  {
    heading: "Культовые блюда Norte: что заказать первым",
    section_kind: "practice",
    paragraphs: [
      "За две-три недели можно закрыть обязательную программу без героизма «всё меню подряд». Голод после работы толкает взять сразу francesinha, tripas и ещё «что посоветуете» — и к девяти вечера вы уже не помните вкуса, только тяжесть и запах пивного соуса на салфетке. Чат por_tugal будет спорить про «лучшую francesinha» ещё десять лет, пока соус на чужих тарелках стынет. Новичок выигрывает от понимания блюда, а не от двенадцатой версии, которую кто-то снял в 2019-м. Одно культовое за раз — это не скромность, а способ ещё чувствовать язык.",
      "Francesinha приходит слоями: мясо, сыр, иногда яйцо, густой пивной соус, картошка; ориентир €10–14, салфетки берите пачкой — соус не прощает белой рубашки. Классика споров стоит в одних и тех же именах: Santiago, Brasão, Bufete Fase, Cufra; очередь и тепло соуса говорят больше, чем мем. Tripas à moda do Porto — рубец с фасолью, тяжёлое и честное; не на первое свидание с городом, но хотя бы раз, когда вы уже не турист с картой и голод уже не паника. Caldo verde — картофель, couve-galega, chouriço, azeite; дома и в tasca часто лучше туристических €8 у реки, где суп пахнет видом, а не капустой.",
      "Дальше — по желанию и по сезону, без спешки, которую навязывает чужой сторис. Alheira, cabrito или borrego по воскресеньям в Minho, когда в доме ещё слышно, как остывает утро. Rojões зимой, когда в квартире холодно и хочется жира, который помнит Minho. Peixe grelhado в Matosinhos, когда витрина блестит, а не когда английское меню мигает у Ribeira. Sardinhas — июнь–август: São João без них — как Новый год без шампанского, и запах на улице сам говорит, что сезон открыт.",
      "Главное: одно культовое блюдо за раз. Francesinha — обед, не «закуска пополам на голодный желудок».",
    ],
    images: [
      {
        src: `${IMG}/francesinha.webp`,
        alt: "Francesinha — культовый сэндвич Порту",
        caption: "Francesinha: хлеб, мясо, сыр, соус — салфетки берите пачкой.",
        credit: "Café Santiago",
        creditUrl: "https://cafesantiago.pt/",
      },
      {
        src: `${IMG}/tripas.webp`,
        alt: "Tripas à moda do Porto",
        caption: "Tripas — не «страшный рубец для туристов», а характер города.",
        credit: "Café Santiago",
        creditUrl: "https://cafesantiago.pt/",
      },
      {
        src: `${IMG}/sardinhas.webp`,
        alt: "Жареные сардины",
        caption: "Sardinhas assadas — лето и São João; запах на улице = сезон открыт.",
        credit: "Café Santiago",
        creditUrl: "https://cafesantiago.pt/",
      },
      {
        src: `${IMG}/bacalhau.webp`,
        alt: "Блюдо из bacalhau",
        caption: "Bacalhau в Norte — не один рецепт; спросите à Brás / com natas / à Gomes de Sá.",
        credit: "Café Santiago",
        creditUrl: "https://cafesantiago.pt/",
      },
    ],
    bullets: [
      "Закажите francesinha в Santiago или Brasão — сравните соус, не мемы 2019 года.",
      "Попробуйте tripas отдельно от «лёгкого» ужина; это плотный жанр.",
      "Спросите preço do dia на рыбу в Matosinhos — не берите неоновое «tourist menu».",
      "Дождитесь лета для sardinhas; зимой берите caldo verde и cabrito.",
    ],
  },
  {
    heading: "Домашние рецепты: 4 блюда на кухне релоканта",
    section_kind: "action_guide",
    paragraphs: [
      "Ресторан четыре раза в неделю бьёт по бюджету быстрее, чем кажется на второй месяц. Вечером вы открываете дверь, и квартира пахнет чужим коридором, а не городом — пока не принесёте с рынка зелень и не поставите кастрюлю. Mercado плюс сорок минут у плиты — и Porto входит в комнату без очереди на francesinha. Начните с caldo verde и bacalhau com natas: минимум риска, максимум ощущения, что вы здесь живёте, а не снимаете жильё на Airbnb. Голод, который вы сами накормили, тише чата.",
      "Граммовки ниже — ориентир на две–три порции; соль — после вымачивания bacalhau, иначе блюдо оглохнет. На наклейке читайте demolhado (вымоченный) и seco (сухой) до кассы: это разные планы на вечер, и касса не прощает спешки. Bolhão или Matosinhos — на зелень и рыбу; Continente или Pingo Doce — на базу, картофель, natas, azeite. Caldo verde собирается просто: 400 г картофеля сварить и пробить, 150–200 г couve тонкой стружкой в кипяток на 3–5 минут, chouriço, azeite, соль, рядом broa. Bacalhau com natas — 400 г вымоченного bacalhau с луком, 500 г картофеля, 200–250 мл natas, сыр, 180 °C примерно 25–30 минут; вымачивание 24–48 часов, воду менять, пока соль ещё слушается.",
      "Когда на улице сыро, а в чате снова спор про соус, домашний molho к francesinha — тихий ответ без очереди. Мясо и сосиски на хлебе с сыром, соус из пива, томата и бульона 15–20 минут, гриль, картошка отдельно — и голод становится домашним, а не туристическим. Sardinhas дома: крупная соль 20 минут, гриль до кожи, картофель, салат, Vinho Verde; без гриля — духовка 220 °C и открытое окно, потому что запах лета не спрашивает соседей. Cabrito — воскресный проект с маринадом с вечера; rojões — Minho в кастрюле, когда не хочется на A3. Рынок даёт характер; супермаркет — спокойствие будней.",
      "Главное: Bolhão / Matosinhos на закупки, Continente на базу; «demolhado» vs «seco» на наклейке bacalhau читайте до кассы.",
    ],
    images: [
      {
        src: `${IMG}/sopa.webp`,
        alt: "Овощной / зелёный суп в португальском стиле",
        caption: "Caldo verde дома: блендер + тонкая стружка капусты в конце.",
        credit: "Café Santiago",
        creditUrl: "https://cafesantiago.pt/",
      },
      {
        src: `${IMG}/molho.webp`,
        alt: "Соус к francesinha",
        caption: "Molho da francesinha — душа блюда; дома экспериментируйте.",
        credit: "Café Santiago",
        creditUrl: "https://cafesantiago.pt/",
      },
      {
        src: `${IMG}/cabrito.webp`,
        alt: "Cabrito assado",
        caption: "Cabrito — воскресный проект: маринад с вечера.",
        credit: "Café Santiago",
        creditUrl: "https://cafesantiago.pt/",
      },
      {
        src: `${IMG}/rojoes.webp`,
        alt: "Rojões à Minhota",
        caption: "Rojões — Minho в кастрюле, когда не хочется на A3.",
        credit: "Café Santiago",
        creditUrl: "https://cafesantiago.pt/",
      },
    ],
    bullets: [
      "**Caldo verde:** 400 г картофеля сварить и пробить; 150–200 г couve тонко в кипяток 3–5 мин; chouriço, azeite, соль; подать с broa.",
      "**Bacalhau com natas:** 400 г вымоченного bacalhau + лук; 500 г картофеля; natas 200–250 мл; сыр; 180 °C ~25–30 мин. Вымачивание 24–48 ч, воду менять.",
      "**Francesinha (дом):** мясо/сосиски на хлебе с сыром; соус пиво+томат+бульон 15–20 мин; гриль; картошка отдельно.",
      "**Sardinhas:** крупная соль 20 мин; гриль до кожи; картофель, салат, Vinho Verde. Без гриля — духовка 220 °C и вентиляция.",
      "Купите зелень и рыбу на рынке; базу — в Continente/Pingo Doce.",
    ],
  },
  {
    heading: "Крутейшие рестораны: карта по уровням",
    section_kind: "practice",
    paragraphs: [
      "В Porto очередь и цена растут быстрее, чем понимание меню. Пятница, девять вечера, без reserva — вы стоите у двери и смотрите, как чужие столы уже заняты, а голод становится раздражением, почти обидой. Воздух тёплый, из зала пахнет маслом и вином, и вы понимаете, что город ужинает без вас не из злости, а потому что места кончились раньше, чем ваш день. Рабочая формула проста и почти скучна: один fine dining в квартал плюс две сильные повседневные точки. Не «закрыть Michelin за уикенд» — иначе останутся фото, счёт и вкус, который вы не успели заметить.",
      "Повседневный культ держится на очереди и салфетках. Café Santiago — легенда francesinha, очередь здесь норма, как дождь в ноябре. Brasão — бронь онлайн, удобно гостям, когда не хочется стоять на улице с чужим голодом. События живут иначе: AntiQVVM у садов Cristal, Pedro Lemos в Foz, The Yeatman в Gaia с видом на Ribeira, Euskalduna и Cantinho do Avillez — смотрите актуальный статус на сайте, не на скрине из чата и не на чужой звезде в сторис. Рыба — Matosinhos по витрине, не по английскому неону у реки. В Braga cabrito и bacalhau в tasca у Sé часто честнее «туристической площади», где дороже, слабее и уже не пахнет воскресеньем.",
      "Бюджет на человека без вина (ориентир 2026) не романтика, а способ не удивляться счёту в темноте. Menu do dia €10–16; francesinha €12–18; mid-range €30–50; tasting €120–250+. Цифры плавают — сайт и TheFork перед бронью важнее памяти о прошлом ужине, который казался дешёвым, пока не кончилось лето. Reserva на 20:00 в сезон — не стыд, а способ не спорить с дверью, когда голод уже громче вежливости. Walk-in на tasting — лотерея, в которой выигрывает не храбрость, а чужой стол.",
      "Главное: reserva на 20:00 в сезон — норма; walk-in на tasting — лотерея.",
    ],
    images: [
      {
        src: `${IMG}/brasao-1.webp`,
        alt: "Brasão — интерьер / атмосфера ресторана в Порту",
        caption: "Brasão — сильная francesinha и понятный сервис.",
        credit: "Brasão",
        creditUrl: "https://brasao.pt/",
      },
      {
        src: `${IMG}/brasao-5.webp`,
        alt: "Brasão — зал ресторана",
        caption: "На пятницу вечером — reserva.",
        credit: "Brasão",
        creditUrl: "https://brasao.pt/",
      },
      {
        src: `${IMG}/pedro-lemos.webp`,
        alt: "Pedro Lemos — fine dining в Порту",
        caption: "Pedro Lemos — Foz, tasting, бронь заранее; это событие.",
        credit: "Pedro Lemos",
        creditUrl: "https://pedrolemos.pt/",
      },
      {
        src: `${IMG}/peixe.webp`,
        alt: "Рыбное блюдо / grelhada",
        caption: "Рыба и гриль — Matosinhos и Foz, не только Baixa.",
        credit: "Café Santiago",
        creditUrl: "https://cafesantiago.pt/",
      },
    ],
    bullets: [
      "Забронируйте Brasão / AntiQVVM / Pedro Lemos на сайте или TheFork до пятницы.",
      "Выберите Matosinhos по свежести витрины, не по неоновой вывеске.",
      "Сравните menu do dia у дома с туристическим Ribeira — разница в цене и вкусе.",
      "Заложите tasting как событие квартала, не как ужин после работы.",
    ],
  },
  {
    heading: "Пошагово: гастро-уикенд релоканта",
    section_kind: "action_guide",
    paragraphs: [
      "Без тихого плана получите только francesinha и счёт в туристическом Ribeira — и утро с ощущением, что город вас обманул. Красивый уикенд проще, чем кажется, если не пытаться съесть Norte за двое суток. Пятница пахнет рыбой и морем: метро в Matosinhos, grelhada, Vinho Verde, дорога домой без руля после третьего бокала. Голод утихает, ночной воздух становится мягче, и город наконец перестаёт быть «местом на карте». Вы едете не как турист с чеклистом, а как человек, который уже знает, куда девать вечер.",
      "Суббота начинается с рынка. Bolhão утром — сыр, фрукты, зелень, голоса и влажный воздух под крышей, ещё до жары, которая потом сядет на набережную. В обед — francesinha или tripas, не оба: иначе вечер уже не про вкус, а про тяжесть, которую не снимет даже вид на реку. Вечером — petiscos либо заранее забронированный mid-range, когда свет ещё мягкий, а столы не все заняты. Воскресенье — одно событие: cabrito в Braga или Guimarães или tasting в Foz/Gaia. На неделе — menu do dia и caldo verde из остатков рынка, пока квартира снова не начнёт пахнуть чужим коридором.",
      "Гостям из чата хватает простой формулы, если не кормить их чужой жадностью. Один «вау» — Yeatman или Pedro Lemos — и один «настоящий»: tasca или Matosinhos, где витрина ещё честна. Две ловушки у реки с английским меню хуже одного честного ужина и одного события. Не клеите всё в один день: к понедельнику останется только усталость и чужой соус во рту. Город никуда не денется; голод вернётся сам, и его можно будет накормить снова.",
      "Главное: одно «вау» и одно честное — лучше двух ловушек у реки.",
    ],
    bullets: [
      "Съездите в пятницу метро в Matosinhos: grelhada + Vinho Verde; домой без руля.",
      "Зайдите в субботу утром на Bolhão — сыр, фрукты, зелень.",
      "Выберите в субботу обед: francesinha или tripas — одно блюдо.",
      "Забронируйте субботний вечер: petiscos или mid-range с reserva.",
      "Заложите воскресенье: Minho cabrito или tasting в Foz/Gaia — одно событие.",
    ],
  },
  {
    heading: "Где чаты и тарелка расходятся",
    section_kind: "gap",
    paragraphs: [
      "Чат вечен в споре «лучшая francesinha — только X». На тарелке важнее свежий соус и очередь короче сорока минут — и то, успеете ли вы доесть, пока соус ещё тёплый. Ribeira «всегда свежая рыба» часто оказывается заморозкой и наценкой; peixe честнее у порта, где витрина не врёт неоном. Вы стоите у меню и понимаете: мем из 2019 года не пахнет так, как сегодняшний соус. Голод не читает скрины; он читает запах.",
      "Michelin не обязан стать вашим блюдом. Если хочется bifana, двенадцать курсов tasting — чужой формат, даже если звёзды красиво выглядят в сторис и кто-то уже поставил «must». Чаевые «как в США 20%» здесь не норма: округление или 5–10% за отличный сервис достаточно, без чувства вины и без театра у стола. Витрина и ementa важнее скрина из чата — и тише спора, который всё равно не кончится. Вы едите не рейтинг, а вечер.",
      "Главное: витрина и ementa важнее мема из чата 2019 года.",
    ],
    bullets: [
      "Сравните соус и очередь сегодня — не верьте «только ресторан X» из чата.",
      "Выберите рыбу в Matosinhos чаще, чем «свежую» в Ribeira.",
      "Разделите tasting и bifana: Michelin — формат, не гарантия вашего вкуса.",
      "Округлите счёт или оставьте 5–10% — не 20% «как в США».",
    ],
  },
  {
    heading: "Типичные ошибки релокантов за столом",
    section_kind: "practice",
    paragraphs: [
      "Оптимально в первый месяц — одно культовое, одно домашнее и одно «дорогое», не больше. Классика промахов знакома по чатам и по собственному голоду, который кажется умнее плана: francesinha «пополам на голодный желудок» оставляет только тяжесть, а tasting в день прилёта с джетлагом тратит деньги на чужой вечер, пока язык ещё не чувствует соли. Игнор alergias при tripas и alheira, английское меню у реки за двойную цену, руль после vinho — всё это приходит не из злости, а из спешки. Walk-in в пятницу на 20:00 без reserva кончается дверью, которая уже закрыта для вас, пока внутри ещё пахнет ужином.",
      "Португалия ужинает поздно, но хорошие залы заняты раньше, чем кажется. Бронь — не стыд и не «для туристов»; это способ не стоять на улице с голодом и усталостью, когда ночной воздух уже ничего не обещает. После ужина с вином ключи лучше оставить дома — см. [винный гайд](/notes/" +
        WINES_WINERIES_NORTE_SLUG +
        "). Город никуда не денется; соус подождёт до завтрашнего обеда. Голод, который вы отложили на день, не обижается — он возвращается честнее, чем очередь.",
      "Главное: Португалия ужинает поздно, но хорошие залы заняты раньше — бронь не стыд.",
    ],
    bullets: [
      "Не берите francesinha как закуску — это плотный обед.",
      "Не бронируйте tasting в день прилёта — деньги жалко, вкус не тот.",
      "Не садитесь за руль после ужина с vinho — см. [винный гайд](/notes/" + WINES_WINERIES_NORTE_SLUG + ").",
      "Не приходите в пятницу на 20:00 без reserva в сильный зал.",
    ],
  },
];

const keyTakeaways = [
  "Официально: рынок (Bolhão), Matosinhos для рыбы, бронь на сайте ресторана — надёжнее мемов из чата.",
  formatPracticeTakeaway({
    channels: ["por_tugal", "chatlisboa"],
    period: "2025–2026",
    claim:
      "для новичка в Porto рабочая тройка — francesinha (Santiago/Brasão), peixe в Matosinhos и один mid/fine (AntiQVVM, Pedro Lemos, Yeatman)",
    forReader: "не закрывайте весь Michelin-лист за один уикенд",
  }),
  formatPracticeTakeaway({
    channels: ["por_tugal"],
    period: "2026",
    claim:
      "caldo verde и bacalhau com natas дома с рынка закрывают будни дешевле и честнее туристического меню у Ribeira",
    forReader: "ресторан оставляйте для события и гостей",
  }),
  "Расхождение: «лучшая francesinha навсегда» в чате ≠ ваш вкус; важнее свежий соус, очередь и гигиена.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "С чего начать, если я только переехал в Порту?",
    a: "Неделя 1: francesinha (Café Santiago или Brasão) + grelhada в Matosinhos. Неделя 2: caldo verde дома и bacalhau в хорошей tasca. Раз в месяц — одно бронированное «событие» (AntiQVVM / Pedro Lemos / Yeatman).",
  },
  {
    q: "Где лучшая francesinha?",
    a: "Единого ответа нет. Классика споров — Café Santiago, Brasão, Bufete Fase, Cufra. Берите ту, где короче очередь и соус не горчит. Для гостей удобнее Brasão с бронью.",
  },
  {
    q: "Как есть недорого в будни?",
    a: "Menu do dia рядом с домом (€10–16), рынок + домашние caldo verde, bifana в локальной snack-bar. Туристический Ribeira на обед — самый дорогой способ поесть средне.",
  },
  {
    q: "Нужна ли бронь в Michelin и mid-range?",
    a: "Да, особенно пятница–суббота и tasting. TheFork / сайт / телефон. Walk-in на 21:00 без reserva в сезон часто = отказ.",
  },
  {
    q: "Что заказать с детьми?",
    a: "Peixe grelhado, frango, massa, soup, bifana без острого. Francesinha — на свой страх. В fine dining уточняйте детское меню заранее.",
  },
  {
    q: "Как связать еду и вино Norte?",
    a: "Vinho Verde к сардинам и морепродуктам; тихий Douro к мясу и rojões; Port — к десерту или сыру. Подробнее — гайд по винам и quinta.",
  },
];

export const GASTRONOMY_NORTE_GUIDE = {
  slug: GASTRONOMY_NORTE_SLUG,
  category: "Досуг",
  content_kind: "guide" as ContentKind,
  title: "Гастрономия Norte: блюда, рецепты дома и лучшие рестораны Porto/Braga",
  excerpt:
    "Francesinha, tripas, caldo verde, bacalhau, cabrito: что есть в Norte, как готовить дома с рынка и куда бронировать — от Santiago и Brasão до Pedro Lemos и Yeatman.",
  seo_title: "Гастрономия Norte — блюда и рестораны 2026",
  seo_description:
    "Гастрономия Norte 2026: francesinha, tripas, caldo verde, bacalhau, Matosinhos, Brasão, Santiago, Pedro Lemos — живой гид для релокантов Porto и Braga.",
  quick_answer:
    "Утро в Porto начинается с голода. Не с музея — с пустого желудка и воздуха у Ribeira, где уже пахнет жареным, мокрым камнем и чужим меню на английском. В чате двенадцать «лучших francesinha», и каждая как будто обязательна сегодня. Norte кормит плотнее Лиссабона: соус и tripas в городе, caldo verde и cabrito в Minho, гриль у порта в Matosinhos. Закройте культ в Santiago или Brasão, рынок Bolhão и два домашних рецепта; раз в месяц — tasting или вид на реку. Рыба — к порту. Бронь — на пятницу.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "Visit Porto", url: "https://visitporto.travel/" },
    { title: "Visit Porto & Norte", url: "https://www.visitportoandnorth.travel/" },
    { title: "Café Santiago", url: "https://cafesantiago.pt/" },
    { title: "Brasão", url: "https://brasao.pt/" },
    { title: "Pedro Lemos", url: "https://pedrolemos.pt/" },
    { title: "AntiQVVM", url: "https://www.antiqvvm.pt/" },
    { title: "The Yeatman", url: "https://www.the-yeatman-hotel.com/" },
    { title: "Mercado do Bolhão", url: "https://www.mercadobolhao.pt/" },
  ],
  topic_tags: ["dosug", "portugal", "norte", "gastronomia", "eda"],
  hashtags: buildNoteHashtags({
    topicTags: ["dosug", "portugal", "norte"],
    contentKind: "guide",
    extra: ["porto", "braga", "francesinha", "restaurantes", "receitas"],
  }),
  source_channel: "editorial+official",
  source_label: "editorial:gastronomy-norte-2026",
};
