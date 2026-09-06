/**
 * Long-term rent Milano 2026 — Idealista, contratto 4+4 / transitorio, deposito.
 * Voice: seasoned market advisor. Fact-check overlays in Nota Emigro.
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

export const ARENDA_MILANO_SLUG = "arenda-milano-idealista-2026";
const RAJONY_SLUG = "milano-rajony-arenda-metro-como-2026";

const CODICE_FISCALE_SLUG = "codice-fiscale-milano-2026";
const BANK_IBAN_SLUG = "bank-iban-nerezident-italiya-2026";
const PERVYE_30_SLUG = "pervye-30-dnej-v-italii-satelit-2026";
const PERMESSO_SLUG = "permesso-questura-milano-2026";

const RENT_GLOSSARY_INTRO =
  "Слова из contratto di locazione, переписки с agenzia и ricevuta di registrazione — чтобы на viewing в Isola или Loreto понимать, transitorio это или trappola до 4–6 месяца.";

const LOCAL_TERMS: GlossaryTerm[] = [
  { pt: "contratto 4+4", ru: "locazione libera: 4 anni + rinnovo automatico 4; основания и preavviso disdetta зависят от стороны и clausole" },
  { pt: "transitorio", ru: "contratto 1–18 mesi con esigenza temporanea documentata; non rinnovabile automaticamente" },
  { pt: "cedolare secca", ru: "opzione fiscale del locatore: 21% libero o 10% concordato; non è canone inquilino" },
  { pt: "deposito cauzionale", ru: "залог; max **3 mensilità** di canone (L. 392/1978 art. 11)" },
  { pt: "caparra confirmatoria", ru: "аванс при бронировании; при срыве сделки правила restituzione другие, чем cauzione" },
  { pt: "registrazione contratto", ru: "обязательная регистрация в Agenzia delle Entrate entro 30 giorni" },
  { pt: "canone concordato", ru: "canone in fascia tabellare в comuni ad alta tensione; Milano — area tensionata" },
  { pt: "agenzia immobiliare", ru: "посредник; комиссия и кто её платит — предмет contratto, не универсальная норма для IT" },
];

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(LOCAL_TERMS, RENT_GLOSSARY_INTRO),
  },
  {
    heading: "Nota Emigro (fact-check)",
    section_kind: "official",
    paragraphs: [
      "Короткий разбор типичных мифов из чатов — без вырезания практики. **Soft** = ориентир рынка Milano; **fixed** = смягчено под Legge 431/98 e L. 392/78. Аудитория: RU/BY/UA/KZ с elective, lavoro, DN или famiglia в Lombardia.",
    ],
    bullets: [
      "OK: **Legge 431/1998** — contratto locazione abitativa in forma scritta; tipologie libero **4+4**, concordato **3+2**, transitorio **1–18 mesi** ([normattiva.it](https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:1998-07-09;431)).",
      "OK: **deposito cauzionale** — massimo **3 mensilità** di canone; clausola superiore nulla (L. 392/1978 art. 11).",
      "OK: **registrazione** contratto entro **30 giorni**; imposta di registro **2%** del canone annuo (minimo €67) se non cedolare secca.",
      "Fixed / UNCHECKED: прежний URL Entrate `/schede/fabbricati-e-terrenni/affitto-di-immobili` вернул **404** 06.09.2026; official_links заменён на живую страницу `atti-e-contratti-di-locazione`, которая подтверждает RLI и 30 giorni.",
      "Soft / UNCHECKED: **cedolare secca 10%** su transitorio concordato a Milano — richiede conformità accordo territoriale e attestazione; non verificato fetch accordo Milano 2026 in questa sessione.",
      "Soft: canoni Idealista T2 Isola/Navigli **€1.400–1.900**, Loreto **€1.100–1.500**, Monza/Como commute **€800–1.200** — segnali mercato 2025–2026, non statistica ISTAT.",
      "Fixed: «agenzia sempre paga inquilino 1 mese + IVA» → **in Italia non c’è LAU art. 20 spagnolo**; commissione agenzia — clausola contrattuale; negoziare e chiedere fattura.",
      "Fixed: «transitorio = nessuna registrazione» → transitorio va **registrato** come ogni locazione; rischio conversione in 4+4 se motivazione fittizia (art. 5 L. 431/98).",
      "UNCHECKED: importo esatto **spese condominiali** medie per quartiere — chiedere ultimo bilancio condominiale al viewing.",
      "UNCHECKED: se ogni agenzia accetta **IBAN estero** — pratica varia; IT IBAN aumenta accettazione.",
    ],
  },
  {
    heading: "Официально: tipi di contratto (4+4, transitorio, concordato)",
    section_kind: "official",
    paragraphs: [
      "Аренда жилья в Италии для uso abitativo регулируется **Legge 431/1998**. Contratto scritto обязателен. **Libero 4+4** — стандарт долгосрочной аренды: 4 anni, затем rinnovo ещё 4 при отсутствии законного прекращения. Не переносите одну формулу «6 mesi» на обе стороны: основания locatore и право recesso conduttore читают по закону и clausole конкретного договора.",
      "**Transitorio** (art. 5) — от 1 до 18 mesi, **non rinnovabile** automaticamente; в contratto должна быть **documentata esigenza temporanea** (lavoro, studio, lavori sull’immobile principale). Se motivazione fittizia — rischio **conversione in 4+4** con decorrenza originaria e restituzione canoni (soft: prassi giurisprudenziale, non automatica).",
      "**Concordato 3+2** — canone in fascia tabellare в comuni ad alta tensione abitativa; Milano rientra nell’elenco CIPE. Cedolare secca **10%** per locatore se requisiti concordato; **21%** per libero. Scelta cedolare — del locatore, non cambia obblighi dell’inquilino salvo clausole.",
      "Registrazione: entro 30 giorni via **modello RLI** (Agenzia delle Entrate). Imposta di registro 2% canone annuo + bollo se regime ordinario; con cedolare secca locatore esente da imposta registro (soft: verificare opzione in contratto).",
    ],
    bullets: [
      "4+4 libero: canone libero, rinnovo по закону; основания и preavviso прекращения проверяют отдельно для locatore и conduttore.",
      "Transitorio: max 18 mesi, motivazione documentata, no rinnovo automatico.",
      "Concordato 3+2: canone in tabella locale; spesso richiede attestazione conformità.",
      "Deposito cauzionale: max 3 mensilità; restituzione con interessi legali salvo crediti documentati.",
      "Testo legge: [L. 431/1998](https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:1998-07-09;431).",
    ],
  },
  {
    heading: "Официально: deposito, caparra e registrazione",
    section_kind: "official",
    paragraphs: [
      "**Deposito cauzionale** — garanzia per danni e morosità; tetto legale **tre mensilità**. Restituzione a fine locazione con interessi legali; locatore trattiene solo con crediti documentati (canoni arretrati, danni oltre usura normale).",
      "**Caparra confirmatoria** — часто при бронировании на Idealista; regole restituzione зависят от chi ha fatto cadere l’affare (codice civile art. 1385–1386). Non confondere con cauzione finale.",
      "**Registrazione** — obbligo di entrambe le parti in pratica gestito dal locatore o agenzia; inquilino paga quota metà imposta registro salvo patto diverso. Contratto non registrato — проблемы con permesso di soggiorno e voltura utenze.",
    ],
    bullets: [
      "Cauzione max 3 mesi — L. 392/1978 art. 11, inderogabile.",
      "Registrazione 30 giorni — modello RLI AdE.",
      "Imposta registro 2% canone annuo (min €67) se no cedolare.",
      "Caparra — regole diverse da cauzione; chiedere ricevuta scritta.",
      "Inventario fotografico + verbale consegna chiavi — prova stato immobile.",
    ],
  },
  {
    heading: "Idealista, Immobiliare e пакет документов",
    section_kind: "practice",
    paragraphs: [
      "**Idealista.it** и **Immobiliare.it** — главные витрины Milano e hinterland (Monza, Como, Lecco). Фильтры: zona, canone, spese condominiali, arredato, tipo contratto. Agenzia часто просит пакет **до** visita: passaporto, permesso/residenza, buste paga o estratto conto, **codice fiscale**, **IBAN**.",
      "Связанные шаги: [codice fiscale](/notes/" +
        CODICE_FISCALE_SLUG +
        "), [IBAN](/notes/" +
        BANK_IBAN_SLUG +
        "), [районы и commute](/notes/" +
        RAJONY_SLUG +
        "), [permesso Questura](/notes/" +
        PERMESSO_SLUG +
        "). Wizard: [Emigro Italia](https://www.emigro.online/ru/italy/wizard); спорный contratto — [Assist](https://www.emigro.online/ru/assist?utm_source=emigro&utm_medium=guide&utm_campaign=milano_rent).",
    ],
    bullets: [
      formatPracticeBullet({
        channels: ["milanru", "milan_4at"],
        period: "2025–2026",
        claim:
          "agenzie su Idealista chiedono CF, IBAN e cedolino prima del viewing; rifiutano senza pacchetto completo",
        forReader:
          "preparate PDF folder prima della ricerca attiva; settembre–ottobre competizione alta",
      }),
      "Codice fiscale — quasi sempre richiesto per contratto e registrazione.",
      "IBAN IT — per caparra e primo canone; estero accettato raramente.",
      "Red flags: transitorio senza motivazione scritta; cauzione >3 mesi; «solo contanti».",
      "Short-term trap: contratto transitorio 12 mesi «per prova» — a scadenza mercato peggio, conversione rischio.",
      "Como/Lecco/Monza — canoni minori, commute Trenord; stesso satellite, non second hub.",
    ],
  },
  {
    heading: "Практика: viewing, spese e agenzia",
    section_kind: "practice",
    paragraphs: [
      "На viewing в Milano проверяйте: **spese condominiali** annue (riscaldamento centralizzato?), **APE** (classe energetica), stato impianto, rumore (tram/Brianza). Chiedete se utenze luce/gas restano a nome locatore.",
      "Commissione agenzia — spesso **1 mensilità + IVA** a carico inquilino nella prassi di mercato Milano, ma **non è legge** come in Spagna: negoziate, chiedete breakdown e fattura. Formalizzazione contratto — verificare chi paga notaio/registrazione.",
      "Contratto transitorio «facile» per stranieri senza permesso definitivo — red flag se state cercando stabilità per rinnovo permesso: a 4–6 mesi dovrete rifare ricerca o convertire rapporto.",
    ],
    bullets: [
      "Spese condominiali: chiedere ultimo consuntivo; riscaldamento può essere €150–400/mese in inverno (soft).",
      "Registrazione: verificare ricevuta AdE entro 30 giorni — necessaria per permesso e utenze.",
      "Mobili vs vuoto: canone più alto arredato; clausole manutenzione elettrodomestici.",
      "Clausola ISTAT: con cedolare secca locatore rinuncia; senza cedolare possibile adeguamento.",
      "Garanzia bancaria (fidejussione) — alternativa a cauzione extra; leggere costi emissione.",
    ],
  },
  {
    heading: "Где annuncio и закон расходятся",
    section_kind: "gap",
    paragraphs: [
      "Annuncio «transitorio flessibile» spesso nasconde evitare 4+4 per locatore. Legge richiede esigenza reale e documentata.",
      "«Deposito 6 mesi standard» — illegale oltre 3; clausola nulla.",
    ],
    bullets: [
      "«Transitorio rinnovabile tacitamente» → transitorio non ha rinnovo automatico 4+4 (fixed).",
      "«Cedolare 10% = canone più basso» → cedolare è tassa locatore, non sconto obbligatorio inquilino.",
      "«Registrazione opzionale» → obbligatoria; senza RLI problemi permesso (fixed).",
      "«Solo permesso soggiorno, CF dopo» → agenzia competitiva chiede CF prima (practice).",
      "«Como è altra città satellite» → stesso hub italy.emigro.online, geo extra Nord (fixed).",
      "«Agenzia sempre 1 mese» → prassi Milano, non statuto; negoziabile (soft).",
    ],
  },
  {
    heading: "Типичные ошибки арендатора",
    section_kind: "practice",
    paragraphs: [
      "Ошибки первого contratto в Italia часто дороже, чем в Spain/PT: transitorio без мотивации, caparra без ricevuta, assenza registrazione, cauzione oltre tre mesi.",
    ],
    bullets: [
      "Ошибка: firmare transitorio 18 mesi «perché più facile» — rischio conversione e canone maggiore.",
      "Ошибка: pagare caparra senza identificare beneficiario e condizioni restituzione.",
      "Ошибка: non verificare registrazione RLI — blocca permesso e voltura luce.",
      "Ошибка: ignorare spese condominiali invernali — budget esplode a novembre.",
      "Ошибка: contratto senza inventario — dispute su danni al checkout.",
      "Ошибка: cauzione in contanti senza ricevuta — difficile provare restituzione.",
    ],
  },
  {
    heading: "К 4–6 месяцу: transitorio, spese и rinnovo permesso",
    section_kind: "practice",
    paragraphs: [
      "К 4–6 месяцу transitorio подходит к scadenza; если permesso richiede dimora stabile, начинается stress ricerca или negoziazione 4+4. Spese condominiali зимой показывают реальный costo vita.",
      "К 4–6 месяцу agenzia и locatore проверяют storico pagamenti; mora su canone — lettera messa in mora e rischio sfratto (procedura lunga in IT, ma stress alta).",
      "Se il budget non regge Milano centro — [Como/Monza](/notes/" +
        RAJONY_SLUG +
        ") restano opzione stesso satellite; non firmate transitorio senza piano B a mesi 4–6.",
    ],
    bullets: [
      "К 4–6 месяцу: scadenza transitorio — nuovo contratto o uscita; mercato affittuari forte.",
      "К 4–6 месяцу: bolletta riscaldamento centralizzato — primo inverno «vero».",
      "К 4–6 месяцу: permesso rinnovo — serve contratto registrato vigente.",
      "К 4–6 месяцу: locatore trattiene cauzione «per pulizia» senza documenti — disputa.",
      "К 4–6 месяцу: clausola ISTAT (se applicabile) aumenta canone — verificare contratto.",
    ],
  },
];

const keyTakeaways = [
  "Официально: L. 431/98 — 4+4 libero, transitorio 1–18 mesi con motivazione; cauzione max 3 mesi; registrazione 30 giorni.",
  formatPracticeTakeaway({
    channels: ["milanru", "forum_italy"],
    period: "2025–2026",
    claim:
      "Idealista Milano — agenzie chiedono CF+IBAN+payslip prima del viewing; transitorio usato per evitare 4+4",
    forReader:
      "leggete tipo contratto; transitorio fittizio può convertirsi in 4+4",
  }),
  "Расхождение: commissione agenzia «come in Spagna obbligatoria inquilino» vs clausola negoziabile in IT.",
  "На практике: к 4–6 месяцу transitorio e spese condominiali invernali — testa reale del budget; Como/Monza — stesso satellite, canone minore.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "4+4 или transitorio для релоканта с permesso?",
    a: "По правилам dimora stabile для rinnovo permesso — contratto registrato adeguato; 4+4 libero — standard lungo termine. На практике transitorio 12 mesi «per iniziare» — rischio a mesi 4–6; preferite 4+4 se permesso lo consente.",
  },
  {
    q: "Сколько максимум deposito cauzionale?",
    a: "По правилам L. 392/1978 art. 11 — **3 mensilità** di canone; clausola superiore nulla. На практике agenzie chiedono 2–3 mesi + caparra confirmatoria separata.",
  },
  {
    q: "Cedolare secca 21% vs 10% — что меняется для inquilino?",
    a: "По правилам cedolare — scelta fiscale del **locatore**; canone concordato in tabella può essere più basso. На практике leggere canone e clausola ISTAT, non la cedolare del proprietario.",
  },
  {
    q: "Idealista: какие документы до viewing?",
    a: "По правилам agenzia può richiedere identità e solvibilità. На практике CF, IBAN, cedolini/estratti 3 mesi, permesso — pacchetto PDF prima della ricerca attiva.",
  },
  {
    q: "Como o Monza invece di Milano — stesso percorso Emigro?",
    a: "По правилам contratto e permesso valgono per indirizzo reale in Lombardia. На практике Como/Lecco/Monza — geo extra **stesso satellite** italy.emigro.online, commute Trenord; non second hub.",
  },
];

export const ARENDA_MILANO_GUIDE = {
  slug: ARENDA_MILANO_SLUG,
  category: "Аренда",
  content_kind: "guide" as ContentKind,
  title: "Аренда квартиры в Milano через Idealista: 2026",
  excerpt:
    "Contratto 4+4 vs transitorio, deposito cauzionale, registrazione RLI, agenzia fee и red flags на Idealista/Immobiliare — долгосрочная аренда Milano и Nord (Como, Monza) без мифов LAU spagnola.",
  seo_title: "Аренда Milano Idealista: гайд 2026",
  seo_description:
    "Аренда в Milano 2026: Idealista, contratto 4+4, transitorio, cauzione max 3 mesi, codice fiscale e IBAN. Cedolare secca, registrazione e trappola mesi 4–6 per RU.",
  quick_answer:
    "В Milano ищут на Idealista/Immobiliare: contratto **4+4** libero — стандарт; **transitorio** 1–18 mesi только с documented esigenza. Deposito max **3 mensilità**. Registrazione entro 30 giorni (RLI). Agenzia spesso chiede 1 mese commissione — negoziabile. Serve codice fiscale e IBAN. Como/Monza — canoni minori, stesso satellite. Evitate transitorio fittizio prima del rinnovo permesso.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "Legge 431/1998 — locazioni abitative", url: "https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:1998-07-09;431" },
    { title: "Agenzia delle Entrate — locazioni (RLI)", url: "https://www.agenziaentrate.gov.it/portale/atti-e-contratti-di-locazione" },
    { title: "Idealista Italia", url: "https://www.idealista.it/" },
    { title: "Immobiliare.it", url: "https://www.immobiliare.it/" },
  ],
  topic_tags: ["rent", "milano", "idealista", "italy"],
  hashtags: buildNoteHashtags({
    topicTags: ["rent", "milano", "idealista", "italy"],
    contentKind: "guide",
    extra: ["4+4", "transitorio", "cauzione", "cedolare", "como"],
  }),
  source_channel: "milanru+milan_4at+forum_italy",
  source_label: "editorial:italy-seed",
  pillar_guide_slug: PERVYE_30_SLUG,
};
