"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Trophy, 
  Star, 
  Clock,
  Users,
  Flame,
  Filter,
  Search,
  Plus,
  ExternalLink
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Showcase {
  id: string
  title: string
  description: string
  imageUrl: string
  author: {
    name: string
    avatar: string
    username: string
  }
  likes: number
  comments: number
  createdAt: Date
  tags: string[]
  featured?: boolean
}

interface Challenge {
  id: string
  title: string
  description: string
  prize: string
  deadline: Date
  participants: number
  submissions: number
  status: "active" | "voting" | "completed"
  tags: string[]
}

interface ForumPost {
  id: string
  title: string
  content: string
  author: {
    name: string
    avatar: string
  }
  category: string
  replies: number
  views: number
  lastActivity: Date
  pinned?: boolean
}

export function CommunityHub() {
  const [activeTab, setActiveTab] = useState("showcases")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Community</h1>
          <p className="text-muted-foreground">
            Showcase your work, participate in challenges, and connect with other designers
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Share Your Work
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="showcases">
            <Star className="mr-2 h-4 w-4" />
            Showcases
          </TabsTrigger>
          <TabsTrigger value="challenges">
            <Trophy className="mr-2 h-4 w-4" />
            Challenges
          </TabsTrigger>
          <TabsTrigger value="forum">
            <MessageCircle className="mr-2 h-4 w-4" />
            Forum
          </TabsTrigger>
        </TabsList>

        <TabsContent value="showcases" className="mt-6">
          <ShowcaseGallery />
        </TabsContent>

        <TabsContent value="challenges" className="mt-6">
          <ChallengeList />
        </TabsContent>

        <TabsContent value="forum" className="mt-6">
          <ForumSection />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ShowcaseGallery() {
  const [showcases] = useState<Showcase[]>([
    {
      id: "1",
      title: "ERLC Police Department Livery",
      description: "Complete livery pack for the Los Santos Police Department",
      imageUrl: "/api/placeholder/400/300",
      author: { name: "Alex Designer", avatar: "/api/placeholder/40/40", username: "alexd" },
      likes: 124,
      comments: 18,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      tags: ["ERLC", "Livery", "Police"],
      featured: true,
    },
    {
      id: "2",
      title: "Discord Server Branding",
      description: "Full branding package for gaming community",
      imageUrl: "/api/placeholder/400/300",
      author: { name: "Creative Pro", avatar: "/api/placeholder/40/40", username: "creativepro" },
      likes: 89,
      comments: 12,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      tags: ["Discord", "Branding"],
    },
  ])

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search showcases..." className="pl-10" />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {showcases.map((showcase) => (
          <Card key={showcase.id} className="overflow-hidden">
            {showcase.featured && (
              <Badge className="absolute right-2 top-2 z-10 bg-yellow-500">
                <Flame className="mr-1 h-3 w-3" />
                Featured
              </Badge>
            )}
            <div className="relative aspect-video bg-muted">
              <img
                src={showcase.imageUrl}
                alt={showcase.title}
                className="h-full w-full object-cover"
              />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="line-clamp-1">{showcase.title}</CardTitle>
              <CardDescription className="line-clamp-2">{showcase.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex flex-wrap gap-1">
                {showcase.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={showcase.author.avatar} />
                  <AvatarFallback>{showcase.author.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">{showcase.author.name}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <button className="flex items-center gap-1 hover:text-primary">
                  <Heart className="h-4 w-4" />
                  {showcase.likes}
                </button>
                <button className="flex items-center gap-1 hover:text-primary">
                  <MessageCircle className="h-4 w-4" />
                  {showcase.comments}
                </button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ChallengeList() {
  const [challenges] = useState<Challenge[]>([
    {
      id: "1",
      title: "Summer Logo Design Challenge",
      description: "Create a summer-themed logo for a fictional beach resort",
      prize: "$100 + Featured Spot",
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      participants: 45,
      submissions: 32,
      status: "active",
      tags: ["Logo", "Summer", "Branding"],
    },
    {
      id: "2",
      title: "Best ERLC Livery",
      description: "Design the most creative emergency vehicle livery",
      prize: "Premium Membership",
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      participants: 78,
      submissions: 56,
      status: "voting",
      tags: ["ERLC", "Livery"],
    },
  ])

  const getDaysLeft = (deadline: Date) => {
    return Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="space-y-4">
      {challenges.map((challenge) => (
        <Card key={challenge.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle>{challenge.title}</CardTitle>
                  <Badge
                    variant={challenge.status === "active" ? "default" : "secondary"}
                  >
                    {challenge.status}
                  </Badge>
                </div>
                <CardDescription>{challenge.description}</CardDescription>
              </div>
              <div className="text-right">
                <p className="font-semibold text-primary">{challenge.prize}</p>
                <p className="text-sm text-muted-foreground">Prize</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1 mb-4">
              {challenge.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {challenge.participants} participants
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                {challenge.submissions} submissions
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {getDaysLeft(challenge.deadline)} days left
              </span>
            </div>
          </CardContent>
          <CardFooter>
            <Button>
              {challenge.status === "active" ? "Join Challenge" : "View Submissions"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

function ForumSection() {
  const [posts] = useState<ForumPost[]>([
    {
      id: "1",
      title: "Tips for creating realistic ERLC liveries",
      content: "I've been working on liveries for a while and wanted to share some tips...",
      author: { name: "ProDesigner", avatar: "/api/placeholder/40/40" },
      category: "Tutorials",
      replies: 24,
      views: 342,
      lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
      pinned: true,
    },
    {
      id: "2",
      title: "Looking for feedback on my portfolio",
      content: "Just updated my portfolio and would love some constructive criticism...",
      author: { name: "NewDesigner", avatar: "/api/placeholder/40/40" },
      category: "Feedback",
      replies: 8,
      views: 56,
      lastActivity: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
  ])

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input placeholder="Search discussions..." className="flex-1" />
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </div>

      <div className="space-y-2">
        {posts.map((post) => (
          <Card key={post.id} className={cn(post.pinned && "border-primary/50")}>
            <CardContent className="flex items-center gap-4 py-4">
              <Avatar>
                <AvatarImage src={post.author.avatar} />
                <AvatarFallback>{post.author.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {post.pinned && <Badge variant="outline">Pinned</Badge>}
                  <Badge variant="secondary">{post.category}</Badge>
                  <h3 className="font-medium truncate">{post.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground truncate">{post.content}</p>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <p>{post.replies} replies</p>
                <p>{post.views} views</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
