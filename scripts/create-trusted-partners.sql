-- Create trusted_partners table for managing partner logos in the marquee
CREATE TABLE IF NOT EXISTS trusted_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'community',
  initials TEXT NOT NULL DEFAULT '',
  logo_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE trusted_partners ENABLE ROW LEVEL SECURITY;

-- Drop policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Public can view active partners" ON trusted_partners;
DROP POLICY IF EXISTS "Admins can manage partners" ON trusted_partners;

-- Public read access for active partners
CREATE POLICY "Public can view active partners"
  ON trusted_partners FOR SELECT
  USING (is_active = true);

-- Authenticated users (admins) can do everything
CREATE POLICY "Admins can manage partners"
  ON trusted_partners FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Seed with current hardcoded partners
INSERT INTO trusted_partners (name, type, initials, display_order, is_active)
SELECT * FROM (VALUES
  ('SFRP', 'gaming', 'SF', 1, true),
  ('FSR', 'gaming', 'FS', 2, true),
  ('NJSRP', 'gaming', 'NJ', 3, true),
  ('MSRP', 'gaming', 'MS', 4, true),
  ('ERLC Studios', 'gaming', 'ES', 5, true),
  ('NovaTech', 'business', 'NT', 6, true),
  ('Pixel Perfect', 'creative', 'PP', 7, true),
  ('GameForge', 'gaming', 'GF', 8, true),
  ('CloudNine', 'business', 'C9', 9, true),
  ('StreamLine', 'creative', 'SL', 10, true)
) AS v(name, type, initials, display_order, is_active)
WHERE NOT EXISTS (SELECT 1 FROM trusted_partners LIMIT 1);
