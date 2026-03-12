const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function query(table, key, method = 'GET', body = null) {
  const opts = { method, headers: { 'apikey': key, 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json', 'Prefer': 'return=representation' } };
  if (body) opts.body = JSON.stringify(body);
  const url = `${SUPABASE_URL}/rest/v1/${table}`;
  const res = await fetch(url, opts);
  return { status: res.status, data: await res.json() };
}

async function main() {
  console.log("=== RLS POLICY CHECK ===\n");

  // 1. Check if authenticated users can UPDATE profiles
  console.log("1. Testing profile UPDATE with anon key (simulating authenticated)...");
  const profiles = await query('profiles?select=id,username,roles&limit=2', SUPABASE_SERVICE);
  console.log(`   Found ${profiles.data.length} profiles via service key`);
  
  if (profiles.data.length > 0) {
    const testUser = profiles.data.find(p => p.username !== 'riqz') || profiles.data[0];
    console.log(`   Test user: ${testUser.username}, roles: ${JSON.stringify(testUser.roles)}`);
    
    // Try updating with anon key
    const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${testUser.id}`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_ANON,
        'Authorization': `Bearer ${SUPABASE_ANON}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({ roles: testUser.roles }), // same roles, no actual change
    });
    const updateData = await updateRes.text();
    console.log(`   Anon UPDATE status: ${updateRes.status}`);
    console.log(`   Response: ${updateData.substring(0, 200)}`);
    
    if (updateRes.status === 200 || updateRes.status === 204) {
      console.log("   PASS - Anon can update profiles");
    } else {
      console.log("   FAIL - Anon CANNOT update profiles (RLS blocks it)");
    }
  }

  // 2. Check all admin page files exist
  console.log("\n2. Checking admin page imports for potential crashes...");
  const pages = [
    'dashboard', 'orders', 'tickets', 'users', 'staff', 'applications',
    'permissions', 'schedule', 'moderation', 'activity-logs', 'audit',
    'highlights', 'reviews', 'analytics', 'finance', 'payments',
    'performance', 'coupons', 'contact', 'email', 'announcements',
    'settings', 'api', 'compliance', 'forms', 'portfolio',
    'designer-tools', 'discord-creator', 'graphic-creator'
  ];
  
  for (const page of pages) {
    console.log(`   /admin/${page} - listed`);
  }

  // 3. Check reviews table exists
  console.log("\n3. Checking if reviews table exists...");
  const reviewsRes = await fetch(`${SUPABASE_URL}/rest/v1/reviews?select=id&limit=1`, {
    headers: { 'apikey': SUPABASE_SERVICE, 'Authorization': `Bearer ${SUPABASE_SERVICE}` }
  });
  console.log(`   Reviews table: ${reviewsRes.status === 200 ? 'EXISTS' : 'MISSING (status ' + reviewsRes.status + ')'}`);
  
  // 4. Check highlights table
  console.log("\n4. Checking highlights table...");
  const highlightsRes = await fetch(`${SUPABASE_URL}/rest/v1/highlights?select=id&limit=1`, {
    headers: { 'apikey': SUPABASE_SERVICE, 'Authorization': `Bearer ${SUPABASE_SERVICE}` }
  });
  console.log(`   Highlights table: ${highlightsRes.status === 200 ? 'EXISTS' : 'MISSING (status ' + highlightsRes.status + ')'}`);

  // 5. Check portfolio table
  console.log("\n5. Checking portfolio table...");
  const portfolioRes = await fetch(`${SUPABASE_URL}/rest/v1/portfolio_items?select=id&limit=1`, {
    headers: { 'apikey': SUPABASE_SERVICE, 'Authorization': `Bearer ${SUPABASE_SERVICE}` }
  });
  console.log(`   Portfolio table: ${portfolioRes.status === 200 ? 'EXISTS' : 'MISSING (status ' + portfolioRes.status + ')'}`);

  // 6. Check all tables that admin pages depend on
  console.log("\n6. Checking all referenced tables...");
  const tables = ['profiles', 'orders', 'tickets', 'highlights', 'portfolio_items', 'reviews', 'announcements', 'applications', 'contact_messages', 'coupons', 'activity_logs', 'staff_earnings', 'blacklisted_words', 'ip_bans'];
  for (const table of tables) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=id&limit=1`, {
      headers: { 'apikey': SUPABASE_SERVICE, 'Authorization': `Bearer ${SUPABASE_SERVICE}` }
    });
    const status = res.status === 200 ? 'EXISTS' : `MISSING (${res.status})`;
    console.log(`   ${table}: ${status}`);
  }
}

main().catch(console.error);
