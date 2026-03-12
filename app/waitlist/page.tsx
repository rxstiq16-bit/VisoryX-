"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Clock, 
  Sparkles, 
  Bell, 
  Gift,
  ArrowRight,
  CheckCircle,
  Users,
  Loader2
} from "lucide-react"

export default function WaitlistPage() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [discord, setDiscord] = useState("")
  const [interests, setInterests] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [position, setPosition] = useState(0)

  const interestOptions = [
    { id: "branding", label: "Branding & Logos" },
    { id: "discord", label: "Discord Services" },
    { id: "erlc", label: "ERLC Liveries" },
    { id: "streaming", label: "Streaming Graphics" },
    { id: "roblox", label: "Roblox Assets" },
    { id: "business", label: "Business Materials" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setPosition(Math.floor(Math.random() * 100) + 50)
    setSubmitted(true)
    setSubmitting(false)
  }

  const toggleInterest = (id: string) => {
    setInterests(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navigation />
        <main className="flex flex-1 items-center justify-center py-20">
          <Card className="mx-4 max-w-md text-center">
            <CardContent className="p-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="mb-2 text-2xl font-bold">You're on the list!</h2>
              <p className="mb-6 text-muted-foreground">
                You're #{position} on the waitlist. We'll notify you when spots open up.
              </p>
              <div className="mb-6 rounded-lg bg-muted p-4">
                <p className="text-sm font-medium">Move up the list by sharing:</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Each referral moves you up 5 spots!
                </p>
                <Input 
                  value={`https://visoryx.com/waitlist?ref=${email.split('@')[0]}`}
                  readOnly 
                  className="mt-3 text-center text-sm"
                />
              </div>
              <Button variant="outline" className="w-full">
                Share on Discord
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-20">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="secondary" className="mb-4">
                <Clock className="mr-1.5 h-3 w-3" />
                Limited Availability
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Join the <span className="text-primary">Waitlist</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                We're currently at capacity. Join our waitlist to be notified when new spots open up and get exclusive early access perks.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-12">
          <div className="container">
            <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-3">
              {[
                { icon: Bell, title: "Priority Access", description: "Be first in line when spots open" },
                { icon: Gift, title: "Exclusive Discount", description: "10% off your first order" },
                { icon: Sparkles, title: "Early Previews", description: "See new services before launch" },
              ].map((benefit) => (
                <Card key={benefit.title}>
                  <CardContent className="p-6 text-center">
                    <benefit.icon className="mx-auto mb-3 h-8 w-8 text-primary" />
                    <h3 className="font-semibold">{benefit.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="pb-20">
          <div className="container">
            <Card className="mx-auto max-w-lg">
              <CardHeader>
                <CardTitle>Join the Waitlist</CardTitle>
                <CardDescription>
                  Fill out the form below to secure your spot
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="discord">Discord Username (Optional)</Label>
                    <Input
                      id="discord"
                      value={discord}
                      onChange={(e) => setDiscord(e.target.value)}
                      placeholder="username#0000"
                    />
                  </div>
                  <div>
                    <Label>What services are you interested in?</Label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {interestOptions.map((option) => (
                        <div
                          key={option.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={option.id}
                            checked={interests.includes(option.id)}
                            onCheckedChange={() => toggleInterest(option.id)}
                          />
                          <Label htmlFor={option.id} className="text-sm font-normal">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      <>
                        Join Waitlist
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Current position count */}
            <div className="mt-8 flex items-center justify-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="text-sm">
                <strong>247</strong> people are currently on the waitlist
              </span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
