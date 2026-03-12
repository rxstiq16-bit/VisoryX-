-- Create trusted_partners table for managing partner logos on homepage

CREATE TABLE IF NOT EXISTS public.trusted_partners (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  type text NOT NULL DEFAULT 'community',
  initials text NOT NULL DEFAULT '',
  logo_url text,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.trusted_partners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "trusted_partners_public_select" ON public.trusted_partners;
CREATE POLICY "trusted_partners_public_select" ON public.trusted_partners
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "trusted_partners_auth_all" ON public.trusted_partners;
CREATE POLICY "trusted_partners_auth_all" ON public.trusted_partners
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);
