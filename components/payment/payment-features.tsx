"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  DollarSign, CreditCard, Clock, CheckCircle, AlertTriangle,
  Split, Wallet, Bell, Shield, Loader2
} from "lucide-react"
import { toast } from "sonner"

// --- Deposit System ---
export function DepositSystem({
  totalAmount,
  serviceName,
  onDepositPaid,
}: {
  totalAmount: number
  serviceName: string
  onDepositPaid?: (depositAmount: number) => void
}) {
  const [depositOption, setDepositOption] = useState<"full" | "50" | "25">("full")
  const [processing, setProcessing] = useState(false)

  const depositAmounts = {
    full: totalAmount,
    "50": totalAmount * 0.5,
    "25": totalAmount * 0.25,
  }
  const depositAmount = depositAmounts[depositOption]
  const remaining = totalAmount - depositAmount

  const handlePay = async () => {
    setProcessing(true)
    await new Promise(r => setTimeout(r, 1500))
    setProcessing(false)
    toast.success(depositOption === "full"
      ? "Payment complete!"
      : `Deposit of $${depositAmount.toFixed(2)} paid. Remaining: $${remaining.toFixed(2)}`
    )
    onDepositPaid?.(depositAmount)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Payment Options</CardTitle>
        </div>
        <CardDescription>Choose how to pay for {serviceName}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup value={depositOption} onValueChange={(v) => setDepositOption(v as typeof depositOption)}>
          <div className="space-y-2">
            <label className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors ${depositOption === "full" ? "border-primary bg-primary/5" : "hover:border-muted-foreground/30"}`}>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="full" />
                <div>
                  <p className="text-sm font-medium">Pay in Full</p>
                  <p className="text-xs text-muted-foreground">No remaining balance</p>
                </div>
              </div>
              <span className="font-bold">${totalAmount.toFixed(2)}</span>
            </label>
            <label className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors ${depositOption === "50" ? "border-primary bg-primary/5" : "hover:border-muted-foreground/30"}`}>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="50" />
                <div>
                  <p className="text-sm font-medium">50% Deposit</p>
                  <p className="text-xs text-muted-foreground">Pay rest on delivery</p>
                </div>
              </div>
              <span className="font-bold">${(totalAmount * 0.5).toFixed(2)}</span>
            </label>
            <label className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors ${depositOption === "25" ? "border-primary bg-primary/5" : "hover:border-muted-foreground/30"}`}>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="25" />
                <div>
                  <p className="text-sm font-medium">25% Deposit</p>
                  <p className="text-xs text-green-600">Start work for less upfront</p>
                </div>
              </div>
              <span className="font-bold">${(totalAmount * 0.25).toFixed(2)}</span>
            </label>
          </div>
        </RadioGroup>

        {depositOption !== "full" && (
          <div className="rounded-lg bg-muted p-3">
            <div className="flex items-center justify-between text-sm">
              <span>Due now</span>
              <span className="font-semibold">${depositAmount.toFixed(2)}</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
              <span>Due on delivery</span>
              <span>${remaining.toFixed(2)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex items-center justify-between text-sm font-bold">
              <span>Total</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        )}

        <Button className="w-full" onClick={handlePay} disabled={processing}>
          {processing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> :
            depositOption === "full" ? `Pay $${totalAmount.toFixed(2)}` : `Pay Deposit $${depositAmount.toFixed(2)}`}
        </Button>
      </CardContent>
    </Card>
  )
}

// --- Multi-Payment / Split Payment ---
export function MultiPaymentSplit({
  totalAmount,
  onSplitConfirm,
}: {
  totalAmount: number
  onSplitConfirm?: (splits: { method: string; amount: number }[]) => void
}) {
  const [splits, setSplits] = useState([
    { method: "Card ending 4242", amount: totalAmount },
  ])
  const [showSplit, setShowSplit] = useState(false)

  const allocated = splits.reduce((s, sp) => s + sp.amount, 0)
  const remaining = totalAmount - allocated

  const addSplit = () => {
    if (splits.length >= 3) return
    const newAmount = Math.max(remaining, 0)
    setSplits([...splits, { method: "PayPal", amount: newAmount }])
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Split className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Split Payment</CardTitle>
          </div>
          <Switch checked={showSplit} onCheckedChange={setShowSplit} />
        </div>
        <CardDescription>Split payment across multiple methods</CardDescription>
      </CardHeader>
      {showSplit && (
        <CardContent className="space-y-3">
          {splits.map((split, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border p-3">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">{split.method}</p>
              </div>
              <Input
                type="number"
                className="w-24 text-right"
                value={split.amount}
                onChange={e => {
                  const newSplits = [...splits]
                  newSplits[i].amount = Number.parseFloat(e.target.value) || 0
                  setSplits(newSplits)
                }}
              />
              {i > 0 && (
                <Button variant="ghost" size="sm" onClick={() => setSplits(splits.filter((_, j) => j !== i))}>Remove</Button>
              )}
            </div>
          ))}
          {Math.abs(remaining) > 0.01 && (
            <p className={`text-sm ${remaining > 0 ? "text-orange-500" : "text-red-500"}`}>
              {remaining > 0 ? `$${remaining.toFixed(2)} unallocated` : `$${Math.abs(remaining).toFixed(2)} over-allocated`}
            </p>
          )}
          {splits.length < 3 && (
            <Button variant="outline" size="sm" onClick={addSplit} className="w-full bg-transparent">
              <DollarSign className="mr-1 h-4 w-4" /> Add Payment Method
            </Button>
          )}
        </CardContent>
      )}
    </Card>
  )
}

// --- Payment Reminders ---
export function PaymentReminders() {
  const [reminders] = useState([
    { id: "1", orderId: "ORD-2845", customer: "GamingCrew", amount: 25.00, dueDate: "2026-02-10", status: "pending", daysOverdue: 0 },
    { id: "2", orderId: "ORD-2839", customer: "NightCity RP", amount: 37.50, dueDate: "2026-02-05", status: "overdue", daysOverdue: 3 },
    { id: "3", orderId: "ORD-2831", customer: "Elite Gaming", amount: 12.50, dueDate: "2026-02-08", status: "pending", daysOverdue: 0 },
  ])

  const sendReminder = (id: string) => {
    toast.success("Payment reminder sent!")
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-orange-500" />
          <CardTitle className="text-base">Payment Reminders</CardTitle>
        </div>
        <CardDescription>{reminders.filter(r => r.status === "overdue").length} overdue, {reminders.filter(r => r.status === "pending").length} pending</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {reminders.map(r => (
          <div key={r.id} className={`flex items-center justify-between rounded-lg border p-3 ${r.status === "overdue" ? "border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/20" : ""}`}>
            <div className="flex items-center gap-3">
              {r.status === "overdue" ? (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              ) : (
                <Clock className="h-4 w-4 text-orange-500" />
              )}
              <div>
                <p className="text-sm font-medium">{r.customer}</p>
                <p className="text-xs text-muted-foreground">{r.orderId} - Due {r.dueDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-sm font-bold">${r.amount.toFixed(2)}</p>
                {r.daysOverdue > 0 && (
                  <p className="text-xs text-red-500">{r.daysOverdue}d overdue</p>
                )}
              </div>
              <Button size="sm" variant="outline" onClick={() => sendReminder(r.id)}>
                <Bell className="mr-1 h-3 w-3" /> Remind
              </Button>
            </div>
          </div>
        ))}
        <Button variant="outline" className="w-full mt-2 bg-transparent" size="sm" onClick={() => toast.success("All reminders sent!")}>
          Send All Reminders
        </Button>
      </CardContent>
    </Card>
  )
}

// --- Auto Order Confirmation ---
export function AutoOrderConfirmation({
  orderId,
  serviceName,
  amount,
  customerEmail,
}: {
  orderId: string
  serviceName: string
  amount: number
  customerEmail: string
}) {
  const [confirmed, setConfirmed] = useState(false)

  // Simulates auto-confirmation on mount
  if (!confirmed) {
    setTimeout(() => setConfirmed(true), 100)
  }

  return (
    <Card className="border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-green-800 dark:text-green-200">Order Confirmed Automatically</p>
            <p className="mt-1 text-sm text-green-700 dark:text-green-300">
              Order #{orderId} for {serviceName} (${amount.toFixed(2)}) has been confirmed.
            </p>
            <p className="mt-1 text-xs text-green-600 dark:text-green-400">
              Confirmation sent to {customerEmail}
            </p>
            <div className="mt-2 flex gap-2">
              <Badge variant="outline" className="text-green-700 border-green-300 dark:text-green-300 dark:border-green-700">
                <Shield className="mr-1 h-3 w-3" /> Payment Verified
              </Badge>
              <Badge variant="outline" className="text-green-700 border-green-300 dark:text-green-300 dark:border-green-700">
                <CheckCircle className="mr-1 h-3 w-3" /> Auto-Confirmed
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
