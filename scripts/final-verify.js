const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function query(table, key = serviceKey) {
  const res = await fetch(`${url}/rest/v1/${table}?select=*&limit=1`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` }
  });
  return { status: res.status, ok: res.ok };
}

async function run() {
  console.log("=== FINAL VERIFICATION ===\n");

  // 1. Check all tables
  const tables = [
    'profiles', 'orders', 'announcements', 'highlights', 'applications',
    'portfolio_items', 'ip_bans', 'tickets', 'coupons', 'activity_logs',
    'blacklist', 'contact_submissions', 'reviews', 'form_submissions', 'invitations'
  ];

  let allPass = true;
  for (const t of tables) {
    const r = await query(t);
    const status = r.ok ? 'OK' : 'FAIL';
    if (!r.ok) allPass = false;
    console.log(`  ${status.padEnd(5)} ${t}`);
  }
  console.log(allPass ? "\nAll tables: PASS" : "\nSome tables: FAIL");

  // 2. Check reviews columns
  const reviewsRes = await fetch(`${url}/rest/v1/reviews?select=id,customer_name,designer_name,rating,review,response,service,status,featured&limit=1`, {
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` }
  });
  console.log(`\nReviews schema: ${reviewsRes.ok ? 'PASS - all columns exist' : 'FAIL - ' + reviewsRes.status}`);

  // 3. Test role update via service key
  const { data: testUser } = await fetch(`${url}/rest/v1/profiles?select=id,roles&limit=1`, {
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` }
  }).then(r => r.json()).then(d => ({ data: d?.[0] }));

  if (testUser) {
    const updateRes = await fetch(`${url}/rest/v1/profiles?id=eq.${testUser.id}`, {
      method: 'PATCH',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      body: JSON.stringify({ roles: testUser.roles }) // write same roles back
    });
    const updated = await updateRes.json();
    console.log(`Role update: ${updated?.length > 0 ? 'PASS' : 'FAIL'}`);
  }

  // 4. Announcements public read
  const anonAnn = await query('announcements', anonKey);
  console.log(`Announcements (public): ${anonAnn.ok ? 'PASS' : 'FAIL'}`);

  // 5. Env vars
  const envs = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY',
    'STRIPE_SECRET_KEY', 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', 'STRIPE_WEBHOOK_SECRET', 'RESEND_API_KEY'];
  const missing = envs.filter(e => !process.env[e]);
  console.log(`\nEnv vars: ${missing.length === 0 ? 'ALL SET' : 'Missing: ' + missing.join(', ')}`);

  // 6. Stripe key check
  const sk = process.env.STRIPE_SECRET_KEY || '';
  const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
  const skMode = sk.startsWith('sk_live') ? 'live' : 'test';
  const pkMode = pk.startsWith('pk_live') ? 'live' : 'test';
  console.log(`Stripe keys: secret=${skMode}, publishable=${pkMode} ${skMode === pkMode ? 'MATCH' : 'MISMATCH!'}`);

  console.log("\n=== DONE ===");
}

run().catch(console.error);
