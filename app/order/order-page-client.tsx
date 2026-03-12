"use client";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { OrderForm } from "@/components/order/order-form";
import { Shield, Clock, Sparkles, HelpCircle, MessageCircle, Palette, ArrowUpRight } from "lucide-react";
import Link from "next/link";

function TrustBadges() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {[
        { icon: Shield, title: "Secure Payment", desc: "CashApp, PayPal, Robux accepted" },
        { icon: Clock, title: "Fast Delivery", desc: "Most orders in 1-3 days" },
        { icon: Sparkles, title: "Free Revisions", desc: "Up to 2 included" },
      ].map((item) => (
        <div key={item.title} className="tilt-card flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
            <item.icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">{item.title}</p>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function NeedHelp() {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-8">
      <div className="flex items-start gap-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
          <HelpCircle className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h4 className="text-base font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>Not sure what to order?</h4>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Check out our{" "}
            <Link href="/portfolio" className="text-primary hover:underline">portfolio</Link>{" "}
            for examples, or{" "}
            <Link href="/contact" className="text-primary hover:underline">contact us</Link>{" "}
            and we will help you figure out the best option.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/portfolio" className="inline-flex items-center gap-2 rounded-full border border-border/50 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors">
              <Palette className="h-3.5 w-3.5" /> Portfolio
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-border/50 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors">
              <MessageCircle className="h-3.5 w-3.5" /> Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OrderPageClient() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative flex items-end min-h-[70vh] overflow-hidden bg-background grain pt-40 pb-24">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-[25%] -left-[10%] h-[55vh] w-[55vh] rounded-full bg-primary/[0.06] blur-[150px] animate-float-slow" />
            <div className="absolute -bottom-[15%] -right-[5%] h-[40vh] w-[40vh] rounded-full bg-accent/[0.04] blur-[120px] animate-float" style={{ animationDelay: "2.5s" }} />
            <div className="absolute top-[20%] right-[20%] h-[220px] w-[220px] rounded-full border border-primary/[0.06] animate-spin-slow" />
          </div>
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 relative z-10">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-primary animate-reveal-blur">
              <span className="h-px w-8 bg-primary" />
              Place an Order
            </span>
            <h1
              className="mt-6 max-w-4xl text-[clamp(3rem,7vw,6rem)] font-extrabold leading-[0.9] tracking-tight text-foreground animate-reveal-up stagger-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Start your{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
                project
              </span>
            </h1>
            <p className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed animate-reveal-blur stagger-2">
              Pick a service, describe what you need, and we will handle the rest.
              Most orders are completed within 1-3 business days.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-6 lg:px-8 py-20 space-y-10">
          <TrustBadges />
          <OrderForm />
          <NeedHelp />
        </div>
      </main>
      <Footer />
    </div>
  );
}
