import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Test with anon key (what public visitors use)
const { data, error } = await supabase
  .from("announcements")
  .select("id, title, is_active")
  .eq("is_active", true)

console.log("Anon key query result:")
console.log("Data:", JSON.stringify(data))
console.log("Error:", error ? JSON.stringify(error) : "none")
console.log("Count:", data?.length ?? 0)
