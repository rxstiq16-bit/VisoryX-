-- Ensure contact_submissions table exists
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  inquiry_type TEXT DEFAULT 'general',
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies (safe idempotent approach)
DROP POLICY IF EXISTS "Allow public inserts" ON contact_submissions;
CREATE POLICY "Allow public inserts" ON contact_submissions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated reads" ON contact_submissions;
CREATE POLICY "Allow authenticated reads" ON contact_submissions FOR SELECT USING (auth.role() = 'authenticated');
