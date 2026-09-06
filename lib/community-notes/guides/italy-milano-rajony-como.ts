/**
 * Milano districts + Nord (Como, Monza) — rent lens, commute, month 4–6 bites.
 * Literary advisor voice. Same Italy satellite — Como is extra geo, not second hub.
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { formatPracticeTakeaway } from "@/lib/community-notes/practice-format";
import type {
  CommunityNoteFaq,
  ContentKind,
  GlossaryTerm,
  NoteBodySection,
} from "@/lib/community-notes/types";

export const MILANO_RAJONY_SLUG = "milano-rajony-arenda-metro-como-2026";

const ARENDA_MILANO_SLUG = "arenda-milano-idealista-2026";
const PERVYE_30_SLUG = "pervye-30-dnej-v-italii-satelit-2026";
const CODICE_FISCALE_SLUG = "codice-fiscale-milano-2026";

const DISCLAIMER =
  "**Emigro (2026):** обзор **аренды** и характера **районов** Milano + Nord (Como/Monza/Lecco), не каталог Idealista и **не гайд по покупке**. Цены — soft (Idealista/чаты 2025–2026). Связанные материалы: [аренда Idealista](/notes/" +
  ARENDA_MILANO_SLUG +
  "), [первые 30 дней](/notes/" +
  PERVYE_30_SLUG +
  "), [codice fiscale](/notes/" +
  CODICE_FISCALE_SLUG +
  "). Не юридическая консultazione.";

const GLOSSARY_INTRO =
  "Слова с Idealista, tabellone ATM и biglietto Trenord — чтобы municipio, quartiere e linea M2 non смешались, пока вы ещё выбираte indirizzo, а не foto Instagram.";

const LOCAL_GLOSSARY: GlossaryTerm[] = [
  { pt: "municipio", ru: "административный сектор Milano (1–9); определяет ASST, scuola, sportelli Comune" },
  { pt: "quartiere", ru: "жилой квартал внутри municipio; Isola ⊂ Municipio 9, Navigli ⊂ Municipio 6" },
  { pt: "ATM", context: "Azienda Trasporti Milanesi", ru: "метро, tram и bus Milano; abbonamento su atm.it" },
  { pt: "Trenord", ru: "regional rail Lombardia; commute Como/Lecco/Monza → Milano Centrale/Garibaldi" },
  { pt: "deposito cauzionale", ru: "залог max 3 mensilità; см. гайд по аренде" },
  { pt: "CER", context: "Canone Concordato", ru: "canone in fascia tabellare; Milano — comune ad alta tensione" },
  { pt: "spese condominiali", ru: "расходы condominio; riscaldamento centralizzato часто €100–400/mese inverno (soft)" },
  { pt: "DPCM tensione abitativa", ru: "статус «высокого спроса»; влияет на concordato, не на каждый annuncio Idealista" },
];

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(LOCAL_GLOSSARY, GLOSSARY_INTRO),
    paragraphs: [GLOSSARY_INTRO, DISCLAIMER],
  },
  {
    heading: "Nota Emigro (fact-check)",
    section_kind: "official",
    paragraphs: [
      "Короткий разбор цифр — без вырезания практики. **Soft** = Idealista/чаты; **OK** = ATM/Trenord/Comune; **UNCHECKED** = точные €/m² по quartiere.",
    ],
    bullets: [
      "OK: **ATM Milano** — metro M1/M2/M3/M4/M5, tram, bus; tariffe e abbonamenti su [atm.it](https://www.atm.it/).",
      "OK: **Trenord** — collegamenti Milano ↔ Como, Lecco, Monza; alternative da **Porta Garibaldi** oltre Centrale ([trenord.it](https://www.trenord.it/)).",
      "OK: ATM, Trenord и Comune открыты через WebFetch 06.09.2026; Idealista homepage timed out в fetch, но тот же URL найден и открыт через поисковый индекс — используем как витрину, не как официальный источник права.",
      "Soft: T2 Isola/Navigli **€1.400–1.900/mese**; Loreto/Città Studi **€1.100–1.500**; Bicocca **€900–1.300**; Como centro **€800–1.200** — segnali mercato 2025–2026, non ISTAT.",
      "UNCHECKED: fascie **canone concordato** Milano 2026 aggiornate — verificare tabella comunale/accordo territoriale prima di firmare.",
      "Fixed: Como/Lecco/Monza — **geo extra stesso satellite** italy.emigro.online, non secondo hub Emigro.",
      "Fixed: non «рейтинги безопасности» — только бытовые osservazioni (rumore, turismo, stato palazzo).",
      "Soft: commute Como–Milano Centrale **40–55 min** Trenord + accesso metro; Monza **15–25 min** (orario dipendente).",
      "OK: residenza — **Comune di Milano** o comune Nord; certificato per permesso e SSR.",
    ],
  },
  {
    heading: "Официально: municipi, residenza e trasporti",
    section_kind: "official",
    paragraphs: [
      "Milano на бумаге — **9 municipi**, но жить вы будете в **quartiere** с собственным характером. Idealista «Porta Romana» и administrativo Municipio 4 не всегда совпадают один к одному с ощущением улицы.",
      "**Residenza** (iscrizione anagrafica) — Comune di Milano по indirizzo contratto registrato; certificato нужен для permesso, SSR e scuola. Nord: Como, Monza, Lecco — propri Comuni, stesso percorso satellite Emigro.",
      "**ATM** — spine metro M1 (Duomo–Rho Fiera), M2 (Assago–Cologno/Gessate), M3 (San Donato–Comasina), M4 (Linate–San Cristoforo), M5 (San Siro–Bignami). **Trenord** — commute da laghi e Monza; verificare se passare da Centrale o Porta Garibaldi.",
      "Для семьи район выбирают после проверки scuola di bacino у Comune и маршрута ребёнка, а не по одному названию quartiere. Международную школу проверяют отдельно: этот гайд не обещает зачисление по адресу.",
    ],
    bullets: [
      "Abbonamento ATM mensile — atm.it; detrazione IRPEF possibile (soft).",
      "Trenord abbonamento zone — per commute Nord; biglietti digitali app.",
      "Residenza: contratto registrato + documenti — sportello Comune o online SPID.",
      "Quartiere determina distretto scolastico e MMG — см. гайд SSN.",
      "Portali: [ATM](https://www.atm.it/), [Trenord](https://www.trenord.it/), [Comune di Milano](https://www.comune.milano.it/).",
    ],
  },
  {
    heading: "Как читать карту Milano",
    section_kind: "official",
    paragraphs: [
      "Milano — не «один centro», а сеть quartieri: business Porta Nuova, nightlife Navigli, famiglie semi-centro, studenti Loreto, hipster Isola, calcio San Siro, campus Bicocca. Nord — не «другой город Emigro», а **stesso satellite** с commute laghi.",
      "Ниже — **8 зон Milano** + **3 opzioni Nord** (Como, Monza, Lecco). Не рейтинг «лучший район», а аренда, commute и что всплывает к **4–6 месяцу**. Перед cauzione — [Idealista-практика](/notes/" +
        ARENDA_MILANO_SLUG +
        ").",
    ],
    bullets: [
      "Centro storico e Navigli — canoni alti, turismo e rumore.",
      "Isola/Porta Garibaldi — gentrificazione, M2/M5, prezzi in crescita.",
      "Loreto/Città Studi — metro M1/M2, mix studenti e famiglie.",
      "Bicocca/San Siro — più affordable, commute più lungo al centro.",
      "Como/Monza — canone minore, Trenord daily.",
    ],
  },
  {
    heading: "1. Isola e Porta Garibaldi",
    section_kind: "practice",
    paragraphs: [
      "**Характер.** Ex industrial, ora skyscraper (Bosco Verticale), brunch e coworking. Bene — M2 Isola/Garibaldi, vibe internazionale, eventi Design Week. Male — cantieri, affitti in salita, turismo business.",
      "**Кому.** Coppie, remote worker, single 28–45; famiglie cercano spazio e silenzio altrove.",
      "**Commute.** M2, Passante Garibaldi, bus verso centro; Malpensa spesso da Centrale/Garibaldi + Malpensa Express.",
      "**Аренда (soft 2026).** Monolocale €1.000–1.300; T2 €1.500–1.900; T3 raro sotto €2.200.",
      "Главное: pagate il «nuovo Milano» — verificate rumore cantiere e luce in cortile stretto.",
    ],
    bullets: [
      "+ metro, ristoranti, expat; − prezzo, cantieri, competition viewing.",
      "M2 Isola, Garibaldi; Trenord Passante.",
      "Soft: agency chiede pacchetto completo CF+IBAN.",
    ],
  },
  {
    heading: "2. Navigli e Porta Romana",
    section_kind: "practice",
    paragraphs: [
      "**Характер.** Navigli — acque, aperitivo, turismo notturno; Porta Romana — più residenziale, vicino università Bocconi/NABA zone.",
      "**Кому.** Social life, giovani professionisti; famiglie con bambini spesso evitano Navigli weekend noise.",
      "**Commute.** M2 Porta Genova (Navigli); M3 Porta Romana; tram storici.",
      "**Аренда (soft).** Navigli T1 €1.100–1.400; T2 €1.400–1.800. Porta Romana simile o leggermente sotto Navigli peak.",
      "К 4–6 mesi: rumore weekend e zanzare canale — non evidenti al primo viewing martedì mattina.",
    ],
    bullets: [
      "+ carattere, metro; − turismo, umidità, parcheggio.",
      "Navigli — verificare isolamento acustico.",
      "Soft: transitorio frequente — leggere contratto.",
    ],
  },
  {
    heading: "3. Loreto e Città Studi",
    section_kind: "practice",
    paragraphs: [
      "**Характер.** Loreto — hub M1/M2, mercato, multietnico; Città Studi — Politecnico zone, più tranquillo verso Lambrate.",
      "**Кому.** Studenti, coppie budget-conscious, famiglie che accettano urban grit.",
      "**Commute.** M1/M2 Loreto; ветки M2 идут на Cologno Nord и Gessate, расписание и конечную проверяют в ATM.",
      "**Аренда (soft).** T1 €850–1.100; T2 €1.100–1.500; spesso più spazio per euro vs Isola.",
      "Главное: Loreto di sera — vivace; controllare sicurezza percepita percepita per strada, non statistiche inventate.",
    ],
    bullets: [
      "+ prezzo, metro doppia; − rumore, densità.",
      "Buono per primo contratto 4+4.",
      "Vicino Lambrate design/eventi.",
    ],
  },
  {
    heading: "4. Porta Venezia e Buenos Aires",
    section_kind: "practice",
    paragraphs: [
      "**Характер.** Corso Buenos Aires shopping, Parco Indro Montanelli, mix borghese e moderno. Porta Venezia — M1, architettura liberty.",
      "**Кому.** Famiglie, coppie che vogliono verde e metro senza Navigli chaos.",
      "**Commute.** M1 Porta Venezia, Lima, Palestro; tram veloci.",
      "**Аренда (soft).** T2 €1.300–1.700; T3 €1.800–2.400; stabile domanda.",
      "К 4–6 mesi: spese condominiali in palazzi liberty — manutenzione ascensore e riscaldamento (soft).",
    ],
    bullets: [
      "+ parco, metro, scuole; − canone medio-alto.",
      "Buenos Aires — rumore traffico.",
      "Adatto famiglie con bambini.",
    ],
  },
  {
    heading: "5. Bicocca e nord-est periferia",
    section_kind: "practice",
    paragraphs: [
      "**Характер.** Campus Università Milano-Bicocca, nuovi palazzi, meno centro storico. Ca' Granda, Niguarda zone — ospedale e residenziale.",
      "**Кому.** Studenti, budget famiglie, chi accetta 20–30 min metro al centro.",
      "**Commute.** M5 Bicocca, Ponale; bus; più lontano da Duomo.",
      "**Аренда (soft).** T1 €700–950; T2 €900–1.300 — spesso miglior €/m².",
      "Главное: non è «lontano da tutto» con M5, ma nightlife limitata vs Navigli.",
    ],
    bullets: [
      "+ prezzo, università; − commute centro, quartiere meno «iconico».",
      "M5 frequente.",
      "Verificare sicurezza percepita serale (soft).",
    ],
  },
  {
    heading: "6. San Siro e ovest",
    section_kind: "practice",
    paragraphs: [
      "**Характер.** Stadio Meazza, quartieri popolari e zone in trasformazione verso City Life (oltre confine municipio). M5 San Siro Stadio.",
      "**Кому.** Tifosi, famiglie che cercano prezzo, lavoratori ovest città.",
      "**Commute.** M5; tram; match day — caos traffico.",
      "**Аренда (soft).** T2 €1.000–1.400; match day e parcheggio — stress a mesi 4–6 se non previsto.",
    ],
    bullets: [
      "+ M5, prezzo medio; − eventi stadio, distanza Duomo.",
      "City Life vicina — canoni più alti confine.",
      "Soft: T2 €1.000–1.400.",
    ],
  },
  {
    heading: "7–8. Brera/Centro e ripartizione rapida",
    section_kind: "practice",
    paragraphs: [
      "**Centro storico (Duomo, Brera, Solari).** Massimo prestigio e canone; turismo, ZTL, poco spazio. T1 raro sotto €1.200; T2 €1.600–2.200+ (soft).",
      "**Ripamonti/Vettabbia sud.** Meno trendy, prezzi più bassi, commute bus+M3. Per chi accetta periferia vera.",
      "Главное: centro — contratto e spese, non solo foto; verificare APE classe energetica (costi riscaldamento a mesi 4–6).",
    ],
    bullets: [
      "Centro — permesso e domicilio ok, ma budget stretto.",
      "Sud — €/m² minore, tempo centro maggiore.",
      "Ovunque: leggere [аренда](/notes/" + ARENDA_MILANO_SLUG + ").",
    ],
  },
  {
    heading: "Nord: Como, Monza, Lecco (stesso satellite)",
    section_kind: "practice",
    paragraphs: [
      "**Como.** Lago, qualità vita, canone inferiore; **Trenord** 40–55 min a Milano Centrale/Garibaldi (soft). Per remote/hybrid 2–3 giorni ufficio.",
      "**Monza.** Città autonoma, Parco, F1; 15–25 min a Milano; canone medio-basso vs Isola.",
      "**Lecco.** Lago, più distante (50–70 min); ideale se lavoro locale o raro commute.",
      "Non è un secondo hub Emigro — stesso playbook permesso, SSR ASST territoriale, [codice fiscale](/notes/" +
        CODICE_FISCALE_SLUG +
        "). A mesi 4–6 il commute daily stanca se non testato in inverno.",
    ],
    bullets: [
      "Como: T2 €800–1.200 soft; verificare frequenza treni serali.",
      "Monza: buon compromesso famiglia; M1 extension bus+train.",
      "Lecco: solo se commute raro o lavoro Lecco.",
      "Stesso satellite — cross-link notes Milano hub.",
      "Test commute una settimana prima di firmare 4+4 lontano.",
    ],
  },
  {
    heading: "Где annuncio и жизнь расходятся",
    section_kind: "gap",
    paragraphs: [
      "Foto annuncio «luminoso» — cortile interno buio in inverno. «Vicino metro» — 12 minuti a piedi contano diversamente con pioggia.",
    ],
    bullets: [
      "«Zona Isola» in annuncio — verificare civico (Isola vs Garibaldi vs China town limitrofa).",
      "«Como = Milano suburb» — ISEE, scuola, MMG — comune Como, non Milano (fixed).",
      "«Monolocale 45 mq» — spesso 28–35 reali (soft practice).",
      "«Silenzioso» su Navigli — relativo venerdì sera (soft).",
      "«Metro 5 min» — Google Maps ora punta, non chat.",
      "Spese condominiali «basse» — chiedere ultimo consuntivo inverno.",
    ],
  },
  {
    heading: "Типичные ошибки выбора района в Milano",
    section_kind: "practice",
    paragraphs: [
      "Ошибка почти всегда одна: подписали 4+4 по фото и «vicino metro», не проверив civico, rumore weekend и commute Nord. К 4–6 месяцу это бьёт spese inverno e сменой квартиры.",
    ],
    bullets: [
      "Брать Isola/Navigli «потому что все» без теста пятницы и субботы на месте.",
      "Путать Comune di Como с Milano: scuola, MMG, ISEE — другой Comune, не «пригород Милана».",
      "Игнорировать spese condominiali invernali и APE — canone «низкий» до первой bolletta riscaldamento.",
      "Считать Trenord Como = ATM urbano: 40–55 мин в Centrale — не линия M2.",
      "Подписывать transitorio «на посмотреть» без плана 4+4 к месяцу 4–6.",
    ],
  },
  {
    heading: "К 4–6 месяцу: что bite в каждом типе района",
    section_kind: "practice",
    paragraphs: [
      "К 4–6 месяцу вы знаете vero rumore, spese riscaldamento, e se commute Nord regge. Transitorio scade; 4+4 — primo inverno completo.",
      "К 4–6 месяцу mold/umidità in ground floor Navigli/Navigli-adjacent — classic surprise. Isola — cantieri nuovi palazzi.",
      "Se quartiere non funziona — cambio appartamento costa cauzione, agency, tempo; meglio test commute e notte weekend prima del secondo contratto.",
    ],
    bullets: [
      "К 4–6 месяцу: riscaldamento centralizzato — prima bolletta inverno shock.",
      "К 4–6 месяцу: commute Como daily — burnout se non calibrato.",
      "К 4–6 месяцу: turismo Navigli/Centro — sonno e ZTL guest parking.",
      "К 4–6 месяцу: scuola/asilo — distretto se non pianificato.",
      "К 4–6 месяцу: MMG distretto — cambio quartiere senza revoca medico.",
    ],
  },
];

const keyTakeaways = [
  "Официально: 9 municipi Milano; ATM metro/tram; Trenord per Como/Monza/Lecco; residenza al Comune dell’indirizzo.",
  formatPracticeTakeaway({
    channels: ["milanru", "milan_4at"],
    period: "2025–2026",
    claim:
      "Isola/Navigli T2 €1.4–1.9k; Loreto/Bicocca più basso; Como commute 40–55 min se lavoro Centrale",
    forReader:
      "testate commute e rumore weekend prima di 4+4",
  }),
  "Como/Monza/Lecco — stesso satellite Emigro, non second hub; canoni minori, trade-off tempo.",
  "На практике: к 4–6 месяцу spese inverno, umidità e commute Nord — test reale del quartiere scelto.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Какой район Milano выбрать семье с детьми?",
    a: "По правилам scuola e MMG legati a residenza. На практике Porta Venezia, Monza, parti Città Studi — equilibrio verde/metro; evitare Navigli se rumore notturno problema.",
  },
  {
    q: "Como invece di Milano — permesso e servizi?",
    a: "По правилам residenza e SSR nel Comune di domicilio (Como ASST). На практике stesso satellite Emigro; permesso valido nazionale; commute Trenord da pianificare.",
  },
  {
    q: "Isola vale il prezzo 2026?",
    a: "По правилам mercato libero — sì se budget regge. На практике pagate metro+prestige; a mesi 4–6 cantieri e affitti in salita — verificare stabilità contratto 4+4.",
  },
  {
    q: "Quanto costa abbonamento ATM?",
    a: "По правилам tariffe su atm.it (aggiornate annualmente). На практике mensile urbano — ordine **€39–45** soft 2026; verificare sito prima del calcolo budget.",
  },
  {
    q: "Cosa controllare al viewing oltre al canone?",
    a: "По правилам contratto deve indicare spese. На практике APE, riscaldamento centralizzato, isolamento acustico, distanza metro reale, ultimo bilancio condominio.",
  },
];

export const MILANO_RAJONY_GUIDE = {
  slug: MILANO_RAJONY_SLUG,
  category: "Районы и быт",
  content_kind: "guide" as ContentKind,
  title: "Районы Milano и Nord: аренда, metro, Como",
  excerpt:
    "Isola, Navigli, Loreto, Porta Venezia, Bicocca, San Siro и commute Como/Monza/Lecco — где снимать, как ездить на ATM/Trenord и что проявляется к 4–6 месяцу.",
  seo_title: "Районы Milano и Como Nord: 2026",
  seo_description:
    "Районы Milano 2026: Isola, Navigli, Loreto, metro ATM, Trenord Como/Monza. Аренда Idealista, commute Nord, spese inverno — guida RU stesso satellite.",
  quick_answer:
    "Районы Milano отличаются бытом: Isola/Navigli cari e centrali; Loreto/Città Studi доступнее; Bicocca/San Siro — budget. Семье сначала проверить scuola di bacino. ATM M1–M5 — город; Trenord — **Como** и **Monza**, extra geo того же satellite, не второй hub. До contratto проверьте spese, rumore и commute; к 4–6 месяцу проявятся inverno, umidità и transitorio.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "ATM Milano — tariffe e rete", url: "https://www.atm.it/" },
    { title: "Trenord — collegamenti regionali", url: "https://www.trenord.it/" },
    { title: "Comune di Milano", url: "https://www.comune.milano.it/" },
    { title: "Idealista — mercato affitti", url: "https://www.idealista.it/" },
  ],
  topic_tags: ["districts", "milano", "como", "rent", "italy"],
  hashtags: buildNoteHashtags({
    topicTags: ["districts", "milano", "como", "rent", "italy"],
    contentKind: "guide",
    extra: ["atm", "trenord", "navigli", "isola", "monza"],
  }),
  source_channel: "milanru+milan_4at+forum_italy",
  source_label: "editorial:italy-seed",
  pillar_guide_slug: PERVYE_30_SLUG,
};
