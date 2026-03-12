import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.log('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Create table via SQL
const { error: createError } = await supabase.rpc('exec_sql', {
  sql: `
    CREATE TABLE IF NOT EXISTS public.trusted_partners (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      name text NOT NULL,
      type text NOT NULL DEFAULT 'community',
      initials text NOT NULL DEFAULT '',
      logo_url text,
      display_order integer NOT NULL DEFAULT 0,
      is_active boolean NOT NULL DEFAULT true,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
    
    ALTER TABLE public.trusted_partners ENABLE ROW LEVEL SECURITY;
    
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'trusted_partners' AND policyname = 'trusted_partners_public_select') THEN
        CREATE POLICY trusted_partners_public_select ON public.trusted_partners FOR SELECT TO anon, authenticated USING (is_active = true);
      END IF;
    END $$;
    
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'trusted_partners' AND policyname = 'trusted_partners_auth_all') THEN
        CREATE POLICY trusted_partners_auth_all ON public.trusted_partners FOR ALL TO authenticated USING (true) WITH CHECK (true);
      END IF;
    END $$;
  `
})

if (createError) {
  console.log('RPC exec_sql not available, trying direct table access...')
  
  // Try inserting seed data directly - table might already exist from SQL runner
  const { data: existing } = await supabase.from('trusted_partners').select('id').limit(1)
  
  if (existing !== null) {
    console.log('Table trusted_partners already exists')
  } else {
    console.log('Table does not exist yet. Please create it via Supabase dashboard SQL editor:')
    console.log(`
CREATE TABLE IF NOT EXISTS public.trusted_partners (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  type text NOT NULL DEFAULT 'community',
  initials text NOT NULL DEFAULT '',
  logo_url text,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.trusted_partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY trusted_partners_public_select ON public.trusted_partners FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY trusted_partners_auth_all ON public.trusted_partners FOR ALL TO authenticated USING (true) WITH CHECK (true);
    `)
  }
}

// Seed default data
const defaultPartners = [
  { name: 'SFRP', type: 'gaming', initials: 'SF', display_order: 1 },
  { name: 'NovaCraft', type: 'gaming', initials: 'NC', display_order: 2 },
  { name: 'Eclipse RP', type: 'gaming', initials: 'ER', display_order: 3 },
  { name: 'Horizon Studios', type: 'business', initials: 'HS', display_order: 4 },
  { name: 'Pixel Perfect', type: 'creative', initials: 'PP', display_order: 5 },
  { name: 'GameVault', type: 'gaming', initials: 'GV', display_order: 6 },
  { name: 'StreamForge', type: 'content', initials: 'SF', display_order: 7 },
  { name: 'CodeCraft', type: 'business', initials: 'CC', display_order: 8 },
  { name: 'Digital Dreams', type: 'creative', initials: 'DD', display_order: 9 },
  { name: 'RapidHost', type: 'business', initials: 'RH', display_order: 10 },
]

const { data: existingPartners } = await supabase.from('trusted_partners').select('id').limit(1)

if (existingPartners && existingPartners.length === 0) {
  const { error: seedError } = await supabase.from('trusted_partners').insert(defaultPartners)
  if (seedError) {
    console.log('Seed error:', seedError.message)
  } else {
    console.log('Seeded', defaultPartners.length, 'default partners')
  }
} else if (existingPartners && existingPartners.length > 0) {
  console.log('Partners already seeded, skipping')
} else {
  console.log('Could not access trusted_partners table')
}

console.log('Done!')
