# Emigro — Audit: Idea, Implementation, MVP

> **Date:** 2026-06-23  
> **Status:** IDEA / design complete, **zero production code**  
> **Docs:** ARCHITECTURE · SCHEMA_AND_API · MONETIZATION · API_CONTRIBUTOR_GUIDE

---

## Executive summary

| Dimension | Score | Verdict |
|-----------|-------|---------|
| **Problem / idea** | Strong | Real pain, underserved vs agencies |
| **Differentiation** | Strong | Corridor depth + sources + digest + provider ops vs broad visa finders |
| **Architecture** | Strong on paper | DB-driven engine is right; scope is large |
| **MVP discipline** | Weak in docs | Full vision documented; MVP must be cut harder |
| **Go-to-market** | Medium | Corridor distribution + manual provider sales still unproven |
| **Legal risk** | Medium–High | Immigration data + provider handoff — manageable with disclaimers + review |
| **Build feasibility (solo/small team)** | Medium | 8–10 weeks for true MVP if scope cut; 6+ months as currently scoped |

**Recommendation:** Ship **MVP-A as a corridor product**: RU-speaking applicants → Portugal (wizard + route scoring + CIPLE/citizenship digest + manual provider shortlist) in 4–6 weeks. **MVP-B** adds corridor ingestion/update API. **MVP-C** validates paid qualified leads with local providers.

---

## 1. Idea audit

### 1.1 Problem (valid ✅)

- People choose relocation blind — agencies sell what they service.
- Program rules change (PT Golden Visa 5→10 years) — static sites go stale.
- Same person has **multiple paths** (money + spouse + remote job) — no tool compares them.
- Passport matters — RU vs UA vs IN ≠ same eligibility.

**Pain is real, willingness to search is high** (immigration SEO is huge).

### 1.2 Solution fit (strong ✅)

| Pillar | Fit |
|--------|-----|
| Multi-axis wizard | Matches how people actually decide |
| Explainable scoring + sources | Trust vs Immigram black-box / agency bias |
| Free for applicants | Removes friction; aligns with relocation intent |
| Manual provider handoff | Monetization without charging vulnerable users |
| Corridor update API (later) | Scales freshness after corridor PMF |

### 1.3 Competition

| Player | Model | Emigro edge | Emigro risk |
|--------|-------|-------------|-------------|
| **Immigram** | UK GTV only, proprietary scoring, paid turnkey | Corridor depth outside UK GTV | They own UK GTV niche deeply |
| **VisaDB / aggregators** | Static comparisons | Personalization + passport + sources | They have SEO and data head start |
| **Law firms / agencies** | Sell their service | Neutral intake + local handoff | Providers may resist new lead source |
| **ChatGPT** | Generic answers | Sourced, structured, up-to-date | Users may «good enough» with AI |

**Moat if executed:** corridor intelligence + CIPLE/digest asset + source-backed route matrix + provider relationships. **Moat today:** none — design only.

### 1.4 Idea risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Wrong eligibility → user harm | High | Mandatory sources, review, disclaimers, no «recommended lawyer» |
| Data stale faster than updated | High | Daemon + contributors + changelog |
| Corridor cold start (no distribution / no providers) | High | MVP-A: one corridor + manual provider sales |
| Over-scope (build platform before validation) | High | **Cut MVP hard** (see §4) |
| Contributor API spam / bad data | Medium | Dedup, L1+L2, human on T2+ |
| Bar ethics (fee-splitting) | Medium | Marketing fee framing, no endorsement (MONETIZATION §6) |

### 1.5 Idea verdict

**Worth building** — differentiated, defensible long-term, aligns with your stack (Next.js, Supabase, OpenRouter).  
**Not worth building as designed in one shot** — full 3-sided marketplace + LLM review + contributor revshare is a **year** product compressed into docs.

---

## 2. Implementation audit

### 2.1 What's solid ✅

| Area | Why it works |
|------|--------------|
| **3-layer separation** | UI / engine / DB — correct |
| **4 program types + subtypes** | Enough expressiveness without enum explosion |
| **Multi-axis profile** | Core UX insight — don't fork wizard |
| **JSON Logic rules** | Industry standard, explainable, DB-storable |
| **Mandatory proofs** | Trust + legal differentiation |
| **Proposal → review → publish** | Safe open ingest |
| **natural_key dedup** | Prevents contributor spam |
| **Corridor update API** | Useful after corridor PMF, not launch wedge |
| **Manual accepted-lead pilots** | Better MVP fit than CPC marketplace |
| **Schema layers L0–L6** | Clear extension path |

### 2.2 What's over-engineered for day 1 ⚠️

| In docs | MVP reality |
|---------|-------------|
| L1+L2 dual LLM review on every proposal | **Human-only** for first 50 entities |
| Peer contributor verification (L3) | Phase 2 |
| `review_tier_config` in DB | Hardcode 3 tiers in code first |
| Materialized views + Redis | Direct queries + ISR for one corridor |
| 4 program types incl. BIRTH | **3 types** MVP: CAPITAL, LABOR, BOND |
| Full contributor revshare + Stripe Connect | Manual attribution log; payouts later |
| Daemon auto-fetch | Calendar reminder + manual update |
| `compare_dimensions` in DB | 4 hardcoded columns in UI first |
| `page_templates` / SEO auto-pages | 1 program page template |
| `evaluation_mode: points_based` | threshold only MVP |
| Public batch API + gaps endpoint | Internal corridor updates first |

**Pattern:** architecture is **right for v1.0**; **MVP should implement 30% of it**.

### 2.3 What's missing from implementation plan ❌

| Gap | Impact |
|-----|--------|
| No code / migrations yet | Everything is still hypothetical |
| Legal review budget | Blocker before public marketing in EU/US |
| Content ops: who approves T2+? | You / partner — not automated |
| Provider sales playbook | Who signs first 10 lawyers? |
| Analytics / success metrics | No KPIs defined |
| i18n strategy | UI English only? Programs multilingual? |
| Error UX when zero programs match | Edge case not designed |

### 2.4 Technical risks

| Risk | Notes |
|------|-------|
| JSON Logic complexity for contributors | Need good examples; wrong rules → wrong scores |
| `show_if` wizard branching bugs | Test matrix needed |
| Profile schema evolution | Versioning designed but migration UX not |
| Supabase RLS for contributor API | Security design TBD |
| Click fraud before real revenue | Can defer to MVP-C |

### 2.5 Implementation verdict

Architecture is **production-grade thinking**.  
**MVP implementation list in ARCHITECTURE §13 is too large** — would delay validation 3–4×.  
Split into **MVP-A / B / C** below.

---

## 3. Monetization audit

### 3.1 Strengths ✅

- Applicants free — ethical + growth
- Providers pay on accepted qualified leads first — easier to sell than CPC at low volume
- Contributors incentivized without applicant money
- Honest Phase 0 messaging (attribution before payouts)

### 3.2 Weaknesses ⚠️

| Issue | Detail |
|-------|--------|
| Revenue lag | Contributors and you earn $0 until providers pay |
| Provider sales cycle | Immigration lawyers are slow adopters |
| CPC without CPL | Lower revenue per user until Phase 2 |
| 25–35% take + 65–75% contributor pool | Thin margin if review costs are high |

### 3.3 Monetization verdict

Model is **sound**. **MVP-A has no revenue** — that's OK for validation.  
**First dollar:** manual accepted-lead pilot with 3–5 Portugal providers.

---

## 4. MVP definition (recommended cut)

### MVP-A — «Does the first corridor work?» (4–6 weeks)

**Goal:** Validate wizard UX + scoring value with Russian-speaking applicants moving to Portugal. **No marketplace. No public contributor API.**

| Include | Exclude |
|---------|---------|
| Next.js + Supabase | Contributor API |
| Schema **subset** + corridor tables | BIRTH type, visa-free, daemon |
| **One corridor:** RU-speaking → Portugal | Spain, France, LATAM |
| Passports: RU primary; BY, UA, KZ secondary | Full passport grid |
| Routes: PT D8, D7, family; citizenship/CIPLE as roadmap layer | Golden Visa, ES, DE, MX, IT |
| Wizard: core + capital + labor + bond modules (~15 questions) | Birth module |
| JSON Logic evaluator + results + simple compare (4 columns hardcoded) | compare_dimensions table |
| Program page with **sources block** | SEO auto-pages |
| Roadmap (steps from DB) + CIPLE/language requirement step | CPC billing |
| Corridor digest migrated from CIPLE A2 where relevant | Public contributor flywheel |
| Manual provider shortlist form | Provider portal |
| Admin: Supabase Studio + seed scripts | Review pipeline automation |
| Disclaimer on every page | Accounts |

**Success metrics:**
- Wizard completion rate > 40%
- 200 completed wizards from RU channels
- Provider shortlist requests >10% of completions
- 5+ local providers agree to pilot
- Qualitative: «I didn't know I had 3 options»

---

### MVP-B — «Can data scale?» (+3–4 weeks)

**Goal:** Prove knowledge ingestion without full review orchestra.

| Add | Notes |
|-----|-------|
| `knowledge_proposals` + admin approve/reject UI | Human review only |
| `GET /knowledge/exists` + `POST /proposals/batch` | Contributor API v1 |
| `published_entities` + dedup L0 | |
| Preflight + API_CONTRIBUTOR_GUIDE live | |
| Deepen Portugal corridor: more routes, passport rows, and digest items | |
| Changelog on entities | |
| «Suggest correction» form | |

**Success metrics:**
- 1 external contributor submits valid batch
- Time to add new requirement < 1 hour (via API)

---

### MVP-C — «Can we make money?» (+4–6 weeks)

**Goal:** Manual provider revenue in one corridor.

| Add | Notes |
|-----|-------|
| 10-20 manually recruited Portugal providers | |
| Accepted-lead tracking + monthly invoices | |
| Provider shortlist handoff from roadmap | |
| Contributor attribution + accrued balance UI | Manual payout |
| L1 LLM review on ingest | Optional L2 |
| 10+ providers in PT corridor | |

**Success metrics:**
- ≥3 providers accept paid lead pilots
- ≥1 provider prepays or agrees to €50+ accepted CPL
- First manual lead invoice paid

---

### Post-MVP (Phase 2+)

| Feature | When |
|---------|------|
| BIRTH program type | When legal review ready |
| Visa-free layer | Separate product beat |
| Automated CPL leads | After manual CPL works |
| Peer verify, Stripe Connect payouts | Contributor scale |
| Daemon auto-fetch | >20 programs |
| User accounts + alerts | Retention play |
| SEO page factory | Traffic scale |
| points_based evaluation | UK GTV-style programs |

---

## 5. MVP-A build order (concrete)

```
Week 1
  □ Supabase project + migrations (L0/L1/L2 + corridor subset)
  □ Seed RU-speaking → Portugal corridor
  □ Seed PT routes + RU/BY/UA/KZ passport rows (manual, with sources)
  □ profile_schema v1 + wizard_questions seed

Week 2
  □ RuleEvaluator (json-logic-js)
  □ API: programs read, wizard session, evaluate
  □ WizardRunner (generic question renderer)

Week 3
  □ Results page + compare table
  □ Program detail page + sources UI
  □ Roadmap builder + CIPLE/language requirement step
  □ Corridor digest page from migrated CIPLE A2 items

Week 4
  □ Polish, disclaimers, mobile
  □ Analytics (PostHog / Plausible)
  □ Manual provider shortlist form + admin lead list
  □ Soft launch: RU expat TG, 20 user tests

Week 5–6 (buffer)
  □ Fix wizard drop-off
  □ Contact 10-20 Portugal providers for manual pilot
  □ Decide go/no-go for MVP-B
```

---

## 6. What to cut from current ARCHITECTURE §13

Move from «MVP in scope» to **MVP-B/C**:

- [ ] Ingestion L1+L2 LLM → MVP-B human only; L1 in MVP-C
- [ ] Contributor accounts + attribution → MVP-B accounts; MVP-C accrual
- [ ] Provider CPC → **MVP-C only**
- [ ] Update flow + stale_base → MVP-B
- [ ] BIRTH in seed → Post-MVP
- [ ] Manual daemon → never in MVP-A; reminder in Notion is enough

Keep in MVP-A:

- [x] Schema subset
- [x] 3 PT programs, 2 passports
- [x] Wizard + evaluator + results + sources
- [x] Publish gate (sources required)

---

## 7. Go / no-go criteria

### Go to MVP-B if MVP-A shows:

- ≥100 wizard completions
- ≥30% see 2+ matching routes
- Source links clicked in >15% sessions

### Go to MVP-C if MVP-B shows:

- Data updates via API without deploy
- Organic repeat visits
- ≥2 inbound provider inquiries

### Pivot if:

- Users don't trust scores (need human consult CTA)
- Wizard too long (<25% completion)
- PT-only too narrow → pick corridor with your traffic (RU→GE, RU→AE, etc.)

---

## 8. Final verdict

| Question | Answer |
|----------|--------|
| Is the idea good? | **Yes** — clear problem, differentiated |
| Is the architecture good? | **Yes** — for v1.0, not all for MVP-A |
| Is documentation enough to build? | **Yes** — SCHEMA_AND_API + guides are sufficient |
| Biggest mistake to avoid? | Building broad visa finder / marketplace before corridor demand |
| What is MVP? | **MVP-A:** RU-speaking → Portugal corridor, sources, digest, manual shortlist |
| When first revenue? | Manual accepted CPL pilot after provider sales |

---

*Next step: approve MVP-A scope → Supabase migrations + seed PT pack.*
