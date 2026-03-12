const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function query(sql) {
  const res = await fetch(`${url}/rest/v1/rpc/`, {
    method: 'POST',
    headers: {
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  });
  return res;
}

// Use the pg REST endpoint to run raw SQL via the management API
async function runSQL(sql) {
  // Use Supabase SQL endpoint
  const res = await fetch(`${url}/rest/v1/`, {
    method: 'POST',
    headers: {
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
  });
  return res;
}

// Instead of raw SQL, create tables using the REST API by trying to select
// and then using the management approach
async function checkTable(table) {
  const res = await fetch(`${url}/rest/v1/${table}?select=id&limit=1`, {
    headers: {
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`,
    },
  });
  return res.status !== 404;
}

async function createTableViaInsert(table, testRow) {
  // Just check if it exists
  const exists = await checkTable(table);
  console.log(`Table "${table}": ${exists ? 'EXISTS' : 'MISSING'}`);
  return exists;
}

async function main() {
  console.log("=== CHECKING MISSING TABLES ===\n");
  
  const tables = ['reviews', 'contact_submissions', 'blacklist'];
  const missing = [];
  
  for (const table of tables) {
    const exists = await checkTable(table);
    console.log(`  ${table}: ${exists ? 'EXISTS' : 'MISSING'}`);
    if (!exists) missing.push(table);
  }
  
  if (missing.length === 0) {
    console.log("\nAll tables exist! No action needed.");
    return;
  }
  
  console.log(`\n${missing.length} table(s) need to be created.`);
  console.log("\nPlease run the following SQL in your Supabase Dashboard > SQL Editor:\n");
  
  if (missing.includes('reviews')) {
    console.log(`
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name text NOT NULL,
  designer_name text NOT NULL DEFAULT '',
  review text NOT NULL,
  rating integer NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  service text,
  response text,
  order_id text,
  status text DEFAULT 'published',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews_public_select" ON public.reviews FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "reviews_auth_insert" ON public.reviews FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "reviews_auth_update" ON public.reviews FOR UPDATE TO authenticated USING (true);
CREATE POLICY "reviews_auth_delete" ON public.reviews FOR DELETE TO authenticated USING (true);
`);
  }
  
  if (missing.includes('contact_submissions')) {
    console.log(`
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  inquiry_type text DEFAULT 'general',
  status text DEFAULT 'unread',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "contact_anon_insert" ON public.contact_submissions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "contact_auth_select" ON public.contact_submissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "contact_auth_update" ON public.contact_submissions FOR UPDATE TO authenticated USING (true);
CREATE POLICY "contact_auth_delete" ON public.contact_submissions FOR DELETE TO authenticated USING (true);
`);
  }
  
  if (missing.includes('blacklist')) {
    console.log(`
CREATE TABLE IF NOT EXISTS public.blacklist (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier text NOT NULL,
  type text DEFAULT 'email',
  reason text,
  added_by text DEFAULT 'Admin',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.blacklist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "blacklist_auth_all" ON public.blacklist FOR ALL TO authenticated USING (true) WITH CHECK (true);
`);
  }
  
  // Also seed default reviews
  if (missing.includes('reviews')) {
    console.log(`
-- Seed default reviews
INSERT INTO public.reviews (customer_name, designer_name, review, rating, service, created_at) VALUES
('Daxt3r', 'Jonathan Drake Jr', 'yooo these guys are legit. got my whole server rebranded in like 2 days. liveries look clean asf and the logo goes hard. def coming back for more', 5, 'Server Branding', '2026-01-28'),
('Deputy_Kxng', 'Jonathan Drake Jr', 'finally found someone who actually knows how erlc liveries work lol. my deputies love the new skins. good prices too', 5, 'ERLC Liveries', '2026-01-21'),
('nate_fd', 'Jonathan Drake Jr', 'got our entire fleet done. engines, ladders, ambulances, even the battalion chief truck. they actually made the lightbars look realistic', 5, 'Vehicle Fleet Pack', '2026-01-14'),
('itzCrispy', 'Jonathan Drake Jr', 'bro saved my server fr. needed a full rebrand before our launch and they delivered everything on time. logo, banners, liveries, even custom emotes. W designers', 5, 'Full Rebrand', '2026-01-12'),
('rxbel', 'Jonathan Drake Jr', 'we switched from another design server and the difference is crazy. actually responds to dms and doesnt take 2 weeks for one livery', 5, 'ERLC Liveries', '2025-12-28'),
('trooper.jake', 'Jonathan Drake Jr', 'ordered a full state police pack. chargers, explorers, tahoes, even the slicktop unmarked units. they got the details perfect', 5, 'LEO Vehicle Pack', '2025-12-20'),
('sgt.williams', 'Jonathan Drake Jr', 'nobody ever does DOT liveries right but these guys nailed it. got the arrow boards, the cones on the truck, everything', 5, 'DOT Liveries', '2025-12-15'),
('mxddie', 'Jonathan Drake Jr', 'got custom civ vehicle liveries for our taxi and bus company. didnt even know that was a thing but they made it happen', 5, 'Civilian Liveries', '2025-12-10');
`);
  }
}

main().catch(console.error);
