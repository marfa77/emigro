-- Emigro MVP-A: corridor-first schema + Portugal seed
-- Shared Supabase project with Garmin wellness (separate tables, no conflicts)

-- L0 reference
CREATE TABLE IF NOT EXISTS emigro_outcomes (
  code TEXT PRIMARY KEY,
  label_en TEXT NOT NULL,
  label_ru TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS emigro_program_types (
  code TEXT PRIMARY KEY,
  label_en TEXT NOT NULL,
  label_ru TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS emigro_step_types (
  code TEXT PRIMARY KEY,
  label_en TEXT NOT NULL,
  label_ru TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS emigro_requirement_types (
  code TEXT PRIMARY KEY,
  label_en TEXT NOT NULL,
  label_ru TEXT NOT NULL
);

-- L1
CREATE TABLE IF NOT EXISTS emigro_countries (
  iso2 TEXT PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_ru TEXT NOT NULL
);

-- L2 programs
CREATE TABLE IF NOT EXISTS emigro_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  destination_iso2 TEXT NOT NULL REFERENCES emigro_countries(iso2),
  program_type TEXT NOT NULL REFERENCES emigro_program_types(code),
  title_en TEXT NOT NULL,
  title_ru TEXT NOT NULL,
  summary_en TEXT NOT NULL,
  summary_ru TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS emigro_program_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES emigro_programs(id) ON DELETE CASCADE,
  version_label TEXT NOT NULL DEFAULT '2026-01',
  effective_from DATE,
  eligibility_rule JSONB NOT NULL DEFAULT '{}',
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(program_id, version_label)
);

CREATE TABLE IF NOT EXISTS emigro_program_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_version_id UUID NOT NULL REFERENCES emigro_program_versions(id) ON DELETE CASCADE,
  requirement_type TEXT NOT NULL REFERENCES emigro_requirement_types(code),
  label_en TEXT NOT NULL,
  label_ru TEXT NOT NULL,
  value_text TEXT,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS emigro_program_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_version_id UUID NOT NULL REFERENCES emigro_program_versions(id) ON DELETE CASCADE,
  label_en TEXT NOT NULL,
  label_ru TEXT NOT NULL,
  amount_eur NUMERIC,
  amount_text TEXT,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS emigro_program_timeline_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_version_id UUID NOT NULL REFERENCES emigro_program_versions(id) ON DELETE CASCADE,
  step_type TEXT NOT NULL REFERENCES emigro_step_types(code),
  title_en TEXT NOT NULL,
  title_ru TEXT NOT NULL,
  duration_text TEXT,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS emigro_program_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_version_id UUID NOT NULL REFERENCES emigro_program_versions(id) ON DELETE CASCADE,
  source_url TEXT NOT NULL,
  raw_excerpt TEXT NOT NULL,
  last_verified DATE NOT NULL,
  label_en TEXT,
  label_ru TEXT
);

CREATE TABLE IF NOT EXISTS emigro_passport_eligibility (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_version_id UUID NOT NULL REFERENCES emigro_program_versions(id) ON DELETE CASCADE,
  passport_iso2 TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('eligible', 'partial', 'ineligible')),
  notes_en TEXT,
  notes_ru TEXT,
  UNIQUE(program_version_id, passport_iso2)
);

-- L2.5 corridors
CREATE TABLE IF NOT EXISTS emigro_corridors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title_en TEXT NOT NULL,
  title_ru TEXT NOT NULL,
  audience_description_en TEXT NOT NULL,
  audience_description_ru TEXT NOT NULL,
  primary_passport_iso2 TEXT NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS emigro_corridor_passports (
  corridor_id UUID NOT NULL REFERENCES emigro_corridors(id) ON DELETE CASCADE,
  passport_iso2 TEXT NOT NULL,
  support_level TEXT NOT NULL CHECK (support_level IN ('primary', 'secondary')),
  PRIMARY KEY (corridor_id, passport_iso2)
);

CREATE TABLE IF NOT EXISTS emigro_corridor_destinations (
  corridor_id UUID NOT NULL REFERENCES emigro_corridors(id) ON DELETE CASCADE,
  destination_iso2 TEXT NOT NULL REFERENCES emigro_countries(iso2),
  PRIMARY KEY (corridor_id, destination_iso2)
);

CREATE TABLE IF NOT EXISTS emigro_corridor_programs (
  corridor_id UUID NOT NULL REFERENCES emigro_corridors(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES emigro_programs(id) ON DELETE CASCADE,
  sort_order INT NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT true,
  PRIMARY KEY (corridor_id, program_id)
);

CREATE TABLE IF NOT EXISTS emigro_corridor_digest_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  corridor_id UUID NOT NULL REFERENCES emigro_corridors(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_ru TEXT NOT NULL,
  body_en TEXT NOT NULL,
  body_ru TEXT NOT NULL,
  source_url TEXT,
  last_verified DATE,
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true
);

-- L3 wizard
CREATE TABLE IF NOT EXISTS emigro_wizard_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  corridor_id UUID NOT NULL REFERENCES emigro_corridors(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_ru TEXT NOT NULL,
  version INT NOT NULL DEFAULT 1,
  UNIQUE(corridor_id, slug)
);

CREATE TABLE IF NOT EXISTS emigro_wizard_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wizard_id UUID NOT NULL REFERENCES emigro_wizard_definitions(id) ON DELETE CASCADE,
  module_key TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_ru TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  UNIQUE(wizard_id, module_key)
);

CREATE TABLE IF NOT EXISTS emigro_wizard_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES emigro_wizard_modules(id) ON DELETE CASCADE,
  question_key TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('single', 'multi', 'number', 'boolean', 'text')),
  label_en TEXT NOT NULL,
  label_ru TEXT NOT NULL,
  help_en TEXT,
  help_ru TEXT,
  options JSONB,
  required BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  UNIQUE(module_id, question_key)
);

-- L4 leads
CREATE TABLE IF NOT EXISTS emigro_manual_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  corridor_id UUID NOT NULL REFERENCES emigro_corridors(id),
  session_id UUID,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  telegram TEXT,
  passport_iso2 TEXT NOT NULL,
  preferred_language TEXT NOT NULL DEFAULT 'ru',
  selected_program_slugs TEXT[] NOT NULL DEFAULT '{}',
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'assigned', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- L6 sessions
CREATE TABLE IF NOT EXISTS emigro_wizard_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  corridor_id UUID NOT NULL REFERENCES emigro_corridors(id),
  wizard_id UUID NOT NULL REFERENCES emigro_wizard_definitions(id),
  answers JSONB NOT NULL DEFAULT '{}',
  passport_iso2 TEXT,
  locale TEXT NOT NULL DEFAULT 'ru',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS emigro_eligibility_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES emigro_wizard_sessions(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES emigro_programs(id),
  outcome TEXT NOT NULL REFERENCES emigro_outcomes(code),
  score NUMERIC,
  reasons JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(session_id, program_id)
);

-- RLS: public read on published data, service role for writes
ALTER TABLE emigro_corridors ENABLE ROW LEVEL SECURITY;
ALTER TABLE emigro_corridor_passports ENABLE ROW LEVEL SECURITY;
ALTER TABLE emigro_corridor_destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE emigro_corridor_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE emigro_corridor_digest_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE emigro_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE emigro_program_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE emigro_program_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE emigro_program_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE emigro_program_timeline_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE emigro_program_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE emigro_passport_eligibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE emigro_wizard_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE emigro_wizard_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE emigro_wizard_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE emigro_wizard_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE emigro_eligibility_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE emigro_manual_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_corridors" ON emigro_corridors FOR SELECT USING (is_published = true);
CREATE POLICY "public_read_corridor_passports" ON emigro_corridor_passports FOR SELECT USING (true);
CREATE POLICY "public_read_corridor_destinations" ON emigro_corridor_destinations FOR SELECT USING (true);
CREATE POLICY "public_read_corridor_programs" ON emigro_corridor_programs FOR SELECT USING (true);
CREATE POLICY "public_read_digest" ON emigro_corridor_digest_items FOR SELECT USING (is_published = true);
CREATE POLICY "public_read_programs" ON emigro_programs FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_versions" ON emigro_program_versions FOR SELECT USING (is_published = true);
CREATE POLICY "public_read_requirements" ON emigro_program_requirements FOR SELECT USING (true);
CREATE POLICY "public_read_costs" ON emigro_program_costs FOR SELECT USING (true);
CREATE POLICY "public_read_timeline" ON emigro_program_timeline_steps FOR SELECT USING (true);
CREATE POLICY "public_read_sources" ON emigro_program_sources FOR SELECT USING (true);
CREATE POLICY "public_read_passport_elig" ON emigro_passport_eligibility FOR SELECT USING (true);
CREATE POLICY "public_read_wizard_defs" ON emigro_wizard_definitions FOR SELECT USING (true);
CREATE POLICY "public_read_wizard_modules" ON emigro_wizard_modules FOR SELECT USING (true);
CREATE POLICY "public_read_wizard_questions" ON emigro_wizard_questions FOR SELECT USING (true);
CREATE POLICY "anon_insert_sessions" ON emigro_wizard_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "anon_update_own_sessions" ON emigro_wizard_sessions FOR UPDATE USING (true);
CREATE POLICY "anon_read_sessions" ON emigro_wizard_sessions FOR SELECT USING (true);
CREATE POLICY "anon_insert_results" ON emigro_eligibility_results FOR INSERT WITH CHECK (true);
CREATE POLICY "anon_read_results" ON emigro_eligibility_results FOR SELECT USING (true);
CREATE POLICY "anon_insert_leads" ON emigro_manual_leads FOR INSERT WITH CHECK (true);

-- Seed reference data
INSERT INTO emigro_outcomes (code, label_en, label_ru) VALUES
  ('likely_eligible', 'Likely eligible', 'Вероятно подходит'),
  ('needs_review', 'Needs review', 'Требует проверки'),
  ('unlikely', 'Unlikely', 'Маловероятно')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_program_types (code, label_en, label_ru) VALUES
  ('LABOR', 'Work & remote income', 'Работа и удалённый доход'),
  ('CAPITAL', 'Passive income & savings', 'Пассивный доход и сбережения'),
  ('BOND', 'Family ties', 'Семейные связи')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_step_types (code, label_en, label_ru) VALUES
  ('document_prep', 'Document preparation', 'Подготовка документов'),
  ('application', 'Consular application', 'Подача в консульство'),
  ('residence', 'Residence permit', 'ВНЖ'),
  ('language_requirement', 'Language requirement', 'Языковое требование'),
  ('citizenship', 'Citizenship path', 'Путь к гражданству')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_requirement_types (code, label_en, label_ru) VALUES
  ('income', 'Income', 'Доход'),
  ('savings', 'Savings', 'Сбережения'),
  ('insurance', 'Insurance', 'Страховка'),
  ('family', 'Family', 'Семья'),
  ('documents', 'Documents', 'Документы')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_countries (iso2, name_en, name_ru) VALUES
  ('PT', 'Portugal', 'Португалия'),
  ('RU', 'Russia', 'Россия'),
  ('BY', 'Belarus', 'Беларусь'),
  ('UA', 'Ukraine', 'Украина'),
  ('KZ', 'Kazakhstan', 'Казахстан')
ON CONFLICT DO NOTHING;

-- Corridor
INSERT INTO emigro_corridors (id, slug, title_en, title_ru, audience_description_en, audience_description_ru, primary_passport_iso2)
VALUES (
  'a0000000-0000-4000-8000-000000000001',
  'ru-speaking-to-portugal',
  'Russian-speaking → Portugal',
  'Русскоязычные → Португалия',
  'Relocation navigator for Russian-speaking applicants targeting Portugal residency routes.',
  'Навигатор релокации для русскоязычных заявителей с фокусом на маршруты ВНЖ в Португалию.',
  'RU'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO emigro_corridor_passports (corridor_id, passport_iso2, support_level) VALUES
  ('a0000000-0000-4000-8000-000000000001', 'RU', 'primary'),
  ('a0000000-0000-4000-8000-000000000001', 'BY', 'secondary'),
  ('a0000000-0000-4000-8000-000000000001', 'UA', 'secondary'),
  ('a0000000-0000-4000-8000-000000000001', 'KZ', 'secondary')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_corridor_destinations (corridor_id, destination_iso2) VALUES
  ('a0000000-0000-4000-8000-000000000001', 'PT')
ON CONFLICT DO NOTHING;

-- Programs
INSERT INTO emigro_programs (id, slug, destination_iso2, program_type, title_en, title_ru, summary_en, summary_ru) VALUES
  ('b0000000-0000-4000-8000-000000000001', 'portugal-d8-digital-nomad', 'PT', 'LABOR',
   'Portugal D8 Digital Nomad',
   'Португалия D8 — цифровой кочевник',
   'Residence for remote workers and freelancers with stable foreign income.',
   'ВНЖ для удалённых работников и фрилансеров со стабильным зарубежным доходом.'),
  ('b0000000-0000-4000-8000-000000000002', 'portugal-d7-passive-income', 'PT', 'CAPITAL',
   'Portugal D7 Passive Income',
   'Португалия D7 — пассивный доход',
   'Residence for applicants with recurring passive income or sufficient savings.',
   'ВНЖ для заявителей с регулярным пассивным доходом или достаточными сбережениями.'),
  ('b0000000-0000-4000-8000-000000000003', 'portugal-family-reunification', 'PT', 'BOND',
   'Portugal Family Reunification',
   'Португалия — воссоединение семьи',
   'Join a family member who is a legal resident or citizen of Portugal.',
   'Присоединение к члену семьи — резиденту или гражданину Португалии.')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO emigro_corridor_programs (corridor_id, program_id, sort_order, is_featured) VALUES
  ('a0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001', 1, true),
  ('a0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000002', 2, true),
  ('a0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000003', 3, true)
ON CONFLICT DO NOTHING;

-- Program versions with JSON Logic rules
INSERT INTO emigro_program_versions (id, program_id, version_label, eligibility_rule) VALUES
  ('c0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001', '2026-01',
   '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"==":[{"var":"remote_income"},"yes"]},{">=":[{"var":"monthly_income_eur"},3040]}]}'),
  ('c0000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000002', '2026-01',
   '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"or":[{">=":[{"var":"passive_income_eur"},760]},{">=":[{"var":"savings_eur"},9120]}]}]}'),
  ('c0000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000003', '2026-01',
   '{"and":[{"==":[{"var":"passport_iso2"},"RU"]},{"==":[{"var":"has_family_in_pt"},"yes"]}]}')
ON CONFLICT DO NOTHING;

-- Requirements
INSERT INTO emigro_program_requirements (program_version_id, requirement_type, label_en, label_ru, value_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000001', 'income', 'Minimum monthly income', 'Минимальный месячный доход', '€3,040 (4× Portuguese minimum wage, indicative)', 1),
  ('c0000000-0000-4000-8000-000000000001', 'insurance', 'Health insurance', 'Медстраховка', 'Valid for Portugal', 2),
  ('c0000000-0000-4000-8000-000000000001', 'documents', 'Remote work proof', 'Подтверждение удалённой работы', 'Contract or client invoices', 3),
  ('c0000000-0000-4000-8000-000000000002', 'income', 'Passive income', 'Пассивный доход', '€760/month or equivalent savings', 1),
  ('c0000000-0000-4000-8000-000000000002', 'savings', 'Savings alternative', 'Альтернатива — сбережения', '€9,120+ (12 months)', 2),
  ('c0000000-0000-4000-8000-000000000003', 'family', 'Sponsor in Portugal', 'Спонсор в Португалии', 'Legal resident or citizen family member', 1)
ON CONFLICT DO NOTHING;

-- Costs
INSERT INTO emigro_program_costs (program_version_id, label_en, label_ru, amount_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000001', 'Consular fee (indicative)', 'Консульский сбор (ориентир)', '€90–120', 1),
  ('c0000000-0000-4000-8000-000000000001', 'Legal assistance (optional)', 'Юридическое сопровождение', '€800–2,500', 2),
  ('c0000000-0000-4000-8000-000000000002', 'Consular fee (indicative)', 'Консульский сбор (ориентир)', '€90–120', 1),
  ('c0000000-0000-4000-8000-000000000003', 'Consular fee (indicative)', 'Консульский сбор (ориентир)', '€90–120', 1)
ON CONFLICT DO NOTHING;

-- Timeline
INSERT INTO emigro_program_timeline_steps (program_version_id, step_type, title_en, title_ru, duration_text, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000001', 'document_prep', 'Gather income & insurance docs', 'Собрать документы о доходе и страховке', '2–4 weeks', 1),
  ('c0000000-0000-4000-8000-000000000001', 'application', 'VFS / consulate appointment', 'Запись в VFS / консульство', '1–3 months wait', 2),
  ('c0000000-0000-4000-8000-000000000001', 'residence', 'Receive residence permit', 'Получение ВНЖ', '2–6 months', 3),
  ('c0000000-0000-4000-8000-000000000001', 'language_requirement', 'A2 Portuguese for citizenship', 'A2 португальский для гражданства', 'Long-term — recalculate after 2026 law', 4),
  ('c0000000-0000-4000-8000-000000000002', 'document_prep', 'Proof of passive income / savings', 'Подтверждение пассивного дохода / сбережений', '2–4 weeks', 1),
  ('c0000000-0000-4000-8000-000000000002', 'application', 'Consulate submission', 'Подача в консульство', '1–3 months', 2),
  ('c0000000-0000-4000-8000-000000000002', 'residence', 'Residence permit', 'ВНЖ', '2–6 months', 3),
  ('c0000000-0000-4000-8000-000000000003', 'document_prep', 'Family relationship proof', 'Подтверждение родства', '2–6 weeks', 1),
  ('c0000000-0000-4000-8000-000000000003', 'application', 'Family reunification application', 'Подача на воссоединение', '2–4 months', 2),
  ('c0000000-0000-4000-8000-000000000003', 'residence', 'Family residence permit', 'Семейный ВНЖ', '2–6 months', 3)
ON CONFLICT DO NOTHING;

-- Sources (mandatory proofs)
INSERT INTO emigro_program_sources (program_version_id, source_url, raw_excerpt, last_verified, label_en, label_ru) VALUES
  ('c0000000-0000-4000-8000-000000000001',
   'https://vistos.mne.gov.pt/en/national-visas/general-information/family-reunification',
   'D8 visa for remote workers — income must be at least four times the Portuguese minimum wage.',
   '2026-01-15', 'AIMA / MNE guidance', 'Официальные требования MNE'),
  ('c0000000-0000-4000-8000-000000000002',
   'https://vistos.mne.gov.pt/en/national-visas/general-information/residence-visa-d7',
   'D7 requires proof of regular passive income or sufficient means of subsistence.',
   '2026-01-15', 'D7 official page', 'Официальная страница D7'),
  ('c0000000-0000-4000-8000-000000000003',
   'https://vistos.mne.gov.pt/en/national-visas/general-information/family-reunification',
   'Family reunification for relatives of legal residents in Portugal.',
   '2026-01-15', 'Family reunification', 'Воссоединение семьи')
ON CONFLICT DO NOTHING;

-- Passport eligibility matrix
INSERT INTO emigro_passport_eligibility (program_version_id, passport_iso2, status, notes_en, notes_ru) VALUES
  ('c0000000-0000-4000-8000-000000000001', 'RU', 'eligible', 'Apply via consulate/VFS', 'Подача через консульство/VFS'),
  ('c0000000-0000-4000-8000-000000000001', 'BY', 'partial', 'Check consulate jurisdiction', 'Уточнить юрисдикцию консульства'),
  ('c0000000-0000-4000-8000-000000000001', 'UA', 'partial', 'Check consulate jurisdiction', 'Уточнить юрисдикцию консульства'),
  ('c0000000-0000-4000-8000-000000000001', 'KZ', 'partial', 'Check consulate jurisdiction', 'Уточнить юрисдикцию консульства'),
  ('c0000000-0000-4000-8000-000000000002', 'RU', 'eligible', NULL, NULL),
  ('c0000000-0000-4000-8000-000000000002', 'BY', 'partial', NULL, NULL),
  ('c0000000-0000-4000-8000-000000000003', 'RU', 'eligible', NULL, NULL)
ON CONFLICT DO NOTHING;

-- Digest items (CIPLE layer)
INSERT INTO emigro_corridor_digest_items (corridor_id, category, title_en, title_ru, body_en, body_ru, source_url, last_verified, sort_order) VALUES
  ('a0000000-0000-4000-8000-000000000001', 'citizenship', 'A2 Portuguese for citizenship',
   'A2 португальский для гражданства',
   'After the Nationality Law was signed on 3 May 2026, most new applicants need 10 years of legal residence (not 5). CAPLE/CIPLE A2 is still required for most applicants.',
   'После подписания Nationality Law (3 мая 2026) для большинства новых заявителей — 10 лет легального проживания (не 5). Для натурализации по-прежнему нужен A2 (CAPLE/CIPLE).',
   'https://www.caple.letras.ulisboa.pt/', '2026-01-10', 1),
  ('a0000000-0000-4000-8000-000000000001', 'exam', 'CIPLE exam structure',
   'Структура экзамена CIPLE',
   'CIPLE assesses reading, writing, listening, and speaking at A2. Plan 3–6 months of study from zero.',
   'CIPLE проверяет чтение, письмо, аудирование и говорение на A2. С нуля закладывайте 3–6 месяцев подготовки.',
   'https://www.caple.letras.ulisboa.pt/', '2026-01-10', 2),
  ('a0000000-0000-4000-8000-000000000001', 'timeline', 'Citizenship timeline',
   'Сроки гражданства',
   'Typical path: residence permit → renewals → legal residence (often 10 years from 2026) → A2/CIPLE → citizenship application (12–24 months processing).',
   'Типичный путь: ВНЖ → продления → легальный срок (для многих — 10 лет с 2026) → A2/CIPLE → заявление на гражданство (рассмотрение 12–24 мес.).',
   NULL, '2026-01-10', 3),
  ('a0000000-0000-4000-8000-000000000001', 'practical', 'NIF and bank account',
   'NIF и банковский счёт',
   'Most relocation routes require a Portuguese tax number (NIF) and often a local bank account for proof of means.',
   'Для большинства маршрутов нужен португальский налоговый номер (NIF) и часто местный банковский счёт.',
   NULL, '2026-01-10', 4),
  ('a0000000-0000-4000-8000-000000000001', 'practical', 'AIMA appointments',
   'Запись в AIMA',
   'After arrival, residence card issuance goes through AIMA. Appointment availability varies — factor this into your timeline.',
   'После приезда карта резидента оформляется через AIMA. Сроки записи меняются — учитывайте в плане.',
   'https://aima.gov.pt/', '2026-01-10', 5)
ON CONFLICT DO NOTHING;

-- Wizard
INSERT INTO emigro_wizard_definitions (id, corridor_id, slug, title_en, title_ru) VALUES
  ('d0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 'portugal-routes', 'Portugal route finder', 'Подбор маршрута в Португалию')
ON CONFLICT DO NOTHING;

INSERT INTO emigro_wizard_modules (id, wizard_id, module_key, title_en, title_ru, sort_order) VALUES
  ('e0000000-0000-4000-8000-000000000001', 'd0000000-0000-4000-8000-000000000001', 'core', 'Basics', 'Основное', 1),
  ('e0000000-0000-4000-8000-000000000002', 'd0000000-0000-4000-8000-000000000001', 'labor', 'Remote work', 'Удалённая работа', 2),
  ('e0000000-0000-4000-8000-000000000003', 'd0000000-0000-4000-8000-000000000001', 'capital', 'Passive income', 'Пассивный доход', 3),
  ('e0000000-0000-4000-8000-000000000004', 'd0000000-0000-4000-8000-000000000001', 'bond', 'Family', 'Семья', 4)
ON CONFLICT DO NOTHING;

INSERT INTO emigro_wizard_questions (module_id, question_key, question_type, label_en, label_ru, help_en, help_ru, options, sort_order) VALUES
  ('e0000000-0000-4000-8000-000000000001', 'passport_iso2', 'single',
   'Your passport', 'Ваш паспорт', 'Primary passport you will apply with', 'Паспорт, с которым будете подавать',
   '[{"value":"RU","label_en":"Russia","label_ru":"Россия"},{"value":"BY","label_en":"Belarus","label_ru":"Беларусь"},{"value":"UA","label_en":"Ukraine","label_ru":"Украина"},{"value":"KZ","label_en":"Kazakhstan","label_ru":"Казахстан"}]', 1),
  ('e0000000-0000-4000-8000-000000000002', 'remote_income', 'single',
   'Do you have stable remote income?', 'Есть стабильный удалённый доход?',
   'Salary or freelance from non-Portuguese clients', 'Зарплата или фриланс от не-португальских клиентов',
   '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 1),
  ('e0000000-0000-4000-8000-000000000002', 'monthly_income_eur', 'number',
   'Monthly net income (EUR)', 'Месячный чистый доход (EUR)', NULL, NULL, NULL, 2),
  ('e0000000-0000-4000-8000-000000000003', 'passive_income_eur', 'number',
   'Monthly passive income (EUR)', 'Месячный пассивный доход (EUR)', 'Rent, dividends, pensions', 'Аренда, дивиденды, пенсии', NULL, 1),
  ('e0000000-0000-4000-8000-000000000003', 'savings_eur', 'number',
   'Total savings (EUR)', 'Общие сбережения (EUR)', 'Liquid funds available', 'Доступные ликвидные средства', NULL, 2),
  ('e0000000-0000-4000-8000-000000000004', 'has_family_in_pt', 'single',
   'Family member legally in Portugal?', 'Член семьи легально в Португалии?',
   'Resident or citizen who can sponsor reunification', 'Резидент или гражданин для воссоединения',
   '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]', 1)
ON CONFLICT DO NOTHING;
