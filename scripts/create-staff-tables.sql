CREATE TABLE IF NOT EXISTS public.staff_schedules (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  day_of_week integer NOT NULL,
  start_time time,
  end_time time,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.staff_schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth_schedules_select" ON public.staff_schedules FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_schedules_insert" ON public.staff_schedules FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_schedules_update" ON public.staff_schedules FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_schedules_delete" ON public.staff_schedules FOR DELETE TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS public.handoff_notes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user uuid REFERENCES auth.users(id),
  to_user uuid REFERENCES auth.users(id),
  note text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.handoff_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth_handoff_select" ON public.handoff_notes FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_handoff_insert" ON public.handoff_notes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_handoff_update" ON public.handoff_notes FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
