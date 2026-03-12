"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Check, X, Flag, MoreHorizontal, Search, MessageSquare, AlertTriangle, Clock, Ban } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import useSWR from "swr"

interface Comment {
  id: string
  content: string
  author: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  post: {
    id: string
    title: string
    slug: string
  }
  status: "pending" | "approved" | "rejected" | "flagged"
  reportCount: number
  createdAt: Date
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function CommentModeration() {
  const [activeTab, setActiveTab] = useState("pending")
  const [searchQuery, setSearchQuery] = useState("")
  const { data, mutate } = useSWR<{ comments: Comment[] }>(
    `/api/admin/comments?status=${activeTab}&search=${searchQuery}`,
    fetcher
  )

  const comments = data?.comments || []

  const handleAction = async (commentId: string, action: "approve" | "reject" | "flag" | "ban_user") => {
    await fetch(`/api/admin/comments/${commentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    })
    mutate()
  }

  const handleBulkAction = async (action: "approve" | "reject", commentIds: string[]) => {
    await fetch(`/api/admin/comments/bulk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, commentIds }),
    })
    mutate()
  }

  const getStatusBadge = (status: Comment["status"]) => {
    const variants: Record<typeof status, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      pending: { label: "Pending", variant: "outline" },
      approved: { label: "Approved", variant: "default" },
      rejected: { label: "Rejected", variant: "destructive" },
      flagged: { label: "Flagged", variant: "secondary" },
    }
    return variants[status]
  }

  const pendingCount = comments.filter(c => c.status === "pending").length
  const flaggedCount = comments.filter(c => c.status === "flagged").length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Comment Moderation
            </CardTitle>
            <CardDescription>
              Review and moderate user comments across all posts
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {pendingCount > 0 && (
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" /> {pendingCount} pending
              </Badge>
            )}
            {flaggedCount > 0 && (
              <Badge variant="destructive" className="gap-1">
                <Flag className="h-3 w-3" /> {flaggedCount} flagged
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search comments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="pending" className="gap-2">
              <Clock className="h-4 w-4" /> Pending
            </TabsTrigger>
            <TabsTrigger value="flagged" className="gap-2">
              <Flag className="h-4 w-4" /> Flagged
            </TabsTrigger>
            <TabsTrigger value="approved" className="gap-2">
              <Check className="h-4 w-4" /> Approved
            </TabsTrigger>
            <TabsTrigger value="rejected" className="gap-2">
              <X className="h-4 w-4" /> Rejected
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            <div className="space-y-3">
              {comments.map((comment) => {
                const badge = getStatusBadge(comment.status)
                
                return (
                  <div
                    key={comment.id}
                    className="flex items-start gap-4 rounded-lg border p-4"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={comment.author.avatar} />
                      <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{comment.author.name}</span>
                        <span className="text-sm text-muted-foreground">{comment.author.email}</span>
                        <Badge variant={badge.variant}>{badge.label}</Badge>
                        {comment.reportCount > 0 && (
                          <Badge variant="destructive" className="gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {comment.reportCount} reports
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm">{comment.content}</p>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>
                          On: <a href={`/blog/${comment.post.slug}`} className="text-primary hover:underline">
                            {comment.post.title}
                          </a>
                        </span>
                        <span>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {comment.status !== "approved" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-500 hover:text-green-600"
                          onClick={() => handleAction(comment.id, "approve")}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      {comment.status !== "rejected" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleAction(comment.id, "reject")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleAction(comment.id, "flag")}>
                            <Flag className="mr-2 h-4 w-4" /> Flag for Review
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleAction(comment.id, "ban_user")}
                          >
                            <Ban className="mr-2 h-4 w-4" /> Ban User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                )
              })}

              {comments.length === 0 && (
                <div className="py-8 text-center text-muted-foreground">
                  No comments to display
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
