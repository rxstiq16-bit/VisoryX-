import { createClient } from "@supabase/supabase-js";
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const { data, error } = await s.from("reports").select("*").limit(1);
console.log("reports columns:", data?.length >= 0 ? "accessible" : "error", error?.message || "");
// Get a sample to see columns
const { data: sample } = await s.from("reports").select("*").limit(0);
console.log("reports shape:", JSON.stringify(sample));
// Try inserting and reading back to see schema
const { data: cols, error: colErr } = await s.rpc("", {});
// Just do a describe-like query
const { data: d2 } = await s.from("reports").insert({ reporter_id: "00000000-0000-0000-0000-000000000000", reported_user_id: "00000000-0000-0000-0000-000000000000", reason: "test", type: "user" }).select();
console.log("insert test:", JSON.stringify(d2));
if (d2?.[0]?.id) {
  await s.from("reports").delete().eq("id", d2[0].id);
  console.log("columns:", Object.keys(d2[0]).join(", "));
}
