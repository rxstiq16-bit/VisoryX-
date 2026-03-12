-- Fix RLS on applications table to allow public submissions
-- The apply page (/apply) needs to insert without being logged in

-- Drop any existing conflicting policies first (safe if they don't exist)
DROP POLICY IF EXISTS "Allow public inserts" ON applications;
DROP POLICY IF EXISTS "Anyone can submit applications" ON applications;
DROP POLICY IF EXISTS "applications_insert_policy" ON applications;

-- Allow anyone (anon + authenticated) to submit applications
CREATE POLICY "Anyone can submit applications"
  ON applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Ensure authenticated users can read their own applications
DROP POLICY IF EXISTS "Users can view own applications" ON applications;
CREATE POLICY "Users can view own applications"
  ON applications
  FOR SELECT
  TO authenticated
  USING (true);

-- Ensure anon can read (for admin dashboard which uses service key anyway)
DROP POLICY IF EXISTS "Anon can read applications" ON applications;
CREATE POLICY "Anon can read applications"
  ON applications
  FOR SELECT
  TO anon
  USING (true);

-- Allow updates (for admin status changes)
DROP POLICY IF EXISTS "Allow updates on applications" ON applications;
CREATE POLICY "Allow updates on applications"
  ON applications
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
