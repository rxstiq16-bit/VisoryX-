CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  inquiry_type TEXT NOT NULL DEFAULT 'general',
  status TEXT NOT NULL DEFAULT 'unread',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contact_public_read" ON public.contact_submissions FOR SELECT USING (true);
CREATE POLICY "contact_public_insert" ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "contact_public_update" ON public.contact_submissions FOR UPDATE USING (true);
CREATE POLICY "contact_public_delete" ON public.contact_submissions FOR DELETE USING (true);
