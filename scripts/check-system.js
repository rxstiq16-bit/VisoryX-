const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function query(table, params = "", useAnon = false) {
  const key = useAnon ? ANON_KEY : SERVICE_KEY
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
  })
  if (!res.ok) {
    const text = await res.text()
    return { error: text, data: null }
  }
  return { data: await res.json(), error: null }
}

// 1. Check announcements
console.log("=== ANNOUNCEMENTS ===")
const { data: ann, error: annErr } = await query("announcements", "select=*&order=created_at.desc&limit=5")
if (annErr) {
  console.log("Error:", annErr)
} else {
  console.log(`Found ${ann.length} announcements:`)
  ann.forEach(a => console.log(`  [${a.status || a.is_active}] "${a.title}": ${a.message || a.content}`))
}

// 2. Check anon can read active announcements
console.log("\n=== ANNOUNCEMENTS RLS (anon read) ===")
const { data: anonAnn, error: anonErr } = await query("announcements", "select=*&limit=5", true)
if (anonErr) {
  console.log("Anon read FAILED:", anonErr)
  console.log("=> Need SELECT RLS policy for announcements table")
} else {
  console.log(`Anon can read ${anonAnn.length} announcements`)
  anonAnn.forEach(a => console.log(`  [${a.status || a.is_active}] "${a.title}"`))
}

// 3. Check profiles
console.log("\n=== PROFILES ===")
const { data: profiles, error: profErr } = await query("profiles", "select=id,username,email,roles&limit=10")
if (profErr) {
  console.log("Error:", profErr)
} else {
  console.log(`Found ${profiles.length} profiles:`)
  profiles.forEach(p => console.log(`  ${p.username} (${p.email}) - roles: ${JSON.stringify(p.roles)}`))
}

// 4. Check orders
console.log("\n=== ORDERS ===")
const { data: orders, error: ordErr } = await query("orders", "select=*&order=created_at.desc&limit=5")
if (ordErr) {
  console.log("Error:", ordErr)
} else {
  console.log(`Found ${orders.length} orders`)
  orders.forEach(o => console.log(`  [${o.status}] ${o.service_name || o.product_id} - ${o.email || o.customer_email}`))
}

// 5. Check highlights table
console.log("\n=== HIGHLIGHTS ===")
const { data: hl, error: hlErr } = await query("highlights", "select=*&order=created_at.desc&limit=5")
if (hlErr) {
  console.log("Error:", hlErr)
} else {
  console.log(`Found ${hl.length} highlights:`)
  hl.forEach(h => console.log(`  [${h.status || h.is_active}] "${h.title}": ${h.content || h.description || ''}`))
}

// 6. Check Stripe env
console.log("\n=== ENV CHECK ===")
console.log("SUPABASE_URL:", SUPABASE_URL ? "SET" : "MISSING")
console.log("SUPABASE_SERVICE_ROLE_KEY:", SERVICE_KEY ? "SET" : "MISSING")
console.log("SUPABASE_ANON_KEY:", ANON_KEY ? "SET" : "MISSING")
console.log("STRIPE_SECRET_KEY:", process.env.STRIPE_SECRET_KEY ? "SET" : "MISSING")
console.log("STRIPE_WEBHOOK_SECRET:", process.env.STRIPE_WEBHOOK_SECRET ? "SET" : "MISSING")
console.log("RESEND_API_KEY:", process.env.RESEND_API_KEY ? "SET" : "MISSING")
