/**
 * Porto full guide — districts, rent, English-speaking schools, parks, sport.
 * Structure from editorial brief; fact-checked Aug 2026 (schools, Messi, Matosinhos, IB).
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
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const PORTO_DISTRICTS_GUIDE_SLUG = "porto-rajony-arenda-shkoly-parki-sport-2026";

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
      "Зачем вам это сейчас: район жилья в Porto почти всегда выбирают от **школы**, а не наоборот — OBS в Foz, CLIP у Aldoar/Boavista, плюс Cambridge-track и будущий American school.",
      "Что делать: open day + admissions за **12+ месяцев**; параллельно смотреть freguesia с паркингом и commute.",
      "Главное: по заявлению OBS — единственная **IB World School** на севере PT с IB Diploma; у CLIP уточняйте актуальную senior pathway у admissions (не путать с маркетингом «international»).",
      "Времена в гайде — ориентир на машине off-peak (карта); school-run 08:00–09:00 часто +30–70%. Меряйте **конкретный адрес → Rua da Cerca (OBS) / Rua de Vila Nova 1071 (CLIP)**.",
    ],
    bullets: [
      "**OBS — Oporto British School** (Rua da Cerca 338, Foz): British + Cambridge IGCSE + **IB Diploma**; 3–18; fees ориентир 2025/26 ≈ €8 990–€14 585/год. Старейшая британская школа в континентальной Европе (с **1894**). obs.edu.pt.",
      "**CLIP — The Oporto International School** (Rua de Vila Nova 1071, Aldoar/Boavista): British-based international curriculum; крупнее и разнообразнее по национальностям; fees ориентир ≈ €9 140–€15 190/год. clip.pt — уточняйте senior pathway.",
      "**CJD International School** (Porto): Cambridge International; международное отделение с **2023/24**; fees ориентир ≈ €9 300–€11 000/год; группа с 1934 (старейшая частная школа PT) — track ещё «молодой».",
      "**American School of Porto**: American + AP; **открытие сентябрь 2027** (grades 7–10 на старте); пока не работает. americanschoolporto.pt.",
      "Также в агломерации: LFIP / Deutsche Schule (см. [гайд по школам](/notes/" + INTERNATIONAL_SCHOOLS_GUIDE_SLUG + ")); CLIB — в Braga ([гайд по Браге](/notes/" + BRAGA_DISTRICTS_GUIDE_SLUG + ")).",
      "**Waiting list:** OBS и CLIP — начинайте минимум за 12 месяцев. Сравнение Porto vs Braga для семьи — [отдельный гайд](/notes/" + PORTO_VS_BRAGA_FAMILY_SCHOOLS_SLUG + ").",
    ],
  },
  {
    heading: "1. Foz do Douro / Nevogilde",
    section_kind: "practice",
    paragraphs: [
      "Премиум у океана и якорь для семей с **OBS**: школа в пешей доступности, Parque da Cidade, пляжи — но паркинг в старом жилье часто боль.",
    ],
    bullets: [
      "**Тип жилья:** апартаменты, таунхаусы, виллы.",
      "**Аренда (ориентир):** T2 €1 200–1 550; T3 €2 200–3 500/мес.",
      "**Паркинг:** в новостройках — гаражи; в старых — улица, дефицит.",
      "**До OBS:** рядом с Rua da Cerca — ~5–15 мин пешком; из дальнего Nevogilde чаще авто/автобус (~5–12 мин). **До CLIP:** ~8–15 мин на машине (off-peak короче; в school-run дольше).",
      "**Парки:** Parque da Cidade (~83 га); Jardim do Passeio Alegre; пляжи Ourigo, Carneiro, Matosinhos.",
      "**Спорт:** Piscina das Marés (Leça, арх. Álvaro Siza Vieira) — ориентир €5–10/день в сезон; вело/бег у океана; серф.",
      "**Точки:** Forte de São João da Foz; Castelo do Queijo; Farol de Felgueiras; променад с marisqueira.",
      "**Факт:** 29.03.1809 — трагедия Ponte das Barcas (бегство от войск Сульта); в традиции часто называют ~4 000 жертв, точная цифра неизвестна и оспаривается историками. Память — Alminhas da Ponte на Ribeira.",
    ],
  },
  {
    heading: "2. Boavista / Aldoar",
    section_kind: "practice",
    paragraphs: [
      "Главный якорь для **CLIP**: новостройки с гаражами, Casa da Música, Serralves, вход в Parque da Cidade с Avenida da Boavista.",
    ],
    bullets: [
      "**Тип жилья:** апартаменты (новостройки и реконструкция), таунхаусы.",
      "**Аренда:** T2 €1 200–1 550; T3 €1 700–2 700/мес.",
      "**Паркинг:** в новостройках часто подземный гараж.",
      "**До CLIP:** запад Boavista / Aldoar — ~5–12 мин; от Casa da Música чаще ~8–15. **До OBS:** ~8–15 мин (в school-run оба могут уехать за 20).",
      "**Парки:** Parque da Cidade; Jardins do Palácio de Cristal рядом по логистике дня.",
      "**Спорт:** Holmes Place и аналоги (ориентир €70–120/мес); городские площадки.",
      "**Точки:** Casa da Música (Rem Koolhaas); Fundação de Serralves (музей + парк ~18 га); Bom Sucesso Market; Avenida da Boavista до океана.",
      "**Факт:** Casa da Música (к Porto 2001 / открытие 2005) сильно подняла «культурный» статус района; цены на недвижимость на Boavista заметно выросли за 2010-е–2020-е — конкретные % по м² сверяйте по Idealista/INE на дату, не как вечную константу.",
    ],
  },
  {
    heading: "3. Matosinhos",
    section_kind: "practice",
    paragraphs: [
      "Отдельный **município** в агломерации Porto: пляж, гриль, метро в центр, обычно дешевле Foz при том же океане.",
    ],
    bullets: [
      "**Тип жилья:** современные апартаменты, таунхаусы.",
      "**Аренда:** T2 €900–1 200; T3 €1 500–2 400/мес.",
      "**Паркинг:** в новостройках — гаражи.",
      "**До CLIP:** ~5–12 мин (Aldoar почти соседний). **До OBS:** ~8–15 мин вдоль океана; в пик — до ~20. Метро в центр Porto ~20 мин.",
      "**Парки:** Parque da Cidade (граница); Quinta da Conceição (парк + бассейн).",
      "**Спорт:** Piscina das Marés + Piscina de Quinta da Conceição (обе связаны с наследием Siza Vieira); серф, велодорожки.",
      "**Точки:** Porto de Leixões (крупный порт, конец XIX в.); рыбный рынок; уличный grill (sardinhas) — см. [гастрономия Norte](/notes/" + GASTRONOMY_NORTE_SLUG + ").",
      "**Факт:** Matosinhos — не «район Porto», а свой município; рыбацкая идентичность сильна. Leixões сделал агломерацию торговым портом; **не** путать с гаванью эпохи Discoveries (то в основном Lisboa).",
    ],
  },
  {
    heading: "4. Cedofeita / Baixa edge",
    section_kind: "practice",
    paragraphs: [
      "Центр и культура пешком — Lello, Clérigos, Bolhão — но паркинг и туристический шум делают район слабым выбором для семьи с двумя авто.",
    ],
    bullets: [
      "**Тип жилья:** реконструированные апартаменты, лофты.",
      "**Аренда:** T1 €900–1 150; T2 €1 200–1 550; T3 от ~€1 800.",
      "**Паркинг:** дефицит, платная улица.",
      "**До OBS / CLIP:** ~10–20 мин на машине (Baixa/Clérigos в пик ближе к верхней границе).",
      "**Парки:** Jardins do Palácio de Cristal ~10–15 мин пешком; скверы.",
      "**Точки:** Livraria Lello; Torre dos Clérigos; São Bento; Rua de Santa Catarina / Majestic; Mercado do Bolhão.",
      "**Факт:** Igreja de Cedofeita — романский слой; этимология «Cito facta / Cedofeita» обрастает легендами про «освящённый лес» — красиво, но не путать легенду с документом.",
      "**Про Lello и Хогвартс:** популярный туристический мем; прямого подтверждения от Rowling нет — не подавайте как факт.",
    ],
  },
  {
    heading: "5. Lordelo do Ouro / Massarelos",
    section_kind: "practice",
    paragraphs: [
      "Тише, чем Baixa: сады Palácio de Cristal, виды на Douro; короткий авто до обеих школ (часто OBS не дальше CLIP).",
    ],
    bullets: [
      "**Тип жилья:** апартаменты, таунхаусы, виллы.",
      "**Аренда:** T2 €1 000–1 400; T3 €1 500–2 200.",
      "**Паркинг:** гаражи в новостройках / у домов.",
      "**До OBS:** часто ~5–12 мин (западнее к Foz). **До CLIP:** ~8–15 мин на север к Aldoar — не «заведомо ближе CLIP», меряйте адрес.",
      "**Парки:** Jardins do Palácio de Cristal; riverside.",
      "**Точки:** Pavilhão Rosa Mota / зона бывшего Palácio de Cristal (дворец 1865/выставки XIX в. снесён в 1950-х — сады остались); Museu Nacional Soares dos Reis.",
      "**Факт:** «Crystal Palace» Porto вдохновлялся лондонским; стеклянный дворец убрали, парк стал городским ритуалом воскресений и свадебных фото.",
    ],
  },
  {
    heading: "6. Vila Nova de Gaia",
    section_kind: "practice",
    paragraphs: [
      "Отдельный город через Dom Luís I: больше метров за деньги, виды на Ribeira, lodges портвейна — логистика в OBS/CLIP через мост.",
    ],
    bullets: [
      "**Тип жилья:** апартаменты с видом, таунхаусы, семейные дома.",
      "**Аренда:** T1 от ~€700; T2 €900–1 200; T3 €1 200–2 000/мес.",
      "**Паркинг:** в новостройках — гаражи.",
      "**До OBS / CLIP:** с Cais ~12–20 мин через мост; из «дальней» Gaia / юго-восток — чаще 15–25 (пробки на Dom Luís / Arrábida).",
      "**Парки:** Parque Biológico de Gaia; набережная Cais de Gaia.",
      "**Спорт:** Holmes Place Gaia и муниципальные комплексы; вело у реки.",
      "**Точки:** lodges Port (Taylor’s, Graham’s, Sandeman…) — [винный гайд](/notes/" + WINES_WINERIES_NORTE_SLUG + "); Teleférico; Mosteiro da Serra do Pilar.",
      "**Факт:** Gaia — свой município. Исторически погреба Port сосредоточены на южном берегу; Dom Luís I (1886, Théophile Seyrig, партнёр Эйфеля) связал города визуально и по делу.",
    ],
  },
  {
    heading: "7. Ramalde / Paranhos",
    section_kind: "practice",
    paragraphs: [
      "Университет, Hospital de São João, Estádio do Dragão — бюджетный слой с гаражами; commute до школ зависит от запада/востока freguesia.",
    ],
    bullets: [
      "**Тип жилья:** апартаменты, таунхаусы.",
      "**Аренда:** T2 €800–1 100; T3 €1 200–1 900/мес.",
      "**Паркинг:** гаражи в новостройках + улица.",
      "**До школ:** запад Ramalde — часто ~8–15 мин до обеих; Paranhos / Dragão (восток) — чаще ~12–20 до OBS и CLIP (времена близкие, не «CLIP заметно ближе»).",
      "**Точки:** Universidade do Porto (кампусы); Hospital de São João; Estádio do Dragão (~50 000 мест, Euro-2004, арх. Manuel Salgado); Alameda Shop & Spot.",
      "**Факт:** 16.11.2003 — открытие Dragão, Porto 2–0 Barcelona (**friendly**); тогда 16-летний Месси вышел на замену — первый матч за основу Barça; официальный competitive debut — октябрь 2004 vs Espanyol.",
    ],
  },
  {
    heading: "8. Bonfim",
    section_kind: "practice",
    paragraphs: [
      "Ближе к центру и ночной жизни, чаще дешевле Foz/Boavista — но паркинг и шум; для семьи с OBS обычно не first choice.",
    ],
    bullets: [
      "**Тип жилья:** апартаменты.",
      "**Аренда:** T1 ~€950; T2 €1 000–1 300 (ориентир).",
      "**Паркинг:** улица, дефицит.",
      "**До OBS / CLIP:** ~15–25 мин на машине (оба сопоставимы; пик у ВЦ/мостов).",
      "**Точки:** пешком к центру; craft-бары; francesinha — [гастрогайд](/notes/" + GASTRONOMY_NORTE_SLUG + "); азулежу и street art.",
      "**Факт:** Либеральная революция 1820 началась в **Porto** (24 августа); Bonfim — часть городской памяти либерализма, но не сводите весь сюжет к одной площади без источников.",
    ],
  },
  {
    heading: "Городской спорт и парки",
    section_kind: "practice",
    paragraphs: [
      "Что делать: выбрать 1 океанский бассейн + 1 зал/парк для будней — не абонементы «на всякий случай» в трёх клубах.",
    ],
    bullets: [
      "**Piscina das Marés** (Leça da Palmeira) — бассейн на скалах, Siza Vieira; сезон; ориентир €5–10/день.",
      "**Piscina de Quinta da Conceição** — парк + бассейн, семейный формат; ориентир €4–9/день.",
      "**Holmes Place** (Boavista / Gaia) — премиум; ориентир €70–120/мес.",
      "**Estádio do Dragão** — туры/музей; ориентир €12–25 (сайт FC Porto).",
      "**Parque da Cidade** (~83 га) — озёра, беговые дорожки; Sea Life / Pavilhão da Água — отдельно платно.",
      "**Jardins do Palácio de Cristal** — бесплатно; виды на Douro.",
      "**Serralves Park** (~18 га) — при музее; билет на музей/парк по тарифу фонда.",
      "**Parque Biológico de Gaia** — фауна и тропы на южном берегу.",
    ],
  },
  {
    heading: "Сравнение районов и рекомендации семье",
    section_kind: "practice",
    paragraphs: [
      "Что делать: сначала школа (OBS vs CLIP), потом паркинг и шум — иначе красивый T3 в Cedofeita станет ежедневным стрессом.",
    ],
    bullets: [
      "**OBS first** → Foz do Douro (пешком), запасной Lordelo / Boavista запад.",
      "**CLIP first** → Boavista / Aldoar или Lordelo do Ouro (гаражи).",
      "**Море + бюджет** → Matosinhos (свой município, метро в центр).",
      "**Метры + вид** → Vila Nova de Gaia (+ [vino lodges](/notes/" + WINES_WINERIES_NORTE_SLUG + ")).",
      "**Центр без машины** → Cedofeita / край Baixa.",
      "**Бюджет** → Ramalde/Paranhos или Bonfim (заложите ~12–25 мин до школ в пик; меряйте конкретный адрес).",
      "**Сравнение с Брагой / CLIB** → [Порту vs Брага](/notes/" + PORTO_VS_BRAGA_FAMILY_SCHOOLS_SLUG + ") + [районы Браги](/notes/" + BRAGA_DISTRICTS_GUIDE_SLUG + ").",
      "**Контракт аренды** (senhorio, caução, recibo) → [долгосрок Porto/Braga](/notes/" + PORTO_BRAGA_LONG_TERM_RENT_SLUG + ").",
    ],
  },
  {
    heading: "Пошагово: маршрут осмотра 3–4 часа",
    section_kind: "action_guide",
    paragraphs: [
      "Зачем: без замера утреннего commute таблица районов — теория.",
      "Что делать: старт у школы → кольцо районов → финиш у той же школы в час пик, если можете.",
    ],
    bullets: [
      "Шаг 1 — OBS (Foz): кампус и парковка у школы.",
      "Шаг 2 — Foz: пляж, Castelo do Queijo, Felgueiras (~10 мин).",
      "Шаг 3 — Parque da Cidade: масштаб зелени (~5 мин).",
      "Шаг 4 — Boavista: Casa da Música, Serralves, новостройки с гаражом (~10 мин).",
      "Шаг 5 — CLIP (Aldoar): школа и окружение (~5 мин).",
      "Шаг 6 — Matosinhos: порт/пляж, Piscina das Marés (~15 мин).",
      "Шаг 7 — Lordelo: Palácio de Cristal / виды на Douro (~10 мин).",
      "Шаг 8 — Cedofeita / центр: Lello–Clérigos — оценить шум и паркинг (~10 мин).",
      "Шаг 9 — Gaia: Cais + один lodge (~15 мин через мост).",
      "Шаг 10 — Ramalde: Dragão (~10 мин) → обратно к OBS/CLIP.",
      "Итого с остановками: **3–4 часа**.",
    ],
  },
  {
    heading: "Где чаты и реальность расходятся",
    section_kind: "gap",
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
      "Оптимально: школа → паркинг → шум/пляж. Ошибки ниже — классика переезда в Porto.",
    ],
    bullets: [
      "Ошибка: снять Cedofeita «ради Lello», имея OBS в Foz и два авто.",
      "Ошибка: начать admissions за 3 месяца до сентября.",
      "Ошибка: путать friendly-дебют Месси (2003) с competitive debut (2004) — мелочь, но показатель доверия к «фактам из чата».",
      "Ошибка: не заложить condomínio и второй паркинг в бюджет T3 Foz.",
      "Ошибка: игнорировать Braga/CLIB как plan B по бюджету — см. гайды выше.",
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
  title: "Полный гайд по Порту: районы, аренда, англоязычные школы, парки и спорт",
  excerpt:
    "OBS, CLIP, CJD и American School 2027; Foz, Boavista, Matosinhos, Gaia и другие: аренда, паркинг, парки, спорт и commute — карта для семьи в агломерации Porto.",
  seo_title: "Порту — районы, школы, аренда 2026",
  seo_description:
    "Гайд по Порту 2026: OBS и CLIP, районы Foz, Boavista, Matosinhos, Gaia — аренда, паркинг, парки, спорт и commute для семей; перелинковка с гайдами Emigro.",
  quick_answer:
    "В Porto район выбирают от школы: OBS в Foz (British + IB Diploma, с 1894) или CLIP у Aldoar/Boavista. Foz — океан и пешком до OBS, но паркинг; Boavista — гаражи и CLIP; Matosinhos — свой município, пляж дешевле Foz; Gaia — метры и Port lodges через мост. Admissions за 12+ месяцев; American School — только с 2027. Дальше — аренда, Брага/CLIB, вино и гастро в связанных гайдах Emigro.",
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
  source_label: "editorial:porto-districts-2026",
};
