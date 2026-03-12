"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X, Megaphone, ArrowRight, AlertTriangle, CheckCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "promo";
  status: string;
  priority: string;
  link: string | null;
  link_text: string | null;
  expires_at: string | null;
}

export function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const bannerRef = useRef<HTMLDivElement>(null);

  // Update the CSS variable so the fixed nav knows to offset itself
  const updateNavOffset = useCallback(() => {
    const height = bannerRef.current?.offsetHeight || 0;
    document.documentElement.style.setProperty("--announcement-banner-height", `${height}px`);
  }, []);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const supabase = createClient();
      if (!supabase) return;

      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (!error && data) {
        const now = new Date();
        const active = data.filter((a: Announcement) => {
          if (a.expires_at && new Date(a.expires_at) < now) return false;
          return true;
        });
        setAnnouncements(active);
      }
    };

    fetchAnnouncements();
  }, []);

  // Recalculate offset whenever visible announcements change
  const visibleAnnouncements = announcements.filter((a) => !dismissedIds.has(a.id));

  useEffect(() => {
    // Small delay to let the DOM render before measuring
    const raf = requestAnimationFrame(updateNavOffset);
    return () => cancelAnimationFrame(raf);
  }, [visibleAnnouncements.length, updateNavOffset]);

  // Clean up CSS var on unmount
  useEffect(() => {
    return () => {
      document.documentElement.style.setProperty("--announcement-banner-height", "0px");
    };
  }, []);

  if (visibleAnnouncements.length === 0) {
    // Reset when nothing to show
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--announcement-banner-height", "0px");
    }
    return null;
  }

  const variantStyles: Record<string, string> = {
    info: "bg-primary/90 text-primary-foreground",
    warning: "bg-amber-600 text-white",
    success: "bg-green-600 text-white",
    promo: "bg-primary text-primary-foreground",
  };

  const variantIcons: Record<string, React.ReactNode> = {
    info: <Megaphone className="h-4 w-4 shrink-0" />,
    warning: <AlertTriangle className="h-4 w-4 shrink-0" />,
    success: <CheckCircle className="h-4 w-4 shrink-0" />,
    promo: <Sparkles className="h-4 w-4 shrink-0" />,
  };

  return (
    <>
      {/* Fixed banner above the nav (z-[60] > nav z-50) */}
      <div ref={bannerRef} className="fixed top-0 left-0 right-0 z-[60]">
        {visibleAnnouncements.map((announcement) => (
          <div
            key={announcement.id}
            className={cn(
              "relative py-2 px-4",
              variantStyles[announcement.type] || variantStyles.info
            )}
          >
            <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 text-xs sm:text-sm pr-8">
              {variantIcons[announcement.type] || variantIcons.info}
              <span className="font-medium line-clamp-1">
                {announcement.title && (
                  <strong className="mr-1.5">{announcement.title}</strong>
                )}
                {announcement.message}
              </span>
              {announcement.link && (
                <Link
                  href={announcement.link}
                  className="inline-flex items-center gap-1 font-semibold underline underline-offset-2 hover:no-underline shrink-0"
                >
                  {announcement.link_text || "Learn more"}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              )}
              <button
                onClick={() =>
                  setDismissedIds((prev) => new Set([...prev, announcement.id]))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-white/20 transition-colors"
                aria-label="Dismiss announcement"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Spacer to push page content below the fixed banner */}
      <div style={{ height: "var(--announcement-banner-height, 0px)" }} />
    </>
  );
}
