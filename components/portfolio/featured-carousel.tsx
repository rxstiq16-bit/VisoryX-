"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PortfolioItem } from "@/lib/portfolio-store";

interface FeaturedCarouselProps {
  items: PortfolioItem[];
}

export function FeaturedCarousel({ items }: FeaturedCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const goNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const goPrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (!isAutoPlaying || items.length <= 1) return;
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, goNext, items.length]);

  if (items.length === 0) return null;

  const item = items[current];

  return (
    <section className="py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Star className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Featured Work</h2>
          </div>
          {items.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => { setIsAutoPlaying(false); goPrev(); }}
                className="rounded-full border border-border bg-card p-2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Previous"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => { setIsAutoPlaying(false); goNext(); }}
                className="rounded-full border border-border bg-card p-2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Next"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Carousel Card */}
        <div
          className="group relative overflow-hidden rounded-2xl border border-border bg-card"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:min-h-[400px]">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Info */}
            <div className="flex flex-col justify-center p-8 lg:p-12">
              <span className="mb-2 text-xs font-medium uppercase tracking-widest text-primary">
                {item.category}
              </span>
              <h3 className="text-2xl font-bold text-foreground lg:text-3xl text-balance">
                {item.title}
              </h3>
              <p className="mt-3 text-muted-foreground">
                Made for <span className="font-medium text-foreground">{item.madeFor}</span>
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Designed by {item.designer}</span>
              </div>

              {/* Dots */}
              {items.length > 1 && (
                <div className="mt-8 flex items-center gap-2">
                  {items.map((_, i) => (
                    <button
                      key={`dot-${items[i].id}`}
                      type="button"
                      onClick={() => { setCurrent(i); setIsAutoPlaying(false); }}
                      className={cn(
                        "h-2 rounded-full transition-all",
                        i === current ? "w-8 bg-primary" : "w-2 bg-border hover:bg-muted-foreground"
                      )}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
