"use client";

export function PricingHero() {
  return (
    <section className="relative flex items-end min-h-[70vh] overflow-hidden bg-background grain pt-40 pb-24">
      {/* Floating orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-[20%] -left-[10%] h-[55vh] w-[55vh] rounded-full bg-primary/[0.06] blur-[150px] animate-float-slow" />
        <div className="absolute -bottom-[15%] -right-[10%] h-[35vh] w-[35vh] rounded-full bg-accent/[0.04] blur-[120px] animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-[25%] left-[15%] h-[180px] w-[180px] rounded-full border border-accent/[0.06] animate-spin-slow" style={{ animationDirection: "reverse" }} />
      </div>

      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 relative z-10">
        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-primary animate-reveal-blur">
          <span className="h-px w-8 bg-primary" />
          Pricing
        </span>
        <h1
          className="mt-6 max-w-4xl text-[clamp(3rem,7vw,6rem)] font-extrabold leading-[0.9] tracking-tight text-foreground animate-reveal-up stagger-1"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Transparent{" "}
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
            pricing
          </span>
        </h1>
        <p className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed animate-reveal-blur stagger-2">
          Whether you are a creator, community, startup, or enterprise --
          find the right package for your project.
        </p>
      </div>
    </section>
  );
}
