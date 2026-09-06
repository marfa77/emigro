/**
 * Hand-curated Italy satellite guide — nomade digitale / residenza elettiva / lavoro subordinato.
 * Practice after arrival in Milano; full law pillar on emigro.online www.
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import {
  formatPracticeBullet,
  formatPracticeTakeaway,
} from "@/lib/community-notes/practice-format";
import type { CommunityNoteFaq, ContentKind, GlossaryTerm, NoteBodySection } from "@/lib/community-notes/types";

export const VNJ_IT_SLUG = "vnj-italiya-nomade-elective-2026";

const PERVYE_30_SLUG = "pervye-30-dnej-v-italii-satelit-2026";
const CODICE_FISCALE_SLUG = "codice-fiscale-milano-2026";
const PERMESSO_SLUG = "permesso-questura-milano-2026";
const BANK_SLUG = "bank-iban-nerezident-italiya-2026";
const ARENDA_SLUG = "arenda-milano-idealista-2026";
const MEDITSINA_SLUG = "meditsina-milano-ssn-tessera-2026";
const RAJONY_SLUG = "milano-rajony-arenda-metro-como-2026";

const WWW_DNV_PILLAR = "/ru/guides/vnj-italiya-2026-digital-nomad";

const GLOSSARY: GlossaryTerm[] = [
  { pt: "Nomade digitale", ru: "удалённый highly qualified worker; visto D + permesso, не Spain UGE" },
  { pt: "Residenza elettiva", ru: "ВНЖ без права работать; пассивный доход + жильё + assicurazione" },
  { pt: "Lavoro subordinato", ru: "работа по найму; nulla osta / decreto flussi, не nomade track" },
  { pt: "Visto D", ru: "национальная виза для въезда; permesso оформляется в Италии" },
  { pt: "Consolato italiano", ru: "подача visto до въезда; district Milano — Lombardia e Nord" },
  { pt: "Questura / Portale Immigrazione", ru: "permesso после въезда; kit postale 8 gg lavorativi" },
  { pt: "Schengen 90/180", ru: "краткое пребывание; ≠ permesso di soggiorno" },
  { pt: "Nulla osta", ru: "разрешение на работу для lavoro subordinato; nomade — вне flussi" },
];

const DISCLAIMER =
  "**Emigro — не юридическая консультация.** Квоты, reddito minimo и check-list consolato **меняются**. Полный правовой pillar — [Emigro DNV Italia 2026](" +
  WWW_DNV_PILLAR +
  "). Официальные источники: [interno.gov.it](https://www.interno.gov.it/), [portaleimmigrazione.it](https://www.portaleimmigrazione.it/), [esteri.it visti](https://vistoperitalia.esteri.it/home/it). Не копируйте Spain UGE или Portugal D8 как «тот же канал».";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(
      GLOSSARY,
      "Слова из consolato Milano, kit postale и чата @digital_nomad_Italiya — разберём до того, как «туристом 90 дней + remote» станет отказ Questura."
    ),
    paragraphs: [DISCLAIMER],
  },
  {
    heading: "Nota Emigro (fact-check)",
    section_kind: "official",
    paragraphs: [
      "Satellite = **практика после прилёта** в Milano/Nord. OK/soft/fixed/UNCHECKED ниже; полный маршрут visto — pillar www.",
    ],
    bullets: [
      "OK: nomade digitale — D.M. **29 febbraio 2024**, pubblicato in **G.U. 4 aprile 2024** ([decreto PDF interno](https://www.lavorosi.it/wp-content/uploads/documenti/PRASSI_2024/min-int-decreto-29-febbraio-2024-nomadi-digitali-regole-di-ingresso-e-soggiorno.pdf)); art. 27-quater T.U. immigrazione D.Lgs. 286/98.",
      "OK: reddito minimo nomade — **triplo** del livello minimo per esenzione partecipazione spese sanitarie (formula nel decreto, non cifra fissa in legge).",
      "OK: visto D → ingresso → permesso entro **8 giorni lavorativi** ([portaleimmigrazione.it](https://www.portaleimmigrazione.it/ITA/nuovaProcedura.html)).",
      "OK: residenza elettiva — reddito **passivo**, no lavoro subordinato/autonomo in Italia ([circ. MAE / art. 11 DPR 394/99](https://vistoperitalia.esteri.it/home/it) — soft: sezione «residenza elettiva»).",
      "Fixed: «Spain UGE = канал nomade Italia» → **нет** UGE; visto в **consolato**, permesso в **Questura/Poste**, не extranjería Madrid.",
      "Fixed: «Schengen 90/180 = полгода legal remote» → без visto D + permesso это **turismo**, не soggiorno >90 gg.",
      "Fixed: «elective = nomade без работы» → elective **запрещает** lavoro; nomade **требует** remote highly qualified work.",
      "Soft: consolato Milano district — Lombardia, Piemonte, Veneto… ([milan.mid.ru district](https://milan.mid.ru/ru/general-consulate/genkonsulstvo/consul-district/)); не Barcelona.",
      "UNCHECKED: **точная сумма € reddito nomade 2026** после indicizzazione sanitaria — формула «×3» в decreto; проверьте checklist **вашего** consolato перед подачей.",
      "UNCHECKED: практика consolato Milano по savings buffer сверх reddito minimo — soft €28–30k в чатах, не GU.",
    ],
  },
  {
    heading: "Официально: три маршрута — nomade, elective, lavoro subordinato",
    section_kind: "official",
    paragraphs: [
      "Для extra-UE в Италии **три разных канала**, которые чат смешивает: **(1) nomade digitale / lavoratore da remoto** — highly qualified remote work, visto D в consolato, permesso «nomade digitale» вне quote flussi; **(2) residenza elettiva** — жить на пассивном доходе **без права работать**; **(3) lavoro subordinato** — контракт с datore italiano, nulla osta / decreto flussi, отдельная очередь.",
      "Канал подачи **до въезда** — почти всегда **consolato/ambasciata italiana** компetente per territorio (для RU в Lombardia — Genova/Milano district, не «любое EU consolato»). Канал **после въезда** — **kit postale Poste** + Questura через [portaleimmigrazione.it](https://www.portaleimmigrazione.it/); это **не** подача visto и **не** Spain UGE.",
      "Полный разбор документов, сроков visto и family reunification — pillar [VNJ Italia 2026 DNV](" +
        WWW_DNV_PILLAR +
        "). Этот satellite закрывает: **что делать в Milano в неделю 1–12 после landing** с уже выбранным track.",
    ],
    bullets: [
      "Nomade — remote HQ/clienti **extra-Italia**; esperienza ≥6 mesi (decreto).",
      "Elective — pensioni, rendite, dividendi; **no** stipendio IT.",
      "Lavoro subordinato — contratto + nulla osta; flussi e code.",
      "Visto D — ingresso; permesso — entro 8 gg lavorativi in Italia.",
      "Schengen C — max 90/180; не заменяет permesso.",
      "Como/Monza — тот же Questura provincia Milano; satellite geo.",
    ],
  },
  {
    heading: "Consolato vs Questura: кто что решает",
    section_kind: "official",
    paragraphs: [
      "**Consolato (до MXP/LIN):** принимает domanda visto tipo D, проверяет reddito, assicurazione sanitaria, alloggio (contratto registrato или propriété), antecedenti. Выдаёт visto в passaporto — обычно «lavoro autonomo / nomade digitale» или «residenza elettiva» или «lavoro subordinato» в зависимости от motivo.",
      "**Questura + Poste (после landing):** в течение **8 giorni lavorativi** — kit postale giallo, marca da bollo, copie visto e passaporto. Ricevuta postale = titolo provvisorio до plastica. Biometrics и convocazione — SMS/email Questura Milano. Portale Immigrazione — статус pratica, **не** замена consolato для первичного visto.",
      "Для nomade после permesso: Partita IVA **не обязательна**, если работаете на foreign employer; autonomo в Италии — другой tax/migration контур. Elective: любая attività lavorativa в IT = потеря titolo.",
    ],
    bullets: [
      "Consolato — visto D, documenti reddito/alloggio/polizza.",
      "Poste Sportello Amico — kit entro 8 gg ([poste.it guida permesso](https://www.poste.it/guida-rilascio-e-rinnovo-permesso-di-soggiorno)).",
      "Questura Milano — ritiro permesso, rinnovo.",
      "Portale Immigrazione — tracking pratica.",
      "Agenzia Entrate — codice fiscale **параллельно**, не в consolato ([CF Milano](/notes/" + CODICE_FISCALE_SLUG + ")).",
      "Comune — residenza anagrafe после contratto ([аренда](/notes/" + ARENDA_SLUG + ")).",
    ],
  },
  {
    heading: "Milano после landing: nomade vs elective на практике",
    section_kind: "practice",
    paragraphs: [
      "Неделя **1–2** (любой track с visto D): [codice fiscale AA4/8](/notes/" +
        CODICE_FISCALE_SLUG +
        ") → kit postale permesso → SIM/luce по адресу → IBAN. Assicurazione из visto держите до SSN или private top-up.",
      "**Nomade digitale:** contratto locazione registrato (agency просят CF + permesso ricevuta); polizza sanitaria valida tutta durata permesso; доказательства remote work (contratto, fatture, estratti conto) — для rinnovo через 12 mesi. Не открывайте lavoro subordinato IT «на стороне» — motivo permesso другой.",
      "**Residenza elettiva:** reddito только passivo; stipendio remote client = **не** elective. Жильё — registered lease или propriété; ATS/SSN через private finché non eleggibile SSN ([meditsina](/notes/" +
        MEDITSINA_SLUG +
        ")).",
      "**Lavoro subordinato:** datore, INPS, contratto; permesso legato a nulla osta. Если приехали по nomade, а нашли employment IT — **cambio motivo**, не «продолжаем как есть».",
    ],
    bullets: [
      formatPracticeBullet({
        channels: ["milanru", "digital_nomad_Italiya"],
        period: "2025–2026",
        claim:
          "nomade Milano получали ricevuta kit в Poste Monza/Bergamo при перегрузке Sportello Amico centro",
        forReader: "CF + kit в первую неделю, не ждите «идеального» permesso plastica",
      }),
      "MXP/LIN — штамп visto D; 8 gg считаются с ingresso.",
      "Como — Questura та же provincia; scuola/Comune Como отдельно.",
      "Wizard — если track смешанный: [/ru/italy/wizard](/ru/italy/wizard?utm_source=emigro&utm_medium=guide&utm_campaign=vnj-nomade-elective&utm_content=" +
        VNJ_IT_SLUG +
        ").",
      "[Permesso Questura](/notes/" + PERMESSO_SLUG + ") — kit детали.",
      "[Первые 30 дней](/notes/" + PERVYE_30_SLUG + ") — orchestrator.",
    ],
  },
  {
    heading: "Что не считается проживанием и legal work",
    section_kind: "practice",
    paragraphs: [
      "**Schengen 90/180** без visto D — turismo; remote work из Airbnb **не легализует** soggiorno >90 gg. **Estancia por estudios** и другие мотivi — отдельные visti; не «подмена» nomade.",
      "**Elective** + freelance для IT clienti = риск отказа rinnovo. **Nomade** + contratto lavoro subordinato Milano = несоответствие motivo permesso.",
      "Полный правовой разбор порогов и документов consolato — только pillar www; satellite не заменяет avvocato per casi complessi.",
    ],
    bullets: [
      "Turismo Schengen ≠ permesso.",
      "Elective ≠ nomade ≠ lavoro subordinato.",
      "Studi — altro visto; non cumulabile soft без avvocato.",
      "Partita IVA autonomo — не default nomade track.",
      "Spain UGE / PT D8 — altri Paesi.",
      "[Районы Milano/Como](/notes/" + RAJONY_SLUG + ") — выбор comune для contratto.",
    ],
  },
  {
    heading: "К 4–6 месяцу: хвост без permesso или неверного track",
    section_kind: "gap",
    paragraphs: [
      "Если месяц 1 прошёл только на Schengen или visto D без kit postale, к **4–6 месяцу** риски: multa за ritardo oltre 8 gg, irregolare soggiorno, отказ rinnovo, блок banca e locazione. Ricevuta postale истекает — plastica или proroga.",
      "Nomade без документированного reddito foreign к rinnovo — отказ. Elective с «подработкой» IT — annullamento titolo. Lavoro subordinato без INPS — datore и straniero в зоне rischio.",
    ],
    bullets: [
      "Sin kit 8 gg — sanzione amministrativa (soft: importi variabili).",
      "Sin CF — renta e luce блок ([bank](/notes/" + BANK_SLUG + ")).",
      "Track mismatch — cambio motivo costoso.",
      "Rinnovo nomade — reddito 12 mesi estratti conto.",
      "Elective — prova residenza effettiva in Comune.",
      "Assist Route Check — audit порядка visto→kit→CF.",
    ],
  },
  {
    heading: "Типичные ошибки маршрута VNJ в Milano",
    section_kind: "practice",
    paragraphs: [
      "Повторяющиеся кейсы из @milanru и @forum_italy — путаница каналов и сроков.",
    ],
    bullets: [
      "Ошибка: подавать «как UGE Испании» в extranjería — в Italia только consolato + Questura.",
      "Ошибка: 90 дней Schengen + remote = legal — нужен visto D + permesso.",
      "Ошибка: elective для remote salary — нужен nomade или lavoro track.",
      "Ошибка: ждать plastica permesso для CF и banca — ricevuta + AA4/8 в неделю 1.",
      formatPracticeBullet({
        channels: ["digital_nomad_Italiya"],
        period: "2025–2026",
        claim: "consolato checklist reddito «×3 sanitaria» трактовали по-разному — готовили margin сверх минимума",
        forReader: "UNCHECKED exact € — сверяйте checklist consolato, не чат",
      }),
      "Ошибка: Barcelona consolato для жителя Lombardia — district Milano.",
    ],
  },
  {
    heading: "Wizard и Assist",
    section_kind: "practice",
    paragraphs: [
      "Если не уверены nomade vs elective vs lavoro — [Emigro Wizard Italia](/ru/italy/wizard?utm_source=emigro&utm_medium=guide&utm_campaign=vnj-nomade-elective&utm_content=" +
        VNJ_IT_SLUG +
        "). Сложный кейс (family, cambio motivo, rinnovo) — [Route Check Assist €129](/ru/assist?utm_source=emigro&utm_medium=guide&utm_campaign=vnj-nomade-elective&utm_content=" +
        VNJ_IT_SLUG +
        "); не «адвокат гражданства», а порядок документов.",
      "Pillar law depth: [VNJ Italia 2026 — digital nomad](" + WWW_DNV_PILLAR + ").",
    ],
    bullets: [
      "[Permesso Questura](/notes/" + PERMESSO_SLUG + ").",
      "[Codice fiscale](/notes/" + CODICE_FISCALE_SLUG + ").",
      "[Аренда Idealista](/notes/" + ARENDA_SLUG + ").",
    ],
  },
];

const keyTakeaways = [
  "Официально: nomade digitale — D.M. 29/02/2024 GU; visto D в consolato, permesso entro 8 gg через Poste/Questura; не Spain UGE.",
  "Официально: residenza elettiva — reddito passivo, divieto lavoro; lavoro subordinato — nulla osta/flussi; три разных канала.",
  formatPracticeTakeaway({
    channels: ["milanru", "digital_nomad_Italiya"],
    period: "2025–2026",
    claim: "после MXP типичный порядок: CF Entrate → kit postale → IBAN → residenza Comune",
    forReader: "satellite = практика Milano; pillar www = полный visto checklist",
  }),
  "На практике: Schengen 90/180 ≠ permesso; к 4–6 месяцу без kit/CF блокируются rinnovo, renta e banca.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Куда подавать DNV в Италии — UGE или консульство?",
    a: "По правилам — visto D в consolato/ambasciata italiana до въезда; permesso после landing через Poste/Questura. На практике Spain UGE не существует в Italia; portaleimmigrazione — только permesso, не visto.",
  },
  {
    q: "Чем nomade digitale отличается от residenza elettiva?",
    a: "По правилам — nomade требует highly qualified remote work и reddito da lavoro; elective — reddito passivo и divieto di lavorare. На практике путаница в чатах «удалёнка = elective» ведёт к отказу consolato или rinnovo.",
  },
  {
    q: "Можно ли жить 6 месяцев в Milano по Schengen и работать remote?",
    a: "По правилам — пребывание >90 gg требует visto D и permesso; turismo не покрывает soggiorno долгий. На практике часть релокантов рискуют irregolare soggiorno без kit entro 8 gg.",
  },
  {
    q: "Где полный гайд по документам visto?",
    a: "По правилам Emigro pillar — /ru/guides/vnj-italiya-2026-digital-nomad на www. На практике этот satellite закрывает недели 1–12 в Milano после выбранного track.",
  },
  {
    q: "Какой минимальный доход nomade 2026?",
    a: "По правилам decreto — triplo livello esenzione spese sanitarie (formula, не фикс € в GU). На практике consolati часто просят margin; точная сумma 2026 — UNCHECKED, сверяйте checklist consolato.",
  },
];

export const VNJ_IT_GUIDE = {
  slug: VNJ_IT_SLUG,
  category: "Статус",
  content_kind: "guide" as ContentKind,
  title: "VNJ Италия 2026: nomade, elective и lavoro — Milano после visto",
  excerpt:
    "Nomade digitale vs residenza elettiva vs lavoro subordinato в Milano 2026: consolato до въезда, Questura и kit postale после MXP. Schengen ≠ permesso. Satellite-практика; полный DNV pillar на www. Не Spain UGE.",
  seo_title: "VNJ Италия nomade elective Milano 2026",
  seo_description:
    "Nomade digitale и residenza elettiva Milano 2026: consolato vs Questura, kit 8 дней, не UGE. Schengen ≠ permesso. Практика после visto D; pillar DNV на www.",
  quick_answer:
    "В Италии три разных extra-UE маршрута: nomade digitale (remote highly qualified, D.M. 29/02/2024 GU), residenza elettiva (пассивный доход, без права работать) и lavoro subordinato (nulla osta/flussi). До въезда — visto D в consolato italiano (district Milano для Lombardia); после MXP/LIN — permesso entro 8 giorni lavorativi через kit postale Poste и Questura, не Spain UGE. Schengen 90/180 не заменяет permesso. Satellite закрывает практику Milano: CF, kit, IBAN, rinnovo; полный checklist visto — pillar /ru/guides/vnj-italiya-2026-digital-nomad. Точный € reddito nomade 2026 — формула ×3 sanitaria, UNCHECKED index.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "Ministero dell'Interno", url: "https://www.interno.gov.it/" },
    { title: "Portale Immigrazione", url: "https://www.portaleimmigrazione.it/" },
    {
      title: "Decreto nomadi digitali 29/02/2024 (PDF)",
      url: "https://www.lavorosi.it/wp-content/uploads/documenti/PRASSI_2024/min-int-decreto-29-febbraio-2024-nomadi-digitali-regole-di-ingresso-e-soggiorno.pdf",
    },
    { title: "Visti per l'Italia — MAECI", url: "https://vistoperitalia.esteri.it/home/it" },
    { title: "Agenzia delle Entrate", url: "https://www.agenziaentrate.gov.it/" },
  ],
  topic_tags: ["vnj", "nomade_digitale", "milano", "residenza_elettiva"],
  hashtags: buildNoteHashtags({
    topicTags: ["vnj", "nomade_digitale", "milano", "residenza_elettiva"],
    contentKind: "guide",
    extra: ["elective", "consolato", "satellite"],
  }),
  source_channel: "milanru+forum_italy+milan_4at",
  source_label: "editorial:italy-seed",
};

export default VNJ_IT_GUIDE;
