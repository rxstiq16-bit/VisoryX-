"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Gamepad2, 
  Image, 
  Shirt, 
  Badge as BadgeIcon, 
  Ticket, 
  Users, 
  Star, 
  Zap,
  ArrowRight,
  CheckCircle,
  Clock,
  Sparkles
} from "lucide-react"
import Link from "next/link"

const robloxServices = [
  {
    category: "Game Assets",
    icon: Gamepad2,
    items: [
      { name: "Game Icon", price: 19.99, description: "512x512 icon for your game", popular: true },
      { name: "Game Thumbnail", price: 24.99, description: "1920x1080 promotional thumbnail" },
      { name: "Game Pass Icons (5)", price: 39.99, description: "Bundle of 5 gamepass icons" },
      { name: "Badge Icons (10)", price: 29.99, description: "10 custom badge icons" },
      { name: "Loading Screen", price: 34.99, description: "Custom loading screen design" },
    ]
  },
  {
    category: "GFX & Renders",
    icon: Image,
    items: [
      { name: "Character GFX", price: 29.99, description: "Custom character render", popular: true },
      { name: "Group GFX", price: 49.99, description: "Multi-character group render" },
      { name: "Scene GFX", price: 59.99, description: "Full scene with background" },
      { name: "Animated GFX", price: 79.99, description: "Animated character render" },
      { name: "Ad Banner GFX", price: 24.99, description: "728x90 or 160x600 ad banner" },
    ]
  },
  {
    category: "Clothing",
    icon: Shirt,
    items: [
      { name: "Shirt Template", price: 14.99, description: "Custom shirt design" },
      { name: "Pants Template", price: 14.99, description: "Custom pants design" },
      { name: "Outfit Bundle", price: 24.99, description: "Matching shirt + pants", popular: true },
      { name: "Uniform Set (5)", price: 49.99, description: "5 uniform variations" },
      { name: "Merch Collection", price: 89.99, description: "10+ clothing items" },
    ]
  },
  {
    category: "Group Assets",
    icon: Users,
    items: [
      { name: "Group Logo", price: 24.99, description: "Professional group logo", popular: true },
      { name: "Group Banner", price: 19.99, description: "Group page banner" },
      { name: "Rank Icons (10)", price: 34.99, description: "10 custom rank icons" },
      { name: "Group Package", price: 69.99, description: "Logo + banner + ranks" },
      { name: "Rebrand Package", price: 129.99, description: "Complete group rebrand" },
    ]
  },
]

const packages = [
  {
    name: "Game Starter",
    price: 79.99,
    description: "Everything to launch your game",
    items: ["Game Icon", "2 Thumbnails", "5 Gamepass Icons", "Loading Screen"],
    savings: "Save 25%",
    popular: true,
  },
  {
    name: "Group Starter",
    price: 59.99,
    description: "Brand your group professionally",
    items: ["Group Logo", "Banner", "10 Rank Icons", "5 Uniform Shirts"],
    savings: "Save 20%",
  },
  {
    name: "Developer Pro",
    price: 199.99,
    description: "Complete game launch package",
    items: ["Game Icon", "5 Thumbnails", "10 Gamepass Icons", "20 Badges", "Loading Screen", "Character GFX", "Ad Banners (3)"],
    savings: "Save 35%",
  },
]

export default function RobloxServicesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/20 py-20">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="secondary" className="mb-4">
                <Gamepad2 className="mr-1.5 h-3 w-3" />
                Roblox Services
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Professional <span className="text-primary">Roblox</span> Design Services
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Game icons, GFX, clothing, group assets, and more. Designed specifically for the Roblox platform with proper dimensions and optimization.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/order">
                    Start Your Order
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/portfolio?category=roblox">
                    View Roblox Portfolio
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="border-y bg-muted/30 py-6">
          <div className="container">
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>500+ Roblox Projects</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>4.9 Average Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>24-48hr Turnaround</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <span>Robux Payment Accepted</span>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-20">
          <div className="container">
            <h2 className="mb-12 text-center text-3xl font-bold">Our Roblox Services</h2>
            <Tabs defaultValue="Game Assets" className="w-full">
              <TabsList className="mb-8 flex h-auto flex-wrap justify-center gap-2 bg-transparent p-0">
                {robloxServices.map((category) => (
                  <TabsTrigger
                    key={category.category}
                    value={category.category}
                    className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <category.icon className="h-4 w-4" />
                    {category.category}
                  </TabsTrigger>
                ))}
              </TabsList>
              {robloxServices.map((category) => (
                <TabsContent key={category.category} value={category.category}>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {category.items.map((item) => (
                      <Card key={item.name} className={item.popular ? "border-primary" : ""}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">{item.name}</CardTitle>
                              <CardDescription>{item.description}</CardDescription>
                            </div>
                            {item.popular && (
                              <Badge variant="default" className="shrink-0">Popular</Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold">${item.price}</span>
                            <Button size="sm" asChild>
                              <Link href={`/order?service=${encodeURIComponent(item.name)}`}>
                                Order Now
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* Packages */}
        <section className="bg-muted/30 py-20">
          <div className="container">
            <h2 className="mb-4 text-center text-3xl font-bold">Bundle & Save</h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
              Get everything you need for your game or group at a discounted price
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              {packages.map((pkg) => (
                <Card key={pkg.name} className={pkg.popular ? "border-primary shadow-lg" : ""}>
                  {pkg.popular && (
                    <div className="bg-primary px-4 py-1 text-center text-sm font-medium text-primary-foreground">
                      Most Popular
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{pkg.name}</CardTitle>
                    <CardDescription>{pkg.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <span className="text-3xl font-bold">${pkg.price}</span>
                      <Badge variant="secondary" className="ml-2">{pkg.savings}</Badge>
                    </div>
                    <ul className="mb-6 space-y-2">
                      {pkg.items.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full" variant={pkg.popular ? "default" : "outline"} asChild>
                      <Link href={`/order?package=${encodeURIComponent(pkg.name)}`}>
                        Get This Package
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Robux Payment */}
        <section className="py-20">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="outline" className="mb-4">
                <Zap className="mr-1.5 h-3 w-3" />
                Payment Option
              </Badge>
              <h2 className="mb-4 text-3xl font-bold">Pay with Robux</h2>
              <p className="mb-8 text-muted-foreground">
                Don't have a credit card? No problem! We accept Robux as payment through our secure gamepass system. Simply purchase our gamepass equivalent to your order total.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="outline" asChild>
                  <Link href="/tools/robux-calculator">
                    Calculate Robux Price
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/help/robux-payment">
                    How It Works
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
