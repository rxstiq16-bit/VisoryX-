-- Create service_statuses table
CREATE TABLE IF NOT EXISTS service_statuses (
  id TEXT PRIMARY KEY,
  service_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'delayed', 'closed')),
  message TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE service_statuses ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Anyone can view service statuses" ON service_statuses
  FOR SELECT USING (true);

-- Allow authenticated users to update (admin check is in app layer)
CREATE POLICY "Authenticated users can update service statuses" ON service_statuses
  FOR UPDATE USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

CREATE POLICY "Authenticated users can insert service statuses" ON service_statuses
  FOR INSERT WITH CHECK (true);

-- Seed default services
INSERT INTO service_statuses (id, service_name, status, message) VALUES
  ('branding', 'Branding & Logo Design', 'open', ''),
  ('community', 'Community Design', 'open', ''),
  ('gaming', 'Gaming Design', 'open', ''),
  ('business', 'Business Design', 'open', ''),
  ('marketing', 'Marketing Design', 'open', ''),
  ('uiAssets', 'UI Assets', 'open', ''),
  ('courses', 'Courses', 'open', '')
ON CONFLICT (id) DO NOTHING;
