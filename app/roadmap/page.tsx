"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThumbsUp, Clock, CheckCircle2, Rocket, Sparkles, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

const roadmapItems = [
  {
    id: 1,
    title: "AI Brief Generator",
    description: "Use AI to automatically generate detailed design briefs from simple descriptions.",
    status: "in-progress",
    progress: 75,
    category: "AI & Automation",
    votes: 234,
    eta: "Q1 2024"
  },
  {
    id: 2,
    title: "Video Call Integration",
    description: "Schedule video consultations directly with designers for complex projects.",
    status: "planned",
    progress: 0,
    category: "Communication",
    votes: 189,
    eta: "Q2 2024"
  },
  {
    id: 3,
    title: "Mobile App",
    description: "Native iOS and Android apps for managing orders on the go.",
    status: "planned",
    progress: 0,
    category: "Platform",
    votes: 412,
    eta: "Q2 2024"
  },
  {
    id: 4,
    title: "Real-time Collaboration",
    description: "See live cursor positions and edits when collaborating on designs.",
    status: "in-progress",
    progress: 40,
    category: "Collaboration",
    votes: 156,
    eta: "Q1 2024"
  },
  {
    id: 5,
    title: "Advanced Analytics",
    description: "Deep insights into your design spending, trends, and ROI.",
    status: "completed",
    progress: 100,
    category: "Analytics",
    votes: 98,
    eta: "Shipped!"
  },
  {
    id: 6,
    title: "Figma Plugin",
    description: "Import VisoryX designs directly into your Figma projects.",
    status: "planned",
    progress: 0,
    category: "Integrations",
    votes: 267,
    eta: "Q3 2024"
  },
  {
    id: 7,
    title: "Multi-language Support",
    description: "Full platform translation for Spanish, French, German, and more.",
    status: "in-progress",
    progress: 25,
    category: "Localization",
    votes: 143,
    eta: "Q2 2024"
  },
  {
    id: 8,
    title: "Design Templates Library",
    description: "Pre-made templates that designers can customize for faster delivery.",
    status: "completed",
    progress: 100,
    category: "Features",
    votes: 321,
    eta: "Shipped!"
  }
]

const statusConfig = {
  planned: { icon: Clock, color: "text-muted-foreground", bg: "bg-muted", label: "Planned" },
  "in-progress": { icon: Rocket, color: "text-blue-500", bg: "bg-blue-500/10", label: "In Progress" },
  completed: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10", label: "Completed" }
}

export default function RoadmapPage() {
  const [votedItems, setVotedItems] = useState<number[]>([])

  const handleVote = (id: number) => {
    if (votedItems.includes(id)) {
      setVotedItems(votedItems.filter(i => i !== id))
    } else {
      setVotedItems([...votedItems, id])
    }
  }

  const getItemsByStatus = (status: string) => 
    roadmapItems.filter(item => item.status === status)
      .sort((a, b) => b.votes - a.votes)

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        <section className="border-b bg-gradient-to-b from-muted/50 py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="secondary" className="mb-4">Roadmap</Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">What We&apos;re Building</h1>
              <p className="mt-4 text-lg text-muted-foreground">
                See what&apos;s coming next and vote for features you want most.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto max-w-6xl px-4">
            <Tabs defaultValue="all" className="space-y-8">
              <TabsList className="grid w-full grid-cols-4 max-w-md mx-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="planned">Planned</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {roadmapItems.map((item) => {
                    const config = statusConfig[item.status as keyof typeof statusConfig]
                    const Icon = config.icon
                    const hasVoted = votedItems.includes(item.id)
                    return (
                      <Card key={item.id} className="flex flex-col">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <Badge variant="outline" className="text-xs">{item.category}</Badge>
                            <Badge className={cn(config.bg, config.color, "border-0 gap-1")}>
                              <Icon className="h-3 w-3" />
                              {config.label}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg mt-3">{item.title}</CardTitle>
                          <CardDescription>{item.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col justify-end">
                          {item.status === "in-progress" && (
                            <div className="mb-4">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-medium">{item.progress}%</span>
                              </div>
                              <Progress value={item.progress} className="h-2" />
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <Button
                              variant={hasVoted ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleVote(item.id)}
                              className="gap-2"
                            >
                              <ThumbsUp className="h-4 w-4" />
                              {hasVoted ? item.votes + 1 : item.votes}
                            </Button>
                            <span className="text-sm text-muted-foreground">{item.eta}</span>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </TabsContent>

              {["planned", "in-progress", "completed"].map(status => (
                <TabsContent key={status} value={status} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {getItemsByStatus(status).map((item) => {
                      const config = statusConfig[item.status as keyof typeof statusConfig]
                      const Icon = config.icon
                      const hasVoted = votedItems.includes(item.id)
                      return (
                        <Card key={item.id} className="flex flex-col">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <Badge variant="outline" className="text-xs">{item.category}</Badge>
                              <Badge className={cn(config.bg, config.color, "border-0 gap-1")}>
                                <Icon className="h-3 w-3" />
                                {config.label}
                              </Badge>
                            </div>
                            <CardTitle className="text-lg mt-3">{item.title}</CardTitle>
                            <CardDescription>{item.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="flex-1 flex flex-col justify-end">
                            {item.status === "in-progress" && (
                              <div className="mb-4">
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-muted-foreground">Progress</span>
                                  <span className="font-medium">{item.progress}%</span>
                                </div>
                                <Progress value={item.progress} className="h-2" />
                              </div>
                            )}
                            <div className="flex items-center justify-between">
                              <Button
                                variant={hasVoted ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleVote(item.id)}
                                className="gap-2"
                              >
                                <ThumbsUp className="h-4 w-4" />
                                {hasVoted ? item.votes + 1 : item.votes}
                              </Button>
                              <span className="text-sm text-muted-foreground">{item.eta}</span>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            <Card className="mt-12 bg-primary/5 border-primary/20">
              <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Have a feature idea?</h3>
                    <p className="text-sm text-muted-foreground">We&apos;d love to hear your suggestions!</p>
                  </div>
                </div>
                <Button className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Submit Feature Request
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
