/**
 * Norte gastronomy — dishes, home recipes, restaurants for relocants (Porto/Braga lens).
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
      "Зачем вам это сейчас: вы живёте в Porto/Braga — еда здесь не «туристический чеклист на 3 дня», а еженедельный ритм: mercado, menu do dia, пятничный peixe в Matosinhos.",
      "Что делать: разделить карту на **культ улицы** (francesinha, bifana, sardinha), **классику дома** (tripas, caldo verde, cabrito) и **fine dining** (Michelin / tasting menu) — и не смешивать ожидания.",
      "Главное: Visit Porto & Norte и Turismo de Portugal дают общий фон; бронь и ementa — только у ресторана.",
    ],
    bullets: [
      "Visit Porto / Visit Porto & Norte — гастромаршруты и события (не рейтинг «лучший francesinha»).",
      "ASAE — контроль гигиены заведений; жалобы на безопасность еды — через официальные каналы, не только чат.",
      "Mercado do Bolhão (Porto) — точка свежих продуктов после реконструкции; утро будня лучше субботы.",
      "Matosinhos — зона marisqueira и grelhados у порта; доезд метро A / автобус.",
      "Вино к столу — отдельный слой: [вина и винодельни Norte](/notes/" + WINES_WINERIES_NORTE_SLUG + ").",
      "Выезд в Minho/Douro на еду — [туризм внутри PT](/notes/" + DOMESTIC_TOURISM_NORTE_SLUG + ").",
    ],
  },
  {
    heading: "Культовые блюда Norte: что заказать первым",
    section_kind: "practice",
    paragraphs: [
      "Что делать: за 2–3 недели закрыть «обязательную программу» без героизма «всё меню подряд».",
      "Зачем: чат por_tugal спорит про «лучшую francesinha», но новичок выигрывает от понимания блюда, а не от 12-й версии соуса.",
    ],
    images: [
      {
        src: `${IMG}/francesinha.webp`,
        alt: "Francesinha — культовый сэндвич Порту",
        caption: "Francesinha: хлеб, мясо, сыр, соус — есть стоя или сидя, но салфетки берите пачкой.",
        credit: "Café Santiago",
        creditUrl: "https://cafesantiago.pt/",
      },
      {
        src: `${IMG}/tripas.webp`,
        alt: "Tripas à moda do Porto",
        caption: "Tripas — не «страшный рубец для туристов», а историческое блюдо города (и характер).",
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
        caption: "Bacalhau в Norte — не один рецепт; спросите «à Brás / com natas / à Gomes de Sá».",
        credit: "Café Santiago",
        creditUrl: "https://cafesantiago.pt/",
      },
    ],
    bullets: [
      "**Francesinha** — портовая икона: слоёный сэндвич (говядина/сосиски/ветчина), сыр, иногда яйцо, густой пивной соус, картошка. Ориентир €10–14. Классика споров: Café Santiago, Brasão, Bufete Fase, Cufra.",
      "**Tripas à moda do Porto** — рубец с фасолью и мясом; тяжёлое, сытное, «не на первое свидание с городом», но обязательно попробовать раз.",
      "**Caldo verde** — зелёный суп Minho: картофель, couve-galega, кольцо chouriço, azeite. Дома и в tasca — чаще лучше, чем в туристическом меню за €8.",
      "**Alheira** — колбаса с хлебом (исторически — «маскировка» в Trás-os-Montes); жареная с яйцом и картошкой. Не путать с chouriço.",
      "**Cabrito / borrego** — козлёнок/ягнёнок в духовке; воскресный семейный жанр в Braga/Minho.",
      "**Rojões à Minhota** — свинина кусками с кровяной колбасой и каштанами — мощный Minho winter food.",
      "**Peixe grelhado / marisco** — Matosinhos: свежий гриль, цена по весу; спросите «preço do dia».",
      "**Sardinhas** — июнь–август; São João без сардин — как Новый год без шампанского.",
    ],
  },
  {
    heading: "Домашние рецепты: 4 блюда на кухне релоканта",
    section_kind: "action_guide",
    paragraphs: [
      "Зачем вам это сейчас: ресторан 4 раза в неделю бьёт по бюджету; mercado + 40 минут у плиты = вкус Norte без очереди на francesinha.",
      "Что делать: начать с caldo verde и bacalhau com natas — минимум риска, максимум «пахнет Португалией».",
      "Главное: граммовки ориентировочные на 2–3 порции; соль — по вкусу после вымачивания bacalhau.",
    ],
    images: [
      {
        src: `${IMG}/sopa.webp`,
        alt: "Овощной / зелёный суп в португальском стиле",
        caption: "Caldo verde дома: блендер + тонкая стружка капусты в конце — секрет текстуры.",
        credit: "Café Santiago",
        creditUrl: "https://cafesantiago.pt/",
      },
      {
        src: `${IMG}/molho.webp`,
        alt: "Соус к francesinha",
        caption: "Molho da francesinha — душа блюда; дома экспериментируйте, в ресторане не просите «без соуса».",
        credit: "Café Santiago",
        creditUrl: "https://cafesantiago.pt/",
      },
      {
        src: `${IMG}/cabrito.webp`,
        alt: "Cabrito assado",
        caption: "Cabrito — воскресный проект: маринад с вечера, духовка без спешки.",
        credit: "Café Santiago",
        creditUrl: "https://cafesantiago.pt/",
      },
      {
        src: `${IMG}/rojoes.webp`,
        alt: "Rojões à Minhota",
        caption: "Rojões — когда хочется Minho в кастрюле, а не в машине на A3.",
        credit: "Café Santiago",
        creditUrl: "https://cafesantiago.pt/",
      },
    ],
    bullets: [
      "**Caldo verde (2–3 порции):** 400 г картофеля очистить, сварить в воде/бульоне до мягкости, размять или пробить блендером. 150–200 г couve-galega (или кале) нарезать очень тонко, всыпать в кипяток на 3–5 мин. Добавить 1–2 ломтика chouriço, струю azeite, соль/перец. Подать с broa (кукурузный хлеб), если найдёте.",
      "**Bacalhau com natas:** 400 г вымоченного bacalhau разобрать на волокна, слегка обжарить с луком. 500 г картофеля — ломтики, обжарить или запечь. Смешать с бешамелем/сливками (200–250 мл natas + немного молока), сыр сверху, духовка 180 °C ~25–30 мин до корочки. Вымачивание рыбы: 24–48 ч в воде в холодильнике, воду менять.",
      "**Francesinha (упрощённо на 2):** обжарить 2 bifes / сосиски + ломтики fiambre. Собрать на хлебе: мясо → сыр → второй хлеб. Залить соусом (пиво + томат + бульон + немного пири-пири, уварить 15–20 мин), сверху сыр и под гриль. Картошка фри отдельно. Это не «секрет Santiago», а домашний скелет.",
      "**Sardinhas na brasa (сезон):** свежие сардины посолить крупной солью за 20 мин, гриль/сковорода-гриль до хрустящей кожи. Подать с варёным картофелем, салатом и Vinho Verde. Дом без гриля — духовка 220 °C на решётке + вентиляция (запах будет).",
      "Закупки: Continente/Pingo Doce — база; Bolhão / Mercado de Matosinhos — рыба и зелень; для bacalhau смотрите наклейку «demolhado» vs «seco».",
    ],
  },
  {
    heading: "Крутейшие рестораны: карта по уровням",
    section_kind: "practice",
    paragraphs: [
      "Что делать: выбрать **один** fine dining в квартал + **две** сильные повседневные точки — не пытаться «закрыть Michelin за уикенд».",
      "Зачем: в Porto очередь и цена растут быстрее, чем ваше понимание меню; бронь спасает нервы.",
    ],
    images: [
      {
        src: `${IMG}/brasao-1.webp`,
        alt: "Brasão — интерьер / атмосфера ресторана в Порту",
        caption: "Brasão — сеть с сильной francesinha и понятным сервисом; удобно для гостей из чата.",
        credit: "Brasão",
        creditUrl: "https://brasao.pt/",
      },
      {
        src: `${IMG}/brasao-5.webp`,
        alt: "Brasão — зал ресторана",
        caption: "На пятницу вечером — reserva; walk-in в центр часто = ожидание.",
        credit: "Brasão",
        creditUrl: "https://brasao.pt/",
      },
      {
        src: `${IMG}/pedro-lemos.webp`,
        alt: "Pedro Lemos — fine dining в Порту",
        caption: "Pedro Lemos — Foz, tasting menu, бронь заранее; это «событие», не ужин после работы.",
        credit: "Pedro Lemos",
        creditUrl: "https://pedrolemos.pt/",
      },
      {
        src: `${IMG}/peixe.webp`,
        alt: "Рыбное блюдо / grelhada",
        caption: "Для рыбы и гриля смотрите Matosinhos и Foz — не только Baixa с фото-меню.",
        credit: "Café Santiago",
        creditUrl: "https://cafesantiago.pt/",
      },
    ],
    bullets: [
      "**Café Santiago (Porto)** — легенда francesinha; очередь норма; еда быстрее, чем «романтика». Сайт: cafesantiago.pt.",
      "**Brasão (несколько точек)** — франчезинья + contemporâneo comfort; удобно бронировать онлайн: brasao.pt.",
      "**AntiQVVM (Jardins do Palácio de Cristal)** — fine dining у садов; вид + кухня; reserva обязательна: antiqvvm.pt.",
      "**The Yeatman (Gaia)** — hotel dining с видом на Ribeira; винотека и tasting; бюджет «особый вечер»: the-yeatman-hotel.com.",
      "**Pedro Lemos (Foz)** — авторская кухня, tasting; один из якорей гастросцены Porto: pedrolemos.pt.",
      "**Euskalduna Studio** — intimate tasting, бронь сильно заранее; проверяйте актуальный адрес/статус на офсайте.",
      "**Cantinho do Avillez (Porto)** — более доступный вход в вселенную José Avillez; petiscos + wine bar вайб.",
      "**Matosinhos seafood:** локальные marisqueiras у Rua Heróis de França / зоны порта — выбирайте по свежести витрины и «preço do dia», не по неоновой вывеске на английском.",
      "**Braga:** классика Minho (cabrito, bacalhau) в tasca у Sé и современные bistro в центре — смотрите отзывы свежее 6 мес.; «туристическая площадь» часто дороже и слабее.",
      "**Бюджет ориентир (2026, на человека без вина):** tasca/menu do dia €10–16; francesinha lunch €12–18; mid-range ужин €30–50; tasting Michelin €120–250+.",
    ],
  },
  {
    heading: "Пошагово: гастро-уикенд релоканта",
    section_kind: "action_guide",
    paragraphs: [
      "Зачем: без плана получите только francesinha и счёт в туристическом Ribeira.",
      "Что делать: пятница peixe → суббота рынок + классика → воскресенье Minho или fine dining.",
    ],
    bullets: [
      "Шаг 1 — Пятница вечер: метро в Matosinhos, grelhada peixe + Vinho Verde; домой без машины «после третьего бокала».",
      "Шаг 2 — Суббота утро: Bolhão — сыр, фрукты, зелень; кофе в районе без очереди к Livraria Lello.",
      "Шаг 3 — Суббота обед: francesinha (Santiago / Brasão) **или** tripas — не оба за раз.",
      "Шаг 4 — Суббота вечер: либо petiscos + вино, либо заранее забронированный mid-range (AntiQVVM / Avillez / сильный bistro).",
      "Шаг 5 — Воскресенье: Braga/Guimarães на cabrito **или** tasting в Foz/Gaia — одно событие.",
      "Шаг 6 — На неделе: 1–2 раза menu do dia рядом с домом/коворкингом; дома caldo verde из остатков рынка.",
      "Шаг 7 — Гостям из чата: один «вау» (вид Yeatman / Pedro Lemos) + один «настоящий» (tasca / Matosinhos) — лучше двух туристических ловушек.",
    ],
  },
  {
    heading: "Где чаты и тарелка расходятся",
    section_kind: "gap",
    bullets: [
      "Чат: «лучшая francesinha — только X» → вкусы разные; важнее свежий соус и очередь <40 мин, чем мем 2019 года.",
      "«В Ribeira всегда свежая рыба» → часто заморозка и наценка; за peixe езжайте в Matosinhos.",
      "«Michelin = обязательно понравится» → tasting — формат; если хотите bifana, не бронируйте 12 курсов.",
      "«Чаевые как в США 20%» → в PT не норма; округление / 5–10% за отличный сервис достаточно.",
      "«Caldo verde из банки = то же самое» → нет; домашний за 25 минут ближе к Minho.",
    ],
  },
  {
    heading: "Типичные ошибки релокантов за столом",
    section_kind: "practice",
    paragraphs: [
      "Оптимально: одно культовое + одно домашнее + одно «дорогое» в месяц. Ошибки ниже — классика первых месяцев в Porto.",
    ],
    bullets: [
      "Ошибка: francesinha на двоих «пополам на голодный желудок» без плана — это плотный обед, не закуска.",
      "Ошибка: бронь Michelin на день прилёта с джетлагом — деньги жалко, вкус не тот.",
      "Ошибка: игнорировать alergias / vegetariano при заказе tripas и alheira.",
      "Ошибка: платить «меню на английском у реки» x2 за посредственный bacalhau.",
      "Ошибка: вести машину после ужина с vinho — см. здравый смысл и [винный гайд](/notes/" + WINES_WINERIES_NORTE_SLUG + ").",
      "Ошибка: не брать reserva в пятницу–субботу на 20:00 — Португалия ужинает поздно, но хорошие залы Occupied.",
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
    a: "Menu do dia в районе дома/офиса (€10–16), рынок + домашние caldo verde / omelete, bifana в локальной snack-bar. Туристический Ribeira на обед — самый дорогой способ поесть средне.",
  },
  {
    q: "Нужна ли бронь в Michelin и mid-range?",
    a: "Да, особенно пятница–суббота и tasting menu. TheFork / сайт ресторана / телефон. Walk-in на 21:00 без reserva в сезон часто заканчивается отказом.",
  },
  {
    q: "Что заказать с детьми?",
    a: "Peixe grelhado, frango, massa, soup, bifana без острого соуса. Francesinha — на свой страх (остро/сытно). В fine dining уточняйте детское меню заранее — не везде рады.",
  },
  {
    q: "Как связать еду и вино Norte?",
    a: "Vinho Verde к сардинам и морепродуктам; тихий Douro к мясу и rojões; Port — к десерту или сыру, не «к франчезинье литром». Подробнее — гайд по винам и quinta.",
  },
];

export const GASTRONOMY_NORTE_GUIDE = {
  slug: GASTRONOMY_NORTE_SLUG,
  category: "Досуг",
  content_kind: "guide" as ContentKind,
  title: "Гастрономия Norte: блюда, рецепты дома и лучшие рестораны Porto/Braga",
  excerpt:
    "Francesinha, tripas, caldo verde, bacalhau, cabrito: что есть в Norte, как готовить дома с рынка и куда бронировать — от Café Santiago и Brasão до Pedro Lemos и Yeatman.",
  seo_title: "Гастрономия Norte — блюда и рестораны 2026",
  seo_description:
    "Гастрономия Norte: francesinha, tripas, рецепты caldo verde и bacalhau, Matosinhos, Brasão, Santiago, Pedro Lemos — гид для релокантов Porto/Braga.",
  quick_answer:
    "Norte кормит плотнее Лиссабона: francesinha и tripas в Порту, caldo verde и cabrito в Minho, гриль в Matosinhos. Закройте культ (Santiago/Brasão), рынок Bolhão + два домашних рецепта, раз в месяц — tasting или вид на реку (Pedro Lemos / Yeatman / AntiQVVM). Ribeira с английским меню — ловушка; рыба — к порту, бронь — на пятницу.",
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
