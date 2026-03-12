-- =====================================================
-- VISORYX SERVICES SEED DATA
-- Run this in Supabase SQL Editor
-- =====================================================

-- BRANDING SERVICES
INSERT INTO services (slug, name, short_description, description, category, subcategory, base_price, price_unit, turnaround_days, rush_available, features, deliverables, is_popular, is_featured, is_active, sort_order) VALUES
('logo-design', 'Logo Design', 'Custom logo for any brand or project', 'Get a unique, professional logo designed specifically for your brand.', 'branding', 'logos', 39.99, 'fixed', 3, true, '["Unique custom design", "3 initial concepts", "Unlimited revisions", "High-res files", "Full ownership"]', '["Logo (PNG, SVG, PDF)", "Transparent version", "Color variations"]', true, true, true, 1),
('logo-variations', 'Logo + Variations', 'Primary logo + icon, wordmark, dark/light versions', 'Complete logo system with all variations.', 'branding', 'logos', 64.99, 'fixed', 5, true, '["Primary logo", "Icon version", "Wordmark", "Dark & light versions"]', '["Logo suite", "Icon", "Wordmark", "All versions"]', false, false, true, 2),
('full-brand-kit', 'Full Brand Kit', 'Logo, color palette, typography, style guide', 'Complete brand identity package.', 'branding', 'brand-identity', 99.99, 'fixed', 7, true, '["Logo & variations", "Color palette", "Typography", "Style guide", "Social templates"]', '["Logo suite", "Brand guide PDF", "Templates"]', true, true, true, 3),
('icon-emblem', 'Icon / Emblem Design', 'Standalone icon, badge, or emblem', 'Custom icon or emblem design.', 'branding', 'logos', 24.99, 'fixed', 2, true, '["Custom design", "Multiple styles", "Scalable vectors"]', '["Icon (PNG, SVG)", "Multiple sizes"]', false, false, true, 4);

-- DISCORD SERVICES
INSERT INTO services (slug, name, short_description, description, category, subcategory, base_price, price_unit, turnaround_days, rush_available, features, deliverables, is_popular, is_featured, is_active, sort_order) VALUES
('discord-embeds', 'Discord Embeds', 'Rules, info, or welcome embeds', 'Professional embed designs for your server.', 'community', 'discord', 12.99, 'fixed', 1, true, '["Custom design", "Up to 5 embeds", "Matching colors"]', '["Embed content", "Setup guide"]', false, false, true, 10),
('server-setup', 'Server Setup', 'Channels, roles, permissions, full layout', 'Complete Discord server configuration.', 'community', 'discord', 79.99, 'fixed', 2, true, '["Channel structure", "Role hierarchy", "Permissions", "Welcome system"]', '["Configured server", "Documentation"]', true, true, true, 11),
('bot-setup', 'Bot Setup', 'Bot installation and configuration', 'Professional bot setup and optimization.', 'community', 'discord', 119.99, 'fixed', 3, true, '["Bot selection", "Full config", "Auto-mod", "Ticket system"]', '["Configured bots", "Command reference"]', false, false, true, 12),
('discord-package', 'Complete Discord Package', 'Server + bot + embeds + branding', 'Everything for a professional community.', 'community', 'discord', 199.99, 'fixed', 5, true, '["Server setup", "Bot setup", "Embeds", "Graphics", "Priority support"]', '["Complete server", "All graphics", "Documentation"]', true, true, true, 13);

-- GAMING SERVICES
INSERT INTO services (slug, name, short_description, description, category, subcategory, base_price, price_unit, turnaround_days, rush_available, features, deliverables, is_popular, is_featured, is_active, sort_order) VALUES
('erlc-leo', 'ERLC Single Livery (LEO)', 'One custom LEO vehicle livery', 'Custom police vehicle livery for ERLC.', 'gaming', 'erlc', 24.99, 'fixed', 2, true, '["Custom livery", "Authentic styling", "All angles"]', '["Vehicle livery (PNG)"]', false, false, true, 20),
('erlc-fd', 'ERLC Single Livery (FD)', 'One custom Fire Dept livery', 'Custom fire department livery.', 'gaming', 'erlc', 22.99, 'fixed', 2, true, '["FD design", "Emergency styling"]', '["Vehicle livery (PNG)"]', false, false, true, 21),
('erlc-civ', 'ERLC Single Livery (CIV)', 'One custom civilian livery', 'Custom civilian vehicle wrap.', 'gaming', 'erlc', 16.99, 'fixed', 2, true, '["Custom wrap", "Any color scheme"]', '["Vehicle livery (PNG)"]', false, false, true, 22),
('erlc-3pack', 'ERLC 3-Vehicle Pack', 'Three matching department liveries', 'Coordinated vehicle liveries.', 'gaming', 'erlc', 64.99, 'fixed', 4, true, '["3 liveries", "Consistent branding", "10% savings"]', '["3 vehicle liveries", "Brand guide"]', true, false, true, 23),
('erlc-5pack', 'ERLC 5-Vehicle Pack', 'Full fleet with 5 liveries', 'Complete fleet solution.', 'gaming', 'erlc', 109.99, 'fixed', 6, true, '["5 liveries", "Department manual", "15% savings"]', '["5 vehicle liveries", "Manual"]', false, false, true, 24),
('stream-overlay', 'Stream Overlay Package', 'Webcam frame, alerts, panels, screens', 'Complete streaming graphics.', 'gaming', 'streaming', 64.99, 'fixed', 4, true, '["Webcam frame", "Alerts", "Panels", "Screens"]', '["Full overlay set", "Setup guide"]', true, true, true, 25),
('youtube-thumbnails', 'YouTube Thumbnail Pack (5)', '5 custom thumbnails', 'Eye-catching thumbnail designs.', 'gaming', 'youtube', 39.99, 'fixed', 3, true, '["5 designs", "Consistent style", "Your branding"]', '["5 thumbnails", "PSD files"]', false, false, true, 26),
('esports-kit', 'Esports Team Kit', 'Team logo, jersey, banner, social', 'Complete esports branding.', 'gaming', 'esports', 129.99, 'fixed', 7, true, '["Team logo", "Jersey mockup", "Banner", "Social assets"]', '["Logo suite", "Mockups", "Templates"]', true, false, true, 27);

-- BUSINESS SERVICES
INSERT INTO services (slug, name, short_description, description, category, subcategory, base_price, price_unit, turnaround_days, rush_available, features, deliverables, is_popular, is_featured, is_active, sort_order) VALUES
('business-card', 'Business Card Design', 'Front and back design', 'Professional business cards.', 'business', 'print', 34.99, 'fixed', 2, true, '["Front & back", "Print-ready", "QR code option"]', '["Business card (PDF)", "Print specs"]', false, false, true, 30),
('pitch-deck', 'Pitch Deck Design', 'Up to 15 slides', 'Professional investor presentation.', 'business', 'presentations', 99.99, 'fixed', 5, true, '["15 slides", "Data viz", "PowerPoint & Slides"]', '["Pitch deck", "Editable template"]', true, true, true, 31),
('startup-brand', 'Startup Brand Starter', 'Logo + cards + social + letterhead', 'Everything for a new business.', 'business', 'brand-identity', 129.99, 'fixed', 7, true, '["Logo", "Business cards", "Letterhead", "Social templates"]', '["Complete brand kit"]', true, false, true, 32),
('presentation-template', 'Presentation Template', 'Reusable branded template', 'Professional slide template.', 'business', 'presentations', 49.99, 'fixed', 3, true, '["15+ layouts", "Fully editable", "Charts included"]', '["Template (PPTX/Slides)"]', false, false, true, 33);

-- MARKETING SERVICES
INSERT INTO services (slug, name, short_description, description, category, subcategory, base_price, price_unit, turnaround_days, rush_available, features, deliverables, is_popular, is_featured, is_active, sort_order) VALUES
('social-single', 'Social Media Post (Single)', 'One custom graphic', 'Platform-optimized post.', 'marketing', 'social-media', 16.99, 'fixed', 1, true, '["Platform-optimized", "Your branding"]', '["Social post (PNG)"]', false, false, true, 40),
('social-pack-10', 'Social Media Pack (10)', '10 branded posts', 'Month of content.', 'marketing', 'social-media', 109.99, 'fixed', 5, true, '["10 designs", "Consistent style", "Multiple sizes"]', '["10 posts", "Content calendar"]', true, false, true, 41),
('ad-creative', 'Ad Creative Pack', '3 ad designs', 'A/B testing ready ads.', 'marketing', 'advertising', 49.99, 'fixed', 3, true, '["3 variations", "Platform specs", "High-converting"]', '["3 ad creatives", "Multiple sizes"]', false, false, true, 42),
('banner-header', 'Banner / Header Design', 'Custom banner for any platform', 'Professional banner design.', 'marketing', 'social-media', 24.99, 'fixed', 2, true, '["Any size", "High resolution"]', '["Banner (PNG/JPG)"]', false, false, true, 43),
('promo-flyer', 'Promo Flyer / Poster', 'Digital or print promotional', 'Event/promo graphics.', 'marketing', 'print', 34.99, 'fixed', 2, true, '["Custom design", "Print or digital"]', '["Flyer (PDF, PNG)"]', false, false, true, 44);

-- BUNDLE PACKAGES
INSERT INTO services (slug, name, short_description, description, category, subcategory, base_price, price_unit, turnaround_days, rush_available, features, deliverables, is_popular, is_featured, is_active, sort_order) VALUES
('bundle-creator', 'Creator Starter', 'Logo + Discord + social + banner', 'Everything for creators.', 'bundles', 'creator', 149.99, 'fixed', 7, true, '["Logo", "Discord setup", "5 social posts", "Banner", "20% savings"]', '["Complete creator kit"]', true, true, true, 50),
('bundle-business', 'Business Launch', 'Brand kit + pitch deck + cards + social', 'Complete business package.', 'bundles', 'business', 279.99, 'fixed', 14, true, '["Brand kit", "Pitch deck", "Business cards", "10 social posts", "25% savings"]', '["Full business kit"]', true, true, true, 51),
('bundle-gaming', 'Gaming Community Kit', '5 liveries + Discord + logo + banner', 'Complete gaming package.', 'bundles', 'gaming', 219.99, 'fixed', 10, true, '["5 ERLC liveries", "Discord setup", "Team logo", "Banner", "20% savings"]', '["Full gaming kit"]', false, false, true, 52),
('bundle-full', 'Full Service Package', 'Everything we offer', 'Our most comprehensive package.', 'bundles', 'premium', 449.99, 'fixed', 21, true, '["Brand kit", "Discord package", "Social pack", "Pitch deck", "30% savings"]', '["Complete package"]', true, true, true, 53);

SELECT 'Services inserted!' as status;
