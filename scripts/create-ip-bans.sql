CREATE TABLE IF NOT EXISTS public.ip_bans (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address text NOT NULL,
  reason text,
  is_permanent boolean DEFAULT false,
  expires_at timestamptz,
  added_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.ip_bans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth_ip_bans_select" ON public.ip_bans FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_ip_bans_insert" ON public.ip_bans FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_ip_bans_update" ON public.ip_bans FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_ip_bans_delete" ON public.ip_bans FOR DELETE TO authenticated USING (true);
