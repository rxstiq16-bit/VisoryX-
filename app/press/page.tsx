"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Image as ImageIcon, FileText, Mail, ExternalLink } from "lucide-react"

const assets = [
  {
    title: "Logo Pack",
    description: "Full logo suite in PNG, SVG, and PDF formats",
    icon: ImageIcon,
    files: ["Logo Dark", "Logo Light", "Icon Only", "Wordmark"],
    downloadUrl: "#"
  },
  {
    title: "Brand Guidelines",
    description: "Complete brand identity guidelines document",
    icon: FileText,
    files: ["Colors", "Typography", "Usage Rules", "Examples"],
    downloadUrl: "#"
  },
  {
    title: "Product Screenshots",
    description: "High-resolution screenshots of the platform",
    icon: ImageIcon,
    files: ["Dashboard", "Order Flow", "Portfolio", "Mobile"],
    downloadUrl: "#"
  },
  {
    title: "Team Photos",
    description: "Professional photos of our team",
    icon: ImageIcon,
    files: ["Team Group", "Individual Headshots", "Office"],
    downloadUrl: "#"
  }
]

const stats = [
  { label: "Orders Completed", value: "10,000+" },
  { label: "Happy Customers", value: "5,000+" },
  { label: "Average Rating", value: "4.9/5" },
  { label: "Countries Served", value: "50+" }
]

const pressReleases = [
  {
    date: "March 2024",
    title: "VisoryX Launches AI-Powered Design Assistant",
    excerpt: "New feature uses AI to help customers create better design briefs..."
  },
  {
    date: "February 2024",
    title: "VisoryX Reaches 10,000 Orders Milestone",
    excerpt: "Design platform celebrates major milestone with community appreciation..."
  },
  {
    date: "January 2024",
    title: "VisoryX Introduces Loyalty Rewards Program",
    excerpt: "New rewards program offers points, tiers, and exclusive perks..."
  }
]

export default function PressPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        <section className="border-b bg-gradient-to-b from-muted/50 py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="secondary" className="mb-4">Press & Media</Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Press Kit</h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Everything you need to write about VisoryX. Download our brand assets,
                get key facts, and find press contacts.
              </p>
            </div>
          </div>
        </section>

        {/* Key Stats */}
        <section className="border-b py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-12">
          <div className="container mx-auto max-w-4xl px-4">
            <h2 className="text-2xl font-bold mb-6">About VisoryX</h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-muted-foreground text-lg">
                VisoryX is a premium design service platform specializing in branding, 
                Discord server setup, gaming graphics (particularly ERLC liveries), 
                and business design solutions. Founded in 2023, we&apos;ve helped thousands 
                of creators, communities, and businesses bring their creative visions to life.
              </p>
              <p className="text-muted-foreground">
                Our team of professional designers delivers high-quality custom designs 
                with fast turnaround times. We pride ourselves on transparent pricing, 
                excellent customer service, and a unique loyalty rewards program that 
                gives back to our community.
              </p>
            </div>
          </div>
        </section>

        {/* Brand Assets */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto max-w-4xl px-4">
            <h2 className="text-2xl font-bold mb-6">Brand Assets</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {assets.map((asset, index) => {
                const Icon = asset.icon
                return (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="rounded-lg bg-primary/10 p-3">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{asset.title}</CardTitle>
                          <CardDescription>{asset.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {asset.files.map((file, i) => (
                          <Badge key={i} variant="outline">{file}</Badge>
                        ))}
                      </div>
                      <Button className="w-full gap-2">
                        <Download className="h-4 w-4" />
                        Download ZIP
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Press Releases */}
        <section className="py-12">
          <div className="container mx-auto max-w-4xl px-4">
            <h2 className="text-2xl font-bold mb-6">Press Releases</h2>
            <div className="space-y-4">
              {pressReleases.map((release, index) => (
                <Card key={index}>
                  <CardContent className="flex items-center justify-between p-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{release.date}</p>
                      <h3 className="font-semibold">{release.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{release.excerpt}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="shrink-0 gap-1">
                      Read <ExternalLink className="h-3 w-3" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Press Contact */}
        <section className="py-12 bg-primary/5">
          <div className="container mx-auto max-w-4xl px-4">
            <Card>
              <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-4">
                    <Mail className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Press Inquiries</h3>
                    <p className="text-muted-foreground">
                      For interviews, quotes, or partnership opportunities
                    </p>
                  </div>
                </div>
                <Button size="lg" className="gap-2">
                  <Mail className="h-4 w-4" />
                  press@visoryx.com
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
