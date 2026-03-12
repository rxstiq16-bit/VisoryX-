CREATE TABLE IF NOT EXISTS public.promos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  discount_type text NOT NULL DEFAULT 'percentage',
  discount_value numeric NOT NULL,
  badge_text text,
  is_active boolean DEFAULT true,
  starts_at timestamptz DEFAULT now(),
  ends_at timestamptz,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.promos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth_promos_select" ON public.promos FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_promos_insert" ON public.promos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_promos_update" ON public.promos FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_promos_delete" ON public.promos FOR DELETE TO authenticated USING (true);
