"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { HelpCircle, Send, X, Bot, User, Loader2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const FAQ_RESPONSES: Record<string, string> = {
  pricing: "Our pricing varies by service. Logo designs start at $39.99, Discord setups from $79.99, and ERLC liveries from $16.99. Check our Services page for full pricing!",
  payment: "We accept credit/debit cards, PayPal, and Robux payments. Robux is converted at approximately 80 Robux = $1 USD.",
  turnaround: "Most orders are completed within 2-5 business days. Rush delivery is available for faster turnaround!",
  revisions: "All orders include free revisions (usually 2-3). We want you to be 100% satisfied!",
  refund: "We offer full refunds if work hasn't started, partial refunds for in-progress orders.",
  erlc: "We create custom vehicle liveries for ERLC on Roblox - police, fire, EMS, and civilian vehicles.",
  discord: "Our Discord services include server setup, bot configuration, custom embeds, and branding.",
  logo: "We design custom logos with multiple concepts, unlimited revisions, and full ownership.",
  delivery: "Completed files are delivered to your dashboard with email notification.",
  contact: "Reach us through live chat, email at support@visoryx.com, or Discord. 24/7 support!",
}

function findBestMatch(query: string): string {
  const lowerQuery = query.toLowerCase()
  if (lowerQuery.includes("price") || lowerQuery.includes("cost")) return FAQ_RESPONSES.pricing
  if (lowerQuery.includes("pay") || lowerQuery.includes("robux")) return FAQ_RESPONSES.payment
  if (lowerQuery.includes("time") || lowerQuery.includes("long")) return FAQ_RESPONSES.turnaround
  if (lowerQuery.includes("revision") || lowerQuery.includes("change")) return FAQ_RESPONSES.revisions
  if (lowerQuery.includes("refund") || lowerQuery.includes("cancel")) return FAQ_RESPONSES.refund
  if (lowerQuery.includes("erlc") || lowerQuery.includes("livery")) return FAQ_RESPONSES.erlc
  if (lowerQuery.includes("discord") || lowerQuery.includes("server")) return FAQ_RESPONSES.discord
  if (lowerQuery.includes("logo") || lowerQuery.includes("brand")) return FAQ_RESPONSES.logo
  if (lowerQuery.includes("deliver") || lowerQuery.includes("download")) return FAQ_RESPONSES.delivery
  if (lowerQuery.includes("contact") || lowerQuery.includes("help")) return FAQ_RESPONSES.contact
  return "I'm not sure about that. Please contact our support team through live chat or email support@visoryx.com!"
}

export function FAQChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "assistant", content: "Hi! Ask me about pricing, services, turnaround times, or anything else!", timestamp: new Date() },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return
    const userMessage: Message = { id: Date.now().toString(), role: "user", content: input, timestamp: new Date() }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    const response = findBestMatch(input)
    setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: response, timestamp: new Date() }])
    setIsTyping(false)
  }

  const quickQuestions = ["What are your prices?", "How long does an order take?", "Do you accept Robux?"]

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className={cn("fixed bottom-6 left-6 z-50 h-14 w-14 rounded-full shadow-lg bg-secondary text-secondary-foreground hover:bg-secondary/90", isOpen && "hidden")} size="icon">
        <HelpCircle className="h-6 w-6" />
      </Button>
      {isOpen && (
        <Card className="fixed bottom-6 left-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary"><Sparkles className="h-4 w-4 text-primary-foreground" /></div>
              <div><CardTitle className="text-base">FAQ Assistant</CardTitle><p className="text-xs text-muted-foreground">Ask me anything</p></div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}><X className="h-4 w-4" /></Button>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[300px] px-4" ref={scrollRef}>
              <div className="space-y-4 py-4">
                {messages.map((message) => (
                  <div key={message.id} className={cn("flex gap-2", message.role === "user" ? "justify-end" : "justify-start")}>
                    {message.role === "assistant" && <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted"><Bot className="h-4 w-4" /></div>}
                    <div className={cn("max-w-[80%] rounded-lg px-3 py-2 text-sm", message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted")}>{message.content}</div>
                    {message.role === "user" && <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary"><User className="h-4 w-4 text-primary-foreground" /></div>}
                  </div>
                ))}
                {isTyping && <div className="flex gap-2"><div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted"><Bot className="h-4 w-4" /></div><div className="flex items-center gap-1 rounded-lg bg-muted px-3 py-2"><Loader2 className="h-4 w-4 animate-spin" /></div></div>}
              </div>
            </ScrollArea>
            {messages.length <= 2 && (
              <div className="border-t px-4 py-3">
                <p className="mb-2 text-xs font-medium text-muted-foreground">Quick questions:</p>
                <div className="flex flex-wrap gap-1">
                  {quickQuestions.map((q) => (<Button key={q} variant="outline" size="sm" className="h-7 text-xs" onClick={() => { setInput(q); setTimeout(handleSend, 100) }}>{q}</Button>))}
                </div>
              </div>
            )}
            <div className="border-t p-4">
              <form onSubmit={(e) => { e.preventDefault(); handleSend() }} className="flex gap-2">
                <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your question..." disabled={isTyping} />
                <Button type="submit" size="icon" disabled={!input.trim() || isTyping}><Send className="h-4 w-4" /></Button>
              </form>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
