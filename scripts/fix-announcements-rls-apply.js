const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Test if anon can read announcements
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const anonRes = await fetch(`${url}/rest/v1/announcements?select=*&status=eq.active`, {
  headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` }
});
const anonData = await anonRes.json();
console.log(`Anon read: ${anonRes.status}, count: ${Array.isArray(anonData) ? anonData.length : 'error'}`);

if (anonRes.status === 200 && Array.isArray(anonData) && anonData.length > 0) {
  console.log("Announcements already readable by anon. No fix needed.");
} else {
  console.log("Anon can't read announcements. Attempting RLS fix via rpc...");
  
  // Try exec_sql RPC
  const sql = `
    DROP POLICY IF EXISTS "announcements_public_select" ON announcements;
    CREATE POLICY "announcements_public_select" ON announcements
      FOR SELECT TO anon, authenticated
      USING (true);
  `;
  
  const rpcRes = await fetch(`${url}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql })
  });
  
  if (rpcRes.ok) {
    console.log("RLS fix applied via RPC!");
  } else {
    console.log(`RPC not available (${rpcRes.status}). Please run this SQL in Supabase Dashboard > SQL Editor:`);
    console.log(`\n${sql}`);
  }
  
  // Verify with service key that data exists
  const svcRes = await fetch(`${url}/rest/v1/announcements?select=*&status=eq.active`, {
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` }
  });
  const svcData = await svcRes.json();
  console.log(`\nService key read: ${svcRes.status}, count: ${Array.isArray(svcData) ? svcData.length : 'error'}`);
  if (Array.isArray(svcData) && svcData.length > 0) {
    console.log("Announcement:", svcData[0].title);
  }
}
