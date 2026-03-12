CREATE TABLE IF NOT EXISTS ip_bans (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address text NOT NULL,
  reason text,
  is_permanent boolean DEFAULT false,
  expires_at timestamptz,
  added_by uuid,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ip_bans ENABLE ROW LEVEL SECURITY;
