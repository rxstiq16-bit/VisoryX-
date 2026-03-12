import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { AffiliationsContent } from "@/components/affiliations/affiliations-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliations | VisoryX",
  description:
    "Partner with VisoryX. Learn about our strategic affiliation program, the benefits of partnering, and how to apply.",
};

export default function AffiliationsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        <AffiliationsContent />
      </main>
      <Footer />
    </div>
  );
}
