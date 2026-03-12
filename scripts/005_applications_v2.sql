-- Create applications table for "Join the VisoryX Team" submissions
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  discord TEXT,
  role TEXT NOT NULL,
  portfolio_url TEXT,
  experience TEXT NOT NULL,
  why_visoryx TEXT,
  status TEXT DEFAULT 'pending',
  admin_notes TEXT,
  reviewed_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create design_feedback table for ticket-linked feedback
CREATE TABLE IF NOT EXISTS design_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id TEXT NOT NULL,
  order_id TEXT,
  from_name TEXT NOT NULL,
  from_user_id UUID,
  type TEXT NOT NULL DEFAULT 'note',
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  resolved_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create design_assets table for the asset library
CREATE TABLE IF NOT EXISTS design_assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'template',
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  file_path TEXT,
  file_size TEXT,
  uploaded_by UUID,
  usage_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_assets ENABLE ROW LEVEL SECURITY;

-- Applications: anyone can insert
CREATE POLICY "anon_insert_applications" ON applications FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "auth_insert_applications" ON applications FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_select_applications" ON applications FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_update_applications" ON applications FOR UPDATE TO authenticated USING (true);

-- Design feedback: authenticated users can manage
CREATE POLICY "auth_all_feedback" ON design_feedback FOR ALL TO authenticated USING (true);

-- Design assets: authenticated users can manage, anyone can view
CREATE POLICY "auth_all_assets" ON design_assets FOR ALL TO authenticated USING (true);
CREATE POLICY "anon_select_assets" ON design_assets FOR SELECT TO anon USING (true);
