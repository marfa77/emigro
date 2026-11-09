-- Lookup/catalog tables omitted from original MVP RLS. Public read only; writes via service_role.
ALTER TABLE public.emigro_step_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emigro_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emigro_countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emigro_program_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emigro_requirement_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_step_types" ON public.emigro_step_types FOR SELECT USING (true);
CREATE POLICY "public_read_outcomes" ON public.emigro_outcomes FOR SELECT USING (true);
CREATE POLICY "public_read_countries" ON public.emigro_countries FOR SELECT USING (true);
CREATE POLICY "public_read_program_types" ON public.emigro_program_types FOR SELECT USING (true);
CREATE POLICY "public_read_requirement_types" ON public.emigro_requirement_types FOR SELECT USING (true);
