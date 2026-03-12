"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Star, Search, Trophy, Clock, CheckCircle, 
  Palette, Car, MessageSquare, Briefcase, Filter
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const designers = [
  {
    id: 1,
    name: "Alex Rivera",
    avatar: "/avatars/alex.jpg",
    title: "Senior Brand Designer",
    specialties: ["Branding", "Logo Design", "Brand Identity"],
    rating: 4.9,
    reviews: 234,
    ordersCompleted: 456,
    avgDelivery: "2.1 days",
    bio: "10+ years creating memorable brand identities for startups and established businesses.",
    featured: true,
    available: true
  },
  {
    id: 2,
    name: "Jordan Chen",
    avatar: "/avatars/jordan.jpg",
    title: "ERLC Livery Specialist",
    specialties: ["ERLC Liveries", "Vehicle Wraps", "Gaming Graphics"],
    rating: 5.0,
    reviews: 189,
    ordersCompleted: 312,
    avgDelivery: "1.8 days",
    bio: "Passionate about creating authentic emergency vehicle liveries for roleplay communities.",
    featured: true,
    available: true
  },
  {
    id: 3,
    name: "Sam Taylor",
    avatar: "/avatars/sam.jpg",
    title: "Discord Design Expert",
    specialties: ["Discord", "Server Setup", "Bot Configuration"],
    rating: 4.8,
    reviews: 156,
    ordersCompleted: 278,
    avgDelivery: "1.5 days",
    bio: "Building thriving Discord communities with beautiful designs and seamless functionality.",
    featured: false,
    available: true
  },
  {
    id: 4,
    name: "Morgan Lee",
    avatar: "/avatars/morgan.jpg",
    title: "Motion Graphics Artist",
    specialties: ["Animation", "Stream Overlays", "Video"],
    rating: 4.9,
    reviews: 98,
    ordersCompleted: 167,
    avgDelivery: "3.2 days",
    bio: "Bringing designs to life with stunning animations and motion graphics.",
    featured: false,
    available: false
  },
  {
    id: 5,
    name: "Casey Williams",
    avatar: "/avatars/casey.jpg",
    title: "Business Design Specialist",
    specialties: ["Pitch Decks", "Business Cards", "Presentations"],
    rating: 4.7,
    reviews: 87,
    ordersCompleted: 145,
    avgDelivery: "2.5 days",
    bio: "Helping businesses make powerful first impressions with professional design.",
    featured: false,
    available: true
  },
  {
    id: 6,
    name: "Riley Johnson",
    avatar: "/avatars/riley.jpg",
    title: "Social Media Designer",
    specialties: ["Social Media", "Marketing", "Ad Creatives"],
    rating: 4.8,
    reviews: 112,
    ordersCompleted: 203,
    avgDelivery: "1.9 days",
    bio: "Creating scroll-stopping content that drives engagement and conversions.",
    featured: false,
    available: true
  }
]

const specialtyFilters = [
  { id: "all", label: "All", icon: Filter },
  { id: "branding", label: "Branding", icon: Palette },
  { id: "erlc", label: "ERLC", icon: Car },
  { id: "discord", label: "Discord", icon: MessageSquare },
  { id: "business", label: "Business", icon: Briefcase }
]

export default function DesignersPage() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")

  const filteredDesigners = designers.filter(designer => {
    const matchesSearch = designer.name.toLowerCase().includes(search.toLowerCase()) ||
      designer.specialties.some(s => s.toLowerCase().includes(search.toLowerCase()))
    
    if (filter === "all") return matchesSearch
    
    const filterMap: Record<string, string[]> = {
      branding: ["Branding", "Logo Design", "Brand Identity"],
      erlc: ["ERLC Liveries", "Vehicle Wraps"],
      discord: ["Discord", "Server Setup"],
      business: ["Pitch Decks", "Business Cards", "Presentations"]
    }
    
    const matchesFilter = designer.specialties.some(s => 
      filterMap[filter]?.some(f => s.includes(f))
    )
    
    return matchesSearch && matchesFilter
  })

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        <section className="border-b bg-gradient-to-b from-muted/50 py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="secondary" className="mb-4">Our Team</Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Meet Our Designers
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Talented professionals ready to bring your creative vision to life.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Filters */}
            <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:w-auto sm:min-w-[300px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search designers or skills..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2 flex-wrap justify-center">
                {specialtyFilters.map((f) => {
                  const Icon = f.icon
                  return (
                    <Button
                      key={f.id}
                      variant={filter === f.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter(f.id)}
                      className="gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {f.label}
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Designer Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredDesigners.map((designer) => (
                <Card key={designer.id} className={cn(
                  "relative overflow-hidden transition-shadow hover:shadow-lg",
                  designer.featured && "ring-2 ring-primary"
                )}>
                  {designer.featured && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
                      Featured
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={designer.avatar} alt={designer.name} />
                          <AvatarFallback>{designer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        {designer.available && (
                          <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 border-2 border-background" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{designer.name}</h3>
                        <p className="text-sm text-muted-foreground">{designer.title}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-medium">{designer.rating}</span>
                          <span className="text-sm text-muted-foreground">
                            ({designer.reviews} reviews)
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {designer.bio}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {designer.specialties.map((specialty, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                      <div className="rounded-lg bg-muted/50 p-2">
                        <div className="flex items-center justify-center gap-1 text-sm font-medium">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          {designer.ordersCompleted}
                        </div>
                        <p className="text-xs text-muted-foreground">Orders</p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-2">
                        <div className="flex items-center justify-center gap-1 text-sm font-medium">
                          <Clock className="h-4 w-4 text-blue-500" />
                          {designer.avgDelivery}
                        </div>
                        <p className="text-xs text-muted-foreground">Avg. Delivery</p>
                      </div>
                    </div>

                    <Button className="w-full" asChild>
                      <Link href={`/designers/${designer.id}`}>
                        View Portfolio
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredDesigners.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No designers found matching your criteria.</p>
                <Button variant="link" onClick={() => { setSearch(""); setFilter("all"); }}>
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Join CTA */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4">
            <Card className="max-w-3xl mx-auto">
              <CardContent className="p-8 text-center">
                <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Join Our Team</h2>
                <p className="text-muted-foreground mb-6">
                  Are you a talented designer? We&apos;re always looking for passionate 
                  creatives to join our growing team.
                </p>
                <Button size="lg" asChild>
                  <Link href="/careers">View Open Positions</Link>
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
