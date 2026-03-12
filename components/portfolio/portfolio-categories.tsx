"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const categories = [
  { id: "all", label: "All Projects" },
  { id: "logos", label: "Logo Design" },
  { id: "branding", label: "Branding" },
  { id: "erlc", label: "ERLC Liveries" },
  { id: "discord", label: "Discord" },
];

export function PortfolioCategories() {
  const [active, setActive] = useState("all");

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-2 py-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActive(category.id)}
              type="button"
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-all",
                active === category.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
              )}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
