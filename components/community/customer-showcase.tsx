"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Heart, MessageCircle, Share2, ExternalLink, Eye, 
  Award, Sparkles, Filter, Grid, LayoutList
} from "lucide-react"

interface ShowcaseItem {
  id: string
  title: string
  description: string
  images: string[]
  customer: {
    name: string
    avatar?: string
    verified: boolean
  }
  category: string
  tags: string[]
  likes: number
  comments: number
  views: number
  featured: boolean
  createdAt: Date
  orderType: string
}

export function CustomerShowcase() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const showcaseItems: ShowcaseItem[] = [
    {
      id: "1",
      title: "Liberty County Sheriff's Department Fleet",
      description: "Complete fleet of emergency vehicles for our ERLC roleplay server. The attention to detail is incredible!",
      images: ["/showcase/1.jpg"],
      customer: { name: "RoleplayKing", avatar: "/avatars/1.jpg", verified: true },
      category: "ERLC",
      tags: ["Livery", "Emergency", "Fleet"],
      likes: 234,
      comments: 45,
      views: 2340,
      featured: true,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      orderType: "ERLC Livery Pack",
    },
    {
      id: "2",
      title: "Gaming Community Discord Rebrand",
      description: "Our server went from 1k to 10k members after this rebrand. The branding is just chef's kiss!",
      images: ["/showcase/2.jpg"],
      customer: { name: "GamerGuild", verified: true },
      category: "Discord",
      tags: ["Branding", "Server", "Icons"],
      likes: 189,
      comments: 32,
      views: 1567,
      featured: false,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      orderType: "Full Branding Package",
    },
    {
      id: "3",
      title: "Custom Roblox Group Logo & Thumbnails",
      description: "Perfect logos for our development group. Really helped us look more professional!",
      images: ["/showcase/3.jpg"],
      customer: { name: "DevSquad", avatar: "/avatars/3.jpg", verified: false },
      category: "Roblox",
      tags: ["Logo", "Thumbnails", "GFX"],
      likes: 156,
      comments: 28,
      views: 1234,
      featured: false,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      orderType: "Logo Design",
    },
  ]

  const categories = ["ERLC", "Discord", "Roblox", "YouTube", "Other"]

  const filteredItems = selectedCategory
    ? showcaseItems.filter(item => item.category === selectedCategory)
    : showcaseItems

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Customer Showcase</h1>
          <p className="text-muted-foreground">
            See how our customers are using their designs
          </p>
        </div>
        <Button>
          <Sparkles className="mr-2 h-4 w-4" />
          Submit Your Design
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <LayoutList className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Featured */}
      {filteredItems.some(item => item.featured) && (
        <Card className="border-primary">
          <CardHeader>
            <Badge className="w-fit">
              <Award className="mr-1 h-3 w-3" />
              Featured Showcase
            </Badge>
          </CardHeader>
          <CardContent>
            {filteredItems.filter(item => item.featured).map((item) => (
              <div key={item.id} className="flex gap-6">
                <div className="aspect-video w-1/2 rounded-lg bg-muted" />
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <p className="mt-2 text-muted-foreground">{item.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={item.customer.avatar} />
                      <AvatarFallback>{item.customer.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.customer.name}</span>
                        {item.customer.verified && (
                          <Badge variant="secondary" className="text-xs">Verified</Badge>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">{item.orderType}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4" /> {item.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" /> {item.comments}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" /> {item.views}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Grid/List View */}
      <div className={viewMode === "grid" ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
        {filteredItems.filter(item => !item.featured).map((item) => (
          <Card key={item.id} className={viewMode === "list" ? "flex overflow-hidden" : ""}>
            {viewMode === "list" && (
              <div className="aspect-square w-48 bg-muted" />
            )}
            <div className={viewMode === "list" ? "flex-1" : ""}>
              {viewMode === "grid" && (
                <div className="aspect-video bg-muted" />
              )}
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold line-clamp-1">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-1">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={item.customer.avatar} />
                      <AvatarFallback>{item.customer.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{item.customer.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" /> {item.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" /> {item.comments}
                    </span>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="flex justify-center">
        <Button variant="outline">Load More</Button>
      </div>
    </div>
  )
}
