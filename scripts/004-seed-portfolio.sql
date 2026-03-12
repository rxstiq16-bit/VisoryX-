-- =====================================================
-- VISORYX PORTFOLIO & HELP ARTICLES SEED DATA
-- Run this in Supabase SQL Editor after 003-seed-services.sql
-- =====================================================

-- PORTFOLIO ITEMS
INSERT INTO portfolio_items (title, slug, description, category, subcategory, tags, images, thumbnail_url, client_name, client_testimonial, is_featured, is_active, views, likes, sort_order) VALUES
('Midnight Racing Team', 'midnight-racing-team', 'Complete brand identity for a competitive racing team including logo, liveries, and team apparel designs.', 'gaming', 'esports', '{"racing", "esports", "branding", "liveries"}', '[{"url": "/portfolio/midnight-racing-1.jpg", "alt": "Team logo"}, {"url": "/portfolio/midnight-racing-2.jpg", "alt": "Livery design"}]', '/portfolio/midnight-racing-thumb.jpg', 'Midnight Racing', 'VisoryX knocked it out of the park! Our team looks so professional now.', true, true, 1245, 89, 1),
('Metro Police Department Fleet', 'metro-pd-fleet', '10 custom ERLC liveries for Metro PD roleplay server with consistent branding.', 'gaming', 'erlc', '{"erlc", "police", "livery", "fleet"}', '[{"url": "/portfolio/metro-pd-1.jpg", "alt": "Patrol car"}, {"url": "/portfolio/metro-pd-2.jpg", "alt": "SUV unit"}]', '/portfolio/metro-pd-thumb.jpg', 'Metro RP Community', 'Best liveries on our server. Players always compliment them.', true, true, 2341, 156, 2),
('TechFlow SaaS Branding', 'techflow-saas', 'Modern brand identity for a B2B SaaS startup including logo, pitch deck, and marketing materials.', 'business', 'brand-identity', '{"saas", "startup", "b2b", "tech"}', '[{"url": "/portfolio/techflow-1.jpg", "alt": "Logo"}, {"url": "/portfolio/techflow-2.jpg", "alt": "Pitch deck"}]', '/portfolio/techflow-thumb.jpg', 'TechFlow', 'The pitch deck helped us close our seed round. Worth every penny!', true, true, 1876, 134, 3),
('Nexus Gaming Community', 'nexus-gaming', 'Complete Discord server setup with custom bot configuration, embeds, and branding.', 'community', 'discord', '{"discord", "gaming", "community", "server"}', '[{"url": "/portfolio/nexus-1.jpg", "alt": "Server overview"}, {"url": "/portfolio/nexus-2.jpg", "alt": "Welcome embeds"}]', '/portfolio/nexus-thumb.jpg', 'Nexus Gaming', 'Our community grew 300% after the rebrand. The server looks amazing!', true, true, 3102, 201, 4),
('StreamerPro Overlay Pack', 'streamerpro-overlay', 'Full streaming overlay package including webcam frame, alerts, panels, and screens.', 'gaming', 'streaming', '{"streaming", "overlay", "twitch", "youtube"}', '[{"url": "/portfolio/streamerpro-1.jpg", "alt": "Overlay preview"}, {"url": "/portfolio/streamerpro-2.jpg", "alt": "Alert animations"}]', '/portfolio/streamerpro-thumb.jpg', 'StreamerPro', 'My stream looks so much more professional now. Love the animated alerts!', false, true, 987, 67, 5),
('Sunrise Coffee Rebrand', 'sunrise-coffee', 'Complete rebrand for a local coffee chain including logo, packaging, and social media templates.', 'branding', 'brand-identity', '{"coffee", "rebrand", "packaging", "local"}', '[{"url": "/portfolio/sunrise-1.jpg", "alt": "Logo design"}, {"url": "/portfolio/sunrise-2.jpg", "alt": "Packaging"}]', '/portfolio/sunrise-thumb.jpg', 'Sunrise Coffee Co', 'The new branding perfectly captures our vibe. Customers love it!', true, true, 1432, 98, 6),
('City Fire Department', 'city-fd-fleet', '5 matching fire department liveries for ERLC with coordinated branding.', 'gaming', 'erlc', '{"erlc", "fire", "livery", "emergency"}', '[{"url": "/portfolio/city-fd-1.jpg", "alt": "Engine"}, {"url": "/portfolio/city-fd-2.jpg", "alt": "Ladder truck"}]', '/portfolio/city-fd-thumb.jpg', 'City RP Server', 'Professional quality liveries that make our FD stand out.', false, true, 876, 54, 7),
('Apex Esports Team Kit', 'apex-esports', 'Full esports branding including team logo, jersey mockups, banners, and social assets.', 'gaming', 'esports', '{"esports", "team", "jersey", "competitive"}', '[{"url": "/portfolio/apex-1.jpg", "alt": "Team logo"}, {"url": "/portfolio/apex-2.jpg", "alt": "Jersey mockup"}]', '/portfolio/apex-thumb.jpg', 'Apex Esports', 'We look like a pro team now. Best investment for our org.', true, true, 2156, 178, 8);

-- HELP ARTICLES
INSERT INTO help_articles (category_id, title, slug, content, excerpt, tags, views, helpful_yes, helpful_no, is_featured, is_active, sort_order)
SELECT 
  hc.id,
  'Getting Started with VisoryX',
  'getting-started-guide',
  E'# Welcome to VisoryX\n\nWe''re excited to help you bring your creative vision to life! Here''s everything you need to know to get started.\n\n## Creating Your Account\n\n1. Click "Sign Up" in the navigation bar\n2. Enter your email and create a password\n3. Verify your email address\n4. Complete your profile\n\n## Placing Your First Order\n\n1. Browse our services or use the search feature\n2. Select a service that fits your needs\n3. Fill out the order form with your requirements\n4. Upload any reference files\n5. Choose your payment method and checkout\n\n## What Happens Next\n\nAfter placing your order:\n- You''ll receive a confirmation email\n- A designer will be assigned within 24 hours\n- You can track progress in your dashboard\n- Communicate directly through the order chat\n\n## Need Help?\n\nOur support team is available 24/7. Contact us through:\n- Live chat on the website\n- Email: support@visoryx.com\n- Discord: discord.gg/visoryx',
  'Learn how to create an account, place orders, and get started with VisoryX design services.',
  '{"getting-started", "account", "orders", "basics"}',
  5234, 456, 12, true, true, 1
FROM help_categories hc WHERE hc.slug = 'getting-started';

INSERT INTO help_articles (category_id, title, slug, content, excerpt, tags, views, helpful_yes, helpful_no, is_featured, is_active, sort_order)
SELECT 
  hc.id,
  'Understanding Pricing and Payments',
  'pricing-payments',
  E'# Pricing & Payments\n\n## How Pricing Works\n\nOur pricing is transparent and straightforward:\n- **Fixed pricing** - You know exactly what you''ll pay before ordering\n- **No hidden fees** - The price you see is the price you pay\n- **Rush delivery available** - Get your designs faster for an additional fee\n\n## Payment Methods\n\nWe accept:\n- Credit/Debit cards (Visa, Mastercard, Amex)\n- PayPal\n- Robux (converted at current rates)\n- Account credit\n\n## Robux Payments\n\nWe accept Robux as payment through our secure gamepass system:\n1. Select Robux as your payment method\n2. We''ll provide a verification code\n3. Purchase the corresponding gamepass\n4. Your order is automatically confirmed\n\n## Refund Policy\n\n- Full refund if we haven''t started work\n- Partial refund based on progress for in-progress orders\n- No refunds for completed and delivered work\n- Revisions are free within the included limit',
  'Learn about our pricing structure, accepted payment methods, and refund policies.',
  '{"pricing", "payments", "robux", "refunds"}',
  3876, 312, 8, true, true, 2
FROM help_categories hc WHERE hc.slug = 'orders-pricing';

INSERT INTO help_articles (category_id, title, slug, content, excerpt, tags, views, helpful_yes, helpful_no, is_featured, is_active, sort_order)
SELECT 
  hc.id,
  'Managing Your Account',
  'account-management',
  E'# Account Management\n\n## Profile Settings\n\nCustomize your VisoryX experience:\n- Update your display name and avatar\n- Set your timezone for accurate delivery estimates\n- Configure notification preferences\n- Add a bio for community features\n\n## Security\n\n### Two-Factor Authentication\nProtect your account with 2FA:\n1. Go to Settings > Security\n2. Enable Two-Factor Authentication\n3. Scan the QR code with your authenticator app\n4. Save your backup codes\n\n### Active Sessions\nView and manage devices logged into your account.\n\n## Connected Accounts\n\nLink your accounts for enhanced features:\n- **Discord** - Receive order notifications\n- **Roblox** - Enable Robux payments\n- **Social** - Easy sharing and portfolio integration\n\n## Deleting Your Account\n\nTo delete your account:\n1. Go to Settings > Account\n2. Click "Delete Account"\n3. Confirm your password\n4. Your data will be removed within 30 days',
  'Learn how to manage your profile, security settings, and connected accounts.',
  '{"account", "profile", "security", "settings"}',
  2543, 198, 5, false, true, 3
FROM help_categories hc WHERE hc.slug = 'account-billing';

INSERT INTO help_articles (category_id, title, slug, content, excerpt, tags, views, helpful_yes, helpful_no, is_featured, is_active, sort_order)
SELECT 
  hc.id,
  'ERLC Livery Design Guide',
  'erlc-livery-guide',
  E'# ERLC Livery Design Guide\n\n## What We Need From You\n\nTo create your perfect ERLC livery:\n\n### Required Information\n- Department/team name\n- Vehicle model (Crown Vic, Explorer, etc.)\n- Unit number (if applicable)\n- Color scheme preferences\n\n### Reference Images\n- Real-world inspiration photos\n- Department patch/logo (if available)\n- Existing branding to match\n\n## Our Process\n\n1. **Design Phase** - We create initial concepts\n2. **Review** - You provide feedback\n3. **Revisions** - We refine the design\n4. **Delivery** - You receive final PNG files\n\n## Technical Specs\n\n- **Format**: PNG with transparency\n- **Resolution**: High-res for in-game quality\n- **Compatibility**: Works with all ERLC vehicles\n\n## Installation\n\n1. Download your livery files\n2. Open ERLC vehicle customizer\n3. Import the PNG file\n4. Adjust positioning if needed\n5. Save and enjoy!\n\n## Tips for Best Results\n\n- Provide clear reference images\n- Specify exact colors (hex codes help)\n- Let us know about any patches or logos to include',
  'Everything you need to know about ordering ERLC liveries.',
  '{"erlc", "livery", "roblox", "gaming"}',
  4321, 389, 15, true, true, 1
FROM help_categories hc WHERE hc.slug = 'design-services';

INSERT INTO help_articles (category_id, title, slug, content, excerpt, tags, views, helpful_yes, helpful_no, is_featured, is_active, sort_order)
SELECT 
  hc.id,
  'Connecting Your Discord Account',
  'discord-integration',
  E'# Discord Integration\n\n## Why Connect Discord?\n\nLinking your Discord account enables:\n- Real-time order notifications\n- Direct messages from designers\n- Exclusive community access\n- Priority support via DM\n\n## How to Connect\n\n1. Go to Settings > Integrations\n2. Click "Connect Discord"\n3. Authorize VisoryX bot\n4. Select your notification preferences\n\n## Notification Settings\n\nChoose what you receive:\n- Order status updates\n- New messages\n- Delivery notifications\n- Marketing & promotions\n\n## Troubleshooting\n\n### Not Receiving Notifications?\n1. Check Discord DM settings\n2. Ensure bot isn''t blocked\n3. Verify connection in settings\n\n### Connection Failed?\n1. Try disconnecting and reconnecting\n2. Clear browser cache\n3. Contact support if issues persist\n\n## Privacy\n\nWe only access:\n- Your Discord username and ID\n- Permission to send DMs\n\nWe never post on your behalf or access server data.',
  'Set up Discord notifications for real-time order updates.',
  '{"discord", "notifications", "integration"}',
  2187, 176, 4, true, true, 1
FROM help_categories hc WHERE hc.slug = 'integrations';

INSERT INTO help_articles (category_id, title, slug, content, excerpt, tags, views, helpful_yes, helpful_no, is_featured, is_active, sort_order)
SELECT 
  hc.id,
  'Subscription Plans Explained',
  'subscription-plans',
  E'# Subscription Plans\n\n## Available Plans\n\n### Starter - $29/month\n- 5 design requests per month\n- 48-hour turnaround\n- Email support\n- Source files included\n- 2 revisions per order\n\n### Professional - $79/month (Most Popular)\n- 15 design requests per month\n- 24-hour turnaround\n- Priority support\n- Unlimited revisions\n- Brand kit storage\n- Team collaboration\n\n### Business - $149/month\n- 30 design requests per month\n- Same-day turnaround\n- Dedicated account manager\n- Custom contracts available\n- API access\n\n### Enterprise - Custom\n- Unlimited requests\n- Dedicated designer\n- Custom integrations\n- White-label options\n- SLA guarantees\n\n## Billing & Cancellation\n\n- Billed monthly or annually (save 15%)\n- Cancel anytime, no penalties\n- Unused requests don''t roll over\n- Upgrade/downgrade anytime\n\n## FAQ\n\n**Q: What counts as a request?**\nA: One design deliverable (logo, post, livery, etc.)\n\n**Q: Can I pause my subscription?**\nA: Yes, pause for up to 3 months per year.',
  'Compare our subscription plans and find the right fit for you.',
  '{"subscriptions", "plans", "pricing", "membership"}',
  3654, 287, 11, true, true, 1
FROM help_categories hc WHERE hc.slug = 'subscriptions';

INSERT INTO help_articles (category_id, title, slug, content, excerpt, tags, views, helpful_yes, helpful_no, is_featured, is_active, sort_order)
SELECT 
  hc.id,
  'Loyalty Points & Rewards',
  'loyalty-rewards',
  E'# Loyalty Program\n\n## Earning Points\n\nEarn points with every action:\n- **Orders**: 1 point per $1 spent\n- **Reviews**: 50 points per review\n- **Referrals**: 200 points per signup\n- **Achievements**: Various point rewards\n\n## Membership Tiers\n\n### Bronze (0-499 points)\n- Standard support\n- Basic rewards\n\n### Silver (500-1,499 points)\n- Priority support\n- 5% discount on orders\n- Early access to new services\n\n### Gold (1,500-4,999 points)\n- Premium support\n- 10% discount on orders\n- Exclusive rewards\n- Free rush delivery\n\n### Platinum (5,000+ points)\n- VIP support\n- 15% discount on orders\n- Dedicated account manager\n- Exclusive events access\n\n## Redeeming Rewards\n\nSpend your points on:\n- Order discounts\n- Free services\n- Exclusive merchandise\n- Priority queue access\n\n## Points Expiration\n\nPoints expire after 12 months of account inactivity.',
  'Learn how to earn and redeem loyalty points and rewards.',
  '{"loyalty", "points", "rewards", "tiers"}',
  2876, 234, 7, true, true, 1
FROM help_categories hc WHERE hc.slug = 'loyalty-rewards';

SELECT 'Portfolio and help articles inserted!' as status;
