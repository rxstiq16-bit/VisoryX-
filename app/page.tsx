import type { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/home/hero-section";
import { ServicesSection } from "@/components/home/services-section";
import { ShowcaseSection } from "@/components/home/showcase-section";
import { ProcessSection } from "@/components/home/process-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { CTASection } from "@/components/home/cta-section";
import { Footer } from "@/components/footer";
import { ErrorBoundary } from "@/components/error-boundary";
import { ServiceStatusSection } from "@/components/home/service-status-section";
import { TrustBadges } from "@/components/trust-badges";
import { LiveOrderCounter } from "@/components/live-order-counter";
import { ClientLogos } from "@/components/client-logos";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { FAQChatbot } from "@/components/faq-chatbot";
import { OrganizationSchema, AggregateReviewSchema } from "@/components/structured-data";
import { Guarantees } from "@/components/guarantees";
import { SatisfactionStats } from "@/components/satisfaction-stats";

const reviews = [
  { author: "Alex M.", rating: 5, reviewBody: "Incredible quality and fast delivery. Best design service I've used!" },
  { author: "Jordan T.", rating: 5, reviewBody: "The ERLC liveries are absolutely amazing. Highly recommend!" },
  { author: "Sam K.", rating: 5, reviewBody: "Professional branding that exceeded my expectations." },
  { author: "Morgan R.", rating: 4, reviewBody: "Great communication and beautiful designs." },
  { author: "Casey L.", rating: 5, reviewBody: "Fast turnaround and the quality is outstanding." },
]

export const metadata: Metadata = {
  title: "VisoryX | Premium Design Studio - Design Beyond Vision",
  description:
    "Premium design studio specializing in custom logos, branding, Discord servers, gaming liveries, social media graphics, and business kits. Professional designs starting at $3.75 with fast turnaround.",
  openGraph: {
    title: "VisoryX | Premium Design Studio - Design Beyond Vision",
    description:
      "Premium design studio specializing in custom logos, branding, Discord servers, gaming liveries, social media graphics, and business kits.",
    type: "website",
    images: [
      {
        url: "/images/visoryx-social-share.png",
        width: 1200,
        height: 630,
        alt: "VisoryX - Design Beyond Vision",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VisoryX | Premium Design Studio - Design Beyond Vision",
    description:
      "Premium design studio specializing in custom logos, branding, Discord servers, gaming liveries, social media graphics, and business kits.",
    images: ["/images/visoryx-social-share.png"],
  },
};

export default function HomePage() {
  return (
    <main>
      <OrganizationSchema />
      <AggregateReviewSchema itemReviewed="VisoryX Design Services" reviews={reviews} />
      <Navigation />
      <HeroSection />
      <ErrorBoundary>
        <TrustBadges />
      </ErrorBoundary>
      <ErrorBoundary>
        <ServicesSection />
      </ErrorBoundary>
      <ErrorBoundary>
        <ServiceStatusSection />
      </ErrorBoundary>
      <ErrorBoundary>
        <LiveOrderCounter />
      </ErrorBoundary>
      <ErrorBoundary>
        <ShowcaseSection />
      </ErrorBoundary>
      <ErrorBoundary>
        <ProcessSection />
      </ErrorBoundary>
      <ErrorBoundary>
        <ClientLogos />
      </ErrorBoundary>
      <ErrorBoundary>
        <TestimonialsSection />
      </ErrorBoundary>
      <ErrorBoundary>
        <SatisfactionStats variant="grid" className="container py-16" />
      </ErrorBoundary>
      <ErrorBoundary>
        <Guarantees />
      </ErrorBoundary>
      <ErrorBoundary>
        <NewsletterSignup />
      </ErrorBoundary>
      <CTASection />
      <Footer />
      <FAQChatbot />
    </main>
  );
}
