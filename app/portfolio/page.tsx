import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PortfolioHero } from "@/components/portfolio/portfolio-hero";
import { PortfolioSection } from "@/components/portfolio/portfolio-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio | VisoryX",
  description: "Explore our creative design work including logo designs, branding, Discord development, gaming liveries, social media graphics, and business kits.",
};

export default function PortfolioPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        <PortfolioHero />
        <PortfolioSection />
      </main>
      <Footer />
    </div>
  );
}
