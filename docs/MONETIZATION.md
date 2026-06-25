# Emigro — Monetization Policy

> **Hard rule:** the service is **always free for applicants** (people exploring relocation, visas, citizenship).  
> Revenue comes **only from service providers** and optional platform-funded launch incentives.  
> Contributors earn **revshare from provider revenue**, not from applicants.

Full architecture context: [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## 1. Three-sided model

```
                    ┌──────────────┐
                    │  APPLICANTS  │  FREE forever
                    │  (wizard,    │  wizard · results · roadmap · compare
                    │   roadmap)   │
                    └──────┬───────┘
                           │ qualified intent
                           ▼
                    ┌──────────────┐
                    │   EMIGRO     │  platform fee 25–35%
                    │  (matching,  │
                    │   knowledge) │
                    └──────┬───────┘
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    ┌────────────┐  ┌────────────┐  ┌────────────┐
    │ PROVIDERS  │  │CONTRIBUTORS│  │  (future)  │
    │ pay accepted│ │ revshare   │  │  data/API  │
    │ CPL first  │  │ from pool  │  │  enterprise│
    └────────────┘  └────────────┘  └────────────┘
```

| Party | Pays | Receives |
|-------|------|----------|
| **Applicant** | nothing | eligibility, roadmap, provider directory |
| **Provider** | accepted CPL first; later automated CPL/CPC/subscription | qualified corridor leads |
| **Contributor** | nothing | revshare when providers pay on their data |
| **Platform** | ops, review, infra | take rate on provider spend |

---

## 2. Applicant policy (free tier — non-negotiable)

### Always free

- Full wizard (all axes: capital, labor, bond, birth)
- Eligibility results and route comparison
- Personalized roadmap (steps, costs, timelines from knowledge base)
- Viewing provider cards (name, category, geo, verified badge)
- Reading program pages, changelog, sources
- «Suggest correction» / report outdated (optional login)
- Public knowledge read API

### Never charge applicants for

- «Unlock results» paywalls
- Premium routes or hidden programs
- Contacting providers through the platform (provider pays, not user)
- Passport-specific eligibility checks

### Optional future (still applicant-free)

- Saved roadmaps / change alerts (account feature, not paywall)
- PDF export, share link — free
- If ever B2C premium: **separate product**, not blocking core relocation path (e.g. concierge — out of scope for MVP)

---

## 3. Provider monetization (primary revenue)

### 3.1 Industry benchmarks (2025–2026)

Sources: [WordStream legal benchmarks](https://www.wordstream.com/blog/2025-google-ads-benchmarks), [Thumbtack/Avvo lead pricing](https://www.clio.com/blog/best-lead-generation-services-lawyers-reviews/), [Google LSA vs Ads](https://www.contractorbear.com/blog/lsa-vs-google-ads-contractors).

| Vertical | Typical CPC (paid search) | Typical CPL (qualified lead) | Notes |
|----------|---------------------------|------------------------------|-------|
| Legal (blended) | ~$9–50+ | **~$130** avg (US) | Highest CPL of all industries |
| Immigration law (marketplace) | — | **$15–100** / lead | Thumbtack-style ranges by geo |
| Relocation / business services | $5–20 | $40–100 | Lower than litigation |
| Local services (LSA) | — | **$25–70** / lead | Pay only on contact; dispute credits |

**Implications for Emigro:**

- Immigration **legal** providers can afford **€25–80** per qualified action
- **Translation, photos, language schools** — **€3–25** (lower LTV, volume play)
- **Relocation agencies** — **€15–50** mid-range
- Optimize for **qualified intent**, not raw clicks — legal CPL inflation makes quality mandatory

### 3.2 Recommended model: manual CPL → automated CPL → CPC marketplace

Best practice from Thumbtack, Google LSA, Avvo: **providers pay for measurable intent**, not impressions.

| Phase | Billable event | Why |
|-------|----------------|-----|
| **MVP-A/B** | **Manual qualified lead handoff** | We negotiate with providers ourselves; no empty marketplace |
| **MVP-C** | **Accepted CPL** | Provider pays after accepting structured intake packet |
| **Phase 2** | Automated CPL | Provider dashboard, lead delivery, dispute flow |
| **Phase 3** | CPC-Q + optional subscription | Self-serve marketplace once volume exists |

#### Manual qualified lead handoff — corridor MVP default

In the RU-speaking → Portugal corridor, do not start with a provider portal or CPC. Start with provider sales and manual delivery.

```
1. We find 10-20 local Portugal providers
2. First 3-5 qualified leads free
3. Then provider pays per accepted lead
4. Monthly manual invoice
5. Learn rejection reasons before building automation
```

Qualified lead packet:

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

Provider can reject within 7 days if contact is fake, wrong corridor, duplicate, or outside agreed service scope. Provider cannot reject simply because the user did not retain them.

#### Accepted CPL — first paid model

Starting prices for corridor pilots:

| Category | Accepted CPL pilot |
|----------|--------------------|
| Immigration legal | €50–150 |
| Relocation agency | €30–80 |
| Translation / documents | €10–30 |
| Language / CIPLE prep | €10–25 |

Exclusive lead = 2–3× shared lead price.

#### CPC‑Q (qualified click) — later self-serve marketplace

Charge when **all** conditions met:

```
✓ logged or fingerprinted unique session (dedupe 24h per provider)
✓ user viewed roadmap step ≥ 3s
✓ click on designated CTA: "Visit site" | "Email" | "Book call"
✓ provider active, budget remaining, geo match
✓ not bot / not provider self-click
```

Do **not** charge for: impression, hover, expand card, internal navigation.

#### Automated CPL (qualified lead) — Phase 2

Charge when user submits structured intro:

```
fields: name, email, destination, program route, optional message
provider receives lead in dashboard + email
SLA: provider should respond within 24h (badge incentive)
```

**Exclusive lead** (one provider only): 2–3× shared lead price — standard marketplace practice.

#### Subscription (optional enhancement)

| Tier | Monthly | Includes |
|------|---------|----------|
| **Listed** | €0 | basic profile, organic placement by bid only |
| **Pro** | €99–299 | analytics, priority review, badge, lower CPC rate |
| **Enterprise** | custom | multi-office, API, white-label reports |

Subscription is **additive**, not required to appear. Free listing keeps marketplace liquid at launch.

### 3.3 Auction & ranking (Google Ads / LSA-inspired)

Placement order on roadmap step:

```
ad_rank = bid × quality_score
```

**Quality score (1–10)** factors:

| Factor | Weight | Source |
|--------|--------|--------|
| Verification status | high | KYC, bar license check (legal), manual review |
| Response time | medium | median time to first reply on leads |
| Dispute rate | high | lower score if many invalid click disputes upheld |
| User rating | medium | post-click optional 1–5 (Phase 2) |
| Profile completeness | low | logo, languages, geo, categories |
| Historical conversion | medium | click → retained client proxy (self-reported Phase 2) |

Higher quality score → **lower effective CPC** for same position (second-price auction logic). Rewards good providers, not only highest bidder.

**Neutral matching (legal ethics):** ranking must **not** be presented as «best lawyer» or «recommended». UI copy: *«Providers available for this step»* / *«Sponsored placement»*. Payment buys visibility, not endorsement — aligns with [NYSBA Ethics Opinion 1213](https://nysba.org/ethics-opinion-1213/) (marketing fee OK if no vouching).

### 3.4 Provider controls (Thumbtack / LSA best practices)

Providers manage campaigns in portal:

```
- categories: legal, relocation, translation, photos, language_courses
- geos: countries served, languages
- program types / specific programs
- roadmap steps where they appear
- bid: max CPC or max CPL
- budgets: daily cap, weekly cap, monthly cap (auto-pause at zero)
- schedule: business hours for lead delivery (Phase 2)
- accept/reject: preview lead before pay (Phase 2 CPL optional mode)
```

**Budget auto-pause** when cap hit — prevents surprise bills (LSA weekly budget pattern).

### 3.5 Pricing grid (starting points — tune by market)

| Category | CPC‑Q (MVP) | CPL exclusive (Phase 2) | Rationale |
|----------|-------------|---------------------------|-----------|
| Immigration legal | €35–80 | €80–200 | WordStream legal CPL ~$131; immigration mid-range |
| Relocation agency | €20–45 | €50–120 | Business services band |
| Translation / apostille | €8–18 | €20–50 | Lower LTV, volume |
| Language courses | €10–25 | €25–60 | Comparable to education leads |
| Document photos | €3–10 | €10–25 | Low ticket |
| Birth tourism agencies | €30–70 | €80–150 | High case value |

**Dynamic floors** by country pair (PT, AE, US) — stored in DB, not hardcoded.

**Early adopter pricing (launch):** first 90 days — 50% CPC discount or €500 free click credit. Funded from platform, not contributors.

### 3.6 Billing mechanics

| Item | Policy |
|------|--------|
| Payment method | card on file (Stripe); prepaid wallet optional |
| Charge timing | CPC: immediate on qualified click; CPL: on lead delivery |
| Hold / dispute | 7-day dispute window; charge final after hold |
| Invalid click credit | bot, wrong geo, duplicate session, provider self-click → auto or manual credit (LSA-style) |
| Invoicing | monthly statement + VAT where applicable |
| Minimum top-up | €100 wallet or €50/month spend commit for paid placement |

### 3.7 Provider verification (trust + ethics)

Before paid placement:

- Business entity verification
- **Legal category:** bar license / immigration consultant registration where applicable
- Explicit ToS: Emigro is **not** legal advice; provider is independent
- No fee-splitting language — **marketing/advertising fee** for visibility
- Prohibited: providers editing program eligibility data (only contributor API with review)

---

## 4. Contributor monetization

### 4.1 Source of funds

Contributors earn **only from provider revenue** attributed to their published entities:

```
provider_pays (CPC or CPL)
  → platform_fee (25–35%)
  → contributor_pool (65–75% of net)
  → split by entity_contributions weights
```

No applicant money flows to contributors. Optional **platform bounties** (launch only) are separate budget.

### 4.2 Attribution split (per entity)

| Role | Share of contributor pool | When |
|------|---------------------------|------|
| `author` | 60% | first publish |
| `verifier` | 25% | peer verify on publish (Phase 2) |
| `updater` | 15% | split across approved updates |

Material update to high-traffic program can use **boosted updater weight** for that revision (config).

### 4.3 Billable events that fund contributors

| Event | Funds contributor pool? |
|-------|-------------------------|
| Qualified provider click (CPC‑Q) on program with attribution | ✅ yes |
| Qualified lead (CPL) on attributed program/step | ✅ yes |
| Applicant uses wizard | ❌ no |
| Proposal approved but zero provider spend | ❌ no |
| Duplicate / rejected proposal | ❌ no |

### 4.4 Payout policy

| Rule | Value |
|------|-------|
| Trigger | provider charge cleared (after dispute hold) |
| Hold period | 30 days (chargebacks, provider disputes) |
| Minimum payout | €50 |
| KYC | required before first payout (Stripe Connect / Wise) |
| Phase 0 (pre-provider) | accrued balance visible; payout €0 until first CPC |

### 4.5 Launch bounties (optional, platform-funded)

Separate from revshare — avoids misleading «earn now» before CPC exists:

| Bounty | Amount | Condition |
|--------|--------|-----------|
| First verified program pack (country) | €50–200 | human-approved, complete requirements + 1 passport matrix |
| Material correction on flagged entity | €10–30 | approved update resolving user flag |
| Early contributor 2× revshare | 6 months | first 50 contributors, after CPC live |

Bounties do **not** reduce provider pricing or contributor revshare pool.

---

## 5. Revenue split summary

Example: immigration lawyer click, €50 CPC‑Q

```
€50.00  provider charged
-€12.50  platform fee (25%)
────────
€37.50  contributor pool (75%)

Contributor pool split (program entity):
  €22.50  author (60%)
  €9.38   verifier (25%)
  €5.62   updaters (15%)
```

Platform fee covers: infra, LLM review, human review, payment processing (~3%), fraud, support.

**Target platform gross margin:** 25–35% at scale. Adjust contributor pool if needed — **never** below 60% of net to preserve contributor incentive.

---

## 6. Legal & compliance framing

### 6.1 Applicant-facing

- «Informational eligibility tool, not legal advice»
- «Consult a qualified professional before acting»
- Every data point: source + last verified

### 6.2 Provider-facing

- Payment is for **advertising / lead generation**, not referral fee for legal services
- Platform does **not** recommend or endorse providers
- Ranking = bid × quality + category match, disclosed as sponsored
- Provider responsible for compliance with local bar / consultant rules

### 6.3 Contributor-facing

- Contributors supply **factual data with sources**, not legal advice
- Revshare is **data licensing / revenue share**, not fee-splitting on legal work
- Contributors must not be the same entity as a provider on the same program without disclosure

### 6.4 Ethics alignment (US/EU practice)

Based on [NYSBA 1213](https://nysba.org/ethics-opinion-1213/) and NJ pay-per-lead guidance:

| OK | Not OK |
|----|--------|
| Flat marketing fee for visibility | «We recommend this lawyer» |
| Pay per contact / qualified click | Pay per retained client (disguised referral) |
| Neutral list sorted by bid + quality | «Best lawyer for your case» |
| Verified credentials (license exists) | Vouching for competence/outcome |

Emigro matches **programs** to users; providers are **optional marketplace listings** on roadmap steps — structurally similar to permitted lead-gen if disclaimers hold.

---

## 7. Fraud & quality (protect all three sides)

| Risk | Mitigation |
|------|------------|
| Click fraud | session dedupe, IP/device fingerprint, provider cannot click own listing |
| Provider bill shock | daily/weekly caps, email alerts at 80% budget |
| Low-quality leads | CPC‑Q rules; Phase 2 lead preview; dispute credits |
| Contributor spam | dedup API, reputation penalty, no pay on duplicates |
| Applicant data sale | **never sell applicant PII** to providers without explicit opt-in on CPL form |

**CPL opt-in copy:** *«Share my details with [Provider Name] so they can contact me about [step].»*

---

## 8. Metrics & optimization (provider ROI)

Track per provider (dashboard):

```
spend · clicks · leads · cost per lead · disputed % · programs covered
```

Platform optimizes toward **provider retention**, not max short-term CPC:

- High dispute rate → lower quality score → cheaper for others, expensive for bad actor
- Industry data: legal lead-to-client ~14% avg, top firms 40%+ — providers stay if leads convert

**Do not optimize contributor payouts on raw click volume** — optimize on provider satisfaction + data accuracy.

---

## 9. Rollout phases

| Phase | Applicant | Provider | Contributor |
|-------|-----------|----------|-------------|
| **0 — Corridor seed** | free wizard + results | manually recruited providers, first leads free | attribution optional; no payouts |
| **1 — Manual CPL** | free | accepted-lead pilot, monthly invoice | manual accrual if contributor data used |
| **2 — Automated CPL** | free | provider dashboard, disputes, exclusive option | revshare on cleared leads |
| **3 — CPC / Pro tier** | free | self-serve placements, CPC-Q, subscriptions | peer verify + automated payouts |

---

## 10. What we explicitly do NOT do

- ❌ Charge applicants for core wizard or results
- ❌ Sell applicant data without opt-in
- ❌ Pay contributors from applicant fees
- ❌ Present paid providers as «recommended lawyers»
- ❌ Charge providers per retained client (only per click/lead)
- ❌ Guarantee provider outcomes or applicant eligibility

---

## 11. Open pricing decisions

- [ ] Exact platform take rate at launch (25% vs 30% vs 35%)
- [ ] CPC floors per category — start conservative (high) or land-grab (low)?
- [ ] Exclusive CPL multiplier (2× vs 3×)
- [ ] Free listing forever vs minimum spend after N months
- [ ] Multi-currency billing (EUR primary, USD for Caribbean/US providers)

---

*Last updated: 2026-06-23*
