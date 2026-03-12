-- Create inbound_emails table for storing emails received via Resend webhook
CREATE TABLE IF NOT EXISTS inbound_emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_email TEXT NOT NULL,
  from_name TEXT,
  to_email TEXT NOT NULL,
  subject TEXT,
  body_text TEXT,
  body_html TEXT,
  reply_to TEXT,
  cc TEXT,
  bcc TEXT,
  message_id TEXT,
  in_reply_to TEXT,
  spam_score REAL DEFAULT 0,
  is_read BOOLEAN DEFAULT false,
  is_starred BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  labels TEXT[] DEFAULT '{}',
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_inbound_emails_from ON inbound_emails(from_email);
CREATE INDEX IF NOT EXISTS idx_inbound_emails_created ON inbound_emails(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inbound_emails_is_read ON inbound_emails(is_read);
CREATE INDEX IF NOT EXISTS idx_inbound_emails_is_archived ON inbound_emails(is_archived);

-- Also ensure contact_submissions exists
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT,
  inquiry_type TEXT DEFAULT 'general',
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS policies for inbound_emails (service role only)
ALTER TABLE inbound_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage inbound emails"
  ON inbound_emails FOR ALL
  USING (true)
  WITH CHECK (true);

-- RLS policies for contact_submissions
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage contact submissions"
  ON contact_submissions FOR ALL
  USING (true)
  WITH CHECK (true);
