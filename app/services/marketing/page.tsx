"use client"

import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"
import { Share2, Check, ArrowUpRight, ArrowLeft } from "lucide-react"

const deliverables = [
  "Social media post templates (Instagram, Twitter/X, TikTok)",
  "Ad creatives optimized for each platform (Meta, TikTok, Google)",
  "Banner & header designs (YouTube, Twitch, Discord, Twitter)",
  "Flyer & promotional poster graphics",
  "Email header & newsletter design templates",
  "Social media brand kit (templates + story highlights + banners)",
]

const process = [
  { step: "01", title: "Strategy", desc: "We understand your brand voice, target audience, and the platforms you need assets for." },
  { step: "02", title: "Create", desc: "We design scroll-stopping graphics optimized for engagement on every platform you specified." },
  { step: "03", title: "Refine", desc: "Review each design in context -- we adjust layouts, copy placement, and colors until perfect." },
  { step: "04", title: "Launch", desc: "Receive organized files by platform, ready to schedule and post. Templates are fully editable." },
]

export default function MarketingServicePage() {
  const { ref: heroRef, isInView: heroVisible } = useInView()
  const { ref: contentRef, isInView: contentVisible } = useInView()

  return (
    <main>
      <Navigation />

      <section ref={heroRef} className="relative overflow-hidden pt-40 pb-24 lg:pt-52 lg:pb-32">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 h-[60vh] w-[60vh] rounded-full bg-pink-500/[0.05] blur-[200px]" />
          <div className="absolute bottom-0 right-1/3 h-[40vh] w-[40vh] rounded-full bg-rose-500/[0.04] blur-[150px]" />
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Link href="/services" className={cn("group mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary", heroVisible && "animate-reveal-up")}>
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" /> All Services
          </Link>

          <div className={cn("flex items-center gap-5 mb-8", heroVisible && "animate-reveal-up stagger-1")}>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-500/10 ring-1 ring-pink-500/20">
              <Share2 className="h-7 w-7 text-pink-400" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl" style={{ fontFamily: "var(--font-display)" }}>
                Marketing & Social Media
              </h1>
              <p className="mt-1 text-sm font-medium italic text-primary/70">Scroll-stopping creative.</p>
            </div>
          </div>

          <div className="flex items-start gap-8">
            <p className={cn("max-w-2xl text-lg text-muted-foreground leading-relaxed", heroVisible && "animate-reveal-up stagger-2")}>
              Social media posts, ad creatives, banners, flyers, email headers, and promotional graphics designed to grab attention and drive results. We create assets optimized for every platform so your content always looks its best.
            </p>
            <img
              src="/images/mascot/virox-sparkle.png"
              alt="ViroX mascot"
              className="hidden lg:block h-36 w-auto flex-shrink-0 drop-shadow-[0_0_20px_rgba(139,92,246,0.2)] animate-float"
              style={{ animationDelay: "0.7s" }}
            />
          </div>

          <div className={cn("mt-10 flex flex-wrap gap-4", heroVisible && "animate-reveal-up stagger-3")}>
            <Link href="/pricing#marketing" className="magnetic-btn inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-bold uppercase tracking-[0.1em] text-primary-foreground transition-all hover:brightness-110">
              View Prices <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link href="/order" className="inline-flex items-center gap-2 rounded-full border border-border/50 px-7 py-3 text-sm font-bold uppercase tracking-[0.1em] text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground">
              Start Order
            </Link>
          </div>
        </div>
      </section>

      <section ref={contentRef} className="relative pb-32 lg:pb-44">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            <div className={cn(contentVisible && "animate-reveal-up")}>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl" style={{ fontFamily: "var(--font-display)" }}>{"What's"} included</h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">Platform-optimized graphics designed for maximum engagement and brand consistency.</p>
              <ul className="mt-8 space-y-4">
                {deliverables.map((item, i) => (
                  <li key={item} className={cn("flex items-start gap-3", contentVisible && "animate-reveal-up", contentVisible && `stagger-${i + 1}`)}>
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10"><Check className="h-3.5 w-3.5 text-primary" /></span>
                    <span className="text-sm text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={cn(contentVisible && "animate-reveal-up stagger-2")}>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl" style={{ fontFamily: "var(--font-display)" }}>Our process</h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">From content strategy to ready-to-post assets, we keep your brand consistent everywhere.</p>
              <div className="mt-8 space-y-6">
                {process.map((item, i) => (
                  <div key={item.step} className={cn("group relative rounded-xl border border-border/30 bg-card/50 p-6 transition-all duration-300 hover:border-primary/20", contentVisible && "animate-reveal-up", contentVisible && `stagger-${i + 3}`)}>
                    <div className="flex items-start gap-4">
                      <span className="text-3xl font-extrabold text-primary/20" style={{ fontFamily: "var(--font-display)" }}>{item.step}</span>
                      <div>
                        <h3 className="text-base font-bold text-foreground">{item.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
