"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  ShoppingBag, 
  CreditCard, 
  Star, 
  Gift,
  Megaphone,
  Loader2,
  CheckCircle
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Breadcrumbs } from "@/components/breadcrumbs"

interface NotificationSettings {
  // Email notifications
  email_order_updates: boolean
  email_order_completed: boolean
  email_messages: boolean
  email_reviews: boolean
  email_promotions: boolean
  email_newsletter: boolean
  // Push notifications
  push_order_updates: boolean
  push_messages: boolean
  push_reminders: boolean
  // Discord notifications
  discord_order_updates: boolean
  discord_messages: boolean
  discord_promotions: boolean
}

const defaultSettings: NotificationSettings = {
  email_order_updates: true,
  email_order_completed: true,
  email_messages: true,
  email_reviews: true,
  email_promotions: false,
  email_newsletter: true,
  push_order_updates: true,
  push_messages: true,
  push_reminders: true,
  discord_order_updates: true,
  discord_messages: true,
  discord_promotions: false,
}

export default function NotificationSettingsPage() {
  const { user } = useAuth()
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const saveSettings = async () => {
    setSaving(true)
    // In production, this would save to the database
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const notificationGroups = [
    {
      title: "Email Notifications",
      icon: Mail,
      description: "Control what emails you receive from VisoryX",
      settings: [
        { key: "email_order_updates" as const, label: "Order Updates", description: "Status changes, designer assignments" },
        { key: "email_order_completed" as const, label: "Order Completed", description: "When your order is ready for download" },
        { key: "email_messages" as const, label: "New Messages", description: "Messages from designers or support" },
        { key: "email_reviews" as const, label: "Review Requests", description: "Reminders to leave reviews" },
        { key: "email_promotions" as const, label: "Promotions & Offers", description: "Sales, discounts, and special offers" },
        { key: "email_newsletter" as const, label: "Newsletter", description: "Updates, tips, and design inspiration" },
      ],
    },
    {
      title: "Push Notifications",
      icon: Bell,
      description: "Browser and mobile push notifications",
      settings: [
        { key: "push_order_updates" as const, label: "Order Updates", description: "Real-time status notifications" },
        { key: "push_messages" as const, label: "New Messages", description: "Instant message alerts" },
        { key: "push_reminders" as const, label: "Reminders", description: "Pending actions and deadlines" },
      ],
    },
    {
      title: "Discord Notifications",
      icon: MessageSquare,
      description: "Notifications via Discord DMs (requires linked account)",
      settings: [
        { key: "discord_order_updates" as const, label: "Order Updates", description: "Status changes via Discord" },
        { key: "discord_messages" as const, label: "New Messages", description: "Message alerts via Discord" },
        { key: "discord_promotions" as const, label: "Promotions", description: "Exclusive Discord offers" },
      ],
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1 py-8">
        <div className="container max-w-3xl">
          <Breadcrumbs />
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Notification Settings</h1>
            <p className="mt-2 text-muted-foreground">
              Choose how and when you want to be notified
            </p>
          </div>

          <div className="space-y-6">
            {notificationGroups.map((group) => (
              <Card key={group.title}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <group.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{group.title}</CardTitle>
                      <CardDescription>{group.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {group.settings.map((setting, index) => (
                    <div key={setting.key}>
                      {index > 0 && <Separator className="my-4" />}
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor={setting.key} className="text-base">
                            {setting.label}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {setting.description}
                          </p>
                        </div>
                        <Switch
                          id={setting.key}
                          checked={settings[setting.key]}
                          onCheckedChange={(checked) => updateSetting(setting.key, checked)}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Save Button */}
          <div className="mt-8 flex items-center justify-end gap-4">
            {saved && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                Settings saved
              </div>
            )}
            <Button onClick={saveSettings} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
