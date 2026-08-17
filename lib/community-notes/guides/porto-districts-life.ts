/**
 * Porto districts overview — character of each zone for relocants.
 * Remarque leisure voice. No school-run framing: good/bad, fame, history,
 * streets, parks/malls, walks, terrain, cafés, tourists, savory+sweet.
 * Visual canon: Emigro atlas icons + map vignettes (inline/porto-districts).
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { formatPracticeTakeaway } from "@/lib/community-notes/practice-format";
import { GASTRONOMY_NORTE_SLUG } from "@/lib/community-notes/guides/gastronomy-norte-portugal";
import { INTERNATIONAL_SCHOOLS_GUIDE_SLUG } from "@/lib/community-notes/guides/international-schools-portugal";
import { PORTO_BRAGA_LONG_TERM_RENT_SLUG } from "@/lib/community-notes/guides/porto-braga-long-term-rent";
import { WINES_WINERIES_NORTE_SLUG } from "@/lib/community-notes/guides/wines-wineries-norte-portugal";
import type {
  CommunityNoteFaq,
  ContentKind,
  NoteBodyImage,
  NoteBodySection,
} from "@/lib/community-notes/types";

export const PORTO_DISTRICTS_GUIDE_SLUG = "porto-rajony-arenda-shkoly-parki-sport-2026";

/** Deep Matosinhos município guide — keep in sync with matosinhos-life.ts (avoid circular import). */
const MATOSINHOS_LIFE_SLUG = "matosinhos-zhizn-arenda-plyazh-leca-2026";

const IMG = "/images/community-notes/inline/porto-districts";

function districtVisuals(
  id: string,
  place: string,
  symbolCaption: string
): NoteBodyImage[] {
  return [
    {
      src: `${IMG}/${id}-symbol.webp`,
      alt: `${place} — символ района`,
      caption: symbolCaption,
      credit: "Emigro · Porto districts canon",
    },
    {
      src: `${IMG}/${id}-map.webp`,
      alt: `${place} на карте агломерации Porto`,
      caption: `${place} на карте агломерации`,
      credit: "Emigro · Porto districts canon",
    },
  ];
}

const GLOSSARY_INTRO =
  "Слова с Idealista и карты Câmara — чтобы freguesia, município и T2 не путались при первом объезде Foz–Boavista–Matosinhos–Gaia.";

const DISCLAIMER =
  "**Emigro (авг. 2026):** это обзор характеров районов агломерации, не каталог объявлений. Аренда — ориентир рынка; Matosinhos и Gaia — отдельные municípios. Школы — отдельно: [международные школы](/notes/" +
  INTERNATIONAL_SCHOOLS_GUIDE_SLUG +
  "). Аренда — [долгосрок Porto/Braga](/notes/" +
  PORTO_BRAGA_LONG_TERM_RENT_SLUG +
  "). Не юридическая консультация.";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(glossaryForSlug(PORTO_DISTRICTS_GUIDE_SLUG)!, GLOSSARY_INTRO),
    paragraphs: [GLOSSARY_INTRO, DISCLAIMER],
  },
  {
    heading: "Как читать карту Porto",
    section_kind: "official",
    paragraphs: [
      "Утром у Douro воздух ещё сырой, а к полудню камень Ribeira уже тёплый — и вы понимаете, что «Порту» в чатах это не один район. Município Porto — холмы, узкие улицы у реки, широкие авениды к океану. Рядом Matosinhos и Vila Nova de Gaia живут своей Câmara, но в одной агломерации: метро, мост, общий рынок аренды.",
      "Ниже — восемь зон, как их чувствуют релоканты: что хорошо и что бесит, чем знаменит, история и один факт, узко или широко, парки и молы, где гулять, плоский или холмистый, кафе, туристы, вкусно и сладко. Аренда — ориентир 2026; перед contrato сверяйте Idealista.",
      "Главное: сначала характер района (рельеф, шум, вода), потом объявление. Открытка Ribeira не заменяет утро на холме.",
    ],
    images: [
      {
        src: `${IMG}/porto-districts-overview.webp`,
        alt: "Обзорная карта районов агломерации Porto",
        caption: "Восемь зон агломерации на одной карте — для сравнения перед объездом",
        credit: "Emigro · Porto districts canon",
      },
    ],
    bullets: [
      "Porto município ≠ вся агломерация: Matosinhos и Gaia — свои Câmara.",
      "Запад и океан (Foz, Matosinhos) — ровнее; центр и река — круче холмы.",
      "Туристический шум густеет к Ribeira / Clérigos; тише — Lordelo, запад Boavista, часть Matosinhos.",
      "Еда и сладости по городу — [гастрономия Norte](/notes/" + GASTRONOMY_NORTE_SLUG + ").",
    ],
  },
  {
    heading: "1. Foz do Douro / Nevogilde",
    section_kind: "practice",
    paragraphs: [
      "**Характер.** Премиум у океана: променад, маяк, свет, который держит даже в феврале. Хорошо — воздух, пробежки, ощущение «мы у моря». Плохо — цены, паркинг в старых prédio, ветер и сырость зимой. Чем знаменит: Farol de Felgueiras, Castelo do Queijo, Forte de São João da Foz, пляжи Ourigo и Carneiro.",
      "**История и факт.** Устье Douro — старый порт и оборона; 29 марта 1809 — трагедия Ponte das Barcas при бегстве от войск Сульта (традиционно «около четырёх тысяч» жертв — оценка спорная; память Alminhas da Ponte на Ribeira). Интересный факт: Passeio Alegre и променад — не «курорт 2000-х», а долгая привычка Porto гулять к океану.",
      "**Улицы и рельеф.** У воды — относительно плоско и широко (променад, авениды); к Nevogilde и вверх от берега — спокойные жилые улицы, местами уже холм. Парки: Jardim do Passeio Alegre; рядом огромный Parque da Cidade (~83 га). Моллов «внутри Foz» почти нет — шопинг уходит в Boavista / NorteShopping. Гулять: променад от Felgueiras к Queijo, закат у форта.",
      "**Кафе, туристы, вкусно и сладко.** Кафе и esplanada у променада и в жилых улицах — спокойнее центра. Туристы есть у маяка и пляжа летом, но не толпа Lello. Вкусно: marisqueira и рыба у океана. Сладко: pastéis и bolos в пекарнях района; классику nata чаще берут в городе, здесь — море и торт после прогулки.",
      "Главное: Foz — океан и статус; платите за свет и воздух, не за «центр на карте».",
    ],
    images: districtVisuals("foz", "Foz do Douro", "Маяк и променад — якорь Foz"),
    bullets: [
      "+ океан, променад, статус; − цена, паркинг, сырость зимой.",
      "Улицы: у воды шире и ровнее; вверх — спокойный жилой холм.",
      "Парки: Passeio Alegre + Parque da Cidade рядом; моллов мало.",
      "Гулять: Felgueiras → Queijo; кафе у променада; туристы умеренно.",
      "Вкусно: морепродукты; сладко: пекарни района. Аренда ориентир: T2 €1 200–1 550; T3 €2 200–3 500.",
    ],
  },
  {
    heading: "2. Boavista / Aldoar",
    section_kind: "practice",
    paragraphs: [
      "**Характер.** Современный Porto без открытки Ribeira: Avenida da Boavista, Casa da Música, Serralves, вход в Parque da Cidade. Хорошо — инфраструктура, гаражи в новостройках, культура и зелень. Плохо — меньше «души старого города», трафик по авениде, цены выше среднего. Чем знаменит: Casa da Música (Rem Koolhaas), Fundação de Serralves, Bom Sucesso Market.",
      "**История и факт.** Casa da Música родилась из Porto 2001 (European Capital of Culture), открытие 2005 — и район «подняли» культурным якорем сильнее, чем любой logo на Idealista. Serralves — музей современного искусства и парк ~18 га: воскресенье здесь — ритуал, не selfie-stop.",
      "**Улицы и рельеф.** Авенида — широкая, машинная; боковые улицы Aldoar спокойнее. Рельеф в целом умеренный, без крутых спусков Ribeira. Парки: Parque da Cidade, Serralves. Моллы/рынки: Bom Sucesso; дальше NorteShopping / Mar Shopping по логистике агломерации. Гулять: авенида к океану, сад Serralves, кольцо Parque da Cidade.",
      "**Кафе, туристы, вкусно и сладко.** Кафе у Casa da Música и Bom Sucesso — смесь местных и экспатов. Туристы точечные (концерт, Serralves), не круглосуточный гул Baixa. Вкусно: рынок Bom Sucesso, рестораны авениды. Сладко: pastry у рынка и сетей; за «иконой» сладкого чаще едут в центр.",
      "Главное: Boavista — удобный современный Porto; культура и парк важнее открытки.",
    ],
    images: districtVisuals("boavista", "Boavista / Aldoar", "Casa da Música — якорь Boavista"),
    bullets: [
      "+ гаражи, Serralves, Casa da Música, Parque da Cidade; − трафик, меньше «старого шарма».",
      "Улицы: широкая авенида + спокойные боковые; рельеф умеренный.",
      "Парки: Parque da Cidade, Serralves; рынок Bom Sucesso.",
      "Гулять: авенида к океану, сад музея; туристы по событиям.",
      "Вкусно: Bom Sucesso и авенида. Аренда ориентир: T2 €1 200–1 550; T3 €1 700–2 700.",
    ],
  },
  {
    heading: "3. Matosinhos",
    section_kind: "practice",
    paragraphs: [
      "**Характер.** Отдельный município у океана и порта Leixões: пляж, grill, метро в центр Porto. Хорошо — море, еда, часто больше метров за деньги, чем в Foz. Плохо — промышленный край у порта, ветер, humidade, путаница «это же Порту». Чем знаменит: рыба и marisqueira, Piscina das Marés (Siza Vieira), маяк Leça, порт.",
      "**История и факт.** Leixões — торговый порт конца XIX века, не «гавань Discoveries». Полный разбор Leça, Senhora da Hora и фильтра Idealista — в [гайде Matosinhos](/notes/" +
        MATOSINHOS_LIFE_SLUG +
        ").",
      "**Улицы и рельеф.** У океана — плоско и открыто; внутрь município — обычный жилой масштаб. Парки: Quinta da Conceição, край Parque da Cidade. Моллы: NorteShopping рядом по смыслу агломерации. Гулять: променад Leça, порт на расстоянии взгляда, бассейн-скала Marés.",
      "**Кафе, туристы, вкусно и сладко.** Кафе у пляжа и рынка. Туристы — на рыбу и закат, меньше чем на Ribeira. Вкусно: grill и море — якорь района ([гастрогайд](/notes/" +
        GASTRONOMY_NORTE_SLUG +
        ")). Сладко: после рыбы — мороженое и bolos у променада; «сладкая витрина» города всё же в Baixa.",
      "Главное: Matosinhos — свой город у моря; смотрите Câmara Matosinhos, не только «метро до Porto».",
    ],
    images: districtVisuals("matosinhos", "Matosinhos", "Порт и маяк — якорь Matosinhos"),
    bullets: [
      "+ пляж, рыба, метры/цена; − порт, сырость, «не município Porto».",
      "Улицы у океана широкие и плоские; детали — [гайд Matosinhos](/notes/" + MATOSINHOS_LIFE_SLUG + ").",
      "Парки: Conceição, Parque da Cidade; шопинг — NorteShopping.",
      "Гулять: Leça, Marés; туристы на еду и море.",
      "Вкусно: marisqueira/grill; аренда ориентир: T2 €900–1 200; T3 €1 500–2 400.",
    ],
  },
  {
    heading: "4. Cedofeita / Baixa / край центра",
    section_kind: "practice",
    paragraphs: [
      "**Характер.** Сердце открытки: Clérigos, Lello, Bolhão, Santa Catarina, спуск к Ribeira. Хорошо — всё пешком, культура, ночная энергия, «я в Порту». Плохо — туристы, шум, паркинг, узкие улицы с чемоданами, усталость от чужого выходного. Чем знаменит: Torre dos Clérigos, Livraria Lello, São Bento, рынок Bolhão.",
      "**История и факт.** Igreja de Cedofeita — романский слой; этимология «Cito facta» обрастает легендами — красиво, но не путать легенду с документом. Мем «Lello = Хогвартс» — туристический; прямого подтверждения от Rowling нет.",
      "**Улицы и рельеф.** Узко, круто, камень под ногами: холмы к реке и башне. Широких авенид мало — это пешеходный лабиринт. Парки: Jardins do Palácio de Cristal в 10–15 минутах. Моллы в центре почти не нужны — Rua de Santa Catarina и Via Catarina. Гулять: Clérigos → São Bento → Bolhão → Ribeira (и обратно в гору).",
      "**Кафе, туристы, вкусно и сладко.** Кафе на каждом углу — и очереди на каждом углу. Туристы максимальные. Вкусно: francesinha, petiscos, рынок. Сладко: здесь концентрация — nata, bolos de arroz, витрины Rua das Flores / Santa Catarina.",
      "Главное: центр — для жизни без машины и любви к шуму; с двумя авто обычно стресс.",
    ],
    images: districtVisuals("cedofeita", "Cedofeita / Baixa", "Clérigos — якорь центра"),
    bullets: [
      "+ пешеходность, культура; − туристы, паркинг, шум, холмы.",
      "Улицы узкие и холмистые; парк Cristal рядом; шопинг — Santa Catarina.",
      "Гулять: Clérigos–Bolhão–Ribeira; кафе везде; туристы всегда.",
      "Вкусно: francesinha и рынок; сладко: nata и витрины центра.",
      "Аренда ориентир: T1 €900–1 150; T2 €1 200–1 550; T3 от ~€1 800.",
    ],
  },
  {
    heading: "5. Lordelo do Ouro / Massarelos",
    section_kind: "practice",
    paragraphs: [
      "**Характер.** Тише центра, с садами и видом на Douro: воскресенья со скамейками и свадебными фото. Хорошо — зелень, река, меньше чемоданов. Плохо — не «первый ряд» океана и не Baixa-энергия; часть улиц всё же холм. Чем знаменит: Jardins do Palácio de Cristal, Pavilhão Rosa Mota, виды на реку.",
      "**История и факт.** Дворец Palácio de Cristal 1865 года (вдохновлён лондонским Crystal Palace) снесли в 1950-х — сады остались и стали городским ритуалом. Рядом Museu Nacional Soares dos Reis.",
      "**Улицы и рельеф.** Смесь: у садов и реки приятно гулять; к жилым кварталам — умеренный холм, не такой жёсткий, как спуск к Ribeira. Парки: Cristal — главный якорь. Моллов нет — удобства Boavista/центр рядом. Гулять: сады, смотровые на Douro, спуск к набережной Massarelos.",
      "**Кафе, туристы, вкусно и сладко.** Кафе у садов спокойнее Baixa. Туристы — на Cristal и вид, не круглосуточно. Вкусно: спокойные рестораны у парка и реки. Сладко: киоски и пекарни у садов; «сладкая сцена» всё равно в центре.",
      "Главное: Lordelo — тишина и вид на реку без туристического гула Baixa.",
    ],
    images: districtVisuals("lordelo", "Lordelo do Ouro", "Сады у Douro — якорь Lordelo"),
    bullets: [
      "+ Cristal, виды, тише центра; − не океан и не «nightlife».",
      "Рельеф умеренный; парк Cristal — якорь прогулок.",
      "Гулять: сады и смотровые; туристы точечные.",
      "Вкусно/сладко: спокойнее, чем Baixa; аренда ориентир T2 €1 000–1 400; T3 €1 500–2 200.",
    ],
  },
  {
    heading: "6. Vila Nova de Gaia",
    section_kind: "practice",
    paragraphs: [
      "**Характер.** Через Dom Luís I — другой município: Cais de Gaia, lodges Port, виды на Ribeira. Хорошо — метры, вид, вино, набережная на закате. Плохо — мост как пробка, «не Porto» на бланке, туристический слой у lodges. Чем знаменит: погреба Port (Taylor’s, Graham’s, Sandeman…), Teleférico, Mosteiro da Serra do Pilar.",
      "**История и факт.** Исторически склады Port на южном берегу — влажность и налоги. Dom Luís I (1886, Théophile Seyrig, партнёр Эйфеля) связал берега. Маршруты дегустаций — [винный гайд](/notes/" +
        WINES_WINERIES_NORTE_SLUG +
        ").",
      "**Улицы и рельеф.** У Cais — променад и подъёмы к lodges; дальше в «жилую» Gaia — обычный городской рельеф, местами холм. Парки: Parque Biológico de Gaia. Моллы: GaiaShopping и другие по município. Гулять: Cais, teleférico, один lodge без марафона по всем.",
      "**Кафе, туристы, вкусно и сладко.** Кафе и бокалы на набережной. Туристы сильные у lodges и моста. Вкусно: tapas у Cais, ужин с видом на Ribeira. Сладко: к Port — chocolate и dessert wine; nata чаще после возвращения в центр.",
      "Главное: Gaia — вид и Port; закладывайте мост в ежедневную жизнь, не только в Instagram.",
    ],
    images: districtVisuals("gaia", "Vila Nova de Gaia", "Мост и lodges — якорь Gaia"),
    bullets: [
      "+ вид, Port, метры; − мост/пробки, свой município, туристы у Cais.",
      "Набережная + подъёмы к lodges; Parque Biológico; GaiaShopping.",
      "Гулять: Cais + один lodge; туристы у вина и моста.",
      "Вкусно: ужин с видом; сладко к Port. Аренда ориентир: T2 €900–1 200; T3 €1 200–2 000.",
    ],
  },
  {
    heading: "7. Ramalde / Paranhos",
    section_kind: "practice",
    paragraphs: [
      "**Характер.** Будничный Porto: университет, Hospital de São João, Estádio do Dragão. Хорошо — бюджетнее Foz/Boavista, гаражи в новостройках, инфраструктура. Плохо — меньше «открытки», трафик у стадиона в дни матчей, ощущение окраины у востока. Чем знаменит: Dragão (~50 000), U.Porto, Alameda Shop & Spot.",
      "**История и факт.** 16 ноября 2003 — открытие Dragão, Porto 2–0 Barcelona (friendly); тогда 16-летний Месси вышел на замену — первый матч за основу Barça (competitive debut — октябрь 2004). Евро-2004 закрепил стадион как визитку востока.",
      "**Улицы и рельеф.** Шире и «новостроечнее», чем Baixa; холмы есть, но не туристический камень Ribeira. Парки: городские скверы и зоны у кампуса. Молл: Alameda Shop & Spot у стадиона. Гулять: не «флонер у реки» — скорее жилой ритм, матч, кампус.",
      "**Кафе, туристы, вкусно и сладко.** Кафе студенческие и семейные. Туристов мало, кроме матчей и тура по стадиону. Вкусно: будничная кухня, pizza/grill у Alameda. Сладко: сети и padaria — без витринного пафоса центра.",
      "Главное: Ramalde/Paranhos — жить и ездить, не коллекционировать открытки.",
    ],
    images: districtVisuals("ramalde", "Ramalde / Paranhos", "Dragão — якорь востока"),
    bullets: [
      "+ бюджет, гаражи, Dragão/U.Porto; − меньше шарма, трафик в дни матчей.",
      "Улицы шире Baixa; молл Alameda; туристы редки вне матчей.",
      "Вкусно/сладко по-будничному. Аренда ориентир: T2 €800–1 100; T3 €1 200–1 900.",
    ],
  },
  {
    heading: "8. Bonfim",
    section_kind: "practice",
    paragraphs: [
      "**Характер.** Ближе к центру и ночной жизни, часто дешевле Foz/Boavista. Хорошо — пешком к Baixa, бары, уличная энергия, азулежу. Плохо — шум, паркинг, не самый «семейный тихий» профиль. Чем знаменит: craft-сцена, street art, близость к вокзалу и центру.",
      "**История и факт.** Либеральная революция 1820 началась в Porto 24 августа; Bonfim — часть городской ткани либеральной памяти, но не сводите весь сюжет к одной площади без источников.",
      "**Улицы и рельеф.** Узкие городские улицы, холм к центру. Парков мало «якорных» — гуляют улицами и к центру. Моллов нет. Гулять: к Baixa пешком, переулки с азулежу, вечерние бары.",
      "**Кафе, туристы, вкусно и сладко.** Кафе и бары — сильная сторона. Туристы меньше, чем у Clérigos, больше «местный ночной» слой. Вкусно: francesinha и late kitchens ([гастрогайд](/notes/" +
        GASTRONOMY_NORTE_SLUG +
        ")). Сладко: меньше витрин-икон — больше бара и кофе.",
      "Главное: Bonfim — городской ритм и бюджет ближе к центру; тишины Foz здесь нет.",
    ],
    images: districtVisuals("bonfim", "Bonfim", "Азулежу и городская ткань — якорь Bonfim"),
    bullets: [
      "+ близость к центру, бары, цена; − шум, паркинг, холмы.",
      "Улицы узкие; гулять к Baixa; туристы умеренные.",
      "Вкусно: francesinha и ночная кухня. Аренда ориентир: T1 ~€950; T2 €1 000–1 300.",
    ],
  },
  {
    heading: "Где гулять, парки и молы — коротко по агломерации",
    section_kind: "practice",
    paragraphs: [
      "Если нужен зелёный день без выбора «весь город»: Parque da Cidade (~83 га) и Serralves закрывают запад; Cristal — вид на Douro; Parque Biológico — Gaia. Океанский променад — Foz и Matosinhos/Leça. Моллы: NorteShopping, Mar Shopping, GaiaShopping, Alameda — удобство, не характер района.",
      "Главное: парк и променад дают характер района быстрее, чем витрина молла.",
    ],
    bullets: [
      "Океан: Foz + Leça (Matosinhos).",
      "Крупный парк: Parque da Cidade, Serralves, Cristal, Parque Biológico.",
      "Шопинг-молл: NorteShopping / Mar / Gaia / Alameda — по стороне агломерации.",
    ],
  },
  {
    heading: "Как выбрать район за один объезд",
    section_kind: "action_guide",
    paragraphs: [
      "За 3–4 часа можно почувствовать разницу лучше, чем за неделю чатов. Кольцо: Foz (променад) → Parque da Cidade → Boavista/Serralves → Matosinhos (пляж/grill) → Lordelo/Cristal → Cedofeita/Clérigos (шум и холм) → мост в Gaia/Cais → Ramalde/Dragão → при желании Bonfim к вечеру.",
      "Смотрите не только фасад T3: ширину улицы, уклон, чужие чемоданы, запах моря или выхлопа, есть ли эспланада, куда вы реально пойдёте в воскресенье.",
      "Главное: один объезд с остановками на ноги — и карта перестаёт быть списком названий.",
    ],
    bullets: [
      "Начните у океана (Foz) и закончите у реки или Dragão — контраст рельефа.",
      "В центре пройдите 15 минут пешком в гору — так понятен «холмистый Porto».",
      "В Gaia встаньте на Cais на закате — и отдельно оцените утро через мост.",
      "Цены и contrato — [долгосрок](/notes/" + PORTO_BRAGA_LONG_TERM_RENT_SLUG + ").",
    ],
  },
  {
    heading: "Где чаты и улица расходятся",
    section_kind: "gap",
    paragraphs: [
      "В чатах Matosinhos часто «район Porto», Gaia — «тоже центр», Cedofeita — «удобно всем». На улице остаются Câmara, холм и чужой чемодан у двери.",
      "Главное: município на бланке и шум в восемь вечера важнее мема из чата.",
    ],
    bullets: [
      "«Matosinhos = район Porto» → отдельный município.",
      "«Gaia как жить в центре» → мост и своя Câmara.",
      "«В Foz всегда есть паркинг» → в старых домах часто нет.",
      "«Центр идеален всем» → идеален без машины и с любовью к туристам.",
    ],
  },
  {
    heading: "Типичные ошибки при выборе района",
    section_kind: "practice",
    paragraphs: [
      "Брать Cedofeita ради Lello и жаловаться на паркинг. Снимать у Cais Gaia и удивляться утреннему мосту. Путать Matosinhos с freguesia Porto. Выбирать только по фото Douro, не пройдя квартал пешком.",
      "Главное: характер района проверяют ногами и одним вечером на месте — не сторис.",
    ],
    bullets: [
      "Не выбирайте только по виду с моста — спуститесь в улицу.",
      "Не игнорируйте município на contrato (Matosinhos / Gaia / Porto).",
      "Не оценивайте центр в январский полдень без туристов — приезжайте в субботу.",
      "Заложите condomínio и паркинг в бюджет Foz/Boavista.",
    ],
  },
];

const keyTakeaways = [
  "Официально: обзор районов агломерации Porto — характер, рельеф, парки, туристы, еда; Matosinhos и Gaia — отдельные municípios.",
  formatPracticeTakeaway({
    channels: ["por_tugal", "chatlisboa"],
    period: "2026",
    claim:
      "релоканты чаще ошибаются, выбирая район по открытке Ribeira, а не по шуму, холму и тому, куда реально ходят гулять в воскресенье",
    forReader: "сначала характер улицы, потом Idealista",
  }),
  formatPracticeTakeaway({
    channels: ["por_tugal"],
    period: "2026",
    claim:
      "Foz/Matosinhos — океан и плоскость у воды; Baixa/Cedofeita — узко и холмисто; Boavista — современный каркас; Gaia — вид и Port через мост",
    forReader: "восемь зон — восемь разных суббот",
  }),
  "Расхождение: «Matosinhos/Gaia = район Porto» — юридически нет; смотрите Câmara и commute через мост/метро.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "С какого района начать, если я только приехал?",
    a: "Для ощущения города: день в Cedofeita/Baixa + закат в Gaia. Для жизни у воды: Foz или Matosinhos. Для удобного «современного» каркаса: Boavista. Потом уже Idealista.",
  },
  {
    q: "Где тише и зеленее?",
    a: "Lordelo (Cristal), запад Boavista у Parque da Cidade / Serralves, части Foz и Matosinhos у океана. Центр и Bonfim шумнее.",
  },
  {
    q: "Где плоский рельеф, а где холмы?",
    a: "Площе у океана (Foz, Leça/Matosinhos) и на широких авенидах Boavista. Круче — спуски к Ribeira, Cedofeita/Baixa, подъёмы к lodges в Gaia.",
  },
  {
    q: "Matosinhos — это Порту?",
    a: "В быту «агломерация Porto», юридически — отдельный município. Подробно — гайд по Matosinhos.",
  },
  {
    q: "Где вкуснее есть и где сладости?",
    a: "Рыба и grill — Matosinhos; francesinha и витрины сладкого — центр/Baixa; ужин с видом и Port — Gaia. Сводка — гастрогайд Norte.",
  },
  {
    q: "Куда смотреть школы и аренду отдельно?",
    a: "Школы — гайд по международным школам. Contrato и платежи — long-term аренда Porto/Braga. Сравнение с Брагой — гайд по районам Браги.",
  },
];

export const PORTO_DISTRICTS_GUIDE = {
  slug: PORTO_DISTRICTS_GUIDE_SLUG,
  category: "Жильё",
  content_kind: "guide" as ContentKind,
  title: "Районы Порту: характер, прогулки, парки, еда — обзор агломерации",
  excerpt:
    "Foz, Boavista, Matosinhos, центр, Lordelo, Gaia, Ramalde, Bonfim: что хорошо и плохо, история, рельеф, парки, кафе, туристы, вкусно и сладко — простой обзор для релокантов.",
  seo_title: "Районы Порту 2026 — обзор без школ",
  seo_description:
    "Районы Porto 2026: Foz, Boavista, Matosinhos, Baixa, Gaia — что хорошо и плохо, история, холмы, парки, кафе, туристы, еда и сладости. Обзор для релокантов.",
  quick_answer:
    "Porto — не одна открытка Ribeira: Foz и Matosinhos пахнут океаном и почти плоские у воды, Baixa — узкие холмы и туристы, Boavista — авенида и Serralves, Gaia — вид и Port через мост. Выбирайте район по характеру улицы (шум, рельеф, куда гулять), а не по мему из чата; Matosinhos и Gaia — отдельные municípios.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "Câmara Municipal do Porto", url: "https://www.cm-porto.pt/" },
    { title: "Câmara Municipal de Matosinhos", url: "https://www.cm-matosinhos.pt/" },
    { title: "Câmara Municipal de Gaia", url: "https://www.cm-gaia.pt/" },
    { title: "Visit Porto", url: "https://visitporto.travel/" },
    { title: "Idealista — arrendar Porto", url: "https://www.idealista.pt/arrendar-casas/porto/" },
    { title: "Parque da Cidade / Câmara", url: "https://www.cm-porto.pt/" },
  ],
  topic_tags: ["arenda", "portugal", "norte", "porto", "dosug"],
  hashtags: buildNoteHashtags({
    topicTags: ["arenda", "portugal", "norte"],
    contentKind: "guide",
    extra: ["porto", "foz", "boavista", "matosinhos", "gaia"],
  }),
  source_channel: "editorial+official",
  source_label: "editorial:porto-districts-overview-2026",
};
