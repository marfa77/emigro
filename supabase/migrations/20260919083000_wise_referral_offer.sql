-- Wise personal invite. Open-ended: ends_on 2099-12-31 means «until disabled».

insert into public.partner_referral_offers (id, provider, product, url, ends_on, enabled)
values (
  'wise_personal',
  'wise',
  'personal',
  'https://wise.com/invite/irhc/pavelv418',
  '2099-12-31',
  true
)
on conflict (id) do nothing;
