"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Package, Sparkles, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Bundle {
  id: string
  name: string
  description: string
  originalPrice: number
  bundlePrice: number
  savings: number
  items: string[]
  popular?: boolean
  limited?: boolean
}

const bundles: Bundle[] = [
  {
    id: "creator-starter",
    name: "Creator Starter",
    description: "Everything you need to launch your creator brand",
    originalPrice: 189.96,
    bundlePrice: 149.99,
    savings: 20,
    items: ["Custom Logo Design", "Discord Server Setup", "5 Social Media Posts", "YouTube Banner"],
    popular: true,
  },
  {
    id: "business-launch",
    name: "Business Launch",
    description: "Complete branding for your startup",
    originalPrice: 379.96,
    bundlePrice: 279.99,
    savings: 25,
    items: ["Full Brand Kit", "Pitch Deck (15 slides)", "Business Cards", "10 Social Posts", "Letterhead"],
  },
  {
    id: "gaming-community",
    name: "Gaming Community Kit",
    description: "Build your gaming community presence",
    originalPrice: 274.96,
    bundlePrice: 219.99,
    savings: 20,
    items: ["5 ERLC Liveries", "Discord Server Setup", "Team Logo", "Stream Overlay", "Banner"],
  },
  {
    id: "full-service",
    name: "Full Service Package",
    description: "Our most comprehensive offering",
    originalPrice: 649.93,
    bundlePrice: 449.99,
    savings: 30,
    items: ["Full Brand Kit", "Discord Package", "10 Social Posts", "Pitch Deck", "Stream Overlay", "5 Thumbnails"],
    limited: true,
  },
]

export function OrderBundles({ className }: { className?: string }) {
  const [selectedBundle, setSelectedBundle] = useState<string | null>(null)

  return (
    <div className={cn("space-y-6", className)}>
      <div className="text-center">
        <h2 className="text-2xl font-bold">Bundle & Save</h2>
        <p className="mt-2 text-muted-foreground">Get more value with our curated service bundles</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {bundles.map((bundle) => (
          <Card
            key={bundle.id}
            className={cn(
              "relative cursor-pointer transition-all hover:border-primary/50",
              selectedBundle === bundle.id && "border-primary ring-2 ring-primary/20",
              bundle.popular && "border-primary/30"
            )}
            onClick={() => setSelectedBundle(selectedBundle === bundle.id ? null : bundle.id)}
          >
            {bundle.popular && (
              <div className="absolute -top-3 left-4">
                <Badge className="bg-primary"><Sparkles className="mr-1 h-3 w-3" />Most Popular</Badge>
              </div>
            )}
            {bundle.limited && (
              <div className="absolute -top-3 right-4">
                <Badge variant="destructive">Limited Time</Badge>
              </div>
            )}

            <CardHeader className={cn(bundle.popular && "pt-6")}>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    {bundle.name}
                  </CardTitle>
                  <CardDescription className="mt-1">{bundle.description}</CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground line-through">${bundle.originalPrice.toFixed(2)}</p>
                  <p className="text-2xl font-bold">${bundle.bundlePrice.toFixed(2)}</p>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-500">Save {bundle.savings}%</Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                {bundle.items.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <Button asChild className="w-full" variant={bundle.popular ? "default" : "outline"}>
                <Link href={`/order?bundle=${bundle.id}`}>
                  Select Bundle
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Need a custom bundle? <Link href="/contact" className="text-primary hover:underline">Contact us</Link> for a personalized quote.
        </p>
      </div>
    </div>
  )
}
