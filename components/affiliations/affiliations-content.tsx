"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Handshake,
  Star,
  Globe,
  Megaphone,
  Users,
  TrendingUp,
  Zap,
  Eye,
  ShieldCheck,
  MessageSquare,
  Crown,
  CheckCircle,
  ArrowRight,
  Mail,
} from "lucide-react";

const PERKS = [
  {
    icon: Globe,
    title: "Featured on Our Website",
    description: "Your brand showcased on the official VisoryX Affiliations page with a direct link to your community.",
  },
  {
    icon: MessageSquare,
    title: "Dedicated Discord Channel",
    description: "A private, branded channel inside the VisoryX Discord server for direct communication and collaboration.",
  },
  {
    icon: Eye,
    title: "Increased Exposure",
    description: "Reach our growing community of clients, designers, and creators through shared visibility.",
  },
  {
    icon: Megaphone,
    title: "Cross-Promotion",
    description: "Mutual promotion opportunities across platforms, events, and announcements.",
  },
  {
    icon: Star,
    title: "Priority Event Visibility",
    description: "Highlighted placement during VisoryX events, launches, and community announcements.",
  },
  {
    icon: TrendingUp,
    title: "Revenue Opportunity",
    description: "Optional referral and donation support from shared clients and collaborative projects.",
  },
  {
    icon: Zap,
    title: "Exclusive Updates",
    description: "Early access to new services, features, and collaboration opportunities before public release.",
  },
  {
    icon: Crown,
    title: "Long-Term Growth",
    description: "Build a lasting partnership that scales with both organizations over time.",
  },
];

const REQUIREMENTS = [
  "If you operate a Discord server, VisoryX must receive a dedicated channel within your server",
  "Professional and respectful community standards",
  "Active and engaged audience with consistent activity",
  "No NSFW, hate speech, or rule-breaking content",
  "Brand alignment with VisoryX values and mission",
  "Organized leadership team with clear structure",
  "Consistent and recognizable branding",
];

export function AffiliationsContent() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex items-end min-h-[70vh] overflow-hidden bg-background grain pt-40 pb-24">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -bottom-[20%] -right-[10%] h-[50vh] w-[50vh] rounded-full bg-primary/[0.06] blur-[150px] animate-float-slow" />
          <div
            className="absolute -top-[15%] -left-[5%] h-[40vh] w-[40vh] rounded-full bg-accent/[0.04] blur-[120px] animate-float"
            style={{ animationDelay: "1.5s" }}
          />
          <div className="absolute bottom-[30%] left-[25%] h-[160px] w-[160px] rounded-full border border-primary/[0.06] animate-spin-slow" />
        </div>

        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 relative z-10">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-primary animate-reveal-blur">
            <span className="h-px w-8 bg-primary" />
            Strategic Partnerships
          </span>
          <h1
            className="mt-6 max-w-4xl text-[clamp(3rem,7vw,6rem)] font-extrabold leading-[0.9] tracking-tight text-foreground animate-reveal-up stagger-1"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Become an{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
              affiliate
            </span>
          </h1>
          <p className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed animate-reveal-blur stagger-2">
            Affiliations are strategic partnerships between VisoryX and select
            communities, brands, and servers. We collaborate to increase
            exposure, value, and opportunity for both sides.
          </p>
        </div>
      </section>

      {/* What Is an Affiliation */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">
              <span className="h-px w-8 bg-primary" />
              What This Means
              <span className="h-px w-8 bg-primary" />
            </span>
            <h2
              className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl text-balance"
              style={{ fontFamily: "var(--font-display)" }}
            >
              More than a partnership
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed text-pretty">
              A VisoryX affiliation is not a casual link exchange. It is a
              curated, strategic collaboration designed to elevate both parties.
              We invest in our affiliates because their success is our success.
            </p>
          </div>

          <div className="mt-6 flex justify-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/5 px-6 py-3">
              <Handshake className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                Selective. Strategic. Structured.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="py-24 bg-card/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">
              <span className="h-px w-8 bg-primary" />
              Affiliation Perks
              <span className="h-px w-8 bg-primary" />
            </span>
            <h2
              className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl text-balance"
              style={{ fontFamily: "var(--font-display)" }}
            >
              What you gain
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Our affiliates receive a suite of benefits designed to maximize
              exposure and create real value.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PERKS.map((perk) => {
              const Icon = perk.icon;
              return (
                <div
                  key={perk.title}
                  className="group relative rounded-2xl border border-border/40 bg-background p-6 transition-all hover:border-primary/30 hover:bg-primary/[0.02]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/15">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-4 text-sm font-bold text-foreground">
                    {perk.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {perk.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">
                <span className="h-px w-8 bg-primary" />
                Requirements
              </span>
              <h2
                className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl text-balance"
                style={{ fontFamily: "var(--font-display)" }}
              >
                What we look for
              </h2>
              <p className="mt-6 text-muted-foreground leading-relaxed">
                We keep our affiliate program selective to maintain quality and
                ensure every partnership is meaningful. Applicants must meet the
                following standards.
              </p>
            </div>

            <div className="space-y-3">
              {REQUIREMENTS.map((req, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-border/40 bg-card/80 p-4 transition-colors hover:border-primary/20"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 mt-0.5">
                    <CheckCircle className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-sm text-foreground leading-relaxed">
                    {req}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-card/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.08] via-background to-accent/[0.05] p-12 sm:p-16 text-center">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-[25%] -right-[15%] h-[40vh] w-[40vh] rounded-full bg-primary/[0.05] blur-[120px]" />
              <div className="absolute -bottom-[20%] -left-[10%] h-[30vh] w-[30vh] rounded-full bg-accent/[0.04] blur-[100px]" />
            </div>

            <div className="relative z-10">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
                <ShieldCheck className="h-7 w-7 text-primary" />
              </div>
              <h2
                className="mt-6 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl text-balance"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Interested in partnering with VisoryX?
              </h2>
              <p className="mt-4 mx-auto max-w-lg text-muted-foreground leading-relaxed">
                If your community or brand aligns with our standards, we would
                love to hear from you. Reach out to start the conversation.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Button asChild size="lg" className="gap-2">
                  <Link href="/contact">
                    <Mail className="h-4 w-4" />
                    Contact Us
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2">
                  <a
                    href="https://discord.gg/visoryx"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Users className="h-4 w-4" />
                    Join Our Discord
                  </a>
                </Button>
              </div>

              <p className="mt-6 text-xs text-muted-foreground">
                You can also email us directly at{" "}
                <a
                  href="mailto:contact@visoryx.design"
                  className="text-primary hover:underline font-medium"
                >
                  contact@visoryx.design
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
