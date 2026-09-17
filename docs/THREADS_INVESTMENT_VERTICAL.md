# Threads: Investment Migration vertical

## Purpose and boundary

This is a **separate Threads vertical** at
[`@emigro_invest`](https://www.threads.com/@emigro_invest) for Russian-language
material about legal status and documents connected with property or investment.
It is not a property listings feed and must not imply that buying property
automatically grants a visa, residence, permanent residence, or citizenship.

Allowed editorial scope:

- legal status attached to a verified investment route;
- property ownership and transaction documents relevant to that status;
- source-verified programme changes and deadlines;
- applicant, source-of-funds, asset, intermediary, and family-document checks.

Exclude lifestyle, tourism, neighbourhoods, yields, listings, sales copy, and
general Thailand content. Thailand may appear only when the post is specifically
about legal status/documents linked to property or investment.

## Account isolation

- Dedicated account identity: `THREADS_INVESTMENT_USERNAME=emigro_invest`.
- Never reuse `THREADS_USERNAME`, `THREADS_USER_ID`, `THREADS_ACCESS_TOKEN`, or
  the Thailand/general satellite stream.
- OAuth credentials use only `THREADS_INVESTMENT_USER_ID` and
  `THREADS_INVESTMENT_ACCESS_TOKEN`.
- `npm run threads:investment:launch` is dry-run by default; live launch requires
  the explicit `-- --force-publish` gate.
- Gradual calendar: `npm run threads:investment:daily` with
  `THREADS_INVESTMENT_PHASE` and `THREADS_INVESTMENT_AUTO_PUBLISH=1`.
- Isolated systemd timer `emigro-threads-investment.timer`; never share
  `@emigro_assist` day-budget, inventory, or token.
- See `docs/THREADS_INVESTMENT_CALENDAR.md` for the seed → traffic → lead ramp.

## Inventory hook

`lib/threads/investment-vertical.ts` exposes:

- `loadThreadsInvestmentVerticalConfig()` — identity and editorial metadata only;
- `assertThreadsInvestmentAccountIsolated()` — rejects the main account identity;
- `buildThreadsInvestmentInventory()` — registry-backed, source-first records
  for `/ru/invest/{country}` with a dedicated UTM campaign.

Every inventory item is marked `reviewRequired: true`. Before any manual use,
verify the legal claim against the official source, keep the caveat, and link to
the relevant investment country page. Existing Threads conventions still apply:
native factual root first, concise factual continuation, source link last.

Reserved namespace: `THREADS_INVESTMENT_*`. Do not copy these values into the
primary `THREADS_*` identity.

## Profile pack

- Name: `Emigro Invest`
- Bio: `ВНЖ и документы за инвестиции: недвижимость, фонды, бизнес. Официальные источники, ограничения и проверка маршрута. Без «визы за квартиру».`
- Link: `https://www.emigro.online/ru/invest?utm_source=threads&utm_medium=profile&utm_campaign=emigro_threads_investment`
- Avatar: `public/images/threads-emigro-invest-avatar.png`

Threads API does not edit profile identity, avatar or bio. Apply the profile pack
manually in the Threads/Instagram account UI.
