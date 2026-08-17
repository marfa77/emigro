/**
 * Porto full guide — districts, rent, English-speaking schools, parks, sport.
 * Grok Remarque pass: district mornings and school-run as lived scenes.
 * Visual canon: generated Emigro atlas icons + map vignettes (inline/porto-districts).
 * Fact-checked Aug 2026 (schools, Messi, Matosinhos, IB) — no new school claims.
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { formatPracticeTakeaway } from "@/lib/community-notes/practice-format";
import { BRAGA_DISTRICTS_GUIDE_SLUG } from "@/lib/community-notes/guides/braga-districts-life";
import { GASTRONOMY_NORTE_SLUG } from "@/lib/community-notes/guides/gastronomy-norte-portugal";
import { INTERNATIONAL_SCHOOLS_GUIDE_SLUG } from "@/lib/community-notes/guides/international-schools-portugal";
import { PORTO_BRAGA_LONG_TERM_RENT_SLUG } from "@/lib/community-notes/guides/porto-braga-long-term-rent";
import { PORTO_VS_BRAGA_FAMILY_SCHOOLS_SLUG } from "@/lib/community-notes/guides/porto-vs-braga-family-schools";
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
  "Слова с Idealista и school admissions — чтобы OBS, CLIP, T2 и freguesia не путались при первом объезде Foz–Boavista–Matosinhos.";

const DISCLAIMER =
  "**Emigro / fact-check (авг. 2026):** fees и waiting list — сверяйте на сайтах школ; аренда — ориентиры рынка, не каталог объявлений. Matosinhos и Gaia — отдельные municípios в агломерации Porto. Не юридическая консультация. Связанные гайды: [Порту vs Брага](/notes/" +
  PORTO_VS_BRAGA_FAMILY_SCHOOLS_SLUG +
  "), [международные школы](/notes/" +
  INTERNATIONAL_SCHOOLS_GUIDE_SLUG +
  "), [аренда](/notes/" +
  PORTO_BRAGA_LONG_TERM_RENT_SLUG +
  ").";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(glossaryForSlug(PORTO_DISTRICTS_GUIDE_SLUG)!, GLOSSARY_INTRO),
    paragraphs: [GLOSSARY_INTRO, DISCLAIMER],
  },
  {
    heading: "Англоязычные школы в Порту",
    section_kind: "official",
    paragraphs: [
      "Сентябрьское утро в Porto начинается раньше океана. Вы уже в машине, рюкзак на заднем сиденье, и понимаете: район здесь выбирают не по открытке Ribeira, а по тому, успеете ли к воротам, пока school-run с 08:00 до 09:00 ещё не сжал улицы на тридцать–семьдесят процентов к off-peak. Кто-то везёт ребёнка в OBS в Foz, на Rua da Cerca; кто-то к CLIP у Aldoar/Boavista, на Rua de Vila Nova 1071. Рядом Cambridge-track CJD и American school, который заявлен на 2027 — пока не работает, и план семьи на него не строится.",
      "Запишитесь на open day и подайте в admissions минимум за двенадцать месяцев до сентября — waiting list у OBS и CLIP не формальность. Параллельно объезжайте районы с глазами на garagem и реальный commute, а не только на красивый T3 на Idealista. Времена в гайде — ориентир на машине off-peak; меряйте конкретный адрес до Rua da Cerca (OBS) или Rua de Vila Nova 1071 (CLIP). По заявлению OBS — единственная IB World School на севере PT с IB Diploma; у CLIP уточняйте актуальную senior pathway у admissions, не путая с маркетингом «international».",
      "Главное: по заявлению OBS — единственная **IB World School** на севере PT с IB Diploma; у CLIP уточняйте актуальную senior pathway у admissions (не путать с маркетингом «international»).",
    ],
    bullets: [
      "**OBS — Oporto British School** (Rua da Cerca 338, Foz): British + Cambridge IGCSE + **IB Diploma**; 3–18; fees ориентир 2025/26 ≈ €8 990–€14 585/год. Старейшая британская школа в континентальной Европе (с **1894**). obs.edu.pt.",
      "**CLIP — The Oporto International School** (Rua de Vila Nova 1071, Aldoar/Boavista): British-based international curriculum; крупнее и разнообразнее по национальностям; fees ориентир ≈ €9 140–€15 190/год. clip.pt — уточняйте senior pathway.",
      "**CJD International School** (Porto): Cambridge International; международное отделение с **2023/24**; fees ориентир ≈ €9 300–€11 000/год; группа с 1934 — track ещё «молодой».",
      "**American School of Porto**: American + AP; **открытие сентябрь 2027** (grades 7–10 на старте); пока не работает. americanschoolporto.pt.",
      "Также: LFIP / Deutsche Schule — [гайд по школам](/notes/" + INTERNATIONAL_SCHOOLS_GUIDE_SLUG + "); CLIB — в Braga ([гайд по Браге](/notes/" + BRAGA_DISTRICTS_GUIDE_SLUG + ")); Porto vs Braga — [отдельный гайд](/notes/" + PORTO_VS_BRAGA_FAMILY_SCHOOLS_SLUG + ").",
    ],
  },
  {
    heading: "1. Foz do Douro / Nevogilde",
    section_kind: "practice",
    paragraphs: [
      "Утром в Foz океан ещё холодный, а тротуар уже живой: кто-то бежит вдоль променада, кто-то ищет место для второй машины у старого prédio. Для семей с OBS это премиум у воды и школьный якорь — Rua da Cerca часто в пешей доступности, Parque da Cidade рядом, пляжи Ourigo и Carneiro входят в привычку воскресенья. В новостройках гараж есть; в старом жилье остаётся улица и тихий дефицит, который вы замечаете не в объявлении, а в восемь утра. Аренда здесь напоминает, что океан не бесплатен: T2 — €1 200–1 550, T3 — €2 200–3 500 в месяц; жильё — апартаменты, таунхаусы, виллы.",
      "Из ближнего Foz до OBS пять–пятнадцать минут пешком; из дальнего Nevogilde чаще авто или автобус, пять–двенадцать минут. До CLIP — восемь–пятнадцать минут на машине, когда school-run ещё не сжал улицы; в пик дольше. Спорт — Piscina das Marés в Leça, архитектура Álvaro Siza Vieira, ориентир €5–10 за день в сезон; вело и серф у океана. Днём остаются Forte de São João da Foz, Castelo do Queijo, Farol de Felgueiras и marisqueira на променаде. 29 марта 1809 — трагедия Ponte das Barcas, бегство от войск Сульта; в традиции часто называют около четырёх тысяч жертв, точная цифра неизвестна и оспаривается; память — Alminhas da Ponte на Ribeira.",
      "Главное: Foz — OBS пешком и океан; закладывайте паркинг и бюджет T3 до подписания contrato.",
    ],
    images: districtVisuals("foz", "Foz do Douro", "Маяк и променад — якорь Foz"),
    bullets: [
      "Ищите апартаменты, таунхаусы, виллы.",
      "Закладывайте аренду: T2 €1 200–1 550; T3 €2 200–3 500/мес.",
      "Проверьте паркинг: в новостройках — гаражи; в старых — улица, дефицит.",
      "Замерьте до OBS: рядом с Rua da Cerca — ~5–15 мин пешком; из дальнего Nevogilde чаще авто (~5–12 мин). До CLIP: ~8–15 мин на машине.",
      "Обойдите Parque da Cidade (~83 га), Jardim do Passeio Alegre, пляжи Ourigo, Carneiro, Matosinhos; Piscina das Marés; Forte, Castelo do Queijo, Felgueiras.",
    ],
  },
  {
    heading: "2. Boavista / Aldoar",
    section_kind: "practice",
    paragraphs: [
      "Boavista не пахнет солью так сильно, как Foz, — здесь пахнет асфальтом Avenida da Boavista и ожиданием у ворот школы. Главный якорь для CLIP: новостройки с гаражами, Casa da Música, Serralves, вход в Parque da Cidade. Утро семьи здесь — не романтика Ribeira, а garagem, рюкзак и короткий рывок к Rua de Vila Nova, пока school-run ещё не сжал улицы. Жильё — апартаменты в новостройках и реконструкции, таунхаусы; аренда T2 €1 200–1 550, T3 €1 700–2 700 в месяц; в новостройках часто подземный гараж.",
      "До CLIP с запада Boavista и Aldoar — пять–двенадцать минут; от Casa da Música чаще восемь–пятнадцать. До OBS — восемь–пятнадцать минут; в school-run оба маршрута могут уехать за двадцать. Парки — Parque da Cidade; Jardins do Palácio de Cristal рядом по логистике дня. Спорт — Holmes Place и аналоги, €70–120 в месяц. Точки дня — Casa da Música (Rem Koolhaas), Fundação de Serralves с музеем и парком около 18 га, Bom Sucesso Market, Avenida da Boavista до океана. Casa da Música к Porto 2001, открытие 2005, подняла «культурный» статус района; цены на недвижимость на Boavista заметно выросли за 2010-е–2020-е — конкретные проценты по м² сверяйте по Idealista и INE на дату.",
      "Главное: Boavista/Aldoar — CLIP + гараж; меряйте адрес до OBS, если рассматриваете обе школы.",
    ],
    images: districtVisuals("boavista", "Boavista / Aldoar", "Casa da Música — якорь Boavista"),
    bullets: [
      "Ищите апартаменты (новостройки и реконструкция) и таунхаусы.",
      "Закладывайте аренду: T2 €1 200–1 550; T3 €1 700–2 700/мес.",
      "Проверьте паркинг: в новостройках часто подземный гараж.",
      "Замерьте до CLIP: запад Boavista / Aldoar — ~5–12 мин; от Casa da Música ~8–15. До OBS: ~8–15 мин (school-run до ~20).",
      "Обойдите Parque da Cidade, Serralves (~18 га), Holmes Place, Casa da Música, Bom Sucesso Market.",
    ],
  },
  {
    heading: "3. Matosinhos",
    section_kind: "practice",
    paragraphs: [
      "На бланке — Câmara Municipal de Matosinhos, не Porto: отдельный município, своя Junta, свой Leixões (торговый порт конца XIX века). Для семьи у CLIP это часто короткий рывок 5–12 минут; до OBS вдоль океана 8–15, в пик около 20; метро в центр Porto ориентир ~20 минут. Жильё — современные апартаменты и таунхаусы; аренда T2 €900–1 200, T3 €1 500–2 400 в месяц; в новостройках — гаражи. Полный разбор Leça, Senhora da Hora, humidade и фильтра Idealista — в [гайде по Matosinhos](/notes/" +
        MATOSINHOS_LIFE_SLUG +
        ").",
      "Парки — Parque da Cidade на границе, Quinta da Conceição. Спорт — Piscina das Marés и бассейн Conceição (Siza Vieira); серф, вело. Рынок и grill — [гастрономия Norte](/notes/" +
        GASTRONOMY_NORTE_SLUG +
        ").",
      "Главное: Matosinhos — município, не bairro Porto; детали жизни и аренды — в отдельном гайде, здесь — якорь для сравнения с Foz/Boavista.",
    ],
    images: districtVisuals("matosinhos", "Matosinhos", "Порт и маяк — якорь Matosinhos"),
    bullets: [
      "Откройте детальный [гайд Matosinhos](/notes/" +
        MATOSINHOS_LIFE_SLUG +
        ") до просмотра жилья.",
      "Закладывайте аренду: T2 €900–1 200; T3 €1 500–2 400/мес.",
      "Замерьте до CLIP: ~5–12 мин; до OBS: ~8–15 (пик ~20); метро в центр ~20.",
      "Сверьте Câmara на cm-matosinhos.pt — не cm-porto.pt.",
    ],
  },
  {
    heading: "4. Cedofeita / Baixa edge",
    section_kind: "practice",
    paragraphs: [
      "Центр Porto умеет быть красивым до усталости: Lello, Clérigos, Bolhão, Rua de Santa Catarina — всё пешком, всё шумно, всё чужое после девяти вечера, если вы приехали с детьми и двумя авто. Для семьи с OBS или CLIP район часто слабый выбор не из‑за отсутствия культуры, а из‑за паркинга и туристического гула, который не заканчивается вместе с днём. Жильё — реконструированные апартаменты и лофты; аренда T1 €900–1 150, T2 €1 200–1 550, T3 от €1 800; паркинг — дефицит, платная улица.",
      "До OBS и CLIP — десять–двадцать минут на машине; Baixa и Clérigos в пик ближе к верхней границе. Парки — Jardins do Palácio de Cristal, десять–пятнадцать минут пешком. Igreja de Cedofeita — романский слой; этимология «Cito facta / Cedofeita» обрастает легендами про «освящённый лес» — красиво, но не путать легенду с документом. Про Lello и Хогвартс: популярный туристический мем; прямого подтверждения от Rowling нет.",
      "Главное: Cedofeita хорош без машины и без school-run через центр; с двумя авто — обычно стресс.",
    ],
    images: districtVisuals("cedofeita", "Cedofeita / Baixa", "Clérigos — якорь центра"),
    bullets: [
      "Ищите реконструированные апартаменты и лофты.",
      "Закладывайте аренду: T1 €900–1 150; T2 €1 200–1 550; T3 от ~€1 800.",
      "Проверьте паркинг: дефицит, платная улица.",
      "Замерьте до OBS / CLIP: ~10–20 мин на машине (в пик — верхняя граница).",
      "Обойдите Lello, Clérigos, São Bento, Bolhão; Jardins do Palácio de Cristal ~10–15 мин пешком.",
    ],
  },
  {
    heading: "5. Lordelo do Ouro / Massarelos",
    section_kind: "practice",
    paragraphs: [
      "Тише, чем Baixa: сады Palácio de Cristal, виды на Douro, воскресенья со свадебными фото и людьми, которые просто сидят на скамейке, глядя на реку. Короткий авто до обеих школ — и часто OBS не дальше CLIP, что семьи иногда узнают только после замера адреса, а не по слухам из чата. Жильё — апартаменты, таунхаусы, виллы; аренда T2 €1 000–1 400, T3 €1 500–2 200; паркинг — гаражи в новостройках и у домов.",
      "До OBS часто пять–двенадцать минут, западнее к Foz. До CLIP — восемь–пятнадцать минут на север к Aldoar: не «заведомо ближе CLIP», меряйте адрес. Точки — Pavilhão Rosa Mota и зона бывшего Palácio de Cristal: дворец 1865 года, выставки XIX века, снесён в 1950-х — сады остались; Museu Nacional Soares dos Reis. «Crystal Palace» Porto вдохновлялся лондонским; стеклянный дворец убрали, парк стал городским ритуалом.",
      "Главное: Lordelo — тишина и виды; commute до OBS и CLIP сопоставим — меряйте конкретный адрес.",
    ],
    images: districtVisuals("lordelo", "Lordelo do Ouro", "Сады у Douro — якорь Lordelo"),
    bullets: [
      "Ищите апартаменты, таунхаусы, виллы.",
      "Закладывайте аренду: T2 €1 000–1 400; T3 €1 500–2 200.",
      "Проверьте паркинг: гаражи в новостройках / у домов.",
      "Замерьте до OBS: часто ~5–12 мин. До CLIP: ~8–15 мин к Aldoar — меряйте адрес.",
      "Обойдите Jardins do Palácio de Cristal, riverside, Museu Nacional Soares dos Reis.",
    ],
  },
  {
    heading: "6. Vila Nova de Gaia",
    section_kind: "practice",
    paragraphs: [
      "Через Dom Luís I — другой город и другой município. Больше метров за деньги, виды на Ribeira, lodges портвейна по вечерам. Логистика в OBS и CLIP идёт через мост: утром мост — это не открытка, а поток, в котором вы уже не турист. Жильё — апартаменты с видом, таунхаусы, семейные дома; аренда T1 от €700, T2 €900–1 200, T3 €1 200–2 000 в месяц; в новостройках — гаражи.",
      "До OBS и CLIP с Cais — двенадцать–двадцать минут через мост; из «дальней» Gaia и юго-востока чаще пятнадцать–двадцать пять, пробки на Dom Luís и Arrábida. Парки — Parque Biológico de Gaia; набережная Cais de Gaia. Спорт — Holmes Place Gaia и муниципальные комплексы; вело у реки. Точки — lodges Port, Taylor’s, Graham’s, Sandeman — [винный гайд](/notes/" +
        WINES_WINERIES_NORTE_SLUG +
        "); Teleférico; Mosteiro da Serra do Pilar. Исторически погреба Port сосредоточены на южном берегу; Dom Luís I 1886 года, Théophile Seyrig, партнёр Эйфеля, связал города визуально и по делу.",
      "Главное: Gaia — свой município; метры и Port lodges — плюс; school-run через мост — минус, который надо замерить.",
    ],
    images: districtVisuals("gaia", "Vila Nova de Gaia", "Мост и lodges — якорь Gaia"),
    bullets: [
      "Ищите апартаменты с видом, таунхаусы, семейные дома.",
      "Закладывайте аренду: T1 от ~€700; T2 €900–1 200; T3 €1 200–2 000/мес.",
      "Проверьте паркинг: в новостройках — гаражи.",
      "Замерьте до OBS / CLIP: с Cais ~12–20 мин через мост; дальняя Gaia — чаще 15–25.",
      "Обойдите Parque Biológico, Cais de Gaia, Port lodges, Teleférico, Serra do Pilar.",
    ],
  },
  {
    heading: "7. Ramalde / Paranhos",
    section_kind: "practice",
    paragraphs: [
      "Университет, Hospital de São João, Estádio do Dragão — бюджетный слой с гаражами, где Porto звучит будничнее и честнее открытки. Commute до школ зависит от запада или востока freguesia: запад Ramalde часто ближе к обеим школам; восток у Dragão — уже другая утренняя история. Жильё — апартаменты и таунхаусы; аренда T2 €800–1 100, T3 €1 200–1 900 в месяц; паркинг — гаражи в новостройках плюс улица.",
      "Запад Ramalde — часто восемь–пятнадцать минут до обеих школ; Paranhos и Dragão на востоке — чаще двенадцать–двадцать до OBS и CLIP, времена близкие, не «CLIP заметно ближе». Точки — Universidade do Porto, Hospital de São João, Estádio do Dragão около 50 000 мест, Euro-2004, архитектор Manuel Salgado, Alameda Shop & Spot. 16 ноября 2003 — открытие Dragão, Porto 2–0 Barcelona, friendly; тогда 16-летний Месси вышел на замену — первый матч за основу Barça; официальный competitive debut — октябрь 2004 против Espanyol.",
      "Главное: Ramalde/Paranhos — бюджет и гаражи; меряйте запад vs восток freguesia до школ.",
    ],
    images: districtVisuals("ramalde", "Ramalde / Paranhos", "Dragão — якорь востока"),
    bullets: [
      "Ищите апартаменты и таунхаусы.",
      "Закладывайте аренду: T2 €800–1 100; T3 €1 200–1 900/мес.",
      "Проверьте паркинг: гаражи в новостройках + улица.",
      "Замерьте до школ: запад Ramalde ~8–15 мин до обеих; Paranhos/Dragão ~12–20 (времена близкие).",
      "Обойдите U.Porto, São João, Estádio do Dragão (~50 000), Alameda Shop & Spot.",
    ],
  },
  {
    heading: "8. Bonfim",
    section_kind: "practice",
    paragraphs: [
      "Ближе к центру и ночной жизни, чаще дешевле Foz и Boavista — но паркинг и шум. Для семьи с OBS обычно не first choice: утро здесь пахнет не школьным двором, а чужим выходным, который закончился слишком поздно. Жильё — апартаменты; аренда T1 около €950, T2 €1 000–1 300; паркинг — улица, дефицит.",
      "До OBS и CLIP — пятнадцать–двадцать пять минут на машине, оба сопоставимы; пик у вокзала и мостов. Точки — пешком к центру, craft-бары, francesinha — [гастрогайд](/notes/" +
        GASTRONOMY_NORTE_SLUG +
        "); азулежу и street art. Либеральная революция 1820 началась в Porto 24 августа; Bonfim — часть городской памяти либерализма, но не сводите весь сюжет к одной площади без источников.",
      "Главное: Bonfim — бюджет и центр; для OBS/CLIP с авто — длинный school-run и шум.",
    ],
    images: districtVisuals("bonfim", "Bonfim", "Азулежу и городская ткань — якорь Bonfim"),
    bullets: [
      "Ищите апартаменты.",
      "Закладывайте аренду: T1 ~€950; T2 €1 000–1 300 (ориентир).",
      "Проверьте паркинг: улица, дефицит.",
      "Замерьте до OBS / CLIP: ~15–25 мин на машине (оба сопоставимы).",
      "Обойдите центр пешком, craft-бары, francesinha, street art и азулежу.",
    ],
  },
  {
    heading: "Городской спорт и парки",
    section_kind: "practice",
    paragraphs: [
      "Семье не нужны три абонемента «на всякий случай». Выберите один океанский бассейн на выходные и один зал или парк для будней — так проще держать ритм и бюджет, чем бегать между клубами, которые вы всё равно не посещаете. Piscina das Marés и Quinta da Conceição закрывают «море»; Holmes Place — если хотите зал круглый год.",
      "Parque da Cidade около 83 га и Jardins do Palácio de Cristal — бесплатная база для бега и детей; Serralves Park около 18 га — при музее; Parque Biológico de Gaia — фауна и тропы на южном берегу. Estádio do Dragão — туры и музей, ориентир €12–25, сайт FC Porto.",
      "Главное: один океанский бассейн + один зал/парк для будней — достаточно для семейного ритма Porto.",
    ],
    bullets: [
      "**Piscina das Marés** (Leça) — Siza Vieira; сезон; ориентир €5–10/день.",
      "**Piscina de Quinta da Conceição** — парк + бассейн; ориентир €4–9/день.",
      "**Holmes Place** (Boavista / Gaia) — ориентир €70–120/мес.",
      "**Parque da Cidade** (~83 га) и **Jardins do Palácio de Cristal** — бесплатная база.",
      "**Serralves / Parque Biológico / Dragão tours** — по тарифу фонда или клуба.",
    ],
  },
  {
    heading: "Сравнение районов и рекомендации семье",
    section_kind: "practice",
    paragraphs: [
      "Сначала зафиксируйте школу — OBS или CLIP — потом смотрите паркинг и шум: иначе красивый T3 в Cedofeita превратится в ежедневный стресс с двумя машинами и school-run через центр. Связка «школа → гараж → бюджет» важнее открытки Ribeira; меряйте конкретный адрес, а не среднюю по городу. Matosinhos и Gaia — отдельные municípios; сравнение с Брагой и CLIB — [Порту vs Брага](/notes/" +
        PORTO_VS_BRAGA_FAMILY_SCHOOLS_SLUG +
        ") и [районы Браги](/notes/" +
        BRAGA_DISTRICTS_GUIDE_SLUG +
        "); contrato — [долгосрок](/notes/" +
        PORTO_BRAGA_LONG_TERM_RENT_SLUG +
        ").",
      "Главное: школа и гараж раньше открытки Douro; Matosinhos и Gaia — отдельные municípios.",
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
      "Целитесь в Foz do Douro пешком, если OBS first; запасной Lordelo / запад Boavista.",
      "Целитесь в Boavista / Aldoar или Lordelo do Ouro с гаражами, если CLIP first.",
      "Смотрите Matosinhos на море и бюджет (свой município, метро в центр).",
      "Смотрите Vila Nova de Gaia на метры и вид — [vino lodges](/notes/" + WINES_WINERIES_NORTE_SLUG + ").",
      "Берите Cedofeita / край Baixa без машины; бюджет — Ramalde/Paranhos или Bonfim (~12–25 мин до школ в пик).",
    ],
  },
  {
    heading: "Маршрут осмотра: кольцо от школы за 3–4 часа",
    section_kind: "action_guide",
    paragraphs: [
      "Карта районов остаётся теорией, пока вы не проедете утренний маршрут от объявления до школы. В school-run разница между Foz и Bonfim измеряется не минутами в Google Maps, а нервами в сентябре. Лучший осмотр — кольцо от школы: старт у OBS или CLIP, объезд ключевых freguesias и финиш у той же школы в час пик, если получится — так вы увидите паркинг и пробки глазами, а не в чате.",
      "Из Foz — пляж, Castelo do Queijo, Felgueiras; через Parque da Cidade к Boavista — Casa da Música, Serralves, новостройки с гаражом; дальше CLIP в Aldoar; затем Matosinhos — порт, пляж, Piscina das Marés; Lordelo — Cristal и виды на Douro; Cedofeita — шум и паркинг у Lello–Clérigos; Gaia — Cais и один lodge через мост; Ramalde — Dragão; и обратно к школе. С остановками — три–четыре часа.",
      "Главное: закладывайте 3–4 часа с остановками; финиш у школы в пик важнее красивых фото по пути.",
    ],
    bullets: [
      "Начните у OBS (Foz) или CLIP (Aldoar): кампус и парковка у школы.",
      "Объездите Foz → Parque da Cidade → Boavista/Serralves → CLIP.",
      "Сверните в Matosinhos (порт/пляж/Piscina das Marés) и Lordelo (Cristal).",
      "Оцените Cedofeita/центр на шум и паркинг; Gaia — Cais + один lodge через мост.",
      "Финишируйте у Dragão (Ramalde) и вернитесь к OBS/CLIP в час пик — итого 3–4 часа.",
    ],
  },
  {
    heading: "Где чаты и реальность расходятся",
    section_kind: "gap",
    paragraphs: [
      "В чатах Porto легко собрать «истину» из чужих переездов: CLIP «тоже IB», Matosinhos «район города», паркинг в Foz «всегда есть». На месте остаётся школа, Câmara и ваше утро сентября. Разница чувствуется не в споре, а в пробке и в счёте за второй паркинг.",
      "Главное: IB World School на севере — про OBS; Matosinhos и Gaia — отдельные municípios; ASP — с 2027.",
    ],
    bullets: [
      "«CLIP тоже IB как OBS» → OBS позиционирует себя как единственную IB World School на севере; у CLIP уточняйте senior pathway у школы.",
      "«Matosinhos — район Porto» → отдельный município.",
      "«American School уже можно подавать на сентябрь» → открытие заявлено на **2027**.",
      "«Паркинг в Foz всегда есть» → в старых зданиях часто нет.",
      "«4 000 погибших на Ponte das Barcas — точная цифра» → традиционная оценка; источники расходятся.",
    ],
  },
  {
    heading: "Типичные ошибки семей",
    section_kind: "practice",
    paragraphs: [
      "Оптимально держать порядок: школа, паркинг, шум и пляж. Ошибки ниже — классика переезда в Porto, когда романтика города опережает сентябрьское утро. Вы уже читали чужие истории; не надо проживать их в своей freguesia.",
      "Главное: admissions за 12+ месяцев; Cedofeita без гаража при OBS — классика дорогого стресса.",
    ],
    bullets: [
      "Не снимайте Cedofeita «ради Lello», имея OBS в Foz и два авто.",
      "Не начинайте admissions за 3 месяца до сентября.",
      "Не путайте friendly-дебют Месси (2003) с competitive debut (2004).",
      "Заложите condomínio и второй паркинг в бюджет T3 Foz.",
      "Не игнорируйте Braga/CLIB как plan B по бюджету — см. гайды выше.",
    ],
  },
];

const keyTakeaways = [
  "Официально: OBS (Foz, IB Diploma / IB World School на севере) и CLIP (Aldoar/Boavista) — главные якоря; admissions за 12+ месяцев; ASP — с 2027.",
  formatPracticeTakeaway({
    channels: ["por_tugal", "chatlisboa"],
    period: "2026",
    claim:
      "семьи с OBS чаще целятся в Foz, с CLIP — в Aldoar/запад Boavista; Matosinhos до CLIP часто ближе 15 мин, Gaia — через мост и пробки",
    forReader: "сначала школа и гараж, потом романтика Ribeira",
  }),
  formatPracticeTakeaway({
    channels: ["por_tugal"],
    period: "2026",
    claim:
      "Matosinhos и Vila Nova de Gaia — отдельные municípios в агломерации; путать их с «районом Porto» вредно для налогов, школ и ожиданий",
    forReader: "смотрите morada и commute, не только открытку Douro",
  }),
  "Расхождение: «единственный IB на севере» — про IB World School (OBS); не копируйте маркетинговые ярлыки CLIP без проверки admissions.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "OBS или CLIP — что выбрать?",
    a: "OBS: Foz, меньший кампус, British + IB Diploma, старейшая британская школа (1894). CLIP: крупнее, разнообразнее, у Boavista/Aldoar, British-based international. Оба с waiting list — визиты на оба open day. Детали curriculum — в гайде по международным школам.",
  },
  {
    q: "Где жить, если ребёнок в OBS?",
    a: "Первый выбор — жильё у Rua da Cerca / ближний Foz (пешком). Дальний Nevogilde и запад Boavista — короткий авто. Matosinhos — пляж и бюджет при ~8–15 мин до OBS (не «полчаса»).",
  },
  {
    q: "Где жить под CLIP?",
    a: "Aldoar / запад Boavista — короче всего. Lordelo удобен, но до OBS часто не дальше, чем до CLIP — меряйте адрес. Foz — океан при ~8–15 мин до CLIP.",
  },
  {
    q: "Matosinhos — это Порту?",
    a: "В быту «агломерация Porto», юридически — отдельный município со своей Câmara. Метро связывает с центром Porto ~20 минут.",
  },
  {
    q: "Когда откроется American School of Porto?",
    a: "По сайту школы — сентябрь 2027, старт grades 7–10. До открытия не стройте план семьи только на ASP.",
  },
  {
    q: "Куда смотреть дальше по аренде, еде и вину?",
    a: "Аренда и платежи — гайд Porto/Braga long-term. Еда — гастрономия Norte. Port lodges в Gaia — винный гайд. Сравнение с Брагой/CLIB — Порту vs Брага и гайд по районам Браги.",
  },
];

export const PORTO_DISTRICTS_GUIDE = {
  slug: PORTO_DISTRICTS_GUIDE_SLUG,
  category: "Жильё",
  content_kind: "guide" as ContentKind,
  title: "Жизнь в Порту по районам: утро до школы, аренда, парки и океан",
  excerpt:
    "OBS в Foz, CLIP у Aldoar, Matosinhos и Gaia как отдельные municípios: аренда, паркинг, park-run и school-run — карта семьи в агломерации Porto без открыточной иллюзии.",
  seo_title: "Порту — районы, школы, аренда 2026",
  seo_description:
    "Районы Porto 2026 глазами семьи: OBS и CLIP, Foz, Boavista, Matosinhos, Gaia — аренда, паркинг, парки, спорт и реальный commute; связанные гайды Emigro.",
  quick_answer:
    "В Porto адрес под школу важнее открытки Ribeira: OBS на Rua da Cerca (Foz, British + IB Diploma с 1894) или CLIP на Rua de Vila Nova у Aldoar — и уже от ворот считают garagem и минуты. Matosinhos — отдельный município (см. гайд), Gaia — через мост со своей Câmara. Admissions берут за двенадцать месяцев; American School заявлен на сентябрь 2027.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "Oporto British School", url: "https://www.obs.edu.pt/" },
    { title: "CLIP — Oporto International School", url: "https://www.clip.pt/" },
    { title: "American School of Porto", url: "https://americanschoolporto.pt/" },
    { title: "Câmara Municipal do Porto", url: "https://www.cm-porto.pt/" },
    { title: "Câmara Municipal de Matosinhos", url: "https://www.cm-matosinhos.pt/" },
    { title: "Idealista — arrendar Porto", url: "https://www.idealista.pt/arrendar-casas/porto/" },
    { title: "Visit Porto", url: "https://visitporto.travel/" },
  ],
  topic_tags: ["arenda", "portugal", "norte", "porto", "shkoly"],
  hashtags: buildNoteHashtags({
    topicTags: ["arenda", "portugal", "norte"],
    contentKind: "guide",
    extra: ["porto", "foz", "clip", "obs", "matosinhos"],
  }),
  source_channel: "editorial+official",
  source_label: "editorial:porto-districts-grok-remarque-2026",
};
