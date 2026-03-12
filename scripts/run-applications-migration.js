import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  console.log("[v0] Testing if applications table exists...");

  // Test applications table
  const { data: appData, error: appErr } = await supabase
    .from("applications")
    .select("id")
    .limit(1);

  if (appErr && appErr.code === "42P01") {
    console.log("[v0] applications table does NOT exist. Creating via SQL...");

    // Try using the Supabase SQL endpoint (management API)
    const projectRef = process.env.SUPABASE_URL?.replace("https://", "").replace(".supabase.co", "");

    const sqlStatements = [
      `CREATE TABLE IF NOT EXISTS applications (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        discord TEXT,
        role TEXT NOT NULL,
        portfolio_url TEXT,
        experience TEXT NOT NULL,
        why_visoryx TEXT,
        status TEXT DEFAULT 'pending',
        admin_notes TEXT,
        reviewed_by UUID,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      )`,
      `ALTER TABLE applications ENABLE ROW LEVEL SECURITY`,
      `CREATE POLICY IF NOT EXISTS "anon_insert_applications" ON applications FOR INSERT TO anon WITH CHECK (true)`,
      `CREATE POLICY IF NOT EXISTS "auth_insert_applications" ON applications FOR INSERT TO authenticated WITH CHECK (true)`,
      `CREATE POLICY IF NOT EXISTS "auth_select_applications" ON applications FOR SELECT TO authenticated USING (true)`,
      `CREATE POLICY IF NOT EXISTS "auth_update_applications" ON applications FOR UPDATE TO authenticated USING (true)`,
    ];

    // Try the Supabase HTTP SQL endpoint
    for (const sql of sqlStatements) {
      try {
        const resp = await fetch(
          `${process.env.SUPABASE_URL}/rest/v1/rpc/exec_sql`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
              Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            },
            body: JSON.stringify({ sql }),
          }
        );
        if (!resp.ok) {
          const text = await resp.text();
          console.log(`[v0] SQL exec failed (expected if exec_sql not available): ${text.slice(0, 100)}`);
        }
      } catch (err) {
        console.log(`[v0] SQL exec error: ${err.message}`);
      }
    }

    // Verify after attempt
    const { error: verifyErr } = await supabase.from("applications").select("id").limit(1);
    if (verifyErr) {
      console.log("[v0] IMPORTANT: applications table still doesn't exist.");
      console.log("[v0] Please run this SQL in the Supabase Dashboard SQL Editor:");
      console.log("---");
      console.log(`CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  discord TEXT,
  role TEXT NOT NULL,
  portfolio_url TEXT,
  experience TEXT NOT NULL,
  why_visoryx TEXT,
  status TEXT DEFAULT 'pending',
  admin_notes TEXT,
  reviewed_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_insert_applications" ON applications FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "auth_insert_applications" ON applications FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_select_applications" ON applications FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_update_applications" ON applications FOR UPDATE TO authenticated USING (true);`);
      console.log("---");
    } else {
      console.log("[v0] applications table created successfully!");
    }
  } else if (appErr) {
    console.log("[v0] applications table error:", appErr.message, appErr.code);
  } else {
    console.log("[v0] applications table already exists! Rows:", appData?.length ?? 0);
  }

  // Test design_feedback table
  const { error: fbErr } = await supabase.from("design_feedback").select("id").limit(1);
  if (fbErr && fbErr.code === "42P01") {
    console.log("[v0] design_feedback table does NOT exist. Include in SQL Editor run.");
  } else if (fbErr) {
    console.log("[v0] design_feedback error:", fbErr.message);
  } else {
    console.log("[v0] design_feedback table exists!");
  }

  // Test design_assets table
  const { error: assetErr } = await supabase.from("design_assets").select("id").limit(1);
  if (assetErr && assetErr.code === "42P01") {
    console.log("[v0] design_assets table does NOT exist. Include in SQL Editor run.");
  } else if (assetErr) {
    console.log("[v0] design_assets error:", assetErr.message);
  } else {
    console.log("[v0] design_assets table exists!");
  }

  console.log("[v0] Migration check complete.");
}

run();
