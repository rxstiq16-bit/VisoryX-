"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Loader2, CreditCard, Smartphone, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

interface ExpressCheckoutProps {
  amount: number
  currency?: string
  onSuccess: (paymentMethod: string, paymentId: string) => void
  onError: (error: string) => void
  className?: string
}

// Apple Pay button component
function ApplePayButton({ 
  amount, 
  currency,
  onSuccess, 
  onError 
}: { 
  amount: number
  currency: string
  onSuccess: (paymentId: string) => void
  onError: (error: string) => void 
}) {
  const [available, setAvailable] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if Apple Pay is available
    if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
      setAvailable(true)
    }
  }, [])

  const handleClick = async () => {
    if (!window.ApplePaySession) return

    setLoading(true)

    try {
      const paymentRequest = {
        countryCode: "US",
        currencyCode: currency,
        total: {
          label: "VisoryX",
          amount: amount.toFixed(2),
        },
        supportedNetworks: ["visa", "masterCard", "amex", "discover"],
        merchantCapabilities: ["supports3DS"],
      }

      const session = new ApplePaySession(3, paymentRequest)

      session.onvalidatemerchant = async (event) => {
        const response = await fetch("/api/payments/apple-pay/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ validationURL: event.validationURL }),
        })
        const merchantSession = await response.json()
        session.completeMerchantValidation(merchantSession)
      }

      session.onpaymentauthorized = async (event) => {
        const response = await fetch("/api/payments/apple-pay/process", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            payment: event.payment,
            amount,
            currency,
          }),
        })
        
        const result = await response.json()
        
        if (result.success) {
          session.completePayment(ApplePaySession.STATUS_SUCCESS)
          onSuccess(result.paymentId)
        } else {
          session.completePayment(ApplePaySession.STATUS_FAILURE)
          onError(result.error || "Payment failed")
        }
      }

      session.begin()
    } catch (error) {
      onError(error instanceof Error ? error.message : "Apple Pay failed")
    } finally {
      setLoading(false)
    }
  }

  if (!available) return null

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="flex h-12 w-full items-center justify-center rounded-lg bg-black text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      aria-label="Pay with Apple Pay"
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <svg className="h-5" viewBox="0 0 165.52 105.97" fill="currentColor">
          <path d="M150.7 0H14.82C6.63 0 0 6.63 0 14.82v76.33c0 8.19 6.63 14.82 14.82 14.82H150.7c8.19 0 14.82-6.63 14.82-14.82V14.82C165.52 6.63 158.89 0 150.7 0z" fill="currentColor"/>
          <path d="M43.08 35.22c2.14-2.68 3.58-6.42 3.19-10.14-3.08.12-6.81 2.05-9.02 4.64-1.98 2.29-3.71 5.95-3.24 9.46 3.44.27 6.95-1.74 9.07-3.96zM46.2 39.67c-5.01-.3-9.27 2.85-11.66 2.85-2.38 0-6.06-2.69-9.97-2.62-5.13.08-9.86 2.98-12.5 7.58-5.33 9.24-1.37 22.91 3.82 30.41 2.53 3.67 5.56 7.79 9.54 7.64 3.82-.16 5.27-2.47 9.89-2.47 4.62 0 5.91 2.47 9.96 2.39 4.12-.08 6.72-3.74 9.24-7.43 2.91-4.27 4.12-8.4 4.19-8.62-.09-.04-8.03-3.08-8.11-12.23-.08-7.66 6.26-11.33 6.55-11.53-3.58-5.28-9.15-5.87-11.12-5.97h.17z" fill="white"/>
          <path d="M79.04 29.53v54.77h8.5V65.58h11.78c10.76 0 18.32-7.38 18.32-18.06 0-10.68-7.43-18.0-18.04-18.0H79.04zm8.5 7.14h9.8c7.39 0 11.61 3.94 11.61 10.88 0 6.94-4.22 10.92-11.65 10.92h-9.76V36.67zM134.3 84.67c5.34 0 10.28-2.71 12.53-6.99h.17v6.62h7.87V56.67c0-7.91-6.33-13-16.07-13-9.09 0-15.78 5.17-16.03 12.28h7.67c.63-3.37 3.78-5.58 8.11-5.58 5.25 0 8.19 2.45 8.19 6.95v3.05l-10.72.63c-9.96.59-15.34 4.68-15.34 11.79 0 7.18 5.58 11.87 13.62 11.87zm2.26-6.37c-4.57 0-7.47-2.2-7.47-5.57 0-3.49 2.79-5.52 8.11-5.85l9.55-.59v3.13c0 5.17-4.36 8.88-10.19 8.88z" fill="white"/>
        </svg>
      )}
    </button>
  )
}

// Google Pay button component
function GooglePayButton({ 
  amount, 
  currency,
  onSuccess, 
  onError 
}: { 
  amount: number
  currency: string
  onSuccess: (paymentId: string) => void
  onError: (error: string) => void 
}) {
  const [available, setAvailable] = useState(false)
  const [loading, setLoading] = useState(false)
  const [paymentsClient, setPaymentsClient] = useState<google.payments.api.PaymentsClient | null>(null)

  useEffect(() => {
    // Load Google Pay script
    const script = document.createElement("script")
    script.src = "https://pay.google.com/gp/p/js/pay.js"
    script.async = true
    script.onload = () => {
      const client = new google.payments.api.PaymentsClient({
        environment: process.env.NODE_ENV === "production" ? "PRODUCTION" : "TEST",
      })
      setPaymentsClient(client)

      // Check if Google Pay is available
      client
        .isReadyToPay({
          apiVersion: 2,
          apiVersionMinor: 0,
          allowedPaymentMethods: [
            {
              type: "CARD",
              parameters: {
                allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                allowedCardNetworks: ["VISA", "MASTERCARD", "AMEX", "DISCOVER"],
              },
            },
          ],
        })
        .then((response) => {
          setAvailable(response.result)
        })
    }
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handleClick = async () => {
    if (!paymentsClient) return

    setLoading(true)

    try {
      const paymentDataRequest: google.payments.api.PaymentDataRequest = {
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [
          {
            type: "CARD",
            parameters: {
              allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
              allowedCardNetworks: ["VISA", "MASTERCARD", "AMEX", "DISCOVER"],
            },
            tokenizationSpecification: {
              type: "PAYMENT_GATEWAY",
              parameters: {
                gateway: "stripe",
                "stripe:version": "2024-04-10",
                "stripe:publishableKey": process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
              },
            },
          },
        ],
        merchantInfo: {
          merchantId: process.env.NEXT_PUBLIC_GOOGLE_PAY_MERCHANT_ID || "",
          merchantName: "VisoryX",
        },
        transactionInfo: {
          totalPriceStatus: "FINAL",
          totalPrice: amount.toFixed(2),
          currencyCode: currency,
          countryCode: "US",
        },
      }

      const paymentData = await paymentsClient.loadPaymentData(paymentDataRequest)

      // Process payment on server
      const response = await fetch("/api/payments/google-pay/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentData,
          amount,
          currency,
        }),
      })

      const result = await response.json()

      if (result.success) {
        onSuccess(result.paymentId)
      } else {
        onError(result.error || "Payment failed")
      }
    } catch (error) {
      if ((error as Error).message !== "User closed the Payment Request UI.") {
        onError(error instanceof Error ? error.message : "Google Pay failed")
      }
    } finally {
      setLoading(false)
    }
  }

  if (!available) return null

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="flex h-12 w-full items-center justify-center rounded-lg border bg-white text-black transition-colors hover:bg-gray-50 disabled:opacity-50"
      aria-label="Pay with Google Pay"
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <svg className="h-5" viewBox="0 0 41 17" fill="none">
          <path d="M19.5 8.4v5h-1.6V2h4.2c1 0 1.9.3 2.6 1 .7.6 1.1 1.5 1.1 2.5s-.4 1.9-1.1 2.5c-.7.7-1.6 1-2.6 1h-2.6v-.6zm0-5.1v3.8h2.7c.6 0 1.1-.2 1.5-.6.4-.4.6-.9.6-1.4 0-.5-.2-1-.6-1.4-.4-.4-.9-.6-1.5-.6h-2.7v.2z" fill="#5F6368"/>
          <path d="M28.2 5.6c1.2 0 2.1.3 2.8 1 .7.6 1 1.5 1 2.6v5.2h-1.5v-1.2h-.1c-.6 1-1.5 1.4-2.6 1.4-.9 0-1.7-.3-2.3-.8-.6-.5-.9-1.2-.9-2s.3-1.5.9-2c.6-.5 1.5-.8 2.5-.8.9 0 1.6.2 2.2.5v-.4c0-.5-.2-1-.6-1.4-.4-.4-.9-.6-1.5-.6-.8 0-1.5.4-1.9 1.1l-1.4-.9c.7-1 1.7-1.6 3.4-1.6v-.1zm-2 6.4c0 .4.2.7.5.9.3.2.7.4 1.1.4.6 0 1.2-.2 1.7-.7.5-.5.7-1 .7-1.6-.5-.4-1.1-.5-1.9-.5-.6 0-1.1.1-1.5.4-.4.3-.6.6-.6 1.1z" fill="#5F6368"/>
          <path d="M40.1 5.8l-5.3 12.2h-1.6l2-4.3-3.5-7.9h1.7l2.5 6.2h.1l2.5-6.2h1.6z" fill="#5F6368"/>
          <path d="M13.1 7.3c0-.5 0-.9-.1-1.3H6.7v2.6h3.6c-.2.9-.6 1.6-1.4 2.1v1.8h2.2c1.3-1.2 2-3 2-5.2z" fill="#4285F4"/>
          <path d="M6.7 14.1c1.9 0 3.5-.6 4.6-1.7l-2.2-1.8c-.6.4-1.4.7-2.4.7-1.9 0-3.4-1.3-4-3h-2.3v1.8c1.2 2.4 3.5 4 6.3 4z" fill="#34A853"/>
          <path d="M2.7 8.4c-.1-.5-.2-1-.2-1.5s.1-1 .2-1.5V3.6H.4C.1 4.4 0 5.2 0 6.1s.1 1.7.4 2.5l2.3-1.8v-.4z" fill="#FBBC04"/>
          <path d="M6.7 2.4c1.1 0 2 .4 2.8 1.1l2.1-2.1C10.2.6 8.6 0 6.7 0 3.9 0 1.6 1.6.4 4l2.3 1.8c.6-1.7 2.1-3.4 4-3.4z" fill="#EA4335"/>
        </svg>
      )}
    </button>
  )
}

export function ExpressCheckout({ amount, currency = "USD", onSuccess, onError, className }: ExpressCheckoutProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Smartphone className="h-5 w-5" />
          Express Checkout
        </CardTitle>
        <CardDescription>Pay quickly with your saved payment methods</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <ApplePayButton 
          amount={amount} 
          currency={currency}
          onSuccess={(paymentId) => onSuccess("apple_pay", paymentId)} 
          onError={onError} 
        />
        <GooglePayButton 
          amount={amount} 
          currency={currency}
          onSuccess={(paymentId) => onSuccess("google_pay", paymentId)} 
          onError={onError} 
        />
        
        <div className="flex items-center gap-3 pt-2">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">or pay with card</span>
          <Separator className="flex-1" />
        </div>

        <div className="flex items-center justify-center gap-2 pt-1 text-xs text-muted-foreground">
          <Shield className="h-3 w-3" />
          <span>Secured by Stripe</span>
        </div>
      </CardContent>
    </Card>
  )
}

// Types for Google Pay
declare global {
  namespace google.payments.api {
    interface PaymentsClient {
      isReadyToPay(request: IsReadyToPayRequest): Promise<IsReadyToPayResponse>
      loadPaymentData(request: PaymentDataRequest): Promise<PaymentData>
    }
    interface IsReadyToPayRequest {
      apiVersion: number
      apiVersionMinor: number
      allowedPaymentMethods: PaymentMethod[]
    }
    interface IsReadyToPayResponse {
      result: boolean
    }
    interface PaymentDataRequest {
      apiVersion: number
      apiVersionMinor: number
      allowedPaymentMethods: PaymentMethod[]
      merchantInfo: MerchantInfo
      transactionInfo: TransactionInfo
    }
    interface PaymentMethod {
      type: string
      parameters: {
        allowedAuthMethods: string[]
        allowedCardNetworks: string[]
      }
      tokenizationSpecification?: {
        type: string
        parameters: Record<string, string>
      }
    }
    interface MerchantInfo {
      merchantId: string
      merchantName: string
    }
    interface TransactionInfo {
      totalPriceStatus: string
      totalPrice: string
      currencyCode: string
      countryCode: string
    }
    interface PaymentData {
      paymentMethodData: {
        tokenizationData: {
          token: string
        }
      }
    }
  }
  interface Window {
    ApplePaySession: typeof ApplePaySession
  }
}
