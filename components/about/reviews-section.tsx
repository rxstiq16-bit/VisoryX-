"use client";

import { useState, useEffect } from "react";
import { Star, Quote } from "lucide-react";
import { getReviews, type Review } from "@/lib/reviews-store";
import { cn } from "@/lib/utils";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "h-3.5 w-3.5",
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-muted text-muted"
          )}
        />
      ))}
    </div>
  );
}

const fallbackReviews: Review[] = [
  {
    id: "fb-1",
    customerName: "Daxt3r",
    rating: 5,
    review: "yooo these guys are legit. got my whole server rebranded in like 2 days. liveries look clean asf and the logo goes hard. def coming back for more",
    service: "Server Branding",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "fb-2",
    customerName: "Deputy_Kxng",
    rating: 5,
    review: "finally found someone who actually knows how erlc liveries work lol. my deputies love the new skins. good prices too not like those other servers charging 5k robux",
    service: "ERLC Liveries",
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: "fb-3",
    customerName: "nate_fd",
    rating: 5,
    review: "got our entire fleet done. engines, ladders, ambulances, even the battalion chief truck. they actually made the lightbars look realistic which is hard to find",
    service: "Vehicle Fleet Pack",
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
  {
    id: "fb-4",
    customerName: "StreamerKai",
    rating: 5,
    review: "the overlay pack they made for my twitch channel is insane. webcam frame, alerts, panels - everything matches perfectly. chat loves the new look",
    service: "Stream Overlays",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: "fb-5",
    customerName: "BizFounder",
    rating: 5,
    review: "needed a full brand kit for my startup and they delivered in 48 hours. logo, business cards, social templates -- all cohesive and professional. worth every penny",
    service: "Startup Brand Kit",
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: "fb-6",
    customerName: "GuildMaster_V",
    rating: 5,
    review: "they set up our discord from scratch. channels, roles, bots, custom embeds, even a ticket system. our community has never been more organized",
    service: "Discord Setup",
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
  {
    id: "fb-7",
    customerName: "PixelArtisan",
    rating: 4,
    review: "great social media pack for my art page. 10 templates that I can reuse and customize. only wish there was one more variation but overall super happy",
    service: "Social Media Pack",
    createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
  },
  {
    id: "fb-8",
    customerName: "esports_wolf",
    rating: 5,
    review: "our esports team needed a full rebrand. new logo, jersey mockups, banners, social headers -- they nailed the aggressive look we wanted. 10/10",
    service: "Esports Team Kit",
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
];

function timeAgo(dateString: string) {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return `${Math.floor(seconds / 604800)}w ago`;
}

export function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const stored = getReviews();
    setReviews(stored.length > 0 ? stored : fallbackReviews);
  }, []);

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : "0";

  const doubled = [...reviews, ...reviews];

  return (
    <section className="py-20 lg:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Testimonials
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl text-balance">
            What Our Clients Say
          </h2>
          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="flex items-center gap-1.5">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="text-lg font-semibold">{averageRating}</span>
            </div>
            <span className="text-muted-foreground">
              from {reviews.length} review{reviews.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Sliding marquee of reviews */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-background to-transparent" />

        <div className="flex gap-5 animate-marquee hover:[animation-play-state:paused]">
          {doubled.map((review, i) => (
            <div
              key={`${review.id}-${i}`}
              className="shrink-0 w-[340px] rounded-xl border border-border/60 bg-card/60 p-5 backdrop-blur-sm"
            >
              {/* Quote icon */}
              <Quote className="h-5 w-5 text-primary/30 mb-3" />

              {/* Review text */}
              <p className="text-sm text-foreground/90 leading-relaxed line-clamp-4 mb-4">
                {'"'}{review.review}{'"'}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-border/40">
                <div>
                  <p className="text-sm font-semibold">{review.customerName}</p>
                  <p className="text-xs text-muted-foreground">
                    {review.service || "Design Service"}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StarRating rating={review.rating} />
                  <span className="text-[11px] text-muted-foreground">
                    {timeAgo(review.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div className="mx-auto max-w-4xl px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">150+</div>
            <div className="text-sm text-muted-foreground">Clients Served</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">500+</div>
            <div className="text-sm text-muted-foreground">Designs Delivered</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">4.9</div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">98%</div>
            <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
}
