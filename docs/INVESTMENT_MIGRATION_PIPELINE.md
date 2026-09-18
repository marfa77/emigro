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

## Thailand programs

Таиланд в qualifier — три записи, не одна карточка: временное пребывание / property-пилот
(€75k — коммерческий ориентир, не порог приказа), LTR Wealthy Global Citizen
(~€920k ≈ USD 1m активов, [BOI](https://ltr.boi.go.th/)) и Privilege membership
(не property; входной ориентир Bronze THB 650 000). Empyreal относится только к
property-пилоту и только к ручной передаче.

Испания — `closed`: новые инвесторские визы не выдаются с 3 апреля 2025
([LO 1/2025](https://www.boe.es/eli/es/lo/2025/01/02/1)). Партнёра по Испании не ищем.

`Empyreal Estate Phuket` может быть выбран оператором вручную только после проверки
конкретной программы. Отправка qualifier не создаёт assignment и не передаёт контакт.
По странам без подписанного партнёра лид остаётся в очереди; поиск партнёра начинается
после 3 открытых квалифицированных лидов.

## UAE property → documents

ОАЭ — активный property-linked маршрут в реестре:

- скрининговый пол: ~€545k ≈ **AED 2 000 000** Golden Residence через недвижимость
  ([ICP Golden Residency](https://icp.gov.ae/en/services/uae-golden-residency/));
- ниже AED 2M — отдельные 2-летние property-визы, не 10-летний Golden;
- подписанного property-партнёра пока нет: лиды копятся, поиск партнёра с 3
  квалифицированных открытых заявок.

Сестринский инструмент **Dubai Offer Verdict** (`uaeproperty.vip`) — сверка ask
брокера с DLD sold prices. Это due diligence по объекту, не CRM-партнёр: контакт
лида туда не передаётся.

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
