/**
 * Hand-curated Italy satellite guide — consolato RF Milano / Lombardia.
 * GKS Milano jurisdiction; queue, passport, apostille practice.
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import {
  formatPracticeBullet,
  formatPracticeTakeaway,
} from "@/lib/community-notes/practice-format";
import type { CommunityNoteFaq, ContentKind, GlossaryTerm, NoteBodySection } from "@/lib/community-notes/types";

export const ZAPIS_KONSULSTVO_IT_SLUG = "zapis-konsulstvo-italiya-pasport-2026";

const PERVYE_30_SLUG = "pervye-30-dnej-v-italii-satelit-2026";
const PERMESSO_SLUG = "permesso-questura-milano-2026";
const CODICE_FISCALE_SLUG = "codice-fiscale-milano-2026";
const BANK_SLUG = "bank-iban-nerezident-italiya-2026";

const GLOSSARY: GlossaryTerm[] = [
  { pt: "GKS Milano", ru: "Генеральное консульство РФ в Милане; Via Sant'Aquilino 3 — не Barcelona и не Посольство Рим" },
  { pt: "Area consolare", ru: "консульский округ: Lombardia, Piemonte, Veneto и др. — см. milan.mid.ru" },
  { pt: "kdmid / milan.kdmid.ru", ru: "электронная запись на приём в ГКС Milano" },
  { pt: "zp.midpass.ru", ru: "портал заявления на биометрический загранпаспорт 10 лет" },
  { pt: "passportzu.kdmid.ru", ru: "портал заявления на загранпаспорт 5 лет (без биометрии)" },
  { pt: "Доверенность (procura)", ru: "нотариальная доверенность в РФ или через консул — отдельная услуга и слот" },
  { pt: "Аpostille", ru: "апостиль на документы РФ — до выезда или через консульский канал; итальянские — Ministero Giustizia" },
  { pt: "Certificato di residenza", ru: "справка о регистрации в Comune di Milano — часто просят в пакете на загран" },
];

const DISCLAIMER =
  "**Emigro — не юридическая консультация.** Порядок записи, перечень документов и сроки изготовления **меняются** MID/kdmid. Актуальные инструкции — [milan.mid.ru](https://milan.mid.ru/) и [kdmid.ru](https://www.kdmid.ru/docs/italy/russian-consular-offices/). Это satellite-гайд для Milano и Nord; не путайте с консульством Испании (Barcelona) или визовым центром Италии.";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(
      GLOSSARY,
      "GKS Milano, kdmid и «консульство в Барcelona» — три разных адреса в одном чате @milanru. Разберём до истечения pasporta на фоне permesso en trámite."
    ),
    paragraphs: [DISCLAIMER],
  },
  {
    heading: "Nota Emigro (fact-check)",
    section_kind: "official",
    paragraphs: [
      "Разбор для граждан РФ в Milano/Lombardia. **OK** = kdmid / milan.mid.ru; **soft** = поле 2025–2026; **fixed** = смягчено. Не consular advice — cita y documentos en sitio oficial al día de reserva.",
    ],
    bullets: [
      "OK: Lombardia и Milano city — **ГКС Milano** (не Barcelona, не Genova для Lombardia) — [kdmid.ru consulados Italia](https://www.kdmid.ru/docs/italy/russian-consular-offices/).",
      "OK: территория ГКС Milano — Lombardia, Piemonte, Veneto, Friuli-Venezia Giulia, Valle d'Aosta, Trentino-Alto Adige, Emilia-Romagna **кроме** Ferrara, Ravenna, Forlì-Cesena, Rimini (последние — Посольство Рим) — [milan.mid.ru area consolare](https://milan.mid.ru/it/consolato-generale/genkonsulstvo/consul-district/).",
      "OK: адрес ГКС Milano — Via Sant'Aquilino, 3, 20148 Milano; приём пн–пт 09:00–12:45 (kdmid).",
      "OK: запись — **строго по предварительной записи** на сайте ГК или через визовый центр (milan.mid.ru).",
      "OK: электронная запись — **milan.kdmid.ru** (система kdmid).",
      "Fixed: «загран в Barcelona, я живу в Milano» → **ошибка округа**; для Lombardia — только Milano GKS.",
      "Soft: слот на первый приём — 2–6 недель мониторинга milan.kdmid.ru (поле @milanru 2025–2026).",
      "UNCHECKED: apostille документов РФ **из** Италии — лимиты консульства; многие docs apostillati в РФ до выезда.",
      "UNCHECKED: граждане **Беларуси** в Lombardia — отдельный консульский округ (Посольство РФ в Риме / другие учреждения); **не проверяли** актуальную привязку BY→Milano vs Roma — уточните на kdmid.ru до записи.",
    ],
  },
  {
    heading: "Официально: округ ГКС Milano и где оформлять загран",
    section_kind: "official",
    paragraphs: [
      "Граждане РФ, зарегистрированные или фактически проживающие в **Lombardia** (Milano, Monza, Bergamo, Como и др.), обслуживаются **Генеральным консульством РФ в Милане**, а не ГКС Barcelona, Genova или Palermo ([kdmid.ru — учреждения в Италии](https://www.kdmid.ru/docs/italy/russian-consular-offices/)).",
      "Консульский округ Milano шире Lombardia: Piemonte (Torino), Veneto (Venezia), Friuli, Valle d'Aosta, Trentino и большая часть Emilia-Romagna. Если вы арендуете в [Como/Lecco](/notes/milano-rajony-arenda-metro-como-2026) — всё равно **Milano GKS**, не Genova.",
      "Биометрический загранпаспорт 10 лет — формуляр **zp.midpass.ru**; паспорт 5 лет — **passportzu.kdmid.ru** (стандартная consular practice; подтвердите в инструкции на день записи). Подача **лично**; выдача — второй визит.",
      "Доверенности, справки, легализация некоторых документов — отдельные услуги с отдельной записью. **Apostille** на документы **итальянские** (certificato residenza, contratto) — через Ministero della Giustizia / portale apostille; документы **российские** — apostille в РФ до выезда или consular channel (**UNCHECKED** детали лимитов из Италии).",
    ],
    bullets: [
      "GKS Milano — Via Sant'Aquilino, 3; tel. +39 02 487 504 32 (kdmid).",
      "Посольство Рим — остальные области Италии вне округа Milano/Genova/Palermo.",
      "Запись — milan.kdmid.ru или vhs-italy.com (kdmid).",
      "Биометрия 10 лет — zp.midpass.ru.",
      "5 лет — passportzu.kdmid.ru.",
      "Certificato di residenza Comune — для пакета на загран (soft: проверьте список на milan.mid.ru).",
    ],
  },
  {
    heading: "Запись из Milano: очередь и подтверждение",
    section_kind: "practice",
    paragraphs: [
      "Система **milan.kdmid.ru** — выберите услугу «загранпасport» / biometria по portal. Мониторинг 1–2 раза в день: слоты появляются нерегулярно; @milanru и @forum_italy описывают **2–6 недель** ожидания первого slot.",
      "После бронирования — письма подтверждения; проверьте spam. Участники чата 2025–2026 иногда сообщают о сбоях email — сохраните screenshot «статус записи» в kdmid.",
      "Не платите посредникам «запись без очереди» — риск мошенничества и отказа на входе в GKS. Только легальные alert-сервисы, где **вы сами** бронируете на kdmid.",
      "Дорога до Sant'Aquilino 3: метро M1/M2 + пешком; парковка ограничена. Приезжайте за 20–30 мин до времени записи — контроль доступа.",
    ],
    bullets: [
      "Монитор milan.kdmid.ru 1–2 сессии/день.",
      "Подтверждение email — сохраните PDF/screenshot.",
      "Минимум **два** визита — подача + выдача.",
      "Не scalpers очереди — fixed policy Emigro.",
      formatPracticeBullet({
        channels: ["milanru", "forum_italy"],
        period: "2025–2026",
        claim:
          "slot первой записи GKS Milano из Lombardia обычно 2–6 недель мониторинга — полный цикл заграна 2–4 месяца",
        forReader:
          "начинайте очередь за 6–9 месяцев до expiry, если параллельно [permesso en trámite](/notes/" + PERMESSO_SLUG + ")",
      }),
    ],
  },
  {
    heading: "Загран, доверенности и apostille к месяцу 4–6",
    section_kind: "practice",
    paragraphs: [
      "Месяц 4–6 в Milano совпадает с permesso en trámite, поездками «в РФ» или истечением срока заграна. Просроченный pasport с ricevuta permesso — выезд за пределы Schengen осложнён; продление РФ **не ждёт** «пока дадут plastica permesso».",
      "Нотариальная **доверенность** на представление по имуществу/банку в РФ — отдельная запись GKS; перевод и legalizzazione по назначению. Гражданские документы РФ — consular routes ограничены (**UNCHECKED** сроки из Milano).",
      "Итальянские документы (certificato residenza, contratto locazione) для консульства РФ — копия + при необходимости sworn translation на русский.",
      "Apostille IT — sede elettronica Giustizia; планируйте, если документ нужен в РФ к определённой дате.",
    ],
    bullets: [
      "Expiry заграна <12 месяцев — начинайте очередь сейчас.",
      "Ricevuta permesso + старый pasport — авиакомпания может отказать в boarding.",
      "Доверенность — отдельная cita; notaio IT не заменяет GKS.",
      "Apostille RU docs — UNCHECKED из Италии.",
      "Несовершеннолетние — оба родителя или нотариальное согласие.",
    ],
  },
  {
    heading: "Где sede и практика расходятся",
    section_kind: "gap",
    paragraphs: [
      "«К 4–6 месяцу» многие откладывают загран «до декабря» или путают **консульство Италии** (visto D) с **консульством РФ** (pasport). Это разные здания, очереди и сайты.",
      "Форумы иногда советуют ехать в Barcelona GKS «там быстрее» — для жителя Lombardia это **не ваш округ** и может привести к отказу в приёме.",
      "Email подтверждения — иногда не приходит; статус только в milan.kdmid.ru.",
    ],
    bullets: [
      "Официально: GKS Sant'Aquilino 3 — pasporta округа Lombardia+. На практике: slot 2–6 нед. мониторинга.",
      "Официально: приём 09:00–12:45. На практике: приходите раньше — контроль доступа.",
      "«Купить turno» — частая мошенничество @milan_4at.",
      "Обработка bio 10 лет — soft до 3 месяцев; не планируйте поездку без valid pasport.",
      "К 4–6 месяцу: expiry <6 мес. — **cola уже сейчас**, не «после permesso plastica».",
    ],
  },
  {
    heading: "Типичные ошибки релокантов в Milano",
    section_kind: "practice",
    paragraphs: [
      "Большинство срывов — ожидание последнего месяца expiry, путаница consolato IT vs GKS RF, отсутствие копии внутреннего паспорта РФ, поездка в Barcelona «за заграном».",
    ],
    bullets: [
      "Ошибка: записать pasport «после permesso» — expiry пересекается с trámite.",
      "Ошибка: ехать в GKS Barcelona, живя в Milano — **неверный округ**; ваш — [milan.mid.ru](https://milan.mid.ru/).",
      "Ошибка: форма midpass без штрих-кода — возврат, новая очередь.",
      "Ошибка: неполный пакет — не принимают частично.",
      "Ошибка: путать exteriores.gob.es / visto IT с mid.ru pasport RF.",
      "Ошибка: один визит — выдача требует второго.",
      formatPracticeBullet({
        channels: ["milan_4at"],
        period: "2025–2026",
        claim: "релоканты теряли slot, путая milan.kdmid.ru с barcelona.kdmid.ru",
        forReader: "bookmark только milan.kdmid.ru для Lombardia",
      }),
    ],
  },
  {
    heading: "К 4–6 месяцу: что нельзя откладывать до конца года",
    section_kind: "practice",
    paragraphs: [
      "К **4–6 месяцу**: если загран истекает через <6 месяцев, **начинайте cola GKS сейчас** — полный цикл может превысить срок ricevuta permesso для поездок. Доверенности на банк/продажу в РФ, наследство — не откладывайте «на декабрь», если срок в РФ идёт.",
      "Продление pasporta несовершеннолетнего — оба родителя; планируйте каникулы с учётом переполненной очереди.",
      "Параллельно [permesso kit postale](/notes/" + PERMESSO_SLUG + ") — не отменяйте cita Questura из-за поездки в GKS без переноса.",
    ],
    bullets: [
      "Pasport — cola за 6–9 месяцев до expiry.",
      "Доверенность — отдельная cita к 4–6 мес., если операция в РФ.",
      "Apostille doc IT — недели Ministerio Giustizia.",
      "Permesso huellas/kit — приоритет, если visto короткий.",
      "Свидетельства ЗАГС РФ — UNCHECKED срок consular.",
    ],
  },
  {
    heading: "Wizard и Assist",
    section_kind: "practice",
    paragraphs: [
      "Консульство РФ — параллельно итальянским trámites, не заменяет permesso или [codice fiscale](/notes/" + CODICE_FISCALE_SLUG + "). Прогоните маршрут через [Emigro Wizard Italia](/ru/italy/wizard?utm_source=emigro&utm_medium=guide&utm_campaign=zapis-konsulstvo-milano&utm_content=" +
        ZAPIS_KONSULSTVO_IT_SLUG +
        "). Для аудита порядка permesso → pasport → banca — [Route Check Assist €129](/ru/assist?utm_source=emigro&utm_medium=guide&utm_campaign=zapis-konsulstvo-milano&utm_content=" +
        ZAPIS_KONSULSTVO_IT_SLUG +
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
  "Официально: Lombardia/Milano → GKS Milano (Via Sant'Aquilino 3); запись milan.kdmid.ru; приём пн–пт 09:00–12:45 (kdmid.ru).",
  formatPracticeTakeaway({
    channels: ["milanru", "forum_italy"],
    period: "2025–2026",
    claim:
      "из Milano slot GKS обычно требует недели мониторинга и два визита — подача и выдача",
    forReader:
      "бронируйте cola за 6–9 месяцев до expiry; не ждите permesso plastica",
  }),
  "Официально: biometría 10 лет zp.midpass.ru; 5 лет passportzu.kdmid.ru — подтвердить в cita.",
  "Расхождение: Barcelona GKS ≠ округ Milano; BY/другие гражданства — UNCHECKED district на kdmid.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Как записаться в консульство из Milano на паспорт?",
    a: "По правилам — очередь **milan.kdmid.ru** (GKS Milano, округ Lombardia). Формуляры zp.midpass.ru / passportzu.kdmid.ru до cita. На практике мониторинг 1–2 раза в день, slot часто 2–6 недель; подача лично в Via Sant'Aquilino 3.",
  },
  {
    q: "Можно ли оформить загран в Barcelona, если живу в Milano?",
    a: "По правилам kdmid — pasporta округа Lombardia через **GKS Milano**, не Barcelona. На практике приём в чужом округе может быть отклонён — не рискуйте сроком expiry.",
  },
  {
    q: "Сколько ждать очередь и изготовление?",
    a: "По правилам — срок выдачи по типу pasporta в consular instruction. На практике slot 2–6 недель + до ~3 месяцев bio — планируйте 2 визита.",
  },
  {
    q: "Что нельзя откладывать к 4–6 месяцу?",
    a: "По правилам — просроченный pasport ограничивает поездки. На практике к 4–6 мес.: продление заграна, доверенности РФ, apostille doc IT — cola GKS не ускоряется «к декабрю».",
  },
  {
    q: "Apostille российских документов из Италии?",
    a: "По правилам — зависит от типа doc и consular channel. **UNCHECKED** в этом гайде — уточните GKS/Ministero Giustizia; многие docs apostillati в РФ до выезда.",
  },
];

export const ZAPIS_KONSULSTVO_IT_GUIDE = {
  slug: ZAPIS_KONSULSTVO_IT_SLUG,
  category: "Консульство RF",
  content_kind: "guide" as ContentKind,
  title: "Запись в консульство RF из Milano: паспорт 2026",
  excerpt:
    "GKS Milano, cola milan.kdmid.ru, biometría zp.midpass.ru и сроки из Lombardia — что не откладывать к 4–6 месяцу, пока permesso en trámite. Не Barcelona.",
  seo_title: "Консульство паспорт Milano 2026 — GKS Lombardia",
  seo_description:
    "Запись на загранпаспорт RF из Milano: GKS Via Sant'Aquilino, milan.kdmid.ru, очередь 2–6 нед., два визита. Паспорт, доверенность, apostille — к 4–6 мес.",
  quick_answer:
    "Жители Milano и Lombardia обслуживаются **ГКС Milano** (Via Sant'Aquilino 3), **не** Barcelona. Запись — **milan.kdmid.ru**; биопаспорт 10 лет — **zp.midpass.ru**, 5 лет — **passportzu.kdmid.ru**. Подача и выдача лично, обычно **два** визита. Slot часто ловят **2–6 недель** мониторинга; полный цикл — до **2–4 мес.** Начинайте за **6–9 мес.** до expiry, особенно если [permesso](/notes/permesso-questura-milano-2026) en trámite. Округ шире Lombardia (Piemeonte, Veneto, Como). BY — **UNCHECKED** district на kdmid.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    {
      title: "kdmid.ru — consulados RF en Italia",
      url: "https://www.kdmid.ru/docs/italy/russian-consular-offices/",
    },
    {
      title: "GKS Milano — area consolare",
      url: "https://milan.mid.ru/it/consolato-generale/genkonsulstvo/consul-district/",
    },
    {
      title: "milan.kdmid.ru — запись",
      url: "https://milan.kdmid.ru/",
    },
    {
      title: "zp.midpass.ru — biometría 10 años",
      url: "https://zp.midpass.ru/",
    },
  ],
  topic_tags: ["consulado", "pasport", "milano", "rf"],
  hashtags: buildNoteHashtags({
    topicTags: ["consulado", "pasport", "milano"],
    contentKind: "guide",
    extra: ["kdmid", "zagran", "lombardia"],
  }),
  source_channel: "milanru+forum_italy+milan_4at",
  source_label: "editorial:italy-seed",
};

export default ZAPIS_KONSULSTVO_IT_GUIDE;
