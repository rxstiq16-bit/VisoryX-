"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Shield,
  Flag,
  GraduationCap,
  GitBranch,
  Layout,
  User,
  Link2,
  Eye,
  EyeOff,
  AlertTriangle,
  Upload,
  Plus,
  Trash2,
  Save,
} from "lucide-react"
import { toast } from "sonner"

// Privacy Controls Component
export function PrivacyControls() {
  const [settings, setSettings] = useState({
    profileVisible: true,
    showOrderHistory: false,
    allowPortfolioUse: true,
    anonymizeReviews: false,
    dataRetentionDays: 365,
  })

  const handleSave = () => {
    toast.success("Privacy settings updated")
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle>Privacy Controls</CardTitle>
        </div>
        <CardDescription>
          Manage your privacy settings and data preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Profile Visibility</Label>
            <p className="text-xs text-muted-foreground">
              Allow others to view your profile
            </p>
          </div>
          <Switch
            checked={settings.profileVisible}
            onCheckedChange={(checked) =>
              setSettings((s) => ({ ...s, profileVisible: checked }))
            }
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Order History</Label>
            <p className="text-xs text-muted-foreground">
              Show order history on your profile
            </p>
          </div>
          <Switch
            checked={settings.showOrderHistory}
            onCheckedChange={(checked) =>
              setSettings((s) => ({ ...s, showOrderHistory: checked }))
            }
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Portfolio Use</Label>
            <p className="text-xs text-muted-foreground">
              Allow designs to be used in designer portfolios
            </p>
          </div>
          <Switch
            checked={settings.allowPortfolioUse}
            onCheckedChange={(checked) =>
              setSettings((s) => ({ ...s, allowPortfolioUse: checked }))
            }
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Anonymous Reviews</Label>
            <p className="text-xs text-muted-foreground">
              Hide your name from public reviews
            </p>
          </div>
          <Switch
            checked={settings.anonymizeReviews}
            onCheckedChange={(checked) =>
              setSettings((s) => ({ ...s, anonymizeReviews: checked }))
            }
          />
        </div>

        <Button onClick={handleSave} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </CardContent>
    </Card>
  )
}

// DMCA System Component
export function DMCASystem() {
  const [formData, setFormData] = useState({
    contentUrl: "",
    description: "",
    originalWorkUrl: "",
    declaration: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("DMCA claim submitted for review")
    setFormData({
      contentUrl: "",
      description: "",
      originalWorkUrl: "",
      declaration: false,
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Flag className="h-5 w-5 text-destructive" />
          <CardTitle>DMCA Takedown Request</CardTitle>
        </div>
        <CardDescription>
          Report copyright infringement on our platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content-url">Infringing Content URL</Label>
            <Input
              id="content-url"
              placeholder="https://..."
              value={formData.contentUrl}
              onChange={(e) =>
                setFormData((f) => ({ ...f, contentUrl: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="original-url">Original Work URL</Label>
            <Input
              id="original-url"
              placeholder="Link to your original work"
              value={formData.originalWorkUrl}
              onChange={(e) =>
                setFormData((f) => ({ ...f, originalWorkUrl: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the infringement..."
              value={formData.description}
              onChange={(e) =>
                setFormData((f) => ({ ...f, description: e.target.value }))
              }
              rows={4}
              required
            />
          </div>

          <div className="flex items-start gap-2 p-3 bg-muted rounded-lg">
            <Switch
              checked={formData.declaration}
              onCheckedChange={(checked) =>
                setFormData((f) => ({ ...f, declaration: checked }))
              }
              id="declaration"
            />
            <Label htmlFor="declaration" className="text-xs text-muted-foreground leading-relaxed">
              I declare under penalty of perjury that I am the copyright owner or authorized
              to act on behalf of the owner, and that the information provided is accurate.
            </Label>
          </div>

          <Button type="submit" className="w-full" disabled={!formData.declaration}>
            Submit DMCA Request
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

// Staff Training Portal Component
export function StaffTrainingPortal() {
  const modules = [
    { id: 1, title: "Customer Communication", progress: 100, badge: "Completed" },
    { id: 2, title: "Design Quality Standards", progress: 75, badge: "In Progress" },
    { id: 3, title: "Rush Order Handling", progress: 0, badge: "Not Started" },
    { id: 4, title: "Revision Best Practices", progress: 50, badge: "In Progress" },
    { id: 5, title: "Copyright & Licensing", progress: 100, badge: "Completed" },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          <CardTitle>Training Portal</CardTitle>
        </div>
        <CardDescription>
          Complete training modules to improve your skills
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-3">
            {modules.map((module) => (
              <div
                key={module.id}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{module.title}</span>
                    <Badge
                      variant={
                        module.progress === 100
                          ? "default"
                          : module.progress > 0
                          ? "secondary"
                          : "outline"
                      }
                      className="text-[10px]"
                    >
                      {module.badge}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${module.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{module.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

// Version Control Component
export function VersionControl() {
  const versions = [
    { id: 1, version: "v3.2", date: "Today, 2:30 PM", author: "You", current: true },
    { id: 2, version: "v3.1", date: "Today, 11:00 AM", author: "Designer A", current: false },
    { id: 3, version: "v3.0", date: "Yesterday", author: "You", current: false },
    { id: 4, version: "v2.0", date: "2 days ago", author: "Designer B", current: false },
    { id: 5, version: "v1.0", date: "3 days ago", author: "You", current: false },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-primary" />
          <CardTitle>Version History</CardTitle>
        </div>
        <CardDescription>
          View and restore previous versions of your design
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[250px]">
          <div className="space-y-2">
            {versions.map((v) => (
              <div
                key={v.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  v.current ? "border-primary bg-primary/5" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <GitBranch className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{v.version}</span>
                      {v.current && (
                        <Badge variant="default" className="text-[10px]">
                          Current
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {v.author} • {v.date}
                    </p>
                  </div>
                </div>
                {!v.current && (
                  <Button variant="ghost" size="sm">
                    Restore
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

// Template Builder Component
export function TemplateBuilder() {
  const [templateName, setTemplateName] = useState("")

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Layout className="h-5 w-5 text-primary" />
          <CardTitle>Template Builder</CardTitle>
        </div>
        <CardDescription>
          Create reusable templates for common design requests
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Template Name</Label>
          <Input
            placeholder="e.g., Team Logo Standard"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Template Fields</Label>
          <div className="space-y-2">
            {["Team Name", "Primary Color", "Mascot Type"].map((field) => (
              <div
                key={field}
                className="flex items-center justify-between p-2 border rounded-md"
              >
                <span className="text-sm">{field}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full">
              <Plus className="h-3 w-3 mr-2" />
              Add Field
            </Button>
          </div>
        </div>

        <Button className="w-full">
          <Save className="h-4 w-4 mr-2" />
          Save Template
        </Button>
      </CardContent>
    </Card>
  )
}

// Designer Portfolio Builder Component
export function DesignerPortfolioBuilder() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          <CardTitle>Portfolio Builder</CardTitle>
        </div>
        <CardDescription>
          Showcase your best work to attract clients
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="aspect-square bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors cursor-pointer"
            >
              <Plus className="h-6 w-6 text-muted-foreground/50" />
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full">
          <Upload className="h-4 w-4 mr-2" />
          Upload Work
        </Button>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Add up to 12 portfolio items
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// Order Dependencies Component
export function OrderDependencies() {
  const dependencies = [
    { id: 1, name: "Logo Design", status: "completed", required: true },
    { id: 2, name: "Color Palette", status: "completed", required: true },
    { id: 3, name: "Brand Guidelines", status: "pending", required: false },
    { id: 4, name: "Typography Selection", status: "in_progress", required: true },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Link2 className="h-5 w-5 text-primary" />
          <CardTitle>Order Dependencies</CardTitle>
        </div>
        <CardDescription>
          Tasks that need to be completed before this order can proceed
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {dependencies.map((dep) => (
            <div
              key={dep.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-2 w-2 rounded-full ${
                    dep.status === "completed"
                      ? "bg-green-500"
                      : dep.status === "in_progress"
                      ? "bg-amber-500"
                      : "bg-gray-300"
                  }`}
                />
                <span className="text-sm">{dep.name}</span>
                {dep.required && (
                  <Badge variant="destructive" className="text-[10px]">
                    Required
                  </Badge>
                )}
              </div>
              <Badge
                variant={
                  dep.status === "completed"
                    ? "default"
                    : dep.status === "in_progress"
                    ? "secondary"
                    : "outline"
                }
                className="capitalize text-xs"
              >
                {dep.status.replace("_", " ")}
              </Badge>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            1 required dependency is still in progress. This order cannot be completed
            until all required dependencies are finished.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
