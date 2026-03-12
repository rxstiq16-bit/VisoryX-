"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, ArrowRight, MessageCircle, LayoutDashboard, Loader2, AlertTriangle } from "lucide-react"

interface SessionData {
  status: string
  customer_email: string | null
  amount_total: number | null
  product_name: string | null
}

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const orderId = searchParams.get("order_id") || "VX-000000"
  const service = searchParams.get("service") || "Design Service"

  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(!!sessionId)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!sessionId) return

    async function verifySession() {
      try {
        const res = await fetch(`/api/verify-session?session_id=${sessionId}`)
        if (res.ok) {
          const data = await res.json()
          setSessionData(data)
        } else {
          setError(true)
        }
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    verifySession()
  }, [sessionId])

  const isPaid = sessionData?.status === "complete"
  const amountDisplay = sessionData?.amount_total
    ? `$${(sessionData.amount_total / 100).toFixed(2)}`
    : null
  const productName = sessionData?.product_name || service

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navigation />
        <main className="flex flex-1 items-center justify-center px-6 py-24">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Verifying your payment...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navigation />
        <main className="flex flex-1 items-center justify-center px-6 py-24">
          <Card className="mx-auto max-w-lg border-destructive/20">
            <CardContent className="flex flex-col items-center gap-6 py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Verification Issue</h1>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  We could not verify this payment session. If you were charged, your order will still be processed automatically. Contact us if you have questions.
                </p>
              </div>
              <div className="flex w-full flex-col gap-3 sm:flex-row">
                <Button asChild className="flex-1 gap-2">
                  <Link href="/dashboard">
                    <LayoutDashboard className="h-4 w-4" />
                    View Dashboard
                  </Link>
                </Button>
                <Button variant="outline" asChild className="flex-1 gap-2">
                  <Link href="/contact">Contact Support</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex flex-1 items-center justify-center px-6 py-24">
        <Card className="mx-auto max-w-lg border-primary/20">
          <CardContent className="flex flex-col items-center gap-6 py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {isPaid ? "Payment Confirmed" : "Order Received"}
              </h1>
              <p className="mt-2 text-muted-foreground leading-relaxed">
                {isPaid
                  ? "Your payment has been verified. We will begin working on your order shortly."
                  : "Thank you for your order. We have received your request and will begin working on it shortly."}
              </p>
            </div>

            <div className="w-full rounded-lg border border-border bg-secondary/30 p-4 text-left">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Order ID</span>
                <span className="font-mono font-medium text-foreground">{orderId}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Service</span>
                <span className="font-medium text-foreground">{productName}</span>
              </div>
              {amountDisplay && (
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="font-medium text-foreground">{amountDisplay}</span>
                </div>
              )}
              {sessionData?.customer_email && (
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Receipt sent to</span>
                  <span className="font-medium text-foreground">{sessionData.customer_email}</span>
                </div>
              )}
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <span className={`rounded px-2 py-0.5 text-xs font-medium ${isPaid ? "bg-emerald-500/20 text-emerald-400" : "bg-primary/20 text-primary"}`}>
                  {isPaid ? "Paid" : "Received"}
                </span>
              </div>
            </div>

            <div className="w-full space-y-2 text-left">
              <h3 className="text-sm font-semibold text-foreground">What happens next:</h3>
              <ol className="space-y-1.5 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">1</span>
                  We review your order details and references
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">2</span>
                  A designer is assigned and work begins
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">3</span>
                  You receive a draft for review in your dashboard
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">4</span>
                  Final files delivered after approval
                </li>
              </ol>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row">
              <Button asChild className="flex-1 gap-2">
                <Link href="/dashboard">
                  <LayoutDashboard className="h-4 w-4" />
                  View Dashboard
                </Link>
              </Button>
              <Button variant="outline" asChild className="flex-1 gap-2">
                <a href="https://discord.gg/visoryx" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4" />
                  Join Discord
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
