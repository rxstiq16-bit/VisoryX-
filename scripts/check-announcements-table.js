import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function check() {
  // Check announcements table
  const { data: ann, error: annErr } = await supabase.from("announcements").select("id").limit(1)
  console.log("announcements table:", annErr ? `ERROR: ${annErr.message}` : `OK (${ann?.length || 0} rows)`)

  // Check contact_submissions statuses
  const { data: cs, error: csErr } = await supabase.from("contact_submissions").select("id, status").limit(5)
  console.log("contact_submissions:", csErr ? `ERROR: ${csErr.message}` : JSON.stringify(cs))
}

check()
