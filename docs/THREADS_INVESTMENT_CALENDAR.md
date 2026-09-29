# @emigro_invest daily publication calendar

Managed separately from `@emigro_assist`. The launch welcome thread is setup
traffic and is excluded from the content baseline.

## Policy (from 2026-09-26)

**Minimum one root per calendar day** (Asia/Dubai). Bank rows `invest-004`…
are dated consecutively through `invest-100` (ends 2026-12-31). Seed roots
`invest-001`…`003` stay on their historical dates (already published).

- Max **two** outbound links per ISO week (dest on CTA reply only).
- Runtime phase must be `lead` (or at least high enough for today's row) or
  traffic/lead dates stay locked.
- Pause only with `THREADS_INVESTMENT_PHASE=off`.

## Controls

- Bank: `lib/threads/banks/emigro-investment-days.json`
- Runner: `npm run threads:investment:daily`
- State: `parser/out/emigro-investment-threads-posted.json`
- Account credentials: `THREADS_INVESTMENT_*` only
- Runtime phase: `THREADS_INVESTMENT_PHASE=off|seed|traffic|lead`
- Live gate: `THREADS_INVESTMENT_AUTO_PUBLISH=1` **and** `--force-publish`
- Timer: `emigro-threads-investment.timer` daily ~12:00 Asia/Dubai
- Failures: owner Telegram DM (`OnFailure` + script notify) — silent FAIL is a bug

Production phase: **`lead`** so daily traffic/lead rows are not locked after seed.

Thailand (`invest-009`) stays auto after source review (Immigration Bureau
orders 237/2568 and 238/2568). Condo purchase alone is not a visa/residence
grant and is not LTR or Thailand Privilege.

## Funnel

```text
native root
→ profile or final-reply link (≤2 / ISO week)
→ investment hub / country card
→ qualifier started
→ consented investment lead
```

## Measurement

For every review:

1. Exact root views after 48 hours.
2. Median and maximum by week.
3. Profile visits / site sessions with `utm_campaign=emigro_threads_investment`.
4. Qualifier starts and consented leads attributed to Threads.

Do not wholesale-rewrite the bank from medians — Sol point-edits weak rows.
