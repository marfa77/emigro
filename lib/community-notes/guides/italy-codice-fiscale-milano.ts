/**
 * Hand-curated Italy satellite guide — codice fiscale Milano / Nord.
 * Agenzia delle Entrate AA4/8 rules separated from branch practice.
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import {
  formatPracticeBullet,
  formatPracticeTakeaway,
} from "@/lib/community-notes/practice-format";
import type { CommunityNoteFaq, ContentKind, GlossaryTerm, NoteBodySection } from "@/lib/community-notes/types";

export const CODICE_FISCALE_SLUG = "codice-fiscale-milano-2026";

const PERVYE_30_SLUG = "pervye-30-dnej-v-italii-satelit-2026";
const PERMESSO_SLUG = "permesso-questura-milano-2026";
const BANK_SLUG = "bank-iban-nerezident-italiya-2026";
const SIM_LUCE_SLUG = "sim-internet-luce-milano-2026";
const ARENDA_SLUG = "arenda-milano-idealista-2026";
const MEDITSINA_SLUG = "meditsina-milano-ssn-tessera-2026";

const GLOSSARY: GlossaryTerm[] = [
  { pt: "Codice fiscale", ru: "итальянский налоговый код (16 символов); не NIE и не номер ВНЖ" },
  { pt: "Agenzia delle Entrate", ru: "налоговая служба; выдаёт codice fiscale по modello AA4/8" },
  { pt: "Modello AA4/8", ru: "официальная форма запроса codice fiscale / tessera sanitaria" },
  { pt: "Tessera sanitaria", ru: "карта SSN с codice fiscale; для медицины — отдельный гайд" },
  { pt: "Permesso di soggiorno", ru: "разрешение на пребывание extra-UE; Questura может присвоить CF при выдаче" },
  { pt: "Anagrafe", ru: "реестр населения Comune; residenza — после CF и жилья" },
  { pt: "Residenza", ru: "официальная регистрация по адресу в Comune di Milano" },
  { pt: "Partita IVA", ru: "номер ИП/фрилансера; не путать с личным codice fiscale" },
];

const DISCLAIMER =
  "**Emigro — не юридическая консультация.** Порядок AA4/8, очереди uffici Entrate и требования банков **меняются**. Актуальные формы — [agenziaentrate.gov.it](https://www.agenziaentrate.gov.it/). Это satellite-гайд для Milano и Nord (Como, Bergamo, Monza); не копируйте испанский NIE или португальский NIF.";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(
      GLOSSARY,
      "Слова из ufficio Entrate, Patronato и чата @forum_italy — разберём до визита, пока арендодатель не попросил «codice fiscale, как NIE»."
    ),
    paragraphs: [DISCLAIMER],
  },
  {
    heading: "Nota Emigro (fact-check)",
    section_kind: "official",
    paragraphs: [
      "Разбор ключевых утверждений. **OK** = Agenzia delle Entrate / istruzioni AA4/8; **soft** = практика Milano 2025–2026; **fixed** = смягчено.",
    ],
    bullets: [
      "OK: codice fiscale запрашивается modello **AA4/8** в любом ufficio territoriale Agenzia delle Entrate или через rappresentanza diplomatico-consolare italiana за рубежом ([istruzioni AA4/8 EN](https://www.agenziaentrate.gov.it/portale/documents/20143/278995/Instructions+on+how+to+fill+in+this+form_AA4_8_istruzioni_ING.pdf)).",
      "OK: для extra-UE допустимы passaporto, permesso di soggiorno или attestazione consolare ([guida stranieri Entrate](https://www.agenziaentrate.gov.it/portale/web/guest/schede/comunicazioni/focus/codice_fiscale/codice-fiscale-stranieri) — soft: URL раздела может меняться, ищите «codice fiscale stranieri» на portale).",
      "OK: присвоение CF **бесплатно** при личной подаче; платные посредники — услуга удобства, не госпошлина.",
      "OK: все три URL из official_links открыты 06.09.2026; PDF AA4/8 подтверждает подачу лично, через delegato или через итальянское представительство для residenti all’estero.",
      "Fixed: «codice fiscale = NIE Испании» → разные страны, формы и органы; в Италии это **codice fiscale**, не NIE.",
      "Fixed: «можно жить месяц без CF» → без номера стопорятся банк, contratto luce, stipendio и SSN.",
      "Fixed: не «Questura иногда присваивает CF»: официальный портал Entrate указывает Questura для заявителей на rilascio/rinnovo permesso и SUI для lavoro/ricongiungimento; AA4/8 в Entrate — маршрут для тех, кому код ещё не присвоен.",
      "Soft: срок пластиковой tessera sanitaria — недели; **номер CF действует сразу** после certificato на бумаге.",
      "UNCHECKED: точный список uffici Entrate Milano с walk-in без appuntamento на дату публикации — проверьте [sportello Entrate](https://www.agenziaentrate.gov.it/portale/) перед поездкой.",
    ],
  },
  {
    heading: "Официально: codice fiscale и modello AA4/8",
    section_kind: "official",
    paragraphs: [
      "Codice fiscale — постоянный идентификатор физлица в отношениях с PA и банками. Один номер на всю Италию: CF, выданный в Milano, действует в Como, Torino или Roma. Для граждан extra-UE базовый маршрут — **AA4/8** + valido documento di identità в Agenzia delle Entrate.",
      "Quadro A, sezione II, tipo richiesta «1» — attribuzione codice fiscale. Укажите tipologia richiedente по таблице в istruzioni (straniero extra-UE, comunitario, minore и т.д.). Форма должна быть **подписана** richiedente; без firma — nulla.",
      "Нерезидент может подать AA4/8 в consolato italiano в стране проживания ([identificazione diretta — Entrate](https://www.agenziaentrate.gov.it/portale/schede/pagamenti/imposta-sulle-transazioni-finanziarie/non-residenti-imposta-transazioni-finanziarie/identificazione-diretta-cittadini)) или через delegato в Italia. Для relocant с visto D / permesso логичнее получить CF в первую неделю в Lombardia.",
      "Итальянский адрес заранее не является универсальным условием attribuzione: residenti all’estero заполняют зарубежный адрес/налоговый domicilio по istruzioni. Представитель не обязателен — delegato возможен, но direct application остаётся базовым путём. Это не NIE-аналог и не запись в anagrafe.",
    ],
    bullets: [
      "AA4/8 — скачать с portale Entrate; заполнить блок attribuzione.",
      "Passaporto + копия; permesso или ricevuta kit postale — если уже есть.",
      "Certificato di attribuzione — используйте сразу для banca e contratti.",
      "Tessera sanitaria — отдельный запрос или автоматически при iscrizione SSN.",
      "SPID/CIE — онлайн-сервисы Entrate **после** присвоения CF, не вместо первого визита.",
      "Partita IVA — только если открываете attività autonoma; личный CF нужен раньше.",
    ],
  },
  {
    heading: "Extra-UE vs UE: кто и когда подаёт AA4/8",
    section_kind: "official",
    paragraphs: [
      "Граждане **UE/SEE** могут запросить CF в Entrate с carta d'identità или passaporto UE; для soggiorno >3 mesi часто нужен также регистрационный контур Comune. **Extra-UE** с visto nazionale или permesso: passaporto + permesso (o ricevuta postale kit) + AA4/8.",
      "Questura присваивает CF при rilascio/rinnovo permesso, а SUI — в track lavoro subordinato/ricongiungimento. Если к бытовым шагам код ещё не присвоен, AA4/8 в Entrate остаётся отдельным официальным маршрутом; сначала проверьте, нет ли уже codice provvisorio, чтобы не создать doppio CF.",
      "С consolato: россияне в РФ/не в Италии могут запросить CF до переезда для покупки жилья или банка — motivazione в AA4/8 («apertura conto», «locazione»). Для satellite-track Milano чаще нужен CF **в первые 72 часа** после прилёта в MXP/LIN.",
    ],
    bullets: [
      "UE — AA4/8 + documento UE; TEAM для краткого SSN по правилам Paese UE.",
      "Extra-UE — passaporto + visto/permesso/ricevuta kit.",
      "Minori — отдельный AA4/8 через genitore.",
      "Consolato italiano — CF до въезда (soft: сроки 1–4 settimane по Paese).",
      "Attestazione consolare RU — альтернатива passaporto по istruzioni AA4/8 (soft).",
    ],
  },
  {
    heading: "Milano и Nord: ufficio Entrate на практике",
    section_kind: "action_guide",
    paragraphs: [
      "В Lombardia uffici Entrate распределены по territorio: Milano città, Monza, Bergamo, Como — **CF национальный**, можно ехать в соседний comune, если ближе запись. Адрес и orari — только с [portale Entrate](https://www.agenziaentrate.gov.it/); не копируйте устаревшие улицы из Telegram.",
      "**72 ore после MXP/LIN:** скачайте AA4/8, соберите passaporto + копии, проверьте appuntamento или policy walk-in ближайшего ufficio. Como и Monza иногда менее загружены, чем centro Milano — soft, не гарантия.",
      "Patronato или CAF могут бесплатно помочь с compilazione AA4/8 — полезно, если итальянский слабый; firma остаётся вашей.",
    ],
    bullets: [
      formatPracticeBullet({
        channels: ["milanru", "forum_italy"],
        period: "2025–2026",
        claim:
          "релоканты получали certificato codice fiscale в Entrate Monza или Bergamo при отсутствии slot в Milano centro",
        forReader: "расширяйте поиск uffici по provincia Lombardia, CF не «миланский» по сути",
      }),
      "Appuntamento — проверьте на portale; walk-in soft зависит от ufficio.",
      "Certificato — сфотографируйте в cloud в день выдачи.",
      "Имя в AA4/8 = passaporto латиницей; расхождение ломает banca KYC.",
      "Como/Nord — тот же AA4/8; satellite geo, не второй hub.",
    ],
  },
  {
    heading: "Что нельзя в неделю 1 без codice fiscale",
    section_kind: "practice",
    paragraphs: [
      "Schengen 90/180 даёт право **краткого пребывания**, не заменяет CF для быта. Без codice fiscale типичные блокировки в Milano:",
    ],
    bullets: [
      "Conto corrente IT IBAN — банки обязаны записать CF ([Banca d'Italia framework KYC](https://www.bancaditalia.it/)).",
      "Contratto luce/gas — см. [SIM/luce Milano](/notes/" + SIM_LUCE_SLUG + ").",
      "Long-term locazione — agency просят CF на registrato ([Idealista Milano](/notes/" + ARENDA_SLUG + ")).",
      "Stipendio in Italia — datore и INPS требуют CF.",
      "Iscrizione SSN / medico — [SSN tessera](/notes/" + MEDITSINA_SLUG + ") после CF и residenza.",
      "Revolut/Wise — иногда открывают с CF, но domiciliazione renta к 4–6 мес. часто просит local IBAN.",
    ],
  },
  {
    heading: "К 4–6 месяцу: хвост без CF или с ошибкой в AA4/8",
    section_kind: "gap",
    paragraphs: [
      "Отложить CF «на второй mes» кажется терпимым в Airbnb, но к **4–6 месяцу** накапливаются renta без domiciliazione, modello F24, INPS и SSN. Исправление опечатки в anagrafica Entrate — повторный визит или PEC.",
    ],
    bullets: [
      "Sin CF — renta только transfer; agency недовольны.",
      "CF с ошибкой cognome — блок KYC banca e contratto lavoro.",
      "Sin tessera sanitaria — частная assicurazione visado истекает.",
      "Doppio CF — редко, но проверьте перед AA4/8, не запрашивайте второй.",
      "Копировать NIF/Finanças PT — wrong form, lost weeks.",
    ],
  },
  {
    heading: "Типичные ошибки codice fiscale в Milano",
    section_kind: "practice",
    paragraphs: [
      "Большинство повторных визитов — неверное имя, отсутствие firma или ожидание «CF дадут с permesso» без параллельного AA4/8.",
    ],
    bullets: [
      "Ошибка: ждать permesso plastica для CF — ricevuta kit + passaporto достаточны для AA4/8.",
      "Ошибка: путать CF и Partita IVA autonomo.",
      "Ошибка: не сохранить certificato PDF — банк просит в день открытия.",
      "Ошибка: consolato Barcelona для RU в Lombardia — district Milano: [milan.mid.ru](https://milan.mid.ru/ru/general-consulate/genkonsulstvo/consul-district/).",
      formatPracticeBullet({
        channels: ["digital_nomad_Italiya"],
        period: "2025–2026",
        claim:
          "DNV и elective residence требуют CF до contratto locazione и polizza sanitaria",
        forReader: "CF — до permesso kit, не после «когда разберусь»",
      }),
      "Ошибка: платить посреднику «госпошлину €200» — AA4/8 в Entrate бесплатно.",
    ],
  },
  {
    heading: "Wizard и Assist",
    section_kind: "practice",
    paragraphs: [
      "Если visto D, nomade digitale или lavoro subordinato переплетены, прогоните маршрут через [Emigro Wizard Italia](/ru/italy/wizard?utm_source=emigro&utm_medium=guide&utm_campaign=codice-fiscale-milano&utm_content=" +
        CODICE_FISCALE_SLUG +
        "). Для аудита порядка CF → kit → banca — [Route Check Assist €129](/ru/assist?utm_source=emigro&utm_medium=guide&utm_campaign=codice-fiscale-milano&utm_content=" +
        CODICE_FISCALE_SLUG +
        ").",
    ],
    bullets: [
      "[Первые 30 дней](/notes/" + PERVYE_30_SLUG + ") — orchestrator.",
      "[Permesso Questura](/notes/" + PERMESSO_SLUG + ") — kit postale 8 giorni.",
      "[Банк IBAN](/notes/" + BANK_SLUG + ") — после certificato CF.",
    ],
  },
];

const keyTakeaways = [
  "Официально: codice fiscale присваивается по modello AA4/8 в Agenzia delle Entrate или consolato; бесплатно при личной подаче.",
  formatPracticeTakeaway({
    channels: ["milanru", "forum_italy"],
    period: "2025–2026",
    claim: "типичный порядок Milano: AA4/8 в Entrate в неделю 1, до или параллельно kit postale permesso",
    forReader: "certificato CF нужен для banca, luce и contratto — не ждите plastica permesso",
  }),
  "Расхождение: «CF дадут в Questura» vs необходимость отдельного AA4/8 в Entrate для банка в первые дни.",
  "На практике: без codice fiscale к 4–6 месяцу стопорятся domiciliazione renta, INPS и SSN — см. sibling guides.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Codice fiscale — это то же, что NIE в Испании?",
    a: "По правилам — нет: codice fiscale итальянский, NIE испанский. На практике оба нужны для банка и налогов, но форма AA4/8 ≠ EX-15.",
  },
  {
    q: "Можно получить CF без permesso di soggiorno?",
    a: "По правилам AA4/8 — да, с passaporto и motivazione; extra-UE с visto часто получают CF до kit postale. На практике банк может просить ricevuta permesso для resident account.",
  },
  {
    q: "Где подать AA4/8 в Milano?",
    a: "По правилам — любой ufficio territoriale Entrate в Italia. На практике проверьте appuntamento на agenziaentrate.gov.it; Como/Monza иногда быстрее centro (soft).",
  },
  {
    q: "Нужен ли CF для Revolut?",
    a: "По правилам итальянские банки/fintech часто требуют CF для onboarding IT. На практике Wise/Revolut могут принять CF certificato; domiciliazione renta к 4–6 мес. часто просит local IBAN.",
  },
  {
    q: "Можно ли получить CF в консульстве до переезда?",
    a: "По правилам — да, через rappresentanza italiana за рубежом. На практике для satellite-track Milano чаще оформляют в Entrate в первую неделю после MXP.",
  },
];

export const CODICE_FISCALE_GUIDE = {
  slug: CODICE_FISCALE_SLUG,
  category: "Налоги",
  content_kind: "guide" as ContentKind,
  title: "Codice fiscale в Milano: AA4/8 и Agenzia Entrate 2026",
  excerpt:
    "Codice fiscale Milano 2026: modello AA4/8, Agenzia delle Entrate, extra-UE vs UE, consolato и Questura. Что блокируется в неделю 1 без CF — банк, luce, contratto. Nord и Como в том же satellite.",
  seo_title: "Codice fiscale Milano 2026 — AA4/8 Италия",
  seo_description:
    "Codice fiscale Milano 2026: AA4/8, Agenzia Entrate, extra-UE, consolato, Questura. Не NIE. Что нельзя без CF в неделю 1 — банк, luce, stipendio. Como/Nord.",
  quick_answer:
    "Codice fiscale в Италии запрашивается modello AA4/8 в Agenzia delle Entrate (или consolato italiano за рубежом) с passaporto; для extra-UE допустимы permesso или ricevuta kit postale. Номер нужен для банка IT IBAN, contratto luce, locazione и SSN — это не NIE Испании. В Milano проверьте ufficio Entrate на agenziaentrate.gov.it; CF действует по всей стране, включая Como. Без CF в первый mes стопорятся KYC; к 4–6 месяцу — renta и INPS.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "Agenzia delle Entrate", url: "https://www.agenziaentrate.gov.it/" },
    {
      title: "Istruzioni modello AA4/8 (EN)",
      url: "https://www.agenziaentrate.gov.it/portale/documents/20143/278995/Instructions+on+how+to+fill+in+this+form_AA4_8_istruzioni_ING.pdf",
    },
    {
      title: "Identificazione diretta — cittadini",
      url: "https://www.agenziaentrate.gov.it/portale/schede/pagamenti/imposta-sulle-transazioni-finanziarie/non-residenti-imposta-transazioni-finanziarie/identificazione-diretta-cittadini",
    },
  ],
  topic_tags: ["codice_fiscale", "milano", "tax_id"],
  hashtags: buildNoteHashtags({
    topicTags: ["codice_fiscale", "milano", "tax_id"],
    contentKind: "guide",
    extra: ["aa48", "entrate", "satellite"],
  }),
  source_channel: "milanru+forum_italy+digital_nomad_Italiya",
  source_label: "editorial:italy-seed",
};

export default CODICE_FISCALE_GUIDE;
