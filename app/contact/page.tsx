import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ContactHero } from "@/components/contact/contact-hero";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactInfo } from "@/components/contact/contact-info";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | VisoryX",
  description: "Get in touch with VisoryX for inquiries, custom projects, or business collaborations. We are here to help.",
};

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        <ContactHero />
        <div className="py-20 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-16 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <ContactForm />
              </div>
              <div>
                <ContactInfo />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
