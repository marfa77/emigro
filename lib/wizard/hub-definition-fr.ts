import type { WizardModule } from "@/lib/types";

/**
 * Maghreb / Sénégal hub wizard (French strings in `label_ru` / `title_ru`
 * so WizardForm works without a full i18n refactor).
 * Evaluates France only when answers.hub_audience = "fr_africa".
 */

const PASSPORT_OPTIONS = [
  { value: "MA", label_en: "Morocco", label_ru: "Maroc" },
  { value: "DZ", label_en: "Algeria", label_ru: "Algérie" },
  { value: "TN", label_en: "Tunisia", label_ru: "Tunisie" },
  { value: "SN", label_en: "Senegal", label_ru: "Sénégal" },
];

const YES_NO = [
  { value: "yes", label_en: "Yes", label_ru: "Oui" },
  { value: "no", label_en: "No", label_ru: "Non" },
];

const FAMILY_COUNTRY_OPTIONS = [
  { value: "FR", label_en: "France", label_ru: "France" },
];

const GOAL_OPTIONS = [
  { value: "residency", label_en: "Residency", label_ru: "Résidence / régularisation" },
  { value: "citizenship", label_en: "Citizenship path", label_ru: "Chemin vers la nationalité (~5 ans)" },
  { value: "fast", label_en: "Speed & predictability", label_ru: "Rapidité et prévisibilité" },
  { value: "study", label_en: "Study / university", label_ru: "Études / université" },
];

const STUDY_LEVEL_OPTIONS = [
  { value: "bachelor", label_en: "Bachelor / undergraduate", label_ru: "Licence / bachelor" },
  { value: "master", label_en: "Master / graduate", label_ru: "Master" },
  { value: "language", label_en: "Language school", label_ru: "École de langue / prépa" },
  { value: "other", label_en: "Other / undecided", label_ru: "Autre / pas encore décidé" },
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
    id: `hub-fr-${key}`,
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

export const HUB_FR_WIZARD_ID = "hub-afrique-france-v1";

export const HUB_FR_WIZARD_MODULES: WizardModule[] = [
  {
    id: "hub-fr-core",
    module_key: "core",
    title_ru: "Profil",
    sort_order: 1,
    questions: [
      q("hub-fr-core", "passport_iso2", "single", "Votre passeport", {
        helpRu:
          "Passeport avec lequel vous déposerez. Emigro FR couvre Maroc, Algérie, Tunisie et Sénégal ; d'autres origines francophones suivront.",
        options: PASSPORT_OPTIONS,
        sort: 1,
      }),
      q("hub-fr-core", "relocation_goal", "single", "Objectif principal", {
        helpRu:
          "Ordonne seulement les routes. Destination évaluée : France. Naturalisation générale ~5 ans — pas un raccourci « 2 ans Maghreb ».",
        options: GOAL_OPTIONS,
        sort: 2,
      }),
    ],
  },
  {
    id: "hub-fr-labor",
    module_key: "labor",
    title_ru: "Travail et revenus",
    sort_order: 2,
    questions: [
      q("hub-fr-labor", "remote_income", "single", "Avez-vous des revenus distants stables depuis l'étranger ?", {
        helpRu:
          "Salaire, freelance ou société avec clients hors France. Utile pour certaines voies Talent / mobilité — confirmez la catégorie.",
        options: YES_NO,
        sort: 1,
      }),
      q("hub-fr-labor", "monthly_income_eur", "number", "Revenu net mensuel (EUR)", {
        helpRu: "Moyenne des 3–6 derniers mois après impôts. Exemple : ~3 500 €/mois → 3500.",
        required: false,
        sort: 2,
      }),
      q("hub-fr-labor", "has_job_offer", "single", "Avez-vous une offre d'emploi signée en France ?", {
        helpRu:
          "Offre écrite d'un employeur en France. Clé pour Talent / salarié ; ne remplace pas un VLS-TS étudiant ou visiteur.",
        options: YES_NO,
        sort: 3,
      }),
      q("hub-fr-labor", "annual_salary_eur", "number", "Salaire brut annuel de l'offre (EUR)", {
        helpRu:
          "Brut = avant impôts, par an. Seuil Talent salarié qualifié souvent ~39 582 € — confirmez service-public. Ex. : 4 800 €/mois brut ≈ 57600.",
        required: false,
        sort: 4,
      }),
    ],
  },
  {
    id: "hub-fr-capital",
    module_key: "capital",
    title_ru: "Capital et ressources",
    sort_order: 3,
    questions: [
      q("hub-fr-capital", "passive_income_eur", "number", "Revenu passif mensuel (EUR)", {
        helpRu:
          "Pension, loyers, dividendes — sans emploi salarié en France. Exemple : pension 900 + loyer 500 = 1400.",
        required: false,
        sort: 1,
      }),
      q("hub-fr-capital", "savings_eur", "number", "Épargne liquide (EUR)", {
        helpRu: "Montant prouvable par relevés. Ne comptez pas le logement ou la voiture. Exemple : 25000.",
        required: false,
        sort: 2,
      }),
      q("hub-fr-capital", "willing_to_invest_eur", "number", "Capital pour une voie investisseur (EUR)", {
        helpRu: "Si aucune voie investisseur FR ne vous concerne, 0 ou vide.",
        required: false,
        sort: 3,
      }),
      q("hub-fr-capital", "has_university_degree", "single", "Diplôme universitaire documentable ?", {
        helpRu: "Licence/master que vous pouvez prouver. En cas de doute, Non — cela ne bloque pas toutes les voies.",
        options: YES_NO,
        sort: 4,
      }),
    ],
  },
  {
    id: "hub-fr-study",
    module_key: "study",
    title_ru: "Études",
    sort_order: 4,
    questions: [
      q("hub-fr-study", "wants_study_route", "single", "Prévoyez-vous une relocalisation par études ?", {
        helpRu: "Voie séparée : admission + fonds. Ne remplace pas Talent / salarié / visiteur.",
        options: YES_NO,
        sort: 1,
      }),
      q("hub-fr-study", "has_university_admission", "single", "Admission confirmée (admission / inscription) ?", {
        helpRu: "Lettre de l'établissement. Si vous choisissez encore le programme, Non.",
        options: YES_NO,
        required: false,
        sort: 2,
      }),
      q("hub-fr-study", "study_budget_eur", "number", "Fonds disponibles pour étudier (EUR)", {
        helpRu: "Frais + vie : épargne, compte bloqué ou garant. Exemple : 12000.",
        required: false,
        sort: 3,
      }),
      q("hub-fr-study", "can_show_study_funds", "single", "Pouvez-vous prouver l'origine des fonds ?", {
        helpRu: "Relevés, lettre de garant ou autre preuve.",
        options: YES_NO,
        required: false,
        sort: 4,
      }),
      q("hub-fr-study", "study_level", "single", "Niveau d'études (optionnel)", {
        options: STUDY_LEVEL_OPTIONS,
        required: false,
        sort: 5,
      }),
    ],
  },
  {
    id: "hub-fr-bond",
    module_key: "bond",
    title_ru: "Famille",
    sort_order: 5,
    questions: [
      q("hub-fr-bond", "relocating_with_spouse", "single", "Votre conjoint vous accompagne-t-il ?", {
        helpRu: "Affecte seuils et dossier.",
        options: YES_NO,
        required: false,
        sort: 1,
      }),
      q("hub-fr-bond", "relocating_children_count", "number", "Combien d'enfants déménagent avec vous ?", {
        helpRu: "0 si aucun.",
        required: false,
        sort: 2,
      }),
      q("hub-fr-bond", "relocating_parents_count", "number", "Parents ou autres ascendants dans le déménagement ?", {
        helpRu: "0 si personne. Cas d'adultes dépendants souvent plus complexes.",
        required: false,
        sort: 3,
      }),
      q("hub-fr-bond", "family_countries", "multi", "Famille déjà en situation régulière en France", {
        helpRu:
          "Cochez France si un proche a déjà un titre / la nationalité et que vous visez un regroupement.",
        options: FAMILY_COUNTRY_OPTIONS,
        required: false,
        sort: 4,
      }),
    ],
  },
];
