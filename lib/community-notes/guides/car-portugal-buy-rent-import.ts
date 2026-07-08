import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const CAR_PORTUGAL_GUIDE_SLUG = "mashina-portugaliya-kupit-arenda-import-2026";

const bodySections: NoteBodySection[] = [
  {
    heading: "Три сценария: купить, арендовать, привезти из ЕС",
    section_kind: "official",
    paragraphs: [
      "Для релоканта в Португалии машина — это не только цена на Standvirtual. Нужно сразу понять дорожку: покупка на месте, краткосрочная аренда или ввоз уже купленного авто из другой страны ЕС.",
      "Официально любой автомобиль с португальскими номерами должен быть зарегистрирован (matrícula), застрахован (seguro automóvel obrigatório) и при необходимости пройти IPO (inspeção periódica obrigatória).",
    ],
    bullets: [
      "Купить в PT — stand/concessionário или частник; оформление DUA + registo propriedade в IMT.",
      "Аренда — rent-a-car на 2–4 недели (туризм/тест) или долгосрочный leasing через дилера/банк.",
      "Привезти из ЕС — без таможни внутри союза, но с ISV (налог на регистрацию) и постановкой на учёт в IMT.",
      "Ввоз изне ЕС — растаможка + IVA + ISV; для RU/BY номеров на практике почти невыгоден.",
      "Права: иностранные ВУ + troca по правилам IMT (см. отдельный гайд по обмену прав).",
    ],
  },
  {
    heading: "Покупка в Португалии: документы и проверки",
    section_kind: "official",
    paragraphs: [
      "Сделка оформляется через Documento Único Automóvel (DUA) — продавец и покупатель подписывают в IMT или онлайн (если оба имеют Chave Móvel Digital). Для нерезидента без CMD чаще идут в Loja do Cidadão / balcão IMT с агентом stand.",
    ],
    bullets: [
      "NIF покупателя обязателен; comprovativo de morada — для seguro и иногда для stand.",
      "Проверка истории: registo automóvel (нет liens/ареста), IPO действителен, нет активного recall (@autolife_pt: с 01.03.2026 невыполненный recall = автоматический провал IPO).",
      "ISV при покупке б/у уже уплачен — платите transferência de propriedade (~€55–65) + новый seguro.",
      "У нового авто — ISV включён в цену дилера; получаете garantia/contrato de venda.",
      "Standvirtual / OLX — дешевле, но риск скрытых дефектов; не платите до подписания DUA и сверки VIN.",
      "Financiamento: банки PT просят NIF, IRS/работу, иногда ВНЖ; ставки смотрите у Millennium, Novo Banco, Santander Totta.",
    ],
  },
  {
    heading: "Аренда и leasing: что реально работает",
    section_kind: "practice",
    paragraphs: [
      "В @chatlisboa чаще спрашивают про аренду на 2–3 недели без иностранной кредитки — это больная тема: крупные сети (Europcar, Sixt, Hertz, Avis) почти всегда требуют credit card на имя водителя.",
    ],
    bullets: [
      "Краткосрочно (1–4 недели): международные прокаты в аэропорту OPO/LIS; бронируйте с полным страхованием (CDW/Super CDW) — узкие улочки Ribeira (Porto) и дворы в Lisboa бьют бамперы.",
      "Debit card: часть локальных standов в пригороде идёт навстречу при большом депозите наличными — в чатах рекомендуют звонить, не бронировать онлайн.",
      "Rent-a-car ≠ долгосрочная аренда: для 6–12 месяцев смотрите leasing operacional / renting у дилера (Toyota, Renault, BMW Financial) — нужен NIF и кредитная история в PT.",
      "Car subscription (Kovi, Renault On Demand и аналоги) — помесячно, дороже кредита, но без заботы о IPO/ISV.",
      "Via Verde / tolls: в аренде часто включён электронный toll; без него — Multibanco + штрафы на posto.",
      "Пробный период: многие семьи месяц на прокате, параллельно ищут б/у — так проверяют парковку у дома и commute по A3/A7 (Norte) или Cascais line (Lisboa).",
    ],
  },
  {
    heading: "Пригнать машину из Европы: ISV и matrícula",
    section_kind: "practice",
    paragraphs: [
      "Популярный путь: купить б/у в Германии/Бельгии/Испании и зарегистрировать в PT. Таможни внутри ЕС нет, но ISV (Imposto Sobre Veículos) может быть крупной статьёй — зависит от CO₂, года и мощности.",
    ],
    bullets: [
      "Срок: при фиксации residência в PT иностранные номера обычно допустимы ограниченное время; затем нужна постановка на учёт — не тяните, штрафы растут.",
      "Isenção ISV при mudança de residência: если владели авто ≥6 месяцев в другой стране ЕС до переезда — возможно освобождение или снижение ISV (подтверждаете invoice + registo antigo).",
      "Документы: Certificado de conformidade (COC), certificado de matrícula, fatura/compra, inspeção IMT (или IPO после ввоза), seguro PT.",
      "Симулятор ISV на Portal das Finanças — прикиньте налог до покупки в DE; дизель старше 2010 часто «съедает» выгоду.",
      "Доставка: своим ходом (зелёная карта страховки!) или автовоз; на автовозе оформляйте CMR и фото одометра.",
      "После въезда: запись в IMT, оплата ISV, выдача новых номеров; старые export plates снимаете по правилам страны покупки.",
      "Испания/Франция рядом — часто гоняют за б/у на дизеле; сверяйте Euro norm и recall до сделки.",
    ],
  },
  {
    heading: "Где правила и жизнь расходятся",
    section_kind: "gap",
    bullets: [
      "«Куплю на OLX дёшево» → скрытый recall / залог у банка / просроченное IPO — проверка в IMT online обязательна.",
      "«Привезу из DE — сэкономлю» → ISV на мощный бензин/старый дизель съедает разницу; плюс 2–4 недели бюрократии.",
      "«Арендую без кредитки» → крупные сети откажут; локалы — залог €500–1500 наличными, не все делают.",
      "«Езжу на иностранных номерах год» → после residência нужна PT matrícula; полиция и страховка могут оспорить.",
      "Забастовки IMT/реестров (@autolife_pt, июнь 2026) — переносите DUA, matrícula и обмен прав на спокойные недели.",
      "Seguro: онлайн дешевле, но для свежего import иногда требуют inspeção — закладывайте время.",
    ],
  },
  {
    ...buildGlossarySection(glossaryForSlug(CAR_PORTUGAL_GUIDE_SLUG)!),
  },
  {
    heading: "Типичные ошибки релокантов",
    section_kind: "practice",
    bullets: [
      "Покупка до получения NIF и парковочного места — в Porto centro/Braga historic centre парковка не проще, чем в Lisboa/Cascais; seguro и IUC те же.",
      "Не проверить recall перед IPO — с марта 2026 машина не пройдёт техосмотр.",
      "Оплата депозита за б/у без contrato de promessa de compra e venda.",
      "Игнор ISV при import — налог выше цены машины на малолитражках не редкость из-за шкалы CO₂.",
      "Страховка только PT-minimum без стекла/угона — ремонт кузова в PT дорогой.",
      "Не подключить Via Verde / EasyToll — штрафы на Via Verde накапливаются месяцами.",
      "Забыть про IUC (ежегодный дорожный налог) — приходит письмом в Finanças после matrícula.",
      "Ввоз без зелёной карты или с просроченным техосмотром страны выезда — риск на границе.",
    ],
  },
];

const keyTakeaways = [
  "Официально: любой автомобиль в PT — matrícula, seguro obrigatório, IPO по графику; сделка через DUA в IMT.",
  "На практике: купить на Standvirtual дешевле, но проверяйте recall, liens и IPO до оплаты.",
  "Официально: ввоз из ЕС без таможни, но ISV платится при первой регистрации в Португалии.",
  "На практике: isenção ISV возможна при mudança de residência, если владели авто ≥6 мес. в другой стране ЕС.",
  "На практике: rent-a-car на 2–3 недели — credit card обязателен у крупных сетей; debit — только у локалов с депозитом.",
  "Расхождение: «пригнать из Германии выгодно» — на старых дизелях ISV часто съедает экономию.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Где искать б/у машину в Португалии?",
    a: "Standvirtual, OLX, concessionários с programa usados. По правилам — только после проверки DUA, IPO и recall. На практике выгодные лоты уходят за часы — держите NIF и finaciamento pre-approved.",
  },
  {
    q: "Сколько стоит поставить на учёт машину из Германии?",
    a: "ISV зависит от CO₂, года и типа топлива — считайте в симуляторе Finanças. Плюс inspeção IMT, seguro, пошлины за номера. При mudança de residência и владении ≥6 мес. ISV может быть снижен или нулевым.",
  },
  {
    q: "Можно ли арендовать машину без кредитной карты?",
    a: "Europcar/Sixt/Hertz — почти нет. На практике в @por_tugal и @chatlisboa советуют локальные standы у аэропорта OPO или в пригороде Porto/Lisboa с крупным денежным депозитом; условия индивидуальные.",
  },
  {
    q: "Как долго можно ездить на иностранных номерах?",
    a: "Турист — по правилам страны выдачи и краткосрочного пребывания. После fixar residência в PT нужно зарегистрировать авто — не откладывайте; точный срок зависит от статуса, ориентир — считайте от даты ВНЖ.",
  },
  {
    q: "Нужен ли техосмотр (IPO) при покупке б/у?",
    a: "Действующий IPO обязателен для регистрации. С 01.03.2026 активный невыполненный recall автоматически проваливает IPO — проверьте у дилера до сделки.",
  },
  {
    q: "Leasing или покупка — что выгоднее на 2–3 года?",
    a: "Leasing operacional удобен без крупного входа, но дороже в сумме. Покупка б/у + продажа через 2 года часто дешевле при низком ISV; считайте IUC, seguro и depreciation.",
  },
];

export const CAR_PORTUGAL_GUIDE = {
  slug: CAR_PORTUGAL_GUIDE_SLUG,
  category: "Авто и права",
  content_kind: "guide" as ContentKind,
  title: "Машина в Португалии 2026: купить, арендовать или привезти из Европы",
  excerpt:
    "Гайд для релокантов: покупка б/у и у дилера, rent-a-car без кредитки, ввоз из ЕС, ISV, IPO, recall и типичные ошибки в Португалии (Norte и Lisboa).",
  seo_title: "Машина в Португалии 2026 — купить, аренда, ввоз",
  seo_description:
    "Как купить, арендовать или привезти машину в Португалию: ISV, matrícula, IPO, recall, rent-a-car и ввоз из ЕС. Практика релокантов в Norte (Porto, Braga).",
  quick_answer:
    "В Португалии три пути: купить на месте (DUA + IMT + seguro), арендовать на срок (крупные сети — credit card) или привезти из ЕС без таможни, но с ISV при matrícula. Проверяйте IPO и recall — с 03.2026 невыполненный recall блокирует техосмотр. При mudança de residência ISV может быть снижен, если владели авто ≥6 месяцев в другой стране ЕС. На практике многие месяц сидят на прокате, пока ищут б/у на Standvirtual.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "IMT — Registo de veículos", url: "https://www.imt-ip.pt/" },
    { title: "gov.pt — Comprar ou vender veículo", url: "https://www.gov.pt/servicos/registar-a-compra-de-um-veiculo" },
    { title: "Portal Automóvel", url: "https://www.portalautomobile.pt/" },
    { title: "ASF — Seguros", url: "https://www.asf.com.pt/" },
    { title: "Finanças — ISV", url: "https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cisv/index.htm" },
    { title: "Recall (DRAP)", url: "https://www.drapc.min-economia.pt/" },
  ],
  topic_tags: ["auto", "portugal"],
  hashtags: buildNoteHashtags({
    topicTags: ["auto", "portugal"],
    contentKind: "guide",
    extra: ["машина", "isv", "аренда", "autolife", "транспорт"],
  }),
  source_channel: "chatlisboa+autolife_pt+por_tugal",
  source_label: "editorial:auto-signals",
};
