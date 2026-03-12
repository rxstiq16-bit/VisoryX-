-- Create all admin feature tables for VisoryX

-- 1. Blacklist table
CREATE TABLE IF NOT EXISTS blacklist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('email', 'discord', 'roblox')),
  reason TEXT NOT NULL DEFAULT '',
  added_by TEXT NOT NULL DEFAULT 'Admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('percent', 'fixed')),
  value NUMERIC NOT NULL,
  max_uses INT NOT NULL DEFAULT 0,
  used_count INT NOT NULL DEFAULT 0,
  min_order_cents INT NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. IP Bans table
CREATE TABLE IF NOT EXISTS ip_bans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip TEXT NOT NULL,
  reason TEXT NOT NULL DEFAULT '',
  banned_by TEXT NOT NULL DEFAULT 'Admin',
  type TEXT NOT NULL CHECK (type IN ('permanent', 'temporary')),
  expires_at TIMESTAMPTZ,
  hit_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Seasonal Promos table
CREATE TABLE IF NOT EXISTS promos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  discount_percent INT NOT NULL DEFAULT 10,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  theme TEXT NOT NULL DEFAULT 'custom',
  applicable_services TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Activity Log table
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name TEXT NOT NULL DEFAULT 'System',
  action TEXT NOT NULL,
  target TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL CHECK (category IN ('order', 'ticket', 'settings', 'portfolio', 'user', 'security')),
  details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Flagged Content / Content Moderation table
CREATE TABLE IF NOT EXISTS flagged_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('review', 'message', 'image', 'profile')),
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  author_initials TEXT NOT NULL DEFAULT '',
  reason TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reported_by TEXT NOT NULL DEFAULT '',
  moderation_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Refunds table
CREATE TABLE IF NOT EXISTS refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  reason TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied', 'processed')),
  type TEXT NOT NULL DEFAULT 'full' CHECK (type IN ('full', 'partial')),
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Staff Scheduling table
CREATE TABLE IF NOT EXISTS staff_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  designer_id TEXT NOT NULL,
  designer_name TEXT NOT NULL,
  week_start DATE NOT NULL,
  day_index INT NOT NULL CHECK (day_index BETWEEN 0 AND 6),
  shift TEXT NOT NULL DEFAULT 'off' CHECK (shift IN ('morning', 'afternoon', 'evening', 'off')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(designer_id, week_start, day_index)
);

-- 9. Staff Handoff Notes table  
CREATE TABLE IF NOT EXISTS handoff_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_name TEXT NOT NULL,
  to_name TEXT NOT NULL DEFAULT 'All',
  content TEXT NOT NULL,
  urgent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_category ON activity_logs(category);
CREATE INDEX IF NOT EXISTS idx_flagged_content_status ON flagged_content(status);
CREATE INDEX IF NOT EXISTS idx_refunds_status ON refunds(status);
CREATE INDEX IF NOT EXISTS idx_refunds_order_id ON refunds(order_id);
CREATE INDEX IF NOT EXISTS idx_staff_schedules_week ON staff_schedules(week_start);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_ip_bans_ip ON ip_bans(ip);
CREATE INDEX IF NOT EXISTS idx_blacklist_identifier ON blacklist(identifier);
