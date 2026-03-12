import { Check } from "lucide-react";

const philosophyPoints = [
  "Every design decision should serve a purpose and solve a problem.",
  "Collaboration with clients leads to the best creative outcomes.",
  "Attention to detail separates good design from great design.",
  "Timeless aesthetics outperform fleeting trends.",
  "Clear communication is the foundation of successful projects.",
  "Continuous learning keeps our work fresh and innovative.",
];

export function PhilosophySection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Visual */}
          <div className="relative order-2 lg:order-1">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-secondary/50 border border-border">
              <div className="h-full w-full p-8 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute -inset-8 rounded-full bg-primary/10 blur-2xl" />
                  <div className="relative grid grid-cols-3 gap-3">
                    {[...Array(9)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-16 w-16 rounded-lg border border-primary/20 ${
                          i % 2 === 0 ? "bg-primary/10" : "bg-primary/5"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <p className="text-sm font-medium uppercase tracking-wider text-primary">
              How We Work
            </p>
            <h2
              className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Design Philosophy
            </h2>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              At VisoryX, we believe that exceptional design is the result of thoughtful process, 
              client collaboration, and unwavering commitment to quality. Our philosophy guides 
              every project we undertake.
            </p>

            <ul className="mt-8 space-y-4">
              {philosophyPoints.map((point) => (
                <li key={point} className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-muted-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
