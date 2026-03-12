"use client";

import { useState } from "react";
import { ChevronDown, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/use-in-view";

const faqs = [
  {
    question: "Who are your services for?",
    answer: "Everyone. We work with individual creators, streamers, gaming communities, Discord servers, small businesses, startups, agencies, nonprofits, and enterprises. If you need design, we can help.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept CashApp, PayPal, Chime, and Robux. Prices are listed in USD with Robux equivalents. A 50% deposit is required to start, with the remaining balance due upon completion.",
  },
  {
    question: "I am not a gamer -- can you still help me?",
    answer: "Absolutely. While we started in the gaming space, we now offer full branding, marketing, business, and social media design services for any industry. Our process is the same regardless of your background.",
  },
  {
    question: "What if I need changes after delivery?",
    answer: "All packages include reasonable revisions during the project. Additional revisions after delivery can be arranged at a fair rate or through a maintenance package.",
  },
  {
    question: "How do rush orders work?",
    answer: "We accommodate rush orders for an additional 25-50% fee depending on urgency and project scope. Contact us to discuss your timeline.",
  },
  {
    question: "Do you offer refunds?",
    answer: "We offer a full refund if you are not satisfied with the initial concepts, provided you request it before the first revision round begins.",
  },
  {
    question: "What file formats will I receive?",
    answer: "You receive all necessary formats including PNG, SVG, PDF, and source files where applicable. Print-ready and web-ready versions are included in all packages.",
  },
  {
    question: "Can I bundle services or get a custom quote?",
    answer: "Yes. We offer pre-made bundles at a discount, and we are happy to create custom packages for larger projects. Contact us for a tailored quote.",
  },
];

export function PricingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} className="py-24 lg:py-36">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        {/* Heading */}
        <div className={cn("mb-20", isInView && "animate-reveal-up")}>
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">
            <span className="h-px w-8 bg-primary" />
            FAQ
          </span>
          <h2
            className="mt-5 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-balance"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Common questions
          </h2>
        </div>

        {/* Accordion */}
        <div className="space-y-0 border-t border-border/30">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className={cn(
                  "border-b border-border/30 transition-colors",
                  isInView && "animate-reveal-fade",
                  isInView && `stagger-${Math.min(index + 1, 8)}`
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between py-7 text-left group"
                >
                  <span className={cn(
                    "text-base font-bold transition-colors pr-8",
                    isOpen ? "text-primary" : "text-foreground group-hover:text-primary"
                  )} style={{ fontFamily: "var(--font-display)" }}>
                    {faq.question}
                  </span>
                  <div className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                    isOpen ? "border-primary bg-primary text-primary-foreground rotate-0" : "border-border/50 text-muted-foreground"
                  )}>
                    {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                  </div>
                </button>
                <div className={cn(
                  "grid transition-all duration-300",
                  isOpen ? "grid-rows-[1fr] opacity-100 pb-7" : "grid-rows-[0fr] opacity-0"
                )}>
                  <div className="overflow-hidden">
                    <p className="text-muted-foreground leading-relaxed pr-12">{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
