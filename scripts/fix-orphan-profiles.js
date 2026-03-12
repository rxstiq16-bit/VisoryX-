const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function run() {
  // 1. Get all auth users
  const usersRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?per_page=100`, {
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
  });
  const { users } = await usersRes.json();

  // 2. Get all profiles
  const profilesRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=id`, {
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
  });
  const profiles = await profilesRes.json();
  const profileIds = new Set(profiles.map(p => p.id));

  // 3. Find orphans and create profiles for them
  const orphans = users.filter(u => !profileIds.has(u.id));
  console.log(`Found ${orphans.length} orphan(s) without profiles`);

  for (const user of orphans) {
    const meta = user.user_metadata || {};
    const profile = {
      id: user.id,
      username: meta.username || user.email.split('@')[0],
      email: user.email,
      display_name: meta.display_name || meta.username || user.email.split('@')[0],
      roles: ['customer'],
    };

    console.log(`Creating profile for ${user.email}:`, JSON.stringify(profile));

    const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
      method: 'POST',
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(profile),
    });

    const text = await res.text();
    if (res.ok) {
      console.log(`  -> Created successfully`);
    } else {
      console.log(`  -> FAILED (${res.status}): ${text}`);
    }
  }
}

run();
