CREATE TABLE IF NOT EXISTS applications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name text NOT NULL,
  email text NOT NULL,
  discord_username text,
  role text NOT NULL DEFAULT 'designer',
  portfolio_url text,
  experience text,
  why_join text,
  skills text[],
  status text NOT NULL DEFAULT 'pending',
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'anyone_can_insert_applications') THEN
    CREATE POLICY anyone_can_insert_applications ON applications FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'anyone_can_read_applications') THEN
    CREATE POLICY anyone_can_read_applications ON applications FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'anyone_can_update_applications') THEN
    CREATE POLICY anyone_can_update_applications ON applications FOR UPDATE USING (true);
  END IF;
END $$;
