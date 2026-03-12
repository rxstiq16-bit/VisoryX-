const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const sql = `
CREATE TABLE IF NOT EXISTS announcements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'info',
  is_active boolean DEFAULT true,
  priority integer DEFAULT 0,
  link text,
  link_text text,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read active announcements" ON announcements;
CREATE POLICY "Public can read active announcements" ON announcements FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Authenticated users can manage announcements" ON announcements;
CREATE POLICY "Authenticated users can manage announcements" ON announcements FOR ALL USING (auth.role() = 'authenticated');

CREATE TABLE IF NOT EXISTS site_config (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read site config" ON site_config;
CREATE POLICY "Public can read site config" ON site_config FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage site config" ON site_config;
CREATE POLICY "Authenticated users can manage site config" ON site_config FOR ALL USING (auth.role() = 'authenticated');

INSERT INTO site_config (key, value) VALUES
  ('hero_title', '"Premium Design & Development"'),
  ('hero_subtitle', '"We craft digital experiences that elevate your brand"'),
  ('footer_text', '"ViroX Design Studio"')
ON CONFLICT (key) DO NOTHING;
`

async function run() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({})
  })

  // The REST API doesn't support raw SQL. Use the pg endpoint instead.
  const pgRes = await fetch(`${SUPABASE_URL}/pg`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql })
  })

  if (!pgRes.ok) {
    // Fallback: try statements one at a time via SQL HTTP API
    console.log('Trying individual statements via Supabase Management API...')
    
    // Try the SQL endpoint
    const sqlRes = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      }
    })
    console.log('REST API status:', sqlRes.status)
    
    // Just try to create via REST inserts - tables may already exist from a previous partial run
    // Test if announcements table exists
    const testAnn = await fetch(`${SUPABASE_URL}/rest/v1/announcements?limit=1`, {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      }
    })
    console.log('Announcements table test:', testAnn.status, testAnn.status === 200 ? 'EXISTS' : 'NOT FOUND')
    
    const testConfig = await fetch(`${SUPABASE_URL}/rest/v1/site_config?limit=1`, {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      }
    })
    console.log('Site config table test:', testConfig.status, testConfig.status === 200 ? 'EXISTS' : 'NOT FOUND')
    
    if (testAnn.status !== 200 || testConfig.status !== 200) {
      console.log('\nTables do not exist yet. The SQL needs to be run manually in the Supabase dashboard SQL editor.')
      console.log('SQL to run:')
      console.log(sql)
    } else {
      console.log('\nBoth tables already exist!')
      
      // Seed site_config if empty
      const configData = await testConfig.json()
      if (configData.length === 0) {
        const seedRes = await fetch(`${SUPABASE_URL}/rest/v1/site_config`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=ignore-duplicates',
          },
          body: JSON.stringify([
            { key: 'hero_title', value: '"Premium Design & Development"' },
            { key: 'hero_subtitle', value: '"We craft digital experiences that elevate your brand"' },
            { key: 'footer_text', value: '"ViroX Design Studio"' },
          ])
        })
        console.log('Seeded site_config:', seedRes.status)
      }
    }
  } else {
    console.log('Migration ran successfully!')
  }
}

run().catch(console.error)
