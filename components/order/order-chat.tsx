"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  Send,
  Paperclip,
  MoreVertical,
  Check,
  CheckCheck,
  Image as ImageIcon,
  File,
  X,
  Loader2,
  Smile,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { format, isToday, isYesterday } from "date-fns"

interface Message {
  id: string
  order_id: string
  sender_id: string
  sender_name: string
  sender_avatar?: string
  sender_role: "customer" | "designer" | "admin"
  content: string
  message_type: "text" | "file" | "system"
  attachments?: {
    id: string
    name: string
    url: string
    type: string
    size: number
  }[]
  is_read: boolean
  read_at?: string
  created_at: string
}

interface OrderChatProps {
  orderId: string
  currentUserId: string
  currentUserRole: "customer" | "designer" | "admin"
  currentUserName: string
  currentUserAvatar?: string
  className?: string
}

function formatMessageDate(date: Date): string {
  if (isToday(date)) return "Today"
  if (isYesterday(date)) return "Yesterday"
  return format(date, "MMMM d, yyyy")
}

function formatMessageTime(date: Date): string {
  return format(date, "h:mm a")
}

export function OrderChat({
  orderId,
  currentUserId,
  currentUserRole,
  currentUserName,
  currentUserAvatar,
  className,
}: OrderChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [typingUser, setTypingUser] = useState<string | null>(null)
  const [attachments, setAttachments] = useState<File[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const supabase = createClient()

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true)
      const { data, error } = await supabase
        .from("order_messages")
        .select("*")
        .eq("order_id", orderId)
        .order("created_at", { ascending: true })

      if (!error && data) {
        setMessages(data)
      }
      setIsLoading(false)
    }

    fetchMessages()
  }, [orderId, supabase])

  // Subscribe to new messages
  useEffect(() => {
    const channel = supabase
      .channel(`order-chat-${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "order_messages",
          filter: `order_id=eq.${orderId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message
          setMessages((prev) => [...prev, newMsg])
          scrollToBottom()

          // Mark as read if from another user
          if (newMsg.sender_id !== currentUserId) {
            markAsRead(newMsg.id)
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "order_messages",
          filter: `order_id=eq.${orderId}`,
        },
        (payload) => {
          const updatedMsg = payload.new as Message
          setMessages((prev) =>
            prev.map((m) => (m.id === updatedMsg.id ? updatedMsg : m))
          )
        }
      )
      .on("broadcast", { event: "typing" }, (payload) => {
        if (payload.payload.user_id !== currentUserId) {
          setTypingUser(payload.payload.user_name)
          setTimeout(() => setTypingUser(null), 3000)
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [orderId, currentUserId, supabase, scrollToBottom])

  // Auto-scroll on new messages
  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const markAsRead = async (messageId: string) => {
    await supabase
      .from("order_messages")
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq("id", messageId)
  }

  const sendTypingIndicator = useCallback(() => {
    const channel = supabase.channel(`order-chat-${orderId}`)
    channel.send({
      type: "broadcast",
      event: "typing",
      payload: { user_id: currentUserId, user_name: currentUserName },
    })
  }, [orderId, currentUserId, currentUserName, supabase])

  const handleSendMessage = async () => {
    if ((!newMessage.trim() && attachments.length === 0) || isSending) return

    setIsSending(true)

    try {
      // Upload attachments first if any
      let uploadedAttachments: Message["attachments"] = []
      if (attachments.length > 0) {
        for (const file of attachments) {
          const formData = new FormData()
          formData.append("file", file)
          formData.append("orderId", orderId)
          formData.append("fileType", "reference")

          const response = await fetch("/api/files/upload", {
            method: "POST",
            body: formData,
          })

          if (response.ok) {
            const result = await response.json()
            uploadedAttachments.push({
              id: result.id,
              name: file.name,
              url: result.url,
              type: file.type,
              size: file.size,
            })
          }
        }
      }

      // Send message
      const { error } = await supabase.from("order_messages").insert({
        order_id: orderId,
        sender_id: currentUserId,
        sender_name: currentUserName,
        sender_avatar: currentUserAvatar,
        sender_role: currentUserRole,
        content: newMessage.trim(),
        message_type: uploadedAttachments.length > 0 ? "file" : "text",
        attachments: uploadedAttachments.length > 0 ? uploadedAttachments : null,
        is_read: false,
      })

      if (!error) {
        setNewMessage("")
        setAttachments([])
        textareaRef.current?.focus()
      }
    } catch (error) {
      console.error("Failed to send message:", error)
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments((prev) => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  // Group messages by date
  const groupedMessages = messages.reduce((acc, message) => {
    const date = formatMessageDate(new Date(message.created_at))
    if (!acc[date]) acc[date] = []
    acc[date].push(message)
    return acc
  }, {} as Record<string, Message[]>)

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center h-96", className)}>
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col h-[600px] border rounded-lg", className)}>
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h3 className="font-semibold">Order Chat</h3>
          <p className="text-xs text-muted-foreground">
            {messages.length} messages
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Search messages</DropdownMenuItem>
            <DropdownMenuItem>Export chat</DropdownMenuItem>
            <DropdownMenuItem>Mute notifications</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date}>
            {/* Date Separator */}
            <div className="flex items-center gap-4 my-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">{date}</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Messages */}
            {dateMessages.map((message, index) => {
              const isOwn = message.sender_id === currentUserId
              const showAvatar =
                index === 0 ||
                dateMessages[index - 1]?.sender_id !== message.sender_id

              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    isOwn && "flex-row-reverse"
                  )}
                >
                  {showAvatar ? (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarImage src={message.sender_avatar} />
                      <AvatarFallback>
                        {message.sender_name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-8 shrink-0" />
                  )}

                  <div
                    className={cn(
                      "max-w-[70%] space-y-1",
                      isOwn && "items-end"
                    )}
                  >
                    {showAvatar && (
                      <div
                        className={cn(
                          "flex items-center gap-2",
                          isOwn && "flex-row-reverse"
                        )}
                      >
                        <span className="text-sm font-medium">
                          {message.sender_name}
                        </span>
                        <Badge
                          variant="secondary"
                          className="text-xs capitalize"
                        >
                          {message.sender_role}
                        </Badge>
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={cn(
                        "rounded-lg px-3 py-2",
                        isOwn
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      {message.content && (
                        <p className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </p>
                      )}

                      {/* Attachments */}
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {message.attachments.map((attachment) => (
                            <a
                              key={attachment.id}
                              href={`/api/files/${attachment.id}?download=true`}
                              className={cn(
                                "flex items-center gap-2 p-2 rounded border",
                                isOwn
                                  ? "bg-primary-foreground/10 border-primary-foreground/20"
                                  : "bg-background border-border"
                              )}
                            >
                              {attachment.type.startsWith("image/") ? (
                                <ImageIcon className="h-4 w-4" />
                              ) : (
                                <File className="h-4 w-4" />
                              )}
                              <span className="text-xs truncate flex-1">
                                {attachment.name}
                              </span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Message Meta */}
                    <div
                      className={cn(
                        "flex items-center gap-1 text-xs text-muted-foreground",
                        isOwn && "flex-row-reverse"
                      )}
                    >
                      <span>
                        {formatMessageTime(new Date(message.created_at))}
                      </span>
                      {isOwn && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              {message.is_read ? (
                                <CheckCheck className="h-3 w-3 text-blue-500" />
                              ) : (
                                <Check className="h-3 w-3" />
                              )}
                            </TooltipTrigger>
                            <TooltipContent>
                              {message.is_read ? "Read" : "Sent"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ))}

        {/* Typing Indicator */}
        {typingUser && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.1s]" />
              <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
            </div>
            <span>{typingUser} is typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="px-4 py-2 border-t flex gap-2 overflow-x-auto">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="relative shrink-0 w-16 h-16 rounded border bg-muted flex items-center justify-center"
            >
              {file.type.startsWith("image/") ? (
                <Image
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  fill
                  className="object-cover rounded"
                />
              ) : (
                <File className="h-6 w-6 text-muted-foreground" />
              )}
              <button
                onClick={() => removeAttachment(index)}
                className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t">
        <div className="flex items-end gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="sr-only"
            onChange={handleFileSelect}
          />
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-5 w-5" />
          </Button>

          <Textarea
            ref={textareaRef}
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value)
              sendTypingIndicator()
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="min-h-[40px] max-h-[120px] resize-none"
            rows={1}
          />

          <Button
            onClick={handleSendMessage}
            disabled={(!newMessage.trim() && attachments.length === 0) || isSending}
            className="shrink-0"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
