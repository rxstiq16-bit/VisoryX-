import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { QRCodeGenerator } from "@/components/qr-code"

export const metadata: Metadata = {
  title: "QR Code Generator | VisoryX Tools",
  description: "Generate QR codes for your orders, links, and more.",
}

export default function QRCodeToolPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1 py-12">
        <div className="container max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight">QR Code Generator</h1>
            <p className="mt-2 text-muted-foreground">
              Create QR codes for orders, links, contact info, and more
            </p>
          </div>
          <QRCodeGenerator />
        </div>
      </main>
      <Footer />
    </div>
  )
}
