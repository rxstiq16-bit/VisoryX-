const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function supabaseAdmin(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    ...options,
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  return { data, status: res.status, ok: res.ok };
}

// Check auth.users via admin API
console.log("=== Auth Users ===");
const users = await supabaseAdmin("/auth/v1/admin/users?page=1&per_page=50");
if (users.ok && users.data?.users) {
  console.log(`Total auth users: ${users.data.users.length}`);
  users.data.users.forEach((u, i) => {
    console.log(`  ${i + 1}. ${u.email} | confirmed: ${!!u.email_confirmed_at} | created: ${u.created_at} | meta: ${JSON.stringify(u.user_metadata || {})}`);
  });
} else {
  console.log("Error fetching users:", users.status, JSON.stringify(users.data));
}

// Check profiles table
console.log("\n=== Profiles Table ===");
const profiles = await supabaseAdmin("/rest/v1/profiles?select=id,username,email,roles,created_at&order=created_at.desc&limit=20");
if (profiles.ok) {
  console.log(`Total profiles: ${profiles.data.length}`);
  profiles.data.forEach((p, i) => {
    console.log(`  ${i + 1}. ${p.username} (${p.email}) | roles: ${JSON.stringify(p.roles)} | created: ${p.created_at}`);
  });
} else {
  console.log("Error fetching profiles:", profiles.status, JSON.stringify(profiles.data));
}

// Check if there are auth users without matching profiles
if (users.ok && users.data?.users && profiles.ok) {
  const profileIds = new Set(profiles.data.map(p => p.id));
  const orphanUsers = users.data.users.filter(u => !profileIds.has(u.id));
  if (orphanUsers.length > 0) {
    console.log(`\n=== Orphan Auth Users (no profile) ===`);
    orphanUsers.forEach(u => {
      console.log(`  - ${u.email} (${u.id}) | confirmed: ${!!u.email_confirmed_at}`);
    });
  }
}
