"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Gift, Sparkles, Heart, Mail, CheckCircle, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

const giftAmounts = [
  { value: 25, label: "$25", popular: false },
  { value: 50, label: "$50", popular: true },
  { value: 100, label: "$100", popular: false },
  { value: 150, label: "$150", popular: false },
  { value: 200, label: "$200", popular: false },
]

const giftCardDesigns = [
  { id: "classic", name: "Classic", colors: "from-primary to-accent" },
  { id: "neon", name: "Neon", colors: "from-purple-500 to-pink-500" },
  { id: "nature", name: "Nature", colors: "from-green-500 to-teal-500" },
  { id: "sunset", name: "Sunset", colors: "from-orange-500 to-red-500" },
  { id: "ocean", name: "Ocean", colors: "from-blue-500 to-cyan-500" },
  { id: "galaxy", name: "Galaxy", colors: "from-indigo-500 to-purple-500" },
]

export default function GiftCardsPage() {
  const [selectedAmount, setSelectedAmount] = useState(50)
  const [customAmount, setCustomAmount] = useState("")
  const [selectedDesign, setSelectedDesign] = useState("classic")
  const [recipientEmail, setRecipientEmail] = useState("")
  const [recipientName, setRecipientName] = useState("")
  const [senderName, setSenderName] = useState("")
  const [message, setMessage] = useState("")
  const [deliveryDate, setDeliveryDate] = useState("")

  const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-16">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="secondary" className="mb-4">
                <Gift className="mr-1.5 h-3 w-3" />
                Gift Cards
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Give the Gift of <span className="text-primary">Design</span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Send a VisoryX gift card to a friend, creator, or colleague. Perfect for any occasion.
              </p>
            </div>
          </div>
        </section>

        {/* Gift Card Builder */}
        <section className="py-12">
          <div className="container">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Form */}
              <div className="space-y-8">
                {/* Amount Selection */}
                <div>
                  <h2 className="mb-4 text-xl font-semibold">Select Amount</h2>
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                    {giftAmounts.map((amount) => (
                      <button
                        key={amount.value}
                        onClick={() => {
                          setSelectedAmount(amount.value)
                          setCustomAmount("")
                        }}
                        className={cn(
                          "relative rounded-lg border-2 p-4 text-center transition-all hover:border-primary",
                          selectedAmount === amount.value && !customAmount
                            ? "border-primary bg-primary/5"
                            : "border-border"
                        )}
                      >
                        {amount.popular && (
                          <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs">Popular</Badge>
                        )}
                        <span className="text-lg font-bold">{amount.label}</span>
                      </button>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Label>Or enter custom amount ($10 - $500)</Label>
                    <div className="relative mt-1.5">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        type="number"
                        min={10}
                        max={500}
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="pl-8"
                      />
                    </div>
                  </div>
                </div>

                {/* Design Selection */}
                <div>
                  <h2 className="mb-4 text-xl font-semibold">Choose Design</h2>
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                    {giftCardDesigns.map((design) => (
                      <button
                        key={design.id}
                        onClick={() => setSelectedDesign(design.id)}
                        className={cn(
                          "aspect-[4/3] rounded-lg bg-gradient-to-br p-0.5 transition-all",
                          design.colors,
                          selectedDesign === design.id
                            ? "ring-2 ring-primary ring-offset-2"
                            : "opacity-70 hover:opacity-100"
                        )}
                      >
                        <div className="flex h-full items-center justify-center rounded-md bg-background/90 text-xs font-medium">
                          {design.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recipient Info */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Recipient Details</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="recipientName">Recipient Name</Label>
                      <Input
                        id="recipientName"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <Label htmlFor="recipientEmail">Recipient Email</Label>
                      <Input
                        id="recipientEmail"
                        type="email"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="senderName">From (Your Name)</Label>
                    <Input
                      id="senderName"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Personal Message (Optional)</Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Add a personal message..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="deliveryDate">Delivery Date</Label>
                    <Input
                      id="deliveryDate"
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      Leave empty to send immediately after purchase
                    </p>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="lg:sticky lg:top-24 lg:self-start">
                <h2 className="mb-4 text-xl font-semibold">Preview</h2>
                <Card className="overflow-hidden">
                  <div className={cn(
                    "relative aspect-[16/9] bg-gradient-to-br p-6 text-white",
                    giftCardDesigns.find(d => d.id === selectedDesign)?.colors
                  )}>
                    <div className="absolute right-4 top-4">
                      <Sparkles className="h-8 w-8 opacity-50" />
                    </div>
                    <div className="flex h-full flex-col justify-between">
                      <div>
                        <div className="text-sm font-medium opacity-80">VisoryX Gift Card</div>
                        <div className="mt-1 text-4xl font-bold">${finalAmount || 0}</div>
                      </div>
                      <div className="text-sm opacity-80">
                        {recipientName ? `For: ${recipientName}` : "For: Recipient Name"}
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    {message && (
                      <div className="mb-4 rounded-lg bg-muted p-4 text-sm">
                        <p className="italic">"{message}"</p>
                        <p className="mt-2 text-muted-foreground">- {senderName || "Anonymous"}</p>
                      </div>
                    )}
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Never expires
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Valid for any service
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Can be combined with other discounts
                      </li>
                    </ul>
                    <Button className="mt-6 w-full" size="lg">
                      Purchase Gift Card - ${finalAmount || 0}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Redeem Section */}
        <section className="border-t bg-muted/30 py-16">
          <div className="container">
            <div className="mx-auto max-w-xl text-center">
              <h2 className="mb-4 text-2xl font-bold">Have a Gift Card?</h2>
              <p className="mb-6 text-muted-foreground">
                Enter your gift card code to redeem it and add the balance to your account.
              </p>
              <div className="flex gap-2">
                <Input placeholder="Enter gift card code" className="text-center font-mono uppercase" />
                <Button>Redeem</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
