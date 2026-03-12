"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn, User, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PortfolioItem } from "@/lib/portfolio-store";

interface LightboxProps {
  items: PortfolioItem[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export function Lightbox({ items, initialIndex, isOpen, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setIsZoomed(false);
  }, [initialIndex]);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
    setIsZoomed(false);
  }, [items.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    setIsZoomed(false);
  }, [items.length]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, onClose, goNext, goPrev]);

  if (!isOpen || items.length === 0) return null;

  const item = items[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 rounded-full bg-card p-2 text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Close lightbox"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Navigation arrows */}
      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-4 z-10 rounded-full bg-card p-3 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-4 z-10 rounded-full bg-card p-3 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Content */}
      <div className="flex h-full w-full max-w-6xl flex-col items-center justify-center gap-4 p-8 pt-16">
        {/* Image */}
        <div
          className={cn(
            "relative w-full flex-1 cursor-zoom-in overflow-hidden rounded-xl",
            isZoomed && "cursor-zoom-out"
          )}
          onClick={() => setIsZoomed(!isZoomed)}
        >
          <Image
            src={item.image || "/placeholder.svg"}
            alt={item.title}
            fill
            className={cn(
              "object-contain transition-transform duration-300",
              isZoomed && "scale-150"
            )}
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
        </div>

        {/* Info bar */}
        <div className="flex w-full items-center justify-between rounded-xl bg-card p-4">
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-primary">{item.category}</span>
            <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
            <p className="text-sm text-muted-foreground">Made for {item.madeFor}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{item.designer}</span>
            </div>
            <button
              type="button"
              onClick={() => setIsZoomed(!isZoomed)}
              className="rounded-full bg-secondary p-2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Toggle zoom"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Counter */}
        <p className="text-sm text-muted-foreground">
          {currentIndex + 1} of {items.length}
        </p>
      </div>
    </div>
  );
}
