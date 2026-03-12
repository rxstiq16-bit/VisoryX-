"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Loader2, 
  Copy, 
  Check, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle2,
  RefreshCw,
  Clock,
  Gamepad2
} from "lucide-react"
import { cn } from "@/lib/utils"

interface RobuxPaymentProps {
  amount: number // USD amount
  orderId: string
  onSuccess: () => void
  onError: (error: string) => void
  className?: string
}

const ROBUX_RATE = 80 // Robux per $1 USD (approximate)
const VERIFICATION_TIMEOUT = 600 // 10 minutes

export function RobuxPayment({ amount, orderId, onSuccess, onError, className }: RobuxPaymentProps) {
  const [step, setStep] = useState<"init" | "pending" | "verifying" | "success" | "failed">("init")
  const [verificationCode, setVerificationCode] = useState("")
  const [gamepassUrl, setGamepassUrl] = useState("")
  const [copied, setCopied] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(VERIFICATION_TIMEOUT)
  const [checkingPayment, setCheckingPayment] = useState(false)

  const robuxAmount = Math.ceil(amount * ROBUX_RATE)

  // Initialize payment
  const initializePayment = async () => {
    try {
      const response = await fetch("/api/payments/robux/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, amount, robuxAmount }),
      })

      const data = await response.json()
      
      if (!response.ok) throw new Error(data.error)

      setVerificationCode(data.verificationCode)
      setGamepassUrl(data.gamepassUrl)
      setStep("pending")
    } catch (error) {
      onError(error instanceof Error ? error.message : "Failed to initialize Robux payment")
    }
  }

  // Check payment status
  const checkPayment = useCallback(async () => {
    if (step !== "pending") return

    setCheckingPayment(true)
    try {
      const response = await fetch(`/api/payments/robux/verify?code=${verificationCode}`)
      const data = await response.json()

      if (data.status === "completed") {
        setStep("success")
        onSuccess()
      } else if (data.status === "failed") {
        setStep("failed")
        onError("Payment verification failed")
      }
    } catch (error) {
      console.error("Payment check failed:", error)
    } finally {
      setCheckingPayment(false)
    }
  }, [step, verificationCode, onSuccess, onError])

  // Auto-check payment every 10 seconds
  useEffect(() => {
    if (step !== "pending") return

    const interval = setInterval(checkPayment, 10000)
    return () => clearInterval(interval)
  }, [step, checkPayment])

  // Countdown timer
  useEffect(() => {
    if (step !== "pending") return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setStep("failed")
          onError("Payment verification timed out")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [step, onError])

  const copyCode = () => {
    navigator.clipboard.writeText(verificationCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gamepad2 className="h-5 w-5" />
          Pay with Robux
        </CardTitle>
        <CardDescription>
          Complete your purchase using Roblox Robux
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Price conversion */}
        <div className="rounded-lg bg-muted p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Order Total</span>
            <span className="font-medium">${amount.toFixed(2)} USD</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Robux Amount</span>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-lg font-bold">
                R$ {robuxAmount.toLocaleString()}
              </Badge>
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Rate: R$ {ROBUX_RATE} per $1 USD
          </p>
        </div>

        {step === "init" && (
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You will need to purchase a gamepass on Roblox to complete this payment. 
                Make sure you are logged into your Roblox account.
              </AlertDescription>
            </Alert>
            <Button onClick={initializePayment} className="w-full">
              <Gamepad2 className="mr-2 h-4 w-4" />
              Start Robux Payment
            </Button>
          </div>
        )}

        {step === "pending" && (
          <div className="space-y-4">
            {/* Timer */}
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Time remaining</span>
              </div>
              <Badge variant={timeRemaining < 60 ? "destructive" : "secondary"}>
                {formatTime(timeRemaining)}
              </Badge>
            </div>

            <Progress value={(timeRemaining / VERIFICATION_TIMEOUT) * 100} className="h-2" />

            {/* Verification code */}
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Your verification code:</p>
              <div className="mt-2 flex items-center gap-2">
                <code className="flex-1 rounded bg-muted px-3 py-2 text-lg font-mono font-bold">
                  {verificationCode}
                </code>
                <Button variant="outline" size="icon" onClick={copyCode}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Include this code in the gamepass purchase description
              </p>
            </div>

            {/* Instructions */}
            <div className="space-y-2 text-sm">
              <p className="font-medium">Instructions:</p>
              <ol className="list-inside list-decimal space-y-1 text-muted-foreground">
                <li>Click the button below to open the gamepass</li>
                <li>Purchase the gamepass for R$ {robuxAmount.toLocaleString()}</li>
                <li>Include the verification code in your purchase</li>
                <li>Return here - payment will verify automatically</li>
              </ol>
            </div>

            <div className="flex gap-2">
              <Button asChild className="flex-1">
                <a href={gamepassUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Gamepass
                </a>
              </Button>
              <Button 
                variant="outline" 
                onClick={checkPayment}
                disabled={checkingPayment}
              >
                {checkingPayment ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              {checkingPayment ? "Checking payment..." : "Automatically checking every 10 seconds"}
            </p>
          </div>
        )}

        {step === "success" && (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold">Payment Successful!</h3>
              <p className="text-sm text-muted-foreground">
                Your Robux payment has been verified
              </p>
            </div>
          </div>
        )}

        {step === "failed" && (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold">Payment Failed</h3>
              <p className="text-sm text-muted-foreground">
                We could not verify your Robux payment
              </p>
            </div>
            <Button onClick={initializePayment} variant="outline">
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
