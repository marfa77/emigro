/**
 * Hand-curated Italy satellite guide — yellow pages relocant Milano / Nord.
 * CAF, Patronato, commercialista, trades, immigration lawyer vs citizenship.
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import {
  formatPracticeBullet,
  formatPracticeTakeaway,
} from "@/lib/community-notes/practice-format";
import type { CommunityNoteFaq, ContentKind, GlossaryTerm, NoteBodySection } from "@/lib/community-notes/types";

export const ZHELTYE_MILANO_SLUG = "zheltye-stranitsy-relokanta-milano-2026";

const PERVYE_30_SLUG = "pervye-30-dnej-v-italii-satelit-2026";
const CODICE_FISCALE_SLUG = "codice-fiscale-milano-2026";
const PERMESSO_SLUG = "permesso-questura-milano-2026";
const VNJ_SLUG = "vnj-italiya-nomade-elective-2026";
const BANK_SLUG = "bank-iban-nerezident-italiya-2026";

const GLOSSARY: GlossaryTerm[] = [
  { pt: "CAF", ru: "Centro di Assistenza Fiscale; 730, ISEE, AA4/8 soft free" },
  { pt: "Patronato", ru: "INPS/INAIL помощь; permesso, pensioni — не immigration boutique" },
  { pt: "Commercialista", ru: "бухгалтер; Partita IVA, dichiarazione redditi" },
  { pt: "Idraulico / elettricista", ru: "сантехник / электрик; emergenza жилья" },
  { pt: "Avvocato immigrazione", ru: "миграционный адвокат; cambio motivo, ricorsi — не cittadinanza exam" },
  { pt: "Sportello Amico", ru: "Poste — kit permesso; Patronato рядом по смыслу, не то же" },
  { pt: "PEC", ru: "certified email; uffici PA и avvocati" },
  { pt: "Gestore utenze", ru: "не «gestoría» PT; luce/gas — fornitore или A2A/AEM soft" },
];

const DISCLAIMER =
  "**Emigro — не реклама мастеров.** Списки **не endorsement**. Официальные procedure — [portaleimmigrazione.it](https://www.portaleimmigrazione.it/), [agenziaentrate.gov.it](https://www.agenziaentrate.gov.it/). Не путайте Patronato с «лучшим адвокатом гражданства» из Telegram.";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(
      GLOSSARY,
      "Слова из объявлений @milan_4at и визиток в hall condominio — до перевода €500 «за NIE в Италии»."
    ),
    paragraphs: [DISCLAIMER],
  },
  {
    heading: "Nota Emigro (fact-check)",
    section_kind: "official",
    paragraphs: [
      "Жёлтые страницы = **кого звать в 0–6 mesi**, не рейтинг «топ-10 lawyers citizenship». OK/soft/fixed/UNCHECKED.",
    ],
    bullets: [
      "OK: **CAF** — assistenza fiscale, modello 730, ISEE ([Agenzia Entrate elenco CAF](https://www.agenziaentrate.gov.it/) — sezione CAF).",
      "OK: **Patronato** (INPS) — pratiche previdenziali, supporto cittadini ([inps.it](https://www.inps.it/)).",
      "OK: **AA4/8 codice fiscale** — бесплатно в Entrate; CAF/Patronato помогают compilare ([CF guide](/notes/" + CODICE_FISCALE_SLUG + ")).",
      "OK: **kit permesso** — Poste Sportello Amico, не «gestor» за €800 ([poste.it](https://www.poste.it/guida-rilascio-e-rinnovo-permesso-di-soggiorno)).",
      "Fixed: «gestoría Portugal = CAF Italia» → разные функции; в IT нет единого gestor для TIE.",
      "Fixed: «адвокат гражданства 2 года» → не первые 6 mesi быта; нужен **immigrazione** o Patronato.",
      "Soft: idraulico emergenza — €80–150 call-out Milano soft.",
      "UNCHECKED: конкретные CAF/Patronato с англ./рус. языком в centro — verificare telefonicamente.",
      "UNCHECKED: tariffario commercialista Partita IVA 2026 — preventivo individuale.",
    ],
  },
  {
    heading: "Официально: CAF, Patronato и государственные окна",
    section_kind: "official",
    paragraphs: [
      "**CAF** (convenzionati Agenzia Entrate): compilazione **730**, **ISEE**, dichiarazioni; часто **gratuito** o low fee для dichiarazione. Помогают с **AA4/8** codice fiscale — не заменяют ufficio Entrate. Elenco CAF — portale Entrate по CAP Milano/Como.",
      "**Patronato** (ACLI, INCA, ITAL…): pratiche **INPS**, disoccupazione, certificazioni; supporto **permesso** soft (compilazione moduli), **не** sostituto Questura. Convenzione INPS — sportelli territoriali.",
      "**Comune di Milano** — anagrafe residenza, scuola ([Milano Aiuta 02.02.02](https://www.comune.milano.it/)). **Questura** — solo appuntamento convocazione, не «услуга за деньги» посреднику.",
    ],
    bullets: [
      "Entrate sportello — CF, tessera sanitaria.",
      "Poste Sportello Amico — kit permesso.",
      "Portale Immigrazione — status pratica.",
      "INPS — contributi lavoro subordinato.",
      "ATS — medico, non CAF.",
      "Consolato RU — passaporto, не permesso IT.",
    ],
  },
  {
    heading: "Commercialista, idraulico, elettricista: быт и налоги",
    section_kind: "official",
    paragraphs: [
      "**Commercialista / consulente del lavoro:** нужен при **Partita IVA**, **lavoro autonomo**, redditi complessi, **730** oltre CAF. Nomade con solo foreign salary — часто CAF + Entrate достаточно первые mesi; P.IVA — отдельное решение ([VNJ track](/notes/" + VNJ_SLUG + ")).",
      "**Idraulico / elettricista / fabbro:** perdita acqua, caldaia, serratura — **condominio** amministratore или emergenza 24h; проверяйте **P.IVA** и preventivo scritto. **Pronto intervento** centro storico — premium soft.",
      "**Avvocato (immigrazione):** cambio motivo permesso, ricorso TAR, casi family complessi — **не** marketing «cittadinanza anticipata». Citizenship / exam — UniPrep track, **вне** жёлтых страниц satellite.",
    ],
    bullets: [
      "Registro imprese — verifica P.IVA artigiano.",
      "Assicurazione RC professionale — soft richiesta.",
      "Mensa condominiale — idraulico preferito building.",
      "Fattura elettronica — obbligo prestatori IT.",
      "Perdita gas — chiudere rubinetto, chiamare 115.",
      "Blackout — elettricista certificato.",
    ],
  },
  {
    heading: "Кого вызывают в первые 0–6 mesi: практическая карта",
    section_kind: "practice",
    paragraphs: [
      "**Settimana 1–2:** Patronato/CAF для AA4/8 + kit postale check; **не** платить «агентство VNJ €2000» за то, что Poste делает с marca da bollo. **Mese 1–3:** idraulico если [luce/acqua](/notes/sim-internet-luce-milano-2026) leak; commercialista если открыли P.IVA.",
      "**Mese 3–6:** commercialista для **730** (если redditi IT); avvocato immigrazione если **rinnovo** отказ или cambio status. **Bank** KYC — filiale, не посредник ([IBAN guide](/notes/" + BANK_SLUG + ")).",
      "**Como/Monza:** те же CAF/Patronato network Lombardia; sportello может быть в provincia.",
    ],
    bullets: [
      formatPracticeBullet({
        channels: ["milanru", "milan_4at"],
        period: "2025–2026",
        claim:
          "relocant pagavano «consulenza permesso» €600 без PEC verso Questura — ricevuta postale uguale a DIY Poste",
        forReader: "Patronato/Poste prima di unknown middleman",
      }),
      "Amministratore condominio — chiavi, regolamento.",
      "Spazzatura/raccolta — Comune app.",
      "Internet — ISP, non CAF.",
      "Medico — SSN, non commercialista.",
      "[Permesso](/notes/" + PERMESSO_SLUG + ") — kit ufficiale.",
    ],
  },
  {
    heading: "Как фильтровать рекламу в чатах",
    section_kind: "practice",
    paragraphs: [
      "**Red flags:** «гарантия VNJ 100%», «без visto D», «NIE Италии за день», «оплата только cash без fattura», «нет P.IVA/partita». **Green flags:** P.IVA verificabile, preventivo scritto, PEC, специализация **diritto immigrazione** (not citizenship marketing).",
      "Рекомендации @milan_4at — **один** звонок для compare, не blind trust. Ordine professionale avvocati — albo online.",
      "Emigro **не** marketplace мастеров; Assist — **audit порядка**, не замена idraulico.",
    ],
    bullets: [
      "Verifica P.IVA — portale Agenzia Entrate.",
      "Recensioni Google — soft, не solo Telegram.",
      "Due preventivi — idraulico/elettricista.",
      "Contratto scritto — sempre.",
      "No prepagamento 100% unknown.",
      "Citizenship lawyer — red flag mes 1–3.",
    ],
  },
  {
    heading: "К 4–6 месяцу: когда жёлтые страницы не помогут",
    section_kind: "gap",
    paragraphs: [
      "К **4–6 месяцу** накапливаются **730**, rinnovo permesso, eventuale **Partita IVA** — без commercialista/CAF риск sanzioni fiscali. **Irregolare soggiorno** — avvocato, не Patronato fix retroattivo.",
      "Emergenza idraulica ignorata — danni condominio, deposito affitto perso. «Юрист из чата» без ricorso — деньги без PEC verso PA.",
    ],
    bullets: [
      "730 scadenza — CAF/commercialista.",
      "Rinnovo permesso — Questura, soft avvocato se negato.",
      "INPS gap lavoro — consulente del lavoro.",
      "Multe ZTL — pagamento, non avvocato subito.",
      "Assist Route Check — порядок документов.",
      "Portale Immigrazione — status ufficiale.",
    ],
  },
  {
    heading: "Assist vs официальный портал vs мастер",
    section_kind: "official",
    paragraphs: [
      "**Официальный портал / ufficio:** permesso ([portaleimmigrazione.it](https://www.portaleimmigrazione.it/)), CF ([Entrate](/notes/" + CODICE_FISCALE_SLUG + ")), residenza Comune, INPS. **Бесплатно** или marca da bollo.",
      "**Assist Emigro Route Check €129:** аудит **вашего** порядка visto→kit→CF→banca; не подаёт kit за вас. UTM wizard — [/ru/italy/wizard](/ru/italy/wizard).",
      "**Мастер (idraulico, elettricista):** физическая работа; **commercialista:** налоги; **avvocato immigrazione:** ricorsi/cambio motivo; **не смешивать** с «гражданство через 2 года» рекламой.",
    ],
    bullets: [
      "Assist ≠ sostituto Questura.",
      "CAF ≠ avvocato.",
      "Patronato ≠ agency VNJ.",
      "Poste kit — DIY possibile.",
      "Emigro — navigator, non CAF.",
      "[Первые 30 дней](/notes/" + PERVYE_30_SLUG + ") — orchestrator.",
    ],
  },
  {
    heading: "Типичные ошибки жёлтых страниц в Milano",
    section_kind: "practice",
    paragraphs: [
      "Relocant теряют время и деньги в первые mesi.",
    ],
    bullets: [
      "Ошибка: платить «gestor permesso» вместо Poste + Patronato free help.",
      "Ошибка: citizenship lawyer для kit postale mes 1.",
      "Ошибка: idraulico без preventivo — conto €500+ soft.",
      "Ошибка: commercialista до решения P.IVA/nomade salary only.",
      formatPracticeBullet({
        channels: ["forum_italy", "milan_4at"],
        period: "2025–2026",
        claim: "реклама «NIE italiano express» — на деле AA4/8 бесплатно в Entrate",
        forReader: "CF — Entrate, не посредник",
      }),
      "Ошибка: игнор Assist/wizard для порядка, но hire random «100% VNJ».",
    ],
  },
  {
    heading: "Wizard и Assist",
    section_kind: "practice",
    paragraphs: [
      "Неясно CAF vs commercialista vs avvocato — [Wizard Italia](/ru/italy/wizard?utm_source=emigro&utm_medium=guide&utm_campaign=zheltye-stranitsy&utm_content=" +
        ZHELTYE_MILANO_SLUG +
        "). Audit document flow — [Route Check Assist €129](/ru/assist?utm_source=emigro&utm_medium=guide&utm_campaign=zheltye-stranitsy&utm_content=" +
        ZHELTYE_MILANO_SLUG +
        ").",
    ],
    bullets: [
      "[VNJ track](/notes/" + VNJ_SLUG + ").",
      "[Codice fiscale](/notes/" + CODICE_FISCALE_SLUG + ").",
      "[Bank IBAN](/notes/" + BANK_SLUG + ").",
    ],
  },
];

const keyTakeaways = [
  "Официально: permesso — Poste/Questura/portaleimmigrazione; CF — Entrate AA4/8; CAF/Patronato — fiscal/INPS support, не VNJ agency.",
  "Официально: commercialista — P.IVA/730; avvocato immigrazione — ricorsi/cambio motivo; не citizenship marketing mes 1–6.",
  formatPracticeTakeaway({
    channels: ["milanru", "milan_4at"],
    period: "2025–2026",
    claim: "Patronato e Poste coprivano kit e AA4/8 senza fee €600 middleman",
    forReader: "filter chat ads: P.IVA, PEC, preventivo",
  }),
  "На практике: к 4–6 месяцу без CAF/commercialista — 730 e rinnovo rischio; Assist — audit ordine, non idraulico.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Где бесплатно помогут с permesso и CF?",
    a: "По правилам kit postale — Poste Sportello Amico; CF — Entrate AA4/8; Patronato/CAF aiutano compilare. На практике non pagare «agenzia» per ciò che ufficio fa con bollo.",
  },
  {
    q: "Нужен ли адвокат в первый месяц?",
    a: "По правилам caso standard — no, se visto D chiaro. На практике avvocato immigrazione se ricorso o cambio motivo; citizenship lawyer — non priorità mes 1–6.",
  },
  {
    q: "CAF или commercialista?",
    a: "По правилам CAF — 730/ISEE convenzionati; commercialista — P.IVA e contabilità complex. На практике nomade solo foreign salary spesso CAF basta первые mesi.",
  },
  {
    q: "Как отличить scam в Telegram?",
    a: "По правилам verificare P.IVA, PEC, fattura. На практике red flags: «100% VNJ», «NIE Italia», cash senza contratto.",
  },
  {
    q: "Когда Emigro Assist, а когда мастer?",
    a: "По правилам Assist — audit ordine documenti Route Check. На практике idraulico/elettricista per casa; portale ufficiale per permesso — non Assist substitution.",
  },
];

export const ZHELTYE_MILANO_GUIDE = {
  slug: ZHELTYE_MILANO_SLUG,
  category: "Сервисы",
  content_kind: "guide" as ContentKind,
  title: "Жёлтые страницы relocant Milano 2026: CAF, Patronato, мастера",
  excerpt:
    "Кого вызывать в Milano 0–6 mesi: CAF, Patronato INPS, commercialista, idraulico, avvocato immigrazione — не citizenship lawyer. Фильтр рекламы чатов; Assist vs portale ufficiale vs мастер. Como/Nord stessi sportelli soft.",
  seo_title: "CAF Patronato мастер Milano 2026 Италия",
  seo_description:
    "Жёлтые страницы Milano 2026: CAF, Patronato, commercialista, idraulico, avvocato immigrazione. Фильтр scam в чатах; Assist vs portale ufficiale. Non gestoría PT.",
  quick_answer:
    "В первые 0–6 месяцев в Milano: CAF (730, ISEE, help AA4/8), Patronato INPS (moduli previdenza), Poste/Questura для permesso — официально; commercialista при Partita IVA/730 сложный; idraulico/elettricista — быт; avvocato immigrazione — ricorsi/cambio motivo, не «гражданство 2 года» из чата. Фильтр рекламы: P.IVA, PEC, preventivo; red flags «100% VNJ», «NIE Italia». Assist Emigro — audit порядка документов, не замена мастера. К 4–6 mesi без CAF/commercialista — rischio 730 e fisco.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "Agenzia delle Entrate", url: "https://www.agenziaentrate.gov.it/" },
    { title: "INPS — Patronato", url: "https://www.inps.it/" },
    { title: "Portale Immigrazione", url: "https://www.portaleimmigrazione.it/" },
    { title: "Comune di Milano", url: "https://www.comune.milano.it/" },
    { title: "Ministero dell'Interno", url: "https://www.interno.gov.it/" },
  ],
  topic_tags: ["yellow_pages", "caf", "patronato", "milano"],
  hashtags: buildNoteHashtags({
    topicTags: ["yellow_pages", "caf", "patronato", "milano"],
    contentKind: "guide",
    extra: ["commercialista", "servizi", "satellite"],
  }),
  source_channel: "milanru+forum_italy+milan_4at",
  source_label: "editorial:italy-seed",
};

export default ZHELTYE_MILANO_GUIDE;
