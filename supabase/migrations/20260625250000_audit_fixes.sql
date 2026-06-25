-- Audit fixes: optional wizard numerics, eligibility upsert RLS, investor question ordering

UPDATE emigro_wizard_questions
SET required = false
WHERE question_key IN (
  'monthly_income_eur',
  'passive_income_eur',
  'savings_eur',
  'annual_salary_eur',
  'willing_to_invest_eur',
  'relocating_children_count',
  'relocating_parents_count'
);

UPDATE emigro_wizard_questions
SET sort_order = 4
WHERE question_key = 'willing_to_invest_eur'
  AND sort_order = 3;

DROP POLICY IF EXISTS anon_update_results ON emigro_eligibility_results;
CREATE POLICY anon_update_results ON emigro_eligibility_results
  FOR UPDATE TO anon
  USING (true)
  WITH CHECK (true);
