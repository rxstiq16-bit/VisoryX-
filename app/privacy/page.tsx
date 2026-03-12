import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | VisoryX",
  description: "VisoryX Privacy Policy - Learn how we collect, use, and protect your information.",
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1 pt-20">
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <div className="mb-12 text-center">
              <p className="text-sm font-medium uppercase tracking-wider text-primary">
                Legal
              </p>
              <h1
                className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Privacy Policy
              </h1>
              <p className="mt-4 text-muted-foreground">
                Last Updated: January 31, 2026
              </p>
            </div>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <div className="space-y-8">
                <section className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">1. Information We Collect</h2>
                  <p className="text-muted-foreground mb-4">We may collect:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Usernames (Roblox / Discord)</li>
                    <li>Email addresses</li>
                    <li>Payment-related information (processed via third parties)</li>
                    <li>Project files and communications</li>
                  </ul>
                </section>

                <section className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">2. How We Use Information</h2>
                  <p className="text-muted-foreground mb-4">Information is used to:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Deliver and manage services</li>
                    <li>Communicate with clients</li>
                    <li>Process payments</li>
                    <li>Maintain records</li>
                  </ul>
                </section>

                <section className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">3. Information Sharing</h2>
                  <p className="text-muted-foreground mb-4">
                    VisoryX does not sell or rent personal information.
                  </p>
                  <p className="text-muted-foreground mb-2">Information may be shared only with:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Payment processors</li>
                    <li>Legal authorities if required by law</li>
                  </ul>
                </section>

                <section className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">4. Data Security</h2>
                  <p className="text-muted-foreground">
                    We take reasonable measures to protect your data, but no online service is completely secure. We implement industry-standard security practices to safeguard your information.
                  </p>
                </section>

                <section className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">5. Data Retention</h2>
                  <p className="text-muted-foreground">
                    Project files and messages may be retained for record-keeping unless deletion is requested. We retain data for as long as necessary to fulfill our services and legal obligations.
                  </p>
                </section>

                <section className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">6. Your Rights</h2>
                  <p className="text-muted-foreground mb-4">You may request:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Access to your stored information</li>
                    <li>Deletion of your data (excluding required records)</li>
                    <li>Correction of inaccurate information</li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    Requests can be made via email at{" "}
                    <a href="mailto:contact@visoryx.design" className="text-primary hover:underline">
                      contact@visoryx.design
                    </a>
                  </p>
                </section>

                <section className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">7. Third-Party Services</h2>
                  <p className="text-muted-foreground">
                    VisoryX may use third-party platforms such as Discord, Roblox, or payment processors. We are not responsible for their privacy practices. We encourage you to review the privacy policies of any third-party services you interact with.
                  </p>
                </section>

                <section className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">8. Cookies &amp; Tracking</h2>
                  <p className="text-muted-foreground">
                    Our website may use cookies and similar technologies to enhance your browsing experience. These help us understand how visitors interact with our site and improve our services.
                  </p>
                </section>

                <section className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">9. Policy Changes</h2>
                  <p className="text-muted-foreground">
                    We may update this Privacy Policy at any time. Continued use of our services constitutes acceptance of changes. We recommend reviewing this policy periodically for any updates.
                  </p>
                </section>

                <section className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">10. Contact</h2>
                  <p className="text-muted-foreground">
                    For privacy-related questions, contact us at:{" "}
                    <a href="mailto:contact@visoryx.design" className="text-primary hover:underline">
                      contact@visoryx.design
                    </a>
                  </p>
                </section>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
