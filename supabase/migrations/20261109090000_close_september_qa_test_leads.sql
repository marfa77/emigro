-- QA bursts on 2026-09-18/19 left 17 "new" leads seconds apart (assist + investment
-- pipelines). Close only the rows that carry an explicit test marker in name, contact
-- or notes, so lead metrics stop counting them. Three unmarked rows in the same window
-- stay "new" on purpose: they may be real people.
UPDATE public.emigro_manual_leads
SET status = 'closed',
    notes = concat_ws(' ', notes, '[auto 2026-11-09: QA test lead, closed]'),
    updated_at = now()
WHERE status = 'new'
  AND created_at >= '2026-09-18T00:00:00Z'
  AND created_at <  '2026-09-20T00:00:00Z'
  AND concat_ws(' ', name, email, telegram, notes) ~* '(test|example|qa|demo|@emigro|fake|smoke|probe)';
