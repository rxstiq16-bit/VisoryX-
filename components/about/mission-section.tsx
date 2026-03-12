import { Target, Eye, Heart } from "lucide-react";

const items = [
  {
    icon: Target,
    title: "Our Mission",
    description: "To empower businesses with exceptional design solutions that communicate their unique value proposition and drive meaningful connections with their audience.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    description: "To be the leading creative design partner for innovative brands worldwide, setting new standards in visual communication and digital experience design.",
  },
  {
    icon: Heart,
    title: "Our Purpose",
    description: "To bridge the gap between ideas and visual reality, helping businesses tell their stories through compelling design that inspires and converts.",
  },
];

export function MissionSection() {
  return (
    <section className="border-t border-border bg-secondary/20 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-border bg-card p-8"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <item.icon className="h-6 w-6" />
              </div>
              <h3
                className="mt-6 text-xl font-semibold text-foreground"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {item.title}
              </h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
