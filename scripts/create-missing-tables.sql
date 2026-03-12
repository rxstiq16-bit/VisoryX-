CREATE TABLE IF NOT EXISTS public.ip_bans (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address text NOT NULL,
  reason text,
  is_permanent boolean DEFAULT false,
  expires_at timestamptz,
  added_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.promos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  discount_type text NOT NULL DEFAULT 'percentage',
  discount_value numeric NOT NULL,
  start_date timestamptz,
  end_date timestamptz,
  is_active boolean DEFAULT true,
  banner_text text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.flagged_content (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  content_type text NOT NULL,
  content_id text,
  content_text text,
  author_name text,
  reason text,
  status text NOT NULL DEFAULT 'pending',
  reviewed_by uuid REFERENCES auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.refunds (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id text NOT NULL,
  amount numeric NOT NULL,
  reason text,
  status text NOT NULL DEFAULT 'pending',
  processed_by uuid REFERENCES auth.users(id),
  processed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.staff_schedules (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  staff_name text NOT NULL,
  day_of_week integer NOT NULL,
  start_time text,
  end_time text,
  status text DEFAULT 'available',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.handoff_notes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user_id uuid REFERENCES auth.users(id),
  from_name text NOT NULL,
  to_name text,
  note text NOT NULL,
  priority text DEFAULT 'normal',
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.ip_bans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flagged_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.handoff_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth_ip_bans_all" ON public.ip_bans FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_promos_all" ON public.promos FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_flagged_all" ON public.flagged_content FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_refunds_all" ON public.refunds FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_schedules_all" ON public.staff_schedules FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_handoff_all" ON public.handoff_notes FOR ALL TO authenticated USING (true) WITH CHECK (true);
