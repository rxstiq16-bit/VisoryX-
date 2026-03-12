"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(current));
        }, duration / steps);
      }
    }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export function HeroSection() {
  return (
    <section className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden bg-background grain">
      {/* Animated gradient orbs */}
      <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
        <div className="absolute -top-[30%] -right-[15%] h-[70vh] w-[70vh] rounded-full bg-primary/[0.07] blur-[150px] animate-float-slow" />
        <div className="absolute -bottom-[25%] -left-[10%] h-[55vh] w-[55vh] rounded-full bg-accent/[0.05] blur-[130px] animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-[20%] left-[40%] h-[35vh] w-[35vh] rounded-full bg-primary/[0.04] blur-[100px] animate-pulse-glow" />
        {/* Rotating accent ring */}
        <div className="absolute top-[10%] right-[10%] h-[300px] w-[300px] rounded-full border border-primary/[0.06] animate-spin-slow" />
        <div className="absolute top-[12%] right-[12%] h-[250px] w-[250px] rounded-full border border-accent/[0.04] animate-spin-slow" style={{ animationDirection: "reverse", animationDuration: "45s" }} />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8 pt-40 pb-24">
        <div className="flex items-start justify-between gap-8">
          <div className="flex-1">
            {/* Overline */}
            <div className="animate-reveal-blur">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                Premium Design Studio
              </span>
            </div>

            {/* Massive headline with line-by-line reveal */}
            <h1 className="mt-10 max-w-6xl" style={{ fontFamily: "var(--font-display)" }}>
              <span className="block text-[clamp(2.8rem,7.5vw,7rem)] font-extrabold leading-[0.95] tracking-tight text-foreground animate-reveal-up stagger-1">
                We design brands
              </span>
              <span className="block text-[clamp(2.8rem,7.5vw,7rem)] font-extrabold leading-[0.95] tracking-tight animate-reveal-up stagger-2">
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
                  that dominate
                </span>
              </span>
            </h1>

            {/* Description */}
            <p className="mt-10 max-w-xl text-lg text-muted-foreground leading-relaxed animate-reveal-blur stagger-3">
              Logos, liveries, branding, and digital graphics engineered for gaming
              communities, esports organizations, and visionary businesses worldwide.
            </p>

            {/* CTA row */}
            <div className="mt-14 flex flex-wrap items-center gap-6 animate-reveal-up stagger-4">
              <Link
                href="/order"
                className="magnetic-btn group inline-flex items-center gap-3 rounded-full bg-primary px-10 py-5 text-sm font-bold uppercase tracking-[0.15em] text-primary-foreground transition-all hover:brightness-110 hover:gap-5"
              >
                Start a Project
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/portfolio"
                className="animated-underline inline-flex items-center gap-2 px-2 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground"
              >
                View Our Work
              </Link>
            </div>
          </div>

          {/* ViroX Mascot */}
          <div className="hidden lg:block animate-reveal-blur stagger-3 relative flex-shrink-0">
            <div className="relative">
              <img
                src="/images/mascot/virox-standing.png"
                alt="ViroX mascot"
                className="h-[420px] w-auto drop-shadow-[0_0_40px_rgba(139,92,246,0.3)] animate-float"
              />
              {/* Glow effect behind mascot */}
              <div className="absolute inset-0 -z-10 blur-[80px] bg-primary/10 rounded-full scale-75" />
            </div>
          </div>
        </div>

        {/* Stats bar with animated counters */}
        <div className="mt-20 grid grid-cols-2 gap-8 border-t border-border/50 pt-12 sm:grid-cols-4 animate-reveal-up stagger-5">
          {[
            { value: 500, suffix: "+", label: "Projects Delivered" },
            { value: 150, suffix: "+", label: "Happy Clients" },
            { value: 4.9, suffix: "/5", label: "Average Rating" },
            { value: 24, suffix: "h", label: "Avg Response", prefix: "<" },
          ].map((stat) => (
            <div key={stat.label} className="group">
              <div className="text-4xl font-extrabold text-foreground lg:text-5xl transition-colors group-hover:text-primary" style={{ fontFamily: "var(--font-display)" }}>
                {stat.prefix || ""}
                {typeof stat.value === "number" && stat.value % 1 === 0
                  ? <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  : <>{stat.value}{stat.suffix}</>
                }
              </div>
              <div className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-reveal-fade" style={{ animationDelay: "1.5s" }}>
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Scroll</span>
          <div className="h-10 w-[1px] bg-gradient-to-b from-primary/60 to-transparent animate-pulse" />
        </div>
      </div>
    </section>
  );
}
