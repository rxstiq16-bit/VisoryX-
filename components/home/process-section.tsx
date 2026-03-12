"use client";

import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";
import { MessageSquare, Paintbrush, RefreshCw, Download } from "lucide-react";

const steps = [
  { num: "01", title: "Consult", icon: MessageSquare, description: "Tell us about your project, your style, and your goals. We ask the right questions so nothing gets lost." },
  { num: "02", title: "Design", icon: Paintbrush, description: "Our team gets to work crafting your vision. Expect concepts and drafts within 1-3 business days." },
  { num: "03", title: "Refine", icon: RefreshCw, description: "Review the work and request changes. Every order includes up to 2 free revisions to get it perfect." },
  { num: "04", title: "Deliver", icon: Download, description: "Receive your final files in every format you need -- ready for platforms, print, and digital." },
];

export function ProcessSection() {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} className="relative py-32 lg:py-44 grain overflow-hidden">
      {/* Gradient line top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-[30%] h-[40vh] w-[40vh] rounded-full bg-primary/[0.04] blur-[120px] animate-pulse-glow" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className={cn("mb-20 flex items-end justify-between", isInView && "animate-reveal-up")}>
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">
              <span className="h-px w-8 bg-primary" />
              Process
            </span>
            <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance" style={{ fontFamily: "var(--font-display)" }}>
              How it works
            </h2>
            <p className="mt-5 max-w-lg text-muted-foreground leading-relaxed">
              A streamlined creative process designed for speed and quality.
            </p>
          </div>
          <img
            src="/images/mascot/virox-rocket.png"
            alt="ViroX mascot on a rocket"
            className="hidden lg:block h-36 w-auto drop-shadow-[0_0_20px_rgba(139,92,246,0.2)] animate-float -mb-4"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div
              key={step.num}
              className={cn(
                "tilt-card group relative rounded-2xl border border-border/50 bg-card p-8 lg:p-10 transition-all duration-500",
                isInView && "animate-reveal-up",
                isInView && `stagger-${i + 1}`
              )}
            >
              {/* Number watermark */}
              <span className="absolute top-4 right-6 text-6xl font-extrabold text-border/40 lg:text-7xl select-none" style={{ fontFamily: "var(--font-display)" }}>
                {step.num}
              </span>

              <div className="relative z-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20 transition-all duration-300 group-hover:bg-primary group-hover:ring-primary/40 group-hover:scale-110">
                  <step.icon className="h-5 w-5 text-primary transition-colors group-hover:text-primary-foreground" />
                </div>
                <h3 className="mt-8 text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                  {step.title}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connector line on desktop */}
              {i < steps.length - 1 && (
                <div className="absolute top-1/2 -right-3 hidden lg:block">
                  <div className="h-px w-6 bg-gradient-to-r from-border to-primary/30" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
