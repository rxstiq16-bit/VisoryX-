import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "VisoryX | Coming Soon - Design Beyond Vision",
  description:
    "VisoryX is currently undergoing a redesign. We're building a new, modernized website to serve you better. Stay tuned!",
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
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <span className="text-sm font-medium text-primary">Under Construction</span>
        </div>

        {/* Main message */}
        <h2 className="mb-4 font-display text-2xl font-semibold text-foreground sm:text-3xl">
          Website Currently Shutdown
        </h2>
        <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
          We are currently designing a new website, more modernized and better for VisoryX. 
          Our team is working hard to bring you an improved experience with new features and a fresh look.
        </p>

        {/* Progress indicator */}
        <div className="mb-10">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Redesign Progress</span>
            <span className="font-medium text-foreground">In Progress</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-primary to-accent" />
          </div>
        </div>

        {/* Contact */}
        <div className="rounded-xl border border-border bg-card/50 p-6 backdrop-blur-sm">
          <p className="mb-4 text-sm text-muted-foreground">
            Have questions or need to reach us?
          </p>
          <a
            href="mailto:contact@visoryx.design"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
          >
            <Mail className="h-4 w-4" />
            contact@visoryx.design
          </a>
          <div className="mt-4">
            <a
              href="https://discord.gg/visoryx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Or join our Discord for updates
            </a>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-12 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} VisoryX. All rights reserved.
        </p>
      </div>
    </main>
  );
}
