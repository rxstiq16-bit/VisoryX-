import { createClient } from "@supabase/supabase-js";
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Insert a test report and immediately delete it to verify all columns exist
async function main() {
  const testId = "00000000-0000-0000-0000-000000000000";
  
  // Try insert with all columns the report dialog uses
  const { data, error } = await s.from("reports").insert({
    reporter_id: testId,
    reporter_name: "test",
    reported_user_id: testId,
    reported_user_name: "test",
    reason: "test",
    details: "test",
    message_id: "test",
    message_content: "test",
    type: "message",
    status: "pending",
  }).select();

  if (error) {
    console.log("INSERT ERROR:", error.message);
    console.log("Details:", error.details);
    console.log("Hint:", error.hint);
    
    // Check what columns actually exist
    const { data: sample, error: selectErr } = await s.from("reports").select("*").limit(0);
    if (selectErr) console.log("SELECT ERROR:", selectErr.message);
    else console.log("Table accessible, columns available via empty select");
  } else {
    console.log("INSERT OK - columns:", Object.keys(data[0]).join(", "));
    // Clean up test row
    await s.from("reports").delete().eq("reporter_name", "test").eq("details", "test");
    console.log("Test row cleaned up");
  }
}
main();
