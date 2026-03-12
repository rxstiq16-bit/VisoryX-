-- VisoryX P1-P11 Database Migrations
-- This script creates all tables needed for the full feature set

-- =============================================
-- PHASE 1: CRITICAL FOUNDATION
-- =============================================

-- Order Files (for file uploads and deliverables)
CREATE TABLE IF NOT EXISTS order_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_deliverable BOOLEAN DEFAULT false,
  is_final BOOLEAN DEFAULT false,
  version INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Messages (real-time chat)
CREATE TABLE IF NOT EXISTS order_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  sender_name TEXT NOT NULL,
  message TEXT NOT NULL,
  is_staff BOOLEAN DEFAULT false,
  attachments JSONB DEFAULT '[]',
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Revisions
CREATE TABLE IF NOT EXISTS order_revisions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  revision_number INT NOT NULL,
  requested_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  request_details TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'rejected')),
  staff_notes TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('order_update', 'message', 'payment', 'delivery', 'review', 'system', 'promo', 'achievement')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  metadata JSONB DEFAULT '{}',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PHASE 4: INTEGRATIONS
-- =============================================

-- User Integrations (Discord, Roblox, etc.)
CREATE TABLE IF NOT EXISTS user_integrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('discord', 'roblox', 'twitter', 'google')),
  provider_user_id TEXT NOT NULL,
  provider_username TEXT,
  provider_avatar TEXT,
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  verified_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

-- Discord Notification Preferences
CREATE TABLE IF NOT EXISTS discord_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  order_updates BOOLEAN DEFAULT true,
  message_notifications BOOLEAN DEFAULT true,
  delivery_notifications BOOLEAN DEFAULT true,
  marketing BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PHASE 5: LOYALTY & REFERRALS
-- =============================================

-- Loyalty Points
CREATE TABLE IF NOT EXISTS loyalty_points (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  points INT DEFAULT 0,
  tier TEXT DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum', 'diamond')),
  lifetime_points INT DEFAULT 0,
  tier_expires_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Loyalty Transactions
CREATE TABLE IF NOT EXISTS loyalty_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  points INT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('earned', 'spent', 'bonus', 'expired', 'adjustment')),
  description TEXT,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referrals
CREATE TABLE IF NOT EXISTS referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  referred_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  referral_code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'signed_up', 'converted', 'rewarded')),
  referrer_reward_claimed BOOLEAN DEFAULT false,
  referred_reward_claimed BOOLEAN DEFAULT false,
  converted_order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  converted_at TIMESTAMPTZ
);

-- Promo Codes
CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed', 'free_service')),
  discount_value DECIMAL NOT NULL,
  min_order_value DECIMAL,
  max_discount DECIMAL,
  max_uses INT,
  current_uses INT DEFAULT 0,
  per_user_limit INT DEFAULT 1,
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  applicable_services TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Promo Code Usage
CREATE TABLE IF NOT EXISTS promo_code_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  promo_code_id UUID REFERENCES promo_codes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  discount_applied DECIMAL NOT NULL,
  used_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(promo_code_id, order_id)
);

-- =============================================
-- PHASE 6: CUSTOMER SATISFACTION
-- =============================================

-- Satisfaction Surveys
CREATE TABLE IF NOT EXISTS satisfaction_surveys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  would_recommend BOOLEAN,
  service_quality INT CHECK (service_quality >= 1 AND service_quality <= 5),
  communication_quality INT CHECK (communication_quality >= 1 AND communication_quality <= 5),
  delivery_speed INT CHECK (delivery_speed >= 1 AND delivery_speed <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(order_id)
);

-- Help Articles
CREATE TABLE IF NOT EXISTS help_articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  views INT DEFAULT 0,
  helpful_votes INT DEFAULT 0,
  not_helpful_votes INT DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PHASE 7: BUSINESS OPERATIONS
-- =============================================

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Time Entries
CREATE TABLE IF NOT EXISTS time_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  minutes INT NOT NULL,
  description TEXT,
  billable BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Internal Notes
CREATE TABLE IF NOT EXISTS internal_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
  note TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PHASE 8: ADVANCED COMMERCE
-- =============================================

-- Quotes
CREATE TABLE IF NOT EXISTS quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  subtotal DECIMAL NOT NULL DEFAULT 0,
  discount DECIMAL DEFAULT 0,
  total DECIMAL NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired')),
  valid_until TIMESTAMPTZ,
  notes TEXT,
  accepted_at TIMESTAMPTZ,
  converted_order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Affiliates
CREATE TABLE IF NOT EXISTS affiliates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  affiliate_code TEXT UNIQUE NOT NULL,
  commission_rate DECIMAL DEFAULT 0.10,
  total_earnings DECIMAL DEFAULT 0,
  pending_payout DECIMAL DEFAULT 0,
  paid_out DECIMAL DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  payout_method TEXT,
  payout_details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ
);

-- Affiliate Conversions
CREATE TABLE IF NOT EXISTS affiliate_conversions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  order_total DECIMAL NOT NULL,
  commission DECIMAL NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ
);

-- Gift Cards
CREATE TABLE IF NOT EXISTS gift_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  amount DECIMAL NOT NULL,
  balance DECIMAL NOT NULL,
  purchaser_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  recipient_email TEXT,
  recipient_name TEXT,
  message TEXT,
  redeemed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  redeemed_at TIMESTAMPTZ
);

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stripe_subscription_id TEXT UNIQUE,
  plan_id TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled', 'past_due', 'trialing')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  cancelled_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PHASE 9: GAMIFICATION
-- =============================================

-- Achievements
CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  points INT DEFAULT 0,
  criteria JSONB NOT NULL,
  is_secret BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE NOT NULL,
  progress JSONB DEFAULT '{}',
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- User XP/Levels
CREATE TABLE IF NOT EXISTS user_levels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  xp INT DEFAULT 0,
  level INT DEFAULT 1,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PHASE 10: CART SYSTEM
-- =============================================

-- Cart Items
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  service_type TEXT NOT NULL,
  service_tier TEXT NOT NULL,
  quantity INT DEFAULT 1,
  unit_price DECIMAL NOT NULL,
  options JSONB DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX IF NOT EXISTS idx_order_files_order_id ON order_files(order_id);
CREATE INDEX IF NOT EXISTS idx_order_messages_order_id ON order_messages(order_id);
CREATE INDEX IF NOT EXISTS idx_order_messages_created_at ON order_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_revisions_order_id ON order_revisions(order_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_integrations_user_id ON user_integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_integrations_provider ON user_integrations(provider, provider_user_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_points_user_id ON loyalty_points(user_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_user_id ON loyalty_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_order_id ON time_entries(order_id);
CREATE INDEX IF NOT EXISTS idx_quotes_user_id ON quotes(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliates_code ON affiliates(affiliate_code);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE order_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE discord_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_code_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE satisfaction_surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE help_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE internal_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Notifications: Users can only see their own
CREATE POLICY "notifications_select_own" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notifications_update_own" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "notifications_delete_own" ON notifications FOR DELETE USING (auth.uid() = user_id);

-- User Integrations: Users can only see/manage their own
CREATE POLICY "integrations_select_own" ON user_integrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "integrations_insert_own" ON user_integrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "integrations_update_own" ON user_integrations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "integrations_delete_own" ON user_integrations FOR DELETE USING (auth.uid() = user_id);

-- Discord Notifications: Users can only see/manage their own
CREATE POLICY "discord_notif_select_own" ON discord_notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "discord_notif_insert_own" ON discord_notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "discord_notif_update_own" ON discord_notifications FOR UPDATE USING (auth.uid() = user_id);

-- Loyalty Points: Users can only see their own
CREATE POLICY "loyalty_points_select_own" ON loyalty_points FOR SELECT USING (auth.uid() = user_id);

-- Loyalty Transactions: Users can only see their own
CREATE POLICY "loyalty_trans_select_own" ON loyalty_transactions FOR SELECT USING (auth.uid() = user_id);

-- Referrals: Users can see their own referrals
CREATE POLICY "referrals_select_own" ON referrals FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

-- Promo Codes: Everyone can read active promo codes
CREATE POLICY "promo_codes_select_active" ON promo_codes FOR SELECT USING (is_active = true);

-- Help Articles: Everyone can read published articles
CREATE POLICY "help_articles_select_published" ON help_articles FOR SELECT USING (is_published = true);

-- Achievements: Everyone can see achievements
CREATE POLICY "achievements_select_all" ON achievements FOR SELECT USING (true);

-- User Achievements: Users can see their own
CREATE POLICY "user_achievements_select_own" ON user_achievements FOR SELECT USING (auth.uid() = user_id);

-- User Levels: Users can see their own
CREATE POLICY "user_levels_select_own" ON user_levels FOR SELECT USING (auth.uid() = user_id);

-- Cart Items: Users can manage their own cart
CREATE POLICY "cart_items_select_own" ON cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "cart_items_insert_own" ON cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "cart_items_update_own" ON cart_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "cart_items_delete_own" ON cart_items FOR DELETE USING (auth.uid() = user_id);

-- Subscriptions: Users can see their own
CREATE POLICY "subscriptions_select_own" ON subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Gift Cards: Users can see cards they purchased or redeemed
CREATE POLICY "gift_cards_select_own" ON gift_cards FOR SELECT USING (auth.uid() = purchaser_id OR auth.uid() = redeemed_by);

-- Affiliates: Users can see their own affiliate data
CREATE POLICY "affiliates_select_own" ON affiliates FOR SELECT USING (auth.uid() = user_id);

-- Affiliate Conversions: Affiliates can see their own conversions
CREATE POLICY "affiliate_conv_select_own" ON affiliate_conversions FOR SELECT 
  USING (affiliate_id IN (SELECT id FROM affiliates WHERE user_id = auth.uid()));

-- Satisfaction Surveys: Users can see/create their own
CREATE POLICY "surveys_select_own" ON satisfaction_surveys FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "surveys_insert_own" ON satisfaction_surveys FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Order Files: Users can see files for their orders
CREATE POLICY "order_files_select" ON order_files FOR SELECT 
  USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

-- Order Messages: Users can see/send messages for their orders
CREATE POLICY "order_messages_select" ON order_messages FOR SELECT 
  USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));
CREATE POLICY "order_messages_insert" ON order_messages FOR INSERT 
  WITH CHECK (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

-- Order Revisions: Users can see/create revisions for their orders
CREATE POLICY "order_revisions_select" ON order_revisions FOR SELECT 
  USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));
CREATE POLICY "order_revisions_insert" ON order_revisions FOR INSERT 
  WITH CHECK (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

-- =============================================
-- SEED DEFAULT ACHIEVEMENTS
-- =============================================

INSERT INTO achievements (name, description, icon, category, points, criteria) VALUES
  ('First Order', 'Place your first order with VisoryX', 'trophy', 'orders', 100, '{"type": "order_count", "threshold": 1}'),
  ('Loyal Customer', 'Place 5 orders', 'star', 'orders', 250, '{"type": "order_count", "threshold": 5}'),
  ('VIP Status', 'Place 10 orders', 'crown', 'orders', 500, '{"type": "order_count", "threshold": 10}'),
  ('Big Spender', 'Spend $500 total', 'dollar-sign', 'spending', 300, '{"type": "total_spent", "threshold": 500}'),
  ('Referral Champion', 'Refer 3 friends who place orders', 'users', 'social', 400, '{"type": "referral_count", "threshold": 3}'),
  ('Feedback Hero', 'Leave 5 reviews', 'message-square', 'engagement', 200, '{"type": "review_count", "threshold": 5}'),
  ('Early Adopter', 'One of the first 100 customers', 'zap', 'special', 1000, '{"type": "early_adopter", "threshold": 100}'),
  ('Verified', 'Link your Discord account', 'check-circle', 'profile', 50, '{"type": "discord_linked"}'),
  ('Roblox Ready', 'Link your Roblox account', 'gamepad-2', 'profile', 50, '{"type": "roblox_linked"}')
ON CONFLICT DO NOTHING;

-- =============================================
-- REALTIME SUBSCRIPTIONS
-- =============================================

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE order_messages;
