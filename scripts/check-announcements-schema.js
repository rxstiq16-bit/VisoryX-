import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Fetch one row to see all columns
const { data, error } = await supabase
  .from("announcements")
  .select("*")
  .limit(1)

console.log("Error:", error)
console.log("Sample row:", JSON.stringify(data, null, 2))

// Also check what the announcement banner currently queries
const { data: d2, error: e2 } = await supabase
  .from("announcements")
  .select("*")

console.log("\nAll rows:", JSON.stringify(d2, null, 2))
console.log("All rows error:", e2)
