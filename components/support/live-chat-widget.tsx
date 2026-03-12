'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  MessageCircle, 
  X, 
  Send, 
  Minimize2, 
  Maximize2, 
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  Star,
  ThumbsUp
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
  startChatSession, 
  sendChatMessage, 
  getChatMessages, 
  endChatSession,
  getVisitorSession,
  type ChatMessage,
  type ChatSession
} from '@/lib/live-chat'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

export function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [session, setSession] = useState<ChatSession | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showRating, setShowRating] = useState(false)
  const [rating, setRating] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const visitorId = typeof window !== 'undefined' 
    ? localStorage.getItem('visitorId') || crypto.randomUUID()
    : ''

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('visitorId')) {
      localStorage.setItem('visitorId', visitorId)
    }
  }, [visitorId])

  useEffect(() => {
    if (isOpen && !session) {
      checkExistingSession()
    }
  }, [isOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Real-time message subscription
  useEffect(() => {
    if (!session) return

    const supabase = createClient()
    const channel = supabase
      .channel(`chat-${session.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `session_id=eq.${session.id}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as ChatMessage])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [session])

  const checkExistingSession = async () => {
    try {
      const existing = await getVisitorSession(visitorId)
      if (existing) {
        setSession(existing)
        const msgs = await getChatMessages(existing.id)
        setMessages(msgs)
      }
    } catch (error) {
      console.error('Failed to check session:', error)
    }
  }

  const handleStartChat = async () => {
    setIsLoading(true)
    try {
      const newSession = await startChatSession(visitorId, 'general', 'Support Request')
      setSession(newSession)
      const msgs = await getChatMessages(newSession.id)
      setMessages(msgs)
    } catch (error) {
      toast.error('Failed to start chat')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim() || !session) return

    const messageContent = input.trim()
    setInput('')

    try {
      await sendChatMessage(session.id, 'visitor', messageContent)
    } catch (error) {
      toast.error('Failed to send message')
      setInput(messageContent)
    }
  }

  const handleEndChat = async () => {
    if (!session) return

    try {
      await endChatSession(session.id, rating || undefined)
      setSession(null)
      setMessages([])
      setShowRating(false)
      setIsOpen(false)
      toast.success('Chat ended. Thank you!')
    } catch (error) {
      toast.error('Failed to end chat')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card className={cn(
      'fixed bottom-6 right-6 z-50 shadow-2xl transition-all duration-200',
      isMinimized ? 'w-72 h-14' : 'w-96 h-[500px]'
    )}>
      <CardHeader className="p-3 border-b flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/logo.png" />
            <AvatarFallback>VX</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-sm font-medium">VisoryX Support</CardTitle>
            {session && (
              <Badge variant="secondary" className="text-xs">
                {session.status === 'waiting' ? 'Connecting...' : 'Online'}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => {
              if (session) {
                setShowRating(true)
              } else {
                setIsOpen(false)
              }
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-0 flex flex-col h-[calc(100%-56px)]">
          {showRating ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <ThumbsUp className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Rate your experience</h3>
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1"
                  >
                    <Star
                      className={cn(
                        'h-8 w-8',
                        rating >= star 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-muted-foreground'
                      )}
                    />
                  </button>
                ))}
              </div>
              <Button onClick={handleEndChat} className="w-full">
                Submit & Close
              </Button>
            </div>
          ) : !session ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <MessageCircle className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Start a conversation</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Our team is here to help you with any questions.
              </p>
              <Button onClick={handleStartChat} disabled={isLoading} className="w-full">
                {isLoading ? 'Connecting...' : 'Start Chat'}
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        'flex gap-2',
                        message.sender_type === 'visitor' && 'flex-row-reverse'
                      )}
                    >
                      {message.sender_type !== 'visitor' && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {message.sender_type === 'bot' ? 'VX' : 'AG'}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={cn(
                          'rounded-lg px-3 py-2 max-w-[80%] text-sm',
                          message.sender_type === 'visitor'
                            ? 'bg-primary text-primary-foreground'
                            : message.sender_type === 'system'
                            ? 'bg-muted text-muted-foreground text-center w-full text-xs'
                            : 'bg-muted'
                        )}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="p-3 border-t">
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="h-9"
                  />
                  <Button 
                    size="icon" 
                    className="h-9 w-9 shrink-0"
                    onClick={handleSendMessage}
                    disabled={!input.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      )}
    </Card>
  )
}
