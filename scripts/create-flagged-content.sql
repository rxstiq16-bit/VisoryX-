CREATE TABLE IF NOT EXISTS public.flagged_content (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  content_type text NOT NULL DEFAULT 'review',
  content_text text NOT NULL,
  author_name text,
  author_id uuid,
  reason text NOT NULL DEFAULT 'inappropriate',
  status text NOT NULL DEFAULT 'pending',
  reviewed_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  reviewed_at timestamptz
);
ALTER TABLE public.flagged_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth_flagged_select" ON public.flagged_content FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_flagged_insert" ON public.flagged_content FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_flagged_update" ON public.flagged_content FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_flagged_delete" ON public.flagged_content FOR DELETE TO authenticated USING (true);
