# Investment Migration Pipeline

## Product boundary

Investment Migration is an Emigro vertical, not a separate service. Discovery,
qualification, Assist, analytics and lead operations stay inside the existing
product. `/ru/invest` is the comparison hub; country corridors remain the
commercial source of truth.

The qualifier is a preliminary screen, never legal, tax or investment advice.
Property ownership must not be presented as an automatic visa, residence permit
or citizenship.

## Funnel

1. SEO, country corridor, satellite or dedicated Threads account.
2. `/ru/invest` or `/ru/invest/{country}`.
3. Structured qualifier: passport, preferred country, capital, asset, desired
   status, timeline, family and funding readiness.
4. Explicit consent to contact and possible partner handoff.
5. Lead stored in `emigro_manual_leads` with `lead_type=investment`.
6. Matching and provider selection are recalculated on the server.
7. Partner reservation and every later handoff are recorded in
   `emigro_lead_assignments` and `emigro_lead_handoff_events`.
8. Paid Route Check remains the post-qualification upsell.

## Thailand pilot

`Empyreal Estate Phuket` is reserved only when all of the following are true:

- the applicant explicitly selects Thailand or Thailand ranks first;
- the selected asset is property;
- the screening budget is not below the Thailand route floor.

Reservation creates a 90-day attribution window. It does not share contact data
automatically: `contact_shared` must be a separate handoff event. Commission
terms remain empty until the trial economics and a payable legal setup are
agreed.

## Trial metrics

- qualifier starts and completions;
- valid investment leads;
- destination, budget band and asset;
- partner-reserved, introduced and accepted leads;
- first-response time;
- deal won/lost and attributable gross commission;
- effective revenue per qualified lead.

## Dedicated Threads account

Create a separate Threads account only for documents and legal status connected
with property or investment. Keep it separate from the main Emigro and Thailand
lifestyle streams. Account creation remains a manual Meta action.

The repository currently provides a review-only inventory and identity guard in
`lib/threads/investment-vertical.ts`. Automatic publishing, replies and tokens
are intentionally disabled. Operational rules are in
`docs/THREADS_INVESTMENT_VERTICAL.md`.
