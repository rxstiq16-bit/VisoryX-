import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Try to add columns by upserting a test row then reverting
// Since we can't run raw DDL, we'll use the RPC or just test if columns exist
async function main() {
  // First check if columns already exist by querying
  const { data, error } = await supabase
    .from("profiles")
    .select("show_on_team, team_title, team_bio, team_sort_order")
    .limit(1);

  if (error) {
    console.log("Columns don't exist yet. Error:", error.message);
    console.log("");
    console.log("Please run this SQL in your Supabase SQL Editor:");
    console.log("---");
    console.log("ALTER TABLE profiles ADD COLUMN IF NOT EXISTS show_on_team boolean DEFAULT false;");
    console.log("ALTER TABLE profiles ADD COLUMN IF NOT EXISTS team_title text DEFAULT '';");
    console.log("ALTER TABLE profiles ADD COLUMN IF NOT EXISTS team_bio text DEFAULT '';");
    console.log("ALTER TABLE profiles ADD COLUMN IF NOT EXISTS team_sort_order integer DEFAULT 0;");
    console.log("---");
  } else {
    console.log("Columns already exist! Found", data?.length ?? 0, "rows.");
  }
}

main();
