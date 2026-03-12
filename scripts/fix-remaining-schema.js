const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Check what reviews columns exist
async function checkReviewsCols() {
  const res = await fetch(`${url}/rest/v1/reviews?select=designer_name,response&limit=0`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` }
  });
  return res.status;
}

// Check missing tables
async function checkTable(name) {
  const res = await fetch(`${url}/rest/v1/${name}?select=id&limit=0`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` }
  });
  return res.status;
}

async function main() {
  const sqlStatements = [];

  // 1. Check reviews columns
  const reviewsStatus = await checkReviewsCols();
  if (reviewsStatus !== 200) {
    console.log("NEED FIX: reviews table missing designer_name/response columns");
    sqlStatements.push(`ALTER TABLE reviews ADD COLUMN IF NOT EXISTS designer_name TEXT;`);
    sqlStatements.push(`ALTER TABLE reviews ADD COLUMN IF NOT EXISTS response TEXT;`);
  } else {
    console.log("PASS: reviews columns OK");
  }

  // 2. Check form_submissions
  const formStatus = await checkTable("form_submissions");
  if (formStatus === 404) {
    console.log("NEED FIX: form_submissions table missing");
    sqlStatements.push(`
CREATE TABLE IF NOT EXISTS form_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id TEXT,
  form_type TEXT,
  data JSONB DEFAULT '{}',
  submitted_by UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "form_submissions_service_all" ON form_submissions FOR ALL TO service_role USING (true);
CREATE POLICY "form_submissions_auth_read" ON form_submissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "form_submissions_auth_insert" ON form_submissions FOR INSERT TO authenticated WITH CHECK (true);`);
  } else {
    console.log("PASS: form_submissions exists");
  }

  // 3. Check invitations
  const invStatus = await checkTable("invitations");
  if (invStatus === 404) {
    console.log("NEED FIX: invitations table missing");
    sqlStatements.push(`
CREATE TABLE IF NOT EXISTS invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'customer',
  token TEXT UNIQUE DEFAULT gen_random_uuid()::text,
  invited_by UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'pending',
  expires_at TIMESTAMPTZ DEFAULT (now() + interval '7 days'),
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "invitations_service_all" ON invitations FOR ALL TO service_role USING (true);
CREATE POLICY "invitations_auth_read" ON invitations FOR SELECT TO authenticated USING (true);`);
  } else {
    console.log("PASS: invitations exists");
  }

  if (sqlStatements.length > 0) {
    console.log("\n========================================");
    console.log("RUN THIS SQL IN SUPABASE SQL EDITOR:");
    console.log("========================================\n");
    console.log(sqlStatements.join("\n\n"));
  } else {
    console.log("\nAll tables and columns are correct!");
  }
}

main().catch(console.error);
