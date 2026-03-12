"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sparkles,
  Send,
  RefreshCw,
  Lightbulb,
  Palette,
  Layout,
  MessageSquare,
  Copy,
  Check,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  suggestions?: string[]
}

const INITIAL_SUGGESTIONS = [
  "What colors work well for a gaming team logo?",
  "How can I make my Discord server look more professional?",
  "What's trending in Roblox group logos?",
  "Suggest a mascot style for my esports team",
]

const QUICK_ACTIONS = [
  { icon: Palette, label: "Color Ideas", prompt: "Suggest some color schemes for my project" },
  { icon: Layout, label: "Layout Tips", prompt: "What layout works best for a gaming banner?" },
  { icon: Lightbulb, label: "Inspiration", prompt: "Give me creative ideas for my design" },
]

export function AIDesignAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm your AI design assistant. I can help you brainstorm ideas, suggest colors, recommend styles, and answer any design questions. What would you like to create today?",
      suggestions: INITIAL_SUGGESTIONS,
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const generateResponse = (userMessage: string): string => {
    // Simulated AI responses based on keywords
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("color") || lowerMessage.includes("palette")) {
      return `Great question about colors! Here are some suggestions:

**For Gaming/Esports:**
- Electric Blue (#00D4FF) + Deep Purple (#7B2FFF)
- Neon Green (#39FF14) + Black (#000000)
- Fire Orange (#FF6B35) + Charcoal (#2D2D2D)

**For Professional/Business:**
- Navy Blue (#1E3A5F) + Gold (#D4AF37)
- Deep Teal (#006D77) + Coral (#FF8A80)

**For Discord Servers:**
- Blurple variations work great with #5865F2
- Complement with soft grays and accent colors

Would you like me to suggest specific combinations for your project type?`
    }

    if (lowerMessage.includes("logo") || lowerMessage.includes("mascot")) {
      return `For logos and mascots, here are some trending styles:

**Popular Mascot Styles:**
1. **Aggressive/Fierce** - Sharp angles, intense expressions (great for competitive teams)
2. **Cute/Chibi** - Rounded features, big eyes (popular for community-focused groups)
3. **Minimalist** - Clean lines, geometric shapes (professional look)
4. **Detailed/Realistic** - High detail, dramatic lighting (premium feel)

**Logo Tips:**
- Keep it recognizable at small sizes
- Use 2-3 colors maximum
- Consider how it looks on dark and light backgrounds

What type of vibe are you going for?`
    }

    if (lowerMessage.includes("discord") || lowerMessage.includes("server")) {
      return `Here are some tips for Discord server branding:

**Essential Assets:**
- Server Icon (512x512px) - Simple, recognizable
- Banner (960x540px) - Eye-catching, on-brand
- Role Icons - Match your theme
- Emotes - Custom branded emotes add personality

**Design Tips:**
- Use consistent colors across all assets
- Keep text minimal on icons (doesn't scale well)
- Consider animated elements for Nitro-boosted perks

**Channel Organization:**
- Use emojis in channel names for visual appeal
- Create custom category dividers
- Match embed colors to server theme

Want specific recommendations for your server type?`
    }

    if (lowerMessage.includes("roblox") || lowerMessage.includes("group")) {
      return `Roblox group branding trends for 2024:

**Popular Styles:**
- Military/Tactical - Clean, structured, badge-style logos
- Fantasy/Medieval - Ornate crests and shields
- Futuristic/Sci-fi - Holographic effects, neon accents
- Streetwear/Urban - Bold typography, graffiti elements

**Asset Recommendations:**
- Group Icon: 512x512px, high contrast
- Game Thumbnails: 16:9 ratio, gameplay showcase
- Clothing Templates: Match your group's aesthetic

**Pro Tips:**
- Research top groups in your niche for inspiration
- Consider how assets look on mobile (smaller screens)
- Keep text large and readable

What type of Roblox group are you creating?`
    }

    return `That's an interesting question! Here are some general design tips:

**Key Principles:**
1. **Simplicity** - Less is often more in design
2. **Consistency** - Use the same colors, fonts, and styles
3. **Hierarchy** - Guide the viewer's eye to important elements
4. **Contrast** - Make elements stand out from each other

**For Your Project:**
- Start with a mood board of designs you like
- Define your core colors (2-3 maximum)
- Consider your target audience

Would you like me to dive deeper into any specific aspect? I can help with colors, typography, layout, or style suggestions!`
  }

  const handleSend = async (message: string = input) => {
    if (!message.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI thinking
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const response = generateResponse(message)
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response,
    }

    setMessages((prev) => [...prev, assistantMessage])
    setIsLoading(false)
  }

  const handleCopy = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleReset = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hi! I'm your AI design assistant. I can help you brainstorm ideas, suggest colors, recommend styles, and answer any design questions. What would you like to create today?",
        suggestions: INITIAL_SUGGESTIONS,
      },
    ])
  }

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-base">AI Design Assistant</CardTitle>
              <CardDescription className="text-xs">
                Get instant design help and inspiration
              </CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleReset} className="h-8 w-8">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === "user" && "flex-row-reverse"
              )}
            >
              {message.role === "assistant" ? (
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src="/ai-avatar.png" />
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white text-xs">
                    AI
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    U
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={cn(
                  "flex flex-col gap-2 max-w-[85%]",
                  message.role === "user" && "items-end"
                )}
              >
                <div
                  className={cn(
                    "rounded-2xl px-4 py-2.5 text-sm",
                    message.role === "assistant"
                      ? "bg-muted rounded-tl-sm"
                      : "bg-primary text-primary-foreground rounded-tr-sm"
                  )}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>

                {message.role === "assistant" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-muted-foreground"
                    onClick={() => handleCopy(message.content, message.id)}
                  >
                    {copiedId === message.id ? (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                )}

                {message.suggestions && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {message.suggestions.map((suggestion, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => handleSend(suggestion)}
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white text-xs">
                  AI
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1">
                  <span className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                  <span className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:0.1s]" />
                  <span className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t space-y-3">
        {/* Quick Actions */}
        <div className="flex gap-2">
          {QUICK_ACTIONS.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              size="sm"
              className="text-xs gap-1.5"
              onClick={() => handleSend(action.prompt)}
              disabled={isLoading}
            >
              <action.icon className="h-3 w-3" />
              {action.label}
            </Button>
          ))}
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about colors, styles, ideas..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!input.trim() || isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </Card>
  )
}
