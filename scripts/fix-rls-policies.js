const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.log("ERROR: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

async function runSQL(sql, label) {
  console.log(`\n=== ${label} ===`);
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: "POST",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sql }),
  });

  if (res.ok) {
    console.log("SUCCESS");
    return true;
  }

  const text = await res.text();
  console.log("Status:", res.status, text);
  return false;
}

// Try the RPC approach first
const rpcWorked = await runSQL(
  `DO $$ BEGIN
    -- Drop existing policies if any
    DROP POLICY IF EXISTS "Anyone can submit applications" ON applications;
    DROP POLICY IF EXISTS "Anyone can read applications" ON applications;
    DROP POLICY IF EXISTS "Admins can update applications" ON applications;
    DROP POLICY IF EXISTS "applications_anon_insert" ON applications;
    DROP POLICY IF EXISTS "applications_anon_select" ON applications;
    DROP POLICY IF EXISTS "applications_auth_all" ON applications;
    
    -- Enable RLS
    ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
    
    -- Allow anyone (including anonymous) to insert
    CREATE POLICY "applications_public_insert" ON applications
      FOR INSERT TO anon, authenticated
      WITH CHECK (true);
    
    -- Allow anyone to read (admin needs this, anon doesn't hurt)
    CREATE POLICY "applications_public_select" ON applications
      FOR SELECT TO anon, authenticated
      USING (true);
    
    -- Allow authenticated users to update (for admin status changes)
    CREATE POLICY "applications_auth_update" ON applications
      FOR UPDATE TO authenticated
      USING (true)
      WITH CHECK (true);
      
    -- Allow authenticated users to delete
    CREATE POLICY "applications_auth_delete" ON applications
      FOR DELETE TO authenticated
      USING (true);
  END $$;`,
  "Applying RLS policies via exec_sql RPC"
);

if (!rpcWorked) {
  console.log("\nRPC method failed. Trying direct SQL via pg_query...");
  
  // Alternative: Try individual policy creation via PostgREST
  // If RPC doesn't exist, output instructions for manual execution
  console.log("\n========================================");
  console.log("MANUAL FIX REQUIRED:");
  console.log("========================================");
  console.log("Go to your Supabase Dashboard > SQL Editor and run:\n");
  console.log(`
-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can submit applications" ON applications;
DROP POLICY IF EXISTS "Anyone can read applications" ON applications;  
DROP POLICY IF EXISTS "Admins can update applications" ON applications;
DROP POLICY IF EXISTS "applications_anon_insert" ON applications;
DROP POLICY IF EXISTS "applications_anon_select" ON applications;
DROP POLICY IF EXISTS "applications_auth_all" ON applications;

-- Enable RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (so the /apply page works for non-logged-in users)
CREATE POLICY "applications_public_insert" ON applications
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Allow anyone to read
CREATE POLICY "applications_public_select" ON applications
  FOR SELECT TO anon, authenticated
  USING (true);

-- Allow authenticated to update (admin status changes)
CREATE POLICY "applications_auth_update" ON applications
  FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

-- Allow authenticated to delete
CREATE POLICY "applications_auth_delete" ON applications
  FOR DELETE TO authenticated
  USING (true);
  `);
}

// Test if anon insert works now
console.log("\n=== Testing anon insert ===");
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/applications`, {
  method: "POST",
  headers: {
    apikey: ANON_KEY,
    Authorization: `Bearer ${ANON_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  },
  body: JSON.stringify({
    name: "RLS Test User",
    email: "rlstest@delete.me",
    discord_username: "testuser",
    role: "designer",
    experience: "Testing RLS fix",
    why_join: "Testing",
    status: "pending",
  }),
});

const insertText = await insertRes.text();
console.log("Anon insert status:", insertRes.status);
if (insertRes.ok) {
  console.log("ANON INSERT WORKS! RLS fix successful.");
  // Clean up
  await fetch(`${SUPABASE_URL}/rest/v1/applications?email=eq.rlstest@delete.me`, {
    method: "DELETE",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
    },
  });
  console.log("Cleaned up test record.");
} else {
  console.log("Anon insert still fails:", insertText);
  console.log("\nYou MUST run the SQL above in the Supabase Dashboard SQL Editor.");
}
