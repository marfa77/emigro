export interface DigestItem {
  id: string;
  category: string;
  title_ru: string;
  body_ru: string;
  source_url: string | null;
  last_verified: string | null;
}

export interface CorridorProgram {
  id: string;
  slug: string;
  program_type: string;
  title_ru: string;
  summary_ru: string;
  sort_order?: number;
  is_featured?: boolean;
}

export interface CorridorPassport {
  passport_iso2: string;
  support_level: string;
}

export interface Corridor {
  id: string;
  slug: string;
  title_ru: string;
  audience_description_ru: string;
  passports: CorridorPassport[];
  programs: CorridorProgram[];
  digest: DigestItem[];
}

export interface ProgramRequirement {
  id: string;
  label_ru: string;
  value_text: string | null;
}

export interface ProgramTimelineStep {
  id: string;
  title_ru: string;
  duration_text: string | null;
}

export interface ProgramCost {
  id: string;
  label_ru: string;
  amount_text: string | null;
  amount_eur: number | null;
}

export interface ProgramSource {
  id: string;
  source_url: string;
  raw_excerpt: string;
  last_verified: string;
  label_ru: string | null;
}

export interface ProgramPassportEligibility {
  id: string;
  passport_iso2: string;
  status: "eligible" | "partial" | "ineligible";
  notes_en: string | null;
  notes_ru: string | null;
}

export interface ProgramDetail {
  id: string;
  slug: string;
  destination_iso2: string;
  program_type: string;
  title_ru: string;
  summary_ru: string;
  version: { id: string } | null;
  requirements: ProgramRequirement[];
  timeline: ProgramTimelineStep[];
  costs: ProgramCost[];
  sources: ProgramSource[];
  passportEligibility: ProgramPassportEligibility[];
}

export interface WizardQuestion {
  id: string;
  question_key: string;
  question_type: string;
  label_ru: string;
  help_ru?: string | null;
  options?: { value: string; label_en: string; label_ru: string }[] | null;
  required: boolean;
  module_id: string;
  sort_order: number;
}

export interface WizardModule {
  id: string;
  module_key: string;
  title_ru: string;
  sort_order: number;
  questions: WizardQuestion[];
}

export interface WizardDefinition {
  id: string;
  slug: string;
  title_ru: string;
  modules: WizardModule[];
}
