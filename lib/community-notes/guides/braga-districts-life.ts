/**
 * @deprecated Archived — removed from Portugal satellite (2026-08).
 * Keep source for history; do not publish. Use: npm run portugal:archive-braga-districts-guide
 *
 * Braga full guide — districts, rent, parks, sport, life (family / CLIB lens).
 * Structure preserved from editorial brief: general → 9 freguesias → sport → parks → compare → route.
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { formatPracticeTakeaway } from "@/lib/community-notes/practice-format";
import { INTERNATIONAL_SCHOOLS_GUIDE_SLUG } from "@/lib/community-notes/guides/international-schools-portugal";
import { PORTO_BRAGA_LONG_TERM_RENT_SLUG } from "@/lib/community-notes/guides/porto-braga-long-term-rent";
import { PORTO_VS_BRAGA_FAMILY_SCHOOLS_SLUG } from "@/lib/community-notes/guides/porto-vs-braga-family-schools";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const BRAGA_DISTRICTS_GUIDE_SLUG = "braga-rajony-arenda-parki-sport-2026";

const GLOSSARY_INTRO =
  "Слова с Idealista и TUB — чтобы T2, freguesia и CLIB не путались при первом осмотре районов.";

const DISCLAIMER =
  "**Emigro:** аренда и время до CLIB — ориентиры рынка 2026 (Idealista + практика семей); перед договором сверяйте объявление и замерьте commute сами. Не юридическая консультация и не каталог агентств. Сравнение Porto vs Braga и контракт аренды — в связанных гайдах.";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(glossaryForSlug(BRAGA_DISTRICTS_GUIDE_SLUG)!, GLOSSARY_INTRO),
    paragraphs: [GLOSSARY_INTRO, DISCLAIMER],
  },
  {
    heading: "Общая информация о Браге",
    section_kind: "official",
    paragraphs: [
      "Зачем вам это сейчас: Брага — не «маленький Порту», а отдельный ритм жизни: история Minho, кампус Universidade do Minho, CLIB в Gualtar и застройка, которая растёт быстрее, чем привыкли туристы.",
      "Что делать: понять масштаб города и логистику до Porto/океана — потом выбирать freguesia под школу и паркинг.",
      "Главное: município Braga ~180–200 тыс. жителей (оценки разнятся); до Порту ~40–55 мин на машине (пик / A3) или CP; до океана ~30–40 мин.",
      "Времена до CLIB ниже — ориентир off-peak на машине; school-run часто +30–70%. Меряйте адрес → Rua Celestino Lobo / Gualtar (CLIB).",
    ],
    bullets: [
      "Столица исторической провинции Minho; один из главных городских полюсов Norte (не «третий город PT» как жёсткий ранг — цифры зависят от município vs. агломерации).",
      "Основана как *Bracara Augusta* римлянами (ок. 16 г. до н.э.) — 2000 лет непрерывной городской истории.",
      "Современный слой: технологический хаб вокруг Universidade do Minho (с 1973), новостройки, спортивная инфраструктура SC Braga.",
      "Семьям со школой: якорь часто **CLIB** (Colégio Luso-Internacional de Braga) в Gualtar — см. [Порту vs Брага](/notes/" + PORTO_VS_BRAGA_FAMILY_SCHOOLS_SLUG + ") и [международные школы](/notes/" + INTERNATIONAL_SCHOOLS_GUIDE_SLUG + ").",
      "Аренда и платежи (senhorio, condomínio, recibo) — [долгосрок Porto/Braga](/notes/" + PORTO_BRAGA_LONG_TERM_RENT_SLUG + ").",
      "Официально: Câmara Municipal de Braga (cm-braga.pt), TUB — городской транспорт, Idealista — поиск arrendamento.",
    ],
  },
  {
    heading: "1. Gualtar (Гуалтар)",
    section_kind: "practice",
    paragraphs: [
      "Университетский район и главный «школьный» якорь для семей с CLIB: новостройки, таунхаусы, дома; паркинг в комплексах обычно есть.",
    ],
    bullets: [
      "**Тип жилья:** апартаменты в новостройках, таунхаусы, отдельные дома.",
      "**Аренда (ориентир):** T1 €600–800; T2 €900–1 200; T3 €1 100–1 500; таунхаусы/дома от €1 300 до €2 000+.",
      "**Паркинг:** в большинстве новостроек подземный или наземный включён / отдельным местом.",
      "**До CLIB:** ~2–5 мин на машине; пешком из ближних улиц ~10–20 мин (~1 км), не «весь Gualtar пешком за 5».",
      "**Парки:** зелёные зоны Universidade do Minho; Jardim Botânico da Universidade do Minho.",
      "**Спорт:** спорткомплексы UMinho (бассейн, футбол, теннис); Holmes Place Braga (Quinta do Seminário) — премиум-фитнес с бассейном и SPA рядом.",
      "**Точки:** кампус UMinho; CLIB; супермаркеты Pingo Doce / Continente.",
      "**Факт:** главный кампус Universidade do Minho (с 1973) сделал Gualtar «университетским» районом; часть новостроек изначально ориентировалась на преподавателей и исследователей.",
    ],
  },
  {
    heading: "2. São Vicente (Сан-Висенте)",
    section_kind: "practice",
    paragraphs: [
      "Семейный баланс: шопинг (Braga Parque), спорт, парки и относительно короткий commute до CLIB.",
    ],
    bullets: [
      "**Тип жилья:** апартаменты (новостройки и реконструкция), таунхаусы.",
      "**Аренда:** T1 €500–700; T2 €700–1 000; T3 €900–1 300; таунхаусы от €1 200.",
      "**Паркинг:** в новостройках — гаражи; в старых зданиях — улица.",
      "**До CLIB:** ~5–10 мин на машине.",
      "**Парки:** Parque da Ponte (озеро, детские зоны, амфитеатр, беговые дорожки); Parque Desportivo da Rodovia.",
      "**Спорт:** Piscina Municipal da Ponte — сезонный тариф по часам (ориентир лета: до ~15:00 ≈€3, после 15:00 дешевле, вечером часто ≈€1; сверяйте tabela taxas Câmara); фитнес у Braga Parque.",
      "**Точки:** Braga Parque (ТЦ, кино, еда); Colégio Dom Diogo de Sousa; GNRation — культурный центр в бывшем здании военной полиции.",
      "**Факт:** Braga — European Youth Capital **2012** (GNRation — наследие того года); UNESCO Creative City of **Media Arts** — с **2017** (не то же самое, что Youth Capital).",
    ],
  },
  {
    heading: "3. Fraião (Фрайан)",
    section_kind: "practice",
    paragraphs: [
      "Премиум-застройка юго-востока (LuxTower и аналоги в Fraião / Nogueira). Не путать с стадионом SC Braga — он в **Real / Dume** (Parque Norte), другая сторона города.",
    ],
    bullets: [
      "**Тип жилья:** премиум-апартаменты (LuxTower и аналоги), таунхаусы, дома.",
      "**Аренда:** T2 €1 000–1 400; T3 €1 200–1 800; таунхаусы/дома от €1 500 до €2 500+.",
      "**Паркинг:** в новостройках подземные гаражи, часто на 1–2 машины.",
      "**До CLIB:** ~7–15 мин на машине (off-peak часто ~6–8; school-run выше).",
      "**Парки:** Fonte das Águas Férreas — железистый источник/фонтан (барокко, **1773**, арх. Carlos Amarante; по заказу архиепископа D. Gaspar de Bragança — не «1173»).",
      "**Спорт рядом по смыслу города, не по адресу Fraião:** Estádio Municipal + Cidade Desportiva SC Braga — **Dume / Real** (Rua de Cabanas / Parque Norte), не Fraião. Из Fraião до стадиона отдельно ~10–15 мин.",
      "**Точки:** LuxTower; Minho Center / Holmes Place по логистике дня; торговля и рестораны.",
      "**Факт:** скальный стадион Соуто де Моуры — визитка Браги, но жильё «у стадиона» ищите в Real/Dume/Parque Norte, не в объявлениях Fraião.",
    ],
  },
  {
    heading: "4. Gondizalves (Гондизалвеш)",
    section_kind: "practice",
    paragraphs: [
      "Дома, виллы и condomínios fechados: тишина, сады, быстрый выезд к природе и ~10–15 мин до CLIB.",
    ],
    bullets: [
      "**Тип жилья:** таунхаусы, отдельные дома, виллы в закрытых посёлках, апартаменты.",
      "**Аренда:** T2 €700–1 000; таунхаусы €1 000–1 500; дома/виллы €1 500–2 500+.",
      "**Паркинг:** гаражи 1–2 машины; в посёлках — доп. места.",
      "**До CLIB:** ~10–15 мин на машине (запад города; off-peak ~12).",
      "**Парки:** сельская зелень вокруг; **Sete Fontes — не «у дома в Gondizalves»** (это São Victor / Tenões, ближе к Gualtar, ~5–10 мин до CLIB). Gerês — отдельная поездка ~30+ мин.",
      "**Спорт:** муниципальные комплексы; вело/пешие маршруты.",
      "**Точки:** тихие коттеджные посёлки; для Sete Fontes закладывайте отдельный выезд на восток города.",
      "**Факт:** каменный комплекс Sete Fontes — XVIII в. (ок. 1744–1752); снабжал город водой до XX в.; экскурсии по *minas* — на стороне São Victor, не Gondizalves.",
    ],
  },
  {
    heading: "5. Nogueiró (Ногейро)",
    section_kind: "practice",
    paragraphs: [
      "Холмы, панорамы и Sameiro — «район с видом», престижный и тихий, с гаражами в большинстве домов.",
    ],
    bullets: [
      "**Тип жилья:** апартаменты, таунхаусы, дома на холмах.",
      "**Аренда:** T1 €870–1 060; T2 €1 000–1 300; T3 €1 200–1 600; дома от €1 500.",
      "**Паркинг:** гаражи / подземный паркинг в новостройках.",
      "**До CLIB:** ~7–15 мин на машине (до Sameiro с холма — чаще 12–20).",
      "**Парки:** холмистые зоны с видами; лесные тропы; рядом Piscina de Nogueiró.",
      "**Спорт:** муниципальный бассейн Nogueiró; ~10 мин до Holmes Place.",
      "**Точки:** Santuário do Sameiro — крупный марианский санктуарий Minho (часто называют «вторым после Фатимы» в локальном обиходе); панорамы долины.",
      "**Факт:** с холмов Nogueiró в ясную погоду открывается один из лучших видов на город; закаты — местный культ.",
    ],
  },
  {
    heading: "6. Lamaçães / Nogueira (Ламасанш / Ногейра)",
    section_kind: "practice",
    paragraphs: [
      "Бюджетнее и «живее»: смесь старых семей и молодых профессионалов, нормальная инфраструктура, commute до CLIB комфортный.",
    ],
    bullets: [
      "**Тип жилья:** апартаменты, таунхаусы, дома.",
      "**Аренда:** T1 €500–700; T2 €700–1 000; T3 €900–1 200.",
      "**Паркинг:** в новостройках — место; в старых домах — улица.",
      "**До CLIB:** ~8–12 мин на машине.",
      "**Парки:** зоны вдоль реки; детские площадки и скверы.",
      "**Спорт:** муниципальные площадки; доступ к центральным комплексам.",
      "**Точки:** спокойные улицы + коммерция; хорошее соотношение цена/качество.",
      "**Факт:** исторически — «спальный» район текстильных рабочих; сегодня сохраняет атмосферу «настоящей Португалии без туристов».",
    ],
  },
  {
    heading: "7. Real / Centro Histórico (Реал / Исторический центр)",
    section_kind: "practice",
    paragraphs: [
      "Культура и камни веков — но паркинг дефицитный. Для семьи с машиной часто хуже, чем Gualtar/São Vicente.",
    ],
    bullets: [
      "**Тип жилья:** апартаменты в реконструированных исторических зданиях, лофты.",
      "**Аренда:** T1 €600–900; T2 €900–1 300; T3 €1 200–1 800.",
      "**Паркинг:** ограничен; многие здания без гаража; улица платная и дефицитная — **осторожно для семьи с авто**.",
      "**До CLIB:** ~7–15 мин на машине (~4,5–5 км; пешком час — не «20–30 мин»).",
      "**Парки:** Jardim de Santa Bárbara (азулежу); Praça do Município; Parque da Ponte рядом с центром/São Vicente.",
      "**Спорт:** пешие холмы Bom Jesus; муниципальные бассейны — на машине.",
      "**Точки:** Sé de Braga (XI в.); Arco da Porta Nova; Museu dos Biscainhos; Palácio do Raio; Bom Jesus do Monte (~5 км, 580 ступеней + фуникулёр).",
      "**Факт:** на Rua do Souto встречаются дома XIV–XV вв. — слой паломнического пути к Santiago, не музейная декорация.",
    ],
  },
  {
    heading: "8. «Antas» — ловушка названия",
    section_kind: "gap",
    paragraphs: [
      "В município Braga нет жилого района «Antas» с commute 10–15 мин до CLIB. На Idealista «Antas» почти всегда = **Antas (Vila Nova de Famalicão)** или Antas (Esposende) — другие município.",
    ],
    bullets: [
      "**До CLIB из Antas (Famalicão):** ориентир ~25–35 мин на машине (~30 км), не 10–15.",
      "**Бюджет внутри Braga:** Lamaçães, Espinho, Ferreiros, части São Vicente — меряйте адрес; типично ~8–15 мин до CLIB.",
      "**Real / Dume / Parque Norte:** жильё у стадиона и Cidade Desportiva; до CLIB чаще ~10–15 мин.",
      "**Не путать:** мегалиты *antas* — слово португальского языка, не ярлык freguesia в центре Браги.",
    ],
  },
  {
    heading: "9. Maximinos / Sé (Максиминуш / Се)",
    section_kind: "practice",
    paragraphs: [
      "История под ногами (римские термы) и близость к центру — но паркинг чаще уличный.",
    ],
    bullets: [
      "**Тип жилья:** апартаменты, старые здания с реконструкцией.",
      "**Аренда:** T1 €500–700; T2 €700–1 000.",
      "**Паркинг:** дефицитный, улица.",
      "**До CLIB:** ~8–15 мин на машине (off-peak ~9; «5 мин» из объявлений — редко).",
      "**Парки:** Parque da Ponte рядом; Jardim da Avenida Central.",
      "**Спорт:** Piscina Municipal da Ponte (тариф по часам — см. раздел «Городской спорт»).",
      "**Точки:** Termas Romanas de Maximinos (~800 м², I–III вв.); Torre de Menagem / Castelo; Pelourinho.",
      "**Факт:** термы обнаружили при стройке в XX веке — один из крупных римских банных комплексов на полуострове, прямо под современными улицами.",
    ],
  },
  {
    heading: "Городской спорт: бассейны, залы, поля",
    section_kind: "practice",
    paragraphs: [
      "Что делать: выбрать 1–2 якоря на семью (муниципальный бассейн + зал или Sports City), не абонементы «на всякий случай» в трёх клубах.",
    ],
    bullets: [
      "**Piscina Municipal da Ponte** (São Vicente) — взрослый + детский; бар, парковка; тариф по времени (лето: утро ≈€3, после обеда дешевле, вечер часто ≈€1 — не «€1 всегда»).",
      "**Piscina de Nogueiró** — муниципальный бассейн; цены по таблице Câmara / сезону.",
      "**Holmes Place Braga** (Quinta do Seminário, у Gualtar) — премиум: бассейн, SPA, группы, спиннинг; ориентир €70–120/мес.",
      "**Cidade Desportiva SC Braga** (Dume / Rua de Cabanas) + **Estádio Municipal** (Parque Norte, Real) — не Fraião; членство/туры по тарифам клуба.",
      "**Urban Sports Club** — доступ к нескольким бассейнам города; от ~€24/мес.",
      "**Parque Desportivo da Rodovia** (São Vicente) — поля, детская зона, беговые дорожки; бесплатно.",
    ],
  },
  {
    heading: "Парки и зелёные зоны",
    section_kind: "practice",
    paragraphs: [
      "Брага зелёнее стереотипа «каменный центр»: от Parque da Ponte до Sameiro и Sete Fontes хватает на воскресный маршрут без выезда в Gerês.",
    ],
    bullets: [
      "**Parque da Ponte** — озеро, детские площадки, амфитеатр, беговые дорожки; Centro / São Vicente.",
      "**Parque Desportivo da Rodovia** — спорт + дети; São Vicente.",
      "**Jardim Botânico da UMinho** — ботсад кампуса; Gualtar.",
      "**Sete Fontes** — комплекс XVIII в. и туннели; São Victor / Tenões (не Gondizalves).",
      "**Bom Jesus do Monte** — санктуарий, 580 ступеней, фуникулёр, вид; восток / Tenões.",
      "**Santuário do Sameiro** — холм и панорамы; Nogueiró.",
    ],
  },
  {
    heading: "Сравнение районов и рекомендации семье",
    section_kind: "practice",
    paragraphs: [
      "Что делать: выбрать приоритет (CLIB + паркинг / дом / премиум / виды / бюджет) — и не оптимизировать все сразу.",
      "Зачем: Idealista показывает «красивую» цену; без паркинга и замера до школы семья переплачивает нервами.",
    ],
    bullets: [
      "**Gualtar** — T2 ~€900–1 200; гаражи; 2–5 мин до CLIB → семьи, университетская среда.",
      "**São Vicente** — T2 ~€700–1 000; паркинг в новостройках; 5–10 мин → семьи, шопинг, спорт.",
      "**Fraião** — T2 ~€1 000–1 400; подземные гаражи; ~7–15 мин → премиум (LuxTower); стадион — отдельно в Real/Dume.",
      "**Gondizalves** — таунхаус/дом ~€1 000–1 500+; гаражи; ~10–15 мин → тишина, вилла.",
      "**Nogueiró** — T2 ~€1 000–1 300; гаражи; ~7–15 мин → виды, Sameiro.",
      "**Lamaçães** — T2 ~€700–1 000; улица/гараж; ~5–12 мин → бюджет.",
      "**Centro** — T2 ~€900–1 300; паркинг плохой; ~7–15 мин на машине (пешком до CLIB — час).",
      "**Real/Dume** — у стадиона / Sports City; ~10–15 мин до CLIB.",
      "**«Antas» на Idealista** — часто Famalicão (~25–35 мин), не район Braga.",
      "**Maximinos** — T2 ~€700–1 000; улица; ~8–15 мин → история, термы; осторожно с авто.",
      "**Приоритет CLIB + паркинг** → Gualtar или São Vicente.",
      "**Дом/таунхаус + тишина** → Gondizalves.",
      "**Премиум nova construção** → Fraião.",
      "**Виды** → Nogueiró.",
      "**Бюджет** → Lamaçães или Maximinos (заложите паркинг).",
    ],
  },
  {
    heading: "Пошагово: маршрут осмотра за 2,5–3 часа",
    section_kind: "action_guide",
    paragraphs: [
      "Зачем: без замера времени «до школы» таблица районов остаётся теорией.",
      "Что делать: стартовать у CLIB, объехать кольцо районов, финишировать снова у CLIB.",
      "Главное: смотрите паркинг у объявления глазами — не верьте только тексту Idealista.",
    ],
    bullets: [
      "Шаг 1 — CLIB (Gualtar): старт, засеките время и парковку у школы.",
      "Шаг 2 — Gualtar: новостройки у университета (~5 мин).",
      "Шаг 3 — São Vicente: Braga Parque и новые комплексы (~5 мин).",
      "Шаг 4 — Fraião: LuxTower / премиум (~8 мин).",
      "Шаг 5 — Nogueiró: виды и Sameiro (~10 мин).",
      "Шаг 6 — Gondizalves: дома/виллы (~12 мин); Sete Fontes — отдельный заезд у São Victor.",
      "Шаг 7 — Real/Dume: стадион / Parque Norte (~10 мин) — не путать с Fraião.",
      "Шаг 8 — Centro: Sé / Souto — оцените паркинг (~8 мин).",
      "Шаг 9 — Maximinos: термы (~10 мин).",
      "Шаг 10 — Обратно в CLIB: финальный замер в час пик.",
      "Итого с остановками: **2,5–3 часа**. Контракт и IBAN — [гайд по аренде](/notes/" + PORTO_BRAGA_LONG_TERM_RENT_SLUG + ").",
    ],
  },
  {
    heading: "Где объявления и жизнь расходятся",
    section_kind: "gap",
    bullets: [
      "Idealista: «5 мин до школы» → утром у CLIB часто 12–15.",
      "«Antas, Braga, 10 мин до CLIB» → проверьте município: часто Famalicão.",
      "«Fraião у стадиона» → стадион в Real/Dume.",
      "«Пешком из центра до CLIB 20 мин» → ~4,5+ км, ближе к часу.",
      "«Паркинг включён» → иногда место на 1 авто; второй — улица или отдельная аренда.",
      "Centro «романтично для семьи» → без гаража ежедневный стресс сильнее вида на Sé.",
      "«Дешевле Porto» → да по renda, но заложите машину/TUB и кружки; сравнение — [Порту vs Брага](/notes/" + PORTO_VS_BRAGA_FAMILY_SCHOOLS_SLUG + ").",
      "Fees CLIB «на сайте» → часто on request; admissions + bus отдельно от аренды.",
    ],
  },
  {
    heading: "Типичные ошибки семей при выборе района",
    section_kind: "practice",
    paragraphs: [
      "Оптимально: школа + паркинг + один воскресный парк. Ошибки ниже — классика переезда в Braga.",
    ],
    bullets: [
      "Ошибка: снять центр ради «атмосферы», имея два авто и pedibus до CLIB.",
      "Ошибка: не замерить утренний commute в сентябре (школьный трафик).",
      "Ошибка: смотреть только T2-цену, игнорируя condomínio и garagem.",
      "Ошибка: выбрать Esposende «ради моря» без плана 30–40 мин до CLIB каждый день.",
      "Ошибка: подписывать contrato без registo Finanças — слабее для morada/школы.",
      "Ошибка: не проверить влажность/плесень в старом prédio зимой.",
    ],
  },
];

const keyTakeaways = [
  "Официально: Брага — Minho + UMinho + CLIB в Gualtar; до Porto ~40–55 мин; аренду и commute сверяйте сами.",
  formatPracticeTakeaway({
    channels: ["braga_pt_rus", "por_tugal"],
    period: "2026",
    claim:
      "для семьи с CLIB чаще всего работают Gualtar и São Vicente (паркинг + 5–10 мин), а Centro Histórico проигрывает из‑за парковки",
    forReader: "сначала школа и гараж, потом романтика Sé",
  }),
  formatPracticeTakeaway({
    channels: ["por_tugal"],
    period: "2026",
    claim:
      "дома и тишина — Gondizalves; премиум nova construção — Fraião; виды — Nogueiró; бюджет — Lamaçães/Maximinos с оговоркой по паркингу",
    forReader: "не оптимизируйте все критерии одним районом",
  }),
  "Расхождение: «5 минут до CLIB» в объявлении ≠ утро сентября; замерьте кольцо осмотра 2,5–3 часа.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Какой район выбрать, если ребёнок в CLIB?",
    a: "Gualtar (2–5 мин авто / пешком рядом с кампусом) или São Vicente (5–10 мин + Braga Parque). Fraião, Nogueiró, Gondizalves — чаще 7–15 мин. Centro — машина 7–15 и боль с паркингом; пешком до CLIB не рассчитывайте. «Antas» проверьте: не Famalicão ли.",
  },
  {
    q: "Сколько стоит T2 в Браге в 2026?",
    a: "Ориентиры: Lamaçães/São Vicente часто €700–1 000; Gualtar и Nogueiró чаще €900–1 300; Fraião премиум €1 000–1 400+. Плюс caução, condomínio и возможная аренда второго паркинга — сверяйте Idealista на дату поиска.",
  },
  {
    q: "Где жить с машиной, а где без?",
    a: "С машиной комфортнее Gualtar, São Vicente, Fraião, Gondizalves, Nogueiró, Real/Dume. Centro Histórico и Maximinos — риск ежедневного дефицита парковки; для семьи с авто обычно не рекомендуем как первый выбор.",
  },
  {
    q: "Какие парки и спорт не зависят от района?",
    a: "Parque da Ponte и Piscina Municipal da Ponte — база для многих семей. Holmes Place у Gualtar — премиум. Стадион и Cidade Desportiva — Real/Dume, не Fraião. Bom Jesus и Sameiro — выходные с видом.",
  },
  {
    q: "Как связан этот гайд с арендой и школами?",
    a: "Здесь — карта районов и быт. Контракт, IBAN, recibo — в гайде по долгосрочной аренде Porto/Braga. CLIB vs Porto schools — в гайде «Порту vs Брага» и в обзоре международных школ.",
  },
  {
    q: "Сколько занимает осмотр всех районов?",
    a: "Кольцо от CLIB: Gualtar → São Vicente → Fraião → Nogueiró → Gondizalves → Real/Dume (стадион) → Centro → Maximinos и обратно — ~2,5–3 часа. Утренний пик замерьте отдельно.",
  },
];

export const BRAGA_DISTRICTS_GUIDE = {
  slug: BRAGA_DISTRICTS_GUIDE_SLUG,
  category: "Жильё",
  content_kind: "guide" as ContentKind,
  title: "Полный гайд по Браге: районы, аренда, парки, спорт и жизнь",
  excerpt:
    "Gualtar, São Vicente, Fraião, Gondizalves, Nogueiró, Lamaçães, Centro, Real/Dume, Maximinos: аренда, паркинг, парки, спорт и время до CLIB — без ловушки «Antas».",
  seo_title: "Брага — районы, аренда, парки 2026",
  seo_description:
    "Полный гайд по Браге 2026: районы Gualtar, São Vicente, Fraião и другие, аренда T2, паркинг, парки, спорт и время до CLIB — для семей в Minho.",
  quick_answer:
    "Брага — Minho + UMinho + CLIB в Gualtar: до Porto ~40–55 мин. Семье с CLIB чаще Gualtar (2–5 мин) и São Vicente (5–10). Fraião — премиум (не стадион); стадион — Real/Dume; Gondizalves — дома на западе; Sete Fontes — São Victor. Centro красив, но паркинг и не «пешком до CLIB за 20 мин». Меряйте утро сами.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "Câmara Municipal de Braga", url: "https://www.cm-braga.pt/" },
    { title: "TUB — Transportes Urbanos de Braga", url: "https://www.tub.pt/" },
    { title: "Universidade do Minho", url: "https://www.uminho.pt/" },
    { title: "CLIB — Colégio Luso-Internacional de Braga", url: "https://www.clib.pt/" },
    { title: "Idealista — arrendamento Braga", url: "https://www.idealista.pt/arrendar-casas/braga/" },
    { title: "Visit Braga", url: "https://www.visitbraga.travel/" },
  ],
  topic_tags: ["arenda", "portugal", "norte", "braga", "zhile"],
  hashtags: buildNoteHashtags({
    topicTags: ["arenda", "portugal", "norte"],
    contentKind: "guide",
    extra: ["braga", "gualtar", "clib", "minho", "parki"],
  }),
  source_channel: "editorial+official",
  source_label: "editorial:braga-districts-2026",
};
