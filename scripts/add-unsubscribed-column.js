import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  // Check if the column already exists by trying to query it
  const { data, error } = await supabase
    .from("profiles")
    .select("unsubscribed")
    .limit(1);

  if (error && error.message.includes("unsubscribed")) {
    console.log("Column 'unsubscribed' does not exist yet.");
    console.log("");
    console.log("Please run this SQL in your Supabase SQL Editor:");
    console.log("---");
    console.log("ALTER TABLE profiles ADD COLUMN IF NOT EXISTS unsubscribed boolean DEFAULT false;");
    console.log("---");
  } else if (error) {
    console.log("Error checking column:", error.message);
  } else {
    console.log("Column 'unsubscribed' already exists on profiles table. No action needed.");
  }
}

main();
