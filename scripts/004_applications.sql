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
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
  admin_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create design_feedback table for ticket-linked feedback
CREATE TABLE IF NOT EXISTS design_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id TEXT NOT NULL,
  order_id TEXT,
  from_name TEXT NOT NULL,
  from_user_id UUID REFERENCES auth.users(id),
  type TEXT NOT NULL CHECK (type IN ('revision', 'approval', 'question', 'note')),
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'acknowledged')),
  resolved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create design_assets table for the asset library
CREATE TABLE IF NOT EXISTS design_assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('template', 'texture', 'font', 'color-palette', 'icon-set', 'mockup')),
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  file_path TEXT,
  file_size TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  usage_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_assets ENABLE ROW LEVEL SECURITY;

-- Applications: anyone can insert, only authenticated users can view
CREATE POLICY "Anyone can submit applications" ON applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can view applications" ON applications FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update applications" ON applications FOR UPDATE USING (auth.role() = 'authenticated');

-- Design feedback: authenticated users can CRUD
CREATE POLICY "Authenticated users can manage feedback" ON design_feedback FOR ALL USING (auth.role() = 'authenticated');

-- Design assets: authenticated users can CRUD
CREATE POLICY "Authenticated users can manage assets" ON design_assets FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Anyone can view assets" ON design_assets FOR SELECT USING (true);
