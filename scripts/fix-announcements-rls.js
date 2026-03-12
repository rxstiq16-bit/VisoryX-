const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

// Use the service role to run SQL via the pg_net extension or rpc
// Since we can't run DDL directly, we'll use the REST API to test
// The RLS fix needs to be run in the Supabase SQL Editor

console.log("=== ANNOUNCEMENTS TABLE STRUCTURE ===")
const res = await fetch(`${SUPABASE_URL}/rest/v1/announcements?select=*&limit=1`, {
  headers: {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
  },
})
const data = await res.json()
if (data.length > 0) {
  console.log("Columns:", Object.keys(data[0]).join(", "))
  console.log("Sample:", JSON.stringify(data[0], null, 2))
}

console.log("\n=== RLS FIX NEEDED ===")
console.log("Run this SQL in your Supabase Dashboard > SQL Editor:\n")
console.log(`
-- Allow anyone to read announcements
CREATE POLICY "announcements_public_select" ON announcements
  FOR SELECT TO anon, authenticated
  USING (true);
`)
