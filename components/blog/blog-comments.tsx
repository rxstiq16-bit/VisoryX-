"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ThumbsUp, ThumbsDown, Reply, MoreHorizontal, Flag, Trash2, Edit2, MessageSquare } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useAuth } from "@/components/auth-provider"
import useSWR from "swr"

interface Comment {
  id: string
  author: {
    id: string
    name: string
    avatar?: string
    isAuthor?: boolean
  }
  content: string
  createdAt: Date
  likes: number
  dislikes: number
  userVote?: "like" | "dislike" | null
  replies?: Comment[]
  isEdited?: boolean
}

interface BlogCommentsProps {
  postId: string
  postAuthorId?: string
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function BlogComments({ postId, postAuthorId }: BlogCommentsProps) {
  const { user } = useAuth()
  const { data, mutate } = useSWR(`/api/blog/${postId}/comments`, fetcher)
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const comments: Comment[] = data?.comments || []

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !user) return
    setIsSubmitting(true)
    
    try {
      await fetch(`/api/blog/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      })
      setNewComment("")
      mutate()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim() || !user) return
    setIsSubmitting(true)
    
    try {
      await fetch(`/api/blog/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: replyContent, parentId }),
      })
      setReplyContent("")
      setReplyingTo(null)
      mutate()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVote = async (commentId: string, vote: "like" | "dislike") => {
    if (!user) return
    await fetch(`/api/blog/${postId}/comments/${commentId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vote }),
    })
    mutate()
  }

  const handleDelete = async (commentId: string) => {
    await fetch(`/api/blog/${postId}/comments/${commentId}`, { method: "DELETE" })
    mutate()
  }

  const handleEdit = async (commentId: string) => {
    if (!editContent.trim()) return
    await fetch(`/api/blog/${postId}/comments/${commentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: editContent }),
    })
    setEditingId(null)
    setEditContent("")
    mutate()
  }

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`${isReply ? "ml-12 mt-4" : ""}`}>
      <Card className="bg-card/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.author.avatar} />
                <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{comment.author.name}</span>
                  {comment.author.isAuthor && (
                    <Badge variant="secondary" className="text-xs">Author</Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  {comment.isEdited && " (edited)"}
                </span>
              </div>
            </div>
            
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {user.id === comment.author.id && (
                    <>
                      <DropdownMenuItem onClick={() => { setEditingId(comment.id); setEditContent(comment.content) }}>
                        <Edit2 className="h-4 w-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(comment.id)} className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem>
                    <Flag className="h-4 w-4 mr-2" /> Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {editingId === comment.id ? (
            <div className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[80px]"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleEdit(comment.id)}>Save</Button>
                <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{comment.content}</p>
          )}
          
          <div className="flex items-center gap-4 mt-4">
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 px-2 ${comment.userVote === "like" ? "text-primary" : ""}`}
              onClick={() => handleVote(comment.id, "like")}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              {comment.likes}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 px-2 ${comment.userVote === "dislike" ? "text-destructive" : ""}`}
              onClick={() => handleVote(comment.id, "dislike")}
            >
              <ThumbsDown className="h-4 w-4 mr-1" />
              {comment.dislikes}
            </Button>
            {!isReply && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              >
                <Reply className="h-4 w-4 mr-1" />
                Reply
              </Button>
            )}
          </div>
          
          {replyingTo === comment.id && (
            <div className="mt-4 space-y-2">
              <Textarea
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-[80px]"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleSubmitReply(comment.id)} disabled={isSubmitting}>
                  {isSubmitting ? "Posting..." : "Post Reply"}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setReplyingTo(null)}>Cancel</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {comment.replies?.map((reply) => renderComment(reply, true))}
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>
      </div>
      
      {user ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Avatar>
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name?.[0] || user.email[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button onClick={handleSubmitComment} disabled={isSubmitting || !newComment.trim()}>
                  {isSubmitting ? "Posting..." : "Post Comment"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground mb-4">Sign in to join the discussion</p>
            <Button asChild>
              <a href="/auth/login">Sign In</a>
            </Button>
          </CardContent>
        </Card>
      )}
      
      <div className="space-y-4">
        {comments.map((comment) => renderComment(comment))}
        
        {comments.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No comments yet. Be the first to share your thoughts!
          </p>
        )}
      </div>
    </div>
  )
}
