"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Cookie, X, Settings, Check } from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

const COOKIE_CONSENT_KEY = "visoryx-cookie-consent"

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  preferences: boolean
}

const defaultPreferences: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  preferences: false,
}

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences)

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!stored) {
      // Delay showing the banner for better UX
      const timer = setTimeout(() => setShowBanner(true), 2000)
      return () => clearTimeout(timer)
    } else {
      setPreferences(JSON.parse(stored))
    }
  }, [])

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(prefs))
    setPreferences(prefs)
    setShowBanner(false)
    setShowSettings(false)
  }

  const acceptAll = () => {
    savePreferences({
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    })
  }

  const acceptNecessary = () => {
    savePreferences(defaultPreferences)
  }

  if (!showBanner) return null

  return (
    <>
      <Card className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-2xl shadow-lg animate-in slide-in-from-bottom-4 duration-500">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-primary/10 p-2 shrink-0">
              <Cookie className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Cookie Preferences</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We use cookies to enhance your experience. By continuing to visit this site, 
                you agree to our use of cookies.{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Learn more
                </Link>
              </p>
              <div className="flex flex-wrap gap-2">
                <Button onClick={acceptAll} size="sm">
                  Accept All
                </Button>
                <Button onClick={acceptNecessary} variant="outline" size="sm">
                  Necessary Only
                </Button>
                <Button 
                  onClick={() => setShowSettings(true)} 
                  variant="ghost" 
                  size="sm"
                  className="gap-1"
                >
                  <Settings className="h-4 w-4" />
                  Customize
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 -mt-1 -mr-1"
              onClick={() => setShowBanner(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Cookie Settings</DialogTitle>
            <DialogDescription>
              Manage your cookie preferences. You can change these settings at any time.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-medium">Necessary Cookies</Label>
                <p className="text-sm text-muted-foreground">
                  Required for the website to function properly.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                <span className="text-sm text-muted-foreground">Always on</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-medium">Analytics Cookies</Label>
                <p className="text-sm text-muted-foreground">
                  Help us understand how visitors interact with our site.
                </p>
              </div>
              <Switch
                checked={preferences.analytics}
                onCheckedChange={(checked) => 
                  setPreferences(prev => ({ ...prev, analytics: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-medium">Marketing Cookies</Label>
                <p className="text-sm text-muted-foreground">
                  Used to deliver personalized advertisements.
                </p>
              </div>
              <Switch
                checked={preferences.marketing}
                onCheckedChange={(checked) => 
                  setPreferences(prev => ({ ...prev, marketing: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-medium">Preference Cookies</Label>
                <p className="text-sm text-muted-foreground">
                  Remember your settings and preferences.
                </p>
              </div>
              <Switch
                checked={preferences.preferences}
                onCheckedChange={(checked) => 
                  setPreferences(prev => ({ ...prev, preferences: checked }))
                }
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => savePreferences(preferences)} className="flex-1">
              Save Preferences
            </Button>
            <Button onClick={acceptAll} variant="outline">
              Accept All
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
