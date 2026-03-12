"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Check, Clock, ExternalLink, QrCode, Wallet, AlertTriangle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface CryptoPaymentProps {
  amount: number
  currency?: string
  orderId: string
  onSuccess: () => void
  onCancel: () => void
  className?: string
}

interface CryptoOption {
  id: string
  name: string
  symbol: string
  icon: string
  network: string
  rate: number
  minAmount: number
  confirmations: number
}

const cryptoOptions: CryptoOption[] = [
  { id: "btc", name: "Bitcoin", symbol: "BTC", icon: "₿", network: "Bitcoin", rate: 0.000024, minAmount: 0.0001, confirmations: 2 },
  { id: "eth", name: "Ethereum", symbol: "ETH", icon: "Ξ", network: "Ethereum (ERC-20)", rate: 0.00041, minAmount: 0.001, confirmations: 12 },
  { id: "usdt", name: "Tether", symbol: "USDT", icon: "₮", network: "Ethereum (ERC-20)", rate: 1.0, minAmount: 10, confirmations: 12 },
  { id: "usdc", name: "USD Coin", symbol: "USDC", icon: "◈", network: "Ethereum (ERC-20)", rate: 1.0, minAmount: 10, confirmations: 12 },
  { id: "sol", name: "Solana", symbol: "SOL", icon: "◎", network: "Solana", rate: 0.0067, minAmount: 0.1, confirmations: 32 },
  { id: "ltc", name: "Litecoin", symbol: "LTC", icon: "Ł", network: "Litecoin", rate: 0.012, minAmount: 0.01, confirmations: 6 },
]

type PaymentStatus = "pending" | "detected" | "confirming" | "confirmed" | "expired" | "failed"

export function CryptoPayment({
  amount,
  currency = "USD",
  orderId,
  onSuccess,
  onCancel,
  className,
}: CryptoPaymentProps) {
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoOption | null>(null)
  const [paymentAddress, setPaymentAddress] = useState("")
  const [cryptoAmount, setCryptoAmount] = useState(0)
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("pending")
  const [timeRemaining, setTimeRemaining] = useState(1800) // 30 minutes
  const [confirmations, setConfirmations] = useState(0)
  const [copied, setCopied] = useState<"address" | "amount" | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (paymentStatus === "pending" && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setPaymentStatus("expired")
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [paymentStatus, timeRemaining])

  useEffect(() => {
    if (paymentStatus === "pending" && paymentAddress) {
      // Simulate payment detection
      const checkInterval = setInterval(() => {
        // In production, this would check the blockchain
        const detected = Math.random() > 0.95
        if (detected) {
          setPaymentStatus("detected")
          setTimeout(() => {
            setPaymentStatus("confirming")
            simulateConfirmations()
          }, 2000)
        }
      }, 5000)
      return () => clearInterval(checkInterval)
    }
  }, [paymentStatus, paymentAddress])

  const simulateConfirmations = () => {
    if (!selectedCrypto) return
    const interval = setInterval(() => {
      setConfirmations(prev => {
        const next = prev + 1
        if (next >= selectedCrypto.confirmations) {
          clearInterval(interval)
          setPaymentStatus("confirmed")
          setTimeout(onSuccess, 1000)
        }
        return next
      })
    }, 3000)
  }

  const generateAddress = async (crypto: CryptoOption) => {
    setIsGenerating(true)
    setSelectedCrypto(crypto)
    
    // Simulate address generation
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const addresses: Record<string, string> = {
      btc: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      eth: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      usdt: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      usdc: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      sol: "7EYnhQoR9YM3N7UoaKRoA44Uy8JeaZV3qyouov87awMs",
      ltc: "ltc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfj3q9eze",
    }
    
    setPaymentAddress(addresses[crypto.id] || "")
    setCryptoAmount(amount * crypto.rate)
    setIsGenerating(false)
  }

  const copyToClipboard = async (text: string, type: "address" | "amount") => {
    await navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getStatusColor = () => {
    switch (paymentStatus) {
      case "detected": return "text-blue-600"
      case "confirming": return "text-amber-600"
      case "confirmed": return "text-green-600"
      case "expired": return "text-red-600"
      case "failed": return "text-red-600"
      default: return "text-muted-foreground"
    }
  }

  const getStatusText = () => {
    switch (paymentStatus) {
      case "pending": return "Awaiting payment..."
      case "detected": return "Payment detected!"
      case "confirming": return `Confirming... (${confirmations}/${selectedCrypto?.confirmations || 0})`
      case "confirmed": return "Payment confirmed!"
      case "expired": return "Payment expired"
      case "failed": return "Payment failed"
      default: return ""
    }
  }

  if (!selectedCrypto) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Pay with Cryptocurrency
          </CardTitle>
          <CardDescription>
            Select your preferred cryptocurrency to complete the payment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {cryptoOptions.map((crypto) => (
              <button
                key={crypto.id}
                onClick={() => generateAddress(crypto)}
                disabled={isGenerating}
                className="flex items-center gap-3 rounded-lg border p-4 text-left transition-colors hover:border-primary hover:bg-primary/5"
              >
                <span className="text-2xl">{crypto.icon}</span>
                <div className="flex-1">
                  <p className="font-medium">{crypto.name}</p>
                  <p className="text-sm text-muted-foreground">{crypto.network}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm">{(amount * crypto.rate).toFixed(6)}</p>
                  <p className="text-xs text-muted-foreground">{crypto.symbol}</p>
                </div>
              </button>
            ))}
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Cryptocurrency payments are final. Please double-check the amount and address before sending.
            </AlertDescription>
          </Alert>

          <Button variant="outline" className="w-full" onClick={onCancel}>
            Choose Another Payment Method
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">{selectedCrypto.icon}</span>
            Pay with {selectedCrypto.name}
          </CardTitle>
          {paymentStatus === "pending" && (
            <Badge variant="outline" className="gap-1">
              <Clock className="h-3 w-3" />
              {formatTime(timeRemaining)}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* QR Code placeholder */}
        <div className="flex justify-center">
          <div className="flex h-48 w-48 items-center justify-center rounded-lg border-2 border-dashed bg-muted/30">
            <QrCode className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <Label>Amount to send</Label>
          <div className="flex gap-2">
            <Input
              readOnly
              value={`${cryptoAmount.toFixed(8)} ${selectedCrypto.symbol}`}
              className="font-mono"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => copyToClipboard(cryptoAmount.toFixed(8), "amount")}
            >
              {copied === "amount" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            ≈ ${amount.toFixed(2)} {currency}
          </p>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label>Send to address</Label>
          <div className="flex gap-2">
            <Input
              readOnly
              value={paymentAddress}
              className="font-mono text-xs"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => copyToClipboard(paymentAddress, "address")}
            >
              {copied === "address" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Network: {selectedCrypto.network}
          </p>
        </div>

        {/* Status */}
        <div className={cn("rounded-lg bg-muted/50 p-4 text-center", getStatusColor())}>
          {paymentStatus === "pending" && <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin" />}
          {paymentStatus === "confirmed" && <Check className="mx-auto mb-2 h-6 w-6" />}
          <p className="font-medium">{getStatusText()}</p>
          {paymentStatus === "confirming" && selectedCrypto && (
            <p className="mt-1 text-sm text-muted-foreground">
              Requires {selectedCrypto.confirmations} confirmations
            </p>
          )}
        </div>

        <Alert>
          <AlertDescription className="text-xs">
            Send exactly {cryptoAmount.toFixed(8)} {selectedCrypto.symbol} to the address above.
            Sending a different amount may result in a failed or delayed payment.
          </AlertDescription>
        </Alert>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              setSelectedCrypto(null)
              setPaymentAddress("")
              setPaymentStatus("pending")
              setTimeRemaining(1800)
            }}
          >
            Change Currency
          </Button>
          <Button variant="outline" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
