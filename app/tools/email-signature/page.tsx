import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { EmailSignatureGenerator } from "@/components/email-signature"

export const metadata: Metadata = {
  title: "Email Signature Generator | VisoryX Tools",
  description: "Create professional email signatures for your brand with our free generator.",
}

export default function EmailSignaturePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1 py-12">
        <div className="container max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Email Signature Generator</h1>
            <p className="mt-2 text-muted-foreground">
              Create professional email signatures that match your brand
            </p>
          </div>
          <EmailSignatureGenerator />
        </div>
      </main>
      <Footer />
    </div>
  )
}
