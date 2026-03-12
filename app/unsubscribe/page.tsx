"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, MailX, Loader2 } from "lucide-react"

export default function UnsubscribePage() {
  const searchParams = useSearchParams()
  const prefilledEmail = searchParams.get("email") || ""
  const [email, setEmail] = useState(prefilledEmail)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      setSubmitted(true)
    } catch {
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex flex-1 items-center justify-center px-6 py-24">
        <Card className="mx-auto max-w-md w-full">
          <CardContent className="flex flex-col items-center gap-6 py-10 text-center">
            {submitted ? (
              <>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Unsubscribed</h1>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    You have been unsubscribed from our marketing emails. You may still receive transactional emails related to your orders.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                  <MailX className="h-7 w-7 text-muted-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Unsubscribe</h1>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    Enter your email to unsubscribe from VisoryX marketing and promotional emails.
                  </p>
                </div>
                <form onSubmit={handleUnsubscribe} className="w-full space-y-4 text-left">
                  <div className="space-y-2">
                    <Label htmlFor="unsub-email">Email address</Label>
                    <Input
                      id="unsub-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</> : "Unsubscribe"}
                  </Button>
                </form>
              </>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
