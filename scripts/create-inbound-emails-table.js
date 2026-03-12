import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  // Create inbound_emails table
  const { error: tableError } = await supabase.rpc("exec_sql", {
    sql: `
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
    `,
  });

  if (tableError) {
    // Try direct SQL via REST if rpc doesn't exist
    console.log("RPC not available, trying direct insert approach...");

    // Test if the table already exists by trying to select from it
    const { error: selectError } = await supabase
      .from("inbound_emails")
      .select("id")
      .limit(1);

    if (selectError && selectError.code === "42P01") {
      console.log("Table does not exist. Please create it via Supabase SQL editor:");
      console.log(`
CREATE TABLE inbound_emails (
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

ALTER TABLE inbound_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for service role" ON inbound_emails FOR ALL USING (true) WITH CHECK (true);
      `);
    } else {
      console.log("inbound_emails table already exists!");
    }
  } else {
    console.log("inbound_emails table created successfully!");
  }

  // Verify by inserting and deleting a test row
  const { data, error: insertError } = await supabase
    .from("inbound_emails")
    .insert({
      from_email: "test@test.com",
      to_email: "contact@visoryx.design",
      subject: "Test - safe to delete",
      body_text: "This is a test row to verify the table works.",
    })
    .select()
    .single();

  if (insertError) {
    console.log("Insert test failed:", insertError.message);
    console.log("The table may need to be created via the Supabase SQL Editor.");
  } else {
    console.log("Insert test passed! Row ID:", data.id);
    // Clean up test row
    await supabase.from("inbound_emails").delete().eq("id", data.id);
    console.log("Test row cleaned up.");
  }
}

run().catch(console.error);
