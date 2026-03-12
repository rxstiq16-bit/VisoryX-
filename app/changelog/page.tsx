"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Sparkles, Bug, Wrench, Zap, Search, Filter } from "lucide-react"
import { cn } from "@/lib/utils"

const changelogEntries = [
  {
    version: "2.5.0",
    date: "2024-03-10",
    type: "feature",
    title: "AI Design Assistant",
    description: "Introducing our new AI-powered design assistant that helps you create better briefs and get accurate price estimates.",
    items: [
      "AI brief generator from plain text",
      "Smart price estimation based on project complexity",
      "Color palette suggestions from reference images",
      "Style matching recommendations"
    ]
  },
  {
    version: "2.4.2",
    date: "2024-03-05",
    type: "fix",
    title: "Bug Fixes & Performance",
    description: "Various bug fixes and performance improvements across the platform.",
    items: [
      "Fixed file upload progress not showing correctly",
      "Improved chat loading times by 40%",
      "Fixed notification sound not playing on mobile",
      "Resolved order status not updating in real-time"
    ]
  },
  {
    version: "2.4.0",
    date: "2024-02-28",
    type: "feature",
    title: "Loyalty Program Launch",
    description: "Earn points on every order and unlock exclusive rewards and discounts.",
    items: [
      "Bronze, Silver, Gold, and Platinum tiers",
      "Points for orders, referrals, and reviews",
      "Exclusive member-only rewards",
      "Real-time points tracking"
    ]
  },
  {
    version: "2.3.5",
    date: "2024-02-20",
    type: "improvement",
    title: "Order Experience Improvements",
    description: "Enhanced the order placement and tracking experience.",
    items: [
      "Redesigned order form with better UX",
      "Real-time order status updates",
      "Improved file gallery with lightbox",
      "Better mobile responsiveness"
    ]
  },
  {
    version: "2.3.0",
    date: "2024-02-10",
    type: "feature",
    title: "ERLC Livery Services",
    description: "New dedicated services for ERLC vehicle liveries with specialized tools.",
    items: [
      "LEO, FD, and Civilian livery packages",
      "Fleet packages with bulk discounts",
      "Reference image galleries",
      "Vehicle model presets"
    ]
  },
  {
    version: "2.2.0",
    date: "2024-01-25",
    type: "feature",
    title: "Discord Integration",
    description: "Connect your Discord account for real-time notifications and support.",
    items: [
      "Order status notifications via DM",
      "Direct designer communication",
      "Server setup services",
      "Bot configuration packages"
    ]
  }
]

const typeConfig = {
  feature: { icon: Sparkles, color: "text-emerald-500", bg: "bg-emerald-500/10", label: "New Feature" },
  fix: { icon: Bug, color: "text-red-500", bg: "bg-red-500/10", label: "Bug Fix" },
  improvement: { icon: Wrench, color: "text-blue-500", bg: "bg-blue-500/10", label: "Improvement" },
  performance: { icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10", label: "Performance" }
}

export default function ChangelogPage() {
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState<string | null>(null)

  const filteredEntries = changelogEntries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(search.toLowerCase()) ||
      entry.description.toLowerCase().includes(search.toLowerCase())
    const matchesType = !filterType || entry.type === filterType
    return matchesSearch && matchesType
  })

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        <section className="border-b bg-gradient-to-b from-muted/50 py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="secondary" className="mb-4">Changelog</Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">What&apos;s New</h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Stay up to date with the latest features, improvements, and bug fixes.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto max-w-4xl px-4">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search updates..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Badge
                  variant={filterType === null ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setFilterType(null)}
                >
                  All
                </Badge>
                {Object.entries(typeConfig).map(([type, config]) => (
                  <Badge
                    key={type}
                    variant={filterType === type ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setFilterType(type)}
                  >
                    {config.label}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              {filteredEntries.map((entry, index) => {
                const config = typeConfig[entry.type as keyof typeof typeConfig]
                const Icon = config.icon
                return (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn("rounded-lg p-2", config.bg)}>
                            <Icon className={cn("h-5 w-5", config.color)} />
                          </div>
                          <div>
                            <CardTitle className="text-xl">{entry.title}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">v{entry.version}</Badge>
                              <span>{new Date(entry.date).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}</span>
                            </CardDescription>
                          </div>
                        </div>
                        <Badge className={cn(config.bg, config.color, "border-0")}>
                          {config.label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{entry.description}</p>
                      <ul className="space-y-2">
                        {entry.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
