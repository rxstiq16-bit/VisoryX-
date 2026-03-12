"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MessageSquare, ThumbsUp, Flag, MoreHorizontal, Reply, Trash2, Edit2, Check, X } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useAuth } from "@/components/auth-provider"
import useSWR from "swr"

interface Comment {
  id: string
  content: string
  author: {
    id: string
    name: string
    avatar?: string
    isAuthor?: boolean
  }
  createdAt: Date
  likes: number
  liked: boolean
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
  const { data, mutate } = useSWR<{ comments: Comment[] }>(`/api/blog/${postId}/comments`, fetcher)
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const comments = data?.comments || []

  const handleSubmit = async () => {
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

  const handleReply = async (parentId: string) => {
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

  const handleLike = async (commentId: string) => {
    await fetch(`/api/blog/${postId}/comments/${commentId}/like`, { method: "POST" })
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
    mutate()
  }

  const handleReport = async (commentId: string) => {
    await fetch(`/api/blog/${postId}/comments/${commentId}/report`, { method: "POST" })
  }

  const CommentItem = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => {
    const isOwner = user?.id === comment.author.id
    const isPostAuthor = comment.author.id === postAuthorId
    const isEditing = editingId === comment.id

    return (
      <div className={`${depth > 0 ? "ml-8 border-l-2 border-border pl-4" : ""}`}>
        <div className="flex gap-3 py-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={comment.author.avatar} />
            <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">{comment.author.name}</span>
              {isPostAuthor && (
                <Badge variant="secondary" className="text-xs">Author</Badge>
              )}
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </span>
              {comment.isEdited && (
                <span className="text-xs text-muted-foreground">(edited)</span>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="min-h-[80px]"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleEdit(comment.id)}>
                    <Check className="mr-1 h-3 w-3" /> Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                    <X className="mr-1 h-3 w-3" /> Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-foreground/90">{comment.content}</p>
            )}

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-2 ${comment.liked ? "text-primary" : ""}`}
                onClick={() => handleLike(comment.id)}
              >
                <ThumbsUp className="mr-1 h-3 w-3" />
                {comment.likes > 0 && comment.likes}
              </Button>
              
              {user && depth === 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2"
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                >
                  <Reply className="mr-1 h-3 w-3" /> Reply
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {isOwner && (
                    <>
                      <DropdownMenuItem onClick={() => {
                        setEditingId(comment.id)
                        setEditContent(comment.content)
                      }}>
                        <Edit2 className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => handleDelete(comment.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </>
                  )}
                  {!isOwner && (
                    <DropdownMenuItem onClick={() => handleReport(comment.id)}>
                      <Flag className="mr-2 h-4 w-4" /> Report
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {replyingTo === comment.id && (
              <div className="mt-3 space-y-2">
                <Textarea
                  placeholder="Write a reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="min-h-[80px]"
                />
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleReply(comment.id)}
                    disabled={isSubmitting}
                  >
                    Reply
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setReplyingTo(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {comment.replies?.map((reply) => (
          <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
        ))}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {user ? (
          <div className="space-y-3">
            <div className="flex gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px] flex-1"
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSubmit} disabled={!newComment.trim() || isSubmitting}>
                Post Comment
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-6 text-center">
            <p className="text-muted-foreground">Sign in to leave a comment</p>
            <Button variant="outline" className="mt-3" asChild>
              <a href="/auth/login">Sign In</a>
            </Button>
          </div>
        )}

        <div className="divide-y">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>

        {comments.length === 0 && (
          <div className="py-8 text-center text-muted-foreground">
            No comments yet. Be the first to comment!
          </div>
        )}
      </CardContent>
    </Card>
  )
}
