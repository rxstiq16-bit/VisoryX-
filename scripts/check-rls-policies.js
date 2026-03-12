import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Check RLS status and policies
const { data: rlsEnabled } = await supabaseAdmin.rpc('exec_sql', {
  sql: `SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('contact_submissions', 'inbound_emails')`
})

console.log("RLS status:", JSON.stringify(rlsEnabled))

// Get policies  
const { data: policies, error: polError } = await supabaseAdmin.from('pg_policies').select('*')

if (polError) {
  // Try raw SQL approach
  const { data, error } = await supabaseAdmin.rpc('exec_sql', {
    sql: `SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check FROM pg_policies WHERE tablename IN ('contact_submissions', 'inbound_emails')`
  })
  if (error) {
    console.log("Cannot query pg_policies via RPC, trying direct query...")
    // Just test the actual update with an authenticated-like client
    const { data: row } = await supabaseAdmin
      .from("contact_submissions")
      .select("id, status")
      .limit(1)
      .single()
    
    if (row) {
      console.log("Test row:", row.id, "status:", row.status)
      
      // Test update with service role (should always work)
      const { error: adminErr, count: adminCount } = await supabaseAdmin
        .from("contact_submissions")
        .update({ status: "reviewed" })
        .eq("id", row.id)
        .select()
      
      console.log("Admin update result:", { error: adminErr, count: adminCount })
      
      // Revert
      await supabaseAdmin
        .from("contact_submissions")
        .update({ status: row.status })
        .eq("id", row.id)
      
      // Now test with anon client  
      const anonClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )
      
      const { data: anonData, error: anonErr } = await anonClient
        .from("contact_submissions")
        .update({ status: "reviewed" })
        .eq("id", row.id)
        .select()
      
      console.log("Anon update result:", { data: anonData, error: anonErr })
      
      // Revert
      await supabaseAdmin
        .from("contact_submissions")
        .update({ status: row.status })
        .eq("id", row.id)
    }
  } else {
    console.log("Policies:", JSON.stringify(data))
  }
} else {
  console.log("Policies:", JSON.stringify(policies))
}
