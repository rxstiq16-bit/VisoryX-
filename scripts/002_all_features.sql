-- VisoryX Complete Feature Migration
-- All 1,244 features database support

-- =====================================================
-- SECTION 1: ORDER FILES & REVISIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS order_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL DEFAULT 0,
  uploaded_by UUID,
  is_deliverable BOOLEAN DEFAULT false,
  is_final BOOLEAN DEFAULT false,
  version INT DEFAULT 1,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_revisions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL,
  revision_number INT NOT NULL DEFAULT 1,
  requested_by UUID,
  request_details TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'rejected')),
  designer_notes TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SECTION 2: MESSAGING & COMMUNICATION
-- =====================================================

CREATE TABLE IF NOT EXISTS order_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL,
  sender_id UUID,
  sender_name TEXT NOT NULL,
  message TEXT NOT NULL,
  is_staff BOOLEAN DEFAULT false,
  is_system BOOLEAN DEFAULT false,
  attachments JSONB DEFAULT '[]',
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('order', 'support', 'direct')),
  order_id UUID,
  ticket_id UUID,
  participants UUID[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SECTION 3: NOTIFICATIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  icon TEXT,
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email_order_updates BOOLEAN DEFAULT true,
  email_messages BOOLEAN DEFAULT true,
  email_marketing BOOLEAN DEFAULT false,
  email_weekly_digest BOOLEAN DEFAULT true,
  push_enabled BOOLEAN DEFAULT true,
  push_order_updates BOOLEAN DEFAULT true,
  push_messages BOOLEAN DEFAULT true,
  discord_enabled BOOLEAN DEFAULT false,
  discord_order_updates BOOLEAN DEFAULT true,
  discord_messages BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SECTION 4: LOYALTY & REWARDS
-- =====================================================

CREATE TABLE IF NOT EXISTS loyalty_points (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  points INT DEFAULT 0,
  tier TEXT DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum', 'diamond')),
  lifetime_points INT DEFAULT 0,
  tier_progress INT DEFAULT 0,
  next_tier_at INT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS loyalty_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  points INT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('earn', 'redeem', 'bonus', 'expire', 'adjust')),
  description TEXT,
  order_id UUID,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS loyalty_rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  points_cost INT NOT NULL,
  reward_type TEXT NOT NULL CHECK (reward_type IN ('discount_percent', 'discount_fixed', 'free_service', 'upgrade', 'exclusive')),
  reward_value DECIMAL,
  available_tiers TEXT[] DEFAULT '{"bronze","silver","gold","platinum","diamond"}',
  is_active BOOLEAN DEFAULT true,
  stock INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SECTION 5: REFERRALS
-- =====================================================

CREATE TABLE IF NOT EXISTS referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID NOT NULL,
  referred_id UUID,
  referral_code TEXT UNIQUE NOT NULL,
  referred_email TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'signed_up', 'converted', 'rewarded', 'expired')),
  referrer_reward DECIMAL DEFAULT 0,
  referred_reward DECIMAL DEFAULT 0,
  converted_at TIMESTAMPTZ,
  rewarded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS referral_tiers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  min_referrals INT NOT NULL,
  commission_rate DECIMAL NOT NULL,
  bonus_points INT DEFAULT 0,
  perks JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SECTION 6: PROMO CODES & DISCOUNTS
-- =====================================================

CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed', 'free_shipping', 'bogo')),
  discount_value DECIMAL NOT NULL,
  min_order_value DECIMAL,
  max_discount DECIMAL,
  max_uses INT,
  max_uses_per_user INT DEFAULT 1,
  current_uses INT DEFAULT 0,
  applicable_services TEXT[] DEFAULT '{}',
  excluded_services TEXT[] DEFAULT '{}',
  user_restrictions UUID[] DEFAULT '{}',
  new_customers_only BOOLEAN DEFAULT false,
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS promo_code_uses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  promo_code_id UUID NOT NULL,
  user_id UUID NOT NULL,
  order_id UUID,
  discount_applied DECIMAL NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SECTION 7: INTEGRATIONS (Discord, Roblox, etc.)
-- =====================================================

CREATE TABLE IF NOT EXISTS user_integrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('discord', 'roblox', 'twitter', 'instagram', 'youtube', 'twitch', 'github')),
  provider_user_id TEXT NOT NULL,
  provider_username TEXT,
  provider_avatar TEXT,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

CREATE TABLE IF NOT EXISTS discord_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  guild_id TEXT,
  dm_notifications BOOLEAN DEFAULT true,
  order_updates BOOLEAN DEFAULT true,
  message_notifications BOOLEAN DEFAULT true,
  marketing BOOLEAN DEFAULT false,
  webhook_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS roblox_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  order_id UUID,
  roblox_user_id TEXT NOT NULL,
  robux_amount INT NOT NULL,
  usd_equivalent DECIMAL NOT NULL,
  gamepass_id TEXT,
  transaction_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SECTION 8: CART & CHECKOUT
-- =====================================================

CREATE TABLE IF NOT EXISTS carts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  session_id TEXT,
  items JSONB DEFAULT '[]',
  promo_code_id UUID,
  subtotal DECIMAL DEFAULT 0,
  discount DECIMAL DEFAULT 0,
  total DECIMAL DEFAULT 0,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS saved_payment_methods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  stripe_payment_method_id TEXT NOT NULL,
  type TEXT NOT NULL,
  last_four TEXT,
  brand TEXT,
  exp_month INT,
  exp_year INT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SECTION 9: QUOTES & CUSTOM ORDERS
-- =====================================================

CREATE TABLE IF NOT EXISTS quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  subtotal DECIMAL NOT NULL,
  discount DECIMAL DEFAULT 0,
  total DECIMAL NOT NULL,
  notes TEXT,
  internal_notes TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired', 'converted')),
  valid_until TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  converted_order_id UUID,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SECTION 10: AFFILIATES
-- =====================================================

CREATE TABLE IF NOT EXISTS affiliates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  affiliate_code TEXT UNIQUE NOT NULL,
  company_name TEXT,
  website TEXT,
  commission_rate DECIMAL DEFAULT 0.10,
  total_earnings DECIMAL DEFAULT 0,
  pending_payout DECIMAL DEFAULT 0,
  paid_out DECIMAL DEFAULT 0,
  total_clicks INT DEFAULT 0,
  total_conversions INT DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'active', 'suspended', 'terminated')),
  payout_method TEXT CHECK (payout_method IN ('paypal', 'stripe', 'bank')),
  payout_details JSONB DEFAULT '{}',
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID NOT NULL,
  ip_hash TEXT,
  user_agent TEXT,
  referrer TEXT,
  landing_page TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS affiliate_conversions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID NOT NULL,
  order_id UUID NOT NULL,
  order_total DECIMAL NOT NULL,
  commission DECIMAL NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'rejected')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SECTION 11: GIFT CARDS
-- =====================================================

CREATE TABLE IF NOT EXISTS gift_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  initial_amount DECIMAL NOT NULL,
  balance DECIMAL NOT NULL,
  purchaser_id UUID,
  purchaser_email TEXT,
  recipient_email TEXT,
  recipient_name TEXT,
  message TEXT,
  design_template TEXT DEFAULT 'default',
  redeemed_by UUID,
  redeemed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gift_card_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gift_card_id UUID NOT NULL,
  amount DECIMAL NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('purchase', 'redeem', 'refund', 'expire')),
  order_id UUID,
  balance_after DECIMAL NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SECTION 12: SUBSCRIPTIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  plan_id TEXT NOT NULL,
  stripe_subscription_id TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'canceled', 'paused', 'trialing')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  canceled_at TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscription_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price_monthly DECIMAL NOT NULL,
  price_yearly DECIMAL,
  features JSONB DEFAULT '[]',
  included_orders INT,
  priority_support BOOLEAN DEFAULT false,
  dedicated_designer BOOLEAN DEFAULT false,
  discount_percent INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  stripe_price_id_monthly TEXT,
  stripe_price_id_yearly TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SECTION 13: HELP CENTER
-- =====================================================

CREATE TABLE IF NOT EXISTS help_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS help_articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  tags TEXT[] DEFAULT '{}',
  views INT DEFAULT 0,
  helpful_yes INT DEFAULT 0,
  helpful_no INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  author_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SECTION 14: SURVEYS & FEEDBACK
-- =====================================================

CREATE TABLE IF NOT EXISTS satisfaction_surveys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID,
  user_id UUID,
  overall_rating INT NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
  quality_rating INT CHECK (quality_rating BETWEEN 1 AND 5),
  communication_rating INT CHECK (communication_rating BETWEEN 1 AND 5),
  speed_rating INT CHECK (speed_rating BETWEEN 1 AND 5),
  value_rating INT CHECK (value_rating BETWEEN 1 AND 5),
  feedback TEXT,
  would_recommend BOOLEAN,
  nps_score INT CHECK (nps_score BETWEEN 0 AND 10),
  follow_up_requested BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SECTION 15: AUDIT LOGS
-- =====================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  user_email TEXT,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SECTION 16: TIME TRACKING
-- =====================================================

CREATE TABLE IF NOT EXISTS time_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  order_id UUID,
  task_type TEXT,
  minutes INT NOT NULL,
  description TEXT,
  billable BOOLEAN DEFAULT true,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SECTION 17: GAMIFICATION
-- =====================================================

CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  points INT DEFAULT 0,
  rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  criteria JSONB NOT NULL,
  is_secret BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  achievement_id UUID NOT NULL,
  progress INT DEFAULT 0,
  unlocked_at TIMESTAMPTZ,
  notified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

CREATE TABLE IF NOT EXISTS user_levels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  level INT DEFAULT 1,
  xp INT DEFAULT 0,
  xp_to_next_level INT DEFAULT 100,
  total_xp INT DEFAULT 0,
  title TEXT DEFAULT 'Newcomer',
  badges JSONB DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leaderboard_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  period TEXT NOT NULL CHECK (period IN ('daily', 'weekly', 'monthly', 'all_time')),
  category TEXT NOT NULL,
  score INT DEFAULT 0,
  rank INT,
  period_start DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, period, category, period_start)
);

-- =====================================================
-- SECTION 18: WAITLIST
-- =====================================================

CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  source TEXT,
  referrer_id UUID,
  position INT,
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'invited', 'signed_up', 'removed')),
  invited_at TIMESTAMPTZ,
  signed_up_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SECTION 19: WISHLIST
-- =====================================================

CREATE TABLE IF NOT EXISTS wishlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  service_id TEXT NOT NULL,
  notes TEXT,
  notify_on_sale BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, service_id)
);

-- =====================================================
-- SECTION 20: SCHEDULED TASKS
-- =====================================================

CREATE TABLE IF NOT EXISTS scheduled_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  payload JSONB DEFAULT '{}',
  scheduled_for TIMESTAMPTZ NOT NULL,
  executed_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
  error TEXT,
  retries INT DEFAULT 0,
  max_retries INT DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_order_files_order_id ON order_files(order_id);
CREATE INDEX IF NOT EXISTS idx_order_messages_order_id ON order_messages(order_id);
CREATE INDEX IF NOT EXISTS idx_order_messages_sender_id ON order_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_order_revisions_order_id ON order_revisions(order_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id) WHERE read = false;
CREATE INDEX IF NOT EXISTS idx_loyalty_points_user_id ON loyalty_points(user_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_user_id ON loyalty_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code);
CREATE INDEX IF NOT EXISTS idx_user_integrations_user_id ON user_integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_integrations_provider ON user_integrations(provider, provider_user_id);
CREATE INDEX IF NOT EXISTS idx_carts_user_id ON carts(user_id);
CREATE INDEX IF NOT EXISTS idx_quotes_user_id ON quotes(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliates_code ON affiliates(affiliate_code);
CREATE INDEX IF NOT EXISTS idx_gift_cards_code ON gift_cards(code);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_help_articles_slug ON help_articles(slug);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_user_id ON time_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_order_id ON time_entries(order_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_period ON leaderboard_entries(period, category, period_start);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE order_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE discord_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE satisfaction_surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (users can access their own data)
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can view own loyalty points" ON loyalty_points FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own loyalty transactions" ON loyalty_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own referrals" ON referrals FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);
CREATE POLICY "Users can view own integrations" ON user_integrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own integrations" ON user_integrations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own cart" ON carts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own payment methods" ON saved_payment_methods FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own level" ON user_levels FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own wishlist" ON wishlists FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own notification preferences" ON notification_preferences FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own discord settings" ON discord_settings FOR ALL USING (auth.uid() = user_id);

-- Public policies
CREATE POLICY "Anyone can view active help articles" ON help_articles FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active help categories" ON help_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view achievements" ON achievements FOR SELECT USING (is_active = true AND is_secret = false);
CREATE POLICY "Anyone can view active promo codes" ON promo_codes FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view subscription plans" ON subscription_plans FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view loyalty rewards" ON loyalty_rewards FOR SELECT USING (is_active = true);
