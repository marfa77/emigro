/**
 * Norte wines & wineries — Douro / Port / Vinho Verde for relocants.
 * Remarque leisure voice: river air, lodges, quinta heat. Per-winery cards:
 * history · why visit · what to know · everyday + collectible buys + bottle stills.
 * Bottle pack: Emigro editorial still-life (not official packshots).
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { formatPracticeTakeaway } from "@/lib/community-notes/practice-format";
import { CAR_PORTUGAL_GUIDE_SLUG } from "@/lib/community-notes/guides/car-portugal-buy-rent-import";
import { DOMESTIC_TOURISM_NORTE_SLUG } from "@/lib/community-notes/guides/domestic-tourism-portugal-norte";
import { TOLLS_FINES_ACCIDENTS_GUIDE_SLUG } from "@/lib/community-notes/guides/tolls-fines-accidents-norte-portugal";
import type {
  CommunityNoteFaq,
  ContentKind,
  NoteBodyImage,
  NoteBodySection,
} from "@/lib/community-notes/types";

export const WINES_WINERIES_NORTE_SLUG = "vina-vinodelni-norte-douro-vinho-verde-2026";

const GLOSSARY_INTRO =
  "Слова с этикетки, с сайта quinta и с билета на Linha do Douro — чтобы Vintage и Vinho Verde не путались у дегустационного стола, пока в бокале ещё держится свет.";

const DISCLAIMER =
  "**Emigro:** энотуризм — не приглашение садиться за руль после дегустации. Такси, Uber или CP домой: за рулём с алкоголем в Португалии — штрафы и лишний риск для ВНЖ. Цены и слоты уточняйте на сайтах quinta. Фото бутылок — редакционные still-life Emigro (каталожный свет), не официальные packshot брендов; визитные кадры lodges/quinta — с сайтов производителей. Не юридическая консультация.";

const IMG = "/images/community-notes/inline/vina-norte";
const BOTTLES = `${IMG}/bottles`;
const STILL = "Emigro · editorial still-life";

function bottle(file: string, name: string, why: string): NoteBodyImage {
  return {
    src: `${BOTTLES}/${file}.webp`,
    alt: name,
    caption: why,
    credit: STILL,
  };
}

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(glossaryForSlug(WINES_WINERIES_NORTE_SLUG)!, GLOSSARY_INTRO),
    paragraphs: [GLOSSARY_INTRO, DISCLAIMER],
  },
  {
    heading: "Официально: карта вин Norte",
    section_kind: "official",
    paragraphs: [
      "Утром в Porto воздух ещё держит ночную прохладу: сырой камень, река, чей-то кофе с Ribeira. К полудню уже пахнет нагретым гранитом — и Douro с Vinho Verde перестают быть «отпуском когда-нибудь». Это ближайшие выходные, если вы уже живёте в Norte.",
      "Три опоры рядом, но дышат по-разному. Долина **Douro** — тихие вина и Port; погреба **Gaia** на южном берегу; **Vinho Verde** в Minho — другой свет и другие дороги. Port/Douro — **IVDP** (ivdp.pt); Vinho Verde — CVRVV на vinhoverde.pt. Alto Douro с 2001 в UNESCO. Demarcação Douro — с указа Помбала **1756**.",
      "Ниже — одиннадцать домов, куда реально ехать из Porto/Braga: история, зачем визит, что знать, что взять простым столом и что — в коллекцию. Поезд Linha do Douro — cp.pt; общий контекст выходных — [внутренний туризм Norte](/notes/" +
        DOMESTIC_TOURISM_NORTE_SLUG +
        ").",
      "Главное: один день — один жанр (Gaia / долина / Minho). Карта спокойнее ящика «на всех в чате».",
    ],
    bullets: [
      "Сверьте стили Port (Vintage, LBV, Tawny) на ivdp.pt до покупки «на подарок».",
      "Откройте vinhoverde.pt, если целитесь в Alvarinho / Minho.",
      "Берите слот и цену с сайта конкретной quinta — Visit Porto & Norte только карта идей.",
      "Проверьте Linha do Douro на cp.pt, если едете в Régua/Pinhão без машины.",
    ],
  },
  {
    heading: "История, которую стоит знать за бокалом",
    section_kind: "practice",
    paragraphs: [
      "На террасе в Gaia легко остаться туристом: два бокала, фото на фоне реки — и день «закрыт». За этим светом — кадастр Помбала, rabelo по реке и британские торговые дома, которые когда-то выбрали влажность и налоги Gaia вместо складов в самом Porto.",
      "Филоксера конца XIX выжгла лозы Европы; Douro выжил на американских подвоях — отсюда цена старых лоз и легенда крошечного **Nacional** у Noval. **Vinho Verde** — не цвет, а молодость и зелёные холмы Minho; **Alvarinho** у Monção e Melgaço — тот же сорт, что в Испании зовут Albariño.",
      "Главное: за бокалом стоит кадастр и память о выживании — не сувенир с полки аэропорта.",
    ],
    images: [
      {
        src: `${IMG}/taylors-douro.webp`,
        alt: "Террасы виноградников Douro — вид с пятой Taylor’s",
        caption: "Socalcos Douro — ландшафт UNESCO, не только фон для selfie.",
        credit: "Taylor’s",
        creditUrl: "https://www.taylor.pt/",
      },
      {
        src: `${IMG}/taylors-terrace.webp`,
        alt: "Терраса и вид у Taylor’s в Vila Nova de Gaia",
        caption: "Погреба на южном берегу: дегустация «в Порту» часто начинается с моста в Gaia.",
        credit: "Taylor’s",
        creditUrl: "https://www.taylor.pt/en/visit-taylors",
      },
    ],
    bullets: [
      "Спросите у гида про Помбала и Gaia — если ответа нет, вы на selfie-tour.",
      "Пройдите в Gaia пешком по Dom Luís I хотя бы раз.",
      "Различите Vinho Verde и Port до покупки «на всех в чате».",
    ],
  },
  {
    heading: "Как выбрать маршрут: Gaia, долина, Minho",
    section_kind: "practice",
    paragraphs: [
      "День **Gaia lodges** — город, метро D, два дома максимум. День **долины** — Régua или Pinhão, timed tasting, CP или A4 + осторожная N222. День **Minho** — отдельное утро за Alvarinho/Loureiro, не хвост после Tawny.",
      "Ориентир бюджета 2026: lodge в Gaia €15–35 за flight; quinta в долине €25–60+; lunch на месте €40–80 — цифры с офсайта, не из сторис. После дегустации — [авто](/notes/" +
        CAR_PORTUGAL_GUIDE_SLUG +
        ") и [portagens](/notes/" +
        TOLLS_FINES_ACCIDENTS_GUIDE_SLUG +
        ") только если кто-то трезвый.",
      "Главное: Gaia и долина — два разных дня; Minho — третий. Река не прощает жадности к карте.",
    ],
    images: [
      {
        src: `${IMG}/sandeman-seixo.webp`,
        alt: "Виноградники Quinta do Seixo в долине Douro",
        caption: "Quinta do Seixo (Sandeman) — классика долины: террасы + тур по слоту.",
        credit: "Sandeman",
        creditUrl: "https://www.sandeman.com/",
      },
      {
        src: `${IMG}/grahams-lodge.webp`,
        alt: "Бочки в aging lodge Graham’s",
        caption: "Graham’s — бочки и терраса; один lodge глубже, чем шесть «на бегу».",
        credit: "Graham’s Port",
        creditUrl: "https://www.grahams-port.com/visit-us",
      },
    ],
    bullets: [
      "Забронируйте timed tasting за 3–14 дней; walk-in в сезон часто отказ.",
      "Выберите базу: Régua для логистики или Pinhão для открытки и ночёвки.",
      "Заложите трезвого водителя, Uber или ночь в долине.",
    ],
  },

  // ─── Winery cards ───────────────────────────────────────────────
  {
    heading: "1. Taylor’s — эталон Gaia и «сухой» Chip Dry",
    section_kind: "practice",
    paragraphs: [
      "**История.** Один из старейших британских Port houses (XVIII век): семья Yeatman, репутация «серьёзного» Vintage и длинных Tawny. В Gaia — сад и вид, из-за которых сюда часто ставят первым слотом субботы.",
      "**Почему ехать.** Понятный visitor centre, сад, вид на реку, спокойная школа стилей Port без хаоса набережной. Хороший «первый дом», если вы ещё не отличаете LBV от Tawny на вкус.",
      "**Что знать.** Билет — только online на taylor.pt; утренние и послеобеденные слоты в сезон разбирают быстро. Shop туристический — для себя лучше сравнить цены с garrafeira в городе.",
      "**Что купить.** Простой стол: **Chip Dry** (white Port к тонику летом) и **LBV** — «почти Vintage» без десятилетий ожидания. В коллекцию: **20 Year Old Tawny** (окислительная школа в бочке) и **Vintage** объявленного года — бутылка, которую открывают не на пикнике.",
      "Главное: Taylor’s — школа Port за один визит; Chip Dry и LBV на стол, Tawny 20 / Vintage — на полку.",
    ],
    images: [
      bottle("taylors-chip-dry", "Taylor’s Chip Dry White Port", "Простой аперитив: Chip Dry + тоник летом."),
      bottle("taylors-lbv", "Taylor’s Late Bottled Vintage", "LBV — рабочая «почти Vintage» без десятилетий в погребе."),
      bottle("taylors-20-tawny", "Taylor’s 20 Year Old Tawny", "Коллекция: окислительная школа, орех и сухофрукты."),
      bottle("taylors-vintage", "Taylor’s Vintage Port", "Коллекция: Vintage объявленного года — открывать не сразу."),
    ],
    bullets: [
      "Бронь: taylor.pt → Visit Taylor’s.",
      "Дом: метро D / пешком по Dom Luís I.",
      "На стол: Chip Dry, LBV. В коллекцию: 20yo Tawny, Vintage.",
    ],
  },
  {
    heading: "2. Graham’s — терраса, Six Grapes и длинный Tawny",
    section_kind: "practice",
    paragraphs: [
      "**История.** Шотландский дом (Symingtons): сладкая, плотная школа Ruby и Tawny, которую в чатах часто называют «вкуснее Taylor’s» — спор вкуса, не рейтинга. Lodge в Gaia с террасой и бочками — один из самых фотогеничных, и это не случайность.",
      "**Почему ехать.** Терраса и aging lodge дают ощущение склада, а не только барной стойки. Удобно вторым слотом после Taylor’s в тот же день — если не гнать третий дом.",
      "**Что знать.** Timed tasting на grahams-port.com; летом walk-in часто отказ. После flight голова тяжёлая быстрее, чем кажется на солнце террасы.",
      "**Что купить.** Простой стол: **Six Grapes** (узнаваемый Ruby Reserve) и **LBV**. В коллекцию: **20 Year Old Tawny** и **Vintage** — плотная школа Symington, которую имеет смысл класть рядом с Taylor’s, чтобы сравнивать дома, а не этикетки.",
      "Главное: Graham’s — терраса и сладкая школа; Six Grapes / LBV на стол, 20yo / Vintage — в коллекцию.",
    ],
    images: [
      bottle("grahams-six-grapes", "Graham’s Six Grapes", "Простой стол: узнаваемый Ruby Reserve."),
      bottle("grahams-lbv", "Graham’s Late Bottled Vintage", "LBV — плотнее и слаще многих «на каждый день»."),
      bottle("grahams-20-tawny", "Graham’s 20 Year Old Tawny", "Коллекция: длинный Tawny с террасой в памяти."),
      bottle("grahams-vintage", "Graham’s Vintage Port", "Коллекция: Vintage — рядом с Taylor’s для сравнения домов."),
    ],
    bullets: [
      "Бронь: grahams-port.com → Visit us.",
      "Не больше двух lodges в день — терраса обманчиво лёгкая.",
      "На стол: Six Grapes, LBV. В коллекцию: 20yo Tawny, Vintage.",
    ],
  },
  {
    heading: "3. Sandeman — чёрный плащ, Gaia и Quinta do Seixo",
    section_kind: "practice",
    paragraphs: [
      "**История.** Don — чёрный силуэт в плаще — одна из самых узнаваемых икон Port с XIX века. Дом умеет и туристический Gaia, и долину: **Quinta do Seixo** — классический «первый холм» UNESCO для тех, кто хочет террасы без ночёвки в Pinhão.",
      "**Почему ехать.** Cellars ближе к набережной Gaia (меньше подъёма, чем у Taylor’s). Seixo — отдельный день долины: тур + дегустация + вид, который объясняет, зачем вообще ехать выше Régua.",
      "**Что знать.** Не путайте слот Gaia и слот Seixo — это разные адреса и разный транспорт. Seixo бронируют заранее; без timed tour остаётесь с круизом-открыткой.",
      "**Что купить.** Простой стол: **Founders Reserve** / **Ruby Reserve** и **LBV**. В коллекцию: **20 Year Old Tawny** — и тихий Douro с Seixo, если на месте есть тихие бутылки без слова Port на этикетке.",
      "Главное: Sandeman — два жанра (город + холм); Ruby/LBV на стол, 20yo Tawny — в коллекцию.",
    ],
    images: [
      bottle("sandeman-founders", "Sandeman Founders Reserve", "Простой стол: узнаваемый Reserve без пафоса Vintage."),
      bottle("sandeman-ruby", "Sandeman Ruby Reserve", "Простой стол: фруктовый Ruby к десерту или сыру."),
      bottle("sandeman-lbv", "Sandeman Late Bottled Vintage", "LBV — шаг выше Reserve без охоты за Vintage."),
      bottle("sandeman-20-tawny", "Sandeman 20 Year Old Tawny", "Коллекция: окислительная школа с иконой Don."),
    ],
    bullets: [
      "Gaia cellars — без машины; Seixo — день долины со слотом.",
      "Сайт: sandeman.com — разные страницы Visit.",
      "На стол: Founders/Ruby, LBV. В коллекцию: 20yo Tawny.",
    ],
  },
  {
    heading: "4. Fonseca — Bin No.27 и Guimaraens",
    section_kind: "practice",
    paragraphs: [
      "**История.** Ещё один дом группы Taylor Fladgate: в чатах Fonseca часто любят за доступный **Bin No.27** и за линию Guimaraens — «почти Vintage» с характером, который сомелье объясняют дольше, чем этикетку.",
      "**Почему ехать.** Если Taylor’s уже был — Fonseca даёт соседнюю школу без нового марафона по Gaia. Удобно для тех, кто собирает «линейку домов» одной группы и хочет сравнить Bin 27 с Six Grapes.",
      "**Что знать.** Bin 27 везде — от Continente до lodge shop; смысл визита не в уникальном SKU, а в контексте и в Guimaraens / Vintage, которых на полке супермаркета не всегда видно.",
      "**Что купить.** Простой стол: **Bin No.27** и **20 Year Old Tawny** как «праздничный» без Vintage. В коллекцию: **Guimaraens** и **Vintage** — бутылки, которые кладут рядом с Taylor’s Vintage и спорят годы.",
      "Главное: Fonseca — Bin 27 на стол каждый день; Guimaraens / Vintage — в коллекцию рядом с Taylor’s.",
    ],
    images: [
      bottle("fonseca-bin27", "Fonseca Bin No.27", "Простой стол: самый узнаваемый «домашний» Port дома."),
      bottle("fonseca-20-tawny", "Fonseca 20 Year Old Tawny", "Праздничный стол / лёгкая коллекция без Vintage."),
      bottle("fonseca-guimaraens", "Fonseca Guimaraens", "Коллекция: «почти Vintage» с именем семьи."),
      bottle("fonseca-vintage", "Fonseca Vintage Port", "Коллекция: Vintage — рядом с Taylor’s для спора домов."),
    ],
    bullets: [
      "Bin 27 берите в garrafeira, не обязательно в lodge shop.",
      "На стол: Bin 27, 20yo. В коллекцию: Guimaraens, Vintage.",
    ],
  },
  {
    heading: "5. Quinta do Noval — Nacional и долина без туристического шума",
    section_kind: "practice",
    paragraphs: [
      "**История.** Quinta в Pinhão с репутацией «серьёзного» Vintage. Легенда **Nacional** — крошечный участок не привитых лоз после филоксеры — одна из самых дорогих историй Port, о которой гиды говорят шёпотом, а цены на аукционах — нет.",
      "**Почему ехать.** Не lodge на набережной Gaia: настоящая quinta в долине, где UNESCO-террасы — не фон, а работа. Имеет смысл тем, кто уже был в двух lodges и хочет понять, откуда берётся Port.",
      "**Что знать.** Визит только по брони; Nacional на дегустации почти никогда не «наливают всем» — не ждите чуда за €40. Silval / LBV — честный вкус дома без охоты за мифом.",
      "**Что купить.** Простой стол: **LBV** и **Silval** (доступнее Vintage). В коллекцию: **Colheita** (урожайный Tawny с годом) и — если бюджет и случай позволят — всё, что связано с **Nacional** (часто покупка «на жизнь», не на ужин).",
      "Главное: Noval — долина и миф Nacional; LBV/Silval на стол, Colheita/Nacional — в коллекцию.",
    ],
    images: [
      bottle("noval-lbv", "Quinta do Noval LBV", "Простой стол: честный вкус дома без мифа Nacional."),
      bottle("noval-silval", "Quinta do Noval Silval", "Простой / средний: доступнее полного Vintage."),
      bottle("noval-colheita", "Quinta do Noval Colheita", "Коллекция: урожайный Tawny с годом на этикетке."),
      bottle("noval-nacional", "Quinta do Noval Nacional", "Коллекция/легенда: не привитые лозы — редко и дорого."),
    ],
    bullets: [
      "База: Pinhão; бронь на сайте Noval заранее.",
      "Не ждите Nacional в каждом flight — это легенда, не меню.",
      "На стол: LBV, Silval. В коллекцию: Colheita, Nacional.",
    ],
  },
  {
    heading: "6. Niepoort — Drink Me, Redoma и «другой» Port",
    section_kind: "practice",
    paragraphs: [
      "**История.** Голландско-португальский дом, который в XXI веке сделал Port и Douro «модными» без сувенирной позолоты: этикетки, тихие вина, натуральный уклон в разговорах сомелье. Dirk Niepoort — имя, которое в Porto-чатах произносят чаще, чем «ещё один lodge».",
      "**Почему ехать.** Если Taylor’s/Graham’s уже были — Niepoort показывает, что Port бывает суше, fresher, ближе к столу, а не только к десерту. Тихие **Redoma** часто важнее сувенирного Tawny.",
      "**Что знать.** Не все визиты — в Gaia; смотрите актуальные адреса и слоты на niepoort.com. Drink Me — вход; Vintage и старые Tawny — другая полка.",
      "**Что купить.** Простой стол: **Drink Me** (Ruby/доступный Port) и тихий **Redoma** tinto/branco. В коллекцию: **10 Year Old Tawny** (аккуратная окислительная школа) и **Vintage** — когда хотите «серьёзный» Niepoort, а не только красивую этикетку.",
      "Главное: Niepoort — мост между Port и тихим Douro; Drink Me/Redoma на стол, 10yo/Vintage — в коллекцию.",
    ],
    images: [
      bottle("niepoort-drink-me", "Niepoort Drink Me", "Простой стол: вход в дом без сувенирной позолоты."),
      bottle("niepoort-redoma", "Niepoort Redoma", "Простой / серьёзный стол: тихий Douro важнее сувенира."),
      bottle("niepoort-10-tawny", "Niepoort 10 Year Old Tawny", "Коллекция: аккуратный Tawny без музейной пыли."),
      bottle("niepoort-vintage", "Niepoort Vintage Port", "Коллекция: Vintage — когда этикетка уже не главное."),
    ],
    bullets: [
      "Слоты и адреса — niepoort.com (не путать с чужим «wine bar Niepoort»).",
      "На стол: Drink Me, Redoma. В коллекцию: 10yo Tawny, Vintage.",
    ],
  },
  {
    heading: "7. Quinta do Crasto — тихий Douro на холме",
    section_kind: "practice",
    paragraphs: [
      "**История.** Quinta над Douro с видом, из-за которого люди бронируют lunch раньше, чем дегустацию. Crasto — не «ещё один Port lodge», а эталон тихих Douro DOC: Touriga, Reserva, белые с характером долины.",
      "**Почему ехать.** Чтобы понять: не весь Douro — сладкий Port. После Gaia это лучший antidote: гранит, жара, стол, красное без крепления.",
      "**Что знать.** Бронь обязательна; дорога серпантином — только трезвый водитель или трансфер. Lunch на месте часто важнее flight «для галочки».",
      "**Что купить.** Простой стол: **Crasto Tinto** и **Crasto Branco**. В коллекцию: **Reserva** и **Touriga Nacional** (или single-varietal / special bottling года) — бутылки, которые открывают к ужину через год–два, не в ту же субботу.",
      "Главное: Crasto — тихий Douro, не сувенирный Port; Tinto/Branco на стол, Reserva/Touriga — в коллекцию.",
    ],
    images: [
      bottle("crasto-tinto", "Quinta do Crasto Tinto", "Простой стол: тихий Douro без слова Port."),
      bottle("crasto-branco", "Quinta do Crasto Branco", "Простой стол: белое долины к рыбе и жаре."),
      bottle("crasto-reserva", "Quinta do Crasto Reserva", "Коллекция: Reserva — открывать не в день покупки."),
      bottle("crasto-touriga", "Quinta do Crasto Touriga Nacional", "Коллекция: Touriga — характер сорта и холма."),
    ],
    bullets: [
      "Бронь на сайте Crasto; заложите время на серпантин.",
      "На стол: Tinto, Branco. В коллекцию: Reserva, Touriga.",
    ],
  },
  {
    heading: "8. Quinta da Pacheca — долина «с проживанием» и Port на память",
    section_kind: "practice",
    paragraphs: [
      "**История.** Одна из самых «ресторанно-гостиничных» quinta долины: вино, lunch, иногда ночь — формат, который релоканты любят после первого хаоса Gaia. Не самый «культовый» Port house, зато понятный день UNESCO без героизма.",
      "**Почему ехать.** Если хотите один слот + еда + вид и не собирать три адреса. Удобно для гостей из-за границы: меньше логистики, больше ощущения «мы были в Douro».",
      "**Что знать.** Это не замена Noval/Crasto для коллекционера — это хороший first-valley day. Цены hotel/restaurant смотрите отдельно от tasting.",
      "**Что купить.** Простой стол: **Pacheca Tinto** и **Branco**. В коллекцию: **Reserva** и **20 Year Old Tawny** — если хотите увезти Port с именем quinta, а не только с именем британского дома Gaia.",
      "Главное: Pacheca — удобный первый день долины; Tinto/Branco на стол, Reserva/20yo — в коллекцию.",
    ],
    images: [
      bottle("pacheca-tinto", "Quinta da Pacheca Tinto", "Простой стол: Douro с именем quinta на этикетке."),
      bottle("pacheca-branco", "Quinta da Pacheca Branco", "Простой стол: белое к lunch на террасе."),
      bottle("pacheca-reserva", "Quinta da Pacheca Reserva", "Коллекция: Reserva — на год вперёд, не на ту же субботу."),
      bottle("pacheca-20-tawny", "Quinta da Pacheca 20 Year Old Tawny", "Коллекция: Port с quinta, не только с Gaia lodge."),
    ],
    bullets: [
      "Слоты и ресторан — сайт Pacheca; можно совместить с ночёвкой.",
      "На стол: Tinto, Branco. В коллекцию: Reserva, 20yo Tawny.",
    ],
  },
  {
    heading: "9. Soalheiro — Alvarinho Melgaço без туристического шума Gaia",
    section_kind: "practice",
    paragraphs: [
      "**История.** Имя, с которого в Norte часто начинают серьёзный Alvarinho: Melgaço, гранит, прохлада, семья, которая сделала сорт «не только для Испании». Soalheiro — ориентир, когда чат ещё говорит «Vinho Verde = пузырьки».",
      "**Почему ехать.** Отдельный день Minho: другой воздух после Douro, тихие белые, граница с Испанией в голове, даже если вы её не пересекаете. Визит объясняет, зачем DOC Vinho Verde существует отдельно от Port.",
      "**Что знать.** Бронь на soalheiro.com; дорога из Porto длинная — не клеить после Seixo в тот же день. Classic — вход; Reserva / Primeiras Vinhas — уже коллекционный разговор.",
      "**Что купить.** Простой стол: **Soalheiro Classic** и **Granit** (минеральный профиль). В коллекцию: **Primeiras Vinhas** и **Reserva** — бутылки, которые держат 3–7 лет и спорят с «Vinho Verde надо пить молодым».",
      "Главное: Soalheiro — школа Alvarinho; Classic/Granit на стол, Primeiras/Reserva — в коллекцию.",
    ],
    images: [
      bottle("soalheiro-classic", "Soalheiro Classic Alvarinho", "Простой стол: вход в Melgaço без мифа «только пузырьки»."),
      bottle("soalheiro-granit", "Soalheiro Granit", "Простой / минеральный: гранит в бокале, не в сувенире."),
      bottle("soalheiro-primeiras", "Soalheiro Primeiras Vinhas", "Коллекция: старые лозы — держит годы."),
      bottle("soalheiro-reserva", "Soalheiro Reserva", "Коллекция: Reserva — спорит с «пить только молодым»."),
    ],
    bullets: [
      "День Minho отдельно от Douro; бронь на soalheiro.com.",
      "На стол: Classic, Granit. В коллекцию: Primeiras Vinhas, Reserva.",
    ],
  },
  {
    heading: "10. Adega de Monção — Muralhas и Deu-la-Deu без пафоса",
    section_kind: "practice",
    paragraphs: [
      "**История.** Кооператив у границы: честные объёмы, этикетки **Muralhas** и **Deu-la-Deu**, которые в Continente стоят рядом с импортом — и часто выигрывают по цене/вкусу у «красивого» boutique. История здесь не про британский клуб, а про Minho, который кормит себя сам.",
      "**Почему ехать.** Чтобы увидеть Alvarinho без lodge-пафоса Gaia: adega, виноградники, понятная цена. Хороший день из Braga; из Porto — если готовы к дороге.",
      "**Что знать.** Не ждите музейного visitor centre уровня Taylor’s — это рабочий кооператив. Визит и shop уточняйте на adegademoncao.pt.",
      "**Что купить.** Простой стол: **Muralhas de Monção** (branco) и **Muralhas Rosé**. В коллекцию: **Deu-la-Deu** и **Alvarinho Reserva** — когда хотите полку Minho рядом с Soalheiro, а не только «дешёвый Verde к bacalhau».",
      "Главное: Monção — честный Alvarinho; Muralhas на стол, Deu-la-Deu/Reserva — в коллекцию.",
    ],
    images: [
      {
        src: `${IMG}/moncao-vinhas.webp`,
        alt: "Виноградники Adega de Monção",
        caption: "Monção / Melgaço — родина Alvarinho; отдельный день из Braga.",
        credit: "Adega de Monção",
        creditUrl: "https://adegademoncao.pt/",
      },
      bottle("moncao-muralhas-bottle", "Muralhas de Monção", "Простой стол: узнаваемая этикетка, честная цена."),
      bottle("moncao-muralhas-rose", "Muralhas de Monção Rosé", "Простой стол: розовое Minho к petiscos."),
      bottle("moncao-deu-la-deu", "Deu-la-Deu Alvarinho", "Коллекция / серьёзный стол: имя кооператива на полке."),
      bottle("moncao-alvarinho-reserva", "Adega de Monção Alvarinho Reserva", "Коллекция: Reserva рядом с Soalheiro."),
    ],
    bullets: [
      "Сайт: adegademoncao.pt; удобнее из Braga, чем «хвостом» после Douro.",
      "На стол: Muralhas (branco/rosé). В коллекцию: Deu-la-Deu, Alvarinho Reserva.",
    ],
  },
  {
    heading: "11. Quinta do Ameal — Loureiro вместо «ещё одного Alvarinho»",
    section_kind: "practice",
    paragraphs: [
      "**История.** Эталон **Loureiro** в Vinho Verde: другой сорт, другой аромат (цветы, цитрус), другой разговор за столом. Дом связан с более широкой историей португальского fine wine — но на месте вы пьёте именно Loureiro, а не «ещё зелёное».",
      "**Почему ехать.** Если Monção/Soalheiro уже закрыли Alvarinho — Ameal расширяет карту Minho. Мягкий день ближе к Lima, без пограничного марафона Melgaço.",
      "**Что знать.** Визит по брони; Loureiro пьют молодым чаще, чем Reserva Alvarinho, но Especial / Solar держат дольше, чем туристический «verde с пузырьками».",
      "**Что купить.** Простой стол: **Ameal Loureiro** и **Espumante**. В коллекцию: **Especial** и **Solar** — когда хотите полку Loureiro, а не только Alvarinho «как у всех».",
      "Главное: Ameal — школа Loureiro; Loureiro/Espumante на стол, Especial/Solar — в коллекцию.",
    ],
    images: [
      bottle("ameal-loureiro", "Quinta do Ameal Loureiro", "Простой стол: эталон Loureiro, не «ещё Alvarinho»."),
      bottle("ameal-espumante", "Quinta do Ameal Espumante", "Простой стол: игристое Minho к аперитиву."),
      bottle("ameal-especial", "Quinta do Ameal Especial", "Коллекция: Especial — дольше, чем туристический verde."),
      bottle("ameal-solar", "Quinta do Ameal Solar", "Коллекция: Solar — полка Loureiro рядом с Alvarinho."),
    ],
    bullets: [
      "Бронь на сайте Ameal; день Minho отдельно от Douro.",
      "На стол: Loureiro, Espumante. В коллекцию: Especial, Solar.",
    ],
  },

  {
    heading: "Пошагово: спланировать эно-выходные из Porto",
    section_kind: "action_guide",
    paragraphs: [
      "Без тихого порядка — слот, дорога, кто трезвый — получается сорванная quinta или разговор с GNR на серпантине. Выберите один формат на день: только Gaia (Taylor’s + Graham’s); или долина (Seixo / Crasto / Pacheca / Noval — одна–две точки); или Minho (Soalheiro / Monção / Ameal). Не клеите долину и Vinho Verde в одни сутки.",
      "Timed tasting бронируют за 3–14 дней. Потом транспорт: метро, CP Linha do Douro, A4 и N222 с portagem. Потом заранее назначенный sober driver, Uber или ночь в Pinhão — до первого бокала. Одна-две бутылки с смыслом (стол + коллекция), не ящик стекла на Ryanair.",
      "Главное: один фокус на день, и трезвость как часть маршрута. Дорога в долине красива только тем, кто ещё может её видеть.",
    ],
    bullets: [
      "Выберите формат A (Gaia), B (Douro + quinta) или C (Minho); не смешивайте B и C.",
      "Забронируйте tasting на сайте и сохраните подтверждение offline.",
      "Назначьте трезвого водителя, такси или ночёвку до первого бокала.",
      "Купите 1–2 бутылки «на стол» + 1 коллекционную — не багаж стекла.",
    ],
  },
  {
    heading: "Где чаты и этикетка расходятся",
    section_kind: "gap",
    paragraphs: [
      "В чатах Port сводят к «сладкому из Continente», а Vinho Verde — к «всегда игристому». На деле IVDP — вселенная стилей; хороший Alvarinho бывает тихим. Круиз из Ribeira — не весь Douro. Nacional и Vintage «на дегустации всем» — сказка.",
      "Главное: бутылка и сайт quinta говорят точнее скрина. Река прощает туристу открытку — релоканту она этого не должна.",
    ],
    bullets: [
      "Чат: «Port из Continente = то же» → смотрите IVDP и DOC.",
      "Чат: «круиз = весь Douro» → террасы выше по долине.",
      "Ожидание бесплатного walk-in в пик → обычно платный timed tour.",
      "«После дегустации на N222 нормально» → нет.",
    ],
  },
  {
    heading: "Типичные ошибки релокантов на винном маршруте",
    section_kind: "practice",
    paragraphs: [
      "Шесть lodges подряд; Pinhão без брони в vindima; Ruby к стейку; руль после бокалов; ящик аэропортного Tawny; дети на террасе в +35 °C без воды. Усталость маскируется под «мы всё успели».",
      "Главное: меньше точек, больше смысла — и план дороги, который не зависит от третьего бокала.",
    ],
    bullets: [
      "Не закрывайте шесть lodges в Gaia за день.",
      "Не приезжайте в Pinhão без брони quinta в сезон.",
      "Не садитесь за руль после дегустации.",
      "Не ждите, что каждый гид расскажет про Помбала.",
    ],
  },
];

const keyTakeaways = [
  "Официально: Port и Douro — IVDP; Vinho Verde — DOC Minho; Alto Douro — UNESCO с 2001.",
  formatPracticeTakeaway({
    channels: ["por_tugal", "lepta"],
    period: "2025–2026",
    claim:
      "релоканту выгоднее «1 день Gaia (2 lodge) + 1 день quinta + отдельный Minho» и покупка «стол + коллекция» с каждой точки, чем круиз без вкуса",
    forReader: "история дома и две бутылки запоминаются лучше десятого бокала без плана",
  }),
  formatPracticeTakeaway({
    channels: ["por_tugal"],
    period: "2026",
    claim:
      "N222 после дегустации — частая тема штрафов; трезвый водитель или ночёвка важнее «ещё одной quinta»",
    forReader: "энотуризм без плана дороги быстро становится проблемой с GNR",
  }),
  "Расхождение: супермаркетный «портвейн» и сертифицированный Port — разные вселенные; смотрите IVDP и этикетку DOC.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "С чего начать, если я в Порту и никогда не был на quinta?",
    a: "День 1: Taylor’s + Graham’s (или Sandeman) в Gaia с бронью. День 2: одна quinta в долине (Seixo, Crasto, Pacheca или Noval). Minho (Soalheiro / Monção / Ameal) — отдельный день.",
  },
  {
    q: "Что брать «на стол», а что в коллекцию?",
    a: "На стол: Chip Dry / Six Grapes / Bin 27 / LBV / тихий Douro / Classic Alvarinho. В коллекцию: 20yo Tawny, Vintage, Guimaraens, Colheita/Nacional, Reserva / Primeiras Vinhas. Не больше 1–2 «серьёзных» бутылок за визит.",
  },
  {
    q: "Чем Port отличается от вина Douro?",
    a: "Port — креплёное с сертификацией IVDP (Ruby, LBV, Vintage, Tawny…). Тихие Douro DOC — обычные красные/белые с тех же холмов, не креплёные.",
  },
  {
    q: "Как добраться в долину без машины?",
    a: "Linha do Douro (CP) из Porto Campanhã до Régua и Pinhão. Дальше — такси/трансфер quinta. Расписание — cp.pt.",
  },
  {
    q: "Что такое Vinho Verde и куда ехать из Браги?",
    a: "DOC Minho. Alvarinho — Soalheiro (Melgaço) или Adega de Monção; Loureiro — Quinta do Ameal. Бронь на сайте производителя.",
  },
  {
    q: "Можно ли дегустировать и сразу вести машину?",
    a: "Нет. Трезвый водитель, Uber/такси или ночёвка. Для релоканта это ещё и риск для статуса.",
  },
];

export const WINES_WINERIES_NORTE_GUIDE = {
  slug: WINES_WINERIES_NORTE_SLUG,
  category: "Досуг",
  content_kind: "guide" as ContentKind,
  title: "Вина и винодельни Norte: 11 домов Douro, Port и Vinho Verde — история, визит, что купить",
  excerpt:
    "Taylor’s, Graham’s, Sandeman, Fonseca, Noval, Niepoort, Crasto, Pacheca, Soalheiro, Monção, Ameal: зачем ехать, что знать, простые бутылки и коллекционные — с фото для релокантов в Porto и Braga.",
  seo_title: "Винодельни Norte 2026 — Douro, Port, Vinho Verde",
  seo_description:
    "11 виноделен Norte: Douro, Port, Vinho Verde — история дома, зачем ехать, что знать и что купить на стол и в коллекцию. Для релокантов в Порту и Браге.",
  quick_answer:
    "Утром в Porto камень моста ещё холодный — а к субботе уже ясно: Douro не отпуск «когда-нибудь». День lodges в Gaia (Taylor’s, Graham’s, Sandeman, Fonseca), день quinta в долине (Noval, Crasto, Pacheca, Seixo) и отдельный Minho (Soalheiro, Monção, Ameal). С каждой точки — одна простая бутылка на стол и одна в коллекцию; билет на дегустацию не даёт права садиться за руль на N222.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "IVDP — Douro e Porto", url: "https://www.ivdp.pt/" },
    { title: "Vinho Verde — CVRVV", url: "https://www.vinhoverde.pt/" },
    { title: "Visit Porto & Norte", url: "https://www.visitportoandnorth.travel/" },
    { title: "UNESCO — Alto Douro Wine Region", url: "https://whc.unesco.org/en/list/1046/" },
    { title: "CP — Comboios de Portugal", url: "https://www.cp.pt/" },
    { title: "Taylor’s Port", url: "https://www.taylor.pt/" },
    { title: "Graham’s Port", url: "https://www.grahams-port.com/" },
    { title: "Sandeman", url: "https://www.sandeman.com/" },
    { title: "Quinta do Noval", url: "https://www.quintadonoval.com/" },
    { title: "Niepoort", url: "https://www.niepoort.com/" },
    { title: "Quinta do Crasto", url: "https://www.quintadocrasto.pt/" },
    { title: "Soalheiro", url: "https://www.soalheiro.com/" },
    { title: "Adega de Monção", url: "https://adegademoncao.pt/" },
  ],
  topic_tags: ["dosug", "portugal", "norte", "vino", "douro"],
  hashtags: buildNoteHashtags({
    topicTags: ["dosug", "portugal", "norte"],
    contentKind: "guide",
    extra: ["porto", "douro", "vinhoverde", "gaia", "enoturismo"],
  }),
  source_channel: "editorial+official",
  source_label: "editorial:wines-wineries-norte-2026",
};
