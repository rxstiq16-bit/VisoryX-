import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { MoodBoard } from "@/components/mood-board"

export const metadata: Metadata = {
  title: "Mood Board | VisoryX",
  description: "Create inspiration boards to communicate your design vision.",
}

export default function MoodBoardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="container flex-1 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Mood Board</h1>
          <p className="mt-2 text-muted-foreground">
            Create visual inspiration boards to share your design ideas with our team
          </p>
        </div>
        <MoodBoard className="mb-12" />
      </main>
      <Footer />
    </div>
  )
}
