"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CommunityHub } from "@/components/community/community-hub"

export default function CommunityPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        <CommunityHub />
      </main>
      <Footer />
    </div>
  )
}
