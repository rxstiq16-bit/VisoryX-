import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

// Extract project ref from URL
const projectRef = supabaseUrl.replace("https://", "").split(".")[0];
console.log("Project ref:", projectRef);

const sql = `
CREATE TABLE IF NOT EXISTS service_statuses (
  id TEXT PRIMARY KEY,
  service_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  message TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE service_statuses ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'service_statuses' AND policyname = 'Anyone can view service statuses') THEN
    CREATE POLICY "Anyone can view service statuses" ON service_statuses FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'service_statuses' AND policyname = 'Anyone can update service statuses') THEN
    CREATE POLICY "Anyone can update service statuses" ON service_statuses FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'service_statuses' AND policyname = 'Anyone can insert service statuses') THEN
    CREATE POLICY "Anyone can insert service statuses" ON service_statuses FOR INSERT WITH CHECK (true);
  END IF;
END $$;

INSERT INTO service_statuses (id, service_name, status, message) VALUES
  ('branding', 'Branding & Identity', 'open', ''),
  ('community', 'Community Design', 'open', ''),
  ('gaming', 'Gaming Design', 'open', ''),
  ('business', 'Business Design', 'open', ''),
  ('marketing', 'Marketing Design', 'open', ''),
  ('uiAssets', 'UI Assets', 'open', ''),
  ('courses', 'Design Courses', 'open', '')
ON CONFLICT (id) DO NOTHING;
`;

// Try the Supabase Management API
const mgmtUrl = `https://api.supabase.com/v1/projects/${projectRef}/database/query`;
console.log("Trying Management API...");

const mgmtRes = await fetch(mgmtUrl, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${supabaseKey}`,
  },
  body: JSON.stringify({ query: sql }),
});

if (mgmtRes.ok) {
  const result = await mgmtRes.json();
  console.log("Management API success:", JSON.stringify(result).slice(0, 200));
} else {
  const errText = await mgmtRes.text();
  console.log("Management API failed:", mgmtRes.status, errText.slice(0, 200));
  
  // Fallback: try using postgrest-js with raw fetch to create table
  console.log("\nFallback: trying raw SQL via pg_query...");
  
  // Try another approach - use supabase-js to call a raw query
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
  
  // Try inserting - if table exists already this will work
  const { data, error } = await supabase.from("service_statuses").select("id").limit(1);
  
  if (error && error.message.includes("does not exist")) {
    console.log("\nTable does not exist. Please create it in Supabase Dashboard SQL Editor:");
    console.log("Go to: " + supabaseUrl.replace('.supabase.co', '') + " > SQL Editor");
    console.log("\n--- COPY THIS SQL ---\n");
    console.log(sql);
    console.log("\n--- END SQL ---");
  } else if (error) {
    console.log("Unexpected error:", error.message);
  } else {
    console.log("Table already exists with", data?.length, "rows");
    
    // Seed if empty
    if (data.length === 0) {
      const { error: insertErr } = await supabase.from("service_statuses").insert([
        { id: 'branding', service_name: 'Branding & Identity', status: 'open', message: '' },
        { id: 'community', service_name: 'Community Design', status: 'open', message: '' },
        { id: 'gaming', service_name: 'Gaming Design', status: 'open', message: '' },
        { id: 'business', service_name: 'Business Design', status: 'open', message: '' },
        { id: 'marketing', service_name: 'Marketing Design', status: 'open', message: '' },
        { id: 'uiAssets', service_name: 'UI Assets', status: 'open', message: '' },
        { id: 'courses', service_name: 'Design Courses', status: 'open', message: '' },
      ]);
      if (insertErr) console.log("Seed error:", insertErr.message);
      else console.log("Seeded 7 service statuses");
    }
  }
}
