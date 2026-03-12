"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { User, Settings, ZoomIn, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getPortfolio, defaultPortfolio, type PortfolioItem } from "@/lib/portfolio-store";
import { cn } from "@/lib/utils";
import { Lightbox } from "@/components/portfolio/lightbox";
import { FeaturedCarousel } from "@/components/portfolio/featured-carousel";

const categories = [
  { id: "all", label: "All" },
  { id: "Logo Design", label: "Logos" },
  { id: "Branding", label: "Branding" },
  { id: "Discord", label: "Discord" },
  { id: "ERLC Liveries", label: "Liveries" },
  { id: "Gaming & Creator", label: "Gaming" },
  { id: "Social Media", label: "Social Media" },
  { id: "Banners", label: "Banners" },
  { id: "Business", label: "Business" },
  { id: "UI & Assets", label: "UI" },
  { id: "Marketing", label: "Marketing" },
];

export function PortfolioSection() {
  const [projects, setProjects] = useState<PortfolioItem[]>(defaultPortfolio);
  const [activeCategory, setActiveCategory] = useState("all");
  const [showAdminButton, setShowAdminButton] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    let mounted = true;
    getPortfolio().then((data) => {
      if (mounted && data.length > 0) setProjects(data);
    });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        e.preventDefault();
        setShowAdminButton((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSecretClick = useCallback(() => {
    setClickCount((prev) => {
      const newCount = prev + 1;
      if (newCount >= 3) {
        setShowAdminButton(true);
        return 0;
      }
      setTimeout(() => setClickCount(0), 1000);
      return newCount;
    });
  }, []);

  const filteredProjects = useMemo(() => {
    if (activeCategory === "all") return projects;
    return projects.filter((project) => project.category === activeCategory);
  }, [projects, activeCategory]);

  const featuredProjects = useMemo(() => projects.slice(0, 5), [projects]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      {/* Featured Carousel */}
      {featuredProjects.length > 0 && <FeaturedCarousel items={featuredProjects} />}

      {/* Filter Bar */}
      <section className="sticky top-16 z-30 border-b border-border/30 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="hide-scrollbar flex gap-1 overflow-x-auto py-5">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                type="button"
                className={cn(
                  "shrink-0 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300",
                  activeCategory === category.id
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {filteredProjects.length === 0 ? (
            <div className="py-32 text-center">
              <p className="text-lg text-muted-foreground">No projects found in this category yet.</p>
              <p className="mt-3 text-sm text-muted-foreground/70">Check back soon -- we are always adding new work.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project, index) => (
                <div
                  key={project.id}
                  className="group tilt-card cursor-pointer overflow-hidden rounded-2xl border border-border/30 bg-card transition-all duration-500 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5"
                  onClick={() => openLightbox(index)}
                >
                  {/* Image */}
                  <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-primary/10 to-accent/5">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between opacity-0 transition-all duration-500 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
                      <span className="rounded-full bg-primary px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-primary-foreground">
                        {project.category}
                      </span>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/10 backdrop-blur-md">
                        <ZoomIn className="h-4 w-4 text-foreground" />
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <h3 className="text-base font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                      {project.title}
                    </h3>
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        Made for <span className="text-foreground font-medium">{project.madeFor}</span>
                      </p>
                      <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground/70">
                        <User className="h-3 w-3" />
                        {project.designer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer area */}
          <div className="mt-20 text-center">
            <p className="text-muted-foreground cursor-default select-none" onClick={handleSecretClick}>
              More projects coming soon.
            </p>
            {showAdminButton && (
              <Link
                href="/admin/portfolio"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] text-primary-foreground transition-all hover:bg-primary/90"
              >
                <Settings className="h-4 w-4" />
                Manage Portfolio
              </Link>
            )}
          </div>
        </div>
      </section>

      <Lightbox items={filteredProjects} initialIndex={lightboxIndex} isOpen={lightboxOpen} onClose={() => setLightboxOpen(false)} />
    </>
  );
}
