# Tax Year Cockpit — Emigro bot module

**Date:** 2026-10-22  
**Status:** approved — implementation plan ready  
**Repo:** `emigro` · surface: `@emigro_chat_bot`  
**Approach:** new bot **app module** (same pattern as News / Assist / Property); free + useful first; paywall later from usage stats  
**Plan:** `docs/superpowers/plans/2026-10-23-tax-year-cockpit.md`

## Problem

Relocators (and Pavel’s own PT/UAE/IT/GV case) need a hard answer to «где я налоговый резидент в этом году?» — not a vague LLM chat. Unique wedge: **days of presence from tickets/dates** → residency signal → counsel on top. Generic “AI tax consultant” is commodity and high liability; a **tax-year cockpit** is sticky and measurable.

## Goal

Ship **«Налоги»** inside `@emigro_chat_bot` as a free module that:

1. Builds a **presence ledger** (days per country / calendar year) from tickets (photo/PDF) and/or manual dates.
2. Runs a **residency engine** (183-day style rules + country notes + tie-breaker flags) for **EU + UAE + UK + US**.
3. Offers **counsel** (scenarios, comparisons, checklists, DTA-oriented guidance) **only on top of ledger numbers**, with a hard disclaimer.
4. Emits **product analytics** so we can later attach **$50/mo + 7-day trial** without guessing demand.

Parallel: Cursor skill + Pavel profile = internal mirror of the same core (no billing).

## Non-goals (v1)

- Stripe / Stars / paywall (phase 2, driven by stats)
- Filing forms, payment of tax, or “guaranteed” residency conclusions
- Full world coverage beyond EU + UAE + UK + US
- Replacing a licensed tax advisor
- Separate Telegram bot or standalone web SaaS in v1
- Auto-changing Finanças / IRS / HMRC filings

## Decisions (locked)

| Topic | Choice |
|-------|--------|
| **Product frame** | Tax Year Cockpit, not freeform tax chat |
| **Surface** | New app on `@emigro_chat_bot` (menu item **Налоги**) |
| **Pattern** | Same as existing apps: `startTax` / `continueTax`, session `app: "tax"`, deep link |
| **Monetization v1** | Free; instrument usage; **no paywall** |
| **Monetization later** | Full sub **$50/mo**, trial **7 days** — only after stats justify |
| **Countries v1** | EU member states + UAE + UK + US (rules packs; 183 / local thresholds / tie-breaker notes) |
| **Counsel depth** | Scenarios + comparisons + “what to do next” + uncertainty; always disclaimer |
| **Input** | Photo/PDF tickets + manual entry; agent extracts legs → ledger |
| **Owner / lab** | Cursor skill uses same core + Pavel’s profile file |
| **Liability UX** | Persistent: «не налоговая консультация / не замена бухгалтеру»; no absolute “you are resident of X” without caveats |

### Locked for implementation (review 2026-10-23)

| # | Topic | Choice |
|---|-------|--------|
| 1 | **Media path** | Extend `BotIncoming` + `toIncoming` for photo/PDF/caption in the same ship as ingest. Manual dates first in UX order; media not deferred to a later PR. |
| 2 | **Session CHECK** | Migration: `emigro_bot_sessions.app` allows `tax` (and any already-used apps missing from CHECK, e.g. `invest`, if still constrained). |
| 3 | **Menu layout** | Reply keyboard 2×3: Меню · Новости / Помощь · Недвижка / Чат города · **Налоги**. Plus `/tax`, `/налоги`, deep link `tax` / `tax_YYYY`. |
| 4 | **Owner agent vs tax** | Live `app: "tax"` must beat owner marketing agent (already: `tryHandleOwnerAgent` returns false if `getLiveSession`). Photos/captions while in tax session must route to `continueTax`, not agent. |
| 5 | **Presence day default** | **Inclusive arrive, exclusive depart** (night in country = day counts). Override only inside a country pack if statute differs; document in each pack file. |
| 6 | **Analytics store** | New table `emigro_bot_events` (`event_name`, `telegram_user_id`, `payload jsonb`, `created_at`). Do **not** mix with `site_events` page_view. `return_7d` = derived query / owner stats, not a button event. |
| 7 | **EU stubs** | Incomplete packs → yellow flag in report + counsel: «порог ориентир 183d, pack incomplete — нужен консультант». No confident green on stubs. |
| 8 | **Assist CTA** | After residency report (and soft in counsel hub): one soft line to Assist / бухгалтер for complex cases (GV, rental UAE+PT). No paywall. |
| 9 | **Counsel stack** | Same Gemini tool loop as owner agent pattern; tools **only** `read_ledger` / `read_pack` / `web_search`. No marketing/SEO tools. |

**Also locked:** UAE rental income + PT resident playbook **yes** in v1 counsel packs (PT+AE). Stars vs Stripe = phase 2 only.

## Architecture

```
@emigro_chat_bot
  home → app "tax"
           ├─ presence ledger (DB / user-scoped)
           ├─ residency engine (pure TS rules packs)
           ├─ counsel LLM (prompt + ledger context + country packs)
           └─ analytics → emigro_bot_events

shared core (lib/tax-cockpit/…)
  used by: bot app · (later) Cursor skill / API
```

### Components

| Unit | Responsibility | Depends on |
|------|----------------|------------|
| `apps/tax.ts` | Telegram UX: menu, year select, upload/manual, report, counsel turns | session, markup, send |
| `lib/tax-cockpit/ledger` | CRUD presence intervals; day counts by country/year | Supabase |
| `lib/tax-cockpit/ingest` | Ticket/PDF/text → flight legs → intervals (LLM + confirm) | Telegram file fetch |
| `lib/tax-cockpit/residency` | Pure rules: days vs thresholds, flags, tie-breaker checklist | country packs |
| `lib/tax-cockpit/counsel` | Prompt + tools: read ledger, read pack, web_search | Gemini (same pattern as bot agent) |
| `lib/tax-cockpit/analytics` | Emit typed events to `emigro_bot_events` | Supabase admin |
| Cursor skill (phase 1b) | Same core for Pavel; profile in agent store | core only |

### Data flow

1. User opens **Налоги** → `tax_open`.
2. Chooses tax year (default: current calendar year).
3. Adds presence: upload ticket(s) and/or paste dates → confirm parsed legs → `ticket_add` → ledger updated.
4. **Отчёт** → residency engine → days table + traffic-light + open questions + soft Assist CTA → `residency_report`.
5. Follow-up questions in session → counsel with ledger injected → `counsel_ask` (+ `country_focus` if country named).
6. Return within 7 days → `return_7d` (derived in analytics, not a user button).

### Error handling

- Unreadable ticket → ask manual dates; never invent legs.
- Ambiguous airport/country → confirm before write.
- Rules pack missing edge case / stub → counsel says “нужна проверка у консультанта” + yellow flag in report.
- LLM without ledger → refuse deep residency claims; push user to add days first.

## Bot UX (v1)

Home copy gains one line: **Налоги** — дни по билетам, светофор резидентства, сценарии (бесплатно).

In-app steps (session):

1. `year` — choose year  
2. `hub` — buttons: Добавить билет · Ввести даты · Отчёт · Вопрос консультанту · Меню  
3. `ingest_confirm` — show parsed legs, Confirm / Edit  
4. `counsel` — free text turns with ledger context  

Always show year + top 3 countries by days in counsel header.  
Disclaimer on every report and counsel reply.

## Analytics (minimum events)

| Event | When |
|-------|------|
| `tax_open` | Enter app |
| `ticket_add` | Legs committed to ledger |
| `residency_report` | Report generated |
| `counsel_ask` | User counsel message |
| `country_focus` | Country pack referenced in turn |
| `return_7d` | Derived: second `tax_open` within 7d |

Dashboards: funnel open → ticket → report → counsel; retention 7d; top countries asked. Owner sees via existing stats paths where practical.

## Monetization (phase 2 — not built in v1)

- Gate: after N reports or M counsel turns **or** calendar trial — TBD from stats.
- Price: **$50/mo**, trial **7 days**.
- Channel: in-bot pay (Stars vs card — decide with data + Emigro billing norms).
- Free forever: teaser + 1–2 answers (TBD); full ledger + alerts behind sub.

## Cursor / Pavel (phase 1b)

- Skill `tax-counsel` pointing at same `lib/tax-cockpit` concepts (or thin CLI until packages shared).
- Profile: days, NIF/GV flags, “живу за границей”, Pinto Ribeiro — agent store / Drive knowledge; **never** auto-change Finanças address.

## Testing

- Unit: residency engine day math (inclusive arrive / exclusive depart; pack overrides).
- Fixture tickets → ingest → expected intervals.
- Bot session smoke: open → manual dates → report → one counsel turn.
- Analytics: events fire once per action (no double-count on edit).
- Router: tax menu / deep link; live tax session blocks owner agent on free text and media.

## Ship order

1. Core ledger + residency packs (PT, AE, IT, UK, US first; rest of EU stubs ok).  
2. Bot app `tax` wired to home/router/types/media incoming.  
3. Ingest (manual first in UX, photo/PDF same PR).  
4. Counsel prompt + disclaimer + Assist soft CTA.  
5. Analytics events (`emigro_bot_events`).  
6. Cursor skill for Pavel.  
7. Phase 2 paywall — separate spec after ≥2–4 weeks of stats.

## Open points (phase 2 only)

- Stars vs Stripe for paywall.
- Free-tier caps after stats (N reports / M counsel turns).
