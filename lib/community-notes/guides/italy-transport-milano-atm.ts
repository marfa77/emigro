/**
 * Hand-curated Italy satellite guide — ATM metro/tram + Trenord + auto/patente Milano / Nord.
 * Public transport first; car and driving licence in second half.
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import {
  formatPracticeBullet,
  formatPracticeTakeaway,
} from "@/lib/community-notes/practice-format";
import type { CommunityNoteFaq, ContentKind, GlossaryTerm, NoteBodySection } from "@/lib/community-notes/types";

export const TRANSPORT_MILANO_SLUG = "transport-milano-atm-trenord-2026";

const PERVYE_30_SLUG = "pervye-30-dnej-v-italii-satelit-2026";
const RAJONY_SLUG = "milano-rajony-arenda-metro-como-2026";
const ARENDA_SLUG = "arenda-milano-idealista-2026";
const VNJ_SLUG = "vnj-italiya-nomade-elective-2026";

const GLOSSARY: GlossaryTerm[] = [
  { pt: "ATM", ru: "Azienda Trasporti Milanesi — metro, tram, bus в Comune Milano" },
  { pt: "STIBM", ru: "зональный тариф Mi1–Mi9; интеграция ATM + Trenord + extraurbano" },
  { pt: "Trenord", ru: "региональные поезда Lombardia; Como, Monza, Malpensa" },
  { pt: "Linee S", ru: "suburban rail passante; входят в abbonamento urbano ATM (soft: зоны)" },
  { pt: "Abbonamento urbano", ru: "безлимит в зоне Mi1–Mi3; цена на atm.it, не фиксируем €" },
  { pt: "Patente di guida", ru: "водительское удостоверение; обмен по соглашениям или ripetizione esame" },
  { pt: "ZTL", ru: "zona traffico limitato — штрафы в centro storico без permesso" },
  { pt: "Malpensa Express / M4", ru: "аэропорт MXP; LIN — bus/tram + metro" },
];

const DISCLAIMER =
  "**Emigro — не транспортная консультация.** Тарифы ATM/STIBM **обновляются** — сверяйте [atm.it tariffe](https://www.atm.it/it/ViaggiaConNoi/Abbonamenti/Pagine/Tipologie.aspx) и PDF TARIFFE ATM. Не копируйте Lisboa Navegante или Madrid abono как «тот же €».";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(
      GLOSSARY,
      "Слова из M4 Malpensa, app ATM и чата @milan_4at — до того как «куплю машину в неделю 1» превратится в ZTL-штраф и парковку €300/мес."
    ),
    paragraphs: [DISCLAIMER],
  },
  {
    heading: "Nota Emigro (fact-check)",
    section_kind: "official",
    paragraphs: [
      "Первая половина — ATM/Trenord без машины; вторая — auto/patente. OK/soft/fixed/UNCHECKED.",
    ],
    bullets: [
      "OK: ATM управляет metro M1–M5, tram, bus в Milano ([atm.it](https://www.atm.it/)).",
      "OK: abbonamento urbano Mi1–Mi3 — metro ATM + tratte urbane Trenord + linee S nel passante ([Tipologie abbonamenti](https://www.atm.it/it/ViaggiaConNoi/Abbonamenti/Pagine/Tipologie.aspx)).",
      "OK: biglietto singolo 3 zone Mi1–Mi3 — 90 minuti con cambio ([PDF TARIFFE ATM](https://www.atm.it/it/ViaggiaConNoi/Documents/TARIFFE%20ATM.pdf)).",
      "OK: Trenord — treni regionali Como, Monza, Malpensa ([trenord.it](https://www.trenord.it/)).",
      "OK: patente straniera — scadenze e conversione [MIT / portale patente](https://www.mit.gov.it/) — soft: procedura per Paese.",
      "Fixed: «Porto без машины = невозможно» → Milano centro historico **лучше** без auto первые mesi.",
      "Fixed: «€2 Portugal metro» → STIBM зоны, не один flat fare.",
      "Soft: contactless carta su tornelli ATM — tariffa più conveniente ([atmmilano.it](https://www.atmmilano.it/it)).",
      "UNCHECKED: **точные € abbonamento mensile urbano 2026** на дату публикации — atm.it указывает cifre; мы даём **soft range**, не гарантию.",
      "UNCHECKED: Olympic/event integrazioni Rho/Assago — проверьте atm.it при поездках вне Comune.",
    ],
  },
  {
    heading: "Официально: ATM metro, tram e bus — первые 1–2 месяца",
    section_kind: "official",
    paragraphs: [
      "Comune di Milano покрыт **ATM**: 5 linee metro (M1 rossa … M5 lilla), tram storici (1, 2, 3…), bus e filobus. **STIBM** делит territory на zone **Mi1–Mi9**; abbonamento **urbano** обычно Mi1–Mi3 (Milano + comuni confinanti). За пределами — integrazione zone ([calcolatore ATM](https://www.atm.it/it/ViaggiaConNoi/Tariffe/Pagine/CalcolatoreTariffa.aspx)).",
      "**Аэропорты:** **MXP** — Malpensa Express (Trenord) до Cadorna/Central + M4 verso Linate corridor; **LIN** — bus 73/tram до metro. В день прилёта купите biglietto o contactless — не taxi default.",
      "Biglietto singolo (3 zone Mi1–Mi3): validità **90 minuti** dalla prima validazione, un ingresso metro, cambi illimitati su surface. **Carnet 10** — per viaggi saltuari. **Abbonamento settimanale/mensile** — senza limite tempo su rete inclusa; prezzi su atm.it (soft: mensile urbano ordinario spesso **~€35–42**, annuale **~€330–350** — **verificare PDF**).",
    ],
    bullets: [
      "App ATM Milano — biglietti, abbonamenti, real-time ([store ATM official app](https://www.atmmilano.it/it)).",
      "Tessera digitale o fisica — stesso abbonamento.",
      "Contactless — solo linee ATM, non treni oltre confine urbano.",
      "M4 — collegamento Linate / Forlanini.",
      "Senior/residenti Città Metropolitana — agevolazioni su atm.it.",
      "Multe — controller senza biglietto valido; sanzioni da tariffario.",
    ],
  },
  {
    heading: "Trenord, Como e Monza: extraurbano da Milano",
    section_kind: "official",
    paragraphs: [
      "**Trenord** collega Milano Centrale / Cadorna / Porta Garibaldi con **Monza**, **Como**, **Bergamo**, Malpensa. Abbonamento **urbano ATM** copre tratte **urbane** Trenord e linee S nel passante — per **Como centro** spesso serve **più zone** (Mi4+); calcolate sul sito ATM/Trenord.",
      "Relocant в **Como** o **Monza Brianza** живут на satellite **italy.emigro.online**, но **ticket integrato** зависит от comune di residenza — см. [районы Como/Monza](/notes/" +
        RAJONY_SLUG +
        "). Pendolari: abbonamento interurbano costa più dell'urbano puro.",
      "Malpensa Express — tariffa aeroportuale separata da abbonamento urbano ordinario (soft).",
    ],
    bullets: [
      "Como Lago — linea Milano–Como; tempo ~1h da Centrale.",
      "Monza — frequenza alta; utile per sportelli Entrate/Questura Monza.",
      "Zone Mi4–Mi6 — per stazioni oltre Mi3.",
      "Orari — trenord.it + app Trenord.",
      "Bike + Trenord — regole bici a bordo su sito.",
      "Notte — bus notturni ATM limitati; taxi/ride dopo metro chiusa.",
    ],
  },
  {
    heading: "Milano без машины: практика недели 1–8",
    section_kind: "practice",
    paragraphs: [
      "Первые **1–2 mesi** большинство RU relocant в Milano **не нуждаются в auto**: metro + tram закрывают lavoro co-working, Questura, Entrate, spesa. Выберите жильё в **15–25 min metro** от ваших uffici — см. [районы](/notes/" +
        RAJONY_SLUG +
        ") и [аренда](/notes/" +
        ARENDA_SLUG +
        ").",
      "**Settimana 1:** contactless o app ATM с MXP/LIN; не покупайте annuale до понимания commute. **Mese 2:** если commute ежедневный — abbonamento mensile urbano (prezzo su atm.it). **Como weekend:** biglietto zone calculator, не «urbano» alone.",
      "Bici **BikeMi** — alternativa tram; casc obbligatorio soft. Scooter elettrici — regole comune.",
    ],
    bullets: [
      formatPracticeBullet({
        channels: ["milanru", "milan_4at"],
        period: "2025–2026",
        claim:
          "relocant M1/M2 Porta Romana–Loreto жили без auto 4+ mesi; abbonamento mensile urbano через app ATM",
        forReader: "auto — mes 4–6+, не settimana 1",
      }),
      "ZTL Area C — multe auto senza permesso.",
      "Parcheggio garage — €150–350/mese centro soft.",
      "LIN bus 73 — economico vs taxi.",
      "Night life — last metro ~00:30 soft, check ATM.",
      "[Первые 30 дней](/notes/" + PERVYE_30_SLUG + ") — MXP transfer.",
    ],
  },
  {
    heading: "Жить с детьми и commute: карта зон на практике",
    section_kind: "practice",
    paragraphs: [
      "Scuola в другом municipio → abbonamento **interurbano**. Due genitori — valutate carnet vs mensile. Annuale con rate — solo se restate ≥10 mesi; altrimenti mensile flessibile.",
      "Integrazione **Rho Fiera / Assago** — abbonamento urbano ordinario **non** copre (atm.it note); servono integrazioni.",
    ],
    bullets: [
      "Calcolatore tariffa ATM — prima di firmare contratto in Mi4.",
      "Trenord strike — soft sporadici; backup bus ATM.",
      "Studenti <26 — agevolazioni atm.it.",
      "Famiglia — carnet condiviso non trasferibile.",
      "Como scuola ≠ ticket Milano urbano.",
    ],
  },
  {
    heading: "К 4–6 месяцу: auto, patente e costi nascosti",
    section_kind: "gap",
    paragraphs: [
      "К **4–6 месяцу** часть relocant покупает/арендует auto — но senza patente valida o assicurazione RC **multe e sequestro**. ZTL e Area C генерируют bollettini postali mesi dopo.",
      "Import auto RU — dogana, omologazione, costi alti; leasing IT richiede CF, permesso, storico creditizio ([bank IBAN](/notes/bank-iban-nerezident-italiya-2026)). Senza patente UE — ripetizione esame MIT.",
    ],
    bullets: [
      "Noleggio lungo termine — contratto 24–36 mesi + assicurazione.",
      "Bollo auto — pagamento annuale ACI/regione.",
      "Telepass — pedaggi autostrade.",
      "Parcheggio residenti — richiede residenza Comune.",
      "Multe ZTL — €80+ soft, maggiorazione se tardiva.",
      "Patente scaduta — non guidare; conversione tempi variabili.",
    ],
  },
  {
    heading: "Официально: patente, ZTL e autostrade (вторая половина гайда)",
    section_kind: "official",
    paragraphs: [
      "**Patente di guida:** cittadini extra-UE — patente nazionale + traduzione/certificazione; scadenza soggiorno breve spesso **1 anno** per uso patente estera, poi **conversione o esame** ([MIT](https://www.mit.gov.it/)). Paesi con accordi — procedura semplificata; RU — verificare listino MIT aggiornato.",
      "**ZTL / Area C Milano:** accesso limitato centro; telecamere. Permesso residenti dopo **residenza anagrafica**. **Autostrade** — pedaggio; Telepass o biglietto.",
      "**Car sharing / noleggio:** utile per weekend Como/Garda senza proprietà; patente e carta credito.",
    ],
    bullets: [
      "Scuola guida — se esame necessario.",
      "Assicurazione RC — obbligatoria.",
      "Revisione auto — periodica per veicoli IT.",
      "Pedaggi — autostrade.it info.",
      "Neve — catene obbligatorie soft in Appennini/Alpi.",
      "EV — colonnine crescenti; no Porto-style toll myth.",
    ],
  },
  {
    heading: "Типичные ошибки транспорта в Milano",
    section_kind: "practice",
    paragraphs: [
      "Nord relocant повторяют одни ошибки в первые mesi.",
    ],
    bullets: [
      "Ошибка: annuale abbonamento в неделю 1 — потом переезд в Mi4 comune.",
      "Ошибка: urbano ticket su treno per Como — multa Trenord.",
      "Ошибка: macchina in centro senza ZTL permesso.",
      "Ошибка: guidare con patente scaduta «пока не проверят».",
      formatPracticeBullet({
        channels: ["milan_4at"],
        period: "2025–2026",
        claim: "taxi MXP–centro €90+ vs Malpensa Express + metro ~€15 soft",
        forReader: "аэропорт — train first",
      }),
      "Ошибка: копировать tariffa Lisbon metro — STIBM zones.",
    ],
  },
  {
    heading: "Wizard и Assist",
    section_kind: "practice",
    paragraphs: [
      "Выбор comune (Milano vs Como) влияет на transport budget — [Wizard Italia](/ru/italy/wizard?utm_source=emigro&utm_medium=guide&utm_campaign=transport-milano&utm_content=" +
        TRANSPORT_MILANO_SLUG +
        "). Сложный кейс relocation family + commute — [Assist Route Check](/ru/assist?utm_source=emigro&utm_medium=guide&utm_campaign=transport-milano&utm_content=" +
        TRANSPORT_MILANO_SLUG +
        ").",
    ],
    bullets: [
      "[VNJ track](/notes/" + VNJ_SLUG + ") — permesso e residenza.",
      "[Районы metro](/notes/" + RAJONY_SLUG + ").",
      "[Аренда](/notes/" + ARENDA_SLUG + ").",
    ],
  },
];

const keyTakeaways = [
  "Официально: ATM + STIBM Mi1–Mi3 для жизни в Milano без auto; тарифы — atm.it PDF, не фиксируем € 2026.",
  "Официально: Trenord для Como/Monza; abbonamento urbano не всегда покрывает extraurbano — calcolatore zone.",
  formatPracticeTakeaway({
    channels: ["milanru", "milan_4at"],
    period: "2025–2026",
    claim: "первые 1–2 mesi relocant обходились metro/tram + app ATM без auto",
    forReader: "MXP/LIN — train/bus; taxi exception",
  }),
  "На практике: к 4–6 месяцу auto без patente/ZTL/RC создаёт multe; patente — MIT, не consolato.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Можно ли жить в Milano без машины?",
    a: "По правилам ATM/STIBM покрывают city + metro area. На практике большинство relocant первые 1–2 mesi используют metro/tram e Trenord; auto — опция к 4–6 mes.",
  },
  {
    q: "Сколько стоит abbonamento mensile ATM 2026?",
    a: "По правилам цены публикуются на atm.it и PDF TARIFFE. На практике urbano ordinario Mi1–Mi3 часто в soft range ~€35–42/mese — UNCHECKED exact €; сверяйте atm.it.",
  },
  {
    q: "Как доехать из MXP в centro?",
    a: "По правилам Malpensa Express (Trenord) + metro M1/M2. На практике contactless ATM + train economico vs taxi €80–100 soft.",
  },
  {
    q: "Достаточно ли urbano abbonamento для Como?",
    a: "По правилам Como обычно fuori Mi3 — servono più zone o biglietto Trenord. На практике calcolatore ATM prima del pendolarismo.",
  },
  {
    q: "Нужна ли итальянская patente?",
    a: "По правилам MIT — patente estera временно, poi conversione o esame per soggiorno lungo. На практике guidare senza validità — multe e sequestro.",
  },
];

export const TRANSPORT_MILANO_GUIDE = {
  slug: TRANSPORT_MILANO_SLUG,
  category: "Транспорт",
  content_kind: "guide" as ContentKind,
  title: "Транспорт Milano 2026: ATM metro, Trenord Como и patente",
  excerpt:
    "ATM metro e tram Milano 2026: STIBM zone Mi1–Mi3, app ATM, MXP/LIN, Trenord verso Como e Monza. Prima metà — senza auto; seconda — patente MIT, ZTL, noleggio. Tariffe soft range + atm.it.",
  seo_title: "Транспорт Milano ATM Trenord 2026 Италия",
  seo_description:
    "Metro ATM e Trenord Milano 2026: abbonamento Mi1–Mi3, MXP/LIN, Como Monza STIBM. Senza auto 1–2 mesi; patente MIT e ZTL к 4–6 mes. Tariffe su atm.it.",
  quick_answer:
    "В Milano первые 1–2 месяца можно жить без машины: ATM (metro M1–M5, tram, bus) и STIBM zone Mi1–Mi3, abbonamento mensile urbano — цены на atm.it (soft ~€35–42/mese, UNCHECKED exact 2026). MXP — Malpensa Express + metro; LIN — bus/tram. Trenord ведёт в Monza и Como; urbano ticket не всегда покрывает extraurbano — calcolatore ATM. К 4–6 месяцу часть покупает auto: нужны patente (MIT), RC, учёт ZTL Area C. Не копируйте тарифы Lisboa/Porto.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "ATM — abbonamenti e tariffe", url: "https://www.atm.it/it/ViaggiaConNoi/Abbonamenti/Pagine/Tipologie.aspx" },
    { title: "PDF TARIFFE ATM", url: "https://www.atm.it/it/ViaggiaConNoi/Documents/TARIFFE%20ATM.pdf" },
    { title: "Trenord", url: "https://www.trenord.it/" },
    { title: "MIT — mobilità e patente", url: "https://www.mit.gov.it/" },
    { title: "Ministero dell'Interno", url: "https://www.interno.gov.it/" },
  ],
  topic_tags: ["transport", "atm", "milano", "trenord"],
  hashtags: buildNoteHashtags({
    topicTags: ["transport", "atm", "milano", "trenord"],
    contentKind: "guide",
    extra: ["metro", "patente", "satellite"],
  }),
  source_channel: "milanru+forum_italy+milan_4at",
  source_label: "editorial:italy-seed",
};

export default TRANSPORT_MILANO_GUIDE;
