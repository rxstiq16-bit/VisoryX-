"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Briefcase,
  Mail,
  Database,
  Upload,
  Send,
  Save,
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  FileText,
  Download,
  RefreshCw,
  Settings,
  Shield,
} from "lucide-react"
import { toast } from "sonner"

// Application System Component
export function ApplicationSystem() {
  const [formData, setFormData] = useState({
    position: "",
    name: "",
    email: "",
    portfolio: "",
    experience: "",
    motivation: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    toast.success("Application submitted successfully!")
  }

  if (submitted) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Application Received!</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Thank you for your interest in joining our team. We'll review your application and
            get back to you within 3-5 business days.
          </p>
          <Button variant="outline" className="mt-6" onClick={() => setSubmitted(false)}>
            Submit Another Application
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          <CardTitle>Join Our Team</CardTitle>
        </div>
        <CardDescription>
          Apply to become a designer at Stylar Studios
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Select
              value={formData.position}
              onValueChange={(value) => setFormData((f) => ({ ...f, position: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="designer">Designer</SelectItem>
                <SelectItem value="senior_designer">Senior Designer</SelectItem>
                <SelectItem value="animator">Animator</SelectItem>
                <SelectItem value="3d_artist">3D Artist</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="portfolio">Portfolio URL</Label>
            <Input
              id="portfolio"
              placeholder="https://..."
              value={formData.portfolio}
              onChange={(e) => setFormData((f) => ({ ...f, portfolio: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Years of Experience</Label>
            <Select
              value={formData.experience}
              onValueChange={(value) => setFormData((f) => ({ ...f, experience: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-1">Less than 1 year</SelectItem>
                <SelectItem value="1-3">1-3 years</SelectItem>
                <SelectItem value="3-5">3-5 years</SelectItem>
                <SelectItem value="5+">5+ years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="motivation">Why do you want to join?</Label>
            <Textarea
              id="motivation"
              placeholder="Tell us about yourself and why you'd be a great fit..."
              value={formData.motivation}
              onChange={(e) => setFormData((f) => ({ ...f, motivation: e.target.value }))}
              rows={4}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            <Send className="h-4 w-4 mr-2" />
            Submit Application
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

// Email Marketing Campaigns Component
export function EmailMarketingCampaigns() {
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: "Summer Sale Announcement",
      status: "sent",
      sent: 1250,
      opened: 876,
      clicked: 234,
      date: "2 days ago",
    },
    {
      id: 2,
      name: "New Service Launch",
      status: "scheduled",
      sent: 0,
      opened: 0,
      clicked: 0,
      date: "Tomorrow, 10:00 AM",
    },
    {
      id: 3,
      name: "Customer Appreciation",
      status: "draft",
      sent: 0,
      opened: 0,
      clicked: 0,
      date: "-",
    },
    {
      id: 4,
      name: "Monthly Newsletter",
      status: "sent",
      sent: 1456,
      opened: 945,
      clicked: 312,
      date: "1 week ago",
    },
  ])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            <CardTitle>Email Campaigns</CardTitle>
          </div>
          <Button size="sm">
            <Send className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>
        <CardDescription>
          Manage and track your email marketing campaigns
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-3">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{campaign.name}</span>
                    <Badge
                      variant={
                        campaign.status === "sent"
                          ? "default"
                          : campaign.status === "scheduled"
                          ? "secondary"
                          : "outline"
                      }
                      className="capitalize text-[10px]"
                    >
                      {campaign.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{campaign.date}</p>
                </div>

                {campaign.status === "sent" && (
                  <div className="flex gap-4 text-center">
                    <div>
                      <p className="text-sm font-semibold">{campaign.sent}</p>
                      <p className="text-[10px] text-muted-foreground">Sent</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-emerald-500">
                        {Math.round((campaign.opened / campaign.sent) * 100)}%
                      </p>
                      <p className="text-[10px] text-muted-foreground">Opened</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-500">
                        {Math.round((campaign.clicked / campaign.sent) * 100)}%
                      </p>
                      <p className="text-[10px] text-muted-foreground">Clicked</p>
                    </div>
                  </div>
                )}

                {campaign.status !== "sent" && (
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

// Backup System Component
export function BackupSystem() {
  const [backups, setBackups] = useState([
    { id: 1, date: "Today, 3:00 AM", size: "2.4 GB", type: "Automatic", status: "completed" },
    { id: 2, date: "Yesterday, 3:00 AM", size: "2.3 GB", type: "Automatic", status: "completed" },
    { id: 3, date: "2 days ago", size: "2.3 GB", type: "Manual", status: "completed" },
    { id: 4, date: "3 days ago", size: "2.2 GB", type: "Automatic", status: "completed" },
  ])
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleManualBackup = () => {
    setIsBackingUp(true)
    setProgress(0)

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsBackingUp(false)
          toast.success("Backup completed successfully!")
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            <CardTitle>Backup System</CardTitle>
          </div>
          <Badge variant="secondary" className="gap-1">
            <Shield className="h-3 w-3" />
            Auto-backup enabled
          </Badge>
        </div>
        <CardDescription>
          Manage database backups and recovery
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isBackingUp && (
          <div className="p-4 border rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 mb-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span className="text-sm font-medium">Creating backup...</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleManualBackup}
            disabled={isBackingUp}
            className="flex-1"
          >
            <Upload className="h-4 w-4 mr-2" />
            Create Backup Now
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>

        <Separator />

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Recent Backups</h4>
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {backups.map((backup) => (
                <div
                  key={backup.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        backup.status === "completed" ? "bg-green-500" : "bg-amber-500"
                      }`}
                    />
                    <div>
                      <p className="text-sm font-medium">{backup.date}</p>
                      <p className="text-xs text-muted-foreground">
                        {backup.size} • {backup.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs font-medium">Next automatic backup</p>
              <p className="text-[10px] text-muted-foreground">Tomorrow at 3:00 AM</p>
            </div>
          </div>
          <Badge variant="outline" className="text-[10px]">
            Daily
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
