"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRightLeft, DollarSign, Gamepad2, Info } from "lucide-react"
import { cn } from "@/lib/utils"

const ROBUX_RATE = 80 // 80 Robux = $1 USD

interface RobuxCalculatorProps {
  className?: string
  compact?: boolean
  initialUsd?: number
}

export function RobuxCalculator({ className, compact = false, initialUsd }: RobuxCalculatorProps) {
  const [usdAmount, setUsdAmount] = useState(initialUsd?.toString() || "")
  const [robuxAmount, setRobuxAmount] = useState("")
  const [activeTab, setActiveTab] = useState<"usd-to-robux" | "robux-to-usd">("usd-to-robux")

  useEffect(() => {
    if (initialUsd) {
      setUsdAmount(initialUsd.toString())
      setRobuxAmount(Math.round(initialUsd * ROBUX_RATE).toString())
    }
  }, [initialUsd])

  const handleUsdChange = (value: string) => {
    setUsdAmount(value)
    const num = parseFloat(value)
    if (!isNaN(num) && num >= 0) {
      setRobuxAmount(Math.round(num * ROBUX_RATE).toString())
    } else {
      setRobuxAmount("")
    }
  }

  const handleRobuxChange = (value: string) => {
    setRobuxAmount(value)
    const num = parseFloat(value)
    if (!isNaN(num) && num >= 0) {
      setUsdAmount((num / ROBUX_RATE).toFixed(2))
    } else {
      setUsdAmount("")
    }
  }

  if (compact) {
    return (
      <div className={cn("flex items-center gap-3 rounded-lg border p-3", className)}>
        <Gamepad2 className="h-5 w-5 text-muted-foreground shrink-0" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">${usdAmount || "0"}</span>
            <ArrowRightLeft className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm font-medium text-primary">{robuxAmount || "0"} R$</span>
          </div>
          <p className="text-xs text-muted-foreground">Rate: {ROBUX_RATE} R$ = $1</p>
        </div>
      </div>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gamepad2 className="h-5 w-5" />
          Robux Calculator
        </CardTitle>
        <CardDescription>Convert between USD and Robux</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="usd-to-robux">USD → Robux</TabsTrigger>
            <TabsTrigger value="robux-to-usd">Robux → USD</TabsTrigger>
          </TabsList>

          <TabsContent value="usd-to-robux" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="usd-input">Amount in USD</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="usd-input"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={usdAmount}
                  onChange={(e) => handleUsdChange(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex items-center justify-center">
              <ArrowRightLeft className="h-5 w-5 text-muted-foreground rotate-90" />
            </div>
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="text-sm text-muted-foreground">Equivalent in Robux</p>
              <p className="text-3xl font-bold text-primary">{robuxAmount || "0"} R$</p>
            </div>
          </TabsContent>

          <TabsContent value="robux-to-usd" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="robux-input">Amount in Robux</Label>
              <div className="relative">
                <Gamepad2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="robux-input"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="0"
                  value={robuxAmount}
                  onChange={(e) => handleRobuxChange(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex items-center justify-center">
              <ArrowRightLeft className="h-5 w-5 text-muted-foreground rotate-90" />
            </div>
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="text-sm text-muted-foreground">Equivalent in USD</p>
              <p className="text-3xl font-bold">${usdAmount || "0.00"}</p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 flex items-start gap-2 rounded-lg bg-blue-500/10 p-3">
          <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-500">Current Rate: {ROBUX_RATE} R$ = $1 USD</p>
            <p className="text-muted-foreground">Robux payments are processed through our secure gamepass system.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
