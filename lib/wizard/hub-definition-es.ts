import type { WizardModule } from "@/lib/types";

/**
 * LATAM hub wizard (Spanish UI strings live in `label_ru` / `title_ru`
 * so existing WizardForm keeps working without a full i18n refactor).
 * Evaluates Spain + Portugal only when answers.hub_audience = "latam".
 */

const PASSPORT_OPTIONS = [
  { value: "UY", label_en: "Uruguay", label_ru: "Uruguay" },
  { value: "EC", label_en: "Ecuador", label_ru: "Ecuador" },
  { value: "PE", label_en: "Peru", label_ru: "Perú" },
  { value: "PY", label_en: "Paraguay", label_ru: "Paraguay" },
  { value: "CO", label_en: "Colombia", label_ru: "Colombia" },
];

const YES_NO = [
  { value: "yes", label_en: "Yes", label_ru: "Sí" },
  { value: "no", label_en: "No", label_ru: "No" },
];

const FAMILY_COUNTRY_OPTIONS = [
  { value: "ES", label_en: "Spain", label_ru: "España" },
  { value: "PT", label_en: "Portugal", label_ru: "Portugal" },
];

const GOAL_OPTIONS = [
  { value: "residency", label_en: "Residency", label_ru: "Residencia / legalización" },
  { value: "citizenship", label_en: "Citizenship path", label_ru: "Camino a la ciudadanía" },
  { value: "fast", label_en: "Speed & predictability", label_ru: "Rapidez y previsibilidad" },
  { value: "study", label_en: "Study / university", label_ru: "Estudios / universidad" },
];

const STUDY_LEVEL_OPTIONS = [
  { value: "bachelor", label_en: "Bachelor / undergraduate", label_ru: "Grado / bachelor" },
  { value: "master", label_en: "Master / graduate", label_ru: "Máster" },
  { value: "language", label_en: "Language school", label_ru: "Escuela de idiomas / prep" },
  { value: "other", label_en: "Other / undecided", label_ru: "Otro / aún no decidido" },
];

function q(
  moduleId: string,
  key: string,
  type: string,
  labelRu: string,
  opts?: {
    helpRu?: string;
    options?: { value: string; label_en: string; label_ru: string }[];
    required?: boolean;
    sort?: number;
  }
) {
  return {
    id: `hub-es-${key}`,
    module_id: moduleId,
    question_key: key,
    question_type: type,
    label_ru: labelRu,
    help_ru: opts?.helpRu ?? null,
    options: opts?.options ?? null,
    required: opts?.required ?? true,
    sort_order: opts?.sort ?? 1,
  };
}

export const HUB_ES_WIZARD_ID = "hub-latam-es-pt-v1";

export const HUB_ES_WIZARD_MODULES: WizardModule[] = [
  {
    id: "hub-es-core",
    module_key: "core",
    title_ru: "Perfil",
    sort_order: 1,
    questions: [
      q("hub-es-core", "passport_iso2", "single", "Su pasaporte", {
        helpRu:
          "Pasaporte con el que presentará la solicitud. Emigro ES cubre Uruguay, Ecuador, Perú, Paraguay y Colombia; otros LATAM llegan después.",
        options: PASSPORT_OPTIONS,
        sort: 1,
      }),
      q("hub-es-core", "relocation_goal", "single", "Objetivo principal", {
        helpRu:
          "Solo ordena las rutas. No elimina países por esta respuesta. Destinos evaluados: España y Portugal.",
        options: GOAL_OPTIONS,
        sort: 2,
      }),
    ],
  },
  {
    id: "hub-es-labor",
    module_key: "labor",
    title_ru: "Trabajo e ingresos",
    sort_order: 2,
    questions: [
      q("hub-es-labor", "remote_income", "single", "¿Tiene ingresos remotos estables desde el extranjero?", {
        helpRu:
          "Salario, freelance o empresa con clientes fuera del país de destino. Clave para nómada digital (España) y D8 (Portugal).",
        options: YES_NO,
        sort: 1,
      }),
      q("hub-es-labor", "monthly_income_eur", "number", "Ingreso neto mensual (EUR)", {
        helpRu:
          "Promedio de los últimos 3–6 meses después de impuestos. Ejemplo: unos €3 500/mes → 3500.",
        required: false,
        sort: 2,
      }),
      q("hub-es-labor", "has_job_offer", "single", "¿Tiene oferta de trabajo firmada en España o Portugal?", {
        helpRu:
          "Oferta escrita de un empleador en el país de destino. Sirve para vías laborales; no sustituye al nómada digital.",
        options: YES_NO,
        sort: 3,
      }),
      q("hub-es-labor", "annual_salary_eur", "number", "Salario bruto anual en la oferta (EUR)", {
        helpRu:
          "Bruto = antes de impuestos, por año. Ejemplo: €4 800/mes bruto ≈ 57600.",
        required: false,
        sort: 4,
      }),
    ],
  },
  {
    id: "hub-es-capital",
    module_key: "capital",
    title_ru: "Capital, inversión y estudios",
    sort_order: 3,
    questions: [
      q("hub-es-capital", "passive_income_eur", "number", "Ingreso pasivo mensual (EUR)", {
        helpRu:
          "Pensión, alquiler, dividendos — sin trabajo por cuenta ajena. No incluya el sueldo. Ejemplo: pensión 900 + alquiler 500 = 1400.",
        required: false,
        sort: 1,
      }),
      q("hub-es-capital", "savings_eur", "number", "Ahorros líquidos (EUR)", {
        helpRu:
          "Dinero demostrable con extractos bancarios. No cuente vivienda o coche. Ejemplo: 25000.",
        required: false,
        sort: 2,
      }),
      q("hub-es-capital", "willing_to_invest_eur", "number", "Capital para vía inversora (EUR)", {
        helpRu:
          "Solo lo que invertiría en un programa de inversión (p. ej. Golden Visa PT). Si no aplica, 0 o vacío.",
        required: false,
        sort: 3,
      }),
      q("hub-es-capital", "has_university_degree", "single", "¿Título universitario reconocible?", {
        helpRu:
          "Grado/máster que pueda documentar. Si duda, elija No — no bloquea otras rutas.",
        options: YES_NO,
        sort: 4,
      }),
    ],
  },
  {
    id: "hub-es-study",
    module_key: "study",
    title_ru: "Estudios",
    sort_order: 4,
    questions: [
      q("hub-es-study", "wants_study_route", "single", "¿Planea relocarse por estudios (uni / idiomas)?", {
        helpRu:
          "Vía aparte: admisión + fondos para matrícula y vida. No sustituye teletrabajo ni ingresos pasivos.",
        options: YES_NO,
        sort: 1,
      }),
      q("hub-es-study", "has_university_admission", "single", "¿Tiene admisión confirmada (admission / matrícula)?", {
        helpRu: "Carta de la universidad o escuela. Si aún elige programa, responda No.",
        options: YES_NO,
        required: false,
        sort: 2,
      }),
      q("hub-es-study", "study_budget_eur", "number", "Fondos disponibles para estudiar (EUR)", {
        helpRu: "Matrícula + manutención: ahorros, cuenta bloqueada o sponsor. Ejemplo: 12000.",
        required: false,
        sort: 3,
      }),
      q("hub-es-study", "can_show_study_funds", "single", "¿Puede demostrar el origen de los fondos?", {
        helpRu: "Extractos, carta de sponsor u otra prueba documental.",
        options: YES_NO,
        required: false,
        sort: 4,
      }),
      q("hub-es-study", "study_level", "single", "Nivel de estudios (opcional)", {
        options: STUDY_LEVEL_OPTIONS,
        required: false,
        sort: 5,
      }),
    ],
  },
  {
    id: "hub-es-bond",
    module_key: "bond",
    title_ru: "Familia",
    sort_order: 5,
    questions: [
      q("hub-es-bond", "relocating_with_spouse", "single", "¿Su cónyuge se muda con usted?", {
        helpRu: "Afecta umbrales de ingresos/ahorros y el paquete documental.",
        options: YES_NO,
        required: false,
        sort: 1,
      }),
      q("hub-es-bond", "relocating_children_count", "number", "¿Cuántos hijos se mudan con usted?", {
        helpRu: "0 si no hay. Suelen hacer falta fondos, seguro y documentos de parentesco.",
        required: false,
        sort: 2,
      }),
      q("hub-es-bond", "relocating_parents_count", "number", "¿Padres u otros ascendientes en el traslado?", {
        helpRu: "0 si nadie. Casos de adultos dependientes suelen ser más complejos.",
        required: false,
        sort: 3,
      }),
      q("hub-es-bond", "family_countries", "multi", "Familia ya legal en España o Portugal", {
        helpRu:
          "Marque el país si un familiar cercano ya tiene residencia/ciudadanía allí y usted quiere reunirse.",
        options: FAMILY_COUNTRY_OPTIONS,
        required: false,
        sort: 4,
      }),
    ],
  },
];
