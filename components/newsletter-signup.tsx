"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Loader2, Mail, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface NewsletterSignupProps { variant?: "inline" | "card" | "footer"; className?: string }

export function NewsletterSignup({ variant = "card", className }: NewsletterSignupProps) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErrorMessage("Please enter a valid email"); setStatus("error"); return }
    setStatus("loading")
    try {
      const response = await fetch("/api/newsletter/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) })
      if (!response.ok) throw new Error("Failed")
      setStatus("success"); setEmail("")
    } catch { setStatus("error"); setErrorMessage("Something went wrong. Please try again.") }
  }

  if (status === "success") {
    return <div className={cn("flex items-center gap-3 rounded-lg bg-green-500/10 p-4", className)}><CheckCircle className="h-5 w-5 text-green-500" /><div><p className="font-medium text-green-500">You&apos;re subscribed!</p><p className="text-sm text-muted-foreground">Check your inbox for confirmation.</p></div></div>
  }

  if (variant === "inline") {
    return <form onSubmit={handleSubmit} className={cn("flex gap-2", className)}><Input type="email" placeholder="Enter your email" value={email} onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle") }} className={cn(status === "error" && "border-destructive")} /><Button type="submit" disabled={status === "loading"}>{status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}</Button></form>
  }

  if (variant === "footer") {
    return <div className={className}><h4 className="mb-2 font-semibold">Stay Updated</h4><p className="mb-4 text-sm text-muted-foreground">Get design tips and exclusive offers.</p><form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row"><Input type="email" placeholder="your@email.com" value={email} onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle") }} className={cn("flex-1", status === "error" && "border-destructive")} /><Button type="submit" disabled={status === "loading"}>{status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Mail className="mr-2 h-4 w-4" />Subscribe</>}</Button></form>{status === "error" && <p className="mt-2 text-sm text-destructive">{errorMessage}</p>}</div>
  }

  return (
    <Card className={className}>
      <CardHeader><div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><Sparkles className="h-5 w-5 text-primary" /></div><CardTitle>Join Our Newsletter</CardTitle><CardDescription>Get design tips, exclusive discounts, and updates.</CardDescription></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4"><div><Input type="email" placeholder="Enter your email" value={email} onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle") }} className={cn(status === "error" && "border-destructive")} />{status === "error" && <p className="mt-1 text-sm text-destructive">{errorMessage}</p>}</div><Button type="submit" className="w-full" disabled={status === "loading"}>{status === "loading" ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Subscribing...</> : <><Mail className="mr-2 h-4 w-4" />Subscribe Now</>}</Button><p className="text-center text-xs text-muted-foreground">Unsubscribe anytime.</p></form>
      </CardContent>
    </Card>
  )
}
