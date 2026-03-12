CREATE TABLE IF NOT EXISTS public.corporate_form_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  form_type text NOT NULL,
  employee_name text NOT NULL,
  employee_email text NOT NULL,
  discord_username text,
  position text,
  employment_type text,
  department text,
  digital_signature text NOT NULL,
  form_data jsonb NOT NULL DEFAULT '{}',
  acknowledgments jsonb NOT NULL DEFAULT '[]',
  submitted_at timestamptz DEFAULT now(),
  submitted_by uuid,
  status text DEFAULT 'submitted',
  reviewed_by text,
  reviewed_at timestamptz,
  review_notes text
);

ALTER TABLE public.corporate_form_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth_corporate_forms_all" ON public.corporate_form_submissions FOR ALL TO authenticated USING (true) WITH CHECK (true);
