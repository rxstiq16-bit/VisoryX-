-- Portfolio items table (public read, admin write)
CREATE TABLE IF NOT EXISTS portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  designer TEXT NOT NULL,
  made_for TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat messages table (public read/write)
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_role TEXT NOT NULL DEFAULT 'customer',
  content TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  edited_at TIMESTAMPTZ
);

-- Tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  customer_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  order_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  assigned_designers TEXT[] DEFAULT '{}',
  order_details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ticket messages table
CREATE TABLE IF NOT EXISTS ticket_messages (
  id TEXT PRIMARY KEY,
  ticket_id TEXT NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  sender_id TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  sender_role TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  is_system_message BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  edited_at TIMESTAMPTZ
);

-- Highlights table
CREATE TABLE IF NOT EXISTS highlights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  author_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  location TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  company TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT NOT NULL,
  project_type TEXT,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS but allow public read access
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Public read policies (anyone can read)
CREATE POLICY "Public read portfolio" ON portfolio_items FOR SELECT USING (true);
CREATE POLICY "Public read chat" ON chat_messages FOR SELECT USING (true);
CREATE POLICY "Public read highlights" ON highlights FOR SELECT USING (true);
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (true);

-- Public insert policies for chat (anyone can post)
CREATE POLICY "Public insert chat" ON chat_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update chat" ON chat_messages FOR UPDATE USING (true);
CREATE POLICY "Public delete chat" ON chat_messages FOR DELETE USING (true);

-- Ticket policies (public access for now - can be restricted later)
CREATE POLICY "Public read tickets" ON tickets FOR SELECT USING (true);
CREATE POLICY "Public insert tickets" ON tickets FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update tickets" ON tickets FOR UPDATE USING (true);

CREATE POLICY "Public read ticket_messages" ON ticket_messages FOR SELECT USING (true);
CREATE POLICY "Public insert ticket_messages" ON ticket_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update ticket_messages" ON ticket_messages FOR UPDATE USING (true);

-- Admin policies for portfolio, highlights, reviews (using service role for admin operations)
CREATE POLICY "Public insert portfolio" ON portfolio_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update portfolio" ON portfolio_items FOR UPDATE USING (true);
CREATE POLICY "Public delete portfolio" ON portfolio_items FOR DELETE USING (true);

CREATE POLICY "Public insert highlights" ON highlights FOR INSERT WITH CHECK (true);
CREATE POLICY "Public delete highlights" ON highlights FOR DELETE USING (true);

CREATE POLICY "Public insert reviews" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update reviews" ON reviews FOR UPDATE USING (true);
CREATE POLICY "Public delete reviews" ON reviews FOR DELETE USING (true);

-- Insert welcome chat message
INSERT INTO chat_messages (user_id, user_name, user_role, content)
VALUES ('1', 'Jonathan Drake Jr', 'executive', 'Welcome to the VisoryX community chat! Feel free to introduce yourself and connect with other members.')
ON CONFLICT DO NOTHING;
