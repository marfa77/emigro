# Emigro — Corridor Database Schema & API

> **Goal:** new corridors, corridor programs, passport clusters, digest items, wizard questions, and provider lead flows ship via **database + operations API** — not engine deploys.
>
> Companion docs: [ARCHITECTURE.md](./ARCHITECTURE.md) · [MONETIZATION.md](./MONETIZATION.md)

---

## 1. Honest boundary: what is generic vs configurable

### Internal engine (code once, rarely changes)

| Component | Responsibility | Why code |
|-----------|----------------|----------|
| `RuleEvaluator` | Run JSON Logic against profile | Standard lib (`json-logic-js`) |
| `WizardRunner` | Render questions by `question_type`, apply `show_if` | Generic state machine |
| `RoadmapBuilder` | Walk `roadmap_templates` + corridor notes | Template interpreter |
| `ManualLeadHandoff` | Build lead packet and assign manually | Corridor ops |
| `ProviderMatcher` | Later: `ad_rank = bid × quality_score` | Marketplace phase |
| `DedupGate` | natural_key + content_hash | Corridor update pipeline |
| `ReviewOrchestrator` | Later: L0–L4 tier routing | Contributor phase |

### Configurable via database (99% of product growth)

| What you add | Where | Engine deploy? |
|--------------|-------|----------------|
| New corridor | `corridors` + links | ❌ |
| New corridor passport | `corridor_passports` | ❌ |
| New corridor digest item | `corridor_digest_items` | ❌ |
| New corridor provider | `providers` + manual lead ops | ❌ |
| New country | `countries` | ❌ |
| New program type label | `program_types` | ❌ |
| New program | `programs` + versions + requirements | ❌ |
| New passport rule | `passport_eligibility` | ❌ |
| New requirement field | `requirement_types` + row in `program_requirements` | ❌* |
| New wizard question | `wizard_questions` | ❌ |
| New roadmap step label | `step_types` | ❌ |
| New provider category | `provider_categories` | ❌ |
| Manual CPL for provider | `lead_assignments.agreed_cpl_eur` | ❌ |
| CPC floor for category | `pricing_tiers` (later) | ❌ |
| Compare table column | `compare_dimensions` | ❌ |
| SEO page template binding | `page_templates` + `url_patterns` | ❌ |

\* *New `value_type` (e.g. `geo_polygon`) needs one validator in engine — see §4.*

**Rule:** if it's content, taxonomy, or business rules → **DB**. If it's interpreter loop → **engine**.

---

## 2.2 Mandatory proofs — schema & API enforcement

### `source_types` (registry)

```sql
CREATE TABLE source_types (
  code        TEXT PRIMARY KEY,  -- official, embassy, legislation, secondary
  trust_rank  INT NOT NULL,      -- higher = preferred for auto-approve
  label_i18n  JSONB
);
```

### Hard constraints (PostgreSQL)

```sql
-- program_requirements: already NOT NULL source_url
ALTER TABLE program_costs ADD CONSTRAINT costs_source_required
  CHECK (source_url IS NOT NULL AND source_url <> '');

ALTER TABLE passport_eligibility ALTER COLUMN source_url SET NOT NULL;

-- programs cannot be active without sources (trigger or app-level gate)
CREATE OR REPLACE FUNCTION check_program_sources_before_active()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'active' AND NOT EXISTS (
    SELECT 1 FROM program_sources ps
    WHERE ps.program_id = NEW.id AND ps.is_active = true
  ) THEN
    RAISE EXCEPTION 'program_requires_at_least_one_source';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### `program_sources` (required for every active program)

```sql
CREATE TABLE program_sources (
  id              UUID PRIMARY KEY,
  program_id      UUID REFERENCES programs(id) NOT NULL,
  url             TEXT NOT NULL,
  title_i18n      JSONB,           -- "AIMA — Golden Visa requirements"
  source_type     TEXT REFERENCES source_types(code) NOT NULL,
  is_primary      BOOLEAN DEFAULT false,  -- shown in hero «Official sources»
  fetch_schedule  TEXT DEFAULT 'weekly',
  last_fetched    TIMESTAMPTZ,
  last_verified   DATE,
  review_status   TEXT DEFAULT 'review_needed',
  source_confidence TEXT DEFAULT 'medium',
  owner           TEXT,
  content_hash    TEXT,
  is_active       BOOLEAN DEFAULT true
);

-- at least one primary official source per active program
```

### Per-entity proof on costs & timeline

```sql
ALTER TABLE program_costs
  ADD COLUMN source_url TEXT NOT NULL,
  ADD COLUMN raw_excerpt TEXT,
  ADD COLUMN last_verified DATE;

ALTER TABLE program_timeline_steps
  ADD COLUMN source_url TEXT,        -- required if duration/cost claim
  ADD COLUMN last_verified DATE;
```

### API: proof bundle in every read response

```json
GET /api/v1/programs/portugal-golden-visa

{
  "slug": "portugal-golden-visa",
  "title": { "en": "Portugal Golden Visa" },
  "sources": [
    {
      "url": "https://aima.gov.pt/...",
      "title": { "en": "AIMA — Residence by investment" },
      "source_type": "official",
      "is_primary": true,
      "last_verified": "2026-06-15"
    }
  ],
  "requirements": [
    {
      "type": "min_investment_eur",
      "operator": ">=",
      "value": 500000,
      "proof": {
        "source_url": "https://aima.gov.pt/...",
        "excerpt": "Minimum investment of €500,000...",
        "last_verified": "2026-06-15"
      }
    }
  ],
  "passport_eligibility": [
    {
      "passport": "RU",
      "status": "eligible",
      "proof": { "source_url": "...", "last_verified": "2026-06-01" }
    }
  ]
}
```

### API: eligibility results always include proofs

```json
POST /api/v1/wizard/sessions/{id}/evaluate

{
  "routes": [{
    "program_slug": "portugal-golden-visa",
    "score": 87,
    "rules": [
      {
        "requirement": "min_investment_eur",
        "result": "passed",
        "expected": ">= 500000",
        "actual": 400000,
        "proof": {
          "source_url": "https://aima.gov.pt/...",
          "last_verified": "2026-06-15"
        }
      }
    ]
  }]
}
```

Engine copies `source_url` / `last_verified` from `program_requirements` into result — **never** returns a rule without proof.

### Data-quality fields

Current source-backed tables should carry a small editorial state:

- `last_verified` — date the source still supported the claim.
- `review_status` — `review_needed`, `verified`, `stale`, or `draft`.
- `source_confidence` — `high`, `medium`, or `low`; use `high` for official sources that directly support the claim.
- `owner` — editor or data owner responsible for the next verification pass.

Migration `20260625280000_data_quality_foundations.sql` adds these fields to `emigro_program_sources` and `emigro_corridor_digest_items`. Public UI may show `last_verified` as «Проверено» once present; admin/import tooling can use the other fields for queues and stale-source audits.

### Ingestion validation (Zod)

```typescript
const ProvenanceSchema = z.object({
  source_url: z.string().url(),
  raw_excerpt: z.string().min(20),
  source_type: z.enum(['official', 'embassy', 'legislation', 'secondary']),
  extracted_at: z.string().datetime(),
});

// reject at L0 if missing; secondary-only on cost/passport → force T2+
```

### Contributor prompt rule (starter kit)

```
NEVER submit a proposal without:
1. source_url — must be HTTP 200 and contain the claimed fact
2. raw_excerpt — verbatim quote from page (min 20 chars)
3. source_type — prefer official/legislation
```

---

## 2. Schema layers

```
┌─────────────────────────────────────────────────────────┐
│ L0: meta_schema     — types, operators, question types  │
│ L1: taxonomy        — countries, program_types, steps    │
│ L2: knowledge       — programs, requirements, passports  │
│ L3: experience      — wizard, compare, pages, i18n       │
│ L4: marketplace     — providers, placements, billing     │
│ L5: contributors    — proposals, published, attribution  │
│ L6: runtime         — sessions, profiles, results        │
└─────────────────────────────────────────────────────────┘
```

---

## 3. L0 — Meta schema (extensibility registry)

Everything the engine needs to validate/coerce values **without knowing Portugal**.

### `value_types`

```sql
CREATE TABLE value_types (
  code        TEXT PRIMARY KEY,  -- money_eur, money_usd, integer, boolean,
                               -- country_code, country_list, enum, date,
                               -- language_level, percentage, text, duration_days
  coerce_fn   TEXT NOT NULL,   -- engine registry key: 'money' | 'country' | 'enum' | ...
  json_schema JSONB            -- optional JSON Schema fragment for ingest validation
);
```

Seed ~12 types. New exotic type = **one** coerce function + one row (rare).

### `requirement_types`

```sql
CREATE TABLE requirement_types (
  code           TEXT PRIMARY KEY,  -- min_investment_eur, min_monthly_income_eur, ...
  value_type     TEXT REFERENCES value_types(code),
  label_i18n     JSONB,           -- { "en": "Minimum investment" }
  description_i18n JSONB,
  unit           TEXT,            -- EUR, months, A2
  operators      TEXT[],          -- {">=","<=","==","in","!="}
  profile_path   TEXT,            -- capital.liquid_assets_eur (wizard mapping hint)
  is_active      BOOLEAN DEFAULT true
);
```

**Add `min_savings_jpy`** → INSERT row. Engine reads operators + value_type at runtime.

### `rule_operators`

```sql
CREATE TABLE rule_operators (
  code        TEXT PRIMARY KEY,  -- >=, <=, ==, in, and, or, if, var, !
  json_logic  BOOLEAN DEFAULT true,
  label       TEXT
);
```

Documented set; JSON Logic is the rule DSL — no custom DSL in code.

### `question_types`

```sql
CREATE TABLE question_types (
  code           TEXT PRIMARY KEY,  -- single_select, multi_select, number, money,
                                    -- country_select, country_multi, boolean, date,
                                    -- text, slider
  component_key  TEXT NOT NULL,     -- maps to React: WizardQuestionSingleSelect
  value_schema   JSONB,             -- validation for answer
  is_active      BOOLEAN DEFAULT true
);
```

**New question with existing type** → DB only. **New UI widget** (e.g. `map_pick`) → one component + one row.

### `evaluation_modes`

```sql
CREATE TABLE evaluation_modes (
  code        TEXT PRIMARY KEY,  -- threshold, points_based, checklist, lottery
  handler_key TEXT NOT NULL,     -- engine: 'threshold' | 'points' | ...
  config_schema JSONB            -- JSON Schema for program.evaluation_config
);
```

Most programs use `threshold` (JSON Logic). `points_based` reads `evaluation_config.weights` from DB.

### `outcomes`

```sql
CREATE TABLE outcomes (
  code        TEXT PRIMARY KEY,  -- temporary, residency, pr, citizenship_direct, citizenship_path
  sort_order  INT,
  label_i18n  JSONB
);
```

---

## 4. L1 — Taxonomy

### `countries`

```sql
CREATE TABLE countries (
  code         TEXT PRIMARY KEY,  -- ISO 3166-1 alpha-2
  name_i18n    JSONB,
  region       TEXT,              -- EU, SCHENGEN, CARIBBEAN, ...
  is_destination BOOLEAN DEFAULT true,
  is_passport  BOOLEAN DEFAULT true,
  flag_emoji   TEXT,
  metadata     JSONB DEFAULT '{}'
);
```

### `country_blocs` + `country_bloc_members` (Phase 2, visa-free)

```sql
CREATE TABLE country_blocs (code TEXT PRIMARY KEY, name_i18n JSONB);
CREATE TABLE country_bloc_members (bloc_code TEXT, country_code TEXT, PRIMARY KEY (bloc_code, country_code));
```

### `program_types`

```sql
CREATE TABLE program_types (
  code              TEXT PRIMARY KEY,  -- CAPITAL, LABOR, BOND, BIRTH
  label_i18n        JSONB,
  profile_section   TEXT NOT NULL,     -- capital | labor | bond | birth
  icon              TEXT,
  sort_order        INT,
  wizard_module_code TEXT,             -- links to wizard_modules
  is_active         BOOLEAN DEFAULT true
);
```

**New type `SPECIAL`** → INSERT + wizard_module. Engine loops `program_types WHERE is_active`.

### `program_subtypes` (tags, not enums in code)

```sql
CREATE TABLE program_subtypes (
  code        TEXT PRIMARY KEY,  -- golden_visa, nomad, cbi, descent, ...
  program_type TEXT REFERENCES program_types(code),
  label_i18n  JSONB
);

CREATE TABLE program_subtype_links (
  program_id  UUID REFERENCES programs(id),
  subtype_code TEXT REFERENCES program_subtypes(code),
  PRIMARY KEY (program_id, subtype_code)
);
```

### `step_types`

```sql
CREATE TABLE step_types (
  code              TEXT PRIMARY KEY,
  label_i18n        JSONB,
  description_i18n  JSONB,
  default_provider_categories TEXT[],  -- {legal, translation}
  sort_order        INT
);
```

### `provider_categories`

```sql
CREATE TABLE provider_categories (
  code        TEXT PRIMARY KEY,
  label_i18n  JSONB,
  cpc_floor_eur NUMERIC(10,2),   -- from MONETIZATION.md
  cpc_ceiling_eur NUMERIC(10,2),
  is_active   BOOLEAN DEFAULT true
);
```

---

## 5. L2 — Knowledge (published programs)

### `programs`

```sql
CREATE TABLE programs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug              TEXT UNIQUE NOT NULL,
  country_code      TEXT REFERENCES countries(code),
  program_type      TEXT REFERENCES program_types(code),
  outcome           TEXT REFERENCES outcomes(code),
  evaluation_mode   TEXT REFERENCES evaluation_modes(code) DEFAULT 'threshold',
  evaluation_config JSONB DEFAULT '{}',   -- points weights, checklist items
  title_i18n        JSONB NOT NULL,
  summary_i18n      JSONB,
  target_audience   JSONB DEFAULT '{}',
  eligibility_rules JSONB NOT NULL,       -- JSON Logic (may reference requirement keys)
  status            TEXT DEFAULT 'draft', -- draft | active | suspended | deprecated
  parent_citizenship_path TEXT,           -- BIRTH: none | limited | parallel
  citizenship_basis TEXT,                 -- BIRTH: jus_soli
  published_version_id UUID,              -- FK → program_versions
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX programs_active ON programs(country_code, program_type) WHERE status = 'active';
```

### `program_versions` (immutable snapshots)

```sql
CREATE TABLE program_versions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id      UUID REFERENCES programs(id),
  version_number  INT NOT NULL,
  effective_from  DATE NOT NULL,
  effective_to    DATE,
  changelog       TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE (program_id, version_number)
);
```

### `program_requirements`

```sql
CREATE TABLE program_requirements (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_version_id UUID REFERENCES program_versions(id),
  requirement_type  TEXT REFERENCES requirement_types(code),
  operator          TEXT NOT NULL,
  value             JSONB NOT NULL,       -- typed per requirement_types.value_type
  unit              TEXT,
  source_url        TEXT NOT NULL,
  raw_excerpt       TEXT,
  last_verified     DATE,
  content_hash      TEXT NOT NULL,
  natural_key       TEXT UNIQUE NOT NULL  -- program_slug:requirement_type
);
```

### `program_costs`

```sql
CREATE TABLE program_costs (
  id                UUID PRIMARY KEY,
  program_version_id UUID REFERENCES program_versions(id),
  cost_type         TEXT NOT NULL,  -- government_fee, legal_estimate, min_investment, ...
  amount            NUMERIC(12,2),
  currency          TEXT DEFAULT 'EUR',
  notes_i18n        JSONB,
  natural_key       TEXT UNIQUE NOT NULL
);
```

### `program_timeline_steps`

```sql
CREATE TABLE program_timeline_steps (
  id                UUID PRIMARY KEY,
  program_version_id UUID REFERENCES program_versions(id),
  step_type         TEXT REFERENCES step_types(code),
  order_index       INT,
  duration_days_min INT,
  duration_days_max INT,
  notes_i18n        JSONB,
  natural_key       TEXT UNIQUE NOT NULL
);
```

### `passport_eligibility`

```sql
CREATE TABLE passport_eligibility (
  id                UUID PRIMARY KEY,
  program_id        UUID REFERENCES programs(id),
  applicant_passport TEXT REFERENCES countries(code),
  status            TEXT NOT NULL,  -- eligible | blocked | conditional | unknown
  conditions        JSONB DEFAULT '[]',
  notes_i18n        JSONB,
  source_url        TEXT,
  last_verified     DATE,
  content_hash      TEXT NOT NULL,
  natural_key       TEXT UNIQUE NOT NULL  -- program_slug:passport
);
```

### `program_sources` (daemon monitors)

```sql
CREATE TABLE program_sources (
  id           UUID PRIMARY KEY,
  program_id   UUID REFERENCES programs(id),
  url          TEXT NOT NULL,
  source_type  TEXT,  -- official | embassy | pdf | news
  fetch_schedule TEXT DEFAULT 'weekly',
  last_fetched TIMESTAMPTZ,
  content_hash TEXT,
  is_active    BOOLEAN DEFAULT true
);
```

### `published_entities` (denormalized read layer for dedup + API)

```sql
CREATE TABLE published_entities (
  natural_key   TEXT PRIMARY KEY,
  entity_type   TEXT NOT NULL,
  entity_id     UUID,
  program_slug  TEXT,
  payload       JSONB NOT NULL,
  content_hash  TEXT NOT NULL,
  published_at  TIMESTAMPTZ,
  last_verified DATE
);
```

Site + engine **read from views** joining `programs` + current version — `published_entities` is dedup/ingest index.

---

## 5.5 L2.5 — Corridors (curation and distribution layer)

Corridors select and annotate universal knowledge for a specific market. They do **not** replace programs; they package them for launch.

```sql
CREATE TABLE corridors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,              -- ru-speaking-to-portugal
  audience_language TEXT NOT NULL,        -- ru, es, fr
  title_i18n JSONB NOT NULL,
  description_i18n JSONB,
  primary_destination_country TEXT REFERENCES countries(code),
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE corridor_passports (
  corridor_id UUID REFERENCES corridors(id),
  passport_country TEXT REFERENCES countries(code),
  priority INT DEFAULT 0,
  PRIMARY KEY (corridor_id, passport_country)
);

CREATE TABLE corridor_destinations (
  corridor_id UUID REFERENCES corridors(id),
  country_code TEXT REFERENCES countries(code),
  priority INT DEFAULT 0,
  PRIMARY KEY (corridor_id, country_code)
);

CREATE TABLE corridor_programs (
  corridor_id UUID REFERENCES corridors(id),
  program_id UUID REFERENCES programs(id),
  priority INT DEFAULT 0,
  route_label_i18n JSONB,
  corridor_notes_i18n JSONB,
  PRIMARY KEY (corridor_id, program_id)
);

CREATE TABLE corridor_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  corridor_id UUID REFERENCES corridors(id),
  source_url TEXT NOT NULL,
  source_type TEXT REFERENCES source_types(code),
  topic TEXT,                             -- d8, d7, ciple, citizenship, consulate
  last_verified DATE
);

CREATE TABLE corridor_digest_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  corridor_id UUID REFERENCES corridors(id),
  title_i18n JSONB NOT NULL,
  summary_i18n JSONB,
  source_url TEXT NOT NULL,
  source_type TEXT REFERENCES source_types(code),
  published_at DATE,
  affects_program_ids UUID[],
  severity TEXT DEFAULT 'info'            -- info | watch | action_required
);
```

First row:

```sql
INSERT INTO corridors (slug, audience_language, primary_destination_country, title_i18n)
VALUES ('ru-speaking-to-portugal', 'ru', 'PT', '{"ru":"Переезд в Португалию для русскоязычных"}');
```

---

## 6. L3 — Experience (wizard, compare, pages)

### Profile schema in DB (not hardcoded TypeScript)

```sql
CREATE TABLE profile_schema_versions (
  id           UUID PRIMARY KEY,
  version      INT UNIQUE NOT NULL,
  schema       JSONB NOT NULL,   -- JSON Schema for full UserProfile
  is_current   BOOLEAN DEFAULT false
);
```

`profile_sections` derived from `program_types.profile_section` + `wizard_modules`.

### `wizard_definitions`

```sql
CREATE TABLE wizard_definitions (
  id          UUID PRIMARY KEY,
  slug        TEXT UNIQUE NOT NULL,  -- relocation-intake-v1
  version     INT NOT NULL,
  is_current  BOOLEAN DEFAULT false,
  profile_schema_version UUID REFERENCES profile_schema_versions(id)
);
```

### `wizard_modules`

```sql
CREATE TABLE wizard_modules (
  id           UUID PRIMARY KEY,
  wizard_id    UUID REFERENCES wizard_definitions(id),
  code         TEXT NOT NULL,        -- core, capital, labor, bond, birth
  profile_section TEXT,
  label_i18n   JSONB,
  sort_order   INT,
  skippable    BOOLEAN DEFAULT true,
  activation_rule JSONB,             -- JSON Logic: when to show module hint
  UNIQUE (wizard_id, code)
);
```

### `wizard_questions`

```sql
CREATE TABLE wizard_questions (
  id              UUID PRIMARY KEY,
  module_id       UUID REFERENCES wizard_modules(id),
  code            TEXT NOT NULL,
  question_type   TEXT REFERENCES question_types(code),
  label_i18n      JSONB NOT NULL,
  help_i18n       JSONB,
  placeholder_i18n JSONB,
  profile_path    TEXT NOT NULL,     -- core.citizenship, capital.liquid_assets_eur
  options         JSONB,             -- for select types: [{value, label_i18n}]
  validation      JSONB,             -- min, max, required
  show_if         JSONB,             -- JSON Logic on partial profile
  sort_order      INT,
  is_active       BOOLEAN DEFAULT true,
  UNIQUE (module_id, code)
);
```

**New question** → INSERT. `WizardRunner` loads ordered questions, filters by `show_if`.

### `compare_dimensions` (results table columns)

```sql
CREATE TABLE compare_dimensions (
  code          TEXT PRIMARY KEY,  -- match_score, upfront_cost, time_to_visa,
                                   -- citizenship_path_years, complexity
  label_i18n    JSONB,
  value_source  TEXT NOT NULL,     -- eligibility_result | program_costs | program_timeline | computed
  compute_key   TEXT,              -- engine registry: 'sum_costs' | 'min_timeline' | ...
  format        TEXT,              -- money_eur | months | percent | text
  sort_order    INT,
  is_active     BOOLEAN DEFAULT true
);
```

**New compare column** → INSERT + optional `compute_key` if novel (rare).

### `recommendation_rules` (which route to highlight)

```sql
CREATE TABLE recommendation_rules (
  id          UUID PRIMARY KEY,
  priority    INT,
  condition   JSONB NOT NULL,      -- JSON Logic on profile + results
  message_i18n JSONB,
  is_active   BOOLEAN DEFAULT true
);
```

### `page_templates` + `url_patterns` (SEO without deploy)

```sql
CREATE TABLE page_templates (
  code        TEXT PRIMARY KEY,  -- program_detail, country_hub, passport_matrix
  layout_key  TEXT NOT NULL,     -- React layout component
  data_query  JSONB              -- { "entity": "program", "by": "slug" }
);

CREATE TABLE url_patterns (
  pattern     TEXT PRIMARY KEY,  -- /programs/{country}/{slug}
  template_code TEXT REFERENCES page_templates(code),
  priority    INT
);
```

---

## 7. L4 — Marketplace

### `providers`

```sql
CREATE TABLE providers (
  id              UUID PRIMARY KEY,
  slug            TEXT UNIQUE,
  name            TEXT NOT NULL,
  website         TEXT,
  logo_url        TEXT,
  description_i18n JSONB,
  status          TEXT DEFAULT 'pending',  -- pending | active | suspended
  verification    JSONB DEFAULT '{}',
  quality_score   NUMERIC(3,2) DEFAULT 5.0,
  stripe_customer_id TEXT,
  wallet_balance  NUMERIC(12,2) DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT now()
);
```

### `provider_category_links` / `provider_geo`

```sql
CREATE TABLE provider_category_links (
  provider_id UUID REFERENCES providers(id),
  category_code TEXT REFERENCES provider_categories(code),
  PRIMARY KEY (provider_id, category_code)
);

CREATE TABLE provider_geo (
  provider_id UUID REFERENCES providers(id),
  country_code TEXT REFERENCES countries(code),
  PRIMARY KEY (provider_id, country_code)
);
```

### `provider_placements`

```sql
CREATE TABLE provider_placements (
  id              UUID PRIMARY KEY,
  provider_id     UUID REFERENCES providers(id),
  program_id      UUID REFERENCES programs(id),      -- nullable
  program_type    TEXT REFERENCES program_types(code), -- nullable
  step_type       TEXT REFERENCES step_types(code),
  category_code   TEXT REFERENCES provider_categories(code),
  bid_cpc_eur     NUMERIC(10,2),
  bid_cpl_eur     NUMERIC(10,2),
  daily_budget    NUMERIC(10,2),
  is_active       BOOLEAN DEFAULT true
);
```

Matcher: `WHERE (program_id = X OR program_type = Y) AND step_type = Z AND geo match`.

### `pricing_tiers` (monetization config in DB)

```sql
CREATE TABLE pricing_tiers (
  id              UUID PRIMARY KEY,
  category_code   TEXT REFERENCES provider_categories(code),
  country_code    TEXT,              -- nullable = global default
  cpc_floor_eur   NUMERIC(10,2),
  cpc_default_eur NUMERIC(10,2),
  cpl_floor_eur   NUMERIC(10,2),
  platform_fee_pct NUMERIC(4,2) DEFAULT 0.25,
  contributor_pool_pct NUMERIC(4,2) DEFAULT 0.75,
  effective_from  DATE,
  is_active       BOOLEAN DEFAULT true
);
```

### `click_events` / `lead_events` / `billing_ledger`

```sql
CREATE TABLE click_events (
  id              UUID PRIMARY KEY,
  provider_id     UUID REFERENCES providers(id),
  placement_id    UUID REFERENCES provider_placements(id),
  program_id      UUID,
  step_type       TEXT,
  session_id      TEXT,
  profile_id      UUID,
  amount_eur      NUMERIC(10,2),
  status          TEXT,  -- pending | held | charged | credited | disputed
  charged_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE billing_ledger (
  id              UUID PRIMARY KEY,
  provider_id     UUID,
  event_type      TEXT,  -- charge | credit | topup
  amount_eur      NUMERIC(12,2),
  reference_id    UUID,
  created_at      TIMESTAMPTZ DEFAULT now()
);
```

---

## 8. L5 — Contributors & ingestion

### `contributors`

```sql
CREATE TABLE contributors (
  id              UUID PRIMARY KEY,
  user_id         UUID,
  api_key_hash    TEXT,
  reputation      INT DEFAULT 0,
  kyc_status      TEXT DEFAULT 'none',
  pending_balance NUMERIC(12,2) DEFAULT 0,
  paid_balance    NUMERIC(12,2) DEFAULT 0
);
```

### `knowledge_proposals`

```sql
CREATE TABLE knowledge_proposals (
  id                UUID PRIMARY KEY,
  contributor_id    UUID REFERENCES contributors(id),
  entity_type       TEXT NOT NULL,
  operation         TEXT NOT NULL,  -- create | update | refresh | deprecate
  natural_key       TEXT NOT NULL,
  base_content_hash TEXT,
  payload           JSONB NOT NULL,
  previous_snapshot JSONB,
  provenance        JSONB NOT NULL,
  status            TEXT DEFAULT 'submitted',
  review_tier       TEXT,
  l1_result         JSONB,
  l2_result         JSONB,
  content_hash      TEXT,
  created_at        TIMESTAMPTZ DEFAULT now()
);
```

### `entity_contributions` / `entity_changelog`

```sql
CREATE TABLE entity_contributions (
  id              UUID PRIMARY KEY,
  natural_key     TEXT REFERENCES published_entities(natural_key),
  contributor_id  UUID REFERENCES contributors(id),
  role            TEXT,  -- author | verifier | updater
  proposal_id     UUID,
  share_weight    NUMERIC(5,4),
  approved_at     TIMESTAMPTZ
);

CREATE TABLE entity_changelog (
  id              UUID PRIMARY KEY,
  natural_key     TEXT,
  field_path      TEXT,
  old_value       JSONB,
  new_value       JSONB,
  contributor_id  UUID,
  proposal_id     UUID,
  approved_at     TIMESTAMPTZ
);
```

### `review_tier_config` (L0–L4 rules in DB)

```sql
CREATE TABLE review_tier_config (
  entity_type     TEXT,
  field_pattern   TEXT,     -- regex or * 
  change_type     TEXT,     -- create | update | refresh
  tier            TEXT,     -- T0 | T1 | T2 | T3 | T4
  requires_peer   BOOLEAN DEFAULT false,
  requires_human  BOOLEAN DEFAULT false,
  PRIMARY KEY (entity_type, field_pattern, change_type)
);
```

Change review policy without deploy.

---

## 9. L6 — Runtime (sessions & results)

```sql
CREATE TABLE wizard_sessions (
  id              UUID PRIMARY KEY,
  wizard_id       UUID REFERENCES wizard_definitions(id),
  user_id         UUID,              -- nullable
  anon_id         TEXT,
  current_module  TEXT,
  completed_modules TEXT[],
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE user_profiles (
  id              UUID PRIMARY KEY,
  session_id      UUID REFERENCES wizard_sessions(id),
  schema_version  UUID REFERENCES profile_schema_versions(id),
  data            JSONB NOT NULL DEFAULT '{}',  -- multi-axis profile
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE eligibility_results (
  id              UUID PRIMARY KEY,
  profile_id      UUID REFERENCES user_profiles(id),
  program_id      UUID REFERENCES programs(id),
  axis            TEXT,
  score           NUMERIC(5,2),
  status          TEXT,
  matched_rules   JSONB,
  failed_rules    JSONB,
  missing_fields  TEXT[],
  recommendation_rank INT,
  computed_at     TIMESTAMPTZ DEFAULT now()
);
```

---

## 10. API surface

### 10.1 Public read (site, no auth)

| Method | Endpoint | Source tables |
|--------|----------|---------------|
| GET | `/api/v1/corridors` | active corridors |
| GET | `/api/v1/corridors/{slug}` | corridor, passports, destinations, programs, digest |
| GET | `/api/v1/corridors/{slug}/wizard` | corridor-specific wizard definition |
| GET | `/api/v1/corridors/{slug}/programs` | corridor-selected routes only |
| GET | `/api/v1/corridors/{slug}/digest` | `corridor_digest_items` |
| GET | `/api/v1/meta/countries` | `countries` |
| GET | `/api/v1/meta/program-types` | `program_types`, `program_subtypes` |
| GET | `/api/v1/meta/requirement-types` | `requirement_types` |
| GET | `/api/v1/meta/step-types` | `step_types` |
| GET | `/api/v1/meta/provider-categories` | `provider_categories` |
| GET | `/api/v1/wizard/current` | `wizard_definitions` + modules + questions |
| GET | `/api/v1/programs` | internal/admin read; not primary public nav |
| GET | `/api/v1/programs/{slug}` | program + version + requirements + costs + timeline |
| GET | `/api/v1/programs/{slug}/passports` | `passport_eligibility` |
| GET | `/api/v1/knowledge/entities/{natural_key}` | `published_entities` + changelog |
| GET | `/api/v1/knowledge/entities/{natural_key}/changelog` | `entity_changelog` |
| GET | `/api/v1/compare/dimensions` | `compare_dimensions` |
| GET | `/api/v1/pages/resolve?path=/ru/portugal` | corridor template + data |

### 10.2 Wizard runtime (session)

| Method | Endpoint | Engine |
|--------|----------|--------|
| POST | `/api/v1/corridors/{slug}/wizard/sessions` | create corridor session |
| GET | `/api/v1/wizard/sessions/{id}/next` | `WizardRunner` — next questions after `show_if` |
| PATCH | `/api/v1/wizard/sessions/{id}/answers` | merge into `user_profiles.data` |
| POST | `/api/v1/wizard/sessions/{id}/evaluate` | `RuleEvaluator` parallel |
| GET | `/api/v1/wizard/sessions/{id}/results` | `eligibility_results` + compare |
| GET | `/api/v1/wizard/sessions/{id}/roadmap/{program_slug}` | `RoadmapBuilder` |

### 10.3 Manual lead handoff (MVP corridor ops)

| Method | Endpoint | |
|--------|----------|--|
| POST | `/api/v1/corridors/{slug}/leads` | applicant opt-in + lead packet |
| GET | `/api/v1/admin/manual-leads` | internal lead queue |
| POST | `/api/v1/admin/manual-leads/{id}/assign` | assign to provider |
| POST | `/api/v1/admin/manual-leads/{id}/accepted` | mark accepted, set CPL |

### 10.4 Corridor updates / contributor write (Phase 2)

| Method | Endpoint | |
|--------|----------|--|
| GET | `/api/v1/meta/contributor-guide` | markdown guide for LLM agents |
| GET | `/api/v1/meta/ingest-schema` | JSON Schema for proposals |
| GET | `/api/v1/corridors/{slug}/gaps` | missing route facts, passports, digest items |
| GET | `/api/v1/knowledge/exists` | preflight dedup |
| POST | `/api/v1/knowledge/exists/batch` | batch preflight |
| POST | `/api/v1/knowledge/proposals` | ingest |
| POST | `/api/v1/knowledge/proposals/batch` | batch ingest (max 50, LLM default) |
| GET | `/api/v1/knowledge/proposals` | own proposals |
| POST | `/api/v1/knowledge/flags` | report outdated |

### 10.5 Provider portal (Phase 2+; not MVP-A)

| Method | Endpoint | |
|--------|----------|--|
| CRUD | `/api/v1/provider/profile` | |
| CRUD | `/api/v1/provider/placements` | |
| GET | `/api/v1/provider/analytics` | spend, clicks, disputes |
| POST | `/api/v1/provider/wallet/topup` | Stripe |

### 10.6 Internal / admin

| Method | Endpoint | |
|--------|----------|--|
| POST | `/api/v1/admin/proposals/{id}/approve` | |
| POST | `/api/v1/admin/proposals/{id}/reject` | |
| CRUD | `/api/v1/admin/review-tier-config` | |
| CRUD | `/api/v1/admin/corridors` | |
| CRUD | `/api/v1/admin/corridors/{slug}/digest` | |

---

## 11. Engine data flow (zero country logic)

```
1. Load wizard:     SELECT * FROM wizard_questions WHERE module IN (...)
2. Save profile:    JSONB merge into user_profiles.data
3. Load corridor:   SELECT * FROM corridors WHERE slug = :slug
4. Load programs:   SELECT p.* FROM corridor_programs cp JOIN programs p ON ...
5. Filter passport: JOIN passport_eligibility ON applicant_passport
6. Evaluate each:   jsonLogic(program.eligibility_rules, profile)
7. Score/rank:      corridor priority + recommendation rules + compare dimensions
8. Build roadmap:   program_timeline_steps + corridor notes
9. Lead handoff:    POST manual lead packet with explicit consent
```

No global visa browser is required for MVP. No `if (country === 'PT')` in engine either: Portugal is selected by the active corridor row.

---

## 12. Corridor extension cookbook

### Add a new route to RU-speaking → Portugal (example: Portugal D9)

```sql
-- 1. Already have country PT, type LABOR
INSERT INTO programs (slug, country_code, program_type, outcome, title_i18n, eligibility_rules, ...)
INSERT INTO program_versions ...
INSERT INTO program_requirements (natural_key, ...) 
INSERT INTO passport_eligibility (natural_key, ...)  -- per passport
INSERT INTO program_timeline_steps ...
-- 2. Attach to corridor
INSERT INTO corridor_programs (corridor_id, program_id, priority, route_label_i18n, corridor_notes_i18n)
VALUES (...);
-- 3. Optional wizard questions (if new field needed)
INSERT INTO requirement_types (code, value_type, profile_path, ...)  -- if new field
INSERT INTO wizard_questions (profile_path, ...)                       -- if new question
-- 4. Providers are handled manually in MVP via lead assignments
```

Deploy: **none**. Site: ISR revalidate or cache TTL.

### Add new requirement «min_age» (already seeded type)

```sql
INSERT INTO program_requirements (requirement_type='min_age', operator='>=', value=18, ...);
UPDATE programs SET eligibility_rules = eligibility_rules || '{"and": [...]}';
```

### Add new profile field «has_remote_contract»

```sql
INSERT INTO requirement_types (code, value_type, profile_path, ...);
INSERT INTO wizard_questions (module_id=labor, profile_path='labor.has_remote_contract', ...);
-- PATCH profile_schema_versions.schema
```

### Add 6th program type (rare)

```sql
INSERT INTO program_types (code='SPECIAL', profile_section='special', ...);
INSERT INTO wizard_modules (code='special', ...);
```

Engine already loops types from DB.

---

## 13. What still requires code (minimal)

| Change | Effort |
|--------|--------|
| New `question_type` (new UI widget) | 1 React component + 1 row |
| New `value_type` (new coercion) | 1 validator fn + 1 row |
| New `evaluation_mode` handler | 1 handler + 1 row |
| New `compare_dimensions.compute_key` | 1 compute fn + 1 row |
| New JSON Logic operator | use standard lib only |
| New country/program/question | **SQL only** |
| New CPC floor | **SQL only** |
| New review tier rule | **SQL only** |

**Target:** <20 registry keys in engine total, all else DB.

---

## 14. Caching & published layer

```
contributors/LLM → proposals → review → published_entities + normalized tables
                                              ↓
                                    materialized view: api_programs_v
                                              ↓
                                    Next.js ISR / Redis cache (TTL 60s–5m)
```

Public read never joins 15 tables at request time — **materialized views** refreshed on publish.

```sql
CREATE MATERIALIZED VIEW api_programs_v AS
  SELECT p.slug, p.title_i18n, p.program_type, p.country_code,
         pv.costs_agg, pv.requirements_agg, ...
  FROM programs p
  JOIN program_versions pv ON p.published_version_id = pv.id
  WHERE p.status = 'active';

-- REFRESH MATERIALIZED VIEW CONCURRENTLY api_programs_v;
-- triggered on proposal approve
```

---

## 15. Gaps vs ARCHITECTURE.md (now closed)

| Topic | Was | Now |
|-------|-----|-----|
| Full table list | outline | §3–9 |
| Profile schema location | TypeScript example | `profile_schema_versions` + JSONB |
| Wizard in DB | mentioned | `wizard_questions` + `show_if` |
| Compare columns | implied | `compare_dimensions` |
| Pricing in DB | MONETIZATION.md only | `pricing_tiers` |
| Review tiers config | hardcoded T0–T4 | `review_tier_config` |
| Mandatory proofs | every fact + UI + API | no source → no publish |
| API endpoints | partial | §10 complete |
| Extension without deploy | principle | §12 cookbook |
| Engine boundary | vague | §1 + §13 |

---

## 16. MVP schema priority

**Phase 1 tables (ship RU-speaking → Portugal corridor):**

0. L0: `source_types` + proof constraints on all fact tables
1. L0: `value_types`, `requirement_types`, `question_types`, `outcomes`, `evaluation_modes`
2. L1: `countries`, `program_types`, `step_types`, `provider_categories`
3. L2: `programs`, `program_versions`, `program_requirements`, `program_costs`, `program_timeline_steps`, `passport_eligibility`, `published_entities`
4. L2.5 Corridor layer: `corridors`, `corridor_passports`, `corridor_destinations`, `corridor_programs`, `corridor_sources`, `corridor_digest_items`
5. L3: `wizard_definitions`, `wizard_modules`, `wizard_questions`, `compare_dimensions`, `profile_schema_versions`
6. L4-lite: `manual_leads`, `lead_assignments`, `provider_languages`, `provider_supported_passports` (manual provider ops, no billing automation)
7. L6: `wizard_sessions`, `user_profiles`, `eligibility_results`

**Phase 2:** L4 marketplace, L5 full contributor pipeline, `review_tier_config`, materialized views, provider portal, automated billing.

---

*Last updated: 2026-06-23*
