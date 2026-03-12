import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const sql = `
CREATE TABLE IF NOT EXISTS public.inbound_emails (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  from_email text NOT NULL,
  from_name text,
  to_email text DEFAULT 'contact@visoryx.design',
  subject text NOT NULL DEFAULT '(No Subject)',
  body_text text,
  body_html text,
  status text NOT NULL DEFAULT 'unread' CHECK (status IN ('unread','read','replied','archived')),
  starred boolean DEFAULT false,
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
`;

async function run() {
  // Try using rpc to execute raw SQL
  const { data, error } = await supabase.rpc('exec_sql', { sql_string: sql });
  
  if (error) {
    console.log("RPC approach failed:", error.message);
    console.log("Trying alternative approach...");
    
    // Alternative: create via REST by inserting a dummy row first
    // This won't work if table doesn't exist, but let's try the pg approach
    
    // Use fetch directly against the Supabase REST API
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    // Try the /rest/v1/rpc endpoint  
    const res = await fetch(`${url}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': key,
        'Authorization': `Bearer ${key}`,
      },
      body: JSON.stringify({ sql_string: sql }),
    });
    
    if (!res.ok) {
      const text = await res.text();
      console.log("Direct fetch also failed:", res.status, text);
      console.log("");
      console.log("=== MANUAL STEP REQUIRED ===");
      console.log("Please run this SQL in your Supabase Dashboard > SQL Editor:");
      console.log("");
      console.log(sql);
      console.log(`
ALTER TABLE public.inbound_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role full access on inbound_emails"
  ON public.inbound_emails
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_inbound_emails_status ON public.inbound_emails(status);
CREATE INDEX IF NOT EXISTS idx_inbound_emails_created ON public.inbound_emails(created_at DESC);
`);
    } else {
      console.log("Table created successfully via RPC!");
    }
  } else {
    console.log("Table created successfully!", data);
  }
}

run();
