import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// The original 001_create_tables.sql had a reviews table but it was never created.
// The app's reviews-store.ts uses localStorage with these fields:
//   id, customerName, designerName, review, rating, service, response, createdAt
// We'll create the table to match that interface.

async function run() {
  // First try to query the table - if it works, it already exists
  const { error: checkError } = await supabase.from("reviews").select("id").limit(1);

  if (!checkError) {
    console.log("reviews table already exists, skipping creation.");
    return;
  }

  console.log("reviews table does not exist. Creating via SQL...");

  // Try using the exec_sql RPC if available
  const sql = `
    CREATE TABLE IF NOT EXISTS reviews (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      customer_name TEXT NOT NULL,
      designer_name TEXT NOT NULL,
      review TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      service TEXT,
      response TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (true);
    CREATE POLICY "Public insert reviews" ON reviews FOR INSERT WITH CHECK (true);
    CREATE POLICY "Public update reviews" ON reviews FOR UPDATE USING (true);
    CREATE POLICY "Public delete reviews" ON reviews FOR DELETE USING (true);
  `;

  const { error: rpcError } = await supabase.rpc("exec_sql", { sql });

  if (rpcError) {
    console.log("exec_sql RPC not available. Please run this SQL in your Supabase Dashboard SQL Editor:");
    console.log("---");
    console.log(sql);
    console.log("---");
    console.log("Go to: Supabase Dashboard > SQL Editor > New Query > Paste the SQL above > Run");
  } else {
    console.log("reviews table created successfully!");
  }
}

run().catch(console.error);
