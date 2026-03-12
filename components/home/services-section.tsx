"use client";

import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowUpRight, Palette, Car, Image, Layers } from "lucide-react";

const services = [
  {
    icon: Palette,
    title: "Branding & Identity",
    description: "Custom logos, brand kits, color palettes, and visual identities built to make your server, team, or business unmistakable.",
    tags: ["Logos", "Brand Kits", "Style Guides"],
    accent: "from-primary/20 to-primary/5",
    href: "/services/branding",
  },
  {
    icon: Car,
    title: "Gaming & Liveries",
    description: "ERLC liveries, FiveM wraps, stream overlays, thumbnails, esports kits, and full fleet packages with pixel-perfect precision.",
    tags: ["ERLC", "Overlays", "Esports"],
    accent: "from-accent/20 to-accent/5",
    href: "/services/gaming",
  },
  {
    icon: Image,
    title: "Marketing & Social",
    description: "Social media graphics, ad creatives, banners, promo flyers, and email assets that demand attention and drive engagement.",
    tags: ["Social Posts", "Ads", "Banners"],
    accent: "from-primary/20 to-accent/5",
    href: "/services/marketing",
  },
  {
    icon: Layers,
    title: "Community & Discord",
    description: "Full server setups, bot configuration, custom embeds, role systems, and branded Discord assets to build thriving communities.",
    tags: ["Server Setup", "Bots", "Embeds"],
    accent: "from-accent/20 to-primary/5",
    href: "/services/community",
  },
];

export function ServicesSection() {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} className="relative py-32 lg:py-44 overflow-hidden">
      {/* BG accent */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 h-[60vh] w-[60vh] rounded-full bg-primary/[0.03] blur-[150px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-20", isInView && "animate-reveal-up")}>
          <div className="flex items-end gap-6">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">
                <span className="h-px w-8 bg-primary" />
                Services
              </span>
              <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance" style={{ fontFamily: "var(--font-display)" }}>
                What we create
              </h2>
            </div>
            <img
              src="/images/mascot/virox-sunglasses.png"
              alt="ViroX mascot with sunglasses"
              className="hidden md:block h-28 w-auto drop-shadow-[0_0_20px_rgba(139,92,246,0.2)] animate-float -mb-2"
            />
          </div>
          <Link href="/pricing" className="animated-underline inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground">
            View Pricing <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {services.map((service, i) => (
            <Link
              key={service.title}
              href={service.href}
              className={cn(
                "tilt-card group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-8 lg:p-10 transition-all duration-500",
                isInView && "animate-reveal-up",
                isInView && `stagger-${i + 1}`
              )}
            >
              {/* Gradient bg on hover */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100",
                service.accent
              )} />

              <div className="relative z-10">
                {/* Icon */}
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20 transition-all duration-300 group-hover:bg-primary group-hover:ring-primary/40 group-hover:scale-110">
                  <service.icon className="h-6 w-6 text-primary transition-colors group-hover:text-primary-foreground" />
                </div>

                {/* Content */}
                <h3 className="mt-8 text-2xl font-bold text-foreground transition-colors group-hover:text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                  {service.title}
                </h3>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-md">
                  {service.description}
                </p>

                {/* Tags */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-border/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground transition-colors group-hover:border-primary/30 group-hover:text-foreground">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Arrow */}
                <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground transition-all group-hover:text-primary group-hover:gap-3">
                  View Services <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
