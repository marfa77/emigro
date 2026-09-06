/**
 * Hand-curated Italy satellite guide — SSN / tessera sanitaria / medico di base in Milano.
 * Official ATS Milano / ASST pages separated from field practice. Not Spain SIP.
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import {
  formatPracticeBullet,
  formatPracticeTakeaway,
} from "@/lib/community-notes/practice-format";
import type {
  CommunityNoteFaq,
  ContentKind,
  GlossaryTerm,
  NoteBodySection,
} from "@/lib/community-notes/types";

export const MEDITSINA_MILANO_SLUG = "meditsina-milano-ssn-tessera-2026";

const CODICE_FISCALE_SLUG = "codice-fiscale-milano-2026";
const PERVYE_30_SLUG = "pervye-30-dnej-v-italii-satelit-2026";
const PERMESSO_SLUG = "permesso-questura-milano-2026";

const GLOSSARY_INTRO =
  "Слова с tessera sanitaria, sportello ASST e ricetta medica — разберём до первого mal di gola, пока «SSN как SIP в Valencia» не стоил месяца без medico di base.";

const LOCAL_TERMS: GlossaryTerm[] = [
  { pt: "SSN", context: "Servizio Sanitario Nazionale", ru: "национальная система здравоохранения Италии; в Lombardia — SSR regionale" },
  { pt: "tessera sanitaria", context: "TS-CNS", ru: "карта SSN + codice fiscale; ключ к medico di base e ricette" },
  { pt: "medico di base", context: "MMG", ru: "участковый терапевт (GP); scelta libera nel distretto ASST" },
  { pt: "ATS Milano", ru: "Agenzia di Tutela della Salute; coordina SSR sul territorio metropolitano" },
  { pt: "ASST", context: "Azienda Socio-Sanitaria Territoriale", ru: "оператор первички и sportelli scelta medico a Milano (Fatebenefratelli, Niguarda, S.Paolo)" },
  { pt: "pronto soccorso", ru: "приёмное отделение ospedale; emergenza grave — 118, не «кашель в PS»" },
  { pt: "ticket sanitario", ru: "доплата за visita/esame; esenzioni per reddito o patologia" },
  { pt: "guardia medica", ru: "дежурный врач fuori orario MMG; continuità assistenziale territoriale" },
];

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(LOCAL_TERMS, GLOSSARY_INTRO),
  },
  {
    heading: "Nota Emigro (fact-check)",
    section_kind: "official",
    paragraphs: [
      "Короткий разбор формулировок. **OK** — сверено с ATS Milano / portale ASST 2026; **soft** — чаты без фиксированной цены; **fixed** — путаница с SIP Испании. Не юридическая консultazione.",
    ],
    bullets: [
      "OK: iscrizione al **Servizio Sanitario Regionale** Lombardia obbligatoria per assistiti aventi diritto; comporta scelta **medico e pediatra** ([ATS Milano — scelta medico](https://www.ats-milano.it/ats/carta-servizi/guida-servizi/assistenza-sociosanitaria/iscrizione-ssr-tessera-sanitaria/scelta-medico-pediatra/scelta-medico-pediatra)).",
      "OK: gestione scelta/revoca MMG a Milano — portale interaziendale **sr.asst-fbf-sacco.it** (ASST Fatebenefratelli Sacco, S.Paolo e Carlo, Niguarda) per Municipi 1–9.",
      "OK: scelta/revoca anche via **Fascicolo Sanitario Elettronico** Lombardia con SPID/CIE/PIN in tempo reale (volantino ASST 2025).",
      "Fixed: «SIP Valencia = tessera Milano» → **SIP — только Comunitat Valenciana**; in Italia — **tessera sanitaria** SSR dopo iscrizione ASST.",
      "Soft: tempi emissione tessera dopo iscrizione — **2–6 settimane** in chat; documento provvisorio ASST può bastare interim.",
      "Soft / UNCHECKED: prezzi polizze **Unisalute, FASDAC, Metasalute** — non fissati legge; preventivo individuale.",
      "UNCHECKED: percorso esatto **straniero extracomunitario** senza lavoro dipendente — dipende da permesso e convenzioni; verificare sportello «Cittadini stranieri» ASST.",
      "OK: все четыре URL из official_links открыты 06.09.2026; exact sede/orari sportello в тексте не фиксируем, потому что они меняются.",
      "OK: **odontoiatria** SSN — limitata (esenzioni patologia); routine e estetica — quasi sempre **privato**.",
    ],
  },
  {
    heading: "Официально: SSN, SSR Lombardia e tessera sanitaria",
    section_kind: "official",
    paragraphs: [
      "Servizio Sanitario Nazionale garantisce assistenza primaria, specialistica, ospedaliera e farmaceutica con ticket o esenzioni. In **Lombardia** l’iscrizione passa dal **SSR** regionale e dalla **tessera sanitaria** (TS-CNS), che contiene anche il **codice fiscale**.",
      "Titolar del diritto: cittadini italiani, stranieri con **permesso di soggiorno** e situazioni previste da normativa (lavoratori iscritti INPS, familiari a carico, ecc.). **ATS Milano** coordina sul territorio; le pratiche operative di scelta medico sono sulle **ASST** per comune di residenza/domicilio.",
      "Dopo iscrizione si sceglie **medico di medicina generale (MMG)** o pediatra nel distretto. Revoca e cambio — online (FSE), portale sr.asst-fbf-sacco.it o appuntamento sportello Zerocoda.",
    ],
    bullets: [
      "Iscrizione SSR: documento identità, permesso/carta soggiorno, codice fiscale, certificato residenza/domicilio.",
      "Scelta MMG: elenco medici disponibili per distretto — «Trova Medico» su ATS Milano.",
      "Tessera sanitaria: rilascio/duplicato через ASST/FSE или указанный региональным порталом sportello; точная sede перед визитом — **UNCHECKED**.",
      "Prenotazioni: CUP regionale, app «Prenota Online» SSR, sportello MMG.",
      "118 — emergenza sanitaria; guardia medica — continuità fuori orario MMG.",
    ],
  },
  {
    heading: "Официально: stranieri, lavoro e copertura",
    section_kind: "official",
    paragraphs: [
      "Percorso tipico **lavoratore dipendente**: contratto и категория soggiorno → проверка diritto → iscrizione SSR con documenti → scelta MMG; INPS идёт параллельно по работе. Для **autonomo** не обещаем «право только после накопления взносов»: основание iscrizione зависит от permesso и статуса, его подтверждает ASST.",
      "Stranieri **senza occupazione** subito: spesso periodo con **assicurazione privata** obbligatoria per visto/permesso finché non si matura diritto SSR. Non assumere «permesso = tessera automatica» — verificare categoria permesso e sportello ASST «accesso assistenza sanitaria stranieri».",
      "**Esenzioni ticket**: per reddito (ISEE), patologia (codice esenzione), invalidità, età — richiesta/rinnovo via portale o sportello ASST.",
    ],
    bullets: [
      "Permesso soggiorno valido — prerequisito per iscrizione straniero non comunitario (soft: prassi ASST).",
      "Certificato residenza/domicilio — Comune di Milano; necessario per scelta MMG nel distretto.",
      "Familiari a carico — iscrizione separata con documenti nucleo familiare.",
      "Convenzione temporanea / studenti — percorsi dedicati su portale ASST (UNCHECKED dettagli per ogni visto).",
      "Tessera provvisoria — ricevuta iscrizione può accompagnare prime visite (soft).",
    ],
  },
  {
    heading: "SSN e medico di base на практике в Milano",
    section_kind: "practice",
    paragraphs: [
      "Milano ha **9 municipi** e tre ASST; il tuo MMG dipende da **residenza/domicilio sanitario**, non dal quartiere «modaiolo». Usa [Trova Medico](https://www.ats-milano.it/) e portale **sr.asst-fbf-sacco.it** — non copiare il medico del vicino in Navigli se abiti a Bicocca.",
      "Маршрут релоканта: **[codice fiscale](/notes/" +
        CODICE_FISCALE_SLUG +
        ") → contratto registrato → residenza Comune → iscrizione SSR/ASST → scelta MMG**. Параллельно — polizza privata sul gap. Permesso: [Questura Milano](/notes/" +
        PERMESSO_SLUG +
        "); checklist: [первые 30 дней](/notes/" +
        PERVYE_30_SLUG +
        ").",
      "Visita MMG — di regola **su appuntamento**; guardia medica per urgenze non emergenza in notturno/festivo. PS per emergenza vera — attesa ore, non «15 minuti come in privato».",
    ],
    bullets: [
      formatPracticeBullet({
        channels: ["milanru", "forum_italy"],
        period: "2025–2026",
        claim:
          "senza certificato residenza sportello ASST ritarda iscrizione SSR; contratto alone non sempre basta",
        forReader:
          "richiedete certificato residenza al Comune appena possibile — serve anche banca e permesso",
      }),
      formatPracticeBullet({
        channels: ["milan_4at"],
        period: "2025–2026",
        claim:
          "tra richiesta iscrizione e tessera fisica passavano 2–6 settimane; accettavano ricevuta + CF per prima visita MMG",
        forReader:
          "conservate ricevuta iscrizione e nome MMG scelto online",
      }),
      "Farmacia: ricetta elettronica «promemoria» sul telefono; ticket dipende da esenzione.",
      "Specialista SSN — impegnativa MMG; tempi CUP variabili (settimane–mesi soft).",
      "Pediatra — obbligatorio scelta per figli; lista separata.",
    ],
  },
  {
    heading: "Privato, dentista e pronto soccorso",
    section_kind: "practice",
    paragraphs: [
      "**Medicina privata** (UniSalute, FASI, ecc.) — bridge mesi 1–3 o integrazione ticket. Prezzi visita privata **€80–150** (soft, non tariffa ufficiale).",
      "**Dentista**: igiene e otturazioni — quasi sempre studio privato; SSN copre poco salvo esenzioni specifiche. Budget **€80–120** igiene (soft).",
      "**Pronto soccorso** — для emergenza indifferibile; неэкстренный доступ может повлечь ticket по региональным правилам. **118** для emergenza; continuità assistenziale — для неэкстренной помощи вне часов MMG.",
    ],
    bullets: [
      "Non usare PS come walk-in GP — triage penalizza codici bianchi/verdi.",
      "Polizza privata: verificare copertura psicologia, fisioterapia, ricovero.",
      "Ospedali pubblici Milano: Niguarda, Policlinico, Fatebenefratelli — PS h24.",
      "Guardia medica — numero su sito ATS / ASST per distretto.",
      "Screening oncologico SSR — programmi #iononaspetto Regione Lombardia (ATS news).",
    ],
  },
  {
    heading: "Где portale ASST и чат расходятся",
    section_kind: "gap",
    paragraphs: [
      "Siti promettono «tutto online con SPID», ma appena arrivati senza SPID finiscono in sportello con appuntamento Zerocoda.",
      "Chat: «tessera subito con permesso turistico» — permesso turistico non dà diritto SSR come residente (fixed).",
    ],
    bullets: [
      "«SSN gratis tutto» → ticket su visite/esami salvo esenzione (fixed).",
      "«Dentista SSN come medico base» → routine privata (fixed).",
      "«Scegli MMG di centro per estetica» → MMG legato a domicilio sanitario (fixed).",
      "«PS sempre 30 minuti» → attese ore in giorni punta (soft practice).",
      "«Polizza privata sostituisce permesso» → visto può richiedere assicurazione + SSR dopo iscrizione (soft).",
      "«Farmacia sceglie medico» → servizio gratuito in farmacie aderenti Lombardia (OK ATS).",
    ],
  },
  {
    heading: "Типичные ошибки",
    section_kind: "practice",
    paragraphs: [
      "Errori comuni: aspettare tessera per polizza privata scaduta; PS per rinnovo ricetta; MMG lontano da casa; ignorare guardia medica.",
    ],
    bullets: [
      "Ошибка: nessuna assicurazione privata nei primi 30 giorni — gap scoperto.",
      "Ошибка: PS per febbre — ore di attesa; chiamare MMG o guardia medica.",
      "Ошибка: non scegliere MMG entro scadenza iscrizione — assegnazione automatica lontana.",
      "Ошибка: confondere tessera sanitaria con permesso soggiorno — documenti distinti.",
      "Ошибка: specialisti privati senza impegnativa quando SSR coprirebbe con ticket basso.",
      "Ошибка: dimenticare rinnovo esenzione reddito — ticket pieni a mesi 4–6.",
    ],
  },
  {
    heading: "К 4–6 месяцу: tessera, ticket e routine",
    section_kind: "practice",
    paragraphs: [
      "К 4–6 месяцу tessera fisica e MMG routine dovrebbero funzionare; se iscrizione ritardata — ancora polizza privata e costi duplicati. Primo inverno — influenza, attese CUP per specialisti.",
      "К 4–6 месяцу rinnovo permesso chiede prova assistenza e residenza; gap SSR — red flag pratica.",
      "Se percorso visto e copertura non coincidono — [wizard Emigro](https://www.emigro.online/ru/italy/wizard) e [Assist](https://www.emigro.online/ru/assist?utm_source=emigro&utm_medium=guide&utm_campaign=milano_health).",
    ],
    bullets: [
      "К 4–6 месяцу: esenzione reddito non richiesta — ticket pieni su visite ripetute.",
      "К 4–6 месяцу: MMG cambiato quartiere senza revoca — distretto sbagliato.",
      "К 4–6 месяцу: polizza privata scaduta mentre SSR ancora in lavorazione.",
      "К 4–6 месяцу: screening età (mammografia, colon) — verificare inviti SSR.",
      "К 4–6 месяцу: figli senza pediatra scelto — pratica scuola/asilo complicata.",
    ],
  },
];

const keyTakeaways = [
  "Официально: SSR Lombardia via ATS/ASST; tessera sanitaria + scelta MMG; portale sr.asst-fbf-sacco.it per Milano municipi 1–9.",
  formatPracticeTakeaway({
    channels: ["milanru", "forum_italy"],
    period: "2025–2026",
    claim:
      "CF + residenza → iscrizione ASST online/sportello → scelta MMG; tessera fisica 2–6 settimane",
    forReader:
      "tenete polizza privata sul gap; non è SIP Spagna",
  }),
  "Расхождение: «SSN automatico con permesso» vs iscrizione ASST e categoria permesso.",
  "На практике: к 4–6 месяцу dentista e ticket senza esenzione — costi «nascosti»; PS solo emergenza.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Tessera sanitaria сразу после permesso?",
    a: "По правилам serve iscrizione SSR con documenti validi (permesso, CF, residenza). На практике sportello elabora pratica; tessera fisica può richiedere settimane; ricevuta iscrizione + MMG scelto per prime visite.",
  },
  {
    q: "SSN или privato nei первые месяцы?",
    a: "По правилам chi ha diritto deve iscriversi SSR; visto spesso richiede assicurazione privata iniziale. На практике mesi 1–3 — polizza privata + parallel SSR; non lasciare gap scoperto.",
  },
  {
    q: "Dentista через SSN?",
    a: "По правилам SSN copre poche prestazioni odontoiatriche con esenzioni. На практике igiene e estetica — studio privato €80–120+ (soft).",
  },
  {
    q: "Come cambiare medico di base?",
    a: "По правилам revoca/scelta via FSE (SPID), sr.asst-fbf-sacco.it o farmacia aderente. На практике cambio quartiere → revocare e scegliere MMG nel nuovo distretto.",
  },
  {
    q: "Pronto soccorso vs guardia medica?",
    a: "По правилам PS per emergenze; guardia medica per continuità non emergenza fuori orario MMG. На практике PS per malattie lievi — attese lunghe; chiamare MMG prima.",
  },
];

export const MEDITSINA_MILANO_GUIDE = {
  slug: MEDITSINA_MILANO_SLUG,
  category: "Здоровье",
  content_kind: "guide" as ContentKind,
  title: "Медицина в Milano: SSN, tessera sanitaria и medico di base",
  excerpt:
    "Iscrizione SSR Lombardia, tessera sanitaria, scelta MMG via ASST Milano, privato sul gap, dentista e pronto soccorso — без путаницы с SIP Испании.",
  seo_title: "SSN и tessera sanitaria Milano 2026",
  seo_description:
    "SSN Milano 2026: tessera sanitaria, medico di base ASST, iscrizione SSR, ticket ed esenzioni. Privato, dentista e PS — guida RU senza SIP Spagna.",
  quick_answer:
    "В Milano доступ к SSN через iscrizione **SSR Lombardia** e **tessera sanitaria**. Scelta **medico di base** — portale ASST sr.asst-fbf-sacco.it o FSE con SPID. Serve permesso, codice fiscale e residenza. Mesi 1–3 spesso polizza privata sul gap. Dentista — quasi sempre privato. PS — emergenza; guardia medica fuori orario. Non è SIP Valencia.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "ATS Milano — scelta medico e SSR", url: "https://www.ats-milano.it/ats/carta-servizi/guida-servizi/assistenza-sociosanitaria/iscrizione-ssr-tessera-sanitaria/scelta-medico-pediatra/scelta-medico-pediatra" },
    { title: "Portale scelta/revoca MMG Milano", url: "https://sr.asst-fbf-sacco.it/" },
    { title: "Servizi territoriali ASST Milano", url: "https://www.serviziterritoriali-asstmilano.it/" },
    { title: "Fascicolo Sanitario Elettronico Lombardia", url: "https://www.fascicolosanitario.regione.lombardia.it/" },
  ],
  topic_tags: ["health", "ssn", "milano", "italy"],
  hashtags: buildNoteHashtags({
    topicTags: ["health", "ssn", "milano", "italy"],
    contentKind: "guide",
    extra: ["tessera", "mmg", "asst", "pronto_soccorso", "lombardia"],
  }),
  source_channel: "milanru+milan_4at+forum_italy",
  source_label: "editorial:italy-seed",
  pillar_guide_slug: PERVYE_30_SLUG,
};
