"use client";

import { useState, useEffect, useCallback } from "react";
import { ExternalLink, User, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getPortfolio, type PortfolioItem } from "@/lib/portfolio-store";

export function PortfolioGrid() {
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [showAdminButton, setShowAdminButton] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    const loadProjects = async () => {
      const data = await getPortfolio();
      setProjects(data);
    };
    loadProjects();
  }, []);

  // Secret keyboard shortcut: Ctrl+Shift+A to toggle admin button
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

  // Secret click: Triple-click on "More projects coming soon" text
  const handleSecretClick = useCallback(() => {
    setClickCount((prev) => {
      const newCount = prev + 1;
      if (newCount >= 3) {
        setShowAdminButton(true);
        return 0;
      }
      // Reset after 1 second if not enough clicks
      setTimeout(() => setClickCount(0), 1000);
      return newCount;
    });
  }, []);

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg"
            >
              {/* Project Image */}
              <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-primary/5 relative overflow-hidden">
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-primary/90 opacity-0 transition-opacity group-hover:opacity-100">
                  <button 
                    type="button"
                    className="flex items-center gap-2 rounded-full bg-primary-foreground px-5 py-2.5 text-sm font-medium text-primary transition-transform hover:scale-105"
                  >
                    View Project
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider text-primary">
                    {project.category}
                  </span>
                </div>
                <h3 className="mt-2 text-lg font-semibold text-foreground">
                  {project.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Made for {project.madeFor}
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <User className="h-3.5 w-3.5" />
                  <span>Designed by {project.designer}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-12 text-center">
          <p 
            className="text-muted-foreground cursor-default select-none"
            onClick={handleSecretClick}
          >
            More projects coming soon. Stay tuned for updates!
          </p>
          
          {/* Hidden Admin Access Button */}
          {showAdminButton && (
            <Link
              href="/admin/portfolio"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90"
            >
              <Settings className="h-4 w-4" />
              Manage Portfolio
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
