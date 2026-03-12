"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  MessageSquare, ThumbsUp, Eye, Clock, Pin, Star, 
  Search, Plus, Filter, TrendingUp, Award
} from "lucide-react"

interface ForumPost {
  id: string
  title: string
  author: {
    name: string
    avatar?: string
    badge?: string
  }
  category: string
  content: string
  createdAt: Date
  replies: number
  likes: number
  views: number
  isPinned?: boolean
  isResolved?: boolean
}

const categories = [
  { id: "general", name: "General Discussion", color: "bg-blue-500" },
  { id: "showcase", name: "Design Showcase", color: "bg-purple-500" },
  { id: "help", name: "Help & Support", color: "bg-green-500" },
  { id: "feedback", name: "Feedback", color: "bg-yellow-500" },
  { id: "tutorials", name: "Tutorials", color: "bg-pink-500" },
]

export function CommunityForum() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const posts: ForumPost[] = [
    {
      id: "1",
      title: "Tips for creating ERLC liveries that stand out",
      author: { name: "DesignPro", avatar: "/avatars/user1.jpg", badge: "Expert" },
      category: "tutorials",
      content: "Here are my top 10 tips for creating eye-catching liveries...",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      replies: 24,
      likes: 156,
      views: 1230,
      isPinned: true,
    },
    {
      id: "2",
      title: "My latest Discord server branding - feedback welcome!",
      author: { name: "ArtistX", avatar: "/avatars/user2.jpg" },
      category: "showcase",
      content: "Just finished this branding package for a gaming community...",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      replies: 18,
      likes: 89,
      views: 567,
    },
    {
      id: "3",
      title: "How do I request revisions on my order?",
      author: { name: "NewUser123" },
      category: "help",
      content: "I just received my design but want to make some changes...",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      replies: 5,
      likes: 3,
      views: 45,
      isResolved: true,
    },
  ]

  const topContributors = [
    { name: "DesignPro", posts: 156, likes: 2340, avatar: "/avatars/user1.jpg" },
    { name: "ArtistX", posts: 98, likes: 1560, avatar: "/avatars/user2.jpg" },
    { name: "CreativeGuru", posts: 87, likes: 1230, avatar: "/avatars/user3.jpg" },
  ]

  const getTimeSince = (date: Date) => {
    const hours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60))
    if (hours < 1) return "Just now"
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  const filteredPosts = posts.filter(post => {
    if (selectedCategory && post.category !== selectedCategory) return false
    if (searchQuery && !post.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <div className="grid gap-6 lg:grid-cols-4">
      {/* Main Content */}
      <div className="lg:col-span-3 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Community Forum</h1>
            <p className="text-muted-foreground">Connect, share, and learn with fellow designers</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* Categories */}
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
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span className={`mr-2 h-2 w-2 rounded-full ${cat.color}`} />
              {cat.name}
            </Button>
          ))}
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <Card key={post.id} className={post.isPinned ? "border-primary" : ""}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          {post.isPinned && <Pin className="h-4 w-4 text-primary" />}
                          <h3 className="font-semibold hover:text-primary cursor-pointer">
                            {post.title}
                          </h3>
                          {post.isResolved && (
                            <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                              Resolved
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{post.author.name}</span>
                          {post.author.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {post.author.badge}
                            </Badge>
                          )}
                          <span>-</span>
                          <span>{getTimeSince(post.createdAt)}</span>
                          <Badge variant="outline" className="text-xs">
                            {categories.find(c => c.id === post.category)?.name}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        {post.replies}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {post.views}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Top Contributors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Award className="h-4 w-4" />
              Top Contributors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topContributors.map((user, i) => (
              <div key={user.name} className="flex items-center gap-3">
                <span className="text-lg font-bold text-muted-foreground">#{i + 1}</span>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {user.posts} posts - {user.likes} likes
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Trending Topics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4" />
              Trending Topics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {["#ERLCDesign", "#DiscordBranding", "#RobloxGFX", "#LogoDesign", "#Tutorials"].map((tag) => (
                <Badge key={tag} variant="secondary" className="mr-2 cursor-pointer hover:bg-primary/20">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
