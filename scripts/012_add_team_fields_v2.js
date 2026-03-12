const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.log("Missing env vars. Please run this SQL in your Supabase Dashboard SQL Editor:")
  console.log(`
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS show_on_team boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS team_title text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS team_bio text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS team_sort_order integer DEFAULT 0;
  `)
  process.exit(0)
}

async function run() {
  // Try inserting a test row to check if columns exist
  const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=show_on_team&limit=1`, {
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
    },
  })

  if (res.ok) {
    const data = await res.json()
    if (data.length >= 0) {
      console.log("show_on_team column already exists. Migration not needed.")
      return
    }
  }

  // Column doesn't exist -- print the SQL for manual execution
  console.log("The team display columns need to be added to the profiles table.")
  console.log("Please run this SQL in your Supabase Dashboard SQL Editor:")
  console.log(`
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS show_on_team boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS team_title text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS team_bio text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS team_sort_order integer DEFAULT 0;
  `)
}

run().catch(e => console.error("Error:", e.message))
