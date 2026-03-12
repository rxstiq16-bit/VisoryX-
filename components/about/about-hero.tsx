export function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-background py-20 lg:py-28">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">
          {/* Logo */}
          <div className="mb-6 flex justify-center">
            <img 
              src="/visoryx-logo-white.png" 
              alt="VisoryX" 
              className="h-16 w-auto object-contain"
            />
          </div>
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            About Us
          </p>
          <h1
            className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl text-balance"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Who We Are
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground leading-relaxed">
            VisoryX is a creative design company dedicated to transforming ideas into powerful visual experiences. 
            Founded with a passion for design excellence, we have grown into a trusted partner for businesses 
            seeking to elevate their brand identity and digital presence.
          </p>
        </div>
      </div>
    </section>
  );
}
