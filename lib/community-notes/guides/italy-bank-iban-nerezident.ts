/**
 * Hand-curated Italy satellite guide — bank IBAN non-resident Milano.
 * Banca d'Italia / SEPA rules separated from branch KYC practice.
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import {
  formatPracticeBullet,
  formatPracticeTakeaway,
} from "@/lib/community-notes/practice-format";
import type { CommunityNoteFaq, ContentKind, GlossaryTerm, NoteBodySection } from "@/lib/community-notes/types";

export const BANK_IBAN_IT_SLUG = "bank-iban-nerezident-italiya-2026";

const CODICE_FISCALE_SLUG = "codice-fiscale-milano-2026";
const PERMESSO_QUESTURA_SLUG = "permesso-questura-milano-2026";
const PERVYE_30_SLUG = "pervye-30-dnej-v-italii-satelit-2026";
const SIM_LUCE_SLUG = "sim-internet-luce-milano-2026";
const ARENDA_SLUG = "arenda-milano-idealista-2026";

const GLOSSARY: GlossaryTerm[] = [
  { pt: "IBAN IT", ru: "итальянский счёт; префикс IT для SEPA и domiciliazione" },
  { pt: "Conto corrente", ru: "текущий счёт в banca o Poste" },
  { pt: "Codice fiscale", ru: "обязателен для открытия счёта в Италии" },
  { pt: "Domiciliazione", ru: "прямое списание renta, luce, assicurazione со счёта" },
  { pt: "Imposta di bollo", ru: "годовой налог на счёт ~€34,20 при балансе выше порога" },
  { pt: "Conto non residenti", ru: "счёт для нерезидента; выше комиссии до residenza" },
  { pt: "Bonifico SEPA", ru: "перевод в зоне euro; IBAN IT удобен, не всегда единственный законный" },
  { pt: "KYC / antiriciclaggio", ru: "проверка личности и origine fondi банком" },
];

const GLOSSARY_INTRO =
  "Слова из filiale Intesa, app Fineco и письма locatore — разберём до визита, пока менеджер не попросил codice fiscale, которого ещё нет.";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(GLOSSARY, GLOSSARY_INTRO),
  },
  {
    heading: "Nota Emigro (fact-check)",
    section_kind: "official",
    paragraphs: [
      "Разбор банковских мифов Milano. **OK** = Banca d'Italia / normativa; **soft** = filiali 2025–2026; **fixed** = смягчено.",
    ],
    bullets: [
      "Soft: filiali обычно требуют codice fiscale для conto corrente; homepage Banca d’Italia открыта, но не подтверждает этой фразой конкретный checklist каждого банка — условия счёта проверяйте у banca.",
      "OK: IBAN discrimination в SEPA — Regolamento UE 260/2012 art. 9; отказ только из-за страны IBAN незаконен для подходящих платежей.",
      "OK: все три URL из official_links открыты 06.09.2026; страница BCE подтверждает SEPA, но для art. 9 юридически первичен Regolamento UE 260/2012.",
      "Fixed: «Intesa всегда откроет RU» → нет универсальной гарантии; compliance по caso.",
      "Fixed: «Revolut нельзя для renta» → при поддержке SEPA adeudo отказ только по IBAN оспаривается; legacy-формы требуют письменную motivazione.",
      "Soft: KYC RU/BY — усиленный origine fondi и source of wealth.",
      "Soft: imposta di bollo ~€34,20/anno на conto (orientamento mercato, UNCHECKED exact threshold 2026).",
    ],
  },
  {
    heading: "Официально: зачем IBAN IT и что проверяет банк",
    section_kind: "official",
    paragraphs: [
      "Conto corrente в ente di credito под надзором Banca d'Italia требует identificazione cliente, codice fiscale и, при необходимости, documentazione reddito/origine fondi. Базовый пакет relocant Milano: passaporto, certificato codice fiscale, comprovante domicilio (contratto locazione, dichiarazione ospitalità, utility), ricevuta permesso di soggiorno или permesso plastica.",
      "IBAN с префиксом **IT** удобен для domiciliazione utenze (luce, gas), RID renta и stipendio datore italiano. SEPA-переводы нельзя ограничивать только итальянским IBAN, если счёт подходит по Regolamento 260/2012 — но agency и landlord на практике часто просят local bank statement.",
      "Conto **non residenti** доступен раньше с CF + passaporto; после residenza anagrafica и permesso часто выгодно convertire в conto residenti (commissioni ниже).",
    ],
    bullets: [
      "Codice fiscale — см. [гайд AA4/8](/notes/" + CODICE_FISCALE_SLUG + ").",
      "Permesso/ricevuta — [Questura kit](/notes/" + PERMESSO_QUESTURA_SLUG + ").",
      "Comprovante domicilio — contratto registrato, certificato di residenza или dichiarazione di ospitalità по запросу банка.",
      "Origine fondi — estratto conto 3–6 mesi, contratto lavoro.",
      "SIM IT — SMS home banking e 3D Secure.",
    ],
  },
  {
    heading: "Milano: Intesa, UniCredit, Poste, Fineco",
    section_kind: "practice",
    paragraphs: [
      "Нет одного «лучшего банка» для всех RU-паспортов. Ниже — полевые ярлыки @milanru и @forum_italy, **не** ranking Banca d'Italia.",
      "**Intesa Sanpaolo** — широкая сеть filiali Milano centro e hinterland; app функциональна; KYC для RU усиленный. **UniCredit** — аналогично; filiale в Monza/Como для Nord.",
      "**Poste Italiane (BancoPosta)** — доступные sportelli; связка con PosteID/SPID; частый выбор для первого conto. **Fineco** — online-first, EN-friendly; часто нужен video-identification.",
      "Plan A + Plan B в одну неделю — типичный совет чатов: если centro Milano отказал, попробуйте filiale в zona 9 o Monza с тем же пacchetto.",
    ],
    bullets: [
      formatPracticeBullet({
        channels: ["milanru", "forum_italy"],
        period: "2025–2026",
        claim:
          "Intesa e Poste aprivano conto con codice fiscale + ricevuta permesso + contratto preliminare locazione",
        forReader: "закройте CF до cita banca — см. sibling guide",
      }),
      "Intesa — piano base ~€0–4/mese con domiciliazione stipendio (soft).",
      "UniCredit — international desk в grandi filiali.",
      "Poste — imposta bollo e carta Postepay.",
      "Fineco — conto estero-friendly app; KYC video.",
      "Como/Bergamo filiali — тот же IBAN IT, satellite Nord.",
    ],
  },
  {
    heading: "Revolut, Wise и IBAN IT: мост vs local bank",
    section_kind: "practice",
    paragraphs: [
      "**Revolut/Wise** с IT или EU IBAN — быстрый мост для bonifici и части pagamenti после получения CF. Не всегда заменяют conto corrente tradizionale для datore italiano, domiciliazione Eni/Enel e некоторых locazioni.",
      "Многие relocants держат **dual stack**: Revolut для FX + Intesa/Poste для RID renta e stipendio. Закрывать зарубежный счёт до working IT IBAN — ошибка.",
    ],
    bullets: [
      "Revolut IT IBAN — soft принимается для bonifico; RID luce — чаще banca tradizionale.",
      "Wise — bonifico SEPA; domiciliazione renta agency может требовать estratto IT bank.",
      "N26 DE IBAN — SEPA ok; «solo IT» в contratto — проверьте art. 9 UE 260/2012.",
      formatPracticeBullet({
        channels: ["digital_nomad_Italiya"],
        period: "2025–2026",
        claim: "DNV relocants usavano Revolut fino a conto Intesa per domiciliazione affitto",
        forReader: "non chiudere conto estero prima di IBAN IT attivo",
      }),
      "PagoPA, bonifico и app банка — итальянский контур; не переносите платёжные привычки другой страны.",
    ],
  },
  {
    heading: "KYC RU/BY: origine fondi",
    section_kind: "practice",
    paragraphs: [
      "Паспорт RU/BY не создаёт автоматического запрета, но compliance оценивает санкционный риск и tracciabilità fondi. Крупные inbound transfer без paper trail — дополнительная due diligence.",
      "Подготовьте письменное объяснение: risparmi, vendita immobile, stipendio remote, eredità — con estratti 3–6 mesi. Для track РФ + UAE/altri Paesi некоторые filiali запрашивают certificato penale — soft, chiedere **prima** dell'appuntamento.",
    ],
    bullets: [
      "Estratti conto 3–6 mesi EN/IT o traduzione.",
      "Contratto lavoro / fatture P.IVA autonomo.",
      "Vendita immobile — atto + tracciabilità bonifico.",
      "Stipendio remote — contratto + estratti azienda estera.",
      "Non mentire su origine — blocco conto e segnalazione UIF.",
      formatPracticeBullet({
        channels: ["milanru"],
        period: "2025–2026",
        claim: "rifiuto filiale Duomo non definitivo — stesso pacchetto approvato a Monza",
        forReader: "plan A centro + plan B hinterland nella stessa settimana",
      }),
    ],
  },
  {
    heading: "К 4–6 месяцу без local IBAN",
    section_kind: "gap",
    paragraphs: [
      "«Revolut basta первый mes» часто ломается к **4–6 месяцу**: rinnovo contratto locazione con domiciliazione, attivazione luce a nome, accredito stipendio INPS/datorem, addebiti assicurazione sanitaria.",
    ],
    bullets: [
      "Sin domiciliazione — locatore preferisce RID su conto IT.",
      "Luce/gas — [SIM/luce guide](/notes/" + SIM_LUCE_SLUG + ") просят IBAN IT.",
      "Stipendio Italia — bonifico su conto con CF intestato.",
      "Imposta di bollo e dichiarazioni — conto collegato a CF.",
      "Permesso rinnovo — proof conto иногда в pacchetto (soft).",
      "Solo fintech — риск freeze compliance без filiale.",
    ],
  },
  {
    heading: "Conto non residenti vs residenti dopo permesso",
    section_kind: "practice",
    paragraphs: [
      "Многие filiali открывают **conto non residenti** с CF + passaporto + ricevuta permesso, затем после **residenza anagrafica** и plastica permesso переводят на conto residenti с lower commissioni. Conversione — stessa banca, nuovo pacchetto KYC (soft: alcuni banche richiedono nuovo appuntamento).",
      "Imposta di bollo (~€34,20/anno orientamento) si applica quando saldo medio supera soglia — chiedete esenzioni per conti con domiciliazione stipendio (soft, UNCHECKED soglia 2026).",
    ],
    bullets: [
      "Non residenti — commissioni più alte; bonifico SEPA ok.",
      "Residenti — dopo certificato residenza Comune.",
      "Postepay evolution — carta prepagata collegata; non sostituisce domiciliazione RID.",
      "Home banking — attivazione con SIM IT e codice OTP.",
    ],
  },
  {
    heading: "Пошагово: settimana 1–2 после CF",
    section_kind: "action_guide",
    paragraphs: [
      "Сценарий типичного relocant Milano:",
    ],
    bullets: [
      "1 — Certificato codice fiscale ([AA4/8](/notes/" + CODICE_FISCALE_SLUG + ")).",
      "2 — SIM IT + appuntamento filiale Intesa/Poste (plan A e B).",
      "3 — Pacchetto: passaporto, CF, ricevuta permesso, prova indirizzo.",
      "4 — Richiedere IBAN su carta intestata o PDF estratto conto.",
      "5 — Attivare bonifico SEPA test da conto estero.",
      "6 — Domiciliazione luce e affitto quando contratto firmato ([Idealista](/notes/" + ARENDA_SLUG + ")).",
      "7 — Non chiudere conto estero fino a RID attivi.",
    ],
  },
  {
    heading: "Типичные ошибки банка в Milano",
    section_kind: "practice",
    paragraphs: [
      "Оптимально: CF → due banche in una settimana → domiciliazione entro mes 2.",
    ],
    bullets: [
      "Ошибка: andare in banca senza codice fiscale.",
      "Ошибка: un solo tentativo filiale turistica e arrendersi.",
      "Ошибка: chiudere conto RF/Revolut prima di IBAN IT.",
      "Ошибка: mentire origine fondi.",
      "Ошибка: copiare checklist CaixaBank Valencia — wrong country.",
      "Ошибка: aspettare permesso plastica — ricevuta kit spesso basta (soft).",
    ],
  },
  {
    heading: "Wizard и Assist",
    section_kind: "practice",
    paragraphs: [
      "KYC блокирует catena CF → permesso → affitto? [Emigro Wizard Italia](/ru/italy/wizard?utm_source=emigro&utm_medium=guide&utm_campaign=bank-iban-italy&utm_content=" +
        BANK_IBAN_IT_SLUG +
        "). [Assist €129](/ru/assist?utm_source=emigro&utm_medium=guide&utm_campaign=bank-iban-italy&utm_content=" +
        BANK_IBAN_IT_SLUG +
        ") — разбор отказа filiale.",
    ],
    bullets: [
      "[30 дней](/notes/" + PERVYE_30_SLUG + ") — orchestrator.",
      "[Permesso](/notes/" + PERMESSO_QUESTURA_SLUG + ").",
      "[Codice fiscale](/notes/" + CODICE_FISCALE_SLUG + ").",
    ],
  },
];

const keyTakeaways = [
  "Официально: banca richiede codice fiscale e KYC; IBAN IT per domiciliazione; art. 9 UE 260/2012 против IBAN discrimination.",
  formatPracticeTakeaway({
    channels: ["milanru", "forum_italy"],
    period: "2025–2026",
    claim: "Intesa/Poste Milano aprono con CF + ricevuta permesso; RU/BY — origine fondi strict",
    forReader: "plan A centro + plan B Monza/Como; Revolut come ponte",
  }),
  "Расхождение: marketing «conto facile online» ≠ approvazione compliance RU passport.",
  "На практике: к 4–6 месяцу fintech alone часто недостаточен для renta, luce e stipendio IT.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Можно открыть счёт без codice fiscale?",
    a: "По правилам итальянские banche требуют CF. На практике без certificato AA4/8 filiale откажет; сначала Entrate.",
  },
  {
    q: "Какой банк проще для RU в Milano?",
    a: "По правилам все enti stesso marco KYC. На практике Intesa, Poste и UniCredit чаще в @milanru — con pacchetto completo.",
  },
  {
    q: "Хватит ли Revolut для аренды?",
    a: "По правилам SEPA bonifico с EU IBAN нельзя rifiutare solo per paese IBAN. На практике agency chiedono estratto conto IT e domiciliazione RID.",
  },
  {
    q: "Нужен ли permesso plastica per conto?",
    a: "По правилам — identificazione legale con CF. На практике ricevuta kit postale + CF часто достаточны per conto non residenti/residenti.",
  },
  {
    q: "Что ломается к 4–6 месяцу без IBAN IT?",
    a: "По правилам domiciliazione и stipendio требуют conto. На практике renta renewal, luce e INPS блокируются без local IBAN.",
  },
];

export const BANK_IBAN_IT_GUIDE = {
  slug: BANK_IBAN_IT_SLUG,
  category: "Банки",
  content_kind: "guide" as ContentKind,
  title: "Банк и IBAN IT в Milano для нерезидента 2026",
  excerpt:
    "IBAN IT Milano 2026: Intesa, UniCredit, Poste, Fineco, KYC RU/BY, Revolut/Wise как мост. Codice fiscale обязателен. Что ломается к 4–6 месяцу без local IBAN — renta, luce, stipendio.",
  seo_title: "Банк IBAN Италия 2026 — Milano нерезидент",
  seo_description:
    "Банк Milano 2026: IBAN IT, Intesa, UniCredit, Poste, Fineco, KYC RU/BY, codice fiscale. Revolut vs domiciliazione renta. К 4–6 месяцу без IBAN — luce.",
  quick_answer:
    "Для жизни в Milano нужен conto corrente с IBAN IT (Intesa, UniCredit, Poste, Fineco) после codice fiscale. Банк проводит KYC и origine fondi; паспорт RU/BY не запрещён автоматически, но compliance строже. Revolut/Wise — мост для SEPA, но к 4–6 месяцу domiciliazione renta, luce и stipendio datore часто требуют local IBAN. Отказ только из-за страны IBAN в SEPA незаконен (Reg. UE 260/2012 art. 9).",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "Banca d'Italia", url: "https://www.bancaditalia.it/" },
    { title: "Agenzia delle Entrate", url: "https://www.agenziaentrate.gov.it/" },
    {
      title: "BCE — SEPA Regulation",
      url: "https://www.ecb.europa.eu/paym/integration/retail/sepa/html/index.en.html",
    },
  ],
  topic_tags: ["bank", "iban", "milano"],
  hashtags: buildNoteHashtags({
    topicTags: ["bank", "iban", "milano"],
    contentKind: "guide",
    extra: ["intesa", "kyc", "satellite"],
  }),
  source_channel: "milanru+forum_italy+digital_nomad_Italiya",
  source_label: "editorial:italy-seed",
};

export default BANK_IBAN_IT_GUIDE;
