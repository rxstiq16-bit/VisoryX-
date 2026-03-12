const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function query(table, key = anonKey) {
  const res = await fetch(`${url}/rest/v1/${table}?select=*&limit=1`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  return { status: res.status, ok: res.ok };
}

async function testRoleUpdate() {
  // Get a test user to update
  const res = await fetch(`${url}/rest/v1/profiles?select=id,roles&limit=1`, {
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
  });
  const profiles = await res.json();
  if (!profiles.length) return { ok: false, reason: "No profiles" };
  
  const user = profiles[0];
  // Update roles then set back to original
  const updateRes = await fetch(`${url}/rest/v1/profiles?id=eq.${user.id}`, {
    method: "PATCH",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({ roles: user.roles }),
  });
  const updated = await updateRes.json();
  return { ok: updateRes.ok && updated.length > 0, status: updateRes.status, rows: updated.length };
}

async function run() {
  console.log("=== FINAL SYSTEM CHECK ===\n");

  // 1. Check all tables exist and are readable
  const tables = [
    "profiles", "orders", "announcements", "highlights", "applications",
    "portfolio_items", "tickets", "coupons", "activity_logs", "blacklist",
    "ip_bans", "contact_submissions", "form_submissions", "invitations",
    "reviews",
  ];

  console.log("--- TABLE ACCESS (anon key) ---");
  let allOk = true;
  for (const t of tables) {
    const r = await query(t);
    const status = r.ok ? "PASS" : "FAIL";
    if (!r.ok) allOk = false;
    console.log(`  ${status} ${t} (${r.status})`);
  }

  // 2. Test service key role update
  console.log("\n--- ROLE UPDATE (service key) ---");
  const roleTest = await testRoleUpdate();
  console.log(`  ${roleTest.ok ? "PASS" : "FAIL"} Role update via service key (status: ${roleTest.status}, rows: ${roleTest.rows})`);

  // 3. Check announcements are readable (the fix)
  console.log("\n--- ANNOUNCEMENTS (anon read) ---");
  const annRes = await fetch(`${url}/rest/v1/announcements?select=*&status=eq.active`, {
    headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
  });
  const anns = await annRes.json();
  console.log(`  ${annRes.ok ? "PASS" : "FAIL"} Announcements readable: ${Array.isArray(anns) ? anns.length : 0} active`);

  // 4. Check reviews table has correct columns
  console.log("\n--- REVIEWS TABLE SCHEMA ---");
  const revRes = await fetch(`${url}/rest/v1/reviews?select=id,customer_name,designer_name,rating,review,response,service,status,featured&limit=0`, {
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
  });
  console.log(`  ${revRes.ok ? "PASS" : "FAIL"} Reviews schema (${revRes.status}) - all columns exist: ${revRes.ok}`);

  // 5. Check env vars
  console.log("\n--- ENV VARS ---");
  const vars = [
    "NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY",
    "STRIPE_SECRET_KEY", "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", "STRIPE_WEBHOOK_SECRET",
    "RESEND_API_KEY",
  ];
  for (const v of vars) {
    const val = process.env[v];
    const status = val ? "PASS" : "MISSING";
    console.log(`  ${status} ${v}${val ? ` (${val.substring(0, 8)}...)` : ""}`);
  }

  // 6. Test Stripe connectivity
  console.log("\n--- STRIPE API ---");
  const stripeRes = await fetch("https://api.stripe.com/v1/balance", {
    headers: { Authorization: `Basic ${btoa(process.env.STRIPE_SECRET_KEY + ":")}` },
  });
  console.log(`  ${stripeRes.ok ? "PASS" : "FAIL"} Stripe API (${stripeRes.status})`);

  console.log("\n=== CHECK COMPLETE ===");
  console.log(allOk ? "All tables accessible." : "Some tables had issues - see above.");
}

run().catch(e => console.error("Script error:", e.message));
