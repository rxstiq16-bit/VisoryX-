import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  // Create applications table
  const { error: e1 } = await supabase.rpc("exec_sql", {
    sql: `
      CREATE TABLE IF NOT EXISTS applications (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        full_name text NOT NULL,
        email text NOT NULL,
        discord_username text,
        role text NOT NULL DEFAULT 'designer',
        portfolio_url text,
        experience text,
        why_join text,
        skills text[] DEFAULT '{}',
        status text NOT NULL DEFAULT 'pending',
        admin_notes text,
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now()
      );
    `,
  });
  if (e1) {
    console.log("[v0] applications table rpc failed, trying direct insert test:", e1.message);
  } else {
    console.log("[v0] applications table created");
  }

  // Create design_feedback table
  const { error: e2 } = await supabase.rpc("exec_sql", {
    sql: `
      CREATE TABLE IF NOT EXISTS design_feedback (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        order_id text,
        ticket_id text,
        designer_id text,
        client_name text NOT NULL,
        client_email text,
        feedback_type text NOT NULL DEFAULT 'revision',
        message text NOT NULL,
        rating integer,
        status text NOT NULL DEFAULT 'pending',
        created_at timestamptz DEFAULT now()
      );
    `,
  });
  if (e2) {
    console.log("[v0] design_feedback rpc failed:", e2.message);
  } else {
    console.log("[v0] design_feedback table created");
  }

  // Create design_assets table
  const { error: e3 } = await supabase.rpc("exec_sql", {
    sql: `
      CREATE TABLE IF NOT EXISTS design_assets (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        name text NOT NULL,
        category text NOT NULL DEFAULT 'general',
        file_url text,
        file_type text,
        file_size integer,
        uploaded_by text,
        tags text[] DEFAULT '{}',
        description text,
        created_at timestamptz DEFAULT now()
      );
    `,
  });
  if (e3) {
    console.log("[v0] design_assets rpc failed:", e3.message);
  } else {
    console.log("[v0] design_assets table created");
  }

  // Fallback: try direct table operations to verify/create
  // Test if applications table exists by attempting an insert + delete
  const { error: testErr } = await supabase.from("applications").select("id").limit(1);
  if (testErr && testErr.code === "42P01") {
    console.log("[v0] applications table does not exist, RPC not available. Will use app-level table creation.");
  } else if (testErr) {
    console.log("[v0] applications table test error:", testErr.message, testErr.code);
  } else {
    console.log("[v0] applications table exists and is accessible");
  }

  const { error: testErr2 } = await supabase.from("design_feedback").select("id").limit(1);
  if (testErr2 && testErr2.code === "42P01") {
    console.log("[v0] design_feedback table does not exist");
  } else if (testErr2) {
    console.log("[v0] design_feedback test error:", testErr2.message, testErr2.code);
  } else {
    console.log("[v0] design_feedback table exists and is accessible");
  }

  const { error: testErr3 } = await supabase.from("design_assets").select("id").limit(1);
  if (testErr3 && testErr3.code === "42P01") {
    console.log("[v0] design_assets table does not exist");
  } else if (testErr3) {
    console.log("[v0] design_assets test error:", testErr3.message, testErr3.code);
  } else {
    console.log("[v0] design_assets table exists and is accessible");
  }
}

run();
