/** Hand-curated guide — see lib/community-notes/editorial-presentation.ts for writing rules. */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { CAR_PORTUGAL_GUIDE_SLUG } from "@/lib/community-notes/guides/car-portugal-buy-rent-import";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const LAND_BUILD_NORTE_GUIDE_SLUG = "pokupka-zemli-postroyka-doma-norte-portugaliya-2026";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(glossaryForSlug(LAND_BUILD_NORTE_GUIDE_SLUG)!),
  },
  {
    heading: "Официально: PDM, зонирование и право строить",
    section_kind: "official",
    paragraphs: [
      "Покупка terreno и постройка casa em Portugal — не «купил поле и строю». Сначала проверяют Plano Director Municipal (PDM) concelho: можно ли там жилое строительство, какой coeficiente de utilização, высота, отступы от границ.",
      "Земля делится на solo urbano (можно строить при соблюдении PDM), solo rustico (сельхоз/лес — строительство ограничено; жилой дом только при reconversão или особых случаях) и solo industrial. Новый lei dos solos (2025) расширяет перевод сельхозземель в urbano для доступного жилья — но решение за Câmara Municipal.",
    ],
    bullets: [
      "PDM (Plano Director Municipal) — муниципальный генеральный план; смотрите на сайте Câmara (Porto, Braga, Guimarães, Viana, Esposende и т.д.).",
      "Certidão de informação urbanística — официальная выписка Câmara: зона, можно ли licença de construção, ограничения (Natura, flood, archaeological).",
      "Solo urbano: licença de construção (obra nova) через Câmara + projeto arquiteto + topógrafo; срок рассмотрения — месяцы, не недели.",
      "Solo rustico: строительство жилого дома почти всегда требует alteração PIP/PDM или reconversão — без этого licença не выдадут.",
      "IMT (Imposto Municipal sobre Transmissões) при покупке земли — ставка зависит от типа imóvel и муниципалитета; симулятор на Portal das Finanças.",
      "Registo Predial / Conservatória — проверка собственника, encargos, servidões; покупка без certidão permanente — риск.",
    ],
  },
  {
    heading: "Официально: licença de construção и IMT",
    section_kind: "official",
    paragraphs: [
      "После покупки terreno с правом строить подают pedido de licença de construção в Câmara Municipal. Нужны: projeto de arquitetura, topografia, estudos (estrutural, térmico, acústico), comprovativo propriedade, taxas municipais.",
    ],
    bullets: [
      "Arquiteto (arquiteto habilitado OA) — обязателен для projeto; подаёт в Câmara от имени владельца.",
      "Topógrafo — levantamento topográfico границ, кадастр, привязка к PDM; без точных границ соседи могут оспорить licença.",
      "Licença de construção: этапы — instrução → публикация → decisão; при дозапросах prazo продлевается.",
      "Alvará de construção / empreiteiro: работы ведёт licenciado construtor; самострой без licença — multa и снос.",
      "IMT на покупку terreno: для urbano часто 6,5–7,5% + Imposto do Selo; для rustico другие ставки — считайте до сделки.",
      "Vistoria final + licença de utilização (habitação) — без неё нельзя легально жить; подключение água/luz требует licença de utilização.",
    ],
  },
  {
    heading: "Norte: где смотреть участки и что спрашивать",
    section_kind: "practice",
    paragraphs: [
      "В @lepta и @por_tugal 2025–2026 Norte популярен у релокантов, которые хотят дом вместо аренды в Porto/Braga. Типичные concelhos: Braga (пригороды Gualtar, Celeirós), Guimarães, Vila Nova de Famalicão, Esposende, Viana, Ponte de Lima, Amarante.",
    ],
    bullets: [
      "Idealista / Imovirtual — основные порталы; фильтр «terreno» + concelho; цены rustico в Minho от €15–40/м², urbano выше.",
      "lepta (2025): ~30% земель в PT с неизвестными владельцами — перед сделкой certidão permanente и advogado обязательны.",
      "Braga / Guimarães: PSD силён на севере (por_tugal, выборы 2025) — муниципалитеты консервативнее в выдаче licenças, чем «на словах» обещают.",
      "Esposende / Ofir: terreno у моря дороже; проверяйте PDM на flood/coastal constraints — не всё «с видом на океан» можно застроить.",
      "Ponte de Lima / Amarante: rustico дешевле, но reconversão solo pode занять 12–24 мес. + €5 000–15 000 юрист/архитектор.",
      "Vila do Conde / Maia: ближе к Porto OPO; lepta: кейс лесопилки в 50 см от дома — всегда проверяйте соседние licenças и PIP.",
      "Очистка участка: lepta — владельцы обязаны чистить terreno от brushwood до срока против пожаров; штрафы за просрочку.",
      "Связь с бытом: без авто в rural Norte сложно — см. [гайд по машине](/notes/" + CAR_PORTUGAL_GUIDE_SLUG + "); OPO 30–60 мин от Minho.",
    ],
  },
  {
    heading: "Бюджет строительства и подрядчики",
    section_kind: "practice",
    paragraphs: [
      "В чатах @chatlisboa и @por_tugal типичный бюджет «участок + дом под ключ» в Norte 2026 — €200 000–450 000 в зависимости от м², отделки и близости к Porto. lepta (2025): правительство признало рост цен на стройматериалы — закладывайте инфляцию 5–10% в смету.",
    ],
    bullets: [
      "Terreno urbano 500–1 000 m² в Braga/Guimarães: €50 000–120 000; rustico с reconversão — дешевле участок, дороже согласования.",
      "Строительство casa 150–200 m²: €1 200–1 800/m² (empreiteiro geral, 2026); архитектура + topografia + проекты — €8 000–25 000.",
      "Сроки: покупка terreno 1–2 мес.; licença de construção 4–12 мес.; стройка 10–18 мес. — итого 18–30 мес. «под ключ».",
      "IMT + notário + registo: €5 000–15 000 на сделку земли (зависит от цены); на стройку IVA 23% на работы (частично возмещается при habitação própria permanente).",
      "Empreiteiro: берите с alvará и referências в concelho; orçamento фиксируйте в contrato com prazos e penalidades.",
      "Arquiteto: 8–12% от стоимости стройки или фикс €10 000–20 000; ведёт licenciamento и vistorias Câmara.",
      "Topógrafo: €600–1 500 за levantamento; нужен до projeto и для границ при спорах с соседями.",
      "Первый месяц после сдачи: NIF, morada, utente SNS, электричество EDP/Iberdrola — [чеклист первого месяца](/notes/pervyj-mesyac-portugaliya-checklist).",
    ],
  },
  {
    heading: "Где закон и практика расходятся",
    section_kind: "gap",
    bullets: [
      "Lei dos solos: «снизит цены на жильё на 20%» (lepta, 2025) → reconversão rustico в urbano занимает годы; не каждый участок подходит.",
      "Объявление: «terreno com possibilidade de construção» → без certidão urbanística это маркетинг; possibilidade ≠ licença garantida.",
      "«Куплю rustico дёшево и поставлю modular» → modular тоже требует licença; вне solo urbano почти всегда отказ.",
      "Соседи: «участок тихий» → lepta Vila do Conde: лицензированное производство в 50 см от дома — проверяйте PIP соседей.",
      "Цены материалов: план правительства (lepta) — на практике смета empreiteiro растёт по ходу obra; закладывайте 10–15% резерв.",
      "30% земель без известного владельца → наследственные споры и двойные продажи; advogado + certidão до депозита.",
      "Шум и работы: lepta — закон о тишине ограничивает часы obra; штрафы за работы вне horário.",
      "Подключения: Câmara выдала licença → на практике água/ESGOTOS/EDP в rural 3–9 мес. очередь и взносы acesso.",
    ],
  },
  {
    heading: "Таймлайн покупки и типичные ошибки",
    section_kind: "practice",
    paragraphs: [
      "Реалистичный путь релоканта: NIF → поиск terreno с advogado → certidão urbanística → CPCV (предконтракт) → escritura → projeto → licença → obra → licença de utilização → переезд.",
    ],
    bullets: [
      "Ошибка: депозит на terreno без certidão de informação urbanística и проверки PDM.",
      "Ошибка: экономия на topógrafo — споры по границам останавливают licença на месяцы.",
      "Ошибка: verbal deal с empreiteiro без contrato, prazos и IVA в fatura.",
      "Ошибка: не заложить IMT + notário + проекты в бюджет — «только цена земли» обманчива.",
      "Ошибка: покупка rustico «ради вида» без плана reconversão — licença de habitação может не случиться.",
      "Ошибка: игнорировать limpeza de terreno — штрафы GNR/мunicipio и риск пожара (lepta, 2025).",
      "Ошибка: начать obra до licença de construção — multa, снос, невозможность utilização.",
    ],
  },
];

const keyTakeaways = [
  "Официально: строить можно только при соответствии PDM; certidão urbanística Câmara — первый документ после выбора участка.",
  "Официально: licença de construção требует arquiteto, topógrafo и empreiteiro с alvará; IMT при покупке земли — через Finanças.",
  "На практике: Norte (Braga, Guimarães, Esposende, Viana) — популярные concelhos; бюджет участок+дом €200k–450k в 2026.",
  "На практике: lepta — 30% земель с неизвестным владельцем; advogado и certidão permanente до сделки обязательны.",
  "На практике: срок «под ключ» 18–30 мес.; licença 4–12 мес., стройка 10–18 мес.",
  "Расхождение: «terreno com possibilidade de construção» в объявлении → без certidão urbanística это не гарантия licença.",
  "На практике: rustico дешевле, но reconversão solo по lei dos solos — долго; urbano дороже, но предсказуемее.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Можно ли купить землю в Norte и сразу строить дом?",
    a: "По правилам — только если участок solo urbano и PDM разрешает habitação. На практике сначала certidão urbanística в Câmara, затем projeto и licença (4–12 мес.); стройка без licença — штраф и снос.",
  },
  {
    q: "Что такое PDM и где его смотреть?",
    a: "Plano Director Municipal — генеральный план concelho. Официально публикуется на сайте Câmara Municipal (Braga, Porto, Guimarães и др.). На практике закажите certidão de informação urbanística по конкретному terreno — это юридически точнее карты.",
  },
  {
    q: "Сколько стоит IMT при покупке участка?",
    a: "По правилам Finanças ставка зависит от типа imóvel и муниципалитета (часто 6,5–7,5% для urbano + Imposto do Selo). На практике используйте симулятор IMT на portaldasfinancas.gov.pt до подписания CPCV.",
  },
  {
    q: "Нужны ли arquiteto и topógrafo?",
    a: "Да, по правилам licenciamento arquiteto OA обязателен для projeto; topógrafo — для границ и привязки к PDM. На практике без topografia споры с соседями — частая причина задержки licença на 6+ месяцев.",
  },
  {
    q: "Какие муниципалитеты Norte выбирают релоканты?",
    a: "Braga, Guimarães, Esposende, Viana do Castelo, Ponte de Lima, Amarante, Vila Nova de Famalicão — баланс цены и доступа к Porto. По правилам везде свой PDM; на практике Braga/Guimarães проще с инфраструктурой, Esposende — с морем, но дороже terreno.",
  },
  {
    q: "Сколько времени занимает постройка дома?",
    a: "Официально сроки licença задаёт Câmara (месяцы). На практике полный цикл 18–30 мес.: сделка 1–2 мес., licença 4–12 мес., obra 10–18 мес., licença de utilização 1–2 мес.",
  },
];

export const LAND_BUILD_NORTE_GUIDE = {
  slug: LAND_BUILD_NORTE_GUIDE_SLUG,
  category: "Жильё и быт",
  content_kind: "guide" as ContentKind,
  title: "Покупка земли и постройка дома в Norte Португалии 2026: PDM, licença, IMT",
  excerpt:
    "Terreno в Braga, Guimarães, Esposende: PDM, certidão urbanística, licença de construção, arquiteto, topógrafo, IMT и сроки для релокантов.",
  seo_title: "Земля и постройка дома Norte PT 2026",
  seo_description:
    "Гайд по покупке земли и строительству дома в Norte Португалии 2026: PDM, licença de construção, IMT, topógrafo, arquiteto, сроки и подводные камни в Braga и Minho.",
  quick_answer:
    "На карте Esposende — зелёный участок у океана, а в Câmara говорят: сначала PDM и certidão urbanística. Покупка terreno и постройка casa в Norte начинается с муниципалитета; solo urbano — licença через arquiteto (4–12 мес.). Бюджет участок+дом €200k–450k, срок 18–30 мес.; IMT — симулятор Finanças.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "Portal das Finanças — IMT", url: "https://www.portaldasfinancas.gov.pt/" },
    { title: "ePortugal — Urbanismo", url: "https://eportugal.gov.pt/" },
    { title: "Câmara Municipal de Braga", url: "https://www.cm-braga.pt/" },
    { title: "Câmara Municipal de Guimarães", url: "https://www.guimaraes.pt/" },
    { title: "Ordem dos Arquitetos", url: "https://www.arquitetos.pt/" },
    { title: "Diário da República — lei dos solos", url: "https://dre.pt/" },
  ],
  topic_tags: ["arenda", "portugal"],
  hashtags: buildNoteHashtags({
    topicTags: ["arenda", "portugal"],
    contentKind: "guide",
    extra: ["porto", "braga", "norte", "terreno", "строительство", "жильё"],
  }),
  source_channel: "chatlisboa+por_tugal+lepta",
  source_label: "editorial:land-build-norte",
};
