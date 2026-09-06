/**
 * Hand-curated Italy satellite guide — scuole e famiglia Milano / Como.
 * Statali vs internazionali; Comune iscrizioni; honest no-children paragraph.
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import {
  formatPracticeBullet,
  formatPracticeTakeaway,
} from "@/lib/community-notes/practice-format";
import type { CommunityNoteFaq, ContentKind, GlossaryTerm, NoteBodySection } from "@/lib/community-notes/types";

export const SHKOLY_SEMYA_IT_SLUG = "shkoly-semya-milano-como-2026";

const PERVYE_30_SLUG = "pervye-30-dnej-v-italii-satelit-2026";
const RAJONY_SLUG = "milano-rajony-arenda-metro-como-2026";
const ARENDA_SLUG = "arenda-milano-idealista-2026";
const MEDITSINA_SLUG = "meditsina-milano-ssn-tessera-2026";
const TRANSPORT_SLUG = "transport-milano-atm-trenord-2026";
const VNJ_SLUG = "vnj-italiya-nomade-elective-2026";

const GLOSSARY: GlossaryTerm[] = [
  { pt: "Scuola statale", ru: "государственная школа MIM; бесплатная, на итальянском" },
  { pt: "Scuola paritaria", ru: "частная с госаккредитацией; fee + iscrizione" },
  { pt: "Scuola internazionale", ru: "IB/British curriculum; высокий fee, очереди" },
  { pt: "Piattaforma Unica", ru: "онлайн-iscrizione MIM; SPID/CIE" },
  { pt: "Polo START", ru: "Comune Milano — accoglienza alunni stranieri neoarrivati" },
  { pt: "ATS", ru: "Azienda Sanitaria Locale; vaccini e pediatra" },
  { pt: "Obbligo di istruzione", ru: "обязательное обучение 6–16 лет" },
  { pt: "Comune di Como", ru: "отдельный comune; iscrizione не через Milano START" },
];

const DISCLAIMER =
  "**Emigro — не школьная консультация.** Окна iscrizione, posti e criteri **меняются** — [unica.istruzione.gov.it](https://unica.istruzione.gov.it/it/orientamento/iscrizioni), [comune.milano.it](https://www.comune.milano.it/). Como = altro Comune. Не копируйте Porto colégio как «та же процедура».";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(
      GLOSSARY,
      "Слова из Polo START, Piattaforma Unica и чата @milanru — до того как «Como рядом с Milano» станет отказом iscrizione в wrong comune."
    ),
    paragraphs: [DISCLAIMER],
  },
  {
    heading: "Nota Emigro (fact-check)",
    section_kind: "official",
    paragraphs: [
      "Слот schools_family закрываем даже без детей (абзац ниже). OK/soft/fixed/UNCHECKED.",
    ],
    bullets: [
      "OK: iscrizioni a.s. 2026/2027 classi prime — **13 gennaio – 14 febbraio 2026** online Piattaforma Unica ([circ. MIM prot. 100847/2025 PDF](https://www.carloportamilano.edu.it/images/Documenti/IscrizioniOnline/CM0100847.pdf)).",
      "OK: accesso con **SPID, CIE, CNS o eIDAS** ([unica.istruzione.gov.it](https://unica.istruzione.gov.it/it/orientamento/iscrizioni)).",
      "OK: Polo START Comune Milano — accoglienza minori stranieri I ciclo ([Milano Aiuta](https://www2.comune.milano.it/web/milanoaiuta/ulteriori-necessita)).",
      "OK: vaccinazioni — piano nazionale; ATS Lombardia per calendario ([ats-milano.it](https://www.ats-milano.it/) — soft URL).",
      "Fixed: «Como = suburb Milano scuola» → **Comune di Como** propri iscrizioni e USR.",
      "Fixed: «Portugal escola online basta» → Italia Piattaforma Unica + START per neoarrivati.",
      "Soft: scuole internazionali — fee €8–20k+/anno, waiting list.",
      "UNCHECKED: posti liberi per neoarrivato **mid-year** in specifica scuola — dipende da istituto.",
      "UNCHECKED: criteri priorità 2026/27 ogni singola scuola primaria Milano — regolamento istituto.",
    ],
  },
  {
    heading: "Если детей нет: зачем этот гайд",
    section_kind: "official",
    paragraphs: [
      "Многие RU relocant в Milano **без детей** — slot schools_family всё равно полезен: вы выбираете [район](/notes/" +
        RAJONY_SLUG +
        ") и [аренду](/notes/" +
        ARENDA_SLUG +
        ") с запасом «если через год семья»; понимаетe, почемu соседи ездят в Polo START; не путаете **Como** и **Milano** при разговорах с agency. Если дети не в планах — прочитайте Nota + таблицу statali/internazionali и переходите к [transport](/notes/" +
        TRANSPORT_SLUG +
        ") / [meditsina](/notes/" +
        MEDITSINA_SLUG +
        ").",
    ],
    bullets: [
      "Без figli — гайд для контекста и будущего planning.",
      "Como relocate с детьми — этот текст + Comune Como sito.",
      "Wizard — family scenario: [/ru/italy/wizard](/ru/italy/wizard).",
    ],
  },
  {
    heading: "Официально: scuola statale vs internazionale в Milano",
    section_kind: "official",
    paragraphs: [
      "**Scuola statale** (MIM): gratuito; lingua **italiano**; iscrizione через Piattaforma Unica в окно gennaio–febbraio для classi prime; **inserimento mid-year** — через segreteria scuola + Polo START se straniero neoarrivato. Obbligo istruzione с 6 anni (entro 31/12 anno).",
      "**Scuola paritaria / internazionale**: rette annue, spesso **€8.000–20.000+**; curriculum IB, British, American; iscrizione diretta alla scuola + test/ colloquio; waiting list 6–18 mesi soft для popular schools (American School Milan, ICS, St. Louis…).",
      "**Asilo nido / scuola dell'infanzia (0–6)**: Comune Milano — domanda online ed.infanzia@comune.milano.it ([Milano Aiuta](https://www2.comune.milano.it/web/milanoaiuta/ulteriori-necessita)); posti limitati, ISEE per graduatoria.",
    ],
    bullets: [
      "Primaria — 6 anni entro 31/12/2026 per a.s. 2026/27.",
      "Secondaria I grado — iscrizione stessa finestra online.",
      "Secondaria II — CTI Ambito 21/22 Milano per orientamento.",
      "Codice meccanografico scuola — su sito istituto.",
      "Documenti — permesso soggiorno, CF genitore, certificato vaccinazioni.",
      "Como — USR Lombardia + Comune Como scuola.",
    ],
  },
  {
    heading: "Comune di Milano: iscrizioni e Polo START",
    section_kind: "official",
    paragraphs: [
      "**Neoarrivati stranieri** (I ciclo primaria + secondaria I grado) domiciliati a **Milano**: contattare **Polo START** per municipio ([Milano Aiuta — 4 poli](https://www2.comune.milano.it/web/milanoaiuta/ulteriori-necessita)): START 1 (Municipi 1–3), START 2 (4–5), START 3 (6–7), START 4 (8–9). Email poli su pagina Comune.",
      "**Procedura:** orientamento scolastico, distribuzione equilibrata posti ([accordo MIM–Comune Poli START 2026–2028 PDF](https://www.mim.gov.it/documents/9081610/0/SCHEMA+ACCORDO+POLI+START+2026-2028.pdf/b18ff491-ee23-69b4-d008-6be652954c8f)). Non scegliete solo «scuola sotto casa» senza START se neoarrivato mid-year.",
      "**Residenza anagrafica** в Comune di Milano укрепляет priorità soft; без residenza — iscrizione possibile ma più complessa.",
    ],
    bullets: [
      "02.02.02 — numero unico Comune Milano info.",
      "ed.infanzia@comune.milano.it — nido 0–6.",
      "SPID — Piattaforma Unica iscrizioni annuali.",
      "Certificato di vaccinazione — ATS.",
      "Permesso figlio — copia per segreteria.",
      "Como — Ufficio Scuola Comune di Como, non START Milano.",
    ],
  },
  {
    heading: "Milano на практике: mes 1–3 с ребёнком",
    section_kind: "practice",
    paragraphs: [
      "**Mese 1:** [permesso](/notes/vnj-italiya-nomade-elective-2026) figlio + [CF](/notes/codice-fiscale-milano-2026) + [SSN/tessera](/notes/" +
        MEDITSINA_SLUG +
        ") + pediatra ATS. Соберите **certificato vaccinazioni** (traduzione soft).",
      "**Scelta scuola:** если september entry — Piattaforma Unica в gennaio; если **arrivo marzo/giugno** — email Polo START + segreteria. Internazionale — parallel application сразу (waiting list).",
      "**Como:** если живёте в Como comune — iscrizione через **Comune di Como** e scuole provinciali; commute Milano — [Trenord](/notes/" +
        TRANSPORT_SLUG +
        ").",
    ],
    bullets: [
      formatPracticeBullet({
        channels: ["milanru", "forum_italy"],
        period: "2025–2026",
        claim:
          "famiglie neoarrivati contactarono Polo START 3 (Municipi 6–7) per inserimento primaria mid-year",
        forReader: "START prima di segreteria random",
      }),
      "Bilingual support — progetto italiano L2 in scuola statale.",
      "Mensa scolastica — iscrizione separata.",
      "Trasporto scolastico — soft limitato in città.",
      "After-school — privati; costo extra.",
      "[Районы](/notes/" + RAJONY_SLUG + ") — scuola e affitto.",
    ],
  },
  {
    heading: "Vaccini, ATS e pediatra",
    section_kind: "practice",
    paragraphs: [
      "**ATS Milano** (o ATS Insubria per Como) — calendario vaccinale obbligatorio per iscrizione; richiamo visita pediatra SSN dopo [tessera sanitaria](/notes/" +
        MEDITSINA_SLUG +
        "). Stomatologo — spesso privato.",
      "Assicurazione privata из visto — top-up finché SSN non attivo.",
    ],
    bullets: [
      "Libretto vaccinale tradotto — soft richiesto.",
      "Pediatra SSN — scelta dopo iscrizione ASL.",
      "Emergency — 118; pronto soccorso pediatrico.",
      "Sport — scuole e polisportiva comunale.",
      "Como ATS — territorio diverso da Milano.",
    ],
  },
  {
    heading: "К 4–6 месяцу: хвост без scuola o vaccini",
    section_kind: "gap",
    paragraphs: [
      "К **4–6 месяцу** без iscrizione scuola (obbligo 6+) — sanzioni amministrative verso genitori soft; bambino fuori sistema L2. Senza vaccini — rifiuto iscrizione o sospensione.",
      "Internazionale-only strategy без backup statale — rischio no posto e fee persa. Residenza fittizia per scuola «migliore» — fraud risk.",
    ],
    bullets: [
      "Obbligo scolarità — genitori responsabili.",
      "Mid-year senza START — ritardi L2.",
      "Waiting list internazionale — 12+ mesi soft.",
      "Como/Milano mismatch — trasferimento complicato.",
      "No SSN — pediatra privato costoso.",
      "Assist — family route audit.",
    ],
  },
  {
    heading: "Типичные ошибки школ и семьи в Milano",
    section_kind: "practice",
    paragraphs: [
      "Family relocant из RU forum — повторяющиеся errori.",
    ],
    bullets: [
      "Ошибка: affitto Como, iscrizione Milano START — wrong comune.",
      "Ошибка: ждать settembre без Polo START mid-year.",
      "Ошибка: только internazionale без plan B statale.",
      "Ошибка: no SPID/CIE genitore — не открыть Piattaforma Unica.",
      formatPracticeBullet({
        channels: ["milanru"],
        period: "2025–2026",
        claim: "agency prometteva «scuola europea sotto casa» senza verifica posti",
        forReader: "verificare segreteria/START, non annuncio",
      }),
      "Ошибка: vaccini «сделаем потом» — block iscrizione.",
    ],
  },
  {
    heading: "Wizard и Assist",
    section_kind: "practice",
    paragraphs: [
      "Family relocation Milano vs Como — [Wizard Italia](/ru/italy/wizard?utm_source=emigro&utm_medium=guide&utm_campaign=shkoly-semya&utm_content=" +
        SHKOLY_SEMYA_IT_SLUG +
        "). Audit iscrizione + permesso figli — [Assist Route Check](/ru/assist?utm_source=emigro&utm_medium=guide&utm_campaign=shkoly-semya&utm_content=" +
        SHKOLY_SEMYA_IT_SLUG +
        ").",
    ],
    bullets: [
      "[VNJ / permesso family](/notes/" + VNJ_SLUG + ").",
      "[Первые 30 дней](/notes/" + PERVYE_30_SLUG + ").",
      "[Meditsina SSN](/notes/" + MEDITSINA_SLUG + ").",
    ],
  },
];

const keyTakeaways = [
  "Официально: iscrizioni 13 gen–14 feb 2026 su Piattaforma Unica (SPID/CIE); Polo START Milano per neoarrivati stranieri.",
  "Официально: scuola statale gratuita IT; internazionali — fee e waiting list; Como = altro Comune.",
  formatPracticeTakeaway({
    channels: ["milanru", "forum_italy"],
    period: "2025–2026",
    claim: "mid-year inserimento через Polo START + ATS vaccini в mes 1–2",
    forReader: "senza figli — гайд для контекста; con figli — START early",
  }),
  "На практике: к 4–6 месяцу без iscrizione/vaccini — obbligo scolastico e gap L2; verificare comune affitto.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Как записать ребёнка в школу Milano?",
    a: "По правилам — Piattaforma Unica 13 gen–14 feb 2026 per classi prime; neoarrivati — Polo START Comune. На практике mid-year через START email + segreteria scuola.",
  },
  {
    q: "Como и Milano — одна школа?",
    a: "По правилам Como è Comune autonomo con proprie iscrizioni. На практике START Milano non copre residenti Como.",
  },
  {
    q: "Нужны ли прививки?",
    a: "По правилам piano nazionale vaccini e ATS. На практике certificato richiesto per iscrizione scolastica.",
  },
  {
    q: "Читать ли гайд без детей?",
    a: "По правилам slot satellite include famiglia. На практике один абзац достаточен; полезен для выбора района и понимания Como vs Milano.",
  },
  {
    q: "Scuola internazionale или statale?",
    a: "По правилам statale gratuita in italiano; internazionale a pagamento IB/British. На практике waiting list internazionali — подавать early + plan B statale.",
  },
];

export const SHKOLY_SEMYA_IT_GUIDE = {
  slug: SHKOLY_SEMYA_IT_SLUG,
  category: "Семья",
  content_kind: "guide" as ContentKind,
  title: "Школы и семья Milano 2026: statale, internazionale, Como",
  excerpt:
    "Scuole Milano e Como 2026: Piattaforma Unica iscrizioni, Polo START neoarrivati, scuola statale vs internazionale, ATS vaccini. Como — altro Comune. Абзац для relocant без детей; obbligo scolastico e START mid-year.",
  seo_title: "Школы семья Milano Como 2026 Италия",
  seo_description:
    "Scuole Milano 2026: Piattaforma Unica, Polo START stranieri, statale vs internazionale, ATS vaccini. Como — Comune separato. Senza figli — контекст.",
  quick_answer:
    "В Milano iscrizione scuola statale primaria/secondaria I grado — online Piattaforma Unica (SPID/CIE) 13 gennaio–14 febbraio 2026; neoarrivati stranieri contattano Polo START Comune per municipio. Scuole internazionali — fee alto e waiting list, domanda diretta. Como — Comune autonomo: iscrizioni non via START Milano. Vaccini ATS obbligatori per iscrizione. Senza figli гайд даёт контекст для аренды и Como vs Milano. A 4–6 mesi senza iscrizione — rischio sanzioni obbligo scolastico.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "Piattaforma Unica — iscrizioni MIM", url: "https://unica.istruzione.gov.it/it/orientamento/iscrizioni" },
    { title: "Milano Aiuta — Polo START", url: "https://www2.comune.milano.it/web/milanoaiuta/ulteriori-necessita" },
    { title: "Ministero Istruzione e Merito", url: "https://www.mim.gov.it/" },
    { title: "Comune di Milano", url: "https://www.comune.milano.it/" },
  ],
  topic_tags: ["schools", "family", "milano", "como"],
  hashtags: buildNoteHashtags({
    topicTags: ["schools", "family", "milano", "como"],
    contentKind: "guide",
    extra: ["iscrizioni", "start", "satellite"],
  }),
  source_channel: "milanru+forum_italy+milan_4at",
  source_label: "editorial:italy-seed",
};

export default SHKOLY_SEMYA_IT_GUIDE;
