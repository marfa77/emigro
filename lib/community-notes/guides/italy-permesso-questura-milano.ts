/**
 * Hand-curated Italy satellite guide — permesso di soggiorno / Questura Milano.
 * Kit postale and 8-day rule kept inside the Italy migration track.
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import {
  formatPracticeBullet,
  formatPracticeTakeaway,
} from "@/lib/community-notes/practice-format";
import type { CommunityNoteFaq, ContentKind, GlossaryTerm, NoteBodySection } from "@/lib/community-notes/types";

export const PERMESSO_QUESTURA_SLUG = "permesso-questura-milano-2026";

const CODICE_FISCALE_SLUG = "codice-fiscale-milano-2026";
const PERVYE_30_SLUG = "pervye-30-dnej-v-italii-satelit-2026";
const BANK_SLUG = "bank-iban-nerezident-italiya-2026";
const SIM_LUCE_SLUG = "sim-internet-luce-milano-2026";
const ARENDA_SLUG = "arenda-milano-idealista-2026";

const GLOSSARY: GlossaryTerm[] = [
  { pt: "Permesso di soggiorno", ru: "разрешение на пребывание >90 дней для extra-UE" },
  { pt: "Questura", ru: "миграционная полиция provincia; Milano — Ufficio Immigrazione" },
  { pt: "Kit postale", ru: "жёлтый комплект MOD.209 для подачи через Poste Sportello Amico" },
  { pt: "Sportello Amico", ru: "отделение Poste Italiane, принимающее kit permesso" },
  { pt: "Ricevuta postale", ru: "квитанция подачи; действует до выдачи plastica" },
  { pt: "Nulla osta", ru: "разрешение на работу/въезд; часть track lavoro subordinato" },
  { pt: "Schengen 90/180", ru: "краткое пребывание без permesso; ≠ статус резидента" },
  { pt: "Decreto Flussi", ru: "квоты на рабочие визы; отдельно от nomade digitale" },
];

const DISCLAIMER =
  "**Emigro — не юридическая консультация.** Сроки Questura, codici motivo и список Sportello Amico **меняются**. Сверяйте [portaleimmigrazione.it](https://www.portaleimmigrazione.it/) и [poste.it](https://www.poste.it/guida-rilascio-e-rinnovo-permesso-di-soggiorno). Не копируйте формы и порталы другого государства.";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(
      GLOSSARY,
      "Слова из kit giallo, ricevuta Poste и SMS Questura — чтобы не путать permesso с Schengen stamp или с «cita extranjería» из Valencia."
    ),
    paragraphs: [DISCLAIMER],
  },
  {
    heading: "Nota Emigro (fact-check)",
    section_kind: "official",
    paragraphs: [
      "Italy-track, не Spain PT. OK/soft/fixed ниже.",
    ],
    bullets: [
      "OK: extra-UE после regolare ingresso с visto должны chiedere permesso al Questore **entro otto giorni lavorativi** dall'ingresso ([portaleimmigrazione.it](https://www.portaleimmigrazione.it/ITA/nuovaProcedura.html)).",
      "OK: многие tipologie permesso подаются через **kit a banda gialla** в Ufficio Postale **Sportello Amico**, busta aperta ([Poste Italiane guida](https://www.poste.it/guida-rilascio-e-rinnovo-permesso-di-soggiorno)).",
      "OK: rinnovo — almeno **60 giorni prima** scadenza permesso (stessa fonte).",
      "Fixed: «Schengen 90 дней = можно жить полгода» → 90/180 — turismo; permesso/visto D — другой контур.",
      "Fixed: чужой карточный appointment → в Italia kit postale + convocazione Questura.",
      "Fixed: чужой migration portal → в Italia применяют kit giallo Poste или direct Questura по motivo.",
      "Soft: Questura Milano convocazione для rilievi — недели после ricevuta; адрес Ufficio Immigrazione проверьте на poliziadistato.it / comune, не копируйте старые посты.",
      "Soft: nomade digitale / remote worker — Decreto 29 febbraio 2024, GU n. 79 del 4 aprile 2024; visto D + permesso по codice dedicato, не elective residence.",
      "UNCHECKED: точный codice motivo на kit для вашего visto (lavoro, famiglia, studio, nomade) — таблица Poste обновляется; сверьте PDF guida Poste перед compilazione.",
      "UNCHECKED: URL `integrazionemigrati.gov.it/.../Il-permesso-di-soggiorno` вернул server error 500 при WebFetch 06.09.2026; утверждение про SUI подтверждено также живой страницей Poste, но сам URL оставлен как требующий повторной проверки.",
    ],
  },
  {
    heading: "Официально: permesso, Questura и kit postale",
    section_kind: "official",
    paragraphs: [
      "Permesso di soggiorno документирует право пребывания свыше 90 дней для cittadini extra-UE. После въезда по visto nazionale (lavoro, famiglia, studio, elective residence, nomade digitale и др.) обязанность подать istanza в **8 giorni lavorativi** — не календарных.",
      "Для tipologie из списка Poste/Interno istanza компилируется kit **MOD.209** (modulo 1 + 2), оплачивается bollettino, документы вкладываются в **busta aperta** и сдаются в Sportello Amico **лично** — только interessato с passaporto.",
      "Poste выдаёт ricevuta; Questura convoca на rilievi fotodattiloscopici. Если agenda занята — convocazione raccomandata позже ([portaleimmigrazione](https://www.portaleimmigrazione.it/ImmigrazioneNET/ITA/nuovaProcedura.html)).",
      "Некоторые motivi (asilo, cure mediche, часть familiare) подаются **direttamente in Questura** — не через kit postale. Проверьте таблицу motivi в guida Poste.",
    ],
    bullets: [
      "8 giorni lavorativi — от даты ingresso (timbratura passaporto).",
      "Kit giallo — Poste, Patronato или Comune abilitato (compilazione elettronica).",
      "Marca da bollo — tabaccheria; importo по tipo permesso.",
      "Fotocopie passaporto — pagine dati + visti.",
      "Ricevuta — храните до plastica; банк иногда принимает.",
      "Rinnovo 60 gg prima scadenza — тот же kit или Questura по motivo.",
    ],
  },
  {
    heading: "Schengen 90/180 ≠ permesso di soggiorno",
    section_kind: "official",
    paragraphs: [
      "Путаница №1 в @forum_italy: «я в Шенгене 90 дней, значит legal». **Schengen** регулирует краткое пребывание без национального permesso. **Visto D + permesso** — отдельный track после regolare ingresso.",
      "Turista с visto C не подаёт kit postale. Relocant с visto D/lavoro/famiglia **обязан** kit или Questura в 8 giorni. Просрочка — sanzione e difficoltà rinnovo (soft: размер штрафа UNCHECKED — сверяйте TUI art. 10 bis).",
      "Como, Bergamo, Monza — provincia Milano/Lombardia: Questura competente по **месту фактического soggiorno**, не «второй satellite».",
    ],
    bullets: [
      "90/180 — только turismo/visto C без permesso.",
      "Visto D — permesso entro 8 gg lavorativi.",
      "Ricevuta kit — не plastica, но доказывает подачу.",
      "Overstay без istanza — риск espulsione e multa.",
      "UE citizens — carta di soggiorno, не kit giallo extra-UE.",
    ],
  },
  {
    heading: "Milano: kit postale → Questura на практике",
    section_kind: "practice",
    paragraphs: [
      "Типичный track RU/BY с visto lavoro/famiglia/DNV после MXP:",
      "**Giorno 1–3:** codice fiscale ([AA4/8 guide](/notes/" + CODICE_FISCALE_SLUG + ")), SIM, жильё временное с возможностью dichiarare indirizzo.",
      "**Entro 8 gg lavorativi:** kit compilato → Sportello Amico Poste (elenco PDF на poste.it). Ricevuta + convocazione letter.",
      "**Settimane 2–8:** appuntamento Questura Ufficio Immigrazione — rilievi, indirizzo dimora; адрес проверьте на актуальной странице Questura Milano.",
      "**Mesi 2–4:** ritiro permesso elettronico по SMS/raccomandata.",
      "Patronato (INCA, ACLI и др.) — бесплатная помощь с kit через portale dedicato; получаете stampa cartacea + busta.",
      "Для типичного RU extra-UE с visto D сначала определите motivo: postalizzato → kit Sportello Amico; non postalizzato → Questura/PrenotaFacile по актуальной категории. Универсальной «cita» для всех permessi нет.",
    ],
    bullets: [
      formatPracticeBullet({
        channels: ["milanru", "forum_italy"],
        period: "2025–2026",
        claim:
          "после ricevuta Poste convocazione Questura Milano занимала от 2 до 8 settimane",
        forReader: "не откладывайте kit на giorno 7 — Sportello Amico может иметь очередь",
      }),
      "Sportello Amico — только passaporto titolare kit.",
      "Busta aperta — проверьте allegati по codice motivo.",
      "Indirizzo dimora — реальный, не только hotel se possibile.",
      "Como/Nord — Poste Sportello Amico в provincia; Questura Milano для provincia MI.",
    ],
  },
  {
    heading: "Motivi permesso: lavoro, famiglia, nomade, elective",
    section_kind: "official",
    paragraphs: [
      "**Lavoro subordinato** — часто nulla osta + Sportello Unico Immigrazione (SUI) Prefettura перед kit postale для primo rilascio ([integrazionemigranti.gov.it](https://integrazionemigrati.gov.it/it-it/Altre-info/e/4/o/5/id/1/Il-permesso-di-soggiorno)).",
      "**Lavoro autonomo / famiglia / studio** — codici motivo в kit; allegati по istruzioni MOD.209.",
      "**Nomade digitale / lavoratore remoto** — Decreto interministeriale 29/02/2024 (GU 79/04/04/2024): visto D fuori quota Flussi; requisiti reddito = **triplo** livello esenzione spesa sanitaria (OK формула в GU); **UNCHECKED** — точная сумма € на 2026 после indicizzazione annuale — сверяйте consolato.",
      "**Residenza elettiva** — passive income, **≠** nomade digitale; другой visto и motivo; не путать пороги reddito (elective: D.M. MAE 850/2011 — soft ~€31k singolo, UNCHECKED 2026 index).",
    ],
    bullets: [
      "Lavoro subordinato — SUI + kit postale по track datore.",
      "DNV — 6 mesi esperienza + assicurazione sanitaria + alloggio (decreto).",
      "Elective — reddito da pensione/rendite, non lavoro attivo in Italia.",
      "Studio — permesso studio; lavoro limitato ore.",
      "Conversione permesso — codice dedicato в kit.",
    ],
  },
  {
    heading: "Sportello Unico Immigrazione vs kit diretto",
    section_kind: "official",
    paragraphs: [
      "Primo rilascio permesso per **lavoro subordinato** con nulla osta: spesso passaggio obbligatorio presso **Sportello Unico Immigrazione (SUI)** della Prefettura — sportello consegna busta da presentare aperta in Poste ([integrazionemigrati.gov.it](https://integrazionemigrati.gov.it/it-it/Altre-info/e/4/o/5/id/1/Il-permesso-di-soggiorno)). Non saltate SUI se il vostro track datore lo richiede — kit compilato senza nulla osta viene respinto.",
      "Famiglia, studio, elective, nomade con visto già rilasciato dal consolato — tipicamente kit postale diretto entro 8 gg, salvo istruzioni diverse nel visto.",
    ],
    bullets: [
      "SUI Prefettura Milano — verificare convocazione datore.",
      "Nulla osta — documento datore/Prefettura.",
      "Kit dopo SUI — stessa procedura Sportello Amico.",
      "Visto familiare — kit con codice famiglia.",
    ],
  },
  {
    heading: "Documenti allegati al kit: cosa preparare",
    section_kind: "action_guide",
    paragraphs: [
      "Ogni codice motivo ha allegati diversi nel MOD.209. Prima di andare in Poste: leggere istruzioni nel kit giallo e tabella Poste aggiornata. Base comune: copia passaporto (pagine dati + visti), marca da bollo, fototessera formato tessera (soft), contratto locazione o dichiarazione ospitalità per indirizzo.",
      "Assicurazione sanitaria privata — obbligatoria per alcuni visti fino a SSN; tenere polizza attiva e copia in allegato se richiesto.",
    ],
    bullets: [
      "Marca da bollo — importo da tabella Poste per tipo permesso.",
      "Fototessera — formato permesso elettronico (soft).",
      "Contratto affitto registrato — per indirizzo dimora.",
      "Polizza sanitaria — copia valida territorio IT.",
      "Reddito — estratti conto per elective/DNV se richiesto in allegato.",
    ],
  },
  {
    heading: "Расхождение: 8 giorni vs очередь Questura",
    section_kind: "gap",
    paragraphs: [
      "Пропуск 8 giorni или потеря ricevuta кажется «исправимым», но к **4–6 месяцу** стекаются rinnovo contratto, banca domiciliazione и INPS. Permesso scaduto без rinnovo in corso — слабый профиль для employer и locatore.",
    ],
    bullets: [
      "Sin ricevuta — сложнее доказать soggiorno legale banca.",
      "Permesso scaduto — rischio multa e blocco rinnovo.",
      "Rinnovo dimenticato — 60 gg prima scadenza, не «в день expiry».",
      "Cambio indirizzo — comunicare Questura/Comune (soft).",
      "Копировать форму другого государства — wrong country, lost weeks.",
    ],
  },
  {
    heading: "Типичные ошибки permesso в Milano",
    section_kind: "practice",
    paragraphs: [
      "Questura Milano загружена; ошибки в kit чаще дороже, чем лишний визит Patronato.",
    ],
    bullets: [
      "Ошибка: считать 8 giorni календарными — только **lavorativi**.",
      "Ошибка: inviare kit chiuso — busta deve essere **aperta** in Sportello Amico.",
      "Ошибка: delegare подачу — только interessato identificato.",
      "Ошибка: DNV income «€28k» без проверки consolato — UNCHECKED indexed amount.",
      "Ошибка: elective residence documents для nomade kit — wrong codice motivo.",
      formatPracticeBullet({
        channels: ["digital_nomad_Italiya"],
        period: "2025–2026",
        claim: "участники путали visto turistico Schengen с permesso после visto D",
        forReader: "timbratura passaporto + visto D = старт отсчёta 8 giorni",
      }),
      "Ошибка: ждать plastica для banca — ricevuta + CF часто достаточны (soft).",
    ],
  },
  {
    heading: "Wizard и Assist",
    section_kind: "practice",
    paragraphs: [
      "Visto D, DNV, lavoro или famiglia — разные kit и allegati. [Emigro Wizard Italia](/ru/italy/wizard?utm_source=emigro&utm_medium=guide&utm_campaign=permesso-questura-milano&utm_content=" +
        PERMESSO_QUESTURA_SLUG +
        ") сопоставит track. [Assist €129](/ru/assist?utm_source=emigro&utm_medium=guide&utm_campaign=permesso-questura-milano&utm_content=" +
        PERMESSO_QUESTURA_SLUG +
        ") — аудит 8 giorni и codice motivo.",
    ],
    bullets: [
      "[Codice fiscale](/notes/" + CODICE_FISCALE_SLUG + ") — параллельно kit.",
      "[30 дней orchestrator](/notes/" + PERVYE_30_SLUG + ").",
      "[Банк](/notes/" + BANK_SLUG + ") — ricevuta permesso в KYC.",
    ],
  },
];

const keyTakeaways = [
  "Официально: permesso entro 8 giorni lavorativi; kit postale Sportello Amico для многих motivi; rinnovo 60 gg prima scadenza.",
  formatPracticeTakeaway({
    channels: ["milanru", "forum_italy"],
    period: "2025–2026",
    claim: "Milano track: kit Poste в первую неделю → ricevuta → convocazione Questura → plastica через mesi",
    forReader: "используйте только Italy kit/Questura; Schengen 90/180 ≠ permesso",
  }),
  "Официально: nomade digitale — Decreto 29/02/2024 GU 79; reddito triplo soglia sanitaria — точная € UNCHECKED 2026.",
  "На практике: без ricevuta к 4–6 месяцу страдают rinnovo contratto, banca e INPS.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Сколько дней на подачу permesso после прилёта?",
    a: "По правилам — 8 giorni lavorativi dall'ingresso. На практике kit в Poste лучше в первые 3–5 дней — очередь Sportello Amico.",
  },
  {
    q: "Где сдать kit в Milano?",
    a: "По правилам — Ufficio Postale Sportello Amico из elenco Poste. На практике проверьте PDF список на poste.it; адрес Questura — на poliziadistato.it.",
  },
  {
    q: "Permesso оформляют одной онлайн-записью?",
    a: "По правилам — нет универсального flow: Italia использует kit postale + Questura либо direct Questura по motivo. На практике ricevuta kit подтверждает подачу до plastica.",
  },
  {
    q: "Можно ли жить по Schengen без permesso с visto D?",
    a: "По правилам visto D требует permesso entro 8 gg. На практике Schengen 90/180 без permesso — overstay risk.",
  },
  {
    q: "Nomade digitale и elective residence — одно?",
    a: "По правилам — нет: D.M. 29/02/2024 (nomade) vs visto elective (reddito passivo). На практике разные consolato packages и codici kit.",
  },
];

export const PERMESSO_QUESTURA_GUIDE = {
  slug: PERMESSO_QUESTURA_SLUG,
  category: "Миграция",
  content_kind: "guide" as ContentKind,
  title: "Permesso di soggiorno Milano: Questura и kit postale 2026",
  excerpt:
    "Permesso Questura Milano 2026: kit postale giallo, 8 giorni lavorativi, Sportello Amico Poste, convocazione immigrazione. Schengen ≠ permesso. DNV vs elective. Ricevuta и rinnovo 60 gg.",
  seo_title: "Permesso Questura Milano 2026 — kit postale",
  seo_description:
    "Permesso di soggiorno Milano 2026: Questura, kit postale, 8 giorni, Poste Sportello Amico. Schengen 90/180 ≠ permesso. RU/BY track для Como/Nord.",
  quick_answer:
    "После въезда по visto D extra-UE нужно запросить permesso di soggiorno у Questore entro 8 giorni lavorativi. Многие motivi подаются kit giallo MOD.209 в Poste Sportello Amico (busta aperta); Questura Milano convoca на rilievi. Ricevuta подтверждает подачу до plastica. Schengen 90/180 — не permesso. Rinnovo — 60 giorni prima scadenza; flow зависит от motivo.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "Portale Immigrazione — procedura", url: "https://www.portaleimmigrazione.it/ITA/nuovaProcedura.html" },
    { title: "Poste Italiane — permesso di soggiorno", url: "https://www.poste.it/guida-rilascio-e-rinnovo-permesso-di-soggiorno" },
    { title: "Ministero dell'Interno", url: "https://www.interno.gov.it/" },
    {
      title: "Integrazione migranti — permesso",
      url: "https://integrazionemigrati.gov.it/it-it/Altre-info/e/4/o/5/id/1/Il-permesso-di-soggiorno",
    },
  ],
  topic_tags: ["permesso", "questura", "milano"],
  hashtags: buildNoteHashtags({
    topicTags: ["permesso", "questura", "milano"],
    contentKind: "guide",
    extra: ["kit_postale", "poste", "satellite"],
  }),
  source_channel: "milanru+forum_italy+digital_nomad_Italiya",
  source_label: "editorial:italy-seed",
};

export default PERMESSO_QUESTURA_GUIDE;
