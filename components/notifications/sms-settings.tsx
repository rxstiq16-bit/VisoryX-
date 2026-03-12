"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Phone, Check, Loader2, Shield, MessageSquare, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface SMSSettingsProps {
  phoneNumber?: string
  isVerified?: boolean
  settings?: {
    orderUpdates: boolean
    deliveryNotifications: boolean
    paymentAlerts: boolean
    promotions: boolean
    securityAlerts: boolean
  }
  className?: string
}

export function SMSSettings({
  phoneNumber: initialPhone = "",
  isVerified: initialVerified = false,
  settings: initialSettings,
  className,
}: SMSSettingsProps) {
  const [phoneNumber, setPhoneNumber] = useState(initialPhone)
  const [isVerified, setIsVerified] = useState(initialVerified)
  const [verificationCode, setVerificationCode] = useState("")
  const [showVerification, setShowVerification] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [settings, setSettings] = useState(initialSettings || {
    orderUpdates: true,
    deliveryNotifications: true,
    paymentAlerts: true,
    promotions: false,
    securityAlerts: true,
  })

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "")
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/)
    if (match) {
      const parts = [match[1], match[2], match[3]].filter(Boolean)
      if (parts.length === 0) return ""
      if (parts.length === 1) return parts[0]
      if (parts.length === 2) return `(${parts[0]}) ${parts[1]}`
      return `(${parts[0]}) ${parts[1]}-${parts[2]}`
    }
    return value
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhoneNumber(formatted)
    if (isVerified) setIsVerified(false)
  }

  const sendVerificationCode = async () => {
    setIsSending(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setShowVerification(true)
    } finally {
      setIsSending(false)
    }
  }

  const verifyCode = async () => {
    setIsLoading(true)
    try {
      // Simulate verification
      await new Promise(resolve => setTimeout(resolve, 1500))
      if (verificationCode === "123456" || verificationCode.length === 6) {
        setIsVerified(true)
        setShowVerification(false)
        setVerificationCode("")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const updateSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const notificationTypes = [
    {
      key: "orderUpdates" as const,
      label: "Order Updates",
      description: "Status changes, designer assignments, and progress updates",
      icon: MessageSquare,
    },
    {
      key: "deliveryNotifications" as const,
      label: "Delivery Notifications",
      description: "Get notified when your files are ready for download",
      icon: Check,
    },
    {
      key: "paymentAlerts" as const,
      label: "Payment Alerts",
      description: "Payment confirmations and billing notifications",
      icon: Shield,
    },
    {
      key: "securityAlerts" as const,
      label: "Security Alerts",
      description: "Login attempts and account security notifications",
      icon: Shield,
      recommended: true,
    },
    {
      key: "promotions" as const,
      label: "Promotions & Offers",
      description: "Special deals, discounts, and new service announcements",
      icon: MessageSquare,
      optional: true,
    },
  ]

  return (
    <div className={cn("space-y-6", className)}>
      {/* Phone Number Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Phone Number
          </CardTitle>
          <CardDescription>
            Add your phone number to receive SMS notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 space-y-2">
              <Label htmlFor="phone">Mobile Number</Label>
              <div className="flex gap-2">
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  className="flex-1"
                />
                {isVerified ? (
                  <Badge className="h-10 gap-1 bg-green-500">
                    <Check className="h-3 w-3" />
                    Verified
                  </Badge>
                ) : (
                  <Button
                    onClick={sendVerificationCode}
                    disabled={phoneNumber.length < 14 || isSending}
                  >
                    {isSending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Verify"
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {showVerification && (
            <div className="space-y-2 rounded-lg border bg-muted/30 p-4">
              <Label htmlFor="code">Verification Code</Label>
              <p className="text-sm text-muted-foreground">
                Enter the 6-digit code sent to {phoneNumber}
              </p>
              <div className="flex gap-2">
                <Input
                  id="code"
                  placeholder="123456"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="w-32 font-mono tracking-widest"
                  maxLength={6}
                />
                <Button onClick={verifyCode} disabled={verificationCode.length !== 6 || isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm"}
                </Button>
              </div>
              <Button variant="link" className="h-auto p-0 text-xs" onClick={sendVerificationCode}>
                Resend code
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>SMS Notification Preferences</CardTitle>
          <CardDescription>
            Choose which notifications you want to receive via SMS
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isVerified && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Verify your phone number above to enable SMS notifications
              </AlertDescription>
            </Alert>
          )}

          {notificationTypes.map((type) => (
            <div
              key={type.key}
              className={cn(
                "flex items-center justify-between rounded-lg border p-4",
                !isVerified && "opacity-50"
              )}
            >
              <div className="flex items-start gap-3">
                <type.icon className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{type.label}</p>
                    {type.recommended && (
                      <Badge variant="secondary" className="text-xs">Recommended</Badge>
                    )}
                    {type.optional && (
                      <Badge variant="outline" className="text-xs">Optional</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </div>
              </div>
              <Switch
                checked={settings[type.key]}
                onCheckedChange={() => updateSetting(type.key)}
                disabled={!isVerified}
              />
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <p className="text-sm text-muted-foreground">
            Standard messaging rates may apply
          </p>
          <Button disabled={!isVerified}>Save Preferences</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
