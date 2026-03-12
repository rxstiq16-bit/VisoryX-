"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Palette,
  Sparkles,
  Shield,
  Star,
  Flame,
  Zap,
  Crown,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/* ─── CSS-based design mockups ─────────────────────────────────────────── */

function PoliceLiveryMockup({ className }: { className?: string }) {
  return (
    <div className={cn("relative w-full h-full bg-[#0c1220] flex items-center justify-center overflow-hidden", className)}>
      {/* Background grid */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      {/* Vehicle body */}
      <div className="relative w-[75%] max-w-[400px]">
        <div className="relative bg-[#1a1a2e] rounded-lg border border-white/10 overflow-hidden">
          {/* Roof bar */}
          <div className="flex items-center justify-center gap-1 py-1 bg-[#111827]">
            <div className="w-3 h-1.5 rounded-sm bg-blue-500 animate-pulse" />
            <div className="w-3 h-1.5 rounded-sm bg-red-500 animate-pulse" style={{ animationDelay: "0.5s" }} />
            <div className="w-3 h-1.5 rounded-sm bg-blue-500 animate-pulse" />
          </div>
          {/* Body */}
          <div className="relative px-4 py-6">
            {/* White base with blue stripe */}
            <div className="absolute inset-x-0 top-0 h-1/2 bg-white/95" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[#1e3a5f]" />
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[3px] bg-yellow-400" />
            {/* Badge */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex flex-col items-center">
                <Shield className="h-8 w-8 text-[#1e3a5f] drop-shadow-sm" />
                <span className="text-[8px] font-bold text-[#1e3a5f] tracking-wider mt-0.5">LCPD</span>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold text-[#1e3a5f] tracking-[0.15em]">LIBERTY COUNTY</div>
                <div className="text-[7px] font-medium text-[#1e3a5f]/80 tracking-[0.2em]">POLICE DEPARTMENT</div>
                <div className="text-lg font-black text-[#1e3a5f] leading-none mt-0.5">207</div>
              </div>
            </div>
          </div>
          {/* Wheels */}
          <div className="flex justify-between px-6 -mb-3">
            <div className="w-8 h-8 rounded-full bg-[#111] border-2 border-gray-600 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-gray-500" />
            </div>
            <div className="w-8 h-8 rounded-full bg-[#111] border-2 border-gray-600 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-gray-500" />
            </div>
          </div>
        </div>
        <div className="text-center mt-4">
          <span className="text-[10px] uppercase tracking-[0.25em] text-white/30 font-medium">ERLC Vehicle Livery</span>
        </div>
      </div>
    </div>
  );
}

function GamingLogoMockup({ className }: { className?: string }) {
  return (
    <div className={cn("relative w-full h-full bg-[#0a0a14] flex items-center justify-center overflow-hidden", className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-purple-500/5" />
      <div className="relative flex flex-col items-center gap-4">
        {/* Shield logo */}
        <div className="relative">
          <div className="w-28 h-32 bg-gradient-to-b from-amber-400 to-amber-600 clip-shield flex items-center justify-center" style={{ clipPath: "polygon(50% 0%, 100% 15%, 100% 70%, 50% 100%, 0% 70%, 0% 15%)" }}>
            <div className="w-[calc(100%-4px)] h-[calc(100%-4px)] bg-[#0a0a14] flex items-center justify-center" style={{ clipPath: "polygon(50% 0%, 100% 15%, 100% 70%, 50% 100%, 0% 70%, 0% 15%)" }}>
              <Crown className="w-12 h-12 text-amber-400 drop-shadow-lg" />
            </div>
          </div>
          <div className="absolute -inset-2 bg-amber-400/20 blur-xl rounded-full -z-10" />
        </div>
        <div className="text-center">
          <div className="text-xl font-black tracking-[0.3em] text-white">APEX</div>
          <div className="text-[10px] tracking-[0.5em] text-amber-400/80 font-medium">GAMING</div>
        </div>
        <div className="flex gap-8 mt-2">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-amber-400/50" />
          <Star className="w-3 h-3 text-amber-400/60" />
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-amber-400/50" />
        </div>
      </div>
    </div>
  );
}

function DiscordBannerMockup({ className }: { className?: string }) {
  return (
    <div className={cn("relative w-full h-full bg-gradient-to-r from-[#1a0533] via-[#0f0a2e] to-[#0a1628] flex items-center justify-center overflow-hidden", className)}>
      {/* Neon lines */}
      <div className="absolute top-[20%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
      <div className="absolute bottom-[25%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      {/* Geometric shapes */}
      <div className="absolute top-[15%] left-[10%] w-16 h-16 border border-purple-500/20 rotate-45" />
      <div className="absolute bottom-[20%] right-[15%] w-12 h-12 border border-blue-500/15 rotate-12" />
      {/* Main text */}
      <div className="relative text-center z-10">
        <div className="text-3xl font-black tracking-wider text-white" style={{ textShadow: "0 0 30px rgba(168,85,247,0.4)" }}>
          NOVA <span className="text-purple-400">RP</span>
        </div>
        <div className="text-[9px] tracking-[0.4em] text-purple-300/60 font-medium mt-1">ROLEPLAY COMMUNITY</div>
        <div className="mt-3 flex items-center justify-center gap-3">
          <div className="w-8 h-px bg-purple-500/50" />
          <Zap className="w-3 h-3 text-purple-400/60" />
          <div className="w-8 h-px bg-purple-500/50" />
        </div>
      </div>
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full" />
    </div>
  );
}

function BrandingMockup({ className }: { className?: string }) {
  return (
    <div className={cn("relative w-full h-full bg-[#0c0c0c] flex items-center justify-center overflow-hidden p-6", className)}>
      <div className="grid grid-cols-2 gap-3 w-full max-w-[380px]">
        {/* Logo card */}
        <div className="bg-white rounded-lg p-4 flex flex-col items-center justify-center aspect-square">
          <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center mb-2">
            <span className="text-white font-black text-sm">M</span>
          </div>
          <span className="text-[8px] font-bold text-gray-900 tracking-[0.2em]">MERIDIAN</span>
          <span className="text-[6px] text-gray-500 tracking-widest">STUDIOS</span>
        </div>
        {/* Business card */}
        <div className="bg-teal-500 rounded-lg p-3 flex flex-col justify-between aspect-square">
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-white font-bold text-[8px]">M</span>
          </div>
          <div>
            <div className="text-[8px] font-bold text-white">JOHN SMITH</div>
            <div className="text-[6px] text-white/70">Creative Director</div>
          </div>
        </div>
        {/* Letterhead */}
        <div className="bg-white rounded-lg p-3 flex flex-col aspect-square">
          <div className="flex items-center gap-1 mb-2">
            <div className="w-3 h-3 rounded-full bg-teal-500" />
            <div className="text-[6px] font-bold text-gray-900">MERIDIAN</div>
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <div className="h-1 bg-gray-200 rounded-full w-full" />
            <div className="h-1 bg-gray-200 rounded-full w-3/4" />
            <div className="h-1 bg-gray-200 rounded-full w-5/6" />
            <div className="h-1 bg-gray-200 rounded-full w-2/3" />
          </div>
        </div>
        {/* Color palette */}
        <div className="bg-gray-900 rounded-lg p-3 flex flex-col justify-center gap-2 aspect-square">
          <div className="flex gap-1.5">
            <div className="w-5 h-5 rounded bg-teal-500" />
            <div className="w-5 h-5 rounded bg-teal-700" />
            <div className="w-5 h-5 rounded bg-gray-800" />
            <div className="w-5 h-5 rounded bg-white" />
          </div>
          <div className="text-[6px] text-gray-500 uppercase tracking-widest">Brand Colors</div>
          <div className="flex gap-1.5 mt-1">
            <div className="text-[5px] text-gray-600">#14B8A6</div>
            <div className="text-[5px] text-gray-600">#0F766E</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FireLiveryMockup({ className }: { className?: string }) {
  return (
    <div className={cn("relative w-full h-full bg-[#120808] flex items-center justify-center overflow-hidden", className)}>
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      <div className="relative w-[75%] max-w-[400px]">
        <div className="relative bg-[#1a0808] rounded-lg border border-red-900/30 overflow-hidden">
          {/* Roof lights */}
          <div className="flex items-center justify-center gap-2 py-1 bg-[#0c0404]">
            <div className="w-4 h-1.5 rounded-sm bg-red-500 animate-pulse" />
            <div className="w-4 h-1.5 rounded-sm bg-amber-400 animate-pulse" style={{ animationDelay: "0.3s" }} />
            <div className="w-4 h-1.5 rounded-sm bg-red-500 animate-pulse" style={{ animationDelay: "0.6s" }} />
          </div>
          <div className="relative px-4 py-6">
            <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-red-600 to-red-800" />
            <div className="absolute inset-x-0 bottom-[30%] h-[3px] bg-white/70" />
            <div className="absolute inset-x-0 bottom-[25%] h-[2px] bg-yellow-400/60" />
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex flex-col items-center">
                <Flame className="h-7 w-7 text-white drop-shadow-lg" />
                <span className="text-[7px] font-bold text-white tracking-wider mt-0.5">LCFR</span>
              </div>
              <div className="text-right">
                <div className="text-[9px] font-bold text-white tracking-[0.15em]">LIBERTY COUNTY</div>
                <div className="text-[7px] font-medium text-white/80 tracking-[0.15em]">FIRE RESCUE</div>
                <div className="text-lg font-black text-white leading-none mt-0.5">E-41</div>
              </div>
            </div>
          </div>
          <div className="flex justify-between px-8 -mb-3">
            <div className="w-9 h-9 rounded-full bg-[#111] border-2 border-gray-700 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-gray-600" />
            </div>
            <div className="w-9 h-9 rounded-full bg-[#111] border-2 border-gray-700 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-gray-600" />
            </div>
          </div>
        </div>
        <div className="text-center mt-4">
          <span className="text-[10px] uppercase tracking-[0.25em] text-white/30 font-medium">ERLC Vehicle Livery</span>
        </div>
      </div>
    </div>
  );
}

function SocialPackMockup({ className }: { className?: string }) {
  return (
    <div className={cn("relative w-full h-full bg-[#0a0a0a] flex items-center justify-center overflow-hidden p-6", className)}>
      <div className="flex items-end gap-3">
        {/* Instagram post */}
        <div className="w-28 h-28 bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-lg border border-white/10 p-2.5 flex flex-col">
          <div className="flex-1 bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded flex items-center justify-center">
            <Zap className="w-6 h-6 text-orange-500" />
          </div>
          <div className="mt-1.5">
            <div className="text-[7px] font-bold text-white">VORTEX</div>
            <div className="text-[5px] text-orange-400">Match Day</div>
          </div>
        </div>
        {/* Story */}
        <div className="w-16 h-28 bg-gradient-to-b from-orange-500/20 to-[#0d0d0d] rounded-lg border border-white/10 p-2 flex flex-col items-center justify-between">
          <Zap className="w-4 h-4 text-orange-400" />
          <div className="text-center">
            <div className="text-[6px] font-bold text-white">LIVE</div>
            <div className="text-[5px] text-orange-300/60">NOW</div>
          </div>
          <div className="w-full h-1 bg-orange-500/40 rounded-full" />
        </div>
        {/* Profile pic */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center border-2 border-orange-400/30">
            <span className="text-white font-black text-sm">VX</span>
          </div>
          <span className="text-[6px] text-white/40 uppercase tracking-widest">Profile</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Showcase items ───────────────────────────────────────────────────── */

const showcaseItems = [
  {
    id: "police-livery",
    title: "LCPD Patrol Cruiser",
    category: "ERLC Liveries",
    description: "Full patrol vehicle wrap for Liberty County Police Department with custom badge placement, unit numbers, and department branding.",
    Mockup: PoliceLiveryMockup,
    tags: ["LEO", "Vehicle Wrap", "ERLC"],
    stats: { deliveryTime: "2 days", revisions: 3, satisfaction: "100%" },
  },
  {
    id: "gaming-logo",
    title: "Apex Gaming Logo",
    category: "Logo Design",
    description: "Bold shield emblem with stylized eagle for a competitive gaming community. Designed for Discord, social media, and merchandise.",
    Mockup: GamingLogoMockup,
    tags: ["Logo", "Gaming", "Branding"],
    stats: { deliveryTime: "3 days", revisions: 2, satisfaction: "100%" },
  },
  {
    id: "discord-banner",
    title: "Nova RP Server Banner",
    category: "Banners",
    description: "Wide-format Discord banner with neon accents and geometric elements for a Roblox roleplay community.",
    Mockup: DiscordBannerMockup,
    tags: ["Discord", "Banner", "Roleplay"],
    stats: { deliveryTime: "1 day", revisions: 1, satisfaction: "100%" },
  },
  {
    id: "full-branding",
    title: "Meridian Studios Identity",
    category: "Branding",
    description: "Complete brand identity package including logo, business cards, letterhead templates, and color palette in a cohesive teal and white palette.",
    Mockup: BrandingMockup,
    tags: ["Full Identity", "Brand Kit", "Professional"],
    stats: { deliveryTime: "5 days", revisions: 4, satisfaction: "100%" },
  },
  {
    id: "fire-livery",
    title: "LCFR Engine 41",
    category: "ERLC Liveries",
    description: "Fire rescue engine livery with department branding, unit markings, and Maltese cross emblem placement.",
    Mockup: FireLiveryMockup,
    tags: ["Fire", "Vehicle Wrap", "ERLC"],
    stats: { deliveryTime: "2 days", revisions: 2, satisfaction: "100%" },
  },
  {
    id: "social-pack",
    title: "Vortex Esports Social Pack",
    category: "Social Media",
    description: "Cohesive social media design package with Instagram post, story, and profile templates in a dark theme with orange accents.",
    Mockup: SocialPackMockup,
    tags: ["Social Media", "Instagram", "Esports"],
    stats: { deliveryTime: "3 days", revisions: 2, satisfaction: "100%" },
  },
];

/* ─── Main Component ───────────────────────────────────────────────────── */

export function PortfolioShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = showcaseItems[activeIndex];
  const ActiveMockup = activeItem.Mockup;

  const goNext = () => setActiveIndex((i) => (i + 1) % showcaseItems.length);
  const goPrev = () => setActiveIndex((i) => (i - 1 + showcaseItems.length) % showcaseItems.length);

  return (
    <section className="py-16 lg:py-24 border-b border-border">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            Featured Work
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Interactive Design Showcase
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Explore our recent projects. Each piece is crafted with precision, from concept sketches through to pixel-perfect delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Left: Main Preview */}
          <div className="lg:col-span-3 space-y-4">
            {/* Large CSS mockup preview */}
            <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-card">
              <ActiveMockup className="w-full h-full" />
              {/* Gradient overlay at bottom */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/90 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 inset-x-0 p-6 pointer-events-none">
                <span className="inline-block rounded-full bg-primary/20 backdrop-blur-sm px-3 py-1 text-xs font-medium text-primary mb-2">
                  {activeItem.category}
                </span>
                <h3 className="text-xl font-bold text-foreground">{activeItem.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-lg">{activeItem.description}</p>
              </div>
              {/* Navigation arrows */}
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border text-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-background"
                aria-label="Previous project"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border text-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-background"
                aria-label="Next project"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              {/* Dots */}
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-1.5">
                {showcaseItems.map((_, i) => (
                  <button
                    key={showcaseItems[i].id}
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      i === activeIndex
                        ? "w-6 bg-primary"
                        : "w-1.5 bg-foreground/30 hover:bg-foreground/50",
                    )}
                    aria-label={`View project ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnail strip -- CSS mini-mockups */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {showcaseItems.map((item, i) => {
                const ThumbMockup = item.Mockup;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    className={cn(
                      "relative shrink-0 h-16 w-24 rounded-lg overflow-hidden border-2 transition-all",
                      i === activeIndex
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border opacity-60 hover:opacity-100",
                    )}
                  >
                    <ThumbMockup className="w-full h-full" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Details panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project stats */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Eye className="h-4 w-4 text-primary" />
                Project Details
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium text-foreground">{activeItem.category}</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="font-medium text-foreground">{activeItem.stats.deliveryTime}</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Revisions</span>
                  <span className="font-medium text-foreground">{activeItem.stats.revisions}</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Satisfaction</span>
                  <span className="font-medium text-primary">{activeItem.stats.satisfaction}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-border">
                {activeItem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Color palette */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Palette className="h-4 w-4 text-primary" />
                Design Philosophy
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every project starts by understanding the client's vision. We prioritize clean lines, strong typography, and cohesive palettes that scale across platforms and sizes.
              </p>
            </div>

            {/* CTA */}
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
              <h4 className="font-semibold text-foreground mb-2">Want something like this?</h4>
              <p className="text-sm text-muted-foreground mb-4">Get a custom design tailored to your brand.</p>
              <Button asChild className="w-full">
                <Link href="/order">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Start Your Order
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
