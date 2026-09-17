# Threads partner funnel

Status: prepared on 2026-09-17; isolated from the active `@emigro_assist` reach experiment.

## Objective

Recruit service providers who can receive qualified, opt-in Emigro requests:

- immigration lawyers and regulated consultants;
- relocation agencies;
- real-estate specialists;
- tax, banking, insurance, translation, and business-setup providers.

This is a B2B acquisition funnel. It is not a replacement for the B2C reach-first Threads inventory.

## Isolation rules

1. `lib/threads/inventory.ts` must not import `partner-pin.ts`.
2. No partner-recruitment rows in daily guide, city, news, wizard, or Assist rotation.
3. Use one dedicated root + reply and pin the root manually in Threads.
4. Do not publish it until the current Emigro reach-first checkpoint is complete: five post-change roots, each at least 48 hours old.
5. Exclude the partner root from B2C reach medians. Report it as `partner_pin`.
6. Partner success is measured by qualified applications and pilots, not by consumer-post views.

Preview:

```bash
npm run threads:partner-pin
```

Live one-shot publication:

```bash
THREADS_AUTO_PUBLISH=1 npm run threads:partner-pin -- --force-publish
```

The command does not update daily Threads state. Threads pinning is manual.

## Funnel

```text
pinned B2B Threads post
→ /ru/partners?utm_source=threads…
→ partner inquiry form
→ Supabase emigro_partner_inquiries
→ owner Telegram notification
→ qualification
→ free pilot
→ accepted CPL or disclosed revshare after proof
```

Applicant contact data is transferred only after explicit consent. Emigro does not sell scraped handles or contact lists.

## Partner qualification

Collect before activating a provider:

- legal company / specialist name and public profile;
- countries, service scope, and working languages;
- registration or professional licence where required;
- named person responsible for regulated immigration advice;
- response SLA and lead rejection rules;
- whether introductions are shared or exclusive;
- exact commercial basis: accepted CPL, percentage of broker commission, percentage of transaction value, or another model;
- written disclosure wording for applicant-facing placements.

## Thailand / Simon pilot

The registry currently contains the Phuket real-estate pilot as `empyreal-estate-phuket`.

Before routing paid leads, document:

1. Whether the proposed `3%` is calculated from property value, broker commission, or cash actually received.
2. Which entity signs the agreement and pays Emigro.
3. Which licensed professional handles immigration advice.
4. The exact long-stay or residence route being discussed.
5. Applicant-facing wording that states property purchase by itself does not guarantee a visa or residence permit.
6. Refund, cancellation, attribution-window, and duplicate-lead rules.

Do not publish a claim equivalent to “buy Thai property and receive residence”.

## Metrics

Review monthly:

- partner-page visits from `utm_campaign=partner_network`;
- completed partner inquiries;
- qualified providers;
- countries and service gaps filled;
- median response time;
- pilot leads accepted / rejected and reasons;
- signed post-pilot CPL or revshare agreements.
