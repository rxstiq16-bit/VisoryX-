import { createClient } from "@supabase/supabase-js";

const anon = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Check RLS status
const { data: rlsCheck } = await admin.rpc('to_regclass', { relation: 'inbound_emails' }).maybeSingle();

// Check if RLS is enabled on inbound_emails
const { data: policies } = await admin.from("inbound_emails").select("id, status").limit(3);
console.log("Admin can read inbound_emails:", policies?.length, "rows");

const { data: anonRows } = await anon.from("inbound_emails").select("id, status").limit(3);
console.log("Anon can read inbound_emails:", anonRows?.length, "rows");

if (anonRows && anonRows.length > 0) {
  const testRow = anonRows[0];
  console.log("Test row:", testRow.id, "status:", testRow.status);
  
  const { data: updateData, error: updateErr } = await anon
    .from("inbound_emails")
    .update({ status: "read" })
    .eq("id", testRow.id)
    .select();
  
  console.log("Anon UPDATE result:", { data: updateData, error: updateErr });
  
  // Revert
  await admin.from("inbound_emails").update({ status: testRow.status }).eq("id", testRow.id);
  console.log("Reverted");
} else {
  console.log("No inbound_emails rows to test (anon got 0 - likely RLS blocking)");
  
  if (policies && policies.length > 0) {
    console.log("Admin CAN read but anon CANNOT = RLS is blocking anon access to inbound_emails");
  }
}
