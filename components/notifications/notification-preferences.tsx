"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Bell, Mail, MessageSquare, Smartphone, BellOff, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { usePushNotifications } from "@/hooks/use-push-notifications"
import { cn } from "@/lib/utils"

interface NotificationChannel {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  enabled: boolean
  requiresSetup?: boolean
  isSetup?: boolean
}

interface NotificationType {
  id: string
  name: string
  description: string
  email: boolean
  push: boolean
  sms: boolean
}

interface NotificationPreferencesProps {
  phoneNumber?: string
  onSave?: (preferences: {
    channels: Record<string, boolean>
    types: Record<string, { email: boolean; push: boolean; sms: boolean }>
    phoneNumber?: string
  }) => void
  className?: string
}

export function NotificationPreferences({ phoneNumber: initialPhone, onSave, className }: NotificationPreferencesProps) {
  const { isSupported, isSubscribed, isLoading: pushLoading, subscribe, unsubscribe, permission } = usePushNotifications()
  const [isSaving, setIsSaving] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState(initialPhone || "")
  
  const [channels, setChannels] = useState<NotificationChannel[]>([
    {
      id: "email",
      name: "Email",
      description: "Receive notifications via email",
      icon: <Mail className="h-5 w-5" />,
      enabled: true,
    },
    {
      id: "push",
      name: "Push Notifications",
      description: "Browser notifications when you're online",
      icon: <Bell className="h-5 w-5" />,
      enabled: isSubscribed,
      requiresSetup: true,
      isSetup: isSubscribed,
    },
    {
      id: "sms",
      name: "SMS",
      description: "Text messages for important updates",
      icon: <Smartphone className="h-5 w-5" />,
      enabled: !!initialPhone,
      requiresSetup: true,
      isSetup: !!initialPhone,
    },
    {
      id: "discord",
      name: "Discord",
      description: "DMs through our Discord bot",
      icon: <MessageSquare className="h-5 w-5" />,
      enabled: false,
      requiresSetup: true,
      isSetup: false,
    },
  ])

  const [notificationTypes, setNotificationTypes] = useState<NotificationType[]>([
    {
      id: "order_updates",
      name: "Order Updates",
      description: "Status changes, delivery notifications",
      email: true,
      push: true,
      sms: true,
    },
    {
      id: "messages",
      name: "Messages",
      description: "New messages from designers",
      email: true,
      push: true,
      sms: false,
    },
    {
      id: "reviews",
      name: "Review Requests",
      description: "When designs are ready for review",
      email: true,
      push: true,
      sms: true,
    },
    {
      id: "payments",
      name: "Payment & Billing",
      description: "Receipts, invoices, payment issues",
      email: true,
      push: false,
      sms: false,
    },
    {
      id: "promotions",
      name: "Promotions & Offers",
      description: "Discounts, sales, special offers",
      email: true,
      push: false,
      sms: false,
    },
    {
      id: "achievements",
      name: "Achievements & Rewards",
      description: "Points earned, badges unlocked",
      email: false,
      push: true,
      sms: false,
    },
  ])

  const handleChannelToggle = async (channelId: string) => {
    const channel = channels.find(c => c.id === channelId)
    if (!channel) return

    if (channelId === "push") {
      if (channel.enabled) {
        await unsubscribe()
        setChannels(prev => prev.map(c => 
          c.id === channelId ? { ...c, enabled: false, isSetup: false } : c
        ))
      } else {
        const success = await subscribe()
        if (success) {
          setChannels(prev => prev.map(c => 
            c.id === channelId ? { ...c, enabled: true, isSetup: true } : c
          ))
        }
      }
    } else {
      setChannels(prev => prev.map(c => 
        c.id === channelId ? { ...c, enabled: !c.enabled } : c
      ))
    }
  }

  const handleTypeToggle = (typeId: string, channel: "email" | "push" | "sms") => {
    setNotificationTypes(prev => prev.map(t => 
      t.id === typeId ? { ...t, [channel]: !t[channel] } : t
    ))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const channelPrefs = Object.fromEntries(channels.map(c => [c.id, c.enabled]))
      const typePrefs = Object.fromEntries(notificationTypes.map(t => [t.id, {
        email: t.email,
        push: t.push,
        sms: t.sms,
      }]))
      
      await onSave?.({
        channels: channelPrefs,
        types: typePrefs,
        phoneNumber: phoneNumber || undefined,
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Notification Channels */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Notification Channels</CardTitle>
          <CardDescription>Choose how you want to receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {channels.map((channel) => (
            <div
              key={channel.id}
              className={cn(
                "flex items-center justify-between p-4 rounded-lg border",
                channel.enabled ? "bg-primary/5 border-primary/20" : ""
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-2 rounded-lg",
                  channel.enabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                )}>
                  {channel.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Label className="font-medium">{channel.name}</Label>
                    {channel.requiresSetup && !channel.isSetup && (
                      <Badge variant="outline" className="text-xs">Setup Required</Badge>
                    )}
                    {channel.id === "push" && !isSupported && (
                      <Badge variant="outline" className="text-xs text-muted-foreground">Not Supported</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{channel.description}</p>
                </div>
              </div>
              <Switch
                checked={channel.enabled}
                onCheckedChange={() => handleChannelToggle(channel.id)}
                disabled={
                  (channel.id === "push" && (!isSupported || pushLoading)) ||
                  (channel.id === "sms" && !phoneNumber)
                }
              />
            </div>
          ))}

          {/* Phone Number Setup */}
          <div className="p-4 rounded-lg border bg-muted/50">
            <Label className="text-sm font-medium">Phone Number (for SMS)</Label>
            <div className="flex gap-2 mt-2">
              <Input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="max-w-xs"
              />
              {phoneNumber && (
                <Badge variant="outline" className="gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Ready
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Standard messaging rates may apply
            </p>
          </div>

          {/* Push Permission Warning */}
          {isSupported && permission === "denied" && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 text-amber-900 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>Push notifications are blocked. Enable them in your browser settings.</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Types */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Notification Types</CardTitle>
          <CardDescription>Choose what notifications you want to receive on each channel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 pb-3 text-sm font-medium text-muted-foreground">
            <div>Type</div>
            <div className="text-center">Email</div>
            <div className="text-center">Push</div>
            <div className="text-center">SMS</div>
          </div>
          <Separator className="mb-4" />
          <div className="space-y-4">
            {notificationTypes.map((type) => (
              <div key={type.id} className="grid grid-cols-4 gap-4 items-center">
                <div>
                  <p className="font-medium text-sm">{type.name}</p>
                  <p className="text-xs text-muted-foreground">{type.description}</p>
                </div>
                <div className="flex justify-center">
                  <Switch
                    checked={type.email}
                    onCheckedChange={() => handleTypeToggle(type.id, "email")}
                    disabled={!channels.find(c => c.id === "email")?.enabled}
                  />
                </div>
                <div className="flex justify-center">
                  <Switch
                    checked={type.push}
                    onCheckedChange={() => handleTypeToggle(type.id, "push")}
                    disabled={!isSubscribed}
                  />
                </div>
                <div className="flex justify-center">
                  <Switch
                    checked={type.sms}
                    onCheckedChange={() => handleTypeToggle(type.id, "sms")}
                    disabled={!phoneNumber || !channels.find(c => c.id === "sms")?.enabled}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Preferences"
          )}
        </Button>
      </div>
    </div>
  )
}
