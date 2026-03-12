export type Product = {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
  robuxPrice: number;
  category: string;
};

export const PRODUCTS: Product[] = [
  // Branding & Identity
  { id: "logo-design", name: "Logo Design", description: "Custom logo for any brand or project", priceInCents: 313, robuxPrice: 250, category: "branding" },
  { id: "logo-variations", name: "Logo + Variations", description: "Primary logo + icon, wordmark, and dark/light versions", priceInCents: 500, robuxPrice: 400, category: "branding" },
  { id: "full-brand-kit", name: "Full Brand Kit", description: "Logo, color palette, typography, style guide, and assets", priceInCents: 750, robuxPrice: 600, category: "branding" },
  { id: "brand-refresh", name: "Brand Refresh", description: "Modernize an existing brand with updated identity", priceInCents: 500, robuxPrice: 400, category: "branding" },
  { id: "icon-emblem", name: "Icon / Emblem Design", description: "Standalone icon, badge, or emblem", priceInCents: 188, robuxPrice: 150, category: "branding" },

  // Community & Discord
  { id: "discord-embeds", name: "Discord Embeds", description: "Rules, info, ticket, or welcome embeds (per set)", priceInCents: 94, robuxPrice: 75, category: "community" },
  { id: "server-setup", name: "Server Setup", description: "Channels, roles, permissions, and full layout", priceInCents: 625, robuxPrice: 500, category: "community" },
  { id: "bot-setup", name: "Bot Setup", description: "Bot installation, config, and moderation tools", priceInCents: 938, robuxPrice: 750, category: "community" },
  { id: "discord-package", name: "Complete Discord Package", description: "Server + bot + embeds + branding", priceInCents: 1500, robuxPrice: 1200, category: "community" },
  { id: "server-banner-icon", name: "Server Banner + Icon", description: "Custom Discord server banner and icon set", priceInCents: 188, robuxPrice: 150, category: "community" },

  // Gaming & Creator Packs
  { id: "erlc-leo", name: "ERLC Single Livery (LEO)", description: "One custom LEO vehicle livery", priceInCents: 188, robuxPrice: 150, category: "gaming" },
  { id: "erlc-fd", name: "ERLC Single Livery (FD)", description: "One custom Fire Dept vehicle livery", priceInCents: 175, robuxPrice: 140, category: "gaming" },
  { id: "erlc-civ", name: "ERLC Single Livery (CIV)", description: "One custom civilian vehicle livery", priceInCents: 125, robuxPrice: 100, category: "gaming" },
  { id: "erlc-dot", name: "ERLC Single Livery (DoT)", description: "One custom DoT vehicle livery", priceInCents: 156, robuxPrice: 125, category: "gaming" },
  { id: "erlc-3pack", name: "ERLC 3-Vehicle Pack", description: "Three matching liveries for your department", priceInCents: 500, robuxPrice: 400, category: "gaming" },
  { id: "erlc-5pack", name: "ERLC 5-Vehicle Pack", description: "Full fleet package with 5 coordinated liveries", priceInCents: 875, robuxPrice: 700, category: "gaming" },
  { id: "stream-overlay", name: "Stream Overlay Package", description: "Webcam frame, alerts, panels, and screens", priceInCents: 500, robuxPrice: 400, category: "gaming" },
  { id: "youtube-thumbnails", name: "YouTube Thumbnail Pack (5)", description: "5 custom thumbnails for your content", priceInCents: 313, robuxPrice: 250, category: "gaming" },
  { id: "esports-kit", name: "Esports Team Kit", description: "Team logo, jersey mockup, banner, and social assets", priceInCents: 1000, robuxPrice: 800, category: "gaming" },

  // Business & Startup
  { id: "business-card", name: "Business Card Design", description: "Front and back with your branding", priceInCents: 250, robuxPrice: 200, category: "business" },
  { id: "pitch-deck", name: "Pitch Deck Design", description: "Up to 15 slides, fully designed and branded", priceInCents: 750, robuxPrice: 600, category: "business" },
  { id: "startup-brand", name: "Startup Brand Starter", description: "Logo + business card + social template + letterhead", priceInCents: 1000, robuxPrice: 800, category: "business" },
  { id: "presentation-template", name: "Presentation Template", description: "Reusable branded slide deck template", priceInCents: 375, robuxPrice: 300, category: "business" },
  { id: "letterhead-invoice", name: "Letterhead + Invoice", description: "Professional letterhead and invoice template", priceInCents: 250, robuxPrice: 200, category: "business" },

  // Marketing & Social Media
  { id: "social-single", name: "Social Media Post (Single)", description: "One custom graphic for any platform", priceInCents: 125, robuxPrice: 100, category: "marketing" },
  { id: "social-pack-10", name: "Social Media Pack (10)", description: "10 branded posts for Instagram, Twitter, etc.", priceInCents: 875, robuxPrice: 700, category: "marketing" },
  { id: "ad-creative", name: "Ad Creative Pack", description: "3 ad designs optimized for Facebook, IG, or Google", priceInCents: 375, robuxPrice: 300, category: "marketing" },
  { id: "banner-header", name: "Banner / Header Design", description: "Custom banner for any platform or website", priceInCents: 188, robuxPrice: 150, category: "marketing" },
  { id: "promo-flyer", name: "Promo Flyer / Poster", description: "Digital or print-ready promotional graphic", priceInCents: 250, robuxPrice: 200, category: "marketing" },
  { id: "email-header-sig", name: "Email Header + Signature", description: "Branded email header and signature graphic", priceInCents: 188, robuxPrice: 150, category: "marketing" },

  // Bundles
  { id: "bundle-creator", name: "Creator Starter", description: "Logo + Discord setup + 5 social posts + banner", priceInCents: 1000, robuxPrice: 800, category: "bundles" },
  { id: "bundle-business", name: "Business Launch", description: "Full brand kit + pitch deck + business cards + social pack", priceInCents: 1875, robuxPrice: 1500, category: "bundles" },
  { id: "bundle-gaming", name: "Gaming Community Kit", description: "5 ERLC liveries + Discord setup + team logo + banner", priceInCents: 1500, robuxPrice: 1200, category: "bundles" },
  { id: "bundle-full", name: "Full Service Package", description: "Brand kit + Discord + social pack + pitch deck + UI assets", priceInCents: 3000, robuxPrice: 2400, category: "bundles" },
];

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function formatRobux(amount: number): string {
  return `${amount.toLocaleString()} R$`;
}
