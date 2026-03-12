"use client"

import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"
import { Shapes, MessageSquare, Gamepad2, Briefcase, Share2, ArrowUpRight } from "lucide-react"

const categories = [
  {
    href: "/services/branding",
    title: "Branding & Identity",
    tagline: "Your brand, unforgettable.",
    description: "Custom logos, brand kits, color systems, style guides, and complete visual identities.",
    icon: Shapes,
    accent: "from-violet-500/20 via-purple-500/10 to-transparent",
    ring: "ring-violet-500/20 hover:ring-violet-500/40",
  },
  {
    href: "/services/community",
    title: "Community & Discord",
    tagline: "Build a community that feels alive.",
    description: "Server setups, bot configuration, custom embeds, role systems, and branded Discord assets.",
    icon: MessageSquare,
    accent: "from-blue-500/20 via-cyan-500/10 to-transparent",
    ring: "ring-blue-500/20 hover:ring-blue-500/40",
  },
  {
    href: "/services/gaming",
    title: "Gaming & Creator Packs",
    tagline: "Pixel-perfect for every platform.",
    description: "ERLC liveries, FiveM wraps, stream overlays, thumbnails, and esports team kits.",
    icon: Gamepad2,
    accent: "from-emerald-500/20 via-green-500/10 to-transparent",
    ring: "ring-emerald-500/20 hover:ring-emerald-500/40",
  },
  {
    href: "/services/business",
    title: "Business & Startup Kits",
    tagline: "Professional from day one.",
    description: "Pitch decks, business cards, letterheads, email signatures, and launch kits.",
    icon: Briefcase,
    accent: "from-amber-500/20 via-orange-500/10 to-transparent",
    ring: "ring-amber-500/20 hover:ring-amber-500/40",
  },
  {
    href: "/services/marketing",
    title: "Marketing & Social Media",
    tagline: "Scroll-stopping creative.",
    description: "Social media graphics, ad creatives, banners, flyers, and email templates.",
    icon: Share2,
    accent: "from-pink-500/20 via-rose-500/10 to-transparent",
    ring: "ring-pink-500/20 hover:ring-pink-500/40",
  },
]

export default function ServicesPage() {
  const { ref: heroRef, isInView: heroVisible } = useInView()
  const { ref: gridRef, isInView: gridVisible } = useInView()

  return (
    <main>
      <Navigation />

      {/* Hero */}
      <section ref={heroRef} className="relative overflow-hidden pt-40 pb-20 lg:pt-52 lg:pb-28">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-1/3 left-1/4 h-[50vh] w-[50vh] rounded-full bg-primary/[0.04] blur-[180px]" />
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-end justify-between gap-8">
            <div className={cn("max-w-3xl", heroVisible && "animate-reveal-up")}>
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">
                <span className="h-px w-8 bg-primary" />
                Our Services
              </span>
              <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl text-balance" style={{ fontFamily: "var(--font-display)" }}>
                Everything we design.
              </h1>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
                Five specialized service categories built for gaming communities, content creators, and businesses.
              </p>
            </div>
            <img
              src="/images/mascot/virox-arms-crossed.png"
              alt="ViroX mascot"
              className={cn("hidden lg:block h-52 w-auto drop-shadow-[0_0_30px_rgba(139,92,246,0.25)] animate-float flex-shrink-0", heroVisible && "animate-reveal-blur")}
            />
          </div>
        </div>
      </section>

      {/* Grid */}
      <section ref={gridRef} className="relative pb-32 lg:pb-44">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat, i) => {
              const Icon = cat.icon
              return (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className={cn(
                    "tilt-card group relative overflow-hidden rounded-2xl border border-border/40 bg-card p-8 transition-all duration-500 hover:border-primary/30",
                    gridVisible && "animate-reveal-up",
                    gridVisible && `stagger-${i + 1}`
                  )}
                >
                  <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-700 group-hover:opacity-100", cat.accent)} />
                  <div className="relative z-10">
                    <div className={cn("flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 ring-1 transition-all duration-300 group-hover:scale-110", cat.ring)}>
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="mt-6 text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>{cat.title}</h2>
                    <p className="mt-1 text-xs font-medium italic text-primary/60">{cat.tagline}</p>
                    <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{cat.description}</p>
                    <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground transition-all group-hover:text-primary group-hover:gap-3">
                      Learn More <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
