import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { AboutHero } from "@/components/about/about-hero";
import { MissionSection } from "@/components/about/mission-section";
import { ReviewsSection } from "@/components/about/reviews-section";
import { TeamSection } from "@/components/about/team-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | VisoryX",
  description:
    "Learn about VisoryX, our mission, vision, and commitment to delivering exceptional design solutions.",
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        <AboutHero />
        <MissionSection />
        <ReviewsSection />
        <TeamSection />
      </main>
      <Footer />
    </div>
  );
}
