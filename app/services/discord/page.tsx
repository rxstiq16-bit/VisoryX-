"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  MessageSquare, 
  Bot, 
  Palette, 
  Settings, 
  Shield, 
  Zap,
  ArrowRight,
  CheckCircle,
  Star,
  Users
} from "lucide-react"
import Link from "next/link"

const discordServices = [
  {
    icon: Palette,
    name: "Server Branding",
    price: "From $29.99",
    description: "Custom icon, banner, role icons, and emoji pack",
    features: ["Server Icon", "Server Banner", "10 Role Icons", "20 Custom Emojis"],
    popular: true,
  },
  {
    icon: Settings,
    name: "Server Setup",
    price: "From $79.99",
    description: "Complete server structure, channels, roles, and permissions",
    features: ["Channel Structure", "Role Hierarchy", "Permission Setup", "Welcome System"],
  },
  {
    icon: Bot,
    name: "Bot Configuration",
    price: "From $49.99",
    description: "Setup and configure bots for moderation, tickets, and more",
    features: ["Bot Installation", "Command Config", "Auto-Mod Setup", "Reaction Roles"],
  },
  {
    icon: MessageSquare,
    name: "Embed Design",
    price: "From $12.99",
    description: "Custom embeds for rules, info, and announcements",
    features: ["Up to 5 Embeds", "Matching Theme", "Setup Assistance", "Edit Guide"],
  },
  {
    icon: Shield,
    name: "Security Audit",
    price: "From $39.99",
    description: "Review and fix security vulnerabilities",
    features: ["Permission Audit", "Bot Review", "Raid Protection", "Recommendations"],
  },
  {
    icon: Zap,
    name: "Complete Package",
    price: "From $199.99",
    description: "Everything you need for a professional community",
    features: ["Full Branding", "Server Setup", "Bot Config", "Priority Support"],
    popular: true,
  },
]

const features = [
  { icon: CheckCircle, text: "24-48 hour delivery" },
  { icon: Star, text: "4.9 average rating" },
  { icon: Users, text: "1000+ servers setup" },
  { icon: Shield, text: "30-day support included" },
]

export default function DiscordServicesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#5865F2]/10 via-background to-background py-20">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="secondary" className="mb-4 bg-[#5865F2]/10 text-[#5865F2]">
                <MessageSquare className="mr-1.5 h-3 w-3" />
                Discord Services
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Professional <span className="text-[#5865F2]">Discord</span> Server Services
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                From server setup to custom branding, we help you create a professional community that stands out.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button size="lg" className="bg-[#5865F2] hover:bg-[#4752C4]" asChild>
                  <Link href="/order">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/portfolio?category=discord">
                    View Examples
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bar */}
        <section className="border-y bg-muted/30 py-6">
          <div className="container">
            <div className="flex flex-wrap items-center justify-center gap-8">
              {features.map((feature) => (
                <div key={feature.text} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <feature.icon className="h-4 w-4 text-[#5865F2]" />
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20">
          <div className="container">
            <h2 className="mb-12 text-center text-3xl font-bold">Our Discord Services</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {discordServices.map((service) => (
                <Card key={service.name} className={service.popular ? "border-[#5865F2]" : ""}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="rounded-lg bg-[#5865F2]/10 p-2">
                        <service.icon className="h-5 w-5 text-[#5865F2]" />
                      </div>
                      {service.popular && (
                        <Badge className="bg-[#5865F2]">Popular</Badge>
                      )}
                    </div>
                    <CardTitle className="mt-4">{service.name}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 text-2xl font-bold">{service.price}</div>
                    <ul className="mb-6 space-y-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full" variant={service.popular ? "default" : "outline"} asChild>
                      <Link href={`/order?service=${encodeURIComponent(service.name)}`}>
                        Order Now
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#5865F2] py-20 text-white">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold">Ready to Level Up Your Server?</h2>
              <p className="mb-8 text-white/80">
                Join 1000+ server owners who trust VisoryX for their Discord needs
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/order">
                    Start Your Order
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                  <Link href="/contact">
                    Get a Custom Quote
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
