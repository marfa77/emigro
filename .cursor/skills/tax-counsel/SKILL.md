---
name: tax-counsel
description: >-
  Operates Emigro Tax Year Cockpit for Pavel: presence ledger, residency
  traffic-light, counsel on ledger numbers. Use for tax-year questions, PT/AE/IT
  presence days, Налоги bot debugging, or offline report/counsel via CLI.
  Never auto-change Finanças / IRS / HMRC addresses or filings.
---

# Tax Year Cockpit (operator + Cursor)

**Product:** free **«Налоги»** in `@emigro_chat_bot` · shared core `lib/tax-cockpit/*`.  
**Spec:** `docs/superpowers/specs/2026-10-22-tax-year-cockpit-design.md` · **Plan:** `docs/superpowers/plans/2026-10-23-tax-year-cockpit.md`.

This skill mirrors the bot core for **Pavel’s lab** — same ledger, packs, day math, counsel. **No billing in v1.**

## Hard rules (never break)

1. **Disclaimer** on every report and counsel reply: «не налоговая консультация / не замена бухгалтеру»; no absolute «вы налоговый резидент X».
2. **Never** auto-change **Finanças**, **IRS**, **HMRC**, morada fiscal, or submit declarations on the user’s behalf.
3. **Day default:** inclusive arrive, exclusive depart (night in country = day). Override only via country pack `dayRule`.
4. **EU stubs** (`complete: false`) → **yellow only**, never green; say «pack incomplete».
5. **Counsel tools only:** `read_ledger` · `read_pack` · `web_search` — no marketing/SEO tools.
6. **Do not invent ticket legs**; unreadable ingest → manual dates + confirm step.
7. **Analytics:** `emigro_bot_events`, not `site_events`.

## Pavel profile / context file

Inject stable facts (GV timeline, entities, rental UAE+PT) from:

- **Agent store:** `/Users/pavelveselov/Library/Application Support/Cursor/AgentStores/cursor_agent_stores/u309231609/files` (user personal store), or
- A path Pavel pastes in chat (markdown/notes).

Counsel still **must** call `read_ledger` for days; profile is tie-breaker context only, not a substitute for the ledger.

## Module map (`lib/tax-cockpit`)

| Path | Use |
|------|-----|
| `types.ts` | `PresenceInterval`, traffic lights |
| `day-math.ts` | `countDaysInYear`, `DEFAULT_DAY_RULE` |
| `packs/` | `getPack(iso2)` — PT, AE, IT, UK, US + EU stubs |
| `residency.ts` | `evaluateResidency(year, intervals)` |
| `report.ts` | `formatResidencyReportHtml` (Telegram HTML) |
| `ledger.ts` | `ensureLedger`, `listPresence`, `addPresence`, `daysByCountry` |
| `ingest.ts` | Manual + ticket parse (confirm before write) |
| `counsel.ts` | `answerCounsel`, `formatCounselReplyHtml` |
| `analytics.ts` | `emitBotEvent`, `hasReturnWithin7d`, `summarizeTaxFunnel7d` |

Bot UX: `lib/telegram/bot/apps/tax.ts` · deep link `tax` / `tax_YYYY`.

## Offline CLI (Pavel)

Requires `.env.local` with Supabase admin + `GEMINI_API_KEY` / `GOOGLE_API_KEY` for `ask`.

```bash
# Ledger JSON (intervals + day totals)
npx tsx scripts/tax-cockpit-cli.ts ledger --user <telegramId> --year 2026

# Residency report (Telegram HTML on stdout)
npm run tax:report -- --user <telegramId> --year 2026

# Counsel (plain text + sources footer)
npm run tax:ask -- --user <telegramId> --year 2026 -- "вопрос одной строкой"
```

Legacy dry-run (env `TAX_COUNSEL_TELEGRAM_USER_ID`): `npx tsx scripts/tax-counsel-ask.ts -- "…"`.

## Tests (before ship)

```bash
npx tsx scripts/test-tax-day-math.ts
npx tsx scripts/test-tax-residency.ts
npx tsx scripts/test-tax-ingest-manual.ts
npx tsx scripts/test-tax-counsel-empty.ts
npx tsx scripts/test-bot-router.ts
```

## Owner stats · Налоги funnel (7d)

`/stats` may show a **Налоги (7д)** line when `emigro_bot_events` is reachable; if the query fails, the block is omitted (site stats unchanged).

**Manual SQL (Supabase):**

```sql
-- Event counts, last 7 days
SELECT event_name, COUNT(*) AS n
FROM emigro_bot_events
WHERE created_at >= NOW() - INTERVAL '7 days'
  AND event_name IN ('tax_open', 'ticket_add', 'residency_report', 'counsel_ask', 'country_focus')
GROUP BY event_name
ORDER BY n DESC;

-- Distinct users who opened tax in 7d
SELECT COUNT(DISTINCT telegram_user_id) AS open_users_7d
FROM emigro_bot_events
WHERE event_name = 'tax_open'
  AND created_at >= NOW() - INTERVAL '7 days';

-- return_7d (derived): users with any two tax_open within 7 days (look back 14d for pairs touching last 7d)
WITH opens AS (
  SELECT telegram_user_id, created_at
  FROM emigro_bot_events
  WHERE event_name = 'tax_open'
    AND created_at >= NOW() - INTERVAL '14 days'
),
pairs AS (
  SELECT DISTINCT o1.telegram_user_id
  FROM opens o1
  JOIN opens o2 ON o1.telegram_user_id = o2.telegram_user_id AND o2.created_at > o1.created_at
  WHERE o2.created_at - o1.created_at <= INTERVAL '7 days'
    AND o2.created_at >= NOW() - INTERVAL '7 days'
)
SELECT COUNT(*) AS return_7d_users FROM pairs;
```

Per-user check in code: `hasReturnWithin7d(telegramUserId)` in `analytics.ts`.

## When editing

- Pack thresholds = **orienters**; cite official sources in pack `officialSource` where set.
- Soft Assist CTA after report: GV, PT+AE rental, filing — `report.ts` / counsel prompt.
- Commit tax changes in small commits; **do not push** unless Pavel asks.
