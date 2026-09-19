-- Runtime-editable partner referral URLs (no deploy to rotate links).

create table if not exists public.partner_referral_offers (
  id text primary key,
  provider text not null,
  product text not null,
  url text not null,
  ends_on date not null,
  enabled boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.partner_referral_offers enable row level security;

insert into public.partner_referral_offers (id, provider, product, url, ends_on, enabled)
values
  (
    'revolut_personal',
    'revolut',
    'personal',
    'https://revolut.com/referral/?referral-code=p_veselov!SEP2-26-AR-H2&geo-redirect',
    '2026-10-06',
    true
  ),
  (
    'revolut_business',
    'revolut',
    'business',
    'https://business.revolut.com/signup?promo=C2B-SEP2-26-AR-H1&ext=p_veselov&context=C2B_REFERRAL',
    '2026-10-07',
    true
  )
on conflict (id) do nothing;
