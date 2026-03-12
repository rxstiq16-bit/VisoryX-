import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PricingHero } from "@/components/pricing/pricing-hero";
import { PricingTiers } from "@/components/pricing/pricing-tiers";
import { PricingFAQ } from "@/components/pricing/pricing-faq";
import { CommissionSlots } from "@/components/order/commission-slots";
import { OrderBundles } from "@/components/order/order-bundles";
import { RobuxCalculator } from "@/components/robux-calculator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | VisoryX",
  description:
    "Transparent pricing for our design services. Choose from our packages or request custom pricing for your project.",
};

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        <PricingHero />
        <CommissionSlots />
        <PricingTiers />
        <OrderBundles />
        <RobuxCalculator />
        <PricingFAQ />
      </main>
      <Footer />
    </div>
  );
}
