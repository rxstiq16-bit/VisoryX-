-- Email analytics events table
CREATE TABLE IF NOT EXISTS email_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  resend_email_id text,
  event_type text NOT NULL CHECK (event_type IN ('sent', 'delivered', 'opened', 'clicked', 'bounced', 'complained')),
  recipient_email text,
  subject text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_events_type ON email_events(event_type);
CREATE INDEX IF NOT EXISTS idx_email_events_recipient ON email_events(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_events_created ON email_events(created_at DESC);

ALTER TABLE email_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role full access on email_events"
  ON email_events FOR ALL USING (true) WITH CHECK (true);
