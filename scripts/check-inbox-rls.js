import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Test with anon key (what the browser client uses)
const anonClient = createClient(url, anonKey)
const adminClient = createClient(url, serviceKey)

// Check RLS on inbound_emails
console.log("=== Testing inbound_emails ===")
const { data: ie, error: ieErr } = await anonClient.from("inbound_emails").select("id, status").limit(3)
console.log("Anon SELECT inbound_emails:", ie?.length ?? 0, "rows", ieErr ? `ERROR: ${ieErr.message}` : "OK")

if (ie && ie.length > 0) {
  const testId = ie[0].id
  const currentStatus = ie[0].status
  const newStatus = currentStatus === "read" ? "unread" : "read"
  console.log(`Attempting UPDATE id=${testId} status=${currentStatus} -> ${newStatus}`)
  const { data: upd, error: updErr, count } = await anonClient
    .from("inbound_emails")
    .update({ status: newStatus })
    .eq("id", testId)
    .select()
  console.log("Anon UPDATE result:", upd?.length ?? 0, "rows updated", updErr ? `ERROR: ${updErr.message}` : "OK")
  
  // Revert with admin
  if (upd && upd.length > 0) {
    await adminClient.from("inbound_emails").update({ status: currentStatus }).eq("id", testId)
    console.log("Reverted with admin client")
  }
} else {
  console.log("No inbound_emails rows to test")
}

// Check RLS on contact_submissions
console.log("\n=== Testing contact_submissions ===")
const { data: cs, error: csErr } = await anonClient.from("contact_submissions").select("id, status").limit(3)
console.log("Anon SELECT contact_submissions:", cs?.length ?? 0, "rows", csErr ? `ERROR: ${csErr.message}` : "OK")

if (cs && cs.length > 0) {
  const testId = cs[0].id
  const currentStatus = cs[0].status
  const newStatus = "reviewed"
  console.log(`Attempting UPDATE id=${testId} status=${currentStatus} -> ${newStatus}`)
  const { data: upd, error: updErr } = await anonClient
    .from("contact_submissions")
    .update({ status: newStatus })
    .eq("id", testId)
    .select()
  console.log("Anon UPDATE result:", upd?.length ?? 0, "rows updated", updErr ? `ERROR: ${updErr.message}` : "OK")
  
  // Revert with admin
  if (upd && upd.length > 0) {
    await adminClient.from("contact_submissions").update({ status: currentStatus }).eq("id", testId)
    console.log("Reverted with admin client")
  }
} else {
  console.log("No contact_submissions rows to test")
}

// Check if RLS is enabled
console.log("\n=== Checking RLS status ===")
const { data: rls } = await adminClient.rpc('to_regclass', { relname: 'inbound_emails' }).maybeSingle()
const { data: policies } = await adminClient.from('pg_policies').select('*')
console.log("Note: If anon updates fail, RLS is blocking. Use service role key for admin operations.")
