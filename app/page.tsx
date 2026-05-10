import type { Metadata } from "next";
import { Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "VisoryX | Website Discontinued - Design Beyond Vision",
  description:
    "This VisoryX website is no longer in use. Please contact us via email for any inquiries.",
};

export default function MaintenancePage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6">
      {/* Background gradient effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -bottom-1/4 -right-1/4 h-[500px] w-[500px] rounded-full bg-accent/10 blur-[100px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Visory<span className="text-primary">X</span>
          </h1>
          <p className="mt-2 text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
            Design Beyond Vision
          </p>
        </div>

        {/* Status badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-destructive/20 bg-destructive/5 px-4 py-2">
          <span className="relative flex h-2 w-2">
            <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive" />
          </span>
          <span className="text-sm font-medium text-destructive">Website Discontinued</span>
        </div>

        {/* Main message */}
        <h2 className="mb-4 font-display text-2xl font-semibold text-foreground sm:text-3xl">
          This Website Is No Longer In Use
        </h2>
        <p className="mb-10 text-lg leading-relaxed text-muted-foreground">
          This website has been discontinued and is no longer active. 
          If you need to reach us, please contact us via email below. 
          Thank you for your understanding.
        </p>

        {/* Contact */}
        <div className="rounded-xl border border-border bg-card/50 p-6 backdrop-blur-sm">
          <p className="mb-4 text-sm text-muted-foreground">
            Need to reach us? Contact us via email:
          </p>
          <a
            href="mailto:visoryxdesign@gmail.com"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
          >
            <Mail className="h-4 w-4" />
            visoryxdesign@gmail.com
          </a>
        </div>

        {/* Footer */}
        <p className="mt-12 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} VisoryX. All rights reserved.
        </p>
      </div>
    </main>
  );
}
