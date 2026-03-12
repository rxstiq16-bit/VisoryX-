CREATE TABLE IF NOT EXISTS public.refunds (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid,
  amount numeric NOT NULL,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  processed_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  processed_at timestamptz
);
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth_refunds_select" ON public.refunds FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_refunds_insert" ON public.refunds FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_refunds_update" ON public.refunds FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
