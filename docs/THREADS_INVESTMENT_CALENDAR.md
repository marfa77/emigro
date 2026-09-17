# @emigro_invest gradual publication calendar

Managed separately from `@emigro_assist`. The launch welcome thread is setup
traffic and is excluded from the content baseline.

## Controls

- Bank: `lib/threads/banks/emigro-investment-days.json`
- Runner: `npm run threads:investment:daily`
- State: `parser/out/emigro-investment-threads-posted.json`
- Account credentials: `THREADS_INVESTMENT_*` only
- Runtime phase: `THREADS_INVESTMENT_PHASE=off|seed|traffic|lead`
- Live gate: `THREADS_INVESTMENT_AUTO_PUBLISH=1` **and** `--force-publish`

The default phase is `off`. The production launch starts at `seed`. Advancing a
phase is a manual decision after the measurement gate; dates from a locked phase
are skipped, not posted later in a catch-up burst.

Thailand (`invest-009`) is auto-enabled after source review on 2026-09-17:
Immigration Bureau orders 237/2568 and 238/2568 create a property-linked
Non-Immigrant temporary-stay route with annual extension; condo purchase alone
is not a visa/residence grant and is not LTR or Thailand Privilege. The row stays
link-free that week to keep the two-link weekly cap.

## Ramp

### Seed — three root-only posts

- 2026-09-19
- 2026-09-22
- 2026-09-25

No links and no replies. Keep the publication window fixed around 12:00
Asia/Dubai.

Review after all three roots are at least 48 hours old. Advance to `traffic` only
if one of these is true:

- median root views is at least 20;
- one root reaches at least 75 views;
- an organic discussion or meaningful follower gain appears.

If none is true, keep the account at three posts per week and change one opening
hook. Do not compensate with more links or higher frequency.

### Traffic — four posts per week

Dates: 2026-09-28, 09-30, 10-02, 10-04.

Only the Portugal post links out. Roots stay native; the destination appears in
the last reply. Measure profile visits, site sessions and country-card visits
separately from root reach.

Advance to `lead` only after the four roots are mature and:

- traffic-phase median is not below the seed median; and
- at least one tracked site visit is present; or
- the account gains an organic reply or follower.

### Lead — up to five posts per week

Maximum two linked posts per ISO week. Links go only to `/ru/invest`, the
matching `/ru/invest/{country}` card, or `#qualifier`.

Primary funnel:

```text
native root
→ profile or final-reply link
→ investment hub / country card
→ qualifier started
→ consented investment lead
```

## Measurement

For every review:

1. Exact root views after 48 hours.
2. Median and maximum by phase.
3. Organic replies and follower delta.
4. Profile visits and tracked site sessions.
5. `investment_qualifier_started`.
6. Submitted leads and qualified leads.

Do not count the welcome thread, replies, or later link slides as root
observations.

## Safety rules

- No claim that property automatically grants a visa, residence or citizenship.
- No listings, yields, neighbourhood lifestyle or developer sales copy.
- Exact thresholds require a current official source.
- State, asset, passport eligibility and source of funds are separate checks.
- Comments remain public; automatic replies remain off.
- `@emigro_invest` never shares the main account day budget, state or token.
