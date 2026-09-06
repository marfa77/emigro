/**
 * Hand-curated Spain satellite guide — bank IBAN non-resident Valencia.
 * Banco de España / SEPA rules separated from branch KYC practice.
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import {
  formatPracticeBullet,
  formatPracticeTakeaway,
} from "@/lib/community-notes/practice-format";
import { NIE_EMPADRONAMIENTO_SLUG } from "@/lib/community-notes/guides/spain-nie-empadronamiento-poryadok";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const BANK_IBAN_SLUG = "bank-iban-nerezident-ispaniya-2026";

const GLOSSARY_INTRO =
  "Слова из отделения CaixaBank или Santander, KYC-анкеты и письма Hacienda — разберём до визита, пока менеджер не попросил certificado de empadronamiento, которого ещё нет.";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(glossaryForSlug(BANK_IBAN_SLUG)!, GLOSSARY_INTRO),
  },
  {
    heading: "Nota Emigro (fact-check)",
    section_kind: "official",
    paragraphs: [
      "Разбор банковских мифов из чатов. **OK** = Banco de España / normativa; **soft** = sucursales Valencia; **fixed** = смягчено. Не финсовет — condiciones cuenta сверяйте в contrato bancario.",
    ],
    bullets: [
      "OK: KYC/PBC; NIE/resguardo EX-15 ([AT](https://sede.agenciatributaria.gob.es/)).",
      "OK: IBAN ЕС/SEPA — отказ только из-за страны IBAN незаконен (Reglamento UE 260/2012, art. 9; [BDE](https://clientebancario.bde.es/pcb/es/blog/discriminacion-de-iban-que-es-y-como-actuar-si-me-ocurre.html)).",
      "Fixed: «CaixaBank всегда откроет RU» → нет универсальной гарантии.",
      "Fixed: «Revolut нельзя» → при поддержке SEPA adeudo отказ только по IBAN незаконен; legacy-формы оспаривают письменно.",
      "Soft: KYC RU/BY — усиленный origen de fondos.",
    ],
  },
  {
    heading: "Официально: зачем ES IBAN и что проверяет банк",
    section_kind: "official",
    paragraphs: [
      "Cuenta bancaria en España открывается en entidad de crédito под надзором Banco de España. Банк обязан установить identidad клиента, domicilio и, при необходимости, origen de fondos — директива PBC. Для иностранца базовый пакет: pasaporte, NIE o resguardo EX-15, comprobante de domicilio (certificado empadronamiento или contrato), justificante de ingresos.",
      "IBAN с префиксом ES удобен для местных форм и отделений, но SEPA-переводы и domiciliación нельзя ограничивать только испанским IBAN: статья 9 Reglamento (UE) 260/2012 запрещает IBAN discrimination. NIE связывает испанский банковский профиль с identificación fiscal; без него многие sucursales в Valencia не открывают обычную cuenta corriente.",
      "Cuenta nómina и productos sin comisiones часто требуют ingresos regulares en la cuenta o domiciliación nómina. Extranjero no residente может попасть на отдельный producto с другими comisiones — это не «дискриминация паспорта», а perfil de riesgo banco.",
    ],
    bullets: [
      "NIE/resguardo + empadronamiento + justificante ingresos.",
      "SEPA — переводы и adeudos; ES IBAN удобен, не обязателен для LAU.",
      "Domiciliación — renta, luz, SS.",
    ],
  },
  {
    heading: "Valencia: non-resident vs con TIE/resguardo",
    section_kind: "practice",
    paragraphs: [
      "До huellas TIE вы юридически в стране по autorización/visado, но профиль banco может быть «extranjero con autorización en trámite». NIE или resguardo и подтверждение domicilio — типичный пакет для local cuenta; точные требования определяет KYC банка.",
      "Non-resident cuenta (без NIE, solo pasaporte) в 2026 для RU/BY в Valencia — редкость в @spain_granitsa; marketing «cuenta para no residentes» на сайте ≠ одобрение compliance для вашего паспорта.",
    ],
    bullets: [
      formatPracticeBullet({
        channels: ["spain_granitsa", "valenforum"],
        period: "2025–2026",
        claim:
          "CaixaBank и Santander en Valencia abren cuenta con resguardo NIE + empadronamiento; sin padrón частo posponen una semana",
        forReader: "cierre NIE + padrón antes cita banca — ver [NIE y padrón](/notes/" + NIE_EMPADRONAMIENTO_SLUG + ")",
      }),
      "Con TIE/resguardo huellas — mayor probabilidad domiciliación nómina.",
      "Sin NIE — редкость для RU/BY; Revolut SEPA как puente.",
    ],
  },
  {
    heading: "KYC RU/BY/UA/KZ: origen de fondos",
    section_kind: "practice",
    paragraphs: [
      "Паспорт RU или BY не создаёт общего запрета, но compliance банка оценивает санкционный риск и origen de fondos. Крупный inbound transfer, наличные или криптоактивы без paper trail — типичные причины дополнительной проверки.",
      "Подготовьте письменное объяснение: ahorros, venta inmueble, salario remoto, herencia — с выписками 3–6 meses. Для трека РФ + ОАЭ/другие страны некоторые банки запрашивают certificado antecedentes — soft, preguntar **antes** de la cita.",
    ],
    bullets: [
      "Statements 3–6 meses en idioma EN/ES o traducción.",
      "Contrato trabajo / facturas autónomo — justificante ingresos España.",
      "Sale inmueble — escritura o contrato + trazabilidad transfer.",
      "Remote salary — contrato + extractos empresa.",
      formatPracticeBullet({
        channels: ["valenciarusia"],
        period: "2025–2026",
        claim:
          "отказ en sucursal centro turístico не приговор — otra oficina en Campanar o Patraix a veces aprueba con mismo paquete",
        forReader: "plan A + plan B banco en la misma semana",
      }),
      "No mentir en origen — bloqueo cuenta y reporte PBC.",
      "Gestoría «apertura €200» — solo si branch rechazó con lista escrita de faltas.",
    ],
  },
  {
    heading: "Матрица банков Valencia (soft)",
    section_kind: "practice",
    paragraphs: [
      "Нет одного «лучшего банка» для всех RU-паспортов. Ниже — полевые ярлыки из @valenforum и @spain_granitsa, **не** ranking Banco de España. Сравнивайте comisiones, app и distancia sucursal.",
    ],
    bullets: [
      "CaixaBank / Santander — частый plan A с NIE+padrón (soft).",
      "BBVA / Sabadell — plan B при отказе.",
      "Revolut/SEPA — мост; IBAN discrimination оспаривается письменно.",
      "Comisiones — leer condiciones antes firmar.",
    ],
  },
  {
    heading: "Revolut vs local IBAN к 4–6 месяцу",
    section_kind: "gap",
    paragraphs: [
      "Revolut и другие счета SEPA закрывают переводы и многие domiciliaciones. К **4–6 месяцу** после прилёта растёт число регулярных платежей — renta, Seguridad Social, Hacienda, utilities — поэтому важнее проверить поддержку SEPA Direct Debit, имя titular и корректный mandato, а не логотип «традиционного» банка.",
      "Если propietario, empresa или administración отказывается принять подходящий IBAN только из-за страны выдачи, это возможная IBAN discrimination: запросите отказ письменно, сослитесь на art. 9 Reglamento (UE) 260/2012 и подайте reclamación в компетентный орган.",
    ],
    bullets: [
      "Официально: SEPA позволяет transferencias и adeudos с подходящего IBAN любой страны ЕС; требование только ES IBAN незаконно. На практике legacy-формы иногда приходится оспаривать письменно.",
      "Официально: NIE identifica ante AT. На практике: Hacienda и банк связывают NIE с данными titular.",
      "Revolut «funciona para TIE» → extranjería pide justificante banco ES en algunos casos (soft).",
      "«Sin NIE abren» → raro RU 2026; resguardo EX-15 a veces Caixa (soft).",
      "Cerrar cuenta extranjera antes ES IBAN — sin puente para fianza.",
      "Comisiones SWIFT inbound — €15–50; planificar transferencia inicial.",
    ],
  },
  {
    heading: "Пошагово: cita banca en Valencia",
    section_kind: "action_guide",
    paragraphs: [
      "Reservar cita en app/web CaixaBank, Santander o BBVA — «abrir cuenta» / «nueva cuenta». Llevar originales y copias. Pedir **carta IBAN** en papel membrete — útil para extranjería e Idealista agency.",
      "Sin empadronamiento la cita a menudo se pospone — complete [NIE y padrón](/notes/" +
        NIE_EMPADRONAMIENTO_SLUG +
        ") y [аренда](/notes/arenda-valencia-idealista-2026) con cláusula empadronamiento antes del banco si es posible.",
    ],
    bullets: [
      "Certificado empadronamiento + NIE/resguardo + pasaporte.",
      "Justificante ingresos y texto origen fondos.",
      "Móvil ES para SMS banca — ver [SIM Valencia](/notes/sim-internet-luz-valencia-2026).",
      "Cita sucursal cerca domicilio — clerk conoce expats Benimaclet/Ruzafa (soft).",
      "Firmar condiciones — comisiones, domiciliación, 3D Secure.",
      "Activar app; transfer test €10.",
      "Solicitar carta IBAN impresa.",
      "Segunda entidad plan B si rechazo.",
    ],
  },
  {
    heading: "Типичные ошибки",
    section_kind: "practice",
    paragraphs: [
      "Оптимально: NIE → padrón → dos bancos en semana 2 → IBAN letter → domiciliar renta. Ошибки ниже стоят дороже comisiones.",
    ],
    bullets: [
      "Ir sin NIE ni padrón — semana perdida.",
      "Una sucursal turística y rendirse.",
      "Принять устный отказ agency по IBAN — запросите письменную причину и напомните об art. 9 Reglamento 260/2012.",
      "No preguntar comisiones — sorpresa €60–120/año.",
      "Cerrar cuenta origen antes puente ES.",
      "Mentir origen fondos — cierre cuenta.",
      "Esperar crédito día 1 — débito primero; crédito tras historial.",
      "Ignorar carta IBAN — extranjería la pide después.",
    ],
  },
  {
    heading: "Domiciliación de renta y fianza en Valencia",
    section_kind: "practice",
    paragraphs: [
      "LAU устанавливает fianza legal в одну mensualidad для аренды vivienda. В Comunitat Valenciana arrendador вносит её в Generalitat по процедуре GVA 3023; обязанность арендатора — заплатить сумму способом, согласованным в contrato. Закон не требует «традиционный ES IBAN» для этого платежа.",
      "Domiciliar renta mensual desde cuenta ES reduce fricción con propietario mayorista y prepara historial útil si más adelante pide crédito o préstamo — soft, no garantía.",
    ],
    bullets: [
      "Fianza — concepto claro en transferencia: dirección + mes.",
      "Generalitat GVA, proc. 3023 — депозит вносит arrendador; сохраните contrato и justificante платежа.",
      "Agency fee — IBAN ES; Revolut a veces rechazado.",
      "Recibos de renta — guarde 12 meses para renovación contrato.",
      formatPracticeBullet({
        channels: ["valenciarusia"],
        period: "2025–2026",
        claim:
          "agencias Ruzafa/Campanar piden extracto banco ES antes de reservar piso",
        forReader: "abra cuenta semana 2, no semana 4",
      }),
      "Contrato — cláusula domiciliación opcional pero valorada.",
    ],
  },
  {
    heading: "Seguridad Social y nómina: por qué IBAN local",
    section_kind: "practice",
    paragraphs: [
      "Alta en Seguridad Social como trabajador o autónomo requiere cuenta donde domiciliar cuotas. Gestorías en Valencia suelen pedir IBAN **antes** del alta TA0521 — sin él el calendario SS se desplaza semanas.",
      "A **4–6 meses** de llegada, si aún cobra nómina en cuenta extranjera, Hacienda y SS pueden reclamar regularización — no por «ilegalidad» del Revolut, sino por falta de trazabilidad local esperada en inspecciones rutinarias.",
    ],
    bullets: [
      "Alta empleador — IBAN en contrato laboral.",
      "Autónomo — gestoría + cuenta antes modelo 036.",
      "Cuotas SS — domiciliación mensual.",
      "Prestaciones — requieren historial cotización.",
      "No mezcle nómina ES y gastos personales sin separar conceptos.",
    ],
  },
  {
    heading: "Связанные шаги и Assist",
    section_kind: "practice",
    paragraphs: [
      "Банк — звено между padrón, renta y TIE. Если KYC блокирует цепочку, сверьте маршрут на [Emigro Wizard](/ru/wizard?utm_source=emigro&utm_medium=guide&utm_campaign=bank-iban-valencia&utm_content=bank-iban-nerezident-ispaniya-2026). Для разбора отказа sucursal и plan B — [Route Check Assist](/ru/assist?utm_source=emigro&utm_medium=guide&utm_campaign=bank-iban-valencia&utm_content=bank-iban-nerezident-ispaniya-2026).",
    ],
    bullets: [
      "[NIE и padrón](/notes/" + NIE_EMPADRONAMIENTO_SLUG + ").",
      "[TIE cita](/notes/tie-cita-extranjeria-valencia-2026).",
      "[Аренда Valencia](/notes/arenda-valencia-idealista-2026).",
      "[30 días checklist](/notes/pervye-30-dnej-v-ispanii-satelit-2026).",
    ],
  },
];

const keyTakeaways = [
  "Официально: banco debe KYC/PBC; NIE identifica ante AT; IBAN ES para SEPA y domiciliación — condiciones en contrato entidad.",
  "Официально: paquete base — pasaporte, NIE/resguardo, comprobante domicilio, justificante ingresos.",
  formatPracticeTakeaway({
    channels: ["spain_granitsa", "valenforum"],
    period: "2025–2026",
    claim:
      "CaixaBank/Santander Valencia suelen abrir con resguardo NIE + empadronamiento; RU/BY — origen fondos estricto",
    forReader: "проверьте SEPA transfer/adeudo и titularidad до renta/SS/Hacienda; local bank — опция удобства",
  }),
  "Расхождение: marketing «cuenta fácil» ≠ aprobación compliance; к 4–6 месяцу fintech часто недостаточен для domiciliación renta y SS.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Можно ли открыть счёт без NIE?",
    a: "По правилам cuenta non-residente возможна en algunas entidades. На практике sucursal Valencia просит NIE o resguardo EX-15 + empadronamiento para RU/BY.",
  },
  {
    q: "Какой банк проще для RU паспорта?",
    a: "По правилам все entidades mismo marco KYC. На практике CaixaBank y Santander en Valencia чаще en @spain_granitsa — con paquete completo y origen fondos claro.",
  },
  {
    q: "Хватит ли Revolut для аренды?",
    a: "По правилам transfer/adeudo с подходящего IBAN ЕС нельзя отвергать только из-за страны IBAN (Reglamento 260/2012, art. 9). На практике дайте agency certificado de titularidad; при отказе просите письменную причину и подавайте reclamación.",
  },
  {
    q: "Сколько ждать карту?",
    a: "По правилам — plazos en condiciones banco. На практике cuenta activa 3–10 días; plástico 7–14 días (soft).",
  },
  {
    q: "Нужен ли TIE plástico para cuenta?",
    a: "По правилам — identificación legal suficiente con NIE/resguardo. На práктике resguardo huellas mejora perfil; plástico no siempre obligatorio día 1.",
  },
];

const faqExtra: CommunityNoteFaq[] = [
  {
    q: "Revolut хватит к 4–6 месяцу для renta y SS?",
    a: "По правилам art. 9 Reglamento 260/2012 подходящий IBAN ЕС нельзя отвергать из-за страны. На практике к 4–6 месяцу проверьте adeudos SEPA, titularidad и mandato; local bank может быть удобен, но не обязателен.",
  },
];

const faqMerged: CommunityNoteFaq[] = [...faq, ...faqExtra];

export const BANK_IBAN_GUIDE = {
  slug: BANK_IBAN_SLUG,
  category: "Банки",
  content_kind: "guide" as ContentKind,
  title: "Банк и IBAN в Испании для нерезидента: Valencia 2026",
  excerpt:
    "CaixaBank, Santander, KYC RU/BY, счёт SEPA и запрет IBAN discrimination: что реально нужно для renta, SS и Hacienda к 4–6 месяцу.",
  seo_title: "Банк Испания 2026 — IBAN Valencia нерезидент",
  seo_description:
    "Банк в Valencia 2026: CaixaBank, Santander, KYC RU/BY, NIE, padrón, счёт SEPA и запрет IBAN discrimination. К 4–6 месяцу проверьте adeudos renta, SS и Hacienda.",
  quick_answer:
    "Счёт SEPA нужен для переводов и части domiciliaciones, но закон не требует именно «традиционный испанский банк»: отказ только из-за страны IBAN нарушает art. 9 Reglamento (UE) 260/2012. В Valencia для открытия local cuenta обычно готовят NIE/resguardo, подтверждение domicilio и origen de fondos. К 4–6 месяцу проверьте поддержку adeudos SEPA для renta, SS и Hacienda. Паспорт RU/BY не создаёт автоматического запрета, но усиливает KYC.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq: faqMerged,
  official_links: [
    { title: "Banco de España", url: "https://www.bde.es/" },
    { title: "Banco de España — discriminación de IBAN", url: "https://clientebancario.bde.es/pcb/es/blog/discriminacion-de-iban-que-es-y-como-actuar-si-me-ocurre.html" },
    { title: "Agencia Tributaria — sede", url: "https://sede.agenciatributaria.gob.es/" },
  ],
  topic_tags: ["bank", "nie", "valencia"],
  hashtags: buildNoteHashtags({
    topicTags: ["bank", "nie", "valencia"],
    contentKind: "guide",
    extra: ["iban", "caixabank", "kyc"],
  }),
  source_channel: "spain_granitsa+valenforum+valenciarusia",
  source_label: "editorial:bank-iban-gold-valencia-2026",
  pillar_guide_slug: "pervye-30-dnej-v-ispanii-2026",
};

export default BANK_IBAN_GUIDE;
