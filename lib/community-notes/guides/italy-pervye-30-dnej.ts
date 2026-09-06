/**
 * Hand-curated Italy satellite guide — first 30 days checklist Milano / Nord.
 * Orchestrator linking core satellite slugs; pillar depth on emigro.online.
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import {
  formatPracticeBullet,
  formatPracticeTakeaway,
} from "@/lib/community-notes/practice-format";
import type { CommunityNoteFaq, ContentKind, GlossaryTerm, NoteBodySection } from "@/lib/community-notes/types";

export const PERVYE_30_IT_SLUG = "pervye-30-dnej-v-italii-satelit-2026";

const CODICE_FISCALE_SLUG = "codice-fiscale-milano-2026";
const PERMESSO_QUESTURA_SLUG = "permesso-questura-milano-2026";
const BANK_IBAN_IT_SLUG = "bank-iban-nerezident-italiya-2026";
const SIM_LUCE_SLUG = "sim-internet-luce-milano-2026";
const ARENDA_SLUG = "arenda-milano-idealista-2026";
const MEDITSINA_SLUG = "meditsina-milano-ssn-tessera-2026";
const RAJONY_SLUG = "milano-rajony-arenda-metro-como-2026";

const GLOSSARY: GlossaryTerm[] = [
  { pt: "Codice fiscale", ru: "налоговый код; первый админ-шаг, не NIE" },
  { pt: "Permesso di soggiorno", ru: "ВНЖ extra-UE; kit postale entro 8 gg lavorativi" },
  { pt: "Kit postale", ru: "жёлтый комплект для подачи permesso в Poste" },
  { pt: "Residenza anagrafica", ru: "регистрация по адресу в Comune di Milano" },
  { pt: "Tessera sanitaria", ru: "карта SSN; после CF и iscrizione" },
  { pt: "IBAN IT", ru: "итальянский счёт для renta e luce" },
  { pt: "Schengen 90/180", ru: "краткое пребывание; ≠ permesso" },
  { pt: "Visto D", ru: "национальная виза для въезда на оформление soggiorno" },
];

const DISCLAIMER =
  "**Emigro — не юридическая консультация.** Сроки Questura, Entrate и Poste **меняются**. Satellite-оркестратор для Milano e Nord (Como, Monza, Bergamo); не переносите формы и ведомства из чужого country-checklist. Hard-правила — [interno.gov.it](https://www.interno.gov.it/) / [agenziaentrate.gov.it](https://www.agenziaentrate.gov.it/) / ваш visto.";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(
      GLOSSARY,
      "Слова из MXP, Sportello Amico и ufficio Entrate — разберём до того, как чат предложит «сначала permesso plastica, потом всё остальное»."
    ),
    paragraphs: [DISCLAIMER],
  },
  {
    heading: "Nota Emigro (fact-check)",
    section_kind: "official",
    paragraphs: [
      "Satellite-чеклист связывает eight core guides Milano. OK/soft/fixed ниже.",
    ],
    bullets: [
      "OK: permesso di soggiorno — entro **8 giorni lavorativi** dall'ingresso ([portaleimmigrazione.it](https://www.portaleimmigrazione.it/ITA/nuovaProcedura.html)).",
      "OK: codice fiscale — modello **AA4/8** в Agenzia delle Entrate ([istruzioni EN](https://www.agenziaentrate.gov.it/portale/documents/20143/278995/Instructions+on+how+to+fill+in+this+form_AA4_8_istruzioni_ING.pdf)).",
      "OK: kit postale — Poste **Sportello Amico**, busta aperta ([poste.it guida](https://www.poste.it/guida-rilascio-e-rinnovo-permesso-di-soggiorno)).",
      "OK: все пять URL из official_links повторно открыты 06.09.2026; адреса uffici намеренно не фиксируем в тексте.",
      "Fixed: чужой налоговый идентификатор → в Италии codice fiscale по AA4/8.",
      "Fixed: чужой миграционный portal → в Италии kit giallo + Questura.",
      "Fixed: «Schengen 90 = полгода legal» → permesso/visto D — отдельный контур.",
      "Soft: порядок SIM→CF→kit→IBAN — полевой Milano, не статья TUI целиком.",
      "Soft: nomade digitale — D.M. 29/02/2024 GU 79; reddito triplo soglia sanitaria — **UNCHECKED** exact € 2026 index.",
      "Soft: consolato RU Milano district — Lombardia, Piemonte, Veneto… ([milan.mid.ru](https://milan.mid.ru/ru/general-consulate/genkonsulstvo/consul-district/)); не Barcelona.",
    ],
  },
  {
    heading: "Официально: три контура первого mes",
    section_kind: "official",
    paragraphs: [
      "Первые **30 дней** после прилёта в MXP/LIN — три параллельных контура: **identità fiscale** (codice fiscale), **status migratorio** (permesso kit postale + Questura), **domicilio e pagamenti** (locazione, IBAN IT, utenze). Они связаны, но идут через разные uffici: Entrate, Poste/Questura, banca e Comune.",
      "Четвёртый контour — **salute** (SSN/tessera sanitaria) и **residenza anagrafica** в Comune — обычно settimana 3–4 после indirizzo stabile. Assicurazione sanitaria из visto держите активной до SSN, если procede.",
      "Como, Monza, Bergamo — **тот же satellite** Lombardia/Nord; не отдельный hub. Wizard и inventory один: italy.emigro.online.",
    ],
    bullets: [
      "Codice fiscale — AA4/8 Entrate.",
      "Permesso — kit postale 8 gg lavorativi.",
      "Residenza — Comune anagrafe после contratto.",
      "IBAN IT — banca dopo CF.",
      "SSN — Azienda Sanitaria после residenza (soft).",
      "Utenze — luce/gas/internet на CF + IBAN.",
    ],
  },
  {
    heading: "Календарь mes 1: 72 ore → settimana 4",
    section_kind: "action_guide",
    paragraphs: [
      "Этот note — **маршрут по неделям**, не энциклопедия. Детали CF, permesso, банка и аренды — в sibling guides; здесь **когда** их открывать.",
      "**72 ore** после MXP/LIN: SIM/eSIM ([SIM/luce](/notes/" + SIM_LUCE_SLUG + ")), short-term с возможностью dichiarare indirizzo, compilazione kit permesso и appuntamento Entrate для AA4/8. **8 giorni lavorativi** на kit postale тикают с timbratura passaporto — не ждите «спокойной второй недели».",
      "**Settimana 1–2:** certificato codice fiscale → kit in Poste Sportello Amico → IBAN IT ([банк](/notes/" + BANK_IBAN_IT_SLUG + ")) → просмотр [Idealista](/notes/" + ARENDA_SLUG + ") когда готовы документы. Ricevuta permesso + CF — типичный минимум для filiale.",
      "**Settimana 3–4:** convocazione Questura (rilievi), domiciliazione renta se contratto firmato, iscrizione SSN ([medicina](/notes/" + MEDITSINA_SLUG + ")), dichiarazione residenza Comune. К концу mes 1 — ricevuta permesso, CF, IBAN domiciliato, utenze in corso.",
    ],
    bullets: [
      formatPracticeBullet({
        channels: ["milanru", "forum_italy"],
        period: "2025–2026",
        claim:
          "ordine tipico Milano mes 1: SIM → codice fiscale → kit postale → IBAN IT → contratto long-term",
        forReader: "non copiare moduli e portali di un altro Paese",
      }),
      "72h — SIM, AA4/8 prep, kit compilation, alloggio temporaneo.",
      "Sem 1–2 — [CF](/notes/" + CODICE_FISCALE_SLUG + "), [permesso](/notes/" + PERMESSO_QUESTURA_SLUG + "), [banca](/notes/" + BANK_IBAN_IT_SLUG + ").",
      "Sem 3–4 — Questura convocazione, [SSN](/notes/" + MEDITSINA_SLUG + "), residenza Comune.",
      "Non firmare long-term senza verifica documenti per anagrafe.",
    ],
  },
  {
    heading: "Порядок шагов: SIM → CF → kit → IBAN → residenza → SSN",
    section_kind: "practice",
    paragraphs: [
      "Полевой порядок Milano (soft, не TUI целиком): SIM первым — Poste, banca e Questura шлют SMS. Codice fiscale вторым — номер на contratti e KYC. Kit permesso **entro 8 gg lavorativi** — параллельно или сразу после CF. Банк четвёртым — caparra e utenze. Residenza anagrafica и SSN — когда есть contratto registrato.",
      "**72 ore** закрывают связь, kit prep e tetto; **settimana 4** — Questura rilievi, domiciliazione e salute.",
      "Ответ на порядок: связь → codice fiscale → kit/ricevuta → крыша и IBAN → SSN. До 4-й недели могут подождать постоянная fibra, cambio medico и оптимизация тарифа, но не kit postale и не документированный адрес.",
    ],
    bullets: [
      "SIM → codice fiscale → kit postale → IBAN IT → residenza → tessera sanitaria.",
      "72h ≠ settimana 4: kit deadline — giorni 1–5.",
      "Только итальянские AA4/8, Poste и Questura.",
      "Como/Nord — stessi step, uffici provinciali.",
    ],
  },
  {
    heading: "Что ломается к 4–6 месяцу, если mes 1 пропущен",
    section_kind: "gap",
    paragraphs: [
      "Пропуск CF, kit entro 8 gg или IBAN в первый mes кажется «решим потом», но к **4–6 месяцу** стекаются rinnovo affitto, INPS, F24 e addebiti utenze.",
    ],
    bullets: [
      "Sin kit/ricevuta permesso — overstay risk e difficoltà rinnovo.",
      "Sin codice fiscale — blocco banca, luce, stipendio.",
      "Sin IBAN IT — domiciliazione renta e Eni/Enel.",
      "Sin residenza anagrafica — ritardi SSN e scuola.",
      "Sin SIM IT — 2FA banca e Poste.",
      "Copiare PT NIF/ES NIE ordine — wrong forms.",
    ],
  },
  {
    heading: "Карта satellite: куда углубиться",
    section_kind: "practice",
    paragraphs: [
      "Этот чеклист — **маршрут**, не энциклопедия. Sibling guides закрывают узлы:",
    ],
    bullets: [
      "[SIM, internet, luce](/notes/" + SIM_LUCE_SLUG + ") — utenze semana 1.",
      "[Codice fiscale AA4/8](/notes/" + CODICE_FISCALE_SLUG + ") — tax_id slot.",
      "[Permesso Questura kit](/notes/" + PERMESSO_QUESTURA_SLUG + ") — residence_appointment.",
      "[Аренда Idealista](/notes/" + ARENDA_SLUG + ") — contratto e caparra.",
      "[Районы, metro, Como](/notes/" + RAJONY_SLUG + ") — dove abitare.",
      "[Банк IBAN IT](/notes/" + BANK_IBAN_IT_SLUG + ") — KYC e domiciliazione.",
      "[Medicina SSN/tessera](/notes/" + MEDITSINA_SLUG + ") — salute.",
    ],
  },
  {
    heading: "Типичные ошибки первого mes в Milano",
    section_kind: "practice",
    paragraphs: [
      "Milano прощает медленный italiano, но не пустую ricevuta kit и не «permesso на второй mes».",
    ],
    bullets: [
      "Kit «на giorno 7» — Sportello Amico queue + 8 gg lavorativi.",
      "Аренда без CF e verifica contratto per anagrafe.",
      "Caparra senza IBAN IT.",
      "Un solo banco e arrendersi dopo rifiuto.",
      "Schengen 90 confusion con visto D.",
      "Checklist Valencia/Lisboa — wrong country.",
      "Consolato Barcelona per RU in Lombardia — district Milano.",
      "DNV vs elective residence — documenti diversi (soft).",
    ],
  },
  {
    heading: "Giorno 0 a MXP: aeroporto e prima notte",
    section_kind: "practice",
    paragraphs: [
      "Malpensa (MXP) e Linate (LIN) — non Fiumicino: Malpensa Express o bus до Milano Centrale, then Metro M1/M3 до temporary жилья (Porta Romana, Isola, Bovisa — см. [районы](/notes/" + RAJONY_SLUG + ")).",
      "В первую ночь: связь, адрес с Wi‑Fi, foto timbratura passaporto — data ingresso для 8 gg. Non firmare long-term contratto stanchi — jet lag error.",
    ],
    bullets: [
      "Malpensa Express — ticket online dopo SIM.",
      "ATM Milano — app per biglietti.",
      "Temporary booking — indirizzo esatto per taxi.",
      "Foto timbratura passaporto — cloud.",
      "Supermercato Esselunga/Carrefour vicino alloggio.",
    ],
  },
  {
    heading: "Lavoro subordinato vs autonomo vs nomade vs elective",
    section_kind: "gap",
    paragraphs: [
      "Este checklist assume visto D già in passaporto. **Lavoro subordinato** — datore e SUI spesso prima kit; alta INPS fa datore. **Autonomo / P.IVA** — commercialista e Partita IVA settimana 2–3. **Nomade digitale** — D.M. 29/02/2024 GU 79; visto consolato, permesso kit dedicato; reddito triplo soglia sanitaria — UNCHECKED € 2026. **Elective residence** — reddito passivo, **≠** nomade; altro visto e motivo kit.",
    ],
    bullets: [
      "Subordinato — seguire datore per SUI e nulla osta.",
      "Autonomo — CF + IBAN prima Partita IVA.",
      "Nomade — assicurazione sanitaria e alloggio nel pacchetto visto.",
      "Elective — non mescolare con remote worker kit.",
      "Studio — permesso studio; ore lavoro limitate.",
    ],
  },
  {
    heading: "Famiglia e consolato RU Milano",
    section_kind: "practice",
    paragraphs: [
      "Coniuge e figli con visto familiare seguono catena CF → kit → Questura con **kit separati** (1 per persona). Scuola pubblica chiede residenza anagrafica — pianificare prima giugno per settembre.",
      "Passaporto RU: district **Gen.consolato Milano** — Lombardia, Piemonte, Veneto, Friuli, Valle d'Aosta, Trentino, Emilia-Romagna (eccetto Ferrara, Ravenna, Forlì, Rimini → Roma). Appuntamento [milan.mid.ru](https://milan.mid.ru/ru/general-consulate/genkonsulstvo/consul-district/) / kdmid. Non copiare consolato Barcelona.",
    ],
    bullets: [
      "CF minore — AA4/8 con genitore.",
      "Kit famiglia — una ricevuta per persona.",
      "Scuola — certificato residenza + permesso.",
      "Consolato — solo passaporto/ZAGS, non permesso.",
      "Como — stesso district Milano.",
    ],
  },
  {
    heading: "Ошибки чужого country-checklist в Milano",
    section_kind: "gap",
    paragraphs: [
      "Чаты смешивают формы разных стран: в Milano налоговый код получают по AA4/8, permesso подают через Poste/Questura по своему motivo.",
    ],
    bullets: [
      "Чужой tax ID ≠ codice fiscale.",
      "Чужая карточная запись ≠ kit postale Poste.",
      "Чужой миграционный portal ≠ Questura Milano.",
      "Чужая налоговая служба ≠ Entrate AA4/8.",
      "Wizard Emigro — se dubiti sulla country.",
    ],
  },
  {
    heading: "Wizard y Assist",
    section_kind: "practice",
    paragraphs: [
      "Se visto D, nomade, lavoro o famiglia si intrecciano, [Emigro Wizard Italia](/ru/italy/wizard?utm_source=emigro&utm_medium=guide&utm_campaign=30days-milano&utm_content=" +
        PERVYE_30_IT_SLUG +
        "). Per audit ordine step e rischio 8 giorni — [Route Check Assist €129](/ru/assist?utm_source=emigro&utm_medium=guide&utm_campaign=30days-milano&utm_content=" +
        PERVYE_30_IT_SLUG +
        ").",
    ],
    bullets: [
      "Wizard — confronto route senza scegliere country a priori.",
      "Assist — PDF case review, non sostituto avvocato.",
      "Satellite inventory — 8 core notes Italia; questo file orchestrator.",
    ],
  },
];

const keyTakeaways = [
  "Официально: visto D → permesso entro 8 gg lavorativi (kit postale); codice fiscale AA4/8; residenza Comune — trámites separati.",
  formatPracticeTakeaway({
    channels: ["milanru", "forum_italy"],
    period: "2025–2026",
    claim: "ordine tipico Milano mes 1: SIM → codice fiscale → kit postale → IBAN IT → residenza → SSN",
    forReader: "72h — SIM + kit prep + CF; settimana 4 — Questura e salute",
  }),
  "Расхождение: «mes senza kit ok» vs 8 giorni lavorativi; «Revolut basta» vs domiciliazione renta к 4–6 mes.",
  "На практике: пропуск CF/kit en mes 1 → blocchi renta, INPS e SSN en mes 4–6.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "С чего начать в первый день в Milano?",
    a: "По правилам — первые 30 дней включают scadenza 8 giorni lavorativi per permesso. На практике: SIM, short-term, prep kit e appuntamento Entrate AA4/8 — nelle prime 72 ore.",
  },
  {
    q: "Можно отложить kit postale на второй mes?",
    a: "По правилам — no, 8 giorni lavorativi dall'ingresso. На практике Poste queue — compilare kit entro giorni 3–5.",
  },
  {
    q: "72 ore vs settimana 4 — в чём разница?",
    a: "По правилам trámites hanno scadenze diverse. На практике: 72h = SIM + kit prep + CF; settimana 4 = Questura rilievi, SSN, domiciliazione.",
  },
  {
    q: "Como — отдельный satellite?",
    a: "По правилам — stesso permesso provincia Milano/Lombardia. На практике Como/Nord — geo extra in [районы guide](/notes/" + RAJONY_SLUG + "), non second hub.",
  },
  {
    q: "Что если пропустил codice fiscale в mes 1?",
    a: "По правилам — AA4/8 appena possibile. На практике senza CF bloccano banca, luce e contratto. К 4–6 месяцу — хвост INPS e F24.",
  },
];

export const PERVYE_30_IT_GUIDE = {
  slug: PERVYE_30_IT_SLUG,
  category: "Первый месяц",
  content_kind: "guide" as ContentKind,
  title: "Первые 30 дней в Milano: чеклист satellite 2026",
  excerpt:
    "72h → settimana 4: SIM, codice fiscale, kit permesso, IBAN IT, SSN — orchestrator Milano/Nord с eight core guides. Пропуск mes 1 бьёт renta e INPS к 4–6 месяцу. Не копируйте Spain/Portugal checklist.",
  seo_title: "Первые 30 дней Италия 2026 — Milano checklist",
  seo_description:
    "Первые 30 дней Milano 2026: SIM, codice fiscale, kit postale permesso, банк IBAN IT, SSN. Порядок 72 часа → 4-я неделя для RU/BY. Como/Nord.",
  quick_answer:
    "Первые 30 дней в Milano: первые 72 часа — связь, подготовка kit permesso (8 giorni lavorativi), запись AA4/8 codice fiscale и жильё с документами для residenza. Недели 1–2 — certificato CF, kit Poste Sportello Amico, IBAN IT и аренда; недели 3–4 — convocazione Questura, SSN и residenza Comune. Используйте только итальянские формы. К 4–6 месяцу проверьте renta, INPS и utenze.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "Agenzia delle Entrate", url: "https://www.agenziaentrate.gov.it/" },
    { title: "Portale Immigrazione", url: "https://www.portaleimmigrazione.it/" },
    { title: "Poste Italiane — permesso", url: "https://www.poste.it/guida-rilascio-e-rinnovo-permesso-di-soggiorno" },
    { title: "Ministero dell'Interno", url: "https://www.interno.gov.it/" },
    { title: "Comune di Milano", url: "https://www.comune.milano.it/" },
  ],
  topic_tags: ["milano", "checklist", "permesso"],
  hashtags: buildNoteHashtags({
    topicTags: ["milano", "checklist", "permesso"],
    contentKind: "guide",
    extra: ["30days", "satellite", "lombardia"],
  }),
  source_channel: "milanru+forum_italy+digital_nomad_Italiya",
  source_label: "editorial:italy-seed",
};

export default PERVYE_30_IT_GUIDE;
