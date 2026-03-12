import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex flex-1 items-center justify-center">
        <section className="py-20 lg:py-32">
          <div className="mx-auto max-w-2xl px-6 text-center lg:px-8">
            {/* Large 404 */}
            <p
              className="text-8xl font-bold tracking-tighter text-primary lg:text-[12rem]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              404
            </p>

            {/* Message */}
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground text-balance">
              Page not found
            </h1>
            <p className="mt-3 text-lg text-muted-foreground leading-relaxed">
              {"The page you're looking for doesn't exist or has been moved. Let's get you back on track."}
            </p>

            {/* Actions */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Go Home
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center justify-center rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                View Portfolio
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
