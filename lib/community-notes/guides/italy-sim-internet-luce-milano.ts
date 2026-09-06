/**
 * Hand-curated Italy satellite guide — SIM/eSIM, home fiber, luce/gas in Milano.
 * Official ARERA / operator pages separated from field practice in RU chats.
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

export const SIM_LUCE_SLUG = "sim-internet-luce-milano-2026";

const CODICE_FISCALE_SLUG = "codice-fiscale-milano-2026";
const ARENDA_MILANO_SLUG = "arenda-milano-idealista-2026";
const BANK_IBAN_SLUG = "bank-iban-nerezident-italiya-2026";
const PERVYE_30_SLUG = "pervye-30-dnej-v-italii-satelit-2026";

const GLOSSARY_INTRO =
  "Эти слова всплывают в WindTre/Iliad, в bolletta luce и в переписке с locatore ещё до того, как вы разложили чемоданы в Milano. Разберём заранее — так проще не перепутать voltura с subentro и не ждать fibra там, где в palazzo нет rosetta.";

const LOCAL_TERMS: GlossaryTerm[] = [
  { pt: "POD", context: "Point of Delivery", ru: "код точки поставки электричества (14 символов); без него fornitore не оформит luce" },
  { pt: "PDR", context: "Punto di Riconsegna", ru: "код точки gas; аналог POD для metano" },
  { pt: "voltura", ru: "смена intestatario на активном contatore без отключения; быстрее subentro" },
  { pt: "subentro", ru: "включение supply, если contatore отключён или sigillato; дороже и дольше voltura" },
  { pt: "codice fiscale", ru: "итальянский налоговый код; нужен большинству operatori для contratto postpagato; требования конкретного prepaid-flow проверяют перед оплатой" },
  { pt: "domiciliazione bancaria", ru: "списание bollette с IBAN; типичное условие fibra postpagata и luce" },
  { pt: "mercato libero", ru: "свободный рынок энергии; тарифы сравнивают через portale ARERA, не «наугад у portiere»" },
  { pt: "eSIM", ru: "виртуальная SIM; у WindTre есть tourist eSIM online, у Iliad — resident flow с codice fiscale" },
];

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(LOCAL_TERMS, GLOSSARY_INTRO),
  },
  {
    heading: "Nota Emigro (fact-check)",
    section_kind: "official",
    paragraphs: [
      "Короткая сверка черновика с ARERA, ATS/operatori и нормами SIM — без вырезания полевой практики. **OK** = совпадает с официальной страницей; **soft** = ориентир рынка/чатов; **fixed** = смягчено под норму; **UNCHECKED** = не подтверждено fetch в этой сессии.",
    ],
    bullets: [
      "OK: ARERA — Autorità di regolazione per energia, reti e ambiente; portale consumatori с comparatore offerte e guide bolletta ([arera.it/consumatori](https://www.arera.it/it/consumatori)).",
      "OK / soft: voltura luce — tempo standard circa **5 giorni lavorativi** senza cambio fornitore; voltura gas circa **4 giorni** — сроки ARERA citati в guías operatori, не SLA Emigro.",
      "OK: dal **1° luglio 2026** voltura gas con **cambio fornitore** in un’unica richiesta (Delibera ARERA 323/2025/R/com) — stesso modello già attivo per luce; fonti settore energia, non inventato.",
      "OK: registrazione SIM prepagata — identificazione titolare obbligatoria (Decreto 144/2005); negozio scannerizza passaporto.",
      "OK: ARERA 323/2025/R/com подтверждает voltura gas с выбором нового fornitore с **1 luglio 2026**.",
      "OK: WindTre **Tourist Pass Digital** доступен как eSIM иностранцам без codice fiscale italiano; условия и срок действия проверяются на странице оператора.",
      "Fixed: убрана абсолютная фраза «Iliad всегда требует CF»: официальные страницы подтверждают identificazione, но найденная страница eSIM не подтверждает универсальное требование CF для каждого flow. Статус требования — **UNCHECKED** до checkout/negozio.",
      "UNCHECKED: costi esatti **derechos di allaccio** subentro luce BT per Milano — dipendono da potenza e stato contatore; non citare cifre fisse da blog.",
      "UNCHECKED: tempi fibra «48 h» Fastweb/TIM per ogni palazzo storico centro — verificare per **indirizzo**, non per quartiere.",
    ],
  },
  {
    heading: "Официально: mercato libero luce e gas (ARERA)",
    section_kind: "official",
    paragraphs: [
      "В Италии электричество и gas natural в квартире — contratto con **fornitore commerciale** (Enel, Edison, A2A, Plenitude, ecc.), а contatore обслуживает **distributore locale**. ARERA регулирует права потребителя: смена fornitore gratuita, понятные сроки voltura, comparatore offerte на [arera.it](https://www.arera.it/it/consumatori).",
      "Для релоканта в Milano ключевые codici — **POD** (luce) и **PDR** (gas) на bolletta предыдущего intestatario или через fornitore по indirizzo. **Voltura** — смена имени на активном supply: нужны codice fiscale, documento, titolo sull’immobile (contratto di locazione registrato или autocertificazione), IBAN se domiciliazione. **Subentro** — если contatore staccato: технические права и tempi другие.",
      "С **1 luglio 2026** для gas можно одновременно сделать voltura и **cambio fornitore** одним запросом новому venditore (Delibera ARERA 323/2025). Для luce такая unified procedure уже familiar рынку. Bonus sociali и tutela vulnerabilità — отдельные канali ARERA; extranjero без residenza обычно не попадает в bonus без ISEE italiano.",
    ],
    bullets: [
      "Comparatore offerte luce/gas — strumenti gratuiti ARERA sul portale consumatori.",
      "Voltura: POD/PDR, CF nuovo intestatario, lettura contatore, titolo immobile (locazione registrata).",
      "Cambio fornitore senza voltura — possibile se già sei intestatario; voltura + switch gas unificati dal 01/07/2026.",
      "Bolletta: voci ARERA «Come leggere la bolletta» — potenza impegnata, consumi, oneri di sistema.",
      "Reclami: servizio conciliazione ARERA prima del giudizio.",
    ],
  },
  {
    heading: "Официально: fibra e telefonia in casa",
    section_kind: "official",
    paragraphs: [
      "Домашний internet в Milano — **fibra FTTH** или FWA dove FO assente (TIM, Vodafone, WindTre, Fastweb, Iliad). Titular contratto — chi firma e domicilia; locatore non обязан essere in contratto se inquilino ha **codice fiscale**, documento e IBAN. Copertura проверяется по **via + civico**, не по «Isola trendy» в чате.",
      "Postpagato fibra + mobile richiede identificazione и часто **mandato SEPA**. Permanenza зависит от offerta — на сайтах есть piani senza vincolo. Se в квартире уже была fibra, **cambio intestatario** у того же operatore обычно проще полной installazione (soft; не SLA).",
      "Mobile: Decreto 144/2005 обязывает identificare titolare до attivazione. **Prepago** в negozio operator — passaporto; для contratto resident и конкретного Iliad-flow требования к CF проверяйте в checkout: универсальность CF для всех eSIM **UNCHECKED**.",
    ],
    bullets: [
      "Documenti tipici fibra: documento, codice fiscale, IBAN, email, telefono, indirizzo completo.",
      "Verifica copertura: siti TIM/Vodafone/Fastweb/Iliad — inserire indirizzo Milano.",
      "Iliad: attivazione via online/negozio/SIMbox с identificazione; CF зависит от flow и не заявлен здесь как универсальный факт.",
      "WindTre Tourist Pass: eSIM online per stranieri senza CF italiano (offerta turistica, non residente).",
      "Portabilità numero — separata da voltura luce; conservare PAC code.",
    ],
  },
  {
    heading: "Практика Milano: номер и eSIM в день прилёта",
    section_kind: "practice",
    paragraphs: [
      "MXP или центр — не место для «идеального» piano, но место, где вы перестаёte зависеть от roaming. Пока [codice fiscale](/notes/" +
        CODICE_FISCALE_SLUG +
        ") и IBAN в пути, разумный маршрут — **prepago** или **WindTre tourist eSIM** после идентификации, без обещаний «Iliad без CF».",
      "WindTre публикует tourist eSIM на английских страницах: покупка online, QR до landing. Iliad — value для residenti: после CF можно attivare in negozio o SIMbox; eSIM residente — flusso отдельный от tourist.",
      "После CF + IBAN можно сравнить resident contract или pacchetto fibra+mobile; до этого держите prepago для SMS banca и Questura.",
    ],
    bullets: [
      formatPracticeBullet({
        channels: ["milanru", "milan_4at", "forum_italy"],
        period: "2025–2026",
        claim:
          "в день прилёta в MXP покупали prepago TIM/Vodafone в tabaccheria с passaporto — linea attiva dopo ricarica",
        forReader:
          "берите оригинал passaporto; Iliad и contratto postpagato без CF откладывают на неделю 2–3",
      }),
      "WindTre Tourist eSIM: acquisto pre-arrivo su windtre.it (EN); validità legata al piano tourist, non rinnovo mensile Iliad.",
      "TIM/Vodafone prepago: passaporto in negozio; contratto postpagato — CF + IBAN.",
      "Evitare «SIM online senza registro» — linea può bloccarsi senza validazione titolare.",
      "Wi‑Fi Airbnb — не sustituto móvil для Questura и banca; нужен свой numero IT.",
      "eSIM travel (Airalo/Holafly) — мост до CF; не заменяет numero IT для lungo termine.",
    ],
  },
  {
    heading: "Практика: fibra, luce e gas dopo contratto di locazione",
    section_kind: "practice",
    paragraphs: [
      "Типовая последовательность после [аренды в Milano](/notes/" +
        ARENDA_MILANO_SLUG +
        "): рабочий **IBAN** → **voltura luce** (se contatore attivo) → **fibra** → **gas** se caldaia autonoma → verifica riscaldamento centralizzato (spese in condominio).",
      "На практике locatore иногда оставляет luce на себе — legal se in contratto, но для permesso e bollette прозрачнее intestatario inquilino. POD/PDR берут с bolletta precedente или chiedendo al portiere.",
      "Comparatore ARERA перед firma — не только «offerta del proprietario». Domiciliazione su [IBAN italiano](/notes/" +
        BANK_IBAN_SLUG +
        ") снижает rischio disdetta contratto.",
      "К месяцу 2–3 приходят prime bollette bimestrali gas e mensili luce; senza domiciliazione — rischio mora e solleciti.",
    ],
    bullets: [
      formatPracticeBullet({
        channels: ["milanru", "forum_italy"],
        period: "2025–2026",
        claim:
          "dopo CF + IBAN voltura luce Edison/A2A online занимала 3–7 giorni; subentro con contatore staccato — settimane e oneri tecnici",
        forReader:
          "chiedete bolletta vecchia al locatore prima dell'acta di consegna per POD/PDR",
      }),
      "Fibra: Fastweb/Iliad/TIM — appuntamento tecnico; in palazzi antichi Navigli/Brera ritardi rosetta.",
      "Potenza impegnata 3 kW — tipico monolocale; 4,5–6 kW per T2 con induzione e clima.",
      "Gas: se solo piano cottura elettrico — PDR può non servire; verificare caldaia e bolletta.",
      "Riscaldamento centralizzato: spese in bolletta condominiale, non voltura PDR individuale.",
      "Salvare PDF di ogni voltura — utili per permesso e contestazioni locazione.",
    ],
  },
  {
    heading: "Где portale ufficiale и чат расходятся",
    section_kind: "gap",
    paragraphs: [
      "Siti fornitori promettono «online in 5 minuti», а straniero senza CF finisce in negozio o call center. Non è rifiuto — altro KYC.",
      "В чатах «luce senza contratto registrato»; fornitore formalmente chiede titolo sull’immobile. Voltura a volte passa con solo indirizzo + CF, ma rischio richiesta contratto registrato resta.",
    ],
    bullets: [
      "«Iliad всегда требует CF» → identificazione обязательна, но требование CF зависит от выбранного flow; **UNCHECKED** до checkout (fixed).",
      "«Fibra 24 h ovunque a Milano» → palazzi senza CTO possono richiedere 1–2 settimane (soft).",
      "«Locatore paga sempre luce» → dipende da clausola contratto, non da ARERA.",
      "«Mercato libero sempre più caro» → comparatore ARERA mostra profili diversi; non universalizzare.",
      "«Gas uguale a luce per tempi» → fino al 2026 gas voltura + switch erano due passi; dal 07/2026 unificati (OK ARERA).",
      "«Revolut IBAN basta per tutto» → alcuni operatori richiedono conto italiano per domiciliazione; verificare (UNCHECKED per ogni fornitore).",
    ],
  },
  {
    heading: "Типичные ошибки и сроки",
    section_kind: "practice",
    paragraphs: [
      "Большинство срывов в первом месяце — не «italiana burocrazia», а tipo sbagliato: **subentro** invece di **voltura**, fibra postpagata senza IBAN, o luce «per dopo» mentre contatore gira a nome precedente.",
      "Порядок первых недель — в [первые 30 дней Италии](/notes/" +
        PERVYE_30_SLUG +
        "); здесь — utilities dopo chiavi.",
    ],
    bullets: [
      "Ошибка: subentro quando serve voltura — pagate diritti tecnici extra.",
      "Ошибка: fibra postpagata senza CF/IBAN — contratto cade; prepago + Wi‑Fi temporaneo.",
      "Ошибка: non chiedere POD/PDR al locatore — ritardo 1–2 settimane.",
      "Ошибка: credere che riscaldamento centralizzato sia «luce» — è spesa condominiale.",
      "Ошибка: roaming per SMS banca — blocchi 2FA; numero IT prepago registrato.",
      "Ошибка: firmare offerta luce 24 mesi senza leggere penali — costoso prima del trasloco quartiere.",
    ],
  },
  {
    heading: "К 4–6 месяцу: что откладывают и чем бьёт",
    section_kind: "practice",
    paragraphs: [
      "К 4–6 месяцу в Milano у релоканта уже permesso/residenza, lavoro или partita IVA, и привычка pagare bollette. Именно тогда всплывает «мелочь» месяца 1: luce restata sul locatore, prepago non portato, vincolo fibra, gas ancora intestato al precedente inquilino.",
      "К 4–6 месяцу banca e busta paga richiedono domiciliazione su IBAN IT; scenario solo Revolut può rompersi su utilities. Rifare voltura — nuovo expediente.",
      "Se il percorso visto non coincide con indirizzo e utenze — [wizard Emigro](https://www.emigro.online/ru/italy/wizard) e [Assist Route Check](https://www.emigro.online/ru/assist?utm_source=emigro&utm_medium=guide&utm_campaign=milano_home_setup).",
    ],
    bullets: [
      "К 4–6 месяцу: luce sul locatore — più difficile dimostrare dimora abituale per pratiche.",
      "К 4–6 месяцу: prepago senza portabilità — perdi numero legato a banca e SMS Questura.",
      "К 4–6 месяцу: vincolo fibra/luce — penale se trasferisci in altro municipio.",
      "К 4–6 месяцу: mora su bolletta gas intestata ad altri — solleciti e pressione locatore.",
      "К 4–6 месяцу: potenza 3 kW insufficiente con clima estivo — saltano salvavita.",
    ],
  },
];

const keyTakeaways = [
  "Официально: ARERA regola diritti su luce/gas; voltura su POD/PDR con titolo immobile; dal 07/2026 voltura gas + switch in un passo.",
  formatPracticeTakeaway({
    channels: ["milanru", "forum_italy"],
    period: "2025–2026",
    claim:
      "giorno 1 — prepago o WindTre tourist eSIM; settimana 2–4 dopo CF+IBAN — voltura luce e fibra",
    forReader:
      "non confondere subentro con voltura — altrimenti oneri tecnici in prima bolletta",
  }),
  "Расхождение: «любая eSIM без документов» vs обязательная identificazione; WindTre Tourist Pass отдельно подтверждён для иностранцев без CF.",
  "На практике: к 4–6 месяцу больнее всего intestatario «на потом» e prepago senza portabilità — chiudete luce/gas/fibra a vostro nome prima della routine permesso.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Можно ли получить итальянский номер в день прилёта без codice fiscale?",
    a: "По правилам prepago регистрируется на passaporto в punto vendita (Decreto 144/2005). На практике в Milano покупают prepago TIM/Vodafone в tabaccheria; WindTre tourist eSIM — online con passaporto; Iliad e contratto postpagato ждут CF.",
  },
  {
    q: "Voltura или subentro для luce в квартире с активным contatore?",
    a: "По правилам ARERA при contatore attivo и solo cambio nome — **voltura** (~5 giorni lavorativi). На практике chiedete bolletta con POD al locatore; subentro только если supply staccato.",
  },
  {
    q: "На чьё имя оформлять luce и fibra?",
    a: "По правилам intestatario può essere inquilino con titolo sull’immobile e CF. На практике locatore a volte resta intestatario luce — verificate clausola contratto; per permesso прозрачнее titolarità propria.",
  },
  {
    q: "Нужен ли IBAN italiano для domiciliazione bollette?",
    a: "По правилам fornitori richiedono conto per addebito diretto. На практике molti accettano IBAN IT da banca locale; conti esteri — verificare per operatore (soft/UNCHECKED).",
  },
  {
    q: "Что будет к 4–6 месяцу, если не оформить utilities?",
    a: "По правилам mora e solleciti possono portare a limitazione supply. На практике к 4–6 месяцу debiti su nome precedente e assenza domiciliazione complicano rinnovo permesso e cambio appartamento.",
  },
];

export const SIM_LUCE_GUIDE = {
  slug: SIM_LUCE_SLUG,
  category: "Связь и ЖКХ",
  content_kind: "guide" as ContentKind,
  title: "SIM, eSIM, интернет и luce/gas в Milano: 2026",
  excerpt:
    "Prepago и WindTre tourist eSIM в день прилёта, fibra на inquilino, voltura luce/gas по POD/PDR и comparatore ARERA — порядок для Milano без выдуманных тарифов 2026.",
  seo_title: "SIM и интернет Milano: luce 2026",
  seo_description:
    "SIM, eSIM и fibra в Milano 2026: prepago день 1, voltura luce ARERA, gas dal 07/2026, codice fiscale и IBAN. Практика RU-релокантов в Lombardia.",
  quick_answer:
    "В Milano в день прилёта — prepago в punto vendita с passaporto или WindTre Tourist Pass eSIM online. Fibra и luce оформляют на intestatario с codice fiscale и платёжным методом; при активном contatore — voltura по POD, не subentro. Gas: PDR; с 1 июля 2026 voltura и выбор нового fornitore объединены. Сравнивайте offerte через ARERA; требования Iliad к CF проверяйте в выбранном flow.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "ARERA — portale consumatori", url: "https://www.arera.it/it/consumatori" },
    { title: "ARERA — delibera 323/2025/R/com", url: "https://www.arera.it/atti-e-provvedimenti/dettaglio/25/323-25" },
    { title: "WINDTRE — Tourist Pass Digital", url: "https://www.windtre.it/offerte-per-turisti-in-italia/tourist-pass-digital-en" },
    { title: "Legge 431/1998 — locazioni (contesto titolo immobile)", url: "https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:1998-07-09;431" },
  ],
  topic_tags: ["sim", "internet", "utilities", "milano", "italy"],
  hashtags: buildNoteHashtags({
    topicTags: ["sim", "internet", "utilities", "milano", "italy"],
    contentKind: "guide",
    extra: ["luce", "esim", "voltura", "fibra", "codice_fiscale"],
  }),
  source_channel: "milanru+milan_4at+forum_italy",
  source_label: "editorial:italy-seed",
  pillar_guide_slug: PERVYE_30_SLUG,
};
