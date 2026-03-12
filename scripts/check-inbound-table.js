import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function check() {
  // Try to query the table
  const { data, error } = await supabase
    .from("inbound_emails")
    .select("id")
    .limit(1)

  if (error) {
    console.log("ERROR: inbound_emails table does NOT exist or is not accessible")
    console.log("Error details:", error.message, error.code)
    console.log("")
    console.log("Please run this SQL in your Supabase SQL Editor:")
    console.log("")
    console.log(`CREATE TABLE IF NOT EXISTS inbound_emails (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  from_email text NOT NULL,
  from_name text,
  to_email text DEFAULT 'contact@visoryx.design',
  subject text NOT NULL DEFAULT '(No Subject)',
  body_text text,
  body_html text,
  status text NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
  starred boolean NOT NULL DEFAULT false,
  admin_notes text,
  resend_email_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inbound_emails_status ON inbound_emails(status);
CREATE INDEX IF NOT EXISTS idx_inbound_emails_created_at ON inbound_emails(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inbound_emails_from_email ON inbound_emails(from_email);

ALTER TABLE inbound_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role full access on inbound_emails"
  ON inbound_emails FOR ALL USING (true) WITH CHECK (true);`)
  } else {
    console.log("SUCCESS: inbound_emails table exists!")
    console.log("Rows found:", data.length)
  }
}

check()
