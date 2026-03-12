"use client";

import { useState } from "react";
import { ChevronDown, Search, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const faqCategories = [
  {
    category: "Ordering",
    questions: [
      {
        q: "How do I place an order?",
        a: "Head to our Order page, select a service category, pick the specific service you need, fill in the details form, and choose your payment method (USD via Stripe or Robux). Once payment is confirmed, your order will be assigned to a designer.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept USD payments via Stripe (credit/debit cards) and Robux payments through Roblox. You can choose your preferred method during checkout.",
      },
      {
        q: "Can I request revisions?",
        a: "Yes! Each order includes revisions. You can submit revision requests through your ticket with specific feedback on what you'd like changed. Our designers will work with you until you're satisfied.",
      },
      {
        q: "How long does delivery take?",
        a: "Delivery times vary by service. Simple graphics like icons or banners typically take 1-2 days. Larger projects like full brand kits or Discord server setups can take 3-7 days. You'll see an estimated timeline when you place your order.",
      },
      {
        q: "Can I cancel my order?",
        a: "You can request a cancellation before work begins on your order. Once a designer has started working, cancellations are handled on a case-by-case basis. Contact us through the ticket system.",
      },
    ],
  },
  {
    category: "Services",
    questions: [
      {
        q: "What services do you offer?",
        a: "We offer 7 service categories: Branding & Identity, Community & Discord, Gaming & Creator Packs, Business & Startup Kits, Marketing & Social Media, UI & Visual Assets, and Courses. Each category has multiple individual services to choose from.",
      },
      {
        q: "Do you make ERLC liveries?",
        a: "Yes! Our Gaming & Creator Packs category includes ERLC vehicle liveries for LEO, Fire/EMS, DoT, and civilian vehicles. We also offer custom department livery packs.",
      },
      {
        q: "Can you set up my Discord server?",
        a: "Absolutely. Our Community & Discord services include full server setup with channels, roles, permissions, embeds, bot configuration, and branding. We can also build custom bots.",
      },
      {
        q: "Do you offer courses?",
        a: "Yes! We have courses on Beginner Design, Logo Design, ERLC Liveries, Discord Server Design, and Social Media Design. You can purchase individual courses or get the full bundle at a discount.",
      },
    ],
  },
  {
    category: "Pricing",
    questions: [
      {
        q: "Are your prices in USD or Robux?",
        a: "Both! Every service has a USD price and a Robux price. You choose which currency to pay with at checkout. Our Robux rates use a $1 = 80 R$ conversion.",
      },
      {
        q: "Do you offer discounts?",
        a: "Yes, we have coupon codes for promotions, referral discounts, and loyalty rewards for repeat customers. Follow our updates page to catch deals.",
      },
      {
        q: "Is there a bulk discount?",
        a: "For large orders or ongoing work, contact us to discuss custom pricing. We offer package deals for businesses that need regular design work.",
      },
    ],
  },
  {
    category: "Account & Support",
    questions: [
      {
        q: "How do I track my order?",
        a: "Once your order is placed, you'll get a ticket with a progress tracker showing each stage: Submitted, In Review, In Progress, Under Review, and Delivered. You'll also get notifications for status updates.",
      },
      {
        q: "How do I contact support?",
        a: "You can reach us through the ticket system on your order, or visit our contact page for quick help. For business inquiries, email us directly.",
      },
      {
        q: "Can I apply to be a designer?",
        a: "Yes! We're always looking for talented designers. Check our applications page for open positions and submit your portfolio for review.",
      },
    ],
  },
];

export function FAQSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (key: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const filteredCategories = faqCategories
    .map((cat) => ({
      ...cat,
      questions: cat.questions.filter(
        (q) =>
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((cat) => cat.questions.length > 0);

  return (
    <section className="py-20">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-balance">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Find answers to common questions about our services
          </p>
        </div>

        <div className="relative mb-10">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No matching questions found.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredCategories.map((cat) => (
              <div key={cat.category}>
                <h2 className="text-lg font-semibold text-primary mb-3">
                  {cat.category}
                </h2>
                <div className="space-y-2">
                  {cat.questions.map((item) => {
                    const key = `${cat.category}-${item.q}`;
                    const isOpen = openItems.has(key);
                    return (
                      <div
                        key={key}
                        className="rounded-lg border border-border/50 bg-card overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={() => toggleItem(key)}
                          className="flex w-full items-center justify-between p-4 text-left font-medium hover:bg-muted/30 transition-colors"
                        >
                          {item.q}
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                              isOpen && "rotate-180"
                            )}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 rounded-xl border border-border/50 bg-card p-6 text-center">
          <MessageCircle className="mx-auto h-8 w-8 text-primary" />
          <h3 className="mt-3 font-semibold">Still have questions?</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {"Can't find what you're looking for? Reach out to our team."}
          </p>
          <Button asChild className="mt-4">
            <Link href="/tickets">Contact Support</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
