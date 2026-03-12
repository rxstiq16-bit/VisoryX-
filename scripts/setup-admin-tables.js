const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

// Extract project ref from URL
const projectRef = SUPABASE_URL.replace("https://", "").split(".")[0];
console.log("Project ref:", projectRef);

const sql = `
-- ip_bans
CREATE TABLE IF NOT EXISTS public.ip_bans (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address text NOT NULL,
  reason text,
  is_permanent boolean DEFAULT false,
  expires_at timestamptz,
  added_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.ip_bans ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='ip_bans' AND policyname='auth_ip_bans_select') THEN CREATE POLICY auth_ip_bans_select ON public.ip_bans FOR SELECT TO authenticated USING (true); END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='ip_bans' AND policyname='auth_ip_bans_insert') THEN CREATE POLICY auth_ip_bans_insert ON public.ip_bans FOR INSERT TO authenticated WITH CHECK (true); END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='ip_bans' AND policyname='auth_ip_bans_update') THEN CREATE POLICY auth_ip_bans_update ON public.ip_bans FOR UPDATE TO authenticated USING (true) WITH CHECK (true); END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='ip_bans' AND policyname='auth_ip_bans_delete') THEN CREATE POLICY auth_ip_bans_delete ON public.ip_bans FOR DELETE TO authenticated USING (true); END IF; END $$;

-- promos
CREATE TABLE IF NOT EXISTS public.promos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  discount_type text NOT NULL DEFAULT 'percentage',
  discount_value numeric NOT NULL,
  start_date timestamptz,
  end_date timestamptz,
  is_active boolean DEFAULT true,
  applies_to text DEFAULT 'all',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.promos ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='promos' AND policyname='auth_promos_select') THEN CREATE POLICY auth_promos_select ON public.promos FOR SELECT TO authenticated USING (true); END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='promos' AND policyname='auth_promos_insert') THEN CREATE POLICY auth_promos_insert ON public.promos FOR INSERT TO authenticated WITH CHECK (true); END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='promos' AND policyname='auth_promos_update') THEN CREATE POLICY auth_promos_update ON public.promos FOR UPDATE TO authenticated USING (true) WITH CHECK (true); END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='promos' AND policyname='auth_promos_delete') THEN CREATE POLICY auth_promos_delete ON public.promos FOR DELETE TO authenticated USING (true); END IF; END $$;

-- flagged_content
CREATE TABLE IF NOT EXISTS public.flagged_content (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  content_type text NOT NULL,
  content_id text,
  content_text text NOT NULL,
  author_name text,
  author_email text,
  reason text NOT NULL DEFAULT 'inappropriate',
  status text NOT NULL DEFAULT 'pending',
  reviewed_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  reviewed_at timestamptz
);
ALTER TABLE public.flagged_content ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='flagged_content' AND policyname='auth_flagged_select') THEN CREATE POLICY auth_flagged_select ON public.flagged_content FOR SELECT TO authenticated USING (true); END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='flagged_content' AND policyname='auth_flagged_insert') THEN CREATE POLICY auth_flagged_insert ON public.flagged_content FOR INSERT TO authenticated WITH CHECK (true); END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='flagged_content' AND policyname='auth_flagged_update') THEN CREATE POLICY auth_flagged_update ON public.flagged_content FOR UPDATE TO authenticated USING (true) WITH CHECK (true); END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='flagged_content' AND policyname='auth_flagged_delete') THEN CREATE POLICY auth_flagged_delete ON public.flagged_content FOR DELETE TO authenticated USING (true); END IF; END $$;

-- refunds
CREATE TABLE IF NOT EXISTS public.refunds (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id text NOT NULL,
  reason text NOT NULL,
  amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  processed_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  processed_at timestamptz
);
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='refunds' AND policyname='auth_refunds_select') THEN CREATE POLICY auth_refunds_select ON public.refunds FOR SELECT TO authenticated USING (true); END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='refunds' AND policyname='auth_refunds_insert') THEN CREATE POLICY auth_refunds_insert ON public.refunds FOR INSERT TO authenticated WITH CHECK (true); END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='refunds' AND policyname='auth_refunds_update') THEN CREATE POLICY auth_refunds_update ON public.refunds FOR UPDATE TO authenticated USING (true) WITH CHECK (true); END IF; END $$;

-- staff_schedules
CREATE TABLE IF NOT EXISTS public.staff_schedules (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  day_of_week integer NOT NULL,
  start_time text NOT NULL,
  end_time text NOT NULL,
  status text NOT NULL DEFAULT 'available',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.staff_schedules ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='staff_schedules' AND policyname='auth_schedules_select') THEN CREATE POLICY auth_schedules_select ON public.staff_schedules FOR SELECT TO authenticated USING (true); END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='staff_schedules' AND policyname='auth_schedules_insert') THEN CREATE POLICY auth_schedules_insert ON public.staff_schedules FOR INSERT TO authenticated WITH CHECK (true); END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='staff_schedules' AND policyname='auth_schedules_update') THEN CREATE POLICY auth_schedules_update ON public.staff_schedules FOR UPDATE TO authenticated USING (true) WITH CHECK (true); END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='staff_schedules' AND policyname='auth_schedules_delete') THEN CREATE POLICY auth_schedules_delete ON public.staff_schedules FOR DELETE TO authenticated USING (true); END IF; END $$;

-- handoff_notes
CREATE TABLE IF NOT EXISTS public.handoff_notes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user uuid REFERENCES auth.users(id),
  to_user uuid REFERENCES auth.users(id),
  subject text NOT NULL,
  content text NOT NULL,
  priority text NOT NULL DEFAULT 'normal',
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.handoff_notes ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='handoff_notes' AND policyname='auth_handoff_select') THEN CREATE POLICY auth_handoff_select ON public.handoff_notes FOR SELECT TO authenticated USING (true); END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='handoff_notes' AND policyname='auth_handoff_insert') THEN CREATE POLICY auth_handoff_insert ON public.handoff_notes FOR INSERT TO authenticated WITH CHECK (true); END IF; END $$;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='handoff_notes' AND policyname='auth_handoff_update') THEN CREATE POLICY auth_handoff_update ON public.handoff_notes FOR UPDATE TO authenticated USING (true) WITH CHECK (true); END IF; END $$;
`;

async function runSQL() {
  // Use Supabase's PostgREST SQL endpoint via the service role
  const res = await fetch(
    SUPABASE_URL + "/rest/v1/rpc/exec_sql",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SERVICE_ROLE_KEY,
        Authorization: "Bearer " + SERVICE_ROLE_KEY,
      },
      body: JSON.stringify({ sql }),
    }
  );

  if (res.ok) {
    console.log("Tables created via RPC!");
    return;
  }

  // RPC doesn't exist - try the Supabase Management API
  console.log("RPC not available (expected). Trying pg query via REST...");
  
  // Split into individual statements and execute via PostgREST
  // Since direct SQL won't work via REST, let's just verify which tables exist
  const tables = ["ip_bans", "promos", "flagged_content", "refunds", "staff_schedules", "handoff_notes"];
  
  for (const table of tables) {
    const checkRes = await fetch(
      SUPABASE_URL + "/rest/v1/" + table + "?select=id&limit=1",
      {
        headers: {
          apikey: SERVICE_ROLE_KEY,
          Authorization: "Bearer " + SERVICE_ROLE_KEY,
        },
      }
    );
    
    if (checkRes.ok) {
      console.log("EXISTS:", table);
    } else {
      const err = await checkRes.json();
      console.log("MISSING:", table, "-", err.message || err.code);
    }
  }

  console.log("\nFor any MISSING tables above, please run the SQL from this script");
  console.log("in your Supabase Dashboard > SQL Editor.");
  console.log("SQL file: scripts/create-remaining-tables-manual.sql");
}

runSQL();
