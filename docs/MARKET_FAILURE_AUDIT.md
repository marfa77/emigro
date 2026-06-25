# Emigro — Corridor Market Failure Audit

> **Purpose:** Pre-mortem — why we may get **no traffic, no users, no money**.  
> Companion: [AUDIT.md](./AUDIT.md) (product/tech), [MONETIZATION.md](./MONETIZATION.md)

---

## TL;DR — top 5 ways we die

| # | Death cause | Probability if unchanged |
|---|-------------|--------------------------|
| 1 | **We accidentally compete as a broad visa finder** instead of owning one corridor | High |
| 2 | **Corridor depth is not deep enough** — users see «same as ChatGPT/Transita, just in Russian» | High |
| 3 | **No owned RU distribution** — Telegram/content channels don't convert to wizard completions | High |
| 4 | **Manual provider sales fail** — local providers don't accept/pay for RU-speaking leads | Medium–High |
| 5 | **CIPLE/digest layer doesn't create trust or repeat visits** | Medium |

**Updated strategy:** We do **not** compete head-on with Transita as a global visa finder. We compete by becoming the deepest live corridor for **RU-speaking applicants → Portugal**. Without corridor-specific distribution and provider ops, traffic and revenue are still likely near zero.

---

## 1. Competitive landscape — avoid their game

### 1.1 Direct competitors (eligibility quiz + sources)

| Player | What they do | Threat to Emigro |
|--------|--------------|------------------|
| **[Transita](https://transita.app/)** | 45s quiz, **74+ pathways, 10 countries**, ranked matches, **government source URLs**, multi-step pathways, weekly policy email | Existential only if we compete as a broad visa finder |
| **[USVisaStack](https://usvisastack.ai/)** | Free AI visa finder, 17+ US categories, scores 0–100%, upsell $49 deep reports | Owns US intent |
| **[OpenSphere](https://toolkit.opensphere.ai/)** | O-1A / EB-1A eligibility tools, founder-focused | Owns US talent visa niche |
| **[Immigram](https://www.immigram.io/)** | UK Global Talent scoring + paid turnkey | Owns UK GTV niche |
| **VisaDB, iVisa, VisaGuide** | Static databases, huge SEO | Own long-tail |
| **ChatGPT / Claude / Perplexity** | Free answers, improving citations | «Good enough» for 80% of questions |

**Transita in particular:**
- Free top match + **$9 unlock** for all matches (they monetize B2C; we refuse to — good ethically, bad for revenue diversity)
- Already claims dated, sourced data across 10 destinations
- 80+ programmes — we're planning 3 for MVP

**Why we lose if we play their game:** User googles «best visa for software engineer» → finds Transita or AI → never finds Emigro.

**How corridor-first avoids direct competition:** we do not position as «best visa finder». We position as:

> Живой коридор RU/BY/UA/KZ → Португалия: D8, D7, family route, CIPLE/citizenship path, official sources, digest, local provider handoff.

Transita can be wider. We must be deeper.

### 1.2 Indirect competitors (they take the money)

| Player | Model |
|--------|-------|
| **Portugal Pathways, Golden Visa firms** | SEO + ads + consultation; $5k–50k per case |
| **Caribbean CBI agents** | High commission on investment |
| **Law firms (Harvey, LegalBridge B2B)** | AI for firms, not neutral marketplace |
| **Relocation agencies** | End-to-end paid service |

They have **trust, sales teams, and SEO budgets**. We have a wizard.

### 1.3 B2B immigration tech (different game)

CaseBlink, Gale, Tukki ($1M), Visalaw.ai — **sell to law firms**, not consumers. Better unit economics, funded competitors. If we fail B2C, we'd be pivoting into crowded B2B.

---

## 2. Traffic — why nobody will come

### 2.1 SEO is brutally hard (YMYL)

Immigration / Golden Visa = **Your Money Your Life** category for Google.

Evidence from market:
- Leaders invest in **DR 70+ media placements**, not just content ([golden visa SEO case](https://buylink.pro/blog/en/case-in-the-golden-visa-niche-from-33k-to-60k-in-3-months/) — 33k→60k monthly took premium outreach budget)
- [Portugal Pathways](https://www.linkgraph.com/case-studies-and-results/portugal-pathways-increases-form-starts-by-317-in-3-months/) deliberately **cut** low-intent traffic (weather pages) to focus on visa keywords — incumbents are optimizing while we start at zero
- Competing on «golden visa», «citizenship by investment» = **global firms with PR budgets**

**Old plan:** SEO auto-pages from DB — **useless without domain authority**. New domain + programmatic pages = thin content risk.

**Corridor plan:** community/digest first, SEO second. Traffic comes from Russian-language corridor content, CIPLE A2 assets, Telegram/YouTube, partner channels, and provider/community referrals.

| Query type | Can we rank in year 1? |
|------------|------------------------|
| «portugal golden visa requirements 2026» | Unlikely without 12+ months + link budget |
| «emigrate from russia to portugal» | Maybe long-tail, low volume |
| Branded «emigro» | Only if we build brand elsewhere first |

### 2.2 AI ate informational traffic

Users ask ChatGPT before Google. Our sourced data is **better** — but users don't know that. AI answers are instant, free, no signup.

**GEO (Generative Engine Optimization)** is the new SEO — Transita and incumbents are already optimizing for AI citations.

### 2.3 No natural viral loop

- Relocation is **once per lifetime** (or once per decade)
- Users don't share «my visa score» on social (sensitive)
- No network effects for applicants
- Contributor API doesn't bring **users** — only data

**K-factor ≈ 0** unless we build content marketing (YouTube, TG channels) — not in MVP.

### 2.4 Traffic we might realistically get (year 1, no paid budget)

| Channel | Realistic |
|---------|-----------|
| Organic SEO | 200–2,000 visits/mo (long-tail only) |
| Expat Telegram / Reddit | Spikes of 500 if we post; not sustained |
| Contributor API buzz (HN) | 1-day spike, 1–5k, then zero |
| Paid ads | Not in plan; CAC for legal intent $50–130+ per click |

**Without owned audience:** expect **<500 MAU** month 6.

### 2.5 Failure mode: «build it and they don't come»

```
Launch MVP-A → 50 friends test → 0 organic
→ No SEO traction (6 mo) → Team demotivated
→ Data goes stale → Even fewer reasons to visit
```

---

## 3. Users — why they won't stay or trust us

### 3.1 Trust deficit

| Issue | Impact |
|-------|--------|
| Unknown brand + life-changing decision | Users default to lawyer / established site |
| Wrong eligibility = costly mistake | One viral «Emigro said yes, consulate said no» kills brand |
| «Not legal advice» disclaimer | Users still treat us as advice; disappointment when wrong |
| RU/UA audience + sanctions narrative | Extra skepticism for certain passports |

**Immigram / Transita** lead with expertise narrative. We lead with «open database» — weaker for anxious users.

### 3.2 Transita already won the «sourced quiz» positioning

Their copy: *«Every datum dated and linked to its government source»* — same as ours. Hard to differentiate in user minds.

### 3.3 Wizard fatigue

15–25 questions → drop-off. Transita claims **45 seconds**. Our multi-axis wizard is **more accurate** but **longer** — conversion killer.

### 3.4 One-and-done usage

No account, no alerts (MVP-A) → user completes wizard once → never returns.  
**No retention = no provider value = no revenue.**

### 3.5 Failure mode: «high bounce, no wow»

```
User lands → quiz 8 min → 2 routes match
→ Sources look like gov links they could Google themselves
→ Leaves for lawyer referral from friend
```

---

## 4. Money — why revenue may be zero

### 4.1 Corridor ops cold start

```
Need RU users → need Portugal provider shortlist → need providers to accept leads
→ need data/digest to earn trust → need distribution to prove lead volume
```

We reduce marketplace risk by starting with **manual qualified lead handoff**, not self-serve CPC. But manual sales can still fail.

Our sequence assumes:
1. Free users show up (they may not)
2. Providers accept/pay for qualified leads (why? no volume)
3. Contributors fill data too early (why? no corridor revenue yet)

### 4.2 Providers won't pay early

| Provider objection | Reality |
|--------------------|---------|
| «No traffic» | Valid — 100 visits/mo isn't worth dashboard time |
| «I already pay Google $130/lead» | Need proof your leads convert |
| «Neutral platform doesn't endorse me» | CPC without trust = low bid |
| «Bar ethics» | Marketing fee OK, but legal teams are conservative ([legal marketplace compliance](https://www.lowcode.agency/blog/how-to-build-a-legal-services-marketplace)) |
| «My competitor is also listed» | Reduces willingness to pay premium |

**Immigration lawyers** are slow adopters. **Translation/photo** providers have low CPC tolerance (€3–10) — need **massive volume**.

### 4.3 Contributor flywheel may never spin

| Stage | Blocker |
|-------|---------|
| Contributors need API | Devs only — tiny pool |
| Contributors need $ | No provider $ → no payout → demotivated |
| LLM submissions | Quality issues → review bottleneck (you) |
| Duplicates / spam | Reputation system empty at start |

**Early API marketing on HN** → 50 proposals for Portugal D8 → all duplicates of Transita data → no value.

### 4.4 We rejected B2C monetization

Transita: **$9/report**. We: **free forever**.

Ethically right. Financially: **no revenue until providers pay** — could be 12–18 months.

### 4.5 Unit economics (pessimistic year 1)

```
500 MAU × 10% click provider × €40 CPC = €2,000 gross
× 25% platform take = €500 revenue / month
− hosting, review time, your hours = negative
```

### 4.6 Failure mode: «€0 MRR at month 12»

```
Manual lead pilot launched → 2 providers listed free
→ 40 clicks total → €800 billed → providers dispute half
→ Contributors accrued €12 → ask for payout → embarrassment
→ Shut down marketplace, keep docs
```

---

## 5. Structural weaknesses in our positioning

### 5.1 «Broad platform» vs corridor focus

Broad coverage is a **scale play**. Traffic acquisition is **local/niche**. Starting broad = ranking nowhere.

**Decision:** start with one corridor (RU-speaking → PT) with 100% data depth, digest, and provider ops. Transita may list PT; we must own the corridor context.

### 5.2 Open contributor API as moat — weak early

Moat needs:
- Published, trusted corpus (we don't have)
- Provider liquidity (we don't have)
- Brand (we don't have)

Contributor API is a **scale accelerator after PMF**, not a **traffic magnet**.

### 5.3 Better data alone doesn't win distribution

Sourced requirements are **table stakes** (Transita does it).  
**Distribution** wins: SEO authority, community, paid, partnerships.

We designed product + data pipeline, **not distribution**.

### 5.4 Legal liability without revenue

High-risk data (passport blocks, BIRTH, costs) + human review = **your time cost** scales with contributors, not with revenue.

---

## 6. Audience-specific risks

### 6.1 Russian-speaking emigrants (likely early audience)

| Factor | Risk |
|--------|------|
| High intent | ✅ Good |
| TG communities | ✅ Distribution possible |
| Sanctions / passport stigma | Programs change, high error cost |
| Many already use agents | Trust personal referral > tool |
| Compete with free Telegram «эксперты» | Noise, scams, hard to stand out |

### 6.2 HNW Golden Visa seekers

| Factor | Risk |
|--------|------|
| High LTV | ✅ Good for providers |
| Expect white-glove | Won't use free wizard; use lawyer |
| SEO dominated by firms | We won't reach them |

### 6.3 Digital nomads

| Factor | Risk |
|--------|------|
| Price sensitive | Won't pay providers much |
| Reddit/Twitter DIY culture | Free tools + AI |
| Lower CPC | Need volume we won't have |

---

## 7. Scenario table — outcomes

| Scenario | Traffic Y1 | Revenue Y1 | Likelihood |
|----------|------------|------------|------------|
| **A. Slow death** | <1k MAU | €0 | 50% |
| **B. Niche cult** | 2–5k MAU one corridor, TG-driven | €500–2k/mo mo 12 | 25% |
| **C. Pivot B2B** | N/A | SaaS to firms | 15% |
| **D. Breakout** | 20k+ MAU, SEO hits | €10k+/mo | <5% |
| **E. Acqui-hire / data licensing** | Medium | One-time | 5% |

---

## 8. What would need to be true to NOT fail

### Distribution (pick ONE, commit)

| Wedge | Example |
|-------|---------|
| **Owned audience** | You run PT expat TG 50k+ |
| **Single corridor SEO** | «RU → PT 2026» only, 200 articles + links budget €2k/mo |
| **Partnership** | White-label wizard for relocation agency |
| **B2B** | Sell eligibility API to law firms (LegalBridge competitor angle) |
| **Geo arbitrage** | Corridors Transita covers poorly (Gulf, LATAM?) |

### Product differentiation (must be obvious in 10 sec)

| vs Transita | Emigro must show |
|-------------|------------------|
| They: 10 countries shallow | We: **one corridor deepest** (every passport × every step) |
| They: $9 unlock | We: **100% free** |
| They: single quiz | We: **3 routes compared** (spouse + nomad + golden) |
| They: closed | We: **changelog + who updated** |

### Monetization hedge

Consider **optional** (not blocking core):
- B2B API to agencies (monthly fee)
- Sponsored «editorial» country guides (not pay-for-rank)
- Affiliate on **non-legal** (insurance, relocation) — careful with ethics

### Realistic MVP success = not revenue

| Metric | Target |
|--------|--------|
| 200 wizard completions from **one channel you control** | TG / partner |
| 40% see 2+ routes | Product value |
| NPS / «would recommend» | Trust |
| 1 agency says «we'd pay for leads» | Revenue signal |

---

## 9. Kill criteria (when to stop)

Stop or pivot if after **6 months** post MVP-A:

- [ ] <100 organic visits/month AND no owned channel >1k
- [ ] <50 wizard completions/month
- [ ] 0 providers willing to prepay €100
- [ ] Transita / AI answers «good enough» in user interviews
- [ ] Review queue >20h/week unpaid (contributor API unsustainable)

---

## 10. Verdict

| Question | Honest answer |
|----------|---------------|
| Will we fail on traffic? | **Likely**, without distribution wedge — product doesn't create traffic |
| Will we fail on users? | **Risky** — trust + Transita + AI + one-time use |
| Will we fail on money? | **Very likely** in year 1 — marketplace + free B2C = long path to € |
| Is the idea wrong? | **No** — but **go-to-market is underspecified** |
| Biggest mistake | Building platform before owning **one corridor's audience** |

**We're not failing because the engine is wrong. We fail because:**
1. **Transita already ships the quiz + sources story**
2. **SEO is a money war we haven't budgeted**
3. **Free users don't bring money; providers won't come without users**
4. **Contributors don't solve traffic — only content depth**
5. **No retention loop**

---

## 11. Recommended response (if we still want to play)

1. **Pick one corridor:** RU/UA → PT only (or where YOU have audience)
2. **Beat Transita on depth there:** every passport, every cost line, changelog, 3-axis compare
3. **Distribution first:** TG channel / partner agency **before** contributor API
4. **MVP-A success = 200 completions via owned channel**, not SEO
5. **Revenue test:** 1 agency prepaid pilot before building CPC infra
6. **Delay** public contributor API until corridor is undeniably best for that niche

---

*Last updated: 2026-06-23*
