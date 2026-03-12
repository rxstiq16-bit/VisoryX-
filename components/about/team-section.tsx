import Image from "next/image";

export function TeamSection() {
  return (
    <section className="border-t border-border bg-secondary/20 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Our Team
          </p>
          <h2
            className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Meet the Creator
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            The visionary behind VisoryX, bringing creativity and excellence to every project.
          </p>
        </div>

        <div className="mt-16 flex justify-center">
          <div className="group text-center max-w-sm">
            <div className="mx-auto h-40 w-40 overflow-hidden rounded-full bg-primary/10 border-4 border-primary/30 transition-all group-hover:border-primary/60 group-hover:shadow-lg group-hover:shadow-primary/20">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_5740.JPG-5QTsqrfzXqLSMdxKxxi0jJJfsWMlev.jpeg"
                alt="Jonathan Drake Jr"
                width={160}
                height={160}
                className="h-full w-full object-cover"
              />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-foreground">
              Jonathan Drake Jr
            </h3>
            <p className="text-sm font-medium text-primary">Executive</p>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs mx-auto">
              Founder and Executive of VisoryX, leading the creative vision and strategic direction of the company.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
