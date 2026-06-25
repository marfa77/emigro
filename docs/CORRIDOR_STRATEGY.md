# Emigro — Corridor-First Strategy

> **Core shift:** Emigro is not launched as a generic global visa database.  
> It is launched as a **deep, live, source-backed relocation corridor navigator**.
>
> The product is **corridors**. The universal engine, schema, contributor API, review flow, and provider marketplace are internal infrastructure for operating corridors.

---

## 1. Definition

A **corridor** is a complete relocation knowledge pack for a specific applicant audience moving toward specific destinations.

```
Corridor =
  applicant language
  + applicant passport cluster
  + current location / constraints
  + destination country or region
  + program routes
  + proofs and change digest
  + local providers
```

Example:

```txt
Russian-speaking applicants
Passports: RU / BY / UA / KZ
Destinations: Portugal first, then Spain / France
Routes: D8, D7, family, investment, citizenship path
Providers: local licensed providers in destination country
Content: official proofs + corridor digest + practical route notes
```

The engine stays universal, but users do not buy or experience «a global engine». They experience a concrete corridor with its own language, passports, routes, digest, proofs, and providers.

---

## 2. Why corridor-first is the competitive advantage

Generic visa finders compete on breadth. We compete on **depth and freshness in one corridor**.

| Generic visa finder | Emigro corridor |
|---------------------|-----------------|
| Many countries, shallow | Few routes, very deep |
| Static requirements | Live digest + changelog |
| Generic passport support | Passport cluster specific |
| No local provider ops | Hand-picked local providers |
| SEO-first | Community + digest + partners |
| One-off quiz | Corridor intelligence layer |

This is how we avoid competing head-on with broad visa finders like Transita. We do not beat them by covering more programs. We beat them by becoming **the best answer for one corridor**.

---

## 3. What we keep from the original architecture

All previous planning remains useful, but becomes corridor-scoped.

| Original plan | Corridor interpretation |
|---------------|-------------------------|
| Universal engine | One engine evaluates any corridor |
| Program types | Used inside corridor: CAPITAL / LABOR / BOND / later BIRTH |
| Multi-axis wizard | Shows several routes inside the corridor |
| Passport eligibility | Passport cluster matrix per corridor |
| Mandatory proofs | Proof library per corridor |
| Ingestion API | Later: contributors update corridor packs |
| Provider marketplace | Starts as manual local provider lead handoff |
| Contributor revshare | Later, attached to corridor entities |
| Daemon | Later, monitors corridor source set |
| Visa-free layer | Later, corridor add-on |

**Nothing is thrown away, but the hierarchy changes:** corridors are the product; the global abstraction is internal tooling.

---

## 4. Corridor knowledge model

Add a first-class `corridors` concept on top of the existing schema.

```sql
corridors (
  id UUID PRIMARY KEY,
  slug TEXT UNIQUE,                 -- ru-speaking-to-portugal
  audience_language TEXT,           -- ru
  title_i18n JSONB,
  description_i18n JSONB,
  status TEXT,                      -- draft | active | paused
  primary_destination_country TEXT,
  created_at TIMESTAMPTZ
)

corridor_passports (
  corridor_id UUID,
  passport_country TEXT,            -- RU, BY, UA, KZ
  priority INT,
  PRIMARY KEY (corridor_id, passport_country)
)

corridor_destinations (
  corridor_id UUID,
  country_code TEXT,                -- PT, later ES/FR
  priority INT,
  PRIMARY KEY (corridor_id, country_code)
)

corridor_programs (
  corridor_id UUID,
  program_id UUID,
  priority INT,
  route_label_i18n JSONB,
  corridor_notes_i18n JSONB,
  PRIMARY KEY (corridor_id, program_id)
)

corridor_sources (
  corridor_id UUID,
  source_url TEXT,
  source_type TEXT,                 -- official | embassy | legislation | digest
  topic TEXT,                       -- d8 | citizenship | ciple | consulate
  last_verified DATE
)

corridor_digest_items (
  id UUID PRIMARY KEY,
  corridor_id UUID,
  title_i18n JSONB,
  summary_i18n JSONB,
  source_url TEXT,
  source_type TEXT,
  published_at DATE,
  affects_program_ids UUID[],
  severity TEXT                     -- info | watch | action_required
)
```

The universal tables (`programs`, `requirements`, `passport_eligibility`, `providers`) remain unchanged. Corridor tables select, order, annotate, and distribute them.

---

## 5. First corridor: RU-speaking → Portugal

### Audience

```txt
Language: Russian
Applicant passports: RU / BY / UA / KZ
Current locations: Russia, EU, Turkey, Serbia, Georgia, Armenia, UAE
Profile: remote professionals, founders, families, HNW-light
```

### Destination

Start with **Portugal only**. Spain and France become separate corridor expansions, not MVP-A scope.

### Routes

| Route | Type | MVP-A | Notes |
|-------|------|-------|-------|
| Portugal D8 Digital Nomad | LABOR | ✅ | Primary route for remote professionals |
| Portugal D7 Passive Income | CAPITAL | ✅ | Savings/passive income route; useful comparison vs D8 |
| Family reunification | BOND | ✅ | Multi-axis value; proves «not one branch» wizard |
| Citizenship path + CIPLE A2 | Roadmap / digest layer | ✅ | Not a visa route; appears after residence routes |
| Golden Visa / investment | CAPITAL | ❌ | Too complex/noisy for MVP-A; revisit after corridor traction |
| BIRTH | BIRTH | ❌ | Later; high legal/medical risk |

### Core promise

> Узнайте, какие легальные маршруты в Португалию подходят вам с RU/BY/UA/KZ паспортом — бесплатно, с официальными источниками и локальными провайдерами.

---

## 5.1 Final MVP-A decisions

These are the default choices for implementation unless explicitly changed later.

| Area | Decision |
|------|----------|
| Product surface | Russian-language corridor page + wizard |
| Corridor slug | `ru-speaking-to-portugal` |
| Audience language | `ru` |
| Destination | Portugal only (`PT`) |
| Primary passport | `RU` |
| Secondary passports | `BY`, `UA`, `KZ` as supported/partial rows |
| Included routes | D8, D7, family reunification |
| Roadmap layer | citizenship/CIPLE A2 path after residence route |
| Excluded routes | Golden Visa, BIRTH, Spain, France, visa-free |
| Provider model | manual shortlist request + accepted-lead pilot |
| Payment automation | none in MVP-A |
| Contributor API | none in MVP-A |
| CIPLE migration | 5-10 digest items only, not the full archive |

Implementation default:

```txt
Build the corridor deeply, not broadly.
If a feature does not help RU-speaking applicants evaluate Portugal routes
or request a provider shortlist, it is out of MVP-A.
```

---

## 6. CIPLE A2 digest migration

The CIPLE A2 project already has six months of digest/content work. It becomes the **Portugal corridor intelligence layer**, not a separate silo.

### What to migrate

| CIPLE A2 asset | Emigro corridor use |
|----------------|---------------------|
| Exam date updates | `corridor_digest_items` topic=`ciple_exam_dates` |
| CAPLE registration guides | roadmap step `language_requirement` |
| Language requirement articles | citizenship path knowledge |
| CIPLE preparation content | provider/category `language_courses` and content cards |
| Portuguese citizenship posts | `program_requirements` + corridor notes |
| Exam locations | roadmap support data |
| YouTube / SEO research | RU/EN corridor content and digest topics |

### Adapted format

Each migrated item should become one of:

```txt
1. Program fact
   → requirement/cost/timeline row with source_url

2. Corridor digest item
   → date, summary, affected route, source_url

3. Roadmap guidance
   → language_requirement step copy

4. Provider opportunity
   → CIPLE tutors, language courses, exam prep

5. SEO/community post
   → Russian-language corridor update
```

### What not to migrate blindly

- Generic CIPLE learning content that does not help relocation decisions
- Blog posts without official sources
- Long-form SEO text before corridor pages prove demand

---

## 7. Provider strategy under corridor-first

Providers are **not necessarily Russian**. The audience is Russian-speaking; providers should be **local, licensed, and able to handle Russian-speaking applicants**.

```txt
Audience: Russian-speaking applicants
Providers: Portugal-based lawyers, relocation firms, translators, language schools
Requirement: RU/EN intake + experience with RU/BY/UA/KZ passports
```

### MVP provider model

Do **manual lead handoff**, not self-serve marketplace.

```txt
1. We find 10-20 local providers
2. First 3-5 qualified leads free
3. Then paid CPL per accepted lead
4. Billing/invoicing manual
5. Provider portal and CPC later
```

### Qualified lead packet

```txt
passport
current location
destination
matched route
budget range
timeline
family status
language preference
contact details
explicit consent to share
```

This is more valuable than a raw CPC click.

---

## 8. Revised MVP-A: Corridor Portugal

### Goal

Validate that Russian-speaking applicants use the wizard and request local provider shortlists for Portugal routes.

### Include

- Russian-language landing and wizard
- Applicant passports: RU / BY / UA / KZ
- Destination: Portugal only
- Routes: D8, D7, family, citizenship/CIPLE path; optional Golden Visa
- Multi-axis wizard: core + labor + capital + bond
- Source-backed scoring
- Corridor digest from migrated CIPLE material
- Program pages with official sources
- Roadmap with `language_requirement` and CIPLE step
- Manual lead form: «получить shortlist провайдеров»
- Manual provider CRM: Airtable/Notion/Supabase admin

### Exclude

- Spain/France routes
- BIRTH
- Public contributor API
- Automated LLM review
- Provider portal
- CPC billing
- Stripe payouts
- SEO page factory

### Success metrics

| Metric | Target |
|--------|--------|
| Wizard completions | 200 from RU channels |
| Completion rate | >40% |
| Users with 2+ routes | >30% |
| Provider shortlist requests | >10% of completions |
| Providers agreeing to pilot | 5+ |
| One provider willing to pay | ≥€50 per qualified lead |

---

## 9. Rollout after Portugal

Only expand after Portugal corridor validates.

```txt
MVP-A: RU-speaking → Portugal
MVP-B: deepen Portugal + contributor/update API
MVP-C: manual provider revenue
Expansion 1: RU-speaking → Spain
Expansion 2: RU-speaking → France
Expansion 3: Spanish-speaking LATAM → Spain/Portugal
Expansion 4: French-speaking Maghreb/Africa → France/Canada
```

Each new corridor gets:

- passport cluster
- route list
- source set
- digest
- provider list
- localized landing
- distribution channel

No corridor launches with only program rows. It must have **data + content + providers + distribution**.

---

## 10. Future non-EU / LATAM / South Africa backlog

These regions are **backlog only**. Do not implement pages, program rows, provider flows, or SEO surfaces for them until Portugal validates and the product has bandwidth for a different corridor logic.

### Why not now

- These are not immediate EU-funnel extensions from the Portugal launch.
- Argentina and Brazil can involve citizenship, birth, family, consular, and long-residence logic rather than a simple transit or visa comparison.
- South Africa and broader LATAM routes need separate legal sourcing, risk review, provider networks, and local distribution.
- Emergency / wartime Russian demand may make these valuable later, but the initial product must prove one deep corridor before expanding across legal systems.

### Prioritization hypothesis

| Priority | Region / hub | Category | Hypothesis |
|----------|--------------|----------|------------|
| P1 later | Argentina | LATAM citizenship / birth / family corridor | Potentially high demand from Russian-speaking families, but legal and medical risk requires specialist review before any public product surface. |
| P1 later | Brazil | LATAM citizenship / birth / family corridor | Similar special-case demand; likely not a simple relocation wizard route and should be researched as its own corridor. |
| P2 later | Uruguay, Paraguay, Chile, Colombia | South America research backlog | Candidates for residence, family, lifestyle, or emergency relocation paths; prioritize only after proof of search/community demand. |
| P2 later | South Africa (ЮАР) | Remote / lifestyle hub and research backlog | Useful as a non-EU option for lifestyle, English-language environment, and regional access, but not core to the EU residence/citizenship funnel. |
| P3 later | Mexico | LATAM / North America research backlog | Consider separately from South America; likely stronger as lifestyle / temporary residence research than citizenship-first corridor. |

### Category split

- **LATAM citizenship / birth / family corridors:** Argentina and Brazil first. Treat these as legally sensitive corridors with source-backed explainers, professional review, and explicit risk language before launch.
- **Remote / lifestyle hubs:** South Africa, Mexico, Uruguay, Chile, and Colombia may be useful for Russian-speaking remote workers or families seeking fast fallback options.
- **Lower-priority research backlog:** Paraguay and additional South America candidates should stay in discovery until there is clear demand, reliable sources, and provider availability.

### Discovery questions

- Which queries and community discussions show urgent Russian-speaking demand for Argentina, Brazil, South Africa, and other LATAM destinations?
- Are users seeking citizenship for children/family, temporary safety, tax/lifestyle arbitrage, or a bridge back to Europe?
- Which routes require licensed legal review before Emigro can safely summarize them?
- Can we find official sources, local providers, and Russian/English intake support for each corridor?
- Does any corridor create repeat digest value, or is it mostly one-off research?
- Should Mexico be grouped with LATAM lifestyle hubs or treated as a separate North America corridor family?

---

## 11. Product positioning

### Avoid

> Global AI visa finder.

Too broad, too competitive, low trust.

### Use

> Живой навигатор переезда по конкретным коридорам.

Or:

> Emigro tracks relocation corridors for Russian-speaking applicants — starting with Portugal.

### Landing promise

```txt
Переезд в Португалию с RU/BY/UA/KZ паспортом:
сравните D8, D7, family route и путь к гражданству.
Бесплатно, с официальными источниками и проверенными локальными провайдерами.
```

---

## 12. Architecture implications

### Add now

- `corridors`
- `corridor_passports`
- `corridor_destinations`
- `corridor_programs`
- `corridor_digest_items`
- `provider_languages`
- `provider_supported_passports`
- `manual_leads`

### Defer

- generic public contributor API / broad data marketplace
- marketplace bidding
- automated payouts
- global SEO templates
- visa-free layer

### Keep schema extensible

The universal schema still supports global expansion. Corridor tables act as **curation and distribution layer**, not a replacement.

---

## 13. Kill criteria for corridor

Stop or pivot if after 8 weeks:

- <200 completed wizards from RU channels
- <20 provider shortlist requests
- 0 providers willing to accept pilot leads
- users say «this is just ChatGPT with forms»
- CIPLE digest migration does not create repeat visits

---

## 14. Decision

**Adopt corridor-first as the launch philosophy.**

Build universal engine, but launch it through the first corridor:

```txt
RU-speaking applicants → Portugal
```

Spain, France, corridor update API, and automated provider marketplace remain part of the long-term plan, but only after Portugal corridor validation.

---

*Last updated: 2026-06-25*
