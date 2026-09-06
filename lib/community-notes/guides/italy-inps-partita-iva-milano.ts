/**
 * Hand-curated Italy satellite guide — INPS, partita IVA, lavoro subordinato Milano.
 * INPS / Agenzia Entrate rules separated from DN practice.
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import {
  formatPracticeBullet,
  formatPracticeTakeaway,
} from "@/lib/community-notes/practice-format";
import type { CommunityNoteFaq, ContentKind, GlossaryTerm, NoteBodySection } from "@/lib/community-notes/types";

export const INPS_PIVA_SLUG = "inps-partita-iva-milano-2026";

const PERVYE_30_SLUG = "pervye-30-dnej-v-italii-satelit-2026";
const CODICE_FISCALE_SLUG = "codice-fiscale-milano-2026";
const PERMESSO_SLUG = "permesso-questura-milano-2026";
const BANK_SLUG = "bank-iban-nerezident-italiya-2026";
const ARENDA_SLUG = "arenda-milano-idealista-2026";

const GLOSSARY: GlossaryTerm[] = [
  { pt: "INPS", ru: "Istituto Nazionale Previdenza Sociale — итальянский соцстрах; не Seguridad Social ES и не NISS PT" },
  { pt: "Codice fiscale", ru: "личный налоговый код; нужен до partita IVA и contratto lavoro" },
  { pt: "Partita IVA", ru: "номер ИП/фрилансера; открывается AA9/12 или Comunicazione Unica — не то же, что CF" },
  { pt: "Lavoro subordinato", ru: "работа по contratto dipendente; взносы платит datore через INPS" },
  { pt: "Gestione Separata INPS", ru: "режим взносов для P.IVA без другой обязательной previdenza; 26,07% или 24%" },
  { pt: "Regime forfettario", ru: "упрощённый налоговый режим P.IVA; пороги дохода и совместимость с lavoro dipendente" },
  { pt: "Residenza fiscale", ru: "налоговое резидентство: 183+ дней в Италии с 2024 — отдельно от штампа Schengen" },
  { pt: "Modello F24", ru: "форма оплаты налогов и INPS-взносов через бanca/agenzia" },
];

const DISCLAIMER =
  "**Emigro — не юридическая консультация.** Aliquote INPS, пороги forfettario и критерии residenza fiscale **меняются**. Актуальные circolari — [inps.it](https://www.inps.it/) и [agenziaentrate.gov.it](https://www.agenziaentrate.gov.it/). Не копируйте испанский NUSS/RETA/Beckham или португальский NISS — это другие системы.";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(
      GLOSSARY,
      "INPS, partita IVA и «как NISS в Португалии» — разные слова в @milanru. Разберём до первого contratto или invoice, пока datore не спросил codice fiscale."
    ),
    paragraphs: [DISCLAIMER],
  },
  {
    heading: "Nota Emigro (fact-check)",
    section_kind: "official",
    paragraphs: [
      "Разбор INPS / P.IVA / residenza fiscale для Milano. **OK** = INPS circolari, Agenzia Entrate D.Lgs 209/2023; **soft** = практика 2025–2026; **fixed** = смягчено.",
    ],
    bullets: [
      "OK: **codice fiscale** и **partita IVA** — разные номера; P.IVA открывается modello **AA9/12** или Comunicazione Unica ([Entrate P.IVA](https://www.agenziaentrate.gov.it/portale/codice-fiscale-tessera-sanitaria-partita-iva)).",
      "OK: lavoro **subordinato** — datore регистрирует в INPS, удерживает contributi из busta paga; не путать с autonomo.",
      "OK: Gestione Separata INPS — aliquota **26,07%** без altra previdenza obbligatoria; **24%** при другой copertura (circolare INPS 2026, soft: номер circolare на inps.it).",
      "OK: residenza fiscale с 2024 — **183 дня** (184 в високосный) в Италии достаточно при любом одном критерии: dimora abituale, domicilio, presenza fisica, iscrizione anagrafe ([Entrate circ. 20/E 2024](https://www.agenziaentrate.gov.it/portale/cs-4-novembre-2024)).",
      "Fixed: «штамп Schengen = налоговый резидент IT» → **нет**; residenza fiscale по TUIR/D.Lgs 209/2023, не по permesso stamp.",
      "Fixed: «INPS = Seguridad Social Испании» → разные органы, формы и aliquote.",
      "Soft: regime forfettario + lavoro dipendente — reddito dipendente anno precedente ≤ **35.000 € lordi** (manovra 2026, soft: verificare legge bilancio).",
      "UNCHECKED: exact slot INPS sportello Milano walk-in per posizione contributiva — verificare portale prima visita.",
    ],
  },
  {
    heading: "Официально: codice fiscale, partita IVA и INPS",
    section_kind: "official",
    paragraphs: [
      "**Codice fiscale** — идентификатор физлица ([AA4/8](/notes/" + CODICE_FISCALE_SLUG + ")). **Partita IVA** — номер economic activity; открывается в Agenzia delle Entrate modello **AA9/12** в течение 30 giorni от inizio attività или через **Comunicazione Unica** al Registro Imprese с одновременной posizione INPS ([Entrate](https://www.agenziaentrate.gov.it/portale/codice-fiscale-tessera-sanitaria-partita-iva)).",
      "**Lavoro subordinato:** datore di lavoro comunica assunzione в INPS (UniEmens), versa contributi previdenziali; lavoratore получает busta paga с trattenute. Вам нужен CF и IBAN ([банк](/notes/" + BANK_SLUG + ")); отдельную «карту INPS» как NISS PT обычно **не выдают** — posizione видна через MyINPS после registrazione.",
      "**Lavoro autonomo / P.IVA:** после attribuzione P.IVA iscrizione в **Gestione Separata INPS** (если нет altra cassa obbligatoria). Contributi — modello **F24**, scadenze giugno/novembre + saldo con redditi (circolare INPS Quadro RR).",
      "Regime **forfettario** — imposta sostitutiva 15% (5% startup), reddito imponibile forfettario; **не** exempt от INPS Gestione Separata, если нет altra copertura.",
    ],
    bullets: [
      "CF — первым; P.IVA — только при autonomo/clienti IT.",
      "Dipendente — contratto, CCNL, TFR; INPS через datore.",
      "P.IVA forfettario — codice ATECO, fattura elettronica SDI.",
      "Gestione Separata — 26,07% или 24% su reddito imponibile.",
      "Comunicazione Unica — P.IVA + INPS + REA одной подачей.",
      "Commercialista / CAF — consigliato с первой fattura.",
    ],
  },
  {
    heading: "Subordinato vs P.IVA: что выбирают в Milano",
    section_kind: "official",
    paragraphs: [
      "**Lavoro subordinato** (tempo indeterminato/determinato, apprendistato) — стандарт для офиса, fabbrica, многих tech-наймов. Datore оформляет assunzione, виза lavoro subordinato согласована с contratto. К **4–6 месяцу** у вас уже должны быть первые buste paga и posizione INPS visibile.",
      "**Partita IVA** — фриланс, consulenza, nomade con clienti IT/EU. Не открывайте P.IVA «на всякий случай» до CF и понимания regime. Совмещение P.IVA forfettario + **stesso datore** >70–80% fatturato — риск **riclassificazione** в subordinato (soft: prassi Agenzia Entrate/INPS).",
      "Remote work для **иностранного** datore без sede IT — отдельная tax story; permesso и residenza fiscale не автоматически совпадают. Wizard поможет развести traccia.",
    ],
    bullets: [
      "Subordinato — TFR, ferie, malattia INPS.",
      "P.IVA — fatture, F24, commercialista.",
      "CCNL metalmeccanico Milano — soft benchmark salari.",
      "Monocommittente — rischio lavoro dipendente occulto.",
      "Visto lavoro subordinato ≠ P.IVA senza verifica Questura.",
    ],
  },
  {
    heading: "Residenza fiscale 183 giorni vs permesso di soggiorno",
    section_kind: "practice",
    paragraphs: [
      "С **1 gennaio 2024** (D.Lgs 209/2023) достаточно **presenza fisica** 183+ giorni в Италии (с учётом frazioni di giorno) для residenza fiscale — **без** обязательной iscrizione anagrafe, хотя anagrafe теперь presunzione relativa ([Entrate](https://www.agenziaentrate.gov.it/portale/imposta-sul-reddito-delle-persone-fisiche-irpef-/regole-generali-per-persone-fisiche-cittadini)).",
      "**Permesso di soggiorno** — immigration status; штампы Schengen в pasport — travel history, **не** IRPEF. Можно иметь permesso и **non** essere ancora fiscalmente resident (soft: первые mesi <183 giorni), или наоборот — 183 giorni smart working → residente fiscale.",
      "К **4–6 месяцу** (~120–180 giorni) многие релоканты **пересекают** порог 183 в calendar year — planificate dichiarazione redditi, INPS autonomo, convenzione contro doppia imposizione если был доход abroad.",
      "Iscrizione **residenza** в Comune di Milano — отдельный шаг после [CF и contratto](/notes/" + ARENDA_SLUG + "); влияет на SSN, TARI, но не заменяет consulenza fiscale internazionale.",
    ],
    bullets: [
      formatPracticeBullet({
        channels: ["milanru", "forum_italy"],
        period: "2025–2026",
        claim:
          "DN с P.IVA forfettario к mes 5–6 получали первые F24 INPS — surprise vs ожидание «только CF»",
        forReader: "откройте posizione INPS сразу после P.IVA, не ждите dicembre",
      }),
      "183 giorni — суммируются non consecutivi (circ. 20/E).",
      "Anagrafe — presunzione relativa с 2024.",
      "Permesso plastica — не доказательство residenza fiscale.",
      "Split year — convenzione CDI se doppia residenza.",
    ],
  },
  {
    heading: "Milano на практике: первый contratto и банк",
    section_kind: "practice",
    paragraphs: [
      "Datore в Lombardia запросит **codice fiscale**, **IBAN IT**, иногда **residenza** o domicilio. Banca может блокировать крупные transfer без busta paga к **4–6 месяцу** — см. [IBAN guide](/notes/" + BANK_SLUG + ").",
      "Freelance: клиенты IT просят **P.IVA** и fattura elettronica; без них pagamento ritenuta d'acconto сложнее. Patronato/CAF помогают с первым F24 — не заменяют commercialista для cross-border.",
      "INPS **MyINPS** — registrarsi con SPID/CIE после CF; проверьте posizione contributiva dipendente o autonomo.",
    ],
    bullets: [
      "Prima busta paga — verificare trattenute INPS.",
      "P.IVA — fattura entro termini SDI.",
      "Forfettario — monitor reddito 85.000 € cap ricavi.",
      "Lavoro dipendente + P.IVA — soglia 35k anno precedente (soft).",
      "Commercialista — obbligatorio consigliato mes 4–6 autonomo.",
    ],
  },
  {
    heading: "К 4–6 месяцу: хвост без INPS или с ошибкой P.IVA",
    section_kind: "gap",
    paragraphs: [
      "К **4–6 месяцу** накапливаются: первый **saldo INPS** autonomo, dichiarazione redditi preview, domande банка о reddito, agency [аренды](/notes/" + ARENDA_SLUG + ") про busta paga или fatture.",
      "Открыть P.IVA без Gestione Separata — sanzioni e arretrati. Lavorare «в чёрную» без posizione INPS — rischio per datore и lavoratore; permesso subordinato требует contratto conforme.",
      "Non aver versato contributi Gestione Separata entro scadenze F24 — interessi e riscossione Equitalia (soft: tempi).",
    ],
    bullets: [
      "Sin posizione INPS autonomo — F24 arretrati.",
      "P.IVA aperta «per bank» senza attività — chiudere o gestire.",
      "183 giorni superati — dichiarazione redditi IT.",
      "Busta paga assente — renta solo transfer; agency diffidenti.",
      "Confondere CF e P.IVA su contratto — blocca payroll.",
    ],
  },
  {
    heading: "Типичные ошибки INPS и partita IVA в Milano",
    section_kind: "practice",
    paragraphs: [
      "Повторяющиеся ошибки: открыть P.IVA до CF, ждать «NISS-карту», путать residenza anagrafe с fiscale, копировать Beckham/RETA из Испании.",
    ],
    bullets: [
      "Ошибка: «INPS card как NISS PT» — posizione digitale MyINPS, не plastica.",
      "Ошибка: P.IVA без commercialista при clienti esteri — CDI risk.",
      "Ошибка: forfettario + stesso datore 100% fatturato — riclassificazione.",
      "Ошибка: 183 giorni ignorati — surprise IRPEF dicembre.",
      "Ошибка: Seguridad Social ES опыт применён к INPS — wrong forms.",
      "Ошибка: autonomo senza fattura elettronica — sanzioni SDI.",
      formatPracticeBullet({
        channels: ["digital_nomad_Italiya", "milan_4at"],
        period: "2025–2026",
        claim: "релоканты открывали P.IVA forfettario до получения CF certificato — задержка posizione INPS",
        forReader: "CF certificato → P.IVA AA9/12 → iscrizione Gestione Separata",
      }),
    ],
  },
  {
    heading: "Wizard и Assist",
    section_kind: "practice",
    paragraphs: [
      "Subordinato, P.IVA forfettario и cross-border remote — разные tracce. Прогоните через [Emigro Wizard Italia](/ru/italy/wizard?utm_source=emigro&utm_medium=guide&utm_campaign=inps-piva-milano&utm_content=" +
        INPS_PIVA_SLUG +
        "). Для аудита CF → contratto → INPS — [Route Check Assist €129](/ru/assist?utm_source=emigro&utm_medium=guide&utm_campaign=inps-piva-milano&utm_content=" +
        INPS_PIVA_SLUG +
        ").",
    ],
    bullets: [
      "[Первые 30 дней](/notes/" + PERVYE_30_SLUG + ") — orchestrator.",
      "[Codice fiscale](/notes/" + CODICE_FISCALE_SLUG + ") — до P.IVA.",
      "[Permesso Questura](/notes/" + PERMESSO_SLUG + ") — visto subordinato.",
    ],
  },
];

const keyTakeaways = [
  "Официально: lavoro subordinato — INPS через datore; P.IVA — AA9/12/Comunicazione Unica + Gestione Separata INPS (26,07% o 24%).",
  formatPracticeTakeaway({
    channels: ["milanru", "forum_italy"],
    period: "2025–2026",
    claim: "к 4–6 месяцу dipendente видит posizione INPS в MyINPS; autonomo — первые F24 Gestione Separata",
    forReader: "CF до contratto; P.IVA только при реальных clienti; 183 giorni ≠ permesso stamp",
  }),
  "Официально: residenza fiscale 183+ giorni с 2024 (D.Lgs 209/2023) — presenza fisica достаточна.",
  "Расхождение: INPS ≠ NISS/Seguridad Social; Beckham/NUSS ES не применимы в IT.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Как получить номер INPS и зачем он к месяцу 4–6?",
    a: "По правилам — datore регистрирует dipendente в INPS; autonomo iscrive Gestione Separata после P.IVA. На практике posizione видна в MyINPS; к 4–6 мес. нужны buste paga или F24 для банка и аренды.",
  },
  {
    q: "Partita IVA — это то же, что codice fiscale?",
    a: "По правилам — нет: CF личный, P.IVA — attività economica (AA9/12). На практике оба нужны autonomo; dipendente обычно только CF.",
  },
  {
    q: "Когда начинается налоговый резидент — по штампу permesso?",
    a: "По правилам — residenza fiscale по 183+ giorni presenza/dimora/domicilio/anagrafe (TUIR 2024+). На практике permesso stamp ≠ IRPEF; к 4–6 мес. многие близки к порогу 183 giorni.",
  },
  {
    q: "Можно ли P.IVA forfettario и lavoro dipendente?",
    a: "По правилам — да, если reddito dipendente anno precedente ≤ 35.000 € lordi (soft 2026). На практике monocommittente con datore — rischio riclassificazione.",
  },
  {
    q: "INPS как NISS в Португалии?",
    a: "По правилам — аналогичная функция previdenza, другая система. На практике нет «NISS card»; MyINPS + busta paga/F24.",
  },
];

export const INPS_PIVA_GUIDE = {
  slug: INPS_PIVA_SLUG,
  category: "Работа и взносы",
  content_kind: "guide" as ContentKind,
  title: "INPS и partita IVA в Milano: subordinato vs autonomo 2026",
  excerpt:
    "INPS Milano 2026: codice fiscale vs partita IVA, lavoro subordinato, Gestione Separata, regime forfettario. Residenza fiscale 183 giorni — не permesso stamp. Не NISS и не Seguridad Social.",
  seo_title: "INPS partita IVA Milano 2026 — взносы Италия",
  seo_description:
    "INPS Milano 2026: partita IVA, codice fiscale, subordinato, Gestione Separata 26,07%. Residenza fiscale 183 giorni vs permesso. Не NISS PT. F24 к 4–6 мес.",
  quick_answer:
    "В Италии **INPS** — соцстрах: при **lavoro subordinato** datore регистрирует и платит взносы; при **partita IVA** открываете posizione **Gestione Separata** (26,07% или 24% при altra copertura). **Codice fiscale** личный, **P.IVA** — через AA9/12/Comunicazione Unica в Entrate. **Residenza fiscale** с 2024 — 183+ giorni presenza в IT (D.Lgs 209/2023), не штамп permesso. К **4–6 месяцу** нужны buste paga или F24 для банка. Не NISS Португалии, не Seguridad Social Испании.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "INPS — portale", url: "https://www.inps.it/" },
    {
      title: "Agenzia Entrate — CF e P.IVA",
      url: "https://www.agenziaentrate.gov.it/portale/codice-fiscale-tessera-sanitaria-partita-iva",
    },
    {
      title: "Entrate — residenza fiscale 2024+",
      url: "https://www.agenziaentrate.gov.it/portale/imposta-sul-reddito-delle-persone-fisiche-irpef-/regole-generali-per-persone-fisiche-cittadini",
    },
  ],
  topic_tags: ["inps", "partita_iva", "milano", "lavoro"],
  hashtags: buildNoteHashtags({
    topicTags: ["inps", "partita_iva", "milano"],
    contentKind: "guide",
    extra: ["forfettario", "gestione_separata", "satellite"],
  }),
  source_channel: "milanru+forum_italy+milan_4at",
  source_label: "editorial:italy-seed",
};

export default INPS_PIVA_GUIDE;
