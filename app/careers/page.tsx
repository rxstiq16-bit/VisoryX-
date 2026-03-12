"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Palette, Users, Clock, MapPin, DollarSign, Heart, 
  Sparkles, Coffee, Zap, ArrowRight 
} from "lucide-react"
import Link from "next/link"

const openPositions = [
  {
    title: "Senior Graphic Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    salary: "$60k - $80k",
    description: "Create stunning designs for our premium clients across branding, gaming, and business verticals."
  },
  {
    title: "ERLC Livery Specialist",
    department: "Design",
    location: "Remote",
    type: "Contract",
    salary: "$40 - $60/hr",
    description: "Specialize in creating vehicle liveries for ERLC roleplay communities."
  },
  {
    title: "Discord Bot Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    salary: "$70k - $100k",
    description: "Build and maintain our Discord integration, bots, and community tools."
  },
  {
    title: "Customer Success Manager",
    department: "Support",
    location: "Remote",
    type: "Full-time",
    salary: "$50k - $65k",
    description: "Help customers succeed with our platform and ensure exceptional experiences."
  },
  {
    title: "Motion Graphics Designer",
    department: "Design",
    location: "Remote",
    type: "Part-time",
    salary: "$35 - $50/hr",
    description: "Create animated logos, stream overlays, and video content for clients."
  }
]

const benefits = [
  {
    icon: Clock,
    title: "Flexible Hours",
    description: "Work when you're most productive. We trust you to manage your time."
  },
  {
    icon: MapPin,
    title: "Fully Remote",
    description: "Work from anywhere in the world. No commute, no office politics."
  },
  {
    icon: DollarSign,
    title: "Competitive Pay",
    description: "Above-market compensation plus bonuses and profit sharing."
  },
  {
    icon: Heart,
    title: "Health & Wellness",
    description: "Comprehensive health coverage and wellness stipends."
  },
  {
    icon: Sparkles,
    title: "Creative Freedom",
    description: "Express your creativity and contribute to exciting projects."
  },
  {
    icon: Coffee,
    title: "Learning Budget",
    description: "$1,000/year for courses, conferences, and skill development."
  }
]

const values = [
  {
    icon: Palette,
    title: "Craft Excellence",
    description: "We obsess over every pixel and detail to deliver exceptional work."
  },
  {
    icon: Users,
    title: "Customer First",
    description: "Our customers' success is our success. We go above and beyond."
  },
  {
    icon: Zap,
    title: "Move Fast",
    description: "We ship quickly, iterate often, and aren't afraid to try new things."
  }
]

export default function CareersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b bg-gradient-to-b from-muted/50 py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="secondary" className="mb-4">We&apos;re Hiring</Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Join the VisoryX Team
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Help us build the future of design services. We&apos;re looking for 
                talented individuals who are passionate about creativity and customer success.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button size="lg" asChild>
                  <a href="#positions">View Open Positions</a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/about">Learn About Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Our Values</h2>
              <p className="mt-2 text-muted-foreground">What drives us every day</p>
            </div>
            <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
              {values.map((value, index) => {
                const Icon = value.icon
                return (
                  <div key={index} className="text-center">
                    <div className="mx-auto mb-4 rounded-full bg-primary/10 p-4 w-fit">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Benefits & Perks</h2>
              <p className="mt-2 text-muted-foreground">We take care of our team</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="rounded-lg bg-primary/10 p-2">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{benefit.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section id="positions" className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Open Positions</h2>
              <p className="mt-2 text-muted-foreground">Find your perfect role</p>
            </div>
            <div className="max-w-4xl mx-auto space-y-4">
              {openPositions.map((position, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge variant="outline">{position.department}</Badge>
                          <Badge variant="outline">{position.type}</Badge>
                          <Badge variant="outline">{position.location}</Badge>
                        </div>
                        <h3 className="text-xl font-semibold">{position.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {position.description}
                        </p>
                        <p className="text-sm font-medium text-primary mt-2">
                          {position.salary}
                        </p>
                      </div>
                      <Button className="shrink-0 gap-2" asChild>
                        <Link href={`/careers/apply?position=${encodeURIComponent(position.title)}`}>
                          Apply Now <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4">
            <Card className="max-w-3xl mx-auto">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-2">Don&apos;t see the right role?</h2>
                <p className="text-muted-foreground mb-6">
                  We&apos;re always looking for talented people. Send us your portfolio 
                  and we&apos;ll reach out when we have a matching opportunity.
                </p>
                <Button variant="outline" size="lg">
                  Submit General Application
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
