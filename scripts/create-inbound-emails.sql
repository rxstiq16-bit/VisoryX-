CREATE TABLE IF NOT EXISTS public.inbound_emails (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  from_email text NOT NULL,
  from_name text,
  to_email text NOT NULL DEFAULT 'contact@visoryx.design',
  subject text NOT NULL DEFAULT '(No Subject)',
  body_text text,
  body_html text,
  status text NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
  starred boolean NOT NULL DEFAULT false,
  admin_notes text,
  resend_email_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  read_at timestamptz,
  replied_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_inbound_emails_status ON public.inbound_emails(status);
CREATE INDEX IF NOT EXISTS idx_inbound_emails_created_at ON public.inbound_emails(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inbound_emails_from_email ON public.inbound_emails(from_email);

ALTER TABLE public.inbound_emails ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'inbound_emails' AND policyname = 'Allow service role full access to inbound_emails'
  ) THEN
    CREATE POLICY "Allow service role full access to inbound_emails"
      ON public.inbound_emails
      FOR ALL
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

SELECT 'inbound_emails table created successfully' AS result;
