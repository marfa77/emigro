/** Hand-curated guide — voice «Опытный релокант за кофе» (lib/community-notes/editorial-voice.ts). */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { formatPracticeTakeaway } from "@/lib/community-notes/practice-format";
import { LAND_BUILD_NORTE_GUIDE_SLUG } from "@/lib/community-notes/guides/land-build-norte-portugal";
import { NORTE_CLIMATE_COMFORT_SLUG } from "@/lib/community-notes/guides/norte-climate-comfort";
import { PORTO_BRAGA_LONG_TERM_RENT_SLUG } from "@/lib/community-notes/guides/porto-braga-long-term-rent";
import { PORTO_VS_BRAGA_FAMILY_SCHOOLS_SLUG } from "@/lib/community-notes/guides/porto-vs-braga-family-schools";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const APARTMENT_BUY_NORTE_GUIDE_SLUG = "kupit-kvartiru-portugaliya-norte-2026";

const GLOSSARY_INTRO =
  "Слова, которые услышите у promotor, в notário и в balcão банка — разберём заранее, пока не пришёл contrato-promessa на 40 страниц без пояснений.";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(glossaryForSlug(APARTMENT_BUY_NORTE_GUIDE_SLUG)!, GLOSSARY_INTRO),
  },
  {
    heading: "Официально: CPCV, escritura и налоги при покупке",
    section_kind: "official",
    paragraphs: [
      "Зачем вам это сейчас: без понимания этапов вы подпишете CPCV с депозитом 10–20%, не зная, что IMT и Imposto do Selo платятся до escritura.",
      "Что делать: сверить цепочку CPCV → due diligence → simulação IMT → escritura в Conservatória / notário.",
      "Зачем: promotor и частник используют одни и те же формальные шаги; разница — в гарантиях, сроках сдачи и проверках.",
      "Главное: CPCV — обязательство купить; escritura — переход права собственности; IMT — налог на передачу, считайте до депозита.",
    ],
    bullets: [
      "CPCV (contrato-promessa de compra e venda) — предварительный договор: цена, срок escritura, штрафы за отказ, размер sinal (депозит 10–30%).",
      "Escritura pública — нотариальный акт купли-продажи; после неё — registo na Conservatória do Registo Predial.",
      "IMT (Imposto Municipal sobre Transmissões) — налог на передачу; ставка зависит от типа imóvel, цены и муниципалитета; симулятор на Portal das Finanças.",
      "Imposto do Selo — дополнительный гербовый сбор на сделку и кредит; ~0,8% на покупку + ставка на crédito habitação.",
      "Notário (notário público) — удостоверяет escritura; гонорар €500–1 500 в зависимости от цены и кредита.",
    ],
  },
  {
    heading: "Официально: документы и проверки до сделки",
    section_kind: "official",
    paragraphs: [
      "Зачем вам это сейчас: certidão permanente и caderneta predial показывают, кому реально принадлежит квартира и есть ли долги.",
      "Что делать: заказать certidão permanente, caderneta predial, licença de utilização и certificado energético до подписи CPCV.",
      "Зачем: без due diligence вы можете купить квартиру с hipoteca, dívidas de condomínio или без licença de utilização.",
      "Главное: advogado (advogado) или solicitador проверяет registo predial — это не опция, а страховка на €200k+ сделки.",
    ],
    bullets: [
      "Certidão permanente — выписка из реестра собственности; показывает titular, hipotecas, penhoras, servidões.",
      "Caderneta predial — налоговая характеристика imóvel (área, valor patrimonial, IMI); запрашивается в Finanças.",
      "Licença de utilização — разрешение на проживание; без неё банк может не выдать crédito и нельзя легально жить.",
      "Certificado energético (certificado energético) — класс A+–G; обязателен при продаже; влияет на расходы отопления.",
      "Registo predial / Conservatória — официальный реестр прав; escritura без registo не защищает от третьих лиц.",
    ],
  },
  {
    heading: "Новостройка Norte: promotor, empreendimento и цены 2026",
    section_kind: "practice",
    paragraphs: [
      "Что делать: сравнить empreendimentos в Porto, Matosinhos, Gaia, Braga, Guimarães и Vila Nova de Famalicão — цена за m², срок entrega, garantias.",
      "Зачем: у promotor другие риски, чем у частника: задержка obra, изменение планировки, condomínio в новом prédio.",
      "Главное: сравнивайте €/m² и срок entrega — не макет в шоуруме, а cláusulas CPCV и histórico promotor.",
    ],
    bullets: [
      "Porto (Boavista, Campanhã, Paranhos) — T2 новостройка €3 500–5 500/m²; квартира 80 m² ≈ €280 000–440 000; entrega 2027–2028.",
      "Matosinhos / Gaia (прибрежные зоны) — T2 €3 200–4 800/m²; пляж рядом, но condomínio в новых башнях €80–150/мес.",
      "Braga (Gualtar, centro) — T2 €2 200–3 500/m²; 75 m² ≈ €165 000–260 000; спрос от expat-семей с CLIB.",
      "Guimarães / Vila Nova de Famalicão — T2 €1 800–2 800/m²; €140 000–220 000; commute до Porto 30–45 мин по A3/A7.",
      "Promotor imobiliário даёт фиксированную цена «chave na mão», гарантию 5 лет на construção + 2 года на equipamentos (DL 84/2021).",
      "Альтернатива квартире — [участок и дом](/notes/" + LAND_BUILD_NORTE_GUIDE_SLUG + ") в Minho; бюджет сопоставим, но срок 18–30 мес.",
    ],
  },
  {
    heading: "Вторичка: Idealista, due diligence и старые prédios",
    section_kind: "practice",
    paragraphs: [
      "Что делать: искать на Idealista/Imovirtual, проверять registo predial и долги condomínio; для старых домов — осмотр на humidade.",
      "Зачем: вторичка в Norte часто дешевле новостройки на 15–25%, но ремонт и bolor могут съесть экономию.",
      "Главное: осмотр зимой и проверка atas condomínio — два фильтра, которые отсекают половину «выгодных» объявлений.",
    ],
    bullets: [
      "Idealista.pt / Imovirtual — основные порталы; фильтр «venda» + concelho; imobiliária берёт 5% + IVA у продавца, но иногда «перекладывают».",
      "Частная продажа (FSBO) — дешевле на комиссию, но без агентства вы сами проверяете документы; advogado обязателен.",
      "Проверьте atas de condomínio — долги предыдущего владельца могут перейти; запросите certidão de dívidas у administrador.",
      "Старые prédios Porto/Braga (до 1980-х) — humidade, bolor, отсутствие isolamento; осмотр зимой обязателен — см. [климат Norte](/notes/" +
        NORTE_CLIMATE_COMFORT_SLUG +
        ").",
      "Ремонт вторички T2 в Norte: €400–800/m² (косметика–полный); влажные стены + desumidificador + isolamento — ещё €5 000–15 000.",
      "Вторичка выигрывает, когда нужен центр Porto/Braga сейчас, а не ждать entrega 2027; или prédio с характером в Cedofeita/Bonfim.",
    ],
  },
  {
    heading: "Финансирование: crédito habitação для нерезидентов",
    section_kind: "practice",
    paragraphs: [
      "Что делать: открыть conta, получить NIF, собрать comprovativos дохода и подать simulação в 2–3 банка (Millennium, Caixa, Santander, Novo Banco).",
      "Зачем: без предодобрения crédito вы рискуете CPCV с жёстким сроком, а банк откажет из-за формата дохода.",
      "Главное: simulação в двух банках до CPCV — это ваш рычаг, а не «потом разберёмся».",
    ],
    bullets: [
      "NIF (Número de Identificação Fiscal) — обязателен до CPCV и симуляции IMT; оформите до поиска квартиры.",
      "Банки дают нерезидентам до 70–80% LTV при доходе в EU/UK/US; паспорт RU/BY/UA — кейс-за-кейсом, часто 60–70%.",
      "Comprovativo de rendimentos: payslips 3–6 мес., declaração IRS/налоговая, employment contract; self-employed — IRS + contabilista.",
      "Spread + Euribor 2026: ставка crédito habitação ≈ 3,5–4,5%; на €250 000 на 30 лет — взнос €1 100–1 350/мес.",
      "Банк требует avaliação bancária imóvel — оценщик банка; если оценка ниже цены, доплатите разницу наличными.",
      "Откройте счёт заранее — [гайд по банку](/notes/kak-otkryt-bankovskiy-schet-portugalia-2026); без PT IBAN sinal часто не принимают.",
    ],
  },
  {
    heading: "Пошагово для новичка: от Idealista до chaves",
    section_kind: "action_guide",
    paragraphs: [
      "Зачем вам это сейчас: покупка — цепочка из 8–12 шагов; пропуск due diligence стоит дороже, чем advogado.",
      "Что делать: NIF → предодобрение банка → поиск → due diligence → CPCV → IMT → escritura → registo → chaves.",
      "Зачем: каждый шаг даёт leverage — до CPCV вы ещё можете выйти; после sinal 10–20% — штраф.",
      "Главное: не подписывайте CPCV без certidão permanente, licença de utilização и simulação IMT в руках.",
    ],
    bullets: [
      "Шаг 1 — NIF + conta bancária + simulação crédito habitação в 2 банках (Millennium, Caixa).",
      "Шаг 2 — Поиск: Idealista/Imovirtual или стенд promotor; сравните €/m² в [Порту vs Брага](/notes/" +
        PORTO_VS_BRAGA_FAMILY_SCHOOLS_SLUG +
        ").",
      "Шаг 3 — Просмотр: snagging-чеклист для новостройки; humidade/bolor для вторички — [климат Norte](/notes/" +
        NORTE_CLIMATE_COMFORT_SLUG +
        ").",
      "Шаг 4 — Due diligence: advogado заказывает certidão permanente, caderneta predial, licença de utilização, atas condomínio.",
      "Шаг 5 — CPCV: цена, sinal, prazo escritura, cláusulas расторжения; для obra nova — penalidades за atraso entrega.",
      "Шаг 6 — Simulação IMT + Imposto do Selo → оплата Finanças → escritura у notário → registo Conservatória → chaves.",
    ],
  },
  {
    heading: "Где сайт promotor и практика расходятся",
    section_kind: "gap",
    paragraphs: [
      "Что делать: сверять обещания promotor и объявления Idealista с документами и опытом релокантов в Norte.",
      "Зачем: маркетинговые формулировки («pronto a habitar», «entrega 2026») редко совпадают с cláusulas CPCV и реальными сроками.",
      "Главное: если обещание не вписано в CPCV — это не обещание, а реклама.",
    ],
    bullets: [
      "Promotor: «entrega Q4 2026» → на практике задержки 6–18 мес. типичны; проверяйте histórico promotor в IMPIC/прессе.",
      "Объявление Idealista: «pronto a habitar» → без licença de utilização это маркетинг; запросите документ до CPCV.",
      "«Condomínio €50» в брошюре → после assembleia первого года расходы на elevador, seguro, manutenção растут на 20–40%.",
      "Банк: «одобрим 80%» на сайте → для нерезидента без PT дохода реально 60–70%; simulação ≠ aprovação final.",
      "Вторичка: «ремонт косметический» → в старом prédio Porto humidade за шкафами; осмотр зимой показывает реальную картину.",
      "CPCV: «sinal возвращается при отказе банка» → читайте cláusula: часто возврат только при recusa bancária documentada в prazo.",
      "«Квартира с vista Douro» в Gaia → проверьте PIP/altura соседних empreendimentos — вид могут перекрыть через 2 года.",
      "Налоги: симулятор IMT на Finanças → на практике notário и advogado добавляют Imposto do Selo на crédito — закладывайте +1–2% к цене.",
    ],
  },
  {
    heading: "Типичные ошибки и таймлайн покупки",
    section_kind: "practice",
    paragraphs: [
      "Реалистичный таймлайн: поиск 1–3 мес. → due diligence 2–4 нед. → CPCV → escritura 30–90 дней → registo 2–4 нед. Итого 3–6 мес. от первого просмотра до chaves.",
      "Главное: advogado + simulação IMT + vistoria — три траты, которые дешевле одной ошибки на €200k сделке.",
    ],
    bullets: [
      "Ошибка: sinal 20% до проверки certidão permanente — encargos и hipoteca останутся вашей проблемой.",
      "Ошибка: покупка obra nova без cláusul penalidades за atraso — promotor сдвигает entrega без компенсации.",
      "Ошибка: пропустить vistoria (snagging) на новостройке — царапины и протечки после escritura исправляются сложнее.",
      "Ошибка: не проверить dívidas de condomínio — долг €3 000–10 000 переходит к новому proprietário.",
      "Ошибка: CPCV без условия finaciamento — отказ банка = потеря sinal, если нет cláusula suspensiva.",
      "Ошибка: игнорировать humidade во вторичке Bonfim/Cedofeita — ремонт €15 000+; аренда для пробы — [аренда Porto/Braga](/notes/" +
        PORTO_BRAGA_LONG_TERM_RENT_SLUG +
        ").",
      "Ошибка: не закладывать IMT + notário + registo в бюджет — добавьте 7–10% к цене квартиры сверху.",
    ],
  },
];

const keyTakeaways = [
  "Официально: CPCV → simulação IMT → escritura → registo na Conservatória; certidão permanente и licença de utilização — до депозита.",
  formatPracticeTakeaway({
    channels: ["por_tugal"],
    period: "2026",
    claim: "новостройка T2 в Porto стоит примерно €280k–440k, в Braga — €165k–260k",
    forReader: "вторичка на 15–25% дешевле за m², но ремонт закладывайте от €400–800/m²",
  }),
  formatPracticeTakeaway({
    channels: ["por_tugal"],
    period: "2026",
    claim:
      "банки дают crédito habitação (ипотеку) нерезидентам на 60–80% LTV при NIF, conta и comprovativos до CPCV",
    forReader: "ставка в 2026 ориентир ≈ 3,5–4,5% — симуляцию делайте до подписания задатка",
  }),
  "Расхождение: «entrega 2026» у promotor → реально +6–18 мес.; snagging и cláusula atraso — обязательны в CPCV.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Сколько стоит квартира T2 в Norte в 2026?",
    a: "От €140 000 в Guimarães/Famalicão до €440 000 в Porto (Boavista). По правилам цена = valor escritura для IMT. На практике новостройка €2 200–5 500/m² в зависимости от concelho; вторичка на 15–25% дешевле за m², но ремонт отдельно.",
  },
  {
    q: "Чем покупка у promotor отличается от частника?",
    a: "У promotor: фиксированная цена, гарантия 5+2 года, vistoria em obra nova, риск задержки entrega. У частника: торг, быстрее escritura, но без гарантий и с риском скрытых дефектов. По правилам CPCV и IMT одинаковы; на практике у promotor condomínio в новом prédio формируется с нуля.",
  },
  {
    q: "Какой IMT при покупке квартиры?",
    a: "Зависит от цены, типа (habitação própria permanente или não) и муниципалитета. По правилам — симулятор на portaldasfinancas.gov.pt. На практике на €250 000 в Porto закладывайте €8 000–15 000 (IMT + Imposto do Selo + notário).",
  },
  {
    q: "Можно ли купить квартиру без ВНЖ?",
    a: "Да, покупка imóvel не требует autorização de residência. По правилам нужен NIF и comprovativo de fundos. На практике банк для crédito habitação может запросить вид на жительство или крупный первоначальный взнос (30–40%).",
  },
  {
    q: "Нужен ли advogado при покупке?",
    a: "Формально escritura у notário достаточна. На практике advogado (€1 500–3 000) проверяет registo predial, condomínio, licença de utilização и cláusулы CPCV — окупается на первой же скрытой hipoteca.",
  },
  {
    q: "Когда вторичка лучше новостройки в Norte?",
    a: "Когда нужно въехать сразу, важен центр (Cedofeita, Bonfim, Braga centro) или бюджет ограничен. По правилам licença de utilização уже есть. На практике закладывайте осмотр humidade и €5 000–25 000 на ремонт; для семьи с детьми — [Порту vs Брага](/notes/" +
      PORTO_VS_BRAGA_FAMILY_SCHOOLS_SLUG +
      ").",
  },
];

export const APARTMENT_BUY_NORTE_GUIDE = {
  slug: APARTMENT_BUY_NORTE_GUIDE_SLUG,
  category: "Жильё и быт",
  content_kind: "guide" as ContentKind,
  title: "Как купить квартиру в Norte Португалии 2026: новостройка, вторичка, IMT и crédito",
  excerpt:
    "Покупка квартиры в Porto, Braga, Matosinhos: новостройка от promotor и вторичка. CPCV, escritura, IMT, crédito habitação, snagging, due diligence и цены 2026.",
  seo_title: "Купить квартиру Norte PT 2026",
  seo_description:
    "Покупка квартиры в Norte Португалии 2026: новостройка от promotor и вторичка в Porto/Braga. CPCV, escritura, IMT, crédito habitação, vistoria и проверки до сделки.",
  quick_answer:
    "В шоуруме Matosinhos promotor показывает макет с видом на океан, а в CPCV — entrega «Q4 2027» и sinal 20%. Покупка квартиры в Norte — CPCV, IMT через Finanças, escritura у notário; новостройка Porto от €280k (T2), Braga от €165k. Закладывайте 7–10% сверху на налоги и notário.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "Portal das Finanças — IMT", url: "https://www.portaldasfinancas.gov.pt/" },
    { title: "ePortugal — Comprar casa", url: "https://eportugal.gov.pt/" },
    { title: "Banco de Portugal — crédito habitação", url: "https://www.bportugal.pt/" },
    { title: "Idealista — comprar casa", url: "https://www.idealista.pt/comprar-casas/" },
    { title: "IMPIC — promotores imobiliários", url: "https://www.impic.pt/" },
    { title: "IRN — Registo Predial", url: "https://www.irn.mj.pt/" },
  ],
  topic_tags: ["arenda", "bank", "portugal"],
  hashtags: buildNoteHashtags({
    topicTags: ["arenda", "bank", "portugal"],
    contentKind: "guide",
    extra: ["porto", "braga", "norte", "matosinhos", "gaia", "новостройка", "вторичка", "imóvel", "жильё"],
  }),
  source_channel: "chatlisboa+por_tugal+autolife_pt+lepta",
  source_label: "editorial:apartment-buy-norte",
};
