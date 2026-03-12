-- Create missing tables needed by admin pages

-- Reviews table (used by testimonial-request.tsx and reviews-admin)
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name text NOT NULL,
  designer_name text NOT NULL DEFAULT '',
  review text NOT NULL,
  rating integer NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  service text,
  response text,
  order_id text,
  status text DEFAULT 'published',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reviews_public_select" ON public.reviews;
CREATE POLICY "reviews_public_select" ON public.reviews
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "reviews_auth_insert" ON public.reviews;
CREATE POLICY "reviews_auth_insert" ON public.reviews
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "reviews_auth_update" ON public.reviews;
CREATE POLICY "reviews_auth_update" ON public.reviews
  FOR UPDATE TO authenticated
  USING (true);

DROP POLICY IF EXISTS "reviews_auth_delete" ON public.reviews;
CREATE POLICY "reviews_auth_delete" ON public.reviews
  FOR DELETE TO authenticated
  USING (true);

-- Contact submissions table (used by contact-store.ts and contact-admin.tsx)
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  inquiry_type text DEFAULT 'general',
  status text DEFAULT 'unread',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "contact_submissions_anon_insert" ON public.contact_submissions;
CREATE POLICY "contact_submissions_anon_insert" ON public.contact_submissions
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "contact_submissions_auth_select" ON public.contact_submissions;
CREATE POLICY "contact_submissions_auth_select" ON public.contact_submissions
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "contact_submissions_auth_update" ON public.contact_submissions;
CREATE POLICY "contact_submissions_auth_update" ON public.contact_submissions
  FOR UPDATE TO authenticated
  USING (true);

DROP POLICY IF EXISTS "contact_submissions_auth_delete" ON public.contact_submissions;
CREATE POLICY "contact_submissions_auth_delete" ON public.contact_submissions
  FOR DELETE TO authenticated
  USING (true);

-- Blacklist table (used by blacklist-manager.tsx)
CREATE TABLE IF NOT EXISTS public.blacklist (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier text NOT NULL,
  type text DEFAULT 'email',
  reason text,
  added_by text DEFAULT 'Admin',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.blacklist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "blacklist_auth_all" ON public.blacklist;
CREATE POLICY "blacklist_auth_all" ON public.blacklist
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);
