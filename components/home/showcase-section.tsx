"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

type Category = "All" | "Logos" | "Liveries" | "Banners";

const portfolioItems = [
  { title: "FSR - Staff Charger", category: "Liveries" as const, description: "Navy-to-teal wave livery with carbon fiber hood.", image: "/portfolio/fsr-livery.png", featured: true, aspect: "video" as const },
  { title: "SFRP - Server Logo", category: "Logos" as const, description: "Cityscape logo with bridge silhouette and sunset.", image: "/portfolio/sfrp-logo.png", featured: true, aspect: "square" as const },
  { title: "NJSRP - Server Logo", category: "Logos" as const, description: "Mountain sunset with pine trees and bold lettering.", image: "/portfolio/logo-njsrp.png", aspect: "square" as const },
  { title: "Montgomery County Sheriff", category: "Liveries" as const, description: "White and gold Sheriff Explorer with striping.", image: "/portfolio/livery-sheriff.png", aspect: "video" as const },
  { title: "Astro - Brand Logo", category: "Logos" as const, description: "Orbital ring monogram with space-tech aesthetic.", image: "/portfolio/logo-astro-a.png", aspect: "square" as const },
  { title: "AD - Monogram Logo", category: "Logos" as const, description: "Geometric lettermark with orbital accent.", image: "/portfolio/logo-astro-ad.png", aspect: "square" as const },
  { title: "FSRP - Command Truck", category: "Liveries" as const, description: "Navy and teal wave on a box truck.", image: "/portfolio/livery-fsrp-truck.png", aspect: "square" as const },
  { title: "LNG - Bold Logotype", category: "Logos" as const, description: "Block lettering with angular cuts on red.", image: "/portfolio/logo-lng.png", aspect: "square" as const },
  { title: "3D Letter Concept", category: "Logos" as const, description: "Interlocking 3D letterform with ring detail.", image: "/portfolio/logo-3d-letter.png", aspect: "square" as const },
  { title: "Infinity Designs Banner", category: "Banners" as const, description: "ERLC scene with infinity logo overlay.", image: "/portfolio/banner-infinity.jpg", aspect: "video" as const },
];

const categories: Category[] = ["All", "Logos", "Liveries", "Banners"];

export function ShowcaseSection() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const { ref, isInView } = useInView();

  const featured = portfolioItems.filter((item) => item.featured);
  const filtered = activeCategory === "All"
    ? portfolioItems.filter((item) => !item.featured)
    : portfolioItems.filter((item) => item.category === activeCategory && !item.featured);

  return (
    <section ref={ref} className="relative py-32 lg:py-44 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-20", isInView && "animate-reveal-up")}>
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">
              <span className="h-px w-8 bg-primary" />
              Portfolio
            </span>
            <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance" style={{ fontFamily: "var(--font-display)" }}>
              Selected work
            </h2>
          </div>
          <Link href="/portfolio" className="animated-underline inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground">
            Full Portfolio <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Featured row */}
        <div className={cn("grid grid-cols-1 gap-5 lg:grid-cols-5 mb-16", isInView && "animate-reveal-scale stagger-1")}>
          {featured.map((item, i) => (
            <Link
              key={item.title}
              href="/portfolio"
              className={cn(
                "tilt-card group relative overflow-hidden rounded-2xl border border-border/50 bg-card",
                i === 0 ? "lg:col-span-3" : "lg:col-span-2"
              )}
            >
              <div className={cn("relative overflow-hidden", i === 0 ? "aspect-video" : "aspect-[4/3]")}>
                <Image src={item.image} alt={item.title} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary backdrop-blur-sm">{item.category}</span>
                  <h3 className="mt-3 text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Category Filter */}
        <div className={cn("flex gap-2 flex-wrap mb-10", isInView && "animate-reveal-fade stagger-2")}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300",
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, i) => (
            <Link
              key={project.title}
              href="/portfolio"
              className={cn(
                "tilt-card group overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-500",
                isInView && "animate-reveal-up",
                isInView && `stagger-${Math.min(i + 1, 6)}`
              )}
            >
              <div className={cn("relative overflow-hidden", project.aspect === "video" ? "aspect-video" : "aspect-square")}>
                <Image src={project.image} alt={project.title} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-[2px]">
                  <span className="rounded-full bg-foreground px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-background">View</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">{project.category}</span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground/30 transition-all group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
                <h3 className="mt-2 text-base font-bold text-foreground">{project.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{project.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
