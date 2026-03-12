import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Insert a minimal row to see what columns are accepted
const { data, error } = await supabase.from("reports").select("*").limit(0);
console.log("Select error:", error?.message || "none");

// Try inserting with just the required fields to discover schema
const tests = [
  { col: "reporter_id", val: "00000000-0000-0000-0000-000000000000" },
  { col: "reported_user_id", val: "00000000-0000-0000-0000-000000000000" },
  { col: "reported_user_name", val: "test" },
  { col: "reason", val: "test" },
  { col: "category", val: "test" },
  { col: "details", val: "test" },
  { col: "message_id", val: "test" },
  { col: "message_content", val: "test" },
  { col: "status", val: "pending" },
  { col: "type", val: "user" },
  { col: "content", val: "test" },
  { col: "description", val: "test" },
  { col: "user_id", val: "00000000-0000-0000-0000-000000000000" },
  { col: "target_id", val: "00000000-0000-0000-0000-000000000000" },
  { col: "target_type", val: "user" },
];

for (const t of tests) {
  const { error } = await supabase.from("reports").insert({ [t.col]: t.val }).select();
  const exists = !error?.message?.includes("Could not find");
  if (exists) {
    // Clean up
    console.log(`  ${t.col}: EXISTS`);
  } else {
    console.log(`  ${t.col}: MISSING`);
  }
}

// Also try to get actual data
const { data: rows } = await supabase.from("reports").select("*").limit(1);
if (rows && rows.length > 0) {
  console.log("\nActual columns from row:", Object.keys(rows[0]).join(", "));
} else {
  console.log("\nNo rows to inspect columns from");
}
