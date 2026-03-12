"use client"

import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"
import { MessageSquare, Check, ArrowUpRight, ArrowLeft } from "lucide-react"

const deliverables = [
  "Full server setup (channels, categories, roles, permissions)",
  "Bot installation & configuration (tickets, moderation, welcome)",
  "Custom embed sets (rules, info, announcements, tickets)",
  "Server banner, icon & invite splash design",
  "Moderation tools, automod & security setup",
  "Complete Discord package (server + bots + full branding)",
]

const process = [
  { step: "01", title: "Consultation", desc: "We discuss your community goals, target audience, and what features you need in your server." },
  { step: "02", title: "Architecture", desc: "We design the channel structure, role hierarchy, and permission system tailored to your needs." },
  { step: "03", title: "Build & Brand", desc: "We set up bots, create embeds, design assets, and configure every detail of your server." },
  { step: "04", title: "Handoff", desc: "You get a fully functional, branded server with documentation on how to manage everything." },
]

export default function CommunityServicePage() {
  const { ref: heroRef, isInView: heroVisible } = useInView()
  const { ref: contentRef, isInView: contentVisible } = useInView()

  return (
    <main>
      <Navigation />

      {/* Hero */}
      <section ref={heroRef} className="relative overflow-hidden pt-40 pb-24 lg:pt-52 lg:pb-32">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 h-[60vh] w-[60vh] rounded-full bg-blue-500/[0.05] blur-[200px]" />
          <div className="absolute bottom-0 right-1/3 h-[40vh] w-[40vh] rounded-full bg-cyan-500/[0.04] blur-[150px]" />
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
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 ring-1 ring-blue-500/20">
              <MessageSquare className="h-7 w-7 text-blue-400" />
            </div>
            <div>
              <h1
                className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Community & Discord
              </h1>
              <p className="mt-1 text-sm font-medium italic text-primary/70">Build a community that feels alive.</p>
            </div>
          </div>

          <div className="flex items-start gap-8">
            <p className={cn("max-w-2xl text-lg text-muted-foreground leading-relaxed", heroVisible && "animate-reveal-up stagger-2")}>
              From channel architecture to bot integrations, we design and set up Discord servers that look professional and run smoothly. Custom embeds, role systems, ticket bots, welcome flows, and branding -- everything your community needs to thrive.
            </p>
            <img
              src="/images/mascot/virox-heart.png"
              alt="ViroX mascot"
              className="hidden lg:block h-36 w-auto flex-shrink-0 drop-shadow-[0_0_20px_rgba(139,92,246,0.2)] animate-float"
              style={{ animationDelay: "0.5s" }}
            />
          </div>

          <div className={cn("mt-10 flex flex-wrap gap-4", heroVisible && "animate-reveal-up stagger-3")}>
            <Link
              href="/pricing#community"
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
            <div className={cn(contentVisible && "animate-reveal-up")}>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl" style={{ fontFamily: "var(--font-display)" }}>
                {"What's"} included
              </h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Everything from initial server creation to fully branded, bot-powered community hubs.
              </p>
              <ul className="mt-8 space-y-4">
                {deliverables.map((item, i) => (
                  <li key={item} className={cn("flex items-start gap-3", contentVisible && "animate-reveal-up", contentVisible && `stagger-${i + 1}`)}>
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-3.5 w-3.5 text-primary" />
                    </span>
                    <span className="text-sm text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={cn(contentVisible && "animate-reveal-up stagger-2")}>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl" style={{ fontFamily: "var(--font-display)" }}>
                Our process
              </h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                A structured build process that delivers a polished, functional server fast.
              </p>
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
