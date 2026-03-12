import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function run() {
  // Test if table already exists by trying to query it
  const { error: checkError } = await supabase
    .from("inbound_emails")
    .select("id")
    .limit(1);

  if (!checkError) {
    console.log("inbound_emails table already exists!");
    return;
  }

  if (checkError.code === "42P01" || checkError.message?.includes("does not exist") || checkError.code === "PGRST204") {
    console.log("Table does not exist yet. Please create it manually in the Supabase SQL Editor:");
    console.log(`
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/YOUR_PROJECT/sql):

CREATE TABLE IF NOT EXISTS inbound_emails (
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
  replied_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inbound_emails_status ON inbound_emails(status);
CREATE INDEX IF NOT EXISTS idx_inbound_emails_created ON inbound_emails(created_at DESC);

ALTER TABLE inbound_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage inbound emails"
  ON inbound_emails FOR ALL
  USING (true)
  WITH CHECK (true);
    `);
  } else {
    // Table exists but has a different error - might be RLS
    console.log("Table might exist but got error:", checkError.message, "code:", checkError.code);
  }

  // Try inserting via REST API to test if it works despite the error
  const { data, error: insertError } = await supabase
    .from("inbound_emails")
    .insert({
      from_email: "test@test.com",
      from_name: "Test",
      to_email: "contact@visoryx.design",
      subject: "Setup Test",
      body_text: "This is a test email to verify the table works.",
      status: "archived",
    })
    .select()
    .single();

  if (insertError) {
    console.log("Insert test failed:", insertError.message);
    console.log("You need to create the table manually in the Supabase SQL Editor.");
  } else {
    console.log("Insert test succeeded! Table is working. ID:", data.id);
    // Clean up test row
    await supabase.from("inbound_emails").delete().eq("id", data.id);
    console.log("Cleaned up test row.");
  }
}

run().catch(console.error);
