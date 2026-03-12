import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  // Step 1: Add account_id column
  const { error: e1 } = await supabase.rpc("exec_sql", {
    sql: `
      ALTER TABLE public.profiles 
      ADD COLUMN IF NOT EXISTS account_id TEXT UNIQUE;
    `,
  });
  if (e1) {
    console.log("[v0] Add column error (may already exist):", e1.message);
  } else {
    console.log("[v0] account_id column added");
  }

  // Step 2: Create index
  const { error: e2 } = await supabase.rpc("exec_sql", {
    sql: `
      CREATE INDEX IF NOT EXISTS profiles_account_id_idx ON public.profiles(account_id);
    `,
  });
  if (e2) {
    console.log("[v0] Index error:", e2.message);
  } else {
    console.log("[v0] account_id index created");
  }

  // Step 3: Backfill existing profiles
  const { error: e3 } = await supabase.rpc("exec_sql", {
    sql: `
      UPDATE public.profiles 
      SET account_id = 'VX-' || upper(substr(md5(random()::text || id::text), 1, 6))
      WHERE account_id IS NULL;
    `,
  });
  if (e3) {
    console.log("[v0] Backfill error:", e3.message);
  } else {
    console.log("[v0] Existing profiles backfilled with account IDs");
  }

  // Step 4: Create auto-generate function and trigger
  const { error: e4 } = await supabase.rpc("exec_sql", {
    sql: `
      CREATE OR REPLACE FUNCTION generate_account_id()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.account_id IS NULL THEN
          NEW.account_id := 'VX-' || upper(substr(md5(random()::text || NEW.id::text), 1, 6));
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      DROP TRIGGER IF EXISTS set_account_id ON public.profiles;
      CREATE TRIGGER set_account_id
        BEFORE INSERT ON public.profiles
        FOR EACH ROW
        EXECUTE FUNCTION generate_account_id();
    `,
  });
  if (e4) {
    console.log("[v0] Trigger error:", e4.message);
  } else {
    console.log("[v0] Auto-generate trigger created");
  }

  // Verify
  const { data, error: e5 } = await supabase
    .from("profiles")
    .select("id, account_id, display_name")
    .limit(5);

  if (e5) {
    console.log("[v0] Verify error:", e5.message);
  } else {
    console.log("[v0] Sample profiles with account IDs:", JSON.stringify(data, null, 2));
  }
}

run().catch(console.error);
