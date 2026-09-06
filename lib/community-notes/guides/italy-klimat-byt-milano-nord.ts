/**
 * Hand-curated Italy satellite guide — climate, housing rhythm Milano / Nord (Como, Bergamo).
 * Comune Milano / Regione Lombardia sources separated from expat field practice.
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import {
  formatPracticeBullet,
  formatPracticeTakeaway,
} from "@/lib/community-notes/practice-format";
import type { CommunityNoteFaq, ContentKind, GlossaryTerm, NoteBodySection } from "@/lib/community-notes/types";

export const KLIMAT_MILANO_SLUG = "klimat-byt-milano-nord-como-2026";

const PERVYE_30_SLUG = "pervye-30-dnej-v-italii-satelit-2026";
const ARENDA_SLUG = "arenda-milano-idealista-2026";
const RAJONY_SLUG = "milano-rajony-arenda-metro-como-2026";
const SIM_LUCE_SLUG = "sim-internet-luce-milano-2026";

const GLOSSARY: GlossaryTerm[] = [
  { pt: "Riscaldamento centralizzato", ru: "общедомовое отопление condominio; сезон и часы по закону, не по желанию жильца" },
  { pt: "Riscaldamento autonomo", ru: "индивидуальный котёл в квартире; те же сезонные лимиты, но контроль внутри" },
  { pt: "Spese condominiali", ru: "квитанция за отопление и управление домом — часто surprise к первой зиме" },
  { pt: "Umidità / muffa", ru: "влажность и плесень; multifattoriale — вентилляция + isolamento" },
  { pt: "Classe energetica (APE)", ru: "энергетический класс квартиры; влияет на bill e comfort" },
  { pt: "Condizionatore (AC)", ru: "кондиционер; split часто требует согласования condominio" },
  { pt: "Domenica chiuso", ru: "воскресенье: крупные магазины центра открыты, мелкие family-run — часто закрыты" },
  { pt: "Lago di Como / Lecco / Bergamo", ru: "weekend-geo Nord без фестивального гида — поезд + прогулка" },
];

const DISCLAIMER =
  "**Emigro — не юридическая conсультация.** Calendario riscaldamento и ordini sindacali **меняются** ежегодно. Актуально — [comune.milano.it calendario riscaldamento](https://www.comune.milano.it/en/argomenti/ambiente-e-animali/calendario-di-accensione-degli-impianti-di-riscaldamento). Satellite Milano + Nord (Como, Lecco, Bergamo); не Valencia mediterráneo guide.";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(
      GLOSSARY,
      "Riscaldamento, muffa и «магазины всегда открыты» — слова из @milanru до первой зимы в Navigli или у озера Como."
    ),
    paragraphs: [DISCLAIMER],
  },
  {
    heading: "Nota Emigro (fact-check)",
    section_kind: "official",
    paragraphs: [
      "Clima abitativo e ritmo settimanale — Comune Milano / Regione Lombardia; pratica affitto — soft chats. **OK** = fetch; **UNCHECKED** = no verificato.",
    ],
    bullets: [
      "OK: stagione riscaldamento Milano 2025/2026 — **15 ottobre – 15 aprile**, max **13 ore/giorno** 05:00–23:00, temperatura max **19°C +2°C** tolleranza ([Comune Milano calendario](https://www.comune.milano.it/en/argomenti/ambiente-e-animali/calendario-di-accensione-degli-impianti-di-riscaldamento)).",
      "OK: base normativa orari commerciali — liberalizzazione **D.L. 201/2011** art. 31: niente obbligo chiusura domenicale/festiva nazionale ([Corte Costituzionale scheda](https://www.cortecostituzionale.it/actionSchedaPronuncia.do?param_ecli=ECLI%3AIT%3ACOST%3A2013%3A124) — ius superveniens).",
      "OK: muffa in condominio — fenomeno **multifattoriale**; ponti termici strutturali vs aerazione inadeguata (giurisprudenza art. 2051 c.c. — soft, non statuto).",
      "Soft: ~95% flats Milano area centralizzato — cicli mattina/sera; autonomo ~5% (@forum_italy field).",
      "Soft: umidità inverno + condensa su vetri single-glazing — pratica expat, non dato Comune.",
      "UNCHECKED: bolletta luce AC estate 70 m² orientamento est — dipende APE e isolamento.",
      "UNCHECKED: exact orari Esselunga/Coop domenica per ogni store — verificare sito punto vendita.",
    ],
  },
  {
    heading: "Официально: riscaldamento condominio в Milano",
    section_kind: "official",
    paragraphs: [
      "Milano (zona climatica **E**) — riscaldamento centralizzato включается **не раньше 15 ottobre** и выключается **не позже 15 aprile** ([Comune Milano](https://www.comune.milano.it/en/argomenti/ambiente-e-animali/calendario-di-accensione-degli-impianti-di-riscaldamento)). Вне сезона — только при eccezionali ordini sindacali, max metà ore giornaliere.",
      "Limite temperatura: **19°C + 2°C** tolleranza in appartamento (18°C attività industriali). Durata giornaliera max **13 ore** (05:00–23:00). **Non potete** accendere caldaia centralizzata fuori calendario — amministratore programma centralina.",
      "Riscaldamento **autonomo** — stessi limiti legali, ma potete tenere minimo 16°C nelle ore «spente» se termostato programmato (Regione Lombardia XI/3502 — soft). In [аренде](/notes/" + ARENDA_SLUG + ") chiedete: centralizzato o autonomo, APE classe, ultimo bollettino spese condominiali.",
      "Como, Bergamo, Monza — **stessa** stagione Lombardia; weekend fuori Milano non cambiano regole riscaldamento del vostro contratto.",
    ],
    bullets: [
      "Centralizzato — due cicli tipici 5–11 e 17–24 (soft).",
      "Valvole termostatiche — obbligatorie per legge.",
      "Spese condominiali — riscaldamento quota maggiore inverno.",
      "Fuori stagione aprile–ottobre — niente riscaldamento salvo eccezioni.",
      "Pavimento radiante — assemblea condominiale decide (soft).",
    ],
  },
  {
    heading: "Umidità, muffa и AC: mesi 1–6 in appartamento",
    section_kind: "practice",
    paragraphs: [
      "Mes 1–2 (settembre–novembre): clima mite, riscaldamento off — umidità interna può salire. Mes 3–4 (dicembre–gennaio): **prima stagione riscaldamento** — sorpresa bolletta spese condominiali e aria secca o freddo nelle ore off-cycle.",
      "**Muffa:** aerate bagno post-doccia, accendete aspiratore, non stendete panni in stanza chiusa. Manchie >30 cm — comunicate landlord; ponti termici in facciata possono essere responsabilità condominio (art. 2051 c.c. — **soft**, caso per caso).",
      "**Estate (mes 5–6, giugno–agosto):** caldo umido Milano; molti flats **senza AC**. Contratto: chi installa split? Condominio può richiedere autorizzazione facciata. Consumo luce — vedi [luce/SIM](/notes/" + SIM_LUCE_SLUG + ").",
      "Prima di firmare in [Como/Lecco](/notes/" + RAJONY_SLUG + "): visitate dopo pioggia, controllate angoli nord e cantina.",
    ],
    bullets: [
      formatPracticeBullet({
        channels: ["milanru", "forum_italy"],
        period: "2025–2026",
        claim:
          "piano terra Navigli senza ventilazione sviluppò muffa armadi mes 4–5; deumidificatore aiutò",
        forReader:
          "visitate dopo pioggia; chiedete APE e spese condominiali ultimo anno",
      }),
      "Deumidificatore — 150–300 € acquisto (soft).",
      "Split AC — permesso condominio facciata.",
      "Doppi vetri — riducono condensa e rumore.",
      "Assicurazione casa — danni acqua; foto ingresso.",
    ],
  },
  {
    heading: "Недельный ритм: магазины, банки, pausa pranzo",
    section_kind: "practice",
    paragraphs: [
      "После **D.L. 201/2011** нет nationwide obbligo chiusura domenicale — каждый operator decide. **Milano centro** (Duomo, Corso Buenos Aires, centri commerciali): Esselunga, Coop, La Rinascente, Coin часто **aperti domenica** ~10:00–20:00 (soft: check store locator).",
      "**Quartieri residenziali** e botteghe family-run — чаще **chiuso domenica** e sometimes **lunedì mattina**. Mercato rionale — sabato mattina; supermercato domenica sera для meal prep недели.",
      "Banche — lun–ven ~8:30–13:30 + pomeriggio ridotto; **chiuso weekend**. Ristoranti — pranzo 12:30–14:30, cena da 19:30; не «all day brunch» как в UK.",
      "Agosto — molte attività family chiudono **ferie**; planificate spesa e riparazioni до или после. К **4–6 месяцу** вы уже знаете, какой Esselunga/Coop открыт в ваше воскресенье.",
    ],
    bullets: [
      "Centro — shopping domenica sì (grandi chain).",
      "Periferia — spesso chiuso domenica (soft).",
      "Lunedì mattina — piccoli negozi chiusi.",
      "Pausa pranzo — uffici Comune/Entrate 13:00–14:30.",
      "Festivi nazionali — 1 maggio, 15 agosto, 25 dicembre: quasi tutto chiuso.",
      "San Ambrogio 7 dicembre — festivo **solo Milano**.",
    ],
  },
  {
    heading: "Weekend Nord: Como, Lecco, Bergamo — без фестивального гида",
    section_kind: "practice",
    paragraphs: [
      "К **4–6 месяцу** короткие поездки снимают стресс Milano: **Como** — treno da Milano Centrale ~40 min, lungolago passeggiata, funicolare Brunate (soft orari). **Lecco** — 40–50 min, Lago di Como ramo orientale, sentieri facili.",
      "**Bergamo** — Città Alta funicolare o bus, mura venete, pranzo trattoria; treno ~1 h da Centrale. Не нужен «wine festival guide» — достаточно biglietto Trenord/Italo + comfortable shoes.",
      "Inverno: lago spesso grigio ma camminata valida; estate: affollato weekend — partenza mattina presto. Stesso abbonamento/IO vedi [районы и metro](/notes/" + RAJONY_SLUG + ").",
    ],
    bullets: [
      "Como — Trenord frequente da Centrale/Porta Garibaldi.",
      "Lecco — stessa linea S7/S8 soft.",
      "Bergamo Alta — biglietto funicolare ATB.",
      "Evitare solo auto — ZTL e parcheggi costosi.",
      "Weekend pioggia — musei Bergamo o Brera restano a Milano.",
    ],
  },
  {
    heading: "К 4–6 месяцу: что всплывает в быту",
    section_kind: "gap",
    paragraphs: [
      "К **4–6 месяцу** (~ novembre–febbraio o giugno–agosto) типичные сюрпризы: **prima bolletta riscaldamento** in spese condominiali, **muffa** scoperta dopo autunno piovoso, **AC mancante** in ondata caldo, **negozio chiuso domenica** quando finito cibo.",
      "Chi arriva in settembre spesso sottostima inverno umido Milano — non è Nord Europa isolato; edifici pre-1970 perdono calore. Chi resta per estate scopre che notte tropicale senza AC altera sonno e produttività.",
      "Non rimandare acquisto deumidificatore o ventilatori «a dicembre» se muffa compare a **mese 4**.",
    ],
    bullets: [
      "Mese 4–5 inverno — spese condo + condensa.",
      "Mese 5–6 estate — AC assente, finestra sud.",
      "Domenica chiuso — stock venerdì/sabato.",
      "Agosto ferie — riparatore idraulico assente.",
      "Como weekend — reset mentale cheap treno.",
    ],
  },
  {
    heading: "Типичные ошибки быта в Milano",
    section_kind: "practice",
    paragraphs: [
      "Ошибки: aprire tutte finestre a febbraio di notte e lamentarsi freddo alle 5:00; ignorare APE in affitto; AC install senza condominio; aspettare supermercato domenica in periferia.",
    ],
    bullets: [
      "Ошибка: «riscaldamento come a casa» — calendario legge, 13 h/giorno.",
      "Ошибка: non aerare in inverno — muffa armadi mes 4–6.",
      "Ошибка: affitto senza vedere dopo pioggia — infiltrazioni.",
      "Ошибка: domenica solo piccolo negozio quartiere — chiuso.",
      "Ошибка: AC portatile senza tubo finestra — inefficace + rumore.",
      "Ошибка: confondere clima Como lago con Milano heat island — differenza 2–3°C soft.",
      formatPracticeBullet({
        channels: ["milan_4at"],
        period: "2025–2026",
        claim: "relokanty scoprirono spese condominiali riscaldamento solo a dicembre — €200+ mensili",
        forReader: "chiedete ultimo rendiconto condo prima firma contratto",
      }),
    ],
  },
  {
    heading: "Wizard и Assist",
    section_kind: "practice",
    paragraphs: [
      "Clima abitativo пересекается с [арендой](/notes/" + ARENDA_SLUG + ") и [первыми 30 днями](/notes/" + PERVYE_30_SLUG + "). Маршрут visto + budget — [Emigro Wizard Italia](/ru/italy/wizard?utm_source=emigro&utm_medium=guide&utm_campaign=klimat-byt-milano&utm_content=" +
        KLIMAT_MILANO_SLUG +
        "). Спор с landlord по muffa/spese — [Route Check Assist €129](/ru/assist?utm_source=emigro&utm_medium=guide&utm_campaign=klimat-byt-milano&utm_content=" +
        KLIMAT_MILANO_SLUG +
        ").",
    ],
    bullets: [
      "[Районы Milano/Como](/notes/" + RAJONY_SLUG + ") — dove abitare.",
      "[Idealista affitto](/notes/" + ARENDA_SLUG + ") — APE e spese.",
      "[Luce e utenze](/notes/" + SIM_LUCE_SLUG + ") — bollette estate.",
    ],
  },
];

const keyTakeaways = [
  "Официально: riscaldamento Milano 15 ott–15 apr, max 13 h/d, 19°C+2°C (Comune Milano calendario 2025/2026).",
  formatPracticeTakeaway({
    channels: ["milanru", "forum_italy"],
    period: "2025–2026",
    claim: "к 4–6 месяцу всплывают spese condo riscaldamento, muffa o caldo senza AC",
    forReader: "visitate affitto dopo pioggia; stock domenica venerdì; Como treno weekend",
  }),
  "Официально: domenica apertura liberalizzata D.L. 201/2011 — centro sì, periferia spesso no.",
  "Weekend Nord: Como/Lecco/Bergamo treno — geo satellite, non festival guide.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Когда включают отопление в Milano?",
    a: "По правилам — 15 ottobre – 15 aprile, max 13 ore al giorno, 19°C+2°C (Comune Milano 2025/2026). На практике centralizzato accende amministratore; fuori ore apartment può raffreddarsi.",
  },
  {
    q: "Плесень в квартире — вина арендодателя?",
    a: "По правилам — dipende: ponti termici strutturali possono essere condominio (art. 2051 c.c. soft). На практике scarsa aerazione aggravates; documentate e comunicate landlord a mes 4–6.",
  },
  {
    q: "Магазины открыты в воскресенье?",
    a: "По правилам — niente obbligo chiusura (D.L. 201/2011). На практике centro Milano e grandi chain sì ~10–20; botteghe quartiere spesso chiuse.",
  },
  {
    q: "Нужен ли кондиционер к лету 4–6 месяца?",
    a: "По правилам — non obbligatorio in affitto. На практике giugno–agosto Milano caldo-umido; verificate AC in contratto o split con permesso condo.",
  },
  {
    q: "Куда на выходные из Milano без машины?",
    a: "По правилам — treni regionali Trenord. На практике Como ~40 min, Lecco, Bergamo Alta — passeggiata + pranzo; partenza mattina.",
  },
];

export const KLIMAT_MILANO_GUIDE = {
  slug: KLIMAT_MILANO_SLUG,
  category: "Быт и климат",
  content_kind: "guide" as ContentKind,
  title: "Климат и быт Milano Nord: riscaldamento, muffa, ритм 2026",
  excerpt:
    "Riscaldamento Milano 2026: calendario Comune, muffa, AC estate, domenica negozi chiusi/aperti. Weekend Como, Lecco, Bergamo treno. Cosa emerge a mes 4–6 nel satellite Nord.",
  seo_title: "Климат быт Milano 2026 — riscaldamento Como Nord",
  seo_description:
    "Климат жилья Milano 2026: riscaldamento 15 ott–15 apr, muffa, AC estate. Воскресенье магазины, ритм Lombardia. Weekend Como, Lecco, Bergamo. Быт к 4–6 месяцу Nord.",
  quick_answer:
    "В Milano отопление **centralizzato** по закону: **15 октября – 15 апреля**, max **13 ч/день**, **19°C+2°C** ([Comune Milano](https://www.comune.milano.it/en/argomenti/ambiente-e-animali/calendario-di-accensione-degli-impianti-di-riscaldamento)). К **4–6 месяцу** всплывают spese condominiali, **muffa** (ventilazione + isolamento) и жара **без AC**. Воскресенье: крупные магазины **центра** открыты (D.L. 201/2011), мелкие в районах — часто закрыты. Weekend **Como/Lecco/Bergamo** — поезд ~40–60 мин. Проверяйте APE при [аренде](/notes/arenda-milano-idealista-2026).",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    {
      title: "Comune Milano — calendario riscaldamento",
      url: "https://www.comune.milano.it/en/argomenti/ambiente-e-animali/calendario-di-accensione-degli-impianti-di-riscaldamento",
    },
    {
      title: "Corte Costituzionale — liberalizzazione orari (D.L. 201/2011)",
      url: "https://www.cortecostituzionale.it/actionSchedaPronuncia.do?param_ecli=ECLI%3AIT%3ACOST%3A2013%3A124",
    },
  ],
  topic_tags: ["clima", "riscaldamento", "milano", "como"],
  hashtags: buildNoteHashtags({
    topicTags: ["clima", "riscaldamento", "milano"],
    contentKind: "guide",
    extra: ["muffa", "condominio", "satellite"],
  }),
  source_channel: "milanru+forum_italy+milan_4at",
  source_label: "editorial:italy-seed",
};

export default KLIMAT_MILANO_GUIDE;
