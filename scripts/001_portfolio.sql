-- Portfolio items table
CREATE TABLE IF NOT EXISTS portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  designer TEXT NOT NULL,
  made_for TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read portfolio" ON portfolio_items;
DROP POLICY IF EXISTS "Public insert portfolio" ON portfolio_items;
DROP POLICY IF EXISTS "Public update portfolio" ON portfolio_items;
DROP POLICY IF EXISTS "Public delete portfolio" ON portfolio_items;

CREATE POLICY "Public read portfolio" ON portfolio_items FOR SELECT USING (true);
CREATE POLICY "Public insert portfolio" ON portfolio_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update portfolio" ON portfolio_items FOR UPDATE USING (true);
CREATE POLICY "Public delete portfolio" ON portfolio_items FOR DELETE USING (true);
