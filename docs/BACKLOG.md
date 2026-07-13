# Product backlog

Running list of product ideas and pilots. Domain-specific backlogs live elsewhere:

- Fact-check fixes: [FACTCHECK_BACKLOG.md](./FACTCHECK_BACKLOG.md)
- Community strategy (phases): [COMMUNITY_STRATEGY.md](./COMMUNITY_STRATEGY.md)
- Satellite SEO audit: [SATELLITE_SEO_GEO_LLM_AUDIT.md](./SATELLITE_SEO_GEO_LLM_AUDIT.md) § Prioritized backlog
- Non-EU corridors: [CORRIDOR_STRATEGY.md](./CORRIDOR_STRATEGY.md) § 10

Append new entries at the bottom. Status: `idea` | `pilot` | `in_progress` | `done` | `deferred`.

---

## PT-001 — Entrepreneur registry / founders community (Portugal satellite)

| Field | Value |
|-------|-------|
| **Status** | `pilot` (MVP) |
| **Priority** | After guide content layer is stable |
| **Surface** | Portugal satellite (`portugal.emigro.online`) |
| **Related docs** | [PORTUGAL_SATELLITE.md](./PORTUGAL_SATELLITE.md), [COMMUNITY_STRATEGY.md](./COMMUNITY_STRATEGY.md) |

### Idea

Curated registry / community of entrepreneurs — **not** a generic business directory. Focus: relocants who run a business in Portugal (Norte), experience sharing, occasional meetups, joint initiatives.

**Verdict:** Yes, but as MVP pilot — not a full «union» or paid marketplace.

### MVP scope

- Page `/community` or `/founders` on Portugal satellite
- **15–30 curated profiles:** name, niche, city, what they can help with, link, relocation year
- **Entry criteria:** lives in PT; has business activity (empresa / recibos verdes / remote + NIF)
- Form **«Want to join registry»**
- **Guide cross-links:** 1–2 quotes from registry members in bank, NIF, and similar guides
- **Monthly informal meetups:** coffee + 3 topics
- **Languages:** RU + EN profiles; disclaimer — not service endorsement

### Acceptance criteria (6–8 weeks post-launch)

| Metric | Target |
|--------|--------|
| Applications via join form | ≥ 20 |
| Approved profiles live | ≥ 10 |
| Meetups with ≥ 15 attendees | 1–2 |
| Guide → community CTR | ≥ 2% |

### Explicitly out of scope (now)

- Full association / union structure
- Paid membership
- Ratings API
- 500-company catalog

### Notes

- Distinct from Telegram community layer in [COMMUNITY_STRATEGY.md](./COMMUNITY_STRATEGY.md) — this is a **curated public registry** on the satellite, not chat signals or on-site feedback.
- Recorded: 2026-07-13.

---

## PT-002 — VNJ renewal guide (Portugal pillar)

| Field | Value |
|-------|-------|
| **Status** | `idea` |
| **Priority** | High — distinct search intent from Agora booking; complements `vnj-portugaliya-d8-d7-grazhdanstvo-2026` |
| **Surface** | Main site pillar (`/ru/guides/`) |
| **Suggested slug** | `prodlenie-vnzh-portugaliya-aima-2026` |
| **Related docs** | [SEO_GUIDE_STANDARD.md](./SEO_GUIDE_STANDARD.md), [PORTUGAL_GUIDE_FACTCHECK.md](./PORTUGAL_GUIDE_FACTCHECK.md), [VOLATILE_GUIDE_FACTCHECK.md](./VOLATILE_GUIDE_FACTCHECK.md), [FACTCHECK_BACKLOG.md](./FACTCHECK_BACKLOG.md) |
| **Related content** | Community note `aima-agora-zapis-2026` (booking only — short bridge, not duplicate) |

### Idea

Dedicated **pillar guide** for **renewal** of Portuguese residence permits (renovação do título de residência) — D7, D8, work, study, family reunification. Covers eligibility, document pack, fees, timelines, expired-card edge cases, and Agora vs `services.aima.gov.pt` renewal flows.

**Not** a rewrite of the Agora booking note. That note stays focused on slot hunting; this guide owns the full renewal lifecycle.

### Quality bar — triple fact-check (mandatory)

Every factual claim must survive **three passes** before publish. No pass may be skipped.

| Pass | When | What | Output |
|------|------|------|--------|
| **1 — Official** | After first draft | Each law/threshold/procedure/fee/deadline vs **primary sources**: [aima.gov.pt](https://aima.gov.pt/), [services.aima.gov.pt](https://services.aima.gov.pt/), [agora.imigrante.pt](https://agora.imigrante.pt/), gov.pt decrees, Finanças where tax proof matters | Claim → source URL + `date_modified` anchor; hard claims only with citation |
| **2 — Channels** | After pass 1 | Each practice/timeline/wait-time/pitfall claim vs **Telegram channels** (see below) via `npm run portugal:guide-factcheck` + `community_signals` / `lib/community-notes/practice-enrichment.ts` | Claim → channel(s) + period (`2025–2026`, `июль 2026`); use `formatPortugalChatCitation` |
| **3 — Legal / timeline review** | Pre-publish | Full read for internal contradictions (quick_answer vs body), stale dates, mixed renewal vs first-issue flows, expired-card myths; run `npm run guides:volatile-factcheck -- --slug=prodlenie-vnzh-portugaliya-aima-2026` | Zero unresolved critical issues; contradictions fixed or softened |

**Accuracy rule:** 100% precision on verifiable facts **or** soft wording + disclaimer when uncertain.

- **Hard claims** (fees, legal deadlines, mandatory documents, portal behaviour): require pass-1 official link in the same section.
- **Practice claims** (wait times, slot patterns, regional bottlenecks): require pass-2 channel attribution; phrasing: «участники чата сообщали…», «в чатах повторяют…», «по состоянию на…» — never «все знают», «официально», «гарантированно».
- **Uncertain / evolving** (AIMA backlog, new portal flows): explicit disclaimer block + «проверьте на дату подачи»; prefer ranges over point estimates.
- **Do not invent quotes** — only `community_signals`, `SEED_FACTCHECK_SIGNALS`, or curated `lib/community-notes/guides/*` / `CURATED_PRACTICE`.
- On fix: append row to [FACTCHECK_BACKLOG.md](./FACTCHECK_BACKLOG.md) if a new bad pattern is found.

### Channel verification (pass 2 sources)

Every non-official factual claim must trace to **at least one** of:

| Channel | Focus |
|---------|--------|
| `@chatlisboa` | Lisboa / general PT relocants, AIMA waits |
| `@por_tugal` | News + practical PT discussion |
| `@autolife_pt` | Auto, IMT, transport (peripheral renewal trips) |
| `@lepta` | PT politics, housing, Norte |

Configured in `parser/groups.yaml`. Ingest: `npm run portugal:daily`. Helper: `lib/guides/portugal-telegram-citations.ts`.

Official claims may cite AIMA/SEF/gov.pt **without** TG — but TG must not replace official sources (see [PORTUGAL_GUIDE_FACTCHECK.md](./PORTUGAL_GUIDE_FACTCHECK.md)).

### Editorial gates (community-note parity for satellite cross-links)

If a shortened satellite note or practice block is spun off this pillar:

| Gate | Command / module | Requirement |
|------|------------------|-------------|
| **Blueprint** | `npm run portugal:blueprint-pass` · `article-blueprint.ts` | Score ≥ 70; official/practice/gap/mistakes sections per `BLUEPRINT_MIN` |
| **Voice** | `npm run portugal:voice-pass` · `editorial-voice.ts` | RU relocant tone; no panic, no «гарантированный ВНЖ» |
| **Practice enrichment** | `npm run portugal:enrich-practice` · `practice-enrichment.ts` | `auditPracticeQuality` pass; add slug to `CURATED_PRACTICE` + `PORTUGAL_GUIDE_FACTCHECK` |

Pillar file: `content/guides/ru/prodlenie-vnzh-portugaliya-aima-2026.md` — follow [SEO_GUIDE_STANDARD.md](./SEO_GUIDE_STANDARD.md) (≥1200 words, 6–10 H2, ≥3 official URLs, FAQ 5–7, disclaimer).

Set `review_tier: volatile` in frontmatter (fees, AIMA procedures, timelines).

### Cross-links

| From | To | Rule |
|------|-----|------|
| `aima-agora-zapis-2026` (note) | This pillar | **Short bridge only** — e.g. «про продление папки и сроки см. [гайд по продлению ВНЖ](/ru/guides/prodlenie-vnzh-portugaliya-aima-2026)»; do not duplicate renewal body in the Agora note |
| This pillar | `aima-agora-zapis-2026` | Link when discussing Agora slot for renewal appointment |
| This pillar | `vnj-portugaliya-d8-d7-grazhdanstvo-2026` | First-issue vs renewal; citizenship timeline unchanged |
| This pillar | `pervye-30-dnej-v-portugalii-2026` | Only if first renewal within year one |

### Scope (outline)

1. Когда подавать (до истечения / grace / просроченная карта)
2. Кто продлевает vs кто подаёт заново (смена основания)
3. Документы по типу ВНЖ (D7/D8/work/study/family)
4. Пошлины и оплата (официальные суммы + оговорка даты)
5. Agora vs `services.aima.gov.pt` (в т.ч. просроченные — только после e-mail AIMA)
6. Сроки ожидания по регионам (мягкие формулировки + TG)
7. Типичные отказы и ошибки в папке
8. FAQ + «Коротко для проверки маршрута»

### Acceptance criteria

- [ ] All three fact-check passes documented (checklist in PR or commit message)
- [ ] Every hard claim has official URL; every practice claim has channel + period
- [ ] Disclaimer block for uncertain AIMA timelines
- [ ] `npm run portugal:guide-factcheck -- --guide=prodlenie-vnzh` returns usable signals
- [ ] `npm run guides:volatile-factcheck -- --slug=prodlenie-vnzh-portugaliya-aima-2026` — no critical issues
- [ ] `npm run build` passes
- [ ] Bridge link added to `aima-agora-zapis-2026` (one sentence, no body duplication)

### Explicitly out of scope (now)

- Full Agora slot-hunting playbook (stays in `aima-agora-zapis-2026`)
- Citizenship / Lei Orgânica 2026 deep dive (link to D8/D7 pillar)
- Paid legal services or «контакты внутри AIMA»
- Spain/Italy renewal (separate guides)

### Notes

- Recorded: 2026-07-13.
- User requirement (RU): тройной проход факт-чека; каждое утверждение сверено с каналами; 100% точность или мягкие формулировки + дисклеймеры при неуверенности.
