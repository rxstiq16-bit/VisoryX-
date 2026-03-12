import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BrandKit } from "@/components/brand-kit"

export const metadata: Metadata = {
  title: "Brand Kit | VisoryX",
  description: "Store and manage your brand assets, colors, fonts, and logos in one place.",
}

export default function BrandKitPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="container flex-1 py-12">
        <BrandKit />
      </main>
      <Footer />
    </div>
  )
}
