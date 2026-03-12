import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | VisoryX",
  description: "VisoryX Terms of Service - Read our terms and conditions for using our design services.",
};

export default function TermsPage() {
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
                Terms of Service
              </h1>
              <p className="mt-4 text-muted-foreground">
                Last Updated: January 31, 2026
              </p>
            </div>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <div className="space-y-8">
                <section className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
                  <p className="text-muted-foreground">
                    By purchasing, commissioning, or using services from VisoryX (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), you agree to these Terms of Service. If you do not agree, do not use our services.
                  </p>
                </section>

                <section className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">2. Services Provided</h2>
                  <p className="text-muted-foreground mb-4">
                    VisoryX provides digital design services including but not limited to:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Discord server development &amp; configuration</li>
                    <li>Roblox ERLC liveries</li>
                    <li>Branding, logos, and visual assets</li>
                    <li>Related digital design work</li>
                  </ul>
                  <p className="text-muted-foreground mt-4">All services are digital-only.</p>
                </section>

                <section className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">3. Intellectual Property &amp; Ownership</h2>
                  
                  <h3 className="text-lg font-medium text-foreground mb-2">3.1 Ownership of Work</h3>
                  <p className="text-muted-foreground mb-4">
                    All designs, concepts, drafts, files, and assets created by VisoryX remain the intellectual property of VisoryX until full payment is received. Once full payment is completed, the client receives a non-exclusive, non-transferable license to use the final delivered product for its intended purpose only.
                  </p>
                  
                  <h3 className="text-lg font-medium text-foreground mb-2">3.2 What You MAY Do</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                    <li>Use the final design for your Roblox group, game, Discord server, or brand</li>
                    <li>Display the design for promotional or operational use</li>
                  </ul>
                  
                  <h3 className="text-lg font-medium text-foreground mb-2">3.3 What You MAY NOT Do</h3>
                  <p className="text-muted-foreground mb-2">You may NOT:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Resell, redistribute, or sublicense any VisoryX work</li>
                    <li>Claim VisoryX designs as your own</li>
                    <li>Reuse designs for other groups, games, or servers not agreed upon</li>
                    <li>Upload designs as templates, assets, or packs</li>
                    <li>Modify designs and sell or redistribute them</li>
                    <li>Mint designs as NFTs or digital collectibles</li>
                    <li>Remove watermarks from unpaid or preview work</li>
                  </ul>
                  <p className="text-primary font-medium mt-4">
                    Unauthorized use is considered theft and copyright infringement.
                  </p>
                </section>

                <section className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">4. Reselling &amp; Redistribution</h2>
                  <p className="text-muted-foreground mb-4">
                    Reselling VisoryX work in any form is strictly prohibited unless explicit written permission is granted. This includes but is not limited to:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Selling liveries to other Roblox groups</li>
                    <li>Reusing branding for multiple projects</li>
                    <li>Selling Discord setups or layouts created by VisoryX</li>
                    <li>Including VisoryX work in paid commissions or bundles</li>
                  </ul>
                  <p className="text-destructive font-medium mt-4">
                    Violations will result in immediate revocation of usage rights.
                  </p>
                </section>

                <section className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">5. Theft, Leaks &amp; Infringement</h2>
                  <p className="text-muted-foreground mb-4">The following actions are strictly prohibited:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Stealing or leaking files</li>
                    <li>Sharing paid work with third parties</li>
                    <li>Using rejected or unpaid concepts</li>
                    <li>Recreating VisoryX designs to bypass payment</li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    VisoryX reserves the right to pursue DMCA takedowns, platform reports, and legal action where applicable.
                  </p>
                </section>

                <section className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">6. Payments &amp; Refunds</h2>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>All payments must be made upfront or as agreed</li>
                    <li>Deposits are non-refundable</li>
                    <li>No files or source materials will be delivered before full payment</li>
                    <li>Refunds are not guaranteed once work has started</li>
                  </ul>
                </section>

                <section className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">7. Client Responsibilities</h2>
                  <p className="text-muted-foreground mb-4">Clients are responsible for:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Providing accurate information and assets</li>
                    <li>Ensuring they own rights to any materials provided</li>
                    <li>Reviewing work in a timely manner</li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    Delays caused by the client do not obligate refunds.
                  </p>
                </section>

                <section className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">8. Discord &amp; Roblox Disclaimer</h2>
                  <p className="text-muted-foreground mb-4">
                    VisoryX is not affiliated with Roblox Corporation or Discord Inc. All trademarks belong to their respective owners.
                  </p>
                  <p className="text-muted-foreground mb-2">We are not responsible for:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Platform moderation actions</li>
                    <li>Account bans</li>
                    <li>Server or group takedowns due to client misuse</li>
                  </ul>
                </section>

                <section className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">9. Termination of Service</h2>
                  <p className="text-muted-foreground mb-4">VisoryX reserves the right to refuse or terminate service for:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Violations of these Terms</li>
                    <li>Non-payment</li>
                    <li>Harassment or abuse</li>
                    <li>Attempted theft or chargebacks</li>
                  </ul>
                </section>

                <section className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">10. Governing Law</h2>
                  <p className="text-muted-foreground">
                    These Terms are governed by applicable laws. Any disputes shall be resolved through appropriate legal channels.
                  </p>
                </section>

                <section className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">11. Contact</h2>
                  <p className="text-muted-foreground">
                    Questions regarding these Terms may be sent to:{" "}
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
