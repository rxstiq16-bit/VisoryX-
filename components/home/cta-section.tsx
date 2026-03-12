"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

export { CtaSection as CTASection };

function CtaSection() {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} className="relative py-40 lg:py-56 overflow-hidden grain">
      {/* Gradient line top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Dramatic gradient bg */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.03] to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[50vh] w-[80vw] rounded-full bg-primary/[0.06] blur-[200px] animate-pulse-glow" />
        {/* Floating rings */}
        <div className="absolute top-[15%] right-[15%] h-[200px] w-[200px] rounded-full border border-primary/[0.08] animate-spin-slow" />
        <div className="absolute bottom-[20%] left-[10%] h-[150px] w-[150px] rounded-full border border-accent/[0.06] animate-spin-slow" style={{ animationDirection: "reverse" }} />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 text-center">
        <div className={cn(isInView && "animate-reveal-up")}>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Let&apos;s Create
          </span>
        </div>

        <h2
          className={cn("mx-auto max-w-5xl text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl xl:text-8xl text-balance", isInView && "animate-reveal-up stagger-1")}
          style={{ fontFamily: "var(--font-display)" }}
        >
          Ready to build something{" "}
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
            extraordinary
          </span>
          ?
        </h2>

        <p className={cn("mx-auto mt-8 max-w-2xl text-lg text-muted-foreground leading-relaxed", isInView && "animate-reveal-blur stagger-2")}>
          Join hundreds of communities who trust VisoryX for their creative needs.
          Tell us your vision and we will bring it to life.
        </p>

        {/* ViroX Mascot */}
        <div className={cn("mt-10 flex justify-center", isInView && "animate-reveal-up stagger-2")}>
          <img
            src="/images/mascot/virox-thumbsup.png"
            alt="ViroX mascot giving thumbs up"
            className="h-48 w-auto drop-shadow-[0_0_30px_rgba(139,92,246,0.25)] animate-float sm:h-56"
          />
        </div>

        <div className={cn("mt-10 flex flex-col sm:flex-row items-center justify-center gap-6", isInView && "animate-reveal-up stagger-3")}>
          <Link
            href="/order"
            className="magnetic-btn group inline-flex items-center gap-3 rounded-full bg-primary px-10 py-5 text-sm font-bold uppercase tracking-[0.15em] text-primary-foreground transition-all hover:brightness-110 hover:gap-5"
          >
            Start Your Project
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <a
            href="https://discord.gg/Zeu8F7a2Rx"
            target="_blank"
            rel="noopener noreferrer"
            className="animated-underline inline-flex items-center gap-2 px-2 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground"
          >
            Join our Discord
          </a>
        </div>
      </div>
    </section>
  );
}
