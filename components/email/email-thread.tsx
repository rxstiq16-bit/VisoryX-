"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { 
  Reply, 
  Forward, 
  MoreHorizontal, 
  ChevronDown, 
  ChevronUp,
  Paperclip,
  Star,
  Trash2,
  Archive,
  Send
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { format, formatDistanceToNow } from "date-fns"

interface EmailMessage {
  id: string
  from: {
    name: string
    email: string
    avatar?: string
  }
  to: Array<{ name: string; email: string }>
  cc?: Array<{ name: string; email: string }>
  subject: string
  body: string
  timestamp: Date
  attachments?: Array<{ name: string; size: string; type: string }>
  isStarred?: boolean
  isRead?: boolean
}

interface EmailThreadProps {
  threadId: string
  subject: string
  messages: EmailMessage[]
  onReply?: (content: string) => void
  onForward?: (messageId: string) => void
  onArchive?: () => void
  onDelete?: () => void
  className?: string
}

export function EmailThread({ 
  threadId, 
  subject, 
  messages, 
  onReply, 
  onForward, 
  onArchive, 
  onDelete,
  className 
}: EmailThreadProps) {
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(
    new Set([messages[messages.length - 1]?.id])
  )
  const [replyContent, setReplyContent] = useState("")
  const [isReplying, setIsReplying] = useState(false)

  const toggleMessage = (id: string) => {
    const newExpanded = new Set(expandedMessages)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedMessages(newExpanded)
  }

  const handleReply = () => {
    if (replyContent.trim()) {
      onReply?.(replyContent)
      setReplyContent("")
      setIsReplying(false)
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Thread Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">{subject}</h2>
          <p className="text-sm text-muted-foreground">
            {messages.length} message{messages.length !== 1 ? "s" : ""} in thread
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onArchive}>
            <Archive className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Mark as unread</DropdownMenuItem>
              <DropdownMenuItem>Add label</DropdownMenuItem>
              <DropdownMenuItem>Move to folder</DropdownMenuItem>
              <DropdownMenuItem>Print thread</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-2">
        {messages.map((message, index) => {
          const isExpanded = expandedMessages.has(message.id)
          const isLatest = index === messages.length - 1

          return (
            <Card key={message.id} className={cn(!message.isRead && "border-primary/50")}>
              <Collapsible open={isExpanded} onOpenChange={() => toggleMessage(message.id)}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={message.from.avatar} />
                        <AvatarFallback>{message.from.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{message.from.name}</span>
                          {message.isStarred && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
                        </div>
                        {!isExpanded && (
                          <p className="text-sm text-muted-foreground truncate">
                            {message.body.substring(0, 100)}...
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {message.attachments && message.attachments.length > 0 && (
                          <Paperclip className="h-4 w-4" />
                        )}
                        <span>{formatDistanceToNow(message.timestamp, { addSuffix: true })}</span>
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0 px-4 pb-4">
                    <div className="pl-13 space-y-4">
                      {/* Recipients */}
                      <div className="text-sm text-muted-foreground">
                        <p>To: {message.to.map(t => t.email).join(", ")}</p>
                        {message.cc && message.cc.length > 0 && (
                          <p>Cc: {message.cc.map(c => c.email).join(", ")}</p>
                        )}
                        <p>{format(message.timestamp, "PPpp")}</p>
                      </div>

                      {/* Body */}
                      <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">
                        {message.body}
                      </div>

                      {/* Attachments */}
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2 border-t">
                          {message.attachments.map((attachment, i) => (
                            <Badge key={i} variant="secondary" className="gap-1">
                              <Paperclip className="h-3 w-3" />
                              {attachment.name} ({attachment.size})
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" onClick={() => setIsReplying(true)}>
                          <Reply className="h-4 w-4 mr-1" />
                          Reply
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => onForward?.(message.id)}>
                          <Forward className="h-4 w-4 mr-1" />
                          Forward
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          )
        })}
      </div>

      {/* Reply Box */}
      {isReplying && (
        <Card>
          <CardContent className="p-4">
            <Textarea
              placeholder="Write your reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="min-h-[120px] mb-4"
            />
            <div className="flex justify-between">
              <Button variant="ghost" size="sm">
                <Paperclip className="h-4 w-4 mr-1" />
                Attach
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsReplying(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleReply}>
                  <Send className="h-4 w-4 mr-1" />
                  Send
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
