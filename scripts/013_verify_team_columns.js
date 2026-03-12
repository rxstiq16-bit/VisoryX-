const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function verify() {
  // Try selecting the new columns
  const res = await fetch(
    `${url}/rest/v1/profiles?select=id,username,display_name,roles,show_on_team,team_title,team_bio,team_sort_order&limit=5`,
    { headers: { apikey: key, Authorization: `Bearer ${key}` } }
  );
  
  if (!res.ok) {
    const err = await res.text();
    console.log("ERROR: Columns may not exist yet:", err);
    return;
  }
  
  const data = await res.json();
  console.log("SUCCESS: Team columns exist on profiles table.");
  console.log(`Found ${data.length} profile(s):`);
  for (const p of data) {
    console.log(`  - ${p.display_name || p.username} | show_on_team: ${p.show_on_team} | title: ${p.team_title || '(not set)'} | bio: ${p.team_bio || '(not set)'} | sort: ${p.team_sort_order}`);
  }
}

verify().catch(e => console.error("Script error:", e.message));
