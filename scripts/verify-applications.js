const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function test(label, fn) {
  console.log(`\n=== ${label} ===`);
  try { await fn(); } catch (e) { console.log("ERROR:", e.message); }
}

async function anonFetch(path, opts = {}) {
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...opts,
    headers: {
      apikey: ANON_KEY,
      Authorization: `Bearer ${ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(opts.headers || {}),
    },
  });
}

await test("1. Insert as anon (simulates /apply page)", async () => {
  const res = await anonFetch("applications", {
    method: "POST",
    body: JSON.stringify({
      name: "RLS Test User",
      email: "rls-test@visoryx.test",
      discord_username: "rlstest#0001",
      role: "designer",
      experience: "Testing RLS policies",
      why_join: "Verifying the fix works",
      status: "pending",
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    console.log("FAILED:", res.status, JSON.stringify(data));
  } else {
    console.log("SUCCESS! Application inserted with ID:", data[0]?.id);
  }
});

await test("2. Read as anon (simulates admin page)", async () => {
  const res = await anonFetch("applications?select=*&order=created_at.desc&limit=5");
  const data = await res.json();
  if (!res.ok) {
    console.log("FAILED:", res.status, JSON.stringify(data));
  } else {
    console.log("Found", data.length, "applications:");
    data.forEach((a, i) => {
      console.log(`  ${i+1}. ${a.name} | ${a.email} | ${a.role} | ${a.status} | ${a.created_at}`);
    });
  }
});

await test("3. Cleanup test record", async () => {
  const res = await anonFetch("applications?email=eq.rls-test@visoryx.test", {
    method: "DELETE",
  });
  console.log("Delete status:", res.status, res.ok ? "OK" : "FAILED");
});

await test("4. Final count", async () => {
  const res = await anonFetch("applications?select=id");
  const data = await res.json();
  console.log("Total real applications in database:", data.length);
});
