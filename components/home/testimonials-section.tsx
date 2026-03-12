"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Verified, Quote } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

const reviews = [
  { id: 1, name: "Daxt3r", avatar: "https://i.pravatar.cc/150?u=daxter", role: "Server Owner", server: "Ridgewood County RP", rating: 5, review: "yooo these guys are legit. got my whole server rebranded in like 2 days. liveries look clean asf and the logo goes hard. def coming back for more", date: "3 days ago" },
  { id: 2, name: "Deputy_Kxng", avatar: "https://i.pravatar.cc/150?u=kxng", role: "BCSO Sheriff", server: "Blaine County RP", rating: 5, review: "finally found someone who actually knows how erlc liveries work lol. my deputies love the new skins. good prices too not like those other servers charging 5k robux", date: "1 week ago" },
  { id: 3, name: "nate_fd", avatar: "https://i.pravatar.cc/150?u=nate", role: "Fire Chief", server: "Palm Beach FD", rating: 5, review: "got our entire fleet done. engines, ladders, ambulances, even the battalion chief truck. they actually made the lightbars look realistic which is hard to find", date: "2 weeks ago" },
  { id: 4, name: "itzCrispy", avatar: "https://i.pravatar.cc/150?u=crispy", role: "Founder", server: "New State Roleplay", rating: 5, review: "bro saved my server fr. needed a full rebrand before our launch and they delivered everything on time. logo, banners, liveries, even custom emotes. W designers", date: "2 weeks ago" },
  { id: 5, name: "sgt.williams", avatar: "https://i.pravatar.cc/150?u=williams", role: "DOT Supervisor", server: "Liberty State RP", rating: 5, review: "nobody ever does DOT liveries right but these guys nailed it. got the arrow boards, the cones on the truck, everything. super happy with how it turned out", date: "3 weeks ago" },
  { id: 6, name: "rxbel", avatar: "https://i.pravatar.cc/150?u=rxbel", role: "Server Co-Owner", server: "Greenville County", rating: 5, review: "we switched from another design server and the difference is crazy. actually responds to dms and doesnt take 2 weeks for one livery lmao. 10/10", date: "1 month ago" },
  { id: 7, name: "trooper.jake", avatar: "https://i.pravatar.cc/150?u=jake", role: "State Police Colonel", server: "San Andreas State RP", rating: 5, review: "ordered a full state police pack. chargers, explorers, tahoes, even the slicktop unmarked units. they got the details perfect down to the push bars", date: "1 month ago" },
  { id: 8, name: "mxddie", avatar: "https://i.pravatar.cc/150?u=maddie", role: "CIV Department Head", server: "Eastside Roleplay", rating: 5, review: "got custom civ vehicle liveries for our taxi and bus company. didnt even know that was a thing but they made it happen. super creative team", date: "5 weeks ago" },
];

const partners = ["Ridgewood County RP", "Nova Esports", "Blaine County RP", "Horizon Studios", "Liberty State RP", "Vertex Gaming", "Palm Beach FD", "Drift Society", "San Andreas State RP", "Neon Collective"];

function ReviewCard({ review }: { review: (typeof reviews)[number] }) {
  return (
    <div className="tilt-card min-w-[360px] max-w-[360px] shrink-0 rounded-2xl border border-border/50 bg-card p-8 relative overflow-hidden group">
      {/* Quote icon */}
      <Quote className="absolute top-6 right-6 h-8 w-8 text-primary/10 transition-colors group-hover:text-primary/20" />

      <div className="flex items-center gap-3 mb-6">
        <Avatar className="h-11 w-11 ring-2 ring-primary/10">
          <AvatarImage src={review.avatar} alt={review.name} />
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">{review.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm text-foreground">{review.name}</span>
            <Verified className="h-3.5 w-3.5 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground">{review.role} &middot; {review.server}</p>
        </div>
      </div>

      <div className="flex gap-0.5 mb-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={cn("h-3.5 w-3.5", i < review.rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted")} />
        ))}
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">&ldquo;{review.review}&rdquo;</p>
      <p className="mt-5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/50">{review.date}</p>
    </div>
  );
}

export function TestimonialsSection() {
  const doubled = [...reviews, ...reviews];
  const doubledPartners = [...partners, ...partners];
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} className="relative py-32 lg:py-44 overflow-hidden">
      {/* Gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className={cn("mb-20", isInView && "animate-reveal-up")}>
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">
            <span className="h-px w-8 bg-primary" />
            Testimonials
          </span>
          <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance" style={{ fontFamily: "var(--font-display)" }}>
            Loved by creators
          </h2>
          <p className="mt-5 max-w-lg text-muted-foreground leading-relaxed">
            Trusted by gaming servers, esports orgs, content creators, and businesses worldwide.
          </p>
        </div>
      </div>

      {/* Review Marquee Row 1 */}
      <div className={cn("relative mb-6", isInView && "animate-reveal-fade stagger-1")}>
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-48 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-48 bg-gradient-to-l from-background to-transparent" />
        <div className="flex gap-6 animate-marquee hover:[animation-play-state:paused]">
          {doubled.map((review, i) => (
            <ReviewCard key={`r1-${review.id}-${i}`} review={review} />
          ))}
        </div>
      </div>

      {/* Review Marquee Row 2 (reversed) */}
      <div className={cn("relative", isInView && "animate-reveal-fade stagger-2")}>
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-48 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-48 bg-gradient-to-l from-background to-transparent" />
        <div className="flex gap-6 animate-marquee-reverse hover:[animation-play-state:paused]">
          {[...doubled].reverse().map((review, i) => (
            <ReviewCard key={`r2-${review.id}-${i}`} review={review} />
          ))}
        </div>
      </div>

      {/* Partner logos marquee */}
      <div className={cn("relative mt-24 overflow-hidden", isInView && "animate-reveal-fade stagger-3")}>
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-40 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-40 bg-gradient-to-l from-background to-transparent" />
        <div className="flex items-center gap-16" style={{ animation: "marquee 50s linear infinite" }}>
          {doubledPartners.map((name, i) => (
            <span key={`${name}-${i}`} className="shrink-0 text-lg font-extrabold uppercase tracking-[0.2em] text-primary/50 whitespace-nowrap select-none hover:text-primary/80 transition-colors duration-500" style={{ fontFamily: "var(--font-display)" }}>
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
