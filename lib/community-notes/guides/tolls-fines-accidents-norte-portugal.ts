/** Hand-curated guide — see lib/community-notes/editorial-presentation.ts for writing rules. */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { CAR_PORTUGAL_GUIDE_SLUG } from "@/lib/community-notes/guides/car-portugal-buy-rent-import";
import { DRIVING_LICENSE_GUIDE_SLUG } from "@/lib/community-notes/guides/driving-license-exchange";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const TOLLS_FINES_ACCIDENTS_GUIDE_SLUG =
  "platnye-dorogi-shtrafy-avariya-portugaliya-norte-2026";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(glossaryForSlug(TOLLS_FINES_ACCIDENTS_GUIDE_SLUG)!),
  },
  {
    heading: "Официально: как устроены платные дороги",
    section_kind: "official",
    paragraphs: [
      "Зачем читать: в Португалии большинство магистралей (autoestrada) платные, а на севере вы чаще всего ездите по A1, A3, A28 и бывшим SCUT — без понимания portagem легко накопить долг.",
      "Официально дороги делятся на с портами (portagens com barreiras) и полностью электронные (sem barreiras) — вторые требуют Via Verde, EasyToll или оплату на posto в срок.",
    ],
    bullets: [
      "Portagem — плата за проезд; на электронных участках нет шлагбаума, камера фиксирует matrícula.",
      "Via Verde — on-board unit (OBU) или подписка; списание с банковского счёта или pré-pago.",
      "EasyToll / TollCard — временная регистрация иностранного номера на portaldasportagens.pt (до 30 дней).",
      "Posto de portagem manual — зелёная полоса «manual»; наличные или Multibanco на барьере.",
      "ASF (Autoridade de Supervisão de Seguros) — регулятор страховок; при ДТП сверяйте apólice и livro verde.",
    ],
  },
  {
    heading: "Официально: штрафы и оплата multas",
    section_kind: "official",
    paragraphs: [
      "Зачем читать: multa за скорость, неоплаченную portagem или парковку приходит отдельно от счёта за проезд — сроки и порталы разные.",
    ],
    bullets: [
      "Radar fixo/móvel — фиксация превышения; уведомление от ANSR/PSP с указанием срока оплаты со скидкой.",
      "Multa por portagem — если проезд не оплачен в 5 дней, штраф + административный сбор; для иностранных номеров — письмо/инвойс от concessionária.",
      "Portal das Finanças — налоговые multas и часть административных; вход через NIF + senha.",
      "IMT — штрафы за техосмотр, права, регистрацию; проверка carta и IPO онлайн.",
      "Pagamento com desconto — обычно 15 дней с даты уведомления; после — полная сумма + juros.",
    ],
  },
  {
    heading: "Официально: что делать при acidente de viação",
    section_kind: "official",
    paragraphs: [
      "Зачем читать: при ДТП обязанности закреплены в Código da Estrada — от безопасности на месте до уведомления seguro в срок.",
    ],
    bullets: [
      "112 — единый номер; при ранениях INEM/бригада de emergência; при угрозе — GNR или PSP.",
      "Sinalização — triângulo, colete refletor, не стоять на полосе движения; на autoestrada — по возможности съехать на área de refúgio.",
      "Declaração amigável de acidente — двусторонний бланк (constatação amigável); заполняют оба водителя до отъезда.",
      "Seguro — уведомить seguradora в 1–8 дней (смотрите condições apólice); livro verde обязателен в машине.",
      "GNR/PSP — вызывать при травмах, споре о виновности, подозрении на alcoolemia или если второй участник скрылся.",
    ],
  },
  {
    heading: "На практике: Norte — A1, A3, A28 и Via Verde",
    section_kind: "practice",
    paragraphs: [
      "Зачем читать: типичные маршруты релокантов в Norte — Porto ↔ Braga (A3), Porto ↔ Lisboa (A1), побережье A28; в @autolife_pt и @chatlisboa чаще всего спрашивают про первую поездку и счета за ex-Scut.",
    ],
    bullets: [
      "A1 Porto–Lisboa: смешанные участки; с Via Verde — полоса verde; без OBU регистрируйте номер на EasyToll до выезда.",
      "A3 Porto–Braga–Valença: электронные portagens; commute Maia/Braga — подписка Via Verde (~€6/мес.) окупается за 2–3 поездки на юг.",
      "A28 (Minho–litoral): бывшие SCUT; в @por_tugal — «бесплатная» карта не значит отсутствие portagem на отдельных trechos.",
      "Via Verde для новичка: договор online + OBU на morada за 2–5 дней; в rent-a-car OBU уже в машине — см. [гайд по машине](/notes/" + CAR_PORTUGAL_GUIDE_SLUG + ").",
      "Иностранные номера + radares: multa через 2–6 недель; проверяйте matrícula на portaldasportagens.pt; права — [обмен ВУ](/notes/" + DRIVING_LICENSE_GUIDE_SLUG + ").",
    ],
  },
  {
    heading: "При ДТП: порядок действий на месте",
    section_kind: "practice",
    paragraphs: [
      "Зачем читать: в @lepta и @chatlisboa описывали мелкие ДТП на парковках Ribeira и на A3 — порядок действий снижает споры со страховой.",
    ],
    bullets: [
      "1. Безопасность: включить 4-way, colete, вынести людей за ограждение; на магистрали — 112, если машина не на acostamento.",
      "2. Фото: общий план, следы, номера, повреждения, дорожные знаки и разметка — до перемещения авто.",
      "3. Declaração amigável: бумажный бланк или приложение (DAAA digital, @por_tugal 12.2025); оба подписывают — без подписи страховая затягивает.",
      "4. Звонок seguro: номер на livro verde / приложение; получить número de participação — без него нет ремонта.",
      "5. Полиция при отказе подписать amigável; иначе — только факты в бланке, копию фото — себе на e-mail.",
    ],
  },
  {
    heading: "Где официальные правила и жизнь расходятся",
    section_kind: "gap",
    bullets: [
      "Сайт: «оплата portagem в 5 дней» → письмо на иностранный номер идёт 2–6 недель; проверяйте matrícula на portaldasportagens.pt раз в неделю.",
      "Симулятор toll → реальный счёт Via Verde выше на 5–15% из-за classe e peso.",
      "«Штраф придёт по почте» → уведомление в Via Verde app быстрее; без подписки — multa с наценкой.",
      "Declaração amigável «не обязательна» → без неё страховая тянет 3–6 месяцев (@autolife_pt).",
      "Radar 120 km/h → мобильные radares móveis на A3 ловят на спусках — лимит 100 на части trechos.",
    ],
  },
  {
    heading: "Типичные ошибки релокантов",
    section_kind: "practice",
    bullets: [
      "Езда по verde без Via Verde/EasyToll — каждый проезд = multa; на A1 за выходные набегает €50–150.",
      "Игнор писем «Portagens em dívida» — долг передают в взыскание; при rent-a-car в PT проблемы с депозитом.",
      "Уезд с места ДТП без amigável и без номера второго авто — страховая может отказать.",
      "Не звонить 112 при травмах «потом пожалеете» — без ocorrência полиции спор усложняется.",
      "Смешивать оплату multa в Finanças и portagem на одном портале — разные системы; просрочка = потеря скидки 50%.",
    ],
  },
];

const keyTakeaways = [
  "Официально: большинство autoestradas в PT платные; электронные участки требуют Via Verde, EasyToll или оплату на posto в 5 дней.",
  "На практике (@autolife_pt): после покупки или аренды машины сразу оформите Via Verde или EasyToll — иначе штрафы на A1/A3 копятся незаметно.",
  "Официально: при ДТП — безопасность, 112 при травмах, declaração amigável и звонок seguro в срок по apólice.",
  "Расхождение: счёт за portagem на иностранный номер часто приходит позже 5 дней — проверяйте matrícula на portaldasportagens.pt вручную.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Нужен ли Via Verde, если я езжу редко?",
    a: "По правилам на электронных участках нужен способ оплаты — Via Verde, EasyToll или ручная оплата на posto в 5 дней. На практике для 2–3 поездок в месяц по A3/A1 подписка Via Verde (~€6/мес. + проезды) проще, чем ловить posto и рисковать multa.",
  },
  {
    q: "Как оплатить portagem на машине с иностранными номерами?",
    a: "Официально — EasyToll или TollCard на portaldasportagens.pt до въезда на электронный участок. На практике в @por_tugal советуют регистрировать номер заранее; после поездки проверять задолженность по matrícula, даже если шлагбаумов не было.",
  },
  {
    q: "Сколько стоит проезд Porto–Lisboa по A1?",
    a: "Ориентир симулятора portaltolling.pt — около €20–25 в одну сторону на легковой (classe 1), с Via Verde иногда дешевле. Точная сумма зависит от класса veículo и выбранных выездов.",
  },
  {
    q: "Как узнать о штрафе за скорость?",
    a: "Уведомление от ANSR/PSP по почте или через электронный адрес в Finanças. Оплата в первые 15 дней обычно со скидкой 50%. На практике в autolife_pt рекомендуют держать morada в Finanças актуальной — иначе письмо запаздывает.",
  },
  {
    q: "Обязательно ли вызывать полицию при ДТП?",
    a: "Нет при лёгком столкновении без травм, если оба согласны и есть seguro. Да — при ранениях, пьяном водителе, отсутствии страховки или отказе подписать amigável. В Norte на трассах чаще GNR, в Porto/Braga городе — PSP.",
  },
  {
    q: "Что такое declaração amigável и где взять бланк?",
    a: "Двусторонняя constatação amigável — схема аварии и данные сторон. Бланк в seguro, на сайте seguradoras или приложениях (Fidelidade, Allianz). Заполняют на месте до отъезда; копию фото — себе и в страховую.",
  },
  {
    q: "Связано с покупкой машины и правами?",
    a: "Да: после matrícula подключите Via Verde на PT номер; права — [обмен водительских прав](/notes/" + DRIVING_LICENSE_GUIDE_SLUG + "); машина — [гайд по покупке и аренде](/notes/" + CAR_PORTUGAL_GUIDE_SLUG + "). Без действующей carta штраф отдельно от portagem.",
  },
];

export const TOLLS_FINES_ACCIDENTS_GUIDE = {
  slug: TOLLS_FINES_ACCIDENTS_GUIDE_SLUG,
  category: "Авто и права",
  content_kind: "guide" as ContentKind,
  title: "Платные дороги, штрафы и ДТП в Португалии 2026: Norte, Via Verde, multas",
  excerpt:
    "Portagem на A1/A3/A28, Via Verde и EasyToll, multas и radares, что делать при acidente: amigável, seguro, GNR. Практика @autolife_pt и @chatlisboa для Norte.",
  seo_title: "Платные дороги Португалия 2026 — штрафы, ДТП, Norte",
  seo_description:
    "Гайд по portagem, Via Verde, штрафам и ДТП в Португалии: A1 Porto–Lisboa, A3 Braga, ex-Scut, radares, declaração amigável и seguro. Norte и практика релокантов.",
  quick_answer:
    "В Португалии большинство магистралей платные: на электронных участках (A1, A3, A28) нужен Via Verde, EasyToll или оплата на posto в 5 дней — иначе multa. На севере типичны commute Porto–Braga и выезды на юг по A1. При ДТП: безопасность, 112 при травмах, фото, declaração amigável и звонок seguro. Штрафы за скорость и portagem приходят отдельно — проверяйте matrícula на portaldasportagens.pt и morada в Finanças.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "Portugal Tolls — portagens", url: "https://www.portugal.gov.pt/pt/servicos/pagar-portagens-em-portugal" },
    { title: "Portal das Portagens", url: "https://www.portaldasportagens.pt/" },
    { title: "Via Verde", url: "https://www.viaverde.pt/" },
    { title: "Portal Tolling — simulador", url: "https://www.portaltolling.pt/" },
    { title: "ASF — Seguros", url: "https://www.asf.com.pt/" },
    { title: "ANSR — Segurança rodoviária", url: "https://www.ansr.pt/" },
    { title: "IMT — Infrações", url: "https://www.imt-ip.pt/" },
    { title: "112 — Emergência", url: "https://www.112.gov.pt/" },
  ],
  topic_tags: ["auto", "portugal"],
  hashtags: buildNoteHashtags({
    topicTags: ["auto", "portugal"],
    contentKind: "guide",
    extra: ["portagem", "viaverde", "multa", "дтп", "norte", "autolife"],
  }),
  source_channel: "chatlisboa+por_tugal+autolife_pt+lepta",
  source_label: "editorial:50-signals",
};

/** Cross-link slugs for related guides */
export const TOLLS_GUIDE_RELATED = [CAR_PORTUGAL_GUIDE_SLUG, DRIVING_LICENSE_GUIDE_SLUG];
