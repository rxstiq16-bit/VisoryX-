"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Link2, CheckCircle, ExternalLink, RefreshCw, Bell, CalendarDays } from "lucide-react"

interface CalendarConnection {
  id: string
  provider: "google" | "outlook" | "apple"
  email: string
  connected: boolean
  lastSync?: Date
  syncEnabled: boolean
}

interface CalendarSettings {
  addDeadlines: boolean
  addMilestones: boolean
  addMeetings: boolean
  reminderTime: string
  calendarId: string
}

const providerLogos = {
  google: (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  ),
  outlook: (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <path fill="#0078D4" d="M24 7.387v10.478c0 .23-.08.424-.238.576-.158.152-.353.228-.584.228h-8.234v-6.182l1.602 1.172a.492.492 0 00.294.092.472.472 0 00.294-.092.39.39 0 00.147-.36V7.387H24z"/>
      <path fill="#0078D4" d="M17.281 6.182v5.912a.39.39 0 01-.147.36.472.472 0 01-.294.092.492.492 0 01-.294-.092l-1.602-1.172v6.182H7.71a.816.816 0 01-.584-.228.776.776 0 01-.238-.576V7.387h10.392z"/>
      <path fill="#0078D4" d="M0 6.182c0-.23.08-.424.238-.576A.816.816 0 01.822 5.38h5.883v12.084H.822a.816.816 0 01-.584-.228A.776.776 0 010 16.66V6.182z"/>
      <path fill="#28A8EA" d="M6.705 5.38H.822a.816.816 0 00-.584.228A.776.776 0 000 6.182v10.478c0 .23.08.424.238.576.158.152.353.228.584.228h5.883V5.38z"/>
    </svg>
  ),
  apple: (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  ),
}

export function CalendarIntegration() {
  const [connections, setConnections] = useState<CalendarConnection[]>([
    { id: "1", provider: "google", email: "", connected: false, syncEnabled: true },
    { id: "2", provider: "outlook", email: "", connected: false, syncEnabled: true },
    { id: "3", provider: "apple", email: "", connected: false, syncEnabled: true },
  ])

  const [settings, setSettings] = useState<CalendarSettings>({
    addDeadlines: true,
    addMilestones: true,
    addMeetings: true,
    reminderTime: "1day",
    calendarId: "primary",
  })

  const connectCalendar = (provider: string) => {
    // In production, redirect to OAuth flow
    const mockEmail = provider === "google" ? "user@gmail.com" : 
                      provider === "outlook" ? "user@outlook.com" : 
                      "user@icloud.com"
    
    setConnections(prev => prev.map(c =>
      c.provider === provider
        ? { ...c, connected: true, email: mockEmail, lastSync: new Date() }
        : c
    ))
  }

  const disconnectCalendar = (provider: string) => {
    setConnections(prev => prev.map(c =>
      c.provider === provider
        ? { ...c, connected: false, email: "" }
        : c
    ))
  }

  const connectedCalendar = connections.find(c => c.connected)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Calendar Integration
          </CardTitle>
          <CardDescription>
            Sync your order deadlines and milestones with your calendar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Connection Options */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Connect Your Calendar</h3>
            <div className="grid gap-3">
              {connections.map(connection => (
                <div
                  key={connection.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    connection.connected ? "border-primary/50 bg-primary/5" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {providerLogos[connection.provider]}
                    <div>
                      <p className="font-medium capitalize">
                        {connection.provider === "google" ? "Google Calendar" :
                         connection.provider === "outlook" ? "Microsoft Outlook" :
                         "Apple Calendar"}
                      </p>
                      {connection.connected && (
                        <p className="text-sm text-muted-foreground">{connection.email}</p>
                      )}
                    </div>
                    {connection.connected && (
                      <Badge variant="secondary" className="ml-2">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                    )}
                  </div>
                  {connection.connected ? (
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Sync Now
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => disconnectCalendar(connection.provider)}
                      >
                        Disconnect
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => connectCalendar(connection.provider)}
                    >
                      <Link2 className="h-4 w-4 mr-2" />
                      Connect
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sync Settings */}
          {connectedCalendar && (
            <>
              <hr />
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Sync Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Add Order Deadlines</Label>
                      <p className="text-sm text-muted-foreground">
                        Create calendar events for order due dates
                      </p>
                    </div>
                    <Switch
                      checked={settings.addDeadlines}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, addDeadlines: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Add Milestones</Label>
                      <p className="text-sm text-muted-foreground">
                        Create events for project milestones
                      </p>
                    </div>
                    <Switch
                      checked={settings.addMilestones}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, addMilestones: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Add Meetings</Label>
                      <p className="text-sm text-muted-foreground">
                        Sync scheduled video calls and consultations
                      </p>
                    </div>
                    <Switch
                      checked={settings.addMeetings}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, addMeetings: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Default Reminder</Label>
                      <p className="text-sm text-muted-foreground">
                        When to receive reminders before events
                      </p>
                    </div>
                    <Select
                      value={settings.reminderTime}
                      onValueChange={(value) => setSettings(prev => ({ ...prev, reminderTime: value }))}
                    >
                      <SelectTrigger className="w-[180px]">
                        <Bell className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15min">15 minutes before</SelectItem>
                        <SelectItem value="30min">30 minutes before</SelectItem>
                        <SelectItem value="1hour">1 hour before</SelectItem>
                        <SelectItem value="1day">1 day before</SelectItem>
                        <SelectItem value="2days">2 days before</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Add to Calendar Button Component */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Quick Add
          </CardTitle>
          <CardDescription>
            Add specific events to your calendar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Add Current Order Deadline
            </Button>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Add All Active Deadlines
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
