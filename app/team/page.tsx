import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { TeamShowcase } from "@/components/team/team-showcase"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Meet the Creators | VisoryX",
  description: "The people behind VisoryX -- designers, developers, and strategists building brands that dominate.",
}

export default function TeamPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        <TeamShowcase />
      </main>
      <Footer />
    </div>
  )
}
