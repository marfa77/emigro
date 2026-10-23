# Tax Year Cockpit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship free **«Налоги»** app in `@emigro_chat_bot`: presence ledger → residency traffic-light → counsel on ledger numbers, with analytics for a later $50/mo trial.

**Architecture:** Shared pure core in `lib/tax-cockpit/*` (ledger CRUD, day math, country packs, counsel Gemini tools). Bot shell in `lib/telegram/bot/apps/tax.ts` following Assist/Property (`startTax` / `continueTax`, session `app: "tax"`). Events go to `emigro_bot_events`, not `site_events`.

**Tech Stack:** Next.js webhook (`/api/telegram/news-webhook`), Supabase admin client, Gemini (`GEMINI_API_KEY` / `GOOGLE_API_KEY`), existing `sendStatsBotMessage` / session / deep-link patterns. Tests: `tsx` + `node:assert/strict` scripts (same as `scripts/test-bot-router.ts`).

**Spec:** `docs/superpowers/specs/2026-10-22-tax-year-cockpit-design.md`

## Global Constraints

- **Liability:** every report + counsel reply includes disclaimer «не налоговая консультация / не замена бухгалтеру»; never absolute «вы резидент X» without caveats.
- **Day rule default:** inclusive arrive, exclusive depart (night in country = day). Pack may override; document in pack file.
- **EU stubs:** incomplete packs → yellow only + «pack incomplete»; never green.
- **Counsel tools only:** `read_ledger` | `read_pack` | `web_search` — no marketing/SEO tools.
- **No paywall in v1;** soft Assist CTA after report.
- **Owner agent:** live `tax` session wins over free-text/media agent (extend routing for photos).
- **Do not invent ticket legs;** unreadable → ask manual dates.
- **Never** auto-change Finanças / IRS / HMRC.
- Commit after each task; do not push unless asked.

## Locked for implementation (do not reopen)

Copied from spec review 2026-10-23:

1. Media in `BotIncoming` same ship as ingest  
2. Session CHECK + `tax` (+ fix `invest` if still missing)  
3. Menu 2×3 with **Налоги**; `/tax`; deep link `tax` / `tax_YYYY`  
4. Tax session beats owner agent for text **and** media  
5. Inclusive arrive / exclusive depart default  
6. `emigro_bot_events` table; `return_7d` derived  
7. Stub packs = yellow  
8. Soft Assist CTA after report  
9. Counsel = Gemini tool loop, tax tools only  

## File map

| Path | Role |
|------|------|
| `supabase/migrations/20261023120000_tax_cockpit.sql` | sessions CHECK, ledger tables, bot events |
| `lib/tax-cockpit/types.ts` | shared types |
| `lib/tax-cockpit/day-math.ts` | inclusive/exclusive day counts |
| `lib/tax-cockpit/packs/*.ts` | country rules (PT, AE, IT, UK, US + EU stubs) |
| `lib/tax-cockpit/residency.ts` | engine: days → lights + flags |
| `lib/tax-cockpit/ledger.ts` | Supabase CRUD + aggregates |
| `lib/tax-cockpit/ingest.ts` | parse manual / ticket → legs |
| `lib/tax-cockpit/counsel.ts` | system prompt + Gemini loop |
| `lib/tax-cockpit/analytics.ts` | emit + derive return_7d |
| `lib/tax-cockpit/report.ts` | format Telegram HTML report |
| `lib/telegram/bot/apps/tax.ts` | UX FSM |
| `lib/telegram/bot/{types,markup,home,decide,router}.ts` | wire app |
| `lib/telegram/deep-link.ts` | `tax` / `tax_YYYY` |
| `lib/telegram/handle-update.ts` | tax session before owner agent if needed |
| `scripts/test-tax-*.ts` | unit + router smoke |
| `.cursor/skills/tax-counsel/SKILL.md` | phase 1b (Task 8) |

---

### Task 1: Schema + types + day math

**Files:**
- Create: `supabase/migrations/20261023120000_tax_cockpit.sql`
- Create: `lib/tax-cockpit/types.ts`
- Create: `lib/tax-cockpit/day-math.ts`
- Create: `scripts/test-tax-day-math.ts`
- Modify: `package.json` (script `test:tax-day-math`)

**Interfaces:**
- Produces: `PresenceInterval`, `countDaysInYear(interval, year, opts?)`, `overlapDays(...)`

- [ ] **Step 1: Write migration**

```sql
-- Tax Year Cockpit + session app enum widen + bot product events.

ALTER TABLE emigro_bot_sessions DROP CONSTRAINT IF EXISTS emigro_bot_sessions_app_check;
ALTER TABLE emigro_bot_sessions
  ADD CONSTRAINT emigro_bot_sessions_app_check
  CHECK (app IN ('assist', 'property', 'news', 'city', 'invest', 'tax', 'wizard'));

CREATE TABLE IF NOT EXISTS emigro_tax_ledgers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_user_id BIGINT NOT NULL REFERENCES emigro_bot_users (telegram_user_id) ON DELETE CASCADE,
  tax_year INT NOT NULL CHECK (tax_year >= 2020 AND tax_year <= 2100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (telegram_user_id, tax_year)
);

CREATE TABLE IF NOT EXISTS emigro_tax_presence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ledger_id UUID NOT NULL REFERENCES emigro_tax_ledgers (id) ON DELETE CASCADE,
  country_iso2 CHAR(2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('manual', 'ticket', 'import')),
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (end_date >= start_date)
);

CREATE INDEX IF NOT EXISTS emigro_tax_presence_ledger_idx
  ON emigro_tax_presence (ledger_id, country_iso2);

CREATE TABLE IF NOT EXISTS emigro_bot_events (
  id BIGSERIAL PRIMARY KEY,
  telegram_user_id BIGINT NOT NULL,
  event_name TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS emigro_bot_events_user_time_idx
  ON emigro_bot_events (telegram_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS emigro_bot_events_name_time_idx
  ON emigro_bot_events (event_name, created_at DESC);

ALTER TABLE emigro_tax_ledgers ENABLE ROW LEVEL SECURITY;
ALTER TABLE emigro_tax_presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE emigro_bot_events ENABLE ROW LEVEL SECURITY;
```

- [ ] **Step 2: Apply migration** via Supabase MCP `apply_migration` (project `wcwadwcjqutdxwbrkyai`) with the same SQL. Confirm tables exist.

- [ ] **Step 3: Types + day math**

```ts
// lib/tax-cockpit/types.ts
export type Iso2 = string; // uppercase ISO 3166-1 alpha-2
export type PresenceSource = "manual" | "ticket" | "import";
export type TrafficLight = "green" | "yellow" | "red" | "unknown";

export type PresenceInterval = {
  id?: string;
  countryIso2: Iso2;
  startDate: string; // YYYY-MM-DD
  endDate: string;
  source: PresenceSource;
  note?: string | null;
};

export type DayCountRule = {
  /** Default: arrive day counts, depart day does not (night = day). */
  arriveInclusive: boolean;
  departInclusive: boolean;
};
```

```ts
// lib/tax-cockpit/day-math.ts
import type { DayCountRule, PresenceInterval } from "./types";

export const DEFAULT_DAY_RULE: DayCountRule = {
  arriveInclusive: true,
  departInclusive: false,
};

/** Count nights-as-days in [year-01-01, year-12-31] for one interval. */
export function countDaysInYear(
  interval: Pick<PresenceInterval, "startDate" | "endDate">,
  year: number,
  rule: DayCountRule = DEFAULT_DAY_RULE
): number {
  // Clip to calendar year; then walk days with inclusive/exclusive ends.
  // Same-day arrival+departure: 0 if exclusive depart, 1 if both inclusive.
  // Implement carefully — covered by tests below.
}
```

- [ ] **Step 4: Failing then passing tests**

```ts
// scripts/test-tax-day-math.ts
import assert from "node:assert/strict";
import { countDaysInYear, DEFAULT_DAY_RULE } from "../lib/tax-cockpit/day-math";

// Lisbon overnight: arrive 2026-03-01, leave 2026-03-03 → 2 days (1st, 2nd)
assert.equal(
  countDaysInYear({ startDate: "2026-03-01", endDate: "2026-03-03" }, 2026),
  2
);
// Same calendar day → 0 under default rule
assert.equal(
  countDaysInYear({ startDate: "2026-03-01", endDate: "2026-03-01" }, 2026),
  0
);
// Spans year boundary: only days in 2026
assert.equal(
  countDaysInYear({ startDate: "2025-12-30", endDate: "2026-01-03" }, 2026),
  2
);
assert.equal(
  countDaysInYear({ startDate: "2025-12-30", endDate: "2026-01-03" }, 2025),
  2
);
console.log("ok tax day-math");
```

Run: `npx tsx scripts/test-tax-day-math.ts`  
Expected: `ok tax day-math`

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/20261023120000_tax_cockpit.sql lib/tax-cockpit/types.ts lib/tax-cockpit/day-math.ts scripts/test-tax-day-math.ts package.json
git commit -m "tax-cockpit: schema, types, inclusive/exclusive day math"
```

---

### Task 2: Country packs + residency engine

**Files:**
- Create: `lib/tax-cockpit/packs/types.ts`
- Create: `lib/tax-cockpit/packs/index.ts`
- Create: `lib/tax-cockpit/packs/pt.ts`, `ae.ts`, `it.ts`, `uk.ts`, `us.ts`
- Create: `lib/tax-cockpit/packs/eu-stubs.ts` (remaining EU ISO2 → stub pack)
- Create: `lib/tax-cockpit/residency.ts`
- Create: `lib/tax-cockpit/report.ts`
- Create: `scripts/test-tax-residency.ts`

**Interfaces:**
- Consumes: `countDaysInYear`, `PresenceInterval`
- Produces: `getPack(iso2)`, `evaluateResidency(year, intervals)`, `formatResidencyReportHtml(result)`

Each pack:

```ts
export type CountryPack = {
  iso2: string;
  nameRu: string;
  complete: boolean; // false = stub → never green
  dayRule?: DayCountRule; // override default
  /** Calendar-year presence threshold that usually triggers residency presumption */
  presenceThresholdDays: number | null; // e.g. 183; UAE often null / 183 with caveats
  notesRu: string[]; // short bullets for report + counsel
  tieBreakerQuestionsRu: string[]; // open questions
  playbooks?: { id: string; titleRu: string; bodyRu: string }[];
};
```

- [ ] **Step 1: Implement PT / AE / IT / UK / US packs** with `complete: true` and honest notes (cite that thresholds are orienters; PT art. 16 CIRS 183d; UAE 183d corporate/tax residence nuances in notes; US substantial presence formula abbreviated with yellow if close). Include PT+AE rental playbook on PT or AE pack (`playbooks`).

- [ ] **Step 2: EU stubs** — list remaining EU members with `complete: false`, `presenceThresholdDays: 183`, notes «pack incomplete».

- [ ] **Step 3: Engine**

```ts
// evaluateResidency(taxYear, intervals) → {
//   year, byCountry: [{ iso2, days, light, threshold, complete, openQuestions }],
//   topCountries, disclaimerRu
// }
// Light rules:
// - stub / incomplete → yellow (never green)
// - days >= threshold → red (presumption of residency risk) or yellow if US formula incomplete
// - days >= 0.75*threshold → yellow
// - else green only if complete pack
```

- [ ] **Step 4: `formatResidencyReportHtml`** — Telegram HTML: year, table of countries/days/light, open questions, disclaimer, soft Assist CTA (`/ru/assist` or bot Assist deep link).

- [ ] **Step 5: Tests**

```ts
// PT 200 days → red; PT 50 days → green; FR stub 200 days → yellow not red/green
```

Run: `npx tsx scripts/test-tax-residency.ts`

- [ ] **Step 6: Commit**

```bash
git commit -m "tax-cockpit: country packs + residency traffic-light engine"
```

---

### Task 3: Ledger + analytics helpers

**Files:**
- Create: `lib/tax-cockpit/ledger.ts`
- Create: `lib/tax-cockpit/analytics.ts`
- Create: `scripts/test-tax-ledger-mock.ts` (pure helpers only if DB hard; or skip live DB and unit-test merge/normalize)

**Interfaces:**
- Produces:
  - `ensureLedger(telegramUserId, taxYear)`
  - `listPresence(ledgerId)`
  - `addPresence(ledgerId, intervals[])`
  - `deletePresence(id)`
  - `daysByCountry(telegramUserId, taxYear)`
  - `emitBotEvent(userId, name, payload)`
  - `hasReturnWithin7d(userId)` — query two `tax_open` within 7d

- [ ] **Step 1: Implement ledger** with `createAdminClient()`; normalize ISO2 to uppercase; reject invalid dates; merge optional later (v1 no auto-merge — confirm step owns uniqueness).

- [ ] **Step 2: Implement analytics**

```ts
export type TaxEventName =
  | "tax_open"
  | "ticket_add"
  | "residency_report"
  | "counsel_ask"
  | "country_focus";

export async function emitBotEvent(
  telegramUserId: number,
  eventName: TaxEventName,
  payload: Record<string, unknown> = {}
): Promise<void> { /* insert emigro_bot_events; swallow errors with console.warn */ }
```

- [ ] **Step 3: Commit**

```bash
git commit -m "tax-cockpit: ledger CRUD + emigro_bot_events emitters"
```

---

### Task 4: Bot wiring (menu, session, deep link, media incoming)

**Files:**
- Modify: `lib/telegram/bot/types.ts` — `BotApp` += `"tax"`; `BotDeepLink` += `{ app: "tax"; year?: number }`; extend `BotIncoming`:

```ts
| { kind: "message"; text: string }
| { kind: "callback"; id: string; data: string }
| {
    kind: "media";
    caption: string;
    photoFileId?: string;
    documentFileId?: string;
    mimeType?: string;
    fileName?: string;
  };
```

- Modify: `lib/telegram/bot/router.ts` — `toIncoming` returns media when photo/document; `openApp` / `continueApp` for tax
- Modify: `lib/telegram/bot/markup.ts` — `MENU_TAX = "Налоги"`; keyboard 2×3
- Modify: `lib/telegram/bot/home.ts` — one line about Налоги
- Modify: `lib/telegram/bot/decide.ts` — menu + `/tax` `/налоги` + deep link
- Modify: `lib/telegram/deep-link.ts` — parse `tax`, `tax_2026`
- Modify: `lib/telegram/handle-update.ts` — order: owner update → **if live tax session, routeTelegramUpdate first** → else owner agent → else router  
  (Safer than relying only on agent’s `getLiveSession` skip, so media with empty caption still hits tax.)
- Create stub: `lib/telegram/bot/apps/tax.ts` with `startTax` / `continueTax` that only send «скоро» hub until Task 5 — **or** jump to Task 5 in same branch if preferred; prefer stub + router tests first.
- Modify: `scripts/test-bot-router.ts` — assert Налоги / `/tax` / `tax_2026`

**Interfaces:**
- Produces: `startTax(ctx, year?)`, `continueTax(ctx, incoming, payload)`

- [ ] **Step 1: Types + markup + decide + deep-link + router + handle-update**

- [ ] **Step 2: Minimal `apps/tax.ts`**

```ts
export async function startTax(ctx: BotUserCtx, year?: number): Promise<void> {
  const y = year ?? new Date().getUTCFullYear();
  await setSession({ telegramUserId: ctx.userId, app: "tax", step: "hub", payload: { year: y } });
  await emitBotEvent(ctx.userId, "tax_open", { year: y });
  await sendStatsBotMessage(ctx.chatId, hubHtml(y), { parseMode: "HTML", replyMarkup: taxHubKeyboard() });
}
```

- [ ] **Step 3: Run** `npx tsx scripts/test-bot-router.ts` — Expected: pass with new tax asserts

- [ ] **Step 4: Commit**

```bash
git commit -m "tax-cockpit: wire Налоги menu, session, deep link, media incoming"
```

---

### Task 5: Manual ingest + report UX

**Files:**
- Create: `lib/tax-cockpit/ingest.ts` (manual parser)
- Modify: `lib/telegram/bot/apps/tax.ts` — steps `year` | `hub` | `manual_wait` | `ingest_confirm` | `counsel`
- Create: `scripts/test-tax-ingest-manual.ts`

**Manual format (document in hub help):**

```
PT 2026-01-10..2026-03-01
AE 2026-03-01..2026-06-15
```

or RU: `Португалия 10.01.2026 - 01.03.2026`

- [ ] **Step 1: `parseManualPresenceText(text, defaultYear)`** → `{ legs, errors }`; never invent.

- [ ] **Step 2: UX flow**
  1. Hub → «Ввести даты» → `manual_wait`
  2. User pastes → show confirm keyboard Confirm / Edit
  3. Confirm → `addPresence` + `ticket_add` event → hub
  4. «Отчёт» → `daysByCountry` + `evaluateResidency` + `formatResidencyReportHtml` + `residency_report` event + Assist soft CTA

- [ ] **Step 3: Tests for parser**

- [ ] **Step 4: Commit**

```bash
git commit -m "tax-cockpit: manual presence ingest + residency report in bot"
```

---

### Task 6: Ticket photo/PDF ingest

**Files:**
- Modify: `lib/tax-cockpit/ingest.ts` — `extractLegsFromTicketMedia(buffer, mime, caption)`
- Modify: `apps/tax.ts` — on `incoming.kind === "media"` in hub/manual_wait → extract → confirm
- Reuse Telegram file download pattern from `lib/telegram/bot/agent/index.ts` (`getFile` + fetch) — extract shared helper `lib/telegram/bot/download-file.ts` if clean.

**LLM:** Gemini JSON extract schema:

```json
{ "legs": [{ "countryIso2": "PT", "startDate": "YYYY-MM-DD", "endDate": "YYYY-MM-DD", "confidence": 0.0 }], "rawNotes": "..." }
```

If confidence &lt; 0.6 or empty → ask manual. Never write ledger without confirm.

- [ ] **Step 1: Shared download helper + extract**

- [ ] **Step 2: Wire media in `continueTax`**

- [ ] **Step 3: Dry-run locally with a sample boarding-pass image if available; otherwise unit-test JSON parser path with mocked model function.**

- [ ] **Step 4: Commit**

```bash
git commit -m "tax-cockpit: ticket photo/PDF ingest with confirm step"
```

---

### Task 7: Counsel (Gemini tools) + disclaimer

**Files:**
- Create: `lib/tax-cockpit/counsel.ts`
- Modify: `apps/tax.ts` — step `counsel`; button «Вопрос консультанту»
- Optionally reuse `runAgent` / `runAgentWithFallback` from `lib/telegram/bot/agent/gemini.ts` with a **restricted** function list (import types only; do not register marketing tools).

**System prompt must include:**
- Disclaimer
- Injected ledger summary for selected year
- Pack notes for top countries
- Refuse residency conclusions without ledger days
- Soft Assist CTA for GV / dual PT+AE rental / filing

**Tools:**
1. `read_ledger` → `{ year, byCountry }`
2. `read_pack` → pack notes/playbooks
3. `web_search` → same pattern as owner agent `web_search` (separate grounded call)

Events: `counsel_ask`; if pack iso2 used → `country_focus`.

- [ ] **Step 1: Implement counsel**

- [ ] **Step 2: Local dry-run** `npx tsx scripts/tax-counsel-ask.ts -- "у меня 200 дней PT и 100 AE — что проверить?"` (script creates fake intervals in memory or uses Pavel’s telegram id if env set)

- [ ] **Step 3: Commit**

```bash
git commit -m "tax-cockpit: counsel Gemini loop on ledger + packs"
```

---

### Task 8: Cursor skill (phase 1b) + owner stats snippet

**Files:**
- Create: `.cursor/skills/tax-counsel/SKILL.md`
- Create: `scripts/tax-cockpit-cli.ts` — `ledger` / `report` / `ask` for Pavel offline
- Modify: `lib/analytics/format-stats-telegram.ts` (or small helper) — optional block «Налоги (7д): opens / tickets / reports / counsel / return_7d%» if cheap to add; skip if it risks breaking `/stats` — then only SQL view doc in skill.

Skill points at `lib/tax-cockpit` + warns never to change Finanças address; profile path: agent store / user-provided file.

- [ ] **Step 1: Skill + CLI**

- [ ] **Step 2: Commit**

```bash
git commit -m "tax-cockpit: Cursor skill + CLI mirror for Pavel"
```

---

### Task 9: Smoke, deploy checklist, ship

**Files:**
- Modify: `docs/PORTUGAL_NEWS_STORIES_CRON.md` — not needed; instead short `docs/TAX_COCKPIT.md` (1 page: env, menu, events, restore)

- [ ] **Step 1: Run all tax tests**

```bash
npx tsx scripts/test-tax-day-math.ts
npx tsx scripts/test-tax-residency.ts
npx tsx scripts/test-tax-ingest-manual.ts
npx tsx scripts/test-bot-router.ts
npm run deploy:check
```

- [ ] **Step 2: Manual Telegram smoke (owner account)**  
  Меню → Налоги → year → paste dates → confirm → Отчёт → one counsel question → /new or Меню.

- [ ] **Step 3: Verify live** after Vercel Ready: webhook still OK; open Налоги once; confirm `emigro_bot_events` row `tax_open`.

- [ ] **Step 4: Final commit if docs leftover**

```bash
git commit -m "docs: tax cockpit operator notes"
```

---

## Spec coverage checklist

| Spec requirement | Task |
|------------------|------|
| Presence ledger | 1, 3, 5 |
| Residency engine EU+UAE+UK+US | 2 |
| Counsel on ledger + disclaimer | 7 |
| Analytics for later $50 | 3, 9 |
| Bot app Налоги | 4–7 |
| Manual then photo ingest | 5, 6 |
| Media BotIncoming | 4, 6 |
| Session CHECK tax | 1 |
| Menu 2×3 | 4 |
| Owner agent vs tax | 4 |
| Day rule inclusive/exclusive | 1, 2 |
| Stubs yellow | 2 |
| Assist soft CTA | 2 (`report.ts`), 5, 7 |
| Counsel tools only | 7 |
| Cursor skill | 8 |
| No paywall v1 | Global — no Stripe task |

## Out of scope (do not implement in this plan)

- Stripe / Stars / trial gating  
- Filing / address change automation  
- Non-EU/UAE/UK/US packs beyond stubs  
- Separate tax bot or web SaaS  
