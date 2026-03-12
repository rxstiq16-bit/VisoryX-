"use client";

export function PortfolioHero() {
  return (
    <section className="relative flex items-end min-h-[70vh] overflow-hidden bg-background grain pt-40 pb-24">
      {/* Floating orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-[25%] -right-[10%] h-[60vh] w-[60vh] rounded-full bg-primary/[0.06] blur-[150px] animate-float-slow" />
        <div className="absolute -bottom-[20%] -left-[10%] h-[40vh] w-[40vh] rounded-full bg-accent/[0.04] blur-[120px] animate-float" style={{ animationDelay: "3s" }} />
        <div className="absolute top-[30%] right-[20%] h-[200px] w-[200px] rounded-full border border-primary/[0.06] animate-spin-slow" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 relative z-10">
        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-primary animate-reveal-blur">
          <span className="h-px w-8 bg-primary" />
          Our Work
        </span>
        <h1
          className="mt-6 max-w-4xl text-[clamp(3rem,7vw,6rem)] font-extrabold leading-[0.9] tracking-tight text-foreground animate-reveal-up stagger-1"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Creative{" "}
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
            portfolio
          </span>
        </h1>
        <p className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed animate-reveal-blur stagger-2">
          Real projects, real communities. Explore our collection of logos,
          liveries, branding, and digital design work.
        </p>
      </div>
    </section>
  );
}
