"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Monitor, Smartphone, Tablet, Globe, MapPin, Clock, LogOut, Shield, AlertTriangle, CheckCircle } from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"

interface Session {
  id: string
  deviceType: "desktop" | "mobile" | "tablet"
  browser: string
  os: string
  ipAddress: string
  location: string
  lastActive: Date
  createdAt: Date
  isCurrent: boolean
}

const deviceIcons = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
}

const mockSessions: Session[] = [
  {
    id: "1",
    deviceType: "desktop",
    browser: "Chrome 120",
    os: "Windows 11",
    ipAddress: "192.168.1.1",
    location: "New York, US",
    lastActive: new Date(),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    isCurrent: true,
  },
  {
    id: "2",
    deviceType: "mobile",
    browser: "Safari 17",
    os: "iOS 17",
    ipAddress: "10.0.0.1",
    location: "Los Angeles, US",
    lastActive: new Date(Date.now() - 3600000),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    isCurrent: false,
  },
  {
    id: "3",
    deviceType: "tablet",
    browser: "Firefox 120",
    os: "iPadOS 17",
    ipAddress: "172.16.0.1",
    location: "Chicago, US",
    lastActive: new Date(Date.now() - 86400000),
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    isCurrent: false,
  },
]

export function SessionManagement() {
  const [sessions, setSessions] = useState<Session[]>(mockSessions)
  const [revokeAllDialogOpen, setRevokeAllDialogOpen] = useState(false)
  const [revokingAll, setRevokingAll] = useState(false)

  const revokeSession = async (sessionId: string) => {
    // In production, call API to revoke session
    setSessions(prev => prev.filter(s => s.id !== sessionId))
  }

  const revokeAllOtherSessions = async () => {
    setRevokingAll(true)
    // Simulate API call
    await new Promise(r => setTimeout(r, 1000))
    setSessions(prev => prev.filter(s => s.isCurrent))
    setRevokingAll(false)
    setRevokeAllDialogOpen(false)
  }

  const otherSessionCount = sessions.filter(s => !s.isCurrent).length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Active Sessions
            </CardTitle>
            <CardDescription>
              Manage devices that are logged into your account
            </CardDescription>
          </div>
          {otherSessionCount > 0 && (
            <Dialog open={revokeAllDialogOpen} onOpenChange={setRevokeAllDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out All Other Devices
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Sign Out All Other Devices?</DialogTitle>
                  <DialogDescription>
                    This will sign out {otherSessionCount} other {otherSessionCount === 1 ? "device" : "devices"}. You will remain signed in on this device.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setRevokeAllDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={revokeAllOtherSessions} disabled={revokingAll}>
                    {revokingAll ? "Signing Out..." : "Sign Out All"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {sessions.map(session => {
          const DeviceIcon = deviceIcons[session.deviceType]
          return (
            <div
              key={session.id}
              className={`flex items-start justify-between p-4 rounded-lg border ${
                session.isCurrent ? "border-primary/50 bg-primary/5" : ""
              }`}
            >
              <div className="flex gap-4">
                <div className={`p-2 rounded-lg ${session.isCurrent ? "bg-primary/10" : "bg-muted"}`}>
                  <DeviceIcon className={`h-6 w-6 ${session.isCurrent ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {session.browser} on {session.os}
                    </span>
                    {session.isCurrent && (
                      <Badge variant="secondary" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Current Session
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {session.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {session.ipAddress}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Active {formatDistanceToNow(session.lastActive, { addSuffix: true })}
                    </span>
                    <span>
                      Signed in {format(session.createdAt, "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              </div>
              {!session.isCurrent && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => revokeSession(session.id)}
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign Out
                </Button>
              )}
            </div>
          )
        })}

        {sessions.some(s => !s.isCurrent && new Date().getTime() - s.lastActive.getTime() > 7 * 24 * 60 * 60 * 1000) && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You have sessions that haven't been active in over a week. Consider signing them out for security.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
