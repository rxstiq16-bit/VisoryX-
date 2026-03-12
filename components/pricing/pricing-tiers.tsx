"use client";

import React from "react";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shapes, MessageSquare, Gamepad2, Briefcase, Share2, Sparkles, ArrowUpRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/use-in-view";

type PricingItem = { name: string; description: string; usd: string; robux: string; popular?: boolean };
type PricingCategory = { id: string; title: string; subtitle: string; icon: React.ElementType; items: PricingItem[] };

const pricingCategories: PricingCategory[] = [
  {
    id: "branding", title: "Branding & Identity", subtitle: "Logos, brand kits & visual identity", icon: Shapes,
    items: [
      { name: "Logo Design", description: "Custom logo for any brand or project", usd: "$3.13", robux: "250" },
      { name: "Logo + Variations", description: "Primary logo + icon, wordmark, and dark/light versions", usd: "$5.00", robux: "400" },
      { name: "Full Brand Kit", description: "Logo, color palette, typography, style guide, and assets", usd: "$7.50", robux: "600", popular: true },
      { name: "Brand Refresh", description: "Modernize an existing brand with updated identity", usd: "$5.00", robux: "400" },
      { name: "Icon / Emblem Design", description: "Standalone icon, badge, or emblem", usd: "$1.88", robux: "150" },
    ],
  },
  {
    id: "community", title: "Community & Discord", subtitle: "Server setups, bots & community assets", icon: MessageSquare,
    items: [
      { name: "Discord Embeds", description: "Rules, info, ticket, or welcome embeds (per set)", usd: "$0.94", robux: "75" },
      { name: "Server Setup", description: "Channels, roles, permissions, and full layout", usd: "$6.25", robux: "500", popular: true },
      { name: "Bot Setup", description: "Bot installation, config, and moderation tools", usd: "$9.38", robux: "750" },
      { name: "Complete Discord Package", description: "Server + bot + embeds + branding", usd: "$15.00", robux: "1,200" },
      { name: "Server Banner + Icon", description: "Custom Discord server banner and icon set", usd: "$1.88", robux: "150" },
    ],
  },
  {
    id: "gaming", title: "Gaming & Creator Packs", subtitle: "Liveries, overlays, thumbnails & esports graphics", icon: Gamepad2,
    items: [
      { name: "ERLC Single Livery (LEO)", description: "One custom LEO vehicle livery", usd: "$1.88", robux: "150" },
      { name: "ERLC Single Livery (FD)", description: "One custom Fire Dept vehicle livery", usd: "$1.75", robux: "140" },
      { name: "ERLC Single Livery (CIV)", description: "One custom civilian vehicle livery", usd: "$1.25", robux: "100" },
      { name: "ERLC Single Livery (DoT)", description: "One custom DoT vehicle livery", usd: "$1.56", robux: "125" },
      { name: "ERLC 3-Vehicle Pack", description: "Three matching liveries for your department", usd: "$5.00", robux: "400", popular: true },
      { name: "ERLC 5-Vehicle Pack", description: "Full fleet package with 5 coordinated liveries", usd: "$8.75", robux: "700" },
      { name: "Stream Overlay Package", description: "Webcam frame, alerts, panels, and screens", usd: "$5.00", robux: "400" },
      { name: "YouTube Thumbnail Pack (5)", description: "5 custom thumbnails for your content", usd: "$3.13", robux: "250" },
      { name: "Esports Team Kit", description: "Team logo, jersey mockup, banner, and social assets", usd: "$10.00", robux: "800" },
    ],
  },
  {
    id: "business", title: "Business & Startup Kits", subtitle: "Pitch decks, business cards & professional graphics", icon: Briefcase,
    items: [
      { name: "Business Card Design", description: "Front and back with your branding", usd: "$2.50", robux: "200" },
      { name: "Pitch Deck Design", description: "Up to 15 slides, fully designed and branded", usd: "$7.50", robux: "600", popular: true },
      { name: "Startup Brand Starter", description: "Logo + business card + social template + letterhead", usd: "$10.00", robux: "800" },
      { name: "Presentation Template", description: "Reusable branded slide deck template", usd: "$3.75", robux: "300" },
      { name: "Letterhead + Invoice", description: "Professional letterhead and invoice template", usd: "$2.50", robux: "200" },
    ],
  },
  {
    id: "marketing", title: "Marketing & Social Media", subtitle: "Social posts, ads, banners & promo graphics", icon: Share2,
    items: [
      { name: "Social Media Post (Single)", description: "One custom graphic for any platform", usd: "$1.25", robux: "100" },
      { name: "Social Media Pack (10)", description: "10 branded posts for Instagram, Twitter, etc.", usd: "$8.75", robux: "700", popular: true },
      { name: "Ad Creative Pack", description: "3 ad designs optimized for Facebook, IG, or Google", usd: "$3.75", robux: "300" },
      { name: "Banner / Header Design", description: "Custom banner for any platform or website", usd: "$1.88", robux: "150" },
      { name: "Promo Flyer / Poster", description: "Digital or print-ready promotional graphic", usd: "$2.50", robux: "200" },
      { name: "Email Header + Signature", description: "Branded email header and signature graphic", usd: "$1.88", robux: "150" },
    ],
  },


];

const bundles = [
  { name: "Creator Starter", description: "Logo + Discord setup + 5 social posts + banner", usd: "$10.00", robux: "800", savings: "Save 20%", popular: true },
  { name: "Business Launch", description: "Full brand kit + pitch deck + business cards + social pack", usd: "$18.75", robux: "1,500", savings: "Save 25%" },
  { name: "Gaming Community Kit", description: "5 ERLC liveries + Discord setup + team logo + banner", usd: "$15.00", robux: "1,200", savings: "Save 20%" },
  { name: "Full Service Package", description: "Brand kit + Discord + social pack + pitch deck + UI assets", usd: "$30.00", robux: "2,400", savings: "Save 30%" },
];

export function PricingTiers() {
  const [openCategories, setOpenCategories] = useState<string[]>(["branding"]);
  const { ref, isInView } = useInView();

  const toggle = (id: string) => {
    setOpenCategories((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);
  };

  return (
    <section ref={ref} className="py-20 lg:py-32">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        {/* Currency note */}
        <div className={cn("mb-20 text-center", isInView && "animate-reveal-fade")}>
          <p className="text-sm text-muted-foreground">
            Prices listed in <span className="font-bold text-foreground">USD</span> with Robux equivalent.
            <span className="ml-1 text-xs text-muted-foreground/70">(100 Robux = $1.25 USD)</span>
          </p>
        </div>

        {/* Accordion-style categories */}
        <div className="space-y-4">
          {pricingCategories.map((cat, catIdx) => {
            const Icon = cat.icon;
            const isOpen = openCategories.includes(cat.id);
            return (
              <div
                key={cat.id}
                id={cat.id}
                className={cn(
                  "rounded-2xl border transition-all duration-500 overflow-hidden",
                  isOpen ? "border-primary/30 bg-card shadow-lg shadow-primary/5" : "border-border/50 bg-card/50 hover:border-border",
                  isInView && "animate-reveal-up",
                  isInView && `stagger-${Math.min(catIdx + 1, 8)}`
                )}
              >
                <button onClick={() => toggle(cat.id)} className="flex w-full items-center gap-5 p-6 lg:p-8 text-left transition-colors hover:bg-primary/[0.02]">
                  <div className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-300",
                    isOpen ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-secondary text-muted-foreground"
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>{cat.title}</h3>
                    <p className="text-sm text-muted-foreground">{cat.subtitle}</p>
                  </div>
                  <span className="hidden sm:block text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground mr-3">{cat.items.length} services</span>
                  <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform duration-300", isOpen && "rotate-180 text-primary")} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 lg:px-8 lg:pb-8 animate-reveal-fade">
                    <div className="border-t border-border/30 pt-6 space-y-3">
                      {cat.items.map((item) => (
                        <div key={item.name} className={cn(
                          "group flex items-center justify-between rounded-xl border p-5 transition-all duration-300 hover:border-primary/30 hover:bg-primary/[0.02]",
                          item.popular ? "border-primary/20 bg-primary/[0.03]" : "border-border/30"
                        )}>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-bold text-foreground">{item.name}</span>
                              {item.popular && <span className="rounded-full bg-primary/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">Popular</span>}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
                          </div>
                          <div className="text-right ml-4 shrink-0">
                            <div className="text-lg font-bold text-foreground">{item.usd}</div>
                            <div className="text-[11px] text-muted-foreground">{item.robux} R$</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bundles */}
        <div className="mt-28">
          <div className="mb-14">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">
              <span className="h-px w-8 bg-primary" />
              Bundles
            </span>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
              Save with packages
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {bundles.map((bundle) => (
              <div key={bundle.name} className={cn(
                "tilt-card group rounded-2xl border p-8 transition-all duration-500",
                bundle.popular ? "border-primary/30 bg-primary/[0.03] shadow-lg shadow-primary/5" : "border-border/50 bg-card hover:border-primary/20"
              )}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>{bundle.name}</h3>
                      {bundle.popular && <Sparkles className="h-4 w-4 text-primary" />}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{bundle.description}</p>
                  </div>
                  <div className="text-right ml-4 shrink-0">
                    <div className="text-3xl font-extrabold text-foreground">{bundle.usd}</div>
                    <div className="text-xs text-muted-foreground">{bundle.robux} R$</div>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-border/30 pt-5">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{bundle.savings}</span>
                  <Link href="/order" className="animated-underline inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-primary">
                    Order <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing notes */}
        <div className="mt-28 border-t border-border/30 pt-14">
          <h4 className="text-base font-bold text-foreground mb-8" style={{ fontFamily: "var(--font-display)" }}>Pricing Notes</h4>
          <div className="grid grid-cols-1 gap-4 text-sm text-muted-foreground sm:grid-cols-2">
            {[
              "We accept CashApp, PayPal, Chime, and Robux",
              "All packages include reasonable revisions",
              "Turnaround time depends on project scope",
              "Custom requests welcome at custom pricing",
              "Rush orders available for 25-50% extra",
              "Open to individuals, teams, businesses, and enterprises",
            ].map((note) => (
              <p key={note} className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {note}
              </p>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <Button asChild size="lg" className="magnetic-btn rounded-full px-12 h-14 text-sm font-bold uppercase tracking-[0.15em]">
            <Link href="/order" className="flex items-center gap-2">
              Place an Order <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
          <p className="mt-6 text-sm text-muted-foreground">
            Questions?{" "}
            <Link href="/contact" className="text-primary hover:underline">Contact us</Link> for custom quotes
          </p>
        </div>
      </div>
    </section>
  );
}
