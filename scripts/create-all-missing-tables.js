const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function query(sql) {
  const res = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
    },
    body: JSON.stringify({ query: sql }),
  });
  return res;
}

// We'll use the REST API to create tables via raw insert
// Since exec_sql RPC may not exist, we'll test each table and output SQL for manual run

const tables = [
  "reviews", "contact_messages", "staff_earnings", "blacklisted_words",
  "flagged_content", "refunds", "promos", "handoff_notes",
  "staff_schedules", "notifications", "form_invitations", "corporate_form_submissions"
];

async function checkTable(name) {
  const res = await fetch(`${supabaseUrl}/rest/v1/${name}?select=count&limit=0`, {
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
  });
  return res.status !== 404;
}

async function main() {
  console.log("=== Checking all referenced tables ===\n");
  const missing = [];
  for (const t of tables) {
    const exists = await checkTable(t);
    console.log(`${exists ? "EXISTS" : "MISSING"}: ${t}`);
    if (!exists) missing.push(t);
  }

  if (missing.length === 0) {
    console.log("\nAll tables exist!");
    return;
  }

  console.log(`\n=== ${missing.length} MISSING TABLES ===`);
  console.log("Run this SQL in Supabase Dashboard > SQL Editor:\n");
  console.log("---BEGIN SQL---");

  const sqlParts = [];

  if (missing.includes("reviews")) {
    sqlParts.push(`
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT,
  customer_name TEXT,
  rating INTEGER DEFAULT 5,
  review TEXT,
  service TEXT,
  status TEXT DEFAULT 'pending',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews_public_read" ON reviews FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "reviews_auth_insert" ON reviews FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "reviews_service_all" ON reviews FOR ALL TO service_role USING (true);`);
  }

  if (missing.includes("contact_messages")) {
    sqlParts.push(`
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  email TEXT,
  subject TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "contact_messages_anon_insert" ON contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "contact_messages_service_all" ON contact_messages FOR ALL TO service_role USING (true);`);
  }

  if (missing.includes("staff_earnings")) {
    sqlParts.push(`
CREATE TABLE IF NOT EXISTS staff_earnings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  staff_id UUID REFERENCES profiles(id),
  order_id TEXT,
  amount NUMERIC DEFAULT 0,
  description TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE staff_earnings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff_earnings_service_all" ON staff_earnings FOR ALL TO service_role USING (true);
CREATE POLICY "staff_earnings_self_read" ON staff_earnings FOR SELECT TO authenticated USING (staff_id = auth.uid());`);
  }

  if (missing.includes("blacklisted_words")) {
    sqlParts.push(`
CREATE TABLE IF NOT EXISTS blacklisted_words (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  word TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE blacklisted_words ENABLE ROW LEVEL SECURITY;
CREATE POLICY "blacklisted_words_service_all" ON blacklisted_words FOR ALL TO service_role USING (true);`);
  }

  if (missing.includes("flagged_content")) {
    sqlParts.push(`
CREATE TABLE IF NOT EXISTS flagged_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_type TEXT,
  content_id TEXT,
  content_text TEXT,
  reason TEXT,
  status TEXT DEFAULT 'pending',
  reporter_id UUID,
  moderator_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ
);
ALTER TABLE flagged_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "flagged_content_service_all" ON flagged_content FOR ALL TO service_role USING (true);
CREATE POLICY "flagged_content_auth_read" ON flagged_content FOR SELECT TO authenticated USING (true);`);
  }

  if (missing.includes("refunds")) {
    sqlParts.push(`
CREATE TABLE IF NOT EXISTS refunds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT,
  amount NUMERIC,
  reason TEXT,
  status TEXT DEFAULT 'pending',
  requested_by UUID,
  processed_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  processed_at TIMESTAMPTZ
);
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "refunds_service_all" ON refunds FOR ALL TO service_role USING (true);
CREATE POLICY "refunds_auth_read" ON refunds FOR SELECT TO authenticated USING (true);`);
  }

  if (missing.includes("promos")) {
    sqlParts.push(`
CREATE TABLE IF NOT EXISTS promos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  code TEXT UNIQUE,
  discount_percent INTEGER,
  discount_amount NUMERIC,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  active BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  max_uses INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE promos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "promos_public_read" ON promos FOR SELECT TO anon, authenticated USING (active = true);
CREATE POLICY "promos_service_all" ON promos FOR ALL TO service_role USING (true);`);
  }

  if (missing.includes("handoff_notes")) {
    sqlParts.push(`
CREATE TABLE IF NOT EXISTS handoff_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_staff_id UUID,
  to_staff_id UUID,
  order_id TEXT,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE handoff_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "handoff_notes_service_all" ON handoff_notes FOR ALL TO service_role USING (true);
CREATE POLICY "handoff_notes_auth_read" ON handoff_notes FOR SELECT TO authenticated USING (true);`);
  }

  if (missing.includes("staff_schedules")) {
    sqlParts.push(`
CREATE TABLE IF NOT EXISTS staff_schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  staff_id UUID REFERENCES profiles(id),
  day_of_week INTEGER,
  start_time TEXT,
  end_time TEXT,
  status TEXT DEFAULT 'available',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE staff_schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff_schedules_service_all" ON staff_schedules FOR ALL TO service_role USING (true);
CREATE POLICY "staff_schedules_auth_read" ON staff_schedules FOR SELECT TO authenticated USING (true);`);
  }

  if (missing.includes("notifications")) {
    sqlParts.push(`
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  title TEXT,
  message TEXT,
  type TEXT DEFAULT 'info',
  read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications_self_read" ON notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "notifications_self_update" ON notifications FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "notifications_service_all" ON notifications FOR ALL TO service_role USING (true);`);
  }

  if (missing.includes("form_invitations")) {
    sqlParts.push(`
CREATE TABLE IF NOT EXISTS form_invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id UUID,
  email TEXT,
  token TEXT UNIQUE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ
);
ALTER TABLE form_invitations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "form_invitations_service_all" ON form_invitations FOR ALL TO service_role USING (true);
CREATE POLICY "form_invitations_public_read" ON form_invitations FOR SELECT TO anon, authenticated USING (true);`);
  }

  if (missing.includes("corporate_form_submissions")) {
    sqlParts.push(`
CREATE TABLE IF NOT EXISTS corporate_form_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id UUID,
  invitation_id UUID,
  data JSONB DEFAULT '{}',
  submitted_by TEXT,
  status TEXT DEFAULT 'submitted',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE corporate_form_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "corporate_form_submissions_service_all" ON corporate_form_submissions FOR ALL TO service_role USING (true);
CREATE POLICY "corporate_form_submissions_auth_read" ON corporate_form_submissions FOR SELECT TO authenticated USING (true);`);
  }

  console.log(sqlParts.join("\n"));
  console.log("\n---END SQL---");
}

main().catch(console.error);
