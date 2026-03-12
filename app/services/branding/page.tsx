"use client"

import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"
import { Shapes, Check, ArrowUpRight, ArrowLeft } from "lucide-react"

const deliverables = [
  "Custom logo design with 3+ unique concepts",
  "Logo variations (icon, wordmark, dark/light, monochrome)",
  "Color palette with hex, RGB & CMYK codes",
  "Typography system with primary and secondary fonts",
  "Full brand style guide document (PDF)",
  "Brand refresh & modernization of existing identities",
  "Standalone icons, emblems & badge designs",
]

const process = [
  { step: "01", title: "Discovery", desc: "We learn your vision, audience, and goals through a detailed intake form and optional voice call." },
  { step: "02", title: "Concepts", desc: "We create 3+ distinct logo concepts and present initial brand directions for your review." },
  { step: "03", title: "Refinement", desc: "You pick your favorite direction and we refine it with unlimited revisions until it is perfect." },
  { step: "04", title: "Delivery", desc: "You receive all final files, brand guide, and source files ready for immediate use everywhere." },
]

export default function BrandingServicePage() {
  const { ref: heroRef, isInView: heroVisible } = useInView()
  const { ref: contentRef, isInView: contentVisible } = useInView()

  return (
    <main>
      <Navigation />

      {/* Hero */}
      <section ref={heroRef} className="relative overflow-hidden pt-40 pb-24 lg:pt-52 lg:pb-32">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 h-[60vh] w-[60vh] rounded-full bg-violet-500/[0.05] blur-[200px]" />
          <div className="absolute bottom-0 right-1/3 h-[40vh] w-[40vh] rounded-full bg-purple-500/[0.04] blur-[150px]" />
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Link
            href="/services"
            className={cn("group mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary", heroVisible && "animate-reveal-up")}
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            All Services
          </Link>

          <div className={cn("flex items-center gap-5 mb-8", heroVisible && "animate-reveal-up stagger-1")}>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 ring-1 ring-violet-500/20">
              <Shapes className="h-7 w-7 text-violet-400" />
            </div>
            <div>
              <h1
                className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Branding & Identity
              </h1>
              <p className="mt-1 text-sm font-medium italic text-primary/70">Your brand, unforgettable.</p>
            </div>
          </div>

          <div className="flex items-start gap-8">
            <p className={cn("max-w-2xl text-lg text-muted-foreground leading-relaxed", heroVisible && "animate-reveal-up stagger-2")}>
              We craft complete visual identities from scratch -- logos, color systems, typography, style guides, and brand assets that make your server, org, or business instantly recognizable. Whether you need a clean wordmark or a full brand overhaul, every element is designed with intention.
            </p>
            <img
              src="/images/mascot/virox-fingerpoint.png"
              alt="ViroX mascot"
              className="hidden lg:block h-40 w-auto flex-shrink-0 drop-shadow-[0_0_20px_rgba(139,92,246,0.2)] animate-float"
            />
          </div>

          <div className={cn("mt-10 flex flex-wrap gap-4", heroVisible && "animate-reveal-up stagger-3")}>
            <Link
              href="/pricing#branding"
              className="magnetic-btn inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-bold uppercase tracking-[0.1em] text-primary-foreground transition-all hover:brightness-110"
            >
              View Prices <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/order"
              className="inline-flex items-center gap-2 rounded-full border border-border/50 px-7 py-3 text-sm font-bold uppercase tracking-[0.1em] text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground"
            >
              Start Order
            </Link>
          </div>
        </div>
      </section>

      {/* Content */}
      <section ref={contentRef} className="relative pb-32 lg:pb-44">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">

            {/* What's Included */}
            <div className={cn(contentVisible && "animate-reveal-up")}>
              <h2
                className="text-2xl font-bold text-foreground sm:text-3xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {"What's"} included
              </h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Every branding project includes comprehensive deliverables tailored to your needs and platform.
              </p>
              <ul className="mt-8 space-y-4">
                {deliverables.map((item, i) => (
                  <li
                    key={item}
                    className={cn("flex items-start gap-3", contentVisible && "animate-reveal-up", contentVisible && `stagger-${i + 1}`)}
                  >
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-3.5 w-3.5 text-primary" />
                    </span>
                    <span className="text-sm text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Our Process */}
            <div className={cn(contentVisible && "animate-reveal-up stagger-2")}>
              <h2
                className="text-2xl font-bold text-foreground sm:text-3xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Our process
              </h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                A streamlined workflow that gets you from concept to finished brand in days, not weeks.
              </p>
              <div className="mt-8 space-y-6">
                {process.map((item, i) => (
                  <div
                    key={item.step}
                    className={cn(
                      "group relative rounded-xl border border-border/30 bg-card/50 p-6 transition-all duration-300 hover:border-primary/20",
                      contentVisible && "animate-reveal-up",
                      contentVisible && `stagger-${i + 3}`
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-3xl font-extrabold text-primary/20" style={{ fontFamily: "var(--font-display)" }}>
                        {item.step}
                      </span>
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
