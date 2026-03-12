const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const h = { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` };

// Get orders columns
const ordersRes = await fetch(`${url}/rest/v1/orders?select=*&limit=1`, { headers: h });
const ordersData = await ordersRes.json();
console.log("=== ORDERS TABLE ===");
if (Array.isArray(ordersData) && ordersData.length > 0) {
  console.log("Columns:", Object.keys(ordersData[0]).join(", "));
  console.log("Sample:", JSON.stringify(ordersData[0], null, 2));
} else {
  console.log("Empty or error:", JSON.stringify(ordersData));
  // Try to get column info from an empty response
  const emptyRes = await fetch(`${url}/rest/v1/orders?select=*&limit=0`, { headers: { ...h, Prefer: 'count=exact' } });
  console.log("Headers:", JSON.stringify(Object.fromEntries(emptyRes.headers)));
}

// Get highlights columns
const hlRes = await fetch(`${url}/rest/v1/highlights?select=*&limit=1`, { headers: h });
const hlData = await hlRes.json();
console.log("\n=== HIGHLIGHTS TABLE ===");
if (Array.isArray(hlData) && hlData.length > 0) {
  console.log("Columns:", Object.keys(hlData[0]).join(", "));
} else {
  console.log("Empty or error:", JSON.stringify(hlData));
}

// Check if reviews table exists
const revRes = await fetch(`${url}/rest/v1/reviews?select=*&limit=1`, { headers: h });
console.log("\n=== REVIEWS TABLE ===");
console.log("Status:", revRes.status);
const revData = await revRes.json();
console.log("Data:", JSON.stringify(revData));

// Get announcements columns
const annRes = await fetch(`${url}/rest/v1/announcements?select=*&limit=1`, { headers: h });
const annData = await annRes.json();
console.log("\n=== ANNOUNCEMENTS TABLE ===");
if (Array.isArray(annData) && annData.length > 0) {
  console.log("Columns:", Object.keys(annData[0]).join(", "));
} else {
  console.log("Empty or error:", JSON.stringify(annData));
}

// List all tables
console.log("\n=== ALL TABLES ===");
const tables = ['orders', 'profiles', 'applications', 'announcements', 'highlights', 'portfolio_items', 'reviews', 'coupons', 'tickets', 'notifications', 'audit_logs', 'contact_submissions'];
for (const table of tables) {
  const res = await fetch(`${url}/rest/v1/${table}?select=*&limit=0`, { headers: { ...h, Prefer: 'count=exact' } });
  const count = res.headers.get('content-range');
  console.log(`${table}: ${res.status} ${res.status === 200 ? `(${count})` : 'NOT FOUND'}`);
}
