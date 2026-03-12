const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.log("ERROR: Missing SUPABASE_SERVICE_ROLE_KEY env var.");
  console.log("The service role key is needed to modify RLS policies.");
  console.log("You can find it in your Supabase dashboard > Settings > API > service_role key");
  process.exit(1);
}

async function runSQL(sql) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
    method: "POST",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sql }),
  });
  return { status: res.status, ok: res.ok };
}

// Test with service role key - insert should bypass RLS
console.log("=== Testing insert with service role key ===");
const testRes = await fetch(`${SUPABASE_URL}/rest/v1/applications`, {
  method: "POST",
  headers: {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  },
  body: JSON.stringify({
    name: "RLS Test User",
    email: "rlstest@delete.me",
    discord_username: "rlstest",
    role: "designer",
    experience: "Testing RLS",
    why_join: "Testing RLS policy",
    status: "pending",
  }),
});

const testData = await testRes.text();
console.log("Service role insert status:", testRes.status);
console.log("Response:", testData);

if (testRes.ok) {
  console.log("Service role insert works! Now cleaning up...");
  await fetch(`${SUPABASE_URL}/rest/v1/applications?email=eq.rlstest@delete.me`, {
    method: "DELETE",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
    },
  });
  console.log("Cleaned up test record.");
}

// Now test anon insert to confirm RLS blocks it
console.log("\n=== Testing anon insert ===");
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const anonRes = await fetch(`${SUPABASE_URL}/rest/v1/applications`, {
  method: "POST",
  headers: {
    apikey: ANON_KEY,
    Authorization: `Bearer ${ANON_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  },
  body: JSON.stringify({
    name: "Anon Test",
    email: "anontest@delete.me",
    discord_username: "anontest",
    role: "designer",
    experience: "Testing",
    why_join: "Testing anon",
    status: "pending",
  }),
});

const anonData = await anonRes.text();
console.log("Anon insert status:", anonRes.status);
console.log("Response:", anonData);

if (anonRes.ok) {
  console.log("Anon insert works! RLS allows public inserts.");
  await fetch(`${SUPABASE_URL}/rest/v1/applications?email=eq.anontest@delete.me`, {
    method: "DELETE",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
    },
  });
  console.log("Cleaned up.");
} else {
  console.log("\nAnon insert BLOCKED by RLS. You need to add a policy.");
  console.log("Go to Supabase Dashboard > SQL Editor and run:");
  console.log(`
CREATE POLICY "Allow public inserts"
  ON applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
  `);
}
