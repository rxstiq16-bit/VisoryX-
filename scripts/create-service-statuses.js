import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  // Create table via RPC/SQL
  const { error: sqlError } = await supabase.rpc("exec_sql", {
    query: `
      CREATE TABLE IF NOT EXISTS service_statuses (
        id TEXT PRIMARY KEY,
        service_name TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'open',
        message TEXT DEFAULT '',
        updated_at TIMESTAMPTZ DEFAULT now()
      );
      ALTER TABLE service_statuses ENABLE ROW LEVEL SECURITY;
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'service_statuses' AND policyname = 'Anyone can view service statuses') THEN
          CREATE POLICY "Anyone can view service statuses" ON service_statuses FOR SELECT USING (true);
        END IF;
      END $$;
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'service_statuses' AND policyname = 'Anyone can update service statuses') THEN
          CREATE POLICY "Anyone can update service statuses" ON service_statuses FOR UPDATE USING (true);
        END IF;
      END $$;
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'service_statuses' AND policyname = 'Anyone can insert service statuses') THEN
          CREATE POLICY "Anyone can insert service statuses" ON service_statuses FOR INSERT WITH CHECK (true);
        END IF;
      END $$;
    `,
  });

  if (sqlError) {
    // If RPC doesn't exist, try direct insert (table might already exist)
    console.log("RPC exec_sql not available, trying direct operations:", sqlError.message);
  } else {
    console.log("Table created via SQL");
  }

  // Try inserting seed data - if table exists this will work
  const services = [
    { id: "branding", service_name: "Branding & Logo Design", status: "open", message: "" },
    { id: "community", service_name: "Community Design", status: "open", message: "" },
    { id: "gaming", service_name: "Gaming Design", status: "open", message: "" },
    { id: "business", service_name: "Business Design", status: "open", message: "" },
    { id: "marketing", service_name: "Marketing Design", status: "open", message: "" },
    { id: "uiAssets", service_name: "UI Assets", status: "open", message: "" },
    { id: "courses", service_name: "Courses", status: "open", message: "" },
  ];

  const { data, error: insertError } = await supabase
    .from("service_statuses")
    .upsert(services, { onConflict: "id" })
    .select();

  if (insertError) {
    console.log("Insert error:", insertError.message);
    console.log("Table likely does not exist. Please create it manually in Supabase dashboard.");
    console.log("SQL to run:");
    console.log(`
CREATE TABLE service_statuses (
  id TEXT PRIMARY KEY,
  service_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  message TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE service_statuses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view service statuses" ON service_statuses FOR SELECT USING (true);
CREATE POLICY "Anyone can update service statuses" ON service_statuses FOR UPDATE USING (true);
CREATE POLICY "Anyone can insert service statuses" ON service_statuses FOR INSERT WITH CHECK (true);
    `);
  } else {
    console.log("Seeded", data?.length, "service statuses");
  }
}

run().catch(console.error);
