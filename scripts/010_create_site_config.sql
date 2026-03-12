CREATE TABLE IF NOT EXISTS site_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(section, key)
);

ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY site_config_public_read ON site_config FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY site_config_auth_write ON site_config FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Seed default values
INSERT INTO site_config (section, key, value) VALUES
  ('hero', 'headline_1', 'We design brands'),
  ('hero', 'headline_2', 'that dominate'),
  ('hero', 'description', 'Logos, liveries, branding, and digital graphics engineered for gaming communities, esports organizations, and visionary businesses worldwide.'),
  ('hero', 'cta_text', 'Start a Project'),
  ('hero', 'cta_link', '/order'),
  ('footer', 'tagline', 'Premium design for gaming, esports & business.'),
  ('footer', 'discord', 'https://discord.gg/Zeu8F7a2Rx'),
  ('footer', 'email', 'contact@visoryx.com')
ON CONFLICT (section, key) DO NOTHING;
