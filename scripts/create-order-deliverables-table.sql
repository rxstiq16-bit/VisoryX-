-- Order deliverables table for file delivery
CREATE TABLE IF NOT EXISTS order_deliverables (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_size bigint DEFAULT 0,
  file_type text,
  uploaded_by text DEFAULT 'admin',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_deliverables_order_id ON order_deliverables(order_id);

ALTER TABLE order_deliverables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role full access on order_deliverables"
  ON order_deliverables FOR ALL USING (true) WITH CHECK (true);
