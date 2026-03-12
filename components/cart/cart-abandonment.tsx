"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ShoppingCart, Clock, Mail, Bell, TrendingUp, Users, DollarSign, AlertTriangle } from "lucide-react"

interface AbandonedCart {
  id: string
  userId: string
  userEmail: string
  userName: string
  items: { name: string; price: number }[]
  total: number
  abandonedAt: Date
  remindersSent: number
  lastReminder?: Date
  recovered: boolean
}

// Admin component for viewing abandoned carts
export function CartAbandonmentDashboard() {
  const [abandonedCarts, setAbandonedCarts] = useState<AbandonedCart[]>([
    {
      id: "1",
      userId: "user1",
      userEmail: "john@example.com",
      userName: "John Doe",
      items: [
        { name: "ERLC Livery Pack", price: 25 },
        { name: "Logo Design", price: 15 },
      ],
      total: 40,
      abandonedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      remindersSent: 1,
      lastReminder: new Date(Date.now() - 1 * 60 * 60 * 1000),
      recovered: false,
    },
    {
      id: "2",
      userId: "user2",
      userEmail: "jane@example.com",
      userName: "Jane Smith",
      items: [{ name: "Full Branding Package", price: 75 }],
      total: 75,
      abandonedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      remindersSent: 2,
      recovered: false,
    },
  ])

  const stats = {
    totalAbandoned: abandonedCarts.length,
    totalValue: abandonedCarts.reduce((sum, cart) => sum + cart.total, 0),
    recoveryRate: 23,
    avgCartValue: abandonedCarts.length > 0 
      ? abandonedCarts.reduce((sum, cart) => sum + cart.total, 0) / abandonedCarts.length 
      : 0,
  }

  const sendReminder = async (cartId: string) => {
    setAbandonedCarts(carts =>
      carts.map(cart =>
        cart.id === cartId
          ? { ...cart, remindersSent: cart.remindersSent + 1, lastReminder: new Date() }
          : cart
      )
    )
  }

  const getTimeSince = (date: Date) => {
    const hours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60))
    if (hours < 1) return "Less than an hour ago"
    if (hours < 24) return `${hours} hours ago`
    return `${Math.floor(hours / 24)} days ago`
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Abandoned Carts</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAbandoned}</div>
            <p className="text-xs text-muted-foreground">Active this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Potential Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalValue}</div>
            <p className="text-xs text-muted-foreground">In abandoned carts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Recovery Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recoveryRate}%</div>
            <Progress value={stats.recoveryRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Cart Value</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.avgCartValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Per abandoned cart</p>
          </CardContent>
        </Card>
      </div>

      {/* Abandoned Carts List */}
      <Card>
        <CardHeader>
          <CardTitle>Abandoned Carts</CardTitle>
          <CardDescription>
            Send recovery emails to customers who left items in their cart
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {abandonedCarts.map((cart) => (
              <div
                key={cart.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{cart.userName}</span>
                    <Badge variant="secondary">${cart.total}</Badge>
                    {cart.remindersSent > 0 && (
                      <Badge variant="outline">
                        {cart.remindersSent} reminder{cart.remindersSent > 1 ? "s" : ""} sent
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{cart.userEmail}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Abandoned {getTimeSince(cart.abandonedAt)}
                    </span>
                    <span>
                      {cart.items.length} item{cart.items.length > 1 ? "s" : ""}:{" "}
                      {cart.items.map((i) => i.name).join(", ")}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => sendReminder(cart.id)}
                    disabled={cart.remindersSent >= 3}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Send Reminder
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Checkout urgency countdown component
export function CheckoutCountdown({ expiresAt }: { expiresAt: Date }) {
  const [timeLeft, setTimeLeft] = useState("")
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = expiresAt.getTime() - Date.now()
      if (diff <= 0) {
        setExpired(true)
        setTimeLeft("Expired")
        clearInterval(timer)
        return
      }

      const minutes = Math.floor(diff / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, "0")}`)
    }, 1000)

    return () => clearInterval(timer)
  }, [expiresAt])

  if (expired) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-2 text-destructive">
        <AlertTriangle className="h-4 w-4" />
        <span className="text-sm font-medium">Your cart has expired. Items may no longer be available.</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 px-4 py-2 text-amber-600">
      <Clock className="h-4 w-4" />
      <span className="text-sm">
        Complete checkout in <span className="font-bold">{timeLeft}</span> to secure your items
      </span>
    </div>
  )
}

// Cart sharing link generator
export function CartSharingLink({ cartId }: { cartId: string }) {
  const [copied, setCopied] = useState(false)
  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/cart/shared/${cartId}`

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={shareUrl}
        readOnly
        className="flex-1 rounded-md border bg-muted px-3 py-2 text-sm"
      />
      <Button onClick={copyLink} variant="outline" size="sm">
        {copied ? "Copied!" : "Copy Link"}
      </Button>
    </div>
  )
}
